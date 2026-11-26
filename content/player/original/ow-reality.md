---
title: "现实"
description: "原版 Wiki《Reality》条目的简体中文翻译：现实怎么解锁、重置什么、现实机器公式与符文等级怎么算"
tags:
  - 原版Wiki翻译
  - 现实
original_title: "Reality"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Reality"
original_revid: 3235
original_fetched_at: "2026-11-26T19:12:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-reality"
---

现实是游戏第三个、也是最后一个主要威望层。买下最后一项[时间研究](/player/original/ow-time-studies)「解锁现实」后开启；这项研究要求已购买第 8 时间维度、本次现实达到 $\text{e}4,000$ [永恒点数](/player/original/ow-eternity)，并完成前 13 行[成就](https://antimatterdimensions.wiki.gg/wiki/Achievements)。取得资格后，每执行一次新现实，此前攒下的大部分进度都会归零，换来现实机器、一枚符文和一个复兴点数。

第一次完成现实重置时，游戏同时开放[符文](https://antimatterdimensions.wiki.gg/wiki/Glyphs)、[现实升级](/player/original/ow-reality-upgrades)与复兴；[黑洞](/player/original/ow-black-hole)和自动机也会出现，但要另外满足条件才能完整使用。买下「解锁现实」研究后，玩家可以先看到现实页签和它的前三个子页签；黑洞与自动机页签要等第一次现实结算后才亮起。

这个层是「现实更新」带来的。那次更新是桌面版最后一块主要内容，前后做了四年半，2022 年 12 月 17 日与 Steam 版同步上线网页版，2024 年 4 月 1 日移植到 Android。

## 重置

现实会把永恒及以下的东西全部清掉，货币、挑战完成记录都在其中。和前两个威望层不同的是，玩家还要交出[前 13 行成就](https://antimatterdimensions.wiki.gg/wiki/Achievements)及其奖励。统计页签「通用」里的数据、以及所有最佳挑战用时则不受影响；所有旧页签仍然可以点开，即使对应功能重新被锁。

重置的收益通常按最高永恒点数换算成现实机器，再附上一枚自选符文和 $1$ 个复兴点数。第一次现实例外：只给一枚固定 $20\%$ 稀有度、只带反物质维度威力效果的威力符文，外加一枚「同伴符文」——它记录的是玩家在第一次现实里达到的永恒点数。

完成第一次现实后，符文页签会多出「重新开始当前现实」的选项，把玩家送回本次现实的起点。它不发放正常新现实的奖励，已选定的符文也不会变。

## 现实机器

现实机器是这一层的主要货币，[现实升级](/player/original/ow-reality-upgrades)和[黑洞](/player/original/ow-black-hole)都要用它买。数量取决于当前现实中达到的最高永恒点数，并把你永恒时本应获得的永恒点数一并算进去。换算有三条公式，用哪条看当前处境：

- 线性段（$1-10$ RM）：$\left\lfloor\frac{27}{4,000}\log_{10}(EP)-26\right\rfloor$
- 指数段（$>10$ RM）：$\left\lfloor1,000^{\frac{\log_{10}(EP)}{4,000}-1}\right\rfloor$
- 首次现实的缩减段（$\text{e}6,000$ EP 以上）：$\left\lfloor1,000^{\frac{\log_{10}(EP)-0.75\left(\log_{10}(EP)-6,000\right)}{4,000}-1}\right\rfloor$

开局前 10 个现实机器落在 $1.00\text{e}4,000$ 到 $2.15\text{e}5,333$ EP 之间，走线性；过了 10 RM 改走指数式。指数式在 $2.15\text{e}5,333$ EP 之后反超线性式。缩减只在第一次现实生效：$\text{e}6,000$ EP 以上开始打折，$\text{e}8,000$ EP 封顶，这是现实更新为平衡难度顺手加的——同一时期时间维度的成本成长也被调高了。按这条公式，$\text{e}6,000$ EP 给 $31$ RM，$\text{e}8,000$ EP 给 $74$ RM。

现实机器的基础硬上限是 $\text{e}1,000$，部分[虚幻升级](/player/original/ow-imaginary-upgrades)可以继续提高它；一次现实能结算的数量不会超过当时的上限。现实机器已经到达上限后，游戏开始积攒**虚幻机器（Imaginary Machines，iM）**。虚幻机器不会在现实结算时直接增加，而是逐秒逼近当前产出上限；默认情况下，每 60 秒把“上限与当前数量之差”缩小一半。相关升级可以改变这个速度。

| 线性成长（1–10 RM）：RM | 对应 EP             | 指数成长（>10 RM）：RM | 对应 EP             | 缩减成长（首次现实 >e6,000 EP）：EP | RM   |
| ----------------------- | ------------------- | ---------------------- | ------------------- | ----------------------------------- | ---- |
| $1$                     | $1.00\text{e}4,000$ | $20$                   | $5.09\text{e}5,734$ | $\text{e}6,000$                     | $31$ |
| $2$                     | $1.41\text{e}4,148$ | $30$                   | $3.13\text{e}5,969$ | $\text{e}6,250$                     | $35$ |
| $3$                     | $1.98\text{e}4,296$ | $40$                   | $1.20\text{e}6,136$ | $\text{e}6,500$                     | $39$ |
| $4$                     | $2.78\text{e}4,444$ | $50$                   | $1.96\text{e}6,265$ | $\text{e}6,750$                     | $43$ |
| $5$                     | $3.91\text{e}4,592$ | $60$                   | $7.38\text{e}6,370$ | $\text{e}7,000$                     | $48$ |
| $6$                     | $5.50\text{e}4,740$ | $70$                   | $1.35\text{e}6,460$ | $\text{e}7,250$                     | $54$ |
| $7$                     | $7.74\text{e}4,888$ | $80$                   | $2.84\text{e}6,537$ | $\text{e}7,500$                     | $60$ |
| $8$                     | $1.09\text{e}5,037$ | $90$                   | $4.54\text{e}6,605$ | $\text{e}7,750$                     | $67$ |
| $9$                     | $1.53\text{e}5,185$ | $100$                  | $4.64\text{e}6,666$ | $\text{e}8,000$                     | $74$ |
| $10$                    | $2.15\text{e}5,333$ | $1,000$                | $1.00\text{e}8,000$ | RM 封顶于 $74$                      |      |

## 符文等级

符文有等级，等级由几项因素决定，而且越往后越复杂——买了现实升级「Measure of Forever」之后，永恒次数也会参与计算。初始的三项因素是永恒点数、[复制器](/player/original/ow-replicanti)与[膨胀时间](https://antimatterdimensions.wiki.gg/wiki/Dilated_Time)，取玩家在当前现实中达到的最高值，最低 1 级。至于符文的类型、效果和稀有度，那就纯看运气了。

## 自动成就

现实把前 13 行[成就](https://antimatterdimensions.wiki.gg/wiki/Achievements)收走之后，游戏用「自动成就」来补偿：每过一段基础间隔（30 分钟），下一个未完成的成就会被被动点亮。计时器可以关；关掉后它会一直倒计时到零并停住，再打开就立刻完成一个。离线时计时照走，速度还能靠复兴节点再提。

买下 ACHNR 复兴节点之后这套机制就退休了：所有现实之前的成就永久保留，成就页签里相关按钮与说明也随之消失。

下表列出各复兴节点下的间隔，以及刷完前 13 行成就的最长时间。因为现实保留通用统计与最佳挑战用时，成就 22、65、74、76、97、112 会在现实重置后直接解锁。

| 复兴节点                                                                                                                                                        | 无       | ACH1     | ACH2     | ACH3    | ACH4    | ACHNR |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- | -------- | ------- | ------- | ----- |
| 间隔                                                                                                                                                            | 30:00    | 20:00    | 12:00    | 6:00    | 2:00    | 立即  |
| 最长时间（无 Existentially Prolong）                                                                                                                            | 49:00:00 | 32:40:00 | 19:36:00 | 9:48:00 | 3:16:00 |       |
| 最长时间（有 Existentially Prolong；成就 41、47、48、51、52、53、61 因[永恒里程碑](https://antimatterdimensions.wiki.gg/wiki/Eternity_Milestones)在现实中保留） | 45:30:00 | 30:40:00 | 18:12:00 | 9:06:00 | 3:02:00 |       |

## 琐事

- 「Reality」这个名字可能来自《反物质维度》官方 Discord 的一个高级身份组「Reality Dimension」。该身份组 2017 年 12 月 14 日就建好了，比现实更新及其内容公布早了整整一年多。
- 三个威望层里，现实的唯一主要货币不以「Points」结尾。
- 现实的解锁条件也是三层中唯一不是 $1.80\text{e}308$ [反物质](/player/original/ow-antimatter-dimensions)或[无限点数](/player/original/ow-infinity)的那个。

## 来源与许可

- 原文：[Reality](https://antimatterdimensions.wiki.gg/index.php?title=Reality&oldid=3235)（修订 ID 3235；最后编辑者 KrutarMarsons；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Reality&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：翻译正文与表格、统一术语、移除导航模板与信息框及缩略图、图片未转载；本页按相同许可共享。
- 译者注：原文把符文、现实升级、复兴、黑洞与自动机作为子模板整页嵌入；这里只保留主线正文与入口说明，子系统的完整内容留给各自条目。

## 相关条目

[永恒](/player/original/ow-eternity) · [天神](/player/original/ow-celestials) · [时间膨胀](/player/original/ow-dilation) · [现实升级](/player/original/ow-reality-upgrades)
