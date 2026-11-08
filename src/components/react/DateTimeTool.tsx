import { useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  Field,
  ResetButton,
  Stat,
  ToolError,
  ToolInfo,
  ToolNote,
  ToolShell,
  errorMessage,
} from './ui';
import {
  COMMON_TIME_ZONES,
  convertZonedWallTime,
  differenceBetweenDates,
  formatInZone,
  formatOffset,
  isValidTimeZone,
  parseDateOnly,
  parseTimestampInput,
  timestampRepresentations,
  zoneOffsetMinutes,
  type TimestampUnit,
} from '../../lib/dates';

function isoDate(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function currentTime(): string {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function browserZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export default function DateTimeTool({ tool }: ToolProps) {
  if (tool.engine === 'date-diff') return <DateDifferenceTool tool={tool} />;
  if (tool.engine === 'timezone') return <TimeZoneTool tool={tool} />;
  return <TimestampTool tool={tool} />;
}

function TimestampTool({ tool }: ToolProps) {
  const inputId = useId();
  const [input, setInput] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<TimestampUnit>('auto');

  const result = useMemo(() => {
    try {
      const date = parseTimestampInput(input, unit);
      return {
        date,
        representations: timestampRepresentations(date),
        error: '',
      };
    } catch (error) {
      return { date: null, representations: null, error: errorMessage(error) };
    }
  }, [input, unit]);

  const copyText = result.representations
    ? [
        `Unix seconds: ${result.representations.unixSeconds}`,
        `Unix milliseconds: ${result.representations.unixMilliseconds}`,
        `ISO 8601: ${result.representations.iso}`,
        `UTC: ${result.representations.utc}`,
        `Local: ${result.representations.local}`,
      ].join('\n')
    : '';

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="Timestamp or date string" hint="Unix time, ISO 8601, or a browser-readable date.">
          <input
            id={inputId}
            className="input mono-block"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            placeholder="1700000000"
          />
        </Field>
        <Field label="Input unit">
          <select
            className="select"
            value={unit}
            onChange={(event) => setUnit(event.target.value as TimestampUnit)}
          >
            <option value="auto">Detect automatically</option>
            <option value="seconds">Seconds</option>
            <option value="milliseconds">Milliseconds</option>
          </select>
        </Field>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => {
            setInput(String(Math.floor(Date.now() / 1000)));
            setUnit('auto');
          }}
        >
          Use now
        </button>
      </div>

      <ToolError message={result.error} />
      {result.representations && (
        <div className="result-lines">
          <div className="result-line">
            <span>Unix seconds</span>
            <code>{result.representations.unixSeconds}</code>
          </div>
          <div className="result-line">
            <span>Unix milliseconds</span>
            <code>{result.representations.unixMilliseconds}</code>
          </div>
          <div className="result-line">
            <span>ISO 8601 (UTC)</span>
            <code>{result.representations.iso}</code>
          </div>
          <div className="result-line">
            <span>UTC</span>
            <code>{result.representations.utc}</code>
          </div>
          <div className="result-line">
            <span>Local time</span>
            <code>{result.representations.local}</code>
          </div>
          <div className="result-line">
            <span>Browser time zone</span>
            <code>{browserZone()}</code>
          </div>
        </div>
      )}

      <div className="tool-actions">
        <CopyButton text={copyText} label="Copy all values" />
        <ResetButton
          onClick={() => {
            setInput(String(Math.floor(Date.now() / 1000)));
            setUnit('auto');
          }}
        />
      </div>

      <ToolNote>
        Automatic detection treats values below 100,000,000,000 as seconds.
        Choose a unit explicitly when the instant is ambiguous.
      </ToolNote>
    </ToolShell>
  );
}

function DateDifferenceTool({ tool }: ToolProps) {
  const [start, setStart] = useState(() => isoDate(0));
  const [end, setEnd] = useState(() => isoDate(30));

  const result = useMemo(() => {
    try {
      const startDate = parseDateOnly(start);
      const endDate = parseDateOnly(end);
      return {
        difference: differenceBetweenDates(startDate, endDate),
        error: '',
      };
    } catch (error) {
      return { difference: null, error: errorMessage(error) };
    }
  }, [start, end]);

  const summary = result.difference
    ? `${result.difference.absoluteDays} calendar days; ${result.difference.businessDays} weekdays; ${result.difference.years} years, ${result.difference.months} months, ${result.difference.days} days.`
    : '';

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="Start date">
          <input
            className="input"
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
          />
        </Field>
        <Field label="End date">
          <input
            className="input"
            type="date"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
          />
        </Field>
      </div>

      <ToolError message={result.error} />
      {result.difference && (
        <>
          <div className="stat-grid">
            <Stat
              label="Calendar days"
              value={Math.abs(result.difference.totalDays).toLocaleString('en-US')}
              hint={result.difference.reversed ? 'End date is earlier than start' : 'Measured as end minus start'}
            />
            <Stat
              label="Weekdays"
              value={result.difference.businessDays.toLocaleString('en-US')}
              hint="Excludes Saturdays and Sundays; no holiday calendar"
            />
            <Stat
              label="Weeks + days"
              value={`${result.difference.weeks}w ${result.difference.remainingDays}d`}
            />
            <Stat
              label="Calendar breakdown"
              value={`${result.difference.years}y ${result.difference.months}m ${result.difference.days}d`}
            />
          </div>
          <ToolInfo>
            {result.difference.reversed
              ? 'The end date is earlier than the start date. The values above show the absolute duration.'
              : 'Intervals exclude the start date and include the end date, so the same calendar day has a difference of zero.'}
          </ToolInfo>
        </>
      )}

      <div className="tool-actions">
        <CopyButton text={summary} label="Copy summary" />
        <ResetButton
          onClick={() => {
            setStart(isoDate(0));
            setEnd(isoDate(30));
          }}
        />
      </div>

      <ToolNote>
        Business-day counts exclude weekends but not public holidays. The tool
        operates on calendar dates, not times of day or time zones.
      </ToolNote>
    </ToolShell>
  );
}

