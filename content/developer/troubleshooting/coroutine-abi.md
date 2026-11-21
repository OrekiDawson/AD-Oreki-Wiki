---
title: "协程 ABI 崩溃排查"
description: "从 NoSuchFieldError、NoSuchMethodError 与逻辑线程空转出发，定位混合运行时 ABI 与转换器问题"
tags:
  - 排查
  - Kotlin
aliases:
  - "/troubleshooting/coroutine-abi"
---


当 AGP 完整游戏候选出现「启动即崩」或「看起来在跑但完全不推进」时，最常见的原因是**协程 ABI 与官方混淆运行时不一致**。本条目给出一套从症状到根因的排查顺序，避免把调度问题误判成存档或资源问题。

## 典型症状

1. `NoSuchFieldError: No field a of type EmptyCoroutineContext` —— 新类绑定了现代 stdlib（`INSTANCE`），官方 DEX 里字段名是 `a`。
2. `NoSuchMethodError: ContinuationImpl.<init>(Lrj0;Lek0;)V` —— 定向 remap 后仍有引用指向现代 stdlib 描述符。
3. **无崩溃但不写档、tick 不推进** —— 线程栈停在 `SpeedrunMilestone$complete` 协程链，属于 livelock 而非死锁。

第 3 类最容易被误判：界面还在、日志没有 FATAL，但周期存档与自动化全部停摆。

## 定位流程

1. **logcat**：取崩溃栈与 ABI 错误，确认是字段、方法还是类型转换问题。
2. **线程栈**：`kill -3` 抓全线程栈，确认逻辑线程是 Runnable 空转还是 Waiting/park。
3. **对照稳定版**：用 smali 稳定版或已知可用构建的同线程状态做比较。
4. **检查构建管线**：官方类转换器是否被改成了全量 enjarify（最常见的回归点）。
5. **检查构建守卫**：A 批 ABI、plain Kotlin 引用、继承层级、dash 类名还原是否通过。
6. **检查转换组合**：enjarify 与 dex2jar 是否按 J8 混合形态使用。

## 修复要点

- 新增类统一绑定 `oreki/shadow/kotlin` 形态；
- 官方类保持 J8 混合转换（见 [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)）；
- 守卫 fail-closed：宁可构建失败，也不要把 ABI 问题推到运行期；
- 修完后至少验证：新档首写、HOME 保存、重启读取、5 分钟自动化无 ABI 崩溃。

## 常见误判

- **「不写档 = 保存链坏了」**：先看 tick 是否还在推进；tick 停住时保存通道本来就不会触发。
- **「没崩溃 = 没问题」**：livelock 没有任何 FATAL，只能靠线程栈识别。
- **「多跑一会儿会自己好」**：ABI 与转换器问题是确定性的，不会自愈。
- **「换了转换器就解决了」**：全量 dex2jar 会引入 ART `VerifyError`，必须按混合形态验证。

## 已确认与未确认

- **已确认**：三类症状的机制、J8 混合转换的修复效果、构建守卫的拦截点。
- **未确认**：新增类在未来是否还会遇到同类 ABI 差异；每个新类都需要单独核对。
- **边界**：修复 ABI 崩溃不等于 180 分钟通关，也不等于发布门禁通过。

## 参考资料

- [docs/FACTS.md §8 与 §10（机制与已修复根因）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/mechanics.md)
- [Android PR #88](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/88)
- [历史：R113-01 P0 闭环](/developer/history/2026-11-15-r113-p0-livelock)

## 相关条目

[Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) · [挑战与真实结算](/player/gameplay/challenges) · [AGP 构建管线](/developer/build/agp) · [存档兼容与自动保存](/player/gameplay/saves)
