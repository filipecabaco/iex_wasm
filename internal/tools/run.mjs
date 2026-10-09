// Restores a built snowglobe site headlessly and connects its app console to the terminal:
//
//   node run.mjs <site dir> [--blobs <dir>] [--detached]
//
// Interactive (a TTY): raw keys in, the screen out, ctrl-] quits. Piped: each line of stdin is
// typed into the app in turn, waiting for it to go quiet, and the run ends after the last one.
// Detached: nothing local; clients join over the control socket (client.mjs: attach, exec).
//
// Everything the guest is configured with must match the page that made the snapshot.

import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import vm from "node:vm";
import zlib from "node:zlib";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const { values: options, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    blobs: { type: "string" },
    detached: { type: "boolean", default: false },
    socket: { type: "string", default: "/tmp/snowglobe.sock" },
  },
});
const [site] = positionals;
if (!site) {
  console.error("usage: node run.mjs <site dir> [--blobs dir] [--detached]");
  process.exit(2);
}

const V86_DIR = "/tools/node_modules/v86/build";
const DETACH_KEY = 0x1d; // ctrl-]
// A command is done once the app has neither printed nor read a file for this long
const QUIET_MS = 1200;
const COMMAND_CAP_MS = 5 * 60 * 1000;

const run = JSON.parse(fs.readFileSync(path.join(site, "run.json"), "utf8"));
const system = path.join(site, "system");
const ownBlobs = path.join(system, "filesystem");
// A pooled site keeps its blobs in a store shared with its neighbours
const baseurl = (fs.existsSync(ownBlobs) ? ownBlobs : options.blobs) + "/";

const { V86 } = await import(pathToFileURL(path.join(V86_DIR, "libv86.mjs")).href);
const state = zlib.zstdDecompressSync(fs.readFileSync(path.join(system, "state.bin.zst")));

const started = Date.now();
const emulator = new V86({
  wasm_path: path.join(V86_DIR, "v86.wasm"),
  bios: { url: path.join(site, "bios/seabios.bin") },
  vga_bios: { url: path.join(site, "bios/vgabios.bin") },
  memory_size: run.memory_mb * 1024 * 1024,
  vga_memory_size: 8 * 1024 * 1024,
  virtio_console: true,
  ...(run.network === "fetch" ? { net_device: { type: "virtio", relay_url: "fetch" } } : {}),
  filesystem: { basefs: { url: path.join(system, "filesystem.json") }, baseurl },
  initial_state: { buffer: state.buffer.slice(state.byteOffset, state.byteOffset + state.byteLength) },
  autostart: true,
  screen_dummy: true,
});

// A request the guest is waiting on is activity too: the console is quiet while it's in flight
let inFlight = 0;
const realFetch = globalThis.fetch;
globalThis.fetch = async (...args) => {
  inFlight++;
  try {
    return await realFetch(...args);
  } finally {
    inFlight--;
    lastActivity = Date.now();
  }
};

// HTTPS and WebSockets go through the same bridge the page uses
if (run.network === "fetch" && fs.existsSync(path.join(site, "https-bridge.js"))) {
  vm.runInThisContext(fs.readFileSync(path.join(site, "https-bridge.js"), "utf8"));
  globalThis.SnowglobeHTTPS.attach(emulator, JSON.parse(fs.readFileSync(path.join(system, "tls.json"), "utf8")));
}

// ---- the console ----

let screen = Buffer.alloc(0); // everything the app printed since the restore
let lastActivity = Date.now();
const watchers = new Set(); // (bytes) => void
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

emulator.add_listener("virtio-console0-output-bytes", (bytes) => {
  const chunk = Buffer.from(bytes);
  screen = Buffer.concat([screen, chunk]).subarray(-1 << 20);
  lastActivity = Date.now();
  for (const watch of watchers) watch(chunk);
});

// Reading a file the first time is activity too: a quiet console may be a runtime loading modules
emulator.add_listener("emulator-loaded", () => {
  const storage = emulator.fs9p?.storage;
  if (!storage?.load_from_server) return;
  const load = storage.load_from_server.bind(storage);
  storage.load_from_server = (name, size) => {
    lastActivity = Date.now();
    return load(name, size);
  };
});

const ready = new Promise((resolve) => emulator.add_listener("emulator-started", resolve));

// v86 drops console input when the guest has no receive buffer queued: send in small chunks, only
// when one is free, in order
let typing = Promise.resolve();
function type(bytes) {
  typing = typing.then(async () => {
    await ready;
    const rx = emulator.v86?.cpu?.devices?.virtio_console?.virtio?.queues?.[0];
    for (let i = 0; i < bytes.length; i += 64) {
      while (rx && !rx.has_request()) await sleep(5);
      emulator.bus.send("virtio-console0-input-bytes", new Uint8Array(bytes.subarray(i, i + 64)));
    }
    lastActivity = Date.now();
  });
  return typing;
}

