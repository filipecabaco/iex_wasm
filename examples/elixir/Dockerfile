# Elixir: IEx, the interactive shell. Any i386 Alpine image works with snowglobe; whatever
# ENTRYPOINT/CMD it declares runs on the browser terminal, with its ENV and WORKDIR.
FROM i386/alpine:3.24.2

RUN apk add --no-cache elixir erlang28 && \
    # IEx caps docs and inspect output at 80 columns by default; follow the terminal instead
    echo 'IEx.configure(width: 1000)' > /root/.iex.exs

ENV LANG=C.UTF-8
WORKDIR /root
CMD ["iex"]

LABEL snowglobe.title="Elixir: IEx in the browser" \
      snowglobe.ready="iex(1)> " \
      snowglobe.exercise='["Enum.map(1..5, &(&1 * &1))", "h Enum.map", "Task.async(fn -> :crypto.hash(:sha256, \"hi\") |> Base.encode16() end) |> Task.await()", "URI.parse(\"https://example.com/path?q=1\")", "DateTime.utc_now() |> DateTime.to_iso8601()", "Regex.scan(~r/\\d+/, \"a1b22c333\")"]'
