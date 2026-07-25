---
title: Confirmed Decision Prompt
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: founder
source_of_truth: true
---

# 已确认决策 Prompt

当创始人在任意 AI 对话中确认品牌、产品、架构或 Agent 决策时，使用以下 Prompt：

```text
请将这项已确认决策写入仓库。

要求：
1. 根据 project/SourceOfTruth.md 找到唯一正式来源。
2. 不要在多个文件中重复维护同一结论。
3. 更新对应的正式来源。
4. 如果这是重大决策，创建或更新 ADR。
5. 如果当前状态发生变化，更新 project/CurrentStatus.md。
6. 更新相关版本或 Changelog 信息。
7. 正确标记文档状态。
8. 记录来源和确认日期。
9. 不要把完整聊天记录粘贴到 Git。
10. 输出修改文件清单。
```
