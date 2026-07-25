---
title: File Management Rules
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# File Management Rules

1. Each asset type has one formal source.
2. Do not put temporary documents in the repository root.
3. Avoid names such as final, latest, final2, new, copy or temporary.
4. Use stable and clear English file names.
5. Use Chinese as the main body language when appropriate for the founder.
6. Every sprint has an independent record.
7. Major decisions use ADRs.
8. Invalid files move to `archive/`.
9. Record replacement before deleting a file.
10. README does not duplicate detailed rules.
11. Health data must not enter Git.
12. Private exports must not enter Git.
13. Schema changes must bump schema version.
14. Prompt changes must record prompt version.
15. Agent-rule changes must record agent version.
16. AI chat is not a formal conclusion.
17. Only founder confirmation can move proposed content to approved.