// v86 0.5.462 forwards the pair as-is into Linux's resize message, which is rows-first
const resize = (rows, cols) => rows && cols && emulator.bus.send("virtio-console0-resize", [rows, cols]);

async function quiet() {
  const since = Date.now();
  await typing;
  while ((inFlight > 0 || Date.now() - lastActivity < QUIET_MS) && Date.now() - since < COMMAND_CAP_MS) await sleep(100);
}

// Terminal queries (cursor position, device attributes) have no terminal to answer them when the
// output goes to a pipe
const withoutQueries = (text) => text.replace(/\x1b\[[0-9]*n|\x1b\[[>=]?[0-9]*c/g, "");

// Text without terminal control sequences, for a pipe or a comparison
export const plain = (text) => text.replace(/\x1b\[[0-9;?]*[ -\/]*[@-~]|\x1b[()][0-9A-Za-z]|\x1b[=>]|\r/g, "");

// One command typed into the app, and what it printed: the echoed command line and the prompt
// left waiting after it are the terminal's, not the command's, so they're cut
let commands = Promise.resolve();
function exec(command) {
  const result = commands.then(async () => {
    await ready;
    const from = screen.length;
    await type(Buffer.from(command.replace(/\n$/, "") + "\r"));
    await quiet();
    const output = withoutQueries(screen.subarray(Math.min(from, screen.length)).toString("utf8"));
    // Line editors echo the command and often redraw it with the prompt (IEx, Node): every leading
    // line that ends with the command is that echo
    const lines = output.split("\n");
    const typed = command.trim();
    while (lines.length > 1 && plain(lines[0]).trimEnd().endsWith(typed)) lines.shift();
    lines.pop(); // the prompt now waiting for the next command
    return lines.length ? lines.join("\n") + "\n" : "";
  });
  commands = result.catch(() => {});
  return result;
}

// What the screen shows now: everything after the last clear
function currentScreen() {
  const persisted = fs.readFileSync(path.join(system, "console.bin"));
  const all = Buffer.concat([persisted, screen]);
  let start = 0;
  for (const seq of ["\x1b[2J", "\x1b[H\x1b[J", "\x1bc"]) {
    const at = all.lastIndexOf(seq);
    if (at >= 0) start = Math.max(start, at + seq.length);
  }
  return all.subarray(start);
}

// ---- the control socket: attach and exec from other sessions ----

fs.rmSync(options.socket, { force: true });
net.createServer((socket) => {
  let header = "";
  const onHeader = (data) => {
    header += data.toString("utf8");
    const end = header.indexOf("\n");
    if (end < 0) return;
    socket.off("data", onHeader);
    const request = JSON.parse(header.slice(0, end));
    const rest = Buffer.from(header.slice(end + 1), "utf8");

    if (request.mode === "exec") {
      exec(request.command).then((output) => socket.end(output), (error) => socket.end(`snowglobe: ${error}\n`));
    } else if (request.mode === "attach") {
      resize(request.rows, request.cols);
      socket.write(currentScreen());
      const watch = (chunk) => socket.write(chunk);
      watchers.add(watch);
      socket.on("data", (bytes) => type(bytes));
      if (rest.length) type(rest);
      socket.on("close", () => watchers.delete(watch));
    } else {
      socket.end("snowglobe: unknown request\n");
    }
  };
  socket.on("data", onHeader);
  socket.on("error", () => {});
}).listen(options.socket);

// ---- the local terminal ----

await ready;

if (options.detached) {
  console.log(`restored ${run.title} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
} else if (process.stdin.isTTY) {
  process.stderr.write(`\x1b[2m${run.title}: restored in ${((Date.now() - started) / 1000).toFixed(1)}s · ctrl-] quits\x1b[0m\r\n`);
  process.stdout.write(currentScreen());
  watchers.add((chunk) => process.stdout.write(chunk));
  resize(process.stdout.rows, process.stdout.columns);
  process.stdout.on("resize", () => resize(process.stdout.rows, process.stdout.columns));
  process.stdin.setRawMode(true);
  process.stdin.on("data", (bytes) => {
    if (bytes.includes(DETACH_KEY)) stop(0);
    type(bytes);
  });
} else {
  // Piped: each line is a command; print what it printed, then end after the last one
  let pending = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (text) => {
    pending += text;
    let newline;
    while ((newline = pending.indexOf("\n")) >= 0) {
      const line = pending.slice(0, newline);
      pending = pending.slice(newline + 1);
      exec(line).then((output) => process.stdout.write(plain(output)));
    }
  });
  process.stdin.on("end", async () => {
    if (pending.trim()) process.stdout.write(plain(await exec(pending)));
    await commands;
    stop(0);
  });
}

function stop(code) {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  emulator.destroy();
  process.exit(code);
}
process.on("SIGTERM", () => stop(0));
process.on("SIGINT", () => stop(130));
