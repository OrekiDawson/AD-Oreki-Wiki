---
title: "开发者专区"
description: "第一次参与 MOD、定位 Android/Web 代码、构建验证和排查问题的实际入口"
aliases:
  - "/history"
  - "/developer/history"
tags:
  - 开发者
  - 导航
---

想理解游戏背后的代码，或亲手修好一个问题？这里按开发任务组织知识，从第一次改动到两端的运行机制、构建和故障定位。

## 开发入门

- [项目概览](/developer/project-overview)：认识 Android 与 Web 两套实现、仓库及工程边界。
- [第一次参与开发](/developer/first-contribution)：完成一次小而可验证的改动，熟悉运行与提交流程。
- [编写指南](/developer/editorial-guidelines)：如何维护清晰、准确、可追溯的技术文档。

## 架构与实现

[架构专题](/developer/architecture/)按以下三条路线组织：

- **双端共通机制**：[双端一致性](/developer/architecture/parity)、[数值模型](/developer/architecture/numeric-model)、[调度器状态机](/developer/architecture/scheduler-state-machine)。
- **Android**：[Android 架构](/developer/architecture/android)、[Kotlin 运行时](/developer/architecture/kotlin-runtime)、[界面与阶段门禁](/developer/architecture/gui-stage-gates)。
- **Web**：[Web 架构](/developer/architecture/web)、[界面响应](/developer/architecture/web-ui-reactivity)、[离线进度](/developer/architecture/web-offline-simulation)。

## 源码与逆向

[源码与逆向](/developer/reverse-engineering/)介绍如何从字节码和调用关系恢复程序语义，包括[反编译与源码恢复](/developer/reverse-engineering/decompilation)、[Smali 接口恢复](/developer/reverse-engineering/smali-recovery)及[DEX 与 ABI](/developer/reverse-engineering/dex-abi)。

## 构建与发布

[构建与交付](/developer/build/)连接源码、构建产物和可验证的发行版本。可以从[AGP 构建](/developer/build/agp)、[R8](/developer/build/r8)、[APK 签名](/developer/build/apk-signing)或[持续集成与交付](/developer/build/ci-cd)进入。

## 故障排查

[故障排查](/developer/troubleshooting/)按照症状定位问题，而不是要求先熟悉完整工程。重点入口包括[存档兼容](/developer/troubleshooting/save-compatibility)、[协程 ABI](/developer/troubleshooting/coroutine-abi)和[Web 启动链](/developer/troubleshooting/web-module-startup)。

## 技术参考与证据

这些页面用于查证技术结论，不是开发入门的必读章节：

- [参考资料](/developer/references/)与[源码索引](/developer/references/source-index)。
- [项目状态与证据边界](/developer/current/)：理解源码、构建、行为和发布结论的区别。
- [运行证据索引](/developer/evidence/)与[AI Summary 索引](/developer/ai-summaries/)：查找验证资料与已审核摘要。

## 源码仓库

[Android](https://github.com/OrekiDawson/AD-Oreki-Edition-Android) · [Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web) · [Wiki](https://github.com/OrekiDawson/AD-Oreki-Wiki)

如果你只是想知道如何游玩、重置或者解锁下一阶段，请前往[玩家专区](/player/)。
