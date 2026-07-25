---
title: Restore Test
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# 恢复测试

1. 将 `AI-Core-Pack` 复制到一个空目录。
2. 验证 `FILE_INDEX.md`。
3. 验证 `CHECKSUMS.txt`；它应覆盖其他全部最终文件，但不包含自身校验值。
4. 验证 `VERSION.json`。
5. 将 `AI_CONTEXT_COMPLETE.md` 上传到一个没有旧聊天记录的新 AI 会话。
6. 使用 `NEW_AI_BOOTSTRAP_PROMPT.md`。
7. 检查新 AI 是否理解项目。
8. 不要使用旧聊天记录填补缺失信息。
9. 记录缺失项、冲突和误解。
10. 如果恢复失败，修正正式来源文件。
