---
title: Current Status
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: founder
source_of_truth: true
---

# 当前状态

## 当前阶段

项目已有可运行的 MVP，当前正在完成下一轮产品功能开发前的项目治理、隐私保护与 AI 可迁移性基础工作。

## 在线网站

网站可在本地运行，也可部署到 GitHub Pages 或 Vercel。公网部署仅用于试用和审查；私人数据仍必须遵守既定隐私边界。

## 已实现功能概览

应用已支持健康记录、规则版多专家 Agent 分析、总教练方案、V2 数据中心、设置中心数据管理、本地图片存储、可选 Supabase 同步，以及 COROS 数据导入基础能力。

## 当前数据存储

默认模式将记录存入浏览器 `localStorage`，图片存入浏览器本地存储。Supabase 同步为可选功能，由用户主动选择。

## 当前隐私状态

GitHub 只应保存代码和项目资产。私人健康数据、截图、导出包、Secret 和数据库文件由政策、`.gitignore`、迁移排除规则及可重复隐私审计共同防护。

本次审查修正已补充：

- `migration/manifest.json` 中 `exclude` 的真实执行与临时敏感文件导出验证。
- 导出包完整索引与 SHA-256 校验。
- Git 跟踪文本文件的可重复隐私审计。
- JSON、JSON Schema、Markdown 本地链接和版本信息验证。

## 当前 Agent 状态

运行时规则 Agent 位于 `src/agents/`。跨平台 Agent 业务文档位于根目录 `agents/`，其状态仍以各正式文档的元数据为准。

## 当前限制

项目尚未提供生产级 AI 提供商集成、托管 OCR、完整加密备份或完整的提供商中立分析包（analysis packet）流程。

## 当前 Sprint

Sprint 001：项目基础、隐私保护与 AI 可迁移性。

## 下一步

完成 Sprint 001 的所有者审查并合并后，只选择一个下一 Sprint 开始开发。

## 当前风险

- 即使排除了私人数据，公开源代码仍可能暴露产品方向。
- 过于精确的演示数据可能看起来像真实个人资料，公开前仍需人工确认。
- 未来 AI 集成不得绕过用户确认和数据最小化原则。
- 二进制图片、未被 Git 跟踪的本地文件及外部服务数据不属于当前文本隐私审计范围。
