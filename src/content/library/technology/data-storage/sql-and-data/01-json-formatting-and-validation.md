---
title: "JSON Formatting and Validation: A Practical Field Guide"
description: "Understand strict JSON, diagnose the syntax errors that break parsers, and use formatting, validation, and schema checks without confusing JSON with JavaScript."
pubDate: 2026-10-25
author: "Chirag Singhal"
type: guide
tags: ["json", "validation", "formatting"]
difficulty: "beginner"
toc: true
related: ["base64-is-not-encryption", "http-status-codes", "static-json-apis-on-github-pages"]
learningPaths: ["practical-web-foundation"]
references:
  - title: "RFC 8259: The JavaScript Object Notation Data Interchange Format"
    url: "https://www.rfc-editor.org/rfc/rfc8259.html"
  - title: "MDN: JSON"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON"
  - title: "JSON Schema"
    url: "https://json-schema.org/"
---

JSON looks simple until a parser rejects a file that seems perfectly readable. Most failures come from a small set of strict rules. Learning those rules makes errors faster to find and helps you decide when formatting is cosmetic and when validation is doing real work.

## JSON is a data format, not JavaScript source

The name comes from JavaScript, but strict JSON allows only a narrow subset of JavaScript values:

- objects with double-quoted string keys
- arrays
- double-quoted strings
- numbers written in decimal notation
- `true`, `false`, and `null`

Comments, trailing commas, single quotes, unquoted keys, `undefined`, functions, and `NaN` are not valid JSON. A file containing any of them is not "almost valid"; it is invalid and a strict parser should say so.

```json
{
  "name": "ORIZ.IN",
  "tools": 50,
  "privacyFirst": true,
  "tags": ["tools", "reference"],
  "maintainer": null
}
```

This distinction matters because many people test JSON in a JavaScript console. JavaScript object literals are more permissive than JSON. A value that works there can still fail in a Python service, a database import, or an API gateway.

## The errors worth recognising

### Unexpected end of input

A document that ends too early usually has an unclosed brace, bracket, or quote. In a large file, the reported position may be at the end even though the missing character is much earlier. Use an editor with bracket matching, or format the document to make the structure visible.

### Expected property name or '}'

This often means a trailing comma before a closing brace:

```text
{
  "a": 1,
}
```

It can also mean an unquoted key. JSON requires property names to be strings in double quotes.

### Bad control character in string literal

A literal newline inside a string is not allowed. Escape it as `\n` or convert the value to an array of strings. Tabs must be escaped too. Raw line breaks inside JSON strings are a common problem when people construct payloads by hand.

### Unexpected token

This is a broad parser message. Look at the reported offset, then inspect the preceding character. Common causes are a missing comma between members, an extra comma, or a value that is not legal JSON.

## Formatting is not validation

Pretty-printing adds indentation and line breaks so humans can read structure. Minifying removes whitespace so a document takes fewer bytes. Neither changes the data model, and neither proves that the document satisfies your application's requirements.

A valid JSON document can still be useless:

```json
{ "name": 42, "email": null }
```

If your application expects a string name and a non-null email, this is a schema failure, not a syntax failure. That is why serious APIs combine:

1. A JSON parser for syntax.
2. A schema or explicit validation layer for shape and constraints.
3. Application checks for business rules that a schema cannot express.

JSON Schema is one way to describe the expected shape. A schema can require properties, restrict string lengths, define enum values, and reject additional keys. It cannot decide whether an order is fraudulent or whether a date is meaningful in your domain.

## Indentation, ordering, and diffs

There is no semantically meaningful property order in JSON. Two objects with the same members in different orders are equivalent as data. That does not mean order never matters operationally. Stable key ordering produces cleaner diffs in Git, and some signing schemes depend on a canonical serialisation.

If you commit JSON to a repository:

- use an explicit indentation style
- sort keys when that makes reviews easier
- keep generated files out of manual review noise when possible
- validate before writing

Minifying is appropriate for transport or build output, but a minified configuration file is harder to review. Use the representation that suits the reader of that particular file.

## Large documents and browser limits

Parsing JSON in a browser means allocating memory for the entire object tree. A 200 MB document may freeze a tab long before it becomes a useful user experience. For large data, prefer streaming formats such as newline-delimited JSON or pagination. For a one-off inspection, a local command-line tool may be the right choice.

The [JSON formatter](/tools/json-formatter/) formats and validates input locally; the [minifier](/tools/json-minifier/) shows how much whitespace you can remove. Both parse with the browser's strict JSON parser, so they will reject the same syntax a production service rejects.

## A practical validation routine

When a JSON payload fails:

1. Paste it into a formatter and read the reported line and column.
2. Inspect the character immediately before the reported position.
3. Check for trailing commas and unquoted keys.
4. Confirm that strings use double quotes and escape newlines.
5. Once syntax passes, validate against the expected schema.
6. Only then investigate business rules.

The order matters. Searching for a missing field is wasted effort if the parser cannot read the document at all.

> A quoted string can represent an innocent message or a malicious payload. Valid JSON says nothing about trustworthiness. Validate the schema and treat untrusted values as untrusted values.

## Security notes

Use a real JSON parser. Do not evaluate JSON as JavaScript, and do not build objects by concatenating strings. When a payload comes from an untrusted source, enforce size limits before parsing and apply authorization after parsing. Prototype-related pitfalls in JavaScript ecosystems deserve care when merging parsed objects into shared state.

JSON is a deliberately small format. Its strictness is a feature: if a document parses, both sides agree on the grammar. Your job is to decide what the values are allowed to mean.
