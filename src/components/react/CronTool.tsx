import { useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  Field,
  ResetButton,
  ToolError,
  ToolInfo,
  ToolNote,
  ToolShell,
  errorMessage,
} from './ui';
import { CRON_EXAMPLES, explainCron, nextCronRuns } from '../../lib/cron';

export default function CronTool({ tool }: ToolProps) {
  const inputId = useId();
  const [expression, setExpression] = useState('0 9 * * 1-5');

  const result = useMemo(() => {
    try {
      const explanation = explainCron(expression);
      const runs = nextCronRuns(expression, new Date(), 5);
      return { explanation, runs, error: '' };
    } catch (error) {
      return { explanation: null, runs: [], error: errorMessage(error) };
    }
  }, [expression]);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      }),
    [],
  );

  const copyText = result.explanation
    ? [
        result.explanation.summary,
        ...result.runs.map((run) => formatter.format(run)),
      ].join('\n')
    : '';

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field
          label="Cron expression"
          hint="Minute hour day-of-month month day-of-week"
        >
          <input
            id={inputId}
            className="input mono-block"
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            spellCheck={false}
            placeholder="0 9 * * 1-5"
            aria-invalid={Boolean(result.error)}
          />
        </Field>
        <div className="field">
          <span className="field-label">Examples</span>
          <div className="chips">
            {CRON_EXAMPLES.map((example) => (
              <button
                key={example.expression}
                type="button"
                className="chip"
                onClick={() => setExpression(example.expression)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ToolError message={result.error} />

      {result.explanation && (
        <>
          <div className="tool-info" aria-live="polite">
            <strong>{result.explanation.summary}</strong>
          </div>

          <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
            <table className="reference-table">
              <thead>
                <tr>
                  <th scope="col">Field</th>
                  <th scope="col">Expression</th>
                  <th scope="col">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {result.explanation.fields.map((field) => (
                  <tr key={field.label}>
                    <td>
                      <span className="ref-primary">{field.label}</span>
                    </td>
                    <td>
                      <code>{field.specification}</code>
                    </td>
                    <td>{field.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="result-table-head">
            <h3>Next five runs</h3>
            <span className="reference-count">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </div>
          {result.runs.length > 0 ? (
            <ol className="cron-runs">
              {result.runs.map((run) => (
                <li key={run.toISOString()}>
                  <time dateTime={run.toISOString()}>{formatter.format(run)}</time>
                </li>
              ))}
            </ol>
          ) : (
            <ToolInfo>
              No matching time was found in the next five years in this time
              zone. Check the day-of-month and month fields for an impossible
              date.
            </ToolInfo>
          )}
        </>
      )}

      <div className="tool-actions">
        <CopyButton text={copyText} label="Copy explanation" />
        <ResetButton onClick={() => setExpression('0 9 * * 1-5')} />
      </div>

      <ToolNote>
        Standard five-field cron only. The preview runs in your browser’s local
        time zone; a server may interpret the same expression differently.
      </ToolNote>
    </ToolShell>
  );
}
