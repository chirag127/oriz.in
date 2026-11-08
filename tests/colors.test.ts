import { describe, expect, it } from 'vitest';
import {
  buildGradientCss,
  evaluateContrast,
  parseColor,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
} from '../src/lib/colors';

describe('color parsing', () => {
  it('parses HEX, RGB, and HSL inputs', () => {
    expect(parseColor('#F97316')).toEqual({ r: 249, g: 115, b: 22 });
    expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColor('rgb(249, 115, 22)')).toEqual({ r: 249, g: 115, b: 22 });
    expect(parseColor('rgb(100% 0% 0%)')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColor('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('converts color representations', () => {
    const rgb = parseColor('#F97316');
    expect(rgbToHex(rgb)).toBe('#F97316');
    const hsl = rgbToHsl(rgb);
    expect(hsl.h).toBeCloseTo(24.6, 1);
    const hsv = rgbToHsv(rgb);
    expect(hsv.s).toBeCloseTo(91.2, 1);
  });

  it('rejects malformed colors', () => {
    expect(() => parseColor('not-a-color')).toThrow();
    expect(() => parseColor('rgb(300, 0, 0)')).toThrow();
    expect(() => parseColor('hsl(0, 120%, 50%)')).toThrow();
  });
});

describe('contrast checking', () => {
  it('computes the maximum black/white contrast', () => {
    const result = evaluateContrast(parseColor('#000'), parseColor('#FFF'));
    expect(result.ratio).toBeCloseTo(21, 5);
    expect(result.normalAAA).toBe(true);
  });

  it('flags a mid grey that fails normal AA', () => {
    const result = evaluateContrast(parseColor('#777777'), parseColor('#FFFFFF'));
    expect(result.ratio).toBeGreaterThan(4);
    expect(result.ratio).toBeLessThan(4.5);
    expect(result.normalAA).toBe(false);
    expect(result.largeAA).toBe(true);
  });
});

describe('gradient CSS', () => {
  it('sorts stops and emits valid linear-gradient syntax', () => {
    const css = buildGradientCss({
      type: 'linear',
      angle: 90,
      stops: [
        { color: parseColor('#0000FF'), position: 100 },
        { color: parseColor('#FF0000'), position: 0 },
      ],
    });
    expect(css).toBe('linear-gradient(90deg, #FF0000 0%, #0000FF 100%)');
  });

  it('supports radial gradients and rejects one-stop gradients', () => {
    const css = buildGradientCss({
      type: 'radial',
      angle: 0,
      stops: [
        { color: parseColor('#FFFFFF'), position: 0 },
        { color: parseColor('#F97316'), position: 100 },
      ],
    });
    expect(css.startsWith('radial-gradient(')).toBe(true);
    expect(() =>
      buildGradientCss({
        type: 'linear',
        angle: 0,
        stops: [{ color: parseColor('#000'), position: 0 }],
      }),
    ).toThrow(/two color stops/u);
  });
});
