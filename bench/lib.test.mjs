import assert from "node:assert/strict";
import { test } from "node:test";
import { compare, DETAILS, formatValue, headline, history, MARKER, parseThrottle, plain, promptBack, promptPattern, report, stats, summarize, summarizeCommands, table } from "./lib.mjs";

const result = (site, cold, workload) => ({
  schema: 1,
  site,
  scenarios: {
    cold: { reps: [], summary: { running_ms: stats(cold), bytes: stats([1 << 20, 1 << 20, 1 << 20]) } },
    workload: workload && { reps: [], summary: { total_ms: stats(workload.total) }, commands: workload.commands },
  },
  errors: [],
});

test("stats: median, min, max over the numbers only", () => {
  assert.deepEqual(stats([3, 1, 2]), { median: 2, min: 1, max: 3, n: 3 });
  assert.deepEqual(stats([4, 1, undefined, 2, 3]), { median: 2.5, min: 1, max: 4, n: 4 });
  assert.equal(stats([]), null);
  assert.equal(stats([undefined, NaN]), null);
});

test("summarize: each numeric key across repetitions", () => {
  const s = summarize([{ a: 1, b: 10, note: "x" }, { a: 3, b: 30 }, { a: 2 }]);
  assert.deepEqual(s.a, { median: 2, min: 1, max: 3, n: 3 });
  assert.deepEqual(s.b, { median: 20, min: 10, max: 30, n: 2 });
  assert.equal(s.note, undefined);
});

test("summarizeCommands: per command, in the order typed", () => {
  const s = summarizeCommands([
    { commands: [{ command: "b", ms: 10 }, { command: "a", ms: 5 }] },
    { commands: [{ command: "b", ms: 30 }, { command: "a", ms: 7 }] },
  ]);
  assert.deepEqual(s.map((c) => [c.command, c.median]), [["b", 20], ["a", 6]]);
});

test("compare: only when the runs' ranges don't overlap, and past the floor for the unit", () => {
  const base = { median: 1000, min: 950, max: 1100 };
  assert.equal(compare({ median: 1200, min: 1050, max: 1250 }, base).verdict, "same"); // ranges overlap
  assert.equal(compare({ median: 1200, min: 1150, max: 1250 }, base).verdict, "worse");
  assert.equal(compare({ median: 800, min: 780, max: 820 }, base).verdict, "better");
  // a whole runner ~12% slower: apart, but under the 15% floor for times
  assert.equal(compare({ median: 1120, min: 1110, max: 1130 }, { median: 1000, min: 990, max: 1010 }).verdict, "same");
  // counts and sizes: 10%
  assert.equal(compare({ median: 1120, min: 1110, max: 1130 }, { median: 1000, min: 990, max: 1010 }, "bytes").verdict, "worse");
  // a median alone (no range) still compares
  assert.equal(compare({ median: 1200 }, base).verdict, "worse");
  assert.ok(Math.abs(compare({ median: 1200 }, base).delta - 0.2) < 1e-9);
  assert.equal(compare({ median: 5 }, null), null);
  assert.equal(compare(null, base), null);
});

test("formatValue", () => {
  assert.equal(formatValue(850.4, "ms"), "850 ms");
  assert.equal(formatValue(1234, "ms"), "1.23 s");
  assert.equal(formatValue(42000, "ms"), "42.0 s");
  assert.equal(formatValue(3 << 20, "bytes"), "3.0 MB");
  assert.equal(formatValue(2048, "bytes"), "2 KB");
  assert.equal(formatValue(null, "ms"), "–");
});

test("table: only metrics some site has, marks and deltas against the baseline", () => {
  const current = [result("python", [1000, 1100, 1200]), result("iex", [2000, 2100, 2200])];
  const baseline = { python: result("python", [700, 750, 800]), iex: result("iex", [2050, 2100, 2150]) };
  const t = table(current, baseline);
  const [head, , iex, python] = t.split("\n");
  assert.equal(head, "| demo | cold |");
  assert.match(python, /1\.10 s \(\+47% 🔺\)/);
  assert.match(iex, /2\.10 s \(\+0%\)/);
  assert.doesNotMatch(iex, /🔺|🟢/);
  const details = table(current, baseline, DETAILS);
  assert.match(details, /^\| demo \| cold downloaded \|$/m);
  assert.match(details, /^\| iex \| 1\.0 MB \(\+0%\) \|$/m);
});

