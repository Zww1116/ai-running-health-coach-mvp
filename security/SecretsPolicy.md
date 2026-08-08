---
title: Secrets Policy
status: approved
version: 0.1.1
last_updated: 2026-08-08
owner: engineering
source_of_truth: true
---

# 密钥策略

- 前端代码绝不能包含 Supabase `service_role` 密钥。
- API Secret 不得使用 `VITE_` 前缀，因为 Vite 会把这些值暴露到浏览器 Bundle 中。
- `.env` 文件不得提交。
- GitHub Actions 必须使用加密 Secrets 保存部署时所需的值。
- 如果密钥泄露，应立即撤销并轮换。
- 从当前文件中移除密钥，并不能使 Git 历史自动变得安全。
