---
title: "Kotlin 混合运行时 ABI"
description: "官方混淆 Kotlin 运行时与 AGP 新编译代码的二进制边界，以及 J8 混合转换为什么是必需的"
tags:
  - Android
  - Kotlin
  - ABI
aliases:
  - "/architecture/kotlin-runtime"
---


Android 版 MOD 新增的 Kotlin 代码要和官方游戏原有的混淆程序一起运行。两边编译时用的 Kotlin 运行时不同，对同一个类的字段名、方法签名假设也不同，直接拼在一起就会在运行期报错，甚至卡死而不崩溃。

这里的**二进制接口（ABI）**指运行时真正用到的类名、字段名、方法参数和返回值。两个类在源码里作用相同，只要这些接口对不上，运行时就会找不到字段或方法。

## 问题背景

AGP 完整游戏由两部分组成：

1. 官方 3.21.0 混淆 DEX 转换而来的游戏类；
2. MOD 新增 Kotlin 业务类（约 25 个）。

两者对 Kotlin 运行时的 ABI 假设不同，直接混用会出现：

- `NoSuchFieldError: EmptyCoroutineContext.a`：官方字段名是 `a`，现代 stdlib 是 `INSTANCE`；
- `NoSuchMethodError: ContinuationImpl.<init>(Lrj0;Lek0;)V`：默认包混淆的参数类型没有对上。

## 真实描述符（已核实）

| 符号 | 官方 DEX 形态 | AGP stdlib 形态 |
| --- | --- | --- |
| EmptyCoroutineContext | 静态字段 `a` | `INSTANCE` |
| ContinuationImpl 构造器 | `(Lrj0;Lek0;)V` | `(Lkotlin/coroutines/Continuation;Lkotlin/coroutines/CoroutineContext;)V` |
| CoroutineSingletons | `a` | `COROUTINE_SUSPENDED` |

其中 `rj0` = `kotlin.coroutines.Continuation`，`ek0` = `CoroutineContext`（默认包混淆名）。

## 解决路线

- **隔离命名**：72 个官方 Kotlin 类统一改名为 `oreki/shadow/kotlin/**`，新增类全部绑定 shadow 形态；
- **构建期守卫**：`scripts/agp/check_a_batch_abi.py` 对 A 批类逐条断言 ABI，违反即构建失败；
- **保持 J8 混合转换形态**：官方类以 enjarify 为基线，少量协程调度热路径类（`ox0/gk0/dc2/tf2/vf2/t01`）使用 dex2jar 版本。全量 enjarify 会让逻辑线程在 SpeedrunMilestone 协程链 livelock；全量 dex2jar 则会因「`new 子类 + invoke-direct 父类构造器`」被改写而触发 ART `VerifyError`。

这三条缺一不可：只隔离命名不修转换器，仍会 livelock；只修转换器不隔离命名，仍会 `NoSuchFieldError`。

## 为什么会 livelock，而不是崩溃

全量 enjarify 的候选能启动、能显示界面，但逻辑线程的 Runnable 一直停在协程链里空转（utm≈127 秒），tick 不推进。因为不崩溃，表面上「游戏还在」，实际存档与自动化都停摆。这类问题必须用线程栈对照才能定性，排查流程见 [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi)，历史定位过程见 [2026-11-15 · R113-01 逻辑线程 livelock 的 P0 闭环](/developer/history/2026-11-15-r113-p0-livelock)。

## 结论与边界

描述符差异、J8 混合转换的必要性和构建守卫都已核实；修复后同一 APK 上新档首写 40.2 秒，5 分钟自动化运行 0 ABI 崩溃。这套 ABI 约定对后续新增类并不自动成立，每个新类仍需单独核对。

另外，协程 ABI 修复 PASS 只说明这一类崩溃消失，不等于 180 分钟通关 PASS，也不等于发布门禁 PASS。Web 已有一份 174.19 分钟真实新档终局 PASS；Android R121 的终局运行复验为 **NOT RUN**，源码修复已提交，等待包含两项 P1 修复的新构建实跑，不能把 Web 结果移植成 Android 结论，见 [当前项目状态](/developer/current/project-status)。

## 参考资料

- [Android PR #88（J8 混合转换修复）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/88)，合并 Commit `ae734966bf712faca3ff7bbb389d8724a8efe7e5`
- [docs/FACTS.md 第 8 节与第 10 节](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/mechanics.md)：机制与已修复根因
- [历史：R113-01 P0 闭环](/developer/history/2026-11-15-r113-p0-livelock)

## 相关条目

[协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi) · [AGP 构建管线](/developer/build/agp) · [Android 架构](/developer/architecture/android) · [DEX 与 ABI 反混淆](/developer/reverse-engineering/dex-abi)
