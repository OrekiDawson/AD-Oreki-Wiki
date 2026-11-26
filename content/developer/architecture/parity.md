---
title: "双端行为一致性"
description: "从状态、时间与自动化边界理解 Android 与 Web 的行为对齐"
tags:
  - Android
  - Web
  - 一致性
aliases:
  - "/architecture/parity"
---

Android 和 Web 的源码不可能逐行相同：一端把官方 APK 的运行时接到 Kotlin 适配层，另一端则在 JavaScript 游戏内核上加入 MOD 模块。双端对齐真正要解决的问题是：给定同一类存档和同一串玩家动作，两端是否经过各自的实现后到达同一个可观察结果。这里的“同一个”指阶段、结算、资源变化、自动化决策和可见界面，而不是文件名或版本号相同。

## 先定义边界：什么必须一致，什么可以不同

可以不同的是实现手段。例如 Web 通过 `gameLoop()` 驱动原版生产与自动购买器，再由 `OrekiSmartExecutor` 注册 `early`、`eternity`、`reality`、`perk` 和 `endgame` 等模块；Android 则由 `OrekiStageAuto` 把同类动作接入 APK 的调用路径。它们不共享对象，也不共享 JavaScript 的事件总线。

不能随意不同的是行为契约：真实结算才推进阶段，购买必须实际扣除资源，自动化不能绕过原版重置，非法页面不能把存档写成高阶段状态。把契约写成可观察结果，才有办法在不同运行时之间比较。

一个实用的对齐模型是：

```text
输入（存档 + 操作）
        ↓
本端状态读取 → 本端决策/原版动作 → 本端重置与结算
        ↓
输出（存档字段、资源、阶段、界面、日志）
```

比较的是最后一行及其关键中间点。源码结构相似、日志文字相似，都不能替代这一步。

## 对齐的四层契约

### 状态层：同名字段不一定同义

跨端适配最危险的假设是“字段名相同就能直接复制”。`imaginaryUpgradeBits` 就是反例：Web 的 IU15/IU25 使用上游升级编号，而 Android 移植版的内部位号不同。把 Web 的 bit15 写入 Android，会得到一个合法的数字，却不会解锁莱特拉；策略叶子随后会永远返回假。

因此对照时应记录字段的语义、编码、重置时机和缺省值。优先比较 `player.json` 中真实结算产物、升级位图和资源，而不是只比较内存中的显示字段。

### 时间层：一秒钟在两端不是同一件事

Web 的 `gameLoop(passDiff)` 会处理真实时间、游戏时间、后台休眠补偿和微步生产；浏览器失焦或设备睡眠时，循环可能停止并转入 `simulateTime`。Android 受 Activity 生命周期、线程调度和设备休眠影响，不能假定每个 GUI 刷新都对应一个游戏 tick。

这也是自动化必须使用“调度节拍”而不是“每帧调用”的原因。测试若只点击一次按钮，往往测到的是 UI；测试若等待一个稳定的结算点，测到的才是游戏状态。

### 动作层：同一目标要走合法入口

比较自动购买器时，不要把“最后拥有了某件升级”当作充分证据。应同时确认资源被扣除、重置副作用发生、保存字段更新，并且下一次 tick 仍能继续。Web 的执行器通过注册表把策略动词映射到真实模块；Android 的调度器也应把动作收束到 `GameApi` 和原版方法，而不是从旁边直接写字段。

### 展示层：页面是状态的投影，不是状态本身

阶段页签、按钮和教程章节只是状态投影。一个页面能被路由打开，不代表其门槛已满足；一个按钮显示出来，也不代表结算条件可用。应把存档字段、阶段真值和界面状态分开采样，再定位是判据、导航还是渲染层出了偏差。

## 设计一组可迁移的对照场景

最有价值的测试不是“两个端都能启动”，而是相同输入下的状态转移。可按以下顺序建立场景：

1. 从干净存档推进到首次无限，记录资源、重置次数和无限页签。
2. 完成一次永恒和一次现实，确认高层结算产物出现、低层字段如何被清理。
3. 在自动化开启与关闭两种条件下执行同一购买，比较资源扣费和下一次节拍。
4. 尝试直达尚未解锁的页面，确认被拦截后回到合法页面且存档不被改写。
5. 进入浏览器后台或暂停 Android Activity，再恢复，检查时间补偿不会重复结算。

每个场景都应保存“输入存档、动作序列、关键输出”。这样当两端不一致时，可以判断是编码差异、时间差异、动作顺序还是显示层问题，而不是凭截图猜测。

## 排障：先找分叉点，再看代码

若 Web 和 Android 在同一阶段分叉，先比较最后一个共同结算点的存档，而不是从 UI 开始追。若字段不同，沿重置函数追写入者；若字段相同而页面不同，检查阶段真值与导航守卫；若资源相同但自动化不同，检查调度节拍、动作是否被原版条件拒绝，以及浏览器后台补偿是否改变了 `diff`。

对于位图、枚举和大数，必须使用本端源码或反编译结果确认编码。对于时间，记录真实时间、游戏时间和模拟时间三个值。对于自动化，保留“决策—动作—结果”链；只有看到结果改变，才把一次 tick 视为有效动作。

## 来源与历史边界

Android 当前实现可从 [`OrekiGuiStage.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiGuiStage.kt)、[`OrekiStageAuto.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt) 和 `GameApi.kt` 追踪；Web 可从 [`game.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/e1c93caa758de6c39cf814582123d4a35319eb25/src/game.js)、执行器和天神自动化模块追踪。Android/Web 的历史验收记录仍保留在各仓库报告中，但历史运行结果不自动代表当前候选构建。

## 相关条目

[Android 架构](/developer/architecture/android) · [Web 架构](/developer/architecture/web) · [天神判据与跨端编码](/developer/architecture/celestial-implementation) · [阶段门禁](/developer/architecture/gui-stage-gates) · [自动化调度器](/player/gameplay/automation)
