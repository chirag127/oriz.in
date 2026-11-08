export type Uint32Source = () => number;

export interface SampleIntegerOptions {
  min: number;
  max: number;
  count: number;
  unique?: boolean;
  randomUint32?: Uint32Source;
}

export function cryptoUint32(): number {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('A cryptographic random source is not available in this browser.');
  }
  const buffer = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buffer);
  return buffer[0]!;
}

export function sampleIntegers(options: SampleIntegerOptions): number[] {
  const { min, max, count, unique = false } = options;
  const randomUint32 = options.randomUint32 ?? cryptoUint32;

  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
    throw new Error('Minimum and maximum must be safe integers.');
  }
  if (min > max) {
    throw new Error('Minimum cannot be greater than maximum.');
  }
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error('Sample size must be a positive whole number.');
  }
  if (count > 10000) {
    throw new Error('Sample size is limited to 10,000 values.');
  }

  const range = max - min + 1;
  if (!Number.isSafeInteger(range) || range <= 0) {
    throw new Error('The requested range is too large.');
  }
  if (unique && count > range) {
    throw new Error(
      `Cannot draw ${count} unique values from a range of ${range}.`,
    );
  }

  const limit = Math.floor(4294967296 / range) * range;
  const values: number[] = [];
  const seen = new Set<number>();
  let attempts = 0;
  const maxAttempts = count * 100 + 1000;

  while (values.length < count) {
    attempts += 1;
    if (attempts > maxAttempts) {
      throw new Error('Could not produce a sample. Try a smaller sample size.');
    }
    let random = randomUint32();
    if (!Number.isInteger(random) || random < 0 || random > 0xffffffff) {
      throw new Error('The random source returned an invalid value.');
    }
    if (random >= limit) continue;
    random %= range;
    const value = min + random;
    if (unique) {
      if (seen.has(value)) continue;
      seen.add(value);
    }
    values.push(value);
  }

  return values;
}

export function generateUuids(count = 1, uppercase = false): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 1000) {
    throw new Error('Generate between 1 and 1,000 UUIDs at a time.');
  }
  const results: string[] = [];
  for (let index = 0; index < count; index += 1) {
    let uuid: string;
    if (globalThis.crypto?.randomUUID) {
      uuid = globalThis.crypto.randomUUID();
    } else if (globalThis.crypto?.getRandomValues) {
      const bytes = new Uint8Array(16);
      globalThis.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6]! & 0x0f) | 0x40;
      bytes[8] = (bytes[8]! & 0x3f) | 0x80;
      const hex = Array.from(bytes, (byte) =>
        byte.toString(16).padStart(2, '0'),
      ).join('');
      uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    } else {
      throw new Error('A cryptographic random source is not available.');
    }
    results.push(uppercase ? uuid.toUpperCase() : uuid);
  }
  return results;
}
