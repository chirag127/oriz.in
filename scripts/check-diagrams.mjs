#!/usr/bin/env node
/**
 * check-diagrams.mjs — catch Mermaid diagrams that silently fail to render.
 *
 * Why this exists: a Mermaid syntax error does not fail the Astro build.
 * rehype-content emits the figure with a source-code fallback, and the client
 * renderer quietly swaps in "This diagram could not be rendered in your
 * browser". A broken diagram therefore ships to production unnoticed.
 *
 * The static rules below are deliberately narrow. They only encode constructs
 * verified to break the parser — quote-unsafe characters that Mermaid rejects
 * even when quoted, and statements the parser misreads as block terminators.
 * Characters like `:` and `<br/>` are perfectly legal in quoted labels and in
 * Note/message text, so flagging them would just train people to ignore output.
 *
 * For certainty, pair this with the browser sweep in scripts/check-diagrams-live.mjs.
 *
 * Usage: node scripts/check-diagrams.mjs [--quiet]
 * Exit: 0 clean, 1 problems found.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT = join(ROOT, 'src', 'content');
const quiet = process.argv.includes('--quiet');

/**
 * A statement that opens a block in flowchart/sequence grammars. A node label
 * on these lines ending in the exact word `end` is parsed as the block
 * terminator, which truncates the diagram.
 */
const isStatementLine = (line) =>
  /-->|---|==>|\.->|-\.->|->>|-->>/u.test(line) && !line.trim().startsWith('%%');

/**
 * A sequence-diagram message is `A->>B: free text`. Everything after the colon
 * is message text, where parentheses and angle brackets are plain characters.
 * Only the participants and label are parsed.
 */
const isMessageText = (line) =>
  /^\s*[A-Za-z0-9_]+\s*(?:->>|-->>|->|-x|--x)\s*[A-Za-z0-9_]+\s*:/u.test(line);

/**
 * Shape delimiters that legitimately contain parentheses: `[( ... )]` is the
 * cylinder/database shape. Remove the whole node so its contents are not linted
 * as a plain label.
 */
const stripShapeNodes = (line) => line.replace(/\[\([^\])]*\)\]/gu, '[SHAPE]');

/** Strip quoted segments so only unquoted label content is inspected. */
const stripQuoted = (line) => line.replace(/"[^"]*"/gu, '""');

const RULES = [
  {
    name: 'semicolon-terminator',
    // `;` is a statement separator in flowchart and sequence grammars.
    test: (line) => isStatementLine(line) && /;\s*\S/u.test(line),
    message: 'Semicolon inside a diagram statement — Mermaid splits it into two statements.',
  },
  {
    name: 'unquoted-parens-in-label',
    // A bare `(` opens a subgraph/shape token. Inside "..." it is fine.
    test: (line) => {
      if (!isStatementLine(line) || isMessageText(line)) return false;
      return /\(\s*[A-Za-z0-9]/u.test(stripShapeNodes(stripQuoted(line)));
    },
    message: 'Unquoted parenthesis in a node label — wrap the label in double quotes.',
  },
  {
    name: 'label-ends-with-end',
    // "end" as the final token of a node label terminates the enclosing block.
    test: (line) => {
      if (!isStatementLine(line) || isMessageText(line)) return false;
      const bare = stripQuoted(line);
      return /\bend\s*$/u.test(bare) || /\bend\s*[\]}]/u.test(bare);
    },
    message: 'Label ending in the word "end" — the parser may read it as a block terminator. Quote it or reword.',
  },
  {
    name: 'unbalanced-quotes',
    test: (line) => !line.trim().startsWith('%%') && (line.match(/"/gu) ?? []).length % 2 === 1,
    message: 'Odd number of double quotes — unterminated label breaks the whole diagram.',
  },
  {
    name: 'html-in-node-label',
    // Raw <, > inside an unquoted label is parsed as markup and throws.
    test: (line) => {
      if (!isStatementLine(line) || isMessageText(line)) return false;
      return /[[{][^\]}"\n]*[<>][^\]}"\n]*[\]}]/u.test(stripQuoted(line));
    },
    message: 'Raw angle bracket inside an unquoted node label — quote the label.',
  },
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function extractBlocks(text) {
  const lines = text.split(/\r?\n/u);
  const blocks = [];
  let current = null;
  lines.forEach((line, index) => {
    const fence = line.match(/^```(\w*)\s*$/u);
    if (fence) {
      if (current === null && fence[1] === 'mermaid') {
        current = { body: [] };
      } else if (current !== null) {
        blocks.push(current);
        current = null;
      }
      return;
    }
    if (current !== null) current.body.push({ line, lineNo: index + 1 });
  });
  return blocks;
}

const files = await walk(CONTENT);
const problems = [];
let totalBlocks = 0;

for (const file of files) {
  const blocks = extractBlocks(await readFile(file, 'utf8'));
  totalBlocks += blocks.length;
  for (const block of blocks) {
    for (const { line, lineNo } of block.body) {
      for (const rule of RULES) {
        let hit = false;
        try {
          hit = rule.test(line);
        } catch {
          hit = false;
        }
        if (hit) {
          problems.push({
            file: relative(ROOT, file).replaceAll('\\', '/'),
            lineNo,
            rule: rule.name,
            text: line.trim(),
            message: rule.message,
          });
        }
      }
    }
  }
}

if (problems.length === 0) {
  if (!quiet) {
    console.log(
      `check-diagrams: ${totalBlocks} mermaid blocks across ${files.length} files — clean.`,
    );
  }
  process.exit(0);
}

console.error(
  `check-diagrams: ${problems.length} problem(s) across ${totalBlocks} blocks in ${files.length} files.\n`,
);
for (const p of problems) {
  console.error(`${p.file}:${p.lineNo}  ${p.rule}`);
  console.error(`    ${p.text}`);
  console.error(`    → ${p.message}\n`);
}
process.exit(1);
