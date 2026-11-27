---
title: "反物质维度"
description: "游戏介绍、主要系统、数值规模及现实更新。"
tags:
  - 游戏介绍
  - 反物质维度
  - 玩法
aliases:
  - "/antimatter-dimensions"
---

《反物质维度》（Antimatter Dimensions）是一款增量游戏。玩家从购买生产反物质的维度开始，逐步获得计数频率、维度提升和反物质星系等能力，继而进入无限、永恒和现实三个主要重置层。游戏的名称既指作品，也指其最早的一组生产单位；后者的详细规则见[反物质维度机制](/player/antimatter-dimensions-core-loop)。

游戏由 IvarK 等开发者制作。原版有[网页版](https://ivark.github.io/)、[Steam 版](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/)和移动版；Oreki Edition 是基于原版的 MOD，集中改动见[原版与 MOD](/player/gameplay/original-vs-mod)。

## 玩法

第一反物质维度直接生产反物质，第二维度生产第一维度，以此类推，直至第八维度。反物质同时是购买维度及计数频率升级的货币。高阶维度生产出的低阶维度不必由玩家逐个购买，因此即使停止购买，整条生产链也能继续积累。

游戏早期先解锁四阶以上的维度，再通过维度献祭和星系改变生产效率。此时每增加一个星系，不仅会加快生产，还会提高已有及今后获得的计数频率升级的效果。成长并非单纯扩大某个固定倍率，而是不断改变倍率之间的关系。

| 阶段 | 新资源 | 代表机制 |
| --- | --- | --- |
| 初始 | 反物质 | 八级维度、星系、维度献祭 |
| [无限](/player/gameplay/infinity) | 无限点数（IP） | 无限升级、无限维度、复制器 |
| [永恒](/player/gameplay/eternity) | 永恒点数（EP） | 时间维度、时间研究、永恒挑战 |
| [现实](/player/gameplay/reality) | 现实机器（RM） | 符文、复兴、黑洞、自动机 |
| [天神](/player/gameplay/celestials) | 遗迹碎片、记忆等 | 特殊现实、暗物质、毁灭 |

各层重置的影响范围不同。例如大坍缩清除普通生产链，却保留获得的无限点数；永恒会进一步清除大部分无限层资源。现实则连前十三行成就及其奖励也会重新取得，随后通过复兴和符文缩短再次抵达它们的过程。

## 数字的规模

游戏中的第一次「无限」不是数学意义上的无穷大，而是接近 IEEE 754 双精度浮点数的最大有限值，即约 $1.7976931348623157\times10^{308}$。一个普通计算器可能早已无法显示这个数，游戏却把它作为第一道重置门槛。

打破无限后，反物质可以越过这道上限。游戏采用支持大数的数值表示，并提供多种[记数法](/player/original/ow-notations)。科学记数法中的 1e4000 表示 $10^{4000}$，不是 4,000 个资源，也不是「无限」这个符号本身。更换记数法只会改变数字的显示方式。

游戏还以普通挑战、无限挑战和永恒挑战改变生产规则。比如普通挑战 12 让维度隔级生产，形成两条生产链；时间膨胀则压缩倍率的指数。详细规则见[挑战](/player/gameplay/challenges)。

## 游戏里的玩笑

游戏的成就名称经常把数值规则变成笑话。成就 23「第 9 个维度是假的」要求恰好拥有 99 个第八反物质维度，奖励也是第八维度的 10% 加成。第九维度并没有因此解锁。

成就 28「那么做毫无意义……」要求在已有超过 1e150 个第一维度时，再购买一个第一维度。这个微不足道的购买反而会带来第一维度 10% 的加成。与普通升级不同，一些成就鼓励玩家刻意做看起来不划算的事。

此外，阅读到 50 条不同的新闻消息也能获得成就「假新闻！」。新闻滚动条并不参与正常的维度生产，却是游戏幽默感的重要来源。更多例子见[原版成就](/player/original/ow-achievements)及[秘密成就](/player/original/ow-achievements-secret-achievements)。

## 发展历史

原版的现实更新经历约四年半开发，于 2022 年 12 月 17 日随 Steam 版同步推出，2024 年 4 月 1 日移植至 Android。这次更新加入第三个主要重置层及后期天神内容，也统一了早期「维度跃迁」与「维度提升」的名称。原来以永恒为末端的玩法由此延伸到完整的终局。

## 相关条目

[开始游玩](/player/getting-started/) · [反物质维度机制](/player/antimatter-dimensions-core-loop) · [成长策略](/player/antimatter-dimensions-decisions) · [存档](/player/gameplay/saves) · [原版 Wiki 译文](/player/original/)

## 资料来源

- [Antimatter Dimensions](https://antimatterdimensions.wiki.gg/index.php?title=Antimatter_Dimensions&oldid=3325)：生产机制。
- [Reality](https://antimatterdimensions.wiki.gg/index.php?title=Reality&oldid=3235)：现实更新与重置范围。
- [Dimension Boosts](https://antimatterdimensions.wiki.gg/index.php?title=Dimension_Boosts&oldid=3333)：旧名称。
- [Normal Challenges](https://antimatterdimensions.wiki.gg/index.php?title=Normal_Challenges&oldid=3341)：挑战 12。
- [原版游戏源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca)。

- [原版成就表](https://antimatterdimensions.wiki.gg/index.php?title=Achievements&oldid=3363)：成就 22、23、28。

本文依据原版社区 Wiki 的资料独立编写，涉及其内容的改编按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 共享；原文贡献者见各固定修订的页面历史。
