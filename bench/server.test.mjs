import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { serve } from "./server.mjs";

async function site() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "bench-site-"));
  await mkdir(path.join(dir, "system"));
  await writeFile(path.join(dir, "index.html"), "<!doctype html>hi");
  await writeFile(path.join(dir, "system", "big.bin"), Buffer.alloc(256 * 1024, 7));
  return dir;
}

test("serves files with Pages-like caching headers, counts, and answers 304", async () => {
  const server = await serve(await site());
  try {
    let r = await fetch(server.url);
    assert.equal(r.status, 200);
    assert.equal(await r.text(), "<!doctype html>hi");
    assert.equal(r.headers.get("cache-control"), "max-age=600");
    const etag = r.headers.get("etag");
    assert.ok(etag);
    r = await fetch(server.url + "index.html", { headers: { "if-none-match": etag } });
    assert.equal(r.status, 304);
    r = await fetch(server.url + "system/big.bin");
    assert.equal((await r.arrayBuffer()).byteLength, 256 * 1024);
    assert.equal(r.headers.get("content-type"), "application/octet-stream");
    assert.equal((await fetch(server.url + "nope")).status, 404);
    assert.equal((await fetch(server.url + "..%2f..%2fetc%2fpasswd")).status, 403);
    const sent = server.take();
    assert.deepEqual(sent, { requests: 5, bytes: 17 + 256 * 1024, notModified: 1 });
    assert.deepEqual(server.take(), { requests: 0, bytes: 0, notModified: 0 });
  } finally {
    await server.close();
  }
});

test("throttling caps bandwidth and adds latency", async () => {
  const server = await serve(await site());
  try {
    server.setThrottle({ bitsPerSecond: 8 * 1024 * 1024, latencyMs: 100 }); // 1 MiB/s
    const t = performance.now();
    await (await fetch(server.url + "system/big.bin")).arrayBuffer(); // 256 KiB: ~250 ms + 100 ms
    const ms = performance.now() - t;
    assert.ok(ms > 300 && ms < 1500, `took ${ms} ms`);
    server.setThrottle(null);
    const u = performance.now();
    await (await fetch(server.url + "system/big.bin")).arrayBuffer();
    assert.ok(performance.now() - u < 200);
  } finally {
    await server.close();
  }
});
