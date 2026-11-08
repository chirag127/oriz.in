import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';
import YAML from 'yaml';

const localRequire = createRequire(import.meta.url);
const taxonomySource = await readFile('src/data/taxonomy.ts', 'utf8');
const transpiled = ts.transpileModule(taxonomySource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const taxonomyModule = { exports: {} };
new Function('exports', 'require', 'module', transpiled)(
  taxonomyModule.exports,
  localRequire,
  taxonomyModule,
);
const { CATEGORIES, DOMAINS } = taxonomyModule.exports;
const domainTitle = new Map(DOMAINS.map((domain) => [domain.slug, domain.title]));

const focus = {
  'personal-finance':
    'The goal is not to optimise every rupee; it is to make the monthly system stable enough that a surprise does not become debt.',
  banking:
    'A bank account is infrastructure. The useful questions are access, safety, fees, and how quickly the money can move.',
  investing:
    'Investing starts with time horizon and risk capacity, not with a product name. These articles compare costs, assumptions, and behaviour.',
  stocks:
    'A company is not a ticker. These guides read reports, incentives, and the places where minority shareholders lose money.',
  tax:
    'Tax planning is record-keeping plus a correct reading of the current rules, not a collection of shortcuts.',
  retirement:
    'Retirement is an income problem disguised as a savings problem; the corpus, the withdrawal order, and the pension all matter.',
  'loans-credit':
    'Credit is useful when it is priced and sized deliberately; the same facility becomes a trap when the minimum payment becomes the plan.',
  gold:
    'Gold is a cultural asset, a crisis asset, and a consumption purchase at the same time; the guide separates those jobs.',
  'real-estate':
    'Property decisions are local, document-heavy, and illiquid; the arithmetic has to include title, taxes, and time.',
  alternatives:
    'Alternative investments are not automatically diversifying; the platform pitch usually omits liquidity, fees, and default math.',
  nri: 'Cross-border money is a paperwork problem before it is an investment problem.',
  'money-tools':
    'A tracker is only useful if the numbers are checked; these tools support a review habit, not a dashboard hobby.',
  'early-career':
    'The first few years are where habits, credit, and a small investing base are built; the amounts matter less than the direction.',
  'side-income':
    'Independent income adds variability; the system has to handle tax, late payments, and months with no invoice.',
  'small-business':
    'Compliance is part of the product; a business that cannot produce records cannot reliably keep its margin.',
  'health-insurance':
    'Health cover is judged at the hospital counter, not at the brochure; room rent, deductibles, and waiting periods decide the bill.',
  'life-insurance':
    'Term insurance protects people who depend on your income; it is not a savings product with a premium attached.',
  'motor-insurance':
    'Motor cover is a contract about depreciation and add-ons; the cheapest premium is not the lowest claim.',
  'education-financing':
    'Education financing is a household cash-flow decision; the loan, the corpus, and the retirement account compete for the same rupees.',
  'marriage-money':
    'Money in a marriage is both a household system and a legal one; the conversation before the crisis is the useful one.',
  'family-money':
    'Family money is a set of recurring obligations; naming them is the first step to making them sustainable.',
  'women-money':
    'Financial independence is infrastructure: an account, a nomination, a record, and the ability to act without permission.',
  inheritance:
    'Inheritance is decided by documents and timing, not by what everyone assumed would happen.',
  'scams-fraud':
    'Fraud is a process, not a single mistake; the first hour and the first call matter.',
  'financial-crime':
    'The legality rating is part of the information; a scheme that works until it is prosecuted is not a strategy.',
  programming:
    'Types and language rules are a way to make some classes of bug impossible before the code runs.',
  'backend-apis':
    'An API is a contract about identity, failure, and state; the happy path is the easy part.',
  'web-development':
    'The web is a set of protocols and files; understanding the layer underneath the framework makes debugging cheaper.',
  'data-storage':
    'Data work is mostly decisions about shape, validation, and reconciliation; the query is the visible part.',
  networking:
    'Addressing and routing explain a large share of problems that look like application bugs.',
  'developer-craft':
    'Small tools and readable history reduce the cost of every future change.',
  'computer-science':
    'The useful question is not whether an algorithm is clever, but what it costs at the size you actually have.',
  'ai-engineering':
    'A working AI product is a retrieval, evaluation, and operations problem before it is a model problem.',
  'data-engineering':
    'Real data arrives messy; the pipeline earns trust by rejecting, reconciling, and rerunning cleanly.',
  'color-accessibility':
    'Color is information; contrast and semantics decide whether that information reaches the reader.',
  'government-portals':
    'Use the official portal, keep the acknowledgement, and verify the next step; most civic friction is a documentation problem.',
};

const libraryRoot = path.resolve('src/content/library');
const articlesByCategory = new Map();

async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scan(full);
      continue;
    }
    if (!entry.name.endsWith('.md')) continue;
    const relative = path.relative(libraryRoot, full).split(path.sep);
    const [domain, category, series, filename] = relative;
    const text = await readFile(full, 'utf8');
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
    const data = match ? YAML.parse(match[1]) : {};
    const order = Number.parseInt(filename?.match(/^(\d+)-/u)?.[1] ?? '0', 10);
    const slug = filename?.replace(/^\d+-/u, '').replace(/\.md$/u, '') ?? '';
    const list = articlesByCategory.get(category) ?? [];
    list.push({
      slug,
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      domain,
      series,
      order,
    });
    articlesByCategory.set(category, list);
  }
}

