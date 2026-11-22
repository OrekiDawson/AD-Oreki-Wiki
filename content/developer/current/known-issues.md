---
title: "待核实事项与已知问题"
description: "截至 2026-11-20：区分已修复源码、待构建运行的 Android P1，以及仍需逐项验证的双端问题"
tags:
  - 问题
  - 状态
aliases:
  - "/current/known-issues"
---

本页只列有明确来源的现行问题，不把历史 BUG 自动归到最新 APK，也不把“修复已提交”写成“运行已通过”。

**最后核实：2026 年 11 月 20 日 21:18（UTC+8）。**

## 当前最重要的 Android 问题

### EC 与首现实后的自动化停滞

旧 R121 APK 的 KVM 真新档在 EC5 后停约 **649 秒**。当时 EC5 已完成 `5/5`，但挑战启动清空了当前无限、IP 和 Break；主循环只靠这些当前字段判断“是否曾完成无限”，于是错误进入首次无限前分支，挑战、现实和终局自动化均不再推进。

源码修复把大永恒、永恒和现实次数加入不可逆进度证据，不写存档、不改门槛、不发放资源。相关提交与失败时间线见 [PR #204](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/204) 与 [EC 阶段 P1 报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/a1617a9e0d652a16ba050be25bb3f5b1a5ef1c43/reports/R121-01/R121-01-P1-post-ec-infinite-reset.md)。

同一跑次约 `t=4035.6s` 首次现实后，无限、IP、Break 与永恒计数再次全部归零，只剩 `realities=1`；自动化停约 **570 秒**后才被其他原版路径恢复 Break。源码增加了现实次数判定，但该修复尚未重新构建，也尚未完成全新存档运行复验。

状态：**源码修复已提交，Android 运行复验 NOT RUN**。

### EC 切换固定等待

修复前的 KVM 记录显示 EC1～EC3 每次完成后要等约 9 分钟才启动下一挑战，原因是永恒层坍缩固定等待成长窗口。R121 已加入受约束的 Break 恢复：只在首现实前、挑战外、Break 丢失、可坍缩且不可永恒时提前结算，并要求投影 IP 足够。定向真实存档在约 10 秒触发坍缩、约 30 秒恢复 Break；最终 APK 仍需完整新档验证。

状态：**定向复验 PASS；完整终局仍 NOT RUN**。定向时间线、存档来源与证据目录见 [R121 Break 恢复报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/a1617a9e0d652a16ba050be25bb3f5b1a5ef1c43/reports/R121-01/R121-01-P1-break-recovery.md) 与 [2026-11-20 · R121 Android KVM 新档阶段推进与 P1 停滞](/developer/history/2026-11-20-r121-android-kvm)。

## 仍需验证的交付项

| 主题 | 当前状态 | 下一步 |
| --- | --- | --- |
| Android R121 全新存档 ≤180 分钟 | **未 PASS** | 用包含两项 P1 修复的同一 APK 重建、重装并跑到 `isGameEnd=true` |
| Android 终局后持续确认 | **NOT RUN** | 通关后继续观察至少 180 秒，检查存档、日志与 GUI |
| R121 正式 Release | **NOT RUN** | 通过 candidate/verification/双端完成证据和签名发布门禁 |
| 本地 SSH/SFTP 第四渠道 | **待独立核实** | 从可信来源拉取同一 APK，比对 SHA-256 并保存原子更新回执 |
| Android/Web 逐场景等价 | **NOT RUN** | 对挑战、门禁、资源、存档、自动化和 GUI 使用同条件场景 |
| AGP-only 完整迁移 | **进行中** | 以 Issue #25/#61 的分闭包验收为准，不以 CI 源码检查代替完整迁移 |
| `build_mod.py` 退役 | **未完成** | 生产依赖归零并有 CI 防回流证据 |

## 不应误读的历史问题

R113-01 的 180 分钟 FAIL、混合协程 livelock 和早期 Reality 自动永恒复位都是真实历史结果，分别绑定当时 APK 与提交。它们不能证明当前 R121 APK 同样失败，也不能反过来证明 R121 已修复。历史关系见 [2026-11-15 · R113-01 新档 180 分钟长跑 FAIL](/developer/history/2026-11-15-r113-180min-fail)、[2026-11-15 · R114-01 现实自动永恒复位修复](/developer/history/2026-11-15-r114-reality-autoeternity) 与 [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)。

## 相关页面

[当前项目状态](/developer/current/project-status) · [发布状态](/developer/current/release-status) · [智能自动购买器](/player/gameplay/automation) · [阶段门禁](/player/gameplay/stage-gates) · [双端行为一致性](/developer/architecture/parity)
