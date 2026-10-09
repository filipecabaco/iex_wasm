# TypeScript + Zod: the tsx REPL (TypeScript on Node, compiled by esbuild's 32-bit x86 binary)
# with Zod preloaded as `z` and a sample `User` schema.
FROM i386/alpine:3.24.2

RUN apk add --no-cache nodejs npm

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund && npm cache clean --force
COPY preload.mjs ./

# Through NODE_OPTIONS rather than `tsx --import`, which would bypass tsx's TypeScript REPL
ENV LANG=C.UTF-8 PATH=/app/node_modules/.bin:$PATH NODE_OPTIONS="--import /app/preload.mjs"
CMD ["tsx"]

# Node's REPL greeting, not just "> ": that also appears inside the banner's own examples (=> )
LABEL snowglobe.title="TypeScript + Zod in the browser" \
      snowglobe.ready="Type \".help\" for more information." \
      snowglobe.exercise='["User.parse({ name: \"Ada\", email: \"ada@example.com\" })", "User.safeParse({ name: \"\", email: \"nope\" }).error?.issues.map((i) => i.message)", "const Point = z.object({ x: z.number(), y: z.number() })", "type Point = z.infer<typeof Point>", "const p: Point = Point.parse({ x: 1, y: 2 }); p", "z.array(z.coerce.number()).parse([\"1\", \"2\", \"3\"])"]'
