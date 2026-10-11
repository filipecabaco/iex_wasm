// Runs inside the guest only. This bridge never reads or writes the host's working folder.
// One newline-delimited JSON request per TCP connection, carrying binary files as base64.
import * as fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { randomUUID } from 'node:crypto';
const MAX_FILE_BYTES = 1 << 20;
function parts(name) {
  if (typeof name !== 'string' || !name || name.length > 1024 || /[\\\x00-\x1f\x7f]/.test(name) ||
      name.split('/').some(p => !p || p === '.' || p === '..')) throw new Error('Invalid relative workspace path');
  return name.split('/');
}
const stat = file => {
  try { return fs.lstatSync(file); }
  catch (e) { if (e.code === 'ENOENT') return null; throw e; }
};
export function workspaceHandler(root) {
  root = path.resolve(root);
  return async request => {
    if (!['reset', 'write', 'remove', 'mkdir', 'rmdir'].includes(request?.op)) throw new Error('Unsupported workspace operation');
    const rootStat = stat(root);
    if (!rootStat?.isDirectory()) throw new Error('Workspace root must be a real directory, not a symlink');
    if (request.op === 'reset') {
      for (const name of fs.readdirSync(root)) fs.rmSync(path.join(root, name), { recursive: true, force: true });
      return true;
    }
    const names = parts(request.path);
    let data;
    if (request.op === 'write') {
      if (typeof request.data !== 'string' || request.data.length > Math.ceil(MAX_FILE_BYTES / 3) * 4 ||
          !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(request.data)) throw new Error('Invalid or oversized base64 file');
      data = Buffer.from(request.data, 'base64');
      if (data.length > MAX_FILE_BYTES) throw new Error('File too large (limit 1 MiB)');
    }
    let parent = root;
    for (const name of names.slice(0, -1)) {
      parent = path.join(parent, name);
      if (!stat(parent) && !['remove', 'rmdir'].includes(request.op)) fs.mkdirSync(parent);
      if (!stat(parent)?.isDirectory()) throw new Error('Workspace path parent must be a real directory, not a symlink');
    }
    const file = path.join(parent, names.at(-1)), existing = stat(file);
    if (request.op === 'mkdir') {
      if (existing && !existing.isDirectory()) throw new Error('Workspace path must be a real directory');
      if (!existing) fs.mkdirSync(file);
    } else if (request.op === 'rmdir') {
      if (existing && !existing.isDirectory()) throw new Error('Workspace path must be a real directory, not a file or symlink');
      if (existing) {
        try { fs.rmdirSync(file); } // Never recursive; terminal-created contents must not be erased.
        catch (e) { if (e.code === 'ENOTEMPTY' || e.code === 'EEXIST') throw new Error('Folder is not empty; delete its contents first'); throw e; }
      }
    } else {
      if (existing && !existing.isFile()) throw new Error('Workspace path must be a regular file, not a symlink');
      if (request.op === 'remove') {
        if (existing) fs.unlinkSync(file);
      } else {
        const temporary = path.join(parent, '.snowglobe-write-' + randomUUID());
        try {
          fs.writeFileSync(temporary, data, { flag: 'wx', mode: 0o644 });
          fs.renameSync(temporary, file);
        } finally { fs.rmSync(temporary, { force: true }); }
      }
    }
    return true;
  };
}
export function createBridge(root) {
  const apply = workspaceHandler(root);
  return net.createServer(socket => {
    let input = '', handled = false;
    socket.setEncoding('utf8'); socket.setTimeout(30000, () => socket.destroy());
    socket.on('error', () => {});
    socket.on('data', async chunk => {
      if (handled) return;
      input += chunk;
      if (input.length > 2 << 20) { handled = true; socket.end(JSON.stringify({ error: 'Workspace request too large' }) + '\n'); return; }
      const newline = input.indexOf('\n');
      if (newline < 0) return;
      handled = true;
      try { socket.end(JSON.stringify({ result: await apply(JSON.parse(input.slice(0, newline))) }) + '\n'); }
      catch (e) { socket.end(JSON.stringify({ error: e.message }) + '\n'); }
    });
  });
}
