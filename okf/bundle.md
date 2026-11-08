---
type: bundle
title: ORIZ.IN
tags: [okf, bundle, oriz, astro]
timestamp: 2026-11-08
---

# ORIZ.IN — knowledge bundle

An Open Knowledge Format bundle for the ORIZ.IN static knowledge and tools site.

- **Runtime**: Astro 7 static output, React islands, TypeScript strict.
- **Content**: Markdown collections under `src/content/library`, 128+ articles and guides.
- **Tools**: 53 browser-local React tools; nothing is uploaded.
- **Ads**: Google AdSense, gated behind `PUBLIC_ADSENSE_ENABLED` and a validated client id.
- **Nav**: two-axis model — content type in the header, subject in a persistent rail.

## Start here

- [Index](index.md)

## Invariants

1. Frontmatter schema is `.strict()`; unknown keys fail the build.
2. `pubDate` in the future 500s the page.
3. A series must be registered in `src/data/taxonomy.ts` or the page 500s.
4. Article URL is `/<domain>/<category>/<id>/` — no series segment.
5. Mermaid errors are silent; both diagram checks must pass.
