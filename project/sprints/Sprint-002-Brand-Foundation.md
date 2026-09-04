---
title: Sprint 002 Brand Foundation
status: proposed
version: 0.1.8
last_updated: 2026-09-01
owner: product
source_of_truth: true
---

# Sprint 002：Brand Foundation

## Sprint ID

Sprint 002。

## 状态

`Proposed / Review`。当前项目状态只以 [project/CurrentStatus.md](../CurrentStatus.md) 为准。

## 背景

Sprint 001 Foundation 已获创始人批准并完成。PR #2 已将 Brand Foundation 文档基线纳入 `main`；Brand DNA、Brand Positioning、Mission & Vision 派生说明、Brand Values 与 Brand Personality Founder Review 已完成，五份文件整体均已获批准。Brand Foundation 其余文件继续保持 `proposed`。

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

隐私审计扫描 174 个 Git 索引文本文件，未发现高可信 Secret；保留 9 条既有人工复核 warning，均不来自本 Sprint 品牌文件。

## 数据影响

无。`localStorage`、IndexedDB、Supabase Schema、健康数据 Schema 与现有记录均不改变。

## 网站影响

无。网站页面、导航、标题、Logo、颜色、字体与运行时功能均不改变。

## 验收标准

- 十三份品牌文件存在且元数据完整；Brand DNA、Brand Positioning、Mission & Vision 派生说明、Brand Values 与 Brand Personality 状态为 `approved`，其余八份文件状态为 `proposed`。
- 已批准的核心表达只使用“记住来路，理解自己，成为自己。”。
- 已批准的 Mission 使用 Brand DNA 中的准确原文。
- 已批准的 Vision、Brand Promise 与 Core Thesis 使用 Brand DNA 中的准确原文。
- 已批准的母品牌定位不再以 `AI 成长伙伴品牌` 作为类别定义。
- 母品牌未来公众方向与当前 Health 私人真实验证状态同时成立。
- Mission & Vision 派生说明仍为 `source_of_truth: false`，不复制或改写 Brand DNA 正式原文。
- Brand Values 正式集合只有八项；第七项为“技术辅助，人来决定 / Technology Assists, Human Decides”。
- Values Decision Rule 是冲突决策规则，不构成第九项正式价值观。
- 人的安全、尊严、自主权与长期利益在冲突时优先于增长、效率、完成率和技术能力。
- Brand Relationship Archetype 为“可信赖的长期伙伴”，Brand Personality 包含八项正式人格特征、三层结构与六组平衡。
- Personality Decision Rule 明确尊重与诚实是人格表达底线；温度不能牺牲真实性，专业不能压过用户主体性。
- 陪伴不能制造依赖，克制不能回避安全风险；AI 与技术不是品牌人格主体。
- 用户自主判断优先于 AI 依赖，AI 与规则引擎均为可替换技术能力。
- 品牌名称与视觉仍未确定。
- 品牌文件按规定顺序进入单文件上下文和 AI-Core-Pack。
- 测试、构建、隐私审计、基础验证和交接导出通过。

## 测试结果

Brand Personality Review 01 增加状态、版本、关系原型、八项人格、三层结构、Personality Decision Rule 与下一审核对象验证；最终结果为 22 个测试文件、88 项测试通过。

## Build 结果

生产构建通过，共转换 1669 个模块。保留既有的 523.91 kB Vite chunk-size warning，本 Sprint 未修改网站运行时代码。

## Foundation Validation 结果

基础验证通过，0 warning；必需文件、JSON、Markdown 本地链接、manifest、导出索引、校验值与版本信息均通过检查。

## AI 迁移包结果

导出成功：`packVersion 0.2.2`、`projectVersion 0.2.2`，46 个合并来源、68 个 AI-Core-Pack 文件；完整索引与校验值验证通过。

## 待创始人确认内容

- Voice、Product Principles、Brand Architecture、Naming Brief 与 Guardrails。
- 最终品牌名称和英文核心表达。
- 母品牌与 Health 的命名关系。
- 视觉系统、商标、域名与品牌公开程度。

## 分支

`codex/founder-brand-personality-review-01`

## Commit

建议提交标题为 `docs: approve Brand Personality v0.2.0`；准确 SHA 以该分支 Git 记录为准。

## Draft PR

PR #2 已合并 proposed Brand Foundation 文档基线，PR #3 已合并 Brand DNA Founder Review 决策，PR #4 已合并 Brand Positioning Founder Review 决策，PR #5 已合并 Mission & Vision Derived Explanation Founder Review 决策，PR #6 已合并 Brand Values Founder Review 决策。本分支独立记录 Brand Personality Founder Review 01，并通过新的 Draft PR 审核；Brand Foundation 其余文件仍为 `proposed`。

## 已形成内容

Brand DNA、Brand Positioning、Mission & Vision 派生说明、Brand Values 与 Brand Personality Founder Review completed。“可信赖的长期伙伴”关系原型、八项正式人格、人格层级、六组平衡与 Personality Decision Rule 已批准；Brand Foundation 其余审核范围及记录结构保持不变。

## 仍待确认事项

下一步：审核 Brand Voice。Brand Foundation 的整体批准、最终命名与视觉工作均不属于本 Sprint 的自动结论。
