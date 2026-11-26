---
title: "维度献祭"
description: "原版 Wiki《Dimensional Sacrifice》条目的完整简体中文翻译：献祭公式、系数来源、执行条件与按钮提示"
tags:
  - 原版Wiki翻译
  - 维度
original_title: "Dimensional Sacrifice"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Dimensional_Sacrifice"
original_revid: 3397
original_fetched_at: "2026-11-15T22:10:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-dimensional-sacrifice"
---

**维度献祭（Dimensional Sacrifice）**是在首次获得第 5 次[维度提升](/player/original/ow-dimension-boosts)后解锁的机制。

它会让第 1 至第 7 [反物质维度](/player/original/ow-antimatter-dimensions)的累计数量归零，以换取第 8 反物质维度专属的倍率。已购买数量不会重置，所以这些维度的倍率和价格保持不变，反物质产量通常很快就能恢复。

普通挑战 12 中只重置第 1 至第 6 维度；获得成就 118「IT'S OVER 9000」后，献祭不再清空这些数量。普通挑战 8 又会改变规则，使所有维度连同倍率和价格一起重置。

> 本页译自社区 Wiki 同名条目；原作标记该页仍需清理（Cleanup），译文保留原文信息。

原文此页包含桌面端和移动端献祭界面图 `Antimatter-sacrifice-interface--darktheme-desktop.png`、`Antimatter-sacrifice-interface--darktheme-mobile.png`，以及成就图标 `Main-achievements-icon-r81--mobile.png`；本译文未转载这些图片，仅保留文字说明。

## 机制

维度献祭的总倍率取决于截至当前累计献祭的第 1 [反物质维度](/player/original/ow-antimatter-dimensions)数量。本次献祭新增的倍率则由当前第 1 维度数量相对于既有累计量决定，结果会累积到第 8 维度的总献祭倍率中。因此，先以 ×10 献祭再以 ×4 献祭，与先以 ×8 再以 ×5 献祭的效果相同。

维度献祭的基础公式如下：

$$\max\left(\frac{\log_{10}(AD_1)}{10}, 1\right)^m$$

其中 $AD_1$ 在这里指累计献祭的第 1 维度总量，$m$ 是献祭系数，基础值为 $2$。

在[无限挑战 2](/player/original/ow-infinity-challenges)之后，献祭公式变为 $(AD_1)^m$，其中 $m$ 是献祭系数，基础值为 $\frac{10}{1200}=\frac{1}{120}$。

[成就](/player/original/ow-achievements) 32 与 57 各使献祭系数 $+10\%$。拥有其中一项时系数变为 $2.2$（无限挑战 2 之后为 $\frac{11}{1200}$）；两项都有时系数为 $2.4$（无限挑战 2 之后为 $\frac{12}{1200}=0.01$）。这些效果彼此加算。

[成就](/player/original/ow-achievements) 88 与时间研究 228 分别使献祭系数 $+10\%$ 与 $+20\%$。它们与前述效果乘算，但它们彼此之间仍然是加算。

普通挑战 8 使用独立公式：

$$\frac{m^{0.05}}{n^{0.04}} \times j$$

其中 $m$ 是当前第 1 维度数量，$n$ 是累计献祭的第 1 维度数量，$j$ 是上一次的献祭倍率。该挑战不会采用上面的普通公式。

## 条件

只有在满足以下全部条件时，玩家才能执行维度献祭：

- 玩家至少拥有 5 次维度提升。
- 玩家不在[永恒挑战](/player/original/ow-eternity-challenges) 3 中。
- 维度献祭获得的倍率大于 $\times 1$。
- 第 8 反物质维度的累计数量大于 0。
- 玩家的反物质低于当前反物质上限（通常为 `Decimal.MAX_VALUE`，即 $\text{e}9\text{e}15$ 反物质；但如果玩家在任意普通挑战或无限挑战中，则改为当前挑战目标）。
- 玩家不在[无名氏的现实](/player/original/ow-nameless-ones)中。

如果维度献祭被禁用，对应按钮会显示「Dimensional Sacrifice Disabled」，并给出下列原因之一（原因按优先级从高到低排列）：

| 条件 | 显示文本 |
| --- | --- |
| 玩家在普通挑战 10 中（该条件在无限挑战 1 中也满足） | 第 8 维度被禁用 |
| 玩家在永恒挑战 3 中 | 永恒挑战 3 |
| 玩家购买的维度提升少于 5 次 | 需要 5 个维度提升 |
| 玩家的第 8 反物质维度恰好为 0 | 没有第 8 反物质维度 |
| 维度献祭获得的倍率小于或等于 ×1 | 加成为 ×1 |
| 玩家在任意[普通挑战](/player/original/ow-normal-challenges)或[无限挑战](/player/original/ow-infinity-challenges)中 | 已达到挑战目标 |
| 以上条件都不满足 | 需要大坍缩 |

## 琐事

原文此节为空；脚注章节亦为空。

## 来源与许可

- 原文：[Dimensional Sacrifice](https://antimatterdimensions.wiki.gg/index.php?title=Dimensional_Sacrifice&oldid=3397)（修订 ID `3397`；最后编辑者 The1AndOnly6030；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Dimensional_Sacrifice&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文与表格、统一术语、移除导航模板与信息框、图片未转载；本页按相同许可共享。
- 原文按钮提示为游戏内英文文本，译文按游戏内简体中文习惯表述并保留关键条件；如需逐字对照请查原页。

## 相关条目

[维度提升](/player/original/ow-dimension-boosts) · [维度](/player/original/ow-dimensions) · [挑战](/player/original/ow-challenges)
