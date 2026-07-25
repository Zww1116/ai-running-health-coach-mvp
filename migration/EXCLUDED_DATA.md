---
title: Excluded Data
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# 排除的数据

AI 交接包排除 `.env`、`.env.*`、`node_modules/`、`dist/`、`exports/`、`backups/`、`private-data/`、`private-profile/`、数据库文件、健康图片、私人导出、日志、Git 内部文件、API 密钥、Secrets 和 Token。

生成的交接文件只用于导出项目上下文，不是正式来源。
