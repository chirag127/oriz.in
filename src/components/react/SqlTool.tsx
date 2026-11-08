import { useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  DownloadButton,
  ResetButton,
  ToolError,
  ToolInfo,
  ToolNote,
  ToolShell,
  errorMessage,
} from './ui';
import { explainSql, formatSql } from '../../lib/sql';

const SAMPLE = `select c.name, sum(o.total) as revenue
from customers c
join orders o on o.customer_id = c.id
where o.status = 'completed'
group by c.name
having sum(o.total) > 1000
order by revenue desc
limit 3;`;

export default function SqlTool({ tool }: ToolProps) {
  const mode = tool.options?.mode === 'explain' ? 'explain' : 'format';
  const inputId = useId();
  const [input, setInput] = useState(SAMPLE);

  const result = useMemo(() => {
    try {
      if (mode === 'format') {
        return { formatted: formatSql(input), explanation: null, error: '' };
      }
      return {
        formatted: '',
        explanation: explainSql(input),
        error: '',
      };
    } catch (error) {
      return { formatted: '', explanation: null, error: errorMessage(error) };
    }
  }, [input, mode]);

  const explanationText = result.explanation
    ? [
        result.explanation.statementType,
        ...result.explanation.clauses.map(
          (clause) => `${clause.name}: ${clause.explanation}`,
        ),
        ...(result.explanation.warnings.length > 0
          ? ['Warnings:', ...result.explanation.warnings]
          : []),
      ].join('\n')
    : '';

  return (
    <ToolShell title={tool.title}>
      <div className="tool-grid">
        <div className="tool-pane">
          <div className="pane-head">
            <label htmlFor={inputId}>SQL input</label>
            <div className="pane-head-actions">
              <button
                type="button"
                className="pane-action"
                onClick={() => setInput(SAMPLE)}
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
        <div className="tool-pane">
          <div className="pane-head">
            <span>{mode === 'format' ? 'Formatted SQL' : 'Clause breakdown'}</span>
            {mode === 'format' && (
              <div className="pane-head-actions">
                <CopyButton text={result.formatted} />
              </div>
            )}
          </div>
          {mode === 'format' ? (
            <textarea
              className="text-output tool-pane--tall"
              value={result.formatted}
              readOnly
              aria-label="Formatted SQL"
              spellCheck={false}
            />
          ) : (
            <div className="tool-app-body">
              {result.explanation && (
                <>
                  <ToolInfo>
                    Detected statement type: {result.explanation.statementType}
                  </ToolInfo>
                  <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
                    <table className="reference-table">
                      <thead>
                        <tr>
                          <th scope="col">Clause</th>
                          <th scope="col">Explanation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.explanation.clauses.map((clause) => (
                          <tr key={`${clause.name}-${clause.detail}`}>
                            <td>
                              <span className="ref-primary">{clause.name}</span>
                              {clause.detail && (
                                <span className="ref-muted">{clause.detail}</span>
                              )}
                            </td>
                            <td>{clause.explanation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {result.explanation.tables.length > 0 && (
                    <div className="chips">
                      {result.explanation.tables.map((table) => (
                        <span className="chip" key={table}>
                          {table}
                        </span>
                      ))}
                    </div>
                  )}
                  {result.explanation.warnings.length > 0 && (
                    <div className="tool-error" role="alert">
                      {result.explanation.warnings.join(' ')}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <ToolError message={result.error} />

      <div className="tool-actions">
        {mode === 'format' ? (
          <>
            <CopyButton text={result.formatted} label="Copy SQL" />
            <DownloadButton text={result.formatted} filename="oriz-query.sql" />
          </>
        ) : (
          <CopyButton text={explanationText} label="Copy explanation" />
        )}
        <ResetButton onClick={() => setInput(SAMPLE)} />
      </div>

      <ToolNote>
        {mode === 'format'
          ? 'The formatter handles common SELECT, INSERT, UPDATE, DELETE, and join syntax. It changes whitespace only and does not validate your database’s dialect.'
          : 'This is a deterministic reading aid, not an execution plan. Use EXPLAIN in your database for performance evidence.'}
      </ToolNote>
    </ToolShell>
  );
}
