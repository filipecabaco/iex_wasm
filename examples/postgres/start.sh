#!/bin/sh
# Postgres first, then psql. The snapshot is taken at the psql prompt, so visitors restore a
# server that is already up. When psql exits, the console starts this again; Postgres is still
# running by then.
if ! pg_isready -q -h /run/postgresql; then
  install -d -o postgres -g postgres /run/postgresql
  su postgres -s /bin/sh -c "pg_ctl -D /var/lib/postgresql/data -l /run/postgresql/server.log -w -s start"
fi
exec psql -h /run/postgresql -U postgres
