import type { APIRoute } from 'astro';
import {
  articleLocation,
  articleReadingMinutes,
  articleUrl,
  loadContentIndex,
} from '../../lib/content';
import { getCategory, getDomain } from '../../data/taxonomy';
import { jsonResponse, withVersion, publicUrl } from '../../lib/export';

export const GET: APIRoute = async () => {
  const { articles } = await loadContentIndex();
  const data = articles
    .filter((entry) => !entry.data.noindex)
    .map((entry) => {
      const location = articleLocation(entry);
      return {
        slug: entry.id,
        title: entry.data.title,
        description: entry.data.description,
        pubDate: entry.data.pubDate.toISOString().slice(0, 10),
        updatedDate: entry.data.updatedDate?.toISOString().slice(0, 10) ?? null,
        type: entry.data.type,
        author: entry.data.author,
        domain: {
          slug: location.domain,
          name: getDomain(location.domain)?.title ?? location.domain,
        },
        category: {
          slug: location.category,
          name: getCategory(location.category)?.title ?? location.category,
        },
        series: location.series,
        tags: entry.data.tags,
        difficulty: entry.data.difficulty ?? null,
        readingMinutes: articleReadingMinutes(entry),
        license: entry.data.license,
        references: entry.data.references,
        legal: entry.data.legal ?? null,
        source: entry.data.source ?? null,
        url: publicUrl(articleUrl(entry)),
      };
    });
  return jsonResponse(withVersion('articles', data));
};
