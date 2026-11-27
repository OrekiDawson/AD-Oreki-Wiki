---
title: "首次无限"
description: "到达反物质上限、进行第一次大坍缩并使用第一个无限点数。"
tags:
  - 入门
  - 教程
  - 无限
aliases:
  - "/getting-started/first-crunch"
---

游戏开局的第一项大目标是到达「无限」。它不是终点，而是新的一层货币和玩法的起点。第一次大坍缩之后，你将获得无限点数，并开始使用无限升级。

## 到达无限

原版第一次大坍缩的反物质门槛约为 $1.80\times10^{308}$。在未打破无限时，增长到这个数会使游戏转而提示大坍缩。这个界限来自常见双精度浮点数的最大有限值；对数学来说它并不无限，但对游戏开局来说已经足够大。

如果面板上还只有 1e200 反物质，看起来距离 308 只差 108，但实际资源差距仍约为 1.8e108 倍。此时通常更值得购买提升生产能力的维度、计数频率或获取星系，而不是单纯等待反物质自行增长。

继续购买直至大坍缩可用。原版第一次执行时可能出现确认窗口，阅读后确认；Oreki Edition 在自动化启用且满足条件时也可能代为执行。

## 大坍缩之后

原版首次大坍缩通常带来以下变化：

| 消失或重置 | 获得或开放 |
| --- | --- |
| 反物质及维度数量 | 1 无限点数 |
| 计数频率与维度提升 | 1 次无限 |
| 反物质星系 | 无限升级、普通挑战 |

回到前期界面后，仍然可以继续原来的维度生产。区别在于，你可以把新的 IP 花在无限升级上，再观察下一次大坍缩所需的时间有何变化。

首次无限会开放第一维度自动购买器的升级资格。后三个普通挑战需要达到原版的 16 次无限门槛。

### 旧挑战已经完成？

普通挑战 1 的目标本来就是首次达到无限。因此新玩家第一次打开挑战列表，便会发现第一项已经完成；这不是少玩了一关。此后还有许多反常的挑战，比如 NC9 中一次购买会抬高所有同价项目的价格，NC12 中维度会改为隔级生产。挑战的奖励正是你之后反复使用的自动购买器。

## 第一个目标

还没有打破无限时，基础一次大坍缩只获得 1 IP，额外的 IP 倍率升级另算。前几轮应积累 IP 并购买能改善下轮生产的升级，之后逐渐完成普通挑战、强化自动购买器。

原版需要把大坍缩自动购买器的间隔升级到 0.1 秒，才可启用打破无限。此后反物质可以超过原来的 1.80e308 上限，单次大坍缩的 IP 收益也会根据反物质增长。

因此，「第一次无限」与「打破无限」并不是同一个成就。看到无限页签时，仍需要完成后一项准备工作。

## 常见疑问

**为什么重置后数字突然变小？** 大坍缩会清除当轮生产链，新增 IP 和无限次数才是长期收益。

**为什么不能继续增加反物质？** 如果尚未打破无限，约 1.80e308 是普通生产上限；如果处在挑战中，还要阅读该挑战的特殊目标。

**MOD 自动坍缩了，怎么办？** 先看无限点数及无限次数，并从无限升级继续推进。若希望自行操作，请参见[智能自动购买器](/player/gameplay/automation)的总开关说明。

接下来阅读[无限](/player/gameplay/infinity)，了解 IP 公式、无限维度与复制器。

## 资料来源

- [Infinity](https://antimatterdimensions.wiki.gg/index.php?title=Infinity&oldid=3113)、[Break Infinity](https://antimatterdimensions.wiki.gg/index.php?title=Break_Infinity&oldid=3349)。
- [Normal Challenges](https://antimatterdimensions.wiki.gg/index.php?title=Normal_Challenges&oldid=3341)、[原版大坍缩入口](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/big-crunch.js)、[原版重置条件](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/player.js)。

本文依据原版社区 Wiki 的资料独立编写，涉及其内容的改编按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 共享；原文贡献者见各固定修订的页面历史。
