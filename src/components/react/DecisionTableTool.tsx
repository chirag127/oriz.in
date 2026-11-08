import { useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  DownloadButton,
  ResetButton,
  ToolNote,
  ToolShell,
} from './ui';
import { tableToCsv } from '../../lib/csv';

const INITIAL_COLUMNS = ['Condition', 'Action', 'Notes'];
const INITIAL_ROWS = [
  ['Order total ≥ 50', 'Offer free shipping', ''],
  ['Customer is new', 'Include a welcome note', ''],
  ['Payment pending', 'Hold fulfilment', 'Manual review'],
];

function escapeMarkdown(value: string): string {
  return value.replace(/\|/gu, '\\|').replace(/\r?\n/gu, '<br>');
}

export default function DecisionTableTool({ tool }: ToolProps) {
  const [title, setTitle] = useState('Untitled decision table');
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [rows, setRows] = useState(INITIAL_ROWS);

  const markdown = useMemo(() => {
    const header = `| ${columns.map(escapeMarkdown).join(' | ')} |`;
    const divider = `| ${columns.map(() => '---').join(' | ')} |`;
    const body = rows.map(
      (row) => `| ${columns.map((_, index) => escapeMarkdown(row[index] ?? '')).join(' | ')} |`,
    );
    return [`## ${title}`, '', header, divider, ...body, ''].join('\n');
  }, [title, columns, rows]);

  const csv = useMemo(() => tableToCsv(columns, rows), [columns, rows]);

  const updateCell = (rowIndex: number, columnIndex: number, value: string) => {
    setRows((current) =>
      current.map((row, index) => {
        if (index !== rowIndex) return row;
        const next = [...row];
        next[columnIndex] = value;
        return next;
      }),
    );
  };

  const reset = () => {
    setTitle('Untitled decision table');
    setColumns([...INITIAL_COLUMNS]);
    setRows(INITIAL_ROWS.map((row) => [...row]));
  };

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <label className="field field--grow">
          <span className="field-label">Table title</span>
          <input
            className="input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
      </div>

      <div className="decision-table-wrap">
        <table className="decision-table">
          <thead>
            <tr>
              {columns.map((column, columnIndex) => (
                <th scope="col" key={columnIndex}>
                  <input
                    value={column}
                    onChange={(event) =>
                      setColumns((current) =>
                        current.map((value, index) =>
                          index === columnIndex ? event.target.value : value,
                        ),
                      )
                    }
                    aria-label={`Column ${columnIndex + 1} heading`}
                  />
                </th>
              ))}
              <th scope="col">
                <span className="sr-only">Row actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((_, columnIndex) => (
                  <td key={columnIndex}>
                    <input
                      value={row[columnIndex] ?? ''}
                      onChange={(event) =>
                        updateCell(rowIndex, columnIndex, event.target.value)
                      }
                      aria-label={`Row ${rowIndex + 1}, ${columns[columnIndex]}`}
                    />
                  </td>
                ))}
                <td>
                  <button
                    type="button"
                    className="btn btn--ghost row-remove"
                    onClick={() =>
                      setRows((current) =>
                        current.filter((_, index) => index !== rowIndex),
                      )
                    }
                    disabled={rows.length <= 1}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tool-actions">
        <button
          type="button"
          className="btn btn--secondary btn--small"
          onClick={() =>
            setRows((current) => [...current, columns.map(() => '')])
          }
        >
          Add row
        </button>
        <button
          type="button"
          className="btn btn--secondary btn--small"
          onClick={() =>
            setColumns((current) => [...current, `Column ${current.length + 1}`])
          }
        >
          Add column
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => setColumns((current) => current.slice(0, -1))}
          disabled={columns.length <= 1}
        >
          Remove last column
        </button>
      </div>

      <div className="result-table-head">
        <h2>Export preview</h2>
        <CopyButton text={markdown} label="Copy Markdown" />
      </div>
      <pre className="result-text">{markdown}</pre>

      <div className="tool-actions">
        <DownloadButton
          text={markdown}
          filename="oriz-decision-table.md"
          mime="text/markdown;charset=utf-8"
        />
        <DownloadButton
          text={csv}
          filename="oriz-decision-table.csv"
          mime="text/csv;charset=utf-8"
        />
        <ResetButton onClick={reset} />
      </div>

      <ToolNote>
        Changes are not saved after you leave the page. The builder does not
        validate logical completeness or generate combination rules; it is a
        lightweight table editor.
      </ToolNote>
    </ToolShell>
  );
}
