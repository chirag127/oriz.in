import { useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  DownloadButton,
  Field,
  ResetButton,
  Stat,
  ToolError,
  ToolNote,
  ToolShell,
  errorMessage,
} from './ui';
import { diffLines, diffWords } from '../../lib/diff';

const BEFORE = `The quick brown fox jumps over the lazy dog.
This line stays the same.
A sentence with a small typo.
The final line is removed.`;

const AFTER = `The quick brown fox jumps over the lazy dog.
This line stays the same.
A sentence with a small typo fixed.
A brand new final line arrives.`;

export default function DiffTool({ tool }: ToolProps) {
  const leftId = useId();
  const rightId = useId();
  const [before, setBefore] = useState(BEFORE);
  const [after, setAfter] = useState(AFTER);
  const [mode, setMode] = useState<'line' | 'word'>('line');

  const result = useMemo(() => {
    try {
      const diff = mode === 'line' ? diffLines(before, after) : diffWords(before, after);
      return { diff, error: '' };
    } catch (error) {
      return { diff: null, error: errorMessage(error) };
    }
  }, [before, after, mode]);

  const summary = result.diff
    ? result.diff.segments
        .map((segment) => {
          const prefix =
            segment.type === 'add' ? '+ ' : segment.type === 'remove' ? '- ' : '  ';
          return `${prefix}${segment.value}`;
        })
        .join(mode === 'line' ? '\n' : ' ')
    : '';

  const reset = () => {
    setBefore(BEFORE);
    setAfter(AFTER);
    setMode('line');
  };

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="Comparison mode">
          <select
            className="select"
            value={mode}
            onChange={(event) => setMode(event.target.value as 'line' | 'word')}
          >
            <option value="line">Line by line</option>
            <option value="word">Word by word</option>
          </select>
        </Field>
      </div>

      <div className="tool-grid">
        <div className="tool-pane">
          <div className="pane-head">
            <label htmlFor={leftId}>Original</label>
            <div className="pane-head-actions">
              <button
                type="button"
                className="pane-action"
                onClick={() => setBefore(BEFORE)}
              >
                Load sample
              </button>
            </div>
          </div>
          <textarea
            id={leftId}
            className="code-input tool-pane--tall"
            value={before}
            onChange={(event) => setBefore(event.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="tool-pane">
          <div className="pane-head">
            <label htmlFor={rightId}>Revised</label>
            <div className="pane-head-actions">
              <button
                type="button"
                className="pane-action"
                onClick={() => setAfter(AFTER)}
              >
                Load sample
              </button>
            </div>
          </div>
          <textarea
            id={rightId}
            className="code-input tool-pane--tall"
            value={after}
            onChange={(event) => setAfter(event.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      <ToolError message={result.error} />

      {result.diff && (
        <>
          <div className="stat-grid">
            <Stat label="Added" value={`+${result.diff.added}`} />
            <Stat label="Removed" value={`−${result.diff.removed}`} />
            <Stat label="Unchanged" value={String(result.diff.unchanged)} />
          </div>
          <div className="result-table-head">
            <h3>Difference</h3>
          </div>
          <div className={mode === 'word' ? 'diff-output diff-output--words' : 'diff-output'} tabIndex={0} role="region" aria-label="Text difference output">
            {mode === 'line'
              ? result.diff.segments.map((segment, index) => {
                  const prefix =
                    segment.type === 'add' ? '+' : segment.type === 'remove' ? '−' : ' ';
                  return (
                    <span
                      key={`${index}-${segment.type}`}
                      className={
                        segment.type === 'add'
                          ? 'diff-line diff-line--add'
                          : segment.type === 'remove'
                            ? 'diff-line diff-line--remove'
                            : 'diff-line'
                      }
                    >
                      <span className="diff-prefix">{prefix}</span>
                      {segment.value}
                    </span>
                  );
                })
              : result.diff.segments.map((segment, index) => (
                  <span
                    key={`${index}-${segment.type}`}
                    className={
                      segment.type === 'add'
                        ? 'diff-word diff-line--add'
                        : segment.type === 'remove'
                          ? 'diff-word diff-line--remove'
                          : 'diff-word'
                    }
                  >
                    {segment.value}{' '}
                  </span>
                ))}
          </div>
          <div className="tool-actions">
            <CopyButton text={summary} label="Copy diff" />
            <DownloadButton text={summary} filename="oriz-text-diff.txt" />
            <ResetButton onClick={reset} />
          </div>
        </>
      )}

      <ToolNote>
        {mode === 'word'
          ? 'Word mode normalizes whitespace to make the comparison readable. Use line mode when spacing or indentation matters.'
          : 'Each line is a token. Whitespace changes are therefore significant.'}
      </ToolNote>
    </ToolShell>
  );
}
