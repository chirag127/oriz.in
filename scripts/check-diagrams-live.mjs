#!/usr/bin/env node
/**
 * check-diagrams-live.mjs — assert every diagram on every article actually renders.
 *
 * The static linter (check-diagrams.mjs) catches known-bad syntax. This script
 * proves the outcome: it walks every article URL, and for each `.diagram-figure`
 * checks that Mermaid replaced the source fallback with a real <svg>. A figure
 * that still contains the placeholder text is a failure, because that is what a
 * reader sees.
 *
 * Requires a running dev server and a connected sctl browser.
 *
 * Usage:
 *   node scripts/check-diagrams-live.mjs [--base http://127.0.0.1:4321] [--limit N]
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT = join(ROOT, 'src', 'content', 'library');

const args = process.argv.slice(2);
const baseIdx = args.indexOf('--base');
const BASE = baseIdx >= 0 ? args[baseIdx + 1] : 'http://127.0.0.1:4321';
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx >= 0 ? Number(args[limitIdx + 1]) : Infinity;

const SCTL = process.env.SCTL_PATH ?? 'sctl';

async function sctl(argv) {
  const { stdout } = await run(SCTL, argv, { maxBuffer: 32 * 1024 * 1024, windowsHide: true });
  return stdout;
}

/** Derive the article URL from its file path, mirroring src/lib/content.ts. */
async function articleUrls() {
  const urls = [];
  for (const domain of await readdir(CONTENT, { withFileTypes: true })) {
    if (!domain.isDirectory()) continue;
    const domainDir = join(CONTENT, domain.name);
    for (const category of await readdir(domainDir, { withFileTypes: true })) {
      if (!category.isDirectory()) continue;
      const categoryDir = join(domainDir, category.name);
      for (const series of await readdir(categoryDir, { withFileTypes: true })) {
        if (!series.isDirectory()) continue;
        for (const file of await readdir(join(categoryDir, series.name))) {
          if (!file.endsWith('.md')) continue;
          const text = await readFile(join(categoryDir, series.name, file), 'utf8');
          if (!text.includes('```mermaid')) continue;
          // id = filename without .md and without the NN- sequence prefix
          const id = file.replace(/\.md$/u, '').replace(/^\d+-/u, '');
          urls.push(`/${domain.name}/${category.name}/${id}/`);
        }
      }
    }
  }
  return urls.slice(0, LIMIT === Infinity ? undefined : LIMIT);
}

const urls = await articleUrls();
if (urls.length === 0) {
  console.error('check-diagrams-live: no articles with mermaid diagrams found.');
  process.exit(1);
}

const tabList = await sctl(['tabs', 'list']).catch(() => '');
// `sctl tabs list` prints a fixed-width table: TAB ID ... TITLE ... URL.
// Only http(s) tabs are automatable — a chrome-extension:// tab throws
// PAGE_NOT_AUTOMATABLE. Prefer a tab already on the dev server.
const parsedRows = tabList
  .split(/\r?\n/u)
  .slice(1)
  .map((line) => ({ id: line.match(/^\s*(\d{8,})/u)?.[1], line }))
  .filter((row) => row.id);

let tabId =
  parsedRows.find((row) => row.line.includes(BASE))?.id ??
  parsedRows.find((row) => /https?:\/\//u.test(row.line))?.id ??
  null;

const opened = await sctl(['tabs', 'open', `${BASE}${urls[0]}`]);
if (!tabId) tabId = opened.match(/\b(\d{8,})\b/u)?.[1] ?? null;
if (!tabId) {
  console.error('check-diagrams-live: could not determine a tab id from sctl.');
  process.exit(1);
}

const EXPR =
  'JSON.stringify({f:document.querySelectorAll(".diagram-figure").length,' +
  's:document.querySelectorAll(".mermaid-diagram svg").length,' +
  'bad:document.querySelectorAll(".diagram-placeholder").length})';

let failures = 0;
let totalFigures = 0;
let totalSvg = 0;
const bad = [];

for (const url of urls) {
  await sctl(['page', 'goto', '--timeout', '40s', '--tab', tabId, `${BASE}${url}`]);
  // Mermaid loads and renders asynchronously; poll until counts settle.
  // Mermaid renders asynchronously and lazily: it may still be loading the
  // chunk when the first polls run, so `s` starts at 0 and climbs. Poll until
  // every figure has an svg, and only accept a partial result after the full
  // window has elapsed.
  let last = null;
  let lastError = null;
  let settled = false;
  for (let attempt = 0; attempt < 16; attempt += 1) {
    await new Promise((r) => setTimeout(r, 750));
    let raw;
    try {
      raw = await sctl(['page', 'eval', '--timeout', '25s', '--tab', tabId, EXPR]);
    } catch (error) {
      lastError = (error.stderr || error.message || String(error)).trim().slice(0, 200);
      continue;
    }
    // sctl prints: `tab <id>: "<json-encoded string>"` — the payload is wrapped
    // in a JSON string, so it parses twice: once to unquote, once to read.
    const body = raw.slice(raw.indexOf(':') + 1).trim();
    try {
      const parsed = JSON.parse(JSON.parse(body));
      last = parsed;
      // Settled only when counts match AND nothing is left to load.
      if (parsed.f > 0 && parsed.s === parsed.f) {
        settled = true;
        break;
      }
    } catch {
      /* keep polling */
    }
  }
  if (!settled && last) last.partial = true;

  if (!last) {
    failures += 1;
    bad.push({ url, why: `could not evaluate page — ${lastError ?? 'unknown'}` });
    continue;
  }

  totalFigures += last.f;
  totalSvg += last.s;

  if (last.s !== last.f || (last.bad ?? 0) > 0) {
    failures += 1;
    bad.push({
      url,
      why: `${last.f} figures, ${last.s} rendered, ${last.bad ?? 0} placeholder(s)${last.partial ? ' (timed out)' : ''}`,
    });
  }
}

console.log(`\ncheck-diagrams-live: ${urls.length} articles, ${totalFigures} diagrams, ${totalSvg} rendered.`);

if (failures === 0) {
  console.log('All diagrams rendered.\n');
  process.exit(0);
}

console.error(`\n${failures} article(s) with unrendered diagrams:\n`);
for (const entry of bad) {
  console.error(`  ${entry.url}\n      ${entry.why}`);
}
console.error('');
process.exit(1);
