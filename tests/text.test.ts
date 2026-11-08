import { describe, expect, it } from 'vitest';
import {
  cleanWhitespace,
  convertCase,
  countText,
  countWords,
  decodeBase64,
  decodeHtmlEntities,
  decodeUrl,
  encodeBase64,
  encodeHtmlEntities,
  estimateReadingMinutes,
  slugify,
  unicodeSummary,
} from '../src/lib/text';

describe('slugify', () => {
  it('creates readable ASCII slugs', () => {
    expect(slugify('Hello, World! & Friends')).toBe('hello-world-and-friends');
    expect(slugify('Café déjà vu')).toBe('cafe-deja-vu');
    expect(slugify('  Multiple   spaces  ')).toBe('multiple-spaces');
    expect(slugify('Hello_World', { separator: '_' })).toBe('hello_world');
  });

  it('can preserve non-ASCII characters', () => {
    expect(slugify('東京', { foldAccents: true })).toBe('');
    expect(slugify('東京', { foldAccents: false })).toBe('東京');
  });

  it('respects a maximum length without trailing separators', () => {
    const value = slugify('one two three four five', { maxLength: 13 });
    expect(value.length).toBeLessThanOrEqual(13);
    expect(value.endsWith('-')).toBe(false);
  });
});

describe('case conversion', () => {
  it('converts identifier styles', () => {
    expect(convertCase('Hello world_example', 'camel')).toBe('helloWorldExample');
    expect(convertCase('Hello world_example', 'pascal')).toBe('HelloWorldExample');
    expect(convertCase('Hello world_example', 'snake')).toBe('hello_world_example');
    expect(convertCase('Hello world_example', 'kebab')).toBe('hello-world-example');
    expect(convertCase('Hello world_example', 'constant')).toBe('HELLO_WORLD_EXAMPLE');
  });

  it('handles sentence and title case without destroying acronym splitting', () => {
    expect(convertCase('hello WORLD. this is A TEST', 'sentence')).toBe(
      'Hello world. This is a test',
    );
    expect(convertCase('the lord of the rings', 'title')).toBe(
      'The Lord of the Rings',
    );
    expect(convertCase('HTTPServer Error', 'snake')).toBe('http_server_error');
  });
});

describe('text statistics', () => {
  it('counts words, sentences, paragraphs, and lines', () => {
    const stats = countText('Hello world.\n\nSecond line!');
    expect(stats.words).toBe(4);
    expect(stats.sentences).toBe(2);
    expect(stats.paragraphs).toBe(2);
    expect(stats.lines).toBe(3);
    expect(stats.characters).toBe(26);
    expect(stats.charactersNoSpaces).toBe(22);
  });

  it('estimates reading time with a minimum of one minute', () => {
    expect(estimateReadingMinutes('')).toBe(0);
    expect(estimateReadingMinutes('one two three', 200)).toBe(1);
    expect(estimateReadingMinutes('word '.repeat(201), 200)).toBe(2);
    expect(countWords('  ')).toBe(0);
  });
});

describe('whitespace cleanup', () => {
  it('trims and collapses as requested', () => {
    expect(cleanWhitespace('  a  b  \n\n c ', 'trim-lines')).toBe('a  b\n\nc');
    expect(cleanWhitespace('  a  b  \n\n c ', 'collapse-spaces')).toBe(
      'a b\n\nc',
    );
    expect(cleanWhitespace('a\n\n\nb\n\n', 'remove-blank-lines')).toBe('a\nb');
    expect(cleanWhitespace('a\r\nb\rc', 'normalize-newlines')).toBe('a\nb\nc');
  });
});

describe('HTML entities', () => {
  it('encodes special characters', () => {
    expect(encodeHtmlEntities('<a href="x">Tom & Jerry\'s</a>')).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;',
    );
  });

  it('decodes named and numeric entities', () => {
    expect(decodeHtmlEntities('Tom &amp; Jerry &copy; &#169; &#x1F44B;')).toBe(
      'Tom & Jerry © © 👋',
    );
    expect(decodeHtmlEntities('&unknown;')).toBe('&unknown;');
    expect(decodeHtmlEntities('&#x110000;')).toBe('&#x110000;');
  });

  it('optionally encodes non-ASCII characters', () => {
    expect(encodeHtmlEntities('café', true)).toBe('caf&#233;');
  });
});

describe('Base64 and URLs', () => {
  it('round-trips UTF-8 text', () => {
    const text = 'Hello, 世界 👋';
    expect(decodeBase64(encodeBase64(text))).toBe(text);
  });

  it('supports URL-safe output without padding', () => {
    const encoded = encodeBase64('ÿþ', true);
    expect(encoded).not.toMatch(/[+/=]/u);
    expect(decodeBase64(encoded, true)).toBe('ÿþ');
  });

  it('rejects malformed input', () => {
    expect(() => decodeBase64('!!!!')).toThrow();
    expect(() => decodeBase64('//8=')).toThrow(/UTF-8/u);
    expect(() => decodeUrl('%E0%A4%A')).toThrow(/malformed/u);
  });
});

describe('Unicode summary', () => {
  it('counts code points, UTF units, bytes, and graphemes', () => {
    expect(unicodeSummary('👋')).toEqual({
      codePoints: 1,
      utf16Units: 2,
      utf8Bytes: 4,
      graphemeClusters: 1,
    });
    expect(unicodeSummary('é').utf8Bytes).toBe(2);
  });
});
