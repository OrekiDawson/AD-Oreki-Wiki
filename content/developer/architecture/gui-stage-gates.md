---
title: "Android 阶段门禁与 GUI 判据"
description: "理解 Android 阶段真值、页面导航守卫与兼容存档误判"
tags:
  - Android
  - 门禁
  - GUI
  - 故障排查
---

游戏里的“阶段”不是一个永远递增的页签编号。它是存档结算历史的解释：玩家是否真正完成过无限、永恒或现实，决定哪些界面和自动化可以出现。Android 3.21 的难点在于，原版某些判定只读取单个字段，而兼容存档可能让这个字段非零，却没有对应的结算产物。于是导航像拿着一张过期门票，提前把后续页面亮出来。

## 阶段真值的来源

MOD 将 GUI 阶段判断集中到 `OrekiGuiStage`，而不是让每个页面各自猜条件。它读取真实结算相关的字段，计算四种阶段：首次无限前、无限、永恒和现实。永恒判据组合永恒点数、`bigEternities`、已购永恒升级位图以及现实结算；现实判据组合 `realities` 与 `bigRealities`。现实是更高层阶段，因此即使高层重置清掉低层计数，也不能把玩家降回永恒前。

重要的反例是 `Player.eternities`。它可以作为诊断信息记录，但不能单独决定永恒 GUI。一个兼容存档可能出现 `eternities > 0`，同时永恒点数、`bigEternities` 和升级位图仍为空；若直接沿用原版单字段判定，永恒页签就会在非法时机出现。

可以把判定抽象成优先级：

```text
现实结算产物存在 → 现实阶段
否则永恒结算产物存在 → 永恒阶段
否则无限结算产物存在 → 无限阶段
否则 → 首次无限前
```

这不是为了让代码更“漂亮”，而是为了让页面、自动化和诊断使用同一个答案。阶段真值若分散在多个回调里，修复一处通常只会制造另一处漂移。

## 页面导航为什么必须有守卫

界面路由与游戏解锁是两个不同问题。玩家可以通过旧导航、自动化、恢复现场或调试入口请求一个尚未开放的页签；导航层必须在切换前重新询问阶段真值，不能因为请求来自“合法按钮”就跳过检查。

安全的导航路径应是：

```text
请求页签
  ↓
读取 OrekiGuiStage
  ↓ 未满足
回到原版合法页面，不写存档
  ↓ 满足
进入页面并刷新相关控件
```

拦截时不要顺便清零永恒字段、改资源或扫描整个 View 树。门禁的职责是拒绝非法导航，存档修复和 UI 重建是另外两件事。职责混在一起，会把一个页面问题升级成存档损坏。

## 阶段真值如何流入自动化

Android 的调用关系可以沿源码追踪为：

```text
player / GameApi 字段读取
        ↓
OrekiGuiStage.refresh()
        ↓
OrekiStageAuto 的阶段与目标选择
        ↓
原版购买、挑战、重置入口
```

`OrekiStageAuto` 在需要判断高层目标时应与 `OrekiGuiStage` 使用同一套真实结算语义。若自动化直接读一个旧字段，而 GUI 使用组合判据，就会出现“页面显示在无限，策略却认为已经永恒”的双重真相。反过来，GUI 使用缓存而自动化直读存档，也可能在结算后的一个 tick 内短暂分叉，因此刷新点和缓存失效必须明确。

## 如何定位“提前开放”与“无法推进”

先保存三个对象：当前页签、阶段快照和存档字段。然后按下面的分叉判断：

- 阶段快照错误：检查 `OrekiGuiStage.compute()` 使用的字段、数值解析和位图读取。
- 阶段快照正确、页面错误：检查导航守卫是否调用刷新后的快照，以及 UI 是否保留旧缓存。
- 页面正确、自动化错误：检查 `OrekiStageAuto` 是否绕过统一判据，或把未知读取结果当成已解锁。
- 重置后短暂错误：检查结算写入、缓存失效和下一次游戏 tick 的顺序。

持续动画时不要把一次失败的 `uiautomator dump` 当作游戏失败；控件树可能正处于变化中。用存档字段、日志、稳定截图和下一次刷新后的控件状态交叉取证，才能分开“抓取工具不稳定”和“阶段门禁真的错误”。

## 兼容存档与可迁移经验

阶段判定的通用经验是：用不可伪造或难以误解的结果作为真值，而不是用 UI、计时器或单一缓存字段。迁移到 Web、教程系统或其他增量游戏时，同样应把“解锁请求”“阶段判定”“页面投影”分成三层，并为每层提供可观察的输入与输出。

如果增加新的高层重置，应先定义它保留和清理哪些字段，再把该层纳入阶段优先级；如果增加新的自动化目标，应复用阶段读取器，而不是复制一份看似相同的条件。这样做的代价是多写一个明确的状态对象，换来的却是兼容存档、导航和自动化不会各自发展出一套历史。

## 来源与边界

主要实现见 [`OrekiGuiStage.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiGuiStage.kt)、[`OrekiStageAuto.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt) 与 `GameApi.kt`。玩家向说明见[阶段解锁与页面显示](/player/gameplay/stage-gates)。历史门禁证据仍可从[旧版事实记录](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/3b2d8284f2aca7132168998ee32497b3c4c17b8e/reports/R101-p0-fix)追溯，但历史结果不等于当前候选 APK 的复验结果。

## 相关条目

[Android 架构](/developer/architecture/android) · [双端行为一致性](/developer/architecture/parity) · [天神判据与跨端编码](/developer/architecture/celestial-implementation) · [玩家阶段解锁](/player/gameplay/stage-gates)
