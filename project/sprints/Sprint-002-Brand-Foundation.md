---
title: Sprint 002 Brand Foundation
status: proposed
version: 0.1.2
last_updated: 2026-08-08
owner: product
source_of_truth: true
---

# Sprint 002：Brand Foundation

## Sprint ID

Sprint 002。

## 状态

`Proposed / Review`。当前项目状态只以 [project/CurrentStatus.md](../CurrentStatus.md) 为准。

## 背景

Sprint 001 Foundation 已获创始人批准并完成。Brand Foundation 已形成 Draft PR #2，当前进入创始人逐项审核；所有品牌内容继续保持 `proposed`。

## 目标

建立定位、使命愿景、价值观、人格、语言、产品原则、品牌架构、命名标准、品牌护栏、变更记录与创始人审核清单，并将全部品牌文件纳入 AI 交接包。

## 范围

- 新增和整理 `brand/` 下的 proposed 品牌基础文件。
- 更新项目状态、路线图、Backlog、项目索引与唯一正式来源。
- 更新 AI 迁移 manifest、交接文档、启动 Prompt 和迁移验证测试。

## 非范围

- 不确定最终品牌名称、英文 Slogan、Logo、颜色、字体或视觉系统。
- 不进行商标、域名或账号可用性调查。
- 不修改网站、导航、React 业务代码、数据存储、Supabase、Agent 或健康 Schema。
- 不创建包含私人经历的完整 Brand Story。

## 输入文件

- `PROJECT.md`、`README.md`
- `brand/README.md`、`brand/00_BrandDNA.md`
- `project/` 中的状态、正式来源、路线图、Backlog、版本与文件规则
- `migration/AI_HANDOFF.md`、`migration/manifest.json`
- AI 交接构建与基础验证脚本

## 新增文件

- `brand/01_BrandPositioning.md`
- `brand/02_MissionVision.md`
- `brand/03_BrandValues.md`
- `brand/04_BrandPersonality.md`
- `brand/05_BrandVoice.md`
- `brand/06_ProductPrinciples.md`
- `brand/07_BrandArchitecture.md`
- `brand/08_NamingBrief.md`
- `brand/09_BrandGuardrails.md`
- `brand/10_FounderReviewChecklist.md`
- `brand/CHANGELOG.md`
- `project/sprints/Sprint-002-Brand-Foundation.md`
- `src/__tests__/brandFoundation.test.js`

## 修改文件

- `PROJECT.md`、`README.md`
- `brand/README.md`、`brand/00_BrandDNA.md`
- `project/CurrentStatus.md`、`project/SourceOfTruth.md`
- `project/Roadmap.md`、`project/Backlog.md`、`project/INDEX.md`
- `project/sprints/Sprint-001-Foundation-Privacy-Portability.md`
- `migration/manifest.json`、`migration/AI_HANDOFF.md`
- `migration/NEW_AI_BOOTSTRAP_PROMPT.md`
- `scripts/validate-foundation.mjs`

## 隐私影响

正向且低风险。本 Sprint 仅使用抽象品牌理念，不加入私人健康数据、身份资料、照片、联系方式、密钥、私人上下文或未脱敏聊天。

隐私审计扫描 172 个 Git 索引文本文件，未发现高可信 Secret；保留 9 条既有人工复核 warning，均不来自本 Sprint 品牌文件。

## 数据影响

无。`localStorage`、IndexedDB、Supabase Schema、健康数据 Schema 与现有记录均不改变。

## 网站影响

无。网站页面、导航、标题、Logo、颜色、字体与运行时功能均不改变。

## 验收标准

- 十三份品牌文件存在、元数据完整且状态为 `proposed`。
- 正式核心表达只使用“记住来路，理解自己，成为自己。”。
- 品牌名称与视觉仍未确定。
- 品牌文件按规定顺序进入单文件上下文和 AI-Core-Pack。
- 测试、构建、隐私审计、基础验证和交接导出通过。

## 测试结果

执行前基线为 20 个测试文件、77 项测试通过。创始人治理决策更新后为 22 个测试文件、83 项测试通过；品牌状态测试继续确认所有 Brand Foundation 文件保持 `proposed`。

## Build 结果

生产构建通过，共转换 1669 个模块。保留既有的 523.91 kB Vite chunk-size warning，本 Sprint 未修改网站运行时代码。

## Foundation Validation 结果

基础验证通过，0 warning；必需文件、JSON、Markdown 本地链接、manifest、导出索引、校验值与版本信息均通过检查。

## AI 迁移包结果

导出成功：`packVersion 0.2.2`、`projectVersion 0.2.2`，46 个合并来源、68 个 AI-Core-Pack 文件；完整索引与校验值验证通过。

## 待创始人确认内容

- 所有 Brand Foundation proposed 文件。
- 最终品牌名称和英文核心表达。
- 母品牌与 Health 的命名关系。
- 品牌面对个人还是未来公众品牌。
- 视觉系统、商标、域名与品牌公开程度。

## 分支

`sprint/002-brand-foundation`

## Commit

提交标题为 `docs: establish brand foundation v0.1`；准确 SHA 以该分支 Git 记录为准。

## Draft PR

PR #2 contains proposed Brand Foundation documents。Foundation 已获创始人批准；Brand Foundation 仍是 `proposed`。Merge 不等于 Brand Approval，后续品牌批准必须通过独立 Commit 或 PR 完成。

## 已形成内容

本 Sprint 已形成可供创始人审核的实施范围、验收边界与记录结构。

## 仍待确认事项

Brand Foundation 的正式批准、最终命名与视觉工作均不属于本 Sprint 的自动结论。
