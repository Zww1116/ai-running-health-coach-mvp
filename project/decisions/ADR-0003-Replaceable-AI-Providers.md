---
title: ADR 0003 Replaceable AI Providers
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# ADR-0003：可替换的 AI 提供商

## 状态

`Proposed`。

## 背景

产品不应依赖单一 AI 平台、模型或私有 GPT 指令集。

## 决策

ChatGPT、Claude、Gemini、本地模型和规则引擎都是可替换的提供商。核心 Prompt、Agent、Schema 和知识必须独立于提供商专用工具保存。

## 理由

提供商可迁移性能够保护项目，使其不被价格、政策、可用性和能力变化锁定。

## 备选方案

将核心逻辑放入单个私有 GPT 或单个托管 AI API。该方案被否决，因为它会造成供应商锁定。

## 正面影响

更容易迁移和测试，知识产权归属也更清晰。

## 负面影响

提供商适配器需要额外的纪律和版本管理。

## 风险

如果 Prompt 被分别复制和编辑，适配器可能逐渐偏离共同来源。

## 复审条件

连接第一个真实外部 AI 提供商时复审。
