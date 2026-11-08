# ORIZ.IN Hierarchical Content Library — Design

- **Date:** 2026-10-30
- **Status:** Implemented (30 October 2026); see README for current verification evidence
- **Owner:** Chirag Singhal
- **Scope:** Content model, taxonomy, routes, navigation, and migration for the ORIZ.IN article library

## 1. Context

ORIZ.IN currently stores 21 articles in one flat collection, exposes 19 flat category
pages, and gives article pages a single right sidebar. The site has no persistent
library tree, no ordered series, and no category-level complete guide.

The owner also maintains `chirag127/arac`, which contains 110 India-first finance
articles across 18 tracks. The new library must absorb that content, merge duplicate
topics, and present the result as a large, navigable, India-first publication rather
than a flat blog.

This design follows four constraints:

1. Articles and article series, not books.
2. More than 10 broad domains, grouped so the top navigation remains usable.
3. Complete-guide pages for topics such as Gold and Personal Finance.
4. A repository layout that mirrors the navigation, with predictable URLs.

## 2. Goals

- Replace the flat category model with a validated domain → category → series → article hierarchy.
- Give every article one canonical domain, category, and series.
- Make every category page a complete guide, with a long overview, key questions, article index, tools, and FAQ.
- Provide persistent left navigation, a centre reading column, and a contextual right sidebar.
- Import all unique `arac` articles, merge overlapping finance topics, and normalise future dates.
- Preserve existing ORIZ URLs through redirects.
- Keep the build, search, RSS, sitemap, JSON exports, learning paths, and tools consistent with the taxonomy.
- Keep the library usable on mobile and with keyboard-only navigation.

## 3. Non-goals

- No new backend, database, account system, or dynamic API.
- No separate “book” or EPUB product.
- No 110 new article illustrations; images are generated at domain and priority-category level.
- No claim of technical review, Google indexing, or AdSense approval.
- No deletion of existing articles except where a duplicate is merged into a canonical article.
- No speculation about future domains beyond the taxonomy and library map.

## 4. Information architecture

### 4.1 Shelves and domains

Fifteen domains are defined. Eleven are live at launch; four remain in the library
map until they have a guide and published articles.

| Shelf | Domain | Slug | Launch status |
| --- | --- | --- | --- |
| Money & Work | Money & Finance | `money-finance` | Live |
| Money & Work | Work & Career | `work-career` | Live |
| Money & Work | Business & Entrepreneurship | `business` | Live |
| Technology & AI | Technology | `technology` | Live |
| Technology & AI | AI & Data | `ai-data` | Live |
| Technology & AI | Design & Accessibility | `design-accessibility` | Live |
| Life & Learning | Health & Insurance | `health-insurance` | Live |
| Life & Learning | Education & Learning | `education-learning` | Live |
| Life & Learning | Home & Family | `home-family` | Live |
| Life & Learning | Law, Rights & Fraud | `law-rights-fraud` | Live |
| World & Ideas | Civic & Public Services | `civic-public-services` | Live |
| World & Ideas | Productivity & Organisation | `productivity` | Planned |
| World & Ideas | Science & Environment | `science-environment` | Planned |
| World & Ideas | Travel & Places | `travel-places` | Planned |
| World & Ideas | Food & Nutrition | `food-nutrition` | Planned |

A planned domain is listed on the public `/library/` map with an “in preparation”
label and is excluded from the sitemap and main navigation. It has no indexable
domain page until it becomes live.

### 4.2 Categories

A live category is a complete-guide page and must contain at least one published
article and one category guide file. Categories are not the same as tags; tags are
cross-cutting and do not create canonical pages.

