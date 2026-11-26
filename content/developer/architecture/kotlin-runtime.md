---
title: "Kotlin 混合运行时：在混淆宿主上建立一条可靠的 ABI 边界"
description: "Android MOD 如何让 Kotlin 业务代码与原版混淆 DEX 共存，并在反射、静态桥、生命周期和线程之间保持可诊断"
tags:
  - Android
  - Kotlin
  - ABI
aliases:
  - "/architecture/kotlin-runtime"
---

把 Kotlin 加进一个 Android 项目，通常只是再配置一个源码目录；把 Kotlin 加进一个已经编译、混淆、而且不能重新作为编译期依赖使用的游戏，则是另一类问题。这里的宿主不是一个可以随手导入的 Gradle module，而是一组只在运行时才知道真实形状的 DEX 类。MOD 的 Kotlin 代码必须在这两套世界之间搭桥，同时还要接受 Android 主线程、进程重建和原版游戏循环的约束。

本文讨论当前 Android 工程（基线 Commit [`fb1299a132f134eb4fab009643ee3fc3d6c57edf`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/fb1299a132f134eb4fab009643ee3fc3d6c57edf)）里的这种混合运行时。重点不是 Kotlin 语法，而是一个更实际的问题：当编译器看不见宿主的类型时，如何仍然建立可控、可升级、能定位故障的接口。

## 编译期看不见宿主，运行期却必须调用它

原版游戏的 `Player`、`BigDouble`、各层自动器和挑战对象存在于输入 DEX 中。Kotlin 编译器不能把这组 DEX 当作普通 Kotlin 类型库，于是 MOD 不能直接写出一个可靠的 `Player.current.infinityPoints` 调用。手工生成类型桩也不是免费方案：混淆后的内部类、泛型擦除、相互引用和继承层次会让“桩”逐渐变成另一份需要同步的伪源码。

当前工程选择把边界压缩到 `GameApi`。它用 `Class.forName` 找到宿主类，再以反射取得字段和方法；调用方只接触 `GameApi` 提供的少量、可读的操作。这个选择牺牲了编译期类型检查，却保留了一个重要的升级旋钮：版本变化时，集中更新类名、字段名、方法签名及其版本映射，而不是把混淆名散落在每个策略模块里。

这不是“每一帧都反射查找”。`GameApi` 对类、字段和方法保存解析结果，并用 ready 标志避免依赖宿主中可能不匹配的 Kotlin `lazy` 实现；失败路径返回空值或安全的否定结果，并记录 `OREKI_API_MISS`。因此一次版本漂移会变成一个能在 logcat 中寻找的接口缺口，而不是静默读到错误对象。官方 Kotlin 文档也把反射定义为运行时检查声明、读取属性和调用函数的机制；本工程使用的是 Java 反射层，正因为宿主只有运行时形状可用，而不是因为 Kotlin 反射更“高级”。

## ABI 的边界不在名字，而在调用契约

ABI 是调用者和被调用者共同遵守的二进制契约：类的实际名称、字段或方法名称、参数顺序、参数的 JVM 类型、返回类型，以及静态调用还是实例调用。混淆会改变名字，却不会让契约消失；它只是把“可读的接口名”换成了短名。

因此 `GameApi` 的每个适配点都同时维护三件事：

1. 可读的意图，例如“读取玩家当前的无限点数”；
2. 宿主的实际类和成员描述，例如混淆类、字段或方法及其参数个数；
3. 失败时的安全语义，例如返回 `null`，让上层把“无法确认”当成“暂不执行”，而不是猜测一个结果。

版本映射必须和构建期的别名表保持同源。若 Smali 描述符已经被重写到新类，而 Kotlin 反射仍查旧短名，补丁可能“打对了地方”，MOD 却从另一处读数据；反过来也一样。这类错位往往比立即崩溃更危险，因为它可能只表现为自动化不再推进。修改宿主接口时，先确认类的继承关系、成员签名和字段用途，再同时更新构建期映射与运行时访问层。

## Kotlin 如何把新代码交给旧调用点

宿主和少量过渡 Java 代码仍可能以 `invoke-static` 的形式调用 MOD 入口。Kotlin 的 `object` 提供单例状态，而 `@JvmStatic` 让函数在生成的 JVM 类上拥有静态桥。例如调度器以 `object OrekiAutomationScheduler` 保存节拍状态，再为 `init`、`allow`、`noteActed` 等入口标注 `@JvmStatic`。这样旧调用点不必知道 Kotlin 的单例实例，也不需要寻找 `INSTANCE` 后再转发。

这条桥有两个容易混淆的层次：静态桥解决的是“如何被调用”，并不解决“调用什么”。桥的参数和返回类型仍是 ABI；`allow(String): Boolean` 改成可空返回，或者把一个 `Context` 参数挪动位置，都会让已经编译的调用者失效。另一方面，桥内部仍可以调用 `GameApi`，把混淆宿主的反射细节留在边界内。Kotlin 官方的 Java 互操作说明也明确指出，`object` 中的 `@JvmStatic` 函数会生成可由 Java 直接调用的静态成员，同时保留单例语义。

## 生命周期：先有 Context，再谈持久化状态

