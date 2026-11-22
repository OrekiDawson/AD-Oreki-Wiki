---
title: "Android 阶段门禁与 GUI 判据"
description: "Android 3.21 的阶段判定方法、兼容存档误判、非法页面直达恢复与历史验证边界"
tags:
  - Android
  - 门禁
  - GUI
  - 故障排查
---

本页保存原玩家条目中不适合普通教程的**开发者技术依据**。其诊断与运行状态是历史结论（整理自 2026-11-22 前的资料），不直接代表最新 APK 已通过复验。玩家操作说明请读[阶段解锁与页面显示](/player/gameplay/stage-gates)。

## 判定汇聚点

Android 3.21 的关键门禁汇聚在少数方法上：

- `bm4.g()` / `bm4.h()`：阶段判定；
- `ll2.g()`：门禁聚合；
- `MainActivity.W8()`：页面切换前置检查。

MOD 的做法是在这些汇聚点接入统一的阶段判定，而不是在大量界面回调里各写一份条件。

## GUI 阶段真值：为什么不能只看一个字段

3.21 原版 `f82.j()` 只用 `Player.eternities > 0` 之类的单一字段判断「是否进入永恒」。但兼容数据里该字段可能被初始化为非零（历史设备实测曾读到 `eternities=11`，同时永恒点数为 0、`bigEternities=0`、永恒升级位图为空），于是原版自己会把永恒专属 GUI 提前打开——这正是「无限阶段显示永恒内容」的根因。

MOD 因此引入 `OrekiGuiStage.kt` 作为**全游戏 GUI 阶段判定的唯一真值来源**，用真实结算产物组合判断：

- 永恒已结算 = 永恒点数为正 **或** `bigEternities` 为正 **或** 已购永恒升级位图非空 **或** 现实已结算；
- 现实已结算 = `realities` 为正 **或** `bigRealities` 为正。

这样既不依赖单一字段，也不会因为高层重置清空低层计数而误判。[读码 + 存档取证]

## 非法直达的拦截与恢复

对「玩家或自动化直接跳到未解锁页签」的路径，要求是：

- 在页面切换前置检查中拦截；
- 回退到原版合法页面（原版回退入口）；
- **不写存档、不清零永恒字段、不改资源、不扫描 View**；
- 恢复后玩家能继续正常游戏。

R101 曾针对「非法永恒页签直达」实现并验收过这条路径：候选 APK 实测「pm clear 新档」自动运行到首次大坍缩后，存档仍是 `eternities=0`、`bigEternities=0`、`EP=0`，跨版本复验也保持 0/0/0，官方 GUI 没有永恒页签。[历史证据，[FACTS §R101 记录](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/docs/facts/history/r100-r105.md#f-r101)、[R101 P0 修复报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/3b2d8284f2aca7132168998ee32497b3c4c17b8e/reports/R101-p0-fix)]

## 当前验收范围（重要）

| 项目 | 状态 |
| --- | --- |
| R101「非法永恒页签直达/恢复」 | **历史轮次 PASS**（非当前构建复验） |
| R121 KVM 新档的阶段推进 | **观察到**首次无限、Break、永恒、EC1～EC11 与首现实；完整终局仍 **NOT RUN** |
| 重置后阶段判据 | EC 和首现实后曾出现自动化停摆；源码已修复，**新构建运行复验 NOT RUN** |
| 非法页签直达的当前版本独立复验 | **NOT RUN**；R101 只能作为历史证据 |

因此本条目**不能**写「阶段门禁已验证」。正确表述是：**R121 新档已真实越过多个阶段，但当前版本仍有终局和非法直达复验未完成**。阶段能前进说明门禁没有完全阻断；它不证明该开放的都已开放，也不证明不该开放的都被拒绝。R121 暴露的“重置后历史进度被误判为新档”问题见 [智能自动购买器](/player/gameplay/automation) 与 [2026-11-20 · R121 Android KVM 新档阶段推进与 P1 停滞](/developer/history/2026-11-20-r121-android-kvm)。

## 如何验收

1. 用 frame-observer 抓 `/ui` 控件树与 `/snapshot.jpg`，配合 logcat 与 `player.json` 联合取证；持续动画画面上 `uiautomator dump` 会失败，不能作为唯一手段。
2. 在全新存档上按真实流程推进（首次大坍缩、Break 前后、永恒页签直达尝试），记录每一步的可操作性与存档字段。
3. 对「非法直达」场景，确认被拦截后恢复到合法页面，且存档未被写入非法状态。
4. 用稳定构建做对照，避免把构建差异当成门禁缺陷。

## 后续核验

- 最新实现应核对 [Android Kotlin 业务代码](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/3b2d8284f2aca7132168998ee32497b3c4c17b8e/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki) 与本仓对应发行版本，特别是 `OrekiGuiStage.kt` 及页面切换判据。
- 旧 [R101 P0 取证](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/3b2d8284f2aca7132168998ee32497b3c4c17b8e/reports/R101-p0-fix) 说明曾修过非法直达，不代表当前构建完整回归已通过。
- 双端比较与当前状态见[双端行为一致性](/developer/architecture/parity)及[待核实事项与已知问题](/developer/current/known-issues)。

原始技术内容迁自 [2026-11-22 前玩家条目](https://github.com/OrekiDawson/AD-Oreki-Wiki/blob/8726646c9701bc2ebad4d90faa5f9bbe5317f215/content/player/gameplay/stage-gates.md)，为避免删除既有证据，保留其中的历史轮次与 `NOT RUN` 边界。
