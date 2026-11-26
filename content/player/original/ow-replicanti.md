---
title: "原版:复制器"
description: "原版 Wiki《Replicanti》条目的完整简体中文翻译：指数成长、升级、无限维度加成与复制器星系"
tags:
  - 原版Wiki翻译
  - 无限
original_title: "Replicanti"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Replicanti"
original_revid: 3350
original_fetched_at: "2026-11-15T21:45:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-replicanti"
---

**复制器（Replicanti）**是[无限](/player/original/ow-infinity)威望层内的一种机制，在玩家完成第一次[大坍缩](https://antimatterdimensions.wiki.gg/wiki/Big_Crunch)之后随时可以购买。不过，购买它需要 $1\text{e}140$ [无限点数](/player/original/ow-infinity)，所以通常只有在完成 8 个[无限挑战](/player/original/ow-challenges)之后才会解锁。

和反物质一样，它们会在[大坍缩](https://antimatterdimensions.wiki.gg/wiki/Big_Crunch)时重置（除非玩家拥有[成就 95](https://antimatterdimensions.wiki.gg/wiki/Achievements)——在一小时内达到 1.80e308 复制器获得）；除非购买了时间研究 192，否则它们不能超过无限值。

它们具有指数成长，且可以被其升级强化。

> 本页译自社区 Wiki 同名条目；原作标记该页仍需清理（Cleanup），译文保留原文信息。

## 成长

没有任何升级、且数量低于 100 时，每个复制器有 $1\%$ 的概率把 1 个复制器加入总数。这个概率对每个复制器分别生效，所以每一个复制器都有机会再产生一个，这种机制造成指数成长：玩家拥有的复制器越多，产出就越多。

超过 100 个复制器后，公式变为 $e^{\left(\ln(R)+T\times\ln(C+1)\times 1000/interval\right)}$（其中 $T$ 为距上次成长 tick 的时间）。

复制器的上限是 1.80e308；除非玩家购买了时间研究 192（移除上限，但超过 1.80e308 后复制器越多、成长越慢）。

如果玩家拥有时间研究 192 且复制器超过 1.80e308，下次 tick 的增加量公式变为：

$$e^{\left(\ln(r)+\left[\left(1+t\right)\times r\times\ln(c+1)\times interval\div 1000\times n\right]\div n\right)}$$

其中 $n=\log(1.2)\div 308$。

超过 1.80e308 复制器后，间隔按 $1.2^{\left(\log Replicanti\div cap\right)\div 308}$ 增加；也就是说，大多数情况下每 1.80e308 个复制器会使间隔乘以约 $1.2$。

## 到达无限的估算时间

用以下公式可以粗略计算玩家达到 1.80e308 复制器所需的时间：$\left(\ln(1.80\text{e}308)-\ln(R)\right)\div\ln(C+1)\times interval\div 1000$。

## 升级

### 概率

复制器增加 1 个自身的概率初始为 $1\%$。它可以通过第一个复制器升级提高，每级 $+1\%$，最高 $100\%$。

### 间隔

复制器成长 tick 的时间初始为 1 秒。它可以通过第二个复制器升级改变，每次乘以 $\times 0.9$，最低可到 50 毫秒。

### 最大复制器星系数

玩家可购买的复制器星系数量上限初始为 0，可通过购买该升级提高。该升级的数值可以被[时间研究 131](/player/original/ow-time-studies)显著提高。

### 升级成本成长

| 升级 | 基础效果 | 基础成本 | 价格增长 | 每级效果 | 最大提升 |
| --- | --- | --- | --- | --- | --- |
| 概率 | $1\%$ | $1\text{e}150$ IP | ×e15 | $+1\%$ | $+100\%$ |
| 间隔 | $1000$ 毫秒 | $1\text{e}140$ IP | ×e10 | ×0.9 | $50$ 毫秒（拥有时间研究 22 时可提高到 $1$ 毫秒） |
| 最大复制器星系数 | 0 | $1\text{e}170$ IP | $\times \text{e}25\times \text{e}5^{UpgradesBought}$（后期会显著更严厉，见「星系成本成长」） | $+1$ | 无限 |

## [无限维度](/player/original/ow-infinity-dimensions)加成

复制器在游戏早期的主要用途是为无限维度提供加成，公式为 $\log_2(replicanti)^2$。玩家到达永恒后可以购买时间研究 21，为加成再增加 $replicanti^{0.032}$；时间研究 102 会再次以 $\left(boost\times 5^{RG}\right)$ 提高加成（$RG$ 为复制器星系数）。

## 复制器星系

当玩家达到 1.80e308 复制器后，就可以选择制造一个**复制器星系**，所有成长会立刻暂停（除非拥有时间研究 192）。

复制器星系的作用与[反物质星系](/player/original/ow-antimatter-galaxies)完全相同（会重置星系重置的所有普通内容），但它们不会改变第 8 反物质维度为获得下一个反物质星系所需的价格增长。

它们的数量受第 3 个复制器升级限制，并会在无限时重置。若拥有[时间研究 33](/player/original/ow-time-studies)，会保留其中一半。若已解锁[成就 95](https://antimatterdimensions.wiki.gg/wiki/Achievements)，它提供的星系会在时间研究之后单独计算。

购买一个复制器星系时，复制器数量会被设为 1（除非玩家拥有成就 r126，此时复制器星系会把复制器数量除以 1.80e308）。

它们的效果受时间研究 132 与 142 强化，分别把这些星系的威力乘以 $\times 1.4$ 与 $\times 1.5$。

### 星系成本成长

当玩家达到 100 个复制器星系（约 $\text{e}27000$ IP）时，第 3 个复制器升级的成本成长会变得严厉得多：从每次购买 $\times \text{e}25$ 变为 $\times \text{e}75$ IP，且每个星系的加项增长到 $\times \text{e}55$ IP。

在 1000 个星系时（约 $\text{e}2975170$ IP）成长会进一步加剧：普通倍率暴涨到每次购买 $\times \text{e}50280$ IP，加项增长到 $\times 1\text{e}55\times\left(1\text{e}5^{\left(Galaxies-1000\right)}\right)$ IP。

## 提示

- 玩家大约在 $\text{e}240$ IP 时可以达成[成就 95](https://antimatterdimensions.wiki.gg/wiki/Achievements)的要求。
- 如果玩家想完成[成就 95](https://antimatterdimensions.wiki.gg/wiki/Achievements)，并且已经达到上述某个升级，就必须尽快购买一个星系，以免一小时计时过期。
- 玩家还需要注意复制器的早期阶段，因为它取决于随机数（RNG）。

## 琐事

- 最后一个间隔升级在 $\text{e}420$ IP 时购买，但如果玩家拥有时间研究 22，则变为 $\text{e}790$（如果在达到最后一个原版上限之后才购买该研究，数值又会变为 $\text{e}800$）。
- Replicanti 的单数形式本应是「Replicantus」，但游戏对单数与复数都使用 Replicanti。
  - 在一条新闻滚动条消息中，游戏提到有三支队伍在争论 Replicanti 的单数形式：「Team Replicantus」「Team Also Replicanti」与「Team The Plural is Replicantis」。
- 如果玩家没有任何升级或加成，达到 $1.80\text{e}308$ 复制器的预期时间是 19 小时 48 分 52 秒。但这几乎不会发生，因为玩家只需 $1\text{e}140$ [IP](https://antimatterdimensions.wiki.gg/wiki/IP)就能购买一个间隔升级。

## 来源与许可

- 原文：[Replicanti](https://antimatterdimensions.wiki.gg/index.php?title=Replicanti&oldid=3350)（修订 ID `3350`；最后编辑者 KrutarMarsons；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Replicanti&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文与表格、统一术语、移除导航模板与信息框、图片未转载；本页按相同许可共享。
- 原文中的公式排版不统一（如 0,032 与 1e5 等写法）按 LaTeX 规范化；数值与逻辑未改动。

## 相关条目

[永恒](/player/original/ow-eternity) · [无限](/player/original/ow-infinity) · [无限维度](/player/original/ow-infinity-dimensions)
