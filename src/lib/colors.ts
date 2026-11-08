export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export interface Hsv {
  h: number;
  s: number;
  v: number;
}

const HEX_PATTERN = /^#?([\da-f]{3}|[\da-f]{6})$/iu;
const RGB_PATTERN = /^rgba?\((.*)\)$/iu;
const HSL_PATTERN = /^hsla?\((.*)\)$/iu;

export function parseColor(input: string): Rgb {
  const value = input.trim();
  if (!value) throw new Error('Enter a color value.');

  const hex = value.match(HEX_PATTERN);
  if (hex) {
    let digits = hex[1]!;
    if (digits.length === 3) {
      digits = digits
        .split('')
        .map((digit) => digit + digit)
        .join('');
    }
    return {
      r: Number.parseInt(digits.slice(0, 2), 16),
      g: Number.parseInt(digits.slice(2, 4), 16),
      b: Number.parseInt(digits.slice(4, 6), 16),
    };
  }

  const rgbMatch = value.match(RGB_PATTERN);
  if (rgbMatch) {
    const components = splitComponents(rgbMatch[1]!);
    if (components.length !== 3) {
      throw new Error('RGB colors need exactly three channel values.');
    }
    return {
      r: parseChannel(components[0]!, 'red'),
      g: parseChannel(components[1]!, 'green'),
      b: parseChannel(components[2]!, 'blue'),
    };
  }

  const hslMatch = value.match(HSL_PATTERN);
  if (hslMatch) {
    const components = splitComponents(hslMatch[1]!);
    if (components.length !== 3) {
      throw new Error('HSL colors need hue, saturation, and lightness.');
    }
    const h = parseAngle(components[0]!);
    const s = parsePercentage(components[1]!, 'saturation');
    const l = parsePercentage(components[2]!, 'lightness');
    return hslToRgb({ h, s, l });
  }

  throw new Error(
    'Use a HEX color (#f97316), rgb(249, 115, 22), or hsl(25, 95%, 53%) value.',
  );
}

function splitComponents(value: string): string[] {
  const normalized = value.replace(/\//gu, ' ').replace(/,/gu, ' ').trim();
  return normalized.split(/\s+/u).filter(Boolean);
}

function parseChannel(raw: string, label: string): number {
  const isPercent = raw.endsWith('%');
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`The ${label} channel is not a number.`);
  }
  const channel = isPercent ? Math.round((value / 100) * 255) : Math.round(value);
  if (channel < 0 || channel > 255) {
    throw new Error(`The ${label} channel must be between 0 and 255.`);
  }
  return channel;
}

function parsePercentage(raw: string, label: string): number {
  const value = Number.parseFloat(raw.replace('%', ''));
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`${label[0]!.toUpperCase()}${label.slice(1)} must be between 0% and 100%.`);
  }
  return value;
}

function parseAngle(raw: string): number {
  const value = Number.parseFloat(raw.replace(/deg$/iu, ''));
  if (!Number.isFinite(value)) {
    throw new Error('Hue must be a number of degrees.');
  }
  return ((value % 360) + 360) % 360;
}

export function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

export function rgbToHex(rgb: Rgb): string {
  const toHex = (channel: number) => clampChannel(channel).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

export function rgbToHsl(rgb: Rgb): Hsl {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      default:
        h = (r - g) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h: Math.round(h * 10) / 10,
    s: Math.round(s * 1000) / 10,
    l: Math.round(l * 1000) / 10,
  };
}

export function hslToRgb(hsl: Hsl): Rgb {
  const h = ((hsl.h % 360) + 360) % 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rgb: [number, number, number];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];

  return {
    r: clampChannel((rgb[0] + m) * 255),
    g: clampChannel((rgb[1] + m) * 255),
    b: clampChannel((rgb[2] + m) * 255),
  };
}

export function rgbToHsv(rgb: Rgb): Hsv {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return {
    h: Math.round(h * 10) / 10,
    s: Math.round((max === 0 ? 0 : delta / max) * 1000) / 10,
    v: Math.round(max * 1000) / 10,
  };
}

export function relativeLuminance(rgb: Rgb): number {
  const convert = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  const r = convert(rgb.r);
  const g = convert(rgb.g);
  const b = convert(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(first: Rgb, second: Rgb): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

export interface ContrastResults {
  ratio: number;
  normalAA: boolean;
  normalAAA: boolean;
  largeAA: boolean;
  largeAAA: boolean;
  uiAA: boolean;
}

export function evaluateContrast(first: Rgb, second: Rgb): ContrastResults {
  const ratio = contrastRatio(first, second);
  return {
    ratio,
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
    uiAA: ratio >= 3,
  };
}

export interface GradientStop {
  color: Rgb;
  position: number;
}

export interface GradientOptions {
  type: 'linear' | 'radial';
  angle: number;
  stops: GradientStop[];
}

export function buildGradientCss(options: GradientOptions): string {
  if (options.stops.length < 2) {
    throw new Error('A gradient needs at least two color stops.');
  }
  const stops = [...options.stops]
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${rgbToHex(stop.color)} ${clampPercent(stop.position)}%`)
    .join(', ');

  if (options.type === 'radial') {
    return `radial-gradient(circle at 50% 50%, ${stops})`;
  }
  return `linear-gradient(${Math.round(options.angle)}deg, ${stops})`;
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function colorSummary(input: string) {
  const rgb = parseColor(input);
  return {
    rgb,
    hex: rgbToHex(rgb),
    rgbCss: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: rgbToHsl(rgb),
    hsv: rgbToHsv(rgb),
  };
}
