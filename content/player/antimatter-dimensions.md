---
title: "反物质维度"
description: "介绍《反物质维度》原版游戏的起源、放置增量玩法、重置层级、挑战与自动化，以及它与 Oreki Edition MOD 的关系"
tags:
  - 游戏介绍
  - 反物质维度
  - 玩法
aliases:
  - "/antimatter-dimensions"
---


**《反物质维度》（Antimatter Dimensions）**是一款以资源增长、升级选择和反复突破进度上限为核心的**放置增量游戏**。玩家从少量反物质起步，购买能够自动生产资源的“维度”，逐步获得越来越大的数字；当原有增长方式变慢时，可以重置部分进度，换取新的资源和更强的成长能力。

游戏最初由使用 **Hevipelle** 名称的开发者于 **2016 年**作为网页游戏推出，后来由更多开发者参与制作。其 Steam 版本于 **2022 年 12 月 17 日**发行。[来源：Steam 商店的开发者信息与游戏介绍](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/)。

本站主要记录基于这款游戏制作的 **Oreki Edition MOD**。理解原版机制是读懂 MOD 改动的前提，所以这篇先讲原版；MOD 的目标、实现和验证结论会单独说明，不和官方行为混在一起。

## 基本资料

| 项目 | 内容 |
| --- | --- |
| 原文名称 | Antimatter Dimensions |
| 游戏类型 | 放置增量游戏（Idle Incremental Game） |
| 最初开发者 | Hevipelle，后续有其他开发者参与 |
| 最初推出 | 2016 年，网页游戏 |
| Steam 版本 | 2022 年 12 月 17 日发行，免费游玩 |
| 可游玩平台 | 网页、Steam，以及 Android 和 iOS 移动版本 |
| 主要玩法 | 维度生产、升级、重置成长、挑战、成就与自动化 |

