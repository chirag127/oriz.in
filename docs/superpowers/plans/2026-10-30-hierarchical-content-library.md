# Hierarchical Content Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat ORIZ.IN article/category model with a validated domain → category → series → article library, import the 110-article `arac` finance library, and add persistent left/right navigation with complete-guide category pages.

**Architecture:** Astro remains static-first. A new `taxonomy.ts` registry defines 15 domains, 36 live categories, and series. Article files move under `src/content/library/<domain>/<category>/<series>/<NN>-<slug>.md`; category guides live under `src/content/guides/<domain>/<category>.md`. The folder path is the taxonomy source of truth, while `generateId` keeps article IDs equal to their stable slugs. New dynamic routes render domains, category guides, and articles; legacy URLs become one-hop redirects.

**Tech Stack:** Astro 7 static output, TypeScript strict, React 19 islands, custom CSS design system, Vitest, Puppeteer Edge QA, Node 24.

**Spec:** `docs/superpowers/specs/2026-10-30-hierarchical-content-library-design.md`

## Global Constraints

- Node.js 22.23.4+; repository currently runs Node 24.
- Astro 7 static output; no server runtime, database, account system, or dynamic API.
- Do not commit, push, deploy, or change DNS without explicit owner authorization. The owner has not authorized commits in this session.
- Never put credentials, private keys, passphrases, or personal visitor data in tracked files.
- Use Microsoft Edge only for browser automation, never Chrome.
- Keep the existing warm cream/orange/charcoal design system, Times New Roman typography, and tabular numerals.
- Do not fabricate metrics, reviews, legal status, or technical approval.
- Preserve existing tool behavior and URLs unless this plan explicitly changes them.
- All content imports must be reproducible from `chirag127/arac` at the recorded source path; no runtime dependency on that repository.

---

### Task 1: Taxonomy registry and pure helpers

**Files:**
- Create: `src/data/taxonomy.ts`
- Create: `tests/taxonomy.test.ts`

**Interfaces:**
- Produces: `SHELVES`, `DOMAINS`, `CATEGORIES`, `SERIES`, `DOMAIN_BY_SLUG`, `CATEGORY_BY_SLUG`, `SERIES_BY_KEY`
- Produces: `getDomain`, `getCategory`, `getCategoriesForDomain`, `getSeriesForCategory`, `getCategoryPath`, `getDomainPath`, `getGuidePath`
- Produces types: `ShelfId`, `DomainStatus`, `TaxonomyDomain`, `TaxonomyCategory`, `TaxonomySeries`

- [ ] **Step 1: Write failing taxonomy tests**

```ts
import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  DOMAINS,
  SERIES,
  getCategory,
  getCategoryPath,
  getCategoriesForDomain,
  getSeriesForCategory,
} from '../src/data/taxonomy';

describe('taxonomy', () => {
  it('defines 15 domains with 11 live at launch', () => {
    expect(DOMAINS).toHaveLength(15);
    expect(DOMAINS.filter((domain) => domain.status === 'live')).toHaveLength(11);
  });

  it('defines 36 live categories', () => {
    expect(CATEGORIES.filter((category) => category.live)).toHaveLength(36);
  });

  it('gives every category at least one series', () => {
    for (const category of CATEGORIES) {
      expect(getSeriesForCategory(category.slug).length).toBeGreaterThan(0);
    }
  });

  it('resolves category paths from the domain', () => {
    expect(getCategory('gold')?.domain).toBe('money-finance');
    expect(getCategoryPath('gold')).toBe('/money-finance/gold/');
    expect(getCategoryPath('missing')).toBeUndefined();
  });

  it('resolves categories by domain without duplicates', () => {
    const categories = getCategoriesForDomain('technology');
    expect(categories.map((category) => category.slug)).toContain('backend-apis');
    expect(new Set(categories.map((category) => category.slug)).size).toBe(categories.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/taxonomy.test.ts`
Expected: FAIL because `src/data/taxonomy.ts` does not exist.

- [ ] **Step 3: Implement taxonomy data and helpers**

Create `src/data/taxonomy.ts` using the exact shelf, domain, category, and series tables in spec sections 4.1–4.3. Use these types and helper signatures:

