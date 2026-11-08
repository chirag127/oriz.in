---
title: "Programming Languages: The Complete Guide"
description: Type systems, language trade-offs, idiomatic code, and the patterns that survive beyond a single framework.
updated: 2026-10-30
heroImage: /images/articles/typescript-type-system.jpg
heroImageAlt: Editorial illustration of a cream staircase with orange and charcoal blocks forming a precise sequence.
keyQuestions:
  - question: What does TypeScript erase at runtime?
    answer: Types, interfaces and type annotations disappear. Runtime checks, schema validation and authorization must be implemented separately.
  - question: When should a branded type be used?
    answer: When two values share a primitive representation but must not be mixed, such as rupees and paise. The brand is a compile-time aid, not runtime validation.
startHere: &a1
  - typescript-type-system
faq:
  - question: Does strict mode catch every bug?
    answer: No. It catches more than the default, but runtime data, logic and authorization still need tests and validation.
  - question: Why use `unknown` instead of `any`?
    answer: "`unknown` forces a check before use; `any` disables checking and spreads through the code."
tools: []
featuredArticles: *a1
---


Type systems, language trade-offs, idiomatic code, and the patterns that survive beyond a single framework.

Types and language rules are a way to make some classes of bug impossible before the code runs.

## How to read this category

Start with **The TypeScript Type System, Explained Through a Payments Workflow**. The articles are ordered as a sequence, but each one stands alone if you arrived with a specific question.

## What this guide covers

The category currently contains 1 article across 1 series. The complete article index appears below this guide, followed by any tools that support the same work.

## How to use it

Read the guide first for the map, then use the article index to go deeper. Where a calculator is available, run your own numbers rather than accepting an illustrative result. Where a rule or rate is involved, verify the current version before acting.
