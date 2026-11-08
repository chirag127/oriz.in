import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export function ToolShell({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="tool-app" aria-label={title}>
      <div className="tool-app-head">
        <span className="tool-local">
          <span className="local-dot" aria-hidden="true" />
          Runs locally
        </span>
        <span className="tool-head-note">
          {note ?? 'No upload. No account. Your input stays in this browser.'}
        </span>
      </div>
      <div className="tool-app-body">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Copy failed.');
}

export function CopyButton({
  text,
  label = 'Copy',
  disabled = false,
}: {
  text: string;
  label?: string;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (status === 'idle') return;
    const timer = window.setTimeout(() => setStatus('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <button
      type="button"
      className="btn btn--secondary btn--small"
      disabled={disabled || !text}
      onClick={async () => {
        try {
          await copyToClipboard(text);
          setStatus('copied');
        } catch {
          setStatus('error');
        }
      }}
    >
      {status === 'copied' ? 'Copied' : status === 'error' ? 'Copy failed' : label}
    </button>
  );
}

export function downloadText(
  filename: string,
  text: string,
  mime = 'text/plain;charset=utf-8',
): void {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function DownloadButton({
  text,
  filename,
  label = 'Download',
  mime,
}: {
  text: string;
  filename: string;
  label?: string;
  mime?: string;
}) {
  return (
    <button
      type="button"
      className="btn btn--secondary btn--small"
      disabled={!text}
      onClick={() => downloadText(filename, text, mime)}
    >
      {label}
    </button>
  );
}

export function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="btn btn--ghost btn--small"
      onClick={onClick}
    >
      Reset
    </button>
  );
}

export function ToolError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="tool-error" role="alert">
      {message}
    </p>
  );
}

export function ToolInfo({ children }: { children: ReactNode }) {
  return <p className="tool-info">{children}</p>;
}

export function ToolNote({ children }: { children: ReactNode }) {
  return <div className="tool-note">{children}</div>;
}

export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}
