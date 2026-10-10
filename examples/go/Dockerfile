# Go + Bubble Tea: Conway's Game of Life as an interactive terminal app. Cross-compiled for 64-bit
# ARM on the build machine's own architecture, so building it needs no emulation.
FROM --platform=$BUILDPLATFORM golang:1.27.1-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY main.go ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -trimpath -ldflags="-s -w" -o /life .

FROM alpine:3.24.2
COPY --from=build /life /usr/local/bin/life
ENV LANG=C.UTF-8 TERM=xterm-256color
CMD ["life"]

# The board animates from the start, so wait for the title rather than for quiet
LABEL snowglobe.title="Go + Bubble Tea in the browser" \
      snowglobe.ready="Game of Life"
