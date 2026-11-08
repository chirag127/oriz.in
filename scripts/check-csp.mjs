import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { findEdge } from './edge.mjs';

const DIST = path.resolve('dist');
const EDGE = process.env.EDGE_PATH ?? findEdge();
const PORT = 4332;
const BASE = `http://127.0.0.1:${PORT}`;
const errors = [];

function parseHeaders(contents) {
  const rules = [];
  let current = null;
  for (const rawLine of contents.split(/\r?\n/u)) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;
    if (!line.startsWith(' ')) {
      current = { pattern: line.trim(), headers: [] };
      rules.push(current);
      continue;
    }
    const match = line.trim().match(/^([^:]+):\s*(.*)$/u);
    if (match && current) current.headers.push([match[1], match[2]]);
  }
  return rules;
}

function matches(pattern, pathname) {
  if (pattern === '/*') return true;
  if (pattern.includes('*')) {
    const regex = new RegExp(
      `^${pattern.replace(/[.+?^${}()|[\]\\]/gu, '\\$&').replace(/\*/gu, '.*')}$`,
      'u',
    );
    return regex.test(pathname);
  }
  return pattern === pathname;
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

const headerRules = parseHeaders(await readFile(path.join(DIST, '_headers'), 'utf8'));

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', BASE);
  let pathname;
  try {
    pathname = decodeURIComponent(requestUrl.pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }
  let file = path.join(DIST, pathname.replace(/^\/+/u, ''));
  if (pathname === '/' || pathname.endsWith('/')) file = path.join(file, 'index.html');
  if (!existsSync(file) && !path.extname(file)) {
    file = path.join(file, 'index.html');
  }
  let status = 200;
  if (!existsSync(file)) {
    file = path.join(DIST, '404.html');
    status = 404;
  }
  const body = await readFile(file);
  const headers = {};
  for (const rule of headerRules) {
    if (matches(rule.pattern, pathname)) {
      for (const [key, value] of rule.headers) headers[key] = value;
    }
  }
  headers['Content-Type'] = contentTypes[path.extname(file)] ?? 'application/octet-stream';
  response.writeHead(status, headers);
  response.end(body);
});

await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
const consoleErrors = [];
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});

async function goto(route) {
  const response = await page.goto(`${BASE}${route}`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });
  return response;
}

