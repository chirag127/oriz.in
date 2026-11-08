import type { APIRoute } from 'astro';
import { renderOgPng } from '../lib/brand-images';

export const GET: APIRoute = () => renderOgPng();
