const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { existsSync } = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const { EventEmitter } = require('node:events');
const available = existsSync(path.join(__dirname, 'working-folder.js'));
const W = available ? require('./working-folder.js') : {};
const check = (name, fn) => test(name, { skip: !available }, fn);
const bytes = text => new TextEncoder().encode(text);

test('the disk working-folder implementation is shipped', () => assert.ok(available));

// Native disk behind the browser FileSystemHandle boundary. Browser tests cover the real API.
class Directory {
  constructor(location) { this.location = location; this.name = path.basename(location); this.kind = 'directory'; }
  async getDirectoryHandle(name, { create = false } = {}) {
    const location = path.join(this.location, name);
    if (create) await fs.mkdir(location, { recursive: false }).catch(e => { if (e.code !== 'EEXIST') throw e; });
    const stat = await fs.stat(location).catch(e => { if (e.code === 'ENOENT') throw new DOMException('Missing', 'NotFoundError'); throw e; });
    if (!stat.isDirectory()) throw new DOMException('Not a directory', 'TypeMismatchError');
    return new Directory(location);
  }
  async getFileHandle(name, { create = false } = {}) {
    const location = path.join(this.location, name);
    if (create) await (await fs.open(location, 'a')).close();
    const stat = await fs.stat(location).catch(e => { if (e.code === 'ENOENT') throw new DOMException('Missing', 'NotFoundError'); throw e; });
    if (!stat.isFile()) throw new DOMException('Not a file', 'TypeMismatchError');
    return { kind: 'file', name, getFile: async () => new Blob([await fs.readFile(location)]),
      createWritable: async () => {
        const temporary = location + '.pending-' + crypto.randomUUID();
        return { write: async data => fs.writeFile(temporary, new Uint8Array(await new Blob([data]).arrayBuffer())),
          close: async () => {
            if (this.fail) throw new Error('disk full');
            await fs.rename(temporary, location);
          }, abort: async () => fs.rm(temporary, { force: true }) };
      } };
  }
  async removeEntry(name, { recursive = false } = {}) {
    const location = path.join(this.location, name);
    if ((await fs.lstat(location)).isDirectory()) {
      if (recursive) return fs.rm(location, { recursive: true });
      try { await fs.rmdir(location); }
      catch (e) { if (e.code === 'ENOTEMPTY') throw new DOMException('Directory is not empty', 'InvalidModificationError'); throw e; }
    } else await fs.unlink(location);
  }
  async *entries() {
    for (const entry of await fs.readdir(this.location, { withFileTypes: true })) {
      yield [entry.name, entry.isDirectory() ? await this.getDirectoryHandle(entry.name) : await this.getFileHandle(entry.name)];
    }
  }
}
async function folder(t) {
  const location = await fs.mkdtemp(path.join(os.tmpdir(), 'snowglobe-working-folder-'));
  t.after(() => fs.rm(location, { recursive: true, force: true }));
  return new Directory(location);
}

