---
title: "太阳神"
description: "原版 Wiki《Ra》条目的完整简体中文翻译：被遗忘之神太阳神的记忆碎片、四位天神的记忆升级、28 项里程碑与时间之理增益公式"
tags:
  - 原版Wiki翻译
  - 天神
original_title: "Ra"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Ra"
original_revid: 3387
original_fetched_at: "2026-11-15T21:22:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-ra"
---

> 现实是我的家，可我却造不出属于自己的现实。

原页另有子页面「引语（Quotes）」，本轮批次未译，见文末相关条目。原文此页带有「小作品（Stub）」站点维护标记，属于原站编辑提示，不是玩法内容。

## 档案

太阳神，被遗忘之神，别号「被遗忘者」。集齐全部 36 个[薇成就](/player/original/ow-v)后登场。祂的主题是「回忆前四位天神」：在现实里用天神记忆与记忆碎片把特蕾莎、鹿颈长、无名氏、薇逐个升到 25 级，每级都会返还一项前作机制——从充能无限升级、符文炼金，到储存时间脉冲、三体研究与困难薇成就。祂的现实惩罚简单但致命：维度提升上限只有 4 次，计数频率购买乘数锁死在 $\times1.125$，星系那点加成等于没有；完成现实不给奖励，产出的是记忆碎片。

## 现实

太阳神的现实随天神一同解锁，有 2 项简单却有效的惩罚：玩家最多只能拥有 $4$ 次维度提升，且计数频率购买乘数固定为 $\times{1.125}$，使星系对它的效果失效。完成该现实没有任何奖励。

在太阳神的现实内，会根据特定资源数量产出天神记忆所需的记忆碎片，每位天神作为主因的资源各不相同。

| 天神 | 基础记忆碎片产出 |
| --- | --- |
| 特蕾莎 | $4\left(\frac{\log_{10}(EP)}{10,000}\right)^3$ |
| 鹿颈长 | $4*{RS_{Gained}}^{0.1}$ |
| 无名氏 | $4\left(\frac{\log_{10}(TimeShards)}{30,000}\right)^2$ |
| 薇 | $4\left(\frac{\log_{10}(IPow)}{10,000,000}\right)^{1.5}$ |

储存现实时间会停止记忆碎片产出，但记忆仍会正常获得。

## 记忆

太阳神内每一位前代天神都通过消耗记忆来升级；记忆由记忆碎片随时间被动产出。每个记忆碎片每秒基础产出 1 点记忆，可用记忆升级与里程碑强化。记忆碎片与记忆并非通用：每位天神都有自己独立的两项资源。

### 升级

记忆可以花在 3 种可重复购买的升级上：直接提高记忆获取、提高太阳神现实中的记忆碎片获取，或提升天神等级。玩家开始时只有特蕾莎已解锁，之后每把一位天神升到 $8$ 级即可解锁下一位。等级上限为 $25$。

前两项升级——追忆（Recollection）与碎裂（Fragmentation）——有基于以下因子的上限：

$$Cost_{Upgrade}~\geq~0.5*{requiredMemories_{LevelCap}}$$

这使得这两项升级分别可购买 $22$ 次与 $11$ 次。不过，把某位天神升到 $25$ 级会导致玩家失去在该天神处升级记忆碎片与记忆获取的能力，因为它们对外部资源没有效果。

下表中「名称」列的 {天神名} 是原站保留的**天神名占位符**：游戏实际显示为对应天神的名字（特蕾莎 / 鹿颈长 / 无名氏 / 薇），因为同一套升级对四位天神各有一份。译文保留占位写法以便对照原文。

