import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { Dependencies } from './dependencies.mjs';
let P = {};
try { P = await import('./project-npm.mjs'); }
catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND' || !error.message.includes('/opt/svelte')) throw error; }
test('npm wrapper is portable and exposes its managed command entry point', () => assert.equal(typeof P.projectNpm, 'function'));
test('workspace installs refuse prefix/global overrides before modifying either manifest', { skip: !P.projectNpm }, async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'snowglobe-npm-cli-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const workspace = path.join(root, 'workspace'); await fs.mkdir(workspace);
  const pkg = '{"name":"unchanged"}'; await fs.writeFile(path.join(workspace, 'package.json'), pkg);
  for (const args of [['install', '--prefix', workspace], ['i', '--prefix=' + workspace], ['add', '-C', workspace], ['install', '-g'], ['install', '--location=global']]) {
    await assert.rejects(P.projectNpm(args, { cwd: workspace, workspace, cache: path.join(root, 'cache'), npm: '/not-a-real-npm' }), /override|global|prefix/);
    assert.equal(await fs.readFile(path.join(workspace, 'package.json'), 'utf8'), pkg);
  }
});

async function environment(t, script) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'snowglobe-npm-process-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const workspace = path.join(root, 'workspace'), cache = path.join(root, 'cache'), npm = path.join(root, 'npm.cjs');
  await fs.mkdir(workspace); await fs.mkdir(cache); await fs.mkdir(path.join(cache, 'node_modules'));
  for (const dir of [workspace, cache]) {
    await fs.writeFile(path.join(dir, 'package.json'), '{"name":"project","dependencies":{}}');
    await fs.writeFile(path.join(dir, 'package-lock.json'), '{"lockfileVersion":3}');
  }
  await fs.symlink(path.join(cache, 'node_modules'), path.join(workspace, 'node_modules'));
  await fs.writeFile(npm, '#!/usr/bin/env node\n' + script, { mode: 0o755 });
  return { root, workspace, cache, npm, cwd: workspace };
}
test('managed npm uses a real subprocess in the cache and returns only successful manifests', { skip: !P.projectNpm }, async t => {
  const options = await environment(t, `const fs=require('node:fs');
    if(process.env.SERVICE_ROLE_KEY || process.env.SECRET_KEY || process.env.DB_URL) process.exit(3);
    for(const flag of ['--ignore-scripts','--no-audit','--no-fund']) if(!process.argv.includes(flag)) process.exit(4);
    if(!fs.lstatSync('node_modules').isDirectory()) process.exit(5);
    fs.writeFileSync('package.json','{"name":"project","dependencies":{"new-package":"1.0.0"}}');
    fs.writeFileSync('package-lock.json','{"lockfileVersion":3,"updated":true}');`);
  const previous = process.env.SERVICE_ROLE_KEY; process.env.SERVICE_ROLE_KEY = 'test-only-not-a-credential';
  t.after(() => { if(previous === undefined) delete process.env.SERVICE_ROLE_KEY; else process.env.SERVICE_ROLE_KEY = previous; });
  assert.equal(await P.projectNpm(['install', 'new-package'], options), 0);
  assert.equal(JSON.parse(await fs.readFile(path.join(options.workspace, 'package.json'))).dependencies['new-package'], '1.0.0');
  assert.equal(await fs.readlink(path.join(options.workspace, 'node_modules')), path.join(options.cache, 'node_modules'));
  await new Dependencies({ ...options, run: () => assert.fail('matching cache must not reinstall') }).ensure();
});
test('failed npm subprocesses terminate descendants and keep the source manifests intact', async t => {
  const markerName = 'orphan';
  const options = await environment(t, `require('node:child_process').spawn(process.execPath,['-e',
    "setTimeout(()=>require('node:fs').writeFileSync('${markerName}','orphan'),500)"],{stdio:'ignore'}).unref(); process.exit(1);`);
  await assert.rejects(new Dependencies(options).install(['install', 'new-package']), /npm operation failed/);
  await new Promise(resolve => setTimeout(resolve, 800));
  assert.equal(await fs.access(path.join(options.cache, markerName)).then(() => true, () => false), false);
  assert.equal(await fs.readFile(path.join(options.workspace, 'package.json'), 'utf8'), '{"name":"project","dependencies":{}}');
});
test('interrupting npm kills its detached process group and permits stale-lock repair', { timeout: 10000 }, async t => {
  const options = await environment(t, `require('node:child_process').spawn(process.execPath,['-e',
    "setTimeout(()=>require('node:fs').writeFileSync('orphan','orphan'),500)"],{stdio:'ignore'}).unref();
    console.log('NPM_READY');setInterval(()=>{},1000);`);
  const moduleURL = new URL('./dependencies.mjs', import.meta.url).href;
  const child = spawn(process.execPath, ['--input-type=module', '-e', `import {Dependencies} from ${JSON.stringify(moduleURL)}; await new Dependencies(${JSON.stringify(options)}).install(['install']);`], { stdio: ['ignore','pipe','pipe'] });
  t.after(() => { if(child.exitCode === null && child.signalCode === null) child.kill('SIGKILL'); });
  const exited = once(child, 'exit');
  await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('npm subprocess did not become ready')), 5000);
    child.stdout.on('data', data => { output += data; if(output.includes('NPM_READY')) { clearTimeout(timer); resolve(); } });
    child.once('exit', () => { clearTimeout(timer); reject(new Error('npm driver exited before readiness')); });
  });
  child.kill('SIGINT'); assert.equal((await exited)[1], 'SIGINT');
  await new Promise(resolve => setTimeout(resolve, 800));
  assert.equal(await fs.access(path.join(options.cache, 'orphan')).then(() => true, () => false), false);
  await new Dependencies({ ...options, run: async () => {} }).ensure();
  assert.equal(await fs.access(options.cache + '.lock').then(() => true, () => false), false);
});
