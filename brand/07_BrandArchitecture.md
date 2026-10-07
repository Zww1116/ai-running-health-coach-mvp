---
title: Brand Architecture
status: approved
version: 0.2.0
last_updated: 2026-09-23
owner: founder
source_of_truth: true
---

# 品牌架构

## 文件职责

本文件是母品牌与产品层级、品牌继承关系、产品边界和产品之间隔离关系的唯一正式来源。

本文件继承已经批准的 Brand DNA、Brand Positioning、Mission & Vision Derived Explanation、Brand Values、Brand Personality、Brand Voice 与 Product Principles，不得重新定义、覆盖或改写这些资产。Brand Guardrails 经创始人批准后也进入母品牌继承链。

## Architecture Model

正式采用 **Branded House（母品牌主导型架构）**：

> 一个长期母品牌 + 多个可独立演进的功能型产品。

母品牌承载 Brand DNA、Mission、Vision、Brand Promise、Core Thesis、Positioning、Values、Personality、Voice、Product Principles 与 Brand Guardrails。

具体产品承载明确的用户问题、应用领域、领域数据、领域规则、领域 Agent、领域功能与体验。未来存在多个产品，不等于自动形成多个彼此无关的品牌。

## 正式母品牌结构

```text
[Brand Name Pending]
|
|-- Health
|   `-- Validating / Founder Private Validation
|
|-- Financial Intelligence
|   `-- Proposed Product Direction
|
`-- Future Product Domains
    |-- Learning = Future Possibility
    |-- Career = Future Possibility
    `-- Life / Personal Growth = Future Possibility
```

这是 Brand Architecture，不是当前产品开发 Roadmap。架构中出现未来领域，不代表当前 Health 网站应增加对应页面、Agent、数据库或功能。

## 母品牌长期身份

母品牌是长期身份，产品是品牌在具体领域中的应用。母品牌不能被某个单一产品反向定义。

Health 是母品牌的第一个正式验证产品，但母品牌不是健康品牌、跑步品牌、减肥品牌，也不是单一 AI 工具品牌。Health 不得把 Brand DNA 限制为健康、跑步、健身或女性健康等单一领域。

## Health 当前正式地位

**Health = Validating**

**Current validation mode = Founder Private Validation**

该状态表示：

- 当前由 Founder 自己真实使用。
- 当前主要验证真实价值。
- 当前不需要提前建设复杂 SaaS。
- 当前不代表永久只服务 Founder。
- 当前不等于母品牌只属于 Health。

当前优先验证：

1. 能否保存长期轨迹。
2. 能否帮助理解自己。
3. 能否改善决策质量。
4. 能否把理解转化为行动。
5. 能否形成长期复盘闭环。
6. 是否在真实生活中值得持续使用。

母品牌面向未来公众，不构成当前提前增加多用户系统、社区、社交、复杂后台、商业增长体系或无关 SaaS 能力的理由。

## Financial Intelligence 当前地位

**Financial Intelligence = Proposed Product Direction**

即使 Founder 已存在相关项目、工作流或研究计划，也不得自动将其视为 Active Mother-brand Product。FI 是否进入母品牌正式产品组合，必须经过独立 Founder Review。

本次决定只保留未来纳入可能性，不开发 FI 页面，不合并 FI 数据，不修改 Health 网站，不创建跨产品数据库，也不自动迁移 FI 项目。

## Future Product Domains

**Learning = Future Possibility**

**Career = Future Possibility**

**Life / Personal Growth = Future Possibility**

这些方向不是 Approved Product，也不是 Active Product。其存在只用于确认母品牌架构没有被 Health 锁死，不得据此创建导航、数据库表、Agent、页面或增加当前 Health 的复杂度。

> Architecture preserves possibility. Product development follows validation.

## Brand Inheritance Rule

子产品必须继承母品牌已批准的核心资产：

```text
Brand DNA
↓
Brand Positioning
↓
Mission & Vision Derived Explanation
↓
Brand Values
↓
Brand Personality
↓
Brand Voice
↓
Product Principles
↓
Brand Guardrails
```

子产品可以新增 Domain Principles、Domain Safety Rules、Domain Data Schema、Domain Agent Rules、Domain-specific UX 与 Domain-specific terminology。

子产品不得静默覆盖 Brand DNA、Values、User autonomy、Privacy principles、Product Principles 或 Brand Guardrails。领域要求与母品牌规则冲突时，必须进入 Founder Review。

## 产品数据默认隔离

**Different Product Domains are Private by Default.**

Health、Finance、Learning、Career、Life 等产品的数据默认属于不同 Domain。即使未来共享 Account、Login、Database 或 Cloud Provider，也不代表数据可以自动跨产品使用。

跨产品数据使用必须同时满足：

1. Clear Purpose
2. Explicit User Choice
3. Minimum Necessary
4. Transparent Use
5. Revocable Permission
6. Appropriate Professional Boundary

> Account identity ≠ automatic data sharing.

> Shared infrastructure ≠ shared permission.

## Cross-Product Data Rule

未经用户明确选择，不得：

- 将 Health 数据交给 Finance Agent。
- 将 Finance 数据交给 Health Agent。
- 自动组合不同领域私人数据。
- 使用一个领域的数据训练或个性化另一个领域。
- 因为技术上可访问而默认认为可以使用。

