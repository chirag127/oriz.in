import { getCollection, type CollectionEntry } from 'astro:content';
import { TOOLS, getTool, type ToolDefinition } from '../data/tools';
import { LEARNING_PATHS } from '../data/learning-paths';
import { APIS } from '../data/apis';
import {
  CATEGORIES,
  DOMAINS,
  getCategory,
  getCategoryName as taxonomyCategoryName,
  getCategoriesForDomain,
  getDomain,
  getDomainName as taxonomyDomainName,
  getSeries,
  getSeriesForCategory,
  liveCategories,
  type TaxonomyCategory,
  type TaxonomyDomain,
  type TaxonomySeries,
} from '../data/taxonomy';
import { parseGuidePath, parseLibraryPath, type ArticleLocation } from './library';
import { countWords } from './text';

export type Article = CollectionEntry<'articles'>;
export type GuideEntry = CollectionEntry<'guides'>;

export interface CategorySummary extends TaxonomyCategory {
  name: string;
  domainTitle: string;
  articleCount: number;
  toolCount: number;
  totalCount: number;
  guide: GuideEntry | null;
  url: string;
}

export interface CategorySeriesGroup {
  series: TaxonomySeries;
  articles: Article[];
}

export interface ContentIndex {
  articles: Article[];
  articlesById: Map<string, Article>;
  locations: Map<string, ArticleLocation>;
  guides: GuideEntry[];
  guidesByCategory: Map<string, GuideEntry>;
  categories: CategorySummary[];
  categoriesBySlug: Map<string, CategorySummary>;
  seriesArticles: Map<string, Article[]>;
}

export const FEATURED_ARTICLE_SLUGS = [
  'home-loan-emi-breakup-principal-interest',
  'css-color-formats',
  'ipv4-subnetting-guide',
] as const;

export const HOME_GUIDE_SLUGS = [
  'http-status-codes',
  'cron-expressions-guide',
  'reading-sql-queries',
] as const;

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FINANCE_DOMAINS = new Set(['money-finance', 'law-rights-fraud']);

let indexPromise: Promise<ContentIndex> | null = null;

export async function loadContentIndex(): Promise<ContentIndex> {
  if (!indexPromise) indexPromise = buildContentIndex();
  return indexPromise;
}

async function buildContentIndex(): Promise<ContentIndex> {
  const entries = await getCollection('articles');
  const guideEntries = await getCollection('guides');
  const articles = entries
    .filter((entry) => !entry.data.draft)
    .sort(
      (a, b) =>
        b.data.pubDate.getTime() - a.data.pubDate.getTime() ||
        a.data.title.localeCompare(b.data.title),
    );

  const locations = new Map<string, ArticleLocation>();
  for (const entry of articles) {
    const location = parseLibraryPath(entry.filePath);
    if (!location) {
      throw new Error(
        `Article “${entry.id}” is not inside src/content/library/<domain>/<category>/<series>/.`,
      );
    }
    locations.set(entry.id, location);
  }

  const guidesByCategory = new Map<string, GuideEntry>();
  for (const guide of guideEntries) {
    const location = parseGuidePath(guide.filePath);
    if (!location) {
      throw new Error(`Guide “${guide.id}” is not inside src/content/guides/<domain>/<category>.md.`);
    }
    const category = getCategory(location.category);
    if (!category) {
      throw new Error(`Guide “${guide.id}” references unknown category “${location.category}”.`);
    }
    if (category.domain !== location.domain) {
      throw new Error(`Guide “${guide.id}” is in the wrong domain folder.`);
    }
    if (guidesByCategory.has(location.category)) {
      throw new Error(`Duplicate guide for category “${location.category}”.`);
    }
    guidesByCategory.set(location.category, guide);
  }

  validateContent(articles, locations);
  const seriesArticles = buildSeriesMap(articles, locations);
  validateGuides(guidesByCategory, locations);
  validateSiteData(articles, locations, seriesArticles);

  const categories: CategorySummary[] = liveCategories().map((category) => {
    const domain = getDomain(category.domain);
    const articleCount = articles.filter(
      (entry) => !entry.data.noindex && locations.get(entry.id)?.category === category.slug,
    ).length;
    const toolCount = TOOLS.filter((tool) => tool.category === category.slug).length;
    return {
      ...category,
      name: category.title,
      domainTitle: domain?.title ?? category.domain,
      articleCount,
      toolCount,
      totalCount: articleCount + toolCount,
      guide: guidesByCategory.get(category.slug) ?? null,
      url: `/${category.domain}/${category.slug}/`,
    };
  });

  return {
    articles,
    articlesById: new Map(articles.map((entry) => [entry.id, entry])),
    locations,
    guides: guideEntries,
    guidesByCategory,
    categories,
    categoriesBySlug: new Map(categories.map((category) => [category.slug, category])),
    seriesArticles,
  };
}