资料来源是 [Steam 官方商店页面](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/)与[《反物质维度》社区 Wiki](https://antimatterdimensions.wiki.gg/)。各平台的版本、界面和功能开放顺序并不一致，上表只是常见情况的汇总。

## 游戏怎样进行

### 从反物质和维度开始

**反物质**是游戏最早获得的主要资源，可以用来购买反物质维度及游戏速度相关的升级。“维度”并不是画面中的空间，而是一个生产单位：**第一反物质维度直接生产反物质，第二反物质维度生产第一维度，第三维度生产第二维度**，依此类推。

原版共有八级反物质维度。新游戏最初只能接触其中一部分，随着维度提升（Dimension Boost）逐渐解锁更高等级。高等级维度的作用并非直接产出最终资源，而是通过一层层生产链提高低等级维度的数量，最终加快反物质的积累。

因此，早期玩法并不是简单地等待数字上涨。玩家需要在购买新维度、提高生产倍数、提升速度与进行重置之间选择，以便更快地抵达下一项解锁条件。[来源：社区 Wiki《Antimatter Dimensions》机制页](https://antimatterdimensions.wiki.gg/wiki/Antimatter_Dimension)。

### 为什么要主动重置进度

本作的核心概念之一是**重置成长（Prestige）**：玩家主动舍弃当前积累的部分资源或升级，换取更持久的收益、专属货币或新的系统。虽然画面上的数字可能暂时变小，但下一次成长通常会更快，而且会逐渐出现此前无法使用的玩法。

早期可以通过维度提升解锁和强化维度，也可以通过购买反物质星系（Antimatter Galaxy）加强速度升级的效果。这些操作与后续的大坍缩（Big Crunch）、永恒（Eternity）和现实（Reality）并非同一个重置层级。[来源：社区 Wiki《Prestige》](https://antimatterdimensions.wiki.gg/wiki/Prestige)。

## 主要成长阶段

随着推进，游戏会一层层展开新的重置体系。下表概括原版主要机制之间的关系，不是精确到分钟的解锁时间表。

| 阶段 | 主要变化 | 可帮助理解的概念 |
| --- | --- | --- |
| 反物质阶段 | 购买维度、调整生产速度、进行维度提升和星系重置 | 用资源换取更高的生产效率 |
| 无限（Infinity） | 达到初次无限条件后进行大坍缩，获得无限点数与相关升级 | 重置先前进度，开启新的成长体系 |
| 永恒（Eternity） | 在无限阶段进一步推进后解锁，带来永恒点数、时间研究等系统 | 原有重置层之上增加新一层成长 |
| 现实（Reality） | 后续开放现实机器、符文（Glyph）、福利与自动化等机制 | 通过更高层级重置改变前面阶段的推进方式 |

第一次达到约 **1.80 × 10³⁰⁸** 反物质时，玩家可以进行大坍缩并进入无限阶段。这并不是游戏结束，而是大量后续内容的开始。[来源：社区 Wiki《Infinity》](https://antimatterdimensions.wiki.gg/wiki/Infinity_Point)。

永恒会引入永恒点数和时间研究体系；现实则在此基础上进一步引入现实机器、符文等机制。玩家在这些阶段需要决定何时重置、怎样分配升级，以及如何让重复操作自动完成。[来源：社区 Wiki《Eternity》](https://antimatterdimensions.wiki.gg/wiki/Eternities)；[《Reality》](https://antimatterdimensions.wiki.gg/wiki/Reality)。

游戏后期还有天神（Celestials）。各阶段的具体条件、资源公式和重置后保留什么，细节多且互相牵连，需要看对应的机制条目；上表只用来建立整体印象。

## 挑战、成就和自动化

除了正常积累资源，《反物质维度》还包含**挑战**：玩家在特殊限制下重新完成某些目标，以解锁奖励、提高生产效率或开放进一步的成长空间。原版依游戏进度提供普通挑战、无限挑战和永恒挑战等类型。挑战完成情况应由游戏的真实条件和结算机制决定，而不能仅凭界面上出现“已完成”字样推断。[来源：社区 Wiki 游戏机制导航](https://antimatterdimensions.wiki.gg/)。

随着系统增多，玩家会逐渐获得自动购买、自动重置等能力；较后期的游戏版本还包含可编写自动化流程的功能。**自动化本身也是成长内容的一部分**：原先需要多次手动执行的操作，可能在解锁相应功能后由游戏自动完成。[来源：Steam 官方游戏介绍](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/)。

成就则为探索和推进提供额外目标。由此，游戏的体验会从最初的手动购买，逐步转向对升级路线、挑战条件、自动化策略及高层重置时机的管理。

## 开发历史与游玩渠道

《反物质维度》最初以网页游戏形式出现，经过长期更新后在 2022 年推出 Steam 版本。它也有 Android 和 iOS 移动版本，但平台之间的发布节奏、界面与部分机制可能不同。因此，讨论“原版规则”时仍应注明所参考的平台与版本。[来源：Steam](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/)；[社区 Wiki](https://antimatterdimensions.wiki.gg/)。

原版网页游戏的源码可在 [IvarK/AntimatterDimensionsSourceCode](https://github.com/IvarK/AntimatterDimensionsSourceCode) 查看。较早的 [IvarK.github.io](https://github.com/IvarK/IvarK.github.io) 是旧网页源码仓库，不应混作当前上游。

## Oreki Edition MOD 与原版的关系

**Oreki Edition 是以《反物质维度》为基础开发的修改版本，不是原版游戏的官方更新。** 它在 Android 与 Web 两端并行开发，重点关注更流畅的成长体验、自动购买器、界面反馈、中文教程，以及两个平台之间的可见行为一致性。具体代码和机制修改必须以相应 MOD 仓库的提交与实测记录为依据。

Oreki Edition 现在以 **Android/Web 玩法一致性和用户体验**为首要产品目标，并将**从真实新档开始、墙钟 ≤180 分钟合法通关**作为持续回归门槛。它不是原版游戏承诺的通关时间。早期 R113-01 的完整长跑曾在 180.1 分钟时 FAIL，但那是**旧构建的历史结果**，不能用来判断新发布 APK。[历史证据](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/d950d1102f13e81f78dfdcdfb308359ee3eb1633/reports/R113-01/180min-RESULT.md)。Web 已有明确加速条件下的线上通关实测；Android 也已有 [新版 GitHub Release](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases/tag/android-update-3.21.0-a12b5cd6)。各类证据与验收边界见 [当前状态](/developer/current/project-status)。

若想了解 MOD 仓库、冻结的上游版本与发行门禁，可继续阅读[项目概览](/developer/project-overview)；最新验收结论与发布状态以[当前项目状态](/developer/current/project-status)和[发布状态](/developer/current/release-status)为准。

## 参考资料

- [《反物质维度》Steam 商店页面](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/)：游戏类型、开发者、发行时间、原版玩法与自动化功能。
- [《反物质维度》社区 Wiki](https://antimatterdimensions.wiki.gg/)：游戏机制目录及各成长阶段的资料。
- [社区 Wiki《Antimatter Dimension》](https://antimatterdimensions.wiki.gg/wiki/Antimatter_Dimension)：八级维度及生产链的说明。
- [社区 Wiki《Prestige》](https://antimatterdimensions.wiki.gg/wiki/Prestige)：重置成长机制与层级。
- [原版网页游戏源码](https://github.com/IvarK/AntimatterDimensionsSourceCode)：当前网页源码仓库。
- [Oreki Edition Android 仓库](https://github.com/OrekiDawson/AD-Oreki-Edition-Android)、[Web 仓库](https://github.com/OrekiDawson/AD-Oreki-Edition-Web)：修改版的代码、测试与开发记录。

本条目以公开的游戏资料和项目原始报告为依据，用独立中文表述介绍机制，不复制第三方 Wiki 的文章正文或图像。

## 相关条目

进一步阅读具体机制：[无限与永恒](/player/gameplay/progression-infinity-eternity) · [现实与时间研究](/player/gameplay/reality-time-studies) · [天神系统](/player/gameplay/celestials)；原版规则与 MOD 调整的集中对照见 [原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod)。

[项目概览](/developer/project-overview) · [挑战与真实结算](/player/gameplay/challenges) · [智能自动购买器](/player/gameplay/automation) · [阶段门禁](/player/gameplay/stage-gates) · [存档兼容与自动保存](/player/gameplay/saves) · [术语表](/player/terminology) · [反物质维度MOD Wiki:知识库规则](/wiki-rules)
