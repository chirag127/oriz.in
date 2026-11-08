---
type: index
title: ORIZ.IN knowledge bundle
tags: [okf, index, oriz]
timestamp: 2026-11-08
---

# ORIZ.IN knowledge bundle

Operational knowledge for the ORIZ.IN static site: how content is written,
rendered, verified, and laid out.

## Concepts

| Note | Covers |
| --- | --- |
| [article-standard](concepts/article-standard.md) | Depth, required elements, schema rules, URL derivation, diagram hazards |
| [diagram-rendering](concepts/diagram-rendering.md) | Markdown → Mermaid/KaTeX/table pipeline, silent failure mode, legibility rules |
| [navigation-shell](concepts/navigation-shell.md) | Two-axis navigation, three-column frame, collapse order, accessibility |

## The rule that matters most

**A Mermaid syntax error does not fail the build.** The page returns 200 and the
reader sees "This diagram could not be rendered". Never claim an article is
complete without running both checks:

```bash
node scripts/check-diagrams.mjs
node scripts/check-diagrams-live.mjs
```

## Where things live

| Path | Meaning |
| --- | --- |
| `src/content/library/<domain>/<category>/<series>/NN-<slug>.md` | Articles |
| `src/data/taxonomy.ts` | Shelves, domains, categories, series |
| `src/content.config.ts` | Strict frontmatter schema |
| `src/lib/rehype-content.mjs` | Mermaid figures, table wrappers |
| `src/scripts/enhance-article.ts` | Client-side Mermaid rendering |
| `src/components/PageShell.astro` | Three-column frame |
| `scripts/check-diagrams*.mjs` | Diagram verification |
