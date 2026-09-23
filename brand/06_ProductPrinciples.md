---
title: Product Principles
status: approved
version: 0.2.0
last_updated: 2026-09-19
owner: product
source_of_truth: true
---

# 产品设计原则

本文件是母品牌产品设计原则领域的正式来源，并遵循 [Brand DNA](00_BrandDNA.md)、[Brand Positioning](01_BrandPositioning.md)、[Mission & Vision 派生说明](02_MissionVision.md)、[Brand Values](03_BrandValues.md)、[Brand Personality](04_BrandPersonality.md) 与 [Brand Voice](05_BrandVoice.md)。它不得重新定义、覆盖或改写这些已批准资产的正式内容。

本次批准的是母品牌原则，不是当前 MVP 的功能实现任务。当前 Health 产品处于 Founder Private Validation 阶段，可以建立不改变母原则的 Health Product Implementation Checklist。

## Product Principles

## 01. 记录是为了理解，不是为了监控

*Recording Exists for Understanding, Not Surveillance*

- **Principle Definition / 原则定义：** 记录用于理解变化、发现规律和支持决定，不把生活变成持续监控；采集必须服务明确目标，并由用户控制范围。
- **User Value / 用户价值：** 用户知道为什么记录，也能跳过、关闭、删除或缩小记录范围。
- **Positive Example / 正面示例：** 使用睡眠、训练、学习或财务趋势解释与当前目标有关的变化。
- **Anti-pattern / 反模式：** 以“未来也许有用”为由全天候收集与当前目标无关的数据，或用监控感提高黏性。
- **UI Implication / UI 影响：** 解释采集目的，提供跳过、关闭与删除入口。
- **Agent Implication / Agent 影响：** 只调用解决当前问题真正相关的数据。
- **Data Architecture Implication / 数据架构影响：** 支持数据最小化、来源标记、用途说明、删除与导出。
- **Acceptance Question / 验收问题：** 这个记录能帮助用户理解什么？

## 02. 数据是成长轨迹，不是成绩单

*Data Is a Growth Trail, Not a Scorecard*

- **Principle Definition / 原则定义：** 数据用于观察趋势、上下文、变化、原因与复盘，不用于评价人的价值。
- **User Value / 用户价值：** 波动、停滞和未完成都能成为理解自己的信息，而不是失败标签。
- **Positive Example / 正面示例：** 展示长期变化并结合现实背景解释短期波动。
- **Anti-pattern / 反模式：** 用单一分数、排名、连续打卡、KPI 或一次失败给人贴上好坏标签。
- **UI Implication / UI 影响：** 优先呈现趋势、上下文和变化，避免把排名或总分作为主叙事。
- **Agent Implication / Agent 影响：** 不把数据表现等同于人的价值，不用羞耻或比较解释结果。
- **Data Architecture Implication / 数据架构影响：** 保留时间、来源、上下文和用户备注，使数据可被回看而非只被打分。
- **Acceptance Question / 验收问题：** 这个呈现是在帮助用户理解，还是在给用户打分？

## 03. 重要建议必须解释且可追溯

*Important Advice Must Be Explainable and Traceable*

- **Principle Definition / 原则定义：** 重要建议应说明使用的事实、规则、Agent 或逻辑、AI Provider / Model / Version、事实与判断边界、不确定性、形成原因，以及哪些条件会改变建议。
- **User Value / 用户价值：** 用户不仅知道系统建议什么，也能理解并在需要时追溯建议如何形成。
- **Positive Example / 正面示例：** 默认展示关键依据，并允许展开查看输入版本、规则版本、时间与相关来源。
- **Anti-pattern / 反模式：** 只给结论，或把模型判断和概率性解释伪装成已经确认的事实。
- **UI Implication / UI 影响：** 默认展示关键依据，完整 Trace 按需展开，不要求每次暴露全部技术日志。
- **Agent Implication / Agent 影响：** 明确区分 Fact、Interpretation、Uncertainty 与 Advice，并输出原因和 warning flags。
- **Data Architecture Implication / 数据架构影响：** 支持 input version、rule version、schema version、provider、model、decision timestamp、reason、warning flags 与 source references。
- **Acceptance Question / 验收问题：** 用户能否理解并在需要时追溯这项建议是如何形成的？

## 04. 最终决定权属于用户

*Final Decision Belongs to the User*

