import { describe, expect, it } from 'vitest';
import { parseGuidePath, parseLibraryPath, stripArticlePrefix } from '../src/lib/library';

describe('library paths', () => {
  it('parses a nested article path', () => {
    expect(
      parseLibraryPath(
        'C:/repo/src/content/library/money-finance/gold/gold-in-india/02-sgb-2-5-interest.md',
      ),
    ).toEqual({
      domain: 'money-finance',
      category: 'gold',
      series: 'gold-in-india',
      order: 2,
      slug: 'sgb-2-5-interest',
    });
  });

  it('parses Windows separators', () => {
    expect(
      parseLibraryPath(
        'C:\\repo\\src\\content\\library\\technology\\backend-apis\\reliable-apis\\01-secure-api-design.md',
      ),
    ).toEqual({
      domain: 'technology',
      category: 'backend-apis',
      series: 'reliable-apis',
      order: 1,
      slug: 'secure-api-design',
    });
  });

  it('rejects a flat path', () => {
    expect(parseLibraryPath('src/content/articles/foo.md')).toBeNull();
  });

  it('rejects a missing numeric prefix', () => {
    expect(
      parseLibraryPath('src/content/library/money-finance/gold/gold-in-india/sgb.md'),
    ).toBeNull();
  });

  it('strips numeric prefixes from slugs', () => {
    expect(stripArticlePrefix('01-emergency-fund-sizing')).toBe('emergency-fund-sizing');
    expect(stripArticlePrefix('sgb-2-5-interest')).toBe('sgb-2-5-interest');
  });

  it('parses guide paths', () => {
    expect(parseGuidePath('src/content/guides/money-finance/gold.md')).toEqual({
      domain: 'money-finance',
      category: 'gold',
    });
  });
});
