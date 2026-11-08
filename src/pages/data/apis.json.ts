import type { APIRoute } from 'astro';
import { APIS, getApiCategory } from '../../data/apis';
import { jsonResponse, withVersion, publicUrl } from '../../lib/export';

export const GET: APIRoute = () => {
  const apis = APIS.map((api) => ({
    ...api,
    categoryLabel: getApiCategory(api.category)?.label ?? api.category,
    docsUrl: api.docsUrl.startsWith('http') ? api.docsUrl : publicUrl(api.docsUrl),
    url: publicUrl(`/apis/${api.slug}/`),
  }));
  return jsonResponse(withVersion('apis', apis));
};
