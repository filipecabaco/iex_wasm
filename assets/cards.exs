# Writes one X player card per demo from assets/cards.json:
#
#   site/card/<dir>/index.html   the page whose tags make the card (it embeds <dir>/?embed)
#   assets/posters/<dir>.html the poster's source; capture each at 480x480, deviceScaleFactor 2,
#                             into site/card/<dir>/poster.png
#
# Run from the repository root: elixir assets/cards.exs

defmodule Cards do
  def run do
    %{"base" => base, "cards" => cards} = JSON.decode!(File.read!("assets/cards.json"))
    h = &html_escape/1

    for card <- cards do
      page = EEx.eval_file("assets/card.html.eex", card: card, base: base, h: h)
      write!("site/card/#{card["dir"]}/index.html", page)

      poster = EEx.eval_file("assets/poster.html.eex", card: card, h: h, lines: lines(card))
      write!("assets/posters/#{card["dir"]}.html", poster)
      IO.puts("card/#{card["dir"]}")
    end
  end

  # Each line escaped; the demo's prompt dimmed, a leading ! for bold
  defp lines(%{"lines" => lines, "prompt" => prompt}) do
    Enum.map_join(lines, "\n", fn
      "!" <> rest ->
        ~s(<span class="b">#{html_escape(rest)}</span>)

      line ->
        cond do
          prompt != "" and String.starts_with?(line, prompt) -> dim_prompt(line, prompt)
          String.starts_with?(line, "...") or String.starts_with?(line, "   ...>") -> dim_prompt(line, ~r/^\s*\.\.\.>?/)
          true -> html_escape(line)
        end
    end)
  end

  # The prompt runs to the first space after it ("iex(1)>", ">>>", "~ $", "jshell>")
  defp dim_prompt(line, %Regex{} = pattern) do
    [prefix] = Regex.run(pattern, line)
    split(line, String.length(prefix))
  end

  defp dim_prompt(line, prompt) do
    after_prompt = String.slice(line, String.length(prompt)..-1//1)
    extra = after_prompt |> String.split(" ", parts: 2) |> hd() |> String.length()
    # "iex(" and similar need the rest of the token ("1)>")
    length = if String.ends_with?(prompt, " ") or prompt in [">>>", "jshell>"], do: String.length(prompt), else: String.length(prompt) + extra
    split(line, length)
  end

  defp split(line, at) do
    {prompt, rest} = String.split_at(line, at)
    ~s(<span class="p">#{html_escape(prompt)}</span>#{html_escape(rest)})
  end

  defp html_escape(text) do
    text
    |> String.replace("&", "&amp;")
    |> String.replace("<", "&lt;")
    |> String.replace(">", "&gt;")
    |> String.replace("\"", "&quot;")
  end

  defp write!(path, data) do
    File.mkdir_p!(Path.dirname(path))
    File.write!(path, data)
  end
end

Cards.run()