| 名称 | 起始成本（记忆） | 成长 | 末次成本 | 最大等级 | 描述 | 效果（$n = 购买次数$） | 起始 | 上限 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 「{天神名}」的追忆（Recollection） | $1.00\text{e}3~(1.00~\text{K})$ | $\times5$ | $4.77\text{e}17~(476.84~\text{Qa})$ | $22$ | 获得的记忆 +$30\%$ | $1.3^n$ | $\times1.00$ | $\times321.18$ |
| 「{天神名}」的碎裂（Fragmentation） | $5.00\text{e}3~(5.00~\text{K})$ | $\times25$ | $4.77\text{e}17~(476.84~\text{Qa})$ | $11$ | 获得的记忆碎片 +$50\%$ | $1.5^n$ | $\times1.00$ | $\times86.50$ |

把「{天神名}」升到「当前等级 + 1」的成本公式（$n$ = 当前等级）：

$$\left\lfloor\left({n+\frac{n^2}{10}}\right)^{5.52}*\left({n^{Max(0,n-15)}}\right)*10^6\right\rfloor$$

其中：$adjustedLevel = n+\frac{n^2}{10}$；$post15Scaling = n^{Max(0,n-15)}$。起始成本为 $1.69\text{e}6~(1.69~\text{M})$，末次（升到 25 级）成本为 $1.37\text{e}18~(1.37~\text{Qt})$，最大等级 $25$。

下表列出各等级时 3 种升级的成本。原文此表为可折叠表格（mw-collapsible），译文保留全部 25 行。

