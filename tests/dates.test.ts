import { describe, expect, it } from 'vitest';
import {
  convertZonedWallTime,
  differenceBetweenDates,
  formatInZone,
  formatOffset,
  isValidTimeZone,
  parseDateOnly,
  parseTimestampInput,
  timestampRepresentations,
  zoneOffsetMinutes,
} from '../src/lib/dates';

describe('calendar dates', () => {
  it('parses strict ISO dates', () => {
    expect(parseDateOnly('2024-02-29').toISOString()).toBe(
      '2024-02-29T00:00:00.000Z',
    );
    expect(() => parseDateOnly('2023-02-29')).toThrow(/does not exist/u);
    expect(() => parseDateOnly('2024-2-9')).toThrow(/YYYY-MM-DD/u);
  });

  it('calculates total and business days', () => {
    const result = differenceBetweenDates(
      parseDateOnly('2024-02-28'),
      parseDateOnly('2024-03-01'),
    );
    expect(result.totalDays).toBe(2);
    expect(result.businessDays).toBe(2);
  });

  it('calculates a year-month-day breakdown with clamping', () => {
    const monthEnd = differenceBetweenDates(
      parseDateOnly('2020-01-31'),
      parseDateOnly('2020-03-01'),
    );
    expect(monthEnd).toMatchObject({ years: 0, months: 1, days: 1 });
    const fullYear = differenceBetweenDates(
      parseDateOnly('2023-01-01'),
      parseDateOnly('2024-01-01'),
    );
    expect(fullYear).toMatchObject({ years: 1, months: 0, days: 0 });
  });

  it('counts weekdays over a normal week', () => {
    const result = differenceBetweenDates(
      parseDateOnly('2026-01-05'),
      parseDateOnly('2026-01-12'),
    );
    expect(result.totalDays).toBe(7);
    expect(result.businessDays).toBe(5);
  });

  it('reports reversed ranges without losing the absolute values', () => {
    const result = differenceBetweenDates(
      parseDateOnly('2024-03-01'),
      parseDateOnly('2024-02-28'),
    );
    expect(result.reversed).toBe(true);
    expect(result.totalDays).toBe(-2);
    expect(result.absoluteDays).toBe(2);
  });
});

describe('timestamps', () => {
  it('detects seconds and milliseconds', () => {
    expect(parseTimestampInput('1700000000').toISOString()).toBe(
      '2023-11-14T22:13:20.000Z',
    );
    expect(parseTimestampInput('1700000000000').toISOString()).toBe(
      '2023-11-14T22:13:20.000Z',
    );
    expect(parseTimestampInput('0').getTime()).toBe(0);
  });

  it('respects an explicit unit', () => {
    expect(parseTimestampInput('1700000000', 'milliseconds').getUTCFullYear()).toBe(1970);
  });

  it('builds readable representations', () => {
    const date = parseTimestampInput('1700000000');
    const result = timestampRepresentations(date);
    expect(result.unixSeconds).toBe(1_700_000_000);
    expect(result.utc).toContain('2023-11-14 22:13:20 UTC');
    expect(result.iso).toBe('2023-11-14T22:13:20.000Z');
  });

  it('rejects invalid input', () => {
    expect(() => parseTimestampInput('not-a-real-date')).toThrow();
    expect(() => parseTimestampInput('')).toThrow();
  });
});

describe('time zones', () => {
  it('validates IANA identifiers', () => {
    expect(isValidTimeZone('America/New_York')).toBe(true);
    expect(isValidTimeZone('Mars/Olympus_Mons')).toBe(false);
  });

  it('converts wall time in New York to UTC in winter and summer', () => {
    const winter = convertZonedWallTime(
      '2026-01-15',
      '12:00',
      'America/New_York',
    );
    expect(winter.wallTimeExists).toBe(true);
    expect(winter.date.toISOString()).toBe('2026-01-15T17:00:00.000Z');
    expect(zoneOffsetMinutes(winter.date, 'America/New_York')).toBe(-300);

    const summer = convertZonedWallTime(
      '2026-07-15',
      '12:00',
      'America/New_York',
    );
    expect(summer.date.toISOString()).toBe('2026-07-15T16:00:00.000Z');
    expect(zoneOffsetMinutes(summer.date, 'America/New_York')).toBe(-240);
  });

  it('handles a half-hour offset zone', () => {
    const conversion = convertZonedWallTime(
      '2026-01-15',
      '12:00',
      'Asia/Kolkata',
    );
    expect(conversion.date.toISOString()).toBe('2026-01-15T06:30:00.000Z');
    expect(formatOffset(330)).toBe('UTC+5:30');
    expect(formatInZone(conversion.date, 'Asia/Kolkata')).toBe(
      'Thu, 15 Jan 2026, 12:00',
    );
  });

  it('reports malformed times and zones', () => {
    expect(() => convertZonedWallTime('2026-01-15', '25:00', 'UTC')).toThrow();
    expect(() =>
      convertZonedWallTime('2026-01-15', '12:00', 'Not/AZone'),
    ).toThrow(/IANA/u);
  });
});
