---
title: "当前项目状态"
description: "截至 2026-11-20：Web 174.19 分钟真实新档通关 PASS，Android R121 仍在真实验收且暴露自动化 P1"
tags:
  - 状态
aliases:
  - "/current/project-status"
---

这一页只总结**目前可查证的双端进展**。发布过的 APK、构建成功、AVD 长跑和正式发布是四种不同证据；页面会把“已发布”“已安装测试”“仍待验收”分开写。

**最后核实：2026 年 11 月 20 日 21:18（UTC+8）。**

## 当前结论

Web 已有一份可追溯的真实新档终局证据：使用默认 **3000×** 游戏速度，从空浏览器存储开始，墙钟 **10,451.1 秒（174.19 分钟）** 时原版 `player.isGameEnd` 首次变为 `true`，处于 10,800 秒硬上限内。证据固定在 Web 仓库的 [R121-01 完成记录](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/f7044da0f80a50ccbe5cd827fea717b4d5a1eae6/reports/R104/web/r121-01/README.md) 与 [机器可读摘要](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/f7044da0f80a50ccbe5cd827fea717b4d5a1eae6/reports/R104/web/r121-01/summary.json)。

Android 当前公开可下载版本仍是旧正式版 a12b5cd6；R121 的最新 APK `43e3f4fc…f1ac` 已在 KVM AVD 中完成**安装与回溯校验**，但真实新档尚未通关。该跑次已推进到首次现实，并复现了两个会让自动化长时间停摆的 P1；源码修复已进入 [PR #204](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/204)，仍需重新构建、全新安装和完整运行验收。因此 Android 180 分钟终局仍为 **NOT RUN / 未 PASS**。

## 双端进度表

| 项目 | 当前状态 | 证据边界 |
| --- | --- | --- |
| Web 真实新档通关 | **PASS**，10,451.1 秒，默认 3000× | 原版 `isGameEnd=true`；终局后持续保持；页面、控制台和冻结告警为 0 |
| Android R121 KVM 安装 | **PASS** | 设备回拉 APK SHA-256 与构建产物一致 |
| Android R121 真实新档 | **NOT RUN（终局）** | 已到首次现实；页面核实时尚无 `isGameEnd=true` |
| Android 180 分钟目标 | **未 PASS** | 旧正式版与 R121 候选不能互相代替 |
| 双端逐场景等价 | **NOT RUN** | 两端各有运行证据，不等于挑战、门禁、自动化与存档逐项等价 |

## Android R121 已观察到的阶段

最新有效 KVM 跑次从全新存档开始，观察到：

- 首次无限约 `142.9s`，记录在 [R121 验收 PR](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/204) 的 KVM 证据中；
- 首次 Break 约 `526.8s`，首次永恒约 `744.8s`；
- EC1～EC5 真实达到各 `5/5`；随后 EC6～EC11 也在同一跑次达到 `5/5`；
- 约 `t=4035.6s` 首次出现 `realities=1`。

这些数据说明阶段可以推进，但还不能证明终局。旧 APK 在 EC5 后曾因“曾完成无限”判定丢失而停约 **649 秒**；首次现实后同一类判定再次让自动化停约约 **570 秒**，直到 Break 被其他原版路径恢复。EC 切换固定等待 P1 的定向复验为 **PASS**，见 [Break 恢复固定报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/a1617a9e0d652a16ba050be25bb3f5b1a5ef1c43/reports/R121-01/R121-01-P1-break-recovery.md)；重置后阶段判据 P1 已在源码修复，等待新构建实跑。根因与证据见 [R121 Android KVM 阶段记录](/developer/history/2026-11-20-r121-android-kvm)。

## 发布边界

已发布的 Android release 仍是 `android-update-3.21.0-a12b5cd6`，详见 [发布状态](/developer/current/release-status)。R121 的 `versionCode=30210002`、`modVersionState=development`，当前没有把它写成正式 Release，也没有四渠道发布结论。

## 进一步阅读

- [当前待核实问题](/developer/current/known-issues)
- [智能自动购买器](/player/gameplay/automation)
- [阶段门禁](/player/gameplay/stage-gates)
- [双端行为一致性](/developer/architecture/parity)
- [历史归档](/developer/history/)
