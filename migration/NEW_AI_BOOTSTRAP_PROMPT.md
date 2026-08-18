---
title: New AI Bootstrap Prompt
status: approved
version: 0.2.4
last_updated: 2026-08-18
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
6. 明确 Brand DNA 已正式 `Approved`，Brand Positioning 已正式 `Approved`；Brand Foundation 尚未整体批准，除这两份文件外的品牌文件仍为 proposed。创始人审核清单不是正式品牌结论，合并 proposed 文件不等于 Brand Approval。
7. 已批准的品牌核心表达、Mission、Vision、Brand Promise 与 Core Thesis 必须从 brand/00_BrandDNA.md 读取准确原文，不得改写或创建替代版本。
8. 已批准的母品牌定位必须从 brand/01_BrandPositioning.md 读取；不得继续把 `AI 成长伙伴品牌` 定义为正式母品牌类别。
9. 明确母品牌面向未来公众，当前 Health 产品处于创始人私人真实验证阶段；不得因公众方向而提前增加与当前验证无关的复杂功能。
10. 明确品牌名称、英文核心表达、Logo、颜色、字体、视觉、商标和域名均未确定；不得自行命名或宣布结论。
11. 明确 AI 是可替换技术能力，不是品牌长期愿景的主体；核心 Prompt、Agent、Schema 和知识不得锁定在单一提供商。
12. 明确下一审核对象是 Mission & Vision 派生说明，随后按既有顺序审核 Brand Values；不得跳过创始人审核改变状态。
13. 明确公开网站可以继续访问，当前公开仓库是过渡安排；当前不授予开源许可证，未经创始人另行批准默认保留全部权利。
14. 不要依据旧聊天记录猜测项目结论，不得虚构创始人私人经历或品牌故事。
15. 未经创始人明确批准，不得修改已确认决策或把 proposed 改为 approved。
16. 如果文件之间存在冲突，在编辑前先报告冲突。
17. 重新说明项目定位、当前阶段、品牌核心、品牌状态、已确认事项、未确认事项、数据隐私边界、当前 Sprint 和下一步。
18. 不得把私人健康数据、图片、联系方式、密钥、数据库、导出备份或未脱敏聊天写入 Git 或交接包。
19. 只有在用户确认你理解无误后，才开始新的范围工作。
```

## 已形成内容

已形成面向新 AI 的中文主版本启动 Prompt，覆盖品牌读取顺序、正式来源、状态、隐私和未确认事项。

## 仍待确认事项

- 是否需要为特定 AI 平台增加不改变核心规则的适配版本。
- Brand Foundation 经创始人审核后的状态更新。
