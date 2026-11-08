import type { APIRoute } from 'astro';
import { LEARNING_PATHS } from '../../data/learning-paths';
import {
  getLearningPathSteps,
  loadContentIndex,
} from '../../lib/content';
import { jsonResponse, withVersion, publicUrl } from '../../lib/export';

export const GET: APIRoute = async () => {
  const { articlesById } = await loadContentIndex();
  const paths = LEARNING_PATHS.map((path) => ({
    slug: path.slug,
    title: path.title,
    description: path.description,
    audience: path.audience,
    level: path.level,
    time: path.time,
    updated: path.updated,
    url: publicUrl(`/learn/${path.slug}/`),
    steps: getLearningPathSteps(path, articlesById).map((step) => ({
      kind: step.kind,
      title: step.title,
      note: step.note ?? null,
      description: step.description ?? null,
      url: publicUrl(step.href),
    })),
  }));
  return jsonResponse(withVersion('learningPaths', paths));
};
