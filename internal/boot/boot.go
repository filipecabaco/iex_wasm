// Package boot adds the layer that makes an image bootable in v86: kernel, 9p initramfs and
// consoles, plus the script that runs the app on the browser terminal.
package boot

import (
	_ "embed"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/filipecabaco/snowglobe/internal/docker"
)

//go:embed boot.Dockerfile
var dockerfile []byte

// Console describes what the browser terminal runs.
type Console struct {
	Env     []string // KEY=value
	Workdir string
	Command string // a shell command line
}

// Build builds the boot layer on top of base for platform (linux/386 or linux/arm64) and tags it
// as tag. network is "none" or a v86 network backend ("fetch"); anything but "none" configures
// DHCP on the guest's NIC and trusts caPEM, the CA the page signs HTTPS certificates with.
func Build(base, tag, platform string, console Console, network string, caPEM []byte) error {
	context, err := os.MkdirTemp("", "snowglobe-boot-")
	if err != nil {
		return err
	}
	defer os.RemoveAll(context)

	if err := os.WriteFile(filepath.Join(context, "Dockerfile"), dockerfile, 0o644); err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(context, "snowglobe-console"), []byte(Script(console)), 0o755); err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(context, "snowglobe-ca.crt"), caPEM, 0o644); err != nil {
		return err
	}

	return docker.Run("build", "--platform", platform, "--build-arg", "BASE="+base,
		"--build-arg", "NETWORK="+network, "--tag", tag, context)
}

// Script is the shell script run on the browser terminal: the image's environment, working
// directory and command. The guest's init doesn't know about Docker's ENV, so it's exported here.
func Script(c Console) string {
	var b strings.Builder
	b.WriteString("#!/bin/sh\n")
	for _, kv := range c.Env {
		key, value, ok := strings.Cut(kv, "=")
		if !ok || key == "" {
			continue
		}
		fmt.Fprintf(&b, "export %s=%s\n", key, Quote(value))
	}
	if c.Workdir != "" {
		fmt.Fprintf(&b, "cd %s\n", Quote(c.Workdir))
	}
	b.WriteString("clear\n")
	fmt.Fprintf(&b, "exec %s\n", c.Command)
	return b.String()
}

// Quote single-quotes a value for /bin/sh.
func Quote(s string) string {
	return "'" + strings.ReplaceAll(s, "'", `'\''`) + "'"
}

// Join turns an argv into a shell command line.
func Join(argv []string) string {
	quoted := make([]string, len(argv))
	for i, a := range argv {
		quoted[i] = Quote(a)
	}
	return strings.Join(quoted, " ")
}
