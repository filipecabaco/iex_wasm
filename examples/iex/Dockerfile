# Elixir IEx: just the interactive shell, from Alpine's own Elixir and Erlang packages.
FROM i386/alpine:3.24.2

RUN apk add --no-cache elixir

ENV LANG=C.UTF-8 HOME=/root
WORKDIR /root
CMD ["iex"]

LABEL snowglobe.title="Elixir IEx in the browser" \
      snowglobe.ready="iex(1)> " \
      snowglobe.memory="384" \
      snowglobe.exercise='["Enum.map(1..5, &(&1 * &1))", "for x <- 1..3, y <- [:a, :b], do: {x, y}", "1..4 |> Task.async_stream(&(&1 * 10)) |> Enum.to_list()", "pid = spawn(fn -> receive do msg -> IO.inspect(msg, label: \"got\") end end)", "send(pid, {:hello, \"from a browser tab\"})", "h Enum.chunk_every"]'
