---
title: "维度"
description: "原版 Wiki《Dimensions》条目的简体中文翻译：维度层级、累积数量与生产增长"
tags:
  - 原版Wiki翻译
  - 维度
original_title: "Dimensions"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Dimensions"
original_revid: 3102
original_fetched_at: "2026-11-15T21:10:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-dimensions"
---

**维度**是标准的生产单位。它们会被动生产低一级的维度，或生产所属类型的主要资源。第一层维度生产主要资源，产量与该维度的*累积数量*及其倍率成正比。所谓累积数量，是该维度被购买的次数与它被生产出的数量之和；后者通常来自更高层级的维度。

大多数维度都可以无限购买，购买数量会直接计入生产倍率。它们的价格有两种成长方式：线性—指数式的 $cost^n$，或指数—二次式的 $cost^{(n^2)}$。

## 性质

任意一种维度通常都有 8 个层级。高层维度生产低一层维度，而第 1 层维度通常生产相应的主要资源。生产会沿着维度层级逐层向下传递，直到第 1 层，再由第 1 层生产主要资源。因此，主要资源的预期增长率通常可以表示为一个八次多项式：

$$at^8+bt^7+ct^6+dt^5+et^4+ft^3+gt^2+ht$$

其中 $t$ 可以粗略理解为“时间”。

宽泛地说，任何影响某种类型全部维度的倍率，都相当于把该倍率提高到 $x^8$ 次方；如果该类型只有 $n$ 个维度处于活动状态，则相当于 $x^n$ 次方。最能说明这一点的机制是[计数频率](/player/original/ow-tickspeed)：它会影响所有[反物质维度](/player/original/ow-antimatter-dimensions)的生产速度。

计数频率初始为 $\times1.1245$。假设 8 个反物质维度全部解锁，单次购买计数频率最终会收敛为反物质获取量的 $\times2.5567$ 倍。这个效果本身并不算特别显著，但在[打破无限](/player/original/ow-break-infinity)后的价格成长机制启用前，每次计数频率升级的价格只以约 10 点反物质为底数增长；相对于当时的反物质增长速度，这已经对应 0.4077 的[膨胀指数](https://en.wikipedia.org/wiki/Big_O_notation)。

## 来源与许可

- 原文：[Dimensions](https://antimatterdimensions.wiki.gg/index.php?title=Dimensions&oldid=3102)（修订 ID `3102`；最后编辑者 The1AndOnly6030）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Dimensions&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：翻译正文、统一术语并移除原页面板、信息框和导航模板；图片未转载，本页按相同许可共享。

## 相关条目

[反物质维度（游戏机制）](/player/original/ow-antimatter-dimensions) · [维度提升](/player/original/ow-dimension-boosts) · [反物质星系](/player/original/ow-antimatter-galaxies)
