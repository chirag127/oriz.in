import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { findEdge } from './edge.mjs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const EDGE = process.env.EDGE_PATH ?? findEdge();

if (!existsSync(EDGE)) {
  console.error(`Microsoft Edge not found at ${EDGE}. Set EDGE_PATH.`);
  process.exit(1);
}

const screens = path.resolve('.scratch/screens');
await mkdir(screens, { recursive: true });

const readJson = async (file) => JSON.parse(await readFile(path.resolve(file), 'utf8'));
const tools = (await readJson('dist/data/tools.json')).tools;
const articles = (await readJson('dist/data/articles.json')).articles;
const apis = (await readJson('dist/data/apis.json')).apis;
const categories = (await readJson('dist/data/categories.json')).categories;
const paths = (await readJson('dist/data/learning-paths.json')).learningPaths;

const failures = [];
const pageErrors = [];
const axeResults = [];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
});

const page = await browser.newPage();
await page.setCacheEnabled(false);
await page.setViewport({ width: 1440, height: 1000 });
page.on('pageerror', (error) => {
  pageErrors.push({ type: 'pageerror', url: page.url(), message: error.message });
});
page.on('console', (message) => {
  if (message.type() === 'error') {
    const text = message.text();
    if (!text.includes('favicon') && !text.includes('Failed to load resource')) {
      pageErrors.push({ type: 'console', url: page.url(), message: text });
    }
  }
});

async function visit(route, options = {}) {
  const response = await page.goto(`${BASE}${route}`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });
  const status = response?.status() ?? 0;
  if (options.expect404) {
    if (status !== 404) failures.push(`${route}: expected 404, got ${status}`);
  } else if (status !== 200 && status !== 304) {
    failures.push(`${route}: HTTP ${status}`);
  }
  if (options.selector) {
    try {
      await page.waitForSelector(options.selector, { timeout: options.timeout ?? 15000 });
    } catch {
      failures.push(`${route}: missing selector ${options.selector}`);
    }
  }
  return status;
}

async function inspectPage(route) {
  return page.evaluate(() => {
    const html = document.documentElement;
    return {
      title: document.title,
      description:
        document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      h1s: [...document.querySelectorAll('h1')].map((h) => h.textContent?.trim()),
      imagesWithoutAlt: [...document.querySelectorAll('img:not([alt])')].length,
      lang: html.lang,
      theme: html.dataset.theme,
      scrollWidth: html.scrollWidth,
      innerWidth: window.innerWidth,
    };
  });
}

async function runAxe(route) {
  await page.addScriptTag({
    content: await readFile(path.resolve('node_modules/axe-core/axe.min.js'), 'utf8'),
  });
  const result = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
      },
    });
  });
  const violations = result.violations.map((violation) => ({
    route,
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.slice(0, 3).map((node) => ({
      target: node.target,
      failureSummary: node.failureSummary,
    })),
    count: violation.nodes.length,
  }));
  axeResults.push(...violations);
}

async function screenshot(route, name, options = {}) {
  await visit(route, options);
  await new Promise((resolve) => setTimeout(resolve, options.delay ?? 400));
  await page.screenshot({
    path: path.join(screens, `${name}.png`),
    fullPage: options.fullPage ?? false,
    captureBeyondViewport: false,
  });
}

