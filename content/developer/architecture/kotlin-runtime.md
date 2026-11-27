---
title: "Kotlin 运行时"
description: "理解 MOD 如何用 GameApi、静态桥和调度器连接 Kotlin 业务与原版 DEX"
tags:
  - 开发者
  - Android
  - Kotlin
  - ABI
aliases:
  - "/architecture/kotlin-runtime"
---

把 Kotlin 加进普通 Android 项目，通常只是增加一个源码目录；把 Kotlin 加进已经编译、混淆、只能在运行时加载的游戏，则是在设计一条 ABI 边界。编译器看不见宿主的 `Player`、`BigDouble` 或自动购买器类型，但业务代码仍要读取它们、调用它们，并在版本变化时知道自己究竟调用了谁。

本文基于 Android 固定 Commit [`9d8fc46`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/9d8fc46ce99279720b5b3068027bb76bceb35756)，重点阅读 `GameApi.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt）、`OrekiSpeed.kt`、`OrekiAutomationScheduler.kt`、`app/build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/build.gradle.kts）以及 `app/proguard-rules.pro`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/proguard-rules.pro）。

## 两个世界，三种连接

```text
官方/宿主 DEX
  ├─ Player、货币、维度、挑战、存档对象
  ├─ 混淆类名与成员签名
  └─ 原版游戏循环与 Android 组件
          ▲
          │  Class.forName / Field / Method
          │  Smali 描述符与静态 JVM 桥
          ▼
Kotlin 业务层
  ├─ GameApi：缓存式反射与版本别名
  ├─ OrekiSpeed：应用级初始化与设置
  └─ Scheduler：节拍、结果和任务状态
```

这里有三种不同的“连接”：

1. **反射连接**：GameApi 在运行时按类名、字段名和方法签名寻找宿主对象。
2. **静态桥连接**：Smali 或旧 Java 调用点需要 `invoke-static` 时，Kotlin 的 `object` 配合 `@JvmStatic` 暴露稳定的 JVM 入口。
3. **状态连接**：调度器不直接拥有游戏状态，而是通过 GameApi 读取条件、调用宿主动作，再根据真实结果推进自己的状态机。

把反射、静态桥和状态机混成一件事，会让排障失去方向：静态桥存在，不代表反射目标正确；反射成功，也不代表动作改变了玩家状态。

## 为什么选择缓存式反射

`kotlinc`不能把 APK 中的 DEX 当作普通 Kotlin classpath。为宿主生成类型桩看似能恢复类型检查，却会把混淆后的内部类、泛型擦除、继承关系和相互引用复制成另一份需要维护的伪源码；把整套游戏反编译成 Java 再编译，则等同于重写宿主。

因此 `GameApi.kt` 把宿主访问集中在一个适配层：首次使用时解析 `Class`、`Field` 和 `Method`，随后缓存解析结果。业务策略只看到“读取无限点数”“检查是否可永恒”或“调用某个原版操作”这样的意图，不在每个文件里散落 `Class.forName("bq0")`。

这个选择的代价也很明确：部分错误从编译期推迟到运行期。工程用三种办法降低代价：

- 类名和成员签名集中在 GameApi，版本别名与构建期绑定表保持同源；
- 解析失败返回安全的空值/否定结果，并记录 `OREKI_API_MISS`，不把异常直接抛进游戏主循环；
- 每个适配点保留调用契约，记录它需要的参数类型、返回类型和宿主版本证据。

“安全的否定结果”并不等于“功能正常”：它只保证未知状态不会被误判为可以买、可以重置或可以解锁。上层必须把“无法确认”作为可诊断状态处理。

## ABI 不只是类名

反射适配点的 ABI 至少包括：

- 实际类名和内部类的 `$` 层级；
- 字段或方法名称；
- 参数顺序、JVM 参数类型和返回类型；
- 静态调用还是实例调用；
- 需要保留的 `Signature`、注解和封闭方法属性。

混淆只改变可读名字，不会消除这份契约。当前 GameApi 还要处理版本别名：生成的 `OrekiBaselineBindings` 把一个冻结基线的短名映射到另一个基线，而 Smali 描述符也可能在构建阶段被改写。只更新 Kotlin 的映射却不更新 Smali，或者反过来，都会得到“补丁看似打中了、运行时却读错对象”的错位。

修改一个适配点时，先核对目标 DEX 中的方法签名、字段数量、继承关系和调用方，再同时检查构建期绑定。不要只因为一个短名类存在，就认为它是正确目标；混淆器可以在不同版本复用同一个短名。

## 静态桥

Kotlin `object` 适合保存调度器或设置状态，但 Java/Smali 旧调用点通常需要静态方法。对外暴露的 `@JvmStatic` 方法会在生成的 JVM 类上提供静态入口，同时保留 Kotlin 单例的状态语义。这个桥解决的是“怎么调用”，不是“调用什么”：参数和返回类型仍是 ABI，内部仍必须通过 GameApi 访问宿主。