- **Principle Definition / 原则定义：** 系统提供信息、分析、选择和风险提示，但不得默认替用户完成重大个人选择。
- **User Value / 用户价值：** 用户保留接受、修改、拒绝、改变目标、撤回授权和采取不同方案的权利。
- **Positive Example / 正面示例：** 建议可以编辑或拒绝，系统说明权衡并尊重用户最终确认。
- **Anti-pattern / 反模式：** 静默修改目标、自动执行重大决定，或把系统建议描述为唯一正确答案。
- **UI Implication / UI 影响：** 为重要建议提供确认、修改、拒绝和撤回入口。
- **Agent Implication / Agent 影响：** 清楚区分 system recommendation 与 user final decision。
- **Data Architecture Implication / 数据架构影响：** 分开保存系统建议、用户最终决定、授权状态及必要的变更记录。
- **Acceptance Question / 验收问题：** 用户能否安全地作出与系统建议不同的选择？

## 05. 行动优先于指标堆积

*Action Before Metric Overload*

- **Principle Definition / 原则定义：** 先回答“现在需要知道什么”和“接下来可以做什么”，再按需提供更深层数据。
- **User Value / 用户价值：** 用户能快速看见当前重要事项、下一步、风险和原因。
- **Positive Example / 正面示例：** 先显示一个可执行建议及关键依据，详细指标按需展开。
- **Anti-pattern / 反模式：** 首页堆积大量用户无法解释的指标，再要求用户自行判断。
- **UI Implication / UI 影响：** 当前重要事项、下一步、风险和原因优先，详情渐进展开。
- **Agent Implication / Agent 影响：** 先给有限、具体、可执行的选项，再提供必要分析。
- **Data Architecture Implication / 数据架构影响：** 区分行动、关键依据、风险与原始指标，支持分层读取。
- **Acceptance Question / 验收问题：** 用户看完后是否知道下一步？

## 06. 同时关注当下和长期趋势

*Balance Current State and Long-Term Trend*

- **Principle Definition / 原则定义：** 重要判断同时考虑 Current State 与 Long-Term Trend，并识别一致、冲突、短期异常和长期变化。
- **User Value / 用户价值：** 避免被单日信号或长期平均单独误导。
- **Positive Example / 正面示例：** 同时结合当前状态与多周趋势，并解释两者冲突时采用的优先级。
- **Anti-pattern / 反模式：** 只根据单日数据或只根据长期平均作出重要判断。
- **UI Implication / UI 影响：** 清楚区分当前信号与长期趋势，并标出冲突。
- **Agent Implication / Agent 影响：** 说明短期与长期依据，在两者冲突时明确解释。
- **Data Architecture Implication / 数据架构影响：** 支持时间序列、窗口、基线、异常与趋势版本。
- **Acceptance Question / 验收问题：** 这个判断是否同时考虑当前信号和趋势？

## 07. 不用焦虑、羞耻或攀比驱动用户

*No Anxiety, Shame or Comparison as Growth Mechanics*

- **Principle Definition / 原则定义：** 不通过羞耻、恐惧、同龄人比较、排名、连续打卡惩罚、FOMO、落后焦虑或人为不足驱动使用。
- **User Value / 用户价值：** 用户的持续行动来自理解和选择，而不是被操控或害怕失去系统。
- **Positive Example / 正面示例：** 把未完成计划当作复盘信息，并允许用户重新调整目标。
- **Anti-pattern / 反模式：** 让用户觉得没有产品就无法正常生活，或建立情感、决策和 AI 权威依赖。
- **UI Implication / UI 影响：** 避免羞辱提示、强迫性排行榜、惩罚式 streak 和人为倒计时。
- **Agent Implication / Agent 影响：** 不责备、不比较、不制造依赖，也不以权威语气迫使接受建议。
- **Data Architecture Implication / 数据架构影响：** 不为操控性增长或比较机制额外采集敏感数据。
- **Acceptance Question / 验收问题：** 这个功能是否通过让用户感到不足、焦虑或依赖来增加使用？

## 08. 高风险领域必须尊重专业边界

*Respect Professional Boundaries in High-Stakes Domains*

- **Principle Definition / 原则定义：** 高风险领域提供 decision support，不伪装成 guaranteed professional conclusion；必须说明证据、数据、模型和专业角色边界及必要转介条件。
- **User Value / 用户价值：** 用户能获得清楚的风险支持，而不会把系统输出误认为不具备的专业确定性。
- **Positive Example / 正面示例：** 明确事实、不确定性、非专业结论边界和寻求专业帮助的条件。
- **Anti-pattern / 反模式：** 因“AI 看起来很专业”而承诺诊断、收益、法律结果或无风险结论。
- **UI Implication / UI 影响：** 高风险输出显著展示边界、风险级别、依据和转介条件。
- **Agent Implication / Agent 影响：** 不越权作确定结论；风险越高，警示越直接并优先安全。
- **Data Architecture Implication / 数据架构影响：** 区分观察、风险、建议与专业结论；保存证据限制和转介标记。
- **Acceptance Question / 验收问题：** 用户是否可能把这项输出误认为具有它实际上并不具备的专业确定性？

