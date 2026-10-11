import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
const available = existsSync(new URL('./runtime.mjs', import.meta.url));
test('fullstack runtime and Svelte starter are shipped', () => {
  assert.ok(available);
  assert.ok(existsSync(new URL('./app/src/routes/+page.svelte', import.meta.url)));
});
const check = (name, fn) => test(name, { skip: !available }, fn);
const R = available ? await import('./runtime.mjs') : {};
async function environment(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'snowglobe-svelte-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const build = path.join(dir, 'build'); await fs.mkdir(build);
  await fs.writeFile(path.join(build, 'index.html'), '<h1>SPA</h1>');
  await fs.writeFile(path.join(build, 'image.png'), new Uint8Array([0, 255, 1]));
  const handler = R.previewHandler({ build, starter: path.join(dir, 'starter'), api: '', anonKey: 'public-demo-key' });
  return { dir, build, handler };
}
check('static preview supports binary assets, deep SPA links and anonymous-only configuration', async t => {
  const { handler } = await environment(t);
  const response = await handler({ op: 'http', method: 'GET', path: '/deep/link?x=1' });
  assert.equal(Buffer.from(response.body, 'base64').toString(), '<h1>SPA</h1>');
  assert.equal(response.status, 200);
  const image = await handler({ op: 'http', method: 'GET', path: '/image.png' });
  assert.deepEqual(Buffer.from(image.body, 'base64'), Buffer.from([0, 255, 1]));
  const config = await handler({ op: 'http', method: 'GET', path: '/__config.json' });
  assert.deepEqual(JSON.parse(Buffer.from(config.body, 'base64')), { anonKey: 'public-demo-key' });
  assert.equal((await handler({ op: 'http', method: 'GET', path: '/missing.js' })).status, 404);
});
check('preview refuses traversal, symlinks, oversized bodies, arbitrary proxy targets and unsupported operations', async t => {
  const { dir, build, handler } = await environment(t);
  await fs.writeFile(path.join(dir, 'secret'), 'private');
  await fs.symlink(path.join(dir, 'secret'), path.join(build, 'secret.txt'));
  for (const route of ['/../secret', '/%2e%2e/secret', '/x/%2e%2e/secret', '/%2fetc/passwd', '/secret.txt', '//evil.test/', '/supabase/other', '/supabase/rest/v1/../other']) {
    await assert.rejects(handler({ op: 'http', method: 'GET', path: route }), /path|route|symlink/i, route);
  }
  await assert.rejects(handler({ op: 'exec' }), /operation/);
  await assert.rejects(handler({ op: 'http', method: 'POST', path: '/supabase/rest/v1/notes', body: Buffer.alloc((1 << 20) + 1).toString('base64') }), /large/);
});
check('Supabase proxy preserves auth, query, method and body, without forwarding host cookies or exposing privileged keys', async t => {
  const calls = [];
  const server = http.createServer(async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk;
    calls.push({ path: req.url, method: req.method, headers: req.headers, body });
    res.writeHead(201, { 'Content-Type': 'application/json' }); res.end('{"id":1}');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const handler = R.previewHandler({ api: `http://127.0.0.1:${server.address().port}`, anonKey: 'anon' });
  const response = await handler({ op: 'http', method: 'POST', path: '/supabase/rest/v1/notes?select=*',
    headers: { apikey: 'anon', authorization: 'Bearer user', cookie: 'host-secret', 'content-type': 'application/json', prefer: 'return=representation' },
    body: Buffer.from('{"body":"Ada"}').toString('base64') });
  assert.equal(response.status, 201);
  assert.equal(calls[0].path, '/rest/v1/notes?select=*'); assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].headers.authorization, 'Bearer user'); assert.equal(calls[0].headers.cookie, undefined);
  assert.equal(calls[0].body, '{"body":"Ada"}');
});
check('file bridge copy remains identical to the reviewed shared editor bridge', async () => {
  assert.equal(await fs.readFile(new URL('./bridge.mjs', import.meta.url), 'utf8'),
    await fs.readFile(new URL('../editor/bridge.mjs', import.meta.url), 'utf8'));
});

