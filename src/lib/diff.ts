export type DiffOperation = 'equal' | 'add' | 'remove';

export interface DiffSegment {
  type: DiffOperation;
  value: string;
}

export interface DiffResult {
  segments: DiffSegment[];
  added: number;
  removed: number;
  unchanged: number;
}

export function diffTokens(
  before: string[],
  after: string[],
  maxTokens = 1500,
): DiffResult {
  if (before.length > maxTokens || after.length > maxTokens) {
    throw new Error(
      `The comparison is limited to ${maxTokens} tokens per side. Reduce the input size.`,
    );
  }

  const rows = before.length + 1;
  const columns = after.length + 1;
  const table = new Uint32Array(rows * columns);

  for (let row = before.length - 1; row >= 0; row -= 1) {
    for (let column = after.length - 1; column >= 0; column -= 1) {
      table[row * columns + column] =
        before[row] === after[column]
          ? table[(row + 1) * columns + column + 1]! + 1
          : Math.max(
              table[(row + 1) * columns + column]!,
              table[row * columns + column + 1]!,
            );
    }
  }

  const segments: DiffSegment[] = [];
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  let row = 0;
  let column = 0;

  const push = (type: DiffOperation, value: string) => {
    segments.push({ type, value });
  };

  while (row < before.length && column < after.length) {
    if (before[row] === after[column]) {
      push('equal', before[row]!);
      unchanged += 1;
      row += 1;
      column += 1;
    } else if (
      table[(row + 1) * columns + column]! >=
      table[row * columns + column + 1]!
    ) {
      push('remove', before[row]!);
      removed += 1;
      row += 1;
    } else {
      push('add', after[column]!);
      added += 1;
      column += 1;
    }
  }

  while (row < before.length) {
    push('remove', before[row]!);
    removed += 1;
    row += 1;
  }
  while (column < after.length) {
    push('add', after[column]!);
    added += 1;
    column += 1;
  }

  return { segments, added, removed, unchanged };
}

export function diffLines(before: string, after: string): DiffResult {
  const beforeLines = before.split(/\r\n|\r|\n/u);
  const afterLines = after.split(/\r\n|\r|\n/u);
  return diffTokens(beforeLines, afterLines);
}

export function diffWords(before: string, after: string): DiffResult {
  const tokenize = (input: string) => input.trim().split(/\s+/u).filter(Boolean);
  return diffTokens(tokenize(before), tokenize(after));
}

export function diffToText(segments: DiffSegment[]): string {
  return segments
    .flatMap((segment) => {
      const prefix =
        segment.type === 'add' ? '+ ' : segment.type === 'remove' ? '- ' : '  ';
      return segment.value
        .split('\n')
        .map((line, index) => (index === 0 ? prefix + line : prefix + line));
    })
    .join('\n');
}
