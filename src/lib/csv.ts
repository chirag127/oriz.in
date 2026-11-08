export interface CsvConversionResult {
  csv: string;
  columns: string[];
  rowCount: number;
}

export type CsvDelimiter = ',' | ';' | '\t' | '|';

export function parseCsv(
  input: string,
  delimiter: CsvDelimiter = ',',
): string[][] {
  if (delimiter.length !== 1) {
    throw new Error('The delimiter must be a single character.');
  }
  if (!input) return [];

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let justClosedQuote = false;
  let index = 0;

  while (index < input.length) {
    const character = input[index]!;

    if (inQuotes) {
      if (character === '"') {
        if (input[index + 1] === '"') {
          field += '"';
          index += 2;
          continue;
        }
        inQuotes = false;
        justClosedQuote = true;
        index += 1;
        continue;
      }
      field += character;
      index += 1;
      continue;
    }

    if (justClosedQuote) {
      justClosedQuote = false;
      if (
        character !== delimiter &&
        character !== '\n' &&
        character !== '\r'
      ) {
        throw new Error(
          `Unexpected character after a closing quote near row ${rows.length + 1}.`,
        );
      }
    }

    if (character === '"') {
      if (field !== '') {
        throw new Error(
          `Unexpected quote inside an unquoted field near row ${rows.length + 1}.`,
        );
      }
      inQuotes = true;
      index += 1;
      continue;
    }

    if (character === delimiter) {
      row.push(field);
      field = '';
      index += 1;
      continue;
    }

    if (character === '\r' || character === '\n') {
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
      if (character === '\r' && input[index + 1] === '\n') {
        index += 2;
      } else {
        index += 1;
      }
      continue;
    }

    field += character;
    index += 1;
  }

  if (inQuotes) {
    throw new Error('A quoted field is not closed.');
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function escapeCsvCell(value: unknown, delimiter: CsvDelimiter): string {
  if (value === null || value === undefined) return '';
  const text =
    typeof value === 'string'
      ? value
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);
  if (
    text.includes('"') ||
    text.includes('\n') ||
    text.includes('\r') ||
    text.includes(delimiter)
  ) {
    return `"${text.replace(/"/gu, '""')}"`;
  }
  return text;
}

export function jsonToCsv(
  value: unknown,
  delimiter: CsvDelimiter = ',',
): CsvConversionResult {
  if (!Array.isArray(value)) {
    throw new Error('The top-level JSON value must be an array of objects.');
  }
  if (value.length === 0) {
    return { csv: '', columns: [], rowCount: 0 };
  }

  const records: Record<string, unknown>[] = value.map((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`Item ${index + 1} is not a JSON object.`);
    }
    return entry as Record<string, unknown>;
  });

  const columns: string[] = [];
  const seen = new Set<string>();
  for (const record of records) {
    for (const key of Object.keys(record)) {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    }
  }

  const lines = [
    columns.map((column) => escapeCsvCell(column, delimiter)).join(delimiter),
    ...records.map((record) =>
      columns
        .map((column) => escapeCsvCell(record[column], delimiter))
        .join(delimiter),
    ),
  ];

  return {
    csv: lines.join('\n'),
    columns,
    rowCount: records.length,
  };
}

export function tableToCsv(
  columns: string[],
  rows: (string | number)[][],
  delimiter: CsvDelimiter = ',',
): string {
  return [columns, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell, delimiter)).join(delimiter))
    .join('\n');
}
