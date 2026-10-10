// snowglobe packages a Docker image into a static website that runs it in the browser: the
// image boots on Linux inside armless, a 64-bit ARM machine compiled to WebAssembly, is
// snapshotted once its app is ready, and visitors restore that snapshot in about a second.
package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"github.com/filipecabaco/snowglobe/internal/build"
	"github.com/filipecabaco/snowglobe/internal/instance"
	"github.com/filipecabaco/snowglobe/internal/pack"
	"github.com/filipecabaco/snowglobe/internal/pool"
	"github.com/filipecabaco/snowglobe/internal/pwa"
	"github.com/filipecabaco/snowglobe/internal/remote"
	"github.com/filipecabaco/snowglobe/internal/serve"
	"github.com/filipecabaco/snowglobe/internal/tools"
)

// Set at release time with -ldflags "-X main.version=..."
var version = "dev"

const usage = `snowglobe packages a Docker image into a static website that runs it in the browser.

Usage:
  snowglobe build <dockerfile dir | image> [flags]   build the site
  snowglobe serve [dir] [--port 8000]                preview a built site
  snowglobe pool <dir>                               let every site under dir share one blob
                                                     directory (for hosting several together)
  snowglobe pwa <dir> [--name N] [--short-name N]     make a built site an installable app that works
                                                     offline once it has run (manifest, icons,
                                                     service worker)
  snowglobe pack <dir> [-o site.tar.gz]              pack a built site into one tarball (.tar.gz,
                                                     .tar.zst) to publish on a CDN
  snowglobe run [dir | url] [--name N] [--detach]    run a built site in a sandboxed container:
                                                     a session in a terminal; with stdin piped,
                                                     each line is typed in as a command. The site
                                                     can be a directory, a tarball, a tarball URL
                                                     or a deployed site's URL (fetched and cached
                                                     first; the sandbox stays offline).
                                                     -p 8000:8000 forwards a host port to a guest
                                                     port (127.0.0.1 unless IP:HOST:GUEST); needs a
                                                     site built with --network fetch
  snowglobe exec <name> <command>                    type a command into a running instance and
                                                     print what it printed
  snowglobe attach <name>                            join a running instance (ctrl-] detaches)
  snowglobe stop <name>                              throw a running instance away
  snowglobe ps                                       list running instances
  snowglobe tools                                    build the tools image (or find it) and print its tag
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
  --cpus N        guest CPUs, 1 to 8 (default: 1). More than one runs each CPU in its own Web
                  Worker; the page then makes itself cross-origin isolated with a service worker

An image can carry its own settings as labels, which flags override:
  LABEL snowglobe.ready="iex(1)> " snowglobe.title="My app" snowglobe.memory="256" \
        snowglobe.exercise='["h Enum.map", "Task.async(fn -> 1 end)"]'
  LABEL snowglobe.network="fetch" snowglobe.cpus="2"

The image must be 64-bit ARM Alpine: FROM alpine (multi-arch; snowglobe builds it for arm64)
or arm64v8/alpine. Docker is the only requirement. On an x86 host, building arm64 images needs
QEMU's binfmt handlers (Docker Desktop has them; on Linux:
docker run --privileged --rm tonistiigi/binfmt --install arm64).

With --network fetch, the guest's HTTP, HTTPS and WebSockets go out through the browser's fetch()
and WebSocket on the page (servers must allow CORS), and straight out of "snowglobe run"'s
container (through the proxy in HTTPS_PROXY/HTTP_PROXY/NO_PROXY if set, trusting SSL_CERT_FILE).
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
	case "pwa":
		err = runPWA(os.Args[2:])
	case "run":
		err = runRun(os.Args[2:])
	case "pack":
		err = runPack(os.Args[2:])
	case "exec":
		if len(os.Args) < 4 {
			err = fmt.Errorf("exec takes an instance name and a command")
		} else {
			err = instance.Exec(os.Args[2], os.Args[3:])
		}
	case "attach":
		if len(os.Args) != 3 {
			err = fmt.Errorf("attach takes an instance name")
		} else {
			err = instance.Attach(os.Args[2])
		}
	case "stop":
		if len(os.Args) != 3 {
			err = fmt.Errorf("stop takes an instance name")
		} else {
			err = instance.Stop(os.Args[2])
		}
	case "ps":
		err = instance.List()
	case "tools":
		// Build (or find) the tools image and print its tag, e.g. to build it once in CI
		var t *tools.Image
		if t, err = tools.Build(version); err == nil {
			fmt.Println(t.Tag())
		}
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
	fs.IntVar(&o.CPUs, "cpus", 0, "")
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

func runPWA(args []string) error {
	fs := flag.NewFlagSet("pwa", flag.ContinueOnError)
	o := pwa.Options{}
	fs.StringVar(&o.Name, "name", "", "")
	fs.StringVar(&o.ShortName, "short-name", "", "")
	fs.Usage = func() { fmt.Fprint(os.Stderr, usage) }

	positional, err := parse(fs, args)
	if err != nil {
		return err
	}
	if len(positional) != 1 {
		return fmt.Errorf("pwa takes one built site directory")
	}
	o.Site = positional[0]
	if err := pwa.Run(o); err != nil {
		return err
	}
	fmt.Printf("%s is an installable app now: manifest.webmanifest, icons and sw.js added\n", o.Site)
	return nil
}

func runPack(args []string) error {
	fs := flag.NewFlagSet("pack", flag.ContinueOnError)
	out := fs.String("o", "", "")
	fs.Usage = func() { fmt.Fprint(os.Stderr, usage) }

	positional, err := parse(fs, args)
	if err != nil {
		return err
	}
	if len(positional) != 1 {
		return fmt.Errorf("pack takes one built site directory")
	}
	site := positional[0]
	if *out == "" {
		*out = filepath.Base(filepath.Clean(site)) + ".tar.gz"
	}
	n, err := pack.Run(site, *out)
	if err != nil {
		return err
	}
	fmt.Printf("%s: %.1f MB. Publish it anywhere and run it with: snowglobe run <its URL>\n", *out, float64(n)/(1<<20))
	return nil
}

func runRun(args []string) error {
	fs := flag.NewFlagSet("run", flag.ContinueOnError)
	o := instance.Options{Site: "dist"}
	fs.StringVar(&o.Name, "name", "", "")
	fs.BoolVar(&o.Detach, "detach", false, "")
	publish := func(v string) error { o.Publish = append(o.Publish, v); return nil }
	fs.Func("p", "", publish)
	fs.Func("publish", "", publish)
	fs.Usage = func() { fmt.Fprint(os.Stderr, usage) }

	positional, err := parse(fs, args)
	if err != nil {
		return err
	}
	if len(positional) > 0 {
		o.Site = positional[0]
	}
	// A URL or a tarball is fetched or unpacked into the cache first, then run like a directory
	switch {
	case remote.IsURL(o.Site):
		if o.Site, err = remote.Fetch(o.Site); err != nil {
			return err
		}
	case remote.IsTarball(o.Site):
		if o.Site, err = remote.Unpack(o.Site); err != nil {
			return err
		}
	}
	return instance.Run(o, version)
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
