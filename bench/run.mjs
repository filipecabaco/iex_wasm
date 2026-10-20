#!/usr/bin/env node
// Benchmarks built snowglobe sites in Chromium, end to end, the way a visitor uses them:
//
//   cold       a first visit: a fresh browser profile, no HTTP cache, no service worker
//   warm       a repeat visit in the same profile (saved workspaces cleared, caches kept)
//   throttled  a first visit over a 4G-like link
//   workload   on the warm visit, each of the site's exercise commands typed in, timed until it
//              has finished printing
//
//   node bench/run.mjs SITE_DIR [SITE_DIR ...] [options]
//
// A site is what `snowglobe build` writes; run `snowglobe pwa` on it first for the service worker
// the live demos have (the warm visit is then served from its cache). Writes OUT_DIR/<site>.json
// for each site and prints a table. Options:
//
//   --out-dir DIR        where the results go (bench-results)
//   --reps N             repetitions of cold, warm and the workload (3)
//   --throttled-reps N   repetitions of the throttled visit (--reps)
//   --scenarios LIST     any of cold,warm,throttled,workload (all)
//   --throttle SPEC      the slow link, e.g. 9mbps,75ms (9mbps,75ms)
//   --settle S           how long a cold visit stays open before the warm one, so its service
//                        worker can cache what it fetched (35; the page re-sends its list at 30 s)
//   --quiet MS           a command without its prompt back is done after this long without
//                        output or requests (3000)
//   --timeout S          per visit, until the terminal runs (240; ×4 throttled)
//   --name NAME          the site's name in the results (its directory's name); one site only
//   --retries N          retry a failed repetition this many times (1)
//   --headed             show the browser
//
// It exits non-zero only when the harness fails (a scenario with no repetition that worked), never
// because of the numbers.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { chromium } from "playwright";
import { promptBack, promptPattern, parseThrottle, report, SCHEMA, summarize, summarizeCommands } from "./lib.mjs";
import { serve } from "./server.mjs";

const { values: opt, positionals: sites } = parseArgs({
  allowPositionals: true,
  options: {
    "out-dir": { type: "string", default: "bench-results" },
    reps: { type: "string", default: "3" },
    "throttled-reps": { type: "string" },
    scenarios: { type: "string", default: "cold,warm,throttled,workload" },
    throttle: { type: "string", default: "9mbps,75ms" },
    settle: { type: "string", default: "35" },
    quiet: { type: "string", default: "3000" },
    timeout: { type: "string", default: "240" },
    name: { type: "string" },
    retries: { type: "string", default: "1" },
    headed: { type: "boolean", default: false },
  },
});
if (!sites.length) {
  console.error("usage: node bench/run.mjs SITE_DIR [SITE_DIR ...] [--reps N] [--out-dir DIR] ...");
  process.exit(2);
}
if (opt.name && sites.length > 1) {
  console.error("--name names one site");
  process.exit(2);
}

const reps = Number(opt.reps);
const throttledReps = Number(opt["throttled-reps"] ?? opt.reps);
const scenarios = new Set(opt.scenarios.split(",").map((s) => s.trim()).filter(Boolean));
for (const s of scenarios) if (!["cold", "warm", "throttled", "workload"].includes(s)) throw new Error(`unknown scenario ${s}`);
const throttle = parseThrottle(opt.throttle);
const settleMs = Number(opt.settle) * 1000;
const quietMs = Number(opt.quiet);
const timeoutMs = Number(opt.timeout) * 1000;
const retries = Number(opt.retries);
const COMMAND_CAP = 180_000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Before any page script: when the page publishes window.snowglobe, follow the guest's console
const hook = () => {
  const bench = (window.__bench = { last: 0, text: "", cmd: "", cmdLast: 0 });
  const decoder = new TextDecoder();
  let value;
  Object.defineProperty(window, "snowglobe", {
    configurable: true,
    get: () => value,
    set(v) {
      value = v;
      v?.emulator?.on("console", (bytes) => {
        const text = decoder.decode(bytes, { stream: true });
        bench.last = bench.cmdLast = Date.now();
        bench.text = (bench.text + text).slice(-20000);
        bench.cmd = (bench.cmd + text).slice(-200000);
      });
    },
  });
};

const browser = await chromium.launch({ headless: !opt.headed });
let failed = false;
const results = [];
try {
  for (const dir of sites) {
    const result = await benchSite(dir);
    results.push(result);
    await mkdir(opt["out-dir"], { recursive: true });
    await writeFile(path.join(opt["out-dir"], `${result.site}.json`), JSON.stringify(result, null, 2) + "\n");
  }
} finally {
  await browser.close();
}
const table = report(results);
await writeFile(path.join(opt["out-dir"], "summary.md"), table);
console.log("\n" + table);
process.exit(failed ? 1 : 0);

