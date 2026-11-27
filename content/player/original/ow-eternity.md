---
title: "原版:永恒"
description: "原版 Wiki《Eternity》条目的完整简体中文翻译：解锁条件、永恒点数公式、永恒次数与复位范围"
tags:
  - 原版Wiki翻译
  - 永恒
original_title: "Eternity"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Eternity"
original_revid: 3118
original_fetched_at: "2026-11-15T21:45:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-eternity"
---

**永恒（Eternity）**是游戏的第二个重置层，在取得**无限值**（Infinity，即 1.80e308  [无限点数](/player/original/ow-infinity)，达到后显示为 ∞）之后抵达。

## 机制

永恒层最初通过一个按钮进入——该按钮最早用于首次解锁第 8 个[无限维度](/player/original/ow-infinity-dimensions)。当玩家达到 1e280 无限点数并解锁第 8 个无限维度后，按钮会变成紫色，并提示玩家需要达到 1.80e308 无限点数。

首次达到 1.80e308 无限点数后，紫色按钮会显示一段文字，表示此时可以进行永恒重置。

当玩家第一次执行永恒重置时，会解锁一个新的「永恒」页签，其中包含 3 个子页签：[时间研究](/player/original/ow-time-studies)、[永恒升级](/player/original/ow-eternity-upgrades)与[永恒里程碑](/player/original/ow-eternity-milestones)。玩家同时会依据其拥有的无限点数获得**永恒点数**（本威望层的主要货币，详见[下节](#永恒点数)），并获得 1 次永恒。

之后再次执行永恒重置不会解锁新页签，只会给予玩家更多**永恒点数**与**永恒次数**。

永恒会重置在永恒之前遇到的大部分内容，包括但不限于：

- 反物质、[维度](/player/original/ow-antimatter-dimensions)、[计数频率](/player/original/ow-tickspeed)、[维度提升](/player/original/ow-dimension-boosts)、[反物质星系](/player/original/ow-antimatter-galaxies)；
- 无限点数、无限维度、[无限升级](/player/original/ow-infinity-upgrades)、[打破无限升级](/player/original/ow-break-infinity)；
- [普通挑战](/player/original/ow-normal-challenges)与[无限挑战](/player/original/ow-infinity-challenges)的完成记录；
- [复制器](/player/original/ow-replicanti)、[复制器升级](/player/original/ow-replicanti)与[复制器星系](/player/original/ow-replicanti)。

玩家会保留[成就](/player/original/ow-achievements)，以及统计页签中「通用」标题下的全部内容。

执行永恒重置也被称为[「永恒化」（eternitying）](/player/original/ow-terminology)。

## 永恒点数

与**无限点数**不同，玩家无需事先做任何准备，就能从一次重置中获得超过 1 点**永恒点数**。重置时获得的**永恒点数**数量按下式计算：

$$\left\lfloor EP_{mult} \times 5^{\frac{\log_{10}\left( IP_{\text{highest this Eternity}} \right)}{308} - 0.7}\right\rfloor$$

其中 $EP_{mult}$ 是永恒点数的各类乘数之积，$IP_{\text{highest this Eternity}}$ 是**本次永恒中达到的最高无限点数**（原文变量写作 IP_highest this Eternity，此处保留英文变量名以便与源码核对）。

由于该公式的运作方式，玩家可以得出关于**永恒点数**获取的几条结论：

- 恰好拥有 1.80e308 无限点数时，实际获得的**基础永恒点数**约为 1.62；
- 无限点数每乘以 1e308，**永恒点数**获取量就乘以 5。

## 永恒次数

早期玩家每次重置只能获得 1 次永恒；大多数作用于永恒次数的乘数与现实相关内容绑定。玩家可以通过[现实升级](/player/original/ow-reality-upgrades)「Eternal Amplifier」（永恒增幅器）或[成就 113](/player/original/ow-achievements) 等途径提高获得的**永恒次数**。

**永恒次数**用于决定某些升级的强度（例如[永恒升级 2](/player/original/ow-eternity-upgrades)），也被用作推进门槛：例如解锁[永恒挑战 1](/player/original/ow-eternity-challenges) 需要玩家拥有一定数量的**永恒次数**。

务必不要把**永恒点数**与**永恒次数**混淆——**永恒点数**是该层的主要货币，在游戏中大量使用；而**永恒次数**是一种重置货币，基本不能用于购买升级，只在特定场合使用。

## 来源与许可

- 原文：[Eternity](https://antimatterdimensions.wiki.gg/index.php?title=Eternity&oldid=3118)（修订 ID 3118；最后编辑者 The1AndOnly6030）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Eternity&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文与公式，统一术语，把原式中的中文变量名改为原文英文变量名并加中文解释，移除导航模板与信息框，图片未转载；本页按相同许可共享。
- 原文图片未转载：原文该页不含图片或其它媒体，仅有文字与公式。
- 原文存在两处拼写错误：公式里的 Eternnity 与正文的 Eterntiies，按上下文分别指「本次永恒」与「永恒次数」，译文已按原意处理并在本块注明。
- 源码核对：`src/core/eternity.js`（源码定位：IvarK/AntimatterDimensionsSourceCode@5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/eternity.js；具体文件证据留在内部核验记录） 的奖励计算与重置范围，以及 `src/core/player.js`（源码定位：IvarK/AntimatterDimensionsSourceCode@5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/player.js；具体文件证据留在内部核验记录） 的永恒入口条件。

## 相关条目

[无限](/player/original/ow-infinity) · [打破无限](/player/original/ow-break-infinity) · [复制器](/player/original/ow-replicanti) · [永恒挑战](/player/original/ow-eternity-challenges) · [重置成长（威望）](/player/original/ow-prestige)
