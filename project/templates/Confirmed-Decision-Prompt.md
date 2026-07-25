---
title: Confirmed Decision Prompt
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: founder
source_of_truth: true
---

# Confirmed Decision Prompt

Use this prompt when the founder confirms a brand, product, architecture or agent decision in any AI conversation:

```text
Please write this confirmed decision into the repository.

Requirements:
1. Find the single formal source from project/SourceOfTruth.md.
2. Do not maintain the same conclusion in multiple files.
3. Update the corresponding formal source.
4. If this is a major decision, create or update an ADR.
5. Update project/CurrentStatus.md if current state changes.
6. Update related version or changelog information.
7. Mark the document status correctly.
8. Record the source and confirmation date.
9. Do not paste the full chat transcript into Git.
10. Output the modified file list.
```
