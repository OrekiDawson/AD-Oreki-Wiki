---
title: "无限"
description: "大坍缩、无限点数、打破无限、无限维度及复制器。"
tags:
  - 玩法
  - 无限
aliases:
  - "/gameplay/infinity"
---

在数学中，无限没有一个确切的大小。在《反物质维度》中，它却有一个相当精确的门槛：约 $1.80\times10^{308}$ 点反物质。

这是第一个主要重置层 Infinity 的开始。真正有意思的是，玩家刚抵达这道边界，接下来的任务竟然是打破它。

## 为什么偏偏是 308

JavaScript 普通双精度数值的最大有限值是 $(2-2^{-52})\times2^{1023}$，约为 1.7976931348623157e308。超过普通浮点数的表示范围，结果可能成为 Infinity。作为最初在浏览器运行的游戏，反物质维度把这个数做成了自己的玩法边界。

后来游戏用能够存储尾数与指数的大数表示来处理更大的数字。社区 Wiki 记录的相关库名叫 Break Infinity，恰好也是游戏里的「打破无限」。不过，获得这个升级不会改变计算机浮点数的极限，只是让游戏跨过自己设定的第一道门槛。

## 花掉整个宇宙

第一次大坍缩（Big Crunch）会清除反物质、反物质维度、计数频率、维度提升与星系。换来的是 1 无限点数（IP）、1 次无限，以及无限升级和普通挑战。

新的两种数字看起来很像，却各有用途。IP 可以花掉，累计无限次数则会参与长期升级的计算。成就与通用统计不会被大坍缩清除；解锁无限维度后，其购买记录通常保留，由生产所得的数量则重置。

最初一次大坍缩只有 1 基础 IP。买齐原版十六项不可重复无限升级后，会开放每级将 IP 收益乘以 2 的重复升级。因此，原先艰难的一次无限，逐渐成为可以不断重复的循环。

## 打破无限

原版要把大坍缩自动购买器的间隔升级至 0.1 秒，才允许打破无限。此后反物质可以越过 1.80e308，结算不再只是固定的基础 1 IP。

无特殊修正时，IP 换算为

$$IP=\left\lfloor M\,10^{\log_{10}(AM_{max})/308-0.75}\right\rfloor.$$

$M$ 是 IP 倍率，$AM_{max}$ 是本次无限达到过的最高反物质。成就 103 与时间研究 111 可以缩小公式分母。无额外修正时，反物质每增加 308 个数量级，取整前的 IP 只提高十倍。指数已经大得惊人，新货币的增长却仍然需要认真经营。

与此同时，价格也在反击。无限后计数频率的成本可以沿 1e308、1e309、1e311、1e314……增长；不仅价格越来越大，连指数每次增加的幅度也越来越大。降低成本增长的打破无限升级由此变得格外重要。

## 第二条生产链

你已经熟悉了八级反物质维度。现在游戏再给你八级无限维度，以 IP 成批购买，每次十个。第一无限维度不生产反物质，而是生产无限之力；它通过基础倍率 $\max(1,Power^7)$ 强化反物质维度。

只要 10 点无限之力，便对应 1e7 的基础倍率。这一层新的生产链，把原有八级生产系统的成长推向完全不同的规模。

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

上表为原版的基础需求及成本；首次永恒前，第一无限维度还涉及 1e8 IP 的条件。

## 复制与挑战

[复制器](/player/original/ow-replicanti)提供了与八级维度不同的成长方式。它可以自行复制，为无限维度提供倍率；复制器星系又会增强计数频率。几种机制彼此关联，使早期单独追求反物质产量的玩法逐步变得丰富。

普通挑战提供自动购买器资格与升级，打破无限后的八个无限挑战又增加新的长期强化。例如 IC2 改变维度献祭并开放献祭自动购买器，IC5 强化星系且降低部分重置需求。详见[挑战](/player/gameplay/challenges)。

终于，当 IP 本身达到约 1.80e308，并满足第八无限维度等前置条件，第一次[永恒](/player/gameplay/eternity)便在眼前。你曾经用来衡量终点的那个数字再度出现了，只是这次单位变成了无限点数。

Oreki Edition 的实际数值和自动化差异见[原版与 MOD](/player/gameplay/original-vs-mod)及[智能自动购买器](/player/gameplay/automation)。

## 资料来源
- [Infinity](https://antimatterdimensions.wiki.gg/index.php?title=Infinity&oldid=3113)、[Break Infinity](https://antimatterdimensions.wiki.gg/index.php?title=Break_Infinity&oldid=3349)。
- [Infinity Dimensions](https://antimatterdimensions.wiki.gg/index.php?title=Infinity_Dimensions&oldid=3344)、[Infinity Challenges](https://antimatterdimensions.wiki.gg/index.php?title=Infinity_Challenges&oldid=3359)。
- [Eternity](https://antimatterdimensions.wiki.gg/index.php?title=Eternity&oldid=3118)；[大坍缩奖励及入口](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/big-crunch.js)、[玩家重置条件](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/player.js)。

本文依据原版社区 Wiki 的资料独立编写，涉及其内容的改编按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 共享；原文贡献者见各固定修订的页面历史。
