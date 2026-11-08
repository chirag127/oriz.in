import type { APIRoute } from 'astro';
import { APIS, getApiCategory } from '../data/apis';
import { getCategory, getCategoryPath, getDomain, liveDomains } from '../data/taxonomy';
import { GLOSSARY } from '../data/glossary';
import { LEARNING_PATHS } from '../data/learning-paths';
import { TOOLS } from '../data/tools';
import {
  articleLocation,
  articleUrl,
  getLearningPathSteps,
  loadContentIndex,
} from '../lib/content';

interface SearchRecord {
  title: string;
  url: string;
  type: 'article' | 'tool' | 'category' | 'guide' | 'domain' | 'api' | 'learning-path' | 'glossary';
  typeLabel: string;
  description: string;
  category: string;
  domain?: string;
  series?: string;
  tags: string[];
  headings: string[];
  content: string;
}

function plainTextExcerpt(body: string | undefined): string {
  if (!body) return '';
  return body
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/\$\$[\s\S]*?\$\$/gu, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/[#>*_`|~-]+/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .slice(0, 1600);
}

function headingsFromMarkdown(body: string | undefined): string[] {
  if (!body) return [];
  return [...body.matchAll(/^#{2,3}\s+(.+)$/gmu)]
    .map((match) => match[1]!.replace(/[*_`]/gu, '').trim())
    .slice(0, 40);
}

export const GET: APIRoute = async () => {
  const { articles, articlesById, categories, guides } = await loadContentIndex();

  const records: SearchRecord[] = [
    ...articles
      .filter((entry) => !entry.data.noindex)
      .map((entry) => {
        const location = articleLocation(entry);
        const category = getCategory(location.category);
        const domain = getDomain(location.domain);
        return {
          title: entry.data.title,
          url: articleUrl(entry),
          type: 'article' as const,
          typeLabel: 'Article',
          description: entry.data.description,
          category: category?.title ?? location.category,
          domain: domain?.title ?? location.domain,
          series: location.series,
          tags: entry.data.tags,
          headings: headingsFromMarkdown(entry.body),
          content: plainTextExcerpt(entry.body),
        };
      }),
    ...TOOLS.map((tool) => {
      const category = getCategory(tool.category);
      const domain = category ? getDomain(category.domain) : undefined;
      return {
        title: tool.title,
        url: `/tools/${tool.slug}/`,
        type: 'tool' as const,
        typeLabel: 'Tool',
        description: tool.description,
        category: category?.title ?? tool.category,
        domain: domain?.title,
        tags: [...tool.tags, ...tool.keywords],
        headings: [],
        content: [...tool.steps, ...tool.limitations].join(' '),
      };
    }),
    ...categories.map((category) => ({
      title: category.title,
      url: category.url,
      type: 'category' as const,
      typeLabel: 'Complete guide',
      description: category.description,
      category: category.domainTitle,
      domain: category.domainTitle,
      tags: [],
      headings: [],
      content: category.description,
    })),
    ...guides.map((guide) => ({
      title: guide.data.title,
      url: getCategoryPath(guide.id) ?? `/library/`,
      type: 'guide' as const,
      typeLabel: 'Complete guide',
      description: guide.data.description,
      category: 'Complete guide',
      tags: [],
      headings: headingsFromMarkdown(guide.body),
      content: plainTextExcerpt(guide.body),
    })),
    ...liveDomains().map((domain) => ({
      title: domain.title,
      url: `/${domain.slug}/`,
      type: 'domain' as const,
      typeLabel: 'Domain',
      description: domain.description,
      category: 'Library',
      tags: [],
      headings: [],
      content: domain.description,
    })),
    ...APIS.map((api) => ({
      title: api.name,
      url: `/apis/${api.slug}/`,
      type: 'api' as const,
      typeLabel: 'API',
      description: api.description,
      category: getApiCategory(api.category)?.label ?? api.category,
      tags: [api.provider, api.format],
      headings: [],
      content: api.notes.join(' '),
    })),
    ...LEARNING_PATHS.map((path) => ({
      title: path.title,
      url: `/learn/${path.slug}/`,
      type: 'learning-path' as const,
      typeLabel: 'Learning path',
      description: path.description,
      category: 'Learning paths',
      tags: [path.audience, path.level],
      headings: getLearningPathSteps(path, articlesById).map((step) => step.title),
      content: path.description,
    })),
    ...GLOSSARY.map((term) => ({
      title: term.term,
      url: `/glossary/#${term.slug}`,
      type: 'glossary' as const,
      typeLabel: 'Glossary',
      description: term.definition,
      category: term.category,
      tags: [term.category],
      headings: [],
      content: term.definition,
    })),
  ];

  const body = JSON.stringify(
    {
      version: 1,
      generated: new Date().toISOString(),
      count: records.length,
      records,
    },
    null,
    2,
  );

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=900, must-revalidate',
    },
  });
};
