---
title: Incident Response
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Incident Response

If private data or a secret is suspected to be committed:

1. Stop adding new commits that spread the data.
2. Identify file path, data type and exposure level.
3. For secrets, revoke and rotate immediately.
4. For health data, remove current file content and assess Git history exposure.
5. Decide whether history rewrite is needed with the repository owner.
6. Record the incident without copying the sensitive value.
7. Add prevention rules or tests.
