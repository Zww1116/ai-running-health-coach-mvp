---
title: Initial Privacy Audit
status: approved
version: 0.1.2
last_updated: 2026-08-08
owner: engineering
source_of_truth: true
---

# 初始隐私审计

## 可重复执行的命令

运行：

```bash
npm run audit:privacy
```

对应脚本为 `scripts/privacy-audit.mjs`，仅使用 Node.js 内置模块。脚本通过 `git ls-files` 获取 Git 当前跟踪文件，因此未被 Git 跟踪的本地文件不属于本次自动审计范围。

## 自动审计范围

- 扫描 Git 当前跟踪且可读取的文本文件。
- 跳过检测为二进制的文件，不读取 `node_modules`、`dist`、`exports`、`backups` 或 Git 内部对象，除非这些内容被错误地加入 Git 跟踪。
- 高可信检查包括：私钥头、`service_role` key、OpenAI 风格 API Key、GitHub Token 和 Bearer Token。
- 人工复核提示包括：邮箱、中国大陆手机号，以及多个精确个人健康指标同时出现的组合。
- 疑似密钥仅以打码形式输出；疑似个人信息只报告文件名与风险类型，不回显原始内容。

## 退出规则

- 发现高可信 Secret 时，命令以失败状态退出。
- 发现可能的个人信息时，只输出 warning，命令仍可成功。
- 文件无法读取时，输出 warning；脚本不会在未扫描该文件的情况下声称该文件安全。

## 初始结果

当前自动审计未发现高可信 Secret。现有人工复核提示来自测试数据、示例健康数据和界面邮箱占位符；这些内容仍需在公开发布前由维护者确认其为虚构数据。

9 条 warning 的逐项风险、处理决定、负责人和状态见 [PrivacyAudit-Review.md](PrivacyAudit-Review.md)。该复核不删除或抑制原始审计 warning。

## 自动审计不能替代的检查

- 仓库公开过渡安排与默认保留全部权利的决策见 `project/decisions/ADR-0004-Repository-Visibility-And-Licensing.md`；未来迁移私有仓库仍需人工验证。
- 图片、压缩包和其他二进制文件需要单独检查。
- 未跟踪文件、浏览器本地存储、Supabase 数据和外部服务数据不在本脚本范围内。
- 每次公开发布、接入新 AI 提供商或提交数据导出文件前应重新运行审计。

## 建议

- 继续忽略 `.env`、导出包、备份、私人档案、数据库和健康备份文件。
- Git 中只保留虚构的演示用户数据。
- 外部 AI 优先接收脱敏后的分析包（analysis packet），不直接接收原始健康记录。
