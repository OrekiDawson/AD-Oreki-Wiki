---
title: "协程 ABI 崩溃排查：先还原调用约定，再判断是否真的挂起"
description: "从 Kotlin suspend 降级、JVM/DEX 描述符、Continuation 实现和反射调用链定位混合运行时崩溃"
tags:
  - 排查
  - Kotlin
  - ABI
  - Smali
aliases:
  - "/troubleshooting/coroutine-abi"
---

协程 ABI 问题常常披着“某个方法突然找不到”或“动作调用后没有反应”的外衣。真正的根因通常更具体：调用者和被调用者对参数描述符、返回值、续体对象或类加载器的理解不一致。排查这类问题不能只看 Kotlin 源码，也不能只看反编译器生成的 Java；要把源码、JVM/DEX 形状和运行时对象逐层对上。

## 源码里的 `suspend` 到底变成了什么

以一个最小例子开始：

```kotlin
suspend fun reset(): Boolean
```

在 JVM ABI 中，它通常接近下面的调用边界：

```text
reset(Continuation<? super Boolean>): Object
```

这里有三件事容易被忽略：

1. `Continuation` 是编译器附加的最后一个参数，不在源码参数列表中。
2. 返回类型通常擦成 `Object`，因为同一个入口既可能直接返回 `Boolean`，也可能返回协程的挂起标记。
3. 编译器会生成状态机续体，保存 `label`、中间结果和恢复位置；恢复时由 `invokeSuspend` 继续执行。

如果函数本次无需挂起，它可以直接返回结果；如果执行到真正的挂起点，则会返回 `COROUTINE_SUSPENDED`，稍后通过续体恢复。于是下面两种调用都可能“能运行一部分”，但含义不同：

```text
正确：result = call(args..., continuation)
错误：result = call(args...)，然后把返回值强转 Boolean
```

在 DEX/Smali 中，应检查完整描述符，而不是只看方法短名：参数顺序、`Continuation` 所属包、返回类型、静态/实例属性和继承链都属于 ABI。JADX 生成的 Java 只是阅读视图，最终以 DEX/Smali 的 `.method` 声明为准。

## 带 `Continuation` 不等于“这是挂起函数”

本项目的永恒挑战入口提供了一个很好的反例。固定 Android 基线中的 `OrekiEcAutomation.kt` 记录了原版方法：

```text
is3.D(ZLrj0;)Ljava/lang/Boolean;
```

其中 `rj0` 映射到 `kotlin.coroutines.Continuation`，但该方法的实际指令是“检查是否可购买 → 扣除货币 → 写入解锁状态 → 刷新 UI”，同步返回 `Boolean`。它带有续体形状，是因为原版混淆后的调用约定如此，并不自动意味着它会返回 `COROUTINE_SUSPENDED`。

这一区分很重要：

- 对真正的 `suspend` 状态机，要按 `Object` 返回值和续体恢复路径处理；
- 对带续体参数但同步返回的原版方法，要保留 `Boolean` 结果和原版结算顺序；
- 不能因为看到 `Continuation` 就强行套用一个新的协程启动器，也不能因为调用一次成功就删掉最后一个参数。

## 项目中的两种续体边界

当前 Android 接管层把混淆入口集中在 `GameApi.kt` 和各功能模块的 ABI 适配层中。`GameApi` 的主要职责不是“把每次反射都包起来”，而是在首次使用时解析并缓存 `Class`、`Method`、`Field`，并在版本别名变化时集中处理映射。这样能把“类名错了”“方法属于父类而不是当前类”“同名短类被 R8 复用”与业务逻辑分开。

需要真正构造续体时，项目中的 `OrekiEcContinuation.java` 继承影子运行时的 `ContinuationImpl`，父构造器使用原版单例上下文，`invokeSuspend` 返回影子运行时的协程单例标记。它不是一个可以复制到任意方法上的模板；它只适合已经通过 DEX/Smali 证明需要这种续体形状的入口。

反过来，`OrekiEcAutomation` 的购买与进入挑战路径会调用原版 `D()`、货币 API 和挑战入口，并在调用后读取 `unlocked`、`current`、完成次数和余额。这里的工程原则是：调用返回和业务状态提交是两个事件。第一个事件成功，只说明 Java/Kotlin 调用没有立即抛异常；第二个事件成功，才说明原版状态机真正推进了。

## 症状如何映射到 ABI 边界

### 启动即崩：先看链接和描述符

`NoSuchMethodError`、`NoSuchFieldError`、`VerifyError`、`ClassNotFoundException` 或 `IncompatibleClassChangeError`，优先指向链接层。保留完整 `logcat`，找到第一个业务调用点，然后对照 APK 中的真实类和方法：

- 方法是否是静态调用，调用者却按实例方法生成？
- 最后一个参数是否缺少 `Continuation`，或指向了另一套 Kotlin 包？
- 返回值是 `Ljava/lang/Object;`、`Ljava/lang/Boolean;` 还是原版自己的包装类型？
- 方法实际声明在父类，反射却只查了错误的子类？
- D8/R8 是否把短混淆名复用给了结构完全不同的类？