| Domain | Category | Slug | Primary sources |
| --- | --- | --- | --- |
| Money & Finance | Personal Finance | `personal-finance` | `arac` foundations, ORIZ compounding/emergency material |
| Money & Finance | Banking & Savings | `banking` | `arac` banking |
| Money & Finance | Investing & Markets | `investing` | `arac` investing, ORIZ compound interest |
| Money & Finance | Stocks & Company Analysis | `stocks` | `arac` stock-picking |
| Money & Finance | Tax | `tax` | `arac` tax |
| Money & Finance | Retirement & PF | `retirement` | `arac` retirement |
| Money & Finance | Loans & Credit | `loans-credit` | `arac` loans-credit, ORIZ EMI/prepayment (merged) |
| Money & Finance | Gold | `gold` | `arac` gold articles |
| Money & Finance | Real Estate | `real-estate` | `arac` property, RERA, land title, rental yield |
| Money & Finance | Alternative Investments | `alternatives` | `arac` alternative investments |
| Money & Finance | NRI Money | `nri` | `arac` NRI articles |
| Money & Finance | Money Tools & Reference | `money-tools` | `arac` tools, ORIZ calculators |
| Work & Career | Early Career & Transitions | `early-career` | `arac` student/young earner, career break, lifestyle inflation |
| Business & Entrepreneurship | Side Income & Creator Business | `side-income` | `arac` income/side-hustle articles |
| Business & Entrepreneurship | Small Business & Compliance | `small-business` | `arac` freelance tax, GST, e-commerce |
| Health & Insurance | Health Insurance | `health-insurance` | `arac` health insurance |
| Health & Insurance | Life Insurance | `life-insurance` | `arac` term/riders |
| Health & Insurance | Motor Insurance | `motor-insurance` | `arac` motor insurance |
| Education & Learning | Education Financing | `education-financing` | `arac` education loan/corpus |
| Home & Family | Marriage & Money | `marriage-money` | `arac` marriage, joint accounts, spousal gap |
| Home & Family | Family & Dependants | `family-money` | `arac` children, parents, pocket money |
| Home & Family | Women & Money | `women-money` | `arac` women-money track |
| Home & Family | Inheritance & Succession | `inheritance` | `arac` Stridhan, NRI succession, nomination |
| Law, Rights & Fraud | Scams & Fraud | `scams-fraud` | `arac` scams |
| Law, Rights & Fraud | Financial Crime & Grey Areas | `financial-crime` | `arac` legal-grey |
| Technology | Programming Languages | `programming` | ORIZ TypeScript, `arac` not applicable |
| Technology | Backend & APIs | `backend-apis` | ORIZ API design, reliability, HTTP |
| Technology | Web Development | `web-development` | ORIZ static JSON APIs |
| Technology | Data & Storage | `data-storage` | ORIZ SQL, JSON |
| Technology | Networking | `networking` | ORIZ IPv4 |
| Technology | Developer Craft | `developer-craft` | ORIZ Git, Mermaid, diff, cron, Base64 |
| Technology | Computer Science | `computer-science` | ORIZ diff algorithms if not placed in Developer Craft |
| AI & Data | AI Engineering | `ai-engineering` | ORIZ RAG and evaluation |
| AI & Data | Data Engineering | `data-engineering` | ORIZ Python data workflows |
| Design & Accessibility | Color & Accessibility | `color-accessibility` | ORIZ CSS color formats |
| Civic & Public Services | Government Portals & Documents | `government-portals` | `arac` official-portals article |

The exact category assignment of each imported article is maintained in the
migration map described in section 7. Articles with a natural secondary home
receive tags and cross-links, not a second canonical URL.

### 4.3 Series

A series is an ordered run of articles inside one category. It has a slug, title,
description, and order. Articles carry no manual order in frontmatter; order comes
from the numeric filename prefix and is validated at build time.

Initial series:

