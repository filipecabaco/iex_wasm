// The parts of the benchmark that are plain data: statistics over repetitions, comparing a run
// with main's, and the markdown tables. run.mjs measures; report.mjs renders; tests in lib.test.mjs.

export const SCHEMA = 1;

// The table's metrics, [scenario, key, label, unit]; the verdict counts these. Lower is better
export const METRICS = [
  ["cold", "running_ms", "cold", "ms"],
  ["warm", "running_ms", "warm", "ms"],
  ["throttled", "running_ms", "4G cold", "ms"],
  ["workload", "total_ms", "workload", "ms"],
];

// What the details show besides: downloads, requests and the JS heap
export const DETAILS = [
  ["cold", "bytes", "cold downloaded", "bytes"],
  ["cold", "requests", "cold requests", "count"],
  ["warm", "bytes", "warm downloaded", "bytes"],
  ["warm", "requests", "warm requests", "count"],
  ["warm", "sw_served", "warm from the service worker", "count"],
  ["throttled", "bytes", "4G downloaded", "bytes"],
  ["cold", "heap_peak_bytes", "cold JS heap (peak)", "bytes"],
];

// Changes smaller than this never count, whatever the ranges say: times differ by up to ~13%
// between two shared runners on the same build (every command a little slower on one), counts and
// sizes much less
export const NOISE_FLOOR = { ms: 0.15, other: 0.1 };

