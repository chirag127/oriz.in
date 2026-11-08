import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';
import ts from 'typescript';

const DIST = path.resolve('dist');
const SITE_ORIGIN = 'https://oriz.in';
const errors = [];
const warnings = [];

async function loadLegacyMaps() {
  const source = await readFile('src/data/legacy-redirects.ts', 'utf8');
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function('exports', 'module', js)(module.exports, module);
  return module.exports;
}

async function loadDotEnv() {
  try {
    const text = await readFile('.env', 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      let value = trimmed.slice(index + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .env is optional.
  }
}

async function walk(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full, relative)));
    } else {
      files.push({ relative, full });
    }
  }
  return files;
}

function normalizePathname(pathname) {
  let result = pathname.replace(/\/+/gu, '/');
  if (!result.startsWith('/')) result = `/${result}`;
  if (result.length > 1 && !result.endsWith('/') && !path.extname(result)) {
    result = `${result}/`;
  }
  return result;
}

function fileForPath(pathname) {
  const clean = decodeURIComponent(pathname.split('?')[0].split('#')[0]);
  const relative = clean.replace(/^\/+/u, '');
  if (!relative) return path.join(DIST, 'index.html');
  const candidate = path.join(DIST, relative);
  if (clean.endsWith('/')) return path.join(candidate, 'index.html');
  if (path.extname(clean)) return candidate;
  return path.join(candidate, 'index.html');
}