### Health

不得把日常健康决策支持包装成医疗诊断；高风险时应清楚提示风险、说明非诊断边界并给出适当专业转介条件。

### Finance

不得把财务分析、风险分析或投资信息包装成保证收益、确定结果或无风险承诺。

### Legal

不得把一般信息包装成确定法律结论。

### 其他高风险领域

必须明确证据限制、数据限制、模型能力边界、专业角色边界和必要转介条件。

## 09. 所有核心资产必须可导出和迁移

*Core Assets Must Be Exportable and Portable*

- **Principle Definition / 原则定义：** 用户数据、项目文档、Schema、Prompt、Rules、Agent contracts、产品决定、项目状态、迁移清单、版本历史和正式来源必须可导出与迁移。
- **User Value / 用户价值：** 用户和项目能够备份、验证、恢复、更换工具并继续工作。
- **Positive Example / 正面示例：** 提供结构化导出、文件索引、版本信息和可验证校验值。
- **Anti-pattern / 反模式：** 关键资产只存在某次 AI 对话、不可导出的专有页面、单一模型记忆或无法验证的黑箱中。
- **UI Implication / UI 影响：** 数据管理入口清楚提供导出、备份、恢复与迁移状态。
- **Agent Implication / Agent 影响：** 规则、上下文和输出使用带版本的开放结构，可由其他 AI 或工具重新理解。
- **Data Architecture Implication / 数据架构影响：** 使用稳定标识、Schema、manifest、版本历史与完整性校验。
- **Acceptance Question / 验收问题：** 如果当前平台明天无法使用，核心资产能否被完整带走并继续工作？

## 10. AI 服务商必须可替换

*AI Providers Must Be Replaceable*

- **Principle Definition / 原则定义：** AI Provider 是 Adapter / Capability Layer，不是 Brand、Source of Truth 或 Core Business Logic。
- **User Value / 用户价值：** 用户和项目不会因单一厂商变化而失去数据、规则或连续性。
- **Positive Example / 正面示例：** Rule Engine、OpenAI、Anthropic / Claude、Google / Gemini、本地模型和未来 Provider 共享稳定契约。
- **Anti-pattern / 反模式：** 核心业务逻辑只存在某 Provider 的隐藏 Prompt，换模型就必须重写品牌、规则或数据。
- **UI Implication / UI 影响：** 不把厂商品牌当成产品身份核心；必要时清楚展示当前 Provider。
- **Agent Implication / Agent 影响：** Provider implementation 与 business rules、schemas、agent contracts、user data 和 project decisions 分离。
- **Data Architecture Implication / 数据架构影响：** 保存 provider、model 与 version 元数据，但不因换模型改变核心资产格式。
- **Acceptance Question / 验收问题：** 更换 AI Provider 是否会迫使项目重写核心品牌、规则或数据？

## 11. 隐私默认最小化，敏感数据由用户控制

*Privacy by Default, User-Controlled by Design*

- **Principle Definition / 原则定义：** 敏感数据默认 Private by Default、Minimum Necessary、Purpose Bound、User Controlled，只采集完成当前目标真正需要的数据。
- **User Value / 用户价值：** 用户应尽量知道收集了什么、为什么收集、保存位置与期限、谁可访问、是否发送给 AI 或第三方，以及如何删除、导出、关闭同步和撤回授权。
- **Positive Example / 正面示例：** 明确用途并让用户主动选择同步或 AI 分享，默认保留最小必要范围。
- **Anti-pattern / 反模式：** 因“未来也许有用”默认扩大敏感数据收集，或把私人数据、联系方式和密钥放入公开 Git。
- **UI Implication / UI 影响：** 在采集和授权点说明目的、范围、存储与控制方式。
- **Agent Implication / Agent 影响：** 只请求当前任务必要信息，未经授权不扩大上下文或发送第三方。
- **Data Architecture Implication / 数据架构影响：** 支持用途绑定、最小字段、访问控制、保留期限、删除、导出、授权与撤回记录。
- **Acceptance Question / 验收问题：** **如果不收集这项数据，这个功能真的无法完成吗？** 若答案是否定的，默认不采集。

公开 Git 不得包含私人健康或财务数据、身份信息、私人聊天、地址、电话、真实邮箱、API Key、Secret 或 Authentication Token。

## 12. 重要操作必须可确认、可撤销、可恢复

*Confirmable, Reversible and Recoverable by Design*

