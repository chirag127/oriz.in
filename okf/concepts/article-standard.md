---
type: concept
title: Article standard
tags: [content, writing, quality, schema, mermaid]
timestamp: 2026-11-08
---

# Article standard

The articles are the substance of ORIZ.IN. A thin article is a defect, not a
placeholder. This note records the standard every article must meet and the
mechanics that make articles render correctly.

## Depth and level

- **1,800–3,000 words of prose**, excluding code, diagrams and tables.
- **Written for an advanced reader.** Assume the reader already knows what a
  database, index, cache, replica or TLS handshake is. Start where the
  introductory material ends and go to mechanisms, tradeoffs, arithmetic and
  failure modes.
- **Complete coverage.** Where a topic has competing approaches, cover each and
  close with a decision table saying when each applies.
- Direct technical register. No marketing language, no filler openings.

## Required elements

| Element | Minimum | Notes |
| --- | --- | --- |
| Mermaid diagrams | 5 | Mix `flowchart`, `sequenceDiagram`, `stateDiagram-v2`, `erDiagram`, `mindmap` |
| Tables | 4 | Comparison or decision tables, never decorative |
| KaTeX formulas | 2 | Block math using `$$ … $$` |
| Code fences | As needed | Always language-tagged |
| `## Summary` | Required | 6–8 numbered takeaways, final section |

A diagram that restates two sentences should be a table. A table of definitions
belongs in prose.

## Schema mechanics

The frontmatter schema in `src/content.config.ts` is **`.strict()`** — an unknown
key fails the build. Two rules cause most failures:

1. **`pubDate` must not be in the future.** The loader throws
   *"has a future publication date"* and the page returns 500.
2. **The series directory must exist in `src/data/taxonomy.ts`** for that
   category, or the page returns 500 with *"references unknown series"*.

## URL derivation

An article URL is `/<domain>/<category>/<id>/`, where `id` is the filename with
its `NN-` sequence prefix stripped. **The series segment is not part of the URL.**
Hand-building the URL with the series included produces a 404. Use
`articleUrl()` from `src/lib/content.ts`.

## Diagrams fail silently

This is the most important operational fact about article rendering. A Mermaid
syntax error **does not fail the build**. `src/lib/rehype-content.mjs` emits the
figure with a source-code fallback, and the client renderer swaps in
"This diagram could not be rendered in your browser". A broken diagram therefore
ships to production unnoticed.

```bash
node scripts/check-diagrams.mjs       # static lint
node scripts/check-diagrams-live.mjs  # browser sweep, asserts every figure has an <svg>
```

The static linter is deliberately narrow. `:` and `<br/>` are legal inside quoted
labels and in `Note`/message text; flagging them produces noise that trains people
to ignore the output.

### Known parser hazards

| Hazard | Breaks because | Fix |
| --- | --- | --- |
| `A->>B: BEGIN; UPDATE` | `;` is a statement separator | Use a comma or `then` |
| `A[text (note)]` | bare `(` opens a shape token | Quote: `A["text (note)"]` |
| Label ending in `end` | parsed as a block terminator | Quote it or reword |
| Odd number of `"` | unterminated label breaks the diagram | Balance the quotes |

`[( ... )]` is the valid cylinder/database shape and is not a label.

## Related

- [Diagram rendering](diagram-rendering.md)
- [Navigation shell](navigation-shell.md)
