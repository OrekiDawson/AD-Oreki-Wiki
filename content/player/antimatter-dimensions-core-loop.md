---
title: "反物质维度机制"
description: "八级维度、价格、计数频率与早期重置的数学原理。"
tags:
  - 玩法
  - 反物质维度
  - 重置
aliases:
  - "/antimatter-dimensions-core-loop"
---

**反物质维度**（Antimatter Dimensions，简称 AD）是游戏最早的生产单位，共八级。第一维度生产反物质，第二至第八维度分别生产比自身低一级的维度。

## 生产与购买

每级维度有两个关键数值：拥有数量和生产倍率。拥有数量包括购买及由上一级生产的数量；只有购买的数量才会推进每十个一组的购买倍率。基础状态下，每购买同级十个维度，生产倍率乘以 2，价格进入下一档。

| 维度 | 首个价格（反物质） | 每十个价格倍率 |
| ---: | ---: | ---: |
| 1 | 10 | 1e3 |
| 2 | 100 | 1e4 |
| 3 | 1e4 | 1e5 |
| 4 | 1e6 | 1e6 |
| 5 | 1e9 | 1e8 |
| 6 | 1e13 | 1e10 |
| 7 | 1e18 | 1e12 |
| 8 | 1e24 | 1e15 |

例如第一维度最初每个售价 10，买满第一组需要 100 反物质；下一组的单价为 10,000。已经拥有 7 个购买量时，再买 3 个便能触发整组倍率，而不是必须重新买满十个。

上表是无特殊挑战、未触发无限后价格加速时的原版基础成本，来源为 [维度成本定义](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/dimensions/antimatter-dimension.js)。普通挑战 6 等会改变价格或支付资源。

## 八次多项式

生产方向如下：

**第八维度 → 第七维度 → … → 第二维度 → 第一维度 → 反物质**

假设只拥有一个第八维度，其余维度为零，所有倍率固定且不进行购买。以连续时间近似，每个高阶维度每秒生产 0.1 个下一级维度，第一维度每秒生产 1 反物质。时间为 $t$ 秒时，由这个第八维度贡献的反物质近似为

$$\Delta AM=\frac{t^8}{8!\,10^7}.$$

这是对生产链的数学简化，不是实际每个 tick 的精确模拟。若已有多个等级的初始维度，反物质增量就是不同次数的多项式项之和。

如果把全部八级的生产速率同时乘以 $s$，上述最高次项的系数将乘以 $s^8$。因此，在简化模型中，各级生产都提高 10%，最高次项的长期贡献约提高至 $1.1^8\approx2.14$ 倍。全局升级的影响远不止面板上的一个倍率。

## 计数频率

计数频率升级缩短等效生产间隔，对整条反物质生产链产生影响。原版无星系且无其他加成时，单次升级约为 ×1.125；星系会进一步增强每次升级的效果。

| 基础星系数 | 单次升级效果 |
| ---: | ---: |
| 0 | ×1.125 |
| 1 | ×1.145 |
| 2 | ×1.165 |

三个及以上星系使用另一套计算规则。复制器星系和膨胀带来的星系也会影响后期的有效星系数。参见[计数频率](/player/original/ow-tickspeed)的完整公式。

## 早期重置

维度提升前四次分别解锁第五至第八维度，第五次解锁献祭；前五次基础需求为当前最高可用维度的 20 个，之后第八维度需求每次再加 15。每次提升为部分维度提供倍率，直到八次提升后所有维度都获得加成。

维度献祭将第一至第七维度的累计数量清除（通常保留购买记录），提高第八维度的倍率。它不直接提高第一维度，却通过最高层生产链逐渐传递给全部下游资源。某些挑战和成就会改变清除范围或计算方式。

首个反物质星系的基础需求为 80 个第八维度，第二个 140，第三个 200。星系通常清除维度提升、维度与计数频率积累，但会强化重新购买的计数频率升级。后期升级降低需求，远距及遥距星系又会让价格增长加速。

## 献祭的数学

在原版基础献祭规则下，令 $A$ 为累计献祭的第一维度数量，总献祭倍率为

$\max\left(1,\frac{\log_{10} A}{10}\right)^2.$

如果累计献祭量达到 1e100，基础总倍率为 100；达到 1e1000 时则为 10,000。这里讨论的是总倍率，而不是在原有倍率上再乘一次这个数。完成无限挑战 2 后，基础公式换成 $A^{1/120}$：相同的 1e120 累计量可以得到 ×10，而在旧公式下会得到 ×144；随着数量继续增长，新公式的优势才会显现。这也是献祭奖励不能只靠开局效果判断的原因。

献祭并非永远需要牺牲低阶维度。成就 118「超过 9000 了！」要求献祭总倍率达到 1e9000，取得之后献祭不再清除反物质维度数量。原本的取舍机制在后期变成了可以频繁获得的强化。参见[维度献祭](https://antimatterdimensions.wiki.gg/index.php?title=Dimensional_Sacrifice&oldid=3397)与[原版成就表](https://antimatterdimensions.wiki.gg/index.php?title=Achievements&oldid=3363)。

## 机制演变

现实更新之前，前四次维度提升另有「维度跃迁」之称；更新后统一称为维度提升。这解释了早期英文攻略中 Dimensional Shift 与 Dimensional Boost 的区别。

普通挑战 12 将相邻生产改为隔级生产，第一、第二维度直接生产反物质。原来的一条八级链变成两条较短的链，因此正常玩法中的多项式近似也不能直接套用。

第一次大坍缩之后出现无限点数，生产与重置关系的下一层见[无限](/player/gameplay/infinity)。

## 资料来源

- [Antimatter Dimensions](https://antimatterdimensions.wiki.gg/index.php?title=Antimatter_Dimensions&oldid=3325)、[Dimensions](https://antimatterdimensions.wiki.gg/index.php?title=Dimensions&oldid=3102)、[反物质维度源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/dimensions/antimatter-dimension.js)。
- [Tickspeed](https://antimatterdimensions.wiki.gg/index.php?title=Tickspeed&oldid=3334)。
- [Dimension Boosts](https://antimatterdimensions.wiki.gg/index.php?title=Dimension_Boosts&oldid=3333)、[维度提升源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/dimboost.js)。
- [Dimensional Sacrifice](https://antimatterdimensions.wiki.gg/index.php?title=Dimensional_Sacrifice&oldid=3397)、[Antimatter Galaxies](https://antimatterdimensions.wiki.gg/index.php?title=Antimatter_Galaxies&oldid=3335)、[星系源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/galaxy.js)。
- [Normal Challenges](https://antimatterdimensions.wiki.gg/index.php?title=Normal_Challenges&oldid=3341)。多项式示例为本文基于基础生产率的数学推导。

本文依据原版社区 Wiki 的资料独立编写，涉及其内容的改编按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 共享；原文贡献者见各固定修订的页面历史。