例如调度器可以把 `allow(taskId)`、`noteActed(taskId)` 和 `noteNoop(taskId)`作为稳定的静态桥。若把 `Boolean` 改成可空返回，或移动参数顺序，已经编译的 Smali 调用者不会替你重新适配。反过来，若桥签名稳定，内部可以更换缓存、日志或反射实现，而不必修改每个调用点。

## Android 生命周期

`OrekiSpeed` 这类初始化入口需要处理 Android 的进程和 Activity 生命周期，而不是只在“第一次打开页面”时设置全局变量。长期对象应保存 `applicationContext`，避免把 Activity 引用带进进程级调度器；初始化应幂等，避免 Activity 重建、切后台恢复或多个组件入口重复启动帧泵。

设置、存档和界面引用的所有权也不同：

- MOD 开关、节拍和速度设置属于偏好，存放在应用级配置；
- 玩家进度属于宿主存档，由原版存档路径负责序列化；
- Activity/View 只属于当前界面生命周期，销毁后必须重新绑定。

如果把三者塞进同一个全局缓存，切换存档或重建 Activity 时就可能把上一份存档的暂停标记、旧 UI 引用或默认设置带到新状态中。

## 调度状态机

`OrekiAutomationScheduler` 的核心不是“开一个线程定时调用”，而是显式记录动作节拍、当前帧名额、每任务失败冷却、无操作重试窗口和预约状态。一次任务应遵循：

```text
allow(taskId)
      ↓ 通过
GameApi 读取条件并调用宿主
      ↓
成功       → noteActed：推进全局节拍、占用本帧名额
无操作     → noteNoop：只延迟该任务，不消耗全局节拍
异常/失败  → noteFail：进入失败冷却
```

锁只能防止并发进入，不能说明动作为什么被跳过，也不能防止一个永远 no-op 的任务饿死其他任务。把结果写回状态机，才能区分“没到时间”“条件不满足”“宿主调用失败”和“真的改变了游戏”。

这也是线程边界：UI 更新和宿主游戏对象访问必须遵守 Android/原版循环的线程约束；后台线程不能因为拿到了 Java 对象引用，就随意改写玩家状态。若需要异步等待，应把结果重新交回安全的生命周期和调度入口，而不是把反射调用散落到任意协程。

## 版本升级时怎样改得安全

1. **固定输入**：记录 Android 源码 Commit、原版 APK/Dex 基线和生成绑定版本。
2. **核对 ABI**：比较目标类的签名、字段、继承关系和静态/实例调用方式，不只比较短名。
3. **更新适配层**：集中修改 GameApi 与 `OrekiBaselineBindings`，避免业务模块自己加入新混淆名。
4. **检查桥和 keep**：确认 `@JvmStatic` 生成的入口、Smali 描述符、Manifest 组件、Gson 字段、JNI/WebView 方法仍被保留；参考 [R8 专题](/developer/build/r8)。
5. **验证失败语义**：类找不到、签名不匹配、条件不满足和动作 no-op 应分别产生可识别结果。
6. **再验证玩法**：至少覆盖冷启动、Activity 重建、自动化节拍、旧存档导入/写回和一个真实重置；构建成功不替代这些运行时检查。

## 按症状排查

**`ClassNotFoundException`**：先核对版本别名和输入 DEX，再看 R8 是否重命名/删除了反射目标。不要立即扩大成整个包的 keep。

**`NoSuchMethodException` 或 `IllegalArgumentException`**：比较参数数量、基本类型与返回类型；反射方法找到了但调用失败，通常是签名契约不一致。

**静态桥报找不到方法**：检查 `@JvmStatic` 是否仍在、生成类名和 JVM 签名是否改变；这还没到 GameApi 层。

**没有异常但自动化停滞**：检查 GameApi 是否返回了安全否定值，再看 `allow` 的拒绝原因和 `noteActed/noteNoop/noteFail` 是否与真实结果成对。沉默停滞往往比崩溃更像版本映射错误。

**旧存档数值消失**：Gson 的字段名是外部格式的一部分。对照 `player.json` 键名与 R8 后字段，确认 `Signature` 和存档字段 keep 规则仍生效，再做写回和重新导入。

## 可迁移的经验

混合运行时的可维护性来自“窄而诚实的边界”：不稳定的名字集中管理，动态入口留下证据，成功与未知分开，初始化有明确所有权，调度结果进入状态机。反射不是类型安全的替代品，但可以是受控的兼容层；前提是每一次反射都知道自己在连接哪个版本、为什么失败，以及失败后系统应该停在哪里。

## 相关条目

[Android 架构](/developer/architecture/android) · [AGP 构建管线](/developer/build/agp) · [R8 代码边界](/developer/build/r8) · [DEX 与 ABI](/developer/reverse-engineering/dex-abi) · [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi)
