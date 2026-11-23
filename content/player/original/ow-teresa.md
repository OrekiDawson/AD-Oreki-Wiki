---
title: "特蕾莎"
description: "原版 Wiki《Teresa》条目的完整简体中文翻译：现实之神特蕾莎的 RM 容器、里程碑、复兴点数商店、特蕾莎的现实与引语"
tags:
  - 原版Wiki翻译
  - 天神
original_title: "Teresa"
original_url: "https://antimatterdimensions.wiki.gg/wiki/Teresa"
original_revid: 3370
original_fetched_at: "2026-11-15T21:25:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-teresa"
---

> 你在操纵现实上展现了潜力。
>
> 证明你的价值。

特蕾莎引入的核心机制是[RM 容器灌注](#rm-容器灌注)。

## 档案

特蕾莎，现实之神，别号「谄媚者」。买齐全部 **20 项一次性[现实升级](/player/original/ow-reality-upgrades)**、拿到[成就 147](/player/original/ow-achievements)之后，玩家才会见到她。她管两样东西：一是 RM 容器（把现实机器抽走灌注，换取 RM 乘数），二是复兴点数商店——两者都围绕现实机器与符文展开。她的[现实](#现实)要把容器灌到 $1\text{e}14$ RM 才开，进去之后 IP 与 EP 获取变成 $x^{0.55}$、来自符文的时间之理产出被禁用，完成条件是**购买需花费 $\text{e}4,000$ EP 的现实时间研究**，奖励则是强化符文献祭。这个现实可以反复打，打得越好奖励越高。网页版与 Android 分别随 2022 年 12 月 17 日、2024 年 4 月 1 日的现实更新加入，Steam 与 iOS 首发即有。

## 机制

### RM 容器灌注

该机制允许把已获得的[现实机器](/player/original/ow-reality)抽走灌注，把灌注的 RM 转化为 RM 获取加成。**已注入容器的现实机器无法取回**；加成上限为 $1\text{e}24$ RM，提供 $\times 250$ 的 RM 乘数。容器是对数式的：要让容器达到 $50\%$ 的容量，需要灌注 $1\text{e}12$ RM。

来自容器的 RM 乘数：

$
\max\left ( 250\left ( \frac{RM_{poured}}{1\text{e}24} \right )^{0.1}, 1 \right )
$

按住「灌注（Pour）」按钮即可将现实机器持续注入容器，按住越久注入速度越快。每个 tick 增加的灌注量（同时从当前 RM 中扣除）为：

$
\min\left(0.01\left(RM_{poured}+10^6\right)\cdot TimePoured_{ms}^{2},\ RM_{current}\right)
$

松开按钮时按住时间重新计为零；容器注满后按钮显示「已满（Filled）」。

当容器中灌注的 RM 达到若干区间时，可以取得六个里程碑，提供额外的便利性或帮助推进游戏的新机制。

| ID | 需求 | 奖励 | 提供的 RM 加成 | 详情 |
| --- | --- | --- | --- | --- |
| startEU | $1\text{e}6$ | 开始现实时已解锁全部[永恒升级](/player/original/ow-eternity-upgrades) | $\times 3.96$ | 达到里程碑时自动解锁全部永恒升级 |
| undo | $1\text{e}10$ | 解锁装备[符文](https://antimatterdimensions.wiki.gg/wiki/Glyphs)的「撤销」选项 | $\times 9.95$ | 可撤销上一次装备符文，并使现实回退到装备时的状态；**此时多数资源会重置** |
| run | $1\text{e}14$ | 解锁[特蕾莎的现实](#现实) | $\times 25.00$ |  |
| epGen | $1\text{e}18$ | 解锁被动[永恒点数](/player/original/ow-eternity)产出 | $\times 62.79$ | 本现实内，每秒获得「本现实峰值 EP」在每分钟维度下的 $1\%$ |
| shop | $1\text{e}21$ | 解锁[复兴点数商店](#复兴点数商店) | $\times 125.30$ |  |
| effarig | $1\text{e}24$ | 解锁[鹿颈长](/player/original/ow-effarig)，远古遗物之神 | $\times 250.00$ |  |

### 复兴点数商店

当容器灌注的 RM 达到 $\text{e}21$ 后，即可用[复兴点数](https://antimatterdimensions.wiki.gg/wiki/Perks)购买升级，其中许多升级可以多次购买。

解锁商店后，还可以将符文的**外观**改为音乐符文的样式。这是外观设置，与花费复兴点数获取音乐符文的商店选项不同。

| ID | PP 成本（成长） | 描述 | 等级上限 | 上限时效果 |
| --- | --- | --- | --- | --- |
| glyphLevel | $1\left ( \times 2 \right )$ | 把不稳定前的符文等级提高 $5\%$（乘算） | $11$ | $\times 1.71$ |
| rmMult | $1\left ( \times 2 \right )$ | 现实机器获取翻倍 | $11$ | $\times 2.05\text{e}3~(2.05~\text{K})$ |
| bulkDilation | $100\left ( \times 2 \right )$ | 膨胀自动购买器一次购买两倍的膨胀升级 | $4$ | $\times 16.00$ |
| autoSpeed | $1,000\left ( \times 2 \right )$ | 无限维度、时间维度、膨胀与复制器自动购买器速度 $\times 2$ | $2$ | $\times 4.00$ |
| musicGlyph | $1$ | 获得一个随机类型的音乐符文，其等级为你最高符文的 $80\%$[^music-glyph-generation] | 不适用 | 不适用 |

[^music-glyph-generation]: 音乐符文遵循符文生成规则，点击时会发出声音，且其外观不可更改。

### 太阳神记忆强化后的商店上限

当玩家在太阳神系统内将**特蕾莎的记忆等级提升至 15 级**后，商店中部分可重复升级的购买上限会提高，同时解锁一次填满未保护空槽的音乐符文购买选项。以下按英文原页补齐此前未收录的完整进阶表：

| ID | 初始成本（PP） | 最后一次成本（PP） | 等级上限 | 达到上限的效果 |
| --- | ---: | ---: | ---: | --- |
| `glyphLevel` | $1$ | $524,288$ | $20$ | 不稳定前的符文等级 $\times 2.65$ |
| `rmMult` | $1$ | $524,288$ | $20$ | 现实机器获取 $\times 1.05\text{e}6$ |
| `bulkDilation` | $100$ | $819,200$ | $14$ | 单次购买膨胀升级数量 $\times 1.64\text{e}4$（约 $16,384$ 倍） |
| `autoSpeed` | $1,000$ | $32,000$ | $6$ | 对应自动购买器速度 $\times 64$ |
| `musicGlyph` | $1$ | $1$ | 不适用 | 随机生成音乐符文，效果与原商店条目一致 |
| `fillMusicGlyph` | 未保护的空符文库存格数量 | 不适用 | 不适用 | 用音乐符文填满库存中的所有空槽 |

前四项可重复升级的单次效果与上表原有升级一致；此处列出的是强化后购买上限与最终累计效果，并非新增的六种不同加成。详细机制和条件以英文原页修订为准。



## 现实

向容器灌注至少 $1\text{e}14$ RM 后，会引入一种类似[挑战](/player/original/ow-challenges)的新机制。不过与[无限](/player/original/ow-infinity)、[永恒](/player/original/ow-eternity)这类层数更多、处境更艰难的挑战不同：进入被削弱的[现实](/player/original/ow-reality)所带的缺点与削弱比普通挑战、无限挑战与永恒挑战都多。特蕾莎的现实一旦进入就会施加这些惩罚：

- 时间之理产出<sup>（来自[膨胀符文](https://antimatterdimensions.wiki.gg/wiki/Glyphs)）</sup>被禁用。
- [无限点数](/player/original/ow-infinity)与[永恒点数](/player/original/ow-eternity)获取被开方：$p^{0.55}$。

要完成特蕾莎的现实，需要在该现实中**购买现实时间研究（Reality Time Study）**；这项研究的花费为 $\text{e}4,000$ [永恒点数](/player/original/ow-eternity)。完成后会提供[符文献祭](https://antimatterdimensions.wiki.gg/wiki/Glyph_Sacrifice)加成。

特蕾莎的现实可以无限次重复进入，也就是说可以反复挑战她的现实。达到新的最高[反物质](https://antimatterdimensions.wiki.gg/wiki/Antimatter)数量可以提升该现实给予的奖励。

特蕾莎的现实给予的符文献祭乘数加成由以下公式计算：

$
\left ( \frac{\log_{10}\left ( AM_{highestAttained} \right )}{150,000,000} \right )^{12}
$

特蕾莎的现实界面还会记录创造当前最高反物质纪录时使用的**符文组合**，以及完成该次现实时获得的**现实机器**。只有当玩家在特蕾莎的现实内突破先前的最高反物质纪录时，这些信息才会更新。

## 引语

**首次打开[天神](/player/original/ow-celestials)页签时**（结束条件）

> 我们一直在观察你。
> 你在操纵现实上展现了潜力。
> 我们是天神，我们希望你加入我们。
> 我的名字是特蕾莎，现实之神。
> 证明你的价值。

（引语结束）

**向[容器](#机制)灌注 1e14 解锁特蕾莎的现实时**（结束条件）

> 我会让你进入我的现实，凡人。别被它压碎。

（引语结束）

**完成[特蕾莎的现实](#现实)时**（结束条件）

> 你为什么还在这里……你本该失败的。

（引语结束）

**向容器灌注 1e24 解锁[鹿颈长](/player/original/ow-effarig)（远古遗物之神）时**（结束条件）

> 你依然不是我们的对手。
> 我希望其他天神能在我失败的地方成功。

## 注释

- 音乐符文：见上方「复兴点数商店」表格脚注。

## 琐事

- 特蕾莎的名字源自「Boo」；这是超级马力欧系列中同名角色日文名的罗马字。Boo 曾是《反物质维度》官方 Discord 服务器的版主[^cel-name-easter-egg]。
- 在正式发布之前（更准确地说，是开发稍晚的阶段），特蕾莎曾被称作[「鹿颈长」](/player/original/ow-effarig)，也就是下一位天神。原因是两人的机制虽然未变，但名字最初被交换了顺序，鹿颈长本该是现实之神、特蕾莎本该是远古遗物之神[^cel-name-easter-egg]。

[^cel-name-easter-egg]: 原文参考资料：AD 开发日志第 4 篇 <https://cyip92.github.io/site/#/ADdevlog/4>（外部链接，未转载内容）。

### 脚注

原文此节为空。

### 参考资料

原文此节仅含上述两条琐事引用的同一条开发日志链接；译文以脚注形式保留，未另设空列表。

## 来源与许可

- 原文：[Teresa](https://antimatterdimensions.wiki.gg/index.php?title=Teresa&oldid=3370)（页面 ID `292`；修订 ID `3370`；最后编辑者 KrutarMarsons；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=Teresa&action=history)
- 本次校对补充参考：[英文 Wiki 后续修订 `3442`](https://antimatterdimensions.wiki.gg/wiki/Teresa?oldid=3442)（用户提供的原页 MHTML 存档）。容器灌注、里程碑与进阶商店的补充和纠错已参考该较新修订；本页原有修订 `3370` 仍作为清单基线，二者**不是同一修订**，完整同步校验前不冒充只依据 `3370` 的逐段翻译。
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文、表格与引语，统一术语，把信息框内容改写为要点表，移除导航模板与模板结构，图片未转载；本页按相同许可共享。
- 原文图片未转载：原页含天神动画（`Cel1-runreality-static--desktop.gif`、`Cel1-runreality-active--desktop.gif`）、导航图（`Cel1-navigation-complete--desktop.png`）与界面截图（`Cel1-interface--darktheme-desktop.png`）。其图注含义为：「身处特蕾莎的现实之中」「两个同心圆，颜色为群青色，中间由一道笔画相连，正中是特蕾莎的符号——黑色叠于另一圆之上」「特蕾莎的完整界面；最高反物质所在现实的符文组合记录在特蕾莎的现实界面中」。请到原页查看图片。

## 相关条目

[天神](/player/original/ow-celestials) · [鹿颈长](/player/original/ow-effarig) · [现实](/player/original/ow-reality) · [现实升级](/player/original/ow-reality-upgrades) · [打破无限](/player/original/ow-break-infinity) · [时间膨胀](/player/original/ow-dilation) · [术语（佩勒用词）](/player/original/ow-terminology)
