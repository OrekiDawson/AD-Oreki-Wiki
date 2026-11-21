---
title: "原版行为与 Oreki Edition 修改"
description: "集中对照《反物质维度》原版规则与 Oreki Edition 的数值缩放、自动化增强和解锁条件放宽"
tags:
  - 玩法
  - 原版
  - MOD
aliases:
  - "/gameplay/original-vs-mod"
---

# 原版行为与 Oreki Edition 修改

Oreki Edition 是在《反物质维度》原版之上修改的版本。多数玩法机制仍按原版运行，但 MOD 为了让「真实新档 180 分钟通关」这一工程目标可达，调整了部分阈值，并加入了原版没有的自动化与界面层。本页把这些差异集中列出，避免读者把 MOD 的调整误当成原版规则，或反过来用原版数值判断 MOD。

阅读其他玩法条目时，只要涉及具体数值或自动化行为，都应以本页与各条目中的「原版 / MOD」标注为准。

## 两个版本是什么关系

- 《反物质维度》原版：2016 年以网页游戏出现，2022 年 12 月 17 日发行 Steam 版本，也有移动版；官方网页源码开源于 [IvarK/AntimatterDimensionsSourceCode](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca)。
- **Oreki Edition**：以 Android 官方 3.21.0 与 Web 2026-07-17 上游快照为基线的修改版，不是官方更新；包名、签名与发布链均为独立体系，见 [APK 签名与升级兼容](/developer/build/apk-signing/)。
- 本站引用原版机制时，优先用**官方源码**交叉核对，其次参考[社区 Wiki](https://antimatterdimensions.wiki.gg/wiki/Antimatter_Dimensions)；MOD 修改则以本项目仓库的源码、报告与 Kotlin 业务代码为准。

## 数值与解锁条件对照

下表列出已经能从源码或运行报告核对的差异。「原版」列指官方代码，「Oreki Edition」列指当前 MOD 实现；两者都可能在后续版本调整，引用时请同时看来源与版本。

| 机制 | 原版 | Oreki Edition | 证据 |
| --- | --- | --- | --- |
| V 解锁所需现实次数 | 10000 | **60** | [v.js（原版）](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/celestials/v.js)；MOD 值 `OREKI_V_UNLOCK_REALITIES` |
| V 解锁所需膨胀时间 | `1e320` | **`1e30`** | 同上；MOD 值 `OREKI_V_UNLOCK_DILATED_TIME` |
| V 解锁所需复制体 | `1e320000` | **`1e20000`** | 同上；MOD 值 `OREKI_V_UNLOCK_REPLICANTI` |
| IU15 反物质指数门槛 | `1.5e12` | **`1e8`** | [imaginary-upgrades.js（原版）](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/reality/imaginary-upgrades.js)；MOD 值 `OREKI_IU15_AM_EXP` |
| IU15 成本 | `1e9` | `1e9`（未改） | 同上 |
| IU25 成本 | `1.6e15` | **`5e9`** | 同上；MOD 值 `OREKI_IU25_COST` |
| 虚幻机器（IM）上限倍率 | 原版上限 | 乘 **`OREKI_IM_CAP_MULT = 3000`** | MOD 源码 `src/core/machines.js` |
| 莱特拉熵速率除数 | `1e11` | **`2e7`** | [laitela.js（原版）](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/laitela/laitela.js)；MOD 值 `OREKI_LAITELA_ENTROPY_DIVISOR` |
| 莱特拉升层完成窗口 | 真实 30 秒 | **真实 300 秒** | 原版 `game.js` 的 30 s 判定；MOD 值 `OREKI_LAITELA_TIER_WINDOW_SEC` |
| 佩勒终局判定 | 反物质指数约 `9e15` 过线 | 目标 `OREKI_PELLE_END_TARGET_EXP = 1e3` | [game-end.js（原版）](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/pelle/game-end.js) |
| 现实解锁的成就条件 | 全部 preReality 成就（或 START Perk） | EC11、EC12 各 5/5 后**豁免**成就项 | MOD 源码 `OrekiRealityUnlock.kt`、`dilation-time-studies.js` |
| 全局自动化节拍 | 各自动购买器自己的 interval/bulk | 增加 **1～60 秒统一调度层**（默认 10 秒） | MOD 源码 `OrekiAutomationScheduler.kt` |
| 通关目标 | 击败 7 位天神 | 另加「真实新档 ≤180 分钟通关」工程目标 | 项目规则与长跑报告 |

**关键提醒**：上表的 MOD 数值是「当前实现」；它们会随项目轮次调整。判断某个具体数字时，应打开对应源码文件确认，而不是只引用本表。

## MOD 新增的系统性能力

原版已经有完整的自动购买器与自动化，但 MOD 为了自动冲进度，额外增加了一层策略与调度：

- **统一调度器**：所有真实购买动作经过 `allow()` 的 1～60 秒节拍，避免逐帧抢操作。
- **目标驱动自动购买器**：根据当前阶段与目标选择购买优先级，并遵守「手动优先」。
- **GUI 阶段真值**：用真实结算产物组合判断阶段，避免原版单字段导致的提前解锁。
- **自动永恒托管**：原版 Reality 结算会把「自动永恒」开关复位（原版设计行为），MOD 托管层负责在原版复位后补回开关，同时尊重玩家手动关闭。
- **IU15 冲刺**：在干净现实窗口内拦住全部无限维度购买，满足 `maxID1 == 0` 的硬条件。
- **策略叶子**：把天神是否开放等条件实现为可判定的布尔叶子，供策略层使用。
- **佩勒/莱特拉驱动**：只调用原版按钮与入口，不直接写 `isGameEnd`、`doomed` 或资源字段。

这些能力属于 **MOD 新增**，在原版中不存在；它们改变的是「谁来操作」，而不是「结算规则」。

## 原版仍然生效、MOD 不允许改动语义的部分

- 挑战必须通过原版真实结算入口完成，不得直接写完成状态；
- 阶段门禁的判定语义、非法直达的拦截与恢复；
- 存档字段的写读路径与 Gson 反序列化规则；
- 天神与终局的解锁条件、真实购买入口；
- 原版自动购买器的 `isActive` 属于玩家状态，策略层不得代为开启。

因此「MOD 自动化更快」不等于「MOD 改变了游戏规则」：加速只发生在操作层，结算与门禁仍按原版走。

## 平台差异（Android 与 Web）

两端基线版本不同，原版行为本身也有差异。已核对的一例：**Android 原版自带无限维度自动购买器，而 Web 原版没有**，Web 端相关能力是 MOD 自己补的。类似的差异意味着同一功能在两端可能由不同代码实现，跨端等价必须逐项验收，见 [双端行为一致性](/developer/architecture/parity/)。

## 如何核对一条差异

1. 打开对应原版源码文件（固定上游 Commit），确认原版常量与判据；
2. 打开 MOD 仓库的同一文件或 Kotlin 业务代码，确认 MOD 常量；
3. 若涉及运行行为，查看长跑报告或 AVD 记录，区分「常量改了」与「实际生效」；
4. 引用时写明适用版本与最后核实时间。

## 参考与许可

- [《反物质维度》社区 Wiki](https://antimatterdimensions.wiki.gg/wiki/Antimatter_Dimensions)：游戏机制、术语与分类的公开参考资料。
- [官方网页源码（固定 Commit）](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca)：原版公式与解锁条件的首要依据。
- 社区 Wiki 的文本与图像按其[版权说明](https://antimatterdimensions.wiki.gg/wiki/Meta:Copyrights)采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 许可。**本站正文为独立中文撰写，不复制其文章正文或图片**；如未来转载或改编其内容，将遵守署名、来源链接、修改说明与相同方式共享要求，图片与第三方素材另行核实授权。
- MOD 侧证据：[Android 仓库](https://github.com/OrekiDawson/AD-Oreki-Edition-Android)、`docs/FACTS.md` 与相关 Kotlin 业务文件。

## 相关条目

[玩法机制](/player/gameplay/) · [无限与永恒](/player/gameplay/progression-infinity-eternity) · [现实与时间研究](/player/gameplay/reality-time-studies) · [天神系统](/player/gameplay/celestials) · [挑战与真实结算](/player/gameplay/challenges) · [智能自动购买器](/player/gameplay/automation) · [反物质维度](/player/antimatter-dimensions)
