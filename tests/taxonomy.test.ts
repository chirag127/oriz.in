import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  DOMAINS,
  SERIES,
  getCategory,
  getCategoryPath,
  getCategoriesForDomain,
  getSeriesForCategory,
} from '../src/data/taxonomy';

describe('taxonomy', () => {
  it('defines 15 domains with 11 live at launch', () => {
    expect(DOMAINS).toHaveLength(15);
    expect(DOMAINS.filter((domain) => domain.status === 'live')).toHaveLength(11);
  });

  it('defines 36 live categories', () => {
    expect(CATEGORIES.filter((category) => category.live)).toHaveLength(36);
  });

  it('gives every category at least one series', () => {
    for (const category of CATEGORIES) {
      expect(getSeriesForCategory(category.slug).length).toBeGreaterThan(0);
    }
  });

  it('resolves category paths from the domain', () => {
    expect(getCategory('gold')?.domain).toBe('money-finance');
    expect(getCategoryPath('gold')).toBe('/money-finance/gold/');
    expect(getCategoryPath('missing')).toBeUndefined();
  });

  it('resolves categories by domain without duplicates', () => {
    const categories = getCategoriesForDomain('technology');
    expect(categories.map((category) => category.slug)).toContain('backend-apis');
    expect(new Set(categories.map((category) => category.slug)).size).toBe(categories.length);
  });

  it('keeps series keys unique', () => {
    const keys = SERIES.map((series) => `${series.category}/${series.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
