---
title: Sprint 001 Foundation Privacy Portability
status: draft
version: 0.1.2
last_updated: 2026-08-05
owner: engineering
source_of_truth: true
---

# Sprint 001：项目基础、隐私保护与 AI 可迁移性

## Sprint 编号

Sprint 001。

## 名称

项目基础、隐私保护与 AI 可迁移性。

## 状态

`Draft / Review`。当前项目状态只以 [project/CurrentStatus.md](../CurrentStatus.md) 为准。

初始 Foundation 资产曾通过 PR #1 进入 `main`，但治理审批尚未完成；本次 Review Fix 尚未合并至 `main`。

## 背景

Web MVP 已可使用。本 Sprint 通过分离项目资产与私人数据，并让 AI 上下文可迁移，保护项目的长期价值。

## 目标

在不新增产品功能、不改变运行时数据结构的前提下，建立治理、隐私、Schema、Prompt 和迁移基础。

## 范围

文档、草案状态的 Schema、`.gitignore`、package scripts、隐私审计、AI 交接导出脚本和基础验证脚本。

## 不在范围内

不修改网站业务功能，不做视觉重设计，不迁移现有数据，不接入真实 AI API，不改变仓库可见性，不决定许可证，也不新增 npm 依赖。

## 输入

2026-07-25 提交给 Codex 的 Sprint 001 要求，以及提交 `787382b2cb520d2a0a976a4230185de48afbcab0` 时的仓库状态。

## 文件

实现后的完整文件范围见本文末尾。

## 实施步骤

1. 检查基线分支、Commit 和测试。
2. 增加治理与唯一正式来源（Source of Truth）文档。
3. 增加架构、隐私和安全文档。
4. 增加草案 Schema、Prompt 和迁移结构。
5. 增加 AI 交接导出与基础验证脚本。
6. 更新 README、package scripts 和 `.gitignore`。
7. 运行测试、构建、验证和导出。
8. 根据合并前审查意见，强化排除规则、迁移包完整性、基础验证和隐私审计。

## 验收标准

现有网站行为保持不变；JSON 文件有效；迁移包可生成；私人数据目录被排除；没有引入高可信 Secret。

## 隐私影响

正向。本 Sprint 增加数据分类、边界、忽略规则、审计记录和提供商中立的 AI 数据共享模型。

## 数据迁移影响

无。现有 `localStorage`、IndexedDB 和 Supabase 记录结构均未改变。

## 测试结果

- 实现前基线：`vitest run` 通过，16 个测试文件、61 项测试。
- Sprint 初次验证：`vitest run` 通过，17 个测试文件、63 项测试。
- 合并前审查修正验证：`vitest run` 通过，20 个测试文件、77 项测试。
- `src/__tests__/foundationScripts.test.js` 覆盖基础脚本和 AI 交接导出。
- `src/__tests__/handoffReviewFixes.test.js` 覆盖 `manifest.exclude`、路径越界、完整索引和校验值。
- `src/__tests__/foundationValidationReview.test.js` 覆盖 Markdown 链接、JSON Schema 元数据和敏感夹具导出。
- `src/__tests__/privacyAudit.test.js` 覆盖 Secret 失败、打码、个人信息 warning 和二进制跳过。

## 构建结果

基线、Sprint 初次验证和合并前审查修正的生产构建均通过。仍存在原有 Vite chunk-size warning，该提示不是本 Sprint 引入。

## 决策

已为单仓库、私人数据分离、可替换 AI 提供商，以及仓库可见性/许可证增加初始 ADR。各 ADR 的 `status` 保持原值。

## 早期审查修正

- 基础文档正文调整为中文为主，文件名、路径、代码标识和既有状态不变。
- 修正品牌核心文字漂移，统一使用 `brand/00_BrandDNA.md` 中的正式表达“记住来路，理解自己，成为自己。”。
- `scripts/build-ai-handoff.mjs` 现在同时执行 `manifest.exclude` 与硬编码最低安全阻断规则。
- 导出顺序固定为上下文、核心包、版本、完整索引、最终校验值。
- `CHECKSUMS.txt` 计算其他所有最终文件的 SHA-256，不计算自身。
- `scripts/validate-foundation.mjs` 现在验证必需文件、JSON、Schema 元数据、本地 Markdown 链接、manifest、敏感夹具导出、索引、校验值和版本信息。
- 新增 `scripts/privacy-audit.mjs` 与 `npm run audit:privacy`。

## Review Findings

1. `PROJECT.md`、Sprint、Backlog、Roadmap 与迁移交接曾重复维护当前状态，并把 Git 落地误写为治理完成。
2. ADR 仍为 `proposed`，但入口文件曾将相关内容列为“已确认事项”。
3. `brand/00_BrandDNA.md` 与 `brand/02_MissionVision.md` 重复维护使命、愿景与承诺原文，唯一正式来源边界不清。
4. 隐私审计的 9 条 warning 尚未逐项记录处理决定。

## Resolution

