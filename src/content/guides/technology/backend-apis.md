---
title: "Backend & APIs: The Complete Guide"
description: API design, authentication, authorization, reliability, timeouts, retries, queues, and honest HTTP semantics for small teams.
updated: 2026-10-30
heroImage: /images/articles/secure-api-design.jpg
heroImageAlt: "Editorial illustration of a cream doorway with an orange keyed mechanism and charcoal walls."
keyQuestions:
  - question: "What is the difference between authentication and authorization?"
    answer: "Authentication establishes who is calling. Authorization decides whether that actor may perform this action on this specific object. The second check must run on every protected request, not only at login."
  - question: "How should an API represent failure?"
    answer: "Use the HTTP status semantics honestly: 400 for malformed input, 401 for missing or invalid credentials, 403 for a denied action, 404 for a missing or deliberately hidden resource, 409 for a state or idempotency conflict, 429 for rate limiting and 5xx for server-side failures. Include a request ID and a stable error code."
  - question: "Are retries safe?"
    answer: "Only when the operation is idempotent or carries an idempotency key, and only with a bounded, jittered backoff. Retrying a non-idempotent write can duplicate a charge or a refund."
  - question: "How do I make a money-changing write idempotent?"
    answer: "Give the client an idempotency key, enforce uniqueness in the database, store the request fingerprint and the final response, and return the stored response for a replay. A different body with the same key is a conflict."
  - question: "How much observability does a small API need?"
    answer: "Structured logs with request IDs, metrics for rate/errors/latency/saturation, queue depth and age, and a small number of traces for the most important journeys. Alert on user-facing symptoms, not every CPU spike."
startHere:
  - http-status-codes
  - secure-api-design
  - backend-reliability-budget
faq:
  - question: "Should a JWT be stored in localStorage?"
    answer: "Any token readable by JavaScript can be stolen through XSS. For browser clients, an HttpOnly, Secure cookie with CSRF protection is often safer. The right choice depends on the client and threat model."
  - question: "What status code should a validation error use?"
    answer: "422 is a common choice when the syntax is valid but the fields are semantically invalid. 400 is also defensible for malformed input. Pick one contract and document it."
  - question: "How do I prevent one tenant seeing another tenant's data?"
    answer: "Put the tenant condition in the database query, not only in a route guard, and test wrong-tenant access for every sensitive endpoint. Add defence-in-depth checks, but do not rely on them as the only boundary."
  - question: "When should I use a queue?"
    answer: "When work can complete asynchronously and the user does not need the result immediately. The consumer must be idempotent, the queue must have a dead-letter owner, and queue depth and age need alerts."
tools:
  - jwt-decoder
  - http-status-reference
featuredArticles:
  - http-status-codes
  - secure-api-design
  - backend-reliability-budget
---

An API is a contract about identity, failure and state. The happy path is the easy part. The expensive bugs usually live in the boundaries: a token that was decoded but not verified, a query that forgot the tenant, a retry that duplicated a refund, or a timeout that left the client unsure whether the write happened.

This guide collects the ORIZ.IN backend material into one operating model for a small team. It is deliberately practical: fewer moving parts, explicit failure modes, and checks that can be tested.

## Identity and authorization

Start with authentication. A session or a short-lived token establishes the actor. For JWTs, verify the signature, algorithm, issuer, audience and time claims; never trust the token's chosen algorithm or a role claim the client can edit. The [secure API guide](/technology/backend-apis/secure-api-design/) covers the verification checklist, refresh-token rotation and the difference between a signed token and an encrypted one. The [JWT decoder](/tools/jwt-decoder/) is for inspection only; verification happens on the server.

Authorization is the object-level question. A support agent may be allowed to issue refunds, but not for every merchant. Put the tenant and ownership predicate in the query, return a generic not-found response when the row is absent, and test the wrong-tenant case for every sensitive endpoint. The [secure API guide](/technology/backend-apis/secure-api-design/) includes an authorization test matrix.

## Honest HTTP

Use status codes as a contract, not decoration. The [HTTP status guide](/technology/backend-apis/http-status-codes/) explains the classes and the commonly confused pairs. The [status reference](/tools/http-status-reference/) is a quick lookup.

A useful error body has a stable code, a human message, field-level details where appropriate, and a request ID. It does not include a stack trace, a SQL fragment or an internal table name. Log the detail under the request ID; return the minimum the client needs.

## Deadlines, retries, and load

A timeout must be shorter than the caller's remaining patience. Propagate a deadline from the edge, give each dependency a share of the budget, and fail fast when the remaining time cannot support the work. A timeout is not cancellation: the remote service may still complete the write, so money-changing operations need idempotency.

Retry only transient, safe operations. Use exponential backoff with full jitter, cap the attempts, and add a retry budget so a failing dependency does not receive a flood of duplicate requests. Add a circuit breaker for persistent failures and measure the dependency rather than guessing thresholds. The [reliability budget guide](/technology/backend-apis/backend-reliability-budget/) works through the mechanics.

## State, queues, and idempotency

For writes, make the state transition conditional:

```sql
UPDATE payments
   SET status = 'refunded'
 WHERE id = $1 AND tenant_id = $2 AND status = 'captured'
RETURNING id, status;
```

If zero rows are returned, the transition did not happen. Report a conflict or the current state; do not assume success. For asynchronous work, use a transactional outbox so the business change and the event commit together, make the consumer idempotent with a unique event ID, and alert on queue depth and age. A dead-letter queue without an owner is a quiet data-loss mechanism.

## Observability and review

Log request IDs, actor IDs (or pseudonyms), route, status, latency and dependency timings. Do not log tokens, passwords, full card numbers, Aadhaar, PAN or complete request bodies. Metrics should cover rate, errors, duration percentiles, saturation, queue depth and cache hit ratio. Alerts should map to user pain and link to a runbook.

Before launch, test the unauthenticated case, wrong tenant, insufficient role, expired token, wrong audience, `alg: none`, replayed idempotency key with a different body, oversized payload and dependency timeout. The [reliability budget guide](/technology/backend-apis/backend-reliability-budget/) covers the rest of the operating model.

An API that fails honestly and refuses correctly is more trustworthy than one that succeeds on the demo path. Start with [HTTP status codes](/technology/backend-apis/http-status-codes/), then [secure API design](/technology/backend-apis/secure-api-design/), then the [reliability budget](/technology/backend-apis/backend-reliability-budget/).
