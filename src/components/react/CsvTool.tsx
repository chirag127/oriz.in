import { useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  DownloadButton,
  Field,
  ResetButton,
  ToolError,
  ToolInfo,
  ToolShell,
  errorMessage,
} from './ui';
import { jsonToCsv, parseCsv, type CsvDelimiter } from '../../lib/csv';
import { parseJson } from '../../lib/json';

const CSV_SAMPLE = `name,role,location,active
"Ada, A.","engineer","London",true
"Grace H.","admiral","New York",false
"Katherine J.","mathematician","Hampton",true`;

const JSON_SAMPLE = `[
  { "name": "Ada", "role": "engineer", "active": true },
  { "name": "Grace", "role": "admiral", "active": false },
  { "name": "Katherine", "role": "mathematician", "active": true }
]`;

const PREVIEW_LIMIT = 200;

export default function CsvTool({ tool }: ToolProps) {
  const mode = tool.options?.mode === 'json-to-csv' ? 'json-to-csv' : 'preview';
  const inputId = useId();
  const [input, setInput] = useState(mode === 'preview' ? CSV_SAMPLE : JSON_SAMPLE);
  const [delimiter, setDelimiter] = useState<CsvDelimiter>(',');
  const [hasHeader, setHasHeader] = useState(true);

  const result = useMemo(() => {
    if (mode === 'preview') {
      try {
        const rows = parseCsv(input, delimiter);
        const headers = hasHeader && rows.length > 0
          ? rows[0]!
          : rows[0]?.map((_, index) => `Column ${index + 1}`) ?? [];
        const body = hasHeader ? rows.slice(1) : rows;
        return {
          rows,
          headers,
          body,
          csv: '',
          columns: headers.length,
          error: '',
        };
      } catch (error) {
        return {
          rows: [] as string[][],
          headers: [] as string[],
          body: [] as string[][],
          csv: '',
          columns: 0,
          error: errorMessage(error),
        };
      }
    }

    const parsed = parseJson(input);
    if (!parsed.ok) {
      return {
        rows: [] as string[][],
        headers: [] as string[],
        body: [] as string[][],
        csv: '',
        columns: 0,
        error: `${parsed.message}${parsed.line !== null ? ` Line ${parsed.line}, column ${parsed.column}.` : ''}`,
      };
    }
    try {
      const converted = jsonToCsv(parsed.value, delimiter);
      const parsedPreview = converted.csv
        ? parseCsv(converted.csv, delimiter)
        : [];
      return {
        rows: parsedPreview,
        headers: converted.columns,
        body: parsedPreview.slice(1),
        csv: converted.csv,
        columns: converted.columns.length,
        error: '',
      };
    } catch (error) {
      return {
        rows: [] as string[][],
        headers: [] as string[],
        body: [] as string[][],
        csv: '',
        columns: 0,
        error: errorMessage(error),
      };
    }
  }, [input, mode, delimiter, hasHeader]);

  const reset = () => {
    setInput(mode === 'preview' ? CSV_SAMPLE : JSON_SAMPLE);
    setDelimiter(',');
    setHasHeader(true);
  };

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="Delimiter">
          <select
            className="select"
            value={delimiter}
            onChange={(event) => setDelimiter(event.target.value as CsvDelimiter)}
          >
            <option value=",">Comma</option>
            <option value=";">Semicolon</option>
            <option value={'	'}>Tab</option>
            <option value="|">Pipe</option>
          </select>
        </Field>
        {mode === 'preview' && (
          <label className="checkbox checkbox-inline">
            <input
              type="checkbox"
              checked={hasHeader}
              onChange={(event) => setHasHeader(event.target.checked)}
            />
            First row is a header
          </label>
        )}
      </div>

      <div className={mode === 'json-to-csv' ? 'tool-grid' : 'tool-grid tool-grid--single'}>
        <div className="tool-pane">
          <div className="pane-head">
            <label htmlFor={inputId}>
              {mode === 'preview' ? 'CSV input' : 'JSON array input'}
            </label>
            <div className="pane-head-actions">
              <button
                type="button"
                className="pane-action"
                onClick={() => setInput(mode === 'preview' ? CSV_SAMPLE : JSON_SAMPLE)}
              >
                Load sample
              </button>
            </div>
          </div>
          <textarea
            id={inputId}
            className="code-input tool-pane--tall"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            aria-invalid={Boolean(result.error)}
          />
        </div>
        {mode === 'json-to-csv' && (
          <div className="tool-pane">
            <div className="pane-head">
              <span>CSV output</span>
              <div className="pane-head-actions">
                <CopyButton text={result.csv} />
              </div>
            </div>
            <textarea
              className="text-output tool-pane--tall"
              value={result.csv}
              readOnly
              aria-label="Generated CSV"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      <ToolError message={result.error} />
      {!result.error && (
        <ToolInfo>
          {result.rows.length.toLocaleString('en-US')} parsed rows ·{' '}
          {result.columns} {result.columns === 1 ? 'column' : 'columns'}
          {result.rows.length > PREVIEW_LIMIT
            ? ` · showing the first ${PREVIEW_LIMIT} rows`
            : ''}
        </ToolInfo>
      )}

      {result.headers.length > 0 && (
        <div>
          <div className="result-table-head">
            <h3>Preview</h3>
          </div>
          <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
            <table className="reference-table">
              <thead>
                <tr>
                  {result.headers.map((header) => (
                    <th scope="col">{header || '—'}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.body.slice(0, PREVIEW_LIMIT).map((row) => (
                  <tr>
                    {result.headers.map((_, index) => (
                      <td>{row[index] ?? ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="tool-actions">
        {mode === 'json-to-csv' && (
          <>
            <CopyButton text={result.csv} label="Copy CSV" />
            <DownloadButton
              text={result.csv}
              filename="oriz-json-to-csv.csv"
              mime="text/csv;charset=utf-8"
            />
          </>
        )}
        <ResetButton onClick={reset} />
      </div>
    </ToolShell>
  );
}