function expectedToolSelector(tool) {
  if (tool.engine === 'text') {
    return tool.options?.mode === 'word-stats' || tool.options?.mode === 'reading-time'
      ? '.stat'
      : '.text-output';
  }
  if (tool.engine === 'hash') return '.result-line code';
  if (tool.engine === 'uuid') return '.text-output';
  if (tool.engine === 'unicode') return '.reference-table tbody tr';
  if (tool.engine === 'json') return '.text-output';
  if (tool.engine === 'jwt') return '.result-text';
  if (tool.engine === 'csv') {
    return tool.options?.mode === 'json-to-csv' ? '.text-output' : '.reference-table tbody tr';
  }
  if (tool.engine === 'yaml' || tool.engine === 'xml') return '.text-output';
  if (tool.engine === 'markdown') return '.md-preview';
  if (tool.engine === 'regex') return '.reference-table tbody tr';
  if (tool.engine === 'diff') return '.diff-output';
  if (tool.engine === 'timestamp') return '.result-line';
  if (tool.engine === 'date-diff' || tool.engine === 'contrast' || tool.engine === 'calculator') return '.stat';
  if (tool.engine === 'timezone') return '.reference-table tbody tr';
  if (tool.engine === 'cron') return '.cron-runs li';
  if (tool.engine === 'number-base') return '.result-line';
  if (tool.engine === 'unit') return '.result-headline';
  if (tool.engine === 'color') return '.swatch';
  if (tool.engine === 'gradient') return '.gradient-preview';
  if (tool.engine === 'mermaid') return '.mermaid-preview svg';
  if (tool.engine === 'subnet') return '.subnet-item';
  if (tool.engine === 'sql') {
    return tool.options?.mode === 'explain' ? '.reference-table tbody tr' : '.text-output';
  }
  if (tool.engine === 'reference') return '.reference-table tbody tr';
  if (tool.engine === 'playground') return 'iframe[title]';
  if (tool.engine === 'decision-table') return '.decision-table tbody tr';
  return '';
}

async function checkToolResult(tool) {
  const selector = expectedToolSelector(tool);
  if (!selector) return { selector, ok: true };
  try {
    await page.waitForSelector(selector, { timeout: 12000 });
    const result = await page.evaluate((target) => {
      const elements = [...document.querySelectorAll(target)];
      if (elements.length === 0) return { ok: false, reason: 'not found' };
      if (target === '.text-output') {
        return { ok: Boolean(elements[0].value?.trim()), reason: 'empty text output' };
      }
      if (target === '.md-preview') {
        return { ok: (elements[0].textContent ?? '').trim().length > 20, reason: 'empty preview' };
      }
      if (target === '.gradient-preview') {
        return { ok: getComputedStyle(elements[0]).backgroundImage.includes('gradient'), reason: 'no gradient preview' };
      }
      return { ok: true };
    }, selector);
    return { selector, ...result };
  } catch {
    return { selector, ok: false, reason: 'selector timeout' };
  }
}

const corePages = [
  '/',
  '/tools/',
  '/articles/',
  '/library/',
  '/money-finance/',
  '/money-finance/gold/',
  '/apis/',
  '/learn/',
  '/developers/',
  '/glossary/',
  '/search/',
  '/about/',
  '/contact/',
  '/author/chirag-singhal/',
  '/support/',
  '/privacy/',
  '/terms/',
  '/editorial-policy/',
  '/corrections/',
  '/accessibility/',
  '/copyright/',
  '/cookies/',
  '/diagrams/',
];

for (const route of corePages) {
  await visit(route);
  const info = await inspectPage(route);
  if (!info.title) failures.push(`${route}: missing title`);
  if (!info.description) failures.push(`${route}: missing description`);
  if (info.lang !== 'en') failures.push(`${route}: language is ${info.lang}`);
  if (info.imagesWithoutAlt > 0) failures.push(`${route}: ${info.imagesWithoutAlt} images without alt`);
  if (info.scrollWidth > info.innerWidth + 2) {
    failures.push(`${route}: horizontal overflow (${info.scrollWidth} > ${info.innerWidth})`);
  }
  await runAxe(route);
}

const libraryMenuCheck = await (async () => {
  await visit('/');
  await page.click('[data-library-toggle]');
  await new Promise((resolve) => setTimeout(resolve, 250));
  const open = await page.evaluate(() => ({
    expanded: document.querySelector('[data-library-toggle]')?.getAttribute('aria-expanded'),
    hidden: document.querySelector('[data-library-menu]')?.hidden,
    links: document.querySelectorAll('[data-library-menu] a').length,
  }));
  await runAxe('/ (library menu open)');
  await page.keyboard.press('Escape');
  await new Promise((resolve) => setTimeout(resolve, 200));
  const closed = await page.evaluate(() => ({
    expanded: document.querySelector('[data-library-toggle]')?.getAttribute('aria-expanded'),
    hidden: document.querySelector('[data-library-menu]')?.hidden,
  }));
  return { open, closed };
})();
if (
  libraryMenuCheck.open.expanded !== 'true' ||
  libraryMenuCheck.open.hidden !== false ||
  libraryMenuCheck.open.links < 20 ||
  libraryMenuCheck.closed.expanded !== 'false' ||
  libraryMenuCheck.closed.hidden !== true
) {
  failures.push('Library mega menu did not open, contain links, or close with Escape');
}

