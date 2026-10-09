package pwa

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func site(t *testing.T) string {
	dir := t.TempDir()
	os.WriteFile(filepath.Join(dir, "run.json"), []byte(`{"title":"Go + Bubble Tea in the browser","built_at":"2026-10-09T12:00:00Z"}`), 0o644)
	os.WriteFile(filepath.Join(dir, "index.html"), []byte("<html><head><title>x</title></head><body></body></html>"), 0o644)
	os.MkdirAll(filepath.Join(dir, "v86"), 0o755)
	os.WriteFile(filepath.Join(dir, "v86", "libv86.js"), nil, 0o644)
	return dir
}

func TestRun(t *testing.T) {
	dir := site(t)
	if err := Run(Options{Site: dir}); err != nil {
		t.Fatal(err)
	}

	var manifest map[string]any
	data, _ := os.ReadFile(filepath.Join(dir, "manifest.webmanifest"))
	if err := json.Unmarshal(data, &manifest); err != nil {
		t.Fatal(err)
	}
	if manifest["short_name"] != "Go + Bubble Tea" || manifest["display"] != "standalone" {
		t.Errorf("manifest: %v", manifest)
	}

	sw, _ := os.ReadFile(filepath.Join(dir, "sw.js"))
	if !strings.Contains(string(sw), `"snowglobe-20261009T120000"`) || !strings.Contains(string(sw), `"v86/libv86.js"`) {
		t.Error("sw.js should name the build's cache and precache the shell files that exist")
	}
	if strings.Contains(string(sw), "https-bridge.js") {
		t.Error("sw.js should skip shell files the site doesn't have")
	}
	for _, icon := range []string{"icon-192.png", "icon-512.png"} {
		if _, err := os.Stat(filepath.Join(dir, icon)); err != nil {
			t.Error(err)
		}
	}
}

func TestRunTwiceKeepsOneBlock(t *testing.T) {
	dir := site(t)
	Run(Options{Site: dir})
	if err := Run(Options{Site: dir, ShortName: "Life"}); err != nil {
		t.Fatal(err)
	}
	page, _ := os.ReadFile(filepath.Join(dir, "index.html"))
	if n := strings.Count(string(page), "<!-- snowglobe:pwa -->"); n != 1 {
		t.Errorf("want one pwa block, got %d", n)
	}
	if !strings.Contains(string(page), `content="Life"`) {
		t.Error("the second run's short name should win")
	}
}
