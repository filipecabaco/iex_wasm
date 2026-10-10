// Package tools manages the build container: snowglobe-vm (the armless arm64 machine, to boot
// the guest, snapshot it and run built sites) and the browser runtime copied into every site.
// It runs on the host's native architecture.
package tools

import (
	"embed"
	"fmt"
	"io/fs"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/filipecabaco/snowglobe/internal/docker"
)

//go:embed Dockerfile runtime/Cargo.toml runtime/Cargo.lock runtime/src
var context embed.FS

// VM is snowglobe-vm's path in the image.
const VM = "/tools/snowglobe-vm"

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

	err = fs.WalkDir(context, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil || path == "." {
			return err
		}
		if d.IsDir() {
			return os.MkdirAll(filepath.Join(dir, path), 0o755)
		}
		data, err := context.ReadFile(path)
		if err != nil {
			return err
		}
		return os.WriteFile(filepath.Join(dir, path), data, 0o644)
	})
	if err != nil {
		return nil, err
	}

	tag := "snowglobe-tools:" + version
	// Quiet unless it fails: `snowglobe run` keeps stdout for the session
	if _, err := docker.Output("build", "--quiet", "--tag", tag, dir); err != nil {
		return nil, err
	}
	return &Image{tag: tag}, nil
}

// CopySite copies the browser runtime (armless, xterm.js) into out. build.pruneRuntime then
// drops the machine build the site doesn't load.
func (i *Image) CopySite(out string) error {
	return i.run(out, nil, "cp", "-R", "/tools/site/.", "/out/")
}

// The console size the guest boots and is snapshotted with. The page replays the snapshot's
// screen at this size before fitting the terminal to the window, so full-screen apps and line
// editors find the screen exactly as they left it, then get a resize like any other.
const (
	ConsoleCols = 90
	ConsoleRows = 30
)

// Snapshot boots <out>/system and writes the state, console replay and reads.json there.
//
// After the snapshot it types each exercise command into the app and records what it reads.
func (i *Image) Snapshot(out string, memoryMB int, ready string, exercises []string, network string, cpus int) error {
	args := []string{VM, "snapshot", "/out/system",
		"--memory", fmt.Sprint(memoryMB), "--network", network, "--cpus", fmt.Sprint(cpus),
		"--cols", fmt.Sprint(ConsoleCols), "--rows", fmt.Sprint(ConsoleRows)}
	if ready != "" {
		args = append(args, "--ready", ready)
	}
	for _, e := range exercises {
		args = append(args, "--exercise", e)
	}
	var extra []string
	if network != "none" {
		extra = NetworkArgs()
	}
	return i.run(out, extra, args...)
}

// run executes a command in the tools image with out mounted at /out, as the current user so
// files written there aren't owned by root on Linux.
func (i *Image) run(out string, extra []string, command ...string) error {
	args := []string{"run", "--rm", "--user", fmt.Sprintf("%d:%d", os.Getuid(), os.Getgid()),
		"-v", out + ":/out"}
	args = append(append(args, extra...), i.tag)
	return docker.Run(append(args, command...)...)
}

var proxyVars = []string{"HTTPS_PROXY", "https_proxy", "HTTP_PROXY", "http_proxy", "ALL_PROXY", "all_proxy",
	"NO_PROXY", "no_proxy"}

// NetworkArgs are the `docker run` arguments that let a guest with a network out the way the
// host goes out: the host's proxy settings and CA bundle (sandboxes often only allow HTTPS
// through a TLS-intercepting proxy). A proxy on the host's loopback is only reachable from the
// host's network namespace, so then the container shares it; the guest itself still can't reach
// private addresses (armless refuses them).
func NetworkArgs() []string {
	var args []string
	hostNet := false
	for _, v := range proxyVars {
		value := os.Getenv(v)
		if value == "" {
			continue
		}
		args = append(args, "-e", v+"="+value)
		if !strings.HasPrefix(strings.ToLower(v), "no_") && loopback(value) {
			hostNet = true
		}
	}
	if hostNet {
		args = append(args, "--network", "host")
	}
	if ca := os.Getenv("SSL_CERT_FILE"); ca != "" {
		if abs, err := filepath.Abs(ca); err == nil {
			if _, err := os.Stat(abs); err == nil {
				args = append(args, "-v", abs+":/etc/snowglobe/ca-bundle.pem:ro", "-e", "SSL_CERT_FILE=/etc/snowglobe/ca-bundle.pem")
			}
		}
	}
	return args
}

func loopback(proxy string) bool {
	if !strings.Contains(proxy, "://") {
		proxy = "http://" + proxy
	}
	u, err := url.Parse(proxy)
	if err != nil {
		return false
	}
	h := u.Hostname()
	return h == "localhost" || strings.HasPrefix(h, "127.") || h == "::1"
}