check('create, edit and delete ordinary nested files survive reopening the disk folder', async t => {
  const dir = await folder(t);
  const disk = new W.DiskFolder(dir);
  await disk.write('src/hello.ts', bytes('console.log("Ada")\n'), null);
  assert.equal(await fs.readFile(path.join(dir.location, 'src/hello.ts'), 'utf8'), 'console.log("Ada")\n');
  const reopened = new W.DiskFolder(new Directory(dir.location));
  const original = await reopened.read('src/hello.ts');
  await reopened.write('src/hello.ts', bytes('console.log("Grace")\n'), original);
  assert.deepEqual(await disk.read('src/hello.ts'), bytes('console.log("Grace")\n'));
  await disk.remove('src/hello.ts', bytes('console.log("Grace")\n'));
  await assert.rejects(reopened.read('src/hello.ts'), { name: 'NotFoundError' });
});
check('paths cannot escape the selected working folder', async t => {
  const disk = new W.DiskFolder(await folder(t));
  for (const name of ['../private', '/etc/passwd', 'a/../../private', 'a//b', './a', 'a\\b', '', 'a\0b']) {
    await assert.rejects(disk.write(name, bytes('bad'), null), /path/i);
    await assert.rejects(disk.read(name), /path/i);
    await assert.rejects(disk.remove(name, bytes('bad')), /path/i);
  }
});
check('new files never overwrite existing files and outside edits require reopening', async t => {
  const dir = await folder(t); const disk = new W.DiskFolder(dir);
  await disk.write('notes.txt', bytes('original'), null);
  await assert.rejects(disk.write('notes.txt', bytes('overwrite'), null), /exists/i);
  await fs.writeFile(path.join(dir.location, 'notes.txt'), 'external edit');
  await assert.rejects(disk.write('notes.txt', bytes('editor edit'), bytes('original')), /changed/i);
  await assert.rejects(disk.remove('notes.txt', bytes('original')), /changed/i);
  assert.equal(await fs.readFile(path.join(dir.location, 'notes.txt'), 'utf8'), 'external edit');
});
check('failed commits preserve existing content and clean up a newly created empty file', async t => {
  const dir = await folder(t); const disk = new W.DiskFolder(dir);
  await disk.write('old.txt', bytes('keep'), null);
  dir.fail = true;
  await assert.rejects(disk.write('old.txt', bytes('bad'), bytes('keep')), /disk full/);
  assert.equal(await fs.readFile(path.join(dir.location, 'old.txt'), 'utf8'), 'keep');
  await assert.rejects(disk.write('new.txt', bytes('bad'), null), /disk full/);
  assert.deepEqual(await fs.readdir(dir.location), ['old.txt']);
});
check('folder scanning preserves binary data and empty directories, with bounded imports', async t => {
  const dir = await folder(t); const disk = new W.DiskFolder(dir);
  await fs.mkdir(path.join(dir.location, 'empty'));
  await disk.write('image.bin', new Uint8Array([0, 255, 128, 1]), null);
  const entries = await disk.scan();
  assert.deepEqual(entries.map(e => [e.path, e.kind]), [['empty', 'directory'], ['image.bin', 'file']]);
  assert.deepEqual(entries[1].data, new Uint8Array([0, 255, 128, 1]));
  await fs.writeFile(path.join(dir.location, 'huge.bin'), new Uint8Array(W.MAX_FILE_BYTES + 1));
  await assert.rejects(disk.scan(), /too large/i);
});
check('entry limits stop enumeration instead of collecting an unbounded directory first', async () => {
  let enumerated = 0;
  const disk = new W.DiskFolder({ entries: async function* () {
    for (let i = 0; i < 2000; i++) {
      enumerated++;
      yield ['file-' + i, { kind: 'file', name: 'file-' + i, getFile: async () => new Blob() }];
    }
  } });
  await assert.rejects(disk.scan(), /too large/i);
  assert.ok(enumerated <= 1001, `Enumerated ${enumerated} entries before enforcing the limit`);
});
check('loading a disk folder replaces stale snapshot contents before mirroring every file', async t => {
  const dir = await folder(t); const disk = new W.DiskFolder(dir);
  await disk.write('hello.ts', bytes('const x = "☃";'), null);
  const calls = [];
  const workspace = new W.WorkingFolder(disk, { request: async request => { calls.push(request); } });
  await workspace.load();
  assert.deepEqual(calls, [{ op: 'reset' }, { op: 'write', path: 'hello.ts', data: W.base64(bytes('const x = "☃";')) }]);
  await fs.unlink(path.join(dir.location, 'hello.ts'));
  calls.length = 0;
  await workspace.load();
  assert.deepEqual(calls, [{ op: 'reset' }], 'A deleted disk file must not return from an older VM session');
});
check('an invalid or oversized disk import never resets the existing guest workspace', async t => {
  const dir = await folder(t); const disk = new W.DiskFolder(dir);
  await fs.writeFile(path.join(dir.location, 'huge.bin'), new Uint8Array(W.MAX_FILE_BYTES + 1));
  let calls = 0;
  const workspace = new W.WorkingFolder(disk, { request: async () => { calls++; } });
  await assert.rejects(workspace.load(), /too large/i);
  assert.equal(calls, 0);
});
check('editor saves commit to disk before changing the guest and distinguish mirror failures', async t => {
  const dir = await folder(t); const disk = new W.DiskFolder(dir);
  const workspace = new W.WorkingFolder(disk, { request: async request => {
    assert.equal(await fs.readFile(path.join(dir.location, request.path), 'utf8'), 'saved');
    throw new Error('guest unavailable');
  } });
  await assert.rejects(workspace.save('hello.txt', bytes('saved'), null), e => {
    assert.equal(e.name, 'DiskCommittedError');
    assert.match(e.message, /disk.*VPS/i);
    return true;
  });
  assert.deepEqual(await disk.read('hello.txt'), bytes('saved'));
  dir.fail = true; let calls = 0;
  workspace.bridge = { request: async () => { calls++; } };
  await assert.rejects(workspace.save('hello.txt', bytes('bad'), bytes('saved')), /disk full/);
  assert.equal(calls, 0);
});
check('editor deletion removes only its chosen disk file before mirroring deletion', async t => {
  const dir = await folder(t); const disk = new W.DiskFolder(dir);
  await disk.write('remove.txt', bytes('remove'), null); await disk.write('keep.txt', bytes('keep'), null);
  const workspace = new W.WorkingFolder(disk, { request: async request => {
    assert.deepEqual(request, { op: 'remove', path: 'remove.txt' });
    await assert.rejects(fs.stat(path.join(dir.location, 'remove.txt')), { code: 'ENOENT' });
  } });
  await workspace.remove('remove.txt', bytes('remove'));
  assert.deepEqual(await disk.read('keep.txt'), bytes('keep'));
});

