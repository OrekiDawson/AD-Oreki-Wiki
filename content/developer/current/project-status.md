---
title: "如何阅读双端项目状态"
description: "用证据边界判断 Android 与 Web 的构建、运行、终局和发布结论"
tags:
  - 工程决策
  - 状态判断
  - Android
  - Web
aliases:
  - "/current/project-status"
---

项目状态不是一盏只会变绿或变红的指示灯。源码检查、构建产物、设备安装、真实新档和正式发布分别回答不同问题。本页把当前可核查的双端事实转换成决策规则：什么时候可以继续推进，什么时候必须停在候选阶段，什么时候不能把一项成功外推到另一项。

**最后核实：2026 年 11 月 26 日 17:22（UTC+8）。**

## 先看结论边界

当前最稳固的结论是：Web 已有一份可追溯的真实新档终局记录；Android 的开发候选可以安装并推进到首次现实，但终局仍未完成，不能作为正式发布版本。Web 的 [运行说明](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/f7044da0f80a50ccbe5cd827fea717b4d5a1eae6/reports/R104/web/r121-01/README.md)记录首次 `isGameEnd=true` 于 10451.1 秒，[结构化摘要](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/f7044da0f80a50cc5be5cd827fea717b4d5a1eae6/reports/R104/web/r121-01/summary.json)给出同一运行的事件和哈希边界；Android 的阶段故障与修复边界见 [故障排查](/developer/troubleshooting/)。旧 Android 候选的故障报告记录 APK SHA-256 `43e3f4fc42017541a37b81f7440e58fe8a67380ed9ff601d440038947091f1ac`；这不是修复后候选的发布证明。

这意味着以下判断可以成立：

- Web 的该次运行在 `isGameEnd=true` 时完成了终局判定，不能自动证明 Android 等价；
- Android 候选曾完成安装、设备回拉哈希校验和多阶段推进，不能自动证明终局、节奏或发布合格；
- 源码修复和 CI 通过可以允许继续构建，不能替代新存档运行；
- 旧正式 APK 仍是公开下载版本，开发候选不能因为 `versionCode` 更大就取代它。

## 用四个问题做工程决策

面对“现在能不能发布”或“这个修复是否有效”，依次问：

### 代码真的包含修复吗？

查看固定源码 Commit、构建配置和产物检查。Android 当前调查基线可从 [来源索引](/developer/references/source-index) 的 Kotlin 接管层、绑定表和构建脚本开始。这个问题只证明实现进入了候选构建输入，不证明设备运行时执行到了它。

### 产物真的装的是这份代码吗？

比较构建产物与设备回拉 APK 的 SHA-256，并记录包名、版本和安装方式。哈希一致能排除“测试了另一份 APK”，但不能证明游戏状态迁移、节奏或终局正确。

### 真实玩家路径是否走通？

从全新应用数据开始，记录阶段事件、重置前后状态和终局字段。Android 曾在候选跑次中到达首次现实，却在重置后暴露自动化停滞；这正说明“能进入下一阶段”和“能连续走完全部阶段”是两个验收问题。

### 发布对象是否满足身份与渠道门禁？

确认签名、版本状态、正式 Release 和渠道哈希。当前公开 Android 版本是 `android-update-3.21.0-a12b5cd6`；`versionCode=30210002`、`modVersionState=development` 的候选仍不是正式 Release。细节见[发布状态](/developer/current/release-status)和[APK 签名与升级兼容](/developer/build/apk-signing)。

## 当前双端证据如何使用

| 结论 | 可以据此做什么 | 仍不能据此做什么 |
| --- | --- | --- |
| Web 新档出现 `isGameEnd=true` | 继续分析 Web 的终局路径与性能边界 | 宣称 Android 终局通过或双端逐场景等价 |
| Android 候选安装且回拉哈希一致 | 继续在该精确产物上做设备调查 | 宣称 APK 已发布或游戏体验合格 |
| Android 阶段推进到首次现实 | 检查重置后的状态机和不可逆进度判据 | 宣称 180 分钟终局通过 |
| 源码增加重置后的历史进度判据 | 重新构建并安排定向运行 | 宣称修复已被正式 APK 验证 |
| CI 或构建成功 | 进入下一道产物/运行门禁 | 替代设备、存档和真实节奏验收 |

表格的用途是防止越级推断，不是给项目贴一个永久状态标签。每当源码、APK 或部署 Commit 改变，都应重新绑定证据，而不是沿用旧候选的结论。

## 目前最值得优先处理的工程问题

Android 的首要风险是重置后的自动化状态机：当前资源会归零，历史进度不能归零；如果调度器只读前者，就会在挑战或现实之后回到错误分支。[自动化停滞排查](/developer/current/known-issues)给出状态快照和最小复现思路。

第二个风险是交付链的误读。旧正式 APK 可下载，不代表开发候选也已通过终局；候选安装成功，不代表签名、升级、存档和渠道交付全部完成。把这些结论拆开，反而能更快找到真正缺失的一步。

## 读者下一步

如果你在改代码，先读[Android 架构](/developer/architecture/android)、[Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)和[自动化停滞排查](/developer/current/known-issues)。如果你在判断候选能否交付，先读[构建与 CI/CD](/developer/build/ci-cd)、[APK 签名](/developer/build/apk-signing)和[运行证据索引](/developer/evidence/)。如果你只需要确认公开下载对象，直接查看[发布状态](/developer/current/release-status)。
