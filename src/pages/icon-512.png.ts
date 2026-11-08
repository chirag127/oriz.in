import type { APIRoute } from 'astro';
import { renderIconPng } from '../lib/brand-images';

export const GET: APIRoute = () => renderIconPng();