- Personal Finance: `money-foundations`, `emergency-funds`
- Banking & Savings: `banking-basics`
- Investing & Markets: `mutual-funds`, `portfolio-management`
- Stocks: `reading-companies`
- Tax: `income-tax`, `capital-gains`, `compliance`
- Retirement: `retirement-building`
- Loans & Credit: `home-loans`, `credit-and-borrowing`, `credit-reports`
- Gold: `gold-in-india`
- Real Estate: `property-decisions`
- Alternatives: `alternative-assets`
- NRI: `nri-money`
- Money Tools: `tracking-and-audit`
- Early Career: `first-salary`, `student-money`
- Side Income: `creator-and-service-income`
- Small Business: `business-compliance`
- Health Insurance: `health-cover`
- Life Insurance: `life-cover`
- Motor Insurance: `motor-cover`
- Education Financing: `paying-for-education`
- Marriage & Money: `marriage-and-money`
- Family & Dependants: `family-dependants`
- Women & Money: `women-and-money`
- Inheritance: `inheritance-and-succession`
- Scams & Fraud: `scam-playbooks`
- Financial Crime: `grey-zone-finance`
- Programming: `typescript`
- Backend & APIs: `reliable-apis`
- Web Development: `static-web`
- Data & Storage: `sql-and-data`
- Networking: `ip-addressing`
- Developer Craft: `git-and-history`, `text-and-diagrams`, `scheduling`
- Computer Science: `algorithms`
- AI Engineering: `production-ai`
- Data Engineering: `python-data`
- Color & Accessibility: `color-and-contrast`
- Government Portals: `official-portals`

There is no separate series URL. Series appear as sections on the category guide
and as ordered lists in the left sidebar and article footer.

### 4.4 Category guide priority

Every live category has a guide file. Two tiers are defined:

- **Full guides:** Gold, Personal Finance, Loans & Credit, Tax, Investing,
  Health Insurance, Backend & APIs, AI Engineering. These receive long-form editorial
  treatment in the first release.
- **Concise complete guides:** all remaining live categories. These contain a
  structured overview, key questions, article index, tools, and FAQ, and can be
  expanded later.

The Gold complete guide is the reference implementation for the category-guide
layout. It must cover every gold route, tax point, allocation question, liquidity
trade-off, and link to every gold article in the library.

## 5. Content model

### 5.1 Entities

| Entity | Source of truth | Purpose |
| --- | --- | --- |
| Shelf | `src/data/taxonomy.ts` | Groups domains for navigation |
| Domain | `src/data/taxonomy.ts` | Top-level library area such as Money & Finance |
| Category | `src/data/taxonomy.ts` | Complete-guide page and canonical article grouping |
| Series | `src/data/taxonomy.ts` | Ordered run of articles inside a category |
| Article | `src/content/library/**/*.md` | Individual published post |
| Category guide | `src/content/guides/<domain>/<category>.md` | Long-form complete guide body |
| Tool | `src/data/tools.ts` | Interactive utility mapped to a category |
| Learning path | `src/data/learning-paths.ts` | Cross-category curriculum, independent of the library tree |
| Glossary term | `src/data/glossary.ts` | Cross-domain definition |

### 5.2 Folder layout

```text
src/content/
  library/
    money-finance/
      personal-finance/
        money-foundations/
          01-zero-based-budgeting.md
          02-sinking-funds.md
        emergency-funds/
          01-emergency-fund-sizing.md
      gold/
        gold-in-india/
          01-digital-gold-vs-etf-vs-physical.md
          02-sgb-2-5-interest-and-tax-freedom.md
    technology/
      backend-apis/
        reliable-apis/
          01-http-status-codes.md
          02-secure-api-design.md
          03-backend-reliability-budget.md
  guides/
    money-finance/
      gold.md
      personal-finance.md
    technology/
      backend-apis.md
```

- The article slug is the filename without the numeric prefix and `.md`.
- The folder path determines domain, category, and series.
- The numeric prefix determines order within the series.
- `entry.id` remains the article slug via the glob loader's `generateId`, preserving
  existing references in tools, learning paths, and related articles.
- Category guide slugs are derived from the filename and must match a live category.
- No article may live outside the library tree.

### 5.3 Frontmatter

Existing article fields remain. Add:

```ts
legal: z.enum(['legal', 'grey', 'illegal', 'reference']).optional(),
source: z.object({
  title: z.string().min(2).max(120),
  url: z.url().optional(),
  license: z.string().max(80).optional(),
}).optional(),
```

Rules:

- Imported finance and legal articles require `disclaimer`, `legal`, and `source`.
- Imported articles use `reviewStatus: 'editorial'` unless a later human review changes it.
- Tags are free-form lowercase slugs (max 8), validated by pattern but no longer
  required to exist in a hand-maintained registry. A label map may provide display
  names for common tags.
