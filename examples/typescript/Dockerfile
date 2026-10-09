# TypeScript: the tsx REPL (TypeScript on Node, compiled by esbuild's 32-bit x86 binary).
FROM i386/alpine:3.24.2

RUN apk add --no-cache nodejs npm

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund && npm cache clean --force

ENV LANG=C.UTF-8 PATH=/app/node_modules/.bin:$PATH
CMD ["tsx"]

LABEL snowglobe.title="TypeScript in the browser" \
      snowglobe.ready="> " \
      snowglobe.exercise='["const xs: number[] = [1, 2, 3]; xs.map((x) => x * 2)", "interface User { name: string; age?: number }; const u: User = { name: \"ada\" }; u", "JSON.stringify({ when: new Date().toISOString() })", "const { createHash } = await import(\"node:crypto\"); createHash(\"sha256\").update(\"hi\").digest(\"hex\")", "await new Promise<number>((resolve) => setTimeout(() => resolve(42), 10))", "type Pair<T> = [T, T]; const p: Pair<string> = [\"a\", \"b\"]; p.join(\"-\")"]'