function buildSeriesMap(
  articles: Article[],
  locations: Map<string, ArticleLocation>,
): Map<string, Article[]> {
  const grouped = new Map<string, Article[]>();
  for (const entry of articles) {
    const location = locations.get(entry.id);
    if (!location) continue;
    const key = `${location.category}/${location.series}`;
    const list = grouped.get(key) ?? [];
    list.push(entry);
    grouped.set(key, list);
  }
  for (const [key, list] of grouped) {
    list.sort((a, b) => {
      const aOrder = locations.get(a.id)?.order ?? 0;
      const bOrder = locations.get(b.id)?.order ?? 0;
      return aOrder - bOrder || a.data.title.localeCompare(b.data.title);
    });
    grouped.set(key, list);
  }
  return grouped;
}

function validateContent(articles: Article[], locations: Map<string, ArticleLocation>): void {
  const titles = new Map<string, string>();
  const ids = new Set(articles.map((entry) => entry.id));
  const now = Date.now();

  for (const entry of articles) {
    if (!ID_PATTERN.test(entry.id)) {
      throw new Error(`Article id “${entry.id}” must be a lowercase URL-safe slug.`);
    }

    const location = locations.get(entry.id);
    if (!location) throw new Error(`Article “${entry.id}” has no library location.`);
    const domain = getDomain(location.domain);
    const category = getCategory(location.category);
    const series = getSeries(location.category, location.series);
    if (!domain) throw new Error(`Article “${entry.id}” references unknown domain “${location.domain}”.`);
    if (!category) {
      throw new Error(`Article “${entry.id}” references unknown category “${location.category}”.`);
    }
    if (category.domain !== location.domain) {
      throw new Error(`Article “${entry.id}” is filed under the wrong domain folder.`);
    }
    if (!series) {
      throw new Error(
        `Article “${entry.id}” references unknown series “${location.category}/${location.series}”.`,
      );
    }
    if (entry.data.pubDate.getTime() > now + 86_400_000) {
      throw new Error(`Article “${entry.id}” has a future publication date.`);
    }
    if (FINANCE_DOMAINS.has(domain.slug) && !entry.data.disclaimer) {
      throw new Error(`Finance/legal article “${entry.id}” requires a disclaimer.`);
    }

    for (const tag of entry.data.tags) {
      if (!ID_PATTERN.test(tag)) {
        throw new Error(`Article “${entry.id}” references invalid tag “${tag}”.`);
      }
    }

    for (const related of entry.data.related) {
      if (related === entry.id) throw new Error(`Article “${entry.id}” lists itself as related.`);
      if (!ids.has(related)) {
        throw new Error(`Article “${entry.id}” references missing related article “${related}”.`);
      }
    }
    for (const prerequisite of entry.data.prerequisites) {
      if (!ids.has(prerequisite)) {
        throw new Error(
          `Article “${entry.id}” references missing prerequisite “${prerequisite}”.`,
        );
      }
    }
    const pathSlugs = new Set(LEARNING_PATHS.map((path) => path.slug));
    for (const pathSlug of entry.data.learningPaths) {
      if (!pathSlugs.has(pathSlug)) {
        throw new Error(`Article “${entry.id}” references unknown learning path “${pathSlug}”.`);
      }
    }

    const titleKey = entry.data.title.trim().toLocaleLowerCase();
    if (titles.has(titleKey)) {
      throw new Error(
        `Duplicate article title “${entry.data.title}” in “${entry.id}” and “${titles.get(titleKey)}”.`,
      );
    }
    titles.set(titleKey, entry.id);
  }
}

