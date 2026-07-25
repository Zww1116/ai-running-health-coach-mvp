---
title: ADR 0003 Replaceable AI Providers
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# ADR-0003: Replaceable AI Providers

## Status

Proposed.

## Background

The product should not depend on a single AI platform, model or private GPT instruction set.

## Decision

ChatGPT, Claude, Gemini, local models and rule engines are replaceable providers. Core prompts, agents, schemas and knowledge must be stored independently from provider-specific tools.

## Reasons

Provider portability protects the project from pricing, policy, availability and capability changes.

## Alternatives

Put core logic inside one private GPT or one hosted AI API. This is rejected because it creates lock-in.

## Positive Impact

Easier migration, easier testing and clearer intellectual ownership.

## Negative Impact

Provider adapters require extra discipline and versioning.

## Risks

Adapters may drift if prompts are copied and edited separately.

## Review Conditions

Review when the first real external AI provider is connected.
