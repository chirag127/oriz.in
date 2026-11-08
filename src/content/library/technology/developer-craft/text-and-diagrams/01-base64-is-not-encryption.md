---
title: "Base64 Is Not Encryption: What It Is and When to Use It"
description: "A clear explanation of Base64 encoding, why it increases size, where it appears in real systems, and why it provides no confidentiality on its own."
pubDate: 2026-10-25
author: "Chirag Singhal"
type: explainer
tags: ["base64", "encoding", "security"]
difficulty: "beginner"
toc: true
related: ["json-formatting-and-validation", "http-status-codes"]
learningPaths: ["practical-web-foundation"]
references:
  - title: "RFC 4648: The Base16, Base32, and Base64 Data Encodings"
    url: "https://www.rfc-editor.org/rfc/rfc4648.html"
  - title: "MDN: Base64"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Base64"
  - title: "OWASP: Cryptographic Storage Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html"
---

Base64 is one of the most useful and most misunderstood encodings on the web. It regularly appears in data URLs, authentication headers, JSON Web Tokens, email attachments, and configuration files. It is also regularly described as if it protected data. It does not.

## What Base64 does

Base64 converts binary data into text using 64 printable characters. Three input bytes become four output characters. A padding character makes the output length a multiple of four.

The encoding alphabet is usually:

```text
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
```

That alphabet is safe inside many text-based formats where raw binary bytes would break framing or escaping rules. Encoding "Hi" produces `SGk=`. Anyone who knows Base64 can decode it immediately. There is no key involved.

> Base64 is a transport encoding. It changes representation, not knowledge. If someone can read the encoded value, assume they can read the decoded value.

## Why the size grows

Four characters carry the equivalent of three original bytes. The encoded representation is therefore about 4/3 of the original size, plus padding. Data doesn't shrink; it grows by roughly 33 percent.

That overhead is often acceptable for small payloads. It becomes important when a service stores large files as Base64 inside JSON. You pay again in every copy, log, and cache. For large binary assets, upload the bytes directly and store a reference.

## Where it appears, and why

### Data URLs

A small image or font can be included in CSS or HTML as a data URL:

```text
data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
```

This avoids an extra request but increases document size and can defeat caching when used for large assets. Small, inlined icons may benefit. A hero image usually should remain a separate file.

### HTTP authentication

The Basic authentication scheme places a username and password into an Authorization header. The credentials are Base64-encoded, not encrypted. TLS protects the connection; the header itself is trivially decodable:

```text
Authorization: Basic dXNlcjpwYXNzd29yZA==
```

That is why Basic authentication must only be used over HTTPS, and why credentials belong in a credential manager rather than in a shared URL.

### JSON Web Tokens

A JWT has three Base64url-encoded parts: header, payload, and signature. The signature protects integrity when verified correctly. The header and payload are readable by anyone holding the token. Never put secrets or unnecessary personal information in a JWT payload.

### Binary fields in text protocols

Email, XML, and some APIs need to carry binary content through channels designed for text. Base64 is one established way to do that.

## URL-safe Base64

Standard Base64 uses `+` and `/`, which have meanings in URLs and form data. Base64url replaces them with `-` and `_`, and often removes padding. You will see it in JWTs and URL parameters.

If you decode a value that starts with `eyJ`, you are probably looking at a Base64url-encoded JSON object with the `{"` prefix. It is still not a secret.

## Decoding can fail, and should

Not every string that looks like Base64 is valid. Common failure modes include:

- characters outside the alphabet
- a length that cannot be padded to a multiple of four
- whitespace in the middle, depending on the decoder
- bytes that decode successfully but are not valid UTF-8 text

The [Base64 tool](/tools/base64-encoder/) supports standard and URL-safe output and reports malformed input rather than silently guessing. That is useful when a value was copied from a URL with different escaping rules.

## How Base64 relates to hashing and encryption

These three concepts solve different problems:

| Operation | Reversible? | Needs a key? | Purpose |
| --- | --- | --- | --- |
| Base64 | Yes | No | Represent binary data as text |
| Hash | No, not practically | Usually no | Verify integrity or derive an identifier |
| Encryption | Yes, with the right key | Yes | Provide confidentiality |

A password hashed with a weak algorithm is not fixed by Base64-encoding the hash. A secret Base64-encoded in a client bundle is still public. The labels matter because they change what threat model you have actually addressed.

Use the [hash calculator](/tools/hash-calculator/) when you need a digest for an integrity check. Use a vetted library and current guidance when you need password hashing or encryption; short educational demonstrations are not a substitute.

## A reasonable rule of thumb

Use Base64 when you need to carry arbitrary bytes through a text-only channel. Use a URL-safe variant when the result must fit into a URL component. Do not use it to protect data, compress data, or obscure an API key.

If you remember one sentence, remember this: Base64 changes how data travels, never who can read it.