- Images remain optional. If an article has no image, the category guide's image is
  used as the Open Graph image fallback.
- `type`, `difficulty`, `keyPoints`, `references`, and `toc` keep their current meaning.

### 5.4 Category guide frontmatter

```ts
title: string
description: string
updated: date
heroImage: string
heroImageAlt: string
keyQuestions: { question: string; answer: string }[]  // max 6
startHere: string[]                                   // article slugs
faq: { question: string; answer: string }[]            // max 10
tools: string[]                                        // tool slugs
featuredArticles: string[]                             // article slugs
```

The Markdown body is the complete guide. The category page renders the body, then
the series/article index, tools, and FAQ. `startHere`, `featuredArticles`, and
`tools` are validated against the category.

## 6. URLs and redirects

| Page | URL |
| --- | --- |
| Library map | `/library/` |
| Domain | `/<domain>/` |
| Category complete guide | `/<domain>/<category>/` |
| Article | `/<domain>/<category>/<article-slug>/` |
| All articles archive | `/articles/` |
| Learning path | `/learn/<path>/` |
| Tool | `/tools/<tool>/` |

Examples:

```text
/money-finance/gold/
/money-finance/gold/sgb-2-5-interest-and-tax-freedom/
/technology/backend-apis/secure-api-design/
/ai-data/ai-engineering/rag-retrieval-augmented-generation/
```

Redirects:

- `/articles/<article-slug>/` → `/<domain>/<category>/<article-slug>/`.
- `/categories/` → `/library/`.
- `/categories/<old-category>/` → the mapped domain or category page.
- Redirects are emitted as 301 rules in `_redirects` and as static fallback HTML
  pages for hosts and local previews that do not read `_redirects`.
- Redirect pages are excluded from the sitemap and carry the canonical target.
- No chain or loop is permitted; one hop per legacy URL.

## 7. Content migration

### 7.1 `arac` import

All 110 files from `chirag127/arac/src/content/blog` are imported. The import is a
one-time migration, not a runtime dependency.

A mapping file assigns every source file to a domain, category, series, and order.
The track-level defaults are:

| `arac` track | Default destination |
| --- | --- |
| `foundations` | Money & Finance / Personal Finance |
| `banking` | Money & Finance / Banking & Savings |
| `investing` | Money & Finance / Investing & Markets |
| `stock-picking` | Money & Finance / Stocks & Company Analysis |
| `tax` | Money & Finance / Tax |
| `insurance` | Health & Insurance / Health, Life, or Motor Insurance |
| `retirement` | Money & Finance / Retirement & PF |
| `loans-credit` | Money & Finance / Loans & Credit |
| `gold-real-estate` | Money & Finance / Gold or Real Estate |
| `alt-investments` | Money & Finance / Alternative Investments |
| `nri` | Money & Finance / NRI Money |
| `scams` | Law, Rights & Fraud / Scams & Fraud |
| `legal-grey` | Law, Rights & Fraud / Financial Crime & Grey Areas |
| `tools` | Money & Finance / Money Tools, Investing, Loans & Credit, Civic |
| `family-money` | Home & Family / Marriage, Family, or Inheritance |
| `income-side-hustles` | Business / Side Income or Small Business |
| `student-young-earner` | Work & Career / Early Career; credit-score article → Loans & Credit |
| `women-money` | Home & Family / Women & Money; career break → Work & Career; gold article → Gold |

Known exceptions:

- `official-portals-bookmark-list` → Civic & Public Services / Government Portals.
- `benami-property-act-prohibition` → Law, Rights & Fraud / Financial Crime.
- `personal-loan-vs-gold-loan-cost` → Loans & Credit, not Gold.
- `dividend-income-taxation-slab-tds` → Investing & Markets.
- `rental-income-tax-house-property-arithmetic` → Real Estate.
- `fractional-real-estate-platforms` → Alternative Investments.
- `credit-score-build-at-22-cibil-mechanics` → Loans & Credit.
- `kids-education-corpus-planning` and `education-loan-moratorium-80e-collateral`
  → Education Financing, cross-linked from Home & Family.
- `gst-input-credit-fraud-patterns` → Financial Crime, not Small Business.

