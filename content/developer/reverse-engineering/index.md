---
title: "逆向与语义映射"
description: "官方混淆 DEX 的类、方法、字段映射与可安全使用的 ABI 适配方法"
tags:
  - 逆向
  - 导航
---


本分类说明怎样在不猜测的前提下理解和复用官方 3.21.0 混淆 DEX：哪些类与方法已经被核对，语义映射记录在哪里，以及新增业务代码应当怎样与混淆 ABI 隔离。

## 页面

| 页面 | 主题 |
| --- | --- |
| [DEX 与 ABI 反混淆](/developer/reverse-engineering/dex-abi) | 混淆名、真实描述符、语义映射与适配层纪律 |

## 与其他分类的关系

- 运行时冲突的机制与修复见 [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)。
- 具体崩溃与 livelock 的排查流程见 [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi)。
- 构建期如何使用这些映射见 [AGP 构建管线](/developer/build/agp)。

## 相关分类

[架构与运行时](/developer/architecture/) · [构建与交付](/developer/build/) · [参考资料](/developer/references/)
