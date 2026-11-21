---
title: "项目概览"
description: "Oreki Edition Android/Web 的目标、平台基线、仓库分工，以及当前发布与通关证据边界"
tags:
  - 概览
aliases:
  - "/getting-started/project-overview"
---

**Oreki Edition** 是《反物质维度》的 Android 与 Web 双端修改版本。它希望让重复操作更省心，同时保留阶段推进、挑战和手动决策的游戏乐趣。

## 我们正在追求什么

首要目标是 **双端行为一致、操作顺畅、自动化可控**：同样的游戏条件下，Android 和 Web 应产生等价的解锁、资源扣费、挑战结算、自动购买与存档结果。界面布局不必像素级相同，但操作反馈应及时、功能应可发现。

**真实墙钟 ≤180 分钟合法通关**已经成为长期回归门槛，而不是唯一的速度竞赛。任何平台都不得靠直接赠送资源、伪造挑战完成或提前标记结局来满足指标。

## 阅读项目与源码

| 仓库 | 负责什么 |
| --- | --- |
| [Android](https://github.com/OrekiDawson/AD-Oreki-Edition-Android) | Kotlin 游戏业务、AGP 生产构建、AVD 验收、正式 APK 发布 |
| [Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web) | 浏览器游戏、Playwright 及移动 Chrome 验收、oreki.net |
| [知识库](https://github.com/OrekiDawson/AD-Oreki-Wiki) | 原版中文资料、MOD 机制说明、证据与发布状态 |

项目也有统一管理工作区，用于协调任务、事实、报告与跨平台改动，不替代三个仓库各自的 CI/CD。

## 版本与基线

Android 基于官方 **3.21.0** 冻结基线；Web 依据 **2026-07-17** 的上游源码快照 `5409e320cecef96a917cca1dfb68f1f183e499ca`。两端的内部实现、版本号可以不同，但玩家可见的业务规则须按专项验证对齐。未经授权不自动升级冻结基线。

## 当前应看哪些证据

- **Android 已有新的公开 GitHub Release**： [3.21.0（a12b5cd6）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases/tag/android-update-3.21.0-a12b5cd6)。四渠道交付状态的精确边界见 [发布状态](/developer/current/release-status)。
- **Web 已记录真实新档终局 PASS**：默认 **3000×**、空浏览器存储，`isGameEnd` 于墙钟 **10,451.1 秒**首次为真；固定证据见 [完成记录](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/f7044da0f80a50ccbe5cd827fea717b4d5a1eae6/reports/R104/web/r121-01/README.md)。
- **Android R121 仍在真实验收**：KVM 新档已到首现实，但终局未产生；重置后阶段判据 P1 的运行复验为 **NOT RUN**，将在包含两项修复的新构建中实跑；EC 切换固定等待 P1 的定向复验为 **PASS**（[固定报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/a1617a9e0d652a16ba050be25bb3f5b1a5ef1c43/reports/R121-01/R121-01-P1-break-recovery.md)），完整终局仍为 **NOT RUN**。旧 R113 FAIL 不能代替当前结论。详见 [当前项目状态](/developer/current/project-status)。

## 接下来读什么

玩家可从 [游戏总览](/player/antimatter-dimensions) 和 [原版与 MOD 的区别](/player/gameplay/original-vs-mod) 开始；开发者可读 [双端一致性](/developer/architecture/parity)、[自动化](/player/gameplay/automation)、[AGP 构建](/developer/build/agp) 和 [存档兼容](/player/gameplay/saves)。

[最新进展](/developer/current/project-status) · [原版 Wiki 中文翻译](/player/original/) · [原始资料索引](/developer/references/source-index)
