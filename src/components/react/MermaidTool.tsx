import { useEffect, useId, useRef, useState } from 'react';
import mermaid from 'mermaid';
import DOMPurify from 'dompurify';
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

const EXAMPLES = [
  {
    label: 'Flowchart',
    source: `flowchart TD
  A[Request arrives] --> B{Valid?}
  B -- No --> C[Return 422]
  B -- Yes --> D[Process request]
  D --> E[Return result]`,
  },
  {
    label: 'Sequence',
    source: `sequenceDiagram
  participant B as Browser
  participant A as API
  participant D as Database
  B->>A: GET /items/42
  A->>D: SELECT item
  D-->>A: item row
  A-->>B: 200 OK + JSON`,
  },
  {
    label: 'State',
    source: `stateDiagram-v2
  [*] --> Draft
  Draft --> InReview: submit
  InReview --> Published: approve
  InReview --> Draft: request changes
  Published --> [*]`,
  },
  {
    label: 'Entity relationship',
    source: `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ ORDER_ITEM : contains
  PRODUCT ||--o{ ORDER_ITEM : referenced_by`,
  },
];

function themeName(): 'dark' | 'default' {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default';
}

export default function MermaidTool({ tool }: ToolProps) {
  const inputId = useId();
  const previewRef = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState(EXAMPLES[0]!.source);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [themeTick, setThemeTick] = useState(0);

  useEffect(() => {
    const diagram = previewRef.current?.querySelector('svg');
    if (!diagram) return;
    const box = diagram.getBBox();
    if (box.width <= 0 || box.height <= 0) return;
    const padding = 8;
    diagram.setAttribute(
      'viewBox',
      `${box.x - padding} ${box.y - padding} ${box.width + padding * 2} ${box.height + padding * 2}`,
    );
  }, [svg]);

  useEffect(() => {
    const listener = () => setThemeTick((value) => value + 1);
    window.addEventListener('oriz:themechange', listener);
    return () => window.removeEventListener('oriz:themechange', listener);
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        if (!source.trim()) {
          if (active) {
            setSvg('');
            setError('');
          }
          return;
        }
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: themeName(),
          fontFamily: '"Times New Roman", Times, serif',
          htmlLabels: false,
          flowchart: { htmlLabels: false },
        });
        await mermaid.parse(source);
        const rendered = await mermaid.render(
          `oriz-mermaid-editor-${Date.now()}`,
          source,
        );
        if (active) {
          setSvg(
            DOMPurify.sanitize(rendered.svg, {
              USE_PROFILES: { svg: true, svgFilters: true },
            }),
          );
          setError('');
        }
      } catch (renderError) {
        if (active) {
          setSvg('');
          setError(errorMessage(renderError));
        }
      }
    }, 350);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [source, themeTick]);

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <div className="field">
          <span className="field-label">Examples</span>
          <div className="chips">
            {EXAMPLES.map((example) => (
              <button
                key={example.label}
                type="button"
                className="chip"
                onClick={() => setSource(example.source)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mermaid-tool-layout">
        <div className="tool-pane">
          <div className="pane-head">
            <label htmlFor={inputId}>Mermaid source</label>
          </div>
          <textarea
            id={inputId}
            className="code-input tool-pane--tall"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="tool-pane">
          <div className="pane-head">
            <span>Preview</span>
          </div>
          <div ref={previewRef} className="mermaid-preview" tabIndex={0} role="region" aria-label="Diagram preview">
            {svg ? (
              <div dangerouslySetInnerHTML={{ __html: svg }} />
            ) : (
              <p className="diagram-placeholder">
                {error ? 'Fix the syntax to render the diagram.' : 'Rendering…'}
              </p>
            )}
          </div>
        </div>
      </div>

      <ToolError message={error} />
      {!error && svg && <ToolInfo>The diagram is rendered and sanitized in this browser.</ToolInfo>}

      <div className="tool-actions">
        <CopyButton text={source} label="Copy source" />
        <DownloadButton
          text={svg}
          filename="oriz-diagram.svg"
          mime="image/svg+xml;charset=utf-8"
          label="Download SVG"
        />
        <ResetButton onClick={() => setSource(EXAMPLES[0]!.source)} />
      </div>

      <ToolNote>
        Mermaid runs with strict security and the resulting SVG is sanitized.
        Not every diagram type or syntax feature is supported by this version.
      </ToolNote>
    </ToolShell>
  );
}