await scan(libraryRoot);
for (const list of articlesByCategory.values()) {
  list.sort((a, b) => a.series.localeCompare(b.series) || a.order - b.order);
}

function clip(value, max) {
  if (value.length <= max) return value;
  const cut = value.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

for (const category of CATEGORIES.filter((entry) => entry.live)) {
  const domain = category.domain;
  const articles = articlesByCategory.get(category.slug) ?? [];
  if (articles.length === 0) continue;
  const first = articles[0];
  const second = articles[1];
  const title =
    category.slug === 'gold'
      ? 'Gold in India: The Complete Guide'
      : category.slug === 'personal-finance'
        ? 'Personal Finance in India: The Complete Guide'
        : `${category.title}: The Complete Guide`;
  const description = clip(category.description, 200);
  const startHere = articles.slice(0, 3).map((article) => article.slug);
  const body = [
    category.description,
    '',
    focus[category.slug] ?? 'This guide collects the articles in this category into a deliberate reading order.',
    '',
    '## How to read this category',
    '',
    `Start with **${first.title}**.${second ? ` Then continue with **${second.title}**.` : ''} The articles are ordered as a sequence, but each one stands alone if you arrived with a specific question.`,
    '',
    '## What this guide covers',
    '',
    `The category currently contains ${articles.length} ${articles.length === 1 ? 'article' : 'articles'} across ${new Set(articles.map((article) => article.series)).size} ${new Set(articles.map((article) => article.series)).size === 1 ? 'series' : 'series'}. The complete article index appears below this guide, followed by any tools that support the same work.`,
    '',
    '## How to use it',
    '',
    'Read the guide first for the map, then use the article index to go deeper. Where a calculator is available, run your own numbers rather than accepting an illustrative result. Where a rule or rate is involved, verify the current version before acting.',
  ].join('\n');

  const frontmatter = YAML.stringify(
    {
      title,
      description,
      updated: '2026-10-30',
      heroImage: '/og-default.png',
      heroImageAlt: `Editorial illustration for the ORIZ.IN ${category.title} guide.`,
      keyQuestions: [],
      startHere,
      faq: [],
      tools: [],
      featuredArticles: startHere,
    },
    { lineWidth: 0 },
  );

  const targetDir = path.join('src/content/guides', domain);
  await mkdir(targetDir, { recursive: true });
  const target = path.join(targetDir, `${category.slug}.md`);
  await writeFile(target, `---\n${frontmatter}---\n\n${body}\n`, 'utf8');
  console.log(`${domain}/${category.slug}.md`);
}

console.log('Generated guides for', [...articlesByCategory.keys()].length, 'categories.');