check('builds use disk sources with external dependencies, hide privileged environment and preserve last good output on failure', async t => {
  const { dir, build } = await environment(t);
  const workspace = path.join(dir, 'workspace'), dependencies = path.join(dir, 'dependencies/node_modules');
  await fs.mkdir(workspace); await fs.mkdir(dependencies, { recursive: true });
  await fs.writeFile(path.join(workspace, 'package.json'), JSON.stringify({ scripts: { build: 'node build.cjs' } }));
  await fs.copyFile(path.join(workspace, 'package.json'), path.join(path.dirname(dependencies), 'package.json'));
  await fs.writeFile(path.join(workspace, 'build.cjs'), `const fs = require('node:fs');
    if (process.env.SERVICE_ROLE_KEY || process.env.SECRET_KEY || process.env.DB_URL) process.exit(2);
    if (process.env.NODE_COMPILE_CACHE !== ${JSON.stringify(path.join(dir, 'node-compile-cache'))}) { console.error('module compile cache not configured'); process.exit(3); }
    fs.mkdirSync('build', {recursive:true}); fs.writeFileSync('build/index.html', process.env.SNOWGLOBE_BASE);`);
  const previous = process.env.SERVICE_ROLE_KEY; process.env.SERVICE_ROLE_KEY = 'test-only-not-a-credential';
  t.after(() => { if (previous === undefined) delete process.env.SERVICE_ROLE_KEY; else process.env.SERVICE_ROLE_KEY = previous; });
  const handler = R.previewHandler({ build, workspace, dependencies });
  assert.equal(await handler({ op: 'build', base: '/snowglobe/__preview/owner' }), true);
  assert.equal(await fs.readlink(path.join(workspace, 'node_modules')), dependencies);
  assert.equal(await fs.readFile(path.join(build, 'index.html'), 'utf8'), '/snowglobe/__preview/owner');
  await fs.writeFile(path.join(workspace, 'build.cjs'), `console.error('compile failed'); process.exit(1);`);
  await assert.rejects(handler({ op: 'build', base: '/snowglobe/__preview/owner' }), /compile failed/);
  assert.equal(await fs.readFile(path.join(build, 'index.html'), 'utf8'), '/snowglobe/__preview/owner');
});

test('headless verification allows the same dependency and compile deadlines as the project RPC', async () => {
  const source = await fs.readFile(new URL('./verify.mjs', import.meta.url), 'utf8');
  const timeout = Number(source.match(/socket\.setTimeout\((\d+)/)?.[1]);
  assert.equal(timeout, 1230000, 'Verification must allow two ten-minute operations plus the RPC margin');
});

test('guest startup warms the shared module cache before advertising project readiness', async () => {
  const startup = await fs.readFile(new URL('./start.sh', import.meta.url), 'utf8');
  assert.match(startup, /NODE_COMPILE_CACHE=\/home\/supa\/node-compile-cache/);
  assert.match(startup, /await import\('@sveltejs\/kit\/vite'\)/);
  assert.match(startup, /flushCompileCache\(\)/);
  assert.ok(startup.indexOf('flushCompileCache()') < startup.indexOf('The file and preview bridges'));
});

test('starter keeps accessible native labels without loading the Bits UI barrel just for labels', async () => {
  const source = await fs.readFile(new URL('./app/src/routes/+page.svelte', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /import.*\{ Label \}/);
  for (const id of ['email', 'password', 'note']) assert.match(source, new RegExp('<label[^>]*for="' + id + '"'));
  for (const component of ['button', 'card', 'input', 'textarea', 'badge']) assert.ok(source.includes('components/ui/' + component));
});

check('compiler deadlines stop the whole process group and leave the last preview intact', async t => {
  const { dir, build } = await environment(t);
  const workspace = path.join(dir, 'workspace'), dependencies = path.join(dir, 'cache/node_modules');
  await fs.mkdir(workspace); await fs.mkdir(dependencies, { recursive: true });
  const pkg = JSON.stringify({ scripts: { build: 'node slow.cjs' } });
  for (const root of [workspace, path.dirname(dependencies)]) await fs.writeFile(path.join(root, 'package.json'), pkg);
  await fs.writeFile(path.join(workspace, 'slow.cjs'), `setTimeout(()=>{const fs=require('node:fs');fs.mkdirSync('build',{recursive:true});fs.writeFileSync('build/index.html','late');},350);`);
  const handler = R.previewHandler({ workspace, dependencies, build, buildTimeout: 60 });
  await assert.rejects(handler({ op: 'build', base: '/__preview/deadline' }), /deadline|timed out/);
  assert.equal(await fs.readFile(path.join(build, 'index.html'), 'utf8'), '<h1>SPA</h1>');
});

test('fullstack example is published and has a headless preview/RLS check', async () => {
  const configuration = await fs.readFile(new URL('../../mise.toml', import.meta.url), 'utf8');
  const demos = configuration.match(/^DEMOS = "([^"]*)"$/m)?.[1].split(/\s+/) ?? [];
  const ciOnly = configuration.match(/^EXAMPLES = "([^"]*)"$/m)?.[1].split(/\s+/) ?? [];
  assert.ok(demos.includes('fullstack-supabase-svelte'));
  assert.ok(!ciOnly.includes('fullstack-supabase-svelte'));
  const workflow = await fs.readFile(new URL('../../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.match(workflow, /fullstack-supabase-svelte\)[\s\S]*?verify\.mjs[\s\S]*?fullstack-preview-ok/);
  const fullstack = workflow.match(/fullstack-supabase-svelte\)([\s\S]*?);;/)?.[1] ?? '';
  const commands = fullstack.match(/commands=\$'([^']*)'/)?.[1].split('\\n') ?? [];
  assert.equal(commands.length, 2, 'Compile and notes checks must have independent per-command budgets');
  assert.match(commands[0], /verify\.mjs; result=\$\?; echo fullstack-preview-exit=\$result/);
  assert.match(commands[1], /notes signup[\s\S]*&& notes ls; result=\$\?; echo fullstack-check-exit=\$result/);
  assert.match(fullstack, /fullstack-preview-exit=0/);
  assert.match(fullstack, /fullstack-check-exit=0/);
});

