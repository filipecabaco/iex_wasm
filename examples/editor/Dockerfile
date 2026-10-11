# TypeScript + Zod, with a disk-backed browser editor and a guest /workspace file bridge.
FROM alpine:3.24.2
RUN apk add --no-cache nodejs npm

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund && npm cache clean --force
COPY preload.mjs bridge.mjs ./
RUN mkdir /workspace

ENV LANG=C.UTF-8 PATH=/app/node_modules/.bin:$PATH NODE_OPTIONS="--import /app/preload.mjs"
WORKDIR /workspace
CMD ["tsx"]

LABEL snowglobe.title="TypeScript working-folder editor" \
      snowglobe.editor="true" \
      snowglobe.network="fetch" \
      snowglobe.ready="Type \".help\" for more information." \
      snowglobe.exercise='["await fs.readdir(\"/workspace\")", "console.log(\"snowglobe-\" + 6 * 7)", "z.object({ name: z.string() }).parse({ name: \"Ada\" })"]'
