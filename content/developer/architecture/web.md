---
title: "Web 架构"
description: "跟踪 Web 端从浏览器启动、读取存档到游戏循环、策略调度和自动购买器托管的真实代码路径"
tags:
  - Web
  - 架构
aliases:
  - "/architecture/web"
---

Oreki Edition 的 Web 端不是一套独立于原版的小游戏。它从《反物质维度》的冻结源码延伸，保留游戏主循环、资源计算和合法结算入口，再在这些入口周围组织 MOD 的阶段策略和自动化。要修改某个功能，首先应分清：**谁负责启动游戏，谁实际修改游戏状态，谁只决定下一步做什么**。

本文对应 [Web 仓库提交 `90d89de2`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/tree/90d89de2048332f3c329ae6834ebee2675453a02)。冻结的原版上游是 2026 年 7 月 17 日的 `5409e320cecef96a917cca1dfb68f1f183e499ca`。以下文件与函数均按该 MOD 提交核对；当前 `main` 若更新，请先比较 Diff。

## 先沿启动路径走一遍

浏览器通过 `src/main.js` 进入游戏。这个文件准备兼容层和全局工具，随后从 `src/game.js` 导入两个函数：

```js
import { browserCheck, init } from "./game.js";
if (browserCheck()) init();
```

[`browserCheck()`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/game.js#L1750-L1752) 检查受支持的浏览器；[`init()`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/game.js#L1754-L1768) 则初始化运行环境和云端接口，调用 `GameStorage.load()` 读取游戏存档，并尝试恢复上次打开的页签。恢复页签也要经过解锁限制：保存了一个尚不可用的页签路径，不意味着新档可以直接进入它。

因此，看到“打开网页后跳到了永恒页”的问题，应先区分 **读档阶段的页签恢复** 与 **游戏运行后解锁条件被误判**。它们并非同一个入口。

## 游戏每一帧怎样向前推进

主要更新函数是 [`gameLoop(passDiff, options)`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/game.js#L883)。进入游戏循环后，代码先处理暂停、休眠与时间增量，然后运行游戏机制与自动化。理解一帧可使用下面的简化路径：

```text
src/main.js → src/game.js:init()
                    │
                    ├─ GameStorage.load()：加载玩家状态
                    └─ 后续游戏帧 gameLoop()
                         ├─ 计算时间与游戏状态
                         ├─ OrekiCrunchPolicy：本帧大坍缩决策
                         ├─ OrekiSmartExecutor.hostingTick()：托管配置节拍
                         ├─ OrekiManaged*：恢复受管自动购买器配置
                         ├─ OrekiSmartExecutor.runCycle(...)：实际调用各阶段模块
                         ├─ OrekiSmartStrategy.evaluate()：解释目标与阻塞
                         └─ OrekiSmartExecutor.tick(...)：观察并处理补救动作
```

这是一张**定位用简图**，不是逐行完整调用图。休眠、时间模拟、暂停以及不同阶段的提前返回都会改变本帧实际走过的分支。要判断“为什么某帧没购买”，请从 [`gameLoop` 的相关位置](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/game.js#L1110-L1205) 向下查实际条件。

### 策略不是购买按钮

[`OrekiSmartStrategy`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/core/oreki-smart-strategy.js) 负责根据进度解释当前目标与阻塞，规则数据另见 `src/core/oreki-smart-strategy.json`；它不直接修改货币。

[`OrekiSmartExecutor`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/core/oreki-smart-executor.js) 负责安排动作机会。在 `game.js` 里，`runCycle(...)` 收到的任务明确关联 `OrekiEarlyAutomation.tick()`、`OrekiEternityAutomation.tick()`、`OrekiRealityAutomation.tick()` 等实际阶段模块。执行层收到动作摘要后，才能判断是否需要补一次动作。

这套分工的目的不是让策略层绕过原版购买和结算限制。即使“策略希望购买”，实际模块仍可能因为资源不足、前置条件未满足或调度节拍尚未到达而没有动作。调试时要同时观察 **策略决定、调用是否发生、资源是否真实改变**。

### 自动购买器配置与真实购买是两条线

[`oreki-managed-autobuyer-state.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/90d89de2048332f3c329ae6834ebee2675453a02/src/core/oreki-managed-autobuyer-state.js) 维护受管自动购买器的启用状态和部分配置。它通过 `hostingTick()` 的序号控制同一次托管节拍的写入机会；玩家手动改动受管配置后，下一次有效托管节拍会按照当前策略恢复。**配置重新启用并不证明该自动器已经成功购买。**

原版自动购买器总开关与 MOD 自动化总开关的让路条件，要根据该模块的当前实现单独检查。不要把执行层对手动操作的冷却机制误写成“受管自动购买器永久尊重手改”：两者不是一回事。

## 怎样在本机定位一个问题

以下只需 Web 仓库、Node.js（项目 `package.json` 要求 Node 22 或更高）、Git 和浏览器，不用 Android 模拟器。终端先从仓库根运行：

```bash
git rev-parse HEAD
node --check serve.mjs
node serve.mjs 8080
```

在浏览器访问 `http://127.0.0.1:8080/`。这是仓库自带的本地 HTTP 服务；不要使用 `file://` 直接打开页面并把模块加载失败误判成游戏逻辑故障。这里的命令已按源码核对，**本文撰写时未实际启动浏览器，运行结果不作保证**。

假如你想追踪“自动永恒为什么没有执行”，可以用 Git 自带的搜索，不必先翻所有历史报告：

```bash
git grep -n 'orekiEternityTick' -- src/game.js
git grep -n 'eternityStageAllowed' -- src/core
git grep -n 'OrekiEternityAutomation.tick' -- src
```

先找到 `game.js` 的调用门禁，再顺着执行器和永恒自动化模块定位实际动作；最后用浏览器开发者工具的 Console、Network，以及游戏中的真实资源变化判断哪一个环节没有通过。若发现控制台报错，记录第一条有用的错误堆栈和当时存档阶段，避免直接通过修改 `player` 字段“修复”问题。

## Web 与 Android 的共同目标和不同边界

Web 游戏计算依托 JavaScript 模块与浏览器存储，Android 依托官方 3.21.0 DEX、Kotlin 适配层和本机存档。两边可以追求玩家可见的等价行为，但不能照抄模块名或认为相同功能一定使用相同字段。Web 的受管配置代码、Android 的 `OrekiStageAuto` 及各自调度时机需要分别核对；源码有对齐意图不代表实测已经完全一致。

Web 发布站点是 [oreki.net](https://oreki.net)，但本地启动成功不等于 Pages 部署、真实新档通关或双端等价验收通过。涉及这些结论，必须另看对应候选、工作流和运行记录。

继续阅读：[双端行为一致性](/developer/architecture/parity) · [第一次参与开发](/developer/first-contribution) · [存档兼容排查](/developer/troubleshooting/save-compatibility)。
