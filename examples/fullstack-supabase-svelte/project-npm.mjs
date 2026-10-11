#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { Dependencies } from './dependencies.mjs';
export async function projectNpm(args, { cwd = process.cwd(), workspace = '/workspace', cache = '/home/supa/dependencies', npm = '/usr/bin/npm' } = {}) {
  const managed = ['install', 'i', 'add', 'uninstall', 'remove', 'rm', 'ci'].includes(args[0]);
  if (cwd === workspace && managed) {
    if (args.some(arg => /^(--prefix(?:=|$)|-C$|--global(?:=|$)|-g$|--location(?:=|$))/.test(arg))) {
      throw new Error('Workspace npm operations manage their own cache; prefix/global overrides are not supported');
    }
    await new Dependencies({ workspace, cache, npm }).install(args);
    console.log('\nDependencies updated in the VM cache (not your disk node_modules).');
    console.log('Click Save package manifests to disk before the next sync to preserve package.json and package-lock.json.');
    return 0;
  }
  return new Promise((resolve, reject) => {
    const child = spawn(npm, args, { cwd, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', code => resolve(code ?? 1));
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { process.exitCode = await projectNpm(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