```ts
export type ShelfId = 'money-work' | 'technology-ai' | 'life-learning' | 'world-ideas';
export type DomainStatus = 'live' | 'planned';

export interface TaxonomyShelf {
  id: ShelfId;
  title: string;
  description: string;
  order: number;
}

export interface TaxonomyDomain {
  slug: string;
  title: string;
  description: string;
  shelf: ShelfId;
  status: DomainStatus;
  icon: string;
  order: number;
  featuredCategories: string[];
}

export interface TaxonomyCategory {
  slug: string;
  domain: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  live: boolean;
}

export interface TaxonomySeries {
  slug: string;
  category: string;
  title: string;
  description: string;
  order: number;
}
```

Populate all 15 domains, 36 categories, and 36 series from the spec. Add:

```ts
export const DOMAIN_BY_SLUG = new Map(DOMAINS.map((domain) => [domain.slug, domain]));
export const CATEGORY_BY_SLUG = new Map(CATEGORIES.map((category) => [category.slug, category]));
export const SERIES_BY_KEY = new Map(SERIES.map((series) => [`${series.category}/${series.slug}`, series]));

export function getDomain(slug: string): TaxonomyDomain | undefined {
  return DOMAIN_BY_SLUG.get(slug);
}

export function getCategory(slug: string): TaxonomyCategory | undefined {
  return CATEGORY_BY_SLUG.get(slug);
}

export function getCategoriesForDomain(domain: string): TaxonomyCategory[] {
  return CATEGORIES.filter((category) => category.domain === domain && category.live)
    .sort((a, b) => a.order - b.order);
}

export function getSeriesForCategory(category: string): TaxonomySeries[] {
  return SERIES.filter((series) => series.category === category)
    .sort((a, b) => a.order - b.order);
}

export function getDomainPath(domain: string): string {
  return `/${domain}/`;
}

export function getCategoryPath(category: string): string | undefined {
  const entry = getCategory(category);
  return entry ? `/${entry.domain}/${entry.slug}/` : undefined;
}

export function getGuidePath(category: string): string | undefined {
  const entry = getCategory(category);
  return entry ? `/${entry.domain}/${entry.slug}/` : undefined;
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run tests/taxonomy.test.ts`
Expected: PASS (5 tests).

---

### Task 2: Library path parsing, content schema, and guides collection

**Files:**
- Create: `src/lib/library.ts`
- Create: `tests/library-paths.test.ts`
- Modify: `src/content.config.ts`
- Modify: `src/lib/content.ts`

**Interfaces:**
- Produces: `parseLibraryPath(filePath): { domain, category, series, order, slug } | null`
- Produces: `articleLocation(entry): ArticleLocation`
- Produces: `ArticleLocation { domain, category, series, order, slug }`
- Produces: `GuideLocation { domain, category }`
- Changes: article loader base to `./src/content/library`; `generateId` strips numeric prefix and `.md`
- Adds: `guides` collection with schema from spec section 5.4

- [ ] **Step 1: Write failing path tests**

```ts
import { describe, expect, it } from 'vitest';
import { parseLibraryPath, stripArticlePrefix } from '../src/lib/library';

describe('library paths', () => {
  it('parses a nested article path', () => {
    expect(parseLibraryPath(
      'C:/repo/src/content/library/money-finance/gold/gold-in-india/02-sgb-2-5-interest.md',
    )).toEqual({
      domain: 'money-finance',
      category: 'gold',
      series: 'gold-in-india',
      order: 2,
      slug: 'sgb-2-5-interest',
    });
  });

  it('rejects a flat path', () => {
    expect(parseLibraryPath('src/content/articles/foo.md')).toBeNull();
  });

  it('strips numeric prefixes from slugs', () => {
    expect(stripArticlePrefix('01-emergency-fund-sizing')).toBe('emergency-fund-sizing');
    expect(stripArticlePrefix('sgb-2-5-interest')).toBe('sgb-2-5-interest');
  });
});
```

- [ ] **Step 2: Implement `src/lib/library.ts`**

Normalise backslashes to `/`, require `/content/library/`, split the trailing four path segments, require a two-digit prefix, and reject malformed paths. Use `stripArticlePrefix` in `generateId`.

- [ ] **Step 3: Update `src/content.config.ts`**

