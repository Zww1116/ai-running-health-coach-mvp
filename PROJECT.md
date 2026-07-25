---
title: Project Entry
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: founder
source_of_truth: true
---

# 项目概览

本仓库包含一个可运行的个人 AI 健康决策平台。当前产品帮助用户采集训练、营养、睡眠、恢复、疼痛和经期数据，再由本地规则版专家 Agent 生成每日与每周教练建议。

## 当前定位

当前定位是：个人 AI 健康决策与成长伙伴。V2 的更长远方向是 Personal AI Health OS，围绕“获取数据、多专家分析、总教练决策、执行与复盘”组织产品。

## 当前品牌核心

当前拟议（proposed）的品牌核心是：记住来路、看懂自己、成为自己。品牌名称尚未确定。

## 当前产品

首个产品是面向跑者的 AI 辅助健康与训练管理系统。它以 React Web 应用形式运行，并可通过 GitHub Pages 或 Vercel 公开部署。

## 当前阶段

项目目前处于 Phase 0 与 Phase 1 的交叠阶段：项目治理和隐私基础，以及产品和数据基础。

## 当前技术状态

应用使用 React、Vite 和 Tailwind，包含本地规则版 Agent、浏览器本地存储、可选的 Supabase 同步、IndexedDB 本地图片存储、COROS 文件导入基础，以及本地 Ollama 营养估算适配器。

## 当前数据存储状态

个人健康记录主要保存在用户浏览器中。Supabase 是可选能力，或作为由用户选择启用的云端同步能力预留。GitHub 不存储原始个人健康数据。

## 当前隐私边界

项目资产可以进入 Git。私人健康记录、健康图片、导出文件、数据库文件和密钥不得提交。任何 AI 数据共享都必须经过用户明确审阅，并使用最小化的分析数据包（analysis packet）。

## 当前已实现能力

- 跑步、力量、饮食、身体、睡眠、经期和疼痛记录。
- 规则版专家 Agent 与总教练聚合。
- 面向导入、睡眠、饮食图片和手动记录的数据中心入口。
- 通过浏览器存储实现本地图片上传与预览。
- 可选的 Supabase 认证，以及由行级安全（RLS）保护的记录同步。
- 面向运动文件的 COROS 导入基础。

## 当前主要限制

- 尚未启用真实的 OpenAI、Claude 或 Gemini API 集成。
- 图片识别以本地能力或占位流程为主，不是托管式生产 AI 服务。
- 长期云端备份与恢复尚未形成完整的用户流程。
- 当前 Schema 状态为 `draft`，尚未用于运行时验证。

## 当前 Sprint

Sprint 001：项目基础、隐私保护与 AI 可迁移性。

## 下一步计划

在增加更多产品功能之前，完成治理、隐私、Schema、Prompt 和 AI 交接基础。

## 文档导航

- 项目治理：[project/README.md](project/README.md)
- 当前状态：[project/CurrentStatus.md](project/CurrentStatus.md)
- 唯一正式来源：[project/SourceOfTruth.md](project/SourceOfTruth.md)
- 品牌核心：[brand/00_BrandDNA.md](brand/00_BrandDNA.md)
- 架构：[architecture/README.md](architecture/README.md)
- 安全：[security/README.md](security/README.md)
- 迁移：[migration/AI_HANDOFF.md](migration/AI_HANDOFF.md)

## 已确认事项

- 当前阶段使用一个主要 GitHub 仓库。
- 私人健康数据与项目资产分离。
- AI 提供商保持可替换。

## 未确认事项

- 最终品牌名称。
- 许可证和仓库可见性策略。
- 最终生产环境 AI 提供商。
- 最终长期备份产品流程。

## 唯一正式来源声明

聊天记录不是项目的正式来源。每类重要资产都只有一个正式来源，具体见 [project/SourceOfTruth.md](project/SourceOfTruth.md)。README 文件只负责介绍和导航，不重复维护详细规则。
