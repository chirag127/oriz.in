type SqlTokenType = 'word' | 'number' | 'string' | 'comment' | 'symbol';

interface SqlToken {
  type: SqlTokenType;
  value: string;
}

const KEYWORDS = new Set([
  'ADD',
  'ALL',
  'ALTER',
  'AND',
  'AS',
  'ASC',
  'BETWEEN',
  'BY',
  'CASE',
  'CHECK',
  'COLUMN',
  'CREATE',
  'CROSS',
  'DEFAULT',
  'DELETE',
  'DESC',
  'DISTINCT',
  'DROP',
  'ELSE',
  'END',
  'EXISTS',
  'FALSE',
  'FOREIGN',
  'FROM',
  'FULL',
  'GROUP',
  'HAVING',
  'IN',
  'INDEX',
  'INNER',
  'INSERT',
  'INTERSECT',
  'INTO',
  'IS',
  'JOIN',
  'KEY',
  'LEFT',
  'LIKE',
  'LIMIT',
  'NOT',
  'NULL',
  'OFFSET',
  'ON',
  'OR',
  'ORDER',
  'OUTER',
  'OVER',
  'PARTITION',
  'PRIMARY',
  'REFERENCES',
  'RETURNING',
  'RIGHT',
  'SELECT',
  'SET',
  'TABLE',
  'THEN',
  'TRUE',
  'UNION',
  'UNIQUE',
  'UPDATE',
  'USING',
  'VALUES',
  'VIEW',
  'WHEN',
  'WHERE',
  'WITH',
]);

function tokenizeSql(input: string): SqlToken[] {
  const tokens: SqlToken[] = [];
  let index = 0;
  const length = input.length;

  while (index < length) {
    const character = input[index]!;

    if (/\s/u.test(character)) {
      index += 1;
      continue;
    }

    if (character === '-' && input[index + 1] === '-') {
      const end = input.indexOf('\n', index);
      const stop = end === -1 ? length : end;
      tokens.push({ type: 'comment', value: input.slice(index, stop) });
      index = stop;
      continue;
    }

    if (character === '/' && input[index + 1] === '*') {
      const end = input.indexOf('*/', index + 2);
      if (end === -1) throw new Error('A block comment is not closed.');
      tokens.push({ type: 'comment', value: input.slice(index, end + 2) });
      index = end + 2;
      continue;
    }

    if (character === "'" || character === '"' || character === '`' || character === '[') {
      const closing = character === '[' ? ']' : character;
      let cursor = index + 1;
      let value = '';
      let closed = false;
      while (cursor < length) {
        if (input[cursor] === closing) {
          if (input[cursor + 1] === closing) {
            value += closing;
            cursor += 2;
            continue;
          }
          closed = true;
          cursor += 1;
          break;
        }
        value += input[cursor];
        cursor += 1;
      }
      if (!closed) throw new Error('A quoted SQL value is not closed.');
      tokens.push({ type: 'string', value: input.slice(index, cursor) });
      index = cursor;
      continue;
    }

    if (/[A-Za-z_\u0080-\uFFFF]/u.test(character)) {
      let cursor = index + 1;
      while (cursor < length && /[A-Za-z0-9_$\u0080-\uFFFF]/u.test(input[cursor]!)) {
        cursor += 1;
      }
      tokens.push({ type: 'word', value: input.slice(index, cursor) });
      index = cursor;
      continue;
    }

    if (/\d/u.test(character) || (character === '.' && /\d/u.test(input[index + 1] ?? ''))) {
      let cursor = index + 1;
      while (cursor < length && /[\d.eE+-]/u.test(input[cursor]!)) {
        cursor += 1;
      }
      tokens.push({ type: 'number', value: input.slice(index, cursor) });
      index = cursor;
      continue;
    }

    tokens.push({ type: 'symbol', value: character });
    index += 1;
  }

  return tokens;
}

function normalizeKeywords(tokens: SqlToken[]): SqlToken[] {
  return tokens.map((token) =>
    token.type === 'word' && KEYWORDS.has(token.value.toUpperCase())
      ? { type: 'word', value: token.value.toUpperCase() }
      : token,
  );
}

const CLAUSE_STARTERS = new Set([
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'UNION',
  'UNION ALL',
  'VALUES',
  'SET',
  'RETURNING',
  'INSERT INTO',
  'UPDATE',
  'DELETE FROM',
  'WITH',
]);

