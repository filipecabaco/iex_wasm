// Guest-only controller. All host filesystem access remains in the browser folder UI.
import * as fs from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createBridge } from './bridge.mjs';
import { Dependencies } from './dependencies.mjs';
const MAX_BODY = 1 << 20, MAX_RESPONSE = 16 << 20;
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.wasm': 'application/wasm' };
const result = (status, data, headers = {}) => ({ status, headers, body: Buffer.from(data).toString('base64') });
function route(raw) {
  if (typeof raw !== 'string' || !raw.startsWith('/') || raw.startsWith('//') || raw.length > 8192) throw new Error('Invalid preview route');
  const [pathname] = raw.split('?');
  const names = pathname.slice(1).split('/').filter((part, i, all) => part || i !== all.length - 1).map(part => decodeURIComponent(part));
  if (names.some(part => !part || part === '.' || part === '..' || /[\\/\x00-\x1f\x7f]/.test(part))) throw new Error('Invalid preview path');
  return { names, pathname: '/' + names.join('/') };
}
async function boundedBody(response) {
  const chunks = []; let size = 0;
  for await (const chunk of response.body ?? []) {
    size += chunk.length;
    if (size > MAX_RESPONSE) throw new Error('Response too large (limit 16 MiB)');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
async function regularFile(root, names) {
  let target = root;
  for (const name of ['', ...names]) {
    target = path.join(target, name);
    const stat = await fs.lstat(target).catch(e => { if (e.code === 'ENOENT') return null; throw e; });
    if (!stat) return null;
    if (stat.isSymbolicLink()) throw new Error('Preview path cannot contain a symlink');
  }
  const stat = await fs.stat(target);
  if (!stat.isFile()) return null;
  if (stat.size > MAX_RESPONSE) throw new Error('Response too large (limit 16 MiB)');
  return fs.readFile(target);
}
export function previewHandler({ build = '/home/supa/preview', starter = '/opt/svelte/app', api = process.env.API_URL,
  anonKey = process.env.ANON_KEY, workspace = '/workspace', dependencies = '/home/supa/dependencies/node_modules', buildTimeout = 600000 } = {}) {
  let building = false;
  const packages = new Dependencies({ workspace, cache: path.dirname(dependencies) });
  return async request => {
    if (request?.op === 'starter') {
      const files = []; let total = 0;
      async function walk(dir, prefix = '') {
        for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
          if (['node_modules', '.svelte-kit', 'build'].includes(entry.name)) continue;
          if (entry.isSymbolicLink()) throw new Error('Starter cannot contain symlinks');
          const name = prefix + entry.name;
          if (entry.isDirectory()) await walk(path.join(dir, entry.name), name + '/');
          else {
            const data = await fs.readFile(path.join(dir, entry.name)); total += data.length;
            if (data.length > MAX_BODY || total > MAX_RESPONSE || files.length >= 1000) throw new Error('Starter too large');
            files.push({ path: name, data: data.toString('base64') });
          }
        }
      }
      await walk(starter); return files;
    }
    if (request?.op === 'manifests') {
      const busy = await packages.busy();
      const files = busy ? [] : await packages.manifests().catch(error => { if (error.code === 'ENOENT') return []; throw error; });
      return { busy, files: files.map(file => ({ path: file.path, data: file.data.toString('base64') })) };
    }
    if (request?.op === 'build') {
      if (building) throw new Error('A build is already running');
      if (typeof request.base !== 'string' || !/^\/[A-Za-z0-9_/-]+$/.test(request.base) || request.base.includes('..')) throw new Error('Invalid preview base path');
      building = true;
      try {
        await packages.ensure();
        return await packages.lock(async () => {
          const env = { ...process.env, SNOWGLOBE_BASE: request.base,
            NODE_COMPILE_CACHE: path.join(path.dirname(path.dirname(dependencies)), 'node-compile-cache') };
          for (const key of ['SERVICE_ROLE_KEY', 'SECRET_KEY', 'DB_URL']) delete env[key];
          await new Promise((resolve, reject) => {
            const child = spawn(process.execPath, ['--run', 'build'], { cwd: workspace, env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
            const stopGroup = () => { try { process.kill(-child.pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; } };
            let output = '';
            for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { output = (output + chunk).slice(-16000); });
            let timedOut = false;
            const timer = setTimeout(() => { timedOut = true; stopGroup(); }, buildTimeout);
            child.once('error', error => { clearTimeout(timer); reject(error); });
            child.once('exit', code => {
              clearTimeout(timer); stopGroup();
              code === 0 ? resolve() : reject(new Error((timedOut ? 'Svelte build deadline exceeded:\n' : 'Svelte build failed:\n') + output));
            });
          });
          const next = build + '.next'; await fs.rm(next, { recursive: true, force: true });
          await fs.cp(path.join(workspace, 'build'), next, { recursive: true });
          await fs.rm(build, { recursive: true, force: true }); await fs.rename(next, build);
          return true;
        });
      } finally { building = false; }
    }
    if (request?.op !== 'http') throw new Error('Unsupported preview operation');
    const { names, pathname } = route(request.path);
    if (!['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(request.method)) throw new Error('Unsupported HTTP method');
    if (request.body && (typeof request.body !== 'string' || request.body.length > Math.ceil(MAX_BODY / 3) * 4)) throw new Error('Request body too large');
    const body = request.body ? Buffer.from(request.body, 'base64') : undefined;
    if (body?.length > MAX_BODY) throw new Error('Request body too large');
    if (pathname.startsWith('/supabase/')) {
      if (!/^\/supabase\/(auth|rest)\/v1(?:\/|$)/.test(pathname)) throw new Error('Unsupported Supabase route');
      const headers = {};
      for (const [key, value] of Object.entries(request.headers ?? {})) {
        if (['apikey', 'authorization', 'content-type', 'prefer', 'accept', 'range', 'range-unit', 'x-client-info'].includes(key.toLowerCase())) headers[key] = value;
      }
      const response = await fetch(api + request.path.slice('/supabase'.length), { method: request.method, headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : body, redirect: 'manual', signal: AbortSignal.timeout(30000) });
      const allowed = {};
      for (const key of ['content-type', 'content-range', 'range-unit', 'www-authenticate']) if (response.headers.has(key)) allowed[key] = response.headers.get(key);
      return result(response.status, await boundedBody(response), allowed);
    }
    if (!['GET', 'HEAD'].includes(request.method)) return result(405, 'Static preview only supports GET and HEAD');
    if (pathname === '/__config.json') return result(200, JSON.stringify({ anonKey }), { 'Content-Type': 'application/json' });
    let data = await regularFile(build, names), type = mime[path.extname(pathname)];
    if (!data && !path.extname(pathname)) { data = await regularFile(build, ['index.html']); type = mime['.html']; }
    if (!data) return result(404, 'Not found', { 'Content-Type': 'text/plain' });
    return result(200, request.method === 'HEAD' ? '' : data, { 'Content-Type': type ?? 'application/octet-stream' });
  };
}
export function createPreviewServer(options) {
  const handle = previewHandler(options);
  return net.createServer(socket => {
    let input = '', handled = false;
    socket.setEncoding('utf8'); socket.setTimeout(1230000, () => socket.destroy()); socket.on('error', () => {});
    socket.on('data', async chunk => {
      if (handled) return;
      input += chunk;
      if (input.length > 2 << 20) { handled = true; socket.end(JSON.stringify({ error: 'Request too large' }) + '\n'); return; }
      const newline = input.indexOf('\n'); if (newline < 0) return;
      handled = true;
      try { socket.end(JSON.stringify({ result: await handle(JSON.parse(input.slice(0, newline))) }) + '\n'); }
      catch (error) { socket.end(JSON.stringify({ error: error.message }) + '\n'); }
    });
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const bridge = createBridge('/workspace'), preview = createPreviewServer();
  await Promise.all([[bridge, 8090], [preview, 8091]].map(([server, port]) => new Promise((resolve, reject) => {
    server.once('error', reject); server.listen(port, '0.0.0.0', resolve);
  })));
  console.log('Svelte workspace and preview bridges ready');
}
