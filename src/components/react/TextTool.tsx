import { useId, useMemo, useState, type ReactNode } from 'react';
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
import {
  cleanWhitespace,
  convertCase,
  countText,
  decodeBase64,
  decodeHtmlEntities,
  decodeUrl,
  encodeBase64,
  encodeFullUrl,
  encodeHtmlEntities,
  encodeUrlComponent,
  estimateReadingMinutes,
  slugify,
  type CaseStyle,
  type WhitespaceMode,
} from '../../lib/text';

const samples: Record<string, string> = {
  url: 'Search for "open source tools" & café? q=hello world',
  base64: 'Hello, 世界 👋',
  'html-entities': '<p class="note">Tom & Jerry\'s "best" day</p>',
  case: 'the quick brown fox jumps over the lazy dog',
  whitespace:
    '  A paragraph with   extra spaces.  \n\n\n  A second line,  indented.  \n',
  slug: '10 Practical Tips for Better JSON Formatting (2026)',
  'word-stats':
    'Useful tools should be quick to load and honest about what they do. A local formatter is not a security product, and a small reference is not an entire specification. This paragraph is only here so the counters have something to count.',
  'reading-time':
    'A good technical article begins with a question the reader already has, explains the model underneath the answer, and leaves enough context to judge the limits of the advice. It does not pad a simple idea into a long page, and it does not hide uncertainty behind confident adjectives.',
};

const caseOptions: { value: CaseStyle; label: string }[] = [
  { value: 'sentence', label: 'Sentence case' },
  { value: 'title', label: 'Title Case' },
  { value: 'upper', label: 'UPPER CASE' },
  { value: 'lower', label: 'lower case' },
  { value: 'camel', label: 'camelCase' },
  { value: 'pascal', label: 'PascalCase' },
  { value: 'snake', label: 'snake_case' },
  { value: 'kebab', label: 'kebab-case' },
  { value: 'constant', label: 'CONSTANT_CASE' },
];

const whitespaceOptions: { value: WhitespaceMode; label: string }[] = [
  { value: 'trim-lines', label: 'Trim each line' },
  { value: 'collapse-spaces', label: 'Collapse repeated spaces' },
  { value: 'remove-blank-lines', label: 'Remove empty lines' },
  { value: 'normalize-newlines', label: 'Normalize line endings' },
  { value: 'all', label: 'All cleanup steps' },
];

