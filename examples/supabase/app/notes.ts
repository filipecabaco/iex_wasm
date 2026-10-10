// notes: a small app on the local Supabase stack, run by the Bun inside the Supabase CLI.
// Auth signs users up and in; the Data API (PostgREST) stores and queries the notes; row level
// security in Postgres keeps each user's notes their own.
//
//   notes signup|login EMAIL PASSWORD    notes whoami    notes logout
//   notes add TEXT...    notes ls    notes search WORD    notes rm ID
const { API_URL, ANON_KEY } = process.env;
if (!API_URL || !ANON_KEY) throw new Error("API_URL and ANON_KEY aren't set (supabase status --env has them)");

// The session from signup/login, kept between commands
const file = Bun.file(`${process.env.HOME}/.notes-session.json`);
type Session = { access_token: string; user: { id: string; email: string } };
const session = async (): Promise<Session> => {
  if (!(await file.exists())) throw new Error("not signed in: notes signup EMAIL PASSWORD");
  return file.json();
};

async function call(path: string, init: { method?: string; body?: unknown; token?: string; prefer?: string } = {}) {
  const res = await fetch(API_URL + path, {
    method: init.method ?? "GET",
    headers: {
      apikey: ANON_KEY!,
      Authorization: `Bearer ${init.token ?? ANON_KEY}`,
      "Content-Type": "application/json",
      ...(init.prefer && { Prefer: init.prefer }),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.msg ?? json?.message ?? json?.error_description ?? `HTTP ${res.status}`);
  return json;
}

// The Data API: notes the signed-in user may see (row level security filters the rest out)
const notes = (query: string) => session().then((s) => call(`/rest/v1/notes?select=id,body,created_at&order=id${query}`, { token: s.access_token }));
const print = (rows: { id: number; body: string; created_at: string }[]) =>
  rows.forEach((n) => console.log(`  #${n.id}  ${n.created_at.slice(11, 19)}  ${n.body}`));

const [command, ...args] = process.argv.slice(2);
try {
  switch (command) {
    case "signup":
    case "login": {
      // Auth: a session whose access token (a JWT) the Data API checks, and RLS reads the user from
      const [email, password] = args;
      const path = command === "signup" ? "/auth/v1/signup" : "/auth/v1/token?grant_type=password";
      const s = await call(path, { method: "POST", body: { email, password } });
      await Bun.write(file, JSON.stringify({ access_token: s.access_token, user: s.user }));
      console.log(`signed in as ${s.user.email} (${s.user.id.slice(0, 8)})`);
      break;
    }
    case "whoami": {
      const { user } = await session();
      console.log(`${user.email} (${user.id.slice(0, 8)})`);
      break;
    }
    case "add": {
      const { access_token: token } = await session();
      const [n] = await call("/rest/v1/notes", { method: "POST", body: { body: args.join(" ") }, token, prefer: "return=representation" });
      console.log(`#${n.id} added`);
      break;
    }
    case "ls": {
      const rows = await notes("");
      console.log(`${(await session()).user.email}: ${rows.length} note(s)`);
      print(rows);
      break;
    }
    case "search": {
      const rows = await notes(`&body=ilike.*${encodeURIComponent(args.join(" "))}*`);
      console.log(`${rows.length} note(s) matching "${args.join(" ")}"`);
      print(rows);
      break;
    }
    case "rm": {
      const { access_token: token } = await session();
      const gone = await call(`/rest/v1/notes?id=eq.${Number(args[0])}`, { method: "DELETE", token, prefer: "return=representation" });
      console.log(gone.length ? `#${args[0]} removed` : `no note #${args[0]} of yours`);
      break;
    }
    case "logout":
      await file.unlink().catch(() => {});
      console.log("signed out");
      break;
    default:
      console.log("usage: notes signup|login EMAIL PASSWORD · whoami · add TEXT · ls · search WORD · rm ID · logout");
  }
} catch (e) {
  console.error("notes:", (e as Error).message);
  process.exitCode = 1;
}
