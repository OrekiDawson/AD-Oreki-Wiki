---
title: "永恒"
description: "永恒点数、时间维度、里程碑及研究与现实的关系。"
tags:
  - 玩法
  - 永恒
  - 时间研究
aliases:
  - "/gameplay/eternity"
---

**永恒**（Eternity）是第二个主要重置层，将无限阶段的进展换成永恒点数（EP）和永恒次数。原版首次永恒的基本条件是达到约 1.80e308 IP，并解锁第八无限维度。它使用与第一次无限相似的数值界限，但单位已经换成 IP。

## 永恒重置

首次永恒前，原版第八无限维度的反物质解锁需求为 1e60000，成本为 1e280 IP。解锁后，原先用于开放无限维度的按钮转向提示永恒所需的 IP。

| 项目 | 普通永恒的结果 |
| --- | --- |
| 反物质、维度、星系 | 重置 |
| 无限点数、无限维度 | 重置 |
| 复制器及其升级 | 重置 |
| 普通及无限挑战 | 初期重置；后续里程碑改变保留方式 |
| 永恒点数与永恒次数 | 累积 |
| 时间之理、研究与时间维度 | 通常保留，研究重置是独立选项 |
| 成就与通用统计 | 保留 |

原版第一次永恒立即开放时间研究、永恒升级与永恒里程碑。后续永恒不会重复解锁同一功能，但会继续积累奖励。

## 永恒点数

基础 EP 换算与无限点数公式类似，却使用底数 5：

$$EP=\left\lfloor M\,5^{\log_{10}(IP_{max})/308-0.7}\right\rfloor.$$

$M$ 代表 EP 倍率，$IP_{max}$ 是本次永恒达到的最高 IP。原版无额外倍率时，1.80e308 IP 的基础收益取整前约为 1.62；IP 每增加 308 个十进制数量级，取整前的 EP 收益增加至五倍。

永恒次数不是消费货币。它会影响部分升级，并作为永恒里程碑及挑战的前置；因此即使两次永恒获得相同 EP，累积次数仍有长期意义。

## 时间维度

永恒带来第三组维度。时间维度使用 EP 购买，第一时间维度生产时间碎片，高阶时间维度生产低阶时间维度。时间碎片会带来计数频率升级，使永恒层资源能反过来影响反物质生产。前四个时间维度与后四个的开放方式不同，后四个通过膨胀研究逐步解锁。

这构成了三个互相连接的系统：时间维度产生时间碎片，计数频率加快反物质增长，反物质增长又支撑无限与永恒收益。

## 研究与挑战

[时间之理](/player/gameplay/time-studies)可以用反物质、IP 和 EP 购买，并用于时间研究树。不同分叉影响反物质维度、无限维度、时间维度以及主动、被动或闲置玩法。研究配置可以重置并返还已投入的时间之理。

永恒挑战共有十二种，单关最多完成五次。前置条件不只看 EP，例如 EC1 要求永恒次数，EC4 要求无限次数。挑战目标通常以 IP 衡量，完成奖励能够持续强化普通玩法。详见[挑战](/player/gameplay/challenges)。

## 时间膨胀

在永恒后期，时间膨胀对大于 1 的有关倍率施加指数压缩。简化地说，倍率 $10^x$ 会变为 $10^{x^{0.75}}$。例如 1e16 在这种变换下成为 1e8，而不是把原倍率简单除以二。膨胀永恒产生超光速粒子，继而生成膨胀时间，供膨胀升级使用。

时间膨胀打开最后几个时间维度的研究，并通往[现实](/player/gameplay/reality)。

## 资料来源

- [Eternity](https://antimatterdimensions.wiki.gg/index.php?title=Eternity&oldid=3118)、[永恒奖励与重置](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/eternity.js)。
- [Infinity Dimensions](https://antimatterdimensions.wiki.gg/index.php?title=Infinity_Dimensions&oldid=3344)、[Time Studies](https://antimatterdimensions.wiki.gg/index.php?title=Time_Studies&oldid=3343)、[Eternity Challenges](https://antimatterdimensions.wiki.gg/index.php?title=Eternity_Challenges&oldid=3347)。
- [原版时间维度](/player/original/ow-time-dimensions) · [原版永恒里程碑](/player/original/ow-eternity-milestones) · [原版时间膨胀](/player/original/ow-dilation)。

本文依据原版社区 Wiki 的资料独立编写，涉及其内容的改编按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 共享；原文贡献者见各固定修订的页面历史。
