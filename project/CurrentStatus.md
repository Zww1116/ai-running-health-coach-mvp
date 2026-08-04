---
title: Current Status
status: draft
version: 0.2.1
last_updated: 2026-08-05
owner: founder
source_of_truth: true
---

# 当前状态

## Foundation 状态

Sprint 001：Governance + Privacy + AI Portability Foundation。

当前治理状态为 `Draft / Review`。Sprint 001 的初始资产曾通过 PR #1 进入 `main`，但这只表示 Git 交付历史，不表示 Foundation 已完成治理审批。本次 Review Fix 尚未合并至 `main`。

本文件是当前项目阶段、当前 Sprint 和下一步的唯一正式来源。其他入口、Sprint、ADR、Roadmap、Backlog 与迁移文件只能引用本文件，不得独立维护不同的当前状态。

## 当前阶段

项目已有可运行的 MVP。当前优先完成 Sprint 001 Review Fix，解决状态唯一来源、品牌来源边界与隐私 warning 复核；Draft PR #2 的 Brand Foundation 保持暂停和 `proposed`，不进入批准流程。

## 在线网站

网站可在本地运行，也可部署到 GitHub Pages 或 Vercel。公网部署仅用于试用和审查；私人数据仍必须遵守既定隐私边界。

## 已实现功能概览

应用已支持健康记录、规则版多专家 Agent 分析、总教练方案、V2 数据中心、设置中心数据管理、本地图片存储、可选 Supabase 同步，以及 COROS 数据导入基础能力。

## 当前数据存储

默认模式将记录存入浏览器 `localStorage`，图片存入浏览器本地存储。Supabase 同步为可选功能，由用户主动选择。

## 当前隐私状态

GitHub 只应保存代码和项目资产。私人健康数据、截图、导出包、Secret 和数据库文件由政策、`.gitignore`、迁移排除规则及可重复隐私审计共同防护。

Sprint 001 已形成 `manifest.exclude`、硬编码安全阻断、完整索引与 SHA-256 校验、Git 跟踪文本隐私审计，以及 JSON、Schema、Markdown 链接和版本验证。这些能力仍处于 Foundation Review 范围，最终状态以本文件为准。

## 当前 Agent 状态

运行时规则 Agent 位于 `src/agents/`。跨平台 Agent 业务文档位于根目录 `agents/`，其状态仍以各正式文档的元数据为准。

## 当前限制

项目尚未提供生产级 AI 提供商集成、托管 OCR、完整加密备份或完整的提供商中立分析包（analysis packet）流程。

## 当前 Sprint

Sprint 001 Review Fix。Brand Foundation 位于 Draft PR #2，继续保持 Draft，不合并、不转为 `approved`。

## 下一步

完成 Foundation Review 阻塞项，重新运行测试、构建、隐私审计、基础验证和 AI 交接导出，再决定是否允许进入下一阶段。

## 当前风险

- 即使排除了私人数据，公开源代码仍可能暴露产品方向。
- 过于精确的演示数据可能看起来像真实个人资料，公开前仍需人工确认。
- 未来 AI 集成不得绕过用户确认和数据最小化原则。
- 二进制图片、未被 Git 跟踪的本地文件及外部服务数据不属于当前文本隐私审计范围。
- 所有品牌文件仍为 `proposed`，品牌名称、视觉与商标可用性均未确定。