for (const tool of tools) {
  const route = `/tools/${tool.slug}/`;
  await visit(route, { selector: '.tool-app', timeout: 20000 });
  const state = await page.evaluate(() => ({
    app: Boolean(document.querySelector('.tool-app')),
    errors: [...document.querySelectorAll('.tool-error')]
      .map((element) => element.textContent?.trim())
      .filter(Boolean),
    interactive: document.querySelectorAll('.tool-app input, .tool-app select, .tool-app textarea, .tool-app button').length,
  }));
  if (!state.app) failures.push(`${route}: tool island did not render`);
  if (state.errors.length > 0) {
    failures.push(`${route}: initial tool error: ${state.errors.join(' | ').slice(0, 300)}`);
  }
  if (state.interactive === 0) failures.push(`${route}: no interactive controls found`);
  const toolResult = await checkToolResult(tool);
  if (!toolResult.ok) {
    failures.push(`${route}: initial result check failed (${toolResult.selector} — ${toolResult.reason})`);
  }
  await runAxe(route);
}

for (const article of articles) {
  const route = article.url ? new URL(article.url).pathname : '/articles/';
  await visit(route);
  const info = await inspectPage(route);
  if (!info.h1s.length) failures.push(`${route}: missing h1`);
  await runAxe(route);
}

for (const api of apis) {
  const route = `/apis/${api.slug}/`;
  await visit(route);
  const info = await inspectPage(route);
  if (!info.h1s.length) failures.push(`${route}: missing h1`);
  await runAxe(route);
}

const domains = [...new Set(categories.map((category) => category.domain))];
for (const domain of domains) {
  await visit(`/${domain}/`);
}

for (const category of categories) {
  await visit(new URL(category.url).pathname);
}

for (const learningPath of paths) {
  await visit(`/learn/${learningPath.slug}/`);
}

await visit('/does-not-exist/', { expect404: true });
const notFound = await inspectPage('/does-not-exist/');
if (!notFound.title.toLowerCase().includes('not found')) {
  failures.push('404 page has an unexpected title');
}

const jsonCheck = await (async () => {
  await visit('/tools/json-formatter/', { selector: '.tool-app' });
  return page.evaluate(async () => {
    const input = document.querySelector('.code-input');
    const output = document.querySelector('.text-output');
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    ).set;
    setter.call(input, '{"a":1}');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 250));
    return { output: output.value, error: document.querySelector('.tool-error')?.textContent };
  });
})();
if (!jsonCheck.output.includes('"a": 1')) failures.push('JSON formatter did not format valid input');

const searchCheck = await (async () => {
  await visit('/search/');
  await page.type('#search-input', 'loan');
  await page.waitForFunction(
    () => document.querySelectorAll('.search-result').length > 0,
    { timeout: 8000 },
  );
  return page.evaluate(() => ({
    count: document.querySelectorAll('.search-result').length,
    url: location.search,
    status: document.querySelector('#search-status')?.textContent?.trim(),
  }));
})();
if (searchCheck.count === 0) failures.push('Search returned no results for “loan”');

const xmlCheck = await (async () => {
  await visit('/tools/xml-formatter/', { selector: '.tool-app' });
  return page.evaluate(async () => {
    const input = document.querySelector('.code-input');
    const output = document.querySelector('.text-output');
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    ).set;
    setter.call(
      input,
      '<?xml version="1.0"?><root><item><![CDATA[<not-a-tag> & data]]></item></root>',
    );
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 250));
    return { output: output.value, error: document.querySelector('.tool-error')?.textContent };
  });
})();
if (!xmlCheck.output.includes('<![CDATA[<not-a-tag> & data]]>')) {
  failures.push('XML formatter did not preserve CDATA content');
}

const markdownPrivacyCheck = await (async () => {
  await visit('/tools/markdown-previewer/', { selector: '.tool-app' });
  return page.evaluate(async () => {
    const input = document.querySelector('.code-input');
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    ).set;
    setter.call(input, '![tracking pixel](https://example.com/pixel.png)');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { images: document.querySelectorAll('.md-preview img').length };
  });
})();
if (markdownPrivacyCheck.images !== 0) {
  failures.push('Markdown preview fetched or retained a remote image');
}

