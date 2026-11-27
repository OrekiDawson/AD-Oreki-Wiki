---
title: "原版:虚幻升级"
description: "原版 Wiki《Imaginary Upgrades》条目的简体中文翻译：虚幻机器、10 项可重复与 15 项一次性虚幻升级的解锁条件与效果"
tags:
  - 原版Wiki翻译
  - 现实
original_title: "Imaginary Upgrades"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Imaginary_Upgrades"
original_revid: 3358
original_fetched_at: "2026-11-16T00:05:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-imaginary-upgrades"
---

**虚幻升级（Imaginary Upgrades）**使用**虚幻机器（Imaginary Machines，iM）**购买。它和[现实升级](/player/original/ow-reality-upgrades)很像：一次性升级要先满足条件才能买，但门槛和效果更离奇，其中几项直接决定了后两位天神能不能见到。

虚幻升级在玩家开始获得虚幻机器时解锁。一次现实在不设 RM 上限时能取得至少 e1,000 [现实机器](/player/original/ow-reality)时，现实机器会停在 e1,000，其余产出转为虚幻机器；在原版规则下，这大致对应最高 2.15e1,337,333 永恒点数。一共 10 项可重复、15 项一次性；第一行可重复升级专门强化现实层的可重复升级。

## 虚幻机器

虚幻机器是现实层的第三级资源，用来替代超过基础硬上限的现实机器。它不会在现实结算时一次性发放，而是在游戏进行中逐步逼近当前上限。

虚幻机器有上限，上限由“如果不设 RM 上限，本次现实本可获得的最高 RM”决定，并随这个未截断值提高。基础上限公式为：

$$\max\left(\log_{10}(RM_{uncapped})-1000,0\right)^2
\times\max\left(\log_{10}(RM_{uncapped})-100000,1\right)^{0.2}$$

两项下限分别取 0 与 1；第二项在未截断 RM 的 $\log_{10}$ 不超过 100,001（约 e100,001）时保持为 1。

> 译注：部分旧文把第二个下限写成 0。源码使用 `max(..., 1)`，否则 RM 尚未超过上述阈值时会让整条上限错误地归零；本页按源码校正。

和硬上限之前的现实机器不同，虚幻机器没法靠反复新现实刷出来：它只会随时间朝上限爬升，越接近上限越慢。默认速度是**每 60 秒把“上限与当前值之差”减半**，而且这个速度不受游戏速度修正影响；相关虚幻升级可以缩短这个时间。

例如当前有 1e7 iM、上限为 5e7，缺口是 4e7；一分钟后数量升到 3e7，缺口剩下 2e7，两分钟后升到 4e7，如此逼近上限。

## 可重复升级

可以无限买，但每次购买都会抬高成本；与可重复的现实升级不同，它们在阈值处**没有**额外的成本成长。第一行强化现实层第一行可重复升级，第二行管别的事。

