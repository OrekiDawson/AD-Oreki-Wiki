---
title: "天神解锁与跨端实现细节"
description: "V、莱特拉与佩勒的源码门槛、跨端编码差异、历史故障链及来源；不替代玩家导览"
tags:
  - 天神
  - Android
  - Web
  - 源码
---

这是从玩家版[天神系统](/player/gameplay/celestials)移出的**实现与诊断资料**。以下涉及的数值、解锁判据与跨端字段来自原页面已记录的特定原版源码和 MOD 历史取证，供开发者追溯；不应把其中的历史 `PASS / NOT RUN` 当作最新 Android/Web 运行验收。

## 原版进入条件

### Teresa

原版中，购买全部现实升级会解锁第一位天神；成就 147「Master of Reality」的奖励就是解锁 Teresa。网页源码里，只要拥有该成就，游戏会自动解锁 Teresa 页签，而不要求玩家真的买齐全部现实升级。[官方源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/teresa.js)

### V：六项解锁条件

V 的解锁是六项 `mainUnlock` 同时达到 `progress() >= 1`：现实次数、永恒次数、无限次数、膨胀时间、复制体与现实机器。原版门槛分别是 **10000 次现实、`1e70` 永恒、`1e160` 无限、`1e320` 膨胀时间、`1e320000` 复制体、`1e60` 现实机器**。[官方源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/celestials/v.js)

还有一个读数陷阱：`emphasizeEnd(fraction) = Math.pow(fraction, 10)`，所以除现实次数外，多数项目的进度是**比值的 10 次方**，不是线性百分比。

Oreki Edition 缩放了三项：现实次数 **60**、膨胀时间 **`1e30`**、复制体 **`1e20000`**；其余三项保持原版。缩放原因与取舍记录在 MOD 源码注释里，集中对照见 [原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod)。

### Ra：36 空间之理的来源

