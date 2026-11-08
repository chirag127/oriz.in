import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';
import { rehypeContent } from './src/lib/rehype-content.mjs';
import { LEGACY_ARTICLE_REDIRECTS } from './src/data/legacy-redirects';

const legacyArticlePaths = new Set(
  Object.keys(LEGACY_ARTICLE_REDIRECTS).map((slug) => `/articles/${slug}/`),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://oriz.in',
  trailingSlash: 'always',
  output: 'static',
  compressHTML: true,
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        if (pathname.startsWith('/search/') || pathname.startsWith('/404')) return false;
        if (pathname === '/categories/' || pathname.startsWith('/categories/')) return false;
        if (legacyArticlePaths.has(pathname)) return false;
        return true;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-high-contrast',
      wrap: true,
    },
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [rehypeKatex, { throwOnError: false, strict: false }],
        rehypeSlug,
        rehypeContent,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: {
              className: ['heading-anchor'],
              ariaLabel: 'Link to this section',
            },
            content: { type: 'text', value: '#' },
          },
        ],
      ],
    }),
  },
  vite: {
    build: {
      assetsInlineLimit: 2048,
    },
  },
});
