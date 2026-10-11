import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const available = existsSync(new URL('./dependencies.mjs', import.meta.url));
test('project-specific dependency manager is shipped', () => assert.ok(available));
const D = available ? await import('./dependencies.mjs') : {};
const check = (name, fn) => test(name, { skip: !available }, fn);
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'snowglobe-dependencies-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const workspace = path.join(root, 'workspace'), cache = path.join(root, 'cache');
  await fs.mkdir(workspace); await fs.mkdir(cache); await fs.mkdir(path.join(cache, 'node_modules'));
  const pkg = JSON.stringify({ name: 'project', dependencies: {} });
  const lock = JSON.stringify({ name: 'project', lockfileVersion: 3 });
  for (const dir of [workspace, cache]) {
    await fs.writeFile(path.join(dir, 'package.json'), pkg); await fs.writeFile(path.join(dir, 'package-lock.json'), lock);
  }
  return { root, workspace, cache };
}
check('matching manifests reuse mutable dependencies outside the resettable workspace', async t => {
  const { workspace, cache } = await fixture(t); let installs = 0;
  const manager = new D.Dependencies({ workspace, cache, run: async () => installs++ });
  await manager.ensure();
  assert.equal(installs, 0);
  assert.equal(await fs.readlink(path.join(workspace, 'node_modules')), path.join(cache, 'node_modules'));
  await fs.rm(workspace, { recursive: true }); await fs.mkdir(workspace);
  await fs.copyFile(path.join(cache, 'package.json'), path.join(workspace, 'package.json'));
  await fs.copyFile(path.join(cache, 'package-lock.json'), path.join(workspace, 'package-lock.json'));
  await manager.ensure(); assert.equal(installs, 0);
});
check('install commands operate on a real cache directory, then return manifests to the VM without writing host files', async t => {
  const { workspace, cache } = await fixture(t);
  const calls = [];
  const manager = new D.Dependencies({ workspace, cache, run: async (args, options) => {
    calls.push({ args, options });
    assert.equal(options.cwd, cache);
    await fs.writeFile(path.join(cache, 'package.json'), JSON.stringify({ name: 'project', dependencies: { 'msn-weather': '2.1.3' } }));
    await fs.writeFile(path.join(cache, 'package-lock.json'), '{"lockfileVersion":3,"installed":true}');
  } });
  await manager.install(['install', 'msn-weather']);
  assert.equal(calls.length, 1);
  assert.equal(JSON.parse(await fs.readFile(path.join(workspace, 'package.json'))).dependencies['msn-weather'], '2.1.3');
  assert.equal(await fs.readlink(path.join(workspace, 'node_modules')), path.join(cache, 'node_modules'));
  await manager.ensure(); assert.equal(calls.length, 1, 'next sync must not erase or reinstall the new package');
});
check('changed local manifests reconcile the active cache, while failed installs do not claim success or copy partial manifests back', async t => {
  const { workspace, cache } = await fixture(t);
  await fs.writeFile(path.join(workspace, 'package.json'), '{"name":"edited-project"}');
  let calls = 0;
  const manager = new D.Dependencies({ workspace, cache, run: async () => { calls++; throw new Error('registry failed'); } });
  await assert.rejects(manager.ensure(), /registry failed/);
  assert.equal(calls, 1);
  assert.equal(await fs.readFile(path.join(workspace, 'package.json'), 'utf8'), '{"name":"edited-project"}');
  assert.equal(existsSync(cache + '.lock'), false);
  await assert.rejects(manager.ensure(), /registry failed/);
  assert.equal(calls, 2, 'An incomplete install must be retried even when the cache manifests already match');
});
check('stale-lock observation and replacement exclude every other acquisition', async t => {
  const { workspace, cache } = await fixture(t);
  await fs.mkdir(cache + '.lock'); await fs.writeFile(path.join(cache + '.lock', 'pid'), '2147483647');
  let observed, proceed, calls = 0;
  const staleObserved = new Promise(resolve => observed = resolve), continuation = new Promise(resolve => proceed = resolve);
  const options = { workspace, cache, run: async () => calls++ };
  const first = new D.Dependencies(options), second = new D.Dependencies(options);
  const originalBusy = first.busy.bind(first);
  first.busy = async () => { const stale = await originalBusy(); observed(); await continuation; return stale; };
  const a = first.install(['install']); await staleObserved;
  try {
    await assert.rejects(second.install(['install']), /running/);
    assert.equal(calls, 0, 'No installer may mutate the cache while a stale observation is pending');
  } finally { proceed(); await a; }
  assert.equal(calls, 1);
  assert.equal(existsSync(cache + '.lock'), false);
  assert.equal(existsSync(cache + '.lock.acquire'), false);
});
check('concurrent dependency mutations are refused and manifest reads reject symlinks and oversized files', async t => {
  const { root, workspace, cache } = await fixture(t);
  await fs.mkdir(cache + '.lock'); await fs.writeFile(path.join(cache + '.lock', 'pid'), String(process.pid));
  const manager = new D.Dependencies({ workspace, cache, run: async () => {} });
  await assert.rejects(manager.install(['install', 'new-package']), /running/);
  await fs.rm(cache + '.lock', { recursive: true });
  await fs.rm(path.join(workspace, 'package.json'));
  await fs.writeFile(path.join(root, 'outside.json'), '{}');
  await fs.symlink(path.join(root, 'outside.json'), path.join(workspace, 'package.json'));
  await assert.rejects(manager.manifests(), /regular|symlink/);
  await fs.rm(path.join(workspace, 'package.json')); await fs.writeFile(path.join(workspace, 'package.json'), Buffer.alloc((1 << 20) + 1));
  await assert.rejects(manager.manifests(), /large/);
});