const JOIN_STARTERS = new Set([
  'JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'INNER JOIN',
  'FULL JOIN',
  'CROSS JOIN',
  'LEFT OUTER JOIN',
  'RIGHT OUTER JOIN',
  'FULL OUTER JOIN',
]);

function joinPhrase(tokens: SqlToken[], index: number): { phrase: string; length: number } | null {
  const words = tokens
    .slice(index, index + 3)
    .map((token) => (token.type === 'word' ? token.value : ''));
  const combinations: { phrase: string; length: number }[] = [];
  if (words[0] === 'GROUP' && words[1] === 'BY') combinations.push({ phrase: 'GROUP BY', length: 2 });
  if (words[0] === 'ORDER' && words[1] === 'BY') combinations.push({ phrase: 'ORDER BY', length: 2 });
  if (words[0] === 'UNION' && words[1] === 'ALL') combinations.push({ phrase: 'UNION ALL', length: 2 });
  if (words[0] === 'INSERT' && words[1] === 'INTO') combinations.push({ phrase: 'INSERT INTO', length: 2 });
  if (words[0] === 'DELETE' && words[1] === 'FROM') combinations.push({ phrase: 'DELETE FROM', length: 2 });
  if (words[0] === 'LEFT' && words[1] === 'OUTER' && words[2] === 'JOIN') combinations.push({ phrase: 'LEFT OUTER JOIN', length: 3 });
  if (words[0] === 'RIGHT' && words[1] === 'OUTER' && words[2] === 'JOIN') combinations.push({ phrase: 'RIGHT OUTER JOIN', length: 3 });
  if (words[0] === 'FULL' && words[1] === 'OUTER' && words[2] === 'JOIN') combinations.push({ phrase: 'FULL OUTER JOIN', length: 3 });
  if (['LEFT', 'RIGHT', 'INNER', 'FULL', 'CROSS'].includes(words[0] ?? '') && words[1] === 'JOIN') {
    combinations.push({ phrase: `${words[0]} JOIN`, length: 2 });
  }
  if (words[0] === 'JOIN') combinations.push({ phrase: 'JOIN', length: 1 });
  return combinations[0] ?? null;
}

function spacingBefore(out: string, token: SqlToken, previous?: SqlToken): boolean {
  if (!out || /[\s(.\[]$/u.test(out)) return false;
  if (token.type === 'symbol' && [')', ',', ';', '.'].includes(token.value)) return false;
  if (token.type === 'symbol' && token.value === '(') {
    if (previous?.type === 'word') {
      const upper = previous.value.toUpperCase();
      return ['IN', 'VALUES', 'ON', 'USING', 'AS', 'AND', 'OR', 'NOT', 'WHERE'].includes(upper);
    }
    return false;
  }
  if (previous?.type === 'symbol' && previous.value === '.') return false;
  if (token.type === 'symbol' && ['.', '::'].includes(token.value)) return false;
  return true;
}

export function formatSql(input: string): string {
  const tokens = normalizeKeywords(tokenizeSql(input));
  if (tokens.length === 0) return '';

  let out = '';
  let clause = '';
  let index = 0;
  let previous: SqlToken | undefined;

  const newline = (indent = 0) => {
    out = out.replace(/[ \t]+$/u, '').replace(/\n+$/u, '');
    if (out) out += '\n';
    out += ' '.repeat(indent);
  };

  const append = (value: string, token: SqlToken) => {
    if (spacingBefore(out, token, previous)) out += ' ';
    out += value;
    previous = token;
  };

  while (index < tokens.length) {
    const token = tokens[index]!;

    if (token.type === 'comment') {
      if (out && !out.endsWith('\n')) newline();
      out += token.value;
      newline();
      previous = token;
      index += 1;
      continue;
    }

    const phrase = joinPhrase(tokens, index) ?? (
      token.type === 'word' && CLAUSE_STARTERS.has(token.value)
        ? { phrase: token.value, length: 1 }
        : null
    );

    if (phrase) {
      const isJoin = JOIN_STARTERS.has(phrase.phrase);
      const isOn = phrase.phrase === 'ON' || phrase.phrase === 'USING';
      if (out.trim()) newline(isJoin || isOn ? 0 : 0);
      if (isOn && out && !out.endsWith('\n')) newline(2);
      out += phrase.phrase;
      clause = phrase.phrase;
      previous = { type: 'word', value: phrase.phrase };
      index += phrase.length;

      if (
        ['SELECT', 'SET', 'VALUES', 'RETURNING'].includes(phrase.phrase)
      ) {
        newline(2);
      } else {
        out += ' ';
      }
      continue;
    }

    if (token.type === 'word' && ['ON', 'USING'].includes(token.value)) {
      if (out && !out.endsWith('\n')) newline(2);
      out += token.value;
      out += ' ';
      clause = token.value;
      previous = token;
      index += 1;
      continue;
    }

    if (token.type === 'word' && ['AND', 'OR'].includes(token.value) && ['WHERE', 'HAVING', 'ON'].includes(clause)) {
      newline(2);
      out += token.value;
      out += ' ';
      previous = token;
      index += 1;
      continue;
    }

    if (token.type === 'symbol' && token.value === ',') {
      out = out.replace(/[ \t]+$/u, '');
      out += ',';
      if (['SELECT', 'SET', 'VALUES', 'RETURNING'].includes(clause)) {
        newline(2);
      } else {
        out += ' ';
      }
      previous = token;
      index += 1;
      continue;
    }

    if (token.type === 'symbol' && token.value === ';') {
      out = out.replace(/[ \t]+$/u, '');
      out += ';';
      newline();
      previous = token;
      index += 1;
      continue;
    }

    if (token.type === 'number') {
      if (spacingBefore(out, token, previous)) out += ' ';
      out += token.value;
      previous = token;
      index += 1;
      continue;
    }

    append(token.value, token);
    index += 1;
  }

  return out
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/u, ''))
    .join('\n')
    .trim();
}

