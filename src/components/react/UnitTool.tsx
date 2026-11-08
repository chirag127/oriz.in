import { useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  Field,
  ResetButton,
  ToolError,
  ToolNote,
  ToolShell,
  errorMessage,
} from './ui';
import {
  UNIT_CATEGORIES,
  convertUnit,
  formatUnitValue,
  getUnitCategory,
} from '../../lib/units';

export default function UnitTool({ tool }: ToolProps) {
  const inputId = useId();
  const [categoryId, setCategoryId] = useState('length');
  const [fromUnit, setFromUnit] = useState('km');
  const [toUnit, setToUnit] = useState('mi');
  const [value, setValue] = useState('1');

  const category = useMemo(() => getUnitCategory(categoryId), [categoryId]);
  const from = category.units.find((unit) => unit.id === fromUnit) ?? category.units[0]!;
  const to = category.units.find((unit) => unit.id === toUnit) ?? category.units[1]!;

  const result = useMemo(() => {
    try {
      const numeric = Number(value);
      if (!value.trim() || !Number.isFinite(numeric)) {
        throw new Error('Enter a finite numeric value.');
      }
      const converted = convertUnit(categoryId, fromUnit, toUnit, numeric);
      const table = category.units.map((unit) => {
        try {
          return {
            unit,
            converted: convertUnit(categoryId, fromUnit, unit.id, numeric),
          };
        } catch {
          return { unit, converted: null };
        }
      });
      return { converted, table, error: '' };
    } catch (error) {
      return { converted: null, table: [], error: errorMessage(error) };
    }
  }, [value, categoryId, fromUnit, toUnit, category]);

  const changeCategory = (nextCategoryId: string) => {
    const next = getUnitCategory(nextCategoryId);
    setCategoryId(next.id);
    setFromUnit(next.units[0]!.id);
    setToUnit((next.units[1] ?? next.units[0])!.id);
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result.converted !== null) {
      setValue(String(result.converted));
    }
  };

  const copyText =
    result.converted !== null
      ? `${formatUnitValue(Number(value))} ${from.symbol} = ${formatUnitValue(result.converted)} ${to.symbol}`
      : '';

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="Measurement">
          <select
            className="select"
            value={categoryId}
            onChange={(event) => changeCategory(event.target.value)}
          >
            {UNIT_CATEGORIES.map((entry) => (
              <option value={entry.id}>{entry.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Value">
          <input
            id={inputId}
            className="input"
            type="number"
            step="any"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-invalid={Boolean(result.error)}
          />
        </Field>
      </div>

      <div className="tool-controls">
        <Field label="From">
          <select
            className="select"
            value={fromUnit}
            onChange={(event) => setFromUnit(event.target.value)}
          >
            {category.units.map((unit) => (
              <option value={unit.id}>{unit.label} ({unit.symbol})</option>
            ))}
          </select>
        </Field>
        <div className="field">
          <span className="field-label">Swap</span>
          <button type="button" className="btn btn--secondary" onClick={swap}>
            ⇄ Swap units
          </button>
        </div>
        <Field label="To">
          <select
            className="select"
            value={toUnit}
            onChange={(event) => setToUnit(event.target.value)}
          >
            {category.units.map((unit) => (
              <option value={unit.id}>{unit.label} ({unit.symbol})</option>
            ))}
          </select>
        </Field>
      </div>

      <ToolError message={result.error} />

      {result.converted !== null && (
        <div className="result-panel">
          <div className="result-lede">Converted value</div>
          <div className="result-headline" aria-live="polite">
            {formatUnitValue(result.converted)} {to.symbol}
          </div>
          <div className="result-table-head">
            <h3>{formatUnitValue(Number(value))} {from.symbol} in every supported unit</h3>
          </div>
          <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
            <table className="reference-table">
              <thead>
                <tr>
                  <th scope="col">Unit</th>
                  <th scope="col">Symbol</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {result.table.map((row) => (
                  <tr key={row.unit.id}>
                    <td>
                      <span className="ref-primary">{row.unit.label}</span>
                    </td>
                    <td>{row.unit.symbol}</td>
                    <td>
                      {row.converted === null
                        ? 'Not available'
                        : formatUnitValue(row.converted)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="tool-actions">
        <CopyButton text={copyText} label="Copy result" />
        <ResetButton
          onClick={() => {
            setCategoryId('length');
            setFromUnit('km');
            setToUnit('mi');
            setValue('1');
          }}
        />
      </div>

      <ToolNote>
        Conversion factors are conventional values. Digital storage separates
        decimal (kB) and binary (KiB) units. Temperature conversions enforce
        absolute zero.
      </ToolNote>
    </ToolShell>
  );
}
