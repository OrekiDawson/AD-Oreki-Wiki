---
title: "时间膨胀"
description: "原版 Wiki《Dilation》条目的完整简体中文翻译：膨胀永恒、超光速粒子、膨胀时间、超光速星系与相关成就"
tags:
  - 原版Wiki翻译
  - 永恒
original_title: "Dilation"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Dilation"
original_revid: 3323
original_fetched_at: "2026-11-15T21:55:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-dilation"
---

**时间膨胀（Time Dilation）**是[永恒威望层](/player/original/ow-eternity)引入的最后一个主要机制。它包含一个被修改、被削弱的永恒；首次完成它会解锁两种新货币——超光速粒子（Tachyon Particles）与膨胀时间（Dilated Time），可用于购买膨胀升级。

购买 [EC11 与 EC12](/player/original/ow-eternity-challenges)研究下方的“解锁时间膨胀”[时间研究](/player/original/ow-time-studies)即可解锁膨胀。该研究要求已经购买 231～234 中的任意一项、累计拥有 $12,900$ [时间之理](/player/original/ow-time-studies)，并在没有对应复兴节点豁免时各完成永恒挑战 11 与 12 五（5）次。研究本身消耗 $5,000$ 时间之理，但会永久解锁这个机制。

解锁膨胀后，最后四个[时间维度](/player/original/ow-time-dimensions)可以购买，解锁研究分别消耗 $\text{1e6}$ 到 $\text{1e9}$ 时间之理。膨胀升级第 10 项可以按超光速粒子被动生成时间之理；第 8 项则允许同时购买[维度分叉](/player/original/ow-time-studies)的全部三条路径。

## 膨胀永恒

在膨胀状态下进行的[永恒](/player/original/ow-eternity)会把所有[反物质维度](/player/original/ow-antimatter-dimensions)、[无限维度](/player/original/ow-infinity-dimensions)与[时间维度](/player/original/ow-time-dimensions)倍率的*指数*，以及[计数频率](https://antimatterdimensions.wiki.gg/wiki/Tickspeed)倍率的*指数*都提高 $\ ^0.75$ 次方，从而显著削弱它们的威力。膨胀时间会触发一次永恒重置。

膨胀后的数值用下式计算：$10^x \to 10^{x^{0.75}}$，左侧的值被变换为右侧的值。例如倍率 $1\text{e}10,000$ 会降低为 $1\text{e}1,000$，因为 $10,000^{0.75}=1,000$。这个指数常数可以通过一项膨胀升级提高，以减轻膨胀惩罚。

时间膨胀的初始目标是达到 $1.80\text{e}308$ 无限点数来完成这次永恒，奖励玩家超光速粒子。在膨胀状态下执行永恒会退出该挑战。

## 超光速粒子

**超光速粒子（TP）**是通过完成一次膨胀永恒获得的资源，数量取决于其中产出的[反物质](https://antimatterdimensions.wiki.gg/wiki/antimatter)数量。它们会根据自身数量生产膨胀时间。

与其他可以「刷」的资源不同，这个数值严格基于在时间膨胀中达到的最高反物质与 TP 倍率。如果没有超过此前的最高反物质，或者没有购买 TP 倍率，就不会获得额外超光速粒子。在同一段进度中，超光速粒子只增不减；普通现实重置仍会把它们清零，只有特定佩勒升级可以保留。

$$Tachyons = TP_{Mult}\times\left(\frac{\log_{10}\left(AM_{\text{膨胀中最高}}\right)}{400}\right)^{1.5}$$

## 膨胀时间

**膨胀时间（DT）**是由超光速粒子生产的通用货币，基础比率为 1:1（即每 1 TP 每秒 1 DT）。膨胀时间通过达到阈值转化为超光速星系，方式类似于[时间维度](/player/original/ow-time-dimensions)提供的计数频率升级。膨胀时间也可以用于购买各种升级。

## 超光速星系

**超光速星系（TG）**是第三种提升[计数频率](/player/original/ow-tickspeed)的星系。它们和此前两种星系一样影响计数频率，但不会提高下一个反物质星系的原始成本。第一枚在 $1,000$ DT 时获得；基础阈值成长约为 $\times5$，可通过第 2 项可重复膨胀升级逐级降低，最终趋近 $\times1.35$。

> 译注：原页写作“初始阈值为 1，每个星系所需 DT 增加 ×1.35”。当前原版源码实际从 $1,000$ DT 起算，初始阈值倍率约为 $\times5$，升级第 2 项后才逐步接近 $\times1.35$；这里按源码校正，同时保留差异说明。

## 升级

> 原页通过子模板嵌入膨胀升级表。普通模式见[膨胀升级](/player/original/ow-dilation-upgrades)，被毁灭的现实见[膨胀升级（被毁灭的现实）](/player/original/ow-dilation-upgrades-doomed)。

## 相关成就

| ID | 名称 | 描述 | 奖励 |
| --- | --- | --- | --- |
| 136 | 我跟你讲，时间是相对的（I told you already, time is relative） | 进入时间膨胀。 | — |
| 137 | 你终于考虑到时间膨胀了！（Now you're thinking with dilation!） | 在膨胀状态下于 $1$ 分钟或更短时间内获得 $\text{e}260,000$ 反物质。 | 膨胀状态下获得 $\times 2$ 膨胀时间与时间之理。 |
| 138 | 这是我为了摆脱你必须做的事。（This is what I have to do to get rid of you.） | 在膨胀状态下、没有任何时间研究时达到 $\text{e}26,000$ [无限点数](/player/original/ow-infinity)。 | 移除主动与挂机时间研究路径中时间研究 131 与 133 的负面效果。 |
| 161 | 小伙子，你来错地儿了（that's where you're wrong kiddo） | 在膨胀状态下获得 $\text{e}100,000,000$ 反物质。 | — |
| 187 | 膨胀时间持有者（The One with Dilated Time） | 在[被毁灭](/player/original/ow-pelle)状态下解锁膨胀。 | 每项可重复膨胀时间倍率升级的倍率提高 $\times 1.35$。 |

> 成就名称采用游戏内简体中文，并附原页英文；描述与奖励已翻译；图标为媒体，未转载。

## 琐事

- 超光速粒子与超光速星系的规范术语本应是「Tachyonic Particles」（或简称「Tachyons」）与「Tachyonic Galaxies」。

## 来源与许可

- 原文：[Dilation](https://antimatterdimensions.wiki.gg/index.php?title=Dilation&oldid=3323)（修订 ID `3323`；最后编辑者 KrutarMarsons；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Dilation&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文与表格、统一术语、依据官方源码校正超光速星系阈值并补充现实重置边界、修复升级子页链接、移除导航模板与信息框、图片未转载；本页按相同许可共享。
- 原页以子模板嵌入膨胀升级表；本页保留主条目正文、公式与相关成就，并链接本区现有的普通与被毁灭现实升级表。

## 相关条目

[时间维度](/player/original/ow-time-dimensions) · [永恒](/player/original/ow-eternity) · [永恒挑战](/player/original/ow-eternity-challenges)
