package site

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func render(t *testing.T, p Page) (string, string) {
	t.Helper()
	dir := t.TempDir()
	if err := Render(dir, p); err != nil {
		t.Fatal(err)
	}
	page, err := os.ReadFile(filepath.Join(dir, "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	// html/template pads values in scripts with spaces
	return strings.Join(strings.Fields(string(page)), " "), dir
}

func TestOneCPUOffline(t *testing.T) {
	page, dir := render(t, Page{Title: "Demo <1>", MemoryMB: 256, Network: "none", CPUs: 1, ConsoleCols: 90, ConsoleRows: 30})
	for _, want := range []string{`<script src="armless/armless.js">`, "memory_mb: 256", "const cpus = 1 ;",
		"Demo &lt;1&gt;", "term.resize( 90 , 30 )"} {
		if !strings.Contains(page, want) {
			t.Errorf("page lacks %q", want)
		}
	}
	for _, unwanted := range []string{"v86", "https-bridge", "network: {"} {
		if strings.Contains(page, unwanted) {
			t.Errorf("page has %q", unwanted)
		}
	}
	if _, err := os.Stat(filepath.Join(dir, "sw.js")); err == nil {
		t.Error("a one-CPU site has no service worker of its own")
	}
}

func TestSeveralCPUsWithNetwork(t *testing.T) {
	page, dir := render(t, Page{Title: "Demo", MemoryMB: 512, Network: "fetch", CPUs: 4})
	for _, want := range []string{"const cpus = 4 ;", `network: { tls: "system/tls.json" }`, `register("sw.js")`} {
		if !strings.Contains(page, want) {
			t.Errorf("page lacks %q", want)
		}
	}
	if strings.Contains(page, "term.resize(") {
		t.Error("without a console size the screen is replayed at the window's size")
	}
	sw, err := os.ReadFile(filepath.Join(dir, "sw.js"))
	if err != nil {
		t.Fatal("a site with several CPUs needs sw.js for cross-origin isolation")
	}
	for _, want := range []string{"Cross-Origin-Opener-Policy", "Cross-Origin-Embedder-Policy"} {
		if !strings.Contains(string(sw), want) {
			t.Errorf("sw.js lacks %q", want)
		}
	}
}