export default function TextTool({ tool }: ToolProps) {
  const mode = tool.options?.mode ?? 'word-stats';
  const inputId = useId();
  const [input, setInput] = useState(samples[mode] ?? '');
  const [urlAction, setUrlAction] = useState('encode-component');
  const [base64Action, setBase64Action] = useState('encode');
  const [urlSafe, setUrlSafe] = useState(false);
  const [entityAction, setEntityAction] = useState('encode');
  const [encodeNonAscii, setEncodeNonAscii] = useState(false);
  const [caseStyle, setCaseStyle] = useState<CaseStyle>('title');
  const [whitespaceMode, setWhitespaceMode] =
    useState<WhitespaceMode>('collapse-spaces');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [foldAccents, setFoldAccents] = useState(true);
  const [maxLength, setMaxLength] = useState('80');
  const [wpm, setWpm] = useState('200');

  const result = useMemo(() => {
    try {
      switch (mode) {
        case 'url':
          if (urlAction === 'decode') {
            return { output: decodeUrl(input), error: '' };
          }
          return {
            output:
              urlAction === 'encode-full'
                ? encodeFullUrl(input)
                : encodeUrlComponent(input),
            error: '',
          };
        case 'base64':
          return {
            output:
              base64Action === 'decode'
                ? decodeBase64(input, urlSafe)
                : encodeBase64(input, urlSafe),
            error: '',
          };
        case 'html-entities':
          return {
            output:
              entityAction === 'decode'
                ? decodeHtmlEntities(input)
                : encodeHtmlEntities(input, encodeNonAscii),
            error: '',
          };
        case 'case':
          return { output: convertCase(input, caseStyle), error: '' };
        case 'whitespace':
          return { output: cleanWhitespace(input, whitespaceMode), error: '' };
        case 'slug':
          return {
            output: slugify(input, {
              separator,
              foldAccents,
              maxLength: Math.max(8, Math.min(200, Number(maxLength) || 80)),
            }),
            error: '',
          };
        default:
          return { output: '', error: '' };
      }
    } catch (error) {
      return { output: '', error: errorMessage(error) };
    }
  }, [
    input,
    mode,
    urlAction,
    base64Action,
    urlSafe,
    entityAction,
    encodeNonAscii,
    caseStyle,
    whitespaceMode,
    separator,
    foldAccents,
    maxLength,
  ]);

  const stats = useMemo(() => countText(input), [input]);
  const readingMinutes = estimateReadingMinutes(input, Number(wpm) || 200);
  const statsMode = mode === 'word-stats' || mode === 'reading-time';

  const summary = statsMode
    ? [
        `${stats.words} words`,
        `${stats.characters} characters`,
        `${stats.sentences} sentences`,
        `${stats.paragraphs} paragraphs`,
        `${stats.lines} lines`,
        `${readingMinutes} min read at ${Number(wpm) || 200} wpm`,
      ].join('\n')
    : result.output;

  const reset = () => {
    setInput(samples[mode] ?? '');
    setUrlAction('encode-component');
    setBase64Action('encode');
    setUrlSafe(false);
    setEntityAction('encode');
    setEncodeNonAscii(false);
    setCaseStyle('title');
    setWhitespaceMode('collapse-spaces');
    setSeparator('-');
    setFoldAccents(true);
    setMaxLength('80');
    setWpm('200');
  };

  const controls = (
    <div className="tool-controls">
      {mode === 'url' && (
        <Field label="Operation">
          <select
            className="select"
            value={urlAction}
            onChange={(event) => setUrlAction(event.target.value)}
          >
            <option value="encode-component">Encode a URL component</option>
            <option value="encode-full">Encode a full URL</option>
            <option value="decode">Decode percent-encoding</option>
          </select>
        </Field>
      )}
      {mode === 'base64' && (
        <>
          <Field label="Operation">
            <select
              className="select"
              value={base64Action}
              onChange={(event) => setBase64Action(event.target.value)}
            >
              <option value="encode">Encode to Base64</option>
              <option value="decode">Decode from Base64</option>
            </select>
          </Field>
          <label className="checkbox checkbox-inline">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(event) => setUrlSafe(event.target.checked)}
            />
            URL-safe alphabet
          </label>
        </>
      )}
      {mode === 'html-entities' && (
        <>
          <Field label="Operation">
            <select
              className="select"
              value={entityAction}
              onChange={(event) => setEntityAction(event.target.value)}
            >
              <option value="encode">Encode HTML entities</option>
              <option value="decode">Decode HTML entities</option>
            </select>
          </Field>
          {entityAction === 'encode' && (
            <label className="checkbox checkbox-inline">
              <input
                type="checkbox"
                checked={encodeNonAscii}
                onChange={(event) => setEncodeNonAscii(event.target.checked)}
              />
              Encode non-ASCII characters too
            </label>
          )}
        </>
      )}
      {mode === 'case' && (
        <Field label="Convert to">
          <select
            className="select"
            value={caseStyle}
            onChange={(event) => setCaseStyle(event.target.value as CaseStyle)}
          >
            {caseOptions.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
        </Field>
      )}
      {mode === 'whitespace' && (
        <Field label="Cleanup mode">
          <select
            className="select"
            value={whitespaceMode}
            onChange={(event) =>
              setWhitespaceMode(event.target.value as WhitespaceMode)
            }
          >
            {whitespaceOptions.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>
        </Field>
      )}
      {mode === 'slug' && (
        <>
          <Field label="Separator">
            <select
              className="select"
              value={separator}
              onChange={(event) =>
                setSeparator(event.target.value === '_' ? '_' : '-')
              }
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
            </select>
          </Field>
          <Field label="Maximum length">
            <input
              className="input"
              type="number"
              min={8}
              max={200}
              value={maxLength}
              onChange={(event) => setMaxLength(event.target.value)}
            />
          </Field>
          <label className="checkbox checkbox-inline">
            <input
              type="checkbox"
              checked={foldAccents}
              onChange={(event) => setFoldAccents(event.target.checked)}
            />
            Fold accents to ASCII
          </label>
        </>
      )}
      {(mode === 'reading-time' || mode === 'word-stats') && (
        <Field label="Reading speed" hint="Words per minute">
          <input
            className="input"
            type="number"
            min={50}
            max={800}
            step={10}
            value={wpm}
            onChange={(event) => setWpm(event.target.value)}
          />
        </Field>
      )}
    </div>
  );

  return (
    <ToolShell title={tool.title}>
      {controls}

      {statsMode ? (
        <>
          <div className="tool-pane">
            <div className="pane-head">
              <label htmlFor={inputId}>Your text</label>
              <div className="pane-head-actions">
                <button
                  type="button"
                  className="pane-action"
                  onClick={() => setInput(samples[mode] ?? '')}
                >
                  Load sample
                </button>
              </div>
            </div>
            <textarea
              id={inputId}
              className="code-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
              placeholder="Paste or write text here…"
            />
          </div>
          <div className="stat-grid">
            <Stat label="Words" value={stats.words.toLocaleString('en-US')} />
            <Stat
              label="Characters"
              value={stats.characters.toLocaleString('en-US')}
              hint={`${stats.charactersNoSpaces.toLocaleString('en-US')} without whitespace`}
            />
            <Stat
              label="Reading time"
              value={`${readingMinutes} min`}
              hint={`At ${Number(wpm) || 200} words per minute`}
            />
            <Stat label="Sentences" value={String(stats.sentences)} />
            <Stat label="Paragraphs" value={String(stats.paragraphs)} />
            <Stat label="Lines" value={String(stats.lines)} />
          </div>
          {mode === 'reading-time' && (
            <ToolNote>
              Reading speed varies by topic and reader. Code, tables, and
              diagrams are counted as text, so use this as a planning estimate.
            </ToolNote>
          )}
        </>
      ) : (
        <div className="tool-grid">
          <div className="tool-pane">
            <div className="pane-head">
              <label htmlFor={inputId}>Input</label>
              <div className="pane-head-actions">
                <button
                  type="button"
                  className="pane-action"
                  onClick={() => setInput(samples[mode] ?? '')}
                >
                  Load sample
                </button>
              </div>
            </div>
            <textarea
              id={inputId}
              className="code-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
            />
          </div>
          <div className="tool-pane">
            <div className="pane-head">
              <span>Output</span>
              <div className="pane-head-actions">
                <CopyButton text={result.output} />
              </div>
            </div>
            <textarea
              className="text-output"
              value={result.output}
              readOnly
              aria-label="Converted output"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      <ToolError message={result.error} />
      {mode === 'slug' && !result.error && !result.output && (
        <ToolInfoMessage>
          No slug was produced. The text may contain only non-ASCII characters;
          turn off accent folding to preserve Unicode letters.
        </ToolInfoMessage>
      )}

      <div className="tool-actions">
        <CopyButton text={summary} label={statsMode ? 'Copy summary' : 'Copy output'} />
        <DownloadButton
          text={statsMode ? `${input}\n\n---\n${summary}\n` : result.output}
          filename={`oriz-${mode}.txt`}
        />
        <ResetButton onClick={reset} />
      </div>
    </ToolShell>
  );
}

function ToolInfoMessage({ children }: { children: ReactNode }) {
  return <p className="tool-info">{children}</p>;
}
