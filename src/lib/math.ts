export interface NumberFormatOptions {
  maxFractionDigits?: number;
  minFractionDigits?: number;
  useGrouping?: boolean;
}

export function formatNumber(
  value: number,
  options: NumberFormatOptions = {},
): string {
  if (!Number.isFinite(value)) return '—';
  const {
    maxFractionDigits = 6,
    minFractionDigits = 0,
    useGrouping = true,
  } = options;
  const absolute = Math.abs(value);
  if (absolute !== 0 && (absolute >= 1e15 || absolute < 1e-6)) {
    return value.toExponential(4);
  }
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: minFractionDigits,
    useGrouping,
  }).format(value);
}

export function formatMoney(value: number): string {
  return formatNumber(value, {
    maxFractionDigits: 2,
    minFractionDigits: 2,
  });
}

export function formatPercent(value: number): string {
  return `${formatNumber(value, { maxFractionDigits: 2 })}%`;
}

export type PercentageMode = 'of' | 'is-what-percent' | 'change';

export interface PercentageResult {
  value: number;
  formula: string;
  suffix: '%' | '';
  note?: string;
}

export function calculatePercentage(
  mode: PercentageMode,
  first: number,
  second: number,
): PercentageResult {
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    throw new Error('Enter two finite numbers.');
  }

  switch (mode) {
    case 'of':
      return {
        value: (first / 100) * second,
        formula: `${formatNumber(first)}% × ${formatNumber(second)}`,
        suffix: '',
      };
    case 'is-what-percent':
      if (second === 0) {
        throw new Error('The second value cannot be zero when dividing.');
      }
      return {
        value: (first / second) * 100,
        formula: `(${formatNumber(first)} ÷ ${formatNumber(second)}) × 100`,
        suffix: '%',
      };
    case 'change':
      if (first === 0) {
        throw new Error('Percentage change is undefined when the original value is zero.');
      }
      return {
        value: ((second - first) / Math.abs(first)) * 100,
        formula: `((${formatNumber(second)} − ${formatNumber(first)}) ÷ |${formatNumber(first)}|) × 100`,
        suffix: '%',
        note:
          second >= first
            ? 'The value increased.'
            : 'The value decreased.',
      };
    default:
      throw new Error('Unknown percentage mode.');
  }
}

export type Base = 2 | 8 | 10 | 16;

export const NUMBER_BASES: { value: Base; label: string; prefix: string }[] = [
  { value: 2, label: 'Binary', prefix: '0b' },
  { value: 8, label: 'Octal', prefix: '0o' },
  { value: 10, label: 'Decimal', prefix: '' },
  { value: 16, label: 'Hexadecimal', prefix: '0x' },
];

const DIGITS: Record<Base, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^\d+$/,
  16: /^[\da-f]+$/i,
};

export function parseIntegerInBase(input: string, base: Base): bigint {
  let value = input.trim().replace(/_/gu, '');
  if (!value) throw new Error('Enter an integer.');
  let negative = false;
  if (value.startsWith('-')) {
    negative = true;
    value = value.slice(1);
  } else if (value.startsWith('+')) {
    value = value.slice(1);
  }
  const prefix = NUMBER_BASES.find((entry) => entry.value === base)?.prefix;
  if (prefix && value.toLocaleLowerCase().startsWith(prefix)) {
    value = value.slice(2);
  }
  if (!value || !DIGITS[base].test(value)) {
    throw new Error(
      `The value is not a valid base-${base} integer. Use only its allowed digits.`,
    );
  }
  const parsed = BigInt(
    base === 16 ? `0x${value}` : base === 8 ? `0o${value}` : base === 2 ? `0b${value}` : value,
  );
  return negative ? -parsed : parsed;
}

export function formatIntegerInBase(value: bigint, base: Base): string {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const formatted = absolute.toString(base).toUpperCase();
  return negative ? `-${formatted}` : formatted;
}

export function convertIntegerBases(
  input: string,
  base: Base,
): Record<Base, string> {
  const value = parseIntegerInBase(input, base);
  return {
    2: formatIntegerInBase(value, 2),
    8: formatIntegerInBase(value, 8),
    10: formatIntegerInBase(value, 10),
    16: formatIntegerInBase(value, 16),
  };
}

