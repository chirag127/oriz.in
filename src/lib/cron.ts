const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const MONTH_ALIASES: Record<string, number> = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
};

const DAY_ALIASES: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

const MACROS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

interface FieldSpec {
  key: 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';
  label: string;
  min: number;
  max: number;
  names?: Record<string, number>;
  dayOfWeek?: boolean;
}

const FIELD_SPECS: FieldSpec[] = [
  { key: 'minute', label: 'Minute', min: 0, max: 59 },
  { key: 'hour', label: 'Hour', min: 0, max: 23 },
  { key: 'dayOfMonth', label: 'Day of month', min: 1, max: 31 },
  { key: 'month', label: 'Month', min: 1, max: 12, names: MONTH_ALIASES },
  { key: 'dayOfWeek', label: 'Day of week', min: 0, max: 7, names: DAY_ALIASES, dayOfWeek: true },
];

export interface CronField {
  specification: string;
  values: Set<number>;
  restricted: boolean;
}

export interface ParsedCron {
  expression: string;
  minute: CronField;
  hour: CronField;
  dayOfMonth: CronField;
  month: CronField;
  dayOfWeek: CronField;
}

function resolveNames(raw: string, names?: Record<string, number>): string {
  let value = raw.toUpperCase();
  if (names) {
    for (const [name, number] of Object.entries(names)) {
      value = value.replace(new RegExp(`\\b${name}\\b`, 'gu'), String(number));
    }
  }
  return value;
}

function parseField(raw: string, spec: FieldSpec): CronField {
  const specification = raw.trim();
  if (!specification) {
    throw new Error(`The ${spec.label.toLowerCase()} field is empty.`);
  }
  const resolved = resolveNames(specification, spec.names);
  const values = new Set<number>();
  const pieces = resolved.split(',');

  for (const piece of pieces) {
    if (!piece) {
      throw new Error(`The ${spec.label.toLowerCase()} field has an empty list item.`);
    }
    const [baseRaw, stepRaw, ...rest] = piece.split('/');
    if (rest.length > 0) {
      throw new Error(`The ${spec.label.toLowerCase()} field has an invalid step expression.`);
    }
    const base = baseRaw!.trim();
    let step = 1;
    if (stepRaw !== undefined) {
      if (!/^\d+$/u.test(stepRaw)) {
        throw new Error(`The ${spec.label.toLowerCase()} step must be a whole number.`);
      }
      step = Number(stepRaw);
      if (step <= 0) {
        throw new Error(`The ${spec.label.toLowerCase()} step must be greater than zero.`);
      }
    }

    let start: number;
    let end: number;

    if (base === '*') {
      start = spec.min;
      end = spec.max;
    } else if (base.includes('-')) {
      const rangeParts = base.split('-');
      if (rangeParts.length !== 2 || !rangeParts.every((part) => /^\d+$/u.test(part))) {
        throw new Error(`The ${spec.label.toLowerCase()} range is invalid.`);
      }
      start = Number(rangeParts[0]);
      end = Number(rangeParts[1]);
      if (start > end) {
        throw new Error(`The ${spec.label.toLowerCase()} range must run from low to high.`);
      }
    } else if (/^\d+$/u.test(base)) {
      start = Number(base);
      end = stepRaw !== undefined ? spec.max : start;
    } else {
      throw new Error(`“${base}” is not valid in the ${spec.label.toLowerCase()} field.`);
    }

    if (start < spec.min || end > spec.max) {
      throw new Error(
        `The ${spec.label.toLowerCase()} field must use values from ${spec.min} to ${spec.max}.`,
      );
    }

    for (let value = start; value <= end; value += step) {
      values.add(spec.dayOfWeek && value === 7 ? 0 : value);
    }
  }

  return {
    specification,
    values,
    restricted: specification !== '*',
  };
}