```ts
const articles = defineCollection({
  loader: glob({
    base: './src/content/library',
    pattern: '**/*.md',
    generateId: ({ entry }) =>
      stripArticlePrefix(entry.split('/').pop()?.replace(/\.md$/u, '') ?? ''),
  }),
  schema: articleSchema,
});

const guides = defineCollection({
  loader: glob({
    base: './src/content/guides',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.split('/').pop()?.replace(/\.md$/u, '') ?? '',
  }),
  schema: guideSchema,
});
```

Update the article schema:

- remove `categories` from frontmatter;
- keep tag slug pattern validation but remove `TAG_SLUGS` membership checking;
- add `legal` and `source`;
- keep image refinements and date refinement.

Add the guide schema exactly as listed in spec section 5.4.

- [ ] **Step 4: Update `src/lib/content.ts` to derive locations**

Add `locations` and `guides` to `ContentIndex`:

```ts
export interface ContentIndex {
  articles: Article[];
  articlesById: Map<string, Article>;
  locations: Map<string, ArticleLocation>;
  guides: Map<string, GuideEntry>;
  categories: CategorySummary[];
  categoriesBySlug: Map<string, CategorySummary>;
  seriesArticles: Map<string, Article[]>;
}
```

For each article, call `parseLibraryPath(entry.filePath)`; throw a build error when it returns null. Validate the domain/category/series against taxonomy. Build `seriesArticles` keyed by `${category}/${series}` and sort by `order`.

- [ ] **Step 5: Run tests and type check**

Run: `npx vitest run tests/library-paths.test.ts tests/taxonomy.test.ts`
Run: `npm run check`
Expected: PASS and 0 errors.

---

### Task 3: Migrate existing articles and redirects

**Files:**
- Create: `scripts/migrate-existing-articles.mjs`
- Create: `src/data/legacy-redirects.ts`
- Move: 18 non-merged files from `src/content/articles/` into the library tree
- Modify: frontmatter of moved articles
- Modify: `src/pages/articles/[slug].astro`
- Modify: `src/pages/categories/[slug].astro`, `src/pages/categories/index.astro`

**Interfaces:**
- Produces: `LEGACY_ARTICLE_REDIRECTS: Record<string, string>`
- Produces: `LEGACY_CATEGORY_REDIRECTS: Record<string, string>`
- Produces: redirect pages at `/articles/<old-slug>/` and `/categories/<old-slug>/`

- [ ] **Step 1: Create the redirect maps**

Use the article destinations in spec section 7.3. The three merged articles map to the imported canonical slugs:

```ts
export const LEGACY_ARTICLE_REDIRECTS = {
  'loan-emi-guide': 'home-loan-emi-breakup-principal-interest',
  'emergency-fund-india': 'emergency-fund-sizing',
  'home-loan-prepayment-india': 'prepay-home-loan-or-invest-the-surplus',
} as const;
```

Add category redirects from spec section 6:

```ts
export const LEGACY_CATEGORY_REDIRECTS = {
  'artificial-intelligence': '/ai-data/ai-engineering/',
  'programming-languages': '/technology/programming/',
  'backend-infrastructure': '/technology/backend-apis/',
  'web-development': '/technology/web-development/',
  'developer-utilities': '/technology/developer-craft/',
  'data-formats': '/technology/data-storage/',
  networking: '/technology/networking/',
  'git-version-control': '/technology/developer-craft/',
  'databases-sql': '/technology/data-storage/',
  'security-privacy': '/technology/backend-apis/',
  'computer-science': '/technology/computer-science/',
  diagrams: '/technology/developer-craft/',
  'text-productivity': '/technology/developer-craft/',
  reference: '/library/',
  'indian-finance': '/money-finance/personal-finance/',
  'personal-finance': '/money-finance/personal-finance/',
  mathematics: '/money-finance/investing/',
  'color-design': '/design-accessibility/color-accessibility/',
  accessibility: '/design-accessibility/color-accessibility/',
} as const;
```

- [ ] **Step 2: Move the 18 non-merged ORIZ articles**

Use the mapping in spec section 7.3 and the series assignment in spec section 4.3. Add a two-digit prefix based on the intended series order. Remove the `categories` frontmatter field. Keep all other fields and article bodies unchanged.

- [ ] **Step 3: Generate redirect pages**

