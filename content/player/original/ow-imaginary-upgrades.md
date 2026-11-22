---
title: "映像升级"
description: "原版 Wiki《Imaginary Upgrades》条目的简体中文翻译：映像机器、10 项可重复与 15 项一次性映像升级的解锁条件与效果"
tags:
  - 原版Wiki翻译
  - 现实
original_title: "Imaginary Upgrades"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Imaginary_Upgrades"
original_revid: 3358
original_fetched_at: "2026-11-16T00:05:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-imaginary-upgrades"
---

映像升级用「映像机器」购买，是一种独立货币。它和[现实升级](/player/original/ow-reality-upgrades)很像——一次性升级要先满足条件才能买——但门槛和效果都更离奇，其中几项直接决定了后两位天神能不能见到。

映像升级在玩家开始获得映像机器时解锁，而映像机器从 [现实](/player/original/ow-reality)机器 $\text{e}1,000$ 硬上限那一刻开始出现。一共 10 项可重复、15 项一次性；第一行可重复升级专门强化现实层的可重复升级。

## 映像机器

映像机器（iM）是现实层的第三级资源，用来替代现实机器。当一次现实能拿到至少 $\text{e}1,000$ 现实机器时，现实机器会被硬锁在 $\text{e}1,000$，多出来的部分改为产出映像机器。

映像机器有上限，上限由「若无 RM 上限本可获得的最高 RM」决定，并且持续更新——一旦突破历史最高值就立刻抬高。基础上限公式：

$$Max\left(\log_{10}\left({RM_{uncapped}}\right)-1000, 0\right)^2~*~Max\left(\log_{10}\left({RM_{uncapped}}\right)-100000, 0\right)^{0.2}$$

译注：原式第二个 Max 内原本写作「- 100000,」（多了一个逗号），按上下文应为与 0 取较大值，译文按此处理。

和硬上限之前的现实机器不同，映像机器没法靠反复新现实刷出来：它只会被动地朝上限爬升，越接近上限越慢。默认速度是**每分钟把「上限与当前值之差」砍半**，而且这个速度不受游戏速度修正影响。

举例：当前 $1\text{e}7$（10 M）iM、上限 $5\text{e}7$（50 M），差 $4\text{e}7$（40 M）；一分钟后是 $3\text{e}7$（30 M），差 $2\text{e}7$（20 M）；两分钟后 $4\text{e}7$（40 M），差 $1\text{e}7$（10 M），如此逼近上限。

## 可重复升级

可以无限买，但每次购买都会抬高成本；与可重复的现实升级不同，它们在阈值处**没有**额外的成本成长。第一行强化现实层第一行可重复升级，第二行管别的事。

| 名称 | 初始成本（iM） | 成长 | 末次成本 | 描述 | 最高效果 | 最高购买次数 | 其它细节 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Temporal Intensifier | 3 | ×60 | 3.02e16（30.2 Qa） | 让 Temporal Amplifier 的乘数 +0.15 | +1.35 | 9 |  |
| Replicative Intensifier | 4 | ×60 | 4.03e16（40.3 Qa） | 让 Replicative Amplifier 的乘数 +0.15 | +1.35 | 9 |  |
| Eternal Intensifier | 1 | ×40 | 1.05e16（10.5 Qa） | 让 Eternal Amplifier 的乘数 +0.4 | +4.00 | 10 |  |
| Superluminal Intensifier | 5 | ×80 | 8.39e15（8.39 Qa） | 让 Superluminal Amplifier 的乘数 +0.15 | +1.20 | 8 |  |
| Boundless Intensifier | 1 | ×30 | 1.77e16（17.7 Qa） | 让 Boundless Amplifier 的乘数 +0.60 | +6.60 | 11 |  |
| **第 2 行** |  |  |  |  |  |  |  |
| Elliptic Materiality | 1e4（10 K） | ×500 | 3.13e17（313 Qa） | 现实机器上限 ×e100 | ×e500 | 5 |  |
| Runic Assurance | 2e5（200 K） | ×500 | 1.25e16（12.5 Qa） | 符文不稳定起始等级延后 200 | +800 | 4 |  |
| Hyperbolic Apeirogon | 1e7（10 M） | ×800 | 5.12e15（5.12 Qa） | 无限维度 ×e100,000 | ×e300,000 | 3 |  |
| Cosmic Filament | 1e9（1 B） | ×1,000 | 1.00e18（1.00 Qt） | 提高星系强度 | 9% | 3 | 每次 +3% |
| Entropic Condensing | 8e9（8 B） | ×2,000 | 3.20e16（32.0 Qa） | 提高奇点获取 | ×3 | 2 | 每次 +×1 |

## 一次性升级

一次性升级沿用现实升级的规则：先满足解锁条件才能买。但它们的条件更刁钻、效果也更独特，包括逐层解锁暗物质维度，以及解锁最后两位天神。

