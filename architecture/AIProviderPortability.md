---
title: AI Provider Portability
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# AI 提供商可迁移性

未来的提供商适配器应暴露同一概念接口：

```js
analyzeHealthData(analysisPacket)
```

可选提供商：

- `RuleBasedProvider`
- `OpenAIProvider`
- `AnthropicProvider`
- `GeminiProvider`
- `LocalModelProvider`

核心 Prompt、Schema、Agent 规则和健康知识应保持与提供商无关。平台目录只负责适配格式和传输细节。

本 Sprint 不实现真实提供商。