async function benchSite(dir) {
  const run = JSON.parse(await readFile(path.join(dir, "run.json"), "utf8"));
  const site = opt.name ?? path.basename(path.resolve(dir));
  const pattern = promptPattern(run.ready);
  const exercise = run.exercise ?? [];
  const server = await serve(dir);
  const origin = new URL(server.url).origin;
  const errors = [];
  const measured = { cold: [], warm: [], throttled: [], workload: [] };
  log(site, `${run.title} · ${run.cpus} CPU(s) · ${exercise.length} exercise command(s) · ${server.url}`);

  // A visit: open the page, wait for the terminal to run, count what it fetched
  async function visit(context, { clear = false, settle = 0, workload = false, label }) {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    const pageLog = [];
    page.on("console", (m) => pageLog.push(`${m.type()}: ${m.text()}`.slice(0, 300)));
    page.on("pageerror", (e) => pageLog.push(`pageerror: ${e.message}`.slice(0, 300)));
    const inflight = new Map();
    let lastNet = 0;
    let swServed = 0;
    page.on("request", (r) => inflight.set(r, Date.now()));
    const done = (r) => { inflight.delete(r); lastNet = Date.now(); };
    page.on("requestfinished", done);
    page.on("requestfailed", done);
    page.on("response", (r) => { if (r.fromServiceWorker()) swServed++; });
    // Requests that stay open (a long poll, a stream) don't hold up "idle" forever
    const netIdle = () => [...inflight.values()].every((t) => Date.now() - t > 15000);

    let heapPeak = 0;
    await cdp.send("Performance.enable");
    const heapTimer = setInterval(async () => {
      try {
        const { metrics } = await cdp.send("Performance.getMetrics");
        heapPeak = Math.max(heapPeak, metrics.find((m) => m.name === "JSHeapUsedSize")?.value ?? 0);
      } catch {}
    }, 500);

    const tail = async () => {
      const guest = await page.evaluate(() => window.__bench?.text ?? "").catch(() => "");
      return `\n  page: ${pageLog.slice(-8).join("\n        ")}\n  guest: ${JSON.stringify(guest.slice(-600))}`;
    };

    try {
      // A repeat visit keeps the caches and the service worker but not a saved workspace, which
      // would restore that instead of the site's snapshot
      if (clear) await cdp.send("Storage.clearDataForOrigin", { origin, storageTypes: "indexeddb,local_storage,file_systems" });
      server.take();
      const limit = label === "throttled" ? timeoutMs * 4 : timeoutMs;
      const t0 = Date.now();
      await page.goto(server.url, { waitUntil: "commit", timeout: limit });
      const state = await until(page, t0 + limit, () => {
        const status = document.getElementById("status")?.dataset.state;
        if (status === "error" || status === "stopped") return { error: document.getElementById("status").textContent };
        return performance.getEntriesByName("snowglobe:running").length ? { ok: true } : null;
      });
      if (!state) throw new Error(`${label}: the terminal wasn't running after ${limit / 1000} s${await tail()}`);
      if (state.error) throw new Error(`${label}: the page says "${state.error}"${await tail()}`);
      // The guest's first output (a redraw for the window's size, a full-screen app's next frame)
      await until(page, Date.now() + 3000, () => performance.getEntriesByName("snowglobe:first-output").length > 0 || null);
      const marks = await page.evaluate(() => {
        const at = (n) => performance.getEntriesByName("snowglobe:" + n)[0]?.startTime;
        return { origin: performance.timeOrigin, ready: at("ready"), running: at("running"), first: at("first-output") };
      });
      const since = (m) => (m == null ? undefined : Math.round(marks.origin + m - t0));
      // What it took to get running: until requests settle (the warm pack, the first files)
      const idleBy = Date.now() + 30000;
      while (Date.now() < idleBy && !(netIdle() && Date.now() - lastNet > 2000)) await sleep(100);
      const sent = server.take();
      const result = {
        ready_ms: since(marks.ready),
        running_ms: since(marks.running),
        first_output_ms: since(marks.first),
        requests: sent.requests,
        bytes: sent.bytes,
        not_modified: sent.notModified,
        sw_served: swServed,
        heap_peak_bytes: heapPeak || undefined,
      };
      if (settle) {
        const left = t0 + settle - Date.now();
        if (left > 0) await sleep(left);
      }
      let commands;
      if (workload) commands = await runWorkload(page, { netIdle, lastNet: () => lastNet, tail });
      return { result, commands };
    } finally {
      clearInterval(heapTimer);
      await page.close().catch(() => {});
    }
  }

  async function runWorkload(page, { netIdle, lastNet, tail }) {
    const out = [];
    for (const command of exercise) {
      const sent = Date.now();
      await page.evaluate((c) => {
        window.__bench.cmd = "";
        window.__bench.cmdLast = 0;
        window.snowglobe.emulator.console_input(c + "\r");
      }, command);
      let entry;
      while (!entry) {
        await sleep(50);
        const now = Date.now();
        const { cmd, cmdLast } = await page.evaluate(() => ({ cmd: window.__bench.cmd, cmdLast: window.__bench.cmdLast }));
        const last = Math.max(cmdLast, lastNet() > sent ? lastNet() : 0);
        if (cmdLast && promptBack(cmd, pattern) && now - last >= 300 && netIdle()) entry = { command, ms: last - sent, done: "prompt" };
        else if (cmdLast && now - last >= quietMs && netIdle()) entry = { command, ms: last - sent, done: "quiet" };
        else if (now - sent > COMMAND_CAP) throw new Error(`workload: "${command}" still going after ${COMMAND_CAP / 1000} s${await tail()}`);
      }
      out.push(entry);
    }
    return out;
  }

  // One repetition, retried on failure
  async function attempt(name, fn) {
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        const message = String(error?.message ?? error).split("\n").slice(0, 12).join("\n");
        log(site, `${name} failed${i < retries ? ", retrying" : ""}: ${message}`);
        if (i === retries) errors.push(`${name}: ${message.split("\n")[0]}`);
      }
    }
    return null;
  }

  const wantsWarm = scenarios.has("warm") || scenarios.has("workload");
  if (scenarios.has("cold") || wantsWarm) {
    for (let r = 1; r <= reps; r++) {
      await attempt(`rep ${r}`, async () => {
        const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        await context.addInitScript(hook);
        try {
          const cold = await visit(context, { label: "cold", settle: wantsWarm ? settleMs : 0 });
          let warm;
          if (wantsWarm) warm = await visit(context, { label: "warm", clear: true, workload: scenarios.has("workload") && exercise.length > 0 });
          if (scenarios.has("cold")) measured.cold.push(cold.result);
          if (scenarios.has("warm")) measured.warm.push(warm.result);
          if (warm?.commands) measured.workload.push({ total_ms: warm.commands.reduce((s, c) => s + c.ms, 0), commands: warm.commands });
          log(site, `rep ${r}: cold ${cold.result.running_ms} ms${warm ? `, warm ${warm.result.running_ms} ms` : ""}${warm?.commands ? `, workload ${measured.workload.at(-1).total_ms} ms` : ""}`);
        } finally {
          await context.close();
        }
      });
    }
  }
  if (scenarios.has("throttled")) {
    for (let r = 1; r <= throttledReps; r++) {
      await attempt(`throttled rep ${r}`, async () => {
        const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
        await context.addInitScript(hook);
        server.setThrottle(throttle);
        try {
          const { result } = await visit(context, { label: "throttled" });
          measured.throttled.push(result);
          log(site, `throttled rep ${r}: ${result.running_ms} ms`);
        } finally {
          server.setThrottle(null);
          await context.close();
        }
      });
    }
  }
  await server.close();

  const out = {
    schema: SCHEMA,
    site,
    title: run.title,
    cpus: run.cpus,
    network: run.network,
    snowglobe: run.snowglobe,
    built_at: run.built_at,
    measured_at: new Date().toISOString(),
    env: {
      sha: process.env.GITHUB_SHA,
      ref: process.env.GITHUB_REF,
      event: process.env.GITHUB_EVENT_NAME,
      armless_ref: process.env.ARMLESS_REF || undefined,
      runner: `${os.platform()} ${os.arch()}, ${os.cpus().length} × ${os.cpus()[0]?.model ?? "?"}`,
      browser: `chromium ${browser.version()}`,
    },
    config: { reps, throttled_reps: throttledReps, throttle: opt.throttle, settle_s: settleMs / 1000, quiet_ms: quietMs, scenarios: [...scenarios] },
    scenarios: {},
    errors,
  };
  for (const s of ["cold", "warm", "throttled"]) {
    if (!scenarios.has(s)) continue;
    out.scenarios[s] = { reps: measured[s], summary: summarize(measured[s]) };
    if (!measured[s].length) failed = true;
  }
  if (scenarios.has("workload") && exercise.length) {
    out.scenarios.workload = {
      reps: measured.workload,
      summary: summarize(measured.workload.map(({ total_ms }) => ({ total_ms }))),
      commands: summarizeCommands(measured.workload),
    };
    if (!measured.workload.length) failed = true;
  }
  return out;
}

// Evaluate fn in the page until it returns something, across the reload a site with several CPUs
// does on its first visit (the old page's context goes away mid-evaluation)
async function until(page, deadline, fn) {
  while (Date.now() < deadline) {
    try {
      const value = await page.evaluate(fn);
      if (value) return value;
    } catch (error) {
      if (!/context was destroyed|navigat|Target closed/i.test(String(error?.message))) throw error;
    }
    await sleep(100);
  }
  return null;
}

function log(site, message) {
  console.error(`[${new Date().toISOString().slice(11, 19)}] ${site}: ${message}`);
}
