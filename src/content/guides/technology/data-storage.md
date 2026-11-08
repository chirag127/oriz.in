---
title: "Data & Storage: The Complete Guide"
description: SQL, JSON, data formats, validation, and the practical work of moving structured data between systems.
updated: 2026-10-30
heroImage: /og-default.png
heroImageAlt: Editorial illustration for the ORIZ.IN Data & Storage guide.
keyQuestions:
  - question: "JSON or YAML: which should I use?"
    answer: JSON is strict and widely supported; YAML is easier for configuration but has more syntax ambiguity. Choose based on the consumer and validate either format.
  - question: Why does SQL clause order differ from execution order?
    answer: A SQL query is written SELECT … FROM … WHERE, but the database logically evaluates FROM, WHERE, GROUP BY, HAVING, SELECT and ORDER BY. Reading it in execution order makes joins and filters clearer.
startHere: &a1
  - json-formatting-and-validation
  - reading-sql-queries
faq:
  - question: Is JSON valid YAML?
    answer: Most JSON is valid YAML, but YAML’s flexibility can create surprises. Do not assume a YAML parser accepts every JSON edge case without testing.
  - question: Should I store money as a float?
    answer: No. Use integer minor units or a decimal type. Binary floating point cannot represent every decimal amount exactly.
tools:
  - json-formatter
  - json-minifier
  - json-to-csv
  - csv-previewer
featuredArticles: *a1
---


SQL, JSON, data formats, validation, and the practical work of moving structured data between systems.

Data work is mostly decisions about shape, validation, and reconciliation; the query is the visible part.

## How to read this category

Start with **JSON Formatting and Validation: A Practical Field Guide**. Then continue with **Reading a SQL Query: Clauses, Joins, and Execution Order**. The articles are ordered as a sequence, but each one stands alone if you arrived with a specific question.

## What this guide covers

The category currently contains 2 articles across 1 series. The complete article index appears below this guide, followed by any tools that support the same work.

## How to use it

Read the guide first for the map, then use the article index to go deeper. Where a calculator is available, run your own numbers rather than accepting an illustrative result. Where a rule or rate is involved, verify the current version before acting.