Conversion rules:

- Preserve title, description, publication date, tags, level, legal rating, and
  featured status.
- Add `source: { title: 'Rupee Realism', url, license: 'MIT' }`.
- Add the ORIZ finance disclaimer and `reviewStatus: 'editorial'`.
- Clamp publication dates after 2026-10-30 to 2026-10-30. Keep earlier dates.
- Preserve Markdown tables. Keep existing `<figure class="callout">` markup and add
  matching ORIZ styles.
- Rewrite the one known internal `/blog/related-party-transaction-detection/` link
  to the new canonical path.
- Generate a migration report listing every source file, destination, skipped
  duplicate, merged file, and unmapped field.

### 7.2 Merge overlapping articles

Three canonical mergers are required:

| Existing ORIZ article | `arac` article | Canonical result |
| --- | --- | --- |
| `emergency-fund-india` | `emergency-fund-sizing` | `emergency-fund-sizing`; keep the ORIZ calculator walkthrough and India instrument notes as sections |
| `loan-emi-guide` | `home-loan-emi-breakup-principal-interest` | `home-loan-emi-breakup-principal-interest`; add the formula, amortisation table, and calculator link from ORIZ |
| `home-loan-prepayment-india` | `prepay-home-loan-or-invest-the-surplus` | `prepay-home-loan-or-invest-the-surplus`; add the worked prepayment example and calculator link |

The merged article keeps the `arac` slug and the ORIZ hero image where available.
The old ORIZ URL redirects to the new canonical URL. No duplicate content remains
under two ORIZ URLs.

### 7.3 Existing ORIZ articles

All remaining ORIZ articles move into the library tree with their current slugs.

| Existing slug | Destination |
| --- | --- |
| `typescript-type-system` | Technology / Programming / `typescript` |
| `python-data-workflows` | AI & Data / Data Engineering / `python-data` |
| `secure-api-design` | Technology / Backend & APIs / `reliable-apis` |
| `backend-reliability-budget` | Technology / Backend & APIs / `reliable-apis` |
| `http-status-codes` | Technology / Backend & APIs / `reliable-apis` |
| `css-color-formats` | Design & Accessibility / Color & Accessibility |
| `json-formatting-and-validation` | Technology / Data & Storage / `sql-and-data` |
| `static-json-apis-on-github-pages` | Technology / Web Development / `static-web` |
| `base64-is-not-encryption` | Technology / Developer Craft / `text-and-diagrams` |
| `cron-expressions-guide` | Technology / Developer Craft / `scheduling` |
| `diagramming-with-mermaid` | Technology / Developer Craft / `text-and-diagrams` |
| `diff-algorithms` | Technology / Computer Science / `algorithms` |
| `git-merge-vs-rebase` | Technology / Developer Craft / `git-and-history` |
| `ipv4-subnetting-guide` | Technology / Networking / `ip-addressing` |
| `reading-sql-queries` | Technology / Data & Storage / `sql-and-data` |
| `rag-retrieval-augmented-generation` | AI & Data / AI Engineering / `production-ai` |
| `evaluating-llm-applications` | AI & Data / AI Engineering / `production-ai` |
| `compound-interest-guide` | Money & Finance / Personal Finance / `money-foundations` |
| `loan-emi-guide` | merged into `home-loan-emi-breakup-principal-interest` |
| `emergency-fund-india` | merged into `emergency-fund-sizing` |
| `home-loan-prepayment-india` | merged into `prepay-home-loan-or-invest-the-surplus` |

### 7.4 Glossary

The 63 `arac` glossary terms are merged into the ORIZ glossary. Existing ORIZ
definitions win when both versions cover the same term; the `arac` definition is
retained only when it adds material information. Each term gets:

- a category under the new domain/category labels;
- a `source` note when the definition originates from Rupee Realism;
- links to the relevant category guide, article, or tool.

The final glossary count is reported by the build; no duplicate term or slug is
permitted.

### 7.5 Images

- Existing ORIZ article images remain and are reused for merged articles where
  available.
- Generate one editorial hero image per live domain and priority category, in the
  existing cream/orange/charcoal illustration system.
