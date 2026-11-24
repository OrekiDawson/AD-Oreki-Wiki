---
title: "计数频率·星系数量明细（被毁灭的现实）"
description: "原版 Wiki《Tickspeed/Galaxy count breakdown (Doomed)》子页面的简体中文翻译：佩勒现实中影响有效星系数量的来源与公式"
tags:
  - 原版Wiki翻译
  - 天神
original_title: "Tickspeed/Galaxy count breakdown (Doomed)"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Tickspeed/Galaxy_count_breakdown_(Doomed)"
original_revid: 3059
original_fetched_at: "2026-11-16T00:16:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-tickspeed-galaxy-breakdown-doomed"
---

这是[佩勒](/player/original/ow-pelle)「被毁灭的现实」里，有效星系数量的来源明细表。表中 `[Destroyed/Annihilated/Nullified]` 是原站的词形变换写法（表示该来源被佩勒摧毁），保留原样。

| 加成来源 | 说明 | 公式 | 其它细节 |
| --- | --- | --- | --- |
| 反物质星系 | 等于反物质星系的购买次数 | $A$ |  |
| 复制器星系 | 等于复制器星系数量。[时间研究 131](/player/original/ow-time-studies)或[衰变/崩解/混乱]的第 3 个里程碑给出的星系也会计入 | $R$ | 另有一个值用于记录「不含时间研究 131 或该里程碑」的复制器星系数量，在某些公式里记作 $r$ |
| 超光速粒子星系 | 等于超光速粒子星系数量；仅在解锁时间膨胀后适用 | $D$ |  |
| 时间研究 132 | 复制器星系效果 +40%，把复制器星系数量的一部分加到有效星系数上 | $0.4 * R$ | 这两项研究同样作用于[衰变/崩解/混乱]第 3 个里程碑给出的复制器星系 |
| 时间研究 133 | 复制器星系效果 +50%，把复制器星系数量的一部分加到有效星系数上 | $0.5 * R$ | 同上 |
| 永恒挑战 8 | 按无限之力强化复制器星系 | $r * \max\left(0,~\left(\log_{10}\left(\log_{10}(InfinityPower) + 1\right)\right)^{0.03n} - 1\right)$ | 该加成不会强化时间研究 131 或该里程碑给出的星系 |
| 时间研究 225 | 按复制器数量追加复制器星系 | $\left\lfloor \frac{\log_{10}(Replicanti)}{1,000} \right\rfloor$ | 这两项给出的星系不吃时间研究 132/133 的加成 |
| 时间研究 226 | 按「最大复制器星系」升级的购买次数追加复制器星系 | $\left\lfloor \frac{BoughtRG}{15} \right\rfloor$ | 同上 |
| 鹿颈长的无限层 | 被佩勒摧毁（原站词形：[Destroyed/Annihilated/Nullified]） | — |  |
| 三体研究 303 | 被佩勒摧毁（原站词形：[Destroyed/Annihilated/Nullified]） | — |  |
| 符文炼金·交替 | 被佩勒摧毁（原站词形：[Destroyed/Annihilated/Nullified]） | — |  |

## 来源与许可

- 原文：[Tickspeed/Galaxy count breakdown (Doomed)](https://antimatterdimensions.wiki.gg/index.php?title=Tickspeed%2FGalaxy_count_breakdown_%28Doomed%29&oldid=3059)（修订 ID 3059；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Tickspeed/Galaxy_count_breakdown_(Doomed)&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为简体中文翻译（改编），已修改：翻译表格与公式、统一术语、词形变换保留原文、模板表格转为 Markdown 表格；本页按相同许可共享。
- 原文无图片媒体，仅一张表格。

## 相关条目

[佩勒](/player/original/ow-pelle) · [时间研究](/player/original/ow-time-studies) · [反物质星系](/player/original/ow-antimatter-galaxies) · [莱特拉](/player/original/ow-laitela)
