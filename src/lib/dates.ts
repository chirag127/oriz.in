const DAY_MS = 86_400_000;

export function parseDateOnly(value: string): Date {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/u);
  if (!match) {
    throw new Error('Enter a valid date in YYYY-MM-DD format.');
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error('That calendar date does not exist.');
  }
  return date;
}

export function formatDateOnly(value: Date): string {
  const year = String(value.getUTCFullYear()).padStart(4, '0');
  const month = String(value.getUTCMonth() + 1).padStart(2, '0');
  const day = String(value.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface DateDifference {
  totalDays: number;
  absoluteDays: number;
  weeks: number;
  remainingDays: number;
  businessDays: number;
  years: number;
  months: number;
  days: number;
  reversed: boolean;
}

export function differenceBetweenDates(start: Date, end: Date): DateDifference {
  const totalDays = Math.round((end.getTime() - start.getTime()) / DAY_MS);
  const reversed = totalDays < 0;
  const absoluteDays = Math.abs(totalDays);
  const earlier = reversed ? end : start;
  const later = reversed ? start : end;

  const weeks = Math.floor(absoluteDays / 7);
  const remainingDays = absoluteDays % 7;
  const businessDays = countWeekdays(earlier, later);
  const breakdown = calendarBreakdown(earlier, later);

  return {
    totalDays,
    absoluteDays,
    weeks,
    remainingDays,
    businessDays,
    years: breakdown.years,
    months: breakdown.months,
    days: breakdown.days,
    reversed,
  };
}

function countWeekdays(start: Date, end: Date): number {
  const days = Math.round((end.getTime() - start.getTime()) / DAY_MS);
  if (days <= 0) return 0;
  const fullWeeks = Math.floor(days / 7);
  const remainder = days % 7;
  let count = fullWeeks * 5;
  const startDay = start.getUTCDay();
  for (let offset = 0; offset < remainder; offset += 1) {
    const day = (startDay + offset) % 7;
    if (day !== 0 && day !== 6) count += 1;
  }
  return count;
}

function addMonthsClamped(date: Date, months: number): Date {
  const result = new Date(0);
  result.setUTCHours(0, 0, 0, 0);
  result.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth() + months, 1);
  const daysInTargetMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(date.getUTCDate(), daysInTargetMonth));
  return result;
}

function calendarBreakdown(start: Date, end: Date): {
  years: number;
  months: number;
  days: number;
} {
  let totalMonths = 0;
  while (
    totalMonths < 12000 &&
    addMonthsClamped(start, totalMonths + 1).getTime() <= end.getTime()
  ) {
    totalMonths += 1;
  }
  const anchored = addMonthsClamped(start, totalMonths);
  const days = Math.round((end.getTime() - anchored.getTime()) / DAY_MS);
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days,
  };
}

function utcFromParts(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): number {
  const date = new Date(0);
  date.setUTCHours(hour, minute, second, 0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getTime();
}

export type TimestampUnit = 'auto' | 'seconds' | 'milliseconds';

export interface TimestampRepresentation {
  unixSeconds: number;
  unixMilliseconds: number;
  iso: string;
  utc: string;
  local: string;
}

export function parseTimestampInput(
  input: string,
  unit: TimestampUnit = 'auto',
): Date {
  const value = input.trim();
  if (!value) throw new Error('Enter a timestamp or a date string.');

  if (/^[+-]?\d+(?:\.\d+)?$/u.test(value)) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      throw new Error('The timestamp is not a finite number.');
    }
    const resolvedUnit =
      unit === 'auto'
        ? Math.abs(numeric) >= 1e11
          ? 'milliseconds'
          : 'seconds'
        : unit;
    const milliseconds =
      resolvedUnit === 'seconds' ? numeric * 1000 : numeric;
    const date = new Date(milliseconds);
    if (Number.isNaN(date.getTime())) {
      throw new Error('The timestamp is outside the supported date range.');
    }
    return date;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(
      'Use a numeric timestamp, an ISO 8601 date, or another date string your browser can parse.',
    );
  }
  return parsed;
}