- Imported articles use the category image as their Open Graph fallback and do not
  require individual hero images.
- All generated images are optimised to 1200×630 JPEG and require alt text.

## 8. Navigation and layout

### 8.1 Header and mega menu

Primary navigation:

```text
Library | Articles | Learning Paths | Tools | About | Search | Hire Me
```

`Library` opens a mega menu with four shelf columns. Each column lists its domains
and a short list of categories. The menu is a disclosure pattern, not hover-only:

- button with `aria-expanded`;
- Escape closes and returns focus;
- arrow keys move between shelf columns;
- links are ordinary anchors;
- mobile uses a full-height drawer with accordion shelves.

The footer includes an “All domains” link to `/library/`.

### 8.2 Left library sidebar

Shown on domain, category, and article pages at desktop widths.

Contents:

- “All domains” link.
- Current domain name and its categories.
- Current category expanded to its series and articles.
- Current article marked `aria-current="page"`; the current series is expanded.
- Collapsible branches using native `<details>` elements or a small accessible
  disclosure script; no client-side data fetching.
- A direct link to the category’s complete guide.
- On article pages, a compact “In this series” block with numbered articles and
  reading progress stored locally.

The sidebar is sticky below the header, independently scrollable, and becomes a
drawer below 1100px.

### 8.3 Article page

Three columns: left library tree, article, right contextual rail.

Article header:

- breadcrumbs: Home → Domain → Category → Article;
- category link and series label;
- “Part X of Y” when the series has more than one article;
- reading time, difficulty, legal badge for finance/legal content;
- title, description, author, publication and update dates;
- optional hero image.

Right rail:

- On this page (TOC);
- key takeaways;
- tools in this article;
- share links;
- series navigation;
- “Go to complete guide”.

Article footer:

- references;
- correction link;
- related articles within the same category first, then cross-category related;
- previous/next within the series;
- license and canonical URL.

### 8.4 Category complete-guide page

Three columns: left tree, guide, right guide rail.

Content order:

1. Breadcrumbs and domain link.
2. Category title, description, updated date, article count, reading order.
3. Key questions with short answers.
4. “Start here” sequence.
5. Long-form complete guide body.
6. Series sections, each with a short introduction and ordered article cards.
7. Tools for this category.
8. FAQ.
9. Related categories and learning paths.

The right rail contains an “On this page” TOC, quick facts, and links to the tools.

### 8.5 Domain and library pages

- Domain page: domain title, description, category grid, featured complete guides,
  latest articles, tools, and domain-level learning paths.
- Library page (`/library/`): shelf sections, domain cards, live/planned status,
  category counts, and a global search entry point.
- Planned domains are labelled “In preparation” and are not linked to indexable
  domain pages.

### 8.6 Responsive behavior

| Width | Layout |
| --- | --- |
| ≥ 1280px | Left tree, centre content, right rail |
| 980–1279px | Left tree in drawer, centre content, right rail |
| < 980px | Single column; left tree and right rail become accordions/drawers |
| Print | Hide navigation rails; show article/guide body and references |

## 9. Search, feeds, and structured data

- Search index includes domains, categories, category guides, series, articles,
  tools, learning paths, APIs, and glossary terms.
- Search filters: type, domain, category, difficulty.
- Search result URLs use canonical library paths.
- `articles.json` adds `domain`, `category`, `series`, `legal`, and `source`.
- Add `taxonomy.json` and `guides.json` exports.
- RSS uses the latest 40 articles, with domain/category names as categories.
- Sitemap includes live domain pages, category guides, series articles, tools,
  learning paths, glossary, and static pages; planned domains and redirect pages are
  excluded.
- Article JSON-LD `articleSection` uses the canonical domain and category.
- Category guide JSON-LD uses `Article` or `WebPage` with `about` and `hasPart`
  referencing its articles.

## 10. Validation and quality gates

Build-time validation must reject:

