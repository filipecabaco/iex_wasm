package boot

import "testing"

func TestScript(t *testing.T) {
	got := Script(Console{
		Env:     []string{"PATH=/usr/bin:/bin", "GREETING=it's me", "BROKEN"},
		Workdir: "/srv/my app",
		Command: Join([]string{"/app/bin/server", "start"}),
	})
	want := "#!/bin/sh\n" +
		"export PATH='/usr/bin:/bin'\n" +
		"export GREETING='it'\\''s me'\n" +
		"cd '/srv/my app'\n" +
		"clear\n" +
		"exec '/app/bin/server' 'start'\n"
	if got != want {
		t.Errorf("got:\n%s\nwant:\n%s", got, want)
	}
}
