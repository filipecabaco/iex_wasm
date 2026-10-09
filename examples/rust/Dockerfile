# Rust: a shell with Rust-built tools (ripgrep, fd, bat) and a small Rust program of our own,
# crabsay, compiled natively for 32-bit x86 in the build stage.
FROM i386/alpine:3.24.2 AS build
RUN apk add --no-cache rust cargo
WORKDIR /src
COPY crabsay ./
RUN cargo build --release

FROM i386/alpine:3.24.2
RUN apk add --no-cache ripgrep fd bat
COPY --from=build /src/target/release/crabsay /usr/local/bin/crabsay
# Something to search: crabsay's own source
COPY crabsay /root/crabsay

ENV LANG=C.UTF-8 PS1='\w $ ' BAT_PAGER='' BAT_THEME=ansi
WORKDIR /root
RUN printf '%s\n' 'Rust in the browser. Try: crabsay hi there · rg fn crabsay · fd .rs · bat crabsay/src/main.rs' > /etc/motd-rust
CMD ["/bin/sh", "-c", "cat /etc/motd-rust; exec /bin/sh"]

LABEL snowglobe.title="Rust in the browser" \
      snowglobe.ready="~ $ " \
      snowglobe.exercise='["crabsay hello from a tab", "rg -n println crabsay", "fd -e rs", "bat --paging=never --style=plain crabsay/src/main.rs | head -5", "echo multi | crabsay"]'
