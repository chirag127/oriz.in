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
import { NUMBER_BASES, convertIntegerBases, type Base } from '../../lib/math';

const BASE_LABELS: Record<Base, string> = {
  2: 'Binary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal',
};

export default function NumberBaseTool({ tool }: ToolProps) {
  const inputId = useId();
  const [input, setInput] = useState('255');
  const [base, setBase] = useState<Base>(10);

  const result = useMemo(() => {
    if (input.length > 2000) {
      return { output: null, error: 'Input is limited to 2,000 characters.' };
    }
    try {
      return { output: convertIntegerBases(input, base), error: '' };
    } catch (error) {
      return { output: null, error: errorMessage(error) };
    }
  }, [input, base]);

  const copyText = result.output
    ? NUMBER_BASES.map(
        (entry) => `${BASE_LABELS[entry.value]}: ${result.output![entry.value]}`,
      ).join('\n')
    : '';

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="Integer">
          <input
            id={inputId}
            className="input mono-block"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            placeholder="255 or -1010"
            aria-invalid={Boolean(result.error)}
          />
        </Field>
        <Field label="Input base">
          <select
            className="select"
            value={base}
            onChange={(event) => setBase(Number(event.target.value) as Base)}
          >
            {NUMBER_BASES.map((entry) => (
              <option value={entry.value}>
                {entry.label} ({entry.value})
              </option>
            ))}
          </select>
        </Field>
      </div>

      <ToolError message={result.error} />

      {result.output && (
        <div className="result-lines">
          {NUMBER_BASES.map((entry) => (
            <div className="result-line" key={entry.value}>
              <span>
                {BASE_LABELS[entry.value]} ({entry.value})
              </span>
              <code>
                {result.output![entry.value]}
              </code>
            </div>
          ))}
        </div>
      )}

      <div className="tool-actions">
        <CopyButton text={copyText} label="Copy all bases" />
        <ResetButton
          onClick={() => {
            setInput('255');
            setBase(10);
          }}
        />
      </div>

      <ToolNote>
        Integers only. Prefixes are accepted when they match the selected base;
        fractional values and arbitrarily large displays are outside the
        tool’s practical limits.
      </ToolNote>
    </ToolShell>
  );
}
