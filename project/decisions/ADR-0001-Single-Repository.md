---
title: ADR 0001 Single Repository
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# ADR-0001: Single Repository

## Status

Proposed.

## Background

The project combines application code, product documents, architecture notes, schemas, prompts and governance records.

## Decision

Use one main GitHub repository for the current stage. Do not split into multiple repositories yet. Manage assets through clear directories.

## Reasons

One repository keeps the early project easy to understand, deploy and review.

## Alternatives

Multiple repositories for app, docs and prompts. This was rejected for now because it adds coordination overhead.

## Positive Impact

Simple history, simple deployment and easier onboarding for a new AI or human contributor.

## Negative Impact

Public repository visibility can expose more product thinking if the repository remains public.

## Risks

Poor file rules could turn one repository into a dumping ground.

## Review Conditions

Review when product scope, permissions or team size grows substantially.
