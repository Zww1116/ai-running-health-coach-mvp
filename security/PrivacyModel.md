---
title: Privacy Model
status: proposed
version: 0.1.0
last_updated: 2026-07-25
owner: engineering
source_of_truth: true
---

# 隐私模型

本项目坚持隐私优先（privacy-first）和本地优先（local-first）。本地优先表示浏览器是默认存储位置，并不表示数据必须永远只保存在本地。云端同步和 AI 数据共享都必须由用户明确选择。

健康数据与项目资产相互分离。Git 保存项目资产；由用户控制的本地存储或私有数据库保存健康数据。

向任何 AI 提供商发送数据前，用户应能够审阅、最小化并确认分析数据包。
