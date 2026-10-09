# IEx in the browser: the live demo. Any i386 Alpine image works with snowglobe; whatever
# ENTRYPOINT/CMD it declares runs on the browser terminal, with its ENV and WORKDIR.
FROM i386/alpine:3.24.2

RUN apk add --no-cache elixir erlang28 && \
    # IEx caps docs and inspect output at 80 columns by default; follow the terminal instead
    echo 'IEx.configure(width: 1000)' > /root/.iex.exs

ENV LANG=C.UTF-8
WORKDIR /root
CMD ["iex"]

LABEL snowglobe.title="IEx in the browser" snowglobe.ready="iex(1)> "

# Beyond what the guest reads while booting, preload the code visitors reach for first (h/1,
# Task, :crypto...): core Elixir and OTP bytecode, the VM binary, and OpenSSL
LABEL snowglobe.warm="^/usr/lib/(elixir/lib/(elixir|iex|logger|eex)|erlang/lib/(kernel|stdlib|compiler|crypto)-[^/]+)/(ebin|priv/lib)/|^/usr/lib/erlang/erts-[^/]+/bin/|^/usr/lib/lib(crypto|ssl)\\.so|^/etc/ssl/openssl\\.cnf$|^/usr/lib/ossl-modules/"