`OrekiSpeed.init(Context)` 是当前 MOD 初始化链的入口之一。它保存应用上下文，先初始化速度和统一自动化调度器，再读取 `oreki_prefs` 中的开关、节拍和速度设置。这里使用应用上下文而不是 Activity 引用，目的不是追求形式上的“单例优雅”，而是避免把一个已经销毁的界面留在长期对象里。

初始化必须是幂等的：进程重建、Activity 重建或多个入口重复触发时，不能重复启动帧泵，也不能把内存状态重置成默认值。配置读取失败时，代码保留安全默认值；涉及“MOD 是否曾暂停原版大坍缩自动器”的标记则额外保存存档身份，防止玩家切换存档后误把上一份存档的所有权带过来。这个细节说明了持久化状态的真正边界：偏好是 MOD 的控制状态，游戏存档才是玩法状态，二者不能混为一张无来源的缓存表。

## 线程与节拍：反射安全不等于游戏状态安全

Android 默认在应用主线程分发组件回调，UI 工具包也不是线程安全的。MOD 因此不应把 UI 更新或宿主游戏对象的读写随意搬到后台线程；更重要的是，原版游戏循环本身还要求一拍内的状态变化具有顺序。

`OrekiAutomationScheduler` 把这个顺序写成了显式状态：全局最近一次真实动作的节拍、当前帧是否已经执行动作、每个任务的失败冷却、无操作重试窗口和预约时间。调用方先问 `allow(taskId)`，真正执行后再用 `noteActed` 或 `noteNoop` 告知结果。于是“允许调用”和“动作确实发生”不是一回事：一个任务可能通过了时间闸门，却因为宿主条件不满足而没有消费节拍；相反，首个真实动作会占据本帧名额，避免多个自动器在同一轮一起改写宿主状态。

这也是为什么调度器不能只看线程锁。锁能防止两个线程同时进入，却不能解释一个动作为什么被跳过、为什么后面的任务长期饥饿，或为什么重试窗口让某个关键任务永远等不到机会。调度器的状态机要和宿主调用的结果一起设计；状态转移应当发生在真实动作之后，而不是发生在“准备调用”的瞬间。

## 反射、静态桥和宿主状态的排错顺序

遇到崩溃或“界面还在、进度不动”时，先不要把所有问题都叫作 Kotlin ABI。按边界逐层缩小更快：

1. **先看异常类型和第一处宿主调用。** `ClassNotFoundException`、`NoSuchMethodException`、`IllegalAccessException` 和 `InvocationTargetException` 分别指向类名、签名、访问权限或被调用方法内部的异常；不要只看最末尾的包装异常。
2. **再核对静态桥。** 如果原版或过渡 Java 调用的是 `invoke-static`，检查 Kotlin 入口是否仍由 `@JvmStatic` 生成、参数是否还是原来的 JVM 形状。桥不存在时，问题尚未到达反射层。
3. **再核对版本映射。** 比对构建期描述符改写、运行时别名和实际输入 DEX；同一个短名在不同原版版本中可能指向完全不同的类。命中错误类比找不到类更难发现，应该用成员集合和继承关系确认，而不是只看类名存在。
4. **最后看生命周期和节拍。** 如果没有 ABI 异常，却出现空白、停顿或自动化饥饿，检查 `init` 是否先于调度、`Context` 是否可用、当前存档身份是否一致，以及 `allow`/`note*` 是否成对出现。必要时对照主线程栈和调度器诊断日志；“没有崩溃”不能证明游戏状态仍在推进。

## 可迁移的工程经验

这套混合运行时的价值不只在于救活一份混淆 APK。对任何无法在编译期完整获得宿主类型的插件系统，都有几条可复用的经验：把不稳定的名字和签名集中在窄边界；把成功、拒绝和“无法确认”区分开；用稳定的静态桥保护旧调用者；让初始化和持久化有明确的所有权；把调度结果建模为状态机，而不是把时间判断散落在业务函数里。

代价也必须明说：反射会把部分错误从编译期推迟到运行期，混淆版本升级仍需要重新核对，宿主内部的线程约束不会因为 Kotlin 更安全就自动消失。因此新增一个宿主访问点时，先为它定义失败语义和版本证据，再写业务策略；先让边界可诊断，再让功能变得聪明。

## 来源与历史入口

- Android 工程当前源码基线：[Commit `fb1299a`](https://github.com/OrekiDawson/AD-Oreki-Edition/tree/fb1299a132f134eb4fab009643ee3fc3d6c57edf)。重点阅读 `GameApi.kt`、`LegacyReflection.kt`、`OrekiAutomationScheduler.kt`、`OrekiSpeed.kt` 及 `R126SyntheticAccess.kt`。
- Kotlin 官方：[Calling Kotlin from Java](https://kotlinlang.org/docs/java-to-kotlin-interop.html)、[Reflection](https://kotlinlang.org/docs/reflection.html)。
- Android Developers：[Processes and threads overview](https://developer.android.com/guide/components/processes-and-threads.html)。
- 历史故障与原始证据仍保留在[协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi)和[DEX 与 ABI 反混淆](/developer/reverse-engineering/dex-abi)；它们是证据入口，不替代本文的原理说明。

## 相关条目

[Android 架构](/developer/architecture/android) · [AGP 构建管线](/developer/build/agp) · [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi) · [DEX 与 ABI 反混淆](/developer/reverse-engineering/dex-abi)
