// snowglobe packages a Docker image into a static website that runs it in the browser: the
// image boots on Linux inside the v86 x86 emulator (WebAssembly), is snapshotted once its app is
// ready, and visitors restore that snapshot in about a second.
package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/filipecabaco/snowglobe/internal/build"
	"github.com/filipecabaco/snowglobe/internal/pool"
	"github.com/filipecabaco/snowglobe/internal/serve"
)

// Set at release time with -ldflags "-X main.version=..."
var version = "dev"

const usage = `snowglobe packages a Docker image into a static website that runs it in the browser.

Usage:
  snowglobe build <dockerfile dir | image> [flags]   build the site
  snowglobe serve [dir] [--port 8000]                preview a built site
  snowglobe pool <dir>                               let every site under dir share one blob
                                                     directory (for hosting several together)
  snowglobe version

Build flags:
  --out DIR       output directory (default: dist)
  --cmd CMD       shell command to run on the terminal (default: the image's ENTRYPOINT + CMD)
  --ready TEXT    terminal output that means the app is ready to snapshot
                  (default: once the terminal has been quiet for 5 seconds)
  --title TEXT    page title (default: the source)
  --memory MB     guest RAM (default: 512)
  --warm REGEX    extra guest paths to preload, on top of what the guest read
  --network NAME  none (default) or fetch: the guest's plain HTTP requests go out through the
                  browser's fetch(), upgraded to HTTPS on HTTPS pages; servers must allow CORS
  --exercise CMD  a command to type into the app after the snapshot, recording the files it reads
                  so they're preloaded too; repeatable. A warm-report.json explains the result

An image can carry its own settings as labels, which flags override:
  LABEL snowglobe.ready="iex(1)> " snowglobe.title="My app" snowglobe.memory="256" \
        snowglobe.exercise='["h Enum.map", "Task.async(fn -> 1 end)"]'
  LABEL snowglobe.network="fetch"

The image must be 32-bit Alpine (FROM i386/alpine): v86 emulates a 32-bit x86 CPU.
Docker is the only requirement.
`

func main() {
	if len(os.Args) < 2 {
		fmt.Fprint(os.Stderr, usage)
		os.Exit(2)
	}

	var err error
	switch os.Args[1] {
	case "build":
		err = runBuild(os.Args[2:])
	case "serve":
		err = runServe(os.Args[2:])
	case "pool":
		err = runPool(os.Args[2:])
	case "version", "--version":
		fmt.Println("snowglobe", version)
	case "help", "-h", "--help":
		fmt.Print(usage)
	default:
		fmt.Fprintf(os.Stderr, "unknown command %q\n\n%s", os.Args[1], usage)
		os.Exit(2)
	}

	if err != nil {
		fmt.Fprintf(os.Stderr, "\033[31merror:\033[0m %v\n", err)
		os.Exit(1)
	}
}

func runBuild(args []string) error {
	fs := flag.NewFlagSet("build", flag.ContinueOnError)
	o := build.Options{}
	fs.StringVar(&o.Out, "out", "dist", "")
	fs.StringVar(&o.Cmd, "cmd", "", "")
	fs.StringVar(&o.Ready, "ready", "", "")
	fs.StringVar(&o.Title, "title", "", "")
	fs.IntVar(&o.Memory, "memory", 0, "")
	fs.StringVar(&o.Warm, "warm", "", "")
	fs.Func("exercise", "", func(v string) error { o.Exercise = append(o.Exercise, v); return nil })
	fs.StringVar(&o.Network, "network", "", "")
	fs.Usage = func() { fmt.Fprint(os.Stderr, usage) }

	positional, err := parse(fs, args)
	if err != nil {
		return err
	}
	if len(positional) != 1 {
		fs.Usage()
		return fmt.Errorf("build takes exactly one source: a directory with a Dockerfile, or an image")
	}
	o.Source = positional[0]

	if err := build.Run(o, version); err != nil {
		return err
	}
	fmt.Printf("\n\033[32m%s is ready to deploy.\033[0m Preview it with: snowglobe serve %s\n", o.Out, o.Out)
	return nil
}

func runServe(args []string) error {
	fs := flag.NewFlagSet("serve", flag.ContinueOnError)
	port := fs.Int("port", 8000, "")
	fs.Usage = func() { fmt.Fprint(os.Stderr, usage) }

	positional, err := parse(fs, args)
	if err != nil {
		return err
	}
	dir := "dist"
	if len(positional) > 0 {
		dir = positional[0]
	}
	return serve.Run(dir, *port)
}

func runPool(args []string) error {
	if len(args) != 1 {
		return fmt.Errorf("pool takes one directory holding the sites to pool")
	}
	stats, err := pool.Run(args[0])
	if err != nil {
		return err
	}
	fmt.Printf("Pooled %d sites: %d files, %d unique, %.0f MB saved\n",
		stats.Sites, stats.Files, stats.Unique, float64(stats.Saved)/(1<<20))
	return nil
}

// parse lets flags come before or after positional arguments; the flag package alone stops at
// the first positional one
func parse(fs *flag.FlagSet, args []string) ([]string, error) {
	var positional []string
	for {
		if err := fs.Parse(args); err != nil {
			return nil, err
		}
		args = fs.Args()
		if len(args) == 0 {
			return positional, nil
		}
		positional = append(positional, args[0])
		args = args[1:]
	}
}
