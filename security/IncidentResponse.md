---
title: Incident Response
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# 安全事件响应

如果怀疑私人数据或密钥已被提交：

1. 停止增加会进一步扩散数据的 Commit。
2. 确认文件路径、数据类型和暴露级别。
3. 对于密钥，立即撤销并轮换。
4. 对于健康数据，移除当前文件内容，并评估 Git 历史中的暴露情况。
5. 与仓库所有者共同决定是否需要重写历史。
6. 记录事件，但不要复制敏感值。
7. 增加预防规则或测试。
