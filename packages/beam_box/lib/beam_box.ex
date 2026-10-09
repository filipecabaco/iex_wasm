defmodule BeamBox do
  @moduledoc """
  Runs your Elixir release in the browser.

  `mix beam_box.build` turns the project's release into a static site: the release runs on
  32-bit Alpine Linux inside the [v86](https://github.com/copy/v86) x86 emulator, compiled to
  WebAssembly, and the page restores a snapshot taken once the release was up. See
  `Mix.Tasks.BeamBox.Build` for options.
  """
end
