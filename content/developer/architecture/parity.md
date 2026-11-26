---
title: "双端行为一致性"
description: "从游戏循环、状态边界与数值表示理解 Android 与 Web 如何保持同一套玩法契约"
tags:
  - Android
  - Web
  - 一致性
aliases:
  - "/architecture/parity"
---

Android 和 Web 不可能共享同一套对象：Web 在浏览器里维护 JavaScript 的 `player`，Android 则把官方 APK 的运行时接到 Kotlin 适配层。双端一致性因此不是“两个仓库的类名一样”，而是同一份玩家意图经过不同的游戏循环后，仍然得到同一类可观察结果。

可以把它写成一个更实际的契约：

```text
存档 + 玩家动作 + 经过的时间
        ↓
本端游戏循环 → 合法动作入口 → 本端结算与保存
        ↓
阶段、资源、保留项、界面与下一步可用动作
```

比较的对象是最后一行以及关键结算点，而不是日志文案、函数名称或两个 APK/网页的内部字段排列。

## 两端各自怎样走完一拍

### Web：`passDiff` 驱动的浏览器循环

浏览器入口 [`src/main.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/e1c93caa758de6c39cf814582123d4a35319eb25/src/main.js) 先检查浏览器，再调用 [`init()`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/e1c93caa758de6c39cf814582123d4a35319eb25/src/game.js)。初始化会加载存档，并通过 `Tabs.findRestorableTab` 把上次页签重新放回合法页签；这一步很重要：恢复界面不是绕过阶段门禁的后门。

正常运行由 [`gameLoop(passDiff)`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/e1c93caa758de6c39cf814582123d4a35319eb25/src/game.js) 接收经过的时间。循环处理原版生产和自动购买器，再让 Oreki 的策略模块参与，最后更新界面与事件。`passDiff` 是时间输入，不是“按钮点击次数”；浏览器失焦或加载存档后的离线进度会进入 `simulateTime`，以多个时间片重新调用游戏循环，而不是凭空把某个资源字段加到目标值。

自动化本身位于 [`src/core/oreki-smart-executor.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/e1c93caa758de6c39cf814582123d4a35319eb25/src/core/oreki-smart-executor.js)。它根据阶段上限、玩家配置和策略结果选择动作，但动作仍要经过原版购买或重置入口。调度器的意义是限制“何时尝试”，不是替游戏核心回答“这次购买是否真的成功”。

### Android：全局节拍包住原版入口

Android 的自动化入口是 [`OrekiStageAuto.onAutoBuyerTick()`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt)。它先调用 [`OrekiAutomationScheduler.beginFrame()`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt)，再对候选任务走 `allow → 执行 → noteActed/noteNoop` 的节拍协议。

调度器明确维护全局间隔、预约窗口、失败冷却和 `frameActed`。因此“同一帧最多一个真动作”不是测试约定，而是实现约束；no-op 不应冒充成功，也不应更新真实动作时间。`OrekiStageAuto` 里的购买、坍缩和升级最后通过 [`GameApi`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt) 进入官方运行时。适配层负责寻找和调用入口，不应直接写解锁位或发放免费资源。以上 Android 源码链接固定到已核对的提交 `9d8fc46`（2026-11-26）。

这解释了一个常见误会：把 Web 的 `intervalSec` 原样搬到 Android，并不能保证两端同拍。Web 的节拍由浏览器循环和 `passDiff` 共同影响；Android 还受 Activity、线程调度和设备休眠影响。能对齐的是“经过一个合法节拍后发生什么”，不是两个设备的墙上时钟恰好同时按下按钮。

## 四层一致性契约

### 1. 状态语义：同名字段可能不是同一个意思

跨端映射首先要记录字段的语义、编码、默认值和重置时机。升级位图、阶段枚举和挑战状态尤其危险：一个端的位号可能来自上游定义，另一个端可能经过绑定或适配层转换。直接复制整数，得到的可能是一个完全合法却没有任何对应解锁的状态。

对照时优先使用真实结算后可保存的字段和玩家可观察状态，明确区分：

- 结算前的临时计算值与保存后的长期值；
- 当前页签与真正的阶段判定；
- “拥有资源”与“满足解锁条件”；
- 自动化的意图与原版入口实际接受的结果。

### 2. 时间语义：一秒不是一个固定的 tick

Web 的 `gameLoop` 用 `passDiff` 表示经过的时间，离线模拟还会根据可用时间片和模拟精度重新分段。Android 的 `OrekiAutomationScheduler` 则用 `SystemClock` 记录真实间隔，并在每帧管理动作名额。两端都在处理时间，但时间的单位和边界不同。

