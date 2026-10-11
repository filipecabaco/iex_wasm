import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
const available = existsSync(new URL('./bridge.mjs', import.meta.url));
const B = available ? await import('./bridge.mjs') : {};
const check = (name, fn) => test(name, { skip: !available }, fn);
const encoded = value => Buffer.from(value).toString('base64');
test('the example ships its guest workspace bridge', () => assert.ok(available));
async function root(t) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'snowglobe-guest-workspace-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  return directory;
}
check('guest bridge creates, edits and deletes nested binary files in its workspace', async t => {
  const directory = await root(t); const apply = B.workspaceHandler(directory);
  await apply({ op: 'mkdir', path: 'empty' });
  await apply({ op: 'write', path: 'src/main.ts', data: encoded('console.log("Ada")') });
  assert.equal(await fs.readFile(path.join(directory, 'src/main.ts'), 'utf8'), 'console.log("Ada")');
  const binary = Buffer.from([0, 255, 128, 1]);
  await apply({ op: 'write', path: 'src/main.ts', data: encoded(binary) });
  assert.deepEqual(await fs.readFile(path.join(directory, 'src/main.ts')), binary);
  await apply({ op: 'remove', path: 'src/main.ts' });
  await assert.rejects(fs.stat(path.join(directory, 'src/main.ts')), { code: 'ENOENT' });
  assert.ok((await fs.stat(path.join(directory, 'empty'))).isDirectory());
});
check('guest directory removal is nonrecursive and preserves nonempty directories and regular files', async t => {
  const directory = await root(t), apply = B.workspaceHandler(directory);
  await fs.mkdir(path.join(directory, 'parent/empty'), { recursive: true });
  await apply({ op: 'rmdir', path: 'parent/empty' });
  assert.deepEqual(await fs.readdir(path.join(directory, 'parent')), []);
  await apply({ op: 'rmdir', path: 'parent/empty' }); // Guest-side completion may be retried.
  await apply({ op: 'write', path: 'full/keep.txt', data: encoded('keep') });
  await assert.rejects(apply({ op: 'rmdir', path: 'full' }), /not empty|ENOTEMPTY/i);
  await assert.rejects(apply({ op: 'rmdir', path: 'full/keep.txt' }), /directory/i);
  await assert.rejects(apply({ op: 'rmdir', path: 'missing/empty' }), /parent/i);
  await assert.rejects(fs.stat(path.join(directory, 'missing')), { code: 'ENOENT' });
  assert.equal(await fs.readFile(path.join(directory, 'full/keep.txt'), 'utf8'), 'keep');
  await fs.mkdir(path.join(directory, 'has-child/child'), { recursive: true });
  await assert.rejects(apply({ op: 'rmdir', path: 'has-child' }), /not empty|ENOTEMPTY/i);
  assert.ok((await fs.stat(path.join(directory, 'has-child/child'))).isDirectory());
});
check('guest directory removal rejects traversal and symlink parents or targets', async t => {
  const directory = await root(t), outside = await root(t), apply = B.workspaceHandler(directory);
  await fs.mkdir(path.join(outside, 'empty'));
  await fs.symlink(outside, path.join(directory, 'link'));
  await fs.symlink(path.join(outside, 'empty'), path.join(directory, 'target'));
  for (const name of ['', '..', '../empty', '/workspace', 'a//b', 'link/empty', 'target']) {
    await assert.rejects(apply({ op: 'rmdir', path: name }), /path|directory|symlink/i);
  }
  assert.ok((await fs.stat(path.join(outside, 'empty'))).isDirectory());
});
check('disk-authoritative reset clears old guest files without following symlinks', async t => {
  const directory = await root(t); const outside = await root(t);
  await fs.writeFile(path.join(outside, 'keep.txt'), 'keep');
  await fs.mkdir(path.join(directory, 'old')); await fs.writeFile(path.join(directory, 'old/ghost.txt'), 'ghost');
  await fs.symlink(outside, path.join(directory, 'link'));
  await B.workspaceHandler(directory)({ op: 'reset' });
  assert.deepEqual(await fs.readdir(directory), []);
  assert.equal(await fs.readFile(path.join(outside, 'keep.txt'), 'utf8'), 'keep');
});
check('guest requests reject traversal, symlink parents, symlink targets and malformed contents', async t => {
  const directory = await root(t); const outside = await root(t); const apply = B.workspaceHandler(directory);
  await fs.writeFile(path.join(outside, 'keep.txt'), 'keep');
  await fs.symlink(outside, path.join(directory, 'link'));
  await fs.symlink(path.join(outside, 'keep.txt'), path.join(directory, 'target.txt'));
  for (const name of ['../keep.txt', '/etc/passwd', 'a/../../keep.txt', 'a//b', './a', 'a\\b', 'a\0b', 'link/keep.txt', 'target.txt']) {
    await assert.rejects(apply({ op: 'write', path: name, data: encoded('bad') }), /path|symlink|regular/i);
    await assert.rejects(apply({ op: 'remove', path: name }), /path|symlink|regular/i);
  }
  await assert.rejects(apply({ op: 'write', path: 'bad.txt', data: 'not base64!' }), /base64/i);
  await assert.rejects(apply({ op: 'execute', command: 'touch /bad' }), /operation/i);
  assert.equal(await fs.readFile(path.join(outside, 'keep.txt'), 'utf8'), 'keep');
});
check('the bridge accepts a full 1 MiB binary file and rejects larger or invalid files without mutation', async t => {
  const directory = await root(t); const apply = B.workspaceHandler(directory);
  const full = Buffer.alloc(1 << 20, 255);
  await apply({ op: 'write', path: 'full.bin', data: encoded(full) });
  assert.deepEqual(await fs.readFile(path.join(directory, 'full.bin')), full);
  await assert.rejects(apply({ op: 'write', path: 'full.bin', data: encoded(Buffer.alloc((1 << 20) + 1)) }), /large|base64/i);
  await assert.rejects(apply({ op: 'write', path: 'full.bin', data: '!!!!' }), /base64/i);
  assert.deepEqual(await fs.readFile(path.join(directory, 'full.bin')), full);
});
check('the workspace root itself may not be replaced with a symlink', async t => {
  const directory = await root(t); const outside = await root(t); const apply = B.workspaceHandler(directory);
  await fs.rmdir(directory); await fs.symlink(outside, directory);
  await assert.rejects(apply({ op: 'reset' }), /directory|symlink/i);
  assert.deepEqual(await fs.readdir(outside), []);
});
check('bridge protocol works over a real TCP connection and handles fragmented requests', async t => {
  const directory = await root(t); const server = B.createBridge(directory);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const response = await new Promise((resolve, reject) => {
    const socket = net.connect(server.address().port, '127.0.0.1'); let reply = '';
    socket.on('error', reject); socket.on('data', chunk => { reply += chunk; });
    socket.on('end', () => resolve(JSON.parse(reply)));
    socket.on('connect', () => {
      const request = JSON.stringify({ op: 'write', path: 'hello.txt', data: encoded('☃') }) + '\n';
      socket.write(request.slice(0, 15)); setImmediate(() => socket.write(request.slice(15)));
    });
  });
  assert.equal(response.result, true);
  assert.equal(await fs.readFile(path.join(directory, 'hello.txt'), 'utf8'), '☃');
});
