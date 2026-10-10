# Elixir + Ecto + PostgreSQL: a Mix release and a Postgres server, both running in the tab.
# Postgres is Alpine's own package; Postgrex is pure Elixir, so nothing needs compiling.
FROM alpine:3.24.2 AS build
RUN apk add --no-cache elixir erlang28 git
ENV MIX_ENV=prod LANG=C.UTF-8
WORKDIR /src
RUN mix local.hex --force && mix local.rebar --force
COPY mix.exs mix.lock ./
COPY config config
RUN mix deps.get --only prod && mix deps.compile
COPY lib lib
RUN mix release --path /release

FROM alpine:3.24.2
RUN apk add --no-cache libstdc++ libgcc ncurses-libs zlib postgresql18 postgresql18-client

# A cluster made at build time, sized for a browser tab: small buffers, a handful of connections,
# and no durability work, since the disk is the visitor's memory and goes away with the tab
RUN install -d -o postgres -g postgres -m 700 /var/lib/postgresql/data && \
    su postgres -s /bin/sh -c "initdb -D /var/lib/postgresql/data -U postgres --auth=trust --encoding=UTF8 --no-locale" >/dev/null && \
    printf '%s\n' \
      "listen_addresses = ''" \
      "unix_socket_directories = '/run/postgresql'" \
      "max_connections = 10" \
      "shared_buffers = 16MB" \
      "dynamic_shared_memory_type = mmap" \
      "fsync = off" \
      "synchronous_commit = off" \
      "full_page_writes = off" \
      "wal_level = minimal" \
      "max_wal_senders = 0" \
      "autovacuum = off" \
      "jit = off" \
      >> /var/lib/postgresql/data/postgresql.conf

COPY --from=build /release /app
COPY start.sh /app/start.sh
COPY demo.iex.exs /root/.iex.exs

# A browser tab is one node: without distribution the prompt is a plain iex(1)>
ENV LANG=C.UTF-8 HOME=/root RELEASE_DISTRIBUTION=none
WORKDIR /app
CMD ["/app/start.sh"]

LABEL snowglobe.title="Elixir + Postgres in the browser" \
      snowglobe.ready="iex(1)> " \
      snowglobe.memory="640" snowglobe.cpus="4" \
      snowglobe.exercise='["sql \"SHOW server_version\"", "sql \"SELECT app, count(*) AS modules, pg_size_pretty(sum(bytes)) AS size FROM modules GROUP BY app ORDER BY sum(bytes) DESC LIMIT 8\"", "Repo.all(from m in ModuleRow, where: m.app == \"postgrex\", order_by: [desc: m.functions], limit: 5, select: {m.name, m.functions})", "sql \"SELECT app, name, functions, rank() OVER (PARTITION BY app ORDER BY functions DESC) FROM modules WHERE app IN (\u0027ecto\u0027, \u0027postgrex\u0027) ORDER BY 4, 1 LIMIT 6\"", "h Ecto.Query.from"]'
