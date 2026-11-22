---
title: "开发者专区"
description: "第一次参与 Oreki Edition、定位 Android/Web 代码、构建验证和排查问题的实际入口"
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

## 已经知道想改什么？

| 想解决的问题 | 从哪里开始 | 接下来查什么 |
| --- | --- | --- |
| Android 的界面、阶段或调度器 | [Android 架构](/developer/architecture/android) | 业务 Kotlin、`GameApi`、自动化入口与阶段判定 |
| Web 的初始化、系统或自动购买器 | [Web 架构](/developer/architecture/web) | `src/main.js` → `src/game.js` → `src/core/` |
| 在本地构建 Android APK | [AGP 构建管线](/developer/build/agp) | bridge/骨架包与 fullGame 两种模式的明确区别 |
| 检查 Android/Web 行为是否一致 | [双端行为一致性](/developer/architecture/parity) | 对照真实输入、资源变化、解锁和结算 |
| 排查存档或 ABI 故障 | [故障排查](/developer/troubleshooting/) | 按错误表象定位源码、日志与可复现输入 |
| 找发布规则与实际结果 | [构建与交付](/developer/build/) | Required Checks、签名、APK 指纹、设备及部署证据 |

**从仓库源码出发，而不是从历史结论倒推代码。** 例如想知道当前调度器是否会修改自动购买器的启用状态，应先看当前 Kotlin 或 JS 的受管状态实现，再核实具体游戏行为；不能仅凭早期报告中的一句“手动优先”判断所有版本。

## 面向玩家的内容在哪里？

本站分为两个入口：[开发者专区](/developer/) 保存实现、构建与问题定位方法；[玩家专区](/player/) 解释游戏机制、解锁和实际操作。如果你只是想了解某项游戏功能如何使用，应先读玩家版，再按需要回到这里查源码与验证证据。

## 两套代码在哪里？

**Android**：[OrekiDawson/AD-Oreki-Edition-Android](https://github.com/OrekiDawson/AD-Oreki-Edition-Android)。MOD 的生产业务代码集中在 `app/src/main/kotlin/`，AGP 工程在 `agp/`。官方 3.21.0 DEX 属于冻结基线，不允许用新 Java/Smali 业务直接覆盖。源码阅读可从 [`OrekiStageAuto.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt) 开始。

**Web**：[OrekiDawson/AD-Oreki-Edition-Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web)。入口在 `src/`，核心机制与 MOD 扩展在 `src/core/`，浏览器组件在 `src/components/`。Web 基于冻结的上游快照，不可把 Android 中的混淆类名当作 Web 模块名。

**跨仓任务与规则**：[Workspace](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace) 负责协调授权、任务和统一约束，不替代两端的源码与自动化验证。每次动手前先读目标仓库的 `AGENTS.md` 和适用交付规则；不要凭 Wiki 文章代替现行授权。

## 怎么判断一项工作已经完成？

开发文档里常见的几种“成功”其实是不同的层级：

- **源码定位正确**：找到了真实文件、函数和调用关系。
- **命令执行成功**：有对应环境、退出状态和实际输出。
- **CI 通过**：对应 Commit 的检查符合它自己的检查范围。
- **功能验证通过**：在匹配的设备、浏览器和游戏进度下观察到预期行为。
- **允许发布**：还需满足对应发布规则、签名、存档与实际运行等门禁。

其中一个通过，不能自动推出后面的也通过。未执行的事项明确写 `NOT RUN`，不要为了让报告好看而填 `PASS`。

## 想追查历史或当前状态

[项目与仓库概览](/developer/project-overview)解释工程目标和平台基线；[当前状态](/developer/current/project-status)与[已知问题](/developer/current/known-issues)记录候选阶段的事实；[来源索引](/developer/references/source-index)帮助回到原始文件；[历史归档](/developer/history/)用于追查旧故障，**不代替今天的源码**。

[运行证据索引](/developer/evidence/)与[已审核 AI 摘要](/developer/ai-summaries/)保留作为辅助资料，而不是入门路线。真正要修代码时，优先用上面的任务入口。

---

*本文中的源码定位基于 2026-11-22 检查的 Android `3b2d8284` 与 Web `90d89de2`。本页只进行了源码和链接路径阅读，未执行 APK 构建、设备操作或完整游戏验收。*

全站页面范围、旧 URL 兼容入口和玩家/开发者分台账由仓库内的 `docs/全站重构页面台账.md` 维护；公开页面以当前站点与各专区入口为准。
