#!/usr/bin/env node
// notes: a tiny app on the local Supabase stack. Auth signs users up and in, PostgREST serves
// the notes table, and Postgres' row level security keeps each user's notes their own.
//
//   notes signup EMAIL PASSWORD     notes login EMAIL PASSWORD     notes whoami
//   notes add TEXT...               notes ls                       notes rm ID
//   notes logout
//
// It speaks Auth's and PostgREST's HTTP APIs directly with node:http: on an emulated CPU, Node
// takes seconds just to load its fetch() stack (which supabase-js needs), and this is a terminal
// command people run one after another.
import http from "node:http";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const { API_URL, ANON_KEY } = process.env;
if (!API_URL || !ANON_KEY) {
  console.error("notes: API_URL and ANON_KEY aren't set (supabase status --env has them)");
  process.exit(1);
}

// The signed-in user's session lives in a file, so each command is its own process
const sessionFile = join(homedir(), ".notes-session.json");
const load = () => {
  try { return JSON.parse(readFileSync(sessionFile, "utf8")); } catch { return null; }
};
const save = (s) => writeFileSync(sessionFile, JSON.stringify(s), { mode: 0o600 });

function request(method, path, { token, body, prefer } = {}) {
  const url = new URL(path, API_URL);
  const data = body === undefined ? undefined : JSON.stringify(body);
  const headers = { apikey: ANON_KEY, Authorization: `Bearer ${token || ANON_KEY}` };
  if (data !== undefined) headers["Content-Type"] = "application/json";
  if (prefer) headers.Prefer = prefer;
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method, headers }, (res) => {
      let text = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (text += chunk));
      res.on("end", () => {
        let json = null;
        try { json = text ? JSON.parse(text) : null; } catch {}
        if (res.statusCode >= 400) {
          reject(new Error(json?.msg || json?.message || json?.error_description || json?.error || `HTTP ${res.statusCode}`));
        } else resolve(json);
      });
    });
    req.on("error", reject);
    req.end(data);
  });
}

const fail = (error) => {
  console.error("notes:", error.message ?? error);
  process.exitCode = 1;
};

// Auth answers signup and login with a session: the user, an access token (a JWT the REST API
// checks, and row level security reads the user from) and a refresh token
const keep = (s) => {
  if (!s?.access_token) throw new Error("no session (does Auth want the email confirmed?)");
  save({ access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at, user: s.user });
  console.log(`signed in as ${s.user.email} (${s.user.id.slice(0, 8)})`);
};

// The saved session, refreshed when its access token is about to expire
async function session() {
  const s = load();
  if (!s) throw new Error("not signed in: notes signup EMAIL PASSWORD, or notes login EMAIL PASSWORD");
  if (s.expires_at && s.expires_at - 30 < Date.now() / 1000) {
    const fresh = await request("POST", "/auth/v1/token?grant_type=refresh_token", { body: { refresh_token: s.refresh_token } });
    save({ ...s, ...fresh, user: fresh.user || s.user });
    return load();
  }
  return s;
}

async function main(command, args) {
  switch (command) {
    case "signup":
    case "login": {
      const [email, password] = args;
      if (!email || !password) throw new Error(`usage: notes ${command} EMAIL PASSWORD`);
      const path = command === "signup" ? "/auth/v1/signup" : "/auth/v1/token?grant_type=password";
      return keep(await request("POST", path, { body: { email, password } }));
    }
    case "whoami": {
      const { user } = await session();
      return console.log(`${user.email} (${user.id.slice(0, 8)})`);
    }
    case "add": {
      const { access_token: token } = await session();
      const [note] = await request("POST", "/rest/v1/notes", { token, body: { body: args.join(" ") }, prefer: "return=representation" });
      return console.log(`#${note.id} added`);
    }
    case "ls": {
      const { access_token: token, user } = await session();
      const notes = await request("GET", "/rest/v1/notes?select=id,body,created_at&order=id", { token });
      console.log(`${user.email}: ${notes.length} note(s)`);
      for (const n of notes) console.log(`  #${n.id}  ${n.created_at.slice(11, 19)}  ${n.body}`);
      return;
    }
    case "rm": {
      const { access_token: token } = await session();
      const id = Number(args[0]);
      const gone = await request("DELETE", `/rest/v1/notes?id=eq.${id}`, { token, prefer: "return=representation" });
      return console.log(gone.length ? `#${id} removed` : `no note #${id} of yours`);
    }
    case "logout": {
      const s = load();
      if (s) await request("POST", "/auth/v1/logout", { token: s.access_token }).catch(() => {});
      rmSync(sessionFile, { force: true });
      return console.log("signed out");
    }
    default:
      console.log("usage: notes signup|login EMAIL PASSWORD · whoami · add TEXT · ls · rm ID · logout");
  }
}

main(process.argv[2], process.argv.slice(3)).catch(fail);