check('failed builds terminate compiler descendants rather than leaving orphan processes running', async t => {
  const { dir, build } = await environment(t);
  const workspace = path.join(dir, 'workspace'), dependencies = path.join(dir, 'dependencies/node_modules');
  await fs.mkdir(workspace); await fs.mkdir(dependencies, { recursive: true });
  const marker = path.join(dir, 'orphan');
  await fs.writeFile(path.join(workspace, 'package.json'), JSON.stringify({ scripts: { build: 'node fail.cjs' } }));
  await fs.copyFile(path.join(workspace, 'package.json'), path.join(path.dirname(dependencies), 'package.json'));
  await fs.writeFile(path.join(workspace, 'fail.cjs'), `require('node:child_process').spawn(process.execPath, ['-e',
    ${JSON.stringify("setTimeout(() => require('node:fs').writeFileSync(" + JSON.stringify(marker) + ", 'orphan'), 500)")}], {stdio:'ignore'}).unref(); process.exit(1);`);
  const handler = R.previewHandler({ build, workspace, dependencies });
  await assert.rejects(handler({ op: 'build', base: '/preview/test' }), /build failed/);
  await new Promise(resolve => setTimeout(resolve, 800));
  assert.equal(existsSync(marker), false, 'A failed compiler left a live descendant');
});

check('only bounded project package manifests are exposed for explicit disk commits', async t => {
  const { dir, build } = await environment(t);
  const workspace = path.join(dir, 'workspace'), dependencies = path.join(dir, 'cache/node_modules');
  await fs.mkdir(workspace); await fs.mkdir(dependencies, { recursive: true });
  await fs.writeFile(path.join(workspace, 'package.json'), '{"name":"local-project"}');
  await fs.writeFile(path.join(workspace, 'package-lock.json'), '{"lockfileVersion":3}');
  await fs.writeFile(path.join(workspace, '.env'), 'not-a-manifest');
  const handler = R.previewHandler({ build, workspace, dependencies });
  const result = await handler({ op: 'manifests' });
  assert.equal(result.busy, false);
  assert.deepEqual(result.files.map(file => file.path), ['package.json', 'package-lock.json']);
  assert.equal(Buffer.from(result.files[0].data, 'base64').toString(), '{"name":"local-project"}');
  await fs.rm(path.join(workspace, 'package.json')); await fs.symlink(path.join(workspace, '.env'), path.join(workspace, 'package.json'));
  await assert.rejects(handler({ op: 'manifests' }), /regular|symlink/);
});