Ra 的空间之理只可能来自 RU0～RU5：`v.js` 中 `if (!V.isFlipped && isHard) continue;` 使 RU6/7/8 在 `unlockHardV` 之前永远无法完成。36 条正好由 RU0～RU5 各 6 层给出，所以不要指望用后面的 slot 补数。[读码，[FACTS §8.5](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/reality.md#f-8-5)]

### Lai'tela：唯一入口是 IU15

Lai'tela 的入口是**虚构升级 IU15**（成本 `1e9`），它有两道门：

- 门 A：IM 存量与当前 IM 上限都不低于 `1e9`；
- 门 B：`maxID1 == 0`（从未买过第一无限维度）且反物质指数达到门槛。

原版门 B 的反物质指数门槛是 `1.5e12`；Oreki Edition 改为 `1e8`。原版 IM 上限约 `9.4517e7`，不足以覆盖 IU15/IU25 的成本，MOD 因此把 IM 上限倍率设为 `OREKI_IM_CAP_MULT = 3000`。[官方 IU15](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/reality/imaginary-upgrades.js) · MOD 值见 [原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod)。

「买 ID1 会让 `maxID1 > 0`」这条死锁链是原版设计：一旦买过第一无限维度，IU15 就永久失败（本现实内），莱特拉进度也会被砍到 50%。因为 `maxID1` 每个现实重置，这个问题可以按现实分阶段处理。[读码，[FACTS §8.10](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/endgame.md#f-8-10)]

莱特拉的熵速率在原版是 `clamp((log10(AM) / 1e11)^2, 0, 100) / 200`，MOD 把除数改为 `2e7`；原版升层要求「在 30 秒真实时间内完成一次莱特拉现实」，MOD 将窗口放宽到 300 秒，原因与实测见 [FACTS §25](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/celestials.md#f-25) 与 MOD 源码注释。

### Pelle：真终局与 break 死锁

Pelle 的入口是 IU25「Omnipresent Obliteration」（原版成本 `1.6e15`，MOD 改为 `5e9`），要求 `Laitela.isRunning`、`maxAllowedDimension === 0`、`Glyphs.activeWithoutCompanion.length <= 1` 且 `TimeStudy.reality` 已买。[官方 IU25](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/reality/imaginary-upgrades.js)

进入毁灭态后，`player.break` 会被关闭，反物质被夹在 `1.8e308` 附近，`endState` 封顶约 `0.75`。原版唯一能重新打开 break 的路径是：`isDoomed && keepAutobuyers.canBeApplied && hasMaxedInterval`，而 `keepAutobuyers` 是 Pelle 升级 id 2，需要 `5e6` 遗迹碎片（来自 Armageddon）。**因此正确推进序列是：反复末日拿碎片 → 买 `keepAutobuyers` → 下一次现实重置自动恢复 break**。任何「不重置、只囤产量」的自动化都会卡在这一步；单纯去掉 `!Pelle.isDoomed` 守卫也无效，因为 `breakInfinity()` 会先因 `hasMaxedInterval=false` 直接返回。[实测 + 读码，[FACTS §32](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/pelle.md#f-32)]

原版 `game-end.js` 的终局判据基于 `log10(9e15) - 8.7`，反物质指数约 `9e15` 时过线；Oreki Edition 把目标改为 `OREKI_PELLE_END_TARGET_EXP = 1e3` 并相应调整公式。**下调 MOD 目标之外，不允许再改动通关定义。**

## 原版行为与 Oreki Edition 的差异

| 项 | 原版 | Oreki Edition |
| --- | --- | --- |
| V 现实次数 / 膨胀时间 / 复制体 | 10000 / `1e320` / `1e320000` | 60 / `1e30` / `1e20000` |
| IU15 反物质指数门槛 | `1.5e12` | `1e8` |
| IU25 成本 | `1.6e15` | `5e9` |
| IM 上限倍率 | 原版上限 | `OREKI_IM_CAP_MULT = 3000` |
| 莱特拉熵除数 / 升层窗口 | `1e11` / 30 秒 | `2e7` / 300 秒 |
| 终局判据 | 反物质指数约 `9e15` | `OREKI_PELLE_END_TARGET_EXP = 1e3` |
| 自动化 | 原版自动购买器与 Automator | 额外加入统一调度、策略叶子与佩勒/莱特拉驱动 |

这些调整的集中来源与核对方式见 [原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod)。

## 两端位号不同：最容易被忽略的陷阱

同一字段 `imaginaryUpgradeBits` 在 Web 与 Android 移植版的位号**不一样**：

| 解锁 | Web（上游 id） | Android 3.21 移植版（内部 id） |
| --- | --- | --- |
| 莱特拉入口（IU15） | bit15 | **bit4**（`0x4`） |
| Pelle（IU25） | bit25 | **bit14**（`0xe`） |

早期实现按 Web 位号写入策略叶子，导致 `celestial.laitelaUnlocked / pelleUnlocked` 恒为 false；后续按 Android 反编译修正了位号。存档印证：`savestates/late/player-r109-m3-206.json`（Lai'tela 已解锁、Pelle 未解锁）的 `imaginaryUpgradeBits` 为 16 = `1<<4`。[读码 + 存档对照，修正提交 `53febade`]

这提醒读者：**「同一字段」不等于「同一编码」。** 跨端移植位号、枚举与常量时必须逐项核对本端反编译或源码，而不是照抄另一端。

## 已确认与未确认

- **已确认**：七位天神的原版定位、V 六项条件与原版数值、Ra 的 RU0～RU5 限制、IU15 双门与死锁链、IU25 条件、莱特拉熵公式、Pelle 的 break 死锁链与正确推进序列、两端位号差异。
- **未确认**：Android 端全部机制的等价复验（部分为 Web 冻结上游读码）；Pelle 终局从进入到通关的完整真实运行证据（NOT RUN）。
- **不要引用为攻略**：本条目解释机制与已知陷阱，不保证任意策略都能通关。

## 如何核查

1. 读 `player.json` 的 `celestials`、`reality.imaginaryUpgradeBits`、`laitela`、`pelle` 字段，确认解锁状态。
2. 用 `BitSet.f()J` 之类的方式读位掩码，而不是把 `BitSet` 当数字强转。
3. 在毁灭态采样 `player.break`、`endState`、反物质指数与 `keepAutobuyers`，区分「产量不够」与「break 没有恢复」。
4. 数值差异一律回源码确认，不以本页表格代替当前实现。

## 参考资料

- [社区 Wiki：Celestials](https://antimatterdimensions.wiki.gg/wiki/Celestials)
- [社区 Wiki：Pelle](https://antimatterdimensions.wiki.gg/wiki/Pelle)
- [官方源码：V 解锁条件](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/celestials/v.js)
- [官方源码：虚构升级 IU15 / IU25](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/reality/imaginary-upgrades.js)
- [官方源码：莱特拉熵速率](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/laitela/laitela.js)
- [官方源码：终局判定](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/pelle/game-end.js)
- [docs/FACTS.md §8.3–8.10](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/reality.md#f-8-3)、[§25](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/celestials.md#f-25)、[§32](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/pelle.md#f-32)

## 相关条目

[原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod) · [现实与时间研究](/player/gameplay/reality-time-studies) · [无限与永恒](/player/gameplay/progression-infinity-eternity) · [2026-11-15 · 天神策略叶子缺失与补实现](/developer/history/2026-11-15-celestial-leaves-fix) · [双端行为一致性](/developer/architecture/parity/)

## 迁移记录

技术内容保留自 [2026-11-22 前玩家条目](https://github.com/OrekiDawson/AD-Oreki-Wiki/blob/8726646c9701bc2ebad4d90faa5f9bbe5317f215/content/player/gameplay/celestials.md)。玩家如何推进七位天神仍以[天神系统](/player/gameplay/celestials)为入口；跨平台行为是否等价，需按当前仓库 Commit 和实测逐项确认。
