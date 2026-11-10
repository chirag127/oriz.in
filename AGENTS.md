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

## 📍 Where this project's documentation lives

Documentation is **single-sourced** in the umbrella workspace, not in this repository:

| What | Where |
|------|-------|
| This project's bundle | `c:\ws\docs\oriz.inundle.md` |
| Catalogue | `c:\ws\docs\oriz.in\index.md` |
| Article standard, diagram rendering, navigation shell | `c:\ws\docs\oriz.in\concepts\` |

There is no `okf/` folder here. One document, one file — nothing is copied. Verify with
`node c:\ws\scripts\check-okf.mjs`.

## Project conventions

- Node.js 22.23.4+; the repository currently uses Node 24.
- Astro 7 static output, React islands, TypeScript strict mode.
- Use Microsoft Edge for browser automation and QA. Never use Chrome for this project.
- Content lives in `src/content/library`; registries live in `src/data`; pure tool logic lives in `src/lib`.
- Keep secrets and personal visitor data out of Git.
- Do not change DNS, production hosting, or deployment configuration without explicit owner authorization.

## Article standard (mandatory for every new article)

These articles are the substance of the site. A thin article is a defect, not a
placeholder. Every new article must satisfy all of the following.

### Depth and level

- **Length: 1,800–3,000 words of prose** (excluding code, diagrams and tables).
- **Audience: advanced.** Assume the reader already knows the basics of the topic.
  Never explain what a database, index, replica, cache or TLS handshake *is in
  general*. Start where the introductory material ends and go straight to the
  mechanisms, tradeoffs, arithmetic and failure modes that practitioners get wrong.
- **Complete coverage of the topic**, not a summary of one angle. Where a topic has
  competing approaches, cover each and end with a decision table saying when each
  applies.
- Write in a direct technical register. No marketing language, no filler openings
  ("in today's fast-moving world"), and no word may be used decoratively.

### Required structural elements

Every article must include **all** of these:

| Element | Minimum | Notes |
| --- | --- | --- |
| Mermaid diagrams | 5 | Mix types: `flowchart`, `sequenceDiagram`, `stateDiagram-v2`, `erDiagram`, `mindmap`, `gantt`, `pie` |
| Tables | 4 | Real comparison/decision tables, never decorative |
| KaTeX formulas | 2 | Block math with `$$ … $$` |
| Code fences | As needed | Always language-tagged (`sql`, `ts`, `bash`, `yaml`) |
| `## Summary` | Required | 6–8 numbered takeaways, the last section |

- Diagrams must explain structure, sequence or decision flow. A diagram that only
  restates two sentences is padding and should be a table instead.
- Every table must let a reader choose between options or see a cost. A table of
  definitions belongs in prose.

### Frontmatter rules (enforced by `src/content.config.ts`, a strict zod schema)

- `title` 5–120 chars; `description` 50–240 chars; `tags` match `^[a-z0-9]+(-[a-z0-9]+)*$`, max 8.
- `pubDate` **must not be in the future** — a future date throws *"has a future publication date"* and 500s the page.
- The series directory must be registered in `src/data/taxonomy.ts` for that
  category, or the page 500s with *"references unknown series"*.
- No keys outside the schema. The schema is `.strict()`.
- Set `difficulty: advanced`, `reviewStatus: technical-review`, `license: CC BY 4.0`.

### Article URLs

An article's URL is `/<domain>/<category>/<id>/` where `id` is the filename with
its `NN-` prefix stripped. The series segment is **not** part of the URL. Deriving
the URL by hand includes the series and produces a 404 — use `articleUrl()` from
`src/lib/content.ts` or the rule above.

### Mermaid diagrams fail silently — always verify

A Mermaid syntax error does **not** fail the build. `src/lib/rehype-content.mjs`
emits the figure with a source-code fallback, and the client renderer replaces it
with "This diagram could not be rendered in your browser". A broken diagram ships
unnoticed unless it is checked. Two scripts exist for this:

```bash
node scripts/check-diagrams.mjs       # static lint: catches known-bad syntax
node scripts/check-diagrams-live.mjs  # browser sweep: asserts every figure has an <svg>
```

Run both before claiming an article is complete. The static linter is deliberately
narrow: `:` and `<br/>` are legal inside quoted labels and in `Note`/message text,
so it does not flag them.

Known parser hazards to avoid:

| Hazard | Breaks because | Fix |
| --- | --- | --- |
| `A->>B: BEGIN; UPDATE` | `;` is a statement separator | Replace with a comma or `then` |
| `A[text (note)]` | bare `(` opens a shape token | Quote the label: `A["text (note)"]` |
| Label ending in `end` | parsed as a block terminator | Quote it or reword |
| Odd number of `"` | unterminated label breaks the whole diagram | Balance the quotes |

Note that `[( ... )]` is the valid cylinder/database shape and is not a label.

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
