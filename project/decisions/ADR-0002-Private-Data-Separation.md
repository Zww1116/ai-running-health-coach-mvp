---
title: ADR 0002 Private Data Separation
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# ADR-0002: Private Data Separation

## Status

Proposed.

## Background

The app handles sensitive health records, images and future AI analysis packets.

## Decision

Project code and documents can enter Git. Private health data must not enter Git. Local records, private databases and backup packs must remain separate from project assets.

## Reasons

Git history is not a safe place for personal health data because deletion from the latest file does not remove history.

## Alternatives

Store sample-like personal records in the repo. This is rejected because it creates unnecessary privacy risk.

## Positive Impact

Lower leakage risk and clearer ownership boundaries.

## Negative Impact

Developers need demo personas and fixtures instead of real records.

## Risks

Accidental screenshots, exports or logs can still be committed without checks.

## Review Conditions

Review when encrypted backups or private cloud sync are implemented.
