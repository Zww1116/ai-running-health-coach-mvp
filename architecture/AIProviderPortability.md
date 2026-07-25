---
title: AI Provider Portability
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# AI Provider Portability

Future provider adapters should expose the same conceptual interface:

```js
analyzeHealthData(analysisPacket)
```

Possible providers:

- `RuleBasedProvider`
- `OpenAIProvider`
- `AnthropicProvider`
- `GeminiProvider`
- `LocalModelProvider`

Core prompts, schemas, agent rules and health knowledge should stay provider-neutral. Platform directories should only adapt formatting and transport details.

This sprint does not implement real providers.