function validateGuides(
  guidesByCategory: Map<string, GuideEntry>,
  locations: Map<string, ArticleLocation>,
): void {
  for (const category of liveCategories()) {
    const guide = guidesByCategory.get(category.slug);
    if (!guide) throw new Error(`Live category “${category.slug}” has no category guide.`);
    for (const slug of [...guide.data.startHere, ...guide.data.featuredArticles]) {
      const location = locations.get(slug);
      if (!location || location.category !== category.slug) {
        throw new Error(
          `Guide “${category.slug}” references article “${slug}” outside its category.`,
        );
      }
    }
    for (const toolSlug of guide.data.tools) {
      if (!getTool(toolSlug)) {
        throw new Error(`Guide “${category.slug}” references missing tool “${toolSlug}”.`);
      }
    }
  }
}

function validateSiteData(
  articles: Article[],
  locations: Map<string, ArticleLocation>,
  seriesArticles: Map<string, Article[]>,
): void {
  const articleIds = new Set(articles.map((entry) => entry.id));
  const toolSlugs = new Set<string>();
  const toolTitles = new Set<string>();
  const categorySlugs = new Set(liveCategories().map((category) => category.slug));

  for (const tool of TOOLS) {
    if (!ID_PATTERN.test(tool.slug)) throw new Error(`Tool slug “${tool.slug}” is not URL safe.`);
    if (toolSlugs.has(tool.slug)) throw new Error(`Duplicate tool slug “${tool.slug}”.`);
    toolSlugs.add(tool.slug);
    if (toolTitles.has(tool.title)) throw new Error(`Duplicate tool title “${tool.title}”.`);
    toolTitles.add(tool.title);
    if (!categorySlugs.has(tool.category)) {
      throw new Error(`Tool “${tool.slug}” references unknown category “${tool.category}”.`);
    }
    for (const related of tool.related) {
      if (related === tool.slug) throw new Error(`Tool “${tool.slug}” lists itself as related.`);
      if (!TOOLS.some((candidate) => candidate.slug === related)) {
        throw new Error(`Tool “${tool.slug}” references missing related tool “${related}”.`);
      }
    }
    if (tool.docs && !articleIds.has(tool.docs)) {
      throw new Error(`Tool “${tool.slug}” references missing documentation article “${tool.docs}”.`);
    }
  }

  for (const slug of FEATURED_ARTICLE_SLUGS) {
    if (!articleIds.has(slug)) throw new Error(`Featured article “${slug}” does not exist.`);
  }
  for (const slug of HOME_GUIDE_SLUGS) {
    if (!articleIds.has(slug)) throw new Error(`Home guide “${slug}” does not exist.`);
  }

  const pathSlugs = new Set<string>();
  for (const path of LEARNING_PATHS) {
    if (pathSlugs.has(path.slug)) throw new Error(`Duplicate learning path “${path.slug}”.`);
    pathSlugs.add(path.slug);
    for (const step of path.steps) {
      if (step.kind === 'article' && !articleIds.has(step.slug)) {
        throw new Error(`Learning path “${path.slug}” references missing article “${step.slug}”.`);
      }
      if (step.kind === 'tool' && !getTool(step.slug)) {
        throw new Error(`Learning path “${path.slug}” references missing tool “${step.slug}”.`);
      }
    }
  }
  for (const entry of articles) {
    for (const pathSlug of entry.data.learningPaths) {
      const path = LEARNING_PATHS.find((candidate) => candidate.slug === pathSlug);
      if (path && !path.steps.some((step) => step.kind === 'article' && step.slug === entry.id)) {
        throw new Error(
          `Article “${entry.id}” claims membership in “${pathSlug}” but the path does not include it.`,
        );
      }
    }
  }

  for (const [key, list] of seriesArticles) {
    const [categorySlug, seriesSlug] = key.split('/');
    if (!categorySlug || !seriesSlug) continue;
    const category = getCategory(categorySlug);
    if (!category) continue;
    const orders = list.map((entry) => locations.get(entry.id)?.order ?? 0);
    const expected = orders.map((_, index) => index + 1);
    if (orders.some((order, index) => order !== expected[index])) {
      throw new Error(
        `Series “${key}” has non-contiguous order: ${orders.join(', ')}. Expected 1..${orders.length}.`,
      );
    }
  }

  const apiSlugs = new Set<string>();
  for (const api of APIS) {
    if (!ID_PATTERN.test(api.slug)) throw new Error(`API slug “${api.slug}” is not URL safe.`);
    if (apiSlugs.has(api.slug)) throw new Error(`Duplicate API slug “${api.slug}”.`);
    apiSlugs.add(api.slug);
    if (!api.docsUrl) throw new Error(`API “${api.slug}” is missing documentation.`);
    for (const related of api.related ?? []) {
      if (!APIS.some((candidate) => candidate.slug === related)) {
        throw new Error(`API “${api.slug}” references missing related API “${related}”.`);
      }
    }
  }
}

