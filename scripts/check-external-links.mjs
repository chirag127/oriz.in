import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const UNVERIFIED_HOSTS = new Set([
  'igrmaharashtra.gov.in',
  'kaveri.karnataka.gov.in',
  'www.nseindia.com',
  'incometax.gov.in',
  'incometaxindia.gov.in',
  'wcd.gov.in',
  'www.cbic.gov.in',
  'www.edcilindia.co.in',
  'cybercrime.gov.in',
  'cbi.gov.in',
  'cms.rbi.org.in',
  'www.rbidirect.rbi.org.in',
  'nsdl.co.in',
  'rera.gov.in',
  'npscra.nsdl.co.in',
  'www.usgs.gov',
]);

const BOT_BLOCKED = new Set([
  'linkedin.com',
  'www.linkedin.com',
  'x.com',
  'www.reddit.com',
  'www.facebook.com',
  'www.instagram.com',
]);

async function walk(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full, relative)));
    else files.push(full);
  }
  return files;
}

const files = await walk(DIST);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const urls = new Map();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const tag of html.match(/<[^>]+>/gu) ?? []) {
    if (/\srel\s*=\s*["']canonical["']/iu.test(tag)) continue;
    const match = tag.match(/\shref\s*=\s*["'](https?:\/\/[^"']+)["']/iu);
    if (!match) continue;
    const url = match[1].replace(/&amp;/gu, '&');
    if (new URL(url).hostname === 'oriz.in') continue;
    urls.set(url, new Set());
  }
}

async function check(url) {
  const timeout = AbortSignal.timeout(15000);
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (compatible; ORIZ.IN reference check; +https://oriz.in/)',
    Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
  };
  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: timeout,
      headers,
    });
    if ([403, 405, 406, 429].includes(response.status)) {
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: timeout,
        headers,
      });
      await response.body?.cancel();
    }
    return { status: response.status, finalUrl: response.url };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

const queue = [...urls.keys()];
const results = [];
const concurrency = 5;

async function worker() {
  while (queue.length > 0) {
    const url = queue.shift();
    const result = await check(url);
    results.push({ url, ...result });
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));

const host = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

const isUnverifiableHost = (url) => {
  const hostname = host(url);
  return (
    UNVERIFIED_HOSTS.has(hostname) ||
    hostname.endsWith('.gov.in') ||
    hostname.endsWith('.nic.in') ||
    hostname.endsWith('.gov')
  );
};
const unverified = results.filter(
  (result) => result.status === 0 && isUnverifiableHost(result.url),
);
const broken = results.filter(
  (result) =>
    (result.status === 0 && !isUnverifiableHost(result.url)) ||
    (result.status >= 400 && ![403, 401, 406, 429, 999].includes(result.status)),
);
const botBlocked = results.filter((result) =>
  [401, 403, 406, 429, 999].includes(result.status) || BOT_BLOCKED.has(host(result.url)),
);
const ok = results.filter(
  (result) => result.status >= 200 && result.status < 400,
);

await mkdir(path.resolve('.scratch'), { recursive: true });
await writeFile(
  path.resolve('.scratch/external-links.json'),
  `${JSON.stringify({ checkedAt: new Date().toISOString(), total: results.length, ok, broken, botBlocked: botBlocked.length, unverified, results }, null, 2)}\n`,
);

console.log('');
console.log('ORIZ.IN external link check');
console.log('---------------------------');
console.log(`Unique external links: ${results.length}`);
console.log(`OK:                    ${ok.length}`);
console.log(`Bot-protected:         ${botBlocked.length}`);
console.log(`Unverified:            ${unverified.length}`);
console.log(`Broken:                ${broken.length}`);
for (const result of broken) {
  console.log(`broken: ${result.status} ${result.url}${result.error ? ` — ${result.error}` : ''}`);
}
if (broken.length > 0) process.exitCode = 1;