export function countSignificantFigures(input: string): number {
  const cleaned = input
    .trim()
    .replace(/^[+-]/u, '')
    .split(/[eE]/u)[0]
    .replace(/,/gu, '');
  const digitsOnly = cleaned.replace('.', '');
  const withoutLeadingZeros = digitsOnly.replace(/^0+/u, '');
  if (!withoutLeadingZeros) return 0;
  if (!cleaned.includes('.')) {
    return withoutLeadingZeros.replace(/0+$/u, '').length || 1;
  }
  return withoutLeadingZeros.length;
}

export interface ScientificResult {
  value: number;
  scientific: string;
  eNotation: string;
  engineering: string;
  decimal: string;
  exponent: number;
  significantFigures: number;
}

function trimMantissa(value: string): string {
  if (!value.includes('.')) return value;
  return value.replace(/0+$/u, '').replace(/\.$/u, '');
}

function formatScientific(value: number, precision: number): ScientificResult {
  const significantFigures = countSignificantFigures(String(value));
  if (value === 0) {
    return {
      value,
      scientific: '0 × 10^0',
      eNotation: '0e0',
      engineering: '0 × 10^0',
      decimal: '0',
      exponent: 0,
      significantFigures,
    };
  }

  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const scientificMantissa = value / 10 ** exponent;
  const engineeringExponent = Math.floor(exponent / 3) * 3;
  const engineeringMantissa = value / 10 ** engineeringExponent;
  const digits = Math.max(1, Math.min(15, precision));

  return {
    value,
    scientific: `${trimMantissa(scientificMantissa.toFixed(digits - 1))} × 10^${exponent}`,
    eNotation: `${trimMantissa(scientificMantissa.toFixed(digits - 1))}e${exponent}`,
    engineering: `${trimMantissa(engineeringMantissa.toFixed(Math.max(0, digits - 1)))} × 10^${engineeringExponent}`,
    decimal: trimMantissa(value.toFixed(Math.max(0, digits - 1 - exponent))),
    exponent,
    significantFigures,
  };
}

export function analyzeNumber(raw: string, precision = 8): ScientificResult {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error('Enter a number.');
  let cleaned = trimmed;
  if (/^[+-]?\d{1,3}(,\d{3})+(\.\d+)?([eE][+-]?\d+)?$/u.test(cleaned)) {
    cleaned = cleaned.replace(/,/gu, '');
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    throw new Error('Enter a finite decimal number or a value in e-notation.');
  }
  return formatScientific(value, precision);
}

export interface AspectRatioResult {
  decimal: number;
  simplified: string;
  scaledWidth?: number;
  scaledHeight?: number;
  mismatch: boolean;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x;
}

export function calculateAspectRatio(
  width: number,
  height: number,
  newWidth?: number,
  newHeight?: number,
): AspectRatioResult {
  if (![width, height].every((value) => Number.isFinite(value) && value > 0)) {
    throw new Error('Width and height must be greater than zero.');
  }
  if (
    (newWidth !== undefined && (!Number.isFinite(newWidth) || newWidth <= 0)) ||
    (newHeight !== undefined && (!Number.isFinite(newHeight) || newHeight <= 0))
  ) {
    throw new Error('Target dimensions must be greater than zero.');
  }

  const decimal = width / height;
  let simplified: string;
  if (Number.isInteger(width) && Number.isInteger(height)) {
    const divisor = gcd(width, height);
    simplified = `${width / divisor}:${height / divisor}`;
  } else {
    simplified = `${formatNumber(decimal, { maxFractionDigits: 4 })}:1`;
  }

  let scaledWidth: number | undefined;
  let scaledHeight: number | undefined;
  let mismatch = false;

  if (newWidth !== undefined) {
    scaledWidth = newWidth;
    scaledHeight = newWidth / decimal;
  } else if (newHeight !== undefined) {
    scaledHeight = newHeight;
    scaledWidth = newHeight * decimal;
  }

  if (newWidth !== undefined && newHeight !== undefined) {
    scaledWidth = newWidth;
    scaledHeight = newHeight;
    mismatch = Math.abs(newWidth / newHeight - decimal) > 0.0001 * decimal;
  }

  return { decimal, simplified, scaledWidth, scaledHeight, mismatch };
}

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}
