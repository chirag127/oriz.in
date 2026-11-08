import { spawn } from 'node:child_process';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const port = 4331;
const base = `http://127.0.0.1:${port}/`;

const server = spawn(
  process.execPath,
  [
    path.resolve('node_modules/astro/bin/astro.mjs'),
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    String(port),
    '--ignore-lock',
  ],
  { stdio: 'ignore' },
);

let ready = false;
for (let attempt = 0; attempt < 60; attempt += 1) {
  try {
    const response = await fetch(base);
    if (response.ok) {
      ready = true;
      break;
    }
  } catch {
    // Wait for the preview server to bind its port.
  }
  await delay(500);
}

let exitCode = 1;
try {
  if (!ready) throw new Error('Astro preview server did not start.');
  const test = spawn(process.execPath, [path.resolve('scripts/browser-check.mjs')], {
    stdio: 'inherit',
    env: { ...process.env, BASE_URL: base.replace(/\/$/u, '') },
  });
  exitCode = await new Promise((resolve) => {
    test.on('exit', (code) => resolve(code ?? 1));
  });
} catch (error) {
  console.error(error);
} finally {
  server.kill('SIGTERM');
  setTimeout(() => server.kill('SIGKILL'), 1500).unref();
}

process.exitCode = exitCode;
