#!/bin/sh
# Postgres first, then the release with IEx attached. The snapshot is taken at the IEx prompt, so
# visitors restore a server that is already up. When IEx exits, the console starts this again;
# Postgres is still running by then.
if ! pg_isready -q -h /run/postgresql; then
  install -d -o postgres -g postgres /run/postgresql
  su postgres -s /bin/sh -c "pg_ctl -D /var/lib/postgresql/data -l /run/postgresql/server.log -w -s start"
fi
exec /app/bin/postgres_tab start_iex
