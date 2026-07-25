---
title: AI Data Sharing Policy
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# AI 数据共享策略

AI 提供商是可替换的数据处理方，不是项目或用户健康数据的所有者。

默认 AI 输入应排除姓名、邮箱、电话、地址、精确位置、密钥、完整病史和与任务无关的身份信息。

调用任何外部 AI 前，应用应展示分析数据包，说明每个字段的必要性，在可行时允许用户移除字段，并要求用户确认。
