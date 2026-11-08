import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { SERIES_ORDER, targetSeries } from './arac-map.mjs';

const sourceDir = path.resolve(
  process.argv.find((argument) => argument.startsWith('--source='))?.split('=')[1] ??
    '.scratch/arac/src/content/blog',
);
const libraryDir = path.resolve('src/content/library');
const reportPath = path.resolve('docs/superpowers/reports/arac-import-report.md');
const today = '2026-10-30';

const DISCLAIMER =
  'This article is educational and does not constitute financial, tax, investment, or legal advice. Rules, rates, and product terms change; verify current details with the relevant authority or a qualified professional before acting.';

function frontmatterAndBody(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u);
  if (!match) throw new Error('Missing frontmatter');
  return { frontmatter: YAML.parse(match[1]) ?? {}, body: text.slice(match[0].length) };
}

function normaliseDate(value) {
  if (!value) return today;
  const text = String(value);
  return text.slice(0, 10) > today ? today : text.slice(0, 10);
}

function orderForSeries(seriesKey, records) {
  const preferred = SERIES_ORDER[seriesKey];
  const sorted = [...records].sort(
    (a, b) => a.pubDate.localeCompare(b.pubDate) || a.slug.localeCompare(b.slug),
  );
  if (!preferred) return sorted.map((record, index) => ({ ...record, order: index + 1 }));

  const bySlug = new Map(records.map((record) => [record.slug, record]));
  const ordered = [];
  for (const slug of preferred) {
    const record = bySlug.get(slug);
    if (record) {
      ordered.push(record);
      bySlug.delete(slug);
    }
  }
  for (const record of sorted) {
    if (bySlug.has(record.slug)) {
      ordered.push(record);
      bySlug.delete(record.slug);
    }
  }
  return ordered.map((record, index) => ({ ...record, order: index + 1 }));
}

const files = (await readdir(sourceDir)).filter((file) => file.endsWith('.md')).sort();
const records = [];
const errors = [];

for (const file of files) {
  try {
    const text = await readFile(path.join(sourceDir, file), 'utf8');
    const { frontmatter, body } = frontmatterAndBody(text);
    const slug = file.replace(/\.md$/u, '');
    const seriesKey = targetSeries(frontmatter.track, slug);
    if (!seriesKey) {
      errors.push(`${file}: no target series for track “${frontmatter.track}”`);
      continue;
    }
    const [domain, category, series] = seriesKey.split('/');
    if (!domain || !category || !series) {
      errors.push(`${file}: malformed target series “${seriesKey}”`);
      continue;
    }
    records.push({
      file,
      slug,
      seriesKey,
      domain,
      category,
      series,
      pubDate: normaliseDate(frontmatter.pubDate),
      title: String(frontmatter.title ?? '').trim(),
      description: String(frontmatter.description ?? '').trim(),
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String).slice(0, 8) : [],
      difficulty: ['beginner', 'intermediate', 'advanced'].includes(frontmatter.level)
        ? frontmatter.level
        : 'intermediate',
      legal: ['legal', 'grey', 'illegal', 'reference'].includes(frontmatter.legal)
        ? frontmatter.legal
        : 'reference',
      body,
    });
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  const bySeries = new Map();
  for (const record of records) {
    const list = bySeries.get(record.seriesKey) ?? [];
    list.push(record);
    bySeries.set(record.seriesKey, list);
  }

  const ordered = [...bySeries.entries()].flatMap(([seriesKey, list]) =>
    orderForSeries(seriesKey, list),
  );

  const report = [];
  for (const record of ordered) {
    const targetDir = path.join(libraryDir, record.domain, record.category, record.series);
    await mkdir(targetDir, { recursive: true });
    const prefix = String(record.order).padStart(2, '0');
    const target = path.join(targetDir, `${prefix}-${record.slug}.md`);
    const body = record.body
      .replace(
        '](/blog/related-party-transaction-detection/)',
        '](/money-finance/stocks/related-party-transaction-detection/)',
      )
      .trimStart();

    const data = {
      title: record.title,
      description: record.description,
      pubDate: record.pubDate,
      author: 'Chirag Singhal',
      type: 'article',
      tags: record.tags,
      difficulty: record.difficulty,
      toc: true,
      legal: record.legal,
      source: {
        title: 'Rupee Realism',
        url: 'https://github.com/chirag127/arac',
        license: 'MIT',
      },
      disclaimer: DISCLAIMER,
      reviewStatus: 'editorial',
      license: 'CC BY 4.0',
    };

    const frontmatter = YAML.stringify(data, { lineWidth: 0 });
    await writeFile(target, `---\n${frontmatter}---\n\n${body}`, 'utf8');
    report.push(
      `| ${record.slug} | ${record.domain}/${record.category}/${record.series} | ${prefix} |`,
    );
  }

  await mkdir(path.dirname(reportPath), { recursive: true });
  const counts = [...bySeries.entries()]
    .map(([key, list]) => `- ${key}: ${list.length}`)
    .sort()
    .join('\n');
  await writeFile(
    reportPath,
    `# Rupee Realism import report\n\nSource: ${sourceDir}\nImported: ${new Date().toISOString()}\nFiles: ${ordered.length}\n\n## Series counts\n\n${counts}\n\n## Files\n\n| Source slug | Destination | Order |\n| --- | --- | --- |\n${report.join('\n')}\n`,
    'utf8',
  );

  console.log(`Imported ${ordered.length} articles.`);
  console.log(`Series: ${bySeries.size}`);
  console.log(`Report: ${path.relative(process.cwd(), reportPath)}`);
}
