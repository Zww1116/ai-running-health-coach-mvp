---
title: Data Ownership and Boundaries
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# 数据所有权与边界

## GitHub 可以保存

- 代码。
- 品牌概念。
- 产品文档。
- 架构。
- 通用 Agent 规则。
- 通用 Prompt。
- 通用健康知识。
- Schema。
- 测试。
- 项目决策。

## GitHub 禁止保存

- 真实个人健康资料。
- 每日健康记录。
- 经期记录。
- 疼痛记录。
- 医疗文件。
- 健康照片。
- 邮箱验证码。
- API 密钥。
- Supabase `service_role` 密钥。
- Access Token。
- 私人数据导出包。
- 数据库文件。
- 未脱敏日志。

健康数据归用户所有。云端同步必须是由用户选择启用的能力，而不是隐藏的默认行为。
