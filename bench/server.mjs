// A static server for a built site, close to GitHub Pages: ETag and Last-Modified validators,
// Cache-Control: max-age=600, no special headers (a site with several CPUs isolates itself
// through its service worker, as it must on Pages). It counts what it sends, and can throttle
// every response to a slower link: a shared bandwidth cap and a delay before each response.

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".wasm": "application/wasm", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function serve(root, { maxAge = 600 } = {}) {
  root = path.resolve(root);
  const counters = { requests: 0, bytes: 0, notModified: 0 };
  let throttle = null; // { bitsPerSecond, latencyMs }
  let nextFree = 0; // when the shared link is free again (ms), for the bandwidth cap

  // Wait for the link to carry n more bytes
  async function pace(n) {
    if (!throttle) return;
    const now = performance.now();
    const start = Math.max(now, nextFree);
    nextFree = start + (n * 8 * 1000) / throttle.bitsPerSecond;
    if (nextFree - now > 1) await sleep(nextFree - now);
  }

  const server = createServer(async (req, res) => {
    counters.requests++;
    try {
      if (throttle?.latencyMs) await sleep(throttle.latencyMs);
      let pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (pathname.endsWith("/")) pathname += "index.html";
      const file = path.join(root, pathname);
      if (file !== root && !file.startsWith(root + path.sep)) return end(res, 403);
      let info;
      try {
        info = await stat(file);
        if (info.isDirectory()) return redirect(res, pathname + "/");
      } catch {
        return end(res, 404);
      }
      const etag = `W/"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`;
      const headers = {
        "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream",
        "Cache-Control": `max-age=${maxAge}`,
        "Last-Modified": info.mtime.toUTCString(),
        ETag: etag,
      };
      if (req.headers["if-none-match"] === etag) {
        counters.notModified++;
        res.writeHead(304, headers);
        return res.end();
      }
      res.writeHead(200, { ...headers, "Content-Length": info.size });
      if (req.method === "HEAD") return res.end();
      for await (const chunk of createReadStream(file, { highWaterMark: 16 * 1024 })) {
        await pace(chunk.length);
        counters.bytes += chunk.length;
        if (!res.write(chunk)) await new Promise((resolve) => res.once("drain", resolve));
        if (res.destroyed) return;
      }
      res.end();
    } catch (error) {
      if (!res.headersSent) end(res, 500);
      else res.destroy(error);
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}/`,
    counters,
    // What was sent since the last call
    take() {
      const out = { ...counters };
      counters.requests = counters.bytes = counters.notModified = 0;
      return out;
    },
    setThrottle(t) { throttle = t; nextFree = 0; },
    close: () => new Promise((resolve) => { server.closeAllConnections?.(); server.close(resolve); }),
  };
}

function end(res, status) {
  res.writeHead(status, { "Content-Type": "text/plain" });
  res.end(String(status));
}

function redirect(res, location) {
  res.writeHead(301, { Location: location });
  res.end();
}
