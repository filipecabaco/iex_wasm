#!/bin/bash
# The guest's console runs this as root; the stack runs as supa (Postgres refuses root)
if [ "$(id -u)" = 0 ]; then
  exec su supa -s /bin/bash -c "cd ~/app && exec /usr/local/bin/supabase-demo"
fi
export SUPABASE_EXPERIMENTAL_STACK=1 SUPABASE_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1 CI=1
# Node keeps the code it compiled, so the next command (and the snapshot) starts warm
export NODE_COMPILE_CACHE="$HOME/.cache/node-compile"

echo "Starting Supabase's native stack: Postgres, PostgREST and Auth (no Docker) ..."
supabase stack start --runtime native \
  -x realtime -x storage -x functions -x studio -x mail -x analytics -x pooler </dev/null 2>&1 |
  grep -v -e "new version of Supabase CLI" -e "recommend updating" || exit 1
# API_URL, DB_URL, ANON_KEY, SERVICE_ROLE_KEY, ... for the shell (the stack picks its own ports)
eval "$(supabase status --env </dev/null 2>/dev/null)"
export API_URL DB_URL ANON_KEY SERVICE_ROLE_KEY PUBLISHABLE_KEY SECRET_KEY
# curl with the service role's key, for the REST API
sb-auth() { curl -sS -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" "$@"; }
export -f sb-auth

# Auth and PostgREST start on their first request, and Node compiles notes on its first run: do
# both now, so they're in the snapshot instead of in a visitor's first command
curl -sS -o /dev/null "$API_URL/auth/v1/health"
curl -sS -o /dev/null -H "apikey: $ANON_KEY" "$API_URL/rest/v1/"
notes ls >/dev/null 2>&1 || true


cat <<'MOTD'

  Supabase's local stack, running natively in this machine: Postgres, PostgREST and Auth.
  notes is a small app on it (Auth, the REST API and row level security). Try:

    notes signup ada@example.com lovelace-1815
    notes add first program, for the analytical engine
    notes ls
    notes signup grace@example.com hopper-1906 && notes ls     # Grace can't see Ada's notes
    psql "$DB_URL" -c "select email from auth.users"
    sb-auth "$API_URL/rest/v1/notes" | jq                     # the service role sees them all
    supabase stack status

MOTD
export PS1='\u:\w$ '
export PS1
exec bash --norc -i
