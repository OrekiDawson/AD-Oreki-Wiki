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

如果你在现实更新发布前游玩《反物质维度》，永恒就是最后的主要重置层。2022 年 12 月 17 日，经历约四年半开发的现实更新与 Steam 版同步推出；Android 玩家则在 2024 年 4 月 1 日迎来这一层。

现实（Reality）改变了游戏的终点，也改变了玩家对“重新开始”的理解。以前的重置大多换取新的点数，现在则会得到现实机器、符文和复兴点，连游戏时间也将逐渐成为可以管理的资源。现实的核心不是把前几层再加一个倍率，而是让每次重置都同时决定长期配装、时间安排和自动化能力。

## 四千个零

原版前两个主要重置的门槛都约为 1.80e308；第三次却不再使用它。时间研究树最下方的现实研究要求本次现实达到 1e4000 EP、购买第八时间维度，并满足前十三行成就等前置。

花费时间之理解锁入口之后，玩家便可执行现实。永恒及以下的大部分资源、时间研究、永恒挑战完成次数乃至前十三行成就都将重置；通用统计与最佳挑战用时通常保留。真正需要在按钮前确认的，不是“能不能继续变强”，而是哪些长期资源已经值得换取这次重置，以及下一轮是否能更快恢复被清掉的研究与挑战进度。

## 一枚不会忘记的符文

第一次现实没有普通的随机符文选择。原版给予固定 20% 稀有度、只带反物质维度威力效果的威力符文，以及一枚同伴符文（Companion Glyph）。

同伴符文记下第一次现实的永恒点数。后来获取的装备或许强大得多，这枚最初的纪念品却记录着一个不会再次发生的时刻。连“皇家同花顺”成就（148）的配装规则也将它与基础符文区别对待：该成就要求装备各一种基础符文，同伴符文不计入种类数。换句话说，它不是一件可以随意替换的普通掉落，而是第一次现实留下的永久纪念。

此后的新现实可以选择获得的符文，并累积现实机器和复兴点。「重新开始当前现实」是另一项操作，它不结算正常现实奖励，也不重新抽取已经确定的符文。

## 第一次现实要等多久

现实机器（RM）的基础收益由本次现实最高 EP 与即将获得的 EP 决定。令 $L=\log_{10}(EP)$，不计额外倍率和首次现实的特殊折减，原版低段公式为

$$RM=\left\lfloor\frac{27L}{4000}-26\right\rfloor.$$

当基础指数式收益达到 10 RM 后，采用

$$RM=\left\lfloor1000^{L/4000-1}\right\rfloor.$$

首次现实的规则尤其值得留意：原始 $L$ 最高只计到 8000，超过 6000 的部分按四分之一计算。

| EP | 首次现实基础 RM |
| ---: | ---: |
| 1e4000 | 1 |
| 1e6000 | 31 |
| 1e8000 | 74 |

原版第一次现实即使远远超过 1e8000 EP，也不能靠继续堆基础 EP 无限制地提高 RM。这使「立刻开始下一轮」和「先把收益做高」成为真实的选择。上表不包含后来可能获得的额外 RM 倍率，具体定义见现实机器源码（源码定位：IvarK/AntimatterDimensionsSourceCode@5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/machines.js）。

## 符文、黑洞与自动机

符文把成长从单纯提高货币变成选择组合：不同等级、效果和稀有度会改变不同游戏机制。复兴点用于开放能够减少早期重复操作的能力。黑洞则周期性加速游戏时间，自动机允许通过脚本编排操作。

这些内容会在第一次现实结算后逐步开放，随后甚至出现能储存和释放时间的天神。现实机器负责把重置转成长期购买力，符文负责组合效果，黑洞和天神则把“等待多久、何时释放”本身变成资源管理问题；它们并不是三个互不相干的奖励栏。

Infinity Points、Eternity Points，下一层却不叫 Reality Points，而叫 Reality Machines。原版社区 Wiki 还记录过一个可能的命名线索：官方 Discord 在 2017 年 12 月已有 Reality Dimension 身份组，早于更新内容公布。两者之间的实际因果关系尚无确定依据。

接下来见[天神](/player/gameplay/celestials)。首次现实的前置详见[时间研究](/player/gameplay/time-studies)，本 MOD 的条件变动见[原版与 MOD](/player/gameplay/original-vs-mod)。

## 资料来源
- [Reality](https://antimatterdimensions.wiki.gg/index.php?title=Reality&oldid=3235)、现实机器换算（源码定位：IvarK/AntimatterDimensionsSourceCode@5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/machines.js）。
- [Time Studies](https://antimatterdimensions.wiki.gg/index.php?title=Time_Studies&oldid=3343)、[原版现实升级](/player/original/ow-reality-upgrades)、[原版黑洞](/player/original/ow-black-hole)。
- [原版成就表](https://antimatterdimensions.wiki.gg/index.php?title=Achievements&oldid=3363)：成就 148。

本文依据原版社区 Wiki 的资料独立编写，涉及其内容的改编按  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)  共享；原文贡献者见各固定修订的页面历史。
