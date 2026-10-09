// HTTPS for a snowglobe guest, with no server.
//
// v86's fetch backend turns the guest's plain HTTP (port 80) into fetch() calls, but a browser
// can't open the raw TCP connection TLS needs. So this bridge answers port 443 itself: it runs a
// minimal TLS 1.3 server on WebCrypto, presents a certificate for the requested host signed by a
// CA that only this guest trusts (made by snowglobe at build time), reads the decrypted HTTP
// request, and replays it with fetch("https://..."). The browser does the real TLS to the real
// server, and CORS applies as it does to any page.
//
// WebSockets work the same way, over wss:// here and ws:// on port 80 (where v86's own HTTP
// handler steps aside for them): the guest's upgrade request opens a browser WebSocket to the same
// URL, and frames are translated in both directions.
//
// Scope: TLS 1.3 only, TLS_AES_128_GCM_SHA256, X25519 or P-256 key shares, an ECDSA P-256
// certificate; HTTP/1.1 with one request per connection. Every current OpenSSL, Node, Python,
// Go, Rust and Java client offers that.
(function () {
  "use strict";

  const subtle = globalThis.crypto.subtle;
  const utf8 = new TextEncoder();
  const text = new TextDecoder();

  const CONTENT_CCS = 20, CONTENT_ALERT = 21, CONTENT_HANDSHAKE = 22, CONTENT_APPDATA = 23;
  const HS_CLIENT_HELLO = 1, HS_SERVER_HELLO = 2, HS_ENCRYPTED_EXTENSIONS = 8, HS_CERTIFICATE = 11,
    HS_CERTIFICATE_VERIFY = 15, HS_FINISHED = 20;
  const TLS13 = 0x0304, AES_128_GCM_SHA256 = 0x1301, ECDSA_P256_SHA256 = 0x0403;
  const X25519 = 0x001d, SECP256R1 = 0x0017;
  const MAX_RECORD = 16384;

  // ---- bytes ----

  function concat(...parts) {
    let length = 0;
    for (const p of parts) length += p.length;
    const out = new Uint8Array(length);
    let offset = 0;
    for (const p of parts) {
      out.set(p, offset);
      offset += p.length;
    }
    return out;
  }
  const u8 = (n) => Uint8Array.of(n);
  const u16 = (n) => Uint8Array.of(n >> 8, n & 255);
  const u24 = (n) => Uint8Array.of(n >> 16, (n >> 8) & 255, n & 255);
  const read16 = (b, i) => (b[i] << 8) | b[i + 1];
  const read24 = (b, i) => (b[i] << 16) | (b[i + 1] << 8) | b[i + 2];
  const read32 = (b, i) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
  const handshake = (type, body) => concat(u8(type), u24(body.length), body);

  // ---- DER, just enough to mint a certificate ----

  function der(tag, content) {
    const n = content.length;
    const length = n < 128 ? u8(n) : n < 256 ? Uint8Array.of(0x81, n) : Uint8Array.of(0x82, n >> 8, n & 255);
    return concat(u8(tag), length, content);
  }
  const seq = (...items) => der(0x30, concat(...items));
  const oid = (...bytes) => der(0x06, Uint8Array.from(bytes));

  function derInteger(bytes) {
    let i = 0;
    while (i < bytes.length - 1 && bytes[i] === 0) i++;
    bytes = bytes.subarray(i);
    return der(0x02, bytes[0] & 0x80 ? concat(u8(0), bytes) : bytes);
  }

  // WebCrypto signs ECDSA as r || s; X.509 and TLS want a DER SEQUENCE of two INTEGERs
  const derSignature = (raw) => seq(derInteger(raw.subarray(0, 32)), derInteger(raw.subarray(32)));

  const ECDSA_WITH_SHA256 = seq(oid(0x2a, 0x86, 0x48, 0xce, 0x3d, 0x04, 0x03, 0x02));
  // The guest's clock is wherever the snapshot left it, so validity can't track the real date
  const VALIDITY = seq(der(0x17, utf8.encode("000101000000Z")), der(0x17, utf8.encode("491231235959Z")));

  async function mintCertificate(host, keys) {
    const name = seq(der(0x31, seq(oid(0x55, 0x04, 0x03), der(0x0c, utf8.encode(host)))));
    const serial = derInteger(concat(u8(0x01), crypto.getRandomValues(new Uint8Array(15))));
    const extension = (id, value) => seq(id, der(0x04, value));
    const extensions = der(0xa3, seq(
      extension(oid(0x55, 0x1d, 0x11), seq(der(0x82, utf8.encode(host)))), // subjectAltName
      extension(oid(0x55, 0x1d, 0x23), seq(der(0x80, keys.caKeyId))), // authorityKeyIdentifier
      extension(oid(0x55, 0x1d, 0x25), seq(oid(0x2b, 0x06, 0x01, 0x05, 0x05, 0x07, 0x03, 0x01))), // serverAuth
    ));
    const tbs = seq(der(0xa0, der(0x02, u8(2))), serial, ECDSA_WITH_SHA256, keys.caSubject, VALIDITY, name,
      keys.leafSpki, extensions);
    const signature = new Uint8Array(await subtle.sign({ name: "ECDSA", hash: "SHA-256" }, keys.caKey, tbs));
    return seq(tbs, ECDSA_WITH_SHA256, der(0x03, concat(u8(0), derSignature(signature))));
  }

  // ---- the TLS 1.3 key schedule (RFC 8446 section 7) ----

  const sha256 = async (data) => new Uint8Array(await subtle.digest("SHA-256", data));

  async function hmac(key, data) {
    const k = await subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    return new Uint8Array(await subtle.sign("HMAC", k, data));
  }

  // Every output here is at most one SHA-256 block, so HKDF-Expand is a single HMAC
  async function expandLabel(secret, label, context, length) {
    const fullLabel = utf8.encode("tls13 " + label);
    const info = concat(u16(length), u8(fullLabel.length), fullLabel, u8(context.length), context);
    return (await hmac(secret, concat(info, u8(1)))).subarray(0, length);
  }
  const deriveSecret = async (secret, label, transcript) => expandLabel(secret, label, await sha256(transcript), 32);

  async function trafficKeys(secret) {
    const key = await expandLabel(secret, "key", new Uint8Array(0), 16);
    const iv = await expandLabel(secret, "iv", new Uint8Array(0), 12);
    return {
      key: await subtle.importKey("raw", key, "AES-GCM", false, ["encrypt", "decrypt"]),
      iv,
      seq: 0,
    };
  }

  function nextNonce(keys) {
    const nonce = keys.iv.slice();
    for (let i = 0; i < 4; i++) nonce[11 - i] ^= (keys.seq >>> (8 * i)) & 255;
    keys.seq++;
    return nonce;
  }

  async function keyShare(group, peer) {
    const algorithm = group === X25519 ? { name: "X25519" } : { name: "ECDH", namedCurve: "P-256" };
    const pair = await subtle.generateKey(algorithm, true, ["deriveBits"]);
    const publicKey = await subtle.importKey("raw", peer, algorithm, false, []);
    return {
      group,
      ours: new Uint8Array(await subtle.exportKey("raw", pair.publicKey)),
      shared: new Uint8Array(await subtle.deriveBits({ name: algorithm.name, public: publicKey }, pair.privateKey, 256)),
    };
  }

  function parseClientHello(body) {
    let p = 34; // legacy_version, random
    const sessionId = body.slice(p + 1, p + 1 + body[p]);
    p += 1 + body[p];
    const suites = [];
    for (let i = 0; i < read16(body, p); i += 2) suites.push(read16(body, p + 2 + i));
    p += 2 + read16(body, p);
    p += 1 + body[p]; // compression methods
    const hello = { sessionId, suites, versions: [], shares: new Map(), host: null };
    const end = p + 2 + read16(body, p);
    p += 2;
    while (p + 4 <= end) {
      const type = read16(body, p);
      const data = body.subarray(p + 4, p + 4 + read16(body, p + 2));
      p += 4 + data.length;
      if (type === 0 && data.length > 5 && data[2] === 0) {
        hello.host = text.decode(data.subarray(5, 5 + read16(data, 3))).toLowerCase();
      } else if (type === 43) {
        for (let i = 1; i < 1 + data[0]; i += 2) hello.versions.push(read16(data, i));
      } else if (type === 51) {
        for (let q = 2; q + 4 <= 2 + read16(data, 0);) {
          const length = read16(data, q + 2);
          hello.shares.set(read16(data, q), data.slice(q + 4, q + 4 + length));
          q += 4 + length;
        }
      }
    }
    return hello;
  }

  // ---- one connection ----

  class Session {
    constructor(conn, keys, options) {
      this.conn = conn;
      this.keys = keys; // a promise of the imported CA and leaf keys
      this.options = options;
      this.incoming = new Uint8Array(0);
      this.handshakeBuffer = new Uint8Array(0);
      this.state = "hello";
      this.read = null;
      this.write = null;
      this.exchange = null;
      this.closed = false;
      this.chain = Promise.resolve();
      this.outgoing = Promise.resolve();

      conn.on("data", (data) => {
        // data is a view into the NIC's buffer: copy it before anything async
        const bytes = new Uint8Array(data);
        this.chain = this.chain.then(() => this.receive(bytes)).catch((error) => this.fail(error));
      });
      conn.on("close", () => (this.closed = true));
    }

    async receive(bytes) {
      if (this.closed) return;
      this.incoming = concat(this.incoming, bytes);
      while (this.incoming.length >= 5) {
        const length = read16(this.incoming, 3);
        if (this.incoming.length < 5 + length) break;
        const header = this.incoming.slice(0, 5);
        const fragment = this.incoming.slice(5, 5 + length);
        this.incoming = this.incoming.slice(5 + length);
        await this.record(header, fragment);
        if (this.closed) return;
      }
    }

    async record(header, fragment) {
      const type = header[0];
      if (type === CONTENT_CCS) return; // middlebox compatibility; meaningless in TLS 1.3
      if (type === CONTENT_ALERT) return this.close();
      if (type === CONTENT_HANDSHAKE && this.state === "hello") {
        this.handshakeBuffer = concat(this.handshakeBuffer, fragment);
        if (this.handshakeBuffer.length < 4) return;
        const length = read24(this.handshakeBuffer, 1);
        if (this.handshakeBuffer.length < 4 + length) return;
        if (this.handshakeBuffer[0] !== HS_CLIENT_HELLO) throw new Error("expected a ClientHello");
        return this.serverHandshake(this.handshakeBuffer.slice(0, 4 + length));
      }
      if (type !== CONTENT_APPDATA || !this.read) throw new Error(`unexpected record type ${type}`);

      const plain = new Uint8Array(await subtle.decrypt(
        { name: "AES-GCM", iv: nextNonce(this.read), additionalData: header, tagLength: 128 },
        this.read.key, fragment));
      let end = plain.length - 1;
      while (end >= 0 && plain[end] === 0) end--; // strip padding; the last non-zero byte is the type
      const inner = plain[end];
      const content = plain.subarray(0, end);

      if (inner === CONTENT_HANDSHAKE && this.state === "finished" && content[0] === HS_FINISHED) {
        // The client's Finished: from here on it sends with its application keys
        this.read = this.clientApplication;
        this.state = "open";
      } else if (inner === CONTENT_APPDATA && this.state === "open") {
        this.exchange ??= new Exchange({
          send: (bytes) => this.sealAll(bytes),
          end: () => this.seal(CONTENT_ALERT, Uint8Array.of(1, 0)).then(() => this.close()), // close_notify
        }, "https", this.host, this.options);
        await this.exchange.receive(content);
      } else if (inner === CONTENT_ALERT) {
        this.close();
      }
      // Anything else (post-handshake messages) is safe to ignore for one request
    }

    async serverHandshake(clientHello) {
      const hello = parseClientHello(clientHello.subarray(4));
      if (!hello.versions.includes(TLS13) || !hello.suites.includes(AES_128_GCM_SHA256)) {
        return this.alert(70); // protocol_version
      }
      if (!hello.host) return this.alert(112); // unrecognized_name: an IP literal sends no SNI
      this.host = hello.host;

      let share = null;
      for (const group of [X25519, SECP256R1]) {
        if (!hello.shares.has(group)) continue;
        try {
          share = await keyShare(group, hello.shares.get(group));
          break;
        } catch {
          // X25519 is missing from older WebCrypto implementations; try the next group
        }
      }
      if (!share) return this.alert(40); // handshake_failure: no key share we can use

      const extensions = concat(
        u16(43), u16(2), u16(TLS13),
        u16(51), u16(4 + share.ours.length), u16(share.group), u16(share.ours.length), share.ours);
      const serverHello = handshake(HS_SERVER_HELLO, concat(
        u16(0x0303), crypto.getRandomValues(new Uint8Array(32)), u8(hello.sessionId.length), hello.sessionId,
        u16(AES_128_GCM_SHA256), u8(0), u16(extensions.length), extensions));
      this.send(concat(Uint8Array.of(CONTENT_HANDSHAKE, 3, 3), u16(serverHello.length), serverHello));
      if (hello.sessionId.length) this.send(Uint8Array.of(CONTENT_CCS, 3, 3, 0, 1, 1));

      const zeros = new Uint8Array(32);
      const empty = new Uint8Array(0);
      const transcript = [clientHello, serverHello];
      const handshakeSecret = await hmac(await deriveSecret(await hmac(zeros, zeros), "derived", empty), share.shared);
      const clientSecret = await deriveSecret(handshakeSecret, "c hs traffic", concat(...transcript));
      const serverSecret = await deriveSecret(handshakeSecret, "s hs traffic", concat(...transcript));
      this.read = await trafficKeys(clientSecret);
      this.write = await trafficKeys(serverSecret);

      const keys = await this.keys;
      const certificate = await keys.certificate(this.host);
      const encryptedExtensions = handshake(HS_ENCRYPTED_EXTENSIONS, u16(0));
      const certificateMessage = handshake(HS_CERTIFICATE, concat(
        u8(0), u24(certificate.length + 5), u24(certificate.length), certificate, u16(0)));
      transcript.push(encryptedExtensions, certificateMessage);

      const signed = concat(new Uint8Array(64).fill(0x20), utf8.encode("TLS 1.3, server CertificateVerify"), u8(0),
        await sha256(concat(...transcript)));
      const signature = derSignature(new Uint8Array(
        await subtle.sign({ name: "ECDSA", hash: "SHA-256" }, keys.leafKey, signed)));
      const certificateVerify = handshake(HS_CERTIFICATE_VERIFY, concat(u16(ECDSA_P256_SHA256), u16(signature.length), signature));
      transcript.push(certificateVerify);

      const finishedKey = await expandLabel(serverSecret, "finished", empty, 32);
      const finished = handshake(HS_FINISHED, await hmac(finishedKey, await sha256(concat(...transcript))));
      transcript.push(finished);
      await this.seal(CONTENT_HANDSHAKE, concat(encryptedExtensions, certificateMessage, certificateVerify, finished));

      const masterSecret = await hmac(await deriveSecret(handshakeSecret, "derived", empty), zeros);
      this.clientApplication = await trafficKeys(await deriveSecret(masterSecret, "c ap traffic", concat(...transcript)));
      this.write = await trafficKeys(await deriveSecret(masterSecret, "s ap traffic", concat(...transcript)));
      this.state = "finished";
    }

    // Records are encrypted and written strictly in order: the nonce is a sequence number
    seal(type, data) {
      this.outgoing = this.outgoing.then(async () => {
        const inner = concat(data, u8(type));
        const header = concat(Uint8Array.of(CONTENT_APPDATA, 3, 3), u16(inner.length + 16));
        const sealed = await subtle.encrypt(
          { name: "AES-GCM", iv: nextNonce(this.write), additionalData: header, tagLength: 128 },
          this.write.key, inner);
        this.send(concat(header, new Uint8Array(sealed)));
      });
      return this.outgoing;
    }

    sealAll(bytes) {
      let last = this.outgoing;
      for (let i = 0; i < bytes.length; i += MAX_RECORD) last = this.seal(CONTENT_APPDATA, bytes.subarray(i, i + MAX_RECORD));
      return last;
    }

    send(bytes) {
      if (!this.closed) this.conn.write(bytes);
    }

    alert(description) {
      this.send(Uint8Array.of(CONTENT_ALERT, 3, 3, 0, 2, 2, description));
      this.close();
    }

    close() {
      if (this.closed) return;
      this.closed = true;
      this.conn.close();
    }

    fail(error) {
      console.warn("snowglobe https bridge:", error);
      if (this.state === "hello") this.alert(80); // internal_error
      else this.close();
    }
  }

  function indexOfCrlfCrlf(b) {
    for (let i = 0; i + 3 < b.length; i++) {
      if (b[i] === 13 && b[i + 1] === 10 && b[i + 2] === 13 && b[i + 3] === 10) return i;
    }
    return -1;
  }

  // ---- what the guest says over a connection: one HTTP request, or a WebSocket ----

  const WEBSOCKET_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
  const HOP_BY_HOP = ["host", "connection", "content-length", "transfer-encoding", "keep-alive", "accept-encoding",
    "proxy-connection", "upgrade"];

  function parseHead(bytes) {
    const end = indexOfCrlfCrlf(bytes);
    if (end < 0) return null;
    const lines = text.decode(bytes.subarray(0, end)).split("\r\n");
    const [method, target] = lines[0].split(" ");
    const headers = [];
    for (const line of lines.slice(1)) {
      const colon = line.indexOf(":");
      if (colon > 0) headers.push([line.slice(0, colon).trim().toLowerCase(), line.slice(colon + 1).trim()]);
    }
    const get = (name) => headers.find(([k]) => k === name)?.[1];
    return { method, target, headers, get, bodyStart: end + 4, contentLength: parseInt(get("content-length"), 10) || 0 };
  }

  const isWebSocket = (head) => /websocket/i.test(head.get("upgrade") || "");

  function frame(opcode, payload) {
    const n = payload.length;
    const header = n < 126 ? Uint8Array.of(0x80 | opcode, n)
      : n < 65536 ? Uint8Array.of(0x80 | opcode, 126, n >> 8, n & 255)
        : Uint8Array.of(0x80 | opcode, 127, 0, 0, 0, 0, n >>> 24, (n >> 16) & 255, (n >> 8) & 255, n & 255);
    return concat(header, payload);
  }

  function openWebSocket(WebSocketClass, url, protocols) {
    return new Promise((resolve, reject) => {
      const socket = new WebSocketClass(url, protocols);
      socket.binaryType = "arraybuffer";
      socket.onopen = () => resolve(socket);
      socket.onerror = () => reject(new Error("the connection failed"));
      socket.onclose = (event) => reject(new Error(`closed before opening (${event.code})`));
    });
  }

  class Exchange {
    // transport: { send(bytes), end() }, both in order
    constructor(transport, scheme, host, options) {
      this.transport = transport;
      this.scheme = scheme;
      this.host = host;
      this.options = options;
      this.buffer = new Uint8Array(0);
      this.mode = "request";
    }

    receive(bytes) {
      this.buffer = concat(this.buffer, bytes);
      if (this.mode === "request") return this.request();
      if (this.mode === "websocket") this.frames();
    }

    async request() {
      const head = parseHead(this.buffer);
      if (!head) return;
      if (isWebSocket(head)) return this.websocket(head);
      if (this.buffer.length < head.bodyStart + head.contentLength) return; // body still arriving
      this.mode = "answering";

      const body = this.buffer.slice(head.bodyStart, head.bodyStart + head.contentLength);
      const headers = new Headers();
      for (const [name, value] of head.headers) {
        if (HOP_BY_HOP.includes(name)) continue;
        try {
          headers.append(name, value);
        } catch {
          // a header the browser refuses: drop it
        }
      }
      const url = /^https?:\/\//.test(head.target) ? head.target : `${this.scheme}://${this.host}${head.target}`;
      try {
        const response = await this.options.fetch(url, {
          method: head.method,
          headers,
          body: head.method === "GET" || head.method === "HEAD" ? undefined : body,
        });
        const responseHeaders = [...response.headers].filter(([name]) =>
          !["content-encoding", "content-length", "transfer-encoding", "connection"].includes(name));
        const responseBody = head.method === "HEAD" ? new Uint8Array(0) : new Uint8Array(await response.arrayBuffer());
        await this.respond(response.status, response.statusText || "OK", responseHeaders, responseBody);
      } catch (error) {
        await this.respond(502, "Fetch Error", [["content-type", "text/plain"]], utf8.encode(
          `snowglobe: the browser refused ${url}\n` +
          `Requests from the guest are the page's own fetch() calls, so the server must allow CORS.\n${error}\n`));
      }
    }

    respond(status, statusText, headers, body) {
      const head = [`HTTP/1.1 ${status} ${statusText}`, ...headers.map(([k, v]) => `${k}: ${v}`),
        `content-length: ${body.length}`, "connection: close", "", ""].join("\r\n");
      this.transport.send(concat(utf8.encode(head), body));
      return this.transport.end();
    }

    async websocket(head) {
      this.mode = "opening";
      // Browsers block ws:// from an https:// page, so upgrade it as v86 does for http://
      const secure = this.scheme === "https" || globalThis.location?.protocol === "https:";
      const url = `${secure ? "wss" : "ws"}://${this.host}${head.target}`;
      const protocols = (head.get("sec-websocket-protocol") || "").split(",").map((p) => p.trim()).filter(Boolean);
      let socket;
      try {
        socket = await openWebSocket(this.options.WebSocket, url, protocols);
      } catch (error) {
        return this.respond(502, "WebSocket Error", [["content-type", "text/plain"]],
          utf8.encode(`snowglobe: the browser could not open ${url}: ${error.message}\n`));
      }

      const digest = new Uint8Array(await subtle.digest("SHA-1", utf8.encode(head.get("sec-websocket-key") + WEBSOCKET_GUID)));
      const lines = ["HTTP/1.1 101 Switching Protocols", "upgrade: websocket", "connection: Upgrade",
        `sec-websocket-accept: ${btoa(String.fromCharCode(...digest))}`];
      if (socket.protocol) lines.push(`sec-websocket-protocol: ${socket.protocol}`);
      this.transport.send(utf8.encode(lines.join("\r\n") + "\r\n\r\n"));

      this.socket = socket;
      this.parts = [];
      socket.onmessage = ({ data }) => {
        if (this.mode !== "websocket") return;
        this.transport.send(typeof data === "string" ? frame(1, utf8.encode(data)) : frame(2, new Uint8Array(data)));
      };
      socket.onclose = ({ code }) => {
        if (this.mode !== "websocket") return;
        this.mode = "closed";
        this.transport.send(frame(8, code && code !== 1005 ? u16(code) : new Uint8Array(0)));
        this.transport.end();
      };
      this.mode = "websocket";
      this.buffer = this.buffer.slice(head.bodyStart); // frames the guest sent while the socket opened
      this.frames();
    }

    // The guest's frames are masked, and a message may span several of them
    frames() {
      while (this.mode === "websocket" && this.buffer.length >= 2) {
        const b = this.buffer;
        let length = b[1] & 127;
        let offset = 2;
        if (length === 126) {
          if (b.length < 4) return;
          length = read16(b, 2);
          offset = 4;
        } else if (length === 127) {
          if (b.length < 10) return;
          length = read32(b, 6);
          offset = 10;
        }
        const mask = b[1] & 128 ? b.subarray(offset, offset + 4) : null;
        if (mask) offset += 4;
        if (b.length < offset + length) return;
        const payload = b.slice(offset, offset + length);
        if (mask) for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3];
        this.buffer = b.slice(offset + length);

        const opcode = b[0] & 15;
        if (opcode === 8) { // close: echo it, then close the browser's side
          this.mode = "closed";
          this.transport.send(frame(8, payload.subarray(0, 2)));
          this.transport.end();
          this.socket.close();
          return;
        }
        if (opcode === 9) { // ping: answered here, the browser keeps its own connection alive
          this.transport.send(frame(10, payload));
          continue;
        }
        if (opcode === 10) continue;
        if (opcode !== 0) {
          this.opcode = opcode;
          this.parts = [];
        }
        this.parts.push(payload);
        if (b[0] & 128) {
          const message = concat(...this.parts);
          this.parts = [];
          this.socket.send(this.opcode === 1 ? text.decode(message) : message);
        }
      }
    }
  }

  // ws:// arrives on port 80, which v86's fetch backend has already claimed (it is the first to
  // see every connection). Look at each request first: WebSocket upgrades are ours, everything else
  // goes to v86's handler untouched.
  function shareHTTP(conn, options) {
    const v86Handler = conn.events_handlers?.data;
    if (!v86Handler) return; // internals moved in a newer v86: leave port 80 to it
    let sniffed = new Uint8Array(0);
    let route = null;
    conn.on("data", (data) => {
      const bytes = new Uint8Array(data);
      if (route) return route(bytes);
      sniffed = concat(sniffed, bytes);
      const head = parseHead(sniffed);
      if (!head) return;
      if (isWebSocket(head)) {
        const host = head.get("host") || "localhost";
        const exchange = new Exchange({ send: (b) => conn.write(b), end: () => conn.close() }, "http", host, options);
        route = (b) => exchange.receive(b);
      } else {
        route = (b) => v86Handler.call(conn, b);
      }
      route(sniffed);
    });
  }

  const fromBase64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  // config: system/tls.json from snowglobe, or a promise of its parsed contents
  async function importKeys(config) {
    const json = await config;
    const ecdsa = { name: "ECDSA", namedCurve: "P-256" };
    const keys = {
      caSubject: fromBase64(json.caSubject),
      caKeyId: fromBase64(json.caKeyId),
      leafSpki: fromBase64(json.leafSpki),
      caKey: await subtle.importKey("pkcs8", fromBase64(json.caKey), ecdsa, false, ["sign"]),
      leafKey: await subtle.importKey("pkcs8", fromBase64(json.leafKey), ecdsa, false, ["sign"]),
    };
    const minted = new Map();
    keys.certificate = (host) => {
      if (!minted.has(host)) minted.set(host, mintCertificate(host, keys));
      return minted.get(host);
    };
    return keys;
  }

  // Answer the guest's connections to port 443. v86 announces every new guest TCP connection on
  // its bus; the fetch backend itself only takes port 80, so the rest are free to claim.
  function attach(emulator, config, options = {}) {
    let keys = null;
    options = { fetch: (...args) => fetch(...args), WebSocket: globalThis.WebSocket, ...options };
    emulator.add_listener("tcp-connection", (conn) => {
      if (conn.sport === 80) return shareHTTP(conn, options);
      if (conn.sport !== 443) return;
      keys ??= importKeys(typeof config === "string" ? fetch(config).then((r) => r.json()) : config);
      conn.accept();
      new Session(conn, keys, options);
    });
  }

  globalThis.SnowglobeHTTPS = { attach };
})();
