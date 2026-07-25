---
title: Data Classification
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Data Classification

## Level 0: Public Project Assets

Examples: brand ideas, code, general schemas and general agents. Allowed in Git. AI sharing is allowed after normal review.

## Level 1: Private Configuration

Examples: long-term goals, preferences and training strategy. Store in browser or private database. Do not commit. AI sharing requires user confirmation.

## Level 2: Sensitive Health Data

Examples: sleep, weight, cycle, pain, health images and medical information. Store in browser, user private database or encrypted backup. Never commit. AI sharing requires minimization and explicit confirmation.

## Level 3: Secrets and Authentication

Examples: API keys, service-role keys, access tokens and private keys. Store only in environment variables or secret managers. Never commit and never send to AI.

## Handling Matrix

| Level | Allowed Storage | Forbidden Storage | AI Sharing | Confirmation | Export | Delete | Backup | Logging |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | Git, docs | None specific | Allowed | Normal review | Git/export | Git history rules | Git | Public logs ok |
| 1 | Browser, private DB | Git | Minimal only | Required | User export | User action | Private backup | No raw logs |
| 2 | Browser, private DB, encrypted backup | Git, public logs | Minimized only | Required | User export | User action | Encrypted preferred | No raw logs |
| 3 | Secret manager, env vars | Git, frontend, logs | Never | Not applicable | Never | Rotate/revoke | Secret manager | Never log |