const CLAUSE_PATTERN =
  /\b(SELECT|FROM|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT|OFFSET|UNION(?:\s+ALL)?|VALUES|SET|RETURNING|INSERT\s+INTO|UPDATE|DELETE\s+FROM|WITH|(?:LEFT|RIGHT|FULL|INNER|CROSS)(?:\s+OUTER)?\s+JOIN|JOIN|ON|USING)\b/giu;

export interface SqlClauseExplanation {
  name: string;
  detail: string;
  explanation: string;
}

export interface SqlExplanation {
  statementType: string;
  clauses: SqlClauseExplanation[];
  tables: string[];
  warnings: string[];
}

function maskStringsAndComments(input: string): string {
  return input
    .replace(/--[^\n]*/gu, (match) => ' '.repeat(match.length))
    .replace(/\/\*[\s\S]*?\*\//gu, (match) => ' '.repeat(match.length))
    .replace(/'(?:''|[^'])*'/gu, (match) => `'${' '.repeat(Math.max(0, match.length - 2))}'`);
}

function cleanDetail(detail: string): string {
  return detail
    .replace(/\s+/gu, ' ')
    .replace(/\s*,\s*/gu, ', ')
    .trim();
}

export function explainSql(input: string): SqlExplanation {
  if (!input.trim()) throw new Error('Paste a SQL query first.');
  const masked = maskStringsAndComments(input);
  const matches = [...masked.matchAll(CLAUSE_PATTERN)];
  if (matches.length === 0) {
    throw new Error('No common SQL clause was detected in this query.');
  }

  const firstKeyword = matches[0]![1]!.toUpperCase();
  const statementType = firstKeyword.includes('INSERT')
    ? 'INSERT'
    : firstKeyword.includes('UPDATE')
      ? 'UPDATE'
      : firstKeyword.includes('DELETE')
        ? 'DELETE'
        : firstKeyword.includes('WITH')
          ? 'SELECT (with a WITH clause)'
          : 'SELECT';

  const clauses: SqlClauseExplanation[] = matches.map((match, position) => {
    const start = match.index ?? 0;
    const end = position + 1 < matches.length ? matches[position + 1]!.index ?? input.length : input.length;
    const name = match[1]!.replace(/\s+/gu, ' ').toUpperCase();
    const rawDetail = input.slice(start + match[0].length, end);
    const detail = cleanDetail(rawDetail);
    return { name, detail, explanation: describeClause(name, detail) };
  });

  const tables = extractTables(clauses);
  const warnings: string[] = [];
  const selectClause = clauses.find((clause) => clause.name === 'SELECT');
  if (selectClause?.detail.trim() === '*') {
    warnings.push(
      'SELECT * returns every column, which can be fragile when a table changes. Name only the columns you need.',
    );
  }
  if (
    statementType === 'UPDATE' &&
    !clauses.some((clause) => clause.name === 'WHERE')
  ) {
    warnings.push('This UPDATE has no WHERE clause and may affect every row.');
  }
  if (
    statementType === 'DELETE' &&
    !clauses.some((clause) => clause.name === 'WHERE')
  ) {
    warnings.push('This DELETE has no WHERE clause and may remove every row.');
  }
  if (
    clauses.some((clause) => clause.name.includes('JOIN')) &&
    !clauses.some((clause) => ['ON', 'USING'].includes(clause.name))
  ) {
    warnings.push('A JOIN without ON or USING may produce a cross product.');
  }
  if (!clauses.some((clause) => clause.name === 'FROM') && statementType === 'SELECT') {
    warnings.push('This SELECT has no FROM clause, so it evaluates expressions without reading a table.');
  }

  return {
    statementType,
    clauses,
    tables,
    warnings,
  };
}

