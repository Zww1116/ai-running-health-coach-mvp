---
title: Restore Test
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Restore Test

1. Copy `AI-Core-Pack` into an empty directory.
2. Verify `FILE_INDEX.md`.
3. Verify `CHECKSUMS.txt`.
4. Verify `VERSION.json`.
5. Upload `AI_CONTEXT_COMPLETE.md` to a new AI session with no old chat history.
6. Use `NEW_AI_BOOTSTRAP_PROMPT.md`.
7. Check whether the new AI understands the project.
8. Do not use old chat to fill gaps.
9. Record missing items, conflicts and misunderstandings.
10. If restore fails, fix the formal source files.
