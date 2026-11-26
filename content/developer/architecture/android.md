---
title: "Android 架构：宿主、适配层与业务调度"
description: "从 App/Activity 宿主到 GameApi 和 Kotlin 自动化，理解 Oreki Edition Android 端的真实边界"
tags:
  - 开发者
  - Android
  - 架构
aliases:
  - "/architecture/android"
---

Oreki Edition 的 Android 端不是一款重新实现的《反物质维度》。APK 里有一个负责生命周期、界面和原版游戏循环的宿主，也有一层 Kotlin 业务代码负责读取状态、安排动作和显示 MOD 状态。两者之间的边界决定了这个项目最重要的工程习惯：Kotlin 可以决定“现在是否值得尝试”，但不能凭空制造一次大坍缩、改写原版存档，或把一次失败的调用算成成功。

本文基于 Android 仓库固定 Commit [`9d8fc46`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/9d8fc46ce99279720b5b3068027bb76bceb35756)。源码中的 Kotlin 入口、构建输入和规则文件可直接定位；App/Activity 等宿主组件则以构建阶段的 Manifest 与输入 DEX 为准，不把历史反编译目录冒充当前源码。

## 先看四层边界

```text
Android 进程与组件生命周期
        ↓
App / MainActivity / 原版游戏循环与 WebView 宿主
        ↓
GameApi：缓存式反射、版本别名与失败语义
        ↓
Oreki Kotlin：阶段判定、自动化调度、界面状态与设置
```

这四层各自回答不同问题：

- **App/Activity** 负责进程、Context、前后台切换、界面加载和暂停保存等 Android 责任；它们不是“玩法 API”。
- **原版宿主**持有玩家、货币、维度、挑战和存档对象，真正改变游戏世界的操作最终必须落到这里。
- **GameApi** 把混淆 DEX 中的类、字段和方法集中适配成 Kotlin 可以调用的窄接口。
- **Oreki Kotlin** 读取适配层提供的状态，计算阶段和策略，并通过调度器决定何时调用动作。

把这几层混在一起，故障就会变得很难解释：Activity 重建不应清空玩家存档，GameApi 解析失败不应被当成“玩家没有资源”，调度器的 `noteNoop()` 也不应伪装成一次成功购买。

## App 与 Activity：Android 外壳不是游戏规则

当前完整游戏的组件入口来自构建阶段的 `AndroidManifest.xml`。`app/build.gradle.kts` 将 `oreki.fullGameStage` 指向的阶段目录作为 Manifest 输入，默认目录是 `build/agp-fullgame`；因此 App、MainActivity 以及其他组件的最终入口，必须与这份 Manifest 和输入 DEX 一起核对。`app/proguard-rules.pro`也按 Manifest 中真实存在的组件保留 `App`、`MainActivity`、`SpeedSettingsActivity` 和 `LoginActivity` 等类。

这层的设计取舍很实际：宿主组件继续使用 Android 标准生命周期，MOD 不另造一套“永不销毁”的游戏窗口。Activity 可能因为配置变化、系统回收或返回后台而重建；长期对象应保存 `applicationContext` 或可恢复设置，不能把 Activity 引用塞进全局调度器。界面引用属于短生命周期资源，玩家状态属于游戏存档，MOD 开关属于偏好设置，三者必须分开存放。

修改 App/Activity 相关行为时，先检查：

1. Manifest 是否仍指向正确的组件和权限；
2. `onCreate`、前后台和暂停保存路径是否会重复初始化调度器；
3. Activity 重建后是否重新绑定 UI，却没有重置玩家或自动化状态；
4. WebView、JNI 和 AndroidX 初始化器是否仍能按类名加载。

这些入口很多不会出现在 Kotlin 业务代码的普通调用图里，所以它们同时也是 R8 的保留边界。构建专题中的 [R8 规则](/developer/build/r8)记录了 Manifest、JNI、WebView 和生成实现类的处理方式。

## GameApi：把不稳定的宿主压缩到窄边界

