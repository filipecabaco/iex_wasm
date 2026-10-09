// Package instance runs a built site headlessly in a sandboxed container: the guest is restored
// from its snapshot in v86 under Node, and its app console is connected to the terminal (or to a
// pipe, or left running for `exec` and `attach`).
package instance

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/filipecabaco/snowglobe/internal/docker"
	"github.com/filipecabaco/snowglobe/internal/tools"
)

// label marks the containers snowglobe started, for ps
const label = "snowglobe.instance"

// Options for Run.
type Options struct {
	Site   string
	Name   string
	Detach bool
}

// Run restores the site and connects to it, or leaves it running when detached.
func Run(o Options, version string) error {
	site, err := filepath.Abs(o.Site)
	if err != nil {
		return err
	}
	data, err := os.ReadFile(filepath.Join(site, "run.json"))
	if err != nil {
		return fmt.Errorf("%s isn't a built snowglobe site (no run.json)", o.Site)
	}
	var run struct {
		MemoryMB int    `json:"memory_mb"`
		Network  string `json:"network"`
	}
	if err := json.Unmarshal(data, &run); err != nil {
		return err
	}

	t, err := tools.Build(version)
	if err != nil {
		return err
	}

	// The sandbox: the guest is an emulated machine with no access to the host, and the container
	// around it runs unprivileged, read-only, memory-capped and offline unless the site was built
	// with a network
	args := []string{"run", "--rm", "--init",
		"--label", label + "=" + site,
		"--user", "65534:65534", "--read-only", "--tmpfs", "/tmp",
		"--cap-drop", "ALL", "--security-opt", "no-new-privileges",
		"--memory", fmt.Sprintf("%dm", run.MemoryMB+768), "--pids-limit", "256",
		"-v", site + ":/site:ro"}
	if run.Network != "fetch" {
		args = append(args, "--network", "none")
	}
	command := []string{"node", "/tools/run.mjs", "/site"}

	// A pooled site keeps its blobs in the directory next to it
	if _, err := os.Stat(filepath.Join(site, "system", "filesystem")); err != nil {
		blobs := filepath.Join(filepath.Dir(site), "blobs")
		if _, err := os.Stat(blobs); err != nil {
			return fmt.Errorf("%s has neither system/filesystem nor a pooled ../blobs", o.Site)
		}
		args = append(args, "-v", blobs+":/blobs:ro")
		command = append(command, "--blobs", "/blobs")
	}
	if o.Name != "" {
		args = append(args, "--name", o.Name)
	}

	if o.Detach {
		if o.Name == "" {
			return fmt.Errorf("a detached instance needs --name, to exec into it later")
		}
		args = append(append(args, "--detach", t.Tag()), append(command, "--detached")...)
		if _, err := docker.Output(args...); err != nil {
			return err
		}
		fmt.Fprintf(os.Stderr, "%s is restoring in the background.\n  snowglobe exec %s '<command>'\n  snowglobe attach %s\n  snowglobe stop %s\n",
			o.Name, o.Name, o.Name, o.Name)
		return nil
	}

	args = append(args, "--interactive")
	if isTerminal(os.Stdin) && isTerminal(os.Stdout) {
		args = append(args, "--tty")
	}
	return docker.Attached(append(append(args, t.Tag()), command...)...)
}

// Exec types one command into a running instance and prints what it printed.
func Exec(name string, command []string) error {
	return docker.Attached(append([]string{"exec", "--interactive", name, "node", "/tools/client.mjs", "exec"}, command...)...)
}

// Attach joins a running instance's session; ctrl-] detaches.
func Attach(name string) error {
	args := []string{"exec", "--interactive"}
	if isTerminal(os.Stdin) {
		args = append(args, "--tty")
	}
	return docker.Attached(append(args, name, "node", "/tools/client.mjs", "attach")...)
}

// Stop throws an instance away.
func Stop(name string) error {
	_, err := docker.Output("rm", "--force", name)
	return err
}

// List prints the running instances.
func List() error {
	out, err := docker.Output("ps", "--filter", "label="+label, "--format",
		`{{.Names}}\t{{.Label "`+label+`"}}\t{{.RunningFor}}`)
	if err != nil {
		return err
	}
	if out == "" {
		fmt.Println("no instances running")
		return nil
	}
	fmt.Println("NAME\tSITE\tSTARTED")
	for _, line := range strings.Split(out, "\n") {
		fmt.Println(line)
	}
	return nil
}

func isTerminal(f *os.File) bool {
	info, err := f.Stat()
	return err == nil && info.Mode()&os.ModeCharDevice != 0
}
