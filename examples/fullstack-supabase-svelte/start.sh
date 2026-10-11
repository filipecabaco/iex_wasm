#!/bin/bash
# The guest's console runs this as root; the stack runs as supa (Postgres refuses root)
if [ "$(id -u)" = 0 ]; then
  exec su supa -s /bin/bash -c "cd ~/app && exec /usr/local/bin/fullstack-demo"
fi
export SUPABASE_EXPERIMENTAL_STACK=1 SUPABASE_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1 CI=1

echo "Starting Supabase's native stack: Postgres, PostgREST and Auth (no Docker) ..."
# --runtime native: plain processes, no Docker. --eager: every service is up before this returns
# (they're in the snapshot) and none is stopped when idle, so a visitor never waits for a restart.
# Postgres's first start (initdb, then the migrations) can outlast the CLI's 2 minute readiness wait
# on a slow build machine, so the build waits longer; a start that still gives up is resumed.
export SUPABASE_DB_HEALTH_TIMEOUT=15m
for attempt in 1 2 3; do
  supabase stack start --runtime native --eager \
    -x realtime -x storage -x functions -x studio -x mail -x analytics -x pooler </dev/null 2>&1 |
    grep -v -e "new version of Supabase CLI" -e "recommend updating"
  # API_URL, DB_URL, ANON_KEY, SERVICE_ROLE_KEY, ... for the shell (the stack picks its own ports)
  eval "$(supabase status --env </dev/null 2>/dev/null)"
  [ -n "$API_URL" ] && break
  echo "The stack isn't up yet (attempt $attempt of 3), starting it again ..."
done
# Never reach the prompt (and so the snapshot) without the stack
[ -n "$API_URL" ] || { echo "Supabase's stack didn't start."; exit 1; }
export API_URL DB_URL ANON_KEY SERVICE_ROLE_KEY PUBLISHABLE_KEY SECRET_KEY
# curl with the service role's key, for the REST API
sb-auth() { curl -sS -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" "$@"; }
export -f sb-auth

# Warm everything a visitor's first commands go through, so it's done in the snapshot rather than
# on their clock: a first signup loads Auth's sign-up path (bcrypt, JWT signing) and opens its
# database connections; a first insert fills PostgREST's schema cache and plans the row level
# security policies; notes' first run reads Node in. A throwaway user does all of it, then it's
# removed and the counter reset, so visitors start from an empty app.
curl -sS -o /dev/null "$API_URL/auth/v1/health"
curl -sS -o /dev/null -H "apikey: $ANON_KEY" "$API_URL/rest/v1/"
notes signup warmup@example.com warmup-password >/dev/null 2>&1 &&
  notes add warming up >/dev/null 2>&1 && notes ls >/dev/null 2>&1 && notes search up >/dev/null 2>&1 &&
  notes login warmup@example.com warmup-password >/dev/null 2>&1
notes logout >/dev/null 2>&1
psql "$DB_URL" -qc "delete from auth.users where email = 'warmup@example.com'; truncate notes restart identity" >/dev/null 2>&1


# Each Kit postbuild worker otherwise reparses the same large JS toolchain on the emulated CPU.
# Prime Node's supported bytecode cache in the guest (matching its V8 CPU/version tag), not a host process.
export NODE_COMPILE_CACHE=/home/supa/node-compile-cache
echo "Warming the SvelteKit module compile cache ..."
(cd /home/supa/dependencies && env -u SERVICE_ROLE_KEY -u SECRET_KEY -u DB_URL node --input-type=module -e "
  import { flushCompileCache, getCompileCacheDir } from 'node:module';
  if (!getCompileCacheDir()) throw new Error('Node compile cache was not enabled');
  await import('@sveltejs/kit/vite'); await import('@tailwindcss/vite');
  flushCompileCache();
") || exit 1

# The file and preview bridges listen before the snapshot's ready marker.
# Privileged database keys remain in the shell, not in the Svelte compiler/controller environment.
env -u SERVICE_ROLE_KEY -u SECRET_KEY -u DB_URL node /opt/svelte/runtime.mjs >/tmp/svelte-runtime.log 2>&1 &
runtime_pid=$!
for attempt in $(seq 1 60); do
  grep -q 'Svelte workspace and preview bridges ready' /tmp/svelte-runtime.log && break
  kill -0 "$runtime_pid" 2>/dev/null || { cat /tmp/svelte-runtime.log; exit 1; }
  sleep 1
done
grep -q 'Svelte workspace and preview bridges ready' /tmp/svelte-runtime.log || exit 1

cat <<'MOTD'

  Full-stack Supabase + Svelte: Svelte 5, SvelteKit, shadcn-svelte and Tailwind.
  Choose a working folder in the page; create a starter only in an empty folder.
  Edit ordinary files with your local editor, then click Sync & preview.
  Dependencies use /home/supa/dependencies, outside the /workspace mirror.
  Run npm install/uninstall in /workspace, then Save package manifests to disk.
  Preview and Auth/Data API requests stay in this tab through a service worker.
  Keep this VM tab open. Sync never writes disk; Save now separately preserves Postgres.

  The original Supabase notes commands run on Node here. Try:

    notes signup ada@example.com lovelace-1815
    notes add first program, for the analytical engine
    notes search engine
    notes ls
    notes signup grace@example.com hopper-1906 && notes ls     # Grace can't see Ada's notes
    psql "$DB_URL" -c "select email from auth.users"
    sb-auth "$API_URL/rest/v1/notes" | jq                     # the service role sees them all
    supabase stack status

MOTD
cd /workspace
export PATH=/workspace/node_modules/.bin:$PATH
export PS1='svelte:\w$ '
exec bash --norc -i