const mermaidIsolationCheck = await (async () => {
  await visit('/technology/developer-craft/base64-is-not-encryption/');
  return page.evaluate(() => ({
    diagrams: document.querySelectorAll('.mermaid-diagram').length,
    mermaidResources: performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((name) => /mermaid|elk-|graphlib|rough\.esm/iu.test(name)).length,
  }));
})();
if (mermaidIsolationCheck.diagrams !== 0 || mermaidIsolationCheck.mermaidResources !== 0) {
  failures.push('Mermaid assets loaded on an article without diagrams');
}

const toolFilterCheck = await (async () => {
  await visit('/tools/');
  await page.type('#tool-filter', 'json');
  await new Promise((resolve) => setTimeout(resolve, 250));
  return page.evaluate(() => ({
    visible: [...document.querySelectorAll('[data-tool-card]')].filter((card) => !card.hidden).length,
    count: document.querySelector('#tool-count')?.textContent ?? '',
  }));
})();
const toolFilterCount = toolFilterCheck.count.match(/^(\d+) of (\d+) tools$/);
if (
  toolFilterCheck.visible === 0 ||
  !toolFilterCount ||
  Number(toolFilterCount[1]) !== toolFilterCheck.visible ||
  Number(toolFilterCount[2]) < toolFilterCheck.visible
) {
  failures.push('Tool directory filter did not return JSON tools');
}

const glossaryFilterCheck = await (async () => {
  await visit('/glossary/');
  await page.type('#glossary-filter', 'json');
  await new Promise((resolve) => setTimeout(resolve, 250));
  return page.evaluate(() => ({
    visible: [...document.querySelectorAll('[data-glossary-term]')].filter((term) => !term.hidden).length,
    count: document.querySelector('#glossary-count')?.textContent ?? '',
  }));
})();
if (glossaryFilterCheck.visible === 0) failures.push('Glossary filter returned no terms for “json”');

const learningProgressCheck = await (async () => {
  await visit('/learn/practical-web-foundation/');
  await page.waitForSelector('[data-step-id]');
  await page.click('[data-step-id]');
  await new Promise((resolve) => setTimeout(resolve, 200));
  const state = await page.evaluate(() => ({
    label: document.querySelector('[data-progress-label]')?.textContent ?? '',
    percent: document.querySelector('[data-progress-percent]')?.textContent ?? '',
    stored: Object.keys(localStorage).filter((key) => key.startsWith('oriz-path:')).length,
  }));
  await page.evaluate(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('oriz-path:')) localStorage.removeItem(key);
    }
  });
  return state;
})();
if (!learningProgressCheck.label.includes('1 of') || learningProgressCheck.stored === 0) {
  failures.push('Learning-path progress was not saved locally');
}

const articleFeatureCheck = await (async () => {
  await visit('/money-finance/loans-credit/home-loan-emi-breakup-principal-interest/');
  await page.waitForSelector('.katex', { timeout: 10000 });
  return page.evaluate(() => ({
    katex: document.querySelectorAll('.katex').length,
    anchors: document.querySelectorAll('.heading-anchor').length,
    toc: document.querySelectorAll('.toc nav a').length,
  }));
})();
if (articleFeatureCheck.katex === 0) failures.push('KaTeX did not render on the finance article');
if (articleFeatureCheck.anchors === 0) failures.push('Heading anchor links are missing');

const themeCheck = await (async () => {
  await visit('/');
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.click('[data-theme-toggle]');
  await new Promise((resolve) => setTimeout(resolve, 150));
  const after = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    stored: localStorage.getItem('oriz-theme'),
  }));
  await page.evaluate(() => localStorage.setItem('oriz-theme', 'light'));
  return { before, ...after };
})();
if (themeCheck.after === themeCheck.before) failures.push('Theme toggle did not change the theme');

await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
for (const route of ['/', '/tools/', '/tools/json-formatter/', '/money-finance/loans-credit/home-loan-emi-breakup-principal-interest/', '/search/', '/author/chirag-singhal/']) {
  await visit(route, { selector: /^\/tools\/[^/]+\/$/u.test(route) ? '.tool-app' : undefined });
  const info = await inspectPage(route);
  if (info.scrollWidth > info.innerWidth + 2) {
    failures.push(`Mobile ${route}: horizontal overflow (${info.scrollWidth} > ${info.innerWidth})`);
  }
}

