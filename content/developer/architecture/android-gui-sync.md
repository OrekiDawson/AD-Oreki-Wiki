---
title: "Android 界面同步"
description: "从 GameApi、阶段快照和主线程队列理解 Android 自动化后的界面刷新、合并与排障"
tags:
  - Android
  - GUI
  - 架构
  - 故障排查
---

“游戏已经变了，但页面还没变”是 Android MOD 里很有迷惑性的故障。自动购买可能确实扣了资源，阶段判定也可能已经更新，屏幕却仍显示旧的按钮、旧的自动购买器设置或旧的侧栏。反过来，页面偶尔跳到新阶段，也不代表存档和游戏核心已经完成了对应结算。

这不是简单的“多调用一次刷新”。界面同步要同时处理状态快照、Android 主线程、Activity 生命周期、请求合并和阶段导航。本文从固定的 Android 源码提交  [`1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545)  解释这条同步桥，并给出区分“核心状态没变”“刷新请求没送达”和“页面仍用旧投影”的排查方法。

## 界面不是游戏状态的真值

一个按钮或文本控件只是游戏状态的投影。可靠的链路应当是：

```text
原版运行时状态
       ↓
GameApi 读取与缓存失效
       ↓
OrekiGuiStage 计算阶段快照
       ↓
导航门禁与受管控件刷新
       ↓
主线程 Handler 执行 View 更新
```

每一层都可能暂时落后，但它们的责任不同：

- 原版运行时决定资源、结算和解锁是否真的发生；
- `GameApi` 把混淆宿主的读取和 UI 请求集中到适配边界；
- `OrekiGuiStage` 把多个结算产物归并为统一阶段；
- 导航刷新决定哪些分组可见；
- 主线程队列决定 View 什么时候实际重绘。

因此，截图显示“永恒”不能单独证明永恒结算已经完成；同样，截图仍显示“无限”也不能单独证明阶段判定没有更新。排查时先取阶段快照和核心字段，再观察页面，不能反过来把页面当作唯一事实来源。

## 一次强制同步做了什么

Android 的同步入口集中在 `GameApi.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt）。`forceGuiTickSync(reason)` 的职责不是“让屏幕闪一下”，而是把一次游戏状态变化转换成可观察的 UI 更新：

```text
失效原版缓存
    ↓
刷新 OrekiGuiStage 快照
    ↓
应用安全阶段门禁
    ↓
请求自动购买器/统计页强制刷新
    ↓
在主线程合并并执行 View 更新
```

普通刷新可能在“没有 dirty 且阶段没有变化”时提前返回；强制同步用于那些策略配置没变、但原版缓存或玩家可见数值已经变化的 tick。`force` 的语义是保证这次检查进入刷新路径，不是绕过解锁条件。阶段门禁仍然必须使用真实结算产物判断，不能因为请求带有 `force` 就显示尚未解锁的页面。

这条边界解释了一个常见误区：如果自动化动作成功但页面没动，直接重复调用原版购买函数没有意义；如果页面刷新但阶段字段未更新，强制重绘也只是把旧结论画得更勤快。应该先区分状态变化和状态投影。

## 为什么请求要合并

`requestAutobuyerUiRefresh(...)` 同时接收阶段快照、`phaseChanged` 和 `force`。它在同一时刻只允许一个刷新请求排队，高频写入会合并成一次主线程执行；Activity 不可用时则登记待同步，而不是长期持有一个已经销毁的 Activity 引用。

合并不是偷懒，而是 Android UI 的正确性与性能边界：一个 tick 可能同时改变自动购买器设置、阶段和统计值，逐字段发三次刷新会产生中间画面，也会让队列里堆积过期快照。更安全的做法是把“这一轮应显示什么”作为一次批量投影提交。

但合并必须满足两个条件：

1. 新请求不能被旧的已排队请求永久遮蔽，尤其是跨阶段结算时；
2. Activity 不在前台时不能把请求当作已经完成，恢复后必须有补偿路径。

这就是 `guiSyncPending` 存在的意义。它不是游戏进度，也不是“刷新失败后忽略”的标志，而是一个待提交的 UI 同步意图。

## Activity 不可用

Android Activity 可能正在销毁、尚未创建或暂时不在前台。此时直接持有旧 View 或强行调用页面更新，会把生命周期问题变成泄漏、异常甚至更新错误页面。源码选择登记待同步：

```text
同步请求到达
    ├─ Activity 可用 → 投递主线程刷新
    └─ Activity 不可用 → guiSyncPending = true，记录延迟

下一次自动化 tick
    ├─ 仍不可用 → 保持 pending
    └─ 已恢复 → retryPendingGuiSync()
                         ↓
                   forceGuiTickSync("pending-retry")
```

`retryPendingGuiSync()`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt） 会在 Activity 可用且当前没有刷新请求排队时补一次完整同步。这个设计把“请求曾经发生过”和“View 现在可以安全更新”分开，避免在后台状态下不断重试同一个无效对象。

## 阶段变化

普通数值刷新通常只需要更新自动购买器、统计或文本控件；阶段变化还会影响导航可见性。`OrekiGuiStage.refresh()` 计算新快照后，若阶段真的改变，会请求 `OrekiNavRefresh`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiNavRefresh.kt） 异步重算原版导航。

这里有两个不能互换的动作：

- **阶段刷新**回答“玩家现在处在哪个真实阶段”；
- **导航刷新**回答“哪些页面和分组应当可见”。

如果只更新阶段缓存而不刷新导航，合法存档加载后可能仍看不到新分组；如果只重建导航而不更新阶段真值，页面可能依据旧字段错误开放。`OrekiNavRefresh` 还需要在主线程和生命周期安全的上下文中工作，因此它不是一个可以在每个按钮点击处随手复制的工具函数。

## 调度与界面节拍

`OrekiStageAuto.onAutoBuyerTick()`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt） 在一帧开始后处理待同步请求，并在 GUI tick 到点时调用强制同步。这个顺序有意放在各类早退分支之前：本轮没有买到东西，不代表页面就不需要确认；自动化关闭、资源不足或挑战让路时，阶段和受管配置仍可能需要投影到界面。

但 GUI tick 不是购买决策。它不应占用调度器动作名额，也不应因为页面刷新失败就伪造 `acted`。把两者混在一起会产生两类错误：

- UI 更新被当成游戏动作，导致后续任务错误地等待；
- 游戏动作没有触发 UI 更新，玩家看到旧配置并误以为购买或重置没有发生。

调试日志中应分别记录“真实游戏动作”和“GUI 同步请求”，两者可以来自同一帧，但不是同一结果。

## 症状排查

### 数值不变，页面也不变

先检查原版状态是否真的改变。若资源、购买数和重置历史都没变化，应回到动作前置或合法性门；若核心状态改变，再看 `forceGuiTickSync` 是否被调用，以及 `GameApi` 是否记录了异常。此时重复刷新只会掩盖真正的动作失败。

### 日志显示刷新，屏幕仍旧

检查刷新请求是否被合并、Activity 是否在前台、主线程 Handler 是否执行，以及 View 是否属于当前 Activity。还要确认日志记录的是“已排队”还是“已完成”；两者不能写成同一个成功事件。

### 切换页面后突然恢复

这通常说明页面切换触发了另一条原版刷新路径，不能证明 MOD 的同步桥正确。比较切换前后的阶段快照、`guiSyncPending` 和导航刷新请求，找出哪一个状态没有在原路径提交。

### 阶段已变但侧栏没变

先核对 `OrekiGuiStage.compute()` 的快照，再核对 `OrekiNavRefresh.requestAsync()` 是否被调用。若快照正确而导航缺失，问题在导航投影；若快照本身错误，问题在阶段真值或缓存失效，不要只改侧栏的可见性。

### 后台回来后显示旧配置

确认后台期间是否登记了 `guiSyncPending`，恢复后是否进入 `retryPendingGuiSync()`，以及补偿刷新是否在当前 Activity 上执行。不要通过永久保存 Activity 引用来“保证刷新”，那会把生命周期问题变成更难定位的泄漏。

## 可迁移的工程经验

这条 GUI 同步桥的通用价值在于，它把“状态变化”和“状态投影”拆开，又把生命周期不可用视为可恢复的待提交状态。任何 Android 插件、后台队列或编辑器都可以复用这套思路：

1. 用核心状态作为真值，界面只做投影；
2. 用批量请求合并同一轮变化，避免渲染过期中间态；
3. 把 Activity 不可用记为 pending，而不是把失败吞掉；
4. 对阶段、导航和普通数值使用不同的刷新契约；
5. 分别记录动作完成、请求入队和 View 执行，避免一条“刷新成功”日志替代三种事实。

这样做并不能保证每个页面都正确，但它让错误有了落点：核心没变、快照错了、请求没送达、导航没重建，或者 View 在错误的生命周期执行。能区分这些边界，通常比增加刷新频率更接近真正的修复。

## 来源与相关条目

- Android 固定源码：GameApi.kt（源码定位：OrekiDawson/AD-Oreki-Edition-Android@1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt）、OrekiStageAuto.kt（源码定位：OrekiDawson/AD-Oreki-Edition-Android@1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt）、OrekiGuiStage.kt（源码定位：OrekiDawson/AD-Oreki-Edition-Android@1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiGuiStage.kt） 与 OrekiNavRefresh.kt（源码定位：OrekiDawson/AD-Oreki-Edition-Android@1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiNavRefresh.kt）。
- [Android 阶段门禁与 GUI 判据](/developer/architecture/gui-stage-gates)：解释阶段真值和导航守卫；本文专注状态到 View 的同步桥。
- [Android 架构](/developer/architecture/android)：查看 `GameApi`、自动化入口和构建边界。
- [Kotlin 混合运行时](/developer/architecture/kotlin-runtime)：排查宿主 ABI、生命周期和线程边界。
