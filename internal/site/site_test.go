package site

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func render(t *testing.T, p Page) (string, string) {
	t.Helper()
	dir := t.TempDir()
	p.BuildID = "test-build"
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

func TestFingerprintBindsMachineAndBaseAssets(t *testing.T) {
	dir := t.TempDir()
	files := []string{"system/filesystem.json", "system/state.bin.zst", "armless/armless.js", "armless/armless.wasm", "armless/armless-smp.wasm", "system/tls.json"}
	for _, name := range files {
		file := filepath.Join(dir, name)
		if err := os.MkdirAll(filepath.Dir(file), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(file, []byte(name), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	p := Page{MemoryMB: 256, CPUs: 2, Network: "fetch"}
	original, err := Fingerprint(dir, p)
	if err != nil {
		t.Fatal(err)
	}
	repeat, _ := Fingerprint(dir, p)
	if repeat != original || len(original) != 64 {
		t.Fatal("fingerprint must be deterministic SHA-256")
	}
	for _, changed := range []Page{{MemoryMB: 128, CPUs: 2, Network: "fetch"}, {MemoryMB: 256, CPUs: 1, Network: "fetch"}, {MemoryMB: 256, CPUs: 2, Network: "none"}} {
		id, _ := Fingerprint(dir, changed)
		if id == original {
			t.Error("changed machine is compatible")
		}
	}
	for _, name := range files {
		if name == "armless/armless.wasm" {
			continue // the SMP build doesn't use this asset
		}
		file := filepath.Join(dir, name)
		os.WriteFile(file, []byte("changed"), 0o644)
		id, err := Fingerprint(dir, p)
		if err != nil || id == original {
			t.Errorf("changed %s didn't change fingerprint: %v", name, err)
		}
		os.WriteFile(file, []byte(name), 0o644)
	}
	if err := Render(dir, p); err != nil {
		t.Fatal(err)
	}
	page, _ := os.ReadFile(filepath.Join(dir, "index.html"))
	if !strings.Contains(string(page), original) {
		t.Error("page must embed the fingerprint")
	}
	// Builds prune the unused single/SMP runtime; it must not be required for this machine.
	os.Remove(filepath.Join(dir, "armless/armless.wasm"))
	if _, err := Fingerprint(dir, p); err != nil {
		t.Errorf("SMP fingerprint requires unused single-CPU runtime: %v", err)
	}
	os.Remove(filepath.Join(dir, "system/state.bin.zst"))
	if _, err := Fingerprint(dir, p); err == nil {
		t.Error("missing snapshot must fail rather than use an empty identity")
	}
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

func TestSessionControlsAndSafeReload(t *testing.T) {
	page, dir := render(t, Page{Title: "Session demo", MemoryMB: 256, Network: "none", CPUs: 1})
	for _, want := range []string{`src="sessions.js"`, `src="session-ui.js"`, `id="sessions"`, `id="session-save"`, `id="session-export"`, `id="session-import"`, `id="session-folder"`, `id="session-delete"`, `SnowglobeSessionUI`, `await sessions.prepare()`, `sessions.initialState`, `sessions.attach(emulator, term`, `new ResizeObserver(resize)`, `sessions.message("Workspace could not start"`} {
		if !strings.Contains(page, want) {
			t.Errorf("page lacks persistence integration %q", want)
		}
	}
	for _, name := range []string{"sessions.js", "session-ui.js"} {
		if _, err := os.Stat(filepath.Join(dir, name)); err != nil {
			t.Errorf("missing shipped session asset %s: %v", name, err)
		}
	}
	for _, unsafe := range []string{"localStorage.clear()", "sessionStorage.clear()", "caches.keys()", "getRegistrations()"} {
		if strings.Contains(page, unsafe) {
			t.Errorf("runtime reload must not clear origin-wide state: %s", unsafe)
		}
	}
}

func TestWorkspaceShowsSaveControlsAndExplicitMethods(t *testing.T) {
	page, _ := render(t, Page{Title: "Workspace demo", MemoryMB: 256, Network: "none", CPUs: 1})
	for _, want := range []string{`id="workspace-bar"`, `>Save / restore</summary>`, `id="session-method"`,
		`value="browser"`, `value="backup"`, `value="folder"`, `id="session-filename"`,
		`id="session-autosave"`, `value="60000"`, `value="300000"`, `value="900000"`, `value="off"`,
		`id="session-hint"`, `id="session-last-save"`, `id="session-changes"`, `id="session-paused"`,
		`>Saved workspaces</summary>`, `>Recovery</summary>`, `id="session-open"`} {
		if !strings.Contains(page, want) {
			t.Errorf("simple save UI lacks %q", want)
		}
	}
	for _, unwanted := range []string{`>More options</summary>`, `>Local session`, `>Capturing checkpoint`} {
		if strings.Contains(page, unwanted) {
			t.Errorf("save UI exposes a vague or technical control %q", unwanted)
		}
	}
	menu := strings.Index(page, `id="sessions"`)
	for _, id := range []string{"session-status", "session-location", "session-save", "session-last-save", "session-hint"} {
		if at := strings.Index(page, `id="`+id+`"`); at < 0 || at > menu {
			t.Errorf("%s must remain visible with the save menu closed", id)
		}
	}
}

func TestEditorIsOptInAndShipsWorkingFolderAssets(t *testing.T) {
	p := Page{Title: "Editor", MemoryMB: 512, Network: "fetch", CPUs: 1, Editor: true}
	page, dir := render(t, p)
	for _, want := range []string{`id="editor"`, `id="working-folder-choose"`, `id="working-folder-reconnect"`, `id="working-folder-reload"`, `id="editor-new"`, `id="editor-save"`, `id="editor-delete"`, `id="editor-content"`, `src="working-folder.js"`, `src="folder-ui.js"`, `new SnowglobeFolderUI(sessions)`, `await editor.attach(emulator)`} {
		if !strings.Contains(page, want) {
			t.Errorf("editor page lacks %q", want)
		}
	}
	for _, name := range []string{"working-folder.js", "folder-ui.js"} {
		if _, err := os.Stat(filepath.Join(dir, name)); err != nil {
			t.Errorf("missing editor asset %s: %v", name, err)
		}
	}
	page, dir = render(t, Page{Title: "Terminal", MemoryMB: 512, CPUs: 1, Network: "none"})
	if strings.Contains(page, `id="editor"`) || strings.Contains(page, `src="folder-ui.js"`) {
		t.Error("ordinary demos must remain terminal-only")
	}
	if _, err := os.Stat(filepath.Join(dir, "folder-ui.js")); err == nil {
		t.Error("ordinary demos should not ship editor assets")
	}
}

func TestSeveralCPUsWithNetwork(t *testing.T) {
	page, dir := render(t, Page{Title: "Demo", MemoryMB: 512, Network: "fetch", CPUs: 4})
	for _, want := range []string{"const cpus = 4 ;", `network: { tls: "system/tls.json" }`, `register("sw.js")`} {
		if !strings.Contains(page, want) {
			t.Errorf("page lacks %q", want)
		}
	}
	if strings.Contains(page, "term.resize( 0 , 0 )") || !strings.Contains(page, "fit.fit();") {
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

func TestProjectModeShipsDiskAndPrivatePreviewWithoutEditor(t *testing.T) {
	p := Page{Title: "Full stack", MemoryMB: 1024, Network: "fetch", CPUs: 2}
	// JSON keeps this regression test runnable before the new option exists.
	if err := json.Unmarshal([]byte(`{"Project":true}`), &p); err != nil {
		t.Fatal(err)
	}
	page, dir := render(t, p)
	for _, want := range []string{`id="project-choose"`, `id="project-sync"`, `id="project-init"`, `id="project-preview"`, `id="project-preview-pane"`, `id="project-preview-reload"`, `id="project-preview-close"`, `<iframe id="project-preview-frame" title="Your private Svelte application">`, `src="project-ui.js"`, `new SnowglobeProjectUI(sessions)`} {
		if !strings.Contains(page, want) {
			t.Errorf("project page lacks %q", want)
		}
	}
	if strings.Contains(page, `id="editor-content"`) {
		t.Error("project mode must not add a browser editor")
	}
	if strings.Contains(page, `id="project-preview" target="_blank"`) {
		t.Error("the preview must keep its VM owner foreground")
	}
	for _, name := range []string{"working-folder.js", "project-ui.js", "preview-worker.js"} {
		if _, err := os.Stat(filepath.Join(dir, name)); err != nil {
			t.Errorf("missing asset %s: %v", name, err)
		}
	}
	sw, _ := os.ReadFile(filepath.Join(dir, "sw.js"))
	if !strings.Contains(string(sw), `importScripts("preview-worker.js")`) {
		t.Error("isolation worker must preserve private preview routing")
	}
}