- an article outside `src/content/library/<domain>/<category>/<series>/`;
- an unknown domain, category, or series;
- a live category without a guide;
- a live domain without at least one live category;
- a category guide with a mismatched domain/category or unknown article/tool;
- a duplicate article slug or title;
- a non-contiguous or duplicate series order;
- a future publication date;
- an invalid tag slug, more than eight tags, an image without alt, or a missing
  finance disclaimer on imported finance/legal content;
- a missing old-URL redirect or a redirect loop;
- a broken internal link or anchor;
- a sitemap entry for a planned domain or redirect page.

Browser QA must cover:

- all live domain pages, all category guide pages, the library map, and all series
  article pages;
- keyboard navigation of the mega menu and left tree;
- mobile drawer behavior;
- search facet filtering;
- axe WCAG 2 A/AA in light and key dark pages;
- no horizontal overflow at 390px, 768px, 1024px, and 1440px;
- LCP under 500ms and CLS under 0.1 in local Edge on representative pages;
- CSP and external-link checks.

## 11. Implementation phases

1. **Taxonomy and shell**
   - Add taxonomy data, schema changes, guides collection, and folder migration for
     the existing 21 articles.
   - Add domain, category, library routes and redirects.
   - Build the three-column shell, mega menu, and left tree.
   - Adjust search/feeds/validation for the new fields.
2. **Finance import**
   - Add the `arac` migration map and import script.
   - Import 110 articles, merge the three overlaps, clamp future dates, and merge
     the glossary.
   - Add callout styles, disclaimers, source metadata, and category images.
3. **Complete guides**
   - Write the full Gold and Personal Finance guides, then the remaining priority
     guides.
   - Add category guide images, key questions, FAQs, and tool links.
4. **Integration and hardening**
   - Remap all 53 tools to categories.
   - Update homepage, author page, hire page, learning paths, RSS, sitemap, and JSON
     exports.
   - Run type checks, unit tests, production build, Edge QA, CSP, external links,
     and fix regressions.

## 12. Acceptance criteria

- 15 domains defined; 11 live; 4 planned and transparently marked.
- 36 live categories, each with a guide and at least one article.
- 128 articles expected after import and three merges, each with one canonical
  domain/category/series placement.
- Gold complete guide at `/money-finance/gold/`, covering every gold route and
  linking to every gold article.
- Personal Finance complete guide at `/money-finance/personal-finance/`, with
  series for budgeting, emergency funds, inflation, and reviews.
- Every old `/articles/<slug>/` and `/categories/<slug>/` URL redirects in one hop.
- Left library tree, mega menu, right rail, series navigation, and mobile drawers
  work with keyboard and screen readers.
- Search, RSS, sitemap, JSON exports, breadcrumbs, and JSON-LD use canonical
  taxonomy paths.
- `npm run check`, `npm test`, `npm run build`, Edge QA, CSP, and external-link
  checks pass with zero errors and zero axe violations.
- No future-dated article, duplicate title/slug, orphan article, empty live
  category, or missing disclaimer remains.

## 13. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Imported finance content contains stale tax or legal claims | Add editorial review status, visible disclaimers, and a dated review queue; do not claim technical review |
| 110 imported articles duplicate the `arac` site | Canonical ORIZ URLs, source attribution, and a later decision to retire or redirect the source site |
| Navigation becomes too deep or slow | Cap the hierarchy at domain → category → series → article; server-render the tree; use disclosures instead of client fetching |
| Thin categories look unfinished | Require a guide and at least one article; keep planned domains out of the main navigation; expand priority categories first |
| Build and QA time grows with 128 articles | Use the content cache, lazy Mermaid, and full QA only on release; keep all taxonomy pages in every run |
| Tag vocabulary explodes | Tags are free-form discovery aids; only domain/category/series are controlled and validated |
| URL churn breaks links | Generate and test one-hop redirects for every legacy URL before removing old routes |
| Imported callout HTML loses styling | Add shared callout styles and render a representative sample in QA |

## 14. Open editorial decisions

No blocking architecture decisions remain. The following content work is scheduled
during implementation and does not change the model:

- exact wording of category descriptions and key questions;
- final mapping of individual articles that sit between two valid categories;
- which priority categories receive full guides after Gold and Personal Finance;
- whether the `arac` site is later retired or kept as a canonical source.
