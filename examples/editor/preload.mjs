import { z } from 'zod';
import * as fs from 'node:fs/promises';
import { createBridge } from './bridge.mjs';

globalThis.z = z;
globalThis.fs = fs;

// tsx loads NODE_OPTIONS in its parent and REPL child. Only the parent owns the bridge.
if (!process.env.SNOWGLOBE_EDITOR_BRIDGE_STARTED) {
  process.env.SNOWGLOBE_EDITOR_BRIDGE_STARTED = '1';
  const bridge = createBridge('/workspace');
  await new Promise((resolve, reject) => {
    bridge.once('error', reject);
    bridge.listen(8090, '0.0.0.0', resolve);
  });
  console.log(`
  TypeScript working-folder editor: tsx + Zod on Linux, emulated in this tab.

  Choose a working folder in the editor beside this terminal.
  Its ordinary disk files appear at /workspace. Save file writes to disk immediately.
  Disk contents replace /workspace on reload, independently of machine Save / restore.
  Terminal changes do NOT write back to disk in this first example.

  Try creating hello.ts in the editor, with: console.log("hello from disk");

    await fs.readdir("/workspace")
    await fs.readFile("/workspace/hello.ts", "utf8")
    await import("./hello.ts")

  fs (node:fs/promises) and z (Zod) are already loaded.
`);
}