| 名称 | 初始成本（iM） | 成长 | 末次成本 | 描述 | 最高效果 | 最高购买次数 | 其它细节 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 时间强化器（Temporal Intensifier） | 3 | ×60 | 3.02e16（30.2 Qa） | 让时间放大器的乘数 +0.15 | +1.35 | 9 |  |
| 复制强化器（Replicative Intensifier） | 4 | ×60 | 4.03e16（40.3 Qa） | 让复制放大器的乘数 +0.15 | +1.35 | 9 |  |
| 永恒强化器（Eternal Intensifier） | 1 | ×40 | 1.05e16（10.5 Qa） | 让永恒放大器的乘数 +0.4 | +4.00 | 10 |  |
| 超光速强化器（Superluminal Intensifier） | 5 | ×80 | 8.39e15（8.39 Qa） | 让超光速放大器的乘数 +0.15 | +1.20 | 8 |  |
| 无界强化器（Boundless Intensifier） | 1 | ×30 | 1.77e16（17.7 Qa） | 让无界放大器的乘数 +0.60 | +6.60 | 11 |  |
| **第 2 行** |  |  |  |  |  |  |  |
| 椭圆物质（Elliptic Materiality） | 1e4（10 K） | ×500 | 3.13e17（313 Qa） | 现实机器上限 ×e100 | ×e500 | 5 |  |
| 符文保证（Runic Assurance） | 2e5（200 K） | ×500 | 1.25e16（12.5 Qa） | 符文不稳定性的起始等级延后 200 | +800 | 4 |  |
| 无边双曲（Hyperbolic Apeirogon） | 1e7（10 M） | ×800 | 5.12e15（5.12 Qa） | 所有无限维度 ×e100,000 | ×e300,000 | 3 |  |
| 宇宙细丝（Cosmic Filament） | 1e9（1 B） | ×1,000 | 1.00e18（1.00 Qt） | 提高所有星系的效果 | 9% | 3 | 每次 +3% |
| 凝聚之熵（Entropic Condensing） | 8e9（8 B） | ×2,000 | 3.20e16（32.0 Qa） | 提高获得奇点的数量 | ×3 | 2 | 每级 +×1 |

## 一次性升级

一次性升级沿用现实升级的规则：先满足解锁条件才能买。但它们的条件更刁钻、效果也更独特，包括逐层解锁暗物质维度，以及解锁最后两位天神。

| 名称 | 成本（iM） | 解锁条件 | 效果 | 检查时机 | 可锁定 | 细节 |
| --- | --- | --- | --- | --- | --- | --- |
| **第 3 行** |  |  |  |  |  |  |
| 干涉之嫌（Suspicion of Interference） | 5.0e7（50 M） | 历史累计 e90 遗迹碎片（当前 {current value}） | 时间维度按累计反物质总量获得幂次效果 | （之后）执行一次现实 |  | $1+\frac{\log_{10}(\log_{10}(AM_{total}))}{100}$ |
| 幻象之果（Consequences of Illusions） | 5.0e7（50 M） | 用单项符文等级因子权重 100 造出一枚 9,000 级符文 | 按可重复虚幻升级的购买次数获得免费维度提升 | （之前）执行一次现实 |  | 20,000 × 可重复购买总数 |
| 信息之瞬（Transience of Information） | 5.0e7（50 M） | 在无名氏的现实里达到投影出的无限值现实机器 | 按已购买的虚幻升级提高虚幻机器上限 | （之后）每个 tick |  | 1 + 可重复购买数/20 + 一次性升级数/2 |
| 入侵之忆（Recollection of Intrusion） | 3.5e8（350 M） | 在永恒挑战 5 中达到每秒 e75,000,000,000（e75 B）的计数频率 | 所有维度的单次购买乘数提升到 1.5 | （之后）每个 tick |  |  |
| 理想之构（Fabrication of Ideals） | 1.0e9（1 B） | 在不曾拥有任何第 1 无限维度的情况下达到 e1,500,000,000,000（e1.5 T）反物质 | 把反物质维度转换为连续统，并解锁莱特拉（维度之神） | （之后）每个 tick | 可锁定 |  |
| **第 4 行** |  |  |  |  |  |  |
| 无质动量（Massless Momentum） | 3.5e9（3.5 B） | 两次在 30 秒内完成莱特拉的现实 | 解锁第 2 个暗物质维度 | （之后）每个 tick |  |  |
| 手性振荡（Chiral Oscillation） | 6.0e9（6 B） | 一次自动凝聚至少 20 个奇点 | 解锁第 3 个暗物质维度 | （之前）凝聚奇点 |  |  |
| 维度对称（Dimensional Symmetry） | 1.5e10（15 B） | 拥有总计 80,000 个星系 | 解锁第 4 个暗物质维度 | （之后）每个 tick |  |  |
| 辐射之命（Deterministic Radiation） | 2.8e10（28 B） | 在本现实内从未拥有超过 8 个时间研究的情况下，达到 3,850,000 计数频率连续统 | 解锁暗物质湮灭 | （之后）每个 tick | 可锁定 |  |
| 真空加速（Vacuum Acceleration） | 3.2e12（3.2 T） | 连续统增幅至少达到 100% | 解锁可重复虚幻升级的自动购买器，并让虚幻机器产出快 10 倍 | （之后）每个 tick |  |  |
| **第 5 行** |  |  |  |  |  |  |
| 消解存在（Existential Elimination） | 1.0e13（10 T） | 整个现实全程禁用连续统的情况下达到 e7,400,000,000,000（e7.4 T）反物质 | 按虚幻机器提高湮灭乘数的增量 | （之后）每个 tick | 可锁定 | $\max((\log_{10}(iM)-10)^3,1)$ |
| 全面终结（Total Termination） | 1.5e14（150 T） | 在鹿颈长的现实里、装备至少 4 枚诅咒符文的情况下达到 e150,000,000,000（e150 B）反物质 | 所有符文献祭总量提升到 e100 | （之后）每个 tick |  | 含现实符文献祭 |
| 共面纯化（Planar Purification） | 6.0e14（600 T） | 在太阳神的现实里、不装备符文的情况下达到 20,000 级符文 | 按超立方体数量提高免费维度提升次数 | （之后）每个 tick |  | $\lfloor T^2/4\rfloor$，$T$ 为有效超立方体数 |
| 绝对废止（Absolute Annulment） | 6.0e14（600 T） | 在太阳神的现实里、黑洞完全反转的情况下拥有 13,000 个反物质星系 | 按奇点数量提高免费维度提升强度 | （之后）每个 tick | 可锁定 | $S^{300}$ |
| 彻底抹除（Omnipresent Obliteration） | 1.6e15（1.6 Qa） | 在莱特拉的现实里、禁用全部维度且至少 4 个空符文槽的情况下完成现实 | 解锁佩勒（反物质之神） | （之后）每个 tick | 可锁定 |  |