所以测试不应写成“点击一次，等待一帧”。更可靠的写法是：“从同一检查点开始，运行到下一次合法结算，比较结算前后的字段与资源”。如果要比较速度，记录真实时间、游戏时间和模拟时间三者；不要把界面刷新频率当成游戏进度。

### 3. 数值语义：大数比较要比较表示和运算结果

反物质维度的数值远超 JavaScript `Number` 和普通 `Double` 的安全整数范围。跨端对照时，不能把大数先转成普通浮点数再比较精确相等，也不能只比较格式化后的字符串。应保留本端的大数表示，并至少比较数量级、阈值关系、收益是否为零和序列化后的关键字段。

一个实用的检查组合是：

```text
数值表示（Decimal/适配层值）
        + log10 或数量级
        + 是否达到阈值
        + 结算后保存值
```

如果两个端显示同样的 `1.00e308`，却在阈值判断上分叉，问题通常不在 UI，而在舍入、上限、转换或比较函数。反过来，显示精度不同但阈值、结算和保存值相同，不应被误判为玩法不一致。

### 4. 动作与界面：页面是状态投影

按钮、页签和教程章节不能当作状态真值。页面可以因为路由恢复而被请求，但是否可用仍应由阶段判定和动作入口决定；自动购买器显示“准备执行”，也不等于资源已经扣除。

对每个自动化动作至少记录三件事：决策为何选择它、原版入口是否被调用、调用后哪个状态发生了变化。若只记录第一件事，调度器很容易把“我想买”误写成“我已经买了”。

## 测试策略：比较状态转移，不比较截图

双端测试最小单元应是“输入存档 + 动作序列 + 关键检查点”。可以从以下场景开始：

1. 用同一阶段的合法存档启动两端，确认恢复页签、当前阶段和可见入口一致。
2. 执行一次实际购买，比较资源扣除、购买结果和下一拍可用动作；不要只比较按钮颜色。
3. 执行一次无限、永恒或现实结算，记录重置前后保留项、阶段和保存字段。
4. 开启相同自动化配置，运行足够长的时间片，检查动作间隔、no-op、资源收益和是否出现重复结算。
5. 让 Web 进入后台、让 Android Activity 暂停后恢复，再比较时间补偿是否只结算一次。
6. 尝试访问尚未解锁的页面，确认两端都阻止非法直达且存档没有被写成高阶段状态。

测试夹具应保存输入、版本和动作序列；输出至少包含关键资源的数量级、阶段、重置计数、自动化决策/结果和保存后的字段。这样才能回答“分叉发生在哪一次转移”，而不是只能回答“最后看起来不一样”。

## 差异排查：先找最后一个共同检查点

### 字段先分叉

比较最后一次共同结算后的存档。若位图、枚举或保留项先出现差异，沿对应重置函数和写入者追踪；不要从页面渲染层开始猜。

### 字段相同，页面不同

检查阶段真值、页签恢复和 GUI 门禁。页面差异可能只是投影或导航问题，不一定是游戏状态已经不同；可参考 [阶段门禁与 GUI 判据](/developer/architecture/gui-stage-gates)。

### 资源相同，自动化不同

分别检查调度节拍、候选任务顺序、no-op/失败冷却，以及原版入口是否拒绝了动作。Web 的策略和 Android 的调度器应记录“决策—调用—结果”三段，而不是只打印任务名。

### 只有长时间运行后才不同

优先检查时间片、离线模拟、Activity 生命周期和大数舍入；再检查是否有一个端把 no-op 当成真动作，导致后续节拍被错误占用。

## 可迁移的设计经验

双端一致性不是让两套代码看起来相同，而是把“哪些结果必须相同”写成可观测契约，把“哪些实现可以不同”留给各自平台。状态字段要有语义和版本边界，动作必须经过合法入口，时间和大数必须保留本端表示，测试则围绕状态转移保存证据。

这套方法同样适用于移动端与 Web 的购物车、离线同步、编辑器状态和任何跨运行时系统：先找共同检查点，再比较转移，不要用最后一张截图替代整个过程。

## 相关条目

[Android 架构](/developer/architecture/android) · [Web 架构](/developer/architecture/web) · [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) · [天神判据与跨端编码](/developer/architecture/celestial-implementation) · [阶段门禁与 GUI 判据](/developer/architecture/gui-stage-gates) · [智能自动购买器](/player/gameplay/automation)
