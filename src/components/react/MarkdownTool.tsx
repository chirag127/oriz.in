import { useId, useMemo, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  DownloadButton,
  ResetButton,
  ToolError,
  ToolNote,
  ToolShell,
  useDebouncedValue,
} from './ui';

const SAMPLE = `# Markdown, rendered locally

Markdown is a small syntax for structured text. The preview updates as you write.

- **Bold**, *italic*, and \`inline code\`
- [Links](https://example.com) use ordinary URLs
- Lists, tables, and blockquotes are supported

> A preview is useful only if you know which HTML it produces.

## A table

| Input | Meaning |
| --- | --- |
| \`.md\` | Markdown source |
| \`.html\` | Rendered output |

\`\`\`js
const privacy = "your text never leaves this page";
console.log(privacy);
\`\`\`
`;

export default function MarkdownTool({ tool }: ToolProps) {
  const inputId = useId();
  const [source, setSource] = useState(SAMPLE);
  const debouncedSource = useDebouncedValue(source, 120);

  const result = useMemo(() => {
    try {
      const raw = marked.parse(debouncedSource, {
        async: false,
        gfm: true,
        breaks: false,
      }) as string;
      const clean = DOMPurify.sanitize(raw, {
        FORBID_TAGS: ['style', 'form', 'input', 'button', 'iframe', 'object', 'embed', 'link', 'meta', 'video', 'audio', 'track'],
        FORBID_ATTR: ['style'],
      });
      const template = document.createElement('template');
      template.innerHTML = clean;
      for (const image of template.content.querySelectorAll('img')) {
        const source = image.getAttribute('src') ?? '';
        if (!/^data:image\//iu.test(source)) image.remove();
        else image.removeAttribute('srcset');
      }
      for (const pre of template.content.querySelectorAll('pre')) {
        pre.setAttribute('tabindex', '0');
        pre.setAttribute('role', 'region');
        pre.setAttribute('aria-label', 'Markdown code block');
      }
      return { html: template.innerHTML, error: '' };
    } catch {
      return { html: '', error: 'The Markdown could not be rendered.' };
    }
  }, [debouncedSource]);

  return (
    <ToolShell title={tool.title}>
      <div className="tool-grid">
        <div className="tool-pane">
          <div className="pane-head">
            <label htmlFor={inputId}>Markdown</label>
            <div className="pane-head-actions">
              <button
                type="button"
                className="pane-action"
                onClick={() => setSource(SAMPLE)}
              >
                Load sample
              </button>
            </div>
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
            <span>Sanitized preview</span>
          </div>
          <div
            className="md-preview prose"
            tabIndex={0}
            role="region"
            aria-label="Markdown preview"
            dangerouslySetInnerHTML={{ __html: result.html }}
          />
        </div>
      </div>

      <ToolError message={result.error} />

      <div className="tool-actions">
        <CopyButton text={result.html} label="Copy HTML" />
        <DownloadButton
          text={result.html}
          filename="oriz-markdown-preview.html"
          mime="text/html;charset=utf-8"
        />
        <ResetButton onClick={() => setSource(SAMPLE)} />
      </div>

      <ToolNote>
        Raw HTML in the source is sanitized before display. Scripts, embedded
        content, forms, and inline styles are removed. The preview is not
        styled exactly like a published ORIZ.IN article.
      </ToolNote>
    </ToolShell>
  );
}
