---
title: "架构与运行时"
description: "Android 与 Web 两端工程结构、Kotlin 混合运行时 ABI、双端一致性与目录迁移"
tags:
  - 架构
  - 导航
---


本分类解释 Oreki Edition 怎样在官方基线上工作：Android 端如何把官方混淆 DEX 与新增 Kotlin 代码放进同一个运行时，Web 端如何基于冻结上游开发，以及两端行为如何保持一致。

## 页面

| 页面 | 主题 |
| --- | --- |
| [Android 架构](/developer/architecture/android) | AGP 工程、Gradle 构建输入、游戏类来源与构建守卫 |
| [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) | 官方混淆 Kotlin 与新增 Kotlin 的二进制边界、J8 混合转换 |
| [Web 架构](/developer/architecture/web) | 冻结上游、Playwright 验证与 oreki.net 部署边界 |
| [双端行为一致性](/developer/architecture/parity) | 阶段、资源、挑战、自动购买器的跨端等价要求与测试方法 |
| [目录标准化迁移](/developer/architecture/directory-migration) | 从双入口布局迁移到标准 AGP 工程的分阶段做法 |

## 先读哪一篇

- 想理解「为什么新增 Kotlin 会和官方运行时冲突」→ [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)。
- 想理解「构建产物是怎样拼出来的」→ [Android 架构](/developer/architecture/android) 与 [AGP 构建管线](/developer/build/agp)。
- 想知道「Android 与 Web 是否必须完全一致」→ [双端行为一致性](/developer/architecture/parity)。

## 相关分类

[逆向与语义映射](/developer/reverse-engineering/) · [构建与交付](/developer/build/) · [玩法机制](/player/gameplay/)
