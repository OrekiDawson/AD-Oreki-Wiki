---
title: "打破无限"
description: "原版 Wiki《Break Infinity》条目的完整简体中文翻译：解锁条件、无限后价格成长、无限点数成长与升级列表"
tags:
  - 原版Wiki翻译
  - 无限
original_title: "Break Infinity"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Break_Infinity"
original_revid: 3349
original_fetched_at: "2026-11-15T21:45:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-break-infinity"
---

**打破无限（Break Infinity）**是下一个重要的进度里程碑。要解锁打破无限的能力，需要把[大坍缩自动购买器](/player/original/ow-automation)的间隔升级到 0.1 秒。打破无限后，反物质可以超过 1.80e308，并在一组新的子页签中解锁一批新的[无限升级](/player/original/ow-infinity-upgrades)。打破无限之后，每次无限也可以获得超过 1 个无限点数。

## 无限后的价格成长

超过 1.80e308 反物质后，[计数频率](/player/original/ow-tickspeed)与[反物质维度](/player/original/ow-antimatter-dimensions)的价格成长开始提高，乘以 10。这可以被对应的打破无限升级降低。

下表比较计数频率升级在 $\times 10$ 与 $\times 2$ 两种成长下的价格：

| 购买次数 | 成长 ×10：价格 | 成长 ×10：成长值 | 成长 ×2：价格 | 成长 ×2：成长值 |
| --- | --- | --- | --- | --- |
| 1 | 1.00e308 | 10 | 1.00e308 | 10 |
| 2 | 1.00e309 | 100 | 1.00e309 | 20 |
| 3 | 1.00e311 | 1e3 | 2.00e310 | 40 |
| 4 | 1.00e314 | 1e4 | 8.00e311 | 80 |
| 5 | 1.00e318 | 1e5 | 6.40e313 | 160 |
| 6 | 1.00e323 | 1e6 | 1.02e316 | 320 |
| 7 | 1.00e329 | 1e7 | 3.28e318 | 640 |
| 8 | 1.00e336 | 1e8 | 2.10e321 | 1.28e3 |
| 9 | 1.00e344 | 1e9 | 2.68e324 | 2.56e3 |
| 10 | 1.00e353 | 1e10 | 6.87e327 | 5.12e3 |
| 11 | 1.00e363 | 1e11 | 3.52e331 | 1.02e4 |
| 12 | 1.00e374 | 1e12 | 3.60e335 | 2.05e4 |
| 13 | 1.00e386 | 1e13 | 7.38e339 | 4.10e4 |
| 14 | 1.00e399 | 1e14 | 3.02e344 | 8.19e4 |
| 15 | 1.00e413 | 1e15 | 2.48e349 | 1.64e5 |
| 16 | 1.00e428 | 1e16 | 4.06e354 | 3.28e5 |
| 17 | 1.00e444 | 1e17 | 1.33e360 | 6.55e5 |
| 18 | 1.00e461 | 1e18 | 8.71e365 | 1.31e6 |
| 19 | 1.00e479 | 1e19 | 1.14e372 | 2.62e6 |
| 20 | 1.00e498 | 1e20 | 2.99e378 | 5.24e6 |

## 无限点数获取成长

主条目：[无限](/player/original/ow-infinity)

打破无限之后，玩家每次大坍缩可以获得超过 1 基础[无限点数](/player/original/ow-infinity)，这最终是继续推进所必需的。

## 升级

### 不可重复升级

| ID | 成本 | 描述 | 公式 |
| --- | --- | --- | --- |
| totalMult | $\text{1e4}$ | 反物质维度获得基于累计反物质产量的倍率 | $\sqrt{\lfloor \log_{10}(TotalAM) \rfloor + 1}$ |
| currentMult | $\text{5e4}$ | 反物质维度获得基于当前反物质的倍率 | $\sqrt{\lfloor \log_{10}(CurrentAM) \rfloor + 1}$ |
| postGalaxy | $\text{5e11}$ | 所有星系效果提高 50% | 1.5 |
| infinitiedMult | $\text{1e5}$ | 反物质维度获得基于无限次数的倍率 | $1 + \max(\log_{10}(Infinities), 0)\times 10$ |
| achievementMult | $\text{1e6}$ | 反物质维度获得基于已完成[成就](/player/original/ow-achievements)的倍率 | $\max\left(\frac{(AchievementCount-30)^3}{40}, 1\right)$ |
| challengeMult | $\text{1e7}$ | 反物质维度获得基于最慢挑战用时的倍率；最慢用时低于 0.1 秒后封顶 | $\min\left(\max\left(\frac{50}{WorstTimeMinutes}, 1\right), 3\text{e}4\right)$ |
| infinitiedGeneration | $\text{2e7}$ | 按最快无限时间被动生成无限次数 | 以等于最佳无限时间的间隔生成 1 次无限，再乘以 2；上限为每 100 毫秒 1 基础无限 |
| autobuyMaxDimboosts | $\text{5e9}$ | 解锁[维度提升](/player/original/ow-dimension-boosts)自动购买器的「买满」模式 | N/A |
| autoBuyerUpgrade | $\text{1e15}$ | 由[普通挑战](/player/original/ow-challenges)解锁/强化的自动购买器速度翻倍 | $0.1 \to 0.05$ |

### 可重复升级

| ID | 初始成本（IP） | 价格倍率 | 最大等级 | 末级成本 | 描述 | 效果（$n$ = 购买次数） |
| --- | --- | --- | --- | --- | --- | --- |
| tickspeedCostMult | $\text{1e6}$ | ×5 | 8 | 7.81e10 | 降低无限后计数频率升级的成本成长倍率 | $10-n$ |
| dimCostMult | $\text{1e7}$ | ×5,000 | 7 | 1.56e29 | 降低无限后反物质维度的成本成长倍率 | $10-n$ |
| ipGen | $\text{1e7}$ | ×10 | 10 | 1e16 | 按最近 10 次无限的最佳 IP/分钟生成 $X\%$ 的无限点数 | $X=5n$（5%→50%） |

## 来源与许可

- 原文：[Break Infinity](https://antimatterdimensions.wiki.gg/index.php?title=Break_Infinity&oldid=3349)（修订 ID `3349`；最后编辑者 KrutarMarsons；抓取于 2026-11-15T21:45:00+08:00）
- 来源访问说明：固定修订在 2026-11-23 复核时受 Cloudflare 403 限制；修订号与正文通过相邻修订、Internet Archive 快照、当前页面及上游源码交叉核对。
- 源码核对：[game.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/game.js)、[break-infinity-upgrades.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/infinity/break-infinity-upgrades.js)（固定提交 `5409e32`；核对解锁入口、升级成本与倍率上限）。
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Break_Infinity&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文与表格、统一术语、移除导航模板与信息框、图片未转载；本页按相同许可共享。
- 原文表格的合并表头按语义展开为普通列；所有行与数值完整保留。

## 相关条目

[无限](/player/original/ow-infinity) · [无限维度](/player/original/ow-infinity-dimensions) · [永恒](/player/original/ow-eternity)
