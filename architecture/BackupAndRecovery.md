---
title: Backup and Recovery
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# 备份与恢复

未来的备份应由用户控制、可迁移，并与 Git 清晰分离。备份包可以包含健康记录、分析历史、报告、附件索引、Schema 版本和校验值。

备份不应自动上传。用户应能够导出、检查、保存第二份副本、恢复和删除。

本 Sprint 只创建 Schema 和迁移交接文件，不导出私人健康记录。
