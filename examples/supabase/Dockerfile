# Supabase: the Supabase CLI's native local stack (Postgres, PostgREST and Auth as plain processes,
# no Docker) running inside the guest, with the API answering curl in the same shell.
#
# The stack's service builds are glibc programs (2.39 or newer) and this guest is Alpine (musl),
# so Debian's glibc comes along under /usr/glibc with a loader cache of its own: glibc programs
# find only glibc libraries there, while musl ignores both. Every service is downloaded at build
# time, so nothing has to come from GitHub at run time.

# The C library the services expect from the system (everything else ships with them)
FROM debian:13.6-slim AS glibc
RUN mkdir -p /out/usr/glibc/lib /out/etc && \
    cd /lib/aarch64-linux-gnu && \
    cp -L ld-linux-aarch64.so.1 libc.so.6 libdl.so.2 libm.so.6 libpthread.so.0 libresolv.so.2 librt.so.1 \
       /out/usr/glibc/lib/ && \
    echo /usr/glibc/lib > /out/etc/ld.so.conf && \
    ldconfig -r /out && \
    rm /out/etc/ld.so.conf

FROM alpine:3.24.2
COPY --from=glibc /out/usr/glibc /usr/glibc
COPY --from=glibc /out/etc/ld.so.cache /etc/ld.so.cache
# The services' loader path (musl's own is /lib/ld-musl-aarch64.so.1, so the two don't meet), and
# the merged-/usr shell paths their scripts start with
RUN ln -s /usr/glibc/lib/ld-linux-aarch64.so.1 /lib/ld-linux-aarch64.so.1 && \
    ln -s /bin/sh /usr/bin/sh

# The CLI (its linux-arm64-musl build, through npm), and what the stack's scripts need
RUN apk add --no-cache nodejs npm bash tar curl jq postgresql-client && \
    ln -sf /bin/bash /usr/bin/bash && \
    npm install --global --no-audit --no-fund supabase@2.118.0-beta.90 && \
    npm cache clean --force

# Postgres won't run as root, and the CLI starts everything as whoever runs it
RUN adduser -D -s /bin/bash supa
USER supa
WORKDIR /home/supa/app
ENV SUPABASE_EXPERIMENTAL_STACK=1 SUPABASE_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1
RUN supabase init --yes >/dev/null && \
    supabase stack prepare --runtime native --capability database --capability rest --capability auth && \
    # Postgres ships every extension Supabase offers; drop the big ones this demo never loads (none
    # is preloaded, and the CLI only checks its own binaries): Wrappers, PostGIS and its geometry
    # libraries, PL/Perl, PGroonga, and the charset converters for iconv
    cd ~/.supabase/cache/stack/slim-services/postgres/*/linux-arm64 && \
    rm -rf lib/wrappers-*.so share/postgresql/extension/wrappers* \
           lib/postgis*.so lib/address_standardizer*.so lib/libgdal* lib/libSFCGAL* lib/libproj* lib/libgeos* \
           share/postgresql/extension/postgis* share/postgresql/extension/address_standardizer* \
           lib/perl5 lib/plperl*.so lib/libperl.so share/postgresql/extension/plperl* \
           lib/pgroonga*.so lib/libgroonga* share/postgresql/extension/pgroonga* \
           lib/gconv && \
    du -sh .

# notes, a small app on the stack: Auth for users, PostgREST for the table, row level security
# in Postgres keeping each user's notes their own. The migration is applied when the stack starts.
COPY --chown=supa app/package.json ./
RUN npm install --no-audit --no-fund && npm cache clean --force
COPY --chown=supa app/notes.mjs ./
COPY --chown=supa app/supabase/migrations supabase/migrations

USER root
COPY --chmod=755 start.sh /usr/local/bin/supabase-demo
RUN chmod 755 /home/supa/app/notes.mjs && ln -s /home/supa/app/notes.mjs /usr/local/bin/notes
ENV LANG=C.UTF-8
CMD ["/usr/local/bin/supabase-demo"]

LABEL snowglobe.title="Supabase in the browser" \
      snowglobe.memory="640" snowglobe.cpus="2" \
      snowglobe.ready="supa:~/app$ " \
      snowglobe.exercise='["notes signup ada@example.com lovelace-1815", "notes add first program, for the analytical engine", "notes ls", "notes signup grace@example.com hopper-1906", "notes ls", "psql \"$DB_URL\" -c \"select u.email, count(n.id) from auth.users u left join notes n on n.user_id = u.id group by 1\""]'
