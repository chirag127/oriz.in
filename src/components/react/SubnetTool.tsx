import { useId, useMemo, useState } from 'react';
import type { ToolProps } from './ToolLoader';
import {
  CopyButton,
  Field,
  ResetButton,
  ToolError,
  ToolNote,
  ToolShell,
  errorMessage,
} from './ui';
import { PREFIX_REFERENCE, calculateSubnet } from '../../lib/network';

export default function SubnetTool({ tool }: ToolProps) {
  const inputId = useId();
  const [input, setInput] = useState('192.168.10.130/26');

  const result = useMemo(() => {
    try {
      return { subnet: calculateSubnet(input), error: '' };
    } catch (error) {
      return { subnet: null, error: errorMessage(error) };
    }
  }, [input]);

  const copyText = result.subnet
    ? [
        `CIDR: ${result.subnet.cidr}`,
        `Network: ${result.subnet.networkAddress}`,
        `Broadcast: ${result.subnet.broadcastAddress}`,
        `Usable range: ${result.subnet.firstUsable} – ${result.subnet.lastUsable}`,
        `Subnet mask: ${result.subnet.subnetMask}`,
        `Total addresses: ${result.subnet.totalAddresses}`,
        `Usable addresses: ${result.subnet.usableAddresses}`,
      ].join('\n')
    : '';

  return (
    <ToolShell title={tool.title}>
      <div className="tool-controls">
        <Field label="IPv4 address and CIDR prefix" hint="Example: 192.168.10.130/26">
          <input
            id={inputId}
            className="input mono-block"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            aria-invalid={Boolean(result.error)}
          />
        </Field>
      </div>

      <ToolError message={result.error} />

      {result.subnet && (
        <>
          <div className="subnet-grid">
            {[
              ['Network address', result.subnet.networkAddress],
              ['Broadcast address', result.subnet.broadcastAddress],
              ['First usable', result.subnet.firstUsable],
              ['Last usable', result.subnet.lastUsable],
              ['Subnet mask', result.subnet.subnetMask],
              ['Wildcard mask', result.subnet.wildcardMask],
              ['Total addresses', result.subnet.totalAddresses.toLocaleString('en-US')],
              ['Usable addresses', result.subnet.usableAddresses.toLocaleString('en-US')],
            ].map(([label, value]) => (
              <div className="subnet-item" key={label}>
                <div className="subnet-label">{label}</div>
                <div className="subnet-value">{value}</div>
              </div>
            ))}
          </div>

          <div className="tool-pane">
            <div className="pane-head">
              <span>Binary view</span>
              <span className="reference-count">
                {result.subnet.isPrivate ? 'Private range' : 'Global or special-purpose range'}
              </span>
            </div>
            <div className="tool-app-body">
              <div className="mono-block">
                IP: {result.subnet.ipBinary}
                <br />
                Network: {result.subnet.networkBinary}
                <br />
                Mask: {result.subnet.maskBinary}
              </div>
            </div>
          </div>

          <div className="reference-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
            <table className="reference-table">
              <thead>
                <tr>
                  <th scope="col">Prefix</th>
                  <th scope="col">Mask</th>
                  <th scope="col">Addresses</th>
                  <th scope="col">Usable</th>
                </tr>
              </thead>
              <tbody>
                {PREFIX_REFERENCE.map((row) => (
                  <tr key={row.prefix}>
                    <td>/{row.prefix}</td>
                    <td>
                      <code>{row.mask}</code>
                    </td>
                    <td>{row.addresses}</td>
                    <td>{row.usable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="tool-actions">
        <CopyButton text={copyText} label="Copy result" />
        <ResetButton onClick={() => setInput('192.168.10.130/26')} />
      </div>

      <ToolNote>
        IPv4 only. /31 is shown with two usable addresses per RFC 3021, and /32
        is a single host route. Special-purpose ranges beyond common private
        blocks are not classified.
      </ToolNote>
    </ToolShell>
  );
}
