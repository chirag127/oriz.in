import { describe, expect, it } from 'vitest';
import { convertUnit } from '../src/lib/units';
import { calculateSubnet, parseIPv4, prefixToMask } from '../src/lib/network';

describe('unit conversion', () => {
  it('converts length and mass', () => {
    expect(convertUnit('length', 'km', 'm', 1)).toBe(1000);
    expect(convertUnit('length', 'mi', 'km', 1)).toBeCloseTo(1.609344, 8);
    expect(convertUnit('mass', 'lb', 'kg', 1)).toBeCloseTo(0.45359237, 8);
  });

  it('converts temperatures with absolute-zero validation', () => {
    expect(convertUnit('temperature', 'c', 'f', 0)).toBeCloseTo(32, 8);
    expect(convertUnit('temperature', 'c', 'k', 100)).toBeCloseTo(373.15, 8);
    expect(() => convertUnit('temperature', 'c', 'k', -300)).toThrow(
      /absolute zero/u,
    );
  });

  it('distinguishes decimal and binary storage units', () => {
    expect(convertUnit('data', 'gb', 'b', 1)).toBe(1_000_000_000);
    expect(convertUnit('data', 'gib', 'mib', 1)).toBe(1024);
  });

  it('rejects unknown categories and units', () => {
    expect(() => convertUnit('volume', 'l', 'not-a-unit', 1)).toThrow();
    expect(() => convertUnit('not-a-category', 'l', 'ml', 1)).toThrow();
  });
});

describe('IPv4 subnetting', () => {
  it('calculates a /24 network', () => {
    const result = calculateSubnet('192.168.1.10/24');
    expect(result.networkAddress).toBe('192.168.1.0');
    expect(result.broadcastAddress).toBe('192.168.1.255');
    expect(result.firstUsable).toBe('192.168.1.1');
    expect(result.lastUsable).toBe('192.168.1.254');
    expect(result.subnetMask).toBe('255.255.255.0');
    expect(result.wildcardMask).toBe('0.0.0.255');
    expect(result.totalAddresses).toBe(256);
    expect(result.usableAddresses).toBe(254);
    expect(result.isPrivate).toBe(true);
    expect(result.ipBinary).toBe('11000000.10101000.00000001.00001010');
  });

  it('handles /31 and /32 host conventions', () => {
    const pointToPoint = calculateSubnet('198.51.100.10/31');
    expect(pointToPoint.usableAddresses).toBe(2);
    expect(pointToPoint.networkAddress).toBe('198.51.100.10');
    const single = calculateSubnet('203.0.113.7/32');
    expect(single.usableAddresses).toBe(1);
    expect(single.firstUsable).toBe('203.0.113.7');
  });

  it('handles the default route prefix', () => {
    const result = calculateSubnet('203.0.113.5/0');
    expect(result.networkAddress).toBe('0.0.0.0');
    expect(result.broadcastAddress).toBe('255.255.255.255');
    expect(result.totalAddresses).toBe(4294967296);
    expect(result.usableAddresses).toBe(4294967294);
  });

  it('validates input', () => {
    expect(() => parseIPv4('192.168.1.256')).toThrow();
    expect(() => parseIPv4('192.168.1')).toThrow();
    expect(() => calculateSubnet('192.168.1.1')).toThrow(/CIDR/u);
    expect(() => calculateSubnet('192.168.1.1/33')).toThrow();
    expect(prefixToMask(24)).toBe(0xffffff00);
  });
});
