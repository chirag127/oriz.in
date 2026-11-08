---
title: "AI Engineering: The Complete Guide"
description: Retrieval-augmented generation, evaluation, grounding, citations, and the operational discipline behind useful AI systems.
updated: 2026-10-30
heroImage: /images/articles/rag-retrieval-augmented-generation.jpg
heroImageAlt: "Editorial illustration of paper records in a tray connected by fine threads to a scanning lens."
keyQuestions:
  - question: "What makes a RAG system reliable?"
    answer: "Retrieval quality, access control, evidence selection, citation and a clear refusal path. The model cannot ground an answer in a document it never received; retrieval is a product subsystem, not a prompt detail."
  - question: "How should an LLM application be evaluated?"
    answer: "Evaluate retrieval, answer quality, safety and operations separately. Use a golden set from real questions, an explicit rubric, human review and calibrated automated checks. A single end-to-end thumbs-up hides which layer failed."
  - question: "Can an LLM judge another LLM?"
    answer: "It can scale review, but it is a noisy measurement. Calibrate it against human labels, check agreement, and use it for triage rather than as the only definition of quality."
  - question: "What are the key security risks?"
    answer: "Prompt injection through retrieved content, data leakage across tenants, over-broad tool permissions, and citations that expose documents the user should not see. Access control must run before retrieval, and tool calls need authorization."
  - question: "How do I control cost?"
    answer: "Measure tokens and retrieval calls per request, cache where safe, cap context, route easy requests to smaller models, and track cost per successful task—not only cost per token. A cheaper model that fails more often is not cheaper."
startHere:
  - rag-retrieval-augmented-generation
  - evaluating-llm-applications
faq:
  - question: "Do I need a vector database?"
    answer: "Not always. For a small corpus, Postgres with pgvector or a keyword index may be enough. The retrieval strategy, chunking and access rules matter more than the brand of the index."
  - question: "How large should chunks be?"
    answer: "Large enough to contain a self-contained answer, small enough to retrieve precisely. Chunk by document structure and test recall; a fixed token count is a starting point, not a universal rule."
  - question: "Should the model answer when evidence is missing?"
    answer: "It should refuse, ask a clarifying question or escalate. A confident answer unsupported by retrieved evidence is a failure, even if it happens to be correct."
  - question: "What should be logged?"
    answer: "Request ID, model, prompt version, retrieval document IDs, latency, token counts, cost, outcome and a redacted trace. Do not log secrets or unnecessary personal data."
tools: []
featuredArticles:
  - rag-retrieval-augmented-generation
  - evaluating-llm-applications
---

A working AI product is a retrieval, evaluation and operations problem before it is a model problem. The demo answers a friendly question from a clean document. The production system has to find the right evidence, respect access rules, say when it does not know, cite the source, stay within latency and cost, and survive a corpus change.

This guide collects the ORIZ.IN AI engineering material into a practical sequence. It does not claim that a model is accurate or that a RAG architecture eliminates hallucination. It shows where the failure modes live and how to test them.

## Retrieval before generation

The [RAG guide](/ai-data/ai-engineering/rag-retrieval-augmented-generation/) treats retrieval as a product subsystem. The important decisions are:

- what documents or records belong in the corpus;
- how they are chunked and indexed;
- how a query is rewritten or expanded;
- how results are filtered by tenant, user and permission;
- how evidence is re-ranked and selected;
- how the answer cites the exact source.

A model cannot ground an answer in a document it never received. If the answer is wrong, inspect retrieval before rewriting the prompt. The [RAG guide](/ai-data/ai-engineering/rag-retrieval-augmented-generation/) includes a chunking table, an evaluation example and an access-control checklist.

## Evaluation is a set of experiments

The [LLM evaluation guide](/ai-data/ai-engineering/evaluating-llm-applications/) separates four layers: retrieval, answer quality, safety and operations. Build a golden set from real questions, label it against a rubric, and report uncertainty. A 32-of-40 pass rate is evidence, not certainty, and the confidence interval matters.

Use automated judges for scale, but calibrate them against human labels. Test multilingual queries, Hinglish, local entities and the refusal path. A system that answers everything confidently is not necessarily better than one that escalates appropriately.

## Grounding, citations and refusal

A citation is a promise that the answer is supported by the evidence shown. It should point to the exact passage, not only the document. If the evidence is missing, the system should refuse, ask for clarification or escalate. A refusal is a product outcome, not an error.

Prompt injection is a real risk when retrieved content can contain instructions. Treat retrieved text as untrusted data, separate it from system instructions, restrict tool permissions, and require authorization for consequential actions.

## Operations

Track latency, cost, error rate, retrieval hit rate, refusal rate and user feedback by request type. A model change is a release: evaluate it, canary it, and keep a rollback path. Cache only when the answer is safe to reuse; personalised or permission-sensitive answers should not be shared across users.

The [RAG guide](/ai-data/ai-engineering/rag-retrieval-augmented-generation/) covers the architecture and India-specific constraints; the [evaluation guide](/ai-data/ai-engineering/evaluating-llm-applications/) covers the measurement. Start with retrieval, define the evidence contract, then measure the answer layer. The model is one component in a system that has to be honest about what it knows.
