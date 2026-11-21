---
title: "运行证据索引"
description: "Android/Web 真实运行、构建、CI、存档与发布证据的阅读顺序和边界"
tags:
  - 证据
  - 验收
  - 开发者
---

本页是运行证据的导航，不复制完整日志。阅读结论前先找到适用源码 Commit、候选 APK 或 Web 部署 Commit、运行环境和原始记录；旧版本证据只能解释历史，不能替代当前候选验收。

## 证据类型

| 证据 | 能证明什么 | 不能替代什么 |
| --- | --- | --- |
| 源码与单元测试 | 实现路径、边界条件和可重复的纯逻辑行为 | 真实 GUI、存档互通、完整节奏与终局通关 |
| CI 与构建回执 | 指定 Commit 在指定环境下完成检查或产出构建 | APK 可安装、真实运行 PASS 或正式发布 |
| AVD/真机日志与截图 | 具体设备上的安装、界面、阶段和故障现象 | 其他版本、其他存档或完整玩家体验 PASS |
| 存档往返测试 | 指定存档在导入、游玩和再次导出后的字段与可用性 | 所有历史存档天然兼容 |
| 发布记录 | 正式资产、渠道与线上版本 | 后续未部署源码已经生效 |

## 阅读顺序

1. 在 [当前项目状态](/developer/current/project-status) 找到最后核实时间与适用版本。
2. 在 [发布状态](/developer/current/release-status) 确认候选或正式发布记录。
3. 在 [来源索引](/developer/references/source-index) 打开固定 Commit、PR、Run、报告或存档测试记录。
4. 对技术与历史差异，分别阅读 [架构与运行时](/developer/architecture/)、[构建与交付](/developer/build/) 和 [历史归档](/developer/history/)。

## 状态纪律

每个独立门禁只能记录 `PASS`、`FAIL`、`BLOCKED` 或 `NOT RUN`。`GAMEPLAY LEGALITY`、`PACING`、`ENDGAME`、`POST-ENDGAME STABILITY` 与 `SAVE COMPATIBILITY` 不得互相替代；ENDGAME PASS 不代表 PACING PASS。完整日志应保存在可追溯的归档中，PR 中保留精简结论、关键故障样本和固定链接。
