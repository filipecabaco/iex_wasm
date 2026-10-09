#!/usr/bin/env node
// Boots the 9p rootfs in v86 until the app is up on the virtio console, then saves a
// zstd-compressed snapshot so the browser restores straight into the running app instead of
// booting Linux.
//
//   node build-state.mjs <v86 dir> <bios dir> <system dir> [--memory MB] [--ready TEXT]
//                        [--exercise COMMAND ...]
//
// --memory defaults to 512. Without --ready, the app counts as ready once its console output has
// been quiet for a few seconds.
//
// Reads <system dir>/filesystem.json + filesystem/; writes <system dir>/state.bin.zst,
// console.bin (the app's console output so far, which the page replays into the terminal) and
// reads.json: every file the guest read while booting, and while running each --exercise command
// typed in after the snapshot was saved. The guest is then in exactly the state a visitor's tab
// starts from, so exercise reads are what a visitor would otherwise wait on the network for.
// The serial port (ttyS0) carries boot logs and a root shell used for housekeeping; the app runs
// on the virtio console (hvc0), which is what the browser attaches xterm.js to.
// Runs headless in CI; on a TTY, keystrokes are forwarded to the serial console (Ctrl+C aborts).

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const { values: options, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    memory: { type: "string", default: "512" },
    ready: { type: "string" },
    exercise: { type: "string", multiple: true, default: [] },
  },
});
const [v86Dir, biosDir, systemDir] = positionals;
if (!systemDir) {
  console.error("usage: node build-state.mjs <v86 dir> <bios dir> <system dir> [--memory MB] [--ready TEXT]");
  process.exit(1);
}

const TIMEOUT_MS = 20 * 60 * 1000;
const QUIET_MS = 5000;
// An exercise command is done once its output has been quiet this long (or after the cap)
const EXERCISE_QUIET_MS = 2500;
const EXERCISE_CAP_MS = 3 * 60 * 1000;
// Must match memory_size in the page: the snapshot is only valid for the same RAM size
const MEMORY_SIZE = Number(options.memory) * 1024 * 1024;
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

// Record every file the guest reads, by phase: while booting the app will want them again after a
// restore (the snapshot is taken with the page cache dropped), and while exercising they are
// exactly what a visitor's first commands would fetch
const reads = { boot: new Set(), exercise: {} };
let readPhase = reads.boot;
// fs9p only exists once v86's wasm has loaded; the guest starts running after this event
emulator.add_listener("emulator-loaded", () => {
  // Without this the console reports 0x0 until the page resizes it, and line editors that don't
  // follow later resizes (Java's jshell) garble their input. v86 0.5.462 forwards [rows, cols]
  emulator.bus.send("virtio-console0-resize", [36, 120]);

  const storage = emulator.fs9p?.storage;
  if (!storage?.load_from_server) return console.error("warning: can't record boot reads");
  const load = storage.load_from_server.bind(storage);
  storage.load_from_server = (name, size) => {
    readPhase.add(name);
    return load(name, size);
  };
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
let lastOutput = Date.now();
emulator.add_listener("virtio-console0-output-bytes", (bytes) => {
  console0 = Buffer.concat([console0, Buffer.from(bytes)]);
  lastOutput = Date.now();
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
  fs.writeFileSync(path.join(systemDir, "console.bin"), withoutProgressReports(withoutQueries(screenSinceLastClear(console0))));
  console.error(`Saved ${OUTPUT_FILE} (${compressed.length >> 20} MB)`);

  await exercise();

  const json = { boot: [...reads.boot], exercise: {} };
  for (const [command, names] of Object.entries(reads.exercise)) json.exercise[command] = [...names];
  fs.writeFileSync(path.join(systemDir, "reads.json"), JSON.stringify(json));
  stop(0);
}

// Type each command into the app as a visitor would, after the snapshot is safely written, and
// record what it reads
async function exercise() {
  const encoder = new TextEncoder();
  const rx = emulator.v86?.cpu?.devices?.virtio_console?.virtio?.queues?.[0];

  for (const command of options.exercise) {
    readPhase = reads.exercise[command] = new Set();
    const started = Date.now();
    process.stderr.write(`\nExercising: ${command}`);

    // One guest receive buffer per message, like the page's input queue
    for (const chunk of (command + "\r").match(/[^]{1,64}/g)) {
      while (rx && !rx.has_request()) await sleep(5);
      emulator.bus.send("virtio-console0-input-bytes", encoder.encode(chunk));
    }

    lastOutput = Date.now();
    while (Date.now() - lastOutput < EXERCISE_QUIET_MS && Date.now() - started < EXERCISE_CAP_MS) {
      await sleep(250);
    }
    process.stderr.write(` (${readPhase.size} files, ${((Date.now() - started) / 1000).toFixed(1)}s)`);
  }
  if (options.exercise.length) process.stderr.write("\n");
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

// On the slow emulated boot, an OTP "application started" progress report can slip out before
// Elixir's Logger installs the filter that normally hides it. It's noise, so keep it off the
// replayed screen (the release's own logging is untouched)
function withoutProgressReports(output) {
  const text = output.toString("latin1").replace(/=PROGRESS REPORT====[^]*?\r?\n\r?\n/g, "");
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
