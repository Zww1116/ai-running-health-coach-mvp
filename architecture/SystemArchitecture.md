---
title: System Architecture
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# 系统架构

系统划分为六个层次。

## 1. 项目治理层

包含文档、ADR、Sprint 记录、唯一正式来源规则和交接说明。

## 2. 品牌与产品资产层

包含品牌 DNA、产品方向、需求和路线图。这些属于项目资产，不是私人健康数据。

## 3. 应用代码层

包含 `src/` 和 `server/` 中的 React、Vite、Tailwind、运行时 Agent、存储适配器、导入适配器和本地服务工具。

## 4. 私人数据层

包含用户健康记录、图片、私人资料、备份和未来的私有数据库行。这些内容必须位于 Git 之外。

## 5. 数据契约层

`schemas/` 中 `draft` 状态的 JSON Schema 为记录、分析数据包、AI 输出和备份 Manifest 定义可迁移的数据结构。

## 6. 可替换 AI 提供商层

规则逻辑、OpenAI、Anthropic、Gemini 和本地模型都应置于各自的提供商适配器之后，同时保持共享的输入与输出契约。
