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
import { CALCULATORS } from '../../lib/calculators';
import { tableToCsv } from '../../lib/csv';

export default function CalculatorTool({ tool }: ToolProps) {
  const config =
    CALCULATORS[tool.options?.calculator ?? 'percentage'] ?? CALCULATORS.percentage;
  const formId = useId();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((field) => [field.name, field.defaultValue])),
  );
  const [nonce, setNonce] = useState(0);

  const result = useMemo(() => {
    try {
      return { output: config.calculate(values), error: '' };
    } catch (error) {
      return { output: null, error: errorMessage(error) };
    }
  }, [config, values, nonce]);

  const reset = () => {
    setValues(
      Object.fromEntries(config.fields.map((field) => [field.name, field.defaultValue])),
    );
    setNonce((value) => value + 1);
  };

  return (
    <ToolShell title={tool.title}>
      <div className="calc-form" aria-label="Calculator inputs">
        {config.fields.map((field) => {
          const id = `${formId}-${field.name}`;
          const common = {
            id,
            className: field.type === 'select' ? 'select' : 'input',
            value: values[field.name] ?? '',
            onChange: (
              event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
            ) =>
              setValues((current) => ({
                ...current,
                [field.name]: event.target.value,
              })),
          };

          if (field.type === 'select') {
            return (
              <Field label={field.label} hint={field.help} key={field.name}>
                <select {...common} className="select">
                  {field.options?.map((option) => (
                    <option value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>
            );
          }

          if (field.type === 'textarea') {
            return (
              <div className="field field--full" key={field.name}>
                <label htmlFor={id} className="field-label">{field.label}</label>
                <textarea
                  id={id}
                  className="textarea"
                  value={values[field.name] ?? ''}
                  onChange={common.onChange}
                />
                {field.help && <span className="field-hint">{field.help}</span>}
              </div>
            );
          }

          return (
            <Field label={field.label} hint={field.help} key={field.name}>
              <div className="field-row">
                <input
                  id={id}
                  className="input"
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={values[field.name] ?? ''}
                  onChange={common.onChange}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  placeholder={field.placeholder}
                  inputMode={field.type === 'number' ? 'decimal' : undefined}
                />
                {field.suffix && <span className="field-suffix">{field.suffix}</span>}
              </div>
            </Field>
          );
        })}
      </div>

      <ToolError message={result.error} />

      {result.output && (
        <div className="result-panel">
          <div className="stat-grid" aria-live="polite">
            {result.output.headline.map((headline) => (
              <Stat
                key={headline.label}
                label={headline.label}
                value={headline.value}
                hint={headline.hint}
              />
            ))}
          </div>

          {result.output.rows && result.output.rows.length > 0 && (
            <dl className="result-rows">
              {result.output.rows.map((row) => (
                <div className="result-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                  {row.hint && <span className="result-row-note">{row.hint}</span>}
                </div>
              ))}
            </dl>
          )}

          {result.output.textOutput && (
            <div>
              <div className="result-table-head">
                <h3>{result.output.textOutput.label}</h3>
                <CopyButton text={result.output.textOutput.value} />
              </div>
              <pre className="result-text">{result.output.textOutput.value}</pre>
            </div>
          )}

          {result.output.table && (
            <div>
              <div className="result-table-head">
                <h3>{result.output.table.caption ?? 'Schedule'}</h3>
                <div className="tool-actions">
                  <DownloadButton
                    text={tableToCsv(result.output.table.columns, result.output.table.rows)}
                    filename={result.output.table.downloadName ?? 'oriz-results.csv'}
                    mime="text/csv;charset=utf-8"
                    label="Download CSV"
                  />
                </div>
              </div>
              <div className="result-table-wrap" tabIndex={0} role="region" aria-label="Scrollable results table">
                <table className="data-table">
                  <thead>
                    <tr>
                      {result.output.table.columns.map((column) => (
                        <th scope="col">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.output.table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td className={cellIndex === 0 ? 'text-left' : undefined}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.output.notes && result.output.notes.length > 0 && (
            <ToolNote>
              <ul>
                {result.output.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </ToolNote>
          )}
        </div>
      )}

      <div className="tool-actions">
        {config.slug === 'random-sample' && (
          <button
            type="button"
            className="btn btn--primary btn--small"
            onClick={() => setNonce((value) => value + 1)}
          >
            Generate again
          </button>
        )}
        <ResetButton onClick={reset} />
      </div>
    </ToolShell>
  );
}
