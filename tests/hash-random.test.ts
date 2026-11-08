import { describe, expect, it } from 'vitest';
import { generateUuids, sampleIntegers } from '../src/lib/random';
import { hashText, md5Hex } from '../src/lib/hash';

describe('MD5', () => {
  it('matches the RFC 1321 test vectors', () => {
    expect(md5Hex('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    expect(md5Hex('a')).toBe('0cc175b9c0f1b6a831c399e269772661');
    expect(md5Hex('abc')).toBe('900150983cd24fb0d6963f7d28e17f72');
    expect(md5Hex('message digest')).toBe('f96b697d7cb7938d525a2f31aaf161d0');
    expect(md5Hex('abcdefghijklmnopqrstuvwxyz')).toBe(
      'c3fcd3d76192e4007dfb496cca67e13b',
    );
    expect(
      md5Hex(
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      ),
    ).toBe('d174ab98d277d9f5a5611c2c9f419d9f');
    expect(
      md5Hex(
        '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
      ),
    ).toBe('57edf4a22be3c955ac49da2e2107b67a');
  });
});

describe('Web Crypto hashes', () => {
  it('computes SHA-256', async () => {
    expect(await hashText('abc', 'SHA-256')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('supports uppercase output and other algorithms', async () => {
    const digest = await hashText('abc', 'SHA-1', true);
    expect(digest).toBe('A9993E364706816ABA3E25717850C26C9CD0D89D');
    expect(await hashText('abc', 'SHA-512')).toHaveLength(128);
  });
});

describe('random sampling', () => {
  it('uses rejection sampling and returns unique values', () => {
    let counter = 0;
    const values = sampleIntegers({
      min: 1,
      max: 10,
      count: 5,
      unique: true,
      randomUint32: () => counter++,
    });
    expect(values).toHaveLength(5);
    expect(new Set(values).size).toBe(5);
    values.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(10);
    });
  });

  it('allows duplicates when requested', () => {
    const values = sampleIntegers({
      min: 4,
      max: 4,
      count: 3,
      randomUint32: () => 0,
    });
    expect(values).toEqual([4, 4, 4]);
  });

  it('fails instead of looping forever when unique values are impossible', () => {
    expect(() =>
      sampleIntegers({
        min: 1,
        max: 10,
        count: 5,
        unique: true,
        randomUint32: () => 0,
      }),
    ).toThrow(/Could not produce/u);
  });

  it('validates the range and sample size', () => {
    expect(() =>
      sampleIntegers({ min: 10, max: 1, count: 1, randomUint32: () => 0 }),
    ).toThrow();
    expect(() =>
      sampleIntegers({ min: 1, max: 2, count: 3, unique: true }),
    ).toThrow(/unique/u);
    expect(() =>
      sampleIntegers({ min: 1, max: 2, count: 0 }),
    ).toThrow();
  });
});

describe('UUID generation', () => {
  it('produces valid v4 UUIDs', () => {
    const uuids = generateUuids(5);
    expect(uuids).toHaveLength(5);
    for (const uuid of uuids) {
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
      );
    }
    expect(new Set(uuids).size).toBe(5);
  });

  it('supports uppercase output', () => {
    expect(generateUuids(1, true)[0]).toMatch(/^[0-9A-F-]+$/u);
  });

  it('rejects unreasonable counts', () => {
    expect(() => generateUuids(0)).toThrow();
    expect(() => generateUuids(1001)).toThrow();
  });
});
