---
title: ADR 0004 Repository Visibility and Licensing
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: founder
source_of_truth: true
---

# ADR-0004: Repository Visibility and Licensing

## Status

Proposed.

## Background

The current deployment path may use a public GitHub repository, while the product may later need stronger source protection.

## Decision

Codex must not change repository visibility. Codex must not add an open-source license by itself. Brand, trademark, copyright and code licensing decisions remain with the founder.

## Reasons

Public source helps deployment and review but reveals code and product thinking. Private source protects code but may require deployment changes.

## Alternatives

Make the repository private now, or add a permissive license now. Both require founder decision.

## Positive Impact

Prevents accidental legal or visibility changes.

## Negative Impact

Licensing remains unresolved.

## Risks

If the repo is public and unlicensed, viewers can see source but reuse rights are unclear.

## Review Conditions

Review before broader public sharing, collaborators, commercialization or open-source release.
