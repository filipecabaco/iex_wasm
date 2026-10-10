#!/usr/bin/env node
// notes: a tiny app on the local Supabase stack. Auth signs users up and in, PostgREST serves
// the notes table, and Postgres' row level security keeps each user's notes their own.
//
//   notes signup EMAIL PASSWORD     notes login EMAIL PASSWORD     notes whoami
//   notes add TEXT...               notes ls                       notes rm ID
//   notes logout
import { createClient } from "@supabase/supabase-js";
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
const storage = {
  getItem: (key) => {
    try { return JSON.parse(readFileSync(sessionFile, "utf8"))[key] ?? null; } catch { return null; }
  },
  setItem: (key, value) => writeFileSync(sessionFile, JSON.stringify({ [key]: value })),
  removeItem: () => rmSync(sessionFile, { force: true }),
};
const supabase = createClient(API_URL, ANON_KEY, {
  auth: { storage, persistSession: true, autoRefreshToken: false, detectSessionInUrl: false },
});

const fail = (error) => {
  console.error("notes:", error.message ?? error);
  process.exit(1);
};
const signedIn = async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) fail("not signed in: notes signup EMAIL PASSWORD, or notes login EMAIL PASSWORD");
  return data.user;
};

const [command, ...args] = process.argv.slice(2);
switch (command) {
  case "signup":
  case "login": {
    const [email, password] = args;
    if (!email || !password) fail(`usage: notes ${command} EMAIL PASSWORD`);
    const { data, error } = command === "signup"
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) fail(error);
    console.log(`signed in as ${data.user.email} (${data.user.id.slice(0, 8)})`);
    break;
  }
  case "whoami": {
    const user = await signedIn();
    console.log(`${user.email} (${user.id.slice(0, 8)})`);
    break;
  }
  case "add": {
    await signedIn();
    const { data, error } = await supabase.from("notes").insert({ body: args.join(" ") }).select().single();
    if (error) fail(error);
    console.log(`#${data.id} added`);
    break;
  }
  case "ls": {
    const user = await signedIn();
    const { data, error } = await supabase.from("notes").select("id, body, created_at").order("id");
    if (error) fail(error);
    console.log(`${user.email}: ${data.length} note(s)`);
    for (const n of data) console.log(`  #${n.id}  ${n.created_at.slice(11, 19)}  ${n.body}`);
    break;
  }
  case "rm": {
    await signedIn();
    const { data, error } = await supabase.from("notes").delete().eq("id", Number(args[0])).select();
    if (error) fail(error);
    console.log(data.length ? `#${args[0]} removed` : `no note #${args[0]} of yours`);
    break;
  }
  case "logout":
    await supabase.auth.signOut({ scope: "local" });
    console.log("signed out");
    break;
  default:
    console.log("usage: notes signup|login EMAIL PASSWORD · whoami · add TEXT · ls · rm ID · logout");
}
