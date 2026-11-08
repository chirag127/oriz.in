import { describe, expect, it } from 'vitest';
import { decodeJwt } from '../src/lib/jwt';

function token(payload: Record<string, unknown>, header: Record<string, unknown> = { alg: 'HS256', typ: 'JWT' }): string {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode(header)}.${encode(payload)}.fake-signature`;
}

describe('JWT decoding', () => {
  it('decodes header, payload, and signature without verifying', () => {
    const result = decodeJwt(token({ sub: 'demo', role: 'reader', exp: 1893456000 }));
    expect(result.header).toEqual({ alg: 'HS256', typ: 'JWT' });
    expect(result.payload).toEqual({ sub: 'demo', role: 'reader', exp: 1893456000 });
    expect(result.signature).toBe('fake-signature');
    expect(result.warnings.join(' ')).toMatch(/not verified/u);
  });

  it('flags alg none and an expired exp claim', () => {
    const result = decodeJwt(
      token({ sub: 'demo', exp: 1 }, { alg: 'none', typ: 'JWT' }),
    );
    expect(result.warnings.join(' ')).toMatch(/alg: none/u);
    expect(result.warnings.join(' ')).toMatch(/past/u);
  });

  it('accepts a Bearer prefix and validates the segment count', () => {
    const value = token({ sub: 'demo' });
    expect(() => decodeJwt(`Bearer ${value}`)).not.toThrow();
    expect(() => decodeJwt('one.two')).toThrow(/three/u);
    expect(() => decodeJwt('one.two.three')).toThrow(/JSON/u);
    const valid = token({ sub: 'demo' }).split('.');
    expect(() => decodeJwt(`${valid[0]}.${valid[1]}.!!!`)).toThrow(/Base64url/u);
    expect(() => decodeJwt('')).toThrow(/Paste/u);
  });
});
