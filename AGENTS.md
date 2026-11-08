# ORIZ.IN agent instructions

These instructions are for AI coding agents and maintainers working in this repository. Follow them in addition to the user's current request and the project README.

## Environment and secrets

The repository is public. Never put a credential, API key, private age key, or decryption passphrase in a tracked file, commit, pull request, chat message, or build log.

The local environment is stored in `.env` (gitignored). A SOPS+age-encrypted copy is stored in `.env.sops` and is safe to commit. The age private key is kept outside Git in `.secrets/`; a password-protected backup lives at `.secrets/age.key.gpg`. The owner-supplied passphrase is stored locally in `.secrets/env.passphrase`, which is also gitignored. Do not reproduce the passphrase in this file, even though the owner has used it locally; doing so would make the encryption pointless in a public repository.

### If `.env` is missing

Run:

```bash
node scripts/env-secrets.mjs
```

The script:

1. Leaves an existing `.env` untouched unless `--force` is passed.
2. Uses `SOPS_AGE_KEY_FILE` if configured.
3. Otherwise uses `.secrets/age.key`.
4. If the age key is missing, restores it from the password-protected `.secrets/age.key.gpg` using `SOPS_ENV_PASSPHRASE` or the local `.secrets/env.passphrase` file.
5. Decrypts `.env.sops` with SOPS using dotenv input/output types.
6. Writes `.env` locally without printing its values.

If `.env.sops`, `.secrets/age.key.gpg`, and an age key are all unavailable, stop and report the missing secret material. Do not invent credentials, overwrite `.env.sops`, or commit a replacement key.

### After changing environment values

```bash
node scripts/env-secrets.mjs --encrypt
```

Then update `.env.example` if the public template changed, review `.env.sops`, and commit only `.env.sops` and `.env.example`. Never commit `.env`, `.secrets/`, or `.env.pass`.

### Why SOPS+age rather than a password-only file

SOPS's age backend is key-based; it does not support a raw passphrase as the decryption credential. The supplied passphrase protects the local age-key backup with GPG symmetric encryption (AES-256), and SOPS+age encrypts the environment. The age private key itself is never committed. On another machine, copy the protected key backup (or the age key) through a secure channel and make the same passphrase available locally in `.secrets/env.passphrase` or `SOPS_ENV_PASSPHRASE`. A fresh clone alone cannot decrypt the environment, by design.

Do not print `.env` contents. Do not paste decrypted values into commits, issue comments, screenshots, or terminal output. If a secret may have leaked, flag it and recommend rotation of the affected credential.

## Project conventions

- Node.js 22.23.4+; the repository currently uses Node 24.
- Astro 7 static output, React islands, TypeScript strict mode.
- Use Microsoft Edge for browser automation and QA. Never use Chrome for this project.
- Content lives in `src/content/articles`; registries live in `src/data`; pure tool logic lives in `src/lib`.
- Keep secrets and personal visitor data out of Git.
- Do not change DNS, production hosting, or deployment configuration without explicit owner authorization.

## Verification before reporting completion

```bash
npm run check
npm test
npm run build
```

For browser verification:

```bash
npm run test:browser
npm run test:csp
```

The browser checks are headless Edge and require the local Edge installation (or `EDGE_PATH`). They may write reports and screenshots to `.scratch/`, which is gitignored. The production build writes `dist/build-report.json`.

If a test fails, fix the underlying issue rather than weakening the check. Do not claim deployment, Google indexing, or AdSense approval unless it has actually been verified.
