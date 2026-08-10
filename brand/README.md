---
title: Brand Foundation Index
status: proposed
version: 0.1.2
last_updated: 2026-08-09
owner: founder
source_of_truth: true
---

# 品牌基础目录

## 目录用途

本目录保存可审查、可追溯、可迁移的品牌基础文件。它用于约束产品、AI、语言与未来品牌决策，不代替创始人审核，也不保存私人经历或聊天摘录。

## 当前品牌状态

- 当前全部品牌文件整体均为 `proposed`；Brand DNA 的核心表达与 Mission 分区已获创始人批准，其余分区仍待审核。
- Brand DNA 不等于最终品牌名称；品牌名称尚未确定。
- 品牌视觉尚未开始，Logo、颜色、字体、图标和视觉系统均未确定。
- 当前只正式开发 Health 产品，未来方向不属于当前开发范围。

## 文件索引

| 文件 | 负责回答的问题 | 正式来源 |
| --- | --- | --- |
| [00_BrandDNA.md](00_BrandDNA.md) | 品牌核心、使命、愿景、承诺与核心命题的准确原文是什么？ | 是 |
| [01_BrandPositioning.md](01_BrandPositioning.md) | 品牌服务谁、解决什么问题、与其他产品有何定位差异？ | 是 |
| [02_MissionVision.md](02_MissionVision.md) | Brand DNA 中的 Mission、Vision、Promise 和 Core Thesis 如何用于决策？ | 否，派生说明 |
| [03_BrandValues.md](03_BrandValues.md) | 团队、产品与 AI 应遵守哪些价值观？ | 是 |
| [04_BrandPersonality.md](04_BrandPersonality.md) | 品牌应呈现怎样的人格与关系感？ | 是 |
| [05_BrandVoice.md](05_BrandVoice.md) | 品牌在不同情境下如何表达？ | 是 |
| [06_ProductPrinciples.md](06_ProductPrinciples.md) | 产品、Agent 与数据架构应遵守哪些原则？ | 是 |
| [07_BrandArchitecture.md](07_BrandArchitecture.md) | 母品牌与当前、未来产品如何组织？ | 是 |
| [08_NamingBrief.md](08_NamingBrief.md) | 未来如何评估名称，而不是本 Sprint 选什么名称？ | 是 |
| [09_BrandGuardrails.md](09_BrandGuardrails.md) | 哪些行为和功能必须被否决？ | 是 |
| [10_FounderReviewChecklist.md](10_FounderReviewChecklist.md) | 创始人如何逐项审核 proposed 内容？ | 否 |
| [CHANGELOG.md](CHANGELOG.md) | 品牌基础发生过哪些正式变更？ | 是 |

## 唯一正式来源

Brand DNA 是品牌核心原文的唯一正式来源。Values、Voice、Product Principles 等文件可以分别作为自身展开领域的正式来源，但必须继承 Brand DNA，不得重复定义核心原文。聊天记录、AI 摘要和口头讨论不是正式品牌文件；未经审阅，不得覆盖正式来源。完整矩阵见 [项目唯一正式来源](../project/SourceOfTruth.md)。

## 文档状态

- `proposed`：已形成可审核草案，但尚未批准。
- `approved`：仅能由创始人完成逐项审核后设置。
- `deprecated` 或 `archived`：应记录替代关系与原因。

本目录当前没有整体状态为 `approved` 的文件；分区批准状态只以 [Brand DNA](00_BrandDNA.md) 为准。

## 品牌变更流程

1. 在对应唯一正式来源中提出修改。
2. 保持 `proposed`，说明修改理由与影响。
3. 更新 [CHANGELOG.md](CHANGELOG.md)。
4. 由创始人和产品负责人审核。
5. 只有明确批准后才能调整状态。
6. 涉及品牌方向、产品边界或核心命题的重大变化必须新增 ADR。

## 创始人审核流程

按 [创始人审核清单](10_FounderReviewChecklist.md) 逐文件确认用词、删补项和是否可转为 `approved`。该清单仅是审核工具，不是正式品牌结论。

## 已形成内容

已形成完整的 proposed 品牌基础结构、正式来源关系、审核与变更流程，以及与当前 Health 产品相适配的边界；Brand DNA 的核心表达与 Mission 已完成分区级审核。

## 仍待确认事项

- 最终品牌名称与最终英文核心表达。
- 母品牌与 Health 的最终命名关系。
- 品牌面向个人品牌还是未来公众品牌。
- Logo、颜色、字体、视觉风格。
- 商标、域名和社交账号可用性。
- 各文件是否可以转为 `approved`。

## 不允许存放的内容

- 创始人或用户的真实健康、身份、联系方式与私人经历。
- 私人照片、未脱敏聊天、密钥和私人上下文包。
- 未经创始人确认的“最终名称”“最终视觉”或虚构品牌故事。
- 用不同措辞重复维护正式核心结论的副本。
