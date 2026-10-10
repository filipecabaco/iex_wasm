// Package tools manages the build container: Node with v86 (to boot the guest and snapshot it)
// and the browser runtime copied into every site. It runs on the host's native architecture.
package tools

import (
	"embed"
	"fmt"
	"os"
	"path/filepath"

	"github.com/filipecabaco/snowglobe/internal/docker"
)

//go:embed Dockerfile package.json package-lock.json build-state.mjs run.mjs client.mjs
var context embed.FS

// Image is a built tools image.
type Image struct{ tag string }

// Tag is the image reference, for running it directly.
func (i *Image) Tag() string { return i.tag }

// Build builds (or reuses from Docker's cache) the tools image for this snowglobe version.
func Build(version string) (*Image, error) {
	dir, err := os.MkdirTemp("", "snowglobe-tools-")
	if err != nil {
		return nil, err
	}
	defer os.RemoveAll(dir)

	entries, _ := context.ReadDir(".")
	for _, e := range entries {
		data, _ := context.ReadFile(e.Name())
		if err := os.WriteFile(filepath.Join(dir, e.Name()), data, 0o644); err != nil {
			return nil, err
		}
	}

	tag := "snowglobe-tools:" + version
	// Quiet unless it fails: `snowglobe run` keeps stdout for the session
	if _, err := docker.Output("build", "--quiet", "--tag", tag, dir); err != nil {
		return nil, err
	}
	return &Image{tag: tag}, nil
}

// CopySite copies the browser runtime (v86 with both machines, xterm.js, BIOS) into out.
// build.pruneRuntime then drops what the site's machine doesn't load.
func (i *Image) CopySite(out string) error {
	return i.run(out, "cp", "-R", "/tools/site/.", "/out/")
}

// Snapshot boots <out>/system in v86 and writes the state, console replay and reads.json there.
//
// After the snapshot it types each exercise command into the app and records what it reads.
func (i *Image) Snapshot(out string, memoryMB int, ready string, exercises []string, network, arch string, cpus int) error {
	args := []string{"node", "/tools/build-state.mjs", "/tools/node_modules/v86/build", "/out/bios", "/out/system",
		"--memory", fmt.Sprint(memoryMB), "--network", network, "--arch", arch, "--cpus", fmt.Sprint(cpus)}
	if ready != "" {
		args = append(args, "--ready", ready)
	}
	for _, e := range exercises {
		args = append(args, "--exercise", e)
	}
	return i.run(out, args...)
}

// run executes a command in the tools image with out mounted at /out, as the current user so
// files written there aren't owned by root on Linux.
func (i *Image) run(out string, command ...string) error {
	args := []string{"run", "--rm", "--user", fmt.Sprintf("%d:%d", os.Getuid(), os.Getgid()),
		"-v", out + ":/out", i.tag}
	return docker.Run(append(args, command...)...)
}
