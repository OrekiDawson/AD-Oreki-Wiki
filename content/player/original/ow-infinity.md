---
title: "原版:无限"
description: "原版 Wiki《Infinity》条目的简体中文翻译：大坍缩怎么触发、无限点数怎么算、无限次数有什么用"
tags:
  - 原版Wiki翻译
  - 无限
original_title: "Infinity"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Infinity"
original_revid: 3113
original_fetched_at: "2026-11-15T21:10:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-infinity"
---

在《反物质维度》里，「无限」有两个意思：一个是数值 $2^{1024}$，另一个是玩家第一次重置——大坍缩所在的这个威望层。本页讲的是后者；两者的区别在原站另有消歧义页。

## 大坍缩

反物质堆到 1.80e308 之后，屏幕上大部分东西都会消失，只剩一句「世界因反物质过剩而崩塌」和一枚巨大的「大坍缩」按钮。按下它，游戏会把你送回起点，但这一次不是从零开始。

第一次大坍缩会同时打开三样东西：无限页签（底下有[无限升级](/player/original/ow-infinity-upgrades)、打破无限与[复制器](/player/original/ow-replicanti)三个子页签）、只带普通挑战的[挑战](/player/original/ow-challenges)页签，以及 1 点无限点数和 1 次无限。此后每次大坍缩不再解锁新页面，只是把无限点数与无限次数往上加。

被清空的东西很多：反物质、[维度](/player/original/ow-dimensions)、计数频率、[反物质星系](/player/original/ow-antimatter-galaxies)、[维度提升](/player/original/ow-dimension-boosts)，连无限层自己的[复制器](/player/original/ow-replicanti)、复制器星系和[无限维度](/player/original/ow-infinity-dimensions)数量也会归零——不过无限维度的购买记录会保留，这点常被忽略。[成就](/player/original/ow-achievements)和统计页签里的内容不受影响。

玩家常把这一步叫[「无限化」](/player/original/ow-terminology)，或者干脆说「跑一次无限」。

## 无限点数

还没打破无限的时候，一次大坍缩只给 1 点无限点数。把 16 个不可重复的[无限升级](/player/original/ow-infinity-upgrades)全部买下后，会多出一个可重复购买的升级，每级让重置时到手的无限点数 $\times 2$。

[打破无限](/player/original/ow-break-infinity)之后，游戏才允许你堆到 1.80e308 以上，也才允许一次拿到超过 1 点无限点数。此时重置所得按下面的公式计算：

$$\left\lfloor IP_{Mult}\times 10^{\frac{\log_{10}\left(AM_{\text{highest this Infinity}}\right)}{\min\left(308,~Ach_{103},~TS_{111}\right)}-0.75}\right\rfloor$$

$IP_{Mult}$ 是各项无限点数倍率的乘积，$AM_{\text{highest this Infinity}}$ 是**本次无限中**达到的最高反物质；分母里的 $Ach_{103}$ 与 $TS_{111}$ 分别对应[成就 103](https://antimatterdimensions.wiki.gg/wiki/Achievements) 和[时间研究 111](/player/original/ow-time-studies)，两者都拿到时取更小的那个，都还没拿到时分母就是 308。未打破无限时，整个式子退化为除以 308 的简单形态。

把数字代进去，能看出几个不太直观的结果。恰好 1.80e308 反物质时，打破无限后拿到的基础无限点数约是 1.78167，而不是整数 1。反物质每多乘 1e308，无限点数就乘以 10；拿到成就 103 后，反物质每乘 1e307.8 就能让无限点数再乘 10；拿到时间研究 111 后，这个倍数降到 1e285——这也是该研究对无限点数影响格外大的原因。

## 无限次数

永恒之前，一次大坍缩只算 1 次无限，而绝大多数提高无限次数的倍率都要等到永恒甚至更后面才出现。

和无限点数不同，无限次数在永恒之前几乎只是计数器：它记录你坍缩了多少次，同时决定某些[无限升级](/player/original/ow-infinity-upgrades)和[打破无限升级](/player/original/ow-break-infinity)的强度。进永恒之后，[时间研究 32](/player/original/ow-time-studies)、[成就 87](https://antimatterdimensions.wiki.gg/wiki/Achievements) 之类的手段才开始堆高它。它同时也是一道门槛，例如解锁[永恒挑战 4](/player/original/ow-eternity-challenges) 就要求一定的无限次数。

这两个数字经常被混为一谈，但用途完全不同：无限点数是这一层的主要货币，花得到处都是；无限次数是重置次数，基本上买不了东西，只在特定条件里被点名。

## 琐事

- 无限的数值是 $2^{1024}$，约 1.79769e308。这正好是 64 位  [IEEE 754 浮点数](http://en.wikipedia.org/wiki/IEEE_754#Basic_and_interchange_formats)能表示的上限，也是 JavaScript 里普通数字的最大值——游戏最初就是跑在浏览器里的。
- 超过无限值之后，游戏改用  [Patashu 的 Break Infinity 库](https://patashu.github.io/break_infinity.js/index.html)与 `Decimal` 构造函数。带 `Decimal` 的变量不再是原始数字，而是一个对象，里面存着尾数（`mantissa`）与指数（`exponent`），游戏中大量数值都靠它扛住。

## 来源与许可

- 原文：[Infinity](https://antimatterdimensions.wiki.gg/index.php?title=Infinity&oldid=3113)（修订 ID 3113；最后编辑者 The1AndOnly6030；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Infinity&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：正文按中文习惯重写、统一术语、公式与数值保留原文、导航模板与信息框未转载、图片未转载；本页按相同许可共享。
- 译者注：原文用可折叠模板给出公式的两种等价写法，这里合并成一条，并把变量名保持英文以便与源码对照；原文中「Infintiies」的拼写错误按上下文译为「无限次数」。

## 相关条目

[重置成长（威望）](/player/original/ow-prestige) · [挑战](/player/original/ow-challenges) · [维度](/player/original/ow-dimensions) · [永恒](/player/original/ow-eternity)
