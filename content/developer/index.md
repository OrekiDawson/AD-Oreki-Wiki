---
title: "开发者专区"
description: "第一次参与 Oreki Edition、定位 Android/Web 代码、构建验证和排查问题的实际入口"
aliases:
  - "/history"
  - "/developer/history"
tags:
  - 开发者
  - 导航
---

这里面向想要**读懂代码、完成一次修改或定位故障**的人。你不需要先读几十份 R 轮次报告。先选择一个具体任务，再去对应的源码和操作手册；历史构建与测试报告只在需要核验证据时阅读。

Oreki Edition 有 Android 与 Web 两套实现，目标是保持玩家可见的成长规则一致，但两边的代码、构建工具和发布方式并不相同。请选择你准备修改的平台。

## 第一次来：完成一条最小开发路径

从[第一次参与开发](/developer/first-contribution)开始。它选择 **Web 本地只读运行 → 跟踪启动入口 → 提交一次有来源的文档小改动**作为练习，避免上来就碰签名、官方 DEX 或真实存档。

你会实际遇到三个文件：

- [`serve.mjs`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/serve.mjs)：提供本地 HTTP 服务，让浏览器能加载 ES 模块。
- [`src/main.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/main.js)：导入基础模块并在浏览器检查通过后调用 `init()`。
- [`src/game.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/game.js)：游戏初始化、运行流程与部分 MOD 自动化的集成点。

这一小段足以让你了解“文件入口在哪里、如何运行、怎么验证一处改动”，之后再进入更复杂的业务模块。

## 按任务进入

| 现在要完成的任务 | 入口 | 下一步 |
| --- | --- | --- |
| 第一次改动 | [第一次参与开发](/developer/first-contribution) | 先完成 Web 最小闭环，再选择平台 |
| 找到功能所在的模块和调用链 | [架构总览](/developer/architecture/) | [Android 架构](/developer/architecture/android)、[Web 架构](/developer/architecture/web) |
| 在本地构建并验证 Android | [构建与交付](/developer/build/) | [AGP 构建管线](/developer/build/agp)、[R8](/developer/build/r8)、[CI/CD](/developer/build/ci-cd) |
| 对照两端行为 | [双端行为一致性](/developer/architecture/parity) | 逐项核对输入、资源变化、解锁与结算，不把目标当成实测结果 |
| 根据症状缩小故障范围 | [故障排查](/developer/troubleshooting/) | [协程 ABI](/developer/troubleshooting/coroutine-abi)、[存档兼容](/developer/troubleshooting/save-compatibility) |
| 查准确的文件、符号或字段 | [开发者参考](/developer/references/) | [源码索引](/developer/references/source-index) 与对应固定版本来源 |

**从仓库源码出发，而不是从历史结论倒推代码。** 例如想知道当前调度器是否会修改自动购买器的启用状态，应先看当前 Kotlin 或 JS 的受管状态实现，再核实具体游戏行为；不能仅凭早期报告中的一句“手动优先”判断所有版本。

## 面向玩家的内容在哪里？

本站分为两个入口：[开发者专区](/developer/) 保存实现、构建与问题定位方法；[玩家专区](/player/) 解释游戏机制、解锁和实际操作。如果你只是想了解某项游戏功能如何使用，应先读玩家版，再按需要回到这里查源码与验证证据。

## 两套代码在哪里？

**Android**：[OrekiDawson/AD-Oreki-Edition-Android](https://github.com/OrekiDawson/AD-Oreki-Edition-Android)。当前仓库根目录的 `:app` 是 Android 应用模块，生产业务代码位于 `app/src/main/kotlin/`，构建输入和门禁由根 `app/build.gradle.kts` 与 `build-logic/` 共同准备。官方 3.21.0 DEX 属于冻结基线，不允许用新 Java/Smali 业务直接覆盖。源码阅读可从 [`OrekiStageAuto.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt) 开始。

**Web**：[OrekiDawson/AD-Oreki-Edition-Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web)。入口在 `src/`，核心机制与 MOD 扩展在 `src/core/`，浏览器组件在 `src/components/`。Web 基于冻结的上游快照，不可把 Android 中的混淆类名当作 Web 模块名。

**两套代码各有自己的边界。** Android 与 Web 共享玩家可见的成长规则，但使用不同的语言、模块和构建工具；阅读源码时应以对应平台的入口、类型和调用链为准。

## 怎么判断一项工作已经完成？

开发文档里常见的几种“成功”其实是不同的层级：

- **源码定位正确**：找到了真实文件、函数和调用关系。
- **命令执行成功**：有对应环境、退出状态和实际输出。
- **CI 通过**：对应 Commit 的检查符合它自己的检查范围。
- **功能验证通过**：在匹配的设备、浏览器和游戏进度下观察到预期行为。
- **允许发布**：还需满足对应发布规则、签名、存档与实际运行等门禁。

这些层级回答的是不同问题：源码定位帮助你找到改动位置，命令输出说明工具是否按预期工作，功能验证则说明玩家实际看到的结果。不要把其中一个层级的证据误当成另一个层级的结论。

## 附属资料与历史证据

[项目与仓库概览](/developer/project-overview)解释工程目标和平台基线；[双端交付证据](/developer/current/project-status)与[已知问题](/developer/current/known-issues)解释版本身份、运行边界和状态机排查；旧故障的原始报告保留在源码仓库和内部归档中，**不代替今天的源码**。

[运行证据索引](/developer/evidence/)用于回到构建、测试或设备记录；[已审核 AI 摘要](/developer/ai-summaries/)只作为正文之后的辅助资料。它们不是入门路线，也不能替代源码、操作指南或故障排查正文。

---

*本文的 Android 源码定位基于 `9d8fc46ce99279720b5b3068027bb76bceb35756`，Web 入口基于 `90d89de2`。源码、构建产物和设备运行是不同证据层级；需要判断实际行为时，请沿各专题的证据入口继续核对。*