[`GameApi.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt) 解释了为什么这里采用缓存式 Java 反射：原版游戏类只存在于 APK 的 DEX 中，Kotlin 编译器不能把它们当作普通 Kotlin 类型库直接导入。生成一整套类型桩会遇到内部类、泛型擦除、继承和数千个相互引用；把整个游戏反编译成 Java 再编译则等于重写宿主。

于是 GameApi 把类名、字段和方法解析集中在一个适配层：首次使用时解析并缓存 `Class`、`Field` 或 `Method`，后续调用复用句柄，不在每次购买时重新按名称搜索。解析失败不会向主循环抛出未处理异常，而是返回空值或安全的否定结果，并记录 `OREKI_API_MISS`。这种选择牺牲了部分编译期类型检查，却把版本升级时的改动集中到了可核查的边界。

GameApi 还必须与构建期别名保持同源。当前文件中的 3.19→3.20 映射，以及生成的 `OrekiBaselineBindings`，共同决定“可读的旧混淆名”如何落到当前 DEX 类名。只更新其中一边，会出现最难查的故障：Smali 描述符已经指向新类，Kotlin 却反射到了旧类或另一个恰好存在的短名。

## 从一次自动化 tick 看调用链

自动化业务位于 `app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/`。一拍的概念调用链是：

```text
OrekiStageAuto.onAutoBuyerTick()
        ↓
同步宿主状态与 GUI
        ↓
OrekiAutomationScheduler.allow(taskId)
        ↓
GameApi 读取条件并调用原版操作
        ↓
noteActed / noteNoop / noteFail
```

调度器解决的是顺序和节拍，不是资源生成。`allow()` 可能因为总开关、原版自动购买器开关、同帧名额、失败冷却、无操作重试或全局间隔而拒绝任务；动作真正返回后，调用方才知道应该记为什么结果：

- `noteActed`：原版状态确实发生了改变，推进全局节拍并占用本帧名额；
- `noteNoop`：条件不满足或没有购买，不推进全局节拍，只设置该任务的重试窗口；
- `noteFail`：调用抛出异常或明确失败，进入独立失败冷却。

这套结果模型解释了许多“看似随机”的停滞。若调用方在准备调用时就记 `noteActed`，一个没有购买的任务也会吃掉节拍；若把 `noteNoop` 当作失败，其他任务会被无意义地拖慢。调度器的状态转移必须跟随真实宿主结果，而不是跟随意图。

## 阶段判定为何不能由页面猜

页面可见性由 `OrekiGuiStage` 统一计算，而不是由每个页面检查一个自己喜欢的字段。阶段判定要区分无限、永恒、现实及它们的“大”记录；高层现实结算后，低层计数可能被重置，因此单看当前 `eternities` 或某个货币并不可靠。

修改阶段逻辑时，先画出“结算后仍保留的证据”与“会被清零的临时状态”，再决定判定优先级。现实应优先于永恒，永恒应优先于无限；读取失败应按“无法确认”处理，而不是把未知值当成已解锁。否则会出现两个相反的 bug：页面过早出现，或玩家已经完成阶段却被送回低层入口。

## 修改代码时的边界清单

**新增玩法策略**：写在 Kotlin 业务层，先通过 GameApi 获得状态，再让调度器安排动作；不要把混淆字段访问复制到每个策略文件。

**修改宿主访问**：先确认当前 DEX 基线、成员签名和构建期别名，再改 GameApi；同时检查 R8 keep 规则，避免名称在运行时丢失。

**修改 Activity/UI**：把界面绑定和玩家状态分开处理；测试 Activity 重建、切后台和恢复，不要用单次冷启动代替生命周期验证。

**修改调度器**：为每个任务明确成功、无操作和异常三种结果；检查是否推进全局节拍、是否释放预约，以及失败后是否会造成饥饿或死锁。

**修改构建输入**：根 `:app`才是完整游戏应用，阶段 Manifest、生成资源、assets 和 JNI 都由 [`app/build.gradle.kts`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/build.gradle.kts) 接入。不要恢复历史的 `agp/` 子工程或 bridge/fullGame 双工程口径。

## 排障路径

- **应用启动即崩**：先看 Manifest 组件、初始化器、JNI 和 WebView 入口，再看 GameApi 是否在宿主尚未准备好时解析对象。
- **界面能打开但数据为空**：检查 GameApi 的类/字段/方法解析和当前版本别名；确认失败是否被安全地记录为 `OREKI_API_MISS`。
- **自动化不动**：按 `allow → 原版调用 → note*` 顺序查日志；区分 `interval`、`noop-retry`、`failure` 与未知任务，不要只统计调用次数。
- **切后台后调度重复或设置丢失**：检查初始化是否幂等、是否保存应用级 Context、是否把 Activity 状态误当成存档状态。
- **页面阶段错乱**：回到统一阶段计算，核对现实/永恒/无限的持久记录，而不是在单个页面加临时判断。
- **R8 后才崩**：用 `mapping.txt` 还原堆栈，再检查反射类、Manifest、Gson 字段和 Kotlin/Smali 桥的 keep 范围。

## 相关条目

[Kotlin 混合运行时](/developer/architecture/kotlin-runtime) · [AGP 构建管线](/developer/build/agp) · [R8 代码边界](/developer/build/r8) · [DEX 与 ABI](/developer/reverse-engineering/dex-abi) · [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi)
