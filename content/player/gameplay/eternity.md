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

<table class="infobox">
<caption>永恒 · 原版机制速查</caption>
<tbody>
<tr><th scope="row">英文名称</th><td>Eternity</td></tr>
<tr><th scope="row">重置层级</th><td>第二层</td></tr>
<tr><th scope="row">基础门槛</th><td>首次：解锁第八无限维度后达到约 1.80e308 IP</td></tr>
<tr><th scope="row">主要资源</th><td>永恒点数（EP）、永恒次数</td></tr>
<tr><th scope="row">新系统</th><td>时间研究、永恒升级、里程碑</td></tr>
<tr><th scope="row">后续阶段</th><td><a class="internal" href="/player/gameplay/reality">现实</a></td></tr>
</tbody>
</table>

第一次无限时，1.80e308 是反物质的门槛；到了永恒之前，游戏要求你用无限阶段积累出同数量级的无限点数。这个重复不是把旧阶段原样再玩一遍：IP 已经从一次结算奖励变成下一层的生产预算，永恒会把预算和新的生产链连接起来。

永恒（Eternity）是第二个主要重置层。你即将失去大半个无限阶段，却会拿到永恒点数（EP）与永恒次数。无限不再是最高层的成就，而成了永恒中的一段普通过程。

## 再从一开始

原版第八无限维度的反物质解锁需求为 1e60000，首次购买需要 1e280 IP。解锁后，原先用于提示无限维度的按钮会转而显示永恒条件，直到达到约 1.80e308 IP。

第一次永恒开放时间研究、永恒升级与里程碑。之后，原版普通永恒的资源保留关系大致如下：

| 项目 | 普通永恒的结果 |
| --- | --- |
| 反物质、维度、星系 | 重置 |
| 无限点数、无限维度 | 重置 |
| 复制器及其升级 | 重置 |
| 普通及无限挑战 | 初期重置；后续里程碑改变保留方式 |
| 永恒点数与永恒次数 | 累积 |
| 时间之理、研究与时间维度 | 通常保留，研究重置是独立选项 |
| 成就与通用统计 | 保留 |

EP 的价值不在于让你保存更多旧数字，而在于让这些旧数字变得越来越容易获得。第一次永恒之后，判断一轮是否值得结束，通常要同时看 EP、永恒次数、里程碑以及能否买到下一项时间维度；只盯着某一项货币，容易在重置层级之间失去节奏。

## 五倍的规律

永恒点数的基础计算式为

$$EP=\left\lfloor M\,5^{\log_{10}(IP_{max})/308-0.7}\right\rfloor.$$

$M$ 是 EP 倍率，$IP_{max}$ 是本轮永恒达到过的最高 IP。基础情况下，首次门槛的取整前收益约为 1.62；IP 每多 308 个数量级，取整前 EP 增至五倍。

永恒次数则另行累计。它不负责购物，而会影响升级与里程碑，也是某些永恒挑战的入场条件。所以即使两轮永恒获得的 EP 相同，累积次数仍可能有不同的价值。

## 让时间参与生产

第三组维度登场了。时间维度使用 EP 购买，第一时间维度生产时间碎片，高阶维度照例生产低一阶。时间碎片会带来计数频率升级，于是原本遥远的永恒层又回头作用于最早的反物质维度。

这时候回想开局，会发现三个层次其实连成了一个循环：时间维度强化反物质生产，反物质换成 IP，IP 换成 EP，EP 再买更多时间维度。若某轮永恒只多拿到少量 EP，却足以买下新的时间维度或关键里程碑，它的价值可能高于继续等待同一轮的短期倍率。前四个与后四个时间维度的开放方式不同，后者需等膨胀研究。

[时间研究](/player/gameplay/time-studies)进一步让玩家在不同分叉之间选择，研究配置可以重置并返还投入的 TT。十二个永恒挑战各可完成五次，EC1 要求永恒次数，EC4 则要求无限次数；它们的奖励又会反过来改变这些成长循环。

## 银行存的不是钱

无限次数虽然不能花，却可以存进银行。原版时间研究 191（400 TT）要求完成一次 EC10 并拥有研究 181；其效果是永恒时将 5% 的无限次数存入银行，向下取整。

如果当前有 10,000 次可计入的无限次数，便能保存其中 500 次。这里的“可计入”很重要：它不是把所有历史无限次数无条件复制一份，而是按研究效果从本轮结算时可用的次数中取 5%，并向下取整。于是本来会随重置消失的一部分统计数字，也有了长期积累的意义。这个机制与 EP 的消费逻辑完全不同，见[原版时间研究](/player/original/ow-time-studies)。

## 把指数压扁

在普通永恒里，$10^{16}$ 倍是一个很大的倍率。进入时间膨胀之后，它可能变成 $10^8$ 倍。膨胀并非把整个倍率除以某个固定数，而是对指数进行压缩：

$$10^x\longmapsto10^{x^{0.75}}.$$

原版首次开放膨胀通常要求累计 12,900 TT，完成 EC11、EC12 各五次，并支付 5,000 TT。膨胀永恒产生超光速粒子，粒子生产膨胀时间，再用于膨胀升级。粒子的数量取决于最高反物质和倍率，所以原地反复完成同样水平的膨胀永恒并不会持续产生新的粒子。

最后几个时间维度在这条路上开放。永恒之后还有一个新的名字：[现实](/player/gameplay/reality)；而时间研究的互斥分叉与挑战入口，集中见[时间研究](/player/gameplay/time-studies)。

<nav class="navbox" aria-label="成长阶段">
<p class="navbox-title">成长阶段</p>
<p><a class="internal" href="/player/gameplay/stage-progression">成长路线</a> · <a class="internal" href="/player/gameplay/infinity">无限</a> · <strong aria-current="page">永恒</strong> · <a class="internal" href="/player/gameplay/reality">现实</a> · <a class="internal" href="/player/gameplay/celestials">天神</a></p>
</nav>

## 资料来源
- [Eternity](https://antimatterdimensions.wiki.gg/index.php?title=Eternity&oldid=3118)、永恒奖励与重置（源码定位：IvarK/AntimatterDimensionsSourceCode@5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/eternity.js）。
- [Infinity Dimensions](https://antimatterdimensions.wiki.gg/index.php?title=Infinity_Dimensions&oldid=3344)、[Time Studies](https://antimatterdimensions.wiki.gg/index.php?title=Time_Studies&oldid=3343)、[Eternity Challenges](https://antimatterdimensions.wiki.gg/index.php?title=Eternity_Challenges&oldid=3347)。
- [原版时间维度](/player/original/ow-time-dimensions) · [原版永恒里程碑](/player/original/ow-eternity-milestones) · [原版时间膨胀](/player/original/ow-dilation)。

本文依据原版社区 Wiki 的资料独立编写，涉及其内容的改编按  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)  共享；原文贡献者见各固定修订的页面历史。