export function articleLocation(entry: Article): ArticleLocation {
  const location = parseLibraryPath(entry.filePath);
  if (!location) throw new Error(`Article “${entry.id}” has no library location.`);
  return location;
}

export function articleUrl(entry: Article): string {
  const location = articleLocation(entry);
  return `/${location.domain}/${location.category}/${entry.id}/`;
}

export function guideUrl(category: string): string {
  const entry = getCategory(category);
  if (!entry) throw new Error(`Unknown category “${category}”.`);
  return `/${entry.domain}/${entry.slug}/`;
}

export function articleReadingMinutes(entry: Article): number {
  return Math.max(1, Math.ceil(countWords(entry.body ?? '') / 200));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function getCategoryName(slug: string): string {
  return taxonomyCategoryName(slug);
}

export function getDomainName(slug: string): string {
  return taxonomyDomainName(slug);
}

export async function getGuide(category: string): Promise<GuideEntry | undefined> {
  const { guidesByCategory } = await loadContentIndex();
  return guidesByCategory.get(category);
}

export async function getRecentArticles(limit = 6): Promise<Article[]> {
  const { articles } = await loadContentIndex();
  return articles.filter((entry) => !entry.data.noindex).slice(0, limit);
}

export async function getArticlesByCategory(slug: string): Promise<Article[]> {
  const { articles, locations } = await loadContentIndex();
  return articles.filter(
    (entry) => !entry.data.noindex && locations.get(entry.id)?.category === slug,
  );
}

export async function getSeriesArticles(category: string, series: string): Promise<Article[]> {
  const { seriesArticles } = await loadContentIndex();
  return seriesArticles.get(`${category}/${series}`) ?? [];
}

export async function getRelatedArticles(entry: Article): Promise<Article[]> {
  const { articlesById } = await loadContentIndex();
  return entry.data.related
    .map((id) => articlesById.get(id))
    .filter((related): related is Article => Boolean(related));
}

export async function getArticleTools(entry: Article): Promise<ToolDefinition[]> {
  return TOOLS.filter((tool) => tool.docs === entry.id);
}

export async function getAdjacentArticles(entry: Article): Promise<{
  previous: Article | null;
  next: Article | null;
}> {
  const location = articleLocation(entry);
  const list = await getSeriesArticles(location.category, location.series);
  const index = list.findIndex((candidate) => candidate.id === entry.id);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: list[index - 1] ?? null,
    next: list[index + 1] ?? null,
  };
}

