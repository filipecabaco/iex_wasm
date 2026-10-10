// Package site renders the page that boots the snapshot in the browser.
package site

import (
	_ "embed"
	"html/template"
	"os"
	"path/filepath"
)

//go:embed index.html.tmpl
var page string

//go:embed isolate.js
var isolateWorker []byte

var tmpl = template.Must(template.New("index").Parse(page))

// Page holds what varies between sites.
type Page struct {
	Title    string
	MemoryMB int    // must match the snapshot
	Network  string // "none" or "fetch"; must match the snapshot
	CPUs     int    // must match the snapshot; more than one needs cross-origin isolation
	// The console size the snapshot was taken at: its screen is replayed at this size
	ConsoleCols, ConsoleRows int
}

// Render writes <out>/index.html and marks the site for GitHub Pages.
func Render(out string, p Page) error {
	f, err := os.Create(filepath.Join(out, "index.html"))
	if err != nil {
		return err
	}
	defer f.Close()
	if err := tmpl.Execute(f, p); err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(out, ".nojekyll"), nil, 0o644); err != nil {
		return err
	}
	// Several CPUs need a cross-origin isolated page: sw.js makes it one
	if p.CPUs > 1 {
		if err := os.WriteFile(filepath.Join(out, "sw.js"), isolateWorker, 0o644); err != nil {
			return err
		}
	}
	return f.Close()
}
