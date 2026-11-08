import type { APIRoute } from 'astro';
import { loadContentIndex } from '../../lib/content';
import { getDomain, getSeriesForCategory } from '../../data/taxonomy';
import { jsonResponse, withVersion, publicUrl } from '../../lib/export';

export const GET: APIRoute = async () => {
  const { categories } = await loadContentIndex();
  const data = categories.map((category) => {
    const domain = getDomain(category.domain);
    return {
      slug: category.slug,
      name: category.title,
      description: category.description,
      domain: category.domain,
      domainName: domain?.title ?? category.domain,
      shelf: domain?.shelf ?? null,
      series: getSeriesForCategory(category.slug).map((series) => series.slug),
      articleCount: category.articleCount,
      toolCount: category.toolCount,
      totalCount: category.totalCount,
      hasGuide: Boolean(category.guide),
      url: publicUrl(category.url),
    };
  });
  return jsonResponse(withVersion('categories', data));
};
