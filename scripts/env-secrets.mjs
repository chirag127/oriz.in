import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const SECRETS = path.join(ROOT, '.secrets');
const ENV_FILE = path.join(ROOT, '.env');
const SOPS_FILE = path.join(ROOT, '.env.sops');
const SOPS_YAML = path.join(ROOT, '.sops.yaml');
const AGE_KEY = path.join(SECRETS, 'age.key');
const AGE_KEY_BACKUP = path.join(SECRETS, 'age.key.gpg');
const PASSPHRASE_FILE = path.join(SECRETS, 'env.passphrase');
const SOPS_BIN = process.env.SOPS_BIN || 'sops';
const GPG_BIN = process.env.GPG_BIN || 'gpg';

function fail(message) {
  console.error(`environment error: ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  });
  if (result.error) {
    if (result.error.code === 'ENOENT') {
      throw new Error(`Required command not found: ${command}. Install it or set its *_BIN path.`);
    }
    throw new Error(result.error.message);
  }
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim().split(/\r?\n/u)[0];
    throw new Error(
      `${command} failed${detail ? `: ${detail}` : ''}`,
    );
  }
  return result.stdout ?? '';
}

function readPublicKey() {
  try {
    const config = readFileSync(SOPS_YAML, 'utf8');
    const match = config.match(/age:\s*(age1[0-9a-z]+)/iu);
    if (match) return match[1];
  } catch {
    // Fall back to the local public-key file below.
  }
  const localKey = path.join(SECRETS, 'age.pub');
  if (existsSync(localKey)) {
    const key = readFileSync(localKey, 'utf8').trim();
    if (key.startsWith('age1')) return key;
  }
  throw new Error('No age recipient found in .sops.yaml or .secrets/age.pub.');
}

function getPassphrase() {
  const fromEnvironment = process.env.SOPS_ENV_PASSPHRASE?.trim();
  if (fromEnvironment) return fromEnvironment;
  if (existsSync(PASSPHRASE_FILE)) {
    const value = readFileSync(PASSPHRASE_FILE, 'utf8').trim();
    if (value) return value;
  }
  return '';
}

function ensureAgeKey() {
  const configured = process.env.SOPS_AGE_KEY_FILE;
  if (configured) {
    const resolved = path.resolve(ROOT, configured);
    if (!existsSync(resolved)) {
      throw new Error(`SOPS_AGE_KEY_FILE points to a missing file: ${configured}`);
    }
    return resolved;
  }

  if (existsSync(AGE_KEY)) {
    const key = readFileSync(AGE_KEY, 'utf8');
    if (key.includes('AGE-SECRET-KEY-1')) return AGE_KEY;
    throw new Error(`${path.relative(ROOT, AGE_KEY)} does not contain an age identity.`);
  }

  if (!existsSync(AGE_KEY_BACKUP)) {
    throw new Error(
      'No age key is available. Restore .secrets/age.key.gpg from your secure backup, or set SOPS_AGE_KEY_FILE.',
    );
  }

  const passphrase = getPassphrase();
  if (!passphrase) {
    throw new Error(
      'The age key is missing and the password-protected backup needs a passphrase. Set SOPS_ENV_PASSPHRASE or create .secrets/env.passphrase locally.',
    );
  }

  mkdirSync(SECRETS, { recursive: true });
  const temporaryPassphrase = path.join(
    SECRETS,
    `.passphrase-${process.pid}-${Date.now()}.tmp`,
  );
  const temporaryKey = path.join(
    SECRETS,
    `.age-key-${process.pid}-${Date.now()}.tmp`,
  );

  try {
    writeFileSync(temporaryPassphrase, passphrase, { mode: 0o600 });
    run(GPG_BIN, [
      '--batch',
      '--yes',
      '--quiet',
      '--pinentry-mode',
      'loopback',
      '--passphrase-file',
      temporaryPassphrase,
      '--output',
      temporaryKey,
      '--decrypt',
      AGE_KEY_BACKUP,
    ]);
    const restored = readFileSync(temporaryKey, 'utf8');
    if (!restored.includes('AGE-SECRET-KEY-1')) {
      throw new Error('The restored key is not a valid age identity.');
    }
    renameSync(temporaryKey, AGE_KEY);
    try {
      chmodSync(AGE_KEY, 0o600);
    } catch {
      // Windows may not support POSIX modes.
    }
    return AGE_KEY;
  } finally {
    rmSync(temporaryPassphrase, { force: true });
    rmSync(temporaryKey, { force: true });
  }
}

function decryptEnv() {
  if (!existsSync(SOPS_FILE)) {
    throw new Error('.env.sops is missing. It is the encrypted environment committed to Git.');
  }

  const force = process.argv.includes('--force');
  if (existsSync(ENV_FILE) && !force) {
    console.log('.env already exists. Nothing to decrypt. Use --force to replace it.');
    return;
  }

  const key = ensureAgeKey();
  const decrypted = run(
    SOPS_BIN,
    ['--decrypt', '--input-type', 'dotenv', '--output-type', 'dotenv', '.env.sops'],
    { env: { ...process.env, SOPS_AGE_KEY_FILE: key } },
  );

  if (!decrypted.trim()) throw new Error('SOPS returned an empty environment.');
  if (!decrypted.includes('PUBLIC_ANALYTICS_ENABLED=')) {
    throw new Error('The decrypted environment is missing expected keys.');
  }

  const temporaryEnv = path.join(ROOT, `.env.tmp-${process.pid}`);
  writeFileSync(temporaryEnv, decrypted, { mode: 0o600 });
  renameSync(temporaryEnv, ENV_FILE);
  try {
    chmodSync(ENV_FILE, 0o600);
  } catch {
    // Windows may not support POSIX modes.
  }
  console.log('Decrypted .env.sops to .env locally. Values were not printed.');
}

function encryptEnv() {
  if (!existsSync(ENV_FILE)) {
    throw new Error('.env is missing. Decrypt .env.sops or create a local .env first.');
  }
  const recipient = readPublicKey();
  const encrypted = run(
    SOPS_BIN,
    [
      '--encrypt',
      '--age',
      recipient,
      '--input-type',
      'dotenv',
      '--output-type',
      'dotenv',
      '.env',
    ],
  );
  if (!encrypted.includes('sops_mac=')) {
    throw new Error('SOPS did not return a complete encrypted file.');
  }
  const temporarySops = path.join(ROOT, `.env.sops.tmp-${process.pid}`);
  writeFileSync(temporarySops, encrypted);
  renameSync(temporarySops, SOPS_FILE);
  console.log(
    'Encrypted .env to .env.sops. Review and commit .env.sops only; never commit .env or .secrets/.',
  );
}

try {
  if (process.argv.includes('--encrypt')) encryptEnv();
  else decryptEnv();
} catch (error) {
  fail(error.message);
}
