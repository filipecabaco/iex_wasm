import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import * as fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./notes.ts', import.meta.url));
async function environment(t, handler = (_req, res) => { res.writeHead(500); res.end('{}'); }) {
  const home = await fs.mkdtemp(path.join(os.tmpdir(), 'snowglobe-notes-'));
  t.after(() => fs.rm(home, { recursive: true, force: true }));
  const server = http.createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const run = (...args) => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd: home, env: { HOME: home, API_URL: `http://127.0.0.1:${server.address().port}`, ANON_KEY: 'fixture-anon' },
      timeout: 10000,
    });
    let stdout = '', stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', (code, signal) => resolve({ code, signal, stdout, stderr }));
  });
  return { home, run };
}
const success = result => { assert.equal(result.code, 0, result.stderr); assert.equal(result.signal, null); assert.equal(result.stderr, ''); return result.stdout; };

test('notes helper runs directly on Node and shows the existing usage', async t => {
  const { run } = await environment(t);
  assert.match(success(await run()), /usage: notes signup\|login EMAIL PASSWORD/);
});

test('notes reports missing sessions with exit 1 instead of crashing', async t => {
  const { run } = await environment(t);
  const result = await run('whoami');
  assert.equal(result.code, 1); assert.equal(result.signal, null);
  assert.match(result.stderr, /^notes: not signed in: notes signup EMAIL PASSWORD\n$/);
});

test('Node notes preserves auth, persisted sessions and REST command requests', async t => {
  const calls = [];
  const fixtureSession = { access_token: 'fixture-token', user: { id: 'fixture-user-id', email: 'fixture@example.com' } };
  const note = { id: 1, body: 'first program', created_at: '2026-10-01T12:34:56Z' };
  const { home, run } = await environment(t, async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk;
    calls.push({ path: req.url, method: req.method, headers: req.headers, body });
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(req.url.startsWith('/auth/') ? fixtureSession : [note]));
  });
  assert.match(success(await run('signup', 'fixture@example.com', 'fixture-password')), /signed in as fixture@example.com/);
  const sessionPath = path.join(home, '.notes-session.json');
  assert.deepEqual(JSON.parse(await fs.readFile(sessionPath, 'utf8')), fixtureSession);
  assert.equal((await fs.stat(sessionPath)).mode & 0o777, 0o600);
  assert.equal(calls[0].path, '/auth/v1/signup'); assert.equal(calls[0].method, 'POST');
  assert.equal(calls[0].headers.authorization, 'Bearer fixture-anon');
  assert.deepEqual(JSON.parse(calls[0].body), { email: 'fixture@example.com', password: 'fixture-password' });
  assert.match(success(await run('whoami')), /fixture@example.com/);
  assert.match(success(await run('add', 'first', 'program')), /#1 added/);
  assert.equal(calls[1].path, '/rest/v1/notes'); assert.equal(calls[1].method, 'POST');
  assert.equal(calls[1].headers.prefer, 'return=representation');
  assert.deepEqual(JSON.parse(calls[1].body), { body: 'first program' });
  assert.match(success(await run('ls')), /fixture@example.com: 1 note\(s\)[\s\S]*#1.*first program/);
  assert.equal(calls[2].path, '/rest/v1/notes?select=id,body,created_at&order=id');
  assert.match(success(await run('search', 'first program')), /1 note\(s\) matching "first program"/);
  assert.equal(calls[3].path, '/rest/v1/notes?select=id,body,created_at&order=id&body=ilike.*first%20program*');
  assert.match(success(await run('rm', '1')), /#1 removed/);
  assert.equal(calls[4].path, '/rest/v1/notes?id=eq.1'); assert.equal(calls[4].method, 'DELETE');
  for (const call of calls.slice(1)) {
    assert.equal(call.headers.apikey, 'fixture-anon'); assert.equal(call.headers.authorization, 'Bearer fixture-token');
  }
  assert.match(success(await run('logout')), /signed out/);
  await assert.rejects(fs.stat(sessionPath), { code: 'ENOENT' });
  assert.match(success(await run('logout')), /signed out/);
  assert.match(success(await run('login', 'fixture@example.com', 'fixture-password')), /signed in as fixture@example.com/);
  assert.equal(calls[5].path, '/auth/v1/token?grant_type=password');
  assert.deepEqual(JSON.parse(await fs.readFile(sessionPath, 'utf8')), fixtureSession);
});

test('notes preserves API errors and exits unsuccessfully without a session write', async t => {
  const { home, run } = await environment(t, (_req, res) => {
    res.writeHead(400, { 'content-type': 'application/json' }); res.end('{"msg":"fixture authentication error"}');
  });
  const result = await run('login', 'fixture@example.com', 'fixture-password');
  assert.equal(result.code, 1); assert.equal(result.signal, null);
  assert.equal(result.stderr, 'notes: fixture authentication error\n');
  await assert.rejects(fs.stat(path.join(home, '.notes-session.json')), { code: 'ENOENT' });
});

test('fullstack notes launcher selects the already-included Node runtime', async () => {
  const dockerfile = await fs.readFile(new URL('./Dockerfile', import.meta.url), 'utf8');
  assert.match(dockerfile, /exec node \/home\/supa\/app\/notes\.ts/);
  assert.doesNotMatch(dockerfile, /BUN_BE_BUN=1 exec supabase run/);
  const workflow = await fs.readFile(new URL('../../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.match(workflow, /uses: actions\/setup-node@[^\n]+\n\s+with:\n\s+node-version: '24'/);
});
