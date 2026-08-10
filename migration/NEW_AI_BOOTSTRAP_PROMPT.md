---
title: New AI Bootstrap Prompt
status: approved
version: 0.2.2
last_updated: 2026-08-09
owner: product
source_of_truth: true
---

# 新 AI 启动 Prompt

```text
你正在通过一个可迁移的 AI 交接包接手本项目。

开始任何工作前：
1. 完整阅读 migration/AI_HANDOFF.md。
2. 按 manifest 的 mergeOrder 阅读 AI_CONTEXT_COMPLETE.md，尤其要按顺序读完 brand/README.md、brand/00_BrandDNA.md 至 brand/10_FounderReviewChecklist.md，以及 brand/CHANGELOG.md。
3. 将 project/SourceOfTruth.md 指定的文件视为唯一正式来源。
4. 尊重文档状态：draft、proposed、approved、deprecated、archived；不得擅自改变状态。
5. 明确 Foundation 已是 Approved / Completed；ADR-0001 至 ADR-0004 均为 approved。
6. 明确 Brand Foundation 所有文件整体仍为 proposed；其中 Brand DNA 的核心表达和品牌使命已获批准，Brand Vision、Brand Promise 与 Core Thesis 仍为 proposed。创始人审核清单不是正式品牌结论；合并 proposed 文件不等于 Brand Approval，部分分区批准也不等于 Brand DNA 或 Brand Foundation 整体批准。
7. 已批准的品牌核心表达只能写作“记住来路，理解自己，成为自己。”，不得使用近义表达替代；已批准的 Mission 必须从 brand/00_BrandDNA.md 读取准确原文。
8. 明确品牌名称、英文核心表达、Logo、颜色、字体、视觉、商标和域名均未确定；不得自行命名或宣布结论。
9. 明确 AI 提供商可替换，核心 Prompt、Agent、Schema 和知识不得锁定在单一提供商。
10. 明确公开网站可以继续访问，当前公开仓库是过渡安排；当前不授予开源许可证，未经创始人另行批准默认保留全部权利。
11. 不要依据旧聊天记录猜测项目结论，不得虚构创始人私人经历或品牌故事。
12. 未经创始人明确批准，不得修改已确认决策或把 proposed 改为 approved。
13. 如果文件之间存在冲突，在编辑前先报告冲突。
14. 重新说明项目定位、当前阶段、品牌核心、品牌状态、已确认事项、未确认事项、数据隐私边界、当前 Sprint 和下一步。
15. 不得把私人健康数据、图片、联系方式、密钥、数据库、导出备份或未脱敏聊天写入 Git 或交接包。
16. 只有在用户确认你理解无误后，才开始新的范围工作。
```

## 已形成内容

已形成面向新 AI 的中文主版本启动 Prompt，覆盖品牌读取顺序、正式来源、状态、隐私和未确认事项。

## 仍待确认事项

- 是否需要为特定 AI 平台增加不改变核心规则的适配版本。
- Brand Foundation 经创始人审核后的状态更新。
