import { describe, expect, it } from 'vitest';
import {
  analyzeNumber,
  calculateAspectRatio,
  calculatePercentage,
  convertIntegerBases,
  countSignificantFigures,
  formatNumber,
  parseIntegerInBase,
} from '../src/lib/math';

describe('percentage calculator', () => {
  it('calculates a percentage of a number', () => {
    expect(calculatePercentage('of', 25, 200).value).toBe(50);
    expect(calculatePercentage('of', 2.5, 200).value).toBe(5);
  });

  it('calculates what percent one value is of another', () => {
    expect(calculatePercentage('is-what-percent', 50, 200).value).toBe(25);
    expect(() => calculatePercentage('is-what-percent', 50, 0)).toThrow();
  });

  it('calculates percentage change with direction', () => {
    const increase = calculatePercentage('change', 100, 125);
    expect(increase.value).toBe(25);
    expect(increase.note).toMatch(/increased/u);
    expect(calculatePercentage('change', 100, 80).value).toBe(-20);
    expect(() => calculatePercentage('change', 0, 10)).toThrow();
  });
});

describe('number bases', () => {
  it('converts between bases', () => {
    expect(convertIntegerBases('255', 10)).toEqual({
      2: '11111111',
      8: '377',
      10: '255',
      16: 'FF',
    });
    expect(parseIntegerInBase('0xFF', 16)).toBe(255n);
    expect(parseIntegerInBase('-1010', 2)).toBe(-10n);
    expect(convertIntegerBases('-10', 10)[2]).toBe('-1010');
  });

  it('rejects invalid digits', () => {
    expect(() => parseIntegerInBase('102', 2)).toThrow();
    expect(() => parseIntegerInBase('8', 8)).toThrow();
    expect(() => parseIntegerInBase('', 10)).toThrow();
  });
});

describe('scientific notation', () => {
  it('produces scientific and engineering output', () => {
    const result = analyzeNumber('1234.5');
    expect(result.scientific).toBe('1.2345 × 10^3');
    expect(result.eNotation).toBe('1.2345e3');
    expect(result.engineering).toBe('1.2345 × 10^3');
    expect(result.decimal).toBe('1234.5');
  });

  it('handles zero and tiny numbers', () => {
    expect(analyzeNumber('0').eNotation).toBe('0e0');
    const tiny = analyzeNumber('0.000123');
    expect(tiny.exponent).toBe(-4);
    expect(tiny.engineering).toContain('× 10^-6');
    expect(() => analyzeNumber('not a number')).toThrow();
  });

  it('counts significant figures conservatively', () => {
    expect(countSignificantFigures('1.20')).toBe(3);
    expect(countSignificantFigures('0.00120')).toBe(3);
    expect(countSignificantFigures('100')).toBe(1);
    expect(countSignificantFigures('100.')).toBe(3);
  });
});

describe('aspect ratio', () => {
  it('simplifies common ratios', () => {
    const result = calculateAspectRatio(1920, 1080);
    expect(result.simplified).toBe('16:9');
    expect(result.decimal).toBeCloseTo(1.7778, 3);
  });

  it('scales a missing dimension', () => {
    const result = calculateAspectRatio(1920, 1080, 1280);
    expect(result.scaledHeight).toBeCloseTo(720, 6);
    expect(result.mismatch).toBe(false);
  });

  it('flags mismatched target dimensions', () => {
    expect(calculateAspectRatio(1920, 1080, 1000, 1000).mismatch).toBe(true);
    expect(() => calculateAspectRatio(0, 100)).toThrow();
  });
});

describe('number formatting', () => {
  it('formats large and small numbers sensibly', () => {
    expect(formatNumber(1234567.891)).toBe('1,234,567.891');
    expect(formatNumber(0.0000001)).toBe('1.0000e-7');
    expect(formatNumber(Number.NaN)).toBe('—');
  });
});
