---
title: Data Flow
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# 数据流

目标流程如下：

```text
数据采集
-> 本地保存
-> 用户审阅
-> 选择分析数据包
-> 最小化与匿名化
-> 用户确认
-> 可替换的 AI 提供商
-> 标准化分析结果
-> 用户决定是否保存
```

本 Sprint 只设计该流程，不实现分析数据包确认，也不调用外部提供商。
