import { useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  ResetButton,
  ToolNote,
  ToolShell,
} from './ui';
import {
  DOCKER_COMMANDS,
  GIT_COMMANDS,
  HTTP_STATUSES,
  HTTP_STATUS_CATEGORIES,
  MIME_TYPES,
  REGEX_FLAGS,
  REGEX_TOKENS,
} from '../../data/references';

export default function ReferenceTool({ tool }: ToolProps) {
  const reference = tool.options?.reference ?? 'http-status';
  const searchId = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const categories = useMemo(() => {
    if (reference === 'http-status') return [...HTTP_STATUS_CATEGORIES];
    if (reference === 'mime') return [...new Set(MIME_TYPES.map((entry) => entry.category))];
    return [];
  }, [reference]);

  const normalizedQuery = query.trim().toLocaleLowerCase();

  const httpRows = useMemo(() => {
    if (reference !== 'http-status') return [];
    return HTTP_STATUSES.filter((entry) => {
      const haystack = `${entry.code} ${entry.name} ${entry.category} ${entry.meaning} ${entry.usage}`.toLocaleLowerCase();
      return (
        (!category || entry.category === category) &&
        (!normalizedQuery || haystack.includes(normalizedQuery))
      );
    });
  }, [reference, normalizedQuery, category]);

  const mimeRows = useMemo(() => {
    if (reference !== 'mime') return [];
    return MIME_TYPES.filter((entry) => {
      const haystack = `${entry.type} ${entry.extensions.join(' ')} ${entry.category} ${entry.description} ${entry.note ?? ''}`.toLocaleLowerCase();
      return (
        (!category || entry.category === category) &&
        (!normalizedQuery || haystack.includes(normalizedQuery))
      );
    });
  }, [reference, normalizedQuery, category]);

  const commandRows = useMemo(() => {
    if (reference !== 'git' && reference !== 'docker') return [];
    const source = reference === 'git' ? GIT_COMMANDS : DOCKER_COMMANDS;
    return source.filter((entry) => {
      const haystack = `${entry.command} ${entry.title} ${entry.description} ${entry.example} ${entry.caution ?? ''}`.toLocaleLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    });
  }, [reference, normalizedQuery]);

  const regexRows = useMemo(() => {
    if (reference !== 'regex') return [];
    return REGEX_TOKENS.filter((entry) => {
      const haystack = `${entry.token} ${entry.name} ${entry.description} ${entry.example}`.toLocaleLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    });
  }, [reference, normalizedQuery]);

  const count =
    reference === 'http-status'
      ? httpRows.length
      : reference === 'mime'
        ? mimeRows.length
        : reference === 'regex'
          ? regexRows.length
          : commandRows.length;

  const placeholder =
    reference === 'http-status'
      ? 'Search by code, class, or meaning…'
      : reference === 'mime'
        ? 'Search by type, extension, or description…'
        : reference === 'regex'
          ? 'Search tokens such as lookahead or boundary…'
          : 'Search by command or task…';

  return (
    <ToolShell title={tool.title}>
      <div className="reference-toolbar">
        <label className="sr-only" htmlFor={searchId}>
          Search the reference
        </label>
        <input
          id={searchId}
          className="input"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        {categories.length > 0 && (
          <select
            className="select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((entry) => (
              <option value={entry}>{entry}</option>
            ))}
          </select>
        )}
        <span className="reference-count">
          {count} {count === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {reference === 'regex' && (
        <div className="chips">
          {REGEX_FLAGS.map((flag) => (
            <span className="chip" key={flag.flag} title={flag.description}>
              <code>{flag.flag}</code> {flag.name}
            </span>
          ))}
        </div>
      )}

      <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
        {reference === 'http-status' && (
          <table className="reference-table">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Name</th>
                <th scope="col">Class</th>
                <th scope="col">Meaning and practical use</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {httpRows.map((entry) => (
                <tr key={entry.code}>
                  <td>
                    <span className="ref-primary">{entry.code}</span>
                  </td>
                  <td>{entry.name}</td>
                  <td>{entry.category}</td>
                  <td>
                    <span className="ref-primary">{entry.meaning}</span>
                    <span className="ref-muted">{entry.usage}</span>
                  </td>
                  <td>
                    <a href={entry.source} rel="noopener noreferrer">
                      MDN
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reference === 'mime' && (
          <table className="reference-table">
            <thead>
              <tr>
                <th scope="col">Media type</th>
                <th scope="col">Extensions</th>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {mimeRows.map((entry) => (
                <tr key={entry.type}>
                  <td>
                    <code className="ref-primary">{entry.type}</code>
                  </td>
                  <td>{entry.extensions.join(', ') || '—'}</td>
                  <td>{entry.category}</td>
                  <td>
                    {entry.description}
                    {entry.note && <span className="ref-muted">{entry.note}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {(reference === 'git' || reference === 'docker') && (
          <table className="reference-table">
            <thead>
              <tr>
                <th scope="col">Command</th>
                <th scope="col">What it does</th>
                <th scope="col">Example</th>
                <th scope="col">Caution</th>
              </tr>
            </thead>
            <tbody>
              {commandRows.map((entry) => (
                <tr key={entry.command}>
                  <td>
                    <span className="ref-primary">{entry.command}</span>
                    <a href={entry.docsUrl} rel="noopener noreferrer" className="ref-muted">
                      Documentation
                    </a>
                  </td>
                  <td>
                    <span className="ref-primary">{entry.title}</span>
                    <span className="ref-muted">{entry.description}</span>
                  </td>
                  <td>
                    <code>{entry.example}</code>
                  </td>
                  <td>
                    {entry.caution ? (
                      <span className="ref-muted">{entry.caution}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reference === 'regex' && (
          <table className="reference-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Example</th>
              </tr>
            </thead>
            <tbody>
              {regexRows.map((entry) => (
                <tr key={`${entry.token}-${entry.name}`}>
                  <td>
                    <code className="ref-primary">{entry.token}</code>
                  </td>
                  <td>{entry.name}</td>
                  <td>{entry.description}</td>
                  <td>
                    <code>{entry.example}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {count === 0 && (
          <div className="empty-state">No entries match that search.</div>
        )}
      </div>

      <div className="tool-actions">
        <ResetButton
          onClick={() => {
            setQuery('');
            setCategory('');
          }}
        />
      </div>

      <ToolNote>
        {reference === 'http-status' &&
          'Practical notes are editorial guidance. Consult RFC 9110 and the relevant registration when exact semantics matter.'}
        {reference === 'mime' &&
          'This is a curated subset of the IANA registry. A media type describes a format, not the safety of its contents.'}
        {(reference === 'git' || reference === 'docker') &&
          'Commands are destructive in some cases. Read the caution column and documentation before using them on important data.'}
        {reference === 'regex' &&
          'This reference describes JavaScript regular expressions. Other engines support different features and syntax.'}
      </ToolNote>
    </ToolShell>
  );
}
