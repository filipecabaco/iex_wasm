package build

import (
	"testing"

	"github.com/filipecabaco/snowglobe/internal/docker"
)

func image(labels map[string]string, cmd ...string) *docker.Image {
	img := &docker.Image{Architecture: "386"}
	img.Config.Cmd = cmd
	img.Config.Labels = labels
	return img
}

func TestResolveDefaults(t *testing.T) {
	s, err := Resolve(Options{Source: "i386/alpine"}, image(nil, "/bin/sh"))
	if err != nil {
		t.Fatal(err)
	}
	if s.Command != "'/bin/sh'" || s.Ready != "" || s.Memory != 512 || s.Title != "i386/alpine" || s.Warm != nil {
		t.Errorf("%+v", s)
	}
}

func TestResolveLabelsThenFlags(t *testing.T) {
	labels := map[string]string{
		"snowglobe.title": "From label", "snowglobe.ready": "iex(1)> ", "snowglobe.memory": "256",
	}

	s, _ := Resolve(Options{}, image(labels, "iex"))
	if s.Title != "From label" || s.Ready != "iex(1)> " || s.Memory != 256 {
		t.Errorf("labels not applied: %+v", s)
	}

	s, _ = Resolve(Options{Title: "From flag", Memory: 128}, image(labels, "iex"))
	if s.Title != "From flag" || s.Memory != 128 {
		t.Errorf("flags should win: %+v", s)
	}
}

func TestResolveCmdDropsImageReady(t *testing.T) {
	labels := map[string]string{"snowglobe.ready": "iex(1)> "}

	s, _ := Resolve(Options{Cmd: "erl"}, image(labels, "iex"))
	if s.Command != "erl" || s.Ready != "" {
		t.Errorf("the image's ready marker belongs to its own command: %+v", s)
	}

	s, _ = Resolve(Options{Cmd: "erl", Ready: "1> "}, image(labels, "iex"))
	if s.Ready != "1> " {
		t.Errorf("an explicit --ready still applies: %+v", s)
	}
}

func TestResolveErrors(t *testing.T) {
	if _, err := Resolve(Options{}, image(nil)); err == nil {
		t.Error("an image with no command should need --cmd")
	}
	if _, err := Resolve(Options{}, image(map[string]string{"snowglobe.memory": "lots"}, "sh")); err == nil {
		t.Error("a non-numeric memory label should fail")
	}
	if _, err := Resolve(Options{Warm: "("}, image(nil, "sh")); err == nil {
		t.Error("a bad warm pattern should fail")
	}
}

func TestResolveExercise(t *testing.T) {
	labels := map[string]string{"snowglobe.exercise": `["h Enum.map", "1 + 1"]`}

	s, _ := Resolve(Options{}, image(labels, "iex"))
	if len(s.Exercise) != 2 || s.Exercise[0] != "h Enum.map" {
		t.Errorf("label exercises: %+v", s.Exercise)
	}

	s, _ = Resolve(Options{Cmd: "erl"}, image(labels, "iex"))
	if len(s.Exercise) != 0 {
		t.Errorf("exercises belong to the image's own command: %+v", s.Exercise)
	}

	if _, err := Resolve(Options{}, image(map[string]string{"snowglobe.exercise": "h Enum"}, "iex")); err == nil {
		t.Error("a non-JSON exercise label should fail")
	}
}
