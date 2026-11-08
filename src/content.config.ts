import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { stripArticlePrefix } from './lib/library';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const referenceSchema = z.object({
  title: z.string().min(2).max(200),
  url: z.url().optional(),
  note: z.string().max(300).optional(),
});

const questionSchema = z.object({
  question: z.string().min(5).max(180),
  answer: z.string().min(10).max(500),
});

const articleSchema = z
  .object({
    title: z.string().min(5).max(120),
    description: z.string().min(50).max(240),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().min(2).max(80).default('Chirag Singhal'),
    type: z
      .enum(['article', 'guide', 'tutorial', 'reference', 'explainer', 'documentation'])
      .default('article'),
    tags: z.array(z.string().regex(slugPattern)).max(8).default([]),
    draft: z.boolean().default(false),
    toc: z.boolean().default(true),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    related: z.array(z.string().regex(slugPattern)).max(6).default([]),
    prerequisites: z.array(z.string().regex(slugPattern)).max(6).default([]),
    learningPaths: z.array(z.string().regex(slugPattern)).max(4).default([]),
    canonical: z.url().optional(),
    image: z.string().startsWith('/').optional(),
    imageAlt: z.string().min(4).max(200).optional(),
    imageWidth: z.number().int().positive().optional(),
    imageHeight: z.number().int().positive().optional(),
    references: z.array(referenceSchema).max(20).default([]),
    keyPoints: z.array(z.string().min(10).max(220)).max(6).default([]),
    disclaimer: z.string().max(400).optional(),
    legal: z.enum(['legal', 'grey', 'illegal', 'reference']).optional(),
    source: z
      .object({
        title: z.string().min(2).max(120),
        url: z.url().optional(),
        license: z.string().max(80).optional(),
      })
      .optional(),
    contentWarnings: z.array(z.string().max(120)).max(5).default([]),
    reviewStatus: z
      .enum(['editorial', 'technical-review', 'community-review'])
      .optional(),
    license: z.string().default('CC BY 4.0'),
    noindex: z.boolean().default(false),
  })
  .strict()
  .refine((data) => !data.image || (data.imageAlt && data.imageWidth && data.imageHeight), {
    message:
      'Article images require imageAlt, imageWidth, and imageHeight for accessibility and layout stability.',
    path: ['image'],
  })
  .refine((data) => !data.updatedDate || data.updatedDate >= data.pubDate, {
    message: 'updatedDate cannot be earlier than pubDate.',
    path: ['updatedDate'],
  });

const guideSchema = z
  .object({
    title: z.string().min(5).max(100),
    description: z.string().min(50).max(200),
    updated: z.coerce.date(),
    heroImage: z.string().startsWith('/'),
    heroImageAlt: z.string().min(4).max(200),
    keyQuestions: z.array(questionSchema).max(6).default([]),
    startHere: z.array(z.string().regex(slugPattern)).max(8).default([]),
    faq: z.array(questionSchema).max(10).default([]),
    tools: z.array(z.string().regex(slugPattern)).max(12).default([]),
    featuredArticles: z.array(z.string().regex(slugPattern)).max(8).default([]),
  })
  .strict();

const articles = defineCollection({
  loader: glob({
    base: './src/content/library',
    pattern: '**/*.md',
    generateId: ({ entry }) =>
      stripArticlePrefix(entry.split('/').pop()?.replace(/\.md$/u, '') ?? ''),
  }),
  schema: articleSchema,
});

const guides = defineCollection({
  loader: glob({
    base: './src/content/guides',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.split('/').pop()?.replace(/\.md$/u, '') ?? '',
  }),
  schema: guideSchema,
});

export const collections = { articles, guides };