await visit('/');
const mobileMenu = await page.evaluate(() => {
  const details = document.querySelector('.mobile-menu');
  if (!details) return { exists: false };
  details.open = true;
  return {
    exists: true,
    open: details.open,
    links: details.querySelectorAll('a').length,
    visible: getComputedStyle(details.querySelector('.mobile-panel')).display !== 'none',
  };
});
if (!mobileMenu.exists || !mobileMenu.open || mobileMenu.links === 0) {
  failures.push('Mobile navigation menu is missing or not operable');
}
await page.evaluate(() => document.querySelector('.mobile-menu')?.removeAttribute('open'));
await page.screenshot({ path: path.join(screens, 'mobile-home.png'), fullPage: true });
await visit('/tools/json-formatter/', { selector: '.tool-app' });
await page.screenshot({ path: path.join(screens, 'mobile-tool.png'), fullPage: false });

await page.evaluate(() => localStorage.setItem('oriz-theme', 'dark'));
await page.setViewport({ width: 1440, height: 1000 });
for (const route of ['/', '/tools/contrast-checker/', '/money-finance/loans-credit/home-loan-emi-breakup-principal-interest/']) {
  await visit(route, { selector: route.startsWith('/tools/') ? '.tool-app' : undefined });
  await runAxe(`${route} (dark)`);
}
await page.evaluate(() => localStorage.setItem('oriz-theme', 'light'));


await page.setViewport({ width: 1440, height: 1000 });
await visit('/', { selector: '.hero' });
await page.screenshot({ path: path.join(screens, 'home-light.png'), fullPage: false });
await page.screenshot({ path: path.join(screens, 'home-full.png'), fullPage: true });

await visit('/tools/json-formatter/', { selector: '.tool-app' });
await page.screenshot({ path: path.join(screens, 'tool-json.png'), fullPage: false });

await visit('/money-finance/loans-credit/home-loan-emi-breakup-principal-interest/');
await page.screenshot({ path: path.join(screens, 'article-finance.png'), fullPage: false });
await page.screenshot({ path: path.join(screens, 'article-finance-full.png'), fullPage: true });

await visit('/technology/backend-apis/http-status-codes/');
await page.waitForSelector('.mermaid-diagram svg', { timeout: 15000 });
await page.screenshot({ path: path.join(screens, 'article-diagram.png'), fullPage: false });

await visit('/author/chirag-singhal/');
await page.screenshot({ path: path.join(screens, 'author.png'), fullPage: true });

await page.evaluate(() => localStorage.setItem('oriz-theme', 'dark'));
await visit('/');
await page.screenshot({ path: path.join(screens, 'home-dark.png'), fullPage: false });
await page.evaluate(() => localStorage.setItem('oriz-theme', 'light'));

