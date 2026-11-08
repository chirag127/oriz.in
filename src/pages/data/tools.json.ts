import type { APIRoute } from 'astro';
import { TOOLS } from '../../data/tools';
import { articleUrl, loadContentIndex } from '../../lib/content';
import { getCategory } from '../../data/taxonomy';
import { jsonResponse, withVersion, publicUrl } from '../../lib/export';

export const GET: APIRoute = async () => {
  const { articlesById } = await loadContentIndex();
  const tools = TOOLS.map((tool) => {
    const docs = tool.docs ? articlesById.get(tool.docs) : undefined;
    return {
      ...tool,
      categoryName: getCategory(tool.category)?.title ?? tool.category,
      url: publicUrl(`/tools/${tool.slug}/`),
      docsUrl: docs ? publicUrl(articleUrl(docs)) : null,
    };
  });
  return jsonResponse(withVersion('tools', tools));
};
