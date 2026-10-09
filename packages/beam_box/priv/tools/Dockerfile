# Build-time tools for beam_box, so the host only needs Docker: Node (to boot the guest in v86
# and snapshot it), OTP 28+ (tar2v86.exs uses the built-in :zstd), and the browser runtime that
# gets copied into every site. Runs on the host's native architecture.
FROM alpine:3.24.2

RUN apk add --no-cache nodejs npm elixir erlang28

WORKDIR /tools

# v86 and xterm.js, pinned and integrity-checked by the lockfile
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# The BIOS isn't on npm; take it from the exact upstream commit the npm build of v86 was made from
ADD --checksum=sha256:73e3f359102e3a9982c35fce98eb7cd08f18303ac7f1ba6ebfbe6cdc1c244d98 \
    https://raw.githubusercontent.com/copy/v86/5f9a90f2be01243dd0ea4fe014cce12686cf3ced/bios/seabios.bin site/bios/seabios.bin
ADD --checksum=sha256:a4bc0d80cc3ca028c73dafa8fee396b8d054ce87ebd8abfbd31b06b437607880 \
    https://raw.githubusercontent.com/copy/v86/5f9a90f2be01243dd0ea4fe014cce12686cf3ced/bios/vgabios.bin site/bios/vgabios.bin

# Everything a site serves besides the page itself and the guest's files
RUN mkdir -p site/v86 site/xterm && \
    cp node_modules/v86/build/libv86.js node_modules/v86/build/v86.wasm \
       node_modules/v86/build/v86-fallback.wasm site/v86/ && \
    cp node_modules/@xterm/xterm/lib/xterm.js node_modules/@xterm/xterm/css/xterm.css \
       node_modules/@xterm/addon-fit/lib/addon-fit.js site/xterm/ && \
    chmod -R a+rX site

COPY tar2v86.exs build-state.mjs ./

ENV HOME=/tmp
