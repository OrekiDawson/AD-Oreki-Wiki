---
title: "架构"
description: "从双端共同机制、Android 与 Web 三条路线理解游戏实现"
tags:
  - 架构
  - 导航
aliases:
  - "/architecture"
---

Android 和 Web 是同一套游戏规则的两种实现。理解架构时，不必从头读完所有技术文章：先决定要研究共同机制，还是某个平台的具体实现。

## 双端共通机制

| 想了解什么 | 阅读入口 |
| --- | --- |
| 两端如何保持相同的游戏行为 | [双端行为一致性](/developer/architecture/parity) |
| 游戏怎样处理极大的数值与存档进度 | [超大数值](/developer/architecture/numeric-model) · [存档进度比较](/developer/architecture/save-progress-comparator) |
| 倍率、派生数据与缓存如何组织 | [效果模型](/developer/architecture/effect-model) · [派生状态](/developer/architecture/derived-state-invalidation) |
| 自动化怎样选择操作、管理状态 | [调度器状态机](/developer/architecture/scheduler-state-machine) · [自动化所有权](/developer/architecture/automation-ownership) |
| 天神机制和教程如何落地 | [天神实现](/developer/architecture/celestial-implementation) · [教程内容管线](/developer/architecture/tutorial-content-pipeline) |

## Android

从 [Android 架构](/developer/architecture/android) 开始，理解官方基线、新增 Kotlin、构建输入与运行时之间的关系，再按实际问题继续阅读。

- [Android 目录迁移](/developer/architecture/directory-migration)：工程目录为何这样组织。
- [Kotlin 混合运行时](/developer/architecture/kotlin-runtime)：新增代码怎样跨越宿主接口边界。
- [Android 阶段门禁](/developer/architecture/gui-stage-gates)：功能什么时候可以出现在界面上。
- [Android 界面同步](/developer/architecture/android-gui-sync)：业务状态如何传递到界面。

涉及混淆符号或方法接口时，转到[源码与逆向](/developer/reverse-engineering/)；涉及构建产物时，转到[构建与发布](/developer/build/)。

## Web

[Web 架构](/developer/architecture/web) 是浏览器端的起点。追踪页面状态时阅读 [Web 界面响应](/developer/architecture/web-ui-reactivity)，研究关掉页面后如何结算时阅读 [Web 离线进度](/developer/architecture/web-offline-simulation)。

## 延伸阅读

- [第一次参与开发](/developer/first-contribution)：从一个最小改动建立开发经验。
- [项目概览](/developer/project-overview)：了解仓库、模块与平台边界。
- [DEX 与 ABI](/developer/reverse-engineering/dex-abi)：理解逆向恢复的接口语义。
- [故障排查](/developer/troubleshooting/)：根据实际症状定位问题。
- [源码索引](/developer/references/source-index)及[运行证据](/developer/evidence/)：进一步核实技术事实。

返回[开发者专区](/developer/)。
