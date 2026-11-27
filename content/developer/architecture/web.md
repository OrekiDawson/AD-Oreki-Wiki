---
title: "Web 端架构"
description: "沿 index.html、游戏主循环、原版自动器和 Oreki 调度器理解 Web 端的运行时边界"
tags:
  - Web
  - 架构
aliases:
  - "/architecture/web"
---

Web 端不是“把几个 JavaScript 文件放进浏览器”。原版游戏循环负责推进状态，MOD 负责在合法时机提出动作，浏览器负责承载页面、存档和输入。读这套代码最稳妥的方式，是沿一次启动和一帧循环往下走，而不是从 `oreki-*.js` 文件名猜职责。

本文以 Web 仓库固定提交 [`e1c93caa`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/tree/e1c93caa758de6c39cf814582123d4a35319eb25) 为实现坐标；原版游戏机制以冻结上游 [`5409e320`](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca) 为对照。两者是不同的版本边界：前者说明 Oreki 端怎样接线，后者说明原版循环和机制来自哪里。

## 启动：页面只负责把运行时接起来

入口链可以压缩成：

```text
index.html → src/main.js → merge-globals.js → game.js:init()
                                      ├─ browserCheck()
                                      ├─ Cloud.init()
                                      ├─ GameStorage.load()
                                      └─ 恢复可访问的页签
```

`index.html` 提供 Vue 挂载点、移动视口和模块脚本；`main.js` 载入兼容层后才调用 `browserCheck()` 与 `init()`。`init()` 恢复运行环境、云存档和上次页签，不负责购买维度或选择自动化路线。修改入口时应保留这条边界，不能把业务初始化塞进内联脚本，也不能绕过浏览器能力检查直接启动。

`merge-globals.js` 是历史组件的兼容层。仍从 `window` 取工具或数据库的旧组件需要它，但新模块应优先使用 ESM `import`；继续向全局表添加名字，只会把旧耦合延长到下一次迁移。

## 主循环：一帧不是一次购买

`gameLoop()` 先处理暂停、离线追赶和现实时间，再把本帧的游戏时间切成微步。微步中运行原版 `Autobuyers.tick()` 和各维度生产，随后才进入 MOD 的托管与调度阶段。高倍率时切微步是为了让原版自动器仍按游戏时间推进，而不是被浏览器帧率限制成“一帧只买一次”。

```text
浏览器时钟
  └─ gameLoop()
      ├─ 原版微步：Autobuyers.tick() 与资源生产
      ├─ Oreki 托管：同步原版自动器配置
      ├─ OrekiSmartExecutor.runCycle()
      └─ 结算、UI 更新与存档时间统计
```

这里有一个关键分工：MOD 调度器不能另开一套生产循环，阶段模块也不能绕过原版重置入口。否则同一帧会出现两套“谁先花钱”的规则，调试面板看到的动作与玩家实际资源变化就会分叉。

## MOD 的三层职责

### 阶段模块：执行合法动作

`src/core/oreki-early-automation.js`、`oreki-eternity-automation.js`、`oreki-reality-automation.js`、天神和终局模块分别处理阶段内动作。它们调用原版购买、挑战和重置入口，并返回动作摘要。要改购买顺序，先读对应阶段模块及其调用的原版 API，不要把相同规则复制进调度器。

### 策略层：解释现在应该走哪条路线

`oreki-smart-strategy.json` 及生成的策略模块根据玩家状态判断阶段、目标、预计剩余时间和阻塞原因。策略层可以说“下一目标是第一次永恒”，但不应直接修改 `player` 或调用 `eternity()`；把解释和副作用分开，才能测试“为什么这么选”。

### 执行层：给主动动作排队

`oreki-smart-executor.js` 的 `runCycle()` 接收 routine、early、eternity、reality、perk 和 endgame 等候选。统一的 `intervalSec`、阶段门禁、手动让路窗口和单拍动作限制决定谁能真正执行。no-op 不应冒充成功，也不应在没有状态变化时错误推进全局节拍。

托管层只同步原版自动器的开关、间隔和模式，原版 `Autobuyers.tick()` 仍由主循环负责。关闭 Oreki 主动自动化，不等于关闭原版引擎的所有 tick；排查时要分别追踪这两个动作来源。

## 修改与排障的最短路径

- **启动白屏**：从 `index.html`、`src/main.js`、`merge-globals.js` 和 `game.js:init()` 检查资源路径、全局兼容层和浏览器检查。
- **数值增长但路线不动**：先分辨原版自动器是否在微步中运行、策略是否给出目标、还是 `runCycle()` 被间隔、门禁、手动让路或 no-op 冷却挡住。
- **动作跨阶段**：沿任务包装器追到阶段门禁和原版重置入口；不要用额外延时掩盖错误的调用链。
- **存档或页签异常**：从 `GameStorage.load()` 和页签恢复逻辑入手，再区分“无法解码”“缺字段”和“读档后重新计算阶段”。
- **发布版本不确定**：检查 Web 仓库部署工作流要求的精确源码 SHA 及对应 CI 结果；工作区文件本身不是线上版本证明。

## 相关条目

[架构导航](/developer/architecture/) · [双端行为一致性](/developer/architecture/parity) · [智能自动购买器](/player/gameplay/automation) · [源码索引](/developer/references/source-index) · [构建与交付](/developer/build/)
