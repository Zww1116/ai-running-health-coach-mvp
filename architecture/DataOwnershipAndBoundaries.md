---
title: Data Ownership and Boundaries
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Data Ownership and Boundaries

## GitHub May Store

- Code.
- Brand concepts.
- Product documents.
- Architecture.
- General agent rules.
- General prompts.
- General health knowledge.
- Schemas.
- Tests.
- Project decisions.

## GitHub Must Not Store

- Real personal health profiles.
- Daily health records.
- Cycle records.
- Pain records.
- Medical files.
- Health photos.
- Email verification codes.
- API keys.
- Supabase `service_role` keys.
- Access tokens.
- Private data export packs.
- Database files.
- Unsanitized logs.

The user owns health data. Cloud sync must be a user-selected capability, not a hidden default.
