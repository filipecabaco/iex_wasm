// Talks to a running snowglobe instance (run.mjs) over its control socket, from `docker exec`:
//
//   node client.mjs exec <command>   type one command into the app, print what it printed
//   node client.mjs attach           join the session; ctrl-] detaches and leaves it running

import net from "node:net";

const SOCKET = "/tmp/snowglobe.sock";
const DETACH_KEY = 0x1d; // ctrl-]
const [mode, ...rest] = process.argv.slice(2);

const socket = net.connect(SOCKET);
socket.on("error", (error) => {
  console.error(`snowglobe: can't reach the instance (${error.code}); is it still restoring?`);
  process.exit(1);
});

if (mode === "exec") {
  const command = rest.join(" ");
  socket.write(JSON.stringify({ mode, command }) + "\n");
  // Colours for a terminal; plain text for a pipe or an agent reading the output
  if (process.stdout.isTTY) socket.pipe(process.stdout);
  else {
    let output = "";
    socket.setEncoding("utf8");
    socket.on("data", (text) => (output += text));
    socket.on("end", () => process.stdout.write(output.replace(/\x1b\[[0-9;?]*[ -\/]*[@-~]|\x1b[()][0-9A-Za-z]|\x1b[=>]|\r/g, "")));
  }
} else if (mode === "attach") {
  socket.write(JSON.stringify({ mode, rows: process.stdout.rows, cols: process.stdout.columns }) + "\n");
  socket.pipe(process.stdout);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.on("data", (bytes) => {
    if (bytes.includes(DETACH_KEY)) {
      process.stderr.write("\r\nsnowglobe: detached; the instance keeps running\r\n");
      process.exit(0);
    }
    socket.write(bytes);
  });
  socket.on("close", () => process.exit(0));
} else {
  console.error("usage: node client.mjs exec <command> | attach");
  process.exit(2);
}
