import { useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  DownloadButton,
  ResetButton,
  ToolError,
  ToolInfo,
  ToolNote,
  ToolShell,
} from './ui';
import { decodeJwt } from '../../lib/jwt';

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJyb2xlIjoicmVhZGVyIiwiaXNzIjoib3Jpei5pbiIsImF1ZCI6ImRlbW8iLCJpYXQiOjE3NjE0MzY4MDAsImV4cCI6MTg5MzQ1NjAwMH0.demo-signature-not-verified';

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2) ?? '';
}

export default function JwtTool({ tool }: ToolProps) {
  const inputId = useId();
  const [token, setToken] = useState(SAMPLE);

  const result = useMemo(() => {
    if (token.length > 100000) {
      return { decoded: null, error: 'Tokens are limited to 100,000 characters.' };
    }
    try {
      return { decoded: decodeJwt(token), error: '' };
    } catch (error) {
      return {
        decoded: null,
        error: error instanceof Error ? error.message : 'The token could not be decoded.',
      };
    }
  }, [token]);

  const headerText = result.decoded ? pretty(result.decoded.header) : '';
  const payloadText = result.decoded ? pretty(result.decoded.payload) : '';

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <div className="field">
          <span className="field-label">Token actions</span>
          <div className="tool-actions">
            <button
              type="button"
              className="btn btn--secondary btn--small"
              onClick={() => setToken(SAMPLE)}
            >
              Load sample
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => setToken('')}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="tool-pane">
        <div className="pane-head">
          <label htmlFor={inputId}>JWT</label>
          <span className="reference-count">
            {token.trim() ? `${token.trim().split('.').length} segments` : 'empty'}
          </span>
        </div>
        <textarea
          id={inputId}
          className="code-input"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          spellCheck={false}
          placeholder="Paste header.payload.signature"
          aria-invalid={Boolean(result.error)}
        />
      </div>

      <ToolError message={result.error} />

      {result.decoded && (
        <>
          <div className="tool-grid">
            <div>
              <div className="result-table-head">
                <h3>Header</h3>
                <CopyButton text={headerText} label="Copy header" />
              </div>
              <pre className="result-text">{headerText}</pre>
            </div>
            <div>
              <div className="result-table-head">
                <h3>Payload</h3>
                <CopyButton text={payloadText} label="Copy payload" />
              </div>
              <pre className="result-text">{payloadText}</pre>
            </div>
          </div>

          <div>
            <div className="result-table-head">
              <h3>Signature (not verified)</h3>
              <CopyButton text={result.decoded.signature} label="Copy signature" />
            </div>
            <pre className="result-text">{result.decoded.signature || '(empty)'}</pre>
          </div>

          <ToolInfo>
            {result.decoded.warnings.join(' ')}
          </ToolInfo>
        </>
      )}

      <div className="tool-actions">
        <CopyButton
          text={result.decoded ? `${headerText}\n\n${payloadText}` : ''}
          label="Copy header + payload"
        />
        <DownloadButton
          text={result.decoded ? `${headerText}\n\n${payloadText}` : ''}
          filename="oriz-jwt-decoded.json"
          mime="application/json"
        />
        <ResetButton onClick={() => setToken(SAMPLE)} />
      </div>

      <ToolNote>
        Decoding is not validation. A server must verify the signature with the
        correct key, enforce the algorithm allowlist, and check issuer,
        audience, expiry, and revocation in the application’s security model.
        This interface never sends the token anywhere.
      </ToolNote>
    </ToolShell>
  );
}
