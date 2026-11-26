---
title: "自动化状态所有权：玩家意图、托管配置与执行闸门"
description: "从 Android Kotlin 源码理解自动购买器何时让路、何时恢复，以及为什么状态所有权不能由一个开关代替"
tags:
  - 架构
  - 自动化
  - Android
  - 排障
---

自动购买器的“开关”并不只有一个。Android MOD 同时面对玩家的原版总开关、MOD 自己的总开关、单项自动器的当前状态，以及 MOD 对模式和间隔的托管策略。若把这些状态揉成一个 `enabled`，最常见的结果是：玩家刚关掉一个自动器，下一帧又被打开；或者 MOD 已经暂停，旧的恢复任务却在稍后突然写回。

本文只讨论一个比“调度器如何选任务”更窄的问题：**某个值现在归谁所有，什么条件下允许写入，写入之后如何证明没有越权。**源码依据是 Android 仓库固定提交 [`1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545)。本文不是 APK 行为验收；它是阅读和修改托管自动购买器时的实现地图。

## 先画出三条边界

当前实现可以拆成三层：

```text
玩家操作与原版状态
        ↓ 观察、登记意图
OrekiPlayerIntent
        ↓ 提供“可以碰吗”“何时再试”
OrekiManagedAutobuyerAuthority
        ↓ 计算目标值
OrekiAutomationScheduler.allow()
        ↓ 通过节拍、预约和失败冷却后才执行
OrekiStageAuto → GameApi → 原版自动购买器
```

这不是严格的单向数据流：`OrekiStageAuto` 仍会读取原版状态并回报动作结果。但所有权判断应保持分层，否则一个“允许执行”就会被误读成“允许修改任意配置”。

- `OrekiPlayerIntent` 记录玩家是否明确关闭总开关或单项自动器，并管理延迟恢复登记。
- `OrekiManagedAutobuyerAuthority` 是纯判据层。它回答“当前实际值和策略目标是否不同”“是否为新的配置 tick”“大坍缩目标是否因托管或阶段策略而应为关闭”。
- `OrekiAutomationScheduler` 是执行闸门。它不替玩家决定全部策略，而是把 MOD 总开关、原版总开关、任务注册、同帧名额、失败冷却、`no-op` 静默窗、全局节拍和预约状态合并成一次 `allow()` 判断。

因此，`mayTouchAutobuyers()`、`effectiveCrunchTarget()` 和 `allow()` 不能互相替代。它们分别属于意图、目标和执行三个问题。

## 玩家意图不是一次点击，而是时间语义

`OrekiPlayerIntent.refresh()` 先检查 MOD 调度器是否开启，再读取原版自动购买器总开关。原版总开关为关闭时，它登记 `masterPlayerDisabled`；为开启时才清除这份玩家意图。`mayTouchAutobuyers()` 返回的只是“玩家是否明确关过”，并不表示当前一定可以接管。调用方仍需同时确认原版总开关现值和 MOD 总开关。

这一区分很重要：

| 观察到的状态         | 能得出的结论               | 不能得出的结论                    |
| -------------------- | -------------------------- | --------------------------------- |
| 玩家曾关闭原版总开关 | 托管层应让路               | 可以立刻把它重新打开              |
| 当前原版总开关为开   | 目前没有总开关阻断         | 所有单项配置都可写                |
| MOD 调度器关闭       | 当前不执行托管动作         | 旧的 pending 可以留着以后自动执行 |
| 单项自动器被关闭     | 需要记录玩家意图或登记恢复 | 下一帧必然恢复                    |

单项自动器使用两种不同的记忆。`managedActivePendingAt` 记录“策略要求开启，但当前值不合适，稍后可恢复”的时间；`playerClosedKeys` 则是“玩家明确关闭，自动恢复不得越权”的闩锁。前者解决节奏，后者解决所有权。把二者合并成一个布尔值，就无法区分“稍后重试”和“一票否决”。

## 受管配置为什么要延迟写回

模式、间隔和阈值属于 MOD 可以托管的配置，但也不能在每帧发现差异后马上写。`noteManagedActiveDisabled()` 只在第一次发现偏离时登记 `dueAt`；重复观察不会刷新时间点。达到时机后，`consumeManagedActiveRestoreDue()` 消费登记并只返回一次；如果总开关或策略已经不再允许接管，`clearManagedActivePending()` 或 `clearAllManagedActivePending()` 会把旧登记清掉。

这套设计有三个工程后果：

1. **不会逐帧抢写。** 观察到差异和获得写入资格是两件事。
2. **不会因重复观察永远延期。** 同一个 key 已登记时不刷新到期时间。
3. **暂停不会留下幽灵动作。** 整体不接管时清空 pending，重新开启后必须重新经过策略 tick。

因此排查“配置被改回去”时，不能只搜索 `set...()`。应同时查登记、消费、清理和最后的总开关判定；缺少任何一环，都可能出现“偶发恢复”或“恢复永不发生”。

## 纯目标判据不应直接执行

`OrekiManagedAutobuyerAuthority` 将一些容易被调用方重复实现的判断集中成纯函数。例如 `isNewConfigTick(tickId, lastAppliedTickId)` 只接受正 tick 且要求 tick 发生变化；`activeNeedsWrite(actual, target)` 只回答两个布尔值是否不同；`effectiveCrunchTarget(wantCrunch, ownedByMod, pausedByStagePolicy)` 则把大坍缩目标收窄为：玩家策略想要、MOD 没有把该自动器交给别的阶段、且阶段策略没有暂停。

这些函数的价值不是“让逻辑更短”，而是让目标计算与副作用分开。纯判据可以用固定输入检查边界，例如：

```text
wantCrunch=true,  ownedByMod=false, pausedByStagePolicy=false → true
wantCrunch=true,  ownedByMod=true,  pausedByStagePolicy=false → false
wantCrunch=true,  ownedByMod=false, pausedByStagePolicy=true  → false
```

但得到 `true` 仍不等于可以调用原版写入入口。调用方还要确认这一拍是否是新的配置 tick、玩家是否已让路，以及执行闸门是否允许当前任务。

## `allow()` 是执行闸门，不是所有权判定

`OrekiAutomationScheduler.allow(taskId)` 的前置顺序体现了执行层的责任：MOD 未启用时拒绝；原版总开关关闭时拒绝；未知任务拒绝；随后再检查同帧名额、失败冷却、`no-op` 静默窗、全局节拍和任务预约。`beginFrame()` 会清掉上一帧的真执行名额并记录帧起点，`noteActed()`、`noteNoop()` 和 `noteFail()` 则必须释放预约并记录不同结果。

这意味着调用方应把一次自动化动作写成可观察的闭环：

```text
读取状态 → 计算目标 → 检查玩家/阶段所有权
        → allow(taskId)
        → 调用 GameApi 原版入口
        → 依据真实结果 noteActed / noteNoop / noteFail
```

只调用 `allow()` 而不回报结果，会让预约、失败冷却或节拍记账失真；只调用原版入口而绕过 `allow()`，则会让动作绕过全局节奏。两者都不能用日志里“函数被调用过”来替代。

## 一个可复核的排障顺序

遇到“玩家关掉后又打开”“配置没有恢复”或“暂停后仍有动作”时，按下面顺序缩小范围：

1. **先问是谁写的。** 日志和源码中区分原版入口、`OrekiPlayerIntent`、策略判据和调度器动作；不要把界面变化直接归因于 MOD。
2. **再看玩家意图。** 检查总开关的 `masterPlayerDisabled`、单项的 `playerClosedKeys`，以及是否在恢复前被清除。
3. **再看 pending 生命周期。** 对照登记时间、到期时间、消费和清理；若重开后立即恢复，优先怀疑旧 pending 未清除。
4. **再看目标而非实际值。** 记录 `wantCrunch`、托管所有权和阶段暂停，确认目标是否本来就应为关闭。
5. **最后看执行闸门。** 核对 `allow()` 的拒绝原因、任务预约以及 `noteActed`/`noteNoop`/`noteFail` 是否成对出现。

最小诊断快照不需要整份存档，至少应包含：MOD 总开关、原版总开关、受影响 key、玩家关闭闩锁、pending 的 `at/pass`、策略目标、任务 ID、最近一次闸门结果和动作回报。这样才能区分“没有资格写”“有资格但没到时间”和“已经执行但原版入口没有改变状态”。

## 修改时的约束

新增托管字段时，先决定它属于玩家意图、策略目标还是执行记账，再决定存放位置。不要在 `OrekiStageAuto` 中复制一套“发现关闭就恢复”的快捷逻辑，也不要让纯判据函数读写存档或直接调用 `GameApi`。若一个新策略需要覆盖玩家明确关闭的单项自动器，应先重新定义产品授权和验证边界；仅靠换一个调用顺序不能证明这是合法行为。

验证也应分层：纯判据可做固定输入测试；pending/latch 可测试登记、延迟、消费和清理；调度器可测试拒绝原因与预约释放；真正的玩家行为还需要匹配版本的 APK、存档和设备观察。源码检查通过不等于玩家开关行为已经验收。

## 相关条目与源码入口

- [调度器状态机](/developer/architecture/scheduler-state-machine)：解释任务选择、重置和进度死锁，不替代本页的所有权边界。
- [Android GUI 同步桥](/developer/architecture/android-gui-sync)：解释状态如何到达界面。
- [Android 架构](/developer/architecture/android)：查看构建输入、运行时和 `GameApi` 的总体关系。
- [`OrekiPlayerIntent.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiPlayerIntent.kt)：玩家意图、pending 和关闭闩锁。
- [`OrekiManagedAutobuyerAuthority.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiManagedAutobuyerAuthority.kt)：托管目标的纯判据。
- [`OrekiAutomationScheduler.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt)：执行节拍、预约和结果记账。

本文讨论的是源码中的所有权边界；要判断某个候选 APK 的设备行为，还需将这些判据与对应版本的构建产物和运行记录对照。
