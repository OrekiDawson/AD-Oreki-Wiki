---
title: "永恒升级"
description: "原版 Wiki《Eternity Upgrades》条目的简体中文翻译：6 项一次性永恒升级与可无限重复的 EP x5 升级"
tags:
  - 原版Wiki翻译
  - 永恒
original_title: "Eternity Upgrades"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Eternity_Upgrades"
original_revid: 3461
original_fetched_at: "2026-11-26T19:20:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "REVIEWED"
review_status: "REVIEWED"
aliases:
  - "/original/ow-eternity-upgrades"
---

第一次永恒之后，[永恒](/player/original/ow-eternity)页签里会多出永恒升级。它和无限升级是一个路子：花永恒点数买加成的升级，但**购买顺序随意**，不像无限升级那样一列一列往下卡。

一共 7 项，其中 6 项只能买一次，剩下那个可以无限买。

## 一次性升级

界面排成三列、每列两项。这些升级没有前置条件，钱够就能买。

| ID | 成本（EP） | 效果 | 公式 |
| --- | --- | --- | --- |
| idMultEP | 5 | 依据未花费的永恒点数提高无限维度乘数 | $ep+1$ |
| idMultEternities | 5 | 依据永恒次数提高无限维度乘数，在 1e5 次永恒处软上限 | 见下方说明 |
| idMultICRecords | $5\text{e}4~(50~\text{K})$ | 依据无限挑战用时总和提高无限维度乘数 | $\min\left(2^{\frac{30}{0.61}},~2^{\frac{30}{\max\left(0.1,~\text{TotalInfinityChallengeTimes}\right)}}\right)$ |
| tdMultAchs | $1\text{e}16~(10~\text{Qa})$ | 成就加成作用于时间维度 | $\text{AchievementBonus}$ |
| tdMultTheorems | 1e40 | 时间维度乘以未花费的时间之理 | $\max\left(\text{TimeTheorems}, 1\right)$ |
| tdMultRealTime | 1e50 | 时间维度乘以已游玩天数 | $\max\left(\text{TimePlayed}_{\text{days}}, 1\right)$ |

idMultEternities 的完整公式：

$$\left(\left(1+\frac{\min\left(\text{Eternities}, 1\text{e}5\right)}{200}\right)^{\log_{4}\left({1+2*\min\left(\text{Eternities}, 1\text{e}5\right)}\right)}\right)*\max\left(\left(1+\frac{\text{Eternities}-1\text{e}5}{200}\right)\left(\log_{4}\left(1+2*\max\left(\text{Eternities}-1\text{e}5, 0\right)\right)\right), 1\right)$$

## EP ×5 升级

epMult 与无限层的 ipMult 一样可以无限重复购买，每买一次成本乘以 50。当永恒点数跨过几个节点后，成本成长还会继续加码：

- 超过 1e100 EP：成长从 $\times 50$ 提到 $\times 100$；
- 超过 1.80e308 EP：提到 $\times 500$；
- 超过 1e1300 EP：提到 $\times 1000$；
- 超过 1e4000 EP：改为 $\times 1000^{\text{count}+\max\left(\text{count}-1334, 0\right)^{1.2}}$。

| ID | 成本（EP） | 效果 |
| --- | --- | --- |
| epMult | 500 | 所有来源的永恒点数乘以 $\times5$ |

## 来源与许可

- 原文：[Eternity Upgrades](https://antimatterdimensions.wiki.gg/index.php?title=Eternity_Upgrades&oldid=3461)（修订 ID 3461；抓取于 2026-11-26）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Eternity_Upgrades&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：翻译正文与表格、统一术语、公式保留原式、界面图与信息框未转载；本页按相同许可共享。
- 原文图片未转载：原页含桌面版与移动版界面截图（Eternity-eternityupgrades-interface--darktheme-desktop.png / -mobile.png），此处仅保留文字说明。

## 相关条目

[永恒](/player/original/ow-eternity) · [永恒里程碑](/player/original/ow-eternity-milestones) · [时间维度](/player/original/ow-time-dimensions) · [充能无限升级](/player/original/ow-charged-infinity-upgrades)
