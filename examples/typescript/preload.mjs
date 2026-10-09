// Loaded through NODE_OPTIONS before the REPL starts: Zod is ready to use as `z`, plus a sample
// schema to poke at. (Passing --import to tsx itself would bypass tsx's TypeScript REPL.)
import { z } from "zod";

globalThis.z = z;
globalThis.User = z.object({
  name: z.string().min(1),
  email: z.email(),
  age: z.number().int().positive().optional(),
});

// tsx runs the REPL in a child process that loads this too; show the banner once
if (!process.env.SNOWGLOBE_BANNER_SHOWN) {
  process.env.SNOWGLOBE_BANNER_SHOWN = "1";
  const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
  console.log(`
  \x1b[1mTypeScript + Zod\x1b[0m: tsx on Node 24, 32-bit Linux, emulated in this tab. Try:

    ${cyan('User.parse({ name: "Ada", email: "ada@example.com" })')}
    ${cyan('User.safeParse({ name: "", email: "nope" }).error?.issues.map((i) => i.message)')}
    ${cyan("const Point = z.object({ x: z.number(), y: z.number() })")}
    ${cyan("type Point = z.infer<typeof Point>")}
    ${cyan("const p: Point = Point.parse({ x: 1, y: 2 }); p")}
    ${cyan('z.array(z.coerce.number()).parse(["1", "2", "3"])')}
`);
}