async function measurePerformance(route, viewport) {
  const perfPage = await browser.newPage();
  await perfPage.setCacheEnabled(false);
  await perfPage.setViewport(viewport);
  await perfPage.evaluateOnNewDocument(() => {
    window.__orizPerf = { lcp: 0, cls: 0, longTasks: 0 };
    if ('PerformanceObserver' in window) {
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__orizPerf.lcp = Math.max(window.__orizPerf.lcp, entry.startTime);
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch { /* Not supported. */ }
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__orizPerf.cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch { /* Not supported. */ }
      try {
        new PerformanceObserver((list) => {
          window.__orizPerf.longTasks += list.getEntries().length;
        }).observe({ type: 'longtask', buffered: true });
      } catch { /* Not supported. */ }
    }
  });
  await perfPage.goto(`${BASE}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
  if (/^\/tools\/[^/]+\/$/u.test(route)) {
    await perfPage.waitForSelector('.tool-app', { timeout: 20000 });
  }
  if (route === '/tools/mermaid-editor/') {
    await perfPage.waitForSelector('.mermaid-preview svg', { timeout: 20000 });
  }
  await new Promise((resolve) => setTimeout(resolve, 600));
  const metrics = await perfPage.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = Object.fromEntries(
      performance.getEntriesByType('paint').map((entry) => [entry.name, entry.startTime]),
    );
    const resources = performance.getEntriesByType('resource');
    const size = (condition) =>
      Math.round(
        resources
          .filter(condition)
          .reduce((total, entry) => total + (entry.transferSize || 0), 0) / 1024,
      );
    return {
      lcpMs: Math.round(window.__orizPerf.lcp),
      cls: Number(window.__orizPerf.cls.toFixed(4)),
      longTasks: window.__orizPerf.longTasks,
      fcpMs: paint['first-contentful-paint'] ? Math.round(paint['first-contentful-paint']) : null,
      ttfbMs: navigation ? Math.round(navigation.responseStart) : null,
      loadMs: navigation ? Math.round(navigation.loadEventEnd) : null,
      requests: resources.length,
      transferKiB: size(() => true),
      jsKiB: size((entry) => entry.initiatorType === 'script' || /\.js(\?|$)/u.test(entry.name)),
      cssKiB: size((entry) => entry.initiatorType === 'css' || /\.css(\?|$)/u.test(entry.name)),
    };
  });
  await perfPage.close();
  return { route, viewport: `${viewport.width}x${viewport.height}`, ...metrics };
}

const performance = [];
performance.push(await measurePerformance('/', { width: 1440, height: 1000 }));
performance.push(await measurePerformance('/', { width: 390, height: 844 }));
performance.push(await measurePerformance('/tools/json-formatter/', { width: 1440, height: 1000 }));
performance.push(await measurePerformance('/money-finance/loans-credit/home-loan-emi-breakup-principal-interest/', { width: 1440, height: 1000 }));
performance.push(await measurePerformance('/tools/mermaid-editor/', { width: 1440, height: 1000 }));

const seriousAxe = axeResults.filter(
  (violation) => violation.impact === 'serious' || violation.impact === 'critical',
);

const report = {
  base: BASE,
  checked: {
    corePages: corePages.length,
    tools: tools.length,
    articles: articles.length,
    apis: apis.length,
    categories: categories.length,
    learningPaths: paths.length,
  },
  interactions: {
    json: jsonCheck,
    search: searchCheck,
    xml: xmlCheck,
    mermaidIsolation: mermaidIsolationCheck,
    markdownPrivacy: markdownPrivacyCheck,
    toolFilter: toolFilterCheck,
    glossaryFilter: glossaryFilterCheck,
    learningProgress: learningProgressCheck,
    articleFeatures: articleFeatureCheck,
    theme: themeCheck,
    mobileMenu,
    libraryMenu: libraryMenuCheck,
  },
  performance,
  pageErrors,
  failures,
  axe: {
    violations: axeResults,
    seriousOrCritical: seriousAxe.length,
  },
};
await writeFile(
  path.resolve('.scratch/browser-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);

await browser.close();

console.log('');
console.log('ORIZ.IN browser QA');
console.log('------------------');
console.log(`Core pages:       ${corePages.length}`);
console.log(`Tools:            ${tools.length}`);
console.log(`Articles:         ${articles.length}`);
console.log(`APIs:             ${apis.length}`);
console.log(`Axe violations:   ${axeResults.length} (${seriousAxe.length} serious/critical)`);
console.log(`Page errors:      ${pageErrors.length}`);
console.log(`Failures:         ${failures.length}`);
console.log('');
console.log('Performance measurements (local Edge, uncached):');
for (const metric of performance) {
  console.log(
    `  ${metric.route} ${metric.viewport}: LCP ${metric.lcpMs} ms, CLS ${metric.cls}, FCP ${metric.fcpMs} ms, ${metric.requests} requests, ${metric.transferKiB} KiB transfer`,
  );
}
if (pageErrors.length > 0) {
  console.log('');
  for (const error of pageErrors.slice(0, 20)) {
    console.log(`page error: ${error.url} — ${error.message}`);
  }
}
if (failures.length > 0) {
  console.log('');
  for (const failure of failures.slice(0, 30)) console.log(`failure: ${failure}`);
}
if (axeResults.length > 0) {
  console.log('');
  for (const violation of axeResults.slice(0, 30)) {
    console.log(
      `axe: ${violation.route} — ${violation.id} (${violation.impact}) × ${violation.count}: ${violation.help}`,
    );
  }
}
if (failures.length > 0 || pageErrors.length > 0 || seriousAxe.length > 0) {
  process.exitCode = 1;
}
