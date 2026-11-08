export interface JsonParseFailure {
  ok: false;
  message: string;
  position: number | null;
  line: number | null;
  column: number | null;
}

export interface JsonParseSuccess {
  ok: true;
  value: unknown;
}

export type JsonParseResult = JsonParseSuccess | JsonParseFailure;

export function parseJson(input: string): JsonParseResult {
  if (!input.trim()) {
    return {
      ok: false,
      message: 'The input is empty.',
      position: null,
      line: null,
      column: null,
    };
  }
  try {
    return { ok: true, value: JSON.parse(input) as unknown };
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : 'Invalid JSON.';
    const positionMatch = rawMessage.match(/position\s+(\d+)/iu);
    const lineColumnMatch = rawMessage.match(/line\s+(\d+)\s+column\s+(\d+)/iu);
    let position = positionMatch ? Number(positionMatch[1]) : null;
    let line: number | null = null;
    let column: number | null = null;

    if (lineColumnMatch) {
      line = Number(lineColumnMatch[1]);
      column = Number(lineColumnMatch[2]);
      if (position === null) {
        position = positionFromLineColumn(input, line, column);
      }
    }

    if (position !== null) {
      const computed = lineColumnFromPosition(input, position);
      line = computed.line;
      column = computed.column;
    }

    const message = rawMessage
      .replace(/\s+in JSON at position \d+.*$/iu, '')
      .replace(/\s+at position \d+.*$/iu, '')
      .replace(/\s+at line \d+ column \d+.*$/iu, '')
      .trim();

    return {
      ok: false,
      message: message || 'The input is not valid JSON.',
      position,
      line,
      column,
    };
  }
}

function lineColumnFromPosition(
  input: string,
  position: number,
): { line: number; column: number } {
  const clamped = Math.max(0, Math.min(position, input.length));
  const preceding = input.slice(0, clamped);
  const lines = preceding.split(/\r\n|\r|\n/u);
  return {
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1,
  };
}

function positionFromLineColumn(
  input: string,
  line: number,
  column: number,
): number {
  const lines = input.split(/\r\n|\r|\n/u);
  let position = 0;
  for (let index = 0; index < line - 1 && index < lines.length; index += 1) {
    position += lines[index]!.length + 1;
  }
  return position + Math.max(0, column - 1);
}

export function formatJson(value: unknown, indent: 2 | 4 | '\t' = 2): string {
  const formatted = JSON.stringify(
    value,
    null,
    typeof indent === 'number' ? indent : indent,
  );
  if (formatted === undefined) {
    throw new Error('This JSON value cannot be serialized.');
  }
  return formatted;
}

export function minifyJson(value: unknown): string {
  const minified = JSON.stringify(value);
  if (minified === undefined) {
    throw new Error('This JSON value cannot be serialized.');
  }
  return minified;
}

export interface JsonSummary {
  kind: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  size: number;
  depth: number;
}

export function summarizeJson(value: unknown): JsonSummary {
  const kind: JsonSummary['kind'] =
    value === null
      ? 'null'
      : Array.isArray(value)
        ? 'array'
        : (typeof value as JsonSummary['kind']);
  let size = 1;
  if (Array.isArray(value)) size = value.length;
  else if (value && typeof value === 'object') size = Object.keys(value).length;
  return { kind, size, depth: depthOf(value) };
}

function depthOf(value: unknown, depth = 0): number {
  if (Array.isArray(value)) {
    return value.length === 0
      ? depth
      : Math.max(...value.map((entry) => depthOf(entry, depth + 1)));
  }
  if (value && typeof value === 'object') {
    const entries = Object.values(value);
    return entries.length === 0
      ? depth
      : Math.max(...entries.map((entry) => depthOf(entry, depth + 1)));
  }
  return depth;
}
