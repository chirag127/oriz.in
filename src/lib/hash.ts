const MD5_SHIFTS = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

const MD5_CONSTANTS = new Uint32Array(
  Array.from({ length: 64 }, (_, index) =>
    Math.floor(Math.abs(Math.sin(index + 1)) * 4294967296),
  ),
);

function rotateLeft(value: number, count: number): number {
  return ((value << count) | (value >>> (32 - count))) >>> 0;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function md5Hex(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const bitLength = bytes.length * 8;
  const paddedLength = (((bytes.length + 8) >>> 6) + 1) * 64;
  const buffer = new Uint8Array(paddedLength);
  buffer.set(bytes);
  buffer[bytes.length] = 0x80;

  const view = new DataView(buffer.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(
    paddedLength - 4,
    Math.floor(bitLength / 4294967296) >>> 0,
    true,
  );

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const words = new Uint32Array(16);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let index = 0; index < 16; index += 1) {
      words[index] = view.getUint32(offset + index * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let round = 0; round < 64; round += 1) {
      let f: number;
      let wordIndex: number;

      if (round < 16) {
        f = (b & c) | (~b & d);
        wordIndex = round;
      } else if (round < 32) {
        f = (d & b) | (~d & c);
        wordIndex = (5 * round + 1) % 16;
      } else if (round < 48) {
        f = b ^ c ^ d;
        wordIndex = (3 * round + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        wordIndex = (7 * round) % 16;
      }

      f = (f + a + MD5_CONSTANTS[round]! + words[wordIndex]!) >>> 0;
      a = d;
      d = c;
      c = b;
      b = (b + rotateLeft(f, MD5_SHIFTS[round]!)) >>> 0;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const output = new Uint8Array(16);
  const outputView = new DataView(output.buffer);
  outputView.setUint32(0, a0, true);
  outputView.setUint32(4, b0, true);
  outputView.setUint32(8, c0, true);
  outputView.setUint32(12, d0, true);
  return toHex(output);
}

export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' | 'MD5';

export const HASH_ALGORITHMS: { id: HashAlgorithm; label: string }[] = [
  { id: 'SHA-256', label: 'SHA-256' },
  { id: 'SHA-512', label: 'SHA-512' },
  { id: 'SHA-1', label: 'SHA-1' },
  { id: 'SHA-384', label: 'SHA-384' },
  { id: 'MD5', label: 'MD5' },
];

export async function hashText(
  input: string,
  algorithm: HashAlgorithm,
  uppercase = false,
): Promise<string> {
  if (algorithm === 'MD5') {
    const digest = md5Hex(input);
    return uppercase ? digest.toUpperCase() : digest;
  }
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('This browser does not expose the Web Crypto API.');
  }
  const digest = await subtle.digest(
    algorithm,
    new TextEncoder().encode(input),
  );
  const hex = toHex(new Uint8Array(digest));
  return uppercase ? hex.toUpperCase() : hex;
}
