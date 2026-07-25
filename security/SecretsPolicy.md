---
title: Secrets Policy
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Secrets Policy

- Frontend code must never contain Supabase `service_role` keys.
- API secrets must not use a `VITE_` prefix because Vite exposes those values to the browser bundle.
- `.env` files must not be committed.
- GitHub Actions must use encrypted Secrets for deploy-time values.
- If a secret leaks, revoke and rotate it immediately.
- Removing a secret from the current file does not make Git history safe.
