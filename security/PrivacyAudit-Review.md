---
title: Privacy Audit Warning Review
status: draft
version: 0.1.0
last_updated: 2026-08-05
owner: engineering
source_of_truth: true
---

# 隐私审计 Warning 复核

## 范围

本文件复核 `npm run audit:privacy` 当前报告的 9 条 warning。审计记录和规则保持不变；本文件只记录人工判断，不抑制 warning，也不回写疑似私人内容。

## 必须修复

当前没有发现必须立即修复的 warning。自动审计未发现高可信 Secret，人工复核也未发现可识别的真实个人资料。若后续发现 warning 与真实身份或真实健康记录相关，必须立即升级为 High、停止发布并按事件响应流程处理。

## 可接受风险

| Warning 编号 | 风险等级 | 处理决定 | 负责人 | 状态 |
| --- | --- | --- | --- | --- |
| PA-01 | Low | `src/__tests__/agents.test.js` 使用不关联真实身份的虚构健康 Fixture；保留 warning 作为持续提醒。 | engineering | Reviewed / Accepted |
| PA-02 | Low | `src/__tests__/foundationValidationReview.test.js` 使用 `example.com` 测试邮箱验证规则；属于标准保留域名。 | engineering | Reviewed / Accepted |
| PA-03 | Low | `src/__tests__/healthDataDomain.test.js` 使用虚构结构化健康 Fixture；无姓名、联系方式或账号关联。 | engineering | Reviewed / Accepted |
| PA-04 | Low | `src/__tests__/liveAgentAnalysis.test.js` 使用虚构 Agent 分析 Fixture；仅用于规则测试。 | engineering | Reviewed / Accepted |
| PA-05 | Low | `src/__tests__/privacyAudit.test.js` 必须包含合成风险 Fixture 才能验证审计规则；测试不含真实 Secret。 | engineering | Reviewed / Accepted |
| PA-06 | Low | `src/__tests__/recordFormModel.test.js` 使用虚构表单 Fixture；不关联真实用户。 | engineering | Reviewed / Accepted |
| PA-07 | Low | `src/components/AuthPanel.jsx` 仅包含标准保留域名的邮箱占位符，不是用户邮箱；本台账不回显该字符串。 | engineering | Reviewed / Accepted |
| PA-09 | Low | `src/data/sampleData.js` 已明确标记 `Demo Runner A` 和“虚构示例”，不代表真实个人档案。 | product | Reviewed / Accepted |

## 后续优化

| Warning 编号 | 风险等级 | 处理决定 | 负责人 | 状态 |
| --- | --- | --- | --- | --- |
| PA-08 | Medium | `src/components/recordFormModel.js` 包含多个精确默认值但没有身份信息；本 Sprint 不修改业务逻辑。后续产品 Sprint 应评估改为明显虚构的 Demo 工厂或空白默认值。 | product / engineering | Open / Planned |

## 总结

- 必须修复：0。
- 可接受风险：8，均已人工复核并保留自动 warning。
- 后续优化：1，不阻塞本次文档 Review Fix，但在公开产品数据策略复审时重新评估。
- 高可信 Secret：0。
- Git 历史、未跟踪文件、二进制图片和外部服务数据仍不属于当前文本审计范围。

## Review Findings

9 条 warning 均可由测试 Fixture、标准邮箱占位符、明确标记的虚构示例或无身份关联的表单默认值解释。当前没有证据表明真实个人健康数据或真实密钥进入仓库。

## Resolution

保留全部 warning；使用本台账记录人工决定。任何文件内容变化后，必须重新运行审计，并确认编号与当前输出仍对应。

## Remaining Issues

- PA-08 等待后续产品 Sprint 优化。
- 自动审计尚未覆盖 Git 历史和二进制图片。
- 仓库公开范围变化前仍需重新人工复核。
