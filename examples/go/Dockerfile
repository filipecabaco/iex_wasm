# Go: yaegi, a Go interpreter, as a REPL. Cross-compiled for 32-bit x86 on the build machine's own
# architecture, so building it needs no emulation.
FROM --platform=$BUILDPLATFORM golang:1.22-alpine AS build
# yaegi's standard library tables go up to Go 1.22
RUN CGO_ENABLED=0 GOOS=linux GOARCH=386 go install github.com/traefik/yaegi/cmd/yaegi@v0.16.1 && \
    cp "$(go env GOPATH)/bin/linux_386/yaegi" /yaegi

FROM i386/alpine:3.24.2
COPY --from=build /yaegi /usr/local/bin/yaegi

ENV LANG=C.UTF-8
WORKDIR /root
CMD ["yaegi"]

LABEL snowglobe.title="Go in the browser" \
      snowglobe.ready="> " \
      snowglobe.exercise='["import \"fmt\"", "fmt.Sprintf(\"%d squared is %d\", 7, 7*7)", "import \"strings\"", "strings.ToUpper(\"gopher\")", "import \"crypto/sha256\"", "fmt.Sprintf(\"%x\", sha256.Sum256([]byte(\"hi\")))", "func fib(n int) int { if n < 2 { return n }; return fib(n-1) + fib(n-2) }", "fib(20)"]'
