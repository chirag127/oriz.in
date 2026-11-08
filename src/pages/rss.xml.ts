import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { loadContentIndex, articleLocation, articleUrl } from '../lib/content';
import { getCategory, getDomain } from '../data/taxonomy';
import { SITE } from '../consts';

export async function GET(context: APIContext) {
  const { articles } = await loadContentIndex();
  const items = articles
    .filter((entry) => !entry.data.noindex)
    .slice(0, 40)
    .map((entry) => {
      const location = articleLocation(entry);
      const domain = getDomain(location.domain);
      const category = getCategory(location.category);
      return {
        title: entry.data.title,
        description: entry.data.description,
        pubDate: entry.data.pubDate,
        link: articleUrl(entry),
        author: entry.data.author,
        categories: [domain?.title, category?.title].filter((value): value is string => Boolean(value)),
      };
    });

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items,
    customData: `<language>${SITE.language}</language>`,
  });
}
