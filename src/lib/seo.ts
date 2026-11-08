import { SITE } from '../consts';
import { PROFILE } from '../data/profile';
import type { ToolDefinition } from '../data/tools';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).href;
}

export function personSchema(): Record<string, unknown> {
  return {
    '@type': 'Person',
    '@id': `${SITE.url}${SITE.authorUrl}#person`,
    name: PROFILE.name,
    url: absoluteUrl(SITE.authorUrl),
    email: PROFILE.email,
    jobTitle: PROFILE.currentRole,
    description: PROFILE.shortBio,
    worksFor: {
      '@type': 'Organization',
      name: 'TCS',
      url: 'https://www.tcs.com/',
    },
    knowsAbout: [...PROFILE.knowsAbout],
    sameAs: PROFILE.socials
      .filter((social) => social.label !== 'Email')
      .map((social) => social.url),
  };
}

export function organizationSchema(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon-512.png'),
      width: 512,
      height: 512,
    },
    email: SITE.email,
    founder: personSchema(),
    sameAs: [SITE.repoUrl],
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { '@id': `${SITE.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function webPageSchema(
  name: string,
  description: string,
  path: string,
): Record<string, unknown> {
  return {
    '@type': 'WebPage',
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { '@id': `${SITE.url}/#website` },
    inLanguage: SITE.language,
  };
}

interface ArticleSchemaInput {
  title: string;
  description: string;
  path: string;
  pubDate: Date;
  updatedDate?: Date;
  categories: string[];
  tags: string[];
  image?: string;
}

export function articleSchema(input: ArticleSchemaInput): Record<string, unknown> {
  return {
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(input.path),
    },
    datePublished: input.pubDate.toISOString(),
    dateModified: (input.updatedDate ?? input.pubDate).toISOString(),
    author: personSchema(),
    publisher: { '@id': `${SITE.url}/#organization` },
    image: absoluteUrl(input.image ?? SITE.ogImage),
    articleSection: input.categories,
    keywords: input.tags,
    inLanguage: SITE.language,
    isAccessibleForFree: true,
  };
}

export function softwareApplicationSchema(
  tool: ToolDefinition,
  path: string,
): Record<string, unknown> {
  return {
    '@type': 'SoftwareApplication',
    name: tool.title,
    description: tool.description,
    url: absoluteUrl(path),
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'Browser tool',
    operatingSystem: 'Any (modern web browser)',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: personSchema(),
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function profilePageSchema(): Record<string, unknown> {
  return {
    '@type': 'ProfilePage',
    '@id': `${absoluteUrl(SITE.authorUrl)}#profile`,
    url: absoluteUrl(SITE.authorUrl),
    name: `${PROFILE.name} — ${PROFILE.role}`,
    description: PROFILE.shortBio,
    inLanguage: SITE.language,
    isPartOf: { '@id': `${SITE.url}/#website` },
    mainEntity: personSchema(),
    dateModified: '2026-10-25',
  };
}

export function learningPathSchema(
  title: string,
  description: string,
  path: string,
  steps: { title: string; href: string }[],
): Record<string, unknown> {
  return {
    '@type': 'ItemList',
    name: title,
    description,
    url: absoluteUrl(path),
    numberOfItems: steps.length,
    itemListElement: steps.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.title,
      url: absoluteUrl(step.href),
    })),
  };
}
