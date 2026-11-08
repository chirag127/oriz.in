export interface ArticleLocation {
  domain: string;
  category: string;
  series: string;
  order: number;
  slug: string;
}

export interface GuideLocation {
  domain: string;
  category: string;
}

const PREFIX = /^(\d{2,3})-(.+)\.md$/u;

export function stripArticlePrefix(value: string): string {
  return value.replace(/^\d{2,3}-/u, '');
}

export function parseLibraryPath(filePath: string | undefined): ArticleLocation | null {
  if (!filePath) return null;
  const normalized = filePath.replaceAll('\\', '/');
  const marker = '/content/library/';
  const markerIndex = normalized.indexOf(marker);
  if (markerIndex === -1) return null;

  const relative = normalized.slice(markerIndex + marker.length);
  const parts = relative.split('/').filter(Boolean);
  if (parts.length !== 4) return null;

  const [domain, category, series, filename] = parts;
  const match = filename.match(PREFIX);
  if (!domain || !category || !series || !match) return null;

  const order = Number.parseInt(match[1] ?? '', 10);
  const slug = match[2] ?? '';
  if (!Number.isInteger(order) || order < 1 || !slug) return null;

  return { domain, category, series, order, slug };
}

export function parseGuidePath(filePath: string | undefined): GuideLocation | null {
  if (!filePath) return null;
  const normalized = filePath.replaceAll('\\', '/');
  const marker = '/content/guides/';
  const markerIndex = normalized.indexOf(marker);
  if (markerIndex === -1) return null;

  const relative = normalized.slice(markerIndex + marker.length);
  const parts = relative.split('/').filter(Boolean);
  if (parts.length !== 2) return null;

  const [domain, filename] = parts;
  if (!domain || !filename?.endsWith('.md')) return null;
  const category = filename.slice(0, -3);
  if (!category) return null;

  return { domain, category };
}

export function formatOrder(order: number): string {
  return String(order).padStart(2, '0');
}