export function parseCron(expression: string): ParsedCron {
  const trimmed = expression.trim();
  if (!trimmed) throw new Error('Enter a cron expression.');
  const normalized = MACROS[trimmed.toLocaleLowerCase()] ?? trimmed;
  const fields = normalized.split(/\s+/u);
  if (fields.length !== 5) {
    throw new Error('A standard cron expression needs exactly five fields.');
  }
  return {
    expression: trimmed,
    minute: parseField(fields[0]!, FIELD_SPECS[0]!),
    hour: parseField(fields[1]!, FIELD_SPECS[1]!),
    dayOfMonth: parseField(fields[2]!, FIELD_SPECS[2]!),
    month: parseField(fields[3]!, FIELD_SPECS[3]!),
    dayOfWeek: parseField(fields[4]!, FIELD_SPECS[4]!),
  };
}

function sorted(values: Set<number>): number[] {
  return [...values].sort((a, b) => a - b);
}

function joinList(values: string[]): string {
  if (values.length === 0) return '';
  if (values.length === 1) return values[0]!;
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`;
}

function describeSet(values: Set<number>, max = 8): string {
  const ordered = sorted(values);
  if (ordered.length > max) {
    return `${ordered.slice(0, max).join(', ')}, and ${ordered.length - max} more`;
  }
  return joinList(ordered.map(String));
}

function describeTime(parsed: ParsedCron): string {
  const minutes = sorted(parsed.minute.values);
  const hours = sorted(parsed.hour.values);
  const everyMinute = minutes.length === 60;
  const everyHour = hours.length === 24;

  if (everyMinute && everyHour) return 'Every minute';

  const minuteStep =
    minutes.length > 1 &&
    minutes[0] === 0 &&
    minutes.every((value, index) => value === index * minutes[1]!) &&
    60 / minutes[1]! === minutes.length
      ? minutes[1]!
      : null;
  const hourStep =
    hours.length > 1 &&
    hours.length < 24 &&
    hours[0] === 0 &&
    hours.every((value, index) => value === index * hours[1]!) &&
    24 / hours[1]! === hours.length
      ? hours[1]!
      : null;

  if (everyHour && minuteStep) {
    return `Every ${minuteStep} minutes`;
  }
  if (minutes.length === 1 && hourStep) {
    return `Every ${hourStep} hours at minute ${minutes[0]}`;
  }
  if (minutes.length === 1 && hours.length === 1) {
    return `At ${String(hours[0]).padStart(2, '0')}:${String(minutes[0]).padStart(2, '0')}`;
  }
  if (minutes.length === 1 && everyHour) {
    return `At minute ${minutes[0]} of every hour`;
  }
  if (minutes.length === 1) {
    const hourLabel = hours.length > 4 ? `${hours.length} selected hours` : joinList(hours.map((hour) => String(hour).padStart(2, '0')));
    return `At minute ${minutes[0]} past ${hourLabel}`;
  }
  if (hours.length === 1) {
    return `At minutes ${describeSet(parsed.minute.values)} of hour ${String(hours[0]).padStart(2, '0')}`;
  }
  if (everyHour) {
    return `At minutes ${describeSet(parsed.minute.values)} of every hour`;
  }
  return 'At the selected minutes and hours';
}

function describeDays(parsed: ParsedCron): string {
  const dom = parsed.dayOfMonth.restricted;
  const dow = parsed.dayOfWeek.restricted;
  if (!dom && !dow) return 'every day';
  if (dom && !dow) {
    return `on day ${describeSet(parsed.dayOfMonth.values)} of the month`;
  }
  if (!dom && dow) {
    const names = sorted(parsed.dayOfWeek.values).map((day) => DAY_NAMES[day] ?? String(day));
    return `on ${joinList(names)}`;
  }
  const domText = describeSet(parsed.dayOfMonth.values);
  const dowText = joinList(
    sorted(parsed.dayOfWeek.values).map((day) => DAY_NAMES[day] ?? String(day)),
  );
  return `on day ${domText} of the month or on ${dowText} (standard cron OR rule)`;
}

function describeMonths(parsed: ParsedCron): string {
  const values = sorted(parsed.month.values);
  if (values.length === 12) return '';
  const names = values.map((month) => MONTH_NAMES[month - 1] ?? String(month));
  return `in ${joinList(names)}`;
}

export interface CronExplanation {
  summary: string;
  fields: { label: string; specification: string; description: string }[];
}

export function explainCron(expression: string): CronExplanation {
  const parsed = parseCron(expression);
  const parts = [
    describeTime(parsed),
    describeDays(parsed),
    describeMonths(parsed),
  ].filter(Boolean);
  const summary = `${parts.join(', ')}.`;

  return {
    summary: summary.charAt(0).toLocaleUpperCase() + summary.slice(1),
    fields: [
      {
        label: 'Minute',
        specification: parsed.minute.specification,
        description:
          parsed.minute.values.size === 60
            ? 'Every minute (0–59)'
            : `At minute ${describeSet(parsed.minute.values)}`,
      },
      {
        label: 'Hour',
        specification: parsed.hour.specification,
        description:
          parsed.hour.values.size === 24
            ? 'Every hour (0–23)'
            : `During hour ${describeSet(parsed.hour.values)}`,
      },
      {
        label: 'Day of month',
        specification: parsed.dayOfMonth.specification,
        description: parsed.dayOfMonth.restricted
          ? `On day ${describeSet(parsed.dayOfMonth.values)}`
          : 'Every day of the month',
      },
      {
        label: 'Month',
        specification: parsed.month.specification,
        description: parsed.month.restricted
          ? `In ${joinList(sorted(parsed.month.values).map((month) => MONTH_NAMES[month - 1] ?? String(month)))}`
          : 'Every month',
      },
      {
        label: 'Day of week',
        specification: parsed.dayOfWeek.specification,
        description: parsed.dayOfWeek.restricted
          ? `On ${joinList(sorted(parsed.dayOfWeek.values).map((day) => DAY_NAMES[day] ?? String(day)))}`
          : 'Every day of the week',
      },
    ],
  };
}

function dayMatches(parsed: ParsedCron, date: Date): boolean {
  const domMatch = parsed.dayOfMonth.values.has(date.getDate());
  const dowMatch = parsed.dayOfWeek.values.has(date.getDay());
  if (parsed.dayOfMonth.restricted && parsed.dayOfWeek.restricted) {
    return domMatch || dowMatch;
  }
  if (parsed.dayOfMonth.restricted) return domMatch;
  if (parsed.dayOfWeek.restricted) return dowMatch;
  return true;
}

export function nextCronRuns(
  expression: string,
  from: Date = new Date(),
  count = 5,
  maxYears = 5,
): Date[] {
  const parsed = parseCron(expression);
  const results: Date[] = [];
  const cursor = new Date(from.getTime());
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const deadline = new Date(cursor.getTime());
  deadline.setFullYear(deadline.getFullYear() + maxYears);
  let guard = 0;

  while (results.length < count && cursor <= deadline) {
    guard += 1;
    if (guard > 500000) break;

    const month = cursor.getMonth() + 1;
    if (!parsed.month.values.has(month)) {
      cursor.setDate(1);
      cursor.setHours(0, 0, 0, 0);
      cursor.setMonth(cursor.getMonth() + 1);
      continue;
    }

    if (!dayMatches(parsed, cursor)) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }

    if (!parsed.hour.values.has(cursor.getHours())) {
      cursor.setHours(cursor.getHours() + 1, 0, 0, 0);
      continue;
    }

    if (!parsed.minute.values.has(cursor.getMinutes())) {
      cursor.setMinutes(cursor.getMinutes() + 1, 0, 0);
      continue;
    }

    results.push(new Date(cursor.getTime()));
    cursor.setMinutes(cursor.getMinutes() + 1, 0, 0);
  }

  return results;
}

export const CRON_EXAMPLES = [
  { label: 'Every 15 minutes', expression: '*/15 * * * *' },
  { label: 'Weekdays at 09:00', expression: '0 9 * * 1-5' },
  { label: 'First day of each month', expression: '0 0 1 * *' },
  { label: 'Every Sunday at midnight', expression: '0 0 * * 0' },
  { label: 'Every 6 hours', expression: '0 */6 * * *' },
  { label: 'Quarterly at 03:30', expression: '30 3 1 1,4,7,10 *' },
] as const;
