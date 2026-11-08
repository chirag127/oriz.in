import { describe, expect, it } from 'vitest';
import { parseNumberList, summarize } from '../src/lib/stats';
import { jsonToCsv, parseCsv } from '../src/lib/csv';
import { parseJson, formatJson, summarizeJson } from '../src/lib/json';
import { diffLines, diffTokens, diffWords } from '../src/lib/diff';

describe('summary statistics', () => {
  it('computes center, spread, and quartiles', () => {
    const result = summarize([1, 2, 2, 3, 4]);
    expect(result.count).toBe(5);
    expect(result.sum).toBe(12);
    expect(result.mean).toBeCloseTo(2.4, 10);
    expect(result.median).toBe(2);
    expect(result.modes).toEqual([2]);
    expect(result.min).toBe(1);
    expect(result.max).toBe(4);
    expect(result.range).toBe(3);
    expect(result.q1).toBe(2);
    expect(result.q3).toBe(3);
    expect(result.iqr).toBe(1);
    expect(result.varianceSample).toBeCloseTo(1.3, 10);
    expect(result.standardDeviationSample).toBeCloseTo(Math.sqrt(1.3), 10);
    expect(result.variancePopulation).toBeCloseTo(1.04, 10);
  });

  it('handles a single value and no repeated modes', () => {
    const single = summarize([42]);
    expect(single.modes).toEqual([]);
    expect(single.varianceSample).toBeNull();
    expect(single.q1).toBe(42);
    const unique = summarize([1, 2, 3]);
    expect(unique.modes).toEqual([]);
  });

  it('parses mixed separators and rejects malformed input', () => {
    expect(parseNumberList('1, 2;3\n4.5\t-2')).toEqual([1, 2, 3, 4.5, -2]);
    expect(() => parseNumberList('1, nope, 3')).toThrow(/not a valid number/u);
    expect(() => parseNumberList('')).toThrow();
  });
});

describe('CSV parsing', () => {
  it('parses quoted fields, escapes, and embedded newlines', () => {
    const csv = 'name,note\n"Ada, A.","line 1\nline 2"\n"quote ""inside""",ok';
    expect(parseCsv(csv)).toEqual([
      ['name', 'note'],
      ['Ada, A.', 'line 1\nline 2'],
      ['quote "inside"', 'ok'],
    ]);
  });

  it('supports alternate delimiters and trailing fields', () => {
    expect(parseCsv('a;b;\n1;2;', ';')).toEqual([
      ['a', 'b', ''],
      ['1', '2', ''],
    ]);
  });

  it('reports unterminated quotes', () => {
    expect(() => parseCsv('a,"b')).toThrow(/not closed/u);
    expect(() => parseCsv('a,"b"c')).toThrow(/closing quote/u);
  });
});

describe('JSON to CSV', () => {
  it('uses a union of keys and escapes cells', () => {
    const result = jsonToCsv([
      { name: 'A, B', tags: ['x'], nested: { a: 1 } },
      { name: 'C', extra: true, tags: [] },
    ]);
    expect(result.columns).toEqual(['name', 'tags', 'nested', 'extra']);
    expect(result.rowCount).toBe(2);
    expect(result.csv.split('\n')[0]).toBe('name,tags,nested,extra');
    expect(result.csv).toContain('"A, B"');
    expect(result.csv).toContain('"[""x""]"');
  });

  it('rejects non-array data and non-object items', () => {
    expect(() => jsonToCsv({ a: 1 })).toThrow(/array/u);
    expect(() => jsonToCsv([1, 2])).toThrow(/not a JSON object/u);
    expect(jsonToCsv([])).toEqual({ csv: '', columns: [], rowCount: 0 });
  });
});

describe('JSON parsing and formatting', () => {
  it('formats and minifies valid JSON', () => {
    const parsed = parseJson('{"a":1,"b":[2,3]}');
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(formatJson(parsed.value)).toContain('\n  "a": 1');
      expect(summarizeJson(parsed.value)).toEqual({
        kind: 'object',
        size: 2,
        depth: 2,
      });
    }
  });

  it('reports the location of a syntax error', () => {
    const result = parseJson('{\n  "a": 1,\n}');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.line).toBeGreaterThanOrEqual(2);
      expect(result.column).toBeGreaterThan(0);
      expect(result.message.length).toBeGreaterThan(0);
    }
  });

  it('handles empty input clearly', () => {
    const result = parseJson('   ');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/empty/u);
  });
});

describe('diff', () => {
  it('marks line additions and removals', () => {
    const result = diffLines('a\nb\nc', 'a\nc\nd');
    expect(result.segments.map((segment) => segment.type)).toEqual([
      'equal',
      'remove',
      'equal',
      'add',
    ]);
    expect(result.segments.map((segment) => segment.value)).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
    expect(result).toMatchObject({ added: 1, removed: 1, unchanged: 2 });
  });

  it('compares words while normalizing whitespace', () => {
    const result = diffWords('the quick fox', 'the  slow fox');
    expect(result.segments.map((segment) => segment.value)).toEqual([
      'the',
      'quick',
      'slow',
      'fox',
    ]);
    expect(result.added).toBe(1);
    expect(result.removed).toBe(1);
  });

  it('enforces a token limit', () => {
    expect(() =>
      diffTokens(
        Array.from({ length: 10 }, (_, index) => String(index)),
        ['1'],
        5,
      ),
    ).toThrow(/limited/u);
  });
});
