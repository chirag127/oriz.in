export type CaseStyle =
  | 'lower'
  | 'upper'
  | 'sentence'
  | 'title'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant';

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
}

const SMALL_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'from',
  'in',
  'into',
  'nor',
  'of',
  'on',
  'or',
  'the',
  'to',
  'vs',
  'via',
  'with',
]);

const wordSegmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter(undefined, { granularity: 'word' })
    : null;

export function countWords(input: string): number {
  if (!input.trim()) return 0;
  if (wordSegmenter) {
    let count = 0;
    for (const segment of wordSegmenter.segment(input)) {
      if (segment.isWordLike) count += 1;
    }
    return count;
  }
  return input.match(/[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

export function countText(input: string): TextStats {
  const characters = Array.from(input).length;
  const charactersNoSpaces = Array.from(input.replace(/\s/gu, '')).length;
  const trimmed = input.trim();
  const sentences = trimmed
    ? (trimmed.match(/[^.!?…]+[.!?…]+(?:["'”’)\]]*)|[^.!?…]+$/gu) ?? []).filter(
        (sentence) => /[\p{L}\p{N}]/u.test(sentence),
      ).length
    : 0;
  const paragraphs = trimmed
    ? trimmed.split(/\n[ \t]*\n+/u).filter((paragraph) => paragraph.trim()).length
    : 0;
  const lines = input ? input.split(/\r\n|\r|\n/u).length : 0;

  return {
    words: countWords(input),
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
  };
}

export function estimateReadingMinutes(
  input: string,
  wordsPerMinute = 200,
): number {
  const words = countWords(input);
  if (words === 0) return 0;
  const wpm = wordsPerMinute > 0 ? wordsPerMinute : 200;
  return Math.max(1, Math.ceil(words / wpm));
}

export function normalizeNewlines(input: string): string {
  return input.replace(/\r\n?/gu, '\n');
}

export interface SlugOptions {
  separator?: '-' | '_';
  foldAccents?: boolean;
  maxLength?: number;
}

export function slugify(input: string, options: SlugOptions = {}): string {
  const separator = options.separator ?? '-';
  const foldAccents = options.foldAccents ?? true;
  const maxLength = options.maxLength ?? 80;
  let value = input.normalize('NFKD');

  if (foldAccents) {
    value = value.replace(/\p{M}+/gu, '').replace(/[^\x00-\x7F]/gu, ' ');
  }

  value = value
    .toLowerCase()
    .replace(/['’"]/gu, '')
    .replace(/&/gu, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, separator);

  value = value.split(separator).filter(Boolean).join(separator);

  if (value.length > maxLength) {
    let truncated = value.slice(0, maxLength);
    const lastSeparator = truncated.lastIndexOf(separator);
    if (lastSeparator > 0) truncated = truncated.slice(0, lastSeparator);
    value = truncated;
  }

  if (value.endsWith(separator)) value = value.slice(0, -1);

  return value;
}

export function splitWords(input: string): string[] {
  return normalizeNewlines(input)
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2')
    .replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, '$1 $2')
    .split(/[^\p{L}\p{N}]+/gu)
    .filter(Boolean);
}

export function toSentenceCase(input: string): string {
  const normalized = input.toLocaleLowerCase();
  return normalized.replace(
    /(^|[.!?]\s+|\n\s*)(\p{L})/gu,
    (_match, prefix: string, letter: string) => prefix + letter.toLocaleUpperCase(),
  );
}

export function toTitleCase(input: string): string {
  const words = splitWords(input);
  return words
    .map((word, index) => {
      const lower = word.toLocaleLowerCase();
      if (
        index > 0 &&
        index < words.length - 1 &&
        SMALL_WORDS.has(lower)
      ) {
        return lower;
      }
      return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
    })
    .join(' ');
}

function identifierWords(input: string): string[] {
  return splitWords(input).map((word) => word.toLocaleLowerCase());
}

export function toCamelCase(input: string): string {
  const words = identifierWords(input);
  return words
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toLocaleUpperCase() + word.slice(1),
    )
    .join('');
}

export function toPascalCase(input: string): string {
  return identifierWords(input)
    .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
    .join('');
}

export function toSnakeCase(input: string): string {
  return identifierWords(input).join('_');
}

export function toKebabCase(input: string): string {
  return identifierWords(input).join('-');
}

export function toConstantCase(input: string): string {
  return identifierWords(input).join('_').toLocaleUpperCase();
}

export function convertCase(input: string, style: CaseStyle): string {
  switch (style) {
    case 'lower':
      return input.toLocaleLowerCase();
    case 'upper':
      return input.toLocaleUpperCase();
    case 'sentence':
      return toSentenceCase(input);
    case 'title':
      return toTitleCase(input);
    case 'camel':
      return toCamelCase(input);
    case 'pascal':
      return toPascalCase(input);
    case 'snake':
      return toSnakeCase(input);
    case 'kebab':
      return toKebabCase(input);
    case 'constant':
      return toConstantCase(input);
    default:
      return input;
  }
}

export type WhitespaceMode =
  | 'trim-lines'
  | 'collapse-spaces'
  | 'remove-blank-lines'
  | 'normalize-newlines'
  | 'all';

export function cleanWhitespace(input: string, mode: WhitespaceMode): string {
  const normalized = normalizeNewlines(input);
  switch (mode) {
    case 'trim-lines':
      return normalized
        .split('\n')
        .map((line) => line.replace(/[ \t]+$/u, '').replace(/^[ \t]+/u, ''))
        .join('\n');
    case 'collapse-spaces':
      return normalized
        .split('\n')
        .map((line) => line.replace(/[ \t]+/gu, ' ').trim())
        .join('\n');
    case 'remove-blank-lines':
      return normalized
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .join('\n');
    case 'normalize-newlines':
      return normalized;
    case 'all':
      return normalized
        .split('\n')
        .map((line) => line.replace(/[ \t]+/gu, ' ').trim())
        .filter((line) => line.length > 0)
        .join('\n');
    default:
      return normalized;
  }
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
  copy: '©',
  reg: '®',
  trade: '™',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  times: '×',
  divide: '÷',
  deg: '°',
  plusmn: '±',
  frac12: '½',
  frac14: '¼',
  frac34: '¾',
  euro: '€',
  pound: '£',
  yen: '¥',
  cent: '¢',
  sect: '§',
  para: '¶',
  middot: '·',
  bull: '•',
  laquo: '«',
  raquo: '»',
  larr: '←',
  rarr: '→',
  uarr: '↑',
  darr: '↓',
  harr: '↔',
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  pi: 'π',
  sigma: 'σ',
  omega: 'ω',
  ensp: '\u2002',
  emsp: '\u2003',
  thinsp: '\u2009',
  zwj: '\u200d',
  zwnj: '\u200c',
};

export function encodeHtmlEntities(
  input: string,
  encodeNonAscii = false,
): string {
  let result = input
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#39;');

  if (encodeNonAscii) {
    result = Array.from(result)
      .map((character) => {
        const codePoint = character.codePointAt(0);
        if (codePoint !== undefined && codePoint > 127) {
          return `&#${codePoint};`;
        }
        return character;
      })
      .join('');
  }

  return result;
}

export function decodeHtmlEntities(input: string): string {
  return input.replace(
    /&(#x[\da-f]+|#\d+|[a-z][a-z\d]+);/giu,
    (match, entity: string) => {
      if (entity.startsWith('#x') || entity.startsWith('#X')) {
        return safeCodePoint(Number.parseInt(entity.slice(2), 16), match);
      }
      if (entity.startsWith('#')) {
        return safeCodePoint(Number.parseInt(entity.slice(1), 10), match);
      }
      return NAMED_ENTITIES[entity.toLocaleLowerCase()] ?? match;
    },
  );
}

function safeCodePoint(value: number, fallback: string): string {
  if (
    !Number.isInteger(value) ||
    value <= 0 ||
    value > 0x10ffff ||
    (value >= 0xd800 && value <= 0xdfff)
  ) {
    return fallback;
  }
  return String.fromCodePoint(value);
}

export function encodeUrlComponent(input: string): string {
  return encodeURIComponent(input);
}

export function encodeFullUrl(input: string): string {
  return encodeURI(input);
}

export function decodeUrl(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    throw new Error(
      'The input contains a malformed percent-escape sequence and cannot be decoded.',
    );
  }
}

export type Base64Mode = 'encode' | 'decode';

export function encodeBase64(input: string, urlSafe = false): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  const base64 = btoa(binary);
  if (!urlSafe) return base64;
  return base64.replace(/\+/gu, '-').replace(/\//gu, '_').replace(/=+$/u, '');
}

export function decodeBase64(input: string, urlSafe = false): string {
  let normalized = input.replace(/\s+/gu, '');
  if (!normalized) return '';
  if (urlSafe) {
    normalized = normalized.replace(/-/gu, '+').replace(/_/gu, '/');
  }
  normalized = normalized.replace(/=+$/u, '');
  if (!/^[A-Za-z0-9+/]*$/u.test(normalized)) {
    throw new Error('The input contains characters that are not valid Base64.');
  }
  if (normalized.length % 4 === 1) {
    throw new Error('The Base64 input has an invalid length.');
  }
  const padding = (4 - (normalized.length % 4)) % 4;
  normalized += '='.repeat(padding);

  let binary: string;
  try {
    binary = atob(normalized);
  } catch {
    throw new Error('The Base64 input could not be decoded.');
  }

  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('The decoded bytes are not valid UTF-8 text.');
  }
}

export interface UnicodeSummary {
  codePoints: number;
  utf16Units: number;
  utf8Bytes: number;
  graphemeClusters: number;
}

export function unicodeSummary(input: string): UnicodeSummary {
  const codePoints = Array.from(input).length;
  let graphemeClusters = codePoints;
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    graphemeClusters = Array.from(segmenter.segment(input)).length;
  }
  return {
    codePoints,
    utf16Units: input.length,
    utf8Bytes: new TextEncoder().encode(input).length,
    graphemeClusters,
  };
}