export function stats(values) {
  const v = values.filter((x) => typeof x === "number" && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const mid = v.length >> 1;
  const median = v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
  return { median, min: v[0], max: v[v.length - 1], n: v.length };
}

// { metric: stats } over a scenario's repetitions (each a flat object of numbers)
export function summarize(reps) {
  const keys = new Set();
  for (const r of reps) for (const [k, v] of Object.entries(r)) if (typeof v === "number") keys.add(k);
  const out = {};
  for (const k of keys) {
    const s = stats(reps.map((r) => r[k]));
    if (s) out[k] = s;
  }
  return out;
}

// Per-command workload statistics, keyed by the command, in the order first seen
export function summarizeCommands(reps) {
  const order = [];
  const times = new Map();
  for (const r of reps) {
    for (const c of r.commands ?? []) {
      if (!times.has(c.command)) { times.set(c.command, []); order.push(c.command); }
      times.get(c.command).push(c.ms);
    }
  }
  return order.map((command) => ({ command, ...stats(times.get(command)) }));
}

export function metric(result, scenario, key) {
  return result?.scenarios?.[scenario]?.summary?.[key] ?? null;
}

// How a current median compares with the baseline: the change, and whether it counts. It does
// only when no visit of this run overlaps main's (this run's min–max is clear of main's) and the
// medians differ by at least the noise floor for the unit
export function compare(current, baseline, unit = "ms") {
  if (!current || !baseline || !baseline.median) return null;
  const delta = (current.median - baseline.median) / baseline.median;
  const apart = (current.min ?? current.median) > baseline.max || (current.max ?? current.median) < baseline.min;
  const floor = unit === "ms" ? NOISE_FLOOR.ms : NOISE_FLOOR.other;
  let verdict = "same";
  if (apart && Math.abs(delta) >= floor) verdict = delta > 0 ? "worse" : "better";
  return { delta, verdict };
}

export function formatValue(value, unit) {
  if (value == null) return "–";
  if (unit === "ms") return value >= 10000 ? `${(value / 1000).toFixed(1)} s` : value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`;
  if (unit === "bytes") {
    if (value >= 1 << 30) return `${(value / (1 << 30)).toFixed(2)} GB`;
    if (value >= 1 << 20) return `${(value / (1 << 20)).toFixed(1)} MB`;
    if (value >= 1 << 10) return `${(value / (1 << 10)).toFixed(0)} KB`;
    return `${value} B`;
  }
  return String(Math.round(value * 10) / 10);
}

function delta(current, baseline, unit) {
  const c = compare(current, baseline, unit);
  if (!c) return "";
  const mark = c.verdict === "worse" ? " 🔺" : c.verdict === "better" ? " 🟢" : "";
  return ` (${c.delta >= 0 ? "+" : ""}${(c.delta * 100).toFixed(0)}%${mark})`;
}

function cell(current, baseline, unit) {
  return current ? formatValue(current.median, unit) + delta(current, baseline, unit) : "–";
}

function range(s, unit) {
  return s ? `${formatValue(s.min, unit)} – ${formatValue(s.max, unit)}` : "–";
}

const bySite = (results) => [...results].sort((a, b) => a.site.localeCompare(b.site));

// One row per site: each metric's median and, against main, its change, marked 🔺 (worse) or
// 🟢 (better) only when every visit is clear of main's min–max and the change is past the noise floor
export function table(results, baselines = {}, metrics = METRICS) {
  const shown = metrics.filter(([s, k]) => results.some((r) => metric(r, s, k)));
  const head = `| demo | ${shown.map(([, , label]) => label).join(" | ")} |`;
  const rule = `|---|${shown.map(() => "---:").join("|")}|`;
  const rows = bySite(results).map((r) => {
    const cells = shown.map(([s, k, , unit]) => cell(metric(r, s, k), metric(baselines[r.site], s, k), unit));
    return `| ${r.site}${r.errors?.length ? " ⚠️" : ""} | ${cells.join(" | ")} |`;
  });
  return [head, rule, ...rows].join("\n");
}

// The spread behind each median: this run's min–max, and main's
function spread(results, baselines) {
  const shown = [...METRICS, ...DETAILS].filter(([s, k]) => results.some((r) => metric(r, s, k)));
  const lines = ["| demo | metric | this run (median) | this run (min – max) | main (median) | main (min – max) |", "|---|---|---:|---:|---:|---:|"];
  for (const r of bySite(results)) {
    for (const [s, k, label, unit] of shown) {
      const cur = metric(r, s, k);
      if (!cur) continue;
      const base = metric(baselines[r.site], s, k);
      lines.push(`| ${r.site} | ${label} | ${cell(cur, base, unit)} | ${range(cur, unit)} | ${base ? formatValue(base.median, unit) : "–"} | ${range(base, unit)} |`);
    }
  }
  return lines.join("\n");
}

export function verdicts(results, baselines = {}) {
  const out = [];
  for (const r of results) {
    for (const [s, k, label, unit] of METRICS) {
      const c = compare(metric(r, s, k), metric(baselines[r.site], s, k), unit);
      if (c && c.verdict !== "same") out.push({ site: r.site, label, ...c });
    }
  }
  return out;
}

export const MARKER = "<!-- snowglobe-bench -->";

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const short = (sha) => (sha ? `\`${sha.slice(0, 7)}\`` : null);

// The verdict, in one line
export function headline(results, baselines = {}) {
  if (!Object.keys(baselines).length) return "No baseline from main yet: absolute numbers below.";
  const v = verdicts(results, baselines);
  if (!v.length) return "No significant change: everything is within main's run-to-run range.";
  const worse = v.filter((x) => x.verdict === "worse").length;
  return `${plural(worse, "regression", "regressions")}, ${plural(v.length - worse, "improvement", "improvements")} beyond main's run-to-run range.`;
}

// The whole report (the pull request comment): the verdict, the table, what was compared, then
// downloads, spreads and per-command workload times folded away, and any errors
export function report(results, baselines = {}, meta = {}) {
  const lines = [MARKER, "## Benchmark", "", `**${headline(results, baselines)}**`, "", table(results, baselines), ""];
  const reps = results[0]?.config;
  lines.push([
    meta.sha && `This run: ${short(meta.sha)}`,
    meta.armlessRef && `armless \`${meta.armlessRef}\``,
    meta.baseline && `main: ${short(meta.baseline)}`,
    reps && `medians of ${reps.reps} visits (${reps.throttled_reps} on 4G)`,
    meta.runUrl && `[run](${meta.runUrl})`,
  ].filter(Boolean).join(" · "));
  lines.push("", "<sub>*cold*: a first visit (fresh profile), from opening the page to a live terminal (the snapshot restored, the screen replayed). *warm*: a repeat visit, served by the service worker. *4G cold*: a first visit over 9 Mbit/s with +75 ms per request. *workload*: the demo's exercise commands typed in on a warm visit, each until it has finished printing. 🔺/🟢: every visit of this run clear of main's min–max, and ≥ 15% for times (≥ 10% for counts and sizes); shared runners differ by up to ~13% on the same build.</sub>");

  lines.push("", "<details><summary>Downloads and requests</summary>", "", table(results, baselines, DETAILS), "", "</details>");
  lines.push("", "<details><summary>Spread (min – max) of every metric</summary>", "", spread(results, baselines), "", "</details>");

  const details = [];
  for (const r of bySite(results)) {
    const commands = r.scenarios?.workload?.commands;
    if (!commands?.length) continue;
    const base = new Map((baselines[r.site]?.scenarios?.workload?.commands ?? []).map((c) => [c.command, c]));
    details.push(`**${r.site}**`, "", "| command | time | min – max |", "|---|---:|---:|");
    for (const c of commands) details.push(`| \`${c.command.replaceAll("|", "\\|").replaceAll("`", "'")}\` | ${cell(c, base.get(c.command), "ms")} | ${range(c, "ms")} |`);
    details.push("");
  }
  if (details.length) lines.push("", "<details><summary>Workload, per command</summary>", "", ...details, "</details>");

  if (meta.history?.length) lines.push("", `<details><summary>Earlier runs on this pull request (${meta.history.length})</summary>`, "", history(results, meta.history, meta.sha), "", "</details>");

  const errors = results.flatMap((r) => (r.errors ?? []).map((e) => `- **${r.site}**: ${e}`));
  if (errors.length) lines.push("", "⚠️ Some visits failed and are left out:", "", ...errors);
  return lines.join("\n") + "\n";
}

// This run and the pull request's earlier ones (runs written by report.mjs --combine), newest
// first: one table per demo with each run's medians, so a pull request's commits can be
// compared with each other without main
export function history(results, runs, sha) {
  const all = [{ sha, sites: Object.fromEntries(results.map((r) => [r.site, r])) }, ...runs.filter((r) => r.sha !== sha)];
  const out = [];
  for (const site of bySite(results).map((r) => r.site)) {
    const rows = all.filter((run) => run.sites?.[site]);
    if (rows.length < 2) continue;
    const shown = METRICS.filter(([s, k]) => rows.some((run) => metric(run.sites[site], s, k)));
    out.push(`**${site}**`, "", `| commit | ${shown.map(([, , label]) => label).join(" | ")} |`, `|---|${shown.map(() => "---:").join("|")}|`);
    for (const run of rows) {
      const cells = shown.map(([s, k, , unit]) => formatValue(metric(run.sites[site], s, k)?.median, unit));
      out.push(`| ${short(run.sha) ?? "?"}${run === all[0] ? " (this run)" : ""} | ${cells.join(" | ")} |`);
    }
    out.push("");
  }
  return out.length ? out.join("\n") : "No earlier run has the same demos.";
}

// A prompt-like ready text as a pattern: digits may change (iex(1)> becomes iex(2)>)
export function promptPattern(ready) {
  if (!ready || !ready.trim()) return null;
  const escaped = ready.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\d+/g, "\\d+");
  return new RegExp(escaped);
}

// Terminal output as text: escape sequences out
export function plain(text) {
  return text.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "").replace(/\x1b\][^\x07\x1b]*(\x07|\x1b\\)/g, "").replace(/\x1b[@-_]/g, "");
}

// Whether a command has finished: its prompt came back after the line it echoed
export function promptBack(output, pattern) {
  if (!pattern) return false;
  const text = plain(output);
  const newline = text.search(/[\r\n]/);
  return newline >= 0 && pattern.test(text.slice(newline + 1));
}

// "9000kbps,75ms" -> { bitsPerSecond, latencyMs }
export function parseThrottle(spec) {
  const m = /^(\d+(?:\.\d+)?)\s*(k|m)bps\s*,\s*(\d+)\s*ms$/i.exec(spec.trim());
  if (!m) throw new Error(`--throttle wants e.g. 9000kbps,75ms or 9mbps,75ms, not ${spec}`);
  return { bitsPerSecond: Number(m[1]) * (m[2].toLowerCase() === "m" ? 1e6 : 1e3), latencyMs: Number(m[3]) };
}
