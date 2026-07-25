---
title: Data Flow
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# Data Flow

The target flow is:

```text
Data collection
-> local save
-> user review
-> analysis packet selection
-> minimization and anonymization
-> user confirmation
-> replaceable AI provider
-> standardized analysis result
-> user decides whether to save
```

This sprint designs the flow only. It does not implement analysis-packet confirmation or external provider calls.
