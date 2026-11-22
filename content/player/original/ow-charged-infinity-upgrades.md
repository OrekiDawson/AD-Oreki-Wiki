---
title: "充能无限升级"
description: "原版 Wiki《Infinity Upgrades/Upgrades (Charged)》子页面的简体中文翻译：12 项充能无限升级的效果与公式"
tags:
  - 原版Wiki翻译
  - 现实
original_title: "Infinity Upgrades/Upgrades (Charged)"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Infinity_Upgrades/Upgrades_(Charged)"
original_revid: 3386
original_fetched_at: "2026-11-15T23:41:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-charged-infinity-upgrades"
---

充能无限升级是[无限升级](/player/original/ow-infinity-upgrades)的强化版本：充能之后，原本的乘数（$\times$）多半会换成幂次（$\text{＾}$），效果强得能直接改变推进节奏。

它由太阳神里的特蕾莎升到 $2$ 级解锁，此时只能给 1 个升级充能。之后特蕾莎每升 $2$ 级，上限加 1，到 24 级时 12 个全部可充能。无限升级最右边那一列（第 4 列）不能充能。特蕾莎等级本身也会加强充能效果，而充能配置**只能在两次现实之间重设**。

| ID | 成本（IP） | 描述（充能后） | 效果公式（$Level$ = 当前特蕾莎等级） | 其它细节 |
| --- | --- | --- | --- | --- |
| **第 1 列** |  |  |  |  |
| timeMult | $1$ | 反物质维度按游玩时长与特蕾莎等级获得幂次效果 | $1+\log_{10}\left(\log_{10}\left(Milliseconds\right)\right)*\frac{\sqrt{Level}}{150}$ |  |
| 18Mult | $1$ | 第 1、8 层反物质维度按无限次数与特蕾莎等级获得幂次效果 | $1+\log_{10}\left(Max\left(1,\log_{10}\left(Infinities_{Total}\right)\right)\right)*\frac{\sqrt{Level}}{150}$ |  |
| 36Mult | $1$ | 第 3、6 层反物质维度按无限次数与特蕾莎等级获得幂次效果 | $1+\log_{10}\left(Max\left(1,\log_{10}\left(Infinities_{Total}\right)\right)\right)*\frac{\sqrt{Level}}{150}$ |  |
| resetBoost | $1$ | 按特蕾莎等级降低维度提升需求 | $\frac{1}{1+\tfrac{\sqrt{Level}}{10}}$ | 特蕾莎 25 级时为 $\times0.6667$ |
| **第 2 列** |  |  |  |  |
| dimMult | $1$ | 「购买 10 个反物质维度」的乘数按特蕾莎等级获得幂次效果 | $1+\frac{Level}{200}$ | 特蕾莎 25 级时为 $^{1.125}$ 次方 |
| 27Mult | $1$ | 第 2、7 层反物质维度按无限次数与特蕾莎等级获得幂次效果 | $1+\log_{10}\left(Max\left(1,\log_{10}\left(Infinities_{Total}\right)\right)\right)*\frac{\sqrt{Level}}{150}$ |  |
| 45Mult | $1$ | 第 4、5 层反物质维度按无限次数与特蕾莎等级获得幂次效果 | $1+\log_{10}\left(Max\left(1,\log_{10}\left(Infinities_{Total}\right)\right)\right)*\frac{\sqrt{Level}}{150}$ |  |
| galaxyBoost | $2$ | 所有星系按特蕾莎等级变强 | $2+\frac{\sqrt{Level}}{100}$ | 特蕾莎 25 级时 $+105\%$（$\times2.05$） |
| **第 3 列** |  |  |  |  |
| timeMult2 | $3$ | 反物质维度按「本次无限已过时间」与特蕾莎等级获得幂次效果 | $1+\log_{10}\left(\log_{10}\left(Milliseconds+100\right)\right)*\frac{\sqrt{Level}}{150}$ |  |
| unspentBonus | $5$ | 第 1 层反物质维度的乘数按未花费无限点数计算，并以特蕾莎等级为幂 | $1+\left(\frac{IP}{2}\right)^{\sqrt{Level}*1.5}$ |  |
| resetMult | $7$ | 维度提升的乘数按特蕾莎等级获得幂次效果 | $1+\frac{Level}{200}$ | 特蕾莎 25 级时为 $^{1.125}$ 次方 |
| passiveGen | $10$ | 每现实秒获得现实机器，数量与一次现实所得成正比，并随特蕾莎等级提高 | $Level^2$；若薇的 10 级里程碑生效则再乘其效果 | 特蕾莎 25 级：$\times625$（无薇里程碑），$\times15,625~(1.56\text{e}4;~15.63~\text{K})$（薇里程碑满级） |

## 来源与许可

- 原文：[Infinity Upgrades/Upgrades (Charged)](https://antimatterdimensions.wiki.gg/index.php?title=Infinity_Upgrades%2FUpgrades_%28Charged%29&oldid=3386)（修订 ID 3386；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Infinity_Upgrades/Upgrades_(Charged)&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：翻译正文与 12 行升级表、统一术语、公式保留原式、图片未转载；本页按相同许可共享。
- 原文图片未转载：原页含充能界面截图（Cel5-chargedinfinityupgrades-interface--darktheme-desktop.png），此处仅保留文字说明。

## 相关条目

[无限升级](/player/original/ow-infinity-upgrades) · [特蕾莎](/player/original/ow-teresa) · [太阳神](/player/original/ow-ra) · [永恒升级](/player/original/ow-eternity-upgrades)
