// One mutable dependency tree for the active project, outside the disk-source mirror.
// Only package manifests are returned to /workspace; the browser explicitly commits those to disk.
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
const names = ['package.json', 'package-lock.json'];
async function directory(root) {
  if (!(await fs.lstat(root)).isDirectory()) throw new Error('Dependency/project root must be a real directory, not a symlink');
}
async function read(root, name, optional = false) {
  const file = path.join(root, name);
  const stat = await fs.lstat(file).catch(error => { if (optional && error.code === 'ENOENT') return null; throw error; });
  if (!stat) return null;
  if (!stat.isFile()) throw new Error('Package manifest must be a regular file, not a symlink');
  if (stat.size > 1 << 20) throw new Error('Package manifest too large (limit 1 MiB)');
  return fs.readFile(file);
}
async function manifests(root) {
  await directory(root);
  const files = [];
  for (const name of names) {
    const data = await read(root, name, name === 'package-lock.json');
    if (data) files.push({ path: name, data });
  }
  return files;
}
async function copy(from, to) {
  const files = await manifests(from);
  await directory(to);
  for (const name of names) {
    await read(to, name, true); // Refuse preexisting symlink targets before writing.
    const file = files.find(file => file.path === name);
    if (file) await fs.writeFile(path.join(to, name), file.data);
    else await fs.rm(path.join(to, name), { force: true });
  }
}
async function npmRun(args, { cwd, npm }) {
  const env = { ...process.env };
  for (const key of ['SERVICE_ROLE_KEY', 'SECRET_KEY', 'DB_URL']) delete env[key];
  await new Promise((resolve, reject) => {
    const child = spawn(npm, [...args, '--ignore-scripts', '--no-audit', '--no-fund'],
      { cwd, env, detached: true, stdio: ['ignore', 'inherit', 'inherit'] });
    const stop = () => { try { process.kill(-child.pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; } };
    const signals = new Map(['SIGINT', 'SIGTERM'].map(signal => [signal, () => {
      stop(); process.removeListener(signal, signals.get(signal)); process.kill(process.pid, signal);
    }]));
    for (const [signal, handler] of signals) process.on(signal, handler);
    const timer = setTimeout(stop, 600000);
    const cleanup = () => { clearTimeout(timer); for (const [signal, handler] of signals) process.removeListener(signal, handler); };
    child.once('error', error => { cleanup(); reject(error); });
    child.once('exit', code => { cleanup(); stop(); code === 0 ? resolve() : reject(new Error('npm operation failed; manifests were not copied back')); });
  });
}
export class Dependencies {
  constructor({ workspace = '/workspace', cache = '/home/supa/dependencies', npm = '/usr/bin/npm', run } = {}) {
    this.workspace = workspace; this.cache = cache;
    this.run = run ?? ((args, options) => npmRun(args, { ...options, npm }));
  }
  async busy() {
    const lock = await fs.lstat(this.cache + '.lock').catch(error => { if (error.code === 'ENOENT') return null; throw error; });
    if (!lock) return false;
    if (!lock.isDirectory()) throw new Error('Dependency lock must be a real directory');
    let pid;
    try { pid = Number(await fs.readFile(path.join(this.cache + '.lock', 'pid'), 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') return true; throw error; }
    if (!Number.isSafeInteger(pid) || pid < 1) return true;
    try { process.kill(pid, 0); return true; }
    catch (error) { if (error.code === 'ESRCH') return false; throw error; }
  }
  async lock(fn) {
    const lock = this.cache + '.lock', acquisition = lock + '.acquire';
    await fs.mkdir(this.cache, { recursive: true }); await directory(this.cache);
    // Serialize every acquisition, not just recovery: no fresh owner may enter
    // between a stale observation and removal of that stale directory.
    await fs.mkdir(acquisition).catch(error => {
      if (error.code === 'EEXIST') throw new Error('Dependency lock acquisition is running or was interrupted');
      throw error;
    });
    let acquired = false;
    try {
      try { await fs.mkdir(lock); }
      catch (error) {
        if (error.code !== 'EEXIST') throw error;
        if (await this.busy()) throw new Error('A dependency operation is already running; wait before syncing or installing');
        await fs.rm(lock, { recursive: true, force: true }); await fs.mkdir(lock);
      }
      acquired = true;
      await fs.writeFile(path.join(lock, 'pid'), String(process.pid));
    } catch (error) {
      if (acquired) await fs.rm(lock, { recursive: true, force: true });
      throw error;
    } finally { await fs.rm(acquisition, { recursive: true, force: true }); }
    try { return await fn(); }
    finally { await fs.rm(lock, { recursive: true, force: true }); }
  }
  async manifests() { return manifests(this.workspace); }
  async link() {
    await fs.rm(path.join(this.workspace, 'node_modules'), { recursive: true, force: true });
    await fs.symlink(path.join(this.cache, 'node_modules'), path.join(this.workspace, 'node_modules'));
  }
  async install(args) {
    await this.lock(async () => {
      await copy(this.workspace, this.cache);
      await fs.writeFile(path.join(this.cache, '.snowglobe-install-incomplete'), 'incomplete');
      await this.run(args, { cwd: this.cache });
      await copy(this.cache, this.workspace);
      await fs.rm(path.join(this.cache, '.snowglobe-install-incomplete'), { force: true });
      await this.link();
    });
  }
  async ensure() {
    await this.lock(async () => {
      const source = await manifests(this.workspace);
      let installed = [];
      try { installed = await manifests(this.cache); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      const matches = source.length === installed.length && source.every(file => {
        const cached = installed.find(entry => entry.path === file.path); return cached && file.data.equals(cached.data);
      });
      const incomplete = await fs.access(path.join(this.cache, '.snowglobe-install-incomplete')).then(() => true, () => false);
      const modules = await fs.lstat(path.join(this.cache, 'node_modules')).catch(() => null);
      if (!matches || incomplete || !modules?.isDirectory()) {
        await copy(this.workspace, this.cache);
        await fs.writeFile(path.join(this.cache, '.snowglobe-install-incomplete'), 'incomplete');
        await this.run(['install'], { cwd: this.cache });
        await copy(this.cache, this.workspace);
        await fs.rm(path.join(this.cache, '.snowglobe-install-incomplete'), { force: true });
      }
      await this.link();
    });
  }
}
