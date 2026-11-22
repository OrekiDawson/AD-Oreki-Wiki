---
title: "2026-11-15 · 天神策略叶子缺失与补实现"
description: "记录 R113 长跑中 strategy degraded / unknownLeaf 的定位、Kotlin 补实现与 BitSet 读取修正"
tags:
  - 历史
  - 玩法
  - Android
aliases:
  - "/history/2026-11-15-celestial-leaves-fix"
---


> 本页是历史归档，记录当时的定位与修复过程，**不代表当前状态**。现行机制见 [天神系统](/player/gameplay/celestials) 与 [现实与时间研究](/player/gameplay/reality-time-studies)。

## 事件与时间

2026-11-15 的长跑中，首次现实（12:52:58）后自动化策略进入 `degraded=1`，`OREKI_GOAL` 长期固定 `stage=13 unlock-eternity unknownLeaf=8`，直到长跑结束（realities=2、creditsFinished=false）。

## 当时结论

- 日志显示 `celestial.pelleUnlocked / laitelaUnlocked / raUnlocked / vUnlocked / enslavedUnlocked / effarigUnlocked / teresaUnlocked` 共 7 个叶子从未接线，`automator.unlocked` 也会触发一次 unknown。
- 修复在 Kotlin 业务代码 `OrekiStrategyLeaves.kt` 中新增 8 个叶子实现，读不到时返回 false，不再返回 NaN 触发 fail-closed degrade（PR #91）。
- Codex 审查指出 `Player$Teresa/Effarig/V.unlockBits` 与 `Player$Reality.imaginaryUpgradeBits` 是 `BitSet` 而不是数字；改为反射调用 `BitSet.f()J` 读取内部 long 位掩码（`BitSet.smali:360-369`）。
- 复验：`build/r113-leaffix3`（APK `1bc6705a…`）晚期夹具 `unknownLeaf=0`、无 unwired、无崩溃；全新存档 12 分钟 `unknownLeaf=0`。

## 后续变化与是否仍然有效

- **仍然有效**：策略叶子实现与 `BitSet` 读取方式留在 Kotlin 业务代码中。
- **当时未解决**：60 分钟新档 realities 仍为 2，`OREKI_REALITY_DIAG canReality=false` 持续，RM 顶到原版硬上限 `hardcapRM = 1e1000`。该问题继续由 R114-01 处理。
- **后续修正**：`imaginaryUpgradeBits` 的位号在 R114-01 被修正——Android 3.21 移植版使用内部 id：莱特拉 bit4（`0x4`）、佩勒 bit14（`0xe`），而不是 Web 的 15/25；见 [2026-11-15 · R114-01 现实自动永恒复位修复](/developer/history/2026-11-15-r114-reality-autoeternity)。

## 原始证据

- [CELESTIAL-LEAVES-FIX 报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/4a800464ef820bf6e3fcb692a835ee2c2c749aec/reports/R113-01/CELESTIAL-LEAVES-FIX.md)
- [Android PR #91](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/91)，合并 Commit `4a800464ef820bf6e3fcb692a835ee2c2c749aec`

## 相关条目

[天神系统](/player/gameplay/celestials) · [现实与时间研究](/player/gameplay/reality-time-studies) · [2026-11-15 · R113-01 新档 180 分钟长跑 FAIL](/developer/history/2026-11-15-r113-180min-fail)