| 所需等级 | 升级成本（Level Cost） | 追忆成本 | 碎裂成本 |
| --- | --- | --- | --- |
| 1 | 初始（Default） | $1,000~(1.00\text{e}3;~1.00~\text{K})$ | $5,000~(5.00\text{e}3;~5.00~\text{K})$ |
| 2 | $1,692,340~(1.69\text{e}6;~1.69~\text{M})$ | $5,000~(5.00\text{e}3;~5.00~\text{K})$ | $125,000~(1.25\text{e}5;~125.00~\text{K})$ |
| 3 | $125,535,354~(1.26\text{e}8;~125.54~\text{M})$ | $25,000~(2.50\text{e}4;~25.00~\text{K})$ | $3,125,000~(3.13\text{e}6;~3.13~\text{M})$ |
| 4 | $1,830,950,616~(1.83\text{e}9;~1.83~\text{B})$ | $125,000~(1.25\text{e}5;~125.00~\text{K})$ | $78,125,000~(7.81\text{e}7;~78.13~\text{M})$ |
| 5 | $13,489,563,879~(1.35\text{e}10;~13.49~\text{B})$ | $625,000~(6.25\text{e}5;~125.00~\text{K})$（原文如此） | $1,953,125,000~(1.95\text{e}9;~1.95~\text{B})$ |
| 6 | $67,660,962,880~(6.77\text{e}10;~67.66~\text{B})$ | $3,125,000~(3.13\text{e}6;~3.13~\text{M})$ | $48,828,125,000~(4.88\text{e}10;~48.83~\text{B})$ |
| 7 | $264,324,370,371~(2.64\text{e}11;~264.32~\text{B})$ | $15,625,000~(1.56\text{e}7;~15.63~\text{M})$ | $1,220,703,125,000~(1.22\text{e}12;~1.22~\text{T})$ |
| 8 | $865,006,213,087~(8.65\text{e}11;~865.01~\text{B})$ | $78,125,000~(7.81\text{e}7;~78.13~\text{M})$ | $30,517,578,125,000~(3.05\text{e}13;~30.52~\text{T})$ |
| 9 | $2,478,340,399,379~(2.48\text{e}12;~2.48~\text{T})$ | $390,625,000~(3.91\text{e}8;~390.63~\text{M})$ | $762,939,453,125,000~(7.63\text{e}14;~762.94~\text{T})$ |
| 10 | $6,399,389,278,661~(6.40\text{e}12;~6.40~\text{T})$ | $1,953,125,000~(1.95\text{e}9;~1.95~\text{B})$ | $19,073,486,328,125,000~(1.91\text{e}16;~19.07~\text{Qa})$ |
| 11 | $15,194,470,701,802~(1.52\text{e}13;~15.19~\text{T})$ | $9,765,625,000~(9.77\text{e}9;~9.77~\text{B})$ | $476,837,158,203,125,000~(4.77\text{e}17;~476.84~\text{Qa})$ |
| 12 | $33,661,861,517,675~(3.37\text{e}13;~33.67~\text{T})$ | $48,828,125,000~(4.88\text{e}10;~48.83~\text{B})$ | —（已满） |
| 13 | $70,348,311,234,460~(7.03\text{e}13;~70.35~\text{T})$ | $244,140,625,000~(2.44\text{e}11;~244.14~\text{B})$ | —（已满） |
| 14 | $139,863,682,778,993~(1.40\text{e}14;~139.86~\text{T})$ | $1,220,703,125,000~(1.22\text{e}12;~1.22~\text{T})$ | —（已满） |
| 15 | $266,313,272,425,972~(2.66\text{e}14;~266.31~\text{T})$ | $6,103,515,625,000~(6.10\text{e}12;~6.10~\text{T})$ | —（已满） |
| 16 | $488,261,631,380,653~(4.88\text{e}14;~488.26~\text{T})$ | $30,517,578,125,000~(3.05\text{e}13;~30.52~\text{T})$ | —（已满） |
| 17 | $1,298,633,028,213,176~(1.30\text{e}15;~1.30~\text{Qa})$ | $152,587,890,625,000~(1.53\text{e}14;~152.59~\text{T})$ | —（已满） |
| 18 | $3,352,652,506,357,979~(3.35\text{e}15;~3.35~\text{Qa})$ | $762,939,453,125,000~(7.63\text{e}14;~762.94~\text{T})$ | —（已满） |
| 19 | $8,427,336,555,943,238~(8.43\text{e}15;~8.43~\text{Qa})$ | $3,814,697,265,625,000~(3.81\text{e}15;~3.81~\text{Qa})$ | —（已满） |
| 20 | $20,678,634,731,677,324~(2.07\text{e}16;~20.68~\text{Qa})$ | $19,073,486,328,125,000~(1.91\text{e}16;~19.07~\text{T})$[^ra-typo] | —（已满） |
| 21 | $49,642,220,284,231,930~(4.96\text{e}16;~49.64~\text{Qa})$ | $95,367,431,640,625,000~(9.54\text{e}16;~95.37~\text{T})$[^ra-typo] | —（已满） |
| 22 | $116,819,303,142,108,450~(1.17\text{e}17;~116.824~\text{Qa})$ | $476,837,158,203,125,000~(4.77\text{e}17;~476.84~\text{Qa})$ | —（已满） |
| 23 | $269,922,999,820,727,520~(2.70\text{e}17;~269.92~\text{Qa})$ | —（已满） | —（已满） |
| 24 | $613,288,294,167,283,000~(6.13\text{e}17;~613.29~\text{Qa})$ | —（已满） | —（已满） |
| 25 | $1,371,990,195,470,548,700~(1.37\text{e}18;~1.37~\text{Qt})$ | —（已满） | —（已满） |

[^ra-typo]: 译注：原文此处把 $1.91\text{e}16$、$9.54\text{e}16$ 的数值后缀写作 T，按同表记数法约定应为 Qa；原文把 $9.54\text{e}16$ 写为 95.37 T，换算应为 95.37 Qa。此处忠实保留原文并标注，不作静默修改。

### 追忆

所有天神等级合计达到 $20$ 级即可解锁追忆（Remembrance），允许玩家指定某一位天神，在太阳神的现实内使其记忆碎片获取变为 $\times5$，代价是其他天神的碎片获取减半。当玩家把特蕾莎升到 $8$ 级、解锁鹿颈长的记忆后，追忆才会显示出来。把全部天神都升到 $25$ 级会禁用并隐藏该机制。

### 可解锁的机制

把某位天神升到特定等级还会为其或全局解锁新机制：

