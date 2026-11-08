import { useId, useMemo, useState } from 'react';
import { loadAll } from 'js-yaml';
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

const YAML_SAMPLE = `service:
  name: oriz-api
  port: 8080
  features:
    - static-json
    - cors
  owner:
    name: Chirag
    url: https://oriz.in`;

const XML_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="1">
    <title>Designing Data-Intensive Applications</title>
    <author>Martin Kleppmann</author>
  </book>
  <book id="2">
    <title>Pro Git</title>
    <author>Scott Chacon and Ben Straub</author>
  </book>
</catalog>`;

function indentXmlNode(node: Node, depth: number): string {
  const indent = '  '.repeat(depth);
  if (node.nodeType === Node.ELEMENT_NODE) {
    return indentXmlElement(node as Element, depth);
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    return `${indent}<!--${node.nodeValue ?? ''}-->`;
  }
  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    return `${indent}<![CDATA[${node.nodeValue ?? ''}]]>`;
  }
  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    return `${indent}<?${node.nodeName}${node.nodeValue ? ` ${node.nodeValue}` : ''}?>`;
  }
  if (node.nodeType === Node.TEXT_NODE) {
    const value = node.nodeValue ?? '';
    return value.trim() ? `${indent}${escapeXml(value)}` : '';
  }
  return '';
}

function inlineXmlChildren(element: Element): string {
  return Array.from(element.childNodes)
    .map((node) => {
      if (node.nodeType === Node.TEXT_NODE) return escapeXml(node.nodeValue ?? '');
      if (node.nodeType === Node.CDATA_SECTION_NODE) {
        return `<![CDATA[${node.nodeValue ?? ''}]]>`;
      }
      if (node.nodeType === Node.COMMENT_NODE) return `<!--${node.nodeValue ?? ''}-->`;
      if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
        return `<?${node.nodeName}${node.nodeValue ? ` ${node.nodeValue}` : ''}?>`;
      }
      return '';
    })
    .join('');
}

function indentXmlElement(element: Element, depth: number): string {
  const indent = '  '.repeat(depth);
  const attributes = Array.from(element.attributes)
    .map((attribute) => ` ${attribute.name}="${escapeXml(attribute.value, true)}"`)
    .join('');

  const hasElementChildren = Array.from(element.childNodes).some(
    (node) => node.nodeType === Node.ELEMENT_NODE,
  );

  if (!hasElementChildren) {
    const content = inlineXmlChildren(element);
    return content
      ? `${indent}<${element.nodeName}${attributes}>${content}</${element.nodeName}>`
      : `${indent}<${element.nodeName}${attributes}/>`;
  }

  const lines = [`${indent}<${element.nodeName}${attributes}>`];
  for (const child of Array.from(element.childNodes)) {
    const rendered = indentXmlNode(child, depth + 1);
    if (rendered) lines.push(rendered);
  }
  lines.push(`${indent}</${element.nodeName}>`);
  return lines.join('\n');
}

function escapeXml(value: string, attribute = false): string {
  const escaped = value
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;');
  return attribute ? escaped.replace(/"/gu, '&quot;') : escaped;
}

function formatXml(input: string): string {
  const parser = new DOMParser();
  const document = parser.parseFromString(input, 'application/xml');
  const error = document.querySelector('parsererror');
  if (error) {
    const message = error.textContent?.replace(/\s+/gu, ' ').trim();
    throw new Error(message || 'The XML document is not well formed.');
  }
  if (!document.documentElement) {
    throw new Error('The XML document has no root element.');
  }
  const declaration = input.match(/^\s*<\?xml[\s\S]*?\?>/iu)?.[0]?.trim() ?? '';
  const doctype = document.doctype
    ? new XMLSerializer().serializeToString(document.doctype)
    : '';
  const formatted = indentXmlElement(document.documentElement, 0);
  return [declaration, doctype, formatted].filter(Boolean).join('\n');
}

export default function DataFormatTool({ tool }: ToolProps) {
  const mode = tool.engine === 'yaml' ? 'yaml' : 'xml';
  const inputId = useId();
  const [input, setInput] = useState(mode === 'yaml' ? YAML_SAMPLE : XML_SAMPLE);

  const result = useMemo(() => {
    try {
      if (mode === 'yaml') {
        const documents = loadAll(input);
        const normalized =
          documents.length === 1 ? documents[0] : documents;
        const output =
          JSON.stringify(normalized, null, 2) ?? 'null';
        return {
          output,
          error: '',
          note: `${documents.length} YAML ${documents.length === 1 ? 'document' : 'documents'} parsed.`,
        };
      }
      return {
        output: formatXml(input),
        error: '',
        note: 'The XML document is well formed.',
      };
    } catch (error) {
      const mark = (error as { mark?: { line?: number; column?: number } }).mark;
      const location =
        mark?.line !== undefined
          ? ` Line ${mark.line + 1}, column ${(mark.column ?? 0) + 1}.`
          : '';
      return {
        output: '',
        error: `${errorMessage(error)}${location}`,
        note: '',
      };
    }
  }, [input, mode]);

  const reset = () => setInput(mode === 'yaml' ? YAML_SAMPLE : XML_SAMPLE);

  return (
    <ToolShell title={tool.title}>
      <div className="tool-grid">
        <div className="tool-pane">
          <div className="pane-head">
            <label htmlFor={inputId}>
              {mode === 'yaml' ? 'YAML input' : 'XML input'}
            </label>
            <div className="pane-head-actions">
              <button
                type="button"
                className="pane-action"
                onClick={() =>
                  setInput(mode === 'yaml' ? YAML_SAMPLE : XML_SAMPLE)
                }
              >
                Load sample
              </button>
            </div>
          </div>
          <textarea
            id={inputId}
            className="code-input tool-pane--tall"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            aria-invalid={Boolean(result.error)}
          />
        </div>
        <div className="tool-pane">
          <div className="pane-head">
            <span>{mode === 'yaml' ? 'Parsed JSON view' : 'Formatted XML'}</span>
            <div className="pane-head-actions">
              <CopyButton text={result.output} />
            </div>
          </div>
          <textarea
            className="text-output tool-pane--tall"
            value={result.output}
            readOnly
            aria-label="Normalized output"
            spellCheck={false}
          />
        </div>
      </div>

      <ToolError message={result.error} />
      {result.note && <ToolInfo>{result.note}</ToolInfo>}

      <div className="tool-actions">
        <CopyButton text={result.output} label="Copy result" />
        <DownloadButton
          text={result.output}
          filename={mode === 'yaml' ? 'oriz-yaml.json' : 'oriz-formatted.xml'}
          mime={mode === 'yaml' ? 'application/json' : 'application/xml'}
        />
        <ResetButton onClick={reset} />
      </div>

      <ToolNote>
        {mode === 'yaml'
          ? 'Schema semantics and custom tags are not validated. The parsed view is a convenience, not a schema check.'
          : 'Formatting changes inter-element whitespace. Validate against the relevant schema if element whitespace is significant.'}
      </ToolNote>
    </ToolShell>
  );
}
