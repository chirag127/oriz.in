import { useDeferredValue, useEffect, useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  DownloadButton,
  Field,
  ResetButton,
  Stat,
  ToolError,
  ToolInfo,
  ToolNote,
  ToolShell,
  errorMessage,
} from './ui';
import { HASH_ALGORITHMS, hashText, type HashAlgorithm } from '../../lib/hash';
import { generateUuids } from '../../lib/random';
import { unicodeSummary } from '../../lib/text';

export default function MiscTools({ tool }: ToolProps) {
  if (tool.engine === 'hash') return <HashTool tool={tool} />;
  if (tool.engine === 'uuid') return <UuidTool tool={tool} />;
  return <UnicodeTool tool={tool} />;
}

function HashTool({ tool }: ToolProps) {
  const inputId = useId();
  const [input, setInput] = useState('hello world');
  const [algorithms, setAlgorithms] = useState<HashAlgorithm[]>(['SHA-256']);
  const [uppercase, setUppercase] = useState(false);
  const [results, setResults] = useState<{ algorithm: string; digest: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const deferredInput = useDeferredValue(input);

  useEffect(() => {
    let active = true;
    if (algorithms.length === 0) {
      setResults([]);
      setError('Select at least one hash algorithm.');
      return;
    }
    setLoading(true);
    setError('');
    Promise.all(
      algorithms.map(async (algorithm) => ({
        algorithm,
        digest: await hashText(deferredInput, algorithm, uppercase),
      })),
    )
      .then((next) => {
        if (active) {
          setResults(next);
          setLoading(false);
        }
      })
      .catch((hashError: unknown) => {
        if (active) {
          setError(errorMessage(hashError));
          setResults([]);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [deferredInput, algorithms, uppercase]);

  const combined = results.map((result) => `${result.algorithm}: ${result.digest}`).join('\n');

  const toggleAlgorithm = (algorithm: HashAlgorithm) => {
    setAlgorithms((current) =>
      current.includes(algorithm)
        ? current.filter((entry) => entry !== algorithm)
        : [...current, algorithm],
    );
  };

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <fieldset className="field checkbox-row" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="field-label">Algorithms</legend>
          {HASH_ALGORITHMS.map((entry) => (
            <label className="checkbox" key={entry.id}>
              <input
                type="checkbox"
                checked={algorithms.includes(entry.id)}
                onChange={() => toggleAlgorithm(entry.id)}
              />
              {entry.label}
            </label>
          ))}
        </fieldset>
        <label className="checkbox checkbox-inline">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(event) => setUppercase(event.target.checked)}
          />
          Uppercase hex
        </label>
      </div>

      <div className="tool-pane">
        <div className="pane-head">
          <label htmlFor={inputId}>Text to hash (UTF-8)</label>
        </div>
        <textarea
          id={inputId}
          className="code-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
          placeholder="Type or paste text…"
        />
      </div>

      <ToolError message={error} />
      {loading && <ToolInfo>Computing digests…</ToolInfo>}
      {!error && !loading && results.length > 0 && (
        <div className="result-lines">
          {results.map((result) => (
            <div className="result-line" key={result.algorithm}>
              <span>{result.algorithm}</span>
              <div>
                <code>{result.digest}</code>
                <div style={{ marginTop: '0.35rem' }}>
                  <CopyButton text={result.digest} label="Copy digest" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="tool-actions">
        <CopyButton text={combined} label="Copy all" />
        <DownloadButton text={combined} filename="oriz-hashes.txt" />
        <ResetButton
          onClick={() => {
            setInput('hello world');
            setAlgorithms(['SHA-256']);
            setUppercase(false);
          }}
        />
      </div>

      <ToolNote>
        MD5 and SHA-1 are included for checksums and legacy compatibility. Do
        not use them for password storage or new security designs.
      </ToolNote>
    </ToolShell>
  );
}

function UuidTool({ tool }: ToolProps) {
  const [count, setCount] = useState('5');
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => generateUuids(5));
  const [error, setError] = useState('');

  const generate = () => {
    try {
      const numeric = Number(count);
      setUuids(generateUuids(numeric, uppercase));
      setError('');
    } catch (generationError) {
      setError(errorMessage(generationError));
    }
  };

  const output = uuids.join('\n');

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="How many" hint="1 to 1,000">
          <input
            className="input"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </Field>
        <label className="checkbox checkbox-inline">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(event) => setUppercase(event.target.checked)}
          />
          Uppercase
        </label>
        <button type="button" className="btn btn--primary" onClick={generate}>
          Generate UUIDs
        </button>
      </div>

      <ToolError message={error} />
      <div className="tool-pane">
        <div className="pane-head">
          <span>Version 4 UUIDs</span>
          <div className="pane-head-actions">
            <CopyButton text={output} />
          </div>
        </div>
        <textarea
          className="text-output"
          value={output}
          readOnly
          aria-label="Generated UUIDs"
          spellCheck={false}
        />
      </div>

      <div className="tool-actions">
        <CopyButton text={output} label="Copy UUIDs" />
        <DownloadButton text={output} filename="oriz-uuids.txt" />
        <ResetButton
          onClick={() => {
            setCount('5');
            setUppercase(false);
            setUuids(generateUuids(5));
            setError('');
          }}
        />
      </div>

      <ToolNote>
        Random UUIDs are unpredictable identifiers, not secrets or passwords.
        Uniqueness is probabilistic even when the browser’s cryptographic
        random source is used.
      </ToolNote>
    </ToolShell>
  );
}

function characterLabel(character: string, codePoint: number): string {
  if (character === ' ') return 'SPACE';
  if (character === '\n') return 'LF (newline)';
  if (character === '\r') return 'CR (carriage return)';
  if (character === '\t') return 'TAB';
  if (codePoint < 32 || codePoint === 127) return 'CONTROL';
  return character;
}

function UnicodeTool({ tool }: ToolProps) {
  const inputId = useId();
  const [input, setInput] = useState('Hello 👋🏽\nA + B = 2');
  const summary = useMemo(() => unicodeSummary(input), [input]);
  const characters = useMemo(() => Array.from(input).slice(0, 300), [input]);
  const encoder = useMemo(() => new TextEncoder(), []);

  return (
    <ToolShell title={tool.title}>
      <div className="stat-grid">
        <Stat label="Code points" value={String(summary.codePoints)} />
        <Stat label="Grapheme clusters" value={String(summary.graphemeClusters)} />
        <Stat label="UTF-16 units" value={String(summary.utf16Units)} />
        <Stat label="UTF-8 bytes" value={String(summary.utf8Bytes)} />
      </div>

      <div className="tool-pane">
        <div className="pane-head">
          <label htmlFor={inputId}>Text to inspect</label>
        </div>
        <textarea
          id={inputId}
          className="code-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="result-table-head">
        <h3>Code points</h3>
        <span className="reference-count">
          {Array.from(input).length > 300
            ? 'Showing the first 300'
            : `${characters.length} ${characters.length === 1 ? 'code point' : 'code points'}`}
        </span>
      </div>
      <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
        <table className="reference-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Character</th>
              <th scope="col">Code point</th>
              <th scope="col">Decimal</th>
              <th scope="col">UTF-8 bytes</th>
              <th scope="col">UTF-16 units</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((character, index) => {
              const codePoint = character.codePointAt(0) ?? 0;
              const bytes = Array.from(encoder.encode(character))
                .map((byte) => byte.toString(16).padStart(2, '0').toUpperCase())
                .join(' ');
              return (
                <tr key={`${index}-${codePoint}`}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="mono-block">{characterLabel(character, codePoint)}</span>
                  </td>
                  <td>
                    <code>U+{codePoint.toString(16).toUpperCase().padStart(4, '0')}</code>
                  </td>
                  <td>{codePoint}</td>
                  <td>
                    <code>{bytes}</code>
                  </td>
                  <td>{character.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="tool-actions">
        <CopyButton
          text={characters
            .map((character, index) => {
              const codePoint = character.codePointAt(0) ?? 0;
              return `${index + 1}\t${codePoint.toString(16).toUpperCase()}\t${character}`;
            })
            .join('\n')}
          label="Copy code points"
        />
        <ResetButton onClick={() => setInput('Hello 👋🏽\nA + B = 2')} />
      </div>

      <ToolNote>
        Unicode names and general categories are not available consistently in
        browser APIs, so this inspector shows numeric encodings rather than
        classifying each character.
      </ToolNote>
    </ToolShell>
  );
}
