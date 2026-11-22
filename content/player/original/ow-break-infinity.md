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

**打破无限（Break Infinity）**是下一个重要的进度里程碑。要解锁打破无限的能力，需要把[大坍缩自动购买器](/player/original/ow-automation)的间隔升级到 $0.1$ 秒。打破无限后，反物质可以超过 1.80e308，并在一组新的子页签中解锁一批新的[无限升级](/player/original/ow-infinity-upgrades)。打破无限之后，每次无限也可以获得超过 $1$ 个无限点数。

## 无限后的价格成长

超过 1.80e308 反物质后，[计数频率](/player/original/ow-tickspeed)与[反物质维度](/player/original/ow-antimatter-dimensions)的价格成长开始提高，乘以 $10$。这可以被对应的打破无限升级降低。

下表比较计数频率升级在 $\times 10$ 与 $\times 2$ 两种成长下的价格：

| 购买次数 | 成长 ×10：价格 | 成长 ×10：成长值 | 成长 ×2：价格 | 成长 ×2：成长值 |
| --- | --- | --- | --- | --- |
| 1 | $1.00\text{e}308$ | $10$ | $1.00\text{e}308$ | $10$ |
| 2 | $1.00\text{e}309$ | $100$ | $1.00\text{e}309$ | $20$ |
| 3 | $1.00\text{e}311$ | $1\text{e}3$ | $2.00\text{e}310$ | $40$ |
| 4 | $1.00\text{e}314$ | $1\text{e}4$ | $8.00\text{e}311$ | $80$ |
| 5 | $1.00\text{e}318$ | $1\text{e}5$ | $6.40\text{e}313$ | $160$ |
| 6 | $1.00\text{e}323$ | $1\text{e}6$ | $1.02\text{e}316$ | $320$ |
| 7 | $1.00\text{e}329$ | $1\text{e}7$ | $3.28\text{e}318$ | $640$ |
| 8 | $1.00\text{e}336$ | $1\text{e}8$ | $2.10\text{e}321$ | $1.28\text{e}3$ |
| 9 | $1.00\text{e}344$ | $1\text{e}9$ | $2.68\text{e}324$ | $2.56\text{e}3$ |
| 10 | $1.00\text{e}353$ | $1\text{e}10$ | $6.87\text{e}327$ | $5.12\text{e}3$ |
| 11 | $1.00\text{e}363$ | $1\text{e}11$ | $3.52\text{e}331$ | $1.02\text{e}4$ |
| 12 | $1.00\text{e}374$ | $1\text{e}12$ | $3.60\text{e}335$ | $2.05\text{e}4$ |
| 13 | $1.00\text{e}386$ | $1\text{e}13$ | $7.38\text{e}339$ | $4.10\text{e}4$ |
| 14 | $1.00\text{e}399$ | $1\text{e}14$ | $3.02\text{e}344$ | $8.19\text{e}4$ |
| 15 | $1.00\text{e}413$ | $1\text{e}15$ | $2.48\text{e}349$ | $1.64\text{e}5$ |
| 16 | $1.00\text{e}428$ | $1\text{e}16$ | $4.06\text{e}354$ | $3.28\text{e}5$ |
| 17 | $1.00\text{e}444$ | $1\text{e}17$ | $1.33\text{e}360$ | $6.55\text{e}5$ |
| 18 | $1.00\text{e}461$ | $1\text{e}18$ | $8.71\text{e}365$ | $1.31\text{e}6$ |
| 19 | $1.00\text{e}479$ | $1\text{e}19$ | $1.14\text{e}372$ | $2.62\text{e}6$ |
| 20 | $1.00\text{e}498$ | $1\text{e}20$ | $2.99\text{e}378$ | $5.24\text{e}6$ |

## 无限点数获取成长

主条目：[无限](/player/original/ow-infinity)

打破无限之后，玩家每次大坍缩可以获得超过 1 基础[无限点数](/player/original/ow-infinity)，这最终是继续推进所必需的。

## 升级

### 不可重复升级

| ID | 成本 | 描述 | 公式 |
| --- | --- | --- | --- |
| totalMult | $\text{1e4}$ | 反物质维度获得基于累计反物质产量的倍率 | $\sqrt{\lfloor \log_{10}(TotalAM) \rfloor + 1}$ |
| currentMult | $\text{5e4}$ | 反物质维度获得基于当前反物质的倍率 | $\sqrt{\lfloor \log_{10}(CurrentAM) \rfloor + 1}$ |
| postGalaxy | $\text{5e11}$ | 所有星系效果提高 50% | $1.5$ |
| infinitiedMult | $\text{1e5}$ | 反物质维度获得基于无限次数的倍率 | $1 + \max(\log_{10}(Infinities), 0)\times 10$ |
| achievementMult | $\text{1e6}$ | 反物质维度获得基于已完成[成就](/player/original/ow-achievements)的倍率 | $\max\left(\frac{(AchievementCount-30)^3}{40}, 1\right)$ |
| challengeMult | $\text{1e7}$ | 反物质维度获得基于最慢挑战用时的倍率；最慢用时低于 $0.1$ 秒后封顶 | $\min\left(\max\left(\frac{50}{WorstTimeMinutes}, 1\right), 3\text{e}4\right)$ |
| infinitiedGeneration | $\text{2e7}$ | 按最快无限时间被动生成无限次数 | 以等于最佳无限时间的间隔生成 $1$ 次无限，再乘以 $2$；上限为每 $100$ 毫秒 $1$ 基础无限 |
| autobuyMaxDimboosts | $\text{5e9}$ | 解锁[维度提升](/player/original/ow-dimension-boosts)自动购买器的「买满」模式 | N/A |
| autoBuyerUpgrade | $\text{1e15}$ | 由[普通挑战](/player/original/ow-challenges)解锁/强化的自动购买器速度翻倍 | $0.1 \to 0.05$ |

### 可重复升级

| ID | 初始成本（IP） | 价格倍率 | 最大等级 | 末级成本 | 描述 | 效果（$n$ = 购买次数） |
| --- | --- | --- | --- | --- | --- | --- |
| tickspeedCostMult | $\text{1e6}$ | ×5 | $8$ | $7.81\text{e}10$ | 降低无限后计数频率升级的成本成长倍率 | $10-n$ |
| dimCostMult | $\text{1e7}$ | ×5,000 | $7$ | $1.56\text{e}29$ | 降低无限后反物质维度的成本成长倍率 | $10-n$ |
| ipGen | $\text{1e7}$ | ×10 | $10$ | $1\text{e}16$ | 按最近 10 次无限的最佳 IP/分钟生成 $X\%$ 的无限点数 | $X=5n$（5%→50%） |

## 来源与许可

- 原文：[Break Infinity](https://antimatterdimensions.wiki.gg/index.php?title=Break_Infinity&oldid=3349)（修订 ID `3349`；最后编辑者 KrutarMarsons；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Break_Infinity&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文与表格、统一术语、移除导航模板与信息框、图片未转载；本页按相同许可共享。
- 原文表格的合并表头按语义展开为普通列；所有行与数值完整保留。

## 相关条目

[无限](/player/original/ow-infinity) · [无限维度](/player/original/ow-infinity-dimensions) · [永恒](/player/original/ow-eternity)
