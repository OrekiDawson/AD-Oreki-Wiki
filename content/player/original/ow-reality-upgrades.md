---
title: "现实升级"
description: "原版 Wiki《Reality Upgrades》条目的完整简体中文翻译：可重复与不可重复升级、解锁条件、效果与内部 ID"
tags:
  - 原版Wiki翻译
  - 现实
original_title: "Reality Upgrades"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Reality_Upgrades"
original_revid: 3357
original_fetched_at: "2026-11-15T22:55:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-reality-upgrades"
---

**现实升级（Reality Upgrades）**是一类可用[现实机器](/player/original/ow-reality)购买的升级。与前两个威望相关升级——[无限升级](/player/original/ow-infinity-upgrades)与[永恒升级](https://antimatterdimensions.wiki.gg/wiki/Eternity_Upgrades)——不同，现实升级是独特的：可重复升级不止一个，而且它们不会直接为主要货币（现实机器）提供倍率。此外，其他威望相关升级可以在没有高级前置的情况下购买，而不可重复的现实升级需要满足某种「条件」才能解锁购买。不过条件一旦完成，该升级就会永久可购买，即使进入下一个现实也是如此。

每一组至少购买过一次的现实升级，都会追溯性地让所有[符文等级](https://antimatterdimensions.wiki.gg/wiki/Glyphs#Glyph%20Level)提高 1，总计可提供固定的 $+5$ 符文等级加成。

> 升级名称是游戏内标签，保留英文原名；效果、条件与数值已翻译。

## 可重复升级

可无限重复购买，但每次购买都会提高成本。在某些成本区间，成本成长会变得更严厉——在 $\text{e}30$ 与 1.80e308 [现实机器](/player/original/ow-reality)以上。

| 名称 | 初始 RM 成本 | 成本成长 | 在 $1\text{e}30$ RM 之后的成长 | 在 $1.80\text{e}308$ RM 之后的成长 | 效果 |
| --- | --- | --- | --- | --- | --- |
| Temporal Amplifier | $1$ | ×30 | 每级在现有成长上 $+3$ | 每级把现有成长 ×30 | [膨胀时间](/player/original/ow-dilation)获取速度变为 3 倍 |
| Replicative Amplifier | $1$ | ×30 | 每级在现有成长上 $+3$ | 每级把现有成长 ×30 | [复制器](/player/original/ow-replicanti)成长速度变为 3 倍 |
| Eternal Amplifier | $2$ | ×30 | 每级在现有成长上 $+3$ | 每级把现有成长 ×30 | 获得 3 倍[永恒次数](/player/original/ow-eternity) |
| Superluminal Amplifier | $2$ | ×30 | 每级在现有成长上 $+3$ | 每级把现有成长 ×30 | 获得 3 倍[超光速粒子](/player/original/ow-dilation) |
| Boundless Amplifier | $3$ | ×50 | 每级在现有成长上 $+5$ | 每级把现有成长 ×50 | 获得 5 倍[无限次数](/player/original/ow-infinity) |

## 不可重复升级

一次性购买，效果独特且强力。每个不可重复升级都有一个解锁条件，在特定[游戏事件](https://antimatterdimensions.wiki.gg/wiki/Event_Hub)派发时检查。条件一旦满足，该升级就永久解锁，即使在新现实开始时也是如此。部分升级还会给予[自动点数](https://antimatterdimensions.wiki.gg/wiki/Automator)。

### 第 2 行（成本：$15$ RM）

| 名称 | 解锁条件 | 效果 | 检查事件 | 可锁定 | AP | 细节 |
| --- | --- | --- | --- | --- | --- | --- |
| Cosmically Duplicate | 在不使用复制器星系的情况下完成第一次永恒 | [复制器](/player/original/ow-replicanti)速度基于[复制器星系](/player/original/ow-replicanti)数量相乘 | （之前）执行[永恒](https://antimatterdimensions.wiki.gg/wiki/Event_Hub#Eternity) | 是 |  | $1+\left(\frac{RG_{amount}}{50}\right)$ |
| Innumerably Construct | 在最多 1 个反物质星系的情况下完成第一次无限 | [无限](/player/original/ow-infinity)获取基于[反物质星系](/player/original/ow-antimatter-galaxies)数量提高 | （之前）[大坍缩](/player/original/ow-infinity) | 是 |  | $1+\left(\frac{AG_{amount}}{30}\right)$ |
| Paradoxically Attain | 在没有任何自动成就的情况下手动永恒 | [超光速粒子](/player/original/ow-dilation)获取基于[成就](https://antimatterdimensions.wiki.gg/wiki/Achievements)倍率提高 | （之前）执行永恒 | 是 |  | $\sqrt{Ach_{mult}}$ |
| Linguistically Expand | 只装备一枚 3 级以上符文，以 $1\text{e}4000$ 永恒点数完成永恒 | 再获得一个[符文](https://antimatterdimensions.wiki.gg/wiki/Glyphs)槽位 | （之后）执行永恒 | 是 |  |  |
| Existentially Prolong | 以至少 $1\text{e}400$ 无限点数完成第一次永恒 | 每个[现实](/player/original/ow-reality)开始时拥有 100 永恒次数（同样作用于当前现实） | （之前）执行永恒 | 是 | 15 |  |

### 第 3 行（成本：$50$ RM）

| 名称 | 解锁条件 | 效果 | 检查事件 | 可锁定 | AP | 细节 |
| --- | --- | --- | --- | --- | --- | --- |
| The Boundless Flow | $1\text{e}12$ 存入的无限次数 | 每秒获得正常无限化所得无限次数的 10% | （首次）解锁[现实](/player/original/ow-reality)；（之后）执行永恒 |  | 5 |  |
| The Knowing Existence | 在不使用[永恒挑战 1](/player/original/ow-eternity-challenges)的情况下以 $1\text{e}70$ 永恒点数完成永恒 | 永恒点数倍率基于现实与[时间之理](/player/original/ow-time-studies)数量 | （之后）执行永恒 | 是 |  | $^{LogReals_{ClampMin}}$ |
| The Telemechanical Process | 在未购买第 5～8 时间维度的情况下以 $1\text{e}4000$ 永恒点数完成永恒 | 解锁[时间维度](https://antimatterdimensions.wiki.gg/wiki/Time_Dimension)、[×5 永恒点数](https://antimatterdimensions.wiki.gg/wiki/Eternity_Upgrades)倍率与更好的永恒自动购买器 | （之后）执行永恒 | 是 | 10 |  |
| The Eternal Flow | $1\text{e}7$ 永恒次数 | 每秒获得等于现实次数的永恒次数 | （首次）解锁现实；（之后）执行永恒 |  | 5 | 与其他永恒倍率相乘 |
| The Paradoxical Forever | 在未购买 ×5 永恒点数倍率时拥有 $1\text{e}10$ 永恒点数 | 基于 ×5 永恒点数倍率提高超光速粒子获取 | （之后）执行永恒 | 是 |  | $\max\left(\frac{\sqrt{\log_{10}(epMult)}}{9},1\right)$ |

### 第 4 行（成本：$1,500$ RM）

| 名称 | 解锁条件 | 效果 | 检查事件 | 可锁定 | AP | 细节 |
| --- | --- | --- | --- | --- | --- | --- |
| Disparity of Rarity | 装备 4 枚稀有度罕见或更高的符文完成现实 | 改进符文稀有度公式 | （之前）执行现实 |  |  | 符文强度 ×1.3 |
| Duplicity of Potency | 装备 4 枚符文、每枚至少 2 个效果完成现实 | 符文有 50% 概率获得额外效果 | （之前）执行现实 |  |  |  |
| Measure of Forever | 装备 4 枚符文、每枚等级 10 以上完成现实 | 永恒次数提升符文等级 | （之前）执行现实 |  |  | 增加 $\times0.45\times\log_{10}(Eternities+1)^{0.5}$ 作为第四项符文等级因素 |
| Scour to Empower | 一次拥有总计 30 枚以上符文 | 可[献祭符文](https://antimatterdimensions.wiki.gg/wiki/Glyph_Sacrifice)获得永久加成（Shift + 点击） | （之前）执行现实 |  |  | 见[符文献祭](https://antimatterdimensions.wiki.gg/wiki/Glyphs#Glyph%20Sacrifice) |
| Parity of Singularity | 解锁黑洞后累计游玩 100 天 | 解锁另一个[黑洞](/player/original/ow-black-hole) | （之后）每个 tick |  | 10 |  |

### 第 5 行（成本：$100,000$ RM）

| 名称 | 解锁条件 | 效果 | 检查事件 | 可锁定 | AP | 细节 |
| --- | --- | --- | --- | --- | --- | --- |
| Cosmic Conglomerate | 所有类型星系总计 $2,800$ 个 | 遥距[反物质星系](/player/original/ow-antimatter-galaxies)成长推迟到 100,000 个星系 | （之后）每个 tick |  |  |  |
| Temporal Transcendence | $1\text{e}28000$ 时间碎片 | 时间维度倍率基于本现实已过天数 | （之后）每个 tick |  |  | $10^{(1+2\times\log_{10}(days+1))^{1.6}}$ |
| Replicative Rapidity | 在 15 分钟内完成现实 | 复制器速度基于最快现实（游戏时间）提高 | （之前）执行现实 |  |  | $\min\left(\frac{15}{minutes},180\right)$ |
| Synthetic Symbolism | 在没有符文的情况下以 $5,000$ 现实机器完成现实 | 再获得一个符文槽位 | （之前）执行现实 | 是 |  |  |
| Effortless Existence | 达到 $1\text{e}11111$ 永恒点数 | 解锁现实自动购买器与自动机命令 | （之后）执行永恒 |  | 100 |  |

## 琐事

- 每一行升级都有各自的命名风格，有些可能只是巧合：
  - **第 1 行**：*（形容词）* Amplifier；这里的*形容词*也指向另一个现实升级，例如「Boundless」与「Eternal」分别是第 3 行的「The Boundless Flow」与「The Eternal Flow」。
  - **第 2 行**：*（副词）* *（动词）*。
  - **第 3 行**：The *（形容词）* *（名词）*。
  - **第 4 行**：*（名词）* *（介词）* *（名词）*；介词通常是「of」，且两个名词通常都以「-y」结尾。只有「Scour to Empower」用了「to」，同时打破这两条惯例；此外这些名词彼此押韵。
  - **第 5 行**：*（形容词）* *（名词）*；首字母相近形成头韵。
- 本页所有升级的内部 ID 都按升级的基数（整数）顺序排列：可重复升级为 ID 1–5，不可重复升级为 ID 6–25。

## 来源与许可

- 原文：[Reality Upgrades](/player/original/ow-reality-upgrades)（修订 ID `3357`；最后编辑者 KrutarMarsons；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Reality_Upgrades&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文与表格、按行拆分合并表头为普通表格、统一术语、移除多页签模板与导航；图片未转载。
- 说明：升级名称保留英文原名（游戏内标签）；「Row 2/3/4/5」在移动版称为「Groups」，译文按桌面版表格的行组织并注明成本。

## 相关条目

[现实](/player/original/ow-reality) · [复兴](https://antimatterdimensions.wiki.gg/wiki/Perks)（待翻译） · [符文](https://antimatterdimensions.wiki.gg/wiki/Glyphs)（待翻译） · [黑洞](/player/original/ow-black-hole)