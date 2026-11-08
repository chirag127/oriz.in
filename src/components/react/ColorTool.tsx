import { useId, useMemo, useState } from 'react';
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
import {
  buildGradientCss,
  colorSummary,
  evaluateContrast,
  parseColor,
  rgbToHex,
} from '../../lib/colors';

export default function ColorTool({ tool }: ToolProps) {
  if (tool.engine === 'contrast') return <ContrastTool tool={tool} />;
  if (tool.engine === 'gradient') return <GradientTool tool={tool} />;
  return <ColorConverterTool tool={tool} />;
}

function ColorConverterTool({ tool }: ToolProps) {
  const inputId = useId();
  const [color, setColor] = useState('#C2410C');

  const result = useMemo(() => {
    try {
      const summary = colorSummary(color);
      return { summary, error: '' };
    } catch (error) {
      return { summary: null, error: errorMessage(error) };
    }
  }, [color]);

  const bestText =
    result.summary &&
    evaluateContrast(result.summary.rgb, parseColor('#fffefc')).ratio >=
      evaluateContrast(result.summary.rgb, parseColor('#1c1917')).ratio
      ? '#fffefc'
      : '#1c1917';

  const copyText = result.summary
    ? `HEX: ${result.summary.hex}\nRGB: ${result.summary.rgbCss}\nHSL: hsl(${result.summary.hsl.h} ${result.summary.hsl.s}% ${result.summary.hsl.l}%)\nHSV: hsv(${result.summary.hsv.h} ${result.summary.hsv.s}% ${result.summary.hsv.v}%)`
    : '';

  return (
    <ToolShell title={tool.title}>
      <div className="color-controls">
        <Field label="Native picker">
          <input
            className="color-picker"
            type="color"
            value={result.summary?.hex ?? '#000000'}
            onChange={(event) => setColor(event.target.value.toUpperCase())}
            aria-label="Pick a color"
          />
        </Field>
        <Field label="Color value" hint="HEX, rgb(), or hsl()">
          <input
            id={inputId}
            className="input mono-block"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            spellCheck={false}
            aria-invalid={Boolean(result.error)}
          />
        </Field>
      </div>

      <ToolError message={result.error} />

      {result.summary && (
        <>
          <div className="color-preview">
            <span className="swatch" style={{ background: result.summary.hex }} />
            <div>
              <div className="result-headline">{result.summary.hex}</div>
              <div className="mono-block">{result.summary.rgbCss}</div>
            </div>
          </div>
          <div className="color-values">
            <div className="color-value-row">
              <span>HEX</span>
              <code>{result.summary.hex}</code>
            </div>
            <div className="color-value-row">
              <span>RGB</span>
              <code>{result.summary.rgbCss}</code>
            </div>
            <div className="color-value-row">
              <span>HSL</span>
              <code>
                hsl({result.summary.hsl.h} {result.summary.hsl.s}%{' '}
                {result.summary.hsl.l}%)
              </code>
            </div>
            <div className="color-value-row">
              <span>HSV</span>
              <code>
                hsv({result.summary.hsv.h} {result.summary.hsv.s}%{' '}
                {result.summary.hsv.v}%)
              </code>
            </div>
          </div>
          <div
            className="preview-sample"
            style={{ background: result.summary.hex, color: bestText }}
          >
            Sample text on the selected color. The preview chooses the higher
            contrast between near-black and near-white text.
          </div>
          <ToolInfo>
            Relative luminance: a useful input to WCAG contrast calculations.
            Use the <a href="/tools/contrast-checker/">contrast checker</a> for
            pass/fail results.
          </ToolInfo>
        </>
      )}

      <div className="tool-actions">
        <CopyButton text={copyText} label="Copy all values" />
        <ResetButton onClick={() => setColor('#C2410C')} />
      </div>

      <ToolNote>
        Alpha and HWB are not supported in this version. Previews depend on your
        display profile.
      </ToolNote>
    </ToolShell>
  );
}

