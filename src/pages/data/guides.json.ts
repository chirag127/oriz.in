import type { APIRoute } from 'astro';
import { articleUrl, loadContentIndex } from '../../lib/content';
import { getCategoryPath } from '../../data/taxonomy';
import { jsonResponse, withVersion, publicUrl } from '../../lib/export';

export const GET: APIRoute = async () => {
  const { guidesByCategory, articlesById, categoriesBySlug } = await loadContentIndex();
  const data = [...guidesByCategory.entries()].map(([categorySlug, guide]) => {
    const category = categoriesBySlug.get(categorySlug);
    return {
      slug: categorySlug,
      title: guide.data.title,
      description: guide.data.description,
      updated: guide.data.updated.toISOString().slice(0, 10),
      heroImage: publicUrl(guide.data.heroImage),
      keyQuestions: guide.data.keyQuestions,
      startHere: guide.data.startHere.map((slug) => {
        const entry = articlesById.get(slug);
        return {
          slug,
          title: entry?.data.title ?? slug,
          url: entry ? publicUrl(articleUrl(entry)) : null,
        };
      }),
      faq: guide.data.faq,
      tools: guide.data.tools,
      articleCount: category?.articleCount ?? 0,
      url: publicUrl(getCategoryPath(categorySlug) ?? '/library/'),
    };
  });
  return jsonResponse(withVersion('guides', data));
};