| 名称 | 成本（iM） | 解锁条件 | 效果 | 检查时机 | 可锁定 | 细节 |
| --- | --- | --- | --- | --- | --- | --- |
| **第 3 行** |  |  |  |  |  |  |
| Suspicion of Interference | 5.0e7（50 M） | 历史累计 e90 遗迹碎片（当前 {current value}） | 时间维度按反物质总量获得幂次效果 | （之后）执行一次现实 |  | ＾1+log10(log10(AM_Total))/100 |
| Consequences of Illusions | 5.0e7（50 M） | 用单项符文等级因子权重 100 造出一枚 9,000 级符文 | 按映像可重复升级次数获得免费维度提升 | （之前）执行一次现实 |  | 20,000 × 可重复升级总数 |
| Transience of Information | 5.0e7（50 M） | 在无名氏的现实里达到投影出的无限值现实机器 | 按已购买的映像升级提高映像机器上限 | （之后）每个 tick |  | 1 + 可重复数/20 + 一次性数/2 |
| Recollection of Intrusion | 3.5e8（350 M） | 在永恒挑战 5 中达到每秒 e75,000,000,000（e75 B）的计数频率 | 所有维度的单次购买乘数提升到 1.5 | （之后）每个 tick |  |  |
| Fabrication of Ideals | 1.0e9（1 B） | 在不曾拥有任何第 1 无限维度的情况下达到 e1,500,000,000,000（e1.5 T）反物质 | 把反物质维度转换为连续统，并解锁莱特拉（维度之神） | （之后）每个 tick | 可锁定 |  |
| **第 4 行** |  |  |  |  |  |  |
| Massless Momentum | 3.5e9（3.5 B） | 两次在 30 秒内使莱特拉的现实失稳 | 解锁第 2 个暗物质维度 | （之后）每个 tick |  |  |
| Chiral Oscillation | 6.0e9（6 B） | 一次性自动凝聚至少 20 个奇点 | 解锁第 3 个暗物质维度 | （之前）凝聚奇点 |  |  |
| Dimensional Symmetry | 1.5e10（15 B） | 拥有总计 80,000 个星系 | 解锁第 4 个暗物质维度 | （之后）每个 tick |  |  |
| Deterministic Radiation | 2.8e10（28 B） | 在本现实内从未拥有超过 8 个时间研究的情况下，达到 3,850,000 计数频率连续统 | 解锁暗物质湮灭 | （之后）每个 tick | 可锁定 |  |
| Vacuum Acceleration | 3.2e12（3.2 T） | 连续统增幅至少达到 100% | 解锁可重复映像升级的自动购买器，并让映像机器产出快 10 倍 | （之后）每个 tick |  |  |
| **第 5 行** |  |  |  |  |  |  |
| Existential Elimination | 1.0e13（10 T） | 整个现实全程禁用连续统的情况下达到 e7,400,000,000,000（e7.4 T）反物质 | 按映像机器提高湮灭乘数的增量 | （之后）每个 tick | 可锁定 | Max((log10(iM)-10)^3, 1) |
| Total Termination | 1.5e14（150 T） | 在鹿颈长的现实里、装备至少 4 枚诅咒符文的情况下达到 e150,000,000,000（e150 B）反物质 | 所有符文献祭总量提升到 e100 | （之后）每个 tick |  | 含现实符文献祭 |
| Planar Purification | 6.0e14（600 T） | 在太阳神的现实里、装备至多 0 枚符文的情况下达到 20,000 级符文 | 按超立方体数量提高免费维度提升次数 | （之后）每个 tick |  | ×⌊有效超立方体数²/4⌋ |
| Absolute Annulment | 6.0e14（600 T） | 在太阳神的现实里、黑洞完全反转的情况下拥有 13,000 个反物质星系 | 按奇点数量提高免费维度提升强度 | （之后）每个 tick | 可锁定 | 奇点^300 |
| Omnipresent Obliteration | 1.6e15（1.6 Qa） | 在莱特拉的现实里、禁用全部维度且至少 4 个空符文槽的情况下完成现实 | 解锁佩勒（反物质之神） | （之后）每个 tick | 可锁定 |  |

## 琐事

- 每一行升级都有自己的命名套路与主题：
  - 第 1 行：「（形容词）Intensifier」；
  - 第 2 行：「（形容词）（名词）」，形容词以 -ic 结尾；
  - 第 3 行：「（名词）of（名词）」，第二个名词多以 I 开头；
  - 第 4 行：「（形容词）（名词）」；
  - 第 5 行：「（形容词）（名词）」，首字母押韵，5 个名词里有 4 个以 -ion 结尾。
- 这些升级的内部 ID 按整数顺序排列：可重复升级是 1–10，一次性升级是 11–25。

## 来源与许可

- 原文：[Imaginary Upgrades](https://antimatterdimensions.wiki.gg/index.php?title=Imaginary_Upgrades&oldid=3358)（修订 ID 3358；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Imaginary_Upgrades&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：翻译正文与全部表格、统一术语、公式保留原式并加译注、界面图与信息框未转载；本页按相同许可共享。
- 原文图片未转载：原页含桌面/移动界面图（Reality-imaginaryupgrades-interface--darktheme-desktop.png、-mobile.webp、buttonstates--darktheme-desktop.png）与现实按钮图，此处仅保留文字说明。
- 原文中的动态占位符（如解锁条件里的 {current value}）是游戏实时显示的数值，译文保留占位写法。

## 相关条目

[现实](/player/original/ow-reality) · [现实升级](/player/original/ow-reality-upgrades) · [莱特拉](/player/original/ow-laitela) · [佩勒](/player/original/ow-pelle) · [连续统](https://antimatterdimensions.wiki.gg/wiki/Continuum)