try {
  await mkdir(path.resolve('.scratch'), { recursive: true });
  const homeResponse = await goto('/');
  const csp = homeResponse?.headers()['content-security-policy'] ?? '';
  if (!csp) errors.push('CSP header is missing.');
  if (!homeResponse?.headers()['x-content-type-options']) {
    errors.push('X-Content-Type-Options header is missing.');
  }

  const home = await page.evaluate(() => {
    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')];
    let parsed = 0;
    for (const block of jsonLd) {
      try {
        JSON.parse(block.textContent ?? '');
        parsed += 1;
      } catch {
        // Counted as a failure below.
      }
    }
    return {
      title: document.title,
      theme: document.documentElement.dataset.theme,
      headerBackground: getComputedStyle(document.querySelector('.site-header')).backgroundColor,
      headerPosition: getComputedStyle(document.querySelector('.site-header')).position,
      jsonLdBlocks: jsonLd.length,
      parsedJsonLd: parsed,
    };
  });
  if (!home.title) errors.push('Homepage title missing under CSP.');
  if (!home.theme) errors.push('Theme initialization did not run under CSP.');
  if (home.headerPosition !== 'sticky') errors.push('Stylesheet did not apply under CSP.');
  if (home.jsonLdBlocks === 0 || home.parsedJsonLd !== home.jsonLdBlocks) {
    errors.push('JSON-LD did not parse under CSP.');
  }

  await goto('/tools/json-formatter/');
  await page.waitForSelector('.tool-app', { timeout: 20000 });
  const jsonResult = await page.evaluate(async () => {
    const input = document.querySelector('.code-input');
    const output = document.querySelector('.text-output');
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    ).set;
    setter.call(input, '{"ok":true}');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 250));
    return output.value;
  });
  if (!jsonResult.includes('"ok": true')) errors.push('JSON tool failed under CSP.');

  await goto('/tools/mermaid-editor/');
  try {
    await page.waitForSelector('.mermaid-preview svg', { timeout: 20000 });
  } catch {
    errors.push('Mermaid rendering failed under CSP.');
  }

  await goto('/tools/html-playground/');
  await page.waitForSelector('.tool-app iframe', { timeout: 20000 });
  const frame = page.frames().find((candidate) => candidate !== page.mainFrame());
  let playgroundState = { exists: false };
  if (frame) {
    try {
      playgroundState = await frame.evaluate(async () => {
        const button = document.querySelector('#counter');
        button?.click();
        return {
          exists: true,
          heading: document.querySelector('h1')?.textContent ?? '',
          button: document.querySelector('#counter')?.textContent ?? '',
          bodyBackground: getComputedStyle(document.body).backgroundColor,
        };
      });
    } catch (error) {
      playgroundState = { exists: false, error: error.message };
    }
  }
  if (!playgroundState.exists || !playgroundState.heading?.includes('Hello')) {
    errors.push(
      `Sandboxed playground did not load under CSP: ${JSON.stringify(playgroundState)}`,
    );
  }

  await goto('/search/');
  await page.type('#search-input', 'loan');
  try {
    await page.waitForFunction(
      () => document.querySelectorAll('.search-result').length > 0,
      { timeout: 10000 },
    );
  } catch {
    errors.push('Search index fetch failed under CSP.');
  }
  const dataFetch = await page.evaluate(async () => {
    const response = await fetch('/data/tools.json');
    const data = await response.json();
    return { ok: response.ok, cors: response.headers.get('access-control-allow-origin'), count: data.count };
  });
  if (!dataFetch.ok || !dataFetch.cors) {
    errors.push('Public data endpoint did not load with CORS under CSP.');
  }

  const cspConsoleErrors = consoleErrors.filter((message) =>
    /content security policy|refused to/iu.test(message),
  );
  for (const message of cspConsoleErrors) errors.push(`CSP console: ${message}`);
  for (const message of pageErrors) errors.push(`Page error: ${message}`);

  const report = {
    cspPresent: Boolean(csp),
    cspLength: csp.length,
    headers: Object.fromEntries(
      Object.entries(homeResponse?.headers() ?? {}).filter(([key]) =>
        ['content-security-policy', 'referrer-policy', 'x-content-type-options', 'permissions-policy', 'strict-transport-security'].includes(key),
      ),
    ),
    home,
    jsonTool: Boolean(jsonResult.includes('"ok": true')),
    mermaid: !errors.some((error) => error.includes('Mermaid')),
    playground: playgroundState,
    searchIndexFetched: !errors.some((error) => error.includes('Search index')),
    dataFetch,
    consoleErrors,
    pageErrors,
    errors,
  };
  await readFile(path.resolve('.scratch'), 'utf8').catch(() => undefined);
  await import('node:fs/promises').then(({ writeFile }) =>
    writeFile(
      path.resolve('.scratch/csp-report.json'),
      `${JSON.stringify(report, null, 2)}\n`,
    ),
  );

  console.log('');
  console.log('ORIZ.IN CSP and security-header check');
  console.log('------------------------------------');
  console.log(`CSP present:     ${report.cspPresent}`);
  console.log(`JSON-LD parsed:  ${home.parsedJsonLd}/${home.jsonLdBlocks}`);
  console.log(`JSON tool:       ${report.jsonTool ? 'works' : 'FAILED'}`);
  console.log(`Mermaid:         ${report.mermaid ? 'works' : 'FAILED'}`);
  console.log(`Playground:      ${playgroundState.exists ? 'works' : 'FAILED'}`);
  console.log(`Search + data:   ${!report.errors.some((e) => e.includes('Search') || e.includes('data endpoint')) ? 'works' : 'FAILED'}`);
  console.log(`Errors:          ${errors.length}`);
  for (const error of errors) console.log(`error: ${error}`);
  if (errors.length > 0) process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
