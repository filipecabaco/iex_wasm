// Package serve previews a built site the way a static host would.
package serve

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
)

// Run serves dir on localhost:port until interrupted.
func Run(dir string, port int) error {
	if _, err := os.Stat(filepath.Join(dir, "index.html")); err != nil {
		return fmt.Errorf("%s/index.html not found; run snowglobe build first", dir)
	}
	addr := fmt.Sprintf("localhost:%d", port)
	fmt.Printf("Serving %s at http://%s\n", dir, addr)
	return http.ListenAndServe(addr, http.FileServer(http.Dir(dir)))
}