export function timestampRepresentations(date: Date): TimestampRepresentation {
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date.');
  }
  const time = date.getTime();
  return {
    unixSeconds: Math.floor(time / 1000),
    unixMilliseconds: time,
    iso: date.toISOString(),
    utc: `${String(date.getUTCFullYear()).padStart(4, '0')}-${String(
      date.getUTCMonth() + 1,
    ).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${String(
      date.getUTCHours(),
    ).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(
      date.getUTCSeconds(),
    ).padStart(2, '0')} UTC`,
    local: new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(date),
  };
}

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: string;
}

const zoneFormatterCache = new Map<string, Intl.DateTimeFormat>();

function getZoneFormatter(timeZone: string): Intl.DateTimeFormat {
  const existing = zoneFormatterCache.get(timeZone);
  if (existing) return existing;
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  });
  zoneFormatterCache.set(timeZone, formatter);
  return formatter;
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    getZoneFormatter(timeZone);
    return true;
  } catch {
    return false;
  }
}

export function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = getZoneFormatter(timeZone).formatToParts(date);
  const lookup = new Map(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(lookup.get('year')),
    month: Number(lookup.get('month')),
    day: Number(lookup.get('day')),
    hour: Number(lookup.get('hour')),
    minute: Number(lookup.get('minute')),
    second: Number(lookup.get('second')),
    weekday: lookup.get('weekday') ?? '',
  };
}

export function zoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = getZonedParts(date, timeZone);
  const asUtc = utcFromParts(
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return Math.round((asUtc - date.getTime()) / 60000);
}

export interface ZonedConversion {
  date: Date;
  wallTimeExists: boolean;
}

export function convertZonedWallTime(
  dateValue: string,
  timeValue: string,
  timeZone: string,
): ZonedConversion {
  const date = parseDateOnly(dateValue);
  if (!isValidTimeZone(timeZone)) {
    throw new Error('Enter a valid IANA time zone, such as Europe/London.');
  }
  const match = timeValue.trim().match(/^(\d{1,2}):(\d{2})$/u);
  if (!match) throw new Error('Enter a time in HH:MM format.');
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) throw new Error('Enter a valid time.');

  const target = utcFromParts(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    hour,
    minute,
  );

  let guess = target;
  for (let iteration = 0; iteration < 4; iteration += 1) {
    const parts = getZonedParts(new Date(guess), timeZone);
    const formattedAsUtc = utcFromParts(
      parts.year,
      parts.month,
      parts.day,
      parts.hour,
      parts.minute,
    );
    const offset = formattedAsUtc - guess;
    const next = target - offset;
    if (next === guess) break;
    guess = next;
  }

  const parts = getZonedParts(new Date(guess), timeZone);
  const wallTimeExists =
    parts.year === date.getUTCFullYear() &&
    parts.month === date.getUTCMonth() + 1 &&
    parts.day === date.getUTCDate() &&
    parts.hour === hour &&
    parts.minute === minute;

  return { date: new Date(guess), wallTimeExists };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export function formatInZone(date: Date, timeZone: string): string {
  if (!isValidTimeZone(timeZone)) throw new Error('Invalid time zone.');
  const parts = getZonedParts(date, timeZone);
  const month = MONTHS[parts.month - 1] ?? String(parts.month);
  return `${parts.weekday}, ${String(parts.day).padStart(2, '0')} ${month} ${parts.year}, ${String(
    parts.hour,
  ).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`;
}

export function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? '+' : '−';
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const remainder = absolute % 60;
  return remainder === 0
    ? `UTC${sign}${hours}`
    : `UTC${sign}${hours}:${String(remainder).padStart(2, '0')}`;
}

export const COMMON_TIME_ZONES = [
  { id: 'UTC', label: 'UTC' },
  { id: 'Europe/London', label: 'London' },
  { id: 'Europe/Berlin', label: 'Berlin' },
  { id: 'Europe/Paris', label: 'Paris' },
  { id: 'America/New_York', label: 'New York' },
  { id: 'America/Chicago', label: 'Chicago' },
  { id: 'America/Denver', label: 'Denver' },
  { id: 'America/Los_Angeles', label: 'Los Angeles' },
  { id: 'America/Sao_Paulo', label: 'São Paulo' },
  { id: 'Asia/Kolkata', label: 'Kolkata' },
  { id: 'Asia/Singapore', label: 'Singapore' },
  { id: 'Asia/Tokyo', label: 'Tokyo' },
  { id: 'Australia/Sydney', label: 'Sydney' },
] as const;

export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