这类故障不要先改业务条件。若描述符不匹配，业务代码甚至还没有真正开始运行。

### 不崩但动作不完成：区分返回值和状态提交

反射 `invoke` 成功返回一个对象，不代表对象就是业务结果。对协程入口，要记录返回对象的类型、是否等于挂起标记，以及续体是否收到恢复；对同步入口，要记录返回的 `Boolean`，并立即回读关键状态。

本项目的可迁移做法是记录一组最小状态：动作前后的资源余额、目标解锁位、当前挑战、完成次数和 `lastUpdate`。如果返回 `true` 但解锁位不变，问题在调用目标、实例或后置刷新；如果解锁位变了但界面不变，问题在缓存或 UI 事件；如果调用直接抛 `InvocationTargetException`，再展开其 cause 判断原版方法内部失败还是 ABI 入参不对。

### 界面存在但循环不推进：不要把活性问题叫成 ABI

线程反复回到同一个完成回调，状态字段和时间都不变化，通常是 livelock 或调度器重复重试；线程停在锁、队列或 `park` 上，才沿阻塞链调查。协程 ABI 错误可能造成“没有后续状态提交”，但它不是所有“不动”的统一解释。

项目中的自动化入口会把异常记为可见日志并返回无进展结果，而不是让每帧异常击穿主循环。排查时应同时看 ABI 日志、调度节拍和业务状态，不能只凭“页面还在显示”判断调用成功。

## 一条从 APK 到源码的排查路径

### 1. 固定运行对象

记录 APK SHA-256、设备 ABI、Android 版本、应用版本、源码提交和混淆映射版本。不同 APK 之间不要混用 Smali 片段；相同短名在 R8 复用后可能已经指向另一种类。

### 2. 从异常描述符反查 DEX

用 JADX 理解类的整体关系，用 `baksmali`、`apkanalyzer` 或等价工具确认 `.method` 的完整声明。至少保留：类名、父类、方法访问标志、参数描述符、返回描述符、调用指令和异常 cause。不要只截图一行反编译结果。

### 3. 对照 Kotlin 编译形状

如果是 `suspend` 方法，寻找最后一个 `Continuation` 参数、`Object` 返回值、状态机字段和 `invokeSuspend`；如果只是带续体参数的同步原版入口，确认其实际返回类型和指令是否直接完成业务写入。这个判断决定调用者应等待恢复，还是立即校验布尔结果。

### 4. 检查影子运行时是否成套

项目为了避免与官方 Kotlin 类冲突，使用 `oreki.shadow.kotlin.coroutines...` 的续体实现。检查 `ContinuationImpl`、上下文、协程单例和调用者是否来自同一套运行时；只替换一个类，容易得到“类能加载、续体不能恢复”的半兼容状态。

### 5. 做最小真实动作

只触发一个购买、研究解锁或挑战进入动作。先验证调用边界，再验证扣费、解锁位、当前挑战和 UI 刷新。静态编译通过只能说明字节码能生成；必须有一次设备上的动作与状态回读，才能声称该入口在运行时成立。

## 修复时的工程边界

- 不要通过直接写入解锁位、伪造货币或跳过原版检查来“修复” ABI；这会掩盖调用约定问题，也破坏存档语义。
- 不要把所有原版类全量反编译成 Kotlin 作为第一方案。项目选择缓存式反射，是因为游戏类只存在于 DEX，生成完整类型桩会引入泛型擦除、内部类命名和递归依赖等新问题。
- 不要把混淆名映射散落在业务文件中。类名、方法名、参数签名和版本别名应集中管理，并用构建期检查保证 Smali 重写表与 Kotlin 反射表同步。
- 每个 ABI 入口至少保留一个“方法可解析”、一个“真实动作成功”、一个“失败可见”的回归样本；对挂起入口再增加恢复路径和重复调用样本。
- 让失败变得可诊断：解析失败应有稳定日志标签，业务层应返回无进展而不是静默卡住，异常应保留原始 cause。

## 参考资料

- Android 固定基线 [`GameApi.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/fb1299a132f134eb4fab009643ee3fc3d6c57edf/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt)、[`OrekiEcAutomation.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/fb1299a132f134eb4fab009643ee3fc3d6c57edf/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiEcAutomation.kt) 与 [`OrekiEcContinuation.java`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/fb1299a132f134eb4fab009643ee3fc3d6c57edf/app/src/main/java/kajfosz/antimatterdimensions/OrekiEcContinuation.java)。
- [Kotlin 协程基础](https://kotlinlang.org/docs/coroutines-basics.html)、[Continuation API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/-continuation/) 与 [Android 运行时崩溃指南](https://developer.android.com/topic/performance/vitals/crash)。
- [DEX 与 ABI](/developer/reverse-engineering/dex-abi) · [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)。

## 相关条目

[存档兼容排查](/developer/troubleshooting/save-compatibility) · [AGP 构建管线](/developer/build/agp) · [故障排查](/developer/troubleshooting/)