Replace `src/pages/articles/[slug].astro` with a route that only generates legacy redirect pages:

```astro
---
import { LEGACY_ARTICLE_REDIRECTS } from '../../data/legacy-redirects';
import { articleUrlForSlug } from '../../lib/content';

export function getStaticPaths() {
  return Object.entries(LEGACY_ARTICLE_REDIRECTS).map(([slug, target]) => ({
    params: { slug },
    props: { target: articleUrlForSlug(target) },
  }));
}

const { target } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content={`0;url=${target}`} />
    <link rel="canonical" href={`https://oriz.in${target}`} />
    <meta name="robots" content="noindex" />
    <title>Redirecting…</title>
  </head>
  <body><a href={target}>Continue to the article</a></body>
</html>
```

Replace the category pages with redirect-only routes using `LEGACY_CATEGORY_REDIRECTS`; `/categories/` redirects to `/library/`.

- [ ] **Step 4: Add `_redirects` generation**

In `scripts/postbuild.mjs`, write 301 lines for every legacy article and category mapping:

```text
/articles/<legacy>/  /<domain>/<category>/<canonical>/  301
/categories/<legacy>/  <target>  301
/categories/  /library/  301
```

- [ ] **Step 5: Verify**

Run: `npm run check`
Run: `npm run build`
Expected: build succeeds; redirect pages exist; no article is still under `src/content/articles/`.

---

### Task 4: Category guides

**Files:**
- Create: `src/content/guides/<domain>/<category>.md` for all 36 live categories
- Create: `scripts/generate-category-guides.mjs` for the 34 non-priority guides
- Create: `src/lib/guides.ts`
- Create: `tests/guides.test.ts`

**Interfaces:**
- Produces: `GuideEntry = CollectionEntry<'guides'>`
- Produces: `getGuide(categorySlug): Promise<GuideEntry | undefined>`
- Produces: `guideUrl(categorySlug): string`

- [ ] **Step 1: Write guide tests**

Test that every live category has a guide and every guide maps to a live category, `startHere` slugs belong to the category, and all guide tools exist. Use the taxonomy and content index after the migration.

- [ ] **Step 2: Write full Gold and Personal Finance guides**

Create:

- `src/content/guides/money-finance/gold.md`
- `src/content/guides/money-finance/personal-finance.md`

Both must use the frontmatter from spec section 5.4 and have a long body (at least 2,000 words each) with key questions, comparison tables, FAQs, and links to their articles. The Gold guide must cover physical gold, jewellery, digital gold, ETFs, SGBs, the Gold Monetisation Scheme, gold loans, allocation, taxation, liquidity, and common mistakes. The Personal Finance guide must cover budgeting, emergency funds, inflation, sinking funds, monthly reviews, and the reading order through the category.

- [ ] **Step 3: Generate concise guides for the remaining 34 categories**

`scripts/generate-category-guides.mjs` writes each file with:

- category title and description;
- `keyQuestions` based on the category;
- `startHere` populated from the first three articles after import;
- `tools` populated from the remapped tools;
- a body of 3–5 specific paragraphs plus a “What this guide covers” list and a “How to read this category” list. It must not emit lorem ipsum, generic marketing copy, or invented statistics.

- [ ] **Step 4: Validate**

Run the guide tests and `npm run check`.

---

### Task 5: Routes, layout, and navigation

**Files:**
- Create: `src/pages/library/index.astro`
- Create: `src/pages/[domain]/index.astro`
- Create: `src/pages/[domain]/[category]/index.astro`
- Create: `src/pages/[domain]/[category]/[slug].astro`
- Create: `src/components/LibrarySidebar.astro`
- Create: `src/components/DomainCard.astro`
- Create: `src/components/GuideCard.astro`
- Create: `src/components/CategoryGuideHeader.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/ArticleCard.astro`
- Modify: `src/layouts/ArticleLayout.astro`
- Modify: `src/layouts/BaseLayout.astro` only if a new shell prop is needed
- Modify: `src/styles/global.css`

**Interfaces:**
- `LibrarySidebar` props: `domain?: string; category?: string; series?: string; article?: string`
- `articleUrl(entry)` uses `locations`
- `getCategoryArticles(category)` and `getSeriesArticles(category, series)` helpers
- `getArticleGuide(entry)` returns category guide

- [ ] **Step 1: Implement routes**

Use `getStaticPaths` from `DOMAINS`, `CATEGORIES`, and `loadContentIndex()`. Category pages load the category guide and pass its body through `render(guide)`. Article pages load the article and its guide/location. Planned domains have no routes.

- [ ] **Step 2: Update `articleUrl` and breadcrumbs**

`articleUrl` returns `/${location.domain}/${location.category}/${entry.id}/`. `ArticleLayout` uses domain/category/series breadcrumbs and links to the category guide.

- [ ] **Step 3: Build the three-column shell**

Add `LibrarySidebar` as the left column. Keep the existing article aside as the right column. The category guide uses the same left sidebar and a guide TOC on the right. On mobile, the sidebar becomes a `<details>` drawer and the right rail moves after the content.

- [ ] **Step 4: Add the mega menu**

Replace the flat “Categories” link in `Header.astro` with a Library disclosure button. Render four shelf columns with domains and featured categories. Implement `aria-expanded`, Escape-to-close, focus return, outside-click close, and mobile accordion behavior.

- [ ] **Step 5: Update cards and series navigation**

`ArticleCard` reads domain/category from `locations`. Add `GuideCard` and `DomainCard`. On article pages, show series position and previous/next within the series.

- [ ] **Step 6: Verify**

Run: `npm run check`
Run: `npm run build`
Expected: all domain/category/article routes build; no link to `/categories/<slug>/` remains in generated HTML except redirect pages.

---

### Task 6: Import the 110 `arac` articles

**Files:**
- Create: `scripts/arac-map.mjs`
- Create: `scripts/import-arac.mjs`
- Import: 110 files into `src/content/library/`
- Create: `docs/superpowers/reports/arac-import-report.md` (generated report; no secrets)

**Interfaces:**
- Consumes: `taxonomy.ts`, `parseLibraryPath`, article schema
- Produces: one article file per `arac` post, frontmatter with source, legal, disclaimer, review status
- Produces: import report with source, destination, and status for every file

- [ ] **Step 1: Create the mapping file**

Use the track defaults and explicit exceptions in spec section 7.1. Every mapping must include `domain`, `category`, `series`. Add `order` only when the source date order is wrong for the reading sequence; otherwise compute order from ascending `pubDate` within the target series.

- [ ] **Step 2: Implement the import script**

The script must:

1. Read Markdown files from the source directory passed via `--source` (default `.scratch/arac/src/content/blog`).
2. Parse frontmatter with the `yaml` package.
3. Resolve the mapping; fail loudly on an unmapped file.
4. Normalise `pubDate` values after `2026-10-30` to `2026-10-30`.
5. Add `source`, `disclaimer`, `legal`, and `reviewStatus: 'editorial'`.
6. Remove unsupported fields (`track`, `featured` if not in ORIZ schema) or map them.
7. Rewrite `/blog/related-party-transaction-detection/` to `/money-finance/stocks/related-party-transaction-detection/`.
8. Write the file with a two-digit order prefix.
9. Write the import report.

- [ ] **Step 3: Run the import**

Run: `node scripts/import-arac.mjs --source .scratch/arac/src/content/blog`
Expected: 110 files written; 0 unmapped; report generated.

- [ ] **Step 4: Merge the three overlapping topics**

For each pair in spec section 7.2, append the ORIZ-specific sections to the imported article body:

- emergency fund: ORIZ calculator walkthrough, India instrument table, and calculator link;
- home loan EMI: ORIZ formula, amortisation table, and calculator link;
- prepayment: ORIZ worked ₹50 lakh example and calculator link.

Keep the imported title/description and canonical slug. Set the ORIZ hero image on the merged article. Add a line under the title: “Adapted from Rupee Realism and the ORIZ.IN finance library.”

- [ ] **Step 5: Verify counts**

Run a script that reports article count by category and series. Expected: 128 total articles, 0 orphaned files, 0 future dates, 0 duplicate slugs.

---

### Task 7: Glossary, tools, and learning paths

**Files:**
- Modify: `src/data/glossary.ts`
- Modify: `src/data/tools.ts`
- Modify: `src/data/tags.ts`
- Modify: `src/data/learning-paths.ts`
- Modify: `src/pages/tools/[slug].astro`
- Modify: `src/components/ToolCard.astro`
- Modify: `src/pages/tools/index.astro`
- Modify: `src/pages/search-index.json.ts`
- Modify: `src/pages/data/tools.json.ts`

**Interfaces:**
- `getCategory` moves to `src/data/taxonomy.ts` (or a compatibility re-export)
- Tool category values must be live category slugs
- Tool docs references must use canonical article slugs
- Learning path steps use canonical slugs

- [ ] **Step 1: Merge the glossary**

Add the 64 `arac` terms to `src/data/glossary.ts`. Deduplicate by lowercase term and slug. Existing ORIZ definitions win; retain the source note for imported terms. Add “Money & Finance” links to terms that do not have a more specific ORIZ link.

- [ ] **Step 2: Remap all 53 tools**

Assign each tool a live category slug. Examples:

```ts
// finance
'loan-emi': 'loans-credit',
'emergency-fund-calculator': 'personal-finance',
'loan-prepayment-calculator': 'loans-credit',
'compound-interest': 'investing',
'sip-calculator': 'investing',
// technology
'jwt-decoder': 'backend-apis',
'json-formatter': 'data-storage',
'mermaid-editor': 'developer-craft',
'cron-explainer': 'developer-craft',
'subnet-calculator': 'networking',
// design
'contrast-checker': 'color-accessibility',
'color-converter': 'color-accessibility',
```

Update `docs` values for merged articles:

```ts
'emergency-fund-calculator': 'emergency-fund-sizing',
'loan-emi': 'home-loan-emi-breakup-principal-interest',
'loan-prepayment-calculator': 'prepay-home-loan-or-invest-the-surplus',
```

- [ ] **Step 3: Update tool pages and directory**

All category links point to `getCategoryPath(category)`. Tool pages show domain > category. The tool directory groups by live category and links to the category guide.

- [ ] **Step 4: Update learning paths**

Replace merged slugs in steps and article `learningPaths` frontmatter:

- `emergency-fund-india` → `emergency-fund-sizing`
- `loan-emi-guide` → `home-loan-emi-breakup-principal-interest`
- `home-loan-prepayment-india` → `prepay-home-loan-or-invest-the-surplus`

Keep path titles and notes unless a title references the old article name.

- [ ] **Step 5: Verify**

Run: `npm test`
Run: `npm run check`
Run: `npm run build`
Expected: no unknown category/tool/docs errors.

---

### Task 8: Search, RSS, JSON exports, and SEO

**Files:**
- Modify: `src/pages/search-index.json.ts`
- Modify: `src/pages/rss.xml.ts`
- Modify: `src/pages/data/articles.json.ts`
- Modify: `src/pages/data/categories.json.ts`
- Create: `src/pages/data/taxonomy.json.ts`
- Create: `src/pages/data/guides.json.ts`
- Modify: `src/pages/data/tools.json.ts`
- Modify: `src/lib/seo.ts`
- Modify: `src/pages/search.astro` and `src/scripts/search.ts` only for domain/category facets

**Interfaces:**
- Search record adds `domain`, `category`, `series`
- `taxonomy.json` returns shelves, domains, categories, series
- `guides.json` returns guide metadata and article counts
- RSS categories use domain/category labels
- Article JSON-LD `articleSection` uses domain/category names

- [ ] **Step 1: Update search records**

Every article record uses `articleUrl(entry)`, domain/category names, and series. Add guide records and domain records. Keep the existing type union extended with `'guide' | 'domain'`.

- [ ] **Step 2: Update exports**

`articles.json` adds `domain`, `category`, `series`, `legal`, and `source`. `categories.json` returns the 36 categories with domain, series, article counts, tool counts, and guide URL. Add `taxonomy.json` and `guides.json` with `withVersion`.

- [ ] **Step 3: Update RSS and JSON-LD**

RSS item categories become `[domainName, categoryName]`. Article JSON-LD uses `articleSection: [domainName, categoryName]`.

- [ ] **Step 4: Verify**

Run: `npm run build`
Inspect `dist/data/taxonomy.json`, `dist/data/guides.json`, `dist/search-index.json`, and `dist/rss.xml`.

---

### Task 9: Images and visual integration

**Files:**
- Create: `public/images/library/domains/*.jpg`
- Create: `public/images/library/categories/*.jpg`
- Modify: guide frontmatter with image paths
- Modify: category/domain components to use image fallbacks

- [ ] **Step 1: Generate domain images**

Generate one 1200×630 JPEG per live domain (11) in the cream/orange/charcoal editorial system. No text, no fake charts, no stock photography.

- [ ] **Step 2: Generate priority category images**

Generate category images for Gold, Personal Finance, Loans & Credit, Tax, Investing, Health Insurance, Backend & APIs, and AI Engineering. Reuse existing ORIZ hero images where a category already has a suitable one.

- [ ] **Step 3: Wire fallbacks**

Category guides use their image. Imported articles without an image use the category image as OG fallback. All images have descriptive alt text and explicit dimensions.

---

### Task 10: Build validation, redirects, and QA scripts

**Files:**
- Modify: `src/lib/content.ts`
- Modify: `scripts/postbuild.mjs`
- Modify: `scripts/browser-check.mjs`
- Modify: `scripts/check-csp.mjs` only if route assumptions change
- Modify: `tests/*.test.ts` as needed

- [ ] **Step 1: Extend content validation**

Validate:

- path structure and taxonomy membership;
- guide existence and guide references;
- article order uniqueness/contiguity per series;
- no future dates;
- legal/source/disclaimer on imported finance/legal articles;
- no duplicate slugs/titles;
- tag slug pattern and max 8 tags;
- related/prerequisite/tool docs/learning path references;
- redirect maps point to existing canonical routes.

- [ ] **Step 2: Update postbuild**

- Read articles from `src/content/library` recursively.
- Check routes include domains, categories, guides, and articles.
- Check every live category has a generated category page and guide.
- Exclude redirect pages and planned domains from sitemap checks.
- Generate `_redirects` for all legacy URLs.
- Keep build report fields: domains, categories, articles, tools, APIs, sitemap URLs, files, size.
- Update failure thresholds only if the larger library genuinely requires it; report the reason.

- [ ] **Step 3: Update browser QA**

Generate routes from taxonomy and content JSON: all live domains, all category guides, all article pages, library map, learning paths, tools, APIs, and core pages. Keep axe, mobile overflow, metadata, alt, and interaction checks. Increase timeout for the larger library; do not skip accessibility checks.

- [ ] **Step 4: Run focused checks**

Run: `npm run check`
Run: `npm test`
Run: `npm run build`
Expected: 0 errors.

---

### Task 11: Homepage, header, footer, and counts

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/consts.ts`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/author/chirag-singhal.astro`
- Modify: `src/pages/tools/index.astro`
- Modify: `README.md`

- [ ] **Step 1: Update navigation constants**

Add `Library` to primary navigation; keep Articles, Tools, Learn, Developers, APIs, Diagrams, About. Footer “Browse categories” becomes “Browse the library” pointing to `/library/`.

- [ ] **Step 2: Update homepage**

Show shelves/domains and featured category guides instead of the old flat categories. Keep dynamic counts from `TOOLS`, articles, domains, and categories. Link to `/library/` and priority guides.

- [ ] **Step 3: Update counts and copy**

Use dynamic counts wherever possible. Update README to describe the hierarchy, import provenance, redirects, and the new verification commands once the final build is measured.

---

### Task 12: Full verification and release report

**Files:**
- No new source files; verification artifacts in `.scratch/`
- Modify: `README.md` evidence section with final measured results

- [ ] **Step 1: Run full checks**

```bash
npm run check
npm test
npm run build
node scripts/run-browser-qa.mjs
npm run test:csp
npm run test:external
```

- [ ] **Step 2: Inspect the generated site**

Check:

- `/library/`
- every live domain
- Gold and Personal Finance guides
- a representative article from Money, Technology, and AI
- mobile layouts at 390px and 768px
- keyboard navigation of the mega menu and left tree
- redirect behavior for the three merged ORIZ articles and at least three old category URLs

- [ ] **Step 3: Fix all regressions**

Do not weaken axe, link, metadata, CSP, or alt checks. Fix root causes.

- [ ] **Step 4: Report**

Report exact counts: domains, live domains, categories, guides, articles, tools, glossary terms, redirects, build size, axe violations, external links, and any remaining editorial risks. Do not claim deployment, indexing, or AdSense approval.