check('empty directory deletion removes only the selected directory and preserves its parent', async t => {
  const dir = await folder(t), disk = new W.DiskFolder(dir);
  assert.equal(typeof disk.removeDirectory, 'function', 'Empty-directory deletion is missing');
  await fs.mkdir(path.join(dir.location, 'parent/empty'), { recursive: true });
  await disk.write('keep.txt', bytes('keep'), null);
  await disk.removeDirectory('parent/empty');
  assert.deepEqual(await fs.readdir(path.join(dir.location, 'parent')), []);
  assert.deepEqual(await disk.read('keep.txt'), bytes('keep'));
  for (const invalid of ['', '..', '../outside', '/workspace', 'a//b', 'a\\b']) {
    await assert.rejects(disk.removeDirectory(invalid), /path/i);
  }
});
check('directory deletion preserves nonempty folders and paths replaced by regular files', async t => {
  const dir = await folder(t), disk = new W.DiskFolder(dir);
  assert.equal(typeof disk.removeDirectory, 'function', 'Empty-directory deletion is missing');
  await disk.write('has-file/keep.txt', bytes('keep'), null);
  await fs.mkdir(path.join(dir.location, 'has-directory/child'), { recursive: true });
  await assert.rejects(disk.removeDirectory('has-file'), /not empty/i);
  await assert.rejects(disk.removeDirectory('has-directory'), /not empty/i);
  await assert.rejects(disk.removeDirectory('has-file/keep.txt'), { name: 'TypeMismatchError' });
  assert.deepEqual(await disk.read('has-file/keep.txt'), bytes('keep'));
  assert.ok((await fs.stat(path.join(dir.location, 'has-directory/child'))).isDirectory());
});
check('a file added immediately before nonrecursive directory removal prevents deletion and guest updates', async t => {
  const dir = await folder(t), disk = new W.DiskFolder(dir);
  const workspace = new W.WorkingFolder(disk, { request: async () => { throw new Error('Guest must not be called'); } });
  assert.equal(typeof workspace.removeDirectory, 'function', 'Mirrored empty-directory deletion is missing');
  await fs.mkdir(path.join(dir.location, 'empty'));
  const remove = dir.removeEntry.bind(dir);
  dir.removeEntry = async name => {
    await fs.writeFile(path.join(dir.location, name, 'outside-write.txt'), 'keep');
    return remove(name);
  };
  await assert.rejects(workspace.removeDirectory('empty'), /not empty/i);
  assert.equal(await fs.readFile(path.join(dir.location, 'empty/outside-write.txt'), 'utf8'), 'keep');
});
check('directory deletion commits to disk first and distinguishes a failed guest mirror', async t => {
  const dir = await folder(t), disk = new W.DiskFolder(dir);
  assert.equal(typeof disk.removeDirectory, 'function', 'Empty-directory deletion is missing');
  for (const name of ['empty', 'offline']) await fs.mkdir(path.join(dir.location, name));
  const workspace = new W.WorkingFolder(disk, { request: async request => {
    assert.deepEqual(request, { op: 'rmdir', path: 'empty' });
    await assert.rejects(fs.stat(path.join(dir.location, 'empty')), { code: 'ENOENT' });
  } });
  await workspace.removeDirectory('empty');
  workspace.bridge = { request: async () => { throw new Error('guest offline'); } };
  await assert.rejects(workspace.removeDirectory('offline'), e => e.name === 'DiskCommittedError' && /Deleted on disk.*VPS/i.test(e.message));
  await assert.rejects(fs.stat(path.join(dir.location, 'offline')), { code: 'ENOENT' });
});

// The transport adapter is the real pinned Armless Connection contract over a native TCP socket.
function tcpVM(port) {
  return { connect: () => {
    const connection = new EventEmitter(); const socket = net.connect(port, '127.0.0.1');
    connection.write = data => socket.write(data);
    connection.abort = () => socket.destroy();
    socket.on('connect', () => connection.emit('connect'));
    socket.on('data', data => connection.emit('data', new Uint8Array(data)));
    socket.on('close', () => connection.emit('close'));
    socket.on('error', () => {});
    return connection;
  } };
}
check('guest transport handles fragmented UTF-8 responses and closes each connection', async t => {
  const server = net.createServer(socket => socket.once('data', () => {
    const reply = Buffer.from(JSON.stringify({ result: '☃' }) + '\n');
    const split = reply.indexOf(Buffer.from('☃')) + 1;
    socket.write(reply.subarray(0, split)); setImmediate(() => socket.end(reply.subarray(split)));
  }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const bridge = new W.GuestBridge(tcpVM(server.address().port));
  assert.equal(await bridge.request({ op: 'ping' }), '☃');
});
check('guest transport rejects errors, disconnected guests and timeouts', async t => {
  const server = net.createServer(socket => socket.once('data', () => socket.end('{"error":"Unsafe path"}\n')));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  await assert.rejects(new W.GuestBridge(tcpVM(server.address().port)).request({ op: 'bad' }), /Unsafe path/);
  await assert.rejects(new W.GuestBridge({ connect: () => {
    const c = new EventEmitter(); c.abort = () => {}; c.write = () => {};
    queueMicrotask(() => c.emit('close')); return c;
  } }).request({ op: 'reset' }), /closed/i);
  await assert.rejects(new W.GuestBridge({ connect: () => {
    const c = new EventEmitter(); c.abort = () => {}; return c;
  } }, 10).request({ op: 'reset' }), /timed out/i);
});
