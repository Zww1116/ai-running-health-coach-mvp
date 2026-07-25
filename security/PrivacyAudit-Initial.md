---
title: Initial Privacy Audit
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Initial Privacy Audit

## Scope

Tracked text files and visible repository text were scanned, excluding `node_modules`, `dist`, `exports`, `backups`, binary dependencies and Git internals.

## High Risk

No high-confidence secret was found in the scanned text. No `service_role` key, private key header, bearer token, access token or known cloud API key pattern was found.

## Medium Risk

No hardcoded third-party upload endpoint requiring a secret was found. Supabase and local Ollama integration documentation is present and should remain configured through environment variables.

## Low Risk

The public demo persona in `README.md` and `src/data/sampleData.js` used a precise combination of height, weight, monthly mileage, strength frequency and health goals. It appears to be demo data, but it is close enough to a personal profile to merit generalization.

## Manual Review Required

- Confirm repository visibility and licensing separately.
- Re-scan before any public release or provider integration.
- Confirm any future screenshots or exports are not committed.

## Recommendations

- Keep `.env`, exports, backups, private profiles, database files and health backups ignored.
- Keep only fictional demo personas in Git.
- Use analysis packets rather than raw records for external AI.