export async function getArticleSeries(entry: Article): Promise<{
  category: TaxonomyCategory;
  series: TaxonomySeries;
  position: number;
  articles: Article[];
}> {
  const location = articleLocation(entry);
  const category = getCategory(location.category);
  const series = getSeries(location.category, location.series);
  if (!category || !series) throw new Error(`Article “${entry.id}” has invalid taxonomy.`);
  const list = await getSeriesArticles(location.category, location.series);
  return {
    category,
    series,
    position: list.findIndex((candidate) => candidate.id === entry.id) + 1,
    articles: list,
  };
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const { articlesById } = await loadContentIndex();
  return FEATURED_ARTICLE_SLUGS.map((slug) => articlesById.get(slug)).filter(
    (entry): entry is Article => Boolean(entry),
  );
}

export async function getHomeGuides(): Promise<Article[]> {
  const { articlesById } = await loadContentIndex();
  return HOME_GUIDE_SLUGS.map((slug) => articlesById.get(slug)).filter(
    (entry): entry is Article => Boolean(entry),
  );
}

export async function getCategoryData(slug: string): Promise<{
  category: CategorySummary;
  articles: Article[];
  groups: CategorySeriesGroup[];
  tools: ToolDefinition[];
  guide: GuideEntry | null;
} | null> {
  const { categoriesBySlug, articles, locations, seriesArticles, guidesByCategory } =
    await loadContentIndex();
  const category = categoriesBySlug.get(slug);
  if (!category) return null;
  const categoryArticles = articles.filter(
    (entry) => !entry.data.noindex && locations.get(entry.id)?.category === slug,
  );
  const groups = getSeriesForCategory(slug).map((series) => ({
    series,
    articles: seriesArticles.get(`${slug}/${series.slug}`) ?? [],
  }));
  return {
    category,
    articles: categoryArticles,
    groups,
    tools: TOOLS.filter((tool) => tool.category === slug),
    guide: guidesByCategory.get(slug) ?? null,
  };
}

export async function getDomainData(domainSlug: string): Promise<{
  domain: TaxonomyDomain;
  categories: CategorySummary[];
  featured: CategorySummary[];
  articles: Article[];
  tools: ToolDefinition[];
} | null> {
  const { categories, articles, locations } = await loadContentIndex();
  const domain = getDomain(domainSlug);
  if (!domain) return null;
  const domainCategories = getCategoriesForDomain(domainSlug).map(
    (category) => categories.find((entry) => entry.slug === category.slug)!,
  );
  const categorySlugs = new Set(domainCategories.map((category) => category.slug));
  return {
    domain,
    categories: domainCategories,
    featured: domain.featuredCategories
      .map((slug) => categories.find((category) => category.slug === slug))
      .filter((category): category is CategorySummary => Boolean(category)),
    articles: articles.filter(
      (entry) => !entry.data.noindex && categorySlugs.has(locations.get(entry.id)?.category ?? ''),
    ),
    tools: TOOLS.filter((tool) => categorySlugs.has(tool.category)),
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const { articlesById } = await loadContentIndex();
  return articlesById.get(slug);
}

export function getLearningPathSteps(
  path: (typeof LEARNING_PATHS)[number],
  articlesById: Map<string, Article>,
): {
  title: string;
  href: string;
  kind: 'article' | 'tool';
  note?: string;
  description?: string;
}[] {
  return path.steps.flatMap((step): {
    title: string;
    href: string;
    kind: 'article' | 'tool';
    note?: string;
    description?: string;
  }[] => {
    if (step.kind === 'article') {
      const entry = articlesById.get(step.slug);
      if (!entry) return [];
      return [
        {
          title: entry.data.title,
          href: articleUrl(entry),
          kind: 'article' as const,
          note: step.note,
          description: entry.data.description,
        },
      ];
    }
    const tool = getTool(step.slug);
    if (!tool) return [];
    return [
      {
        title: tool.title,
        href: `/tools/${tool.slug}/`,
        kind: 'tool' as const,
        note: step.note,
        description: tool.description,
      },
    ];
  });
}

export const TAXONOMY_DOMAINS = DOMAINS;
export const TAXONOMY_CATEGORIES = CATEGORIES;
