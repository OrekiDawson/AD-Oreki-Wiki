---
title: "现实"
description: "现实研究、重置范围、现实机器、符文与现实更新。"
tags:
  - 玩法
  - 现实
  - 重置
aliases:
  - "/gameplay/reality"
---

**现实**（Reality）是《反物质维度》的第三个主要重置层。它将永恒点数及低层进度转换成现实机器、符文和复兴点，并解锁随后与天神有关的内容。

## 解锁

原版时间研究树末端的「解锁现实」需要购买第八时间维度、本次现实达到 1e4000 EP，并满足前十三行成就等前置条件。购买该研究开放现实入口；第一次现实重置之后，黑洞和自动机等功能才进一步出现。

1e4000 EP 中的指数 4000 是指 $10^{4000}$。与前两层重置相比，现实的门槛不再沿用 1.80e308 这一数值。

## 重置与奖励

普通现实会重置永恒及以下的大部分进度，包括时间研究、永恒挑战完成次数、低层货币和前十三行成就；通用统计及最佳挑战用时通常保留。复兴与现实升级随后提供更多开局能力。

首次现实获得固定的威力符文以及一枚同伴符文。同伴符文记录第一次现实的永恒点数，成为存档中一项具有纪念意义的物品。之后的新现实允许选择获得的符文，并积累现实机器和复兴点。

「重新开始当前现实」不等同于完成新现实：它让本轮重来，但不会发放正常现实奖励，也不会重新抽取已确定的符文。

## 现实机器

现实机器（RM）是现实层的主要货币，可用于购买现实升级和黑洞相关能力。原版基础收益取决于本次现实的最高 EP，并计入即将获得的 EP。

令 $L=\log_{10}(EP)$，无额外倍率、无首次现实高段折减时，基础收益在低段可写成

$$RM=\left\lfloor\frac{27L}{4000}-26\right\rfloor.$$

当基础指数式收益达到 10 RM 后，转为

$$RM=\left\lfloor1000^{L/4000-1}\right\rfloor.$$

首次现实还有特别的折减：当 $L>6000$ 时，先将超过 6000 的部分压缩为原来的四分之一；原始 $L$ 上限为 8000。按这些原版基础规则计算：

| EP | 首次现实基础 RM |
| ---: | ---: |
| 1e4000 | 1 |
| 1e6000 | 31 |
| 1e8000 | 74 |

这里显示的是基础收益，不含后来获得的额外 RM 倍率。实际定义见 [现实机器源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/machines.js)。

## 符文与黑洞

符文是可以装备、替换的成长工具，不同类型与等级改变不同游戏机制；装备组合因此成为现实层的重要选择。复兴点则用于购买复兴能力，逐步缩短重复的前期流程。

黑洞以周期性的游戏时间加速改变资源增长速度。它不是简单的一项反物质倍率，后续无名氏还会引入储存与释放时间的能力。自动机允许以脚本编排游戏操作，这与普通自动购买器的重复购买机制有所不同。

## 现实更新

现实更新于 2022 年 12 月 17 日与 Steam 版同步发布，2024 年 4 月 1 日移植到 Android。它将原有的无限和永恒流程扩展为通往天神的完整成长链。

后续内容见[天神](/player/gameplay/celestials)。若正在尝试第一次现实，时间研究和挑战前置可参见[时间研究](/player/gameplay/time-studies)；MOD 的具体前置改动见[原版与 MOD](/player/gameplay/original-vs-mod)。

## 资料来源

- [Reality](https://antimatterdimensions.wiki.gg/index.php?title=Reality&oldid=3235)、[现实机器换算](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/machines.js)。
- [Time Studies](https://antimatterdimensions.wiki.gg/index.php?title=Time_Studies&oldid=3343)、[原版现实升级](/player/original/ow-reality-upgrades)、[原版黑洞](/player/original/ow-black-hole)。

本文依据原版社区 Wiki 的资料独立编写，涉及其内容的改编按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 共享；原文贡献者见各固定修订的页面历史。
