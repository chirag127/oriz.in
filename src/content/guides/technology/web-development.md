---
title: "Web Development: The Complete Guide"
description: The standards, static-site patterns, and browser behaviour that keep the web open and understandable.
updated: 2026-10-30
heroImage: /og-default.png
heroImageAlt: Editorial illustration for the ORIZ.IN Web Development guide.
keyQuestions:
  - question: What is a static JSON API?
    answer: A JSON file served with the right headers and refreshed by a build or workflow. It can be cheap and reliable for read-only data, but it has no server-side authorization or writes.
  - question: Why do cache headers matter?
    answer: They decide whether a browser or CDN reuses a response. A wrong cache policy can serve stale authenticated data or waste bandwidth on unchanging assets.
startHere: &a1
  - static-json-apis-on-github-pages
faq:
  - question: Is a static site secure by default?
    answer: It has a smaller server surface, but client-side code, third-party scripts, secrets in public files and unsafe HTML still create risk.
  - question: When should I add a backend?
    answer: When the product needs authenticated writes, server-side secrets, transactional state or authorization that cannot be enforced in the browser.
tools:
  - mime-reference
  - html-playground
featuredArticles: *a1
---


The standards, static-site patterns, and browser behaviour that keep the web open and understandable.

The web is a set of protocols and files; understanding the layer underneath the framework makes debugging cheaper.

## How to read this category

Start with **A Zero-Cost Pattern for Static JSON APIs on GitHub Pages**. The articles are ordered as a sequence, but each one stands alone if you arrived with a specific question.

## What this guide covers

The category currently contains 1 article across 1 series. The complete article index appears below this guide, followed by any tools that support the same work.

## How to use it

Read the guide first for the map, then use the article index to go deeper. Where a calculator is available, run your own numbers rather than accepting an illustrative result. Where a rule or rate is involved, verify the current version before acting.
