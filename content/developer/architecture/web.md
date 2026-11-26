---
title: "Web 端：从浏览器入口到自动化调度"
description: "从 index.html 进入 Web 游戏，追踪原版主循环、Oreki 模块与统一调度器的职责边界"
tags:
  - Web
  - 架构
aliases:
  - "/architecture/web"
---


如果只把 Web 端看成一堆可以在浏览器里打开的 JavaScript 文件，很快就会迷路：真正的游戏状态在原版主循环里推进，MOD 的自动化又必须在合适的时机插入，页面还要同时照顾存档、桌面浏览器和 Android Chrome。读这套代码最省力的方式，是沿着一次启动和一次游戏循环往下走。

本文以 Web 仓库 `AD-Oreki-Edition` 的当前 `main` 提交 `e1c93caa758de6c39cf814582123d4a35319eb25` 为源码核对点；上游游戏基线仍是 `IvarK/AntimatterDimensionsSourceCode` 的 `5409e320cecef96a917cca1dfb68f1f183e499ca`（2026-07-17，AD 11.5 / Reality Update）。两者是两个不同的版本坐标：前者说明 Oreki 端当前接线，后者说明原版游戏代码的冻结来源。

本文的关键源码入口可直接对照 [Web 当前提交中的 `src/main.js`](https://github.com/OrekiDawson/AD-Oreki-Edition/blob/e1c93caa758de6c39cf814582123d4a35319eb25/src/main.js)、[`src/game.js`](https://github.com/OrekiDawson/AD-Oreki-Edition/blob/e1c93caa758de6c39cf814582123d4a35319eb25/src/game.js) 和 [Oreki 自动化模块目录](https://github.com/OrekiDawson/AD-Oreki-Edition/tree/e1c93caa758de6c39cf814582123d4a35319eb25/src/core)。原版循环与自动购买器则以 [上游冻结提交](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca) 为对照。

## 先画出一条可追踪的路径

一次正常启动可以压缩成下面这条链：

```text
index.html
  └─ src/main.js
      ├─ merge-globals.js       建立旧组件仍在使用的全局 API
      └─ game.js
          ├─ browserCheck()     检查浏览器能力
          └─ init()
              ├─ ElectronRuntime / SteamRuntime
              ├─ Cloud.init()
              ├─ GameStorage.load()
              └─ 恢复可访问的上次页签

浏览器时钟 → gameLoop()
  ├─ 原版微步：Autobuyers.tick()、各维度 tick()
  ├─ MOD 托管：OrekiManagedCrunchInterval / OrekiManagedAutobuyerState
  ├─ MOD 调度：OrekiSmartExecutor.runCycle()
  └─ 产量、结算、UI 与存档时间统计
```

这张图有一个容易被忽略的含义：`OrekiSmartStrategy` 负责回答“现在是哪一段、想达成什么”，却不应该直接扣资源；`OrekiSmartExecutor` 负责决定“这一拍谁可以动手”，但也不应该自己发明一套购买规则。理解这条分工，比记住几十个 `oreki-*.js` 文件名更有用。

## 浏览器入口不是游戏逻辑

`index.html` 只提供最小宿主：`#ui` 是 Vue 界面挂载点，背景动画和性能面板是静态容器，最后以 `type="module"` 加载 `src/main.js`。`meta viewport` 让同一份页面在手机视口按设备宽度排版；样式表和图片则从 `public/` 读取。

`src/main.js` 的顺序很短，却决定了启动边界：

1. 载入速度配置、触摸拖拽兼容和运行时 shim；
2. 执行 `merge-globals.js`，把原版组件尚未迁完的裸全局补齐；
3. 导入 `game.js` 的 `browserCheck` 与 `init`；
4. 只有浏览器检查通过，才调用 `init()`。

因此，修改入口时不要把初始化塞进页面内联脚本，也不要绕过 `browserCheck()` 直接启动。页面脚本还会把浏览器错误收集到 `window.errorMessages`，便于开发者在真实浏览器里区分“页面没有加载”和“游戏循环启动后报错”。

## `merge-globals.js` 是兼容层，不是新的模块边界

现代模块通过 `import` 获得依赖，但这套游戏仍有一批旧组件从 `window` 取工具、游戏数据库和界面符号。`merge-globals.js` 的 `mergeIntoGlobal()` 会遍历模块导出，跳过 `default`，并在目标属性已经存在时直接报错，避免静默覆盖另一个同名对象。

文件中可以看到三层来源：

- `core/utils.js` 与 `core/secret-formula/index.js`：通用工具和公式/数据库；
- Automator 编辑器、Perks 页等仍依赖裸全局的旧组件；
- `core/globals.js` 与 `game.js`：游戏核心和公开的运行时入口。

这也是一个实际的改码提示：新组件应优先保留 ESM 依赖，不要继续向全局表添加名字。全局桥接解决的是历史兼容问题，不是鼓励把所有模块重新变成全局变量。

## `init()` 只恢复运行环境，主循环才推进游戏

`game.js` 的 `init()` 做四件关键事情：初始化桌面运行时适配器，初始化云存档接口，调用 `GameStorage.load()` 载入玩家状态，然后通过 `Tabs.findRestorableTab()` 恢复上次页签；如果存档指向尚未解锁或已隐藏的页签，就回到维度页。这一层不负责购买维度，也不负责选择自动化路线。

真正持续工作的入口是 `gameLoop(passDiff, options)`。它先处理暂停、离线追赶和现实时间机制，再计算本帧要推进的游戏时间。高倍率下，一帧可能跨过很长的游戏时间；Web 端因此把 `diff` 切成若干微步，每个微步依次运行原版 `Autobuyers.tick()`、失效相关缓存，再推进时间维度、无限维度和反物质维度。这样做的理由很朴素：如果高倍率下每帧只买一次，游戏只是“数字跳得很快”，自动购买却仍然每帧只出手一次，成长速度会被帧率反过来限制。

微步只负责原版的连续生产和原版自动机。MOD 的阶段决策放在后面的调度段，不能在微步里偷偷再开一套计时器，否则一帧中会出现两套不同的“谁先花钱”规则。

## MOD 的四层职责

### 1. 阶段模块：知道怎样完成一段游戏

`src/core/oreki-early-automation.js`、`oreki-eternity-automation.js`、`oreki-reality-automation.js`、`oreki-celestial-automation.js`、`oreki-endgame-automation.js` 等模块分别处理不同阶段的合法动作。它们调用原版购买、重置和挑战入口，并返回动作摘要，例如买了多少无限维度、是否发生现实重置或是否买到时间研究。

阶段模块是“会做事的人”，也是最接近游戏机制的地方。要改某个阶段的购买顺序，先读对应模块及它调用的原版 API；不要把同一规则复制到调度器里。

### 2. 策略层：只读地解释当前路线

`oreki-smart-strategy.json` 是路线数据的来源，生成的 `oreki-smart-strategy.gen.js` 供 `oreki-smart-strategy.js` 读取。策略层根据真实玩家状态判断阶段、目标、路线、预计剩余时间和阻塞原因，并把当前决策暴露给面板。

它有意不修改 `player`，也不直接购买资源。这个边界很重要：策略可以说“下一目标是第一次永恒”，但不能因为解释器得出这个结论就擅自调用 `eternity()`。

### 3. 调度器：给主动动作排队并限流

`oreki-smart-executor.js` 的 `runCycle()` 接收一组候选任务，例如开局例程、无限阶段、永恒阶段、现实阶段和终局阶段。它执行的是统一节拍：

- 所有 MOD 主动动作共享 `intervalSec`，合法范围为 1–60 秒，新存档默认 10 秒；
- 同一拍最多放行一个真正改变游戏状态的动作；
- no-op 不消耗节拍，会让下一个候选继续尝试；
- 动作前要经过阶段门禁、全局节拍和必要的单任务闸门；
- 玩家在界面上操作时，当前目标进入手动让路窗口，面板显示剩余时间。

“统一调度”不是为了让游戏变慢，而是为了让资源消费可解释。若开局例程、永恒模块和现实模块各自维护一个 `setInterval`，它们可能在同一时刻抢同一笔资源；集中到一个执行层后，源码和调试面板都能回答“这一次是谁动的手”。

### 4. 托管层：同步原版自动器配置，但不替代原版 tick

`OrekiManagedCrunchInterval` 和 `OrekiManagedAutobuyerState` 位于调度段附近。它们根据策略决定原版大坍缩自动器是否开启、间隔和模式，并在统一托管 Tick 上应用配置；它们不是另一套生产循环。原版 `Autobuyers.tick()` 仍在主循环微步中运行，MOD 托管层只维护允许它以什么配置运行。

这条边界能避免一个危险误读：关闭 Oreki 主动自动化，不等于把原版游戏引擎的所有 tick 都关掉；相反，MOD 自己发起的动作和原版自动机是两个需要分别追踪的来源。

## 一帧里真正发生什么

把 `gameLoop()` 中的 MOD 段按调试顺序读，可以得到下面的流程：

1. 读取当前的 `OrekiCrunchPolicy`，决定是否允许大坍缩；决策未知时保持现状，不猜测。
2. 推进一次统一的托管 Tick，让大坍缩间隔和自动器配置共享同一时间口径。
3. 应用受管配置；如果当前策略无法确定，就采用 fail-safe 行为，不把未知当成允许。
4. 计算永恒结算或开局 ID1 的优先提示，只改变候选的询问顺序，不绕过节拍。
5. 用 `OrekiSmartExecutor.runCycle()` 运行候选任务；例如 `routine`、`early`、`eternity`、`reality`、`celestial`、`perk` 和 `endgame`。
6. 用 `OrekiSmartExecutor.tick(orekiCycle)` 观察实际动作摘要，更新 idle、错误、阻塞和手动让路状态。
7. 继续原版 IP 生成、被动声望、UI 更新和其他游戏结算。

永恒阶段还有一层专门门禁：只有首次无限已经完成且 `player.break` 为真时，才允许永恒模块推进；同一个判据也供执行层的兜底入口使用。这样可以防止“刚到无限就开始买永恒内容”这种跨阶段动作从另一条调用路径漏过去。

## 从哪里开始改，怎样验证

### 追踪启动或白屏

先看 `index.html` 的资源路径和浏览器控制台，再读 `src/main.js`、`src/merge-globals.js`、`game.js:init()`。本地不能直接用 `file://` 打开 ES 模块；仓库提供的 `serve.mjs` 是一个只读静态服务器，默认监听 `127.0.0.1:8080`，也可用 `node serve.mjs 其他端口` 启动。它只负责把文件按 MIME 类型送给浏览器，不参与游戏状态和构建。

### 追踪“数值在涨，但路线不动”

先区分三件事：原版 `Autobuyers.tick()` 是否仍在微步中运行，策略层是否给出可用决策，还是 `runCycle()` 被间隔、阶段门禁、手动让路或 no-op 冷却挡住。重点文件是 `oreki-smart-strategy.js`、`oreki-smart-executor.js` 与实际阶段模块；不要先修改数值公式。

### 追踪“动作发生了，但不该跨阶段”

沿 `game.js` 中的任务包装器追到 `OrekiSmartExecutor.eternityStageAllowed()` 和对应阶段模块，再核对原版入口的解锁条件。若执行层的兜底动作绕过了阶段模块，说明职责边界被破坏，应修复调用链，而不是再加一个延时数字遮住问题。

### 追踪发布版本

Web 仓库的 `.github/workflows/deploy.yml` 要求手动提供完整的 `approved_sha`，先检出并确认这个 SHA 与当前 `main` 和 `GITHUB_SHA` 一致，再复用这个精确 SHA 对应的成功 Web CI。之后才向 Pages 仓库请求部署。由此可见，`oreki.net` 上的文件并不是“当前工作区随手复制”的结果；发布讨论应同时记录源码 SHA、CI 和 Pages 部署证据。

## 版本、跨端与历史资料

Web 与 Android 共享游戏设计目标，但不共享代码、构建链或版本号。Web 的冻结上游基线是 `5409e320cecef96a917cca1dfb68f1f183e499ca`，Android 则有自己的官方 APK 基线；因此“同名功能”必须比较可观察行为，不能用文件名、版本号或源码行号直接推断等价。

历史事实、源码核查和部署证据保留在 Web 仓库的 `docs/FACTS.md`、`docs/SHARED_GAMEPLAY_STANDARD.md`、`NOTICE.md` 与历史任务记录中；它们是查证材料，不替代本文的架构主线。Web 仓库与上游代码的许可、署名和第三方资产边界见 [版权与许可](/copyright)。本站正文的原创解释遵守 [知识库规则](/wiki-rules) 与 CC BY-SA 4.0；旧入口 `/architecture/web` 通过本页 alias 保留。

## 相关条目

[开发者专区首页](/developer/) · [Android 架构](/developer/architecture/android) · [双端行为一致性](/developer/architecture/parity) · [构建与交付](/developer/build/) · [智能自动购买器](/player/gameplay/automation) · [反物质维度](/player/antimatter-dimensions)
