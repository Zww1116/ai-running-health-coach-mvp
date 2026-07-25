---
title: AI Handoff
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# AI 交接

## 项目定位

个人 AI 健康决策与成长伙伴，长期方向是 Personal AI Health OS。

## 品牌核心

拟议（`Proposed`）：记住来路，理解自己，成为自己。

品牌名称尚未确定。

## 当前阶段

可运行 MVP，加上 Sprint 001 基础建设工作。

## 阅读顺序

1. `migration/AI_HANDOFF.md`
2. `PROJECT.md`
3. `project/CurrentStatus.md`
4. `project/SourceOfTruth.md`
5. `brand/00_BrandDNA.md`
6. `project/decisions/`
7. `architecture/`
8. `security/`
9. `schemas/`
10. `agents/`
11. `prompts/core/`
12. 当前 Sprint

## 正式来源规则

使用正式文件，不依赖旧聊天记忆。尊重文档状态值；编辑前如发现冲突，先报告冲突。

## 隐私边界

不得把私人健康记录、图片、导出文件、密钥、数据库文件或未脱敏日志放入 Git。未经用户确认，不得把私人数据发送给 AI。

## 数据所有权

个人健康数据归用户所有。可迁移的代码、文档、Schema、Prompt 和 Agent 规则属于项目资产。

## 新 AI 接手检查

开始修改前，重新说明项目定位、当前阶段、品牌核心、已确认事项、未确认事项、隐私边界、当前 Sprint 和下一步。

## 冲突处理

如果来源冲突，优先采用 `project/SourceOfTruth.md` 中列出的文件。如果状态或负责人不清楚，停止并报告。

## 标准变更流程

每次使用一个范围聚焦的 Sprint，控制变更范围，更新正式来源，完成验证并记录变更；未经审阅不要合并。

## 迁移包完整性

`FILE_INDEX.md` 应列出全部最终交接文件。`CHECKSUMS.txt` 应计算除自身以外所有最终文件的 SHA-256；`CHECKSUMS.txt` 不包含自身校验值。

## 未确认事项

最终品牌名称、许可证、仓库可见性策略、生产 AI 提供商和完整备份流程。
