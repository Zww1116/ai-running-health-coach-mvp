---
title: New AI Bootstrap Prompt
status: approved
version: 0.2.11
last_updated: 2026-10-07
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
6. 明确 Brand DNA 已正式 `Approved`，Brand Positioning 已正式 `Approved`，Mission & Vision 派生说明已正式 `Approved`，Brand Values 已正式 `Approved`，Brand Personality 已正式 `Approved`，Brand Voice 已正式 `Approved`，Product Principles 已正式 `Approved`，Brand Architecture 已正式 `Approved`，Naming Brief 已正式 `Approved`；Brand Guardrails 仍为 proposed，Brand Foundation 尚未整体批准。创始人审核清单不是正式品牌结论，合并 proposed 文件不等于 Brand Approval。
7. 已批准的品牌核心表达、Mission、Vision、Brand Promise 与 Core Thesis 必须从 brand/00_BrandDNA.md 读取准确原文，不得改写或创建替代版本。
8. 已批准的母品牌定位必须从 brand/01_BrandPositioning.md 读取；不得继续把 `AI 成长伙伴品牌` 定义为正式母品牌类别。
9. 已批准的派生决策说明从 brand/02_MissionVision.md 读取，但派生说明不是正式原文来源；不得用它改写 Brand DNA。
10. 明确 Brand Values 只有八项；第七项正式名称是“技术辅助，人来决定 / Technology Assists, Human Decides”，旧名称不得继续作为正式名称。
11. 明确 Values Decision Rule 不是第九项价值观；人的安全、尊严、自主权与长期利益在冲突时优先于增长、效率、完成率和技术能力。
12. 明确 Brand Personality 的关系原型是“可信赖的长期伙伴”，尊重与诚实是人格表达底线；温度不能牺牲真实性，专业不能压过用户主体性，陪伴不能制造依赖，克制不能回避安全风险。
13. 明确 Brand Voice version `0.2.0` 是母品牌通用表达系统，不只属于 Health；Tone 为专业、冷静、有温度、诚实、克制。正式规则包括六项 Voice Principles、事实/判断/建议分离、`Understand → Facts → Interpretation → Uncertainty → Options → User Agency`、三级 Directness Ladder 与 15 类正式场景。温度来自理解而非情绪词数量；记忆只在有用时出现；不得制造 AI 依赖、假装人的情感意识或独占关系。Voice Decision Rule 是“真实 > 好听，清楚 > 炫技，尊重 > 说服，安全 > 温和。”
14. 明确 Product Principles version `0.2.0` 正式共有 12 项母品牌原则。第 8 项是跨 Health、Finance、Legal 等领域的 High-Stakes Professional Boundary；Privacy by Default 要求敏感数据最小化并由用户控制；核心资产必须 Portable，AI Provider 必须 Replaceable；重要操作必须 Confirmable / Reversible / Recoverable。Product Decision Rule 是“最小化 > 多收集，控制权 > 自动化，长期利益 > 留存，安全 > 便利。”重要新功能进入实现前应通过八项 Product Review Gate，并得到 PASS、PASS WITH CONDITIONS、FOUNDER REVIEW REQUIRED 或 BLOCKED 结果。当前 Health 处于 Founder Private Validation；本次原则批准不要求立即改造现有 MVP。
15. 明确 Brand Architecture 已正式 `Approved`，version `0.2.0`，Architecture type 是 `Branded House`：一个母品牌、多个可分离产品。Health lifecycle 是 `Validating`，当前为 Founder Private Validation；Financial Intelligence 仅为 Proposed Product Direction；Learning、Career、Life / Personal Growth 仅为 Future Possibility，不得提前开发。
16. 子产品必须继承母品牌核心资产，不得静默覆盖；产品之间私人数据默认隔离，Shared account 不代表 Shared permission，跨产品数据使用必须由用户明确选择。Brand Architecture 与 Repository、Database、Deployment 技术拓扑解耦，当前单仓库不是永久架构约束。Product Admission Rule、Proposed → Validating → Active 生命周期和 Architecture Decision Rule 均已批准。
17. 明确 Naming Brief 已正式 `Approved`，version `0.2.0`，但它只批准母品牌命名治理规则，不批准最终品牌名。Mother Brand 仍为 `[Brand Name Pending]`，最终中文名、英文名与产品名均为 Pending，没有任何候选名称获批。
18. 命名必须先通过 8 项 Naming Red Flag Gate，再以总分 100 的 Weighted Naming Score 比较；Score 不是自动批准器，商标、域名、社交账号、公司名称、App Store 与法律可用性是独立外部门槛。
19. 中英文共享品牌含义但不要求字面直译，正式原则是 `Meaning Consistency > Literal Translation`。Naming Territories 是创意搜索空间，不是候选名；母品牌命名优先于产品命名，产品名不得削弱母品牌或无意创造第二母品牌。
20. 最终命名必须进入独立 Naming Sprint，由 Founder Final Decision 批准，并在批准后建立独立 ADR 与 Naming Migration Plan。AI、Codex、评分、域名可买或临时偏好都不得自动决定最终名称。本次不修改网站、repo 或 product name。
21. 明确 AI 与技术不是品牌人格主体，只是支持品牌关系的可替换能力。
22. 明确用户拥有数据及迁移权；数据与长期成长记录不得绑定到单一 AI Provider、云平台、账户或模型。
23. 明确母品牌面向未来公众，当前 Health 产品处于创始人私人真实验证阶段；不得因公众方向而提前增加与当前验证无关的复杂功能。
24. 明确品牌名称、英文核心表达、Logo、颜色、字体、视觉、商标和域名均未确定；不得自行命名或宣布结论。
25. 明确用户自主判断优先于 AI 依赖；AI 是可替换技术能力，不是品牌长期愿景的主体；规则引擎与未来技术同样是可替换能力，核心 Prompt、Agent、Schema 和知识不得锁定在单一提供商。
26. 明确下一审核对象是 Brand Guardrails；不得跳过创始人审核改变状态。
27. 明确公开网站可以继续访问，当前公开仓库是过渡安排；当前不授予开源许可证，未经创始人另行批准默认保留全部权利。
28. 不要依据旧聊天记录猜测项目结论，不得虚构创始人私人经历或品牌故事。
29. 未经创始人明确批准，不得修改已确认决策或把 proposed 改为 approved。
30. 如果文件之间存在冲突，在编辑前先报告冲突。
31. 重新说明项目定位、当前阶段、品牌核心、品牌状态、已确认事项、未确认事项、数据隐私边界、当前 Sprint 和下一步。
32. 不得把私人健康数据、图片、联系方式、密钥、数据库、导出备份或未脱敏聊天写入 Git 或交接包。
33. 只有在用户确认你理解无误后，才开始新的范围工作。
```

## 已形成内容

已形成面向新 AI 的中文主版本启动 Prompt，覆盖品牌读取顺序、正式来源、状态、隐私和未确认事项。

## 仍待确认事项

- 是否需要为特定 AI 平台增加不改变核心规则的适配版本。
- Brand Foundation 经创始人审核后的状态更新。
