import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourceDir = path.resolve('src/content/articles');
const libraryDir = path.resolve('src/content/library');

const moves = [
  { slug: 'typescript-type-system', target: 'technology/programming/typescript', order: 1 },
  { slug: 'python-data-workflows', target: 'ai-data/data-engineering/python-data', order: 1 },
  { slug: 'http-status-codes', target: 'technology/backend-apis/reliable-apis', order: 1 },
  { slug: 'secure-api-design', target: 'technology/backend-apis/reliable-apis', order: 2 },
  { slug: 'backend-reliability-budget', target: 'technology/backend-apis/reliable-apis', order: 3 },
  { slug: 'json-formatting-and-validation', target: 'technology/data-storage/sql-and-data', order: 1 },
  { slug: 'reading-sql-queries', target: 'technology/data-storage/sql-and-data', order: 2 },
  { slug: 'ipv4-subnetting-guide', target: 'technology/networking/ip-addressing', order: 1 },
  { slug: 'git-merge-vs-rebase', target: 'technology/developer-craft/git-and-history', order: 1 },
  { slug: 'base64-is-not-encryption', target: 'technology/developer-craft/text-and-diagrams', order: 1 },
  { slug: 'diagramming-with-mermaid', target: 'technology/developer-craft/text-and-diagrams', order: 2 },
  { slug: 'cron-expressions-guide', target: 'technology/developer-craft/scheduling', order: 1 },
  { slug: 'diff-algorithms', target: 'technology/computer-science/algorithms', order: 1 },
  { slug: 'static-json-apis-on-github-pages', target: 'technology/web-development/static-web', order: 1 },
  { slug: 'css-color-formats', target: 'design-accessibility/color-accessibility/color-and-contrast', order: 1 },
  { slug: 'rag-retrieval-augmented-generation', target: 'ai-data/ai-engineering/production-ai', order: 1 },
  { slug: 'evaluating-llm-applications', target: 'ai-data/ai-engineering/production-ai', order: 2 },
  { slug: 'compound-interest-guide', target: 'money-finance/personal-finance/money-foundations', order: 6 },
];

const finance = new Set([
  'money-finance/personal-finance/money-foundations',
]);

for (const move of moves) {
  const source = path.join(sourceDir, `${move.slug}.md`);
  const targetDir = path.join(libraryDir, move.target);
  const target = path.join(targetDir, `${String(move.order).padStart(2, '0')}-${move.slug}.md`);

  let text = await readFile(source, 'utf8');
  text = text.replace(/^categories:.*\r?\n/mu, '');

  if (finance.has(move.target) && !/^legal:/mu.test(text)) {
    text = text.replace(/^---\r?\n([\s\S]*?)\r?\n---/u, (match, frontmatter) => {
      return `---\n${frontmatter}\nlegal: reference\n---`;
    });
  }

  await mkdir(targetDir, { recursive: true });
  await writeFile(target, text, 'utf8');
  await rm(source);
  console.log(`${move.slug} -> ${path.relative(process.cwd(), target)}`);
}

console.log('Moved', moves.length, 'articles.');
