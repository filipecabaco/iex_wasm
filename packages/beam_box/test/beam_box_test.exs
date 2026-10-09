defmodule BeamBoxTest do
  use ExUnit.Case, async: true

  alias BeamBox.{Builder, Config}

  @moduletag :tmp_dir

  describe "Config.load/3" do
    test "defaults to the app's release started with IEx", %{tmp_dir: dir} do
      config = Config.load([app: :my_app], [], dir)

      assert config.release == "my_app"
      assert config.cmd == "/app/bin/my_app start_iex"
      assert config.ready == "iex(1)> "
      assert config.out == Path.join(dir, "dist")
      assert {"RELEASE_DISTRIBUTION", "none"} in config.env
    end

    test "uses the first configured release", %{tmp_dir: dir} do
      config = Config.load([app: :my_app, releases: [web: [], worker: []]], [], dir)
      assert config.release == "web"
    end

    test "flags override mix.exs settings, which override defaults", %{tmp_dir: dir} do
      project = [app: :my_app, beam_box: [title: "From mix.exs", memory: 256]]
      config = Config.load(project, [title: "From flag"], dir)

      assert config.title == "From flag"
      assert config.memory == 256
    end

    test "a custom command waits for quiet unless told what ready looks like", %{tmp_dir: dir} do
      assert Config.load([app: :a], [cmd: "/app/bin/a start"], dir).ready == nil
      assert Config.load([app: :a], [cmd: "sh", ready: "# "], dir).ready == "# "
    end
  end

  describe "Builder.release_dockerfile/1" do
    test "copies only what exists, with config before fetching deps", %{tmp_dir: dir} do
      for path <- ~w(mix.exs config lib), do: File.touch!(Path.join(dir, path))
      config = Config.load([app: :my_app, beam_box: [apk: ["imagemagick"]]], [], dir)

      dockerfile = Builder.release_dockerfile(config)

      assert dockerfile =~ "FROM i386/alpine:3.24.2 AS build"
      assert dockerfile =~ "COPY mix.exs ./"
      refute dockerfile =~ "mix.lock"
      refute dockerfile =~ "COPY priv"
      assert dockerfile =~ "mix release my_app --overwrite --path /release"
      assert dockerfile =~ ~r/zlib imagemagick\n/

      [before_deps, after_deps] = String.split(dockerfile, "mix deps.get", parts: 2)
      assert before_deps =~ "COPY config config"
      assert after_deps =~ "COPY lib lib"
    end
  end

  describe "Builder.console_script/1" do
    test "exports the environment and execs the command", %{tmp_dir: dir} do
      config = Config.load([app: :a, beam_box: [env: [GREETING: "it's me"]]], [], dir)
      script = Builder.console_script(config)

      assert script =~ "export GREETING='it'\\''s me'\n"
      assert script =~ "cd /app\n"
      assert String.ends_with?(script, "exec /app/bin/a start_iex\n")
    end
  end
end
