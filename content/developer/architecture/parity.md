---
title: "双端行为一致性"
description: "解释 Android 与 Web 为什么不能靠版本号判定等价，以及阶段、结算、资源与自动化的跨端验收方法"
tags:
  - Android
  - Web
  - 一致性
aliases:
  - "/architecture/parity"
---


Oreki Edition 在 Android 与 Web 两端并行开发。所谓「双端行为一致」，不是两份源码逐字相同，而是**玩家能观察到的行为等价**：同样的存档与操作，产生同样的阶段解锁、结算结果、资源扣费与自动化响应。本条目解释为什么这件事难、要验收哪些维度，以及目前确认到什么程度。

## 为什么不能靠版本号

两端基线不同源：

- Android 固定官方 **3.21.0** 的混淆 APK，代码是反编译 DEX 加 Kotlin 业务层；
- Web 固定 **2026-07-17** 的上游源码快照 `5409e320`。

版本号相同、或「看起来界面一样」，都不能证明行为等价。两端连同一机制的实现方式都可能不同：例如 Android 原版自带无限维度自动购买器，而 Web 原版没有，Web 端的相关能力由 MOD 自己补上。[读码，[FACTS §8.11](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/mechanics.md#f-8-11)] 这类差异意味着「同一功能在两端由不同代码实现」是常态。

## 需要验收的维度

| 维度 | 观察对象 | 判定方式 |
| --- | --- | --- |
| 阶段解锁 | 页签/功能是否可用、GUI 阶段真值 | 新档真实推进到各阶段，逐项操作 |
| 挑战结算 | 完成次数、奖励、成就 | 走原版结算入口，比对存档字段 |
| 自动购买器 | 购买时机、受管配置恢复、手动优先 | 同场景日志与资源扣费对比 |
| 资源扣费 | 货币变化、上限行为 | 同操作的数值增量对比 |
| 成就链 | 成就位与依赖 | 存档成就字段对比 |
| 教程内容 | 文案、步骤、触发时机 | 真机/浏览器逐屏核对 |

判定时优先使用**可观察产物**（存档字段、日志标记、界面状态），而不是「读源码觉得应该一样」。

## 已知的跨端差异类型

1. **实现位置不同**：同一机制在 Android 可能是 Kotlin 模块，在 Web 是上游 JS 模块加 MOD 补丁。
2. **字段编码不同**：例如 `imaginaryUpgradeBits` 的位号在两端不同（Android 移植版莱特拉 bit4 / 佩勒 bit14，Web 是 15/25），照抄另一端会得到恒 false 的策略叶子。见 [天神解锁与跨端实现细节](/developer/architecture/celestial-implementation)。
3. **原版能力不同**：Android 原版与 Web 原版的自动购买器、UI 结构并不完全一样。
4. **环境差异**：浏览器会冻结后台页面（Page Lifecycle），Android 是 Activity 生命周期，不能用同一套时序假设。

## 验证方法

- **Web**：Node + Chromium/Playwright，Android Chrome 手机视口优先；真实点击、DOM、console、存档与阶段行为检查。
- **Android**：独占 AVD，`frame-observer` 抓控件树与截图，配合 logcat 与 `player.json`；持续动画画面上 `uiautomator dump` 会失败。
- **同一场景脚本**：两端跑同一组操作（新档推进、挑战、自动购买器开关），比较可观察产物，而不是比较代码行数或日志文字。
- **对照与隔离**：改动一端时，另一端保持已验收版本；共享 AVD 与签名资源必须独占调度。

## 当前状态

- **已确认**：Web 在默认 3000× 下有一次真实新档终局 PASS，墙钟 10,451.1 秒；Android R121 已到首现实，但终局和通关后持续确认仍为 NOT RUN。两端都有关键机制与故障修复记录，**完整行为等价验收仍为 NOT RUN**。
- **未确认**：阶段、挑战、自动购买器、教程的跨端逐项对照表尚未建立完整证据链。
- **禁止**：不得用「两端版本号相同」「本地都能打开」或「某一端 AVD PASS」宣称双端等价。

## 相关条目

[Android 架构](/developer/architecture/android) · [Web 架构](/developer/architecture/web) · [挑战与真实结算](/player/gameplay/challenges) · [智能自动购买器](/player/gameplay/automation) · [Android 阶段门禁技术判据](/developer/architecture/gui-stage-gates) · [天神系统](/player/gameplay/celestials)
