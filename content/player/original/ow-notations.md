---
title: "原版:记数法"
description: "原版 Wiki《Notations》条目的完整简体中文翻译：记数法列表、痛点记数法、标准/质数/字母与移动端专属记数法"
tags:
  - 原版Wiki翻译
  - 记数法
original_title: "Notations"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Notations"
original_revid: 3133
original_fetched_at: "2026-11-15T22:40:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-notations"
---

**记数法（Notations）**是游戏用来表示玩家货币数量的方式。游戏有多种记数法，从普通到勉强可读，再到完全不显示任何内容的都有。

## 记数法列表

「痛点（Painful）」记数法可以用于解锁成就 S16，选中时会让数字显示得更不精确。

| 记数法名称 | 它如何表示 1e29 | 痛点？ |
| --- | --- | --- |
| Scientific（科学记数法） | 1e29 | 否 |
| Engineering（工程记数法） | 100e27 | 否 |
| Letters（字母） | 100i | 否 |
| Standard（标准） | 100 Oc | 是 |
| Emoji（表情符号） | 100 🍦 | 是 |
| Mixed Scientific（混合科学） | 100 Oc | 否 |
| Mixed Engineering（混合工程） | 100 Oc | 否 |
| Logarithm（对数） | e29.0 | 否 |
| Brackets（括号） | e[ ) [ . [ ] | 是 |
| Infinity（无限） | 0.0941∞ | 否 |
| Roman（罗马数字） | ⅭⅭⅭⅩⅭＳ·↑ⅠⅤ∷ | 是 |
| Dots（点字） | ⠋⣿⠂⡣⠻⣽ | 是 |
| Zalgo | 0̰̍.̿̿4͚̚4҉̍ | 是 |
| Hex（十六进制） | FCA1C392 | 是 |
| Imperial（英制） | 41 petite minims | 是 |
| Clock（时钟） | 🕐🕐🕗 | 是 |
| Prime（质数） | $(2^3\times17\times31)^{(2^3)}$ | 是 |
| Bar（条形） | （无法表示） | 是 |
| Shi（侍） | 侍室侍 | 是 |
| Blind（盲文） |  | 是 |
| Blob（色块） | （无法表示） | 是 |
| ALL（仅网页版） | ⅭⅭⅭⅩⅭＳ·↑ⅠⅤ∷（见下方说明） | 是 |

## 移动端专属记数法

| 记数法名称 | 它如何表示 1e29 |
| --- | --- |
| True Blind |  |
| Mixed Logarithm | 100 Oc |
| Omega | ω\[7\]（β48） |
| Greek（希腊字母） | 100 ι |
| Flag（旗帜） | 100 🇦🇴 |
| YesNo | YES |
| Custom（自定义） | （玩家自建字母表） |
| Random（随机） | （每次切换页签都会改变记数法） |

## 「非痛点」记数法的工作原理

### 科学、工程与对数

这些是最实用的记数法，因为它们能简单解释屏幕上的数字。

科学记数法取一个数字（以 123.456 为例），把尾数四舍五入到 3 位；然后计算小数尾数中有多少位、以及被舍弃了多少位。按这些规则，该数字写作 **1.23e5**。

工程记数法与科学记数法相近，但尾数保留 4 位，且指数部分始终是 3 的倍数。前面的例子会写作 **123.4e3**。

对数记数法与前两者类似，但去掉尾数，把一切通过以 10 为底放进指数。例子数字写作 **e5.09**。

#### 混合变体（科学、工程与对数）

它们与普通变体相同，只是让游戏对 1 Decillion（1e33）以下的所有数字都使用标准记数法。

### 无限（Infinity）

基于数字与 1.80e308 的接近程度生成一个对数百分比，并在末尾加上无限符号（∞）。例子数字写作 **0.0165∞**。

## 「痛点」记数法的工作原理

### 标准（Standard）

这种记数法使用数字实际英文名的缩写。例如 $1\text{e}27=10$ Septillion，缩写为 10 Sp；$1\text{e}66=1$ Unvigintillion，缩写为 1UVg。

它遵循一些奇怪的规则（比如总在 5 之后进位），随着进度推进会变得极其混乱。例子数字写作 **123.46 K**。

下表中，Decillion 之前指 Decillion 之前的前缀；Decillion 之后指仅用于 10 之后的「个位」字符串；Decillions 指类似十位的前缀；Centillions 指类似百位的前缀；Meta 前缀指更大尺度的前缀。

后缀的格式按 单位—Decillions—Centillions 排列；如果前面有 meta 字符串则相乘。当不存在比 meta 更小的其他字符串时，连字符省略。

| Decillion 之前的前缀 | 缩写 | Decillion 之后个位 | 缩写 | Decillions | 缩写 | Centillions | 缩写 | Meta 前缀 | 缩写 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Thousand | K | Un- | U | Deci- | Dc | Centi- | Ce | Milli- | MI- |
| Million | M | Duo- | D | Viginti- | Vg | Ducenti- | Dn | Micro- | MC- |
| Billion | B | Tre- | T | Triginta- | Tg | Tricenti- | Tc | Nano- | NA- |
| Trillion | T | Quattuor- | Qa | Quadraginta- | Qd | Quadringenti- | Qe | Pico- | PC- |
| Quadrillion | Qa | Quin- | Qt | Quinquaginta- | Qi | Quingenti- | Qu | Femto- | FM- |
| Quintillion | Qt | Sex- | Sx | Sexaginta- | Se | Sescenti- | Sc | Atto- | AT- |
| Sextillion | Sx | Septen- | Sp | Septuaginta- | St | Septingenti- | Si | Zepto- | ZP- |
| Septillion | Sp | Octo- | O | Octoginta- | Og | Octingenti- | Oe |  |  |
| Octillion | Oc | Novem | N | Nonaginta- | Nn | Nongintenti | Ne |  |  |
| Nonillion | No |  |  |  |  |  |  |  |  |

由于 e9e15 的上限，游戏通常只能到达约 DFM-NNnNePC-NNnNeNA-NNnNeMC-NNnNeMI-NNnNe；但在特殊情况下也可能出现 Attillion 与 Zeptillion。不过，由于所用数字库的问题，它们可能反而让游戏显示「NaN undefined」。

| 示例 | 缩写 | 科学记数法 | 字符串到数字 |
| --- | --- | --- | --- |
| Tredecillion | TDc | 1e42 | 13 |
| Quattuorviginticentillion | QaVgCe | 1e375 | 124 |
| Octomillillion | OMI | 1e24,003 | 8,000 |
| Unquadragintimilli-Unquinquagintacentillion | UQdMI-UQiCe | 1e123,456 | 41,151 |
| Quindecicentimicro-sexvigintiducentimilli-tretricentillion | QtDcCeMC-SxVgDnMI-TTc | 1e345,678,912 | 115,226,303 |

标准记数法也被称为「最不痛点」的记数法，因为它的模式可预测，类似普通数字的写法，只是换成了后缀。

### 质数（Prime）

这种记数法只使用质数（不含 1）。为此，它经常把非质数表示为质数的幂与长表达式。例子数字写作 **$(3\times37)^{(2)}$**。

### 字母 / 表情符号

这些记数法使用 26 个字符，从 1e3 起每达到 1000 就切换一个字符。所有字母用完后，会在第一个字符后再加一个符号。字母记数法按普通字母表排序，表情符号则按下面的列表。每个表情符号等同对应字母。它们也类似标准记数法，例如那种奇怪的进位机制同样适用。

例子数字写作 **123.46 a** 与 **123.46😠（Angry）**。

#### 字母/表情符号对照

| 字母 | 表情符号 |
| --- | --- |
| a | 😠 (Angry) |
| b | 🎂 (Birthday) |
| c | 🎄 (Christmas) |
| d | 💀 (Dead) |
| e | 🍆 (Eggplant) |
| f | 👪 (Family) |
| g | 🌈 (Gay) |
| h | 💯 (High Score) |
| i | 🍦 (Ice Cream) |
| j | 🎃 (Jack-o-Lantern) |
| k | 💋 (Kiss) |
| l | 😂 (Laughing) |
| m | 🌙 (Moon) |
| n | ⛔ (No) |
| o | 🐙 (Octopus) |
| p | 💩 (Poo) |
| q | ❓ (Question mark) |
| r | ☢️ (Radioactive) |
| s | 🙈 (See) |
| t | 👍 (Thumbs up) |
| u | ☂️ (Umbrella) |
| v | ✌ (V) |
| w | ⚠️ (Warning) |
| x | ❌ (X) |
| y | 😋 (Yummy) |
| z | ⚡ (Zap) |

## 来源与许可

- 原文：[Notations](https://antimatterdimensions.wiki.gg/index.php?title=Notations&oldid=3133)（修订 ID `3133`；最后编辑者 SheldonLikesToBeNoob；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Notations&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文与表格、统一术语、保留记数法英文名称与表情符号、移除导航模板；图片未转载。
- 说明：表情符号属于游戏内容字符，按原样保留；「ALL」记数法的缩写与标准记数法相同，原文亦如此标注。

## 相关条目

[重置成长（威望）](/player/original/ow-prestige) · [《反物质维度》游戏总览](/player/antimatter-dimensions)
