---
title: "无名氏"
description: "原版 Wiki《The Nameless Ones》条目的完整简体中文翻译：时间之神无名氏的黑洞放电、储存时间、两项升级、九项现实效果与超立方体数据表"
tags:
  - 原版Wiki翻译
  - 天神
original_title: "The Nameless Ones"
original_url: "https://antimatterdimensions.wiki.gg/wiki/The_Nameless_Ones"
original_revid: 3372
original_fetched_at: "2026-11-15T21:28:00+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "STRUCTURE CHECKED"
review_status: "STRUCTURE CHECKED"
aliases:
  - "/original/ow-nameless-ones"
---

> 我们……曾有过名字。它被……这个地方……夺走了。

他们引入了[黑洞放电](#黑洞放电)，由此解锁[「储存的游戏时间」](#储存的游戏时间)——这种资源也可用来购买[无名氏的升级](#升级)，其中第二项升级会解锁他们的[现实](#现实)。

原页另有子页面「引语（Quotes）」，本轮批次未译，见文末相关条目。原文此页带有「需要清理/改进」的站点维护标记（Cleanup），属于原站编辑提示，不是玩法内容。

## 档案

无名氏，时间之神，别号「篡位者」。完成鹿颈长的永恒层就能见到他们。他们把时间做成资源：黑洞放电可以「储存游戏时间」，也能以七成效率储存现实时间，后者用于增幅现实——同一场现实按倍数多算几次。只有两项升级，都用储存的游戏时间买，第二项（$1\text{e}40$ 年）开启他们的现实。那个现实是全作最苛刻的一关：九项明面效果加若干隐藏效果，本质是一道谜题；通关后可以买超立方体，永久抬高无限维度 1–7 的购买上限。

## 黑洞放电

时间可以通过两种媒介储存：游戏时间与现实时间。

### 储存的游戏时间

储存游戏时间会禁用[黑洞](/player/original/ow-black-hole)带来的游戏速度乘数效果。该游戏速度乘数随后会被转换为储存的游戏时间；更准确地说，假设黑洞开启时一个现实秒等于五个游戏年，那么每秒储存的游戏时间也是五个游戏年。

储存起来的时间随后可以释放，游戏会「跳过」所储存的那段时间，就像游戏被放置运行了那么久——这只影响游戏时间，因此[自动购买器](https://antimatterdimensions.wiki.gg/wiki/Autobuyers)这类现实时间机制不受影响。

如果利用[时间符文的](https://antimatterdimensions.wiki.gg/wiki/Glyphs#Types)第二效果「游戏速度乘以 ×N」或[鹿颈长符文](https://antimatterdimensions.wiki.gg/wiki/Glyphs#Types)的第三效果「游戏速度幂 +N」，这会很有用：可以花掉一次[现实](/player/original/ow-reality)去积累尽可能多的储存游戏时间，然后用更合适的符文组合释放这些储存时间，从而获得远超没有释放的现实所能得到的资源。

### 储存的现实时间

储存现实时间会把游戏速度设为零，实际上暂停游戏的 tick 速率[^footnote-1]，这意味着任何被动获得的东西——[维度](/player/original/ow-dimensions)产出、[复制器](/player/original/ow-replicanti) tick、以及像[时间研究 181](/player/original/ow-time-studies)的被动[无限点数](/player/original/ow-infinity)产出、[特蕾莎容器里程碑](/player/original/ow-teresa)之一的[永恒点数](/player/original/ow-eternity)产出——全部停止；只有符文挑选、购买/重置时间研究这类交互操作不会被禁用。

与储存「游戏」时间有 $100\%$ 转换效率不同；现实时间只有 $70\%$ 的效率——因此让游戏储存现实时间 $100$ 秒，只会保留 $70$ 秒的现实时间。储存的现实时间上限为 $8$ 小时[^footnote-2]。

储存的现实时间用于增幅现实：单次现实中获得的所有资源——即[现实机器](/player/original/ow-reality)、符文（数量而非等级）、[复兴点数](https://antimatterdimensions.wiki.gg/wiki/Perks)与[遗迹碎片](/player/original/ow-effarig)——都会被提升，就像那次现实被执行了多次一样。

例如，若一次现实会产出等级 $3,000$ 的符文与 $4\text{e}29~(400~\text{Oc})$ 现实机器，而增幅乘数为 $\times 200$，那么同一次现实将改为产出 200 个等级 $3,000$ 的符文与 $8\text{e}31~(80~\text{No})$ 现实机器。

现实的增幅乘数同时取决于储存的现实时间与该次现实中花掉的现实时间。储存的现实时间越多，乘数按正比直接越大；而现实内花的时间越多，乘数按反比越小。

$$\max\left ( 1,~\frac{\left\lfloor RealTime_{\text{Stored}} \right\rfloor}{\max\left ( 1,~RealTime_{\text{This Reality}} \right )} \right )$$

两者都以秒（s）为单位，包含毫秒。

[^footnote-1]: 某些后续机制除外。
[^footnote-2]: 要完全充满 $8\text{h}$ 的现实时间储存，实际需要 $11$ 小时 $25$ 分 $42.857$ 秒；即整整 $41,142.857$ 秒。

## 升级

无名氏只引入两项升级，均为一次性购买，且用[储存的游戏时间](#储存的游戏时间)购买。

| ID[^id-naming] | 成本（储存的游戏年数） | 描述 |
| --- | --- | --- |
| FREE_TICKSPEED_SOFTCAP | $1\text{e}35$ | 把[时间维度](/player/original/ow-time-dimensions)对[计数频率升级](https://antimatterdimensions.wiki.gg/wiki/Tickspeed)的软上限延后 $100,000$ |
| RUN | $1\text{e}40$ | 解锁[无名氏的现实](#现实)（需要等级 $5,000$ 的符文与一个 $100\%$ 稀有度的符文） |

[^id-naming]: 这里的命名方式与大多数其他 ID 不同，用的是常量的 SCREAMING_SNAKE_CASE 命名法，而不是变量常用的 camelCase。原因是无名氏的升级信息直接写在[源代码中对应的文件](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/master/src/core/celestials/enslaved.js)里，而不像通常那样放在外部委托文件（一般位于 [secret-formula](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/master/src/core/secret-formula)）中。

第二项升级的额外要求必须同时满足，但可以用两个不同的符文分别达成。此外，这些要求只需满足一次。

## 现实

无名氏的现实是[天神](/player/original/ow-celestials)中限制最多、最棘手的一个。它的设计更偏向解谜，因此除了隐藏或秘密效果之外，还列出了**九**项效果。

| 描述 | 详情 |
| --- | --- |
| [符文等级](https://antimatterdimensions.wiki.gg/wiki/Glyphs#Glyph_Level)被提升到至少 $5,000$。 |  |
| [无限维度](/player/original/ow-infinity-dimensions)、[时间维度](/player/original/ow-time-dimensions)与第 8 层[反物质维度](/player/original/ow-dimensions)的购买次数各限 $1$ 次。 |  |
| 反物质维度乘数始终处于[膨胀](/player/original/ow-dilation)状态（[符文效果](https://antimatterdimensions.wiki.gg/wiki/Glyphs#Effects)仍只在真正的[时间膨胀](/player/original/ow-dilation)中生效）。 | 处于膨胀状态时，反物质维度乘数不会被膨胀两次。 |
| [时间研究 192](/player/original/ow-time-studies)（不设上限的[复制器](/player/original/ow-replicanti)）被锁定。 |  |
| [黑洞](/player/original/ow-black-hole)被禁用。 |  |
| [速子粒子](/player/original/ow-dilation)与[膨胀时间](/player/original/ow-dilation)产出被严重削减。 | 速子粒子：降为 $\text{TP}^{0.3}$；膨胀时间：降为 $10^{\log_{10}\left(\text{DT/s}+1\right)^{0.85}-1}$ |
| 来自膨胀符文的[时间之理](/player/original/ow-time-studies)产出被禁用。 |  |
| 某些[挑战](/player/original/ow-challenges)目标被提高。 | 除 1、6、9 之外的所有[普通挑战](/player/original/ow-challenges)都会「损坏」，其目标被设为 1e1e15 反物质；按钮外观出现裂纹、文字变为「Broken」、颜色改变。普通挑战 10 的裂纹看起来与其他不同[^fn-broken]。永恒挑战 1 可以完成 1,000 次[^fn-ec1]。 |
| 储存的游戏时间以降低的效率释放（$\left(\text{exponent}^{0.55}\right)$）。 |  |

[^fn-broken]: 损坏的普通挑战只在 Web/Steam 版本上显示裂纹。
[^fn-ec1]: 目标跨度会在完成 5 次与完成 1,000 次所需的无限点数之间变动。

除上述列出的效果外，无名氏的现实还有若干未被直接说明的效果。

| 效果 | 详情 |
| --- | --- |
| 所有页签都会显示，且无法隐藏。 | 隐藏页签的弹窗/窗口上会出现文字「你必须……看见一切……」（You must... see everywhere...）。 |
| 成就 16 与 18 的描述被追加了文字。 | 成就 16 追加了「(they never amount to anything)」，成就 18 追加了「(don't get used to it)」。 |
| 维度献祭被禁用。 | 实际上没有影响。 |
| 时间研究 11 的右侧会出现一个秘密研究。 | 与之交互会给予 100 时间之理。这些免费的时间之理持续到现实重置为止。 |
| 常规的「BREAK INFINITY」按钮会被替换为「FEEL ETERNITY」。 | 与之交互时，如果玩家不在永恒挑战 12 中，则把本次永恒的时间乘以 $1 + \min\left(\text{Eternities}, 1\text{e}66\right)$。该效果持续到现实重置为止。 |
| 永恒挑战 6 不再阻止玩家购买反物质星系。 | 文字「You cannot gain Antimatter Galaxies normally」在 Web/Steam 上被打乱，在 Android/iOS 上被划线划掉。 |

## 超立方体

完成无名氏的现实后，玩家可以购买超立方体（Tesseracts），这种资源会永久提高[无限维度](/player/original/ow-infinity-dimensions) 1–7 的购买上限。超立方体的[无限点数](/player/original/ow-infinity)成本按超指数增长；作为补偿，每一个后续超立方体对无限维度购买上限的提升都更强。

无限维度页签上有一个按钮，显示玩家拥有多少个超立方体、下一个超立方体对无限维度购买上限的提升量，以及下一个超立方体的价格。当可以购买超立方体时，该按钮的外观会变化。

与无限维度页签上的专用按钮类似，无限按钮在可以购买超立方体时也会视觉变化。在 Web/Steam 上，此状态下点击无限按钮会把玩家带到无限维度页签；在 Android/iOS 上，此状态下点击无限按钮则直接购买一个超立方体。

| 超立方体 # | 无限维度 1–7 购买上限提升 | 无限维度 1–7 总购买上限 | 成本（IP） |
| --- | --- | --- | --- |
| 1 | $5\text{e}5~(500~\text{K})$ | $2.5\text{e}6~(2.5~\text{M})$ | $\text{e}20,000,000$ |
| 2 | $5\text{e}5~(500~\text{K})$ | $3\text{e}6~(3~\text{M})$ | $\text{e}40,000,000$ |
| 3 | $1\text{e}6~(1~\text{M})$ | $4\text{e}6~(4~\text{M})$ | $\text{e}60,000,000$ |
| 4 | $2\text{e}6~(2~\text{M})$ | $6\text{e}6~(6~\text{M})$ | $\text{e}120,000,000$ |
| 5 | $4\text{e}6~(4~\text{M})$ | $1\text{e}7~(10~\text{M})$ | $\text{e}480,000,000$ |
| 6 | $8\text{e}6~(8~\text{M})$ | $1.8\text{e}7~(18~\text{M})$ | $\text{e}2,880,000,000~(\text{e}2.88\text{e}9;~\text{e}2.88~\text{B})$ |
| 7 | $1.6\text{e}7~(16~\text{M})$ | $3.4\text{e}7~(34~\text{M})$ | $\text{e}23,040,000,000~(\text{e}2.304\text{e}10;~\text{e}23.04~\text{B})$ |
| 8 | $3.2\text{e}7~(32~\text{M})$ | $6.6\text{e}7~(66~\text{M})$ | $\text{e}230,400,000,000~(\text{e}2.304\text{e}11;~\text{e}230.4~\text{B})$ |
| 9 | $6.4\text{e}7~(64~\text{M})$ | $1.3\text{e}8~(130~\text{M})$ | $\text{e}2,764,800,000,000~(\text{e}2.765\text{e}12;~\text{e}2.765~\text{T})$ |
| 10 | $1.28\text{e}8~(128~\text{M})$ | $2.58\text{e}8~(258~\text{M})$ | $\text{e}38,707,200,000,000~(\text{e}3.871\text{e}13;~\text{e}38.71~\text{T})$ |
| 11 | $2.56\text{e}8~(256~\text{M})$ | $5.14\text{e}8~(514~\text{M})$ | $\text{e}619,315,200,000,000~(\text{e}6.193\text{e}14;~\text{e}619.3~\text{T})$ |
| 12 | $5.12\text{e}8~(512~\text{M})$ | $1.026\text{e}9~(1.026~\text{B})$ | $\text{e}11,147,673,600,000,000~(\text{e}1.115\text{e}16;~\text{e}11.15~\text{Qa})$ |
| 13+ | $2.5\text{e}5 * 2^{\left(\text{Tesseract}-1\right)}$ | $2\text{e}6 + 2.5\text{e}5 * 2^\text{Tesseracts}$ | $\text{e}1.80\text{e}308$ |

原文在 13+ 行的公式处带有一条编辑注释：该公式对第 1 个超立方体给出的数值不正确（$2.5\text{e}5$ 而非 $5\text{e}5$），其余情况准确。

## 琐事

- 在 Android 3.11.0 版本之前，无名氏的现实中没有禁用献祭。如果玩家在挑战 8 中达到 5 次维度提升，就能轻易达到 $1\text{e}9\text{e}15$ 的反物质上限。
- 最初他们的称号是「Enslaved」而不是「The Nameless Ones」[^cel-name-change]。这一命名最终因为明显的伦理问题被更改，但在游戏源代码中你仍会看到内部把无名氏称为「Enslaved」。
- 无名氏代表整个测试团队，或者《反物质维度》的玩家群体[^cel-name-easter-egg]。这与他们最初的名字「Enslaved」相关，暗含一个玩笑：把「测试者」或「玩家」说成被困在 Hevipelle 地下室里、被迫玩他那邪恶游戏的人。

[^cel-name-change]: 原文参考资料：AD 开发日志第 7 篇 <https://cyip92.github.io/site/#/ADdevlog/7>；以及上游 PR <https://github.com/IvarK/AntimatterDimensionsSourceCode/pull/2944>（外部链接，未转载内容）。
[^cel-name-easter-egg]: 原文参考资料：AD 开发日志第 4 篇 <https://cyip92.github.io/site/#/ADdevlog/4>（外部链接，未转载内容）。

### 脚注

原文脚注已并入上方各节（tick 速率例外、8 小时上限换算、损坏挑战的显示差异、永恒挑战 1 的目标跨度、升级 ID 命名）。

### 参考资料

原文此节仅含上述琐事引用的开发日志与上游 PR 链接；译文以脚注形式保留。

## 来源与许可

- 原文：[The Nameless Ones](https://antimatterdimensions.wiki.gg/wiki/The_Nameless_Ones)（页面 ID 380；修订 ID 3372；最后编辑者 KrutarMarsons；抓取于 2026-11-15）
- 原文贡献者与修订历史：[页面历史](https://antimatterdimensions.wiki.gg/index.php?title=The_Nameless_Ones&action=history)
- 许可：[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。本页为**简体中文翻译（改编）**，已修改：翻译正文与表格，统一术语，把信息框内容改写为要点表，把模板内脚注改为页内脚注，移除导航模板与模板结构，图片未转载；本页按相同许可共享。
- 原文图片未转载：原页含天神动画（Cel3-runreality-static--desktop.gif、Cel3-runreality-active--desktop.gif）、导航图（Cel3-navigation-complete--desktop.png）、界面截图（Cel3-interface--darktheme-desktop.png）与超立方体按钮图（Cel3-tesseract-button--darktheme-modern-desktop.png、Cel3-tesseract-button-buyable--darktheme-modern-desktop.png）。原图注含义：「静止状态的无名氏符号，此处大约加速 60 倍」「无限维度页签上的新按钮」「可购买超立方体时按钮会变化」。请到原页查看图片。

## 相关条目

[天神](/player/original/ow-celestials) · [鹿颈长](/player/original/ow-effarig) · [现实](/player/original/ow-reality) · [黑洞](/player/original/ow-black-hole) · [时间维度](/player/original/ow-time-dimensions) · [时间研究](/player/original/ow-time-studies) · [时间膨胀](/player/original/ow-dilation)
