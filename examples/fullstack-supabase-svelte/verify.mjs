// Headless end-to-end check of the SAME guest RPC used by the browser.
import net from 'node:net';
import assert from 'node:assert/strict';
import { workspaceHandler } from './bridge.mjs';
function request(payload) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(8091, '127.0.0.1'); let input = '';
    socket.setEncoding('utf8'); socket.setTimeout(1230000, () => socket.destroy(new Error('Verification timed out')));
    socket.on('connect', () => socket.write(JSON.stringify(payload) + '\n'));
    socket.on('error', reject);
    socket.on('data', chunk => {
      input += chunk; if (!input.includes('\n')) return;
      socket.destroy(); const reply = JSON.parse(input.slice(0, input.indexOf('\n')));
      reply.error ? reject(new Error(reply.error)) : resolve(reply.result);
    });
  });
}
const pulse = setInterval(() => console.log('Checking full-stack preview…'), 2000);
try {
  const apply = workspaceHandler('/workspace');
  const files = await request({ op: 'starter' });
  assert.ok(files.some(file => file.path === 'src/routes/+page.svelte'));
  await apply({ op: 'reset' });
  for (const file of files) await apply({ op: 'write', ...file });
  await request({ op: 'build', base: '/__preview/headless' });
  const page = await request({ op: 'http', method: 'GET', path: '/' });
  assert.equal(page.status, 200); assert.match(Buffer.from(page.body, 'base64').toString(), /__preview\/headless/);
  const config = await request({ op: 'http', method: 'GET', path: '/__config.json' });
  assert.deepEqual(Object.keys(JSON.parse(Buffer.from(config.body, 'base64'))), ['anonKey']);
  const health = await request({ op: 'http', method: 'GET', path: '/supabase/auth/v1/health' });
  assert.equal(health.status, 200);
  const notes = await request({ op: 'http', method: 'GET', path: '/supabase/rest/v1/notes?select=*', headers: { apikey: process.env.ANON_KEY } });
  assert.equal(notes.status, 200); assert.deepEqual(JSON.parse(Buffer.from(notes.body, 'base64')), []);
  console.log('fullstack-preview-ok');
} finally { clearInterval(pulse); }