## 琐事

- 每一行升级都有自己的命名套路与主题：
- 第 1 行：「（形容词）强化器（Intensifier）」；
- 第 2 行：「（形容词）（名词）」，英文形容词以 -ic 结尾；
- 第 3 行：「（名词）of（名词）」，后一个英文名词多以 I 开头；
- 第 4 行：「（形容词）（名词）」；
- 第 5 行：「（形容词）（名词）」，英文首字母押韵，5 个名词里有 4 个以 -ion 结尾。
- 这些升级的内部 ID 按整数顺序排列：可重复升级是 1–10，一次性升级是 11–25。

## 来源与许可

- 原文：[Imaginary Upgrades](https://antimatterdimensions.wiki.gg/index.php?title=Imaginary_Upgrades&oldid=3358)（修订 ID 3358；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Imaginary_Upgrades&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：翻译正文与全部表格、按游戏内简体中文统一为“虚幻机器/虚幻升级”、依据官方源码修正虚幻机器上限公式与状态、界面图与信息框未转载；本页按相同许可共享。
- 原文图片未转载：原页含桌面/移动界面图（Reality-imaginaryupgrades-interface--darktheme-desktop.png、-mobile.webp、buttonstates--darktheme-desktop.png）与现实按钮图，此处仅保留文字说明。
- 原文中的动态占位符（如解锁条件里的 {current value}）是游戏实时显示的数值，译文保留占位写法。
- 源码核对：[虚幻机器上限公式](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/91d5bed01509cd730a3158075c9b05c19a7a3260/src/core/machines.js#L108)（提交 `91d5bed01509cd730a3158075c9b05c19a7a3260`，2026-11-24 核对）。

## 相关条目

[现实](/player/original/ow-reality) · [现实升级](/player/original/ow-reality-upgrades) · [莱特拉](/player/original/ow-laitela) · [佩勒](/player/original/ow-pelle) · [连续统](https://antimatterdimensions.wiki.gg/wiki/Continuum)