test("headline: no baseline, no change, or the counts", () => {
  const base = { python: result("python", [2000, 2000, 2000]), iex: result("iex", [1000, 1000, 1000]) };
  assert.match(headline([result("python", [1, 1, 1])]), /No baseline from main yet/);
  assert.match(headline([result("python", [2000, 2000, 2000])], base), /^No significant change/);
  assert.equal(headline([result("python", [1000, 1000, 1000]), result("iex", [1500, 1500, 1500])], base),
    "1 regression, 1 improvement beyond main's run-to-run range.");
  assert.equal(headline([result("python", [3000, 3000, 3000]), result("iex", [1500, 1500, 1500])], base),
    "2 regressions, 0 improvements beyond main's run-to-run range.");
});

test("report: verdict first, compared commits and run, details, errors, the comment marker", () => {
  const workload = { total: [3000, 3200, 3100], commands: [{ command: "1 | 2", median: 100, min: 90, max: 110, n: 3 }] };
  const current = [{ ...result("python", [1000, 1000, 1000], workload), errors: ["rep 2: boom"] }];
  const none = report(current);
  const lines = none.split("\n");
  assert.equal(lines[0], MARKER);
  assert.match(lines[3], /\*\*No baseline from main yet: absolute numbers below\.\*\*/);
  assert.match(none, /`1 \\\| 2` \| 100 ms \| 90 ms – 110 ms/);
  assert.match(none, /\*\*python\*\*: rep 2: boom/);
  assert.match(none, /<details><summary>Downloads and requests<\/summary>/);
  assert.match(none, /<details><summary>Spread \(min – max\) of every metric<\/summary>/);

  const base = { python: result("python", [2000, 2000, 2000], workload) };
  const md = report(current, base, { sha: "f00dfeedcafe", baseline: "abc1234567", armlessRef: "main", runUrl: "https://example.test/run/1" });
  assert.match(md, /\*\*0 regressions, 1 improvement beyond main's run-to-run range\.\*\*/);
  assert.match(md, /This run: `f00dfee` · armless `main` · main: `abc1234` · \[run\]\(https:\/\/example\.test\/run\/1\)/);
  assert.match(md, /\| python \| cold \| 1\.00 s \(-50% 🟢\) \| 1\.00 s – 1\.00 s \| 2\.00 s \| 2\.00 s – 2\.00 s \|/);
});

test("history: one table per demo, this run first, earlier runs of the pull request after", () => {
  const runs = [
    { sha: "bbbbbbb222", created_at: "2026-10-20T02:00:00Z", sites: { python: result("python", [2000, 2000, 2000]) } },
    { sha: "aaaaaaa111", created_at: "2026-10-20T01:00:00Z", sites: { python: result("python", [3000, 3000, 3000]), go: result("go", [500, 500, 500]) } },
  ];
  const md = history([result("python", [1000, 1000, 1000]), result("go", [400, 400, 400])], runs, "ccccccc333");
  const python = md.slice(md.indexOf("**python**"));
  assert.match(python, /\| `ccccccc` \(this run\) \| 1\.00 s \|/);
  assert.ok(python.indexOf("`bbbbbbb`") < python.indexOf("`aaaaaaa`"));
  assert.match(md, /\*\*go\*\*[\s\S]*\| `aaaaaaa` \| 500 ms \|/);
  // the same commit run again isn't listed twice, and a demo with no earlier run gets no table
  assert.equal(history([result("rust", [1, 1, 1])], [{ sha: "ccccccc333", sites: { rust: result("rust", [1, 1, 1]) } }], "ccccccc333"), "No earlier run has the same demos.");
  assert.match(report([result("python", [1000, 1000, 1000])], {}, { sha: "ccccccc333", history: runs }), /Earlier runs on this pull request \(2\)/);
});

test("promptPattern and promptBack: the prompt after the echoed line, digits free", () => {
  const iex = promptPattern("iex(1)> ");
  assert.ok(promptBack("Enum.sum([1])\r\n1\r\niex(2)> ", iex));
  assert.ok(!promptBack("Enum.sum([1])", iex)); // still the echo
  assert.ok(!promptBack("Enum.sum([1])\r\n", iex)); // not back yet
  const py = promptPattern(">>> ");
  assert.ok(promptBack("1/0\r\n\x1b[31mZeroDivisionError\x1b[0m\r\n\x1b[1m>>> \x1b[0m", py));
  assert.equal(promptPattern(""), null);
  assert.ok(!promptBack("x\r\n>>> ", null));
  assert.ok(promptPattern("~ $ ").test("~ $ "));
});

test("plain: escape sequences out", () => {
  assert.equal(plain("\x1b[1;32mok\x1b[0m\x1b]0;title\x07!"), "ok!");
});

test("parseThrottle", () => {
  assert.deepEqual(parseThrottle("9mbps,75ms"), { bitsPerSecond: 9e6, latencyMs: 75 });
  assert.deepEqual(parseThrottle("1600kbps, 150ms"), { bitsPerSecond: 1.6e6, latencyMs: 150 });
  assert.throws(() => parseThrottle("fast"));
});