function describeClause(name: string, detail: string): string {
  switch (name) {
    case 'SELECT':
      return detail
        ? `Chooses the output expressions, including ${detail}.`
        : 'Chooses the output expressions.';
    case 'FROM':
      return detail
        ? `Reads rows from ${detail}.`
        : 'Specifies the source table or subquery.';
    case 'WHERE':
      return detail
        ? `Filters individual rows before grouping where ${detail}.`
        : 'Filters rows before grouping.';
    case 'GROUP BY':
      return detail
        ? `Groups rows that share the same values in ${detail}, usually so aggregates can be calculated per group.`
        : 'Groups rows so aggregate functions can operate per group.';
    case 'HAVING':
      return detail
        ? `Filters groups after aggregation where ${detail}.`
        : 'Filters groups after aggregation.';
    case 'ORDER BY':
      return detail
        ? `Sorts the result set by ${detail}.`
        : 'Sorts the result set.';
    case 'LIMIT':
      return detail
        ? `Caps the number of returned rows at ${detail}.`
        : 'Caps the number of returned rows.';
    case 'OFFSET':
      return detail
        ? `Skips ${detail} rows before returning results.`
        : 'Skips rows before returning results.';
    case 'UNION':
    case 'UNION ALL':
      return `${name} combines this result with the next SELECT result; UNION removes duplicates while UNION ALL keeps them.`;
    case 'INSERT INTO':
      return detail
        ? `Creates new rows in ${detail}.`
        : 'Identifies the destination table for new rows.';
    case 'VALUES':
      return 'Provides the literal values for new or updated rows.';
    case 'SET':
      return detail
        ? `Assigns new values: ${detail}.`
        : 'Assigns new column values.';
    case 'UPDATE':
      return detail
        ? `Modifies existing rows in ${detail}.`
        : 'Modifies existing rows.';
    case 'DELETE FROM':
      return detail
        ? `Deletes rows from ${detail}.`
        : 'Deletes rows from a table.';
    case 'RETURNING':
      return detail
        ? `Returns the changed rows, including ${detail}.`
        : 'Returns the affected rows.';
    case 'WITH':
      return 'Starts a common table expression, a named subquery that can be referenced later in the statement.';
    case 'ON':
      return detail
        ? `Matches rows using the join condition ${detail}.`
        : 'Defines the join condition.';
    case 'USING':
      return detail
        ? `Joins on the shared column(s) ${detail}.`
        : 'Joins on shared column names.';
    default:
      return name.includes('JOIN')
        ? 'Combines rows from another table into the result.'
        : 'This clause contributes to the statement.';
  }
}

function extractTables(clauses: SqlClauseExplanation[]): string[] {
  const tables = new Set<string>();
  for (const clause of clauses) {
    const base = clause.name.replace(/^INSERT\s+INTO$/u, 'INTO').replace(/\s+JOIN$/u, '');
    if (!['FROM', 'JOIN', 'UPDATE', 'INTO', 'DELETE FROM'].includes(base) && !clause.name.includes('JOIN')) {
      continue;
    }
    const detail = clause.detail;
    if (!detail) continue;
    if (detail.startsWith('(')) {
      tables.add('subquery');
      continue;
    }
    const first = detail.split(/[,\s]+/u)[0]?.replace(/[();]/gu, '');
    if (first && !['SELECT', 'VALUES'].includes(first.toUpperCase())) {
      tables.add(first);
    }
  }
  return [...tables];
}
