import { useId, useMemo, useState, type ReactNode } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  DownloadButton,
  Field,
  ResetButton,
  ToolError,
  ToolInfo,
  ToolNote,
  ToolShell,
} from './ui';

const DEFAULT_PATTERN = String.raw`\b[\w.+-]+@[\w-]+\.[\w.]+\b`;
const SAMPLE_TEXT = `Contact ada@example.com or grace.hopper@navy.example.org for details.
Invalid addresses such as hello@ and @example.com should not match.`;
const FLAGS = [
  { flag: 'g', label: 'g — global' },
  { flag: 'i', label: 'i — ignore case' },
  { flag: 'm', label: 'm — multiline' },
  { flag: 's', label: 's — dot matches newlines' },
  { flag: 'u', label: 'u — Unicode' },
  { flag: 'y', label: 'y — sticky' },
] as const;

interface MatchInfo {
  value: string;
  index: number;
  groups: (string | undefined)[];
  namedGroups: Record<string, string> | undefined;
}

export default function RegexTool({ tool }: ToolProps) {
  const patternId = useId();
  const textId = useId();
  const replacementId = useId();
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [flags, setFlags] = useState<string[]>(['g', 'u']);
  const [text, setText] = useState(SAMPLE_TEXT);
  const [replacement, setReplacement] = useState('');

  const result = useMemo(() => {
    if (!pattern) {
      return {
        error: '',
        expression: '',
        matches: [] as MatchInfo[],
        replaced: '',
        nodes: [] as ReactNode[],
      };
    }
    if (pattern.length > 1000) {
      return {
        error: 'Patterns are limited to 1,000 characters.',
        expression: '',
        matches: [] as MatchInfo[],
        replaced: '',
        nodes: [] as ReactNode[],
      };
    }
    if (text.length > 20000) {
      return {
        error: 'Test text is limited to 20,000 characters.',
        expression: '',
        matches: [] as MatchInfo[],
        replaced: '',
        nodes: [] as ReactNode[],
      };
    }

    const flagString = FLAGS.map((entry) => entry.flag)
      .filter((flag) => flags.includes(flag))
      .join('');

    try {
      const regex = new RegExp(pattern, flagString);
      const expression = `/${pattern}/${flagString}`;
      const matches: MatchInfo[] = [];
      const globalish = flagString.includes('g') || flagString.includes('y');

      if (globalish) {
        let match: RegExpExecArray | null;
        let guard = 0;
        while ((match = regex.exec(text)) !== null && guard < 500) {
          matches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups,
          });
          guard += 1;
          if (match[0] === '') regex.lastIndex += 1;
          if (guard >= 500) break;
        }
      } else {
        const match = regex.exec(text);
        if (match) {
          matches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups,
          });
        }
      }

      const nodes: ReactNode[] = [];
      let cursor = 0;
      matches.forEach((match, matchIndex) => {
        if (match.value === '') return;
        if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
        nodes.push(
          <mark key={`match-${matchIndex}`} className="regex-highlight">
            {match.value}
          </mark>,
        );
        cursor = match.index + match.value.length;
      });
      if (cursor < text.length) nodes.push(text.slice(cursor));

      return {
        error: '',
        expression,
        matches,
        replaced: text.replace(regex, replacement),
        nodes,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'The pattern is not valid.',
        expression: '',
        matches: [] as MatchInfo[],
        replaced: '',
        nodes: [] as ReactNode[],
      };
    }
  }, [pattern, flags, text, replacement]);

  const report = JSON.stringify(
    result.matches.map((match) => ({
      value: match.value,
      index: match.index,
      groups: match.groups,
      namedGroups: match.namedGroups,
    })),
    null,
    2,
  );

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="Pattern">
          <input
            id={patternId}
            className="input mono-block"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            spellCheck={false}
            aria-invalid={Boolean(result.error)}
          />
        </Field>
        <div className="field">
          <span className="field-label">Flags</span>
          <div className="checkbox-row">
            {FLAGS.map((entry) => (
              <label className="checkbox" key={entry.flag}>
                <input
                  type="checkbox"
                  checked={flags.includes(entry.flag)}
                  onChange={() =>
                    setFlags((current) =>
                      current.includes(entry.flag)
                        ? current.filter((flag) => flag !== entry.flag)
                        : [...current, entry.flag],
                    )
                  }
                />
                {entry.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="tool-grid">
        <div className="tool-pane">
          <div className="pane-head">
            <label htmlFor={textId}>Test text</label>
            <span className="reference-count">{text.length.toLocaleString('en-US')} chars</span>
          </div>
          <textarea
            id={textId}
            className="code-input tool-pane--tall"
            value={text}
            onChange={(event) => setText(event.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="tool-pane">
          <div className="pane-head">
            <label htmlFor={replacementId}>Replacement preview</label>
          </div>
          <div className="tool-app-body">
            <Field label="Replacement template" hint="Use $1, $2, or named groups such as $<year>.">
              <input
                id={replacementId}
                className="input mono-block"
                value={replacement}
                onChange={(event) => setReplacement(event.target.value)}
                placeholder="Leave empty to remove matches"
                spellCheck={false}
              />
            </Field>
            <textarea
              className="text-output"
              value={result.replaced}
              readOnly
              aria-label="Replacement output"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      <ToolError message={result.error} />

      {!result.error && (
        <>
          <div className="result-table-head">
            <h3>Highlighted matches</h3>
            <span className="reference-count">
              {result.matches.length} {result.matches.length === 1 ? 'match' : 'matches'}
            </span>
          </div>
          <div className="regex-preview">{result.nodes.length > 0 ? result.nodes : text}</div>

          {result.matches.length > 0 && (
            <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
              <table className="reference-table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Match</th>
                    <th scope="col">Index</th>
                    <th scope="col">Capture groups</th>
                  </tr>
                </thead>
                <tbody>
                  {result.matches.map((match, index) => (
                    <tr key={`${index}-${match.index}`}>
                      <td>{index + 1}</td>
                      <td>
                        <code>{match.value || '(empty match)'}</code>
                      </td>
                      <td>{match.index}</td>
                      <td>
                        {match.groups.length === 0 && !match.namedGroups
                          ? '—'
                          : match.groups
                              .map((group, groupIndex) => `${groupIndex + 1}: ${group ?? '(unset)'}`)
                              .join(', ')}
                        {match.namedGroups &&
                          Object.entries(match.namedGroups).map(([name, value]) => (
                            <span key={name}>
                              {match.groups.length > 0 ? '; ' : ''}
                              {name}: {value}
                            </span>
                          ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <ToolInfo>
            {result.expression} · {result.matches.length}{' '}
            {result.matches.length === 1 ? 'match' : 'matches'}
          </ToolInfo>
        </>
      )}

      <div className="tool-actions">
        <CopyButton text={result.expression} label="Copy expression" />
        <CopyButton text={report} label="Copy match report" />
        <DownloadButton text={result.replaced} filename="oriz-regex-result.txt" />
        <ResetButton
          onClick={() => {
            setPattern(DEFAULT_PATTERN);
            setFlags(['g', 'u']);
            setText(SAMPLE_TEXT);
            setReplacement('');
          }}
        />
      </div>

      <ToolNote>
        This uses the JavaScript regular expression engine. Catastrophic
        backtracking can make the page unresponsive, so avoid pathological
        patterns on large inputs.
      </ToolNote>
    </ToolShell>
  );
}
