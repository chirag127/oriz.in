export interface DecodedJwt {
  header: unknown;
  payload: unknown;
  signature: string;
  warnings: string[];
}

function decodeBase64Url(segment: string): string {
  if (!segment) throw new Error('A JWT segment is empty.');
  if (!/^[A-Za-z0-9_-]+$/u.test(segment)) {
    throw new Error('The token contains characters that are not valid Base64url.');
  }
  const normalized = segment.replace(/-/gu, '+').replace(/_/gu, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  let binary: string;
  try {
    binary = atob(padded);
  } catch {
    throw new Error('A token segment could not be decoded.');
  }
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('A token segment is not valid UTF-8 JSON.');
  }
}

function parseSegment(segment: string, label: string): unknown {
  const text = decodeBase64Url(segment);
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error(`The JWT ${label} is not valid JSON.`);
  }
}

export function decodeJwt(token: string): DecodedJwt {
  const normalized = token.trim().replace(/^Bearer\s+/iu, '');
  if (!normalized) throw new Error('Paste a JWT first.');
  const parts = normalized.split('.');
  if (parts.length !== 3) {
    throw new Error('A JWT must have three dot-separated segments: header.payload.signature.');
  }

  const header = parseSegment(parts[0]!, 'header');
  const payload = parseSegment(parts[1]!, 'payload');
  const signature = parts[2]!;
  if (signature && !/^[A-Za-z0-9_-]+$/u.test(signature)) {
    throw new Error('The JWT signature contains characters that are not valid Base64url.');
  }
  const warnings = [
    'The signature is displayed, not verified. This tool does not prove that the token is authentic or unexpired.',
  ];

  if (
    header &&
    typeof header === 'object' &&
    'alg' in header &&
    String((header as { alg?: unknown }).alg).toLowerCase() === 'none'
  ) {
    warnings.push('The token declares alg: none. Do not accept it as authenticated.');
  }
  if (!signature) warnings.push('The signature segment is empty.');
  if (payload && typeof payload === 'object' && 'exp' in payload) {
    const exp = Number((payload as { exp?: unknown }).exp);
    if (Number.isFinite(exp)) {
      warnings.push(
        exp * 1000 < Date.now()
          ? 'The exp claim is in the past; the token is expired by its own payload.'
          : 'The exp claim is in the future; confirm that the server actually enforces expiry.',
      );
    }
  }

  return { header, payload, signature, warnings };
}
