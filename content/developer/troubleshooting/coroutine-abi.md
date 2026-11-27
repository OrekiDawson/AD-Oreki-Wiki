---
title: "协程 ABI 排障"
description: "理解 Kotlin suspend 方法在 DEX 中的形状，并用日志、字节码和调用路径定位混合运行时故障"
tags:
  - 排查
  - Kotlin
  - ABI
aliases:
  - "/troubleshooting/coroutine-abi"
---

在 Kotlin 源码里，挂起函数像普通函数一样自然；到了 JVM/DEX，它会多出一个 `Continuation` 参数，返回值也可能暂时表现为 `Object`。反编译器把混淆名、协程状态机和不同版本的 Kotlin 运行时揉在一起后，调用者看到的就不再是源码签名。这个差异不是“反射很脆弱”这么简单：它决定了方法能不能被找到、参数能不能通过校验，以及一次本应完成的游戏动作会不会停在半路。

## 先理解 ABI

一个近似的源码函数：

```kotlin
suspend fun reset(): Boolean
```

在 JVM 形态中，调用边界通常接近：

```text
reset(Continuation): Object
```

`Continuation` 是 Kotlin 协程运行时的接口；编译器还可能生成 `ContinuationImpl` 子类保存状态。调用方不能只凭源码返回 `Boolean` 就把返回值强转成布尔值，也不能把参数列表缩成“没有参数”。若函数在当前路径同步完成，返回值可能是布尔结果；若需要挂起，可能返回协程内部的特殊标记，随后由续体恢复执行。具体行为必须以目标 APK 的 DEX/Smali 和当前运行时为准。

本项目的 Kotlin 接管层因此把混淆入口集中在 `GameApi.kt` 等文件中，按类名、方法名和参数个数解析；对确实要求续体的入口，使用项目已有的 `OrekiEcContinuation`，而不是随意构造一个“看起来像”的对象。`OrekiDilationAutomation.kt` 还把“启动已生效”和“启动超时”分开观察：调用返回并不等于游戏状态已经完成改变。

## 把症状分成三条因果链

**启动即崩**通常先看链接层：`NoSuchMethodError`、`NoSuchFieldError`、`VerifyError` 或 `ClassNotFoundException` 说明调用者期待的描述符、字段或父类层级与实际 DEX 不一致。此时先保留完整堆栈，确认首个业务调用点，再分别检查调用者和被调用者来自哪个 DEX；不要一上来重写业务逻辑。

**不崩但动作不完成**要看返回形态和状态变化。反射调用可能成功返回一个对象，但调用者没有正确识别挂起标记；也可能续体上下文不符合运行时假设，异常被异步路径吞掉。用日志记录“发起动作前后的同一状态字段”，并在逻辑线程抓栈，才能判断是 ABI 边界没接上，还是原版条件本来就不满足。

**界面仍在但游戏不推进**更像调度活性问题。若线程栈不断回到同一协程完成回调，且时间、资源或保存状态不变，这是 livelock 的信号；若线程在锁、队列或 `park` 上等待，才应沿同步阻塞方向调查。把两者都叫“死锁”会把排查带到错误的房间。

## 一条可复现的排查路径

先固定 APK、设备 ABI、Android 版本和源码提交，保存一次完整 `logcat`。随后做最小动作：只触发一个购买、重置或自动化入口，并记录动作前后的资源、阶段、`lastUpdate` 等可观察状态。这样可以判断问题在“找不到方法”“方法返回异常”还是“方法之后没有状态提交”。

接着回到产物检查调用边界：用 JADX 只做阅读，用 DEX/Smali 确认真实描述符、父类和 `Continuation` 参数。若源码映射写的是 `D(Boolean, Continuation)`，但产物里参数类型仍来自另一套 Kotlin 包，先查转换器和运行时拼接；不要用全量转换器覆盖官方类来碰运气。混合转换的目标是保留官方类的 ABI 形状，同时让新增 Kotlin 类使用与其兼容的运行时。

最后才检查业务条件：动作是否可买、是否需要先进入某个状态、调用是否改变了正确的 `Player` 实例。`GameApi` 特意不永久缓存读档前的 `Player` 对象，因为读档会替换单例；把旧实例当成当前实例，表现也会很像协程没有生效。

## 修复时守住边界

不要用写入位图、直接扣费或伪造奖励来绕过原版入口。正确修复应保持原版的检查、结算和事件路径，只修复调用者与运行时之间的 ABI 接线。每次改动至少应覆盖：方法解析、一次真实动作、动作后的状态变化，以及重启后是否还能继续。若只完成静态编译，仍不能把它写成运行时兼容；若只看到一次动作成功，也不能推断所有挂起入口都安全。

## 可迁移的经验

协程 ABI 的核心经验适用于任何反编译 Android 项目：把“源码语义”“编译后签名”“运行时对象”当成三份证据，逐层对齐；把反射解析集中管理；把“调用返回”和“业务状态提交”作为两个事件记录；为每个混淆版本保存映射与最小回归样本。这样下一次 Kotlin、R8 或反编译器升级时，异常会在构建或定向测试阶段暴露，而不是等玩家点下关键重置按钮才出现。

## 参考资料

- [Kotlin 协程官方文档](https://kotlinlang.org/docs/coroutines-basics.html)与 [Continuation API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/-continuation/)。
- Android 官方 [调试运行时崩溃指南](https://developer.android.com/topic/performance/vitals/crash)。
- Android 当前源码基线 [`fb1299a`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/fb1299a132f134eb4fab009643ee3fc3d6c57edf) 中的 `GameApi.kt`、`OrekiEcAutomation.kt` 与 `OrekiDilationAutomation.kt`。

## 相关条目

[DEX 与 ABI](/developer/reverse-engineering/dex-abi) · [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) · [存档兼容排查](/developer/troubleshooting/save-compatibility) · [AGP 构建管线](/developer/build/agp)