function ContrastTool({ tool }: ToolProps) {
  const [foreground, setForeground] = useState('#1C1917');
  const [background, setBackground] = useState('#FFFEFC');

  const result = useMemo(() => {
    try {
      const fg = parseColor(foreground);
      const bg = parseColor(background);
      return {
        fg,
        bg,
        results: evaluateContrast(fg, bg),
        error: '',
      };
    } catch (error) {
      return { fg: null, bg: null, results: null, error: errorMessage(error) };
    }
  }, [foreground, background]);

  const copyText = result.results
    ? `Contrast ratio: ${result.results.ratio.toFixed(2)}:1\nNormal text AA: ${result.results.normalAA ? 'pass' : 'fail'}\nNormal text AAA: ${result.results.normalAAA ? 'pass' : 'fail'}\nLarge text AA: ${result.results.largeAA ? 'pass' : 'fail'}\nLarge text AAA: ${result.results.largeAAA ? 'pass' : 'fail'}\nUI components AA: ${result.results.uiAA ? 'pass' : 'fail'}`
    : '';

  return (
    <ToolShell title={tool.title}>
      <div className="tool-grid">
        <div className="color-controls">
          <Field label="Text color">
            <input
              type="color"
              className="color-picker"
              value={result.fg ? rgbToHex(result.fg) : '#1C1917'}
              onChange={(event) => setForeground(event.target.value.toUpperCase())}
              aria-label="Choose text color"
            />
          </Field>
          <Field label="Value">
            <input
              className="input mono-block"
              value={foreground}
              onChange={(event) => setForeground(event.target.value)}
              spellCheck={false}
            />
          </Field>
        </div>
        <div className="color-controls">
          <Field label="Background color">
            <input
              type="color"
              className="color-picker"
              value={result.bg ? rgbToHex(result.bg) : '#FFFEFC'}
              onChange={(event) => setBackground(event.target.value.toUpperCase())}
              aria-label="Choose background color"
            />
          </Field>
          <Field label="Value">
            <input
              className="input mono-block"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              spellCheck={false}
            />
          </Field>
        </div>
      </div>

      <div className="tool-actions">
        <button
          type="button"
          className="btn btn--secondary btn--small"
          onClick={() => {
            setForeground(background);
            setBackground(foreground);
          }}
        >
          Swap colors
        </button>
      </div>

      <ToolError message={result.error} />

      {result.results && result.fg && result.bg && (
        <>
          <div className="stat-grid">
            <Stat
              label="Contrast ratio"
              value={`${result.results.ratio.toFixed(2)}:1`}
              hint="Higher is better; black on white is 21:1"
            />
            <Stat
              label="Normal text"
              value={result.results.normalAA ? 'AA pass' : 'AA fail'}
              hint={result.results.normalAAA ? 'AAA pass' : 'AAA fail'}
            />
            <Stat
              label="Large text"
              value={result.results.largeAA ? 'AA pass' : 'AA fail'}
              hint={result.results.largeAAA ? 'AAA pass' : 'AAA fail'}
            />
          </div>

          <div
            className="contrast-preview"
            style={{ color: rgbToHex(result.fg), background: rgbToHex(result.bg) }}
          >
            <div className="preview-sample" style={{ borderColor: 'currentColor' }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Readable large text on the selected background.
              </p>
              <p style={{ fontSize: '1rem' }}>
                Normal text should reach 4.5:1 for WCAG AA. This preview is not
                a substitute for testing the real interface.
              </p>
            </div>
          </div>

          <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
            <table className="reference-table contrast-pass-table">
              <thead>
                <tr>
                  <th scope="col">Criterion</th>
                  <th scope="col">Minimum</th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Normal text AA', '4.5:1', result.results.normalAA],
                  ['Normal text AAA', '7:1', result.results.normalAAA],
                  ['Large text AA', '3:1', result.results.largeAA],
                  ['Large text AAA', '4.5:1', result.results.largeAAA],
                  ['UI components AA', '3:1', result.results.uiAA],
                ].map(([label, minimum, pass]) => (
                  <tr key={String(label)}>
                    <td>{label}</td>
                    <td>{minimum}</td>
                    <td>
                      <span className={pass ? 'pass-icon' : 'fail-icon'}>
                        {pass ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="tool-actions">
        <CopyButton text={copyText} label="Copy result" />
        <ResetButton
          onClick={() => {
            setForeground('#1C1917');
            setBackground('#FFFEFC');
          }}
        />
      </div>

      <ToolNote>
        Contrast is necessary but not sufficient for readability. Check focus
        states, font size, gradients, and images separately.
      </ToolNote>
    </ToolShell>
  );
}

interface ColorStop {
  color: string;
  position: number;
}

function GradientTool({ tool }: ToolProps) {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#C2410C', position: 0 },
    { color: '#F97316', position: 100 },
  ]);

  const result = useMemo(() => {
    try {
      const css = buildGradientCss({
        type,
        angle,
        stops: stops.map((stop) => ({
          color: parseColor(stop.color),
          position: stop.position,
        })),
      });
      return { css, error: '' };
    } catch (error) {
      return { css: '', error: errorMessage(error) };
    }
  }, [type, angle, stops]);

  const updateStop = (index: number, patch: Partial<ColorStop>) => {
    setStops((current) =>
      current.map((stop, stopIndex) =>
        stopIndex === index ? { ...stop, ...patch } : stop,
      ),
    );
  };

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="Gradient type">
          <select
            className="select"
            value={type}
            onChange={(event) => setType(event.target.value as 'linear' | 'radial')}
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </Field>
        {type === 'linear' && (
          <Field label="Angle">
            <div className="field-row">
              <input
                className="input"
                type="number"
                min={0}
                max={360}
                value={angle}
                onChange={(event) => setAngle(Number(event.target.value))}
              />
              <span className="field-suffix">deg</span>
            </div>
          </Field>
        )}
      </div>

      <div
        className="gradient-preview"
        style={{ background: result.css || undefined }}
        role="img"
        aria-label="Gradient preview"
      />

      <div className="tool-controls">
        {stops.map((stop, index) => (
          <div className="stop-row" key={index}>
            <input
              type="color"
              value={stop.color}
              onChange={(event) => updateStop(index, { color: event.target.value.toUpperCase() })}
              aria-label={`Color stop ${index + 1}`}
            />
            <input
              className="input mono-block"
              value={stop.color}
              onChange={(event) => updateStop(index, { color: event.target.value })}
              aria-label={`Color value for stop ${index + 1}`}
              spellCheck={false}
            />
            <input
              className="input"
              type="number"
              min={0}
              max={100}
              value={stop.position}
              onChange={(event) =>
                updateStop(index, { position: Number(event.target.value) })
              }
              aria-label={`Position for stop ${index + 1}`}
            />
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() =>
                setStops((current) => current.filter((_, stopIndex) => stopIndex !== index))
              }
              disabled={stops.length <= 2}
            >
              Remove
            </button>
          </div>
        ))}
        <div className="tool-actions">
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={() =>
              setStops((current) => [
                ...current,
                {
                  color: '#FFF7ED',
                  position: Math.min(100, Math.round((current.at(-1)?.position ?? 100) / 2)),
                },
              ])
            }
            disabled={stops.length >= 8}
          >
            Add stop
          </button>
        </div>
      </div>

      <ToolError message={result.error} />
      {result.css && (
        <div className="tool-pane">
          <div className="pane-head">
            <span>CSS</span>
            <div className="pane-head-actions">
              <CopyButton text={result.css} />
            </div>
          </div>
          <textarea
            className="text-output"
            value={result.css}
            readOnly
            aria-label="Generated gradient CSS"
          />
        </div>
      )}

      <div className="tool-actions">
        <CopyButton text={result.css} label="Copy CSS" />
        <DownloadButton text={result.css} filename="oriz-gradient.css" />
        <ResetButton
          onClick={() => {
            setType('linear');
            setAngle(90);
            setStops([
              { color: '#C2410C', position: 0 },
              { color: '#F97316', position: 100 },
            ]);
          }}
        />
      </div>

      <ToolNote>
        Stops are sorted by position in the generated CSS. Check text contrast
        against both the lightest and darkest parts of the gradient.
      </ToolNote>
    </ToolShell>
  );
}
