---
title: "原版:永恒挑战明细"
description: "原版 Wiki《Eternity Challenges/Challenges (Pelle)》子页面的简体中文翻译：佩勒中被上调的永恒挑战目标与专属改动"
tags:
  - 原版Wiki翻译
  - 天神
original_title: "Eternity Challenges/Challenges (Pelle)"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Eternity_Challenges/Challenges_(Pelle)"
original_revid: 3156
original_fetched_at: "2026-11-16T02:18:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-eternity-challenges-challenges-pelle"
---

进入[佩勒](/player/original/ow-pelle)的「被毁灭的现实」后，多数[永恒挑战](/player/original/ow-eternity-challenges)的目标会被上调；最后 4 个挑战还会禁用无限符文的佩勒专属效果。

此外，第 4 次[[#佩勒的冲击|冲击]]之后，[真空/空洞/虚空]裂痕在永恒挑战里的 IP 乘数只剩 $30\%$ 效果，并被限制在当次 IP 目标的 $15\%$。原站脚注给出的具体式子为 $Min\left(RiftEffect^{0.3},~Goal_{IP}^{0.15}\right)$。

表中「佩勒中改动」列标出哪些挑战的目标被上调（对应原站的佩勒配色高亮）。$c$ 为完成次数；[真空/空洞/虚空] 与 [混沌/无序/杂质] 是原站的词形变换写法，含义见[佩勒页的占位符说明](/player/original/ow-pelle#词形变换与占位符说明)。

| ID | 佩勒中改动 | 目标（IP） | 描述 | 奖励 | 可失败 | 效果 / 其它细节（c = 完成次数） |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 否 | e1,800 / ×e200 / e2,600 | 时间维度被禁用 | 按本次永恒已过时间提供时间维度乘数 | 否 | Max(毫秒/10, 0.9)^(0.3+0.05c) |
| 2 | 是 | e1,750 / ×e175 / e2,450 | 无限维度被禁用 | 按无限之力提供第 1 无限维度乘数 | 否 | Max(IPow^(1.5/(700−100c)), 1)，上限 ×e100 |
| 3 | 是 | e925 / ×e75 / e1,225 | 反物质维度 5–8 不产出；维度献祭被禁用 | 提高「购买 10 个反物质维度」的乘数 | 否 | +0.72c |
| 4 | 否 | e2,750 / ×e550 / e4,950 | 所有无限乘数与生成器被禁用；必须在限定无限次数内达标 | 按未花费 IP 提供无限维度乘数 | 是 | 无限次数上限 Max(16−4c, 0)；奖励 IP^(0.003+0.002c)，上限 ×e200；5 次完成需 4.12e15,384 IP；最后一档需时间研究 181 |
| 5 | 是 | e1,400 / ×e400 / e3,000 | 星系成本成长立即开始；维度提升成本成长大幅提高 | 远距星系成本成长开始得更晚 | 否 | +5c |
| 6 | 是 | e1,500 / ×e250 / e2,500 | 无法正常获得星系；提升最大复制器星系的成本大幅降低 | 进一步降低 AD 成本乘数成长 | 否 | −0.2c；对应 Break Infinity 升级满级且挑战满完成时 ×3 成长变 ×2 |
| 7 | 是 | e2,700 / ×e530 / e4,820 | 第 1 时间维度产第 8 无限维度、第 1 无限维度产第 7 反物质维度；计数频率也直接作用于无限与时间维度 | 第 1 时间维度生产第 8 无限维度 | 否 | Max(ShardProduction^(0.2c)−1, 0)/秒；满完成时该产量与时间碎片产量相同 |
| 8 | 是 | e2,800 / ×e900 / e6,400 | 无限维度只能升 50 次、复制器升级 40 次；两者自动购买器禁用 | 无限之力强化复制器星系 | 否 | Max(0, log10(log10(IPow)+1)^(0.03c)−1)，百分比显示 |
| 9 | 是 | e2,900 / ×e250 / e3,900 | 不能买计数频率升级；无限之力改以大幅衰减效果乘时间维度；无限符文的佩勒专属效果被禁用 | 按时间碎片提供无限维度乘数 | 否 | Max(Shards^(0.1c), 1)，上限 ×e400 |
| 10 | 是 | e3,200 / ×e300 / e4,400 | 时间维度与无限维度禁用；无限次数对 AD 提供巨量加成（Infinities^950）；无限符文的佩勒专属效果被禁用 | 按无限次数提供时间维度乘数 | 否 | Max((Infinities_Total×2.783e−6)^(0.4+0.1c), 1)；受时间研究 31 影响（^4） |
| 11 | 是 | e11,200 / ×e1,400 / e16,800 | 除无限之力与维度提升的乘数外所有维度乘数/幂次禁用；无限符文的佩勒专属效果被禁用 | 进一步降低计数频率成本乘数成长 | 否 | −0.07c；对应升级满级且挑战满完成时 ×2 成长变 ×1.65。EC11 是佩勒中唯一「目标成长」也被改动的永恒挑战 |
| 12 | 是 | e208,000 / ×e12,000 / e256,000 | 游戏速度慢 1000 倍（其它速度效果禁用）；必须在限时内达标；无限符文的佩勒专属效果被禁用 | 降低无限维度成本乘数 | 是 | 时限 Max(1−0.2c, 0.1) 秒（游戏时间）；奖励 1−0.008c |

## 各档 IP 门槛

| EC | 第 1 档 | 第 2 档 | 第 3 档 | 第 4 档 | 第 5 档 | 佩勒中改动 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | e1,800 | e2,000 | e2,200 | e2,400 | e2,600 | 否 |
| 2 | e1,750 | e1,925 | e2,100 | e2,275 | e2,450 | 是 |
| 3 | e925 | e1,000 | e1,075 | e1,150 | e1,225 | 是 |
| 4 | e2,750 | e3,300 | e3,850 | e4,400 | e4,950 | 否 |
| 5 | e1,400 | e1,800 | e2,200 | e2,600 | e3,000 | 是 |
| 6 | e1,500 | e1,750 | e2,000 | e2,250 | e2,500 | 是 |
| 7 | e2,700 | e3,230 | e3,760 | e4,290 | e4,820 | 是 |
| 8 | e2,800 | e3,700 | e4,600 | e5,500 | e6,400 | 是 |
| 9 | e2,900 | e3,150 | e3,400 | e3,650 | e3,900 | 是 |
| 10 | e3,200 | e3,500 | e3,800 | e4,100 | e4,400 | 是 |
| 11 | e11,200 | e12,600 | e14,000 | e15,400 | e16,800 | 是 |
| 12 | e208,000 | e220,000 | e232,000 | e244,000 | e256,000 | 是 |

## 来源与许可

- 原文：[Eternity Challenges/Challenges (Pelle)](https://antimatterdimensions.wiki.gg/index.php?title=Eternity_Challenges%2FChallenges_%28Pelle%29&oldid=3156)（修订 ID 3156）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Eternity_Challenges/Challenges_(Pelle)&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：翻译两张表格与全部公式、把佩勒配色高亮改为「佩勒中改动」列、词形变换保留原样、折叠表展开；图片未转载；本页按相同许可共享。
- 原文无图片媒体；脚注（裂痕效果可见条件、游戏速度效果禁用、时限按游戏时间计）已并入正文与表格。

## 相关条目

[永恒挑战](/player/original/ow-eternity-challenges) · [永恒挑战·挑战明细](/player/original/ow-eternity-challenges-challenges) · [佩勒](/player/original/ow-pelle) · [时间研究](/player/original/ow-time-studies)