- 以 `project/CurrentStatus.md` 作为当前项目阶段、当前 Sprint、审核状态和下一步的唯一正式来源。
- 保留真实 Git 历史，同时把 Foundation 治理状态统一为 `Draft / Review`；ADR 决策成熟度继续保持 `proposed`。
- 以 `brand/00_BrandDNA.md` 保存品牌核心、使命、愿景、承诺与核心命题原文；`brand/02_MissionVision.md` 只保存展开说明。
- 新增 `security/PrivacyAudit-Review.md`，逐项分类并记录 9 条 warning 的风险、决定、负责人和状态。

## Remaining Issues

- Review Fix 尚未合并至 `main`。
- Foundation 尚未完成最终治理审批。
- Git 历史、未跟踪文件与二进制图片仍不属于自动文本隐私审计范围。
- Draft PR #2 的 Brand Foundation 继续暂停并保持 `proposed`。

## 其他待处理问题

- 仓库可见性和许可证仍由创始人决定。
- 最终品牌名称仍未确定。
- 二进制图片、未跟踪本地文件和外部服务数据仍需人工复核。
- 当前执行环境没有 `npm` 可执行文件；底层命令通过本地已安装的 Vitest/Vite 和 Node 直接验证。

## 文件清单

### Sprint 001 新增

- `PROJECT.md`
- `agents/README.md`
- `api/README.md`
- `architecture/AIProviderPortability.md`
- `architecture/BackupAndRecovery.md`
- `architecture/DataFlow.md`
- `architecture/DataOwnershipAndBoundaries.md`
- `architecture/README.md`
- `architecture/SystemArchitecture.md`
- `brand/00_BrandDNA.md`
- `brand/README.md`
- `knowledge/README.md`
- `migration/AI_HANDOFF.md`
- `migration/EXCLUDED_DATA.md`
- `migration/MIGRATION_CHECKLIST.md`
- `migration/NEW_AI_BOOTSTRAP_PROMPT.md`
- `migration/PRIVATE_CONTEXT_TEMPLATE.md`
- `migration/README.md`
- `migration/RESTORE_TEST.md`
- `migration/manifest.json`
- `product/README.md`
- `project/Backlog.md`
- `project/CurrentStatus.md`
- `project/DecisionCaptureWorkflow.md`
- `project/DefinitionOfDone.md`
- `project/FileManagementRules.md`
- `project/INDEX.md`
- `project/README.md`
- `project/Roadmap.md`
- `project/SourceOfTruth.md`
- `project/VersioningPolicy.md`
- `project/archive/README.md`
- `project/decisions/ADR-0001-Single-Repository.md`
- `project/decisions/ADR-0002-Private-Data-Separation.md`
- `project/decisions/ADR-0003-Replaceable-AI-Providers.md`
- `project/decisions/ADR-0004-Repository-Visibility-And-Licensing.md`
- `project/decisions/README.md`
- `project/sprints/Sprint-001-Foundation-Privacy-Portability.md`
- `project/templates/ADR-TEMPLATE.md`
- `project/templates/Confirmed-Decision-Prompt.md`
- `project/templates/Sprint-TEMPLATE.md`
- `prompts/README.md`
- `prompts/core/README.md`
- `prompts/platforms/chatgpt/README.md`
- `prompts/platforms/claude/README.md`
- `prompts/platforms/gemini/README.md`
- `prompts/platforms/local/README.md`
- `schemas/README.md`
- `schemas/ai-analysis-result.schema.json`
- `schemas/analysis-packet.schema.json`
- `schemas/daily-health-data.schema.json`
- `schemas/portable-backup-manifest.schema.json`
- `scripts/build-ai-handoff.mjs`
- `scripts/validate-foundation.mjs`
- `security/AIDataSharingPolicy.md`
- `security/DataClassification.md`
- `security/IncidentResponse.md`
- `security/LocalPrivateFiles.md`
- `security/PrivacyAudit-Initial.md`
- `security/PrivacyModel.md`
- `security/README.md`
- `security/SecretsPolicy.md`
- `src/__tests__/foundationScripts.test.js`

### Sprint 001 修改

- `.gitignore`
- `README.md`
- `package.json`
- `src/data/sampleData.js`

### 合并前审查修正新增

- `scripts/privacy-audit.mjs`
- `src/__tests__/foundationValidationReview.test.js`
- `src/__tests__/handoffReviewFixes.test.js`
- `src/__tests__/privacyAudit.test.js`

### 合并前审查修正修改

- `package.json`
- `scripts/build-ai-handoff.mjs`
- `scripts/validate-foundation.mjs`
- `security/PrivacyAudit-Initial.md`
- 本任务要求范围内的中文基础文档

## 分支

`sprint/001-foundation-privacy-portability`

## Commit

`74a00904f4ca19a9ef1d0438cb1313ad4122d0f9`

## 历史 PR

[PR #1](https://github.com/Zww1116/ai-running-health-coach-mvp/pull/1) 记录初始资产进入 `main` 的 Git 历史；它不代表当前 Foundation 已获得治理批准。