- **特蕾莎**：在 $2$ 级解锁[充能无限升级](/player/original/ow-infinity-upgrades)，使公式变强许多。在 $10$ 级时，一旦玩家的符文献祭值达到特定阈值，就会强化某些符文效果。
- **鹿颈长**：在 $2$ 级解锁[符文炼金](https://antimatterdimensions.wiki.gg/wiki/Glyph_Alchemy)，之后还会让鹿颈长符文更强，并逐步移除符文生成中几乎全部的随机因素。
- **无名氏**：在 $10$ 级解锁脉冲机制，黑洞每 $5$ 个 tick 自动释放玩家储存的游戏时间的一部分。
- **薇**：在 $6$ 级解锁[三体研究](/player/original/ow-time-studies)，它消耗空间之理，且要求先购买 3 个相邻研究才能购买。此外，[困难薇成就](/player/original/ow-v)会随诅咒符文与反转黑洞一同解锁，这两者正是完成困难薇成就所需。

## 里程碑

四位天神各有 7 个里程碑[^ra-milestone-name]，在把对应天神升到特定等级后解锁。里程碑分别在 1、2、5、8 级（薇为 6 级）、10、15、25 级解锁。

所有 5 级里程碑都会让记忆碎片按不同因子产出更多记忆，8 级里程碑则解锁下一位天神。

[^ra-milestone-name]: 原文脚注：内容摘要里把这套功能称作「升级（upgrades）」，尽管它们的结构更像里程碑。

| ID（名称） | 图标 | 等级 | 描述 | 效果 / 其它细节 | ID（编号） |
| --- | --- | --- | --- | --- | --- |
| **特蕾莎的记忆解锁** |  |  |  |  |  |
| autoTP | 原子 | 1 | 时间膨胀处于激活状态时立即给予[速子粒子](/player/original/ow-dilation) |  | 0 |
| chargedInfinityUpgrades | 无限 | 2 | 解锁[充能无限升级](/player/original/ow-infinity-upgrades)；每 2 级增加 1 个可充能上限 | 玩家在 24 级时可以给全部 12 个可充能无限升级充能 | 1 |
| teresaXP | Ϟ | 5 | 所有记忆碎片按[现实机器](/player/original/ow-reality)数量产出更多记忆 | $1+\sqrt{\frac{\log_{10}({RM})}{100}}$；移动版对该里程碑使用不同图标（Δ） | 2 |
| effarigUnlock | Ϙ | 8 | 解锁鹿颈长的记忆 |  | 4 |
| alteredGlyphs | 闪电 | 10 | 解锁[改造符文（Altered Glyphs）](https://antimatterdimensions.wiki.gg/wiki/Glyphs#Glyph_Sacrifice)，按符文献祭为符文赋予新效果 |  | 3 |
| perkShopIncrease | 流程图 | 15 | 提高[特蕾莎复兴点数商店](/player/original/ow-teresa)的购买上限 |  | 5 |
| unlockDilationStartingTP | 圆点圈 | 25 | 在非天神现实中，按「在膨胀中达到全部反物质平方根」的水平获得速子粒子；任何 TP 获取乘数都会追溯生效，即使在膨胀之外 |  | 6 |
| **鹿颈长的记忆解锁** |  |  |  |  |  |
| extraGlyphChoicesAndRelicShardRarityAlwaysMax | 横排握把 | 1 | 符文选择项 $\times2$，且[遗迹碎片](/player/original/ow-effarig)提供的符文稀有度加成始终为最大值 | 该升级的 ID 名称最长，共 45 个字符 | 7 |
| unlockGlyphAlchemy | 药瓶 | 2 | 解锁[符文炼金](https://antimatterdimensions.wiki.gg/wiki/Glyph_Alchemy)，通过精炼符文提升炼金资源；随鹿颈长等级解锁更多资源。入口位于新的现实页签 |  | 8 |
| effarigXP | 克隆 | 5 | 所有记忆碎片按最高符文等级产出更多记忆 | $1+\frac{GlyphLevel_{Best}}{7000}$ | 9 |
| enslavedUnlock | 链接 | 8 | 解锁无名氏的记忆 |  | 11 |
| glyphEffectCount | 盲文点阵 | 10 | 符文始终拥有 4 个效果，鹿颈长符文最多可有 7 个 |  | 10 |
| relicShardGlyphLevelBoost | 火焰 | 15 | 按获得的遗迹碎片提高符文等级 | $100*\log_{10}\left(Max\left({RS_{Gained}},1\right)\right)^2$ | 12 |
| maxGlyphRarityAndShardSacrificeBoost | 安卡 | 25 | 符文生成时始终为 $100\%$ 稀有度；符文献祭获取按遗迹碎片提升到某个幂 | $1*\frac{5*\log_{10}\left(\log_{10}\left(RS+10\right)\right)}{100}$ | 13 |
| **无名氏的记忆解锁** |  |  |  |  |  |
| blackHolePowerAutobuyers | 圆环 | 1 | 解锁[黑洞](/player/original/ow-black-hole)强度升级自动购买器 |  | 14 |
| improvedStoredTime | 时钟历史 | 2 | [储存的游戏时间](/player/original/ow-nameless-ones)被放大，且可储存更多[现实时间](/player/original/ow-nameless-ones)；随无名氏等级提高 | 游戏时间放大：$20^{Level}$，25 级时为 $\times3.36\text{e}32~(335.54~\text{No})$；现实时间上限每级 +1 小时，最多 +25 小时 | 15 |
| enslavedXP | 秒表 | 5 | 所有记忆碎片按总游玩时长产出更多记忆 | $1+\frac{\log_{10}\left(Milliseconds\right)}{200}$ | 16 |
| vUnlock | ⌬ | 8 | 解锁薇的记忆 |  | 18 |
| autoPulseTime | 扩张箭头 | 10 | 黑洞充能只使用 $99\%$ 的游戏速度；每 5 个 tick 自动释放 $1\%$ 的储存游戏时间 | 降低更新频率会让黑洞「脉冲」更快，提高则更慢 | 17 |
| peakGamespeedDT | 转速表 | 15 | 按每个现实的游戏速度峰值获得更多膨胀时间 | $Max\left(\left(\log_{10}\left(GameSpeed_{Peak}\right)-90\right)^3,1\right)$ | 19 |
| allGamespeedGlyphs | 时钟 | 25 | 所有基础符文都获得时间符文的游戏速度效果，时间符文则获得一项额外效果 |  | 20 |
| **薇的记忆解锁** |  |  |  |  |  |
| instantECAndRealityUpgradeAutobuyers | 同步 | 1 | 可重复购买的[现实升级](/player/original/ow-reality-upgrades)自动购买，[自动永恒挑战](/player/original/ow-eternity-challenges)瞬时完成 |  | 21 |
| autoUnlockDilation | 快进 | 2 | 在非天神现实中，达到 $12,900$ 时间之理时自动免费解锁时间膨胀 |  | 22 |
| vXP | 书 | 5 | 所有记忆碎片按天神等级总和产出更多记忆 | $1+\frac{RaLevels_{Total}}{50}$ | 23 |
| unlockHardV | 奖杯 | 6 | 解锁[困难薇成就](/player/original/ow-v)，并每 6 级解锁一个[三体研究](/player/original/ow-time-studies)；三体研究位于时间研究页底部 | 三体研究分别在薇的 6、12、18、24 级解锁。解锁时，诅咒符文与黑洞反转也会开放，它们是完成困难薇成就的关键 | 24 |
| continuousTTBoost | 大学 | 10 | 时间之理加成所有形式的「连续非维度产出」 | 见下表（原文折叠块）；TT 效果从 $\text{e}350$ 开始，在 $\text{e}850$ 封顶 | 25 |
| achievementTTMult | 学士帽 | 15 | [成就乘数](https://antimatterdimensions.wiki.gg/wiki/Achievements)作用于时间之理产出 |  | 26 |
| achievementPower | 图层组 | 25 | 成就乘数取 $^{1.5}$ 次方 | 游戏内该图标使用 buffer，但本站图标插件无法渲染，故改用相近的 layer-group | 27 |

### continuousTTBoost 的详细效果

设 $TheoremBoostFactor = Min\left(10,\frac{Max\left(0,~\log_{10}\left({TT}\right)-350\right)}{50}\right)$，则：

| 资源 | 公式 |
| --- | --- |
| $TT_{Gen}$ | $10^{5*{TheoremBoostFactor}}$ |
| $Eternities$ | $10^{2*{TheoremBoostFactor}}$ |
| $Infinities$ | $10^{15*{TheoremBoostFactor}}$ |
| $Replicanti_{Speed}$ | $10^{20*{TheoremBoostFactor}}$ |
| $DT$ | $10^{3*{TheoremBoostFactor}}$ |
| $Memories,~Memory Chunks$ | $1+\frac{TheoremBoostFactor}{50}$ |
| $IP/EP/RM_{Passive}$ | $1+2.4*{TheoremBoostFactor}$ |

封顶后的效果：

- TT 产出：$\times\text{e}50$
- 永恒次数：$\times\text{e}20~(100~\text{Qt})$
- 无限次数：$\times\text{e}150$
- 复制器速度：$\times\text{e}200$
- DT：$\times\text{e}30~(1~\text{No})$
- 记忆与碎片：$\times1.2$
- 被动 IP/EP/RM 获取：$\times25$

## 琐事

- 太阳神的名字是 Razenpok 的缩写[^ra-name]，他曾作为技术架构师参与《反物质维度》的开发。
  - 该名字也来自古埃及神话中的太阳神拉（Ra）。
- 太阳神对其他天神一无所知，因此请玩家帮忙「记住他们」以换取力量，却并不知道他们过去的所作所为正是导致自己遗忘一切的原因。（原文编辑注：此条暂列于琐事区。）
- 在现实更新的开发过程中（2019 年前后的某个时间），无名氏曾有一个由太阳神解锁的机制，效果类似时间膨胀，名为「时间压缩（Time Compression）」。该机制最终因与其他内容的平衡性和可用性不兼容而被废弃[^ra-devlog12]。

[^ra-name]: 原文参考资料：AD 开发日志第 4 篇 <https://cyip92.github.io/site/#/ADdevlog/4>（外部链接，未转载内容）。
[^ra-devlog12]: 原文参考资料：AD 开发日志第 12 篇 <https://cyip92.github.io/site/#/ADdevlog/12>（外部链接，未转载内容）。

### 脚注

原文脚注已并入上方「里程碑」节。

### 参考资料

原文此节仅含上述琐事引用的开发日志链接；译文以脚注形式保留。

## 来源与许可

- 原文：[Ra](https://antimatterdimensions.wiki.gg/index.php?title=Ra&oldid=3387)（页面 ID 914；修订 ID 3387；最后编辑者 KrutarMarsons；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Ra&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文与全部表格，统一术语，把信息框内容改写为要点表，把模板内折叠块与 Tabber 内容展开为表格/列表、模板脚注改为页内脚注，用文字描述替代 FontAwesome 图标，移除导航模板与模板结构，图片未转载；本页按相同许可共享。
- 原文图片未转载：原页含天神静态图（Cel5-runreality-static--desktop.png）、动画（Cel5-runreality-active--desktop.gif）、导航图（Cel5-navigation-complete--desktop.png）、界面图（Cel5-interface--darktheme-desktop.png）与被废弃功能的截图（Cel5-compression-scrapped--lightmode-desktop.png）。原图注含义：「身处太阳神的现实之中」「太阳神的完整界面」「开发日志中时间压缩功能的截图」。请到原页查看图片。

## 相关条目

[天神](/player/original/ow-celestials) · [薇](/player/original/ow-v) · [无名氏](/player/original/ow-nameless-ones) · [鹿颈长](/player/original/ow-effarig) · [特蕾莎](/player/original/ow-teresa) · [莱特拉](/player/original/ow-laitela)