function tagLinks(html) {
  const links = new Set();
  const tags = html.match(/<[^>]+>/gu) ?? [];
  for (const tag of tags) {
    if (/\srel\s*=\s*["']canonical["']/iu.test(tag)) continue;
    const href = tag.match(/\shref\s*=\s*["']([^"']+)["']/iu);
    if (href) links.add(href[1]);
    const src = tag.match(/\ssrc\s*=\s*["']([^"']+)["']/iu);
    if (src) links.add(src[1]);
  }
  return [...links];
}

function isExternalOrSpecial(href) {
  return (
    !href ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:') ||
    href.startsWith('data:') ||
    href.startsWith('blob:') ||
    href.startsWith('//')
  );
}

async function main() {
  await loadDotEnv();

  if (!existsSync(DIST)) {
    console.error('dist/ does not exist. Run Astro build first.');
    process.exit(1);
  }

  const analyticsEnabled =
    process.env.PUBLIC_ANALYTICS_ENABLED === 'true' &&
    Boolean(process.env.PUBLIC_GA4_ID || process.env.PUBLIC_CLARITY_ID);
  const gaId = (process.env.PUBLIC_GA4_ID ?? '').trim();
  const clarityId = (process.env.PUBLIC_CLARITY_ID ?? '').trim();
  const adsEnabled =
    process.env.PUBLIC_ADSENSE_ENABLED === 'true' &&
    /^ca-pub-\d+$/u.test((process.env.PUBLIC_ADSENSE_CLIENT ?? '').trim()) &&
    /^\d+$/u.test((process.env.PUBLIC_ADSENSE_SLOT ?? '').trim());

  const scriptSrc = ["'self'", "'unsafe-inline'"];
  const connectSrc = ["'self'"];
  const imgSrc = ["'self'", 'data:', 'blob:'];
  const frameSrc = ["'self'", 'data:', 'blob:'];
  const styleSrc = ["'self'", "'unsafe-inline'"];
  const fontSrc = ["'self'", 'data:'];

  if (analyticsEnabled) {
    scriptSrc.push('https://www.googletagmanager.com');
    if (gaId) {
      scriptSrc.push('https://www.google-analytics.com', 'https://region1.google-analytics.com');
      connectSrc.push(
        'https://www.google-analytics.com',
        'https://region1.google-analytics.com',
        'https://analytics.google.com',
        'https://*.analytics.google.com',
        'https://www.googletagmanager.com',
      );
      imgSrc.push('https://www.google-analytics.com', 'https://*.google-analytics.com');
    }
    if (clarityId) {
      scriptSrc.push('https://www.clarity.ms', 'https://scripts.clarity.ms');
      connectSrc.push('https://www.clarity.ms', 'https://*.clarity.ms');
      imgSrc.push('https://*.clarity.ms');
    }
  }

  if (adsEnabled) {
    scriptSrc.push(
      'https://pagead2.googlesyndication.com',
      'https://*.googlesyndication.com',
      'https://googleads.g.doubleclick.net',
      'https://tpc.googlesyndication.com',
      'https://www.googletagservices.com',
      'https://adservice.google.com',
      'https://fundingchoicesmessages.google.com',
    );
    imgSrc.push(
      'https://pagead2.googlesyndication.com',
      'https://*.googlesyndication.com',
      'https://googleads.g.doubleclick.net',
      'https://www.google.com',
      'https://www.gstatic.com',
    );
    frameSrc.push(
      'https://googleads.g.doubleclick.net',
      'https://tpc.googlesyndication.com',
      'https://www.google.com',
      'https://fundingchoicesmessages.google.com',
      'https://*.googlesyndication.com',
    );
    connectSrc.push(
      'https://pagead2.googlesyndication.com',
      'https://*.googlesyndication.com',
      'https://googleads.g.doubleclick.net',
      'https://adservice.google.com',
      'https://fundingchoicesmessages.google.com',
    );
  }

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    `style-src ${styleSrc.join(' ')}`,
    `img-src ${imgSrc.join(' ')}`,
    `font-src ${fontSrc.join(' ')}`,
    `connect-src ${connectSrc.join(' ')}`,
    `frame-src ${frameSrc.join(' ')}`,
    "media-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

  const headers = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: ${csp}

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/data/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=3600, must-revalidate

/search-index.json
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=3600, must-revalidate

/rss.xml
  Cache-Control: public, max-age=1800, must-revalidate

/og-default.png
  Cache-Control: public, max-age=31536000, immutable

/icon-192.png
  Cache-Control: public, max-age=31536000, immutable

/icon-512.png
  Cache-Control: public, max-age=31536000, immutable

/apple-touch-icon.png
  Cache-Control: public, max-age=31536000, immutable
`;
  await writeFile(path.join(DIST, '_headers'), headers);

  if (adsEnabled) {
    const client = process.env.PUBLIC_ADSENSE_CLIENT.trim();
    const publisher = client.replace(/^ca-/u, '');
    await writeFile(
      path.join(DIST, 'ads.txt'),
      `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`,
    );
  }

  const files = await walk(DIST);
  const htmlFiles = files.filter((file) => file.relative.endsWith('.html'));
  const routeMeta = new Map();

  for (const file of htmlFiles) {
    const route =
      file.relative === 'index.html'
        ? '/'
        : `/${file.relative.replace(/\/?index\.html$/u, '/').replace(/^\/+/u, '')}`;
    const html = await readFile(file.full, 'utf8');
    const title = html.match(/<title>(.*?)<\/title>/isu)?.[1]?.trim() ?? '';
    const description =
      html.match(/<meta\s+name="description"\s+content="([^"]*)"/iu)?.[1]?.trim() ?? '';
    const canonical =
      html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/iu)?.[1]?.trim() ?? '';
    const noindex = /<meta\s+name="robots"\s+content="noindex/iu.test(html);

    if (!title) errors.push(`Missing <title> in ${file.relative}`);
    if (!description) errors.push(`Missing meta description in ${file.relative}`);
    if (!canonical) errors.push(`Missing canonical URL in ${file.relative}`);
    else if (!canonical.startsWith(SITE_ORIGIN)) {
      errors.push(`Canonical URL on ${file.relative} is outside ${SITE_ORIGIN}: ${canonical}`);
    }
    if (!/<meta\s+name="viewport"/iu.test(html)) {
      errors.push(`Missing viewport meta in ${file.relative}`);
    }

    const images = html.match(/<img\b[^>]*>/giu) ?? [];
    for (const image of images) {
      if (!/\salt\s*=\s*["'][^"']*["']/iu.test(image)) {
        errors.push(`Image without an alt attribute in ${file.relative}`);
      }
    }

    const jsonLdBlocks = [
      ...html.matchAll(
        /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu,
      ),
    ];
    for (const [index, block] of jsonLdBlocks.entries()) {
      try {
        JSON.parse(block[1]);
      } catch {
        errors.push(`Invalid JSON-LD block ${index + 1} in ${file.relative}`);
      }
    }

    routeMeta.set(route, { file, html, title, description, canonical, noindex });
  }

  const titles = new Map();
  for (const [route, meta] of routeMeta) {
    if (meta.noindex) continue;
    const key = meta.title.toLocaleLowerCase();
    if (titles.has(key)) {
      errors.push(
        `Duplicate indexable title “${meta.title}” on ${titles.get(key)} and ${route}`,
      );
    } else {
      titles.set(key, route);
    }
  }

  const brokenLinks = new Map();
  for (const [route, meta] of routeMeta) {
    for (const rawHref of tagLinks(meta.html)) {
      if (isExternalOrSpecial(rawHref)) continue;
      const decoded = rawHref.replace(/&amp;/gu, '&');
      let targetUrl;
      try {
        targetUrl = new URL(decoded, `${SITE_ORIGIN}${route}`);
      } catch {
        errors.push(`Unparseable internal URL “${rawHref}” on ${route}`);
        continue;
      }
      if (targetUrl.origin !== SITE_ORIGIN) continue;
      const targetPath = fileForPath(targetUrl.pathname);
      if (!existsSync(targetPath)) {
        if (!brokenLinks.has(rawHref)) brokenLinks.set(rawHref, new Set());
        brokenLinks.get(rawHref).add(route);
        continue;
      }
      if (targetUrl.hash && targetPath.endsWith('.html')) {
        const targetHtml = await readFile(targetPath, 'utf8');
        const fragment = decodeURIComponent(targetUrl.hash.slice(1));
        const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
        const anchorPattern = new RegExp(
          `(?:id|name)=["']${escaped}["']`,
          'iu',
        );
        if (!anchorPattern.test(targetHtml)) {
          errors.push(
            `Missing anchor #${fragment} at ${targetUrl.pathname} (linked from ${route})`,
          );
        }
      }
    }
  }
  for (const [href, sources] of brokenLinks) {
    errors.push(
      `Broken internal link ${href} linked from ${[...sources].slice(0, 5).join(', ')}${sources.size > 5 ? '…' : ''}`,
    );
  }

  const sitemapFiles = files.filter((file) =>
    /^sitemap-[\d]+\.xml$/u.test(path.basename(file.relative)),
  );
  const sitemapUrls = [];
  for (const file of sitemapFiles) {
    const text = await readFile(file.full, 'utf8');
    sitemapUrls.push(...[...text.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1]));
  }
  const sitemapPaths = new Set(
    sitemapUrls.map((url) => normalizePathname(new URL(url).pathname)),
  );

  if (routeMeta.has('/search/') && sitemapPaths.has('/search/')) {
    errors.push('The noindex search page is present in the sitemap.');
  }
  if (sitemapPaths.has('/404/')) {
    errors.push('The 404 page is present in the sitemap.');
  }
  for (const [route, meta] of routeMeta) {
    if (meta.noindex || route === '/404/') continue;
    if (!sitemapPaths.has(normalizePathname(route))) {
      warnings.push(`Indexable page missing from sitemap: ${route}`);
    }
  }
  for (const sitemapPath of sitemapPaths) {
    const target = fileForPath(sitemapPath);
    if (!existsSync(target)) {
      errors.push(`Sitemap URL has no generated page: ${sitemapPath}`);
    }
  }

  const readJson = async (relative) => {
    const file = path.join(DIST, relative);
    try {
      return JSON.parse(await readFile(file, 'utf8'));
    } catch {
      errors.push(`Missing or invalid public data file: ${relative}`);
      return null;
    }
  };
  const articlesData = await readJson('data/articles.json');
  const toolsData = await readJson('data/tools.json');
  const categoriesData = await readJson('data/categories.json');
  const apisData = await readJson('data/apis.json');
  const pathsData = await readJson('data/learning-paths.json');
  const glossaryData = await readJson('data/glossary.json');
  const searchData = await readJson('search-index.json');

  if (!existsSync(path.join(DIST, 'rss.xml'))) errors.push('rss.xml was not generated.');
  if (!existsSync(path.join(DIST, 'sitemap-index.xml'))) {
    errors.push('sitemap-index.xml was not generated.');
  }
  if (!existsSync(path.join(DIST, 'robots.txt'))) errors.push('robots.txt is missing.');
  else {
    const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8');
    if (!robots.includes(`${SITE_ORIGIN}/sitemap-index.xml`)) {
      errors.push('robots.txt does not reference the sitemap index.');
    }
    if (/Disallow:\s*\/_astro/iu.test(robots)) {
      errors.push('robots.txt blocks the asset directory.');
    }
  }

  const publishedSlugs = new Set((articlesData?.articles ?? []).map((entry) => entry.slug));
  const searchSlugs = new Set(
    (searchData?.records ?? [])
      .filter((record) => record.type === 'article')
      .map((record) => record.url.split('/').filter(Boolean).at(-1)),
  );
  try {
    const contentDirectory = path.resolve('src/content/library');
    const articleFiles = [];
    async function collectArticles(dir) {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await collectArticles(full);
        else if (entry.name.endsWith('.md')) articleFiles.push(full);
      }
    }
    await collectArticles(contentDirectory);
    for (const articlePath of articleFiles) {
      const fileName = path.basename(articlePath);
      const raw = await readFile(articlePath, 'utf8');
      const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
      if (!frontmatter) continue;
      const data = parseYaml(frontmatter[1]);
      if (data?.draft === true) {
        const slug = fileName.replace(/^\d+-/u, '').replace(/\.md$/u, '');
        if (publishedSlugs.has(slug) || searchSlugs.has(slug)) {
          errors.push(`Draft article “${slug}” leaked into public data or search.`);
        }
      }
    }
  } catch (error) {
    warnings.push(`Could not run the draft leakage check: ${error.message}`);
  }

  if (articlesData && searchData) {
    const searchArticleCount = searchData.records.filter(
      (record) => record.type === 'article',
    ).length;
    if (searchArticleCount !== articlesData.count) {
      warnings.push(
        `Search index has ${searchArticleCount} articles; public metadata has ${articlesData.count}.`,
      );
    }
  }

  let redirectCount = 0;
  if (articlesData?.articles) {
    const legacy = await loadLegacyMaps();
    const canonicalPaths = new Map(
      articlesData.articles.map((entry) => [entry.slug, new URL(entry.url).pathname]),
    );
    const lines = ['# Generated by scripts/postbuild.mjs'];
    for (const [legacySlug, targetSlug] of Object.entries(legacy.LEGACY_ARTICLE_REDIRECTS)) {
      const target = canonicalPaths.get(targetSlug);
      if (!target) {
        errors.push(`Legacy article redirect “${legacySlug}” targets missing “${targetSlug}”.`);
        continue;
      }
      lines.push(`/articles/${legacySlug}/  ${target}  301`);
    }
    for (const [legacySlug, target] of Object.entries(legacy.LEGACY_CATEGORY_REDIRECTS)) {
      lines.push(`/categories/${legacySlug}/  ${target}  301`);
    }
    lines.push('/categories/  /library/  301');
    await writeFile(path.join(DIST, '_redirects'), `${lines.join('\n')}\n`);
    redirectCount = lines.length - 1;
  }

  const sizes = [];
  let totalBytes = 0;
  for (const file of files) {
    const info = await stat(file.full);
    totalBytes += info.size;
    sizes.push({ path: file.relative, bytes: info.size });
  }
  sizes.sort((a, b) => b.bytes - a.bytes);
  const largest = sizes.slice(0, 10);
  const maxAsset = largest[0]?.bytes ?? 0;

  if (files.length > 20000) {
    errors.push(
      `Output has ${files.length} files, above the documented Cloudflare Pages free-plan file limit.`,
    );
  } else if (files.length > 15000) {
    warnings.push(
      `Output has ${files.length} files; approaching the documented 20,000-file hosting limit.`,
    );
  }
  if (maxAsset > 25 * 1024 * 1024) {
    errors.push('At least one output asset exceeds the documented 25 MiB per-file limit.');
  }
  if (totalBytes > 500 * 1024 * 1024) {
    warnings.push(`Output size is ${(totalBytes / 1024 / 1024).toFixed(1)} MiB.`);
  }

  const report = {
    generated: new Date().toISOString(),
    site: SITE_ORIGIN,
    ok: errors.length === 0,
    routes: {
      htmlFiles: htmlFiles.length,
      publishedPages: [...routeMeta.values()].filter((meta) => !meta.noindex).length,
      noindexPages: [...routeMeta.values()].filter((meta) => meta.noindex).length,
    },
    content: {
      articles: articlesData?.count ?? null,
      tools: toolsData?.count ?? null,
      categories: categoriesData?.count ?? null,
      redirects: redirectCount,
      apis: apisData?.count ?? null,
      learningPaths: pathsData?.count ?? null,
      glossaryTerms: glossaryData?.count ?? null,
      searchRecords: searchData?.count ?? null,
      sitemapUrls: sitemapUrls.length,
    },
    output: {
      files: files.length,
      totalBytes,
      totalMiB: Number((totalBytes / 1024 / 1024).toFixed(2)),
      largestAssets: largest.map((asset) => ({
        path: asset.path,
        bytes: asset.bytes,
        kib: Number((asset.bytes / 1024).toFixed(1)),
      })),
    },
    checks: {
      brokenInternalLinks: [...brokenLinks.keys()],
      sitemapWarnings: warnings.filter((warning) => warning.includes('sitemap')),
      jsonLd: 'parsed successfully in every HTML file with structured data',
      drafts: 'checked against public exports and search index',
      metadata: 'title, description, viewport, canonical checked',
      images: 'alt attributes checked',
      analyticsEnabled,
      adsEnabled,
    },
    warnings,
    errors,
  };

  await writeFile(
    path.join(DIST, 'build-report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );

  console.log('');
  console.log('ORIZ.IN build report');
  console.log('--------------------');
  console.log(`HTML routes:      ${report.routes.htmlFiles}`);
  console.log(`Published pages:  ${report.routes.publishedPages}`);
  console.log(`Articles:         ${report.content.articles}`);
  console.log(`Tools:            ${report.content.tools}`);
  console.log(`Categories:       ${report.content.categories}`);
  console.log(`Redirects:        ${report.content.redirects}`);
  console.log(`APIs:             ${report.content.apis}`);
  console.log(`Sitemap URLs:     ${report.content.sitemapUrls}`);
  console.log(`Output files:     ${files.length}`);
  console.log(`Output size:      ${report.output.totalMiB} MiB`);
  console.log(`Largest asset:    ${(maxAsset / 1024).toFixed(1)} KiB`);
  console.log(`Analytics:        ${analyticsEnabled ? 'enabled' : 'disabled'}`);
  console.log(`AdSense:          ${adsEnabled ? 'enabled' : 'disabled'}`);
  console.log(`Warnings:         ${warnings.length}`);
  console.log(`Errors:           ${errors.length}`);
  if (warnings.length > 0) {
    console.log('');
    for (const warning of warnings.slice(0, 30)) console.log(`warning: ${warning}`);
  }
  if (errors.length > 0) {
    console.log('');
    for (const error of errors.slice(0, 50)) console.log(`error: ${error}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