function TimeZoneTool({ tool }: ToolProps) {
  const inferredZone = browserZone();
  const zones = useMemo(() => {
    const options: { id: string; label: string }[] = COMMON_TIME_ZONES.map((zone) => ({
      id: zone.id,
      label: zone.label,
    }));
    if (!options.some((zone) => zone.id === inferredZone)) {
      options.unshift({ id: inferredZone, label: 'This browser' });
    }
    return options;
  }, [inferredZone]);

  const [date, setDate] = useState(() => isoDate(0));
  const [time, setTime] = useState(() => currentTime());
  const [sourceZone, setSourceZone] = useState(inferredZone);
  const [customZone, setCustomZone] = useState('');

  const result = useMemo(() => {
    try {
      const conversion = convertZonedWallTime(date, time, sourceZone);
      const targetZones = [
        'UTC',
        'America/New_York',
        'Europe/London',
        'Europe/Berlin',
        'Asia/Kolkata',
        'Asia/Tokyo',
        'Australia/Sydney',
      ];
      if (customZone.trim() && isValidTimeZone(customZone.trim())) {
        targetZones.push(customZone.trim());
      }
      const uniqueZones = [...new Set(targetZones)];
      return {
        conversion,
        rows: uniqueZones.map((zone) => ({
          zone,
          time: formatInZone(conversion.date, zone),
          offset: formatOffset(zoneOffsetMinutes(conversion.date, zone)),
        })),
        error: '',
      };
    } catch (error) {
      return { conversion: null, rows: [], error: errorMessage(error) };
    }
  }, [date, time, sourceZone, customZone]);

  const summary = result.rows
    .map((row) => `${row.zone}: ${row.time} (${row.offset})`)
    .join('\n');

  const customInvalid =
    customZone.trim().length > 0 && !isValidTimeZone(customZone.trim());

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="Date">
          <input
            className="input"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </Field>
        <Field label="Time">
          <input
            className="input"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </Field>
        <Field label="Source time zone">
          <select
            className="select"
            value={sourceZone}
            onChange={(event) => setSourceZone(event.target.value)}
          >
            {zones.map((zone) => (
              <option value={zone.id}>{zone.label} ({zone.id})</option>
            ))}
          </select>
        </Field>
        <Field label="Additional IANA zone" hint="Example: Asia/Dubai">
          <input
            className="input"
            value={customZone}
            onChange={(event) => setCustomZone(event.target.value)}
            placeholder="Area/City"
            spellCheck={false}
          />
        </Field>
      </div>

      <ToolError message={result.error} />
      {customInvalid && (
        <ToolInfo>
          The additional time zone is not a valid IANA identifier, so it was
          not included.
        </ToolInfo>
      )}
      {result.conversion && (
        <>
          {!result.conversion.wallTimeExists && (
            <ToolInfo>
              This wall-clock time does not exist in the selected zone because
              of a daylight-saving transition. The browser resolved it using
              its local rules; double-check the result.
            </ToolInfo>
          )}
          <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
            <table className="reference-table">
              <thead>
                <tr>
                  <th scope="col">Time zone</th>
                  <th scope="col">Local date and time</th>
                  <th scope="col">Offset</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.zone}>
                    <td>
                      <span className="ref-primary">{row.zone}</span>
                    </td>
                    <td>{row.time}</td>
                    <td>{row.offset}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="tool-actions">
        <CopyButton text={summary} label="Copy conversions" />
        <ResetButton
          onClick={() => {
            setDate(isoDate(0));
            setTime(currentTime());
            setSourceZone(inferredZone);
            setCustomZone('');
          }}
        />
      </div>

      <ToolNote>
        Conversions use the browser’s IANA time-zone data. Daylight-saving
        gaps and overlaps are resolved with browser conventions, and the tool
        does not account for real-world calendar rules or holidays.
      </ToolNote>
    </ToolShell>
  );
}
