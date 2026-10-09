# Elixir + Ecto + SQLite: a Mix release whose database lives in the tab. exqlite is a NIF (SQLite's
# C source), compiled for 32-bit x86 in the build stage; the release runs with IEx attached.
FROM i386/alpine:3.24.2 AS build
RUN apk add --no-cache elixir erlang28 erlang28-dev build-base git
# exqlite has no precompiled NIF for 32-bit musl: compile SQLite from source
ENV MIX_ENV=prod LANG=C.UTF-8 EXQLITE_FORCE_BUILD=true
WORKDIR /src
RUN mix local.hex --force && mix local.rebar --force
COPY mix.exs mix.lock ./
COPY config config
RUN mix deps.get --only prod && mix deps.compile
COPY lib lib
RUN mix release --path /release

# The release bundles its own ERTS; the runtime only needs the libraries it links against
FROM i386/alpine:3.24.2
RUN apk add --no-cache libstdc++ libgcc ncurses-libs zlib
COPY --from=build /release /app
COPY demo.iex.exs /root/.iex.exs

# A browser tab is one node: without distribution the prompt is a plain iex(1)>
ENV LANG=C.UTF-8 HOME=/root RELEASE_DISTRIBUTION=none
WORKDIR /app
CMD ["/app/bin/sqlite_tab", "start_iex"]

LABEL snowglobe.title="Elixir + SQLite in the browser" \
      snowglobe.ready="iex(1)> " \
      snowglobe.exercise='["sql \"SELECT app, count(*) AS modules, sum(bytes) AS bytes FROM modules GROUP BY app ORDER BY bytes DESC\"", "Repo.all(from m in ModuleRow, order_by: [desc: m.functions], limit: 5, select: {m.name, m.functions})", "sql \"CREATE TABLE scratch (body TEXT)\"", "sql \"INSERT INTO scratch VALUES (1)\"", "h Ecto.Query.from"]'
