package rootfs

import (
	"path"
	"regexp"
	"sort"
	"strings"
)

// Report explains a warm pack: which files each phase read, grouped by directory, so the warm
// cache of each runtime can be understood and tuned.
type Report struct {
	Boot     Phase            `json:"boot"`
	Exercise map[string]Phase `json:"exercise"`
	// Exercise commands in the order they ran
	Order []string `json:"order"`
	// Files only the --warm pattern added (nobody read them during the build)
	Pattern Phase `json:"pattern"`
	// Files never read and not in the pack: fetched on demand if a visitor ever needs them
	Cold Phase `json:"cold"`
}

// Phase totals one phase's files, in compressed (download) bytes.
type Phase struct {
	Files  int     `json:"files"`
	Bytes  int64   `json:"bytes"`
	Groups []Group `json:"groups"`
}

// Group is one directory's share of a phase.
type Group struct {
	Dir   string `json:"dir"`
	Files int    `json:"files"`
	Bytes int64  `json:"bytes"`
}

// BuildReport attributes every unique file to the first phase that read it: boot, then each
// exercise command in order, then the pattern, else cold. Kernel and initramfs (/boot) are left
// out: v86 reads them itself at boot and never again after a restore.
func BuildReport(res *Result, reads *Reads, order []string, match *regexp.Regexp, blobSize func(string) int64) Report {
	byBlob := map[string]File{}
	for _, f := range res.Files {
		if _, seen := byBlob[f.Blob]; !seen && !strings.HasPrefix(f.Path, "/boot/") {
			byBlob[f.Blob] = f
		}
	}

	claimed := map[string]bool{}
	phase := func(names []string, keep func(File) bool) Phase {
		groups := map[string]*Group{}
		var p Phase
		for _, name := range names {
			f, ok := byBlob[name]
			if !ok || claimed[name] || (keep != nil && !keep(f)) {
				continue
			}
			claimed[name] = true
			size := blobSize(name)
			p.Files++
			p.Bytes += size
			dir := path.Dir(f.Path)
			if groups[dir] == nil {
				groups[dir] = &Group{Dir: dir}
			}
			groups[dir].Files++
			groups[dir].Bytes += size
		}
		for _, g := range groups {
			p.Groups = append(p.Groups, *g)
		}
		sort.Slice(p.Groups, func(i, j int) bool { return p.Groups[i].Bytes > p.Groups[j].Bytes })
		return p
	}

	all := make([]string, 0, len(byBlob))
	for name := range byBlob {
		all = append(all, name)
	}
	sort.Strings(all)

	r := Report{Exercise: map[string]Phase{}, Order: order}
	r.Boot = phase(reads.Boot, nil)
	for _, command := range order {
		r.Exercise[command] = phase(reads.Exercise[command], nil)
	}
	if match != nil {
		r.Pattern = phase(all, func(f File) bool { return match.MatchString(f.Path) })
	}
	r.Cold = phase(all, nil)
	return r
}
