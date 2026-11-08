import { absoluteUrl } from './seo';

export function jsonResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
    },
  });
}

export function withVersion<T>(key: string, items: T[]): Record<string, unknown> {
  return {
    version: '1.0',
    generated: new Date().toISOString(),
    license: 'CC BY 4.0 (metadata); see https://oriz.in/copyright/',
    count: items.length,
    [key]: items,
  };
}

export function publicUrl(path: string): string {
  return absoluteUrl(path);
}
