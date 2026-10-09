// Package build turns a Docker image into a static site that runs it in the browser:
// source image -> boot layer -> 9p filesystem -> page -> snapshot -> warm pack.
package build

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"time"

	"github.com/filipecabaco/snowglobe/internal/boot"
	"github.com/filipecabaco/snowglobe/internal/docker"
	"github.com/filipecabaco/snowglobe/internal/rootfs"
	"github.com/filipecabaco/snowglobe/internal/site"
	"github.com/filipecabaco/snowglobe/internal/tools"
)

const (
	sourceTag = "snowglobe-source"
	bootTag   = "snowglobe-boot"
	marker    = ".snowglobe"
	// Image labels that let a Dockerfile describe its own snowglobe settings
	labelPrefix = "snowglobe."
)

// Options are the user's choices; empty fields fall back to image labels, then defaults.
type Options struct {
	Source string // a directory with a Dockerfile, or an image reference
	Out    string
	Title  string
	Cmd    string
	Ready  string
	Memory int
	Warm   string
}

// Settings are the resolved values a build runs with.
type Settings struct {
	Title   string
	Command string
	Ready   string
	Memory  int
	Warm    *regexp.Regexp
	Console boot.Console
}

// Run builds the site.
func Run(o Options, version string) error {
	out, err := filepath.Abs(o.Out)
	if err != nil {
		return err
	}
	if err := prepareOut(out); err != nil {
		return err
	}

	var t *tools.Image
	if err := step("Build tools image", func() (err error) { t, err = tools.Build(version); return }); err != nil {
		return err
	}
	if err := step("Resolve source image", func() error { return resolveSource(o.Source) }); err != nil {
		return err
	}

	img, err := docker.Inspect(sourceTag)
	if err != nil {
		return err
	}
	if img.Architecture != "386" {
		return fmt.Errorf("%s is %s; v86 emulates a 32-bit x86 CPU, so build it FROM an i386 Alpine image (e.g. i386/alpine)", o.Source, img.Architecture)
	}
	s, err := Resolve(o, img)
	if err != nil {
		return err
	}
	fmt.Printf("    command: %s\n    ready:   %s\n    memory:  %d MB\n", s.Command, describeReady(s.Ready), s.Memory)

	if err := step("Add boot layer", func() error { return boot.Build(sourceTag, bootTag, s.Console) }); err != nil {
		return err
	}

	var fs *rootfs.Result
	if err := step("Convert to v86 filesystem", func() (err error) {
		fs, err = exportRootfs(filepath.Join(out, "system"))
		if err == nil {
			fmt.Printf("    %d entries, %d MB uncompressed, %d unique files\n", fs.Entries, fs.TotalSize>>20, len(fs.Blobs))
		}
		return
	}); err != nil {
		return err
	}

	if err := step("Assemble page", func() error {
		if err := t.CopySite(out); err != nil {
			return err
		}
		return site.Render(out, site.Page{Title: s.Title, MemoryMB: s.Memory})
	}); err != nil {
		return err
	}

	if err := step("Boot and snapshot", func() error { return t.Snapshot(out, s.Memory, s.Ready) }); err != nil {
		return err
	}

	return step("Write warm pack", func() error {
		readsFile := filepath.Join(out, "system", "boot-reads.txt")
		reads, err := rootfs.ReadBootReads(readsFile)
		if err != nil {
			return err
		}
		os.Remove(readsFile)
		files, bytes, err := rootfs.WriteWarmPack(fs, rootfs.WarmSelection{BootReads: reads, Match: s.Warm}, filepath.Join(out, "system"))
		if err == nil {
			fmt.Printf("    %d files, %d MB (%d read while booting, plus the warm pattern)\n", files, bytes>>20, len(reads))
		}
		return err
	})
}

// Resolve merges options, image labels and defaults.
func Resolve(o Options, img *docker.Image) (*Settings, error) {
	labels := img.Config.Labels
	label := func(name string) string { return labels[labelPrefix+name] }

	s := &Settings{
		Title:  first(o.Title, label("title"), o.Source),
		Ready:  first(o.Ready, label("ready")),
		Memory: o.Memory,
	}

	// A ready marker in the labels describes the image's own command, not one swapped in
	if o.Cmd != "" {
		s.Command = o.Cmd
		s.Ready = o.Ready
	} else {
		s.Command = boot.Join(append(append([]string{}, img.Config.Entrypoint...), img.Config.Cmd...))
	}
	if s.Command == "" {
		return nil, errors.New("the image has no ENTRYPOINT or CMD; pass --cmd")
	}

	if s.Memory == 0 {
		if m := label("memory"); m != "" {
			n, err := strconv.Atoi(m)
			if err != nil {
				return nil, fmt.Errorf("label %smemory: %q is not a number of MB", labelPrefix, m)
			}
			s.Memory = n
		} else {
			s.Memory = 512
		}
	}

	if w := first(o.Warm, label("warm")); w != "" {
		re, err := regexp.Compile(w)
		if err != nil {
			return nil, fmt.Errorf("warm pattern: %w", err)
		}
		s.Warm = re
	}

	s.Console = boot.Console{Env: img.Config.Env, Workdir: img.Config.WorkingDir, Command: s.Command}
	return s, nil
}

func resolveSource(source string) error {
	if _, err := os.Stat(filepath.Join(source, "Dockerfile")); err == nil {
		return docker.Run("build", "--platform", "linux/386", "--tag", sourceTag, source)
	}
	if err := docker.Run("pull", "--platform", "linux/386", source); err != nil {
		return err
	}
	return docker.Run("tag", source, sourceTag)
}

// exportRootfs streams `docker export` of the boot image straight into the converter.
func exportRootfs(systemDir string) (*rootfs.Result, error) {
	container, err := docker.Output("create", "--platform", "linux/386", bootTag)
	if err != nil {
		return nil, err
	}
	defer docker.Output("rm", container)

	var res *rootfs.Result
	err = docker.Stream(func(r io.Reader) (err error) {
		res, err = rootfs.Convert(r, systemDir)
		return
	}, "export", container)
	return res, err
}

// prepareOut only ever deletes a directory snowglobe created, never an arbitrary --out.
func prepareOut(out string) error {
	if entries, err := os.ReadDir(out); err == nil && len(entries) > 0 {
		if _, err := os.Stat(filepath.Join(out, marker)); err != nil {
			return fmt.Errorf("%s exists and wasn't created by snowglobe; pick another --out or empty it", out)
		}
	}
	if err := os.RemoveAll(out); err != nil {
		return err
	}
	if err := os.MkdirAll(out, 0o755); err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(out, marker), nil, 0o644)
}

func step(name string, fn func() error) error {
	fmt.Printf("\n\033[1m==> %s\033[0m\n", name)
	start := time.Now()
	err := fn()
	fmt.Printf("\033[2m    %.1fs\033[0m\n", time.Since(start).Seconds())
	if err != nil {
		return fmt.Errorf("%s: %w", name, err)
	}
	return nil
}

func describeReady(ready string) string {
	if ready == "" {
		return "after 5s of quiet"
	}
	return strconv.Quote(ready)
}

func first(values ...string) string {
	for _, v := range values {
		if v != "" {
			return v
		}
	}
	return ""
}
