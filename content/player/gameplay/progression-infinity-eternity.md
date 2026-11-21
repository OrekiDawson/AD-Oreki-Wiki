---
title: "无限与永恒"
description: "解释大坍缩、无限点数、永恒点数、时间研究与挑战如何逐层衔接，以及为什么自动化必须尊重这些重置层级"
tags:
  - 玩法
  - 无限
  - 永恒
aliases:
  - "/gameplay/progression-infinity-eternity"
---


「无限」与「永恒」是《反物质维度》最早出现的两层重置成长：玩家放弃当前的部分进度，换取新的货币与更强的成长能力。本条目解释这两层的入口、代价与关键机制，以及 Oreki Edition 的自动化为什么不能跳过它们。

这里的结论分两类：**原版机制**来自官方代码与社区资料；**MOD 行为与阈值**来自本项目的读码与实测，会单独标注来源和适用版本。

## 从反物质到大坍缩

游戏早期通过八级反物质维度生产反物质：第一维度直接产出反物质，第二维度生产第一维度，依此类推。玩家用维度提升与星系重置换取更高的生产效率，直到反物质达到约 `1.80e308`，可以执行**大坍缩（Big Crunch）**进入无限阶段。[来源：游戏总览与社区 Wiki](https://antimatterdimensions.wiki.gg/wiki/Infinity_Point)

大坍缩不是通关，而是把玩法从「堆反物质」扩展为「用无限点数购买新的成长体系」。

## 无限层

进入无限后获得**无限点数（Infinity Points，IP）**，可以购买无限升级、解锁无限维度与无限挑战。无限维度同样逐级生产：第一无限维度产出无限点数，更高层维度支撑下一层。

一个容易忽略的细节是 **`maxID1`**：它记录「第一无限维度的购买量」，而不是某种临时统计。这个字段会在后面的天神系统中成为**硬性失败条件**（见 [天神系统](/player/gameplay/celestials) 的 IU15），因此自动化「无脑买满无限维度」并不总是安全。[读码：`antimatter-dimension.js`、`infinity-dimension.js`；见 [FACTS §8.9](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/endgame.md#f-8-9)]

## 永恒层

在无限层继续推进后解锁**永恒（Eternity）**。永恒带来永恒点数（EP）、时间之理（Time Theorems，TT）与**时间研究**树，并开放永恒挑战（EC）。

### 永恒挑战的真实结算条件

EC 不是「点一下就打」的独立副本，它由原版状态机判定。以 `ec-time-study.js` 的 `canBeBought` 为例，一关要同时满足：资源足够、当前没有别的 EC 在进行、**前置普通时间研究已经买上**、二级条件满足。

EC9 的前置研究是普通研究 **151**，EC10～EC12 是 **181**。如果自动化只调用 `purchase()` 而不补前置研究，`canBeBought` 会恒为 false，EC9～EC12 就永远买不上——这一条曾让自动化在 `ecUnlocked=8` 上停住。[读码 + 实测，[FACTS §8.8](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/challenges.md#f-8-8)]

EC 的门槛按下式增长：`1e17500 × 1e2000^min(completions,4)`，也就是 0 次完成时约 `1e17500`。某些升级的 `/100` 只把第 0 档变成约 `1e17498`，对后续档位几乎没有影响，所以「多跑一会儿资源就够了」对 EC 并不成立。

### 时间研究与时间膨胀

时间研究用 TT 购买，是永恒层的核心成长树。**DS1（时间膨胀解锁）需要 5000 TT**，买上它才会打开膨胀（Dilation）相关路径；而天神 V 的「膨胀时间」条件依赖膨胀真正运行过。

时间之理的总量还与「在膨胀状态中完成一次真实永恒」有关：`rewardTP()` 只在那个时机触发，DT 速率又由 TP 决定。因此「TP 死了」往往是采样口径问题，而不是机制真的停摆。[读码 + 实测，[FACTS §8.6](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/mechanics.md#f-8-6)]

## 原版数值与 Oreki Edition 的差异

原版的关键门槛可以直接从官方源码与社区 Wiki 核对：

| 层 | 原版条件 | 首次完成时发生什么 |
| --- | --- | --- |
| 无限 | 反物质达到「无限」，即 `2^1024`（约 `1.797e308`） | 出现 Big Crunch 按钮；执行后解锁无限页签（无限升级、Breaking Infinity、Replicanti）与普通挑战页签，获得 1 无限点数 |
| 永恒 | 解锁第 8 无限维度后，无限点数达到 `1.80e308` | 解锁永恒页签（时间研究、永恒升级、永恒里程碑），获得永恒点数；永恒会重置无限点数、无限维度购买、无限升级、挑战完成记录等 |

来源：[社区 Wiki：Infinity](https://antimatterdimensions.wiki.gg/wiki/Infinity)、[Eternity](https://antimatterdimensions.wiki.gg/wiki/Eternity)；[官方源码：V 解锁条件](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/celestials/v.js)（其中也包含永恒/无限次数相关常量）。

Oreki Edition 在这一层**不改变大坍缩与永恒的触发门槛**，但增加了自动化与节奏控制，并把「≤180 分钟真实通关」作为工程目标：自动化必须在不伪造结算的前提下，把上述层级真实推进完。相关的 MOD 调整（例如 V 的现实次数、莱特拉入口、终局判据）集中在 [原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod)，不在本页重复。

另一个平台差异需要注意：Android 原版自带无限维度自动购买器，而 Web 原版没有；Web 端的相关能力是 MOD 补上的。因此「两端都能自动买无限维度」不能证明两端实现等价，见 [双端行为一致性](/developer/architecture/parity/)。

## 为什么 MOD 自动化必须尊重这些层级

Oreki Edition 的目标是**在不伪造资源、进度与结算的前提下**，让全新存档在 180 分钟内真实通关。自动购买器与自动化只能加速真实流程，不能直接写「已完成」标志。因此：

- 挑战必须走原版结算入口（见 [挑战与真实结算](/player/gameplay/challenges)）；
- 阶段与页面必须经过原版门禁（见 [阶段门禁](/player/gameplay/stage-gates)）；
- 自动化要正确处理重置后清空的字段，否则会出现「现实次数不增长」「研究树被反复清空」等现象（见 [现实与时间研究](/player/gameplay/reality-time-studies)）。

## 已确认与未确认

- **已确认**：大坍缩阈值、无限维度与 `maxID1` 语义、EC 前置研究条件、DS1 的 5000 TT 门槛与膨胀入口，均有源码读码与运行采样支持。
- **未确认（适用范围）**：上述行号与公式来自 Web 冻结上游与 Android 3.21.0 的反编译对照；两端自动化实现不同，Android 与 Web 的行为等价仍需单独验收（NOT RUN，见 [双端行为一致性](/developer/architecture/parity)）。
- **不代表攻略**：本条目描述机制，不给出最优路线，也不承诺某一策略一定能在 180 分钟内通关。

## 如何核查

1. 读 `player.json` 中的 `infinities`、`eternities`、`eternityPoints`、`timeTheorems`、`challenge.eternity.completed` 等字段，确认进度不是界面缓存。
2. 在长时间运行中采样 `EC` 完成数组与 `totalTimeTheoremRequirement`，判断是被资源卡住还是被前置研究卡住。
3. 用稳定构建做对照，避免把构建期差异当成机制问题。

## 参考资料

- [Android 仓库 docs/FACTS.md §8.4–8.10](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/eternity.md#f-8-4)：时间研究、EC 与终局链的读码记录。
- [社区 Wiki《Infinity Point》](https://antimatterdimensions.wiki.gg/wiki/Infinity_Point)：大坍缩与无限点数的公开说明。
- [社区 Wiki《Eternity》](https://antimatterdimensions.wiki.gg/wiki/Eternities)：永恒层公开说明。

- [社区 Wiki：Infinity](https://antimatterdimensions.wiki.gg/wiki/Infinity)
- [社区 Wiki：Eternity](https://antimatterdimensions.wiki.gg/wiki/Eternity)
- [官方网页源码（固定 Commit）](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca)

## 相关条目

[原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod) · [反物质维度](/player/antimatter-dimensions) · [现实与时间研究](/player/gameplay/reality-time-studies) · [天神系统](/player/gameplay/celestials) · [挑战与真实结算](/player/gameplay/challenges) · [智能自动购买器](/player/gameplay/automation) · [双端行为一致性](/developer/architecture/parity/)
