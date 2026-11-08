import type { APIRoute } from 'astro';
import { loadContentIndex } from '../../lib/content';
import {
  DOMAINS,
  SERIES,
  SHELVES,
  getCategory,
  getCategoryPath,
  getDomain,
  liveCategories,
} from '../../data/taxonomy';
import { jsonResponse } from '../../lib/export';

export const GET: APIRoute = async () => {
  const { categories } = await loadContentIndex();
  const data = {
    shelves: SHELVES,
    domains: DOMAINS.map((domain) => ({
      ...domain,
      categories: liveCategories()
        .filter((category) => category.domain === domain.slug)
        .map((category) => ({
          slug: category.slug,
          title: category.title,
          description: category.description,
          url: getCategoryPath(category.slug),
          articleCount: categories.find((entry) => entry.slug === category.slug)?.articleCount ?? 0,
        })),
    })),
    series: SERIES.map((series) => ({
      ...series,
      domain: getCategory(series.category)?.domain,
      domainTitle: getDomain(getCategory(series.category)?.domain ?? '')?.title ?? null,
    })),
  };
  return jsonResponse({ version: '1.0', generated: new Date().toISOString(), license: 'CC BY 4.0 (metadata); see https://oriz.in/copyright/', ...data });
};
