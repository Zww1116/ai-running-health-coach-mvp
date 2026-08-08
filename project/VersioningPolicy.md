---
title: Versioning Policy
status: approved
version: 0.1.1
last_updated: 2026-08-08
owner: engineering
source_of_truth: true
---

# 版本策略

项目基础文件从 `0.1.0` 开始。Schema、Prompt 和 Agent 版本独立演进，因为它们的变化速度可能不同。

Patch 版本用于措辞、澄清和非破坏性补充；Minor 版本用于新增字段、Agent 规则或 Prompt 章节；Major 版本用于不兼容的 Schema 或工作流变更。

生成的导出文件不是正式来源。导出文件必须记录生成时所使用的来源版本。