- **Principle Definition / 原则定义：** 删除、目标或计划覆盖、大量导入、外部账户连接、云同步、AI 数据分享、Provider 切换、迁移、重大 Agent 自动执行、权限扩大及不可逆隐私操作不得静默执行。
- **User Value / 用户价值：** 用户在改变主意或发生错误时能安全停止、撤销或恢复。
- **Positive Example / 正面示例：** 高影响操作先说明范围并确认，可逆操作提供撤销，可恢复操作提供备份。
- **Anti-pattern / 反模式：** 静默删除、覆盖、授权或执行重大决定，且不说明不可恢复后果。
- **UI Implication / UI 影响：** 按风险设计确认、撤销和恢复；普通低风险操作不增加无意义摩擦。
- **Agent Implication / Agent 影响：** 重大 Agent 决策必须等待明确授权，并说明执行内容与风险。
- **Data Architecture Implication / 数据架构影响：** 支持操作状态、审计记录、备份、恢复点、幂等性与必要的删除确认。
- **Acceptance Question / 验收问题：** 如果用户改变主意，这个操作能否安全撤销或恢复？

### Confirmable

重要操作需要明确确认。

### Reversible

可以撤销的操作应提供撤销能力。

### Recoverable

可以恢复的操作应提供恢复机制或备份。

### Irreversible

确实不可逆时，必须在执行前说明将发生什么、哪些内容无法恢复及影响范围。

## Product Decision Rule

当“更多数据”与“更少侵入”冲突时，优先数据最小化；当“自动化效率”与“用户控制”冲突时，优先用户控制；当“增长 / 留存”与“用户长期利益”冲突时，优先用户长期利益；当“功能便利”与“安全”冲突时，优先安全。

**最小化 > 多收集，控制权 > 自动化，长期利益 > 留存，安全 > 便利。**

English supporting form: Minimization over collection. Control over automation. Long-term user interest over retention. Safety over convenience.

中文是正式核心表达。本规则用于 Feature prioritization、AI automation、Data collection、Notifications、Growth、Retention、Personalization、Third-party integrations、Cloud sync 与 High-risk recommendations。

## Product Review Gate

任何重要新功能进入 Implementation 前，必须先通过 Product Review，并至少回答以下八个问题。

### Gate 1

它帮助用户理解什么，而不是监控什么？

### Gate 2

它把数据当作成长轨迹，还是评分、排名或价值判断工具？

### Gate 3

如果涉及 AI / Rules，判断依据能否解释，重要建议能否在需要时追溯？

### Gate 4

用户能否拒绝、修改、关闭并作出不同选择？

### Gate 5

界面是否首先帮助用户理解什么重要、为什么重要、下一步是什么，而不是堆积指标？

### Gate 6

重要判断是否同时考虑当前状态、长期趋势以及两者可能的冲突？

### Gate 7

这个功能是否利用焦虑、羞耻、攀比、FOMO、AI 依赖或连续打卡惩罚促进使用？若是，原则上不得开发，除非 Founder 明确例外批准。

### Gate 8

是否满足 Privacy by Default、Professional Boundary、Exportability、AI Provider Portability、Confirmability、Reversibility、Recoverability 与 Safety？

## Product Review Result

### PASS

符合 Product Principles，可进入后续设计或开发评审。

### PASS WITH CONDITIONS

可以推进，但必须先满足明确条件。

### FOUNDER REVIEW REQUIRED

存在原则冲突，需要 Founder 决策。

### BLOCKED

明确违反已经批准的 Product Principles，当前方案不得直接进入开发。

以上结果用于产品治理，不会自动替 Founder 作最终重大决策。

## 原则不是 UI 立即改造任务

本次 Founder Review 批准的是 Product Principles governance。本 PR 不要求重写 Dashboard、修改 React 页面、修改当前 Health MVP 或数据库、增加 Supabase 或 OpenAI API、实现完整 Product Review UI，或实现自动化审核器。后续产品 Sprint 可以逐项落地，本次只建立正式 Source of Truth。

## Health Implementation Boundary

当前 Health 产品处于 **Founder Private Validation** 阶段。Health 可以基于母原则建立 Health Product Implementation Checklist，覆盖医疗边界、疼痛风险、女性健康、数据隐私、训练建议解释、COROS / wearable import 与健康数据删除，但不得改变母品牌 Product Principles。

## 状态边界

Product Principles 已获创始人批准。Brand Foundation 整体仍为 `Proposed / Founder Review`；Brand Architecture、Naming Brief 与 Brand Guardrails 仍为 `proposed`。下一审核对象为 Brand Architecture。

## 已形成内容

已形成 12 项正式母品牌 Product Principles、Product Decision Rule、八项 Product Review Gate、四种 Product Review Result 与 Health Implementation Boundary。

## 仍待确认事项

- Brand Architecture、Naming Brief 与 Brand Guardrails 的创始人审核结果。
- 各产品在不改变母原则前提下所需的实施检查表及落地顺序。
