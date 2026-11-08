import { useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  DownloadButton,
  Field,
  ResetButton,
  Stat,
  ToolError,
  ToolInfo,
  ToolShell,
  errorMessage,
} from './ui';
import { formatJson, minifyJson, parseJson, summarizeJson } from '../../lib/json';

const SAMPLE = `{
  "name": "ORIZ.IN",
  "type": "knowledge and tools",
  "toolCount": 50,
  "privacyFirst": true,
  "categories": ["web", "data", "finance"],
  "maintainer": {
    "name": "Chirag Singhal",
    "role": "Software engineer"
  }
}`;

export default function JsonTool({ tool }: ToolProps) {
  const mode = tool.options?.mode === 'minify' ? 'minify' : 'format';
  const inputId = useId();
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState<'2' | '4' | 'tab'>('2');

  const result = useMemo(() => {
    const parsed = parseJson(input);
    if (!parsed.ok) {
      const location =
        parsed.line !== null && parsed.column !== null
          ? ` Line ${parsed.line}, column ${parsed.column}.`
          : '';
      return {
        output: '',
        error: `${parsed.message}${location}`,
        summary: null as ReturnType<typeof summarizeJson> | null,
        inputBytes: new TextEncoder().encode(input).length,
        outputBytes: 0,
      };
    }

    try {
      const output =
        mode === 'minify'
          ? minifyJson(parsed.value)
          : formatJson(parsed.value, indent === 'tab' ? '\t' : Number(indent) as 2 | 4);
      return {
        output,
        error: '',
        summary: summarizeJson(parsed.value),
        inputBytes: new TextEncoder().encode(input).length,
        outputBytes: new TextEncoder().encode(output).length,
      };
    } catch (error) {
      return {
        output: '',
        error: errorMessage(error),
        summary: null,
        inputBytes: new TextEncoder().encode(input).length,
        outputBytes: 0,
      };
    }
  }, [input, indent, mode]);

  const reduction =
    result.inputBytes > 0 && result.outputBytes > 0
      ? Math.max(0, 100 - (result.outputBytes / result.inputBytes) * 100)
      : 0;

  const reset = () => {
    setInput(SAMPLE);
    setIndent('2');
  };

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        {mode === 'format' && (
          <Field label="Indentation">
            <select
              className="select"
              value={indent}
              onChange={(event) =>
                setIndent(event.target.value as '2' | '4' | 'tab')
              }
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tabs</option>
            </select>
          </Field>
        )}
        <div className="field">
          <span className="field-label">Actions</span>
          <div className="tool-actions">
            <button
              type="button"
              className="btn btn--secondary btn--small"
              onClick={() => setInput(SAMPLE)}
            >
              Load sample
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => setInput('')}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="tool-grid">
        <div className="tool-pane">
          <div className="pane-head">
            <label htmlFor={inputId}>JSON input</label>
          </div>
          <textarea
            id={inputId}
            className="code-input tool-pane--tall"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            aria-invalid={Boolean(result.error)}
            aria-describedby={result.error ? 'json-error' : undefined}
          />
        </div>
        <div className="tool-pane">
          <div className="pane-head">
            <span>{mode === 'minify' ? 'Minified output' : 'Formatted output'}</span>
            <div className="pane-head-actions">
              <CopyButton text={result.output} />
            </div>
          </div>
          <textarea
            className="text-output tool-pane--tall"
            value={result.output}
            readOnly
            aria-label="JSON output"
            spellCheck={false}
          />
        </div>
      </div>

      {result.error ? (
        <div id="json-error">
          <ToolError message={result.error} />
        </div>
      ) : (
        result.summary && (
          <ToolInfo>
            Valid JSON: {result.summary.kind} with {result.summary.size}{' '}
            {result.summary.size === 1 ? 'entry' : 'entries'} at depth{' '}
            {result.summary.depth}.
          </ToolInfo>
        )
      )}

      <div className="stat-grid">
        <Stat
          label="Input size"
          value={`${result.inputBytes.toLocaleString('en-US')} B`}
          hint="UTF-8 bytes"
        />
        <Stat
          label="Output size"
          value={`${result.outputBytes.toLocaleString('en-US')} B`}
          hint={mode === 'minify' ? 'Whitespace removed' : 'Formatted'}
        />
        {mode === 'minify' && (
          <Stat
            label="Size reduction"
            value={`${reduction.toFixed(1)}%`}
            hint="Compared with the input"
          />
        )}
      </div>

      <div className="tool-actions">
        <CopyButton text={result.output} label="Copy JSON" />
        <DownloadButton text={result.output} filename="oriz-json.txt" />
        <ResetButton onClick={reset} />
      </div>
    </ToolShell>
  );
}