跨产品数据共享必须明确说明使用目的和数据范围，由用户主动选择，只使用最小必要字段，并且可撤销、可追溯，必要时重新确认。

## Brand Architecture 与技术拓扑解耦

**Brand Architecture ≠ Repository Architecture**

**Brand Architecture ≠ Database Architecture**

**Brand Architecture ≠ Deployment Architecture**

当前阶段可以继续使用单仓库，但当前单仓库不是永久 Brand Architecture 原则，只是当前技术实现选择。GitHub 仓库结构不得决定品牌结构。

未来可以根据真实需要采用 Monorepo、Multiple repositories、Shared backend、Separate backend、Shared infrastructure、Separate databases、Independent deployment 或 Different AI Providers，只要不违反 Brand inheritance、Privacy、Data ownership、Portability、Product separation 与 User control。

## Product Independence Principle

未来每一个正式产品应尽量支持：

- Independent Release
- Independent Pause
- Independent Migration
- Independent Data Permission
- Independent AI Provider
- Independent Domain Rules
- Independent Product Lifecycle

一个产品的暂停、失败、迁移、Provider 更换或技术重构，不应强迫其他产品同时重构。共享 Brand Foundation 不等于强耦合产品运行时。

> Shared Brand, Separable Products.

## No Premature Expansion

架构允许未来扩展，但产品开发必须跟随真实验证。“未来可能做”不等于“现在就应该做”。

```text
Validate Health
→ Learn
→ Review
→ Decide Expansion
```

不得用“先设计所有未来产品、先建立复杂度、再期待未来需求出现”的顺序替代真实验证。

## Product Name ≠ New Mother Brand

`[Brand] Health` 与 `[Brand] FI` 目前只能作为架构示例，不是最终命名、已批准商标、已批准公开品牌或新的独立母品牌。

最终母品牌名称和产品名称留给 Naming Brief Founder Review，本次决定不自动确定任何名称。

## Product Admission Rule

Future Possibility 不能只因为技术上可实现就成为正式产品。进入正式产品体系至少需要满足：

### 1. Clear User Problem

存在明确、真实、值得解决的问题。

### 2. Brand Alignment

与 Brand DNA 和 Brand Positioning 一致。

### 3. Product Principles Review

能够通过 Product Review Gate。

### 4. Clear Data Boundary

能够说明收集什么、为什么收集、数据属于哪个 Domain、是否需要跨产品数据，以及权限边界是什么。

### 5. Existing Product Safety

不会为了新产品破坏已有 Active 产品。

### 6. Founder Approval

必须经过 Founder 明确批准。

不得由 AI、Codex、自动化系统或产品建议算法自行升级 Future Possibility 为正式产品。

## Product Lifecycle States

### Proposed

存在值得继续研究的产品方向，尚未进入真实验证。

### Validating

正在通过真实使用验证问题、价值、使用方式、风险与产品闭环。

### Active

已通过 Founder Review，成为正式持续维护产品。

当前状态：

- Health = Validating（Founder Private Validation）
- Financial Intelligence = Proposed（Proposed Product Direction）
- Learning = Proposed / Future Possibility
- Career = Proposed / Future Possibility
- Life / Personal Growth = Proposed / Future Possibility

这里只建立治理定义，不创建复杂生命周期管理系统。

## Architecture Decision Rule

**母品牌一致性 > 子产品个性化，用户边界 > 跨产品整合，可分离性 > 短期便利，真实验证 > 提前扩张。**

中文是正式核心表达。英文仅作为辅助说明：

- Brand consistency over product customization.
- User boundaries over cross-product integration.
- Separability over short-term convenience.
- Real validation over premature expansion.

含义：子产品可以有领域特色，但不能违背母品牌核心；跨产品整合不能突破用户权限；开发便利不能形成永久技术锁定；架构允许不能替代真实验证。

## Architecture Review Checklist

重大架构变更至少回答：

1. 这是母品牌变化，还是产品变化？
2. 是否会改变已批准 Brand Foundation？
3. 是否影响其他产品的独立性？
4. 是否扩大跨产品数据访问？
5. 用户是否主动授权？
6. 是否造成不必要技术耦合？
7. 是否使未来迁移更困难？
8. 是否为了未验证未来需求增加当前复杂度？
9. 是否应该进入 Founder Review？

## 当前批准状态

- Brand Architecture：`Approved`
- Architecture model：`Branded House`
- Mother Brand：`[Brand Name Pending]`
- Health：`Validating / Founder Private Validation`
- Financial Intelligence：`Proposed Product Direction`
- Learning / Career / Life：`Future Possibility`
- 最终品牌名称：`Pending`
- 最终产品命名：`Pending`
- Brand Foundation overall：`Proposed / Founder Review`

## 实施边界

本次批准只建立 Brand Architecture governance source of truth，不要求修改当前 Health MVP。不得因此新增未来产品页面、导航、Agent、数据库、跨产品数据层、多用户系统或商业化能力，也不得自动拆分或合并仓库。

## 已形成内容

已批准 Branded House、母品牌继承、产品数据默认隔离、跨产品授权、技术拓扑解耦、产品独立性、产品准入、三级生命周期与 Architecture Decision Rule。

## 仍待确认事项

- 最终品牌名称与产品命名。
- Naming Brief 与 Brand Guardrails 的创始人审核。
- 任何 Future Possibility 是否进入独立 Founder Review。
