export interface SubnetResult {
  ip: string;
  prefix: number;
  cidr: string;
  networkAddress: string;
  broadcastAddress: string;
  subnetMask: string;
  wildcardMask: string;
  firstUsable: string;
  lastUsable: string;
  totalAddresses: number;
  usableAddresses: number;
  ipBinary: string;
  networkBinary: string;
  maskBinary: string;
  isPrivate: boolean;
}

const PRIVATE_RANGES: [number, number][] = [
  [ipToInt('10.0.0.0'), ipToInt('10.255.255.255')],
  [ipToInt('172.16.0.0'), ipToInt('172.31.255.255')],
  [ipToInt('192.168.0.0'), ipToInt('192.168.255.255')],
];

export function parseIPv4(input: string): number {
  const value = input.trim();
  const parts = value.split('.');
  if (parts.length !== 4) {
    throw new Error('Enter an IPv4 address with four octets, such as 192.0.2.10.');
  }
  let result = 0;
  for (const part of parts) {
    if (!/^\d{1,3}$/u.test(part)) {
      throw new Error('Each IPv4 octet must be a number from 0 to 255.');
    }
    const octet = Number(part);
    if (octet > 255) {
      throw new Error('Each IPv4 octet must be between 0 and 255.');
    }
    result = ((result << 8) | octet) >>> 0;
  }
  return result;
}

export function ipToInt(ip: string): number {
  const parts = ip.split('.').map(Number);
  return ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
}

export function intToIp(value: number): string {
  const unsigned = value >>> 0;
  return [
    (unsigned >>> 24) & 255,
    (unsigned >>> 16) & 255,
    (unsigned >>> 8) & 255,
    unsigned & 255,
  ].join('.');
}

export function intToBinary(value: number, group = true): string {
  const binary = (value >>> 0).toString(2).padStart(32, '0');
  return group ? binary.match(/.{8}/gu)?.join('.') ?? binary : binary;
}

export function prefixToMask(prefix: number): number {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    throw new Error('The CIDR prefix must be an integer from 0 to 32.');
  }
  if (prefix === 0) return 0;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

export function calculateSubnet(input: string): SubnetResult {
  const trimmed = input.trim();
  const match = trimmed.match(/^([^/]+)\/(\d{1,2})$/u);
  if (!match) {
    throw new Error('Use CIDR notation, for example 192.0.2.10/24.');
  }
  const ipAddress = match[1]!;
  const prefix = Number(match[2]);
  if (prefix < 0 || prefix > 32) {
    throw new Error('The CIDR prefix must be between 0 and 32.');
  }

  const ipInt = parseIPv4(ipAddress);
  const mask = prefixToMask(prefix);
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);

  let firstUsable: number;
  let lastUsable: number;
  let usableAddresses: number;

  if (prefix === 32) {
    firstUsable = network;
    lastUsable = network;
    usableAddresses = 1;
  } else if (prefix === 31) {
    firstUsable = network;
    lastUsable = broadcast;
    usableAddresses = 2;
  } else {
    firstUsable = network + 1;
    lastUsable = broadcast - 1;
    usableAddresses = totalAddresses - 2;
  }

  return {
    ip: ipAddress,
    prefix,
    cidr: `${intToIp(network)}/${prefix}`,
    networkAddress: intToIp(network),
    broadcastAddress: intToIp(broadcast),
    subnetMask: intToIp(mask),
    wildcardMask: intToIp(~mask >>> 0),
    firstUsable: intToIp(firstUsable),
    lastUsable: intToIp(lastUsable),
    totalAddresses,
    usableAddresses,
    ipBinary: intToBinary(ipInt),
    networkBinary: intToBinary(network),
    maskBinary: intToBinary(mask),
    isPrivate: PRIVATE_RANGES.some(
      ([start, end]) => ipInt >= start && ipInt <= end,
    ),
  };
}

export const PREFIX_REFERENCE = [
  { prefix: 24, mask: '255.255.255.0', addresses: 256, usable: 254 },
  { prefix: 25, mask: '255.255.255.128', addresses: 128, usable: 126 },
  { prefix: 26, mask: '255.255.255.192', addresses: 64, usable: 62 },
  { prefix: 27, mask: '255.255.255.224', addresses: 32, usable: 30 },
  { prefix: 28, mask: '255.255.255.240', addresses: 16, usable: 14 },
  { prefix: 29, mask: '255.255.255.248', addresses: 8, usable: 6 },
  { prefix: 30, mask: '255.255.255.252', addresses: 4, usable: 2 },
  { prefix: 31, mask: '255.255.255.254', addresses: 2, usable: 2 },
  { prefix: 32, mask: '255.255.255.255', addresses: 1, usable: 1 },
] as const;
