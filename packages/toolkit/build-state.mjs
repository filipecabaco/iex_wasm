#!/usr/bin/env node
// Boots the 9p rootfs in v86 until the app is up on the virtio console, then saves a
// zstd-compressed snapshot so the browser restores straight into the running app instead of
// booting Linux.
//
//   node build-state.mjs <v86 dir> <bios dir> <system dir> [options json]
//
// Options: {"memoryMb": 512, "ready": "iex(1)> "}. Without "ready", the app counts as ready once
// its console output has been quiet for a few seconds.
//
// Reads <system dir>/filesystem.json + filesystem/; writes <system dir>/state.bin.zst and
// console.bin, the app's console output so far, which the page replays into the terminal.
// The serial port (ttyS0) carries boot logs and a root shell used for housekeeping; the app runs
// on the virtio console (hvc0), which is what the browser attaches xterm.js to.
// Runs headless in CI; on a TTY, keystrokes are forwarded to the serial console (Ctrl+C aborts).

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { pathToFileURL } from "node:url";

const [v86Dir, biosDir, systemDir, optionsJson = "{}"] = process.argv.slice(2);
if (!systemDir) {
  console.error("usage: node build-state.mjs <v86 dir> <bios dir> <system dir> [options json]");
  process.exit(1);
}
const options = JSON.parse(optionsJson);

const TIMEOUT_MS = 20 * 60 * 1000;
const QUIET_MS = 5000;
// Must match memory_size in the page: the snapshot is only valid for the same RAM size
const MEMORY_SIZE = (options.memoryMb ?? 512) * 1024 * 1024;
const OUTPUT_FILE = path.join(systemDir, "state.bin.zst");

const { V86 } = await import(pathToFileURL(path.join(v86Dir, "libv86.mjs")).href);

const emulator = new V86({
  wasm_path: path.join(v86Dir, "v86.wasm"),
  bios: { url: path.join(biosDir, "seabios.bin") },
  vga_bios: { url: path.join(biosDir, "vgabios.bin") },
  autostart: true,
  memory_size: MEMORY_SIZE,
  vga_memory_size: 8 * 1024 * 1024,
  bzimage_initrd_from_filesystem: true,
  // Must match the browser config: the snapshot includes this device
  virtio_console: true,
  // init_on_free=on zeroes freed pages, which makes the snapshot compress far better
  cmdline:
    "rw root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose modules=virtio_pci " +
    "tsc=reliable console=ttyS0 init_on_free=on",
  filesystem: {
    basefs: { url: path.join(systemDir, "filesystem.json") },
    baseurl: path.join(systemDir, "filesystem") + "/",
  },
  screen_dummy: true,
});

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (c) => (c === "\u0003" ? fail("aborted") : emulator.serial0_send(c)));
}

const timeout = setTimeout(() => fail(`app not ready after ${TIMEOUT_MS / 1000}s`), TIMEOUT_MS);
const bootStart = Date.now();
let serial = "";
let shellReady = false;
let appReady = false;
let phase = "booting";

console.error("Booting, please stand by ...");

emulator.add_listener("serial0-output-byte", (byte) => {
  const c = String.fromCharCode(byte);
  process.stdout.write(c);
  serial += c;

  if (!shellReady && serial.endsWith("# ")) {
    shellReady = true;
    maybeSave();
  }

  // The marker is computed by the shell, so the echoed command line itself can't match it
  if (phase === "dropping" && serial.includes("CACHES_42")) {
    phase = "saving";
    save().catch((e) => fail(e.stack));
  }
});

let console0 = Buffer.alloc(0);
let quietTimer = null;
emulator.add_listener("virtio-console0-output-bytes", (bytes) => {
  console0 = Buffer.concat([console0, Buffer.from(bytes)]);
  if (appReady) return;

  if (options.ready) {
    if (console0.includes(options.ready)) markReady();
  } else {
    clearTimeout(quietTimer);
    quietTimer = setTimeout(markReady, QUIET_MS);
  }
});

function markReady() {
  appReady = true;
  console.error(`\nApp ready on hvc0 after ${(Date.now() - bootStart) / 1000}s`);
  maybeSave();
}

// Drop the page cache so boot-time file contents aren't baked into the snapshot
function maybeSave() {
  if (phase !== "booting" || !shellReady || !appReady) return;
  phase = "dropping";
  serial = "";
  emulator.serial0_send("sync; echo 3 > /proc/sys/vm/drop_caches; echo CACHES_$((40+2))\n");
}

async function save() {
  const state = new Uint8Array(await emulator.save_state());
  console.error(`\nCompressing ${state.byteLength >> 20} MB snapshot ...`);
  const compressed = zlib.zstdCompressSync(state, {
    params: { [zlib.constants.ZSTD_c_compressionLevel]: 19 },
  });
  fs.writeFileSync(OUTPUT_FILE, compressed);
  fs.writeFileSync(path.join(systemDir, "console.bin"), withoutQueries(screenSinceLastClear(console0)));
  console.error(`Saved ${OUTPUT_FILE} (${compressed.length >> 20} MB)`);
  stop(0);
}

// What the terminal shows right now: everything after the last "clear screen" sequence
function screenSinceLastClear(output) {
  let start = 0;
  // ESC[2J is the usual clear; BusyBox's `clear` homes the cursor and erases down instead
  for (const seq of ["\x1b[2J", "\x1b[H\x1b[J", "\x1bc"]) {
    const at = output.lastIndexOf(seq);
    if (at >= 0) start = Math.max(start, at + seq.length);
  }
  return output.subarray(start);
}

// Terminal queries (cursor position, device attributes) were asked of a terminal that no longer
// exists; replayed, xterm.js would answer them and the answer would reach the app as typed input
function withoutQueries(output) {
  const text = output.toString("latin1").replace(/\x1b\[[0-9]*n|\x1b\[[>=]?[0-9]*c/g, "");
  return Buffer.from(text, "latin1");
}

function fail(reason) {
  console.error(`\nbuild-state failed: ${reason}`);
  stop(1);
}

function stop(code) {
  clearTimeout(timeout);
  emulator.destroy();
  process.exit(code);
}
