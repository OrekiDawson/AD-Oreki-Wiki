---
title: "原版:复兴"
description: "原版 Wiki《Perks》条目的简体中文翻译：复兴树 48 个节点、家族、前置关系、效果与自动化点数"
tags:
  - 原版Wiki翻译
  - 现实
original_title: "Perks"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Perks"
original_revid: 3354
original_fetched_at: "2026-11-16T01:05:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-perks"
---

**复兴（Perks）**与[现实](/player/original/ow-reality)同时解锁，是一张以便利、自动化与阶段加速为主的升级树；其中少数节点也会直接改善开局资源或倍率。

点数来自每次现实重置，花在树的节点上，起点是 START。

和[时间研究](/player/original/ow-time-studies)一样，复兴树可以缩放，桌面版还支持拖动节点、切换布局、开关物理效果、拉直连线、以 START 居中等等，共七种布局（其中一种要解锁隐藏主题）。

## 树的结构

只能买与已拥有节点**直接相邻**的节点；连接是无向的，树里也有环路，因此可以沿两个方向推进。与时间研究不同，**选择是永久的，不能重洗**。

节点有圆形与菱形两种。菱形节点在正常效果之外还会给[自动机](https://antimatterdimensions.wiki.gg/wiki/Automation)点数。不同节点颜色不同，大致对应它主要影响的家族。所有节点都只要 1 点复兴点数。游戏内共 48 个节点，其中 21 个给自动机点数。

| 节点 | 内部 ID | 家族 | 原页列出的相邻节点 | 描述 | AP | 其它细节 | 编号 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| START | firstPerk | 现实 | SAM, ACH1, EC5R, EU1 | 移除现实研究的成就要求，并允许在现实时从 4 枚符文中挑选 |  |  | 0 |
| SAM | startAM | 反物质 | SIP1, ANR | 每次重置都以 5e130 反物质开局 |  |  | 10 |
| SIP1 | startIP1 | 无限 | IDAS, SIP2, SEP1 | 每次永恒与每次现实都以 $5\text{e}15~(5~\text{Qa})$ 无限点数开局 |  |  | 12 |
| SIP2 | startIP2 | 无限 | REPAS, IDR | 每次永恒与每次现实都以 5e130 无限点数开局 |  |  | 13 |
| SEP1 | startEP1 | 永恒 | SIP1, SEP2, ANR, STP | 每次现实都以 10 永恒点数开局 | 5 |  | 14 |
| SEP2 | startEP2 | 永恒 | SEP3 | 每次现实都以 $5\text{e}3~(5~\text{K})$ 永恒点数开局 |  |  | 15 |
| SEP3 | startEP3 | 永恒 | — | 每次现实都以 $5\text{e}9~(5~\text{B})$ 永恒点数开局 | 10 |  | 16 |
| STP | startTP | 膨胀 | SEP1, TP1 | 解锁膨胀后获得 10 超光速粒子 | 5 | 无名氏的现实里改为只给 1 超光速粒子；简短说明可能仍显示原有数值 | 17 |
| ANR | antimatterNoReset | 反物质 | SEP1 | 维度提升与反物质星系不再重置反物质、反物质维度、计数频率与维度献祭 |  |  | 30 |
| PASS | studyPassive | 永恒 | EC1R | 把时间研究 122 强化到 $\times50$ 永恒点数、时间研究 142 强化到 $\times\text{e}50$ 无限点数；时间研究 132 还会让复制器快 3 倍 |  | 被毁灭的现实中不提供时间研究 132 的复制器加速 | 31 |
| EU1 | autounlockEU1 | 永恒 | EU2 | 拥有永恒次数后，自动免费解锁永恒升级第一行 |  |  | 40 |
| EU2 | autounlockEU2 | 永恒 | EU1, DAU | 第二行永恒升级按原价的 $\times\text{e}10~(10~\text{B})$ 分之一自动购买 |  |  | 41 |
| DU1 | autounlockDilation1 | 膨胀 | DU2 | 解锁膨胀后，自动免费解锁膨胀升级第二行 |  |  | 42 |
| DU2 | autounlockDilation2 | 膨胀 | ATT | 解锁膨胀后，自动免费解锁膨胀升级第三行 |  |  | 43 |
| ATT | autounlockDilation3 | 膨胀 | DAS, ATD | 能负担时自动购买「被动产出时间之理」的膨胀升级 | 5 |  | 44 |
| ATD | autounlockTD | 膨胀 | REAL | 能负担时自动解锁时间维度 5–8 | 5 |  | 45 |
| REAL | autounlockReality | 现实 | — | 拥有 e4,000 永恒点数且解锁时间维度 8 后，自动解锁现实 | 10 |  | 46 |
| IDR | bypassIDAntimatter | 无限 | — | 无限维度不再有反物质要求 |  |  | 51 |
| TGR | bypassTGReset | 膨胀 | TP1, DAU | 第 2 项可重复膨胀升级不再重置膨胀时间 |  |  | 52 |
| DILR | bypassECDilation | 膨胀 | — | 移除时间膨胀解锁中的永恒挑战 11、12 与时间之理总量要求 | 5 |  | 53 |
| EC1R | bypassEC1Lock | 永恒 | EC2R, EC3R, ECR | 移除时间研究 181 的永恒挑战 1 要求 |  |  | 54 |
| EC2R | bypassEC2Lock | 永恒 | EC1R | 移除时间研究 181 的永恒挑战 2 要求 |  |  | 55 |
| EC3R | bypassEC3Lock | 永恒 | EC1R | 移除时间研究 181 的永恒挑战 3 要求 |  |  | 56 |
| EC5R | bypassEC5Lock | 永恒 | ACT, PASS, IDL | 移除时间研究 62 的永恒挑战 5 要求 |  |  | 57 |
| PEC1 | autocompleteEC1 | 自动化 | PEC2 | 每 60 分钟（现实时间）自动完成一个永恒挑战；按顺序完成，需先满完成前一个 | 5 |  | 60 |
| PEC2 | autocompleteEC2 | 自动化 | PEC3 | 每 40 分钟自动完成一个（减少 20 分钟） |  |  | 61 |
| PEC3 | autocompleteEC3 | 自动化 | — | 每 20 分钟自动完成一个（再减少 20 分钟） | 10 |  | 62 |
| ACT | studyActiveEP | 永恒 | TTS, EC2R | 主动路径乘数始终取最大值 |  |  | 70 |
| IDL | studyIdleEP | 永恒 | PEC1, EC3R | 闲置路径乘数从「本次无限/永恒已过 15 分钟」开始算 |  |  | 71 |
| ECR | studyECRequirement | 永恒 | ECB | 移除解锁永恒挑战的非时间之理要求 | 10 |  | 72 |
| ECB | studyECBulk | 永恒 | — | 达到更高完成档的目标时可一次完成多档永恒挑战 | 15 |  | 73 |
| TP1 | retroactiveTP1 | 膨胀 | STP, TGR, TP2 | 购买第 3 项可重复膨胀升级时，当前超光速粒子 ×1.5 |  |  | 80 |
| TP2 | retroactiveTP2 | 膨胀 | TP3 | 购买第 3 项可重复膨胀升级时，当前超光速粒子 ×2 |  |  | 81 |
| TP3 | retroactiveTP3 | 膨胀 | TP4 | 购买第 3 项可重复膨胀升级时，当前超光速粒子 ×2.5 |  |  | 82 |
| TP4 | retroactiveTP4 | 膨胀 | — | 购买第 3 项可重复膨胀升级时，当前超光速粒子 ×3 | 10 |  | 83 |
| DAU | autobuyerDilation | 自动化 | DAB, DILR, DU1, TGR, EU2 | 解锁可重复膨胀升级的自动购买器 | 5 |  | 100 |
| IDAS | autobuyerFasterID | 自动化 | — | 无限维度自动购买器快 $\times3$ | 5 |  | 101 |
| REPAS | autobuyerFasterReplicanti | 自动化 | — | 复制器自动购买器快 $\times3$ | 5 |  | 102 |
| DAS | autobuyerFasterDilation | 自动化 | — | 膨胀升级自动购买器快 $\times3$ | 5 |  | 103 |
| TTS | ttBuySingle | 自动化 | TTF | 解锁每 tick 购买单个时间之理的时间之理自动购买器 | 5 |  | 104 |
| TTF | ttFree | 自动化 | TTM | 购买时间之理不再消耗反物质、无限点数或永恒点数 |  |  | 105 |
| TTM | ttBuyMax | 自动化 | — | 把时间之理自动购买器升级为「买满」 | 5 |  | 106 |
| DAB | dilationAutobuyerBulk | 自动化 | — | 膨胀升级自动购买器一次购买三倍的膨胀升级 | 5 | 2024-04-26 Android 3.3.0 与 2024-05-02 桌面「庆祝 Android 现实更新」加入；迄今唯一不属于现实更新首发内容的 Perk | 107 |
| ACH1 | achievementGroup1 | 成就 | ACH2 | 成就计时降到每个 20 分钟（减少 10 分钟） | 5 |  | 201 |
| ACH2 | achievementGroup2 | 成就 | ACH3 | 成就计时降到每个 12 分钟（减少 8 分钟） |  |  | 202 |
| ACH3 | achievementGroup3 | 成就 | ACH4 | 成就计时降到每个 6 分钟（减少 6 分钟） |  |  | 203 |
| ACH4 | achievementGroup4 | 成就 | ACHNR | 成就计时降到每个 2 分钟（减少 4 分钟） |  |  | 204 |
| ACHNR | achievementGroup5 | 成就 | — | 立即解锁前 13 行成就，且现实不再重置它们 | 10 |  | 205 |

“相邻节点”按原页每组列出的连接方向整理。复兴图本身是无向的：如果 A 出现在 B 的相邻节点中，A 与 B 也可以互相作为购买前置；只需其中任意一个节点已经拥有即可解锁。表中的“—”表示该节点没有向外的附加连线，例如 ACHNR 仍可通过 ACH4 购买。

## 布局与主题截图

原站此节是纯图库，**图片未转载**，只列图注：

- 桌面版布局：默认（已拉直）、随机位置、Android 布局、方形、横向网格、按与 START 的距离、Blob（隐藏布局）；
- 其它：盲文主题（Blind）下的复兴树、设计主题（Design）下的复兴树。

## 琐事

- 编号 51–57 的节点在内部键名里以 bypass 开头，但实际名字都加后缀「R」，大概是 Remove（移除）的缩写。
- 买齐所有菱形节点共可得 150 自动机点数。
- 只有反物质与无限两个家族没有菱形节点。
- 桌面版复兴树的背景是透明的。
- 桌面版复兴树的视觉在所有主题下保持一致，只有两个例外：设计主题会在进入页签时改变所有节点尺寸，且除缩放外交互时会快速波动；盲文主题会移除所有连线，若开启了编号显示也会隐藏编号。
- 桌面版的复兴树用 [vis.js 的 Vis Network](https://visjs.github.io/vis-network/docs/network/) 渲染——一个浏览器端的动态可视化库，拖动节点正是它提供的。

## 来源与许可

- 原文：[Perks](https://antimatterdimensions.wiki.gg/index.php?title=Perks&oldid=3354)（修订 ID 3354；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Perks&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：翻译正文与 48 行节点表、把节点图标改为中文节点名、依据官方源码澄清无向相邻关系与部分游戏内术语、图库改为图注列表、界面图未转载；本页按相同许可共享。
- 原文图片未转载：原页含桌面深色/浅色与移动版复兴树截图、七种布局截图与两个主题截图，此处仅保留文字说明。
- 原文脚注说明「七种布局中一种锁在隐藏主题后」；译注：桌面版的节点拖拽依赖 vis.js 实现。
- 源码核对：[复兴树 vis-network 渲染入口](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/91d5bed01509cd730a3158075c9b05c19a7a3260/src/components/tabs/perks/PerksTab.js#L1)（提交 `91d5bed01509cd730a3158075c9b05c19a7a3260`，2026-11-24 核对）。

## 相关条目

[现实](/player/original/ow-reality) · [现实升级](/player/original/ow-reality-upgrades) · [自动机](https://antimatterdimensions.wiki.gg/wiki/Automation) · [黑洞](/player/original/ow-black-hole) · [时间研究](/player/original/ow-time-studies)
