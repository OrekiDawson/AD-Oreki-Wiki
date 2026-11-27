---
title: "无限"
description: "大坍缩、无限点数、打破无限、无限维度及复制器。"
tags:
  - 玩法
  - 无限
aliases:
  - "/gameplay/infinity"
---

**无限**（Infinity）是《反物质维度》的第一个主要重置层。反物质首次抵达约 1.80e308 时，游戏开放大坍缩（Big Crunch）。原版第一次大坍缩获得 1 无限点数和 1 次无限，并开放无限升级和普通挑战。

## 大坍缩

大坍缩清除本轮反物质、反物质维度、计数频率、维度提升和反物质星系。成就与已取得的长期统计不会随之消失。已经拥有无限维度时，由高阶生产出来的无限维度会被重置，而购买记录通常保留。

无限点数（IP）用于购物；无限次数（Infinities）是重置统计及部分升级的计算依据。两者不是同一种资源。早期一次坍缩基础收益为 1 IP，通常增加一次无限。买齐原版 16 项不可重复无限升级后，可购买重复 IP 倍率升级，每级使 IP 收益乘以 2。

## 打破无限

原版将大坍缩自动购买器的间隔升级至 0.1 秒后，才可启用打破无限。它取消普通生产的第一道上限，使反物质可以超过 1.80e308，并开启更多升级。第一次大坍缩与打破无限因此是不同的里程碑。

无成就、研究等修正时，打破无限后的基础 IP 可用下式理解：

$$IP=\left\lfloor M\,10^{\log_{10}(AM_{max})/308-0.75}\right\rfloor.$$

其中 $M$ 是 IP 倍率，$AM_{max}$ 是本次无限曾达到的最高反物质。实际原版还会用成就 103 或时间研究 111 缩小分母。以基础式为例，最高反物质从 1e308 增至 1e616，取整前的 IP 增为十倍。并不是每多一个反物质的零便多一个 IP 的零。

突破上限也会加快价格成长。原版计数频率成本在无限后可出现 1e308、1e309、1e311、1e314……这样的序列，指数的步长也在增长。降低价格成长的无限升级因此十分重要。

## 为什么是 308

原版的第一道上限对应 JavaScript 的双精度数值最大有限值，严格表达为 $(2-2^{-52})\times2^{1023}$。再大的普通浮点数可能变为 Infinity。游戏采用能分别保存尾数与指数的大数库，因而能够继续处理 1e10000 等远超这个范围的数。库名 Break Infinity 本身也恰好与游戏的里程碑同名。

不过打破无限不意味着普通浮点数的物理表示范围扩大，而是游戏允许大数表示突破原先的玩法门槛。[原版无限条目](https://antimatterdimensions.wiki.gg/index.php?title=Infinity&oldid=3113)也记录了这段技术背景。

## 无限维度

无限维度也有八级，购买消耗 IP，每次购买十个。第一无限维度生产无限之力，高阶维度生产低一阶。基础无限之力对反物质维度的倍率为 $\max(1,Power^7)$，所以仅 10 点无限之力便对应 1e7 的基础倍率。

| 维度 | 解锁反物质 | 首次购买 IP |
| ---: | ---: | ---: |
| 1 | 1e1100 | 1e8 |
| 2 | 1e1900 | 1e9 |
| 3 | 1e2400 | 1e10 |
| 4 | 1e10500 | 1e20 |
| 5 | 1e30000 | 1e140 |
| 6 | 1e45000 | 1e200 |
| 7 | 1e54000 | 1e250 |
| 8 | 1e60000 | 1e280 |

这些是原版基础解锁与成本，不是 MOD 的统一数值承诺。首次永恒前第一无限维度还涉及 1e8 IP 的条件。

## 挑战与复制器

普通挑战奖励自动购买器的解锁或升级资格。打破无限后，八个无限挑战逐步开放，例如 IC2 的奖励会解锁维度献祭自动购买器，IC5 则增强星系并降低部分重置需求。详见[挑战](/player/gameplay/challenges)。

[复制器](/player/original/ow-replicanti)则提供另一种增长机制：复制器可以自行复制，并为无限维度提供倍率；复制器星系进一步强化计数频率。它不是第九无限维度，而是独立系统。

## 下一层重置

原版首次[永恒](/player/gameplay/eternity)需要达到约 1.80e308 IP，并完成第八无限维度等前置。永恒的门槛看起来与大坍缩相同，但计量单位从反物质变成了无限点数。

Oreki Edition 的自动化与数值变化集中参见[原版与 MOD](/player/gameplay/original-vs-mod)及[智能自动购买器](/player/gameplay/automation)。

## 资料来源

- [Infinity](https://antimatterdimensions.wiki.gg/index.php?title=Infinity&oldid=3113)、[Break Infinity](https://antimatterdimensions.wiki.gg/index.php?title=Break_Infinity&oldid=3349)。
- [Infinity Dimensions](https://antimatterdimensions.wiki.gg/index.php?title=Infinity_Dimensions&oldid=3344)、[Infinity Challenges](https://antimatterdimensions.wiki.gg/index.php?title=Infinity_Challenges&oldid=3359)。
- [Eternity](https://antimatterdimensions.wiki.gg/index.php?title=Eternity&oldid=3118)；[大坍缩奖励及入口](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/big-crunch.js)、[玩家重置条件](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/player.js)。

本文依据原版社区 Wiki 的资料独立编写，涉及其内容的改编按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 共享；原文贡献者见各固定修订的页面历史。
