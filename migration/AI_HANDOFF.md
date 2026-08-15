---
title: AI Handoff
status: approved
version: 0.2.3
last_updated: 2026-08-15
owner: product
source_of_truth: true
---

# AI 交接

## 项目定位

当前正式产品是个人 AI 健康决策与成长伙伴，长期方向是 Personal AI Health OS。AI 是可替换能力，用户是系统主角。

## 品牌核心

核心表达：`Approved` — 记住来路，理解自己，成为自己。

品牌使命：`Approved` — 帮助人们记住自己的成长轨迹，在持续的记录、理解与选择中找到自己，并一步一步成为自己。

品牌愿景、品牌承诺与核心命题：`Proposed`。

以上原文唯一正式来源是 [Brand DNA](../brand/00_BrandDNA.md)。Brand DNA 文件整体与 Brand Foundation 其他文件仍为 `proposed`，当前阶段仍为 `Proposed / Founder Review`。品牌名称、最终英文表达和视觉系统尚未确定。

## 当前阶段

当前阶段、当前 Sprint、审核状态和下一步只读取 `project/CurrentStatus.md`。本文件不独立维护动态状态。

生成本交接快照时，Foundation 状态为 `Approved / Completed`，当前阶段为 `Sprint 002 — Brand Foundation Review`。Brand DNA 只有核心表达与品牌使命两个分区获批；合并草案或批准部分分区都不等于批准整个 Brand Foundation。

## 已批准治理决策

- Sprint 001 Foundation 已由创始人批准并完成。
- 私人健康数据、图片、身份资料、导出、数据库与密钥不得进入 Git。
- AI 提供商必须可替换；核心 Prompt、Agent、Schema 与知识不得锁定在单一平台。
- 公开网站可以继续访问；当前公开仓库是迁移到长期私有源资产管理前的过渡安排。
- 当前不授予开源许可证；未经创始人另行批准，默认保留全部权利。
- 迁移私有仓库前必须验证部署、Codex 访问和备份恢复流程。

## 总体阅读顺序

1. `migration/AI_HANDOFF.md`
2. `PROJECT.md`
3. `project/CurrentStatus.md`
4. `project/SourceOfTruth.md`
5. 完整品牌文件体系
6. `project/decisions/`
7. `architecture/`
8. `security/`
9. `schemas/`
10. `agents/`
11. `prompts/core/`
12. Sprint 记录

## 品牌文件读取顺序

以下顺序必须完整保留，不能只读取 Brand DNA：

1. `brand/README.md`
2. `brand/00_BrandDNA.md`
3. `brand/01_BrandPositioning.md`
4. `brand/02_MissionVision.md`
5. `brand/03_BrandValues.md`
6. `brand/04_BrandPersonality.md`
7. `brand/05_BrandVoice.md`
8. `brand/06_ProductPrinciples.md`
9. `brand/07_BrandArchitecture.md`
10. `brand/08_NamingBrief.md`
11. `brand/09_BrandGuardrails.md`
12. `brand/10_FounderReviewChecklist.md`
13. `brand/CHANGELOG.md`

其中 `brand/10_FounderReviewChecklist.md` 只是审核辅助文件，不是正式品牌结论。

## 正式来源规则

使用 [project/SourceOfTruth.md](../project/SourceOfTruth.md) 指定的正式文件，不依赖旧聊天记忆。尊重 `draft`、`proposed`、`approved`、`deprecated` 与 `archived` 状态；发现冲突时先报告，不得自行把 proposed 改为 approved。

## 隐私边界

不得把私人健康记录、图片、身份资料、联系方式、导出文件、密钥、数据库文件或未脱敏日志放入 Git。未经用户确认，不得把私人数据发送给 AI。品牌文档只使用抽象理念，不虚构创始人的私人品牌故事。

## 数据所有权

个人健康数据归用户所有。代码、文档、Schema、Prompt 与 Agent 规则属于可迁移项目资产。云同步与 AI 分享必须由用户主动选择。

## 新 AI 接手检查

开始修改前，从 `project/CurrentStatus.md` 读取并重新说明项目定位、当前阶段、已批准的品牌核心表达与 Mission、仍为 proposed 的 Vision / Promise / Core Thesis、品牌文件整体状态、隐私边界、当前 Sprint 和下一步。必须明确最终品牌名称与视觉均未确定，不得把 Brand DNA 或 Brand Foundation 整体理解为 `approved`。

## 冲突处理

如果来源冲突，优先采用 `project/SourceOfTruth.md` 指定的文件。若状态、负责人或结论仍不清楚，停止编辑并报告。

## 标准变更流程

每次只执行一个范围聚焦的 Sprint；更新正式来源与 CHANGELOG；运行测试、构建、隐私审计、基础验证和交接导出；未经审阅不合并。

## 迁移包完整性

- `packVersion` 与 `projectVersion` 当前为 `0.2.2`。
- Schema、Prompt 与 Agent 版本仍为 `0.1.0`。
- `FILE_INDEX.md` 列出全部最终交接文件。
- `CHECKSUMS.txt` 计算除自身以外所有最终文件的 SHA-256；它不包含自身校验值。

## 未确认事项

最终品牌名称、最终英文核心表达、品牌视觉、商标与域名、私有仓库迁移时机、生产 AI 提供商和完整备份流程。
