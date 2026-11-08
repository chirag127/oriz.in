import { useId, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  Field,
  ResetButton,
  ToolError,
  ToolNote,
  ToolShell,
} from './ui';

const DEFAULT_HTML = `<main>
  <h1>Hello, sandbox</h1>
  <p>This page runs inside an isolated iframe.</p>
  <button id="counter">Count: 0</button>
</main>`;

const DEFAULT_CSS = `body {
  margin: 0;
  padding: 2rem;
  font-family: Georgia, serif;
  background: #fff7ed;
  color: #1c1917;
}

button {
  border: 0;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  background: #c2410c;
  color: white;
  font: inherit;
  cursor: pointer;
}`;

const DEFAULT_JS = `const button = document.querySelector('#counter');
let count = 0;
button.addEventListener('click', () => {
  count += 1;
  button.textContent = 'Count: ' + count;
});`;

function buildDocument(html: string, css: string, js: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'" />
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;
}

export default function PlaygroundTool({ tool }: ToolProps) {
  const htmlId = useId();
  const cssId = useId();
  const jsId = useId();
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [srcDoc, setSrcDoc] = useState(() => buildDocument(DEFAULT_HTML, DEFAULT_CSS, DEFAULT_JS));
  const [frameKey, setFrameKey] = useState(0);
  const [error, setError] = useState('');

  const run = () => {
    if (html.length + css.length + js.length > 300000) {
      setError('Keep the combined source under 300,000 characters.');
      return;
    }
    setError('');
    setSrcDoc(buildDocument(html, css, js));
    setFrameKey((value) => value + 1);
  };

  const reset = () => {
    setHtml(DEFAULT_HTML);
    setCss(DEFAULT_CSS);
    setJs(DEFAULT_JS);
    setSrcDoc(buildDocument(DEFAULT_HTML, DEFAULT_CSS, DEFAULT_JS));
    setFrameKey((value) => value + 1);
    setError('');
  };

  return (
    <ToolShell title={tool.title}>
      <div className="playground-grid">
        <div className="playground-editor">
          <Field label="HTML">
            <textarea
              id={htmlId}
              className="code-input"
              value={html}
              onChange={(event) => setHtml(event.target.value)}
              spellCheck={false}
            />
          </Field>
          <Field label="CSS">
            <textarea
              id={cssId}
              className="code-input"
              value={css}
              onChange={(event) => setCss(event.target.value)}
              spellCheck={false}
            />
          </Field>
          <Field label="JavaScript">
            <textarea
              id={jsId}
              className="code-input"
              value={js}
              onChange={(event) => setJs(event.target.value)}
              spellCheck={false}
            />
          </Field>
        </div>
        <div>
          <iframe
            key={frameKey}
            className="playground-iframe"
            title="Sandboxed playground output"
            sandbox="allow-scripts"
            srcDoc={srcDoc}
          />
        </div>
      </div>

      <ToolError message={error} />

      <div className="tool-actions">
        <button type="button" className="btn btn--primary" onClick={run}>
          Run
        </button>
        <ResetButton onClick={reset} />
      </div>

      <ToolNote>
        The iframe has an opaque origin, no network access, and no access to
        this site’s storage. Console output is not captured in this beta.
      </ToolNote>
    </ToolShell>
  );
}
