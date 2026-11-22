---
title: "无限挑战"
description: "原版 Wiki《Infinity Challenges》条目的简体中文翻译：8 个无限挑战的解锁门槛、目标、限制、奖励与快捷重置"
tags:
  - 原版Wiki翻译
  - 挑战
original_title: "Infinity Challenges"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Infinity_Challenges"
original_revid: 3359
original_fetched_at: "2026-11-16T00:10:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-infinity-challenges"
---

无限挑战是第二类[挑战](/player/original/ow-challenges)，[打破无限](/player/original/ow-break-infinity)之后解锁。它和[普通挑战](/player/original/ow-challenges)的区别在于难度：限制更狠、门槛更高，目标普遍超过无限值（$1.80\text{e}308$）反物质，且各关目标不同。

打完一个无限挑战，会以比较特别的方式强化某项产出——比如 IC2 直接送维度献祭自动购买器。无限挑战也可以反复重打，用来压缩它在挑战记录里的用时，那些记录会喂给特定升级与成就。

## 挑战一览

八个挑战都要先攒到指定反物质才能进入。规则与普通挑战类似：挑战内[无限升级](/player/original/ow-infinity-upgrades)最右一列被禁用；如果开着大坍缩自动购买器，达到目标时会立刻执行一次无限重置，无视其设置。

和普通挑战一样，部分无限挑战支持「快捷重置」：不用从头开始，可以丢掉一次维度提升，代价是自动补做一次维度提升动作。看着别扭，但它能帮你撤销前面的失误，避免成长卡死。

| ID | 解锁（反物质） | 目标（反物质） | 描述 | 奖励 | 快捷重置 | 细节 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | e2,000 | e650 | 除计数频率（C9）与大坍缩（C12）之外，所有普通挑战的限制同时生效 | 每完成一个无限挑战，所有无限维度 ×1.3 | 是 | 效果为 1.3^(已完成的 IC 数)；全部完成时约 ×8.16（显示为 ×8.2） |
| 2 | e11,000 | e10,500 | 拥有第 8 层反物质维度后，每 400 毫秒自动执行一次维度献祭 | 维度献祭自动购买器，且献祭公式变强：(log10(AD1)/10)^X ➜ AD1^X | 否 |  |
| 3 | e12,000 | e5,000 | 计数频率升级恒为 ×1；每次购买计数频率升级改为给所有反物质维度一个静态乘数，强度按反物质星系计算 | 按反物质星系与计数频率购买次数提供反物质维度乘数 | 否 | 公式 (1.05 + AG×0.005)^购买次数；该式同时用于挑战本身与奖励 |
| 4 | e14,000 | e13,000 | 只有最近购买的那层反物质维度产量正常，其余维度产量降为 x^0.25 | 所有反物质维度乘数变为 乘数^1.05 | 是 |  |
| 5 | e18,000 | e16,500 | 购买第 1–4 层反物质维度会抬高所有更便宜的 AD 成本；购买第 5–8 层会抬高所有更贵的 AD 成本 | 所有星系效果 +10%，且星系与维度提升的需求各降 1 | 是 |  |
| 6 | e22,500 | 2e22,222 | 一旦拥有至少 1 个第 2 层反物质维度，指数增长的物质会不断压低所有反物质维度乘数 | 按计数频率提供无限维度乘数 | 是 | 计数频率^0.0005 |
| 7 | e23,000 | e10,000 | 不能购买反物质星系；维度提升的基础乘数上限提高到 10 | 维度提升乘数下限提高到 ×4 | 否 |  |
| 8 | e28,000 | e27,000 | AD 产量随时间持续快速下降；购买反物质维度或计数频率升级会把产量重置回 100%，然后再次下降 | 按第 1 与第 8 层 AD 乘数给 AD 2–7 提供乘数 | 是 | 下降公式 0.8446303389034288^max(0, 毫秒−上次购买毫秒)；奖励 (AD1乘数×AD8乘数)^0.02 |

## 相关成就

| ID | 名称 | 描述 | 奖励 |
| --- | --- | --- | --- |
| 67 | Infinitely Challenging | 完成一个无限挑战。 |  |
| 81 | Game Design Is My Passion | 在 15 秒内打过无限挑战 5。 |  |
| 82 | Anti-antichallenged | 完成全部 8 个无限挑战。 |  |
| 97 | Like jumping on a lego | 无限挑战总用时低于 6.66 秒。 |  |
| 112 | Never again | 无限挑战总用时低于 750 毫秒。 |  |
| 183（剧透） | Déjà vOoM | 在被毁灭的现实里完成无限挑战 5。 | 所有反物质维度提升到 ^1.081 |

## 琐事

- 现实更新之前，无限挑战 5 有个 Bug：每次购买会让成本增加算两次，难度明显高于现在。那段时间社区公认 IC5 是最难的无限挑战，修掉之后这个位置被 IC4 接替。

## 来源与许可

- 原文：[Infinity Challenges](https://antimatterdimensions.wiki.gg/index.php?title=Infinity_Challenges&oldid=3359)（修订 ID 3359；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Infinity_Challenges&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：翻译正文与表格、统一术语、公式保留原式、界面图与信息框未转载；本页按相同许可共享。
- 原文图片未转载：原页含桌面现代/经典与移动版界面截图（Break-infinitychallenges-interface--*），此处仅保留文字说明。
- 原文成就 183 以剧透折叠块呈现，译文同样标为剧透。

## 相关条目

[挑战](/player/original/ow-challenges) · [无限](/player/original/ow-infinity) · [打破无限](/player/original/ow-break-infinity) · [无限维度](/player/original/ow-infinity-dimensions) · [永恒挑战](/player/original/ow-eternity-challenges)
