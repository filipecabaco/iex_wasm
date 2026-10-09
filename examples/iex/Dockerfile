# IEx in the browser. Any i386 Alpine image works with the toolkit: whatever ENTRYPOINT/CMD it
# declares runs on the browser terminal, with its ENV and WORKDIR.
FROM i386/alpine:3.24.2

RUN apk add --no-cache elixir erlang28 && \
    # IEx caps docs and inspect output at 80 columns by default; follow the terminal instead
    echo 'IEx.configure(width: 1000)' > /root/.iex.exs

ENV LANG=C.UTF-8
WORKDIR /root
CMD ["iex"]
