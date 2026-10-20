#!/usr/bin/env node
// Turns benchmark results into a report, or into a baseline for later runs to compare with.
//
//   node bench/report.mjs RESULTS_DIR [--baseline FILE] [--out FILE] [--sha SHA] [--run-url URL]
//                                         markdown (the pull request comment), against FILE
//                                         [--history DIR]  earlier runs of the pull request
//   node bench/report.mjs RESULTS_DIR --combine FILE      write one file for the whole run
//
// RESULTS_DIR holds what run.mjs wrote (<site>.json, in any subdirectories). A combined run (a
// baseline, or an entry of --history) is { schema, sha, created_at, sites: { <site>: result } }.

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { report, SCHEMA } from "./lib.mjs";

const { values: opt, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    baseline: { type: "string" },
    combine: { type: "string" },
    history: { type: "string" },
    out: { type: "string" },
    "armless-ref": { type: "string" },
    sha: { type: "string" },
    "run-url": { type: "string" },
  },
});
if (positionals.length !== 1) {
  console.error("usage: node bench/report.mjs RESULTS_DIR [--baseline FILE] [--out FILE] | --combine FILE");
  process.exit(2);
}

const results = await load(positionals[0]);
if (!results.length) {
  console.error(`no results in ${positionals[0]}`);
  process.exit(1);
}

if (opt.combine) {
  const baseline = {
    schema: SCHEMA,
    sha: process.env.GITHUB_SHA ?? results[0].env?.sha,
    created_at: new Date().toISOString(),
    sites: Object.fromEntries(results.map((r) => [r.site, r])),
  };
  await writeFile(opt.combine, JSON.stringify(baseline, null, 2) + "\n");
  console.log(`baseline of ${results.length} site(s) in ${opt.combine}`);
} else {
  let baselines = {};
  const meta = {
    armlessRef: opt["armless-ref"] || results.find((r) => r.env?.armless_ref)?.env.armless_ref,
    sha: opt.sha || results.find((r) => r.env?.sha)?.env.sha,
    runUrl: opt["run-url"],
  };
  if (opt.baseline) {
    try {
      const b = JSON.parse(await readFile(opt.baseline, "utf8"));
      if (b.schema === SCHEMA) {
        baselines = b.sites ?? {};
        meta.baseline = b.sha;
      } else console.error(`baseline schema ${b.schema} isn't ${SCHEMA}: comparing with nothing`);
    } catch (error) {
      console.error(`no usable baseline (${error.message}): comparing with nothing`);
    }
  }
  if (opt.history) meta.history = await loadRuns(opt.history);
  const md = report(results, baselines, meta);
  if (opt.out) await writeFile(opt.out, md);
  else process.stdout.write(md);
}

// Combined runs (--combine's files) in DIR, newest first; a missing DIR is no history
async function loadRuns(dir) {
  const runs = [];
  let entries = [];
  try {
    entries = await readdir(dir);
  } catch {
    return runs;
  }
  for (const name of entries) {
    if (!name.endsWith(".json")) continue;
    try {
      const r = JSON.parse(await readFile(path.join(dir, name), "utf8"));
      if (r.schema === SCHEMA && r.sites) runs.push(r);
    } catch {}
  }
  return runs.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

async function load(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    const file = path.join(entry.parentPath ?? entry.path, entry.name);
    try {
      const r = JSON.parse(await readFile(file, "utf8"));
      if (r.schema === SCHEMA && r.site && r.scenarios) out.push(r);
    } catch {}
  }
  return out;
}
