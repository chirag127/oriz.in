import type { APIRoute } from 'astro';
import { GLOSSARY } from '../../data/glossary';
import { jsonResponse, withVersion, publicUrl } from '../../lib/export';

export const GET: APIRoute = () => {
  const terms = GLOSSARY.map((term) => ({
    ...term,
    url: publicUrl(`/glossary/#${term.slug}`),
  }));
  return jsonResponse(withVersion('terms', terms));
};
