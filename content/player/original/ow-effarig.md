---
title: "原版:鹿颈长"
description: "原版 Wiki《Effarig》条目的完整简体中文翻译：远古遗物之神鹿颈长的遗迹碎片、商店升级、三层现实与削弱公式"
tags:
  - 原版Wiki翻译
  - 天神
original_title: "Effarig"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Effarig"
original_revid: 3371
original_fetched_at: "2026-11-15T21:26:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-effarig"
---

> 我的现实核心正在受苦。每一层都比上一层更难。
>
> 我希望你永远无法完成它。

他们的称号「远古遗物之神（Celestial of Ancient Relics）」与其主题——[符文](https://antimatterdimensions.wiki.gg/wiki/Glyphs)——相关。

原页另有子页面[「引语（Quotes）」](/player/original/ow-effarig-quotes)，本轮批次已译并完成审校。

## 档案

鹿颈长，远古遗物之神，别号「疲惫者」。把特蕾莎的 RM 容器灌满（1e24 RM），他们就出现了；同时带来的还有新资源[遗迹碎片](#遗迹碎片)，每次现实重置都会结算。他们的主题是符文：商店卖的都是符文相关的便利功能，从调整等级因子权重到筛选、预设，最后一项「run」用来开启自己的现实。那个现实分无限、永恒、现实三层，进去后维度、游戏速度与计数频率全被膨胀削弱，层数越高削得越轻；完成三层分别解锁复制器相关增益、无名氏，以及鹿颈长符文。加入版本与特蕾莎相同。

## 遗迹碎片

解锁鹿颈长后，会引入一种名为「遗迹碎片（Relic Shards）」的新资源，可在每次[现实](/player/original/ow-reality)重置时获得。获得的遗迹碎片数量会随该次现实拥有的[永恒点数](/player/original/ow-eternity)略微增加，但更显著地取决于该次现实中用过多少种不同的符文。

$$RS_{Gained} = \left \lfloor \left ( \frac{\log_{10}\left ( EP \right )}{7,500} \right )^{Distinct_{Glyph~Count}} \right \rfloor$$

遗迹碎片还会对[符文稀有度](https://antimatterdimensions.wiki.gg/wiki/Glyphs#Glyph_Rarity)提供固定加成，类似[现实升级](/player/original/ow-reality-upgrades)「稀有度差异（Disparity of Rarity）」，但不是 $\times 1.3$ 的乘数，而是逐级提升：

$$Rarities \mathrel{+}= 5 \cdot \log_{10}\left ( \log_{10}\left ( RS + 10 \right ) \right )$$

遗迹碎片也可用于从[鹿颈长的商店](#鹿颈长的商店)购买升级。

## 鹿颈长的商店

与第一位天神类似，第二位天神也引入了一家商店，提供强力升级，例如[符文](https://antimatterdimensions.wiki.gg/wiki/Glyphs)的便利性、[高级符文机制](https://antimatterdimensions.wiki.gg/wiki/Advanced_Glyph_Mechanics)中的符文管理工具，以及解锁[鹿颈长的现实](#现实)。这些升级只能用[遗迹碎片](#遗迹碎片)购买。

| ID | 成本（RS） | 描述 |
| --- | --- | --- |
| adjuster | $1\text{e}7~(10~\text{M})$ | 可调整的[符文等级因子权重](https://antimatterdimensions.wiki.gg/wiki/Glyphs#Levels) |
| glyphFilter | $2\text{e}8~(200~\text{M})$ | [符文筛选](https://antimatterdimensions.wiki.gg/wiki/Advanced_Glyph_Mechanics#Glyph_Filter) |
| setSaves | $3\text{e}9~(3~\text{B})$ | [符文预设](https://antimatterdimensions.wiki.gg/wiki/Advanced_Glyph_Mechanics#Glyph_Presets) |
| run | $5\text{e}11~(500~\text{B})$ | [鹿颈长的现实](#现实) |

## 现实

鹿颈长的现实有三个可完成的部分，称为「层」，每层对应到目前为止出现的一个[威望层](/player/original/ow-prestige)——即[无限](/player/original/ow-infinity)、[永恒](/player/original/ow-eternity)与[现实](/player/original/ow-reality)。完成前一层即可进入下一层，其中鹿颈长的无限层最先可进入。

进入鹿颈长现实的任何一层时，施加的惩罚是对全部[维度乘数](/player/original/ow-dimensions)、游戏速度与[计数频率](https://antimatterdimensions.wiki.gg/wiki/Tickspeed)的强力[膨胀削弱](/player/original/ow-dilation)。[符文等级](https://antimatterdimensions.wiki.gg/wiki/Glyphs)在鹿颈长的现实中也会被设上限。鹿颈长现实的层数越高，这两种效果都会减弱。

膨胀惩罚可以被[无限之力](/player/original/ow-infinity-dimensions)与[时间碎片](/player/original/ow-time-dimensions)动态削弱：该层中无限之力越多，维度产量与游戏速度的惩罚越低；时间碎片则降低计数频率的惩罚。

| 层 | $c$ | 符文等级上限（GL Cap） | 奖励 | 详情 |
| --- | --- | --- | --- | --- |
| 无限 | 1,500.00 | 100 | [复制器上限](/player/original/ow-replicanti)按无限次数乘以一个数值[^e1]；[无限次数](/player/original/ow-infinity)提高你的[复制器星系上限](/player/original/ow-replicanti)[^e2]；鹿颈长现实中基础[无限点数](/player/original/ow-infinity)获取被限制在 1e200；鹿颈长现实中每一类无限点数乘数被限制在 1e50 | 见脚注 |
| 永恒 | 29.29 | 1,500 | [永恒次数](/player/original/ow-eternity)产生无限次数[^f1]；无限点数在鹿颈长的现实中不再受任何限制；你已解锁[无名氏](/player/original/ow-nameless-ones) | 见脚注 |
| 现实 | 25.00 | 2,000 | 你已解锁[鹿颈长符文](https://antimatterdimensions.wiki.gg/wiki/Glyphs#Types)（最多只能装备一个，且部分效果互斥） |  |

表中 $c$ 是鹿颈长现实当前层的一个常数。

[^e1]: 复制器上限乘数：$1.80\text{e}308 * \max\left ( 1,~Infs^{120~\text{if}~TS_{31}~\text{is unlocked},~30~\text{otherwise}} \right )$；即解锁时间研究 31 时指数为 120，否则为 30。
[^e2]: 复制器星系上限增量：$\left \lfloor \frac{\log_{10}\left ( Replicanti_{Cap} \right )}{1.80\text{e}308} - 1 \right \rfloor$。
[^f1]: 该效果与永恒次数的数量成正比。

游戏速度与维度乘数的指数被提升到以 $\text{＾}0.25$ 为底。其最终指数由以下公式决定：

$$0.25 + 0.25 * nerfFactor\left (Infinity Power \right )$$

计数频率的指数被提升到以 $\text{＾}0.7$ 为底。其最终指数由以下公式决定：

$$0.7 + 0.1 * nerfFactor\left (Time Shards \right )$$

其中 $nerfFactor$ 由以下公式决定：

$$nerfFactor = 3 * \left( 1-\frac{c}{c+\sqrt{\log_{10}\left(resource\right)}} \right)$$

## 琐事

- 鹿颈长的名字源自「Giraffe」（长颈鹿）倒写；这来自一位知名开发者「SpectralFlame」，其头像经常被误认成长颈鹿[^cel-name-easter-egg]。
- 在正式发布之前（更准确地说，是开发稍晚的阶段），鹿颈长曾被称作[「特蕾莎」](/player/original/ow-teresa)，也就是前一位天神。原因是两人的机制虽然未变，但名字最初被交换了顺序，鹿颈长本该是现实之神、特蕾莎本该是远古遗物之神[^cel-name-easter-egg]。

[^cel-name-easter-egg]: 原文参考资料：AD 开发日志第 4 篇 <0>（外部链接，未转载内容）。
[^rs]: 也称 RS（Relic Shards）；原文在术语区单独列出该缩写。

### 术语

原文用术语引用注明：遗迹碎片（Relic Shards）亦缩写为 RS。

### 脚注

原文此节的脚注已并入上方「现实」表格的脚注。

### 参考资料

原文此节仅含上述两条琐事引用的同一条开发日志链接；译文以脚注形式保留。

## 来源与许可

- 原文：[Effarig](https://antimatterdimensions.wiki.gg/index.php?title=Effarig&oldid=3371)（页面 ID 378；修订 ID 3371；最后编辑者 KrutarMarsons；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Effarig&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文、表格与公式，统一术语，把信息框内容改写为要点表，把模板内脚注改为页内脚注，移除导航模板与模板结构，图片未转载；本页按相同许可共享。
- 原文图片未转载：原页含天神动画（Cel2-runreality-static--desktop.gif、Cel2-runreality-active--desktop.gif）、导航图（Cel2-navigation-complete--desktop.png）与界面截图（Cel2-interface--darktheme-desktop.png）。请到原页查看图片。

## 相关条目

[天神](/player/original/ow-celestials) · [特蕾莎](/player/original/ow-teresa) · [无名氏](/player/original/ow-nameless-ones) · [现实](/player/original/ow-reality) · [现实升级](/player/original/ow-reality-upgrades) · [时间膨胀](/player/original/ow-dilation) · [时间研究](/player/original/ow-time-studies) · [鹿颈长·引语](/player/original/ow-effarig-quotes)
