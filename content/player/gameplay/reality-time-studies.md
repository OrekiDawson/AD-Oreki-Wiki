---
title: "现实与时间研究"
description: "解释现实重置、时间之理、DS1/DS6 与自动化节奏如何互相影响，以及为什么现实次数会卡住"
tags:
  - 玩法
  - 现实
  - 时间研究
aliases:
  - "/gameplay/reality-time-studies"
---


**现实（Reality）**是永恒之上的重置层：每次现实会清空时间研究、时间膨胀研究、最大膨胀时间等进度，并可能增加符文（Glyph）、现实机器（RM）与后续天神系统的成长。本条目解释现实与时间研究如何互相牵制，以及 Oreki Edition 为什么会出现「现实次数停在 2」的问题。

## 现实何时可以执行

原生判据是 `isRealityAvailable()`：`maxEP.exponent >= 4000` **且** `TimeStudy.reality`（DS6）已经买上。换句话说，DS6 一被买上就代表「现实可打」，而现实重置会`Currency.timeTheorems.reset()`，把整棵时间研究树清空——DS6 也随之消失。[读码，[FACTS §22](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/eternity.md#f-22)]

这个「只存在一帧」的状态很重要：如果自动化用低频轮询去等「DS6 在位 + 某条件同时成立」，很可能永远采不到那一帧。正确做法是提前压住现实、让 DS6 买上后留得住，再在同一现实内完成后续目标；不是反复等它出现。

### 原版的完整解锁条件

原版买下最终时间研究（DS6）并不只看 EP：

- 已经买上第 8 时间维度对应的膨胀研究；
- `player.records.thisReality.maxEP.exponent >= 4000`；
- **前 13 排成就全部解锁**（或拥有 START Perk 免除成就要求）；
- 当前不处于 Pelle 的毁灭态。

也就是说，原版现实解锁同时是「资源条件 + 成就条件」。Oreki Edition 发现自动化与其中一部分成就**在逻辑上互斥**（例如「无限次数 < 10 时永恒」「只买过第一维度」），于是加入一条 MOD 放宽：**当 EC11 与 EC12 都已完成 5/5 时，豁免「全部 preReality 成就」这一项**，其余条件不变。该放宽实现在 Kotlin 业务代码 `OrekiRealityUnlock.kt` 中，只包装这一个布尔项，不修改 `isRealityAvailable`、不改现实重置、不写成就字段。[MOD 源码注释](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/eternity/time-studies/dilation-time-studies.js) · 对照见 [原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod)

原版现实完成后会获得现实机器（RM）、一枚符文（Glyph）与一个复兴点数（Perk Point），并逐步开放符文、现实升级、Perk、黑洞与 Automator 等系统。这些系统的具体规则不属于本条目范围，但会影响自动化设计：例如符文装备与卸下本身会触发一次完整现实，不能当作「无代价操作」。

## 现实重置会清掉什么

- 时间之理与时间研究树（`reality.js` 的 `Currency.timeTheorems.reset()`）；
- 膨胀研究列表与 `active` 状态；`maxDT` 清零；
- `requirementChecks.reality` 整个对象被替换，其中包含 `maxID1`。

最后一条对 MOD 尤其关键：**`maxID1` 每个现实重置**，所以「莱特拉入口被 maxID1 锁死」不是不可逆的，而是需要按现实分阶段处理。[读码，[FACTS §8.10](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/endgame.md#f-8-10)]

## 时间研究树与常见故障

### DS1 与膨胀

DS1 需要 5000 TT，是时间膨胀的入口；`PlayerProgress.dilationUnlocked()` 实际就是 DS1。没有 DS1 就不会有 `startDilatedEternity`，也不会产生 `maxDT > 0`，天神 V 的「膨胀时间」条件就永远不达标。

### 研究树抖动（respec jitter）

当两套自动化对「当前该打哪一关 EC」定义不同时，会出现「A 认为该保留 71，B 认为 71 妨碍 EC12」的冲突：一边清空 38 个研究，另一边 1 秒内再买回来，形成每 6 秒左右一次的循环。实测中 7 次 respec、间隔 6.17～6.32 秒、EC 完成数一次未变。[读码 + 实测，[FACTS §23](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/automation/strategy.md#f-23)]

这类问题靠「多等一会儿」不会自愈，需要把目标 EC 的定义统一、并对清空行为加会话内节流。

## MOD 的「现实次数卡住」问题

2026-11-15 的真实新档长跑中，第 1 次现实（576.7 秒）与第 2 次现实（1218.6 秒）都能发生，但之后 `realities` 长时间停在 2，`canReality=false` 持续，RM 顶到原版硬上限。随后定位到「现实之后原版自动永恒复位」把现实条件反复重置；[PR #92](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/92) 已合并，后续又用 [PR #158](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/158) 修正现实后 IP 死锁，并加入首次现实前的永恒里程碑门槛。

这些修复解释了历史上“现实次数停在 2”和“现实后 IP 冻结”的机制，但不能推出所有 Android 构建都已通过终局。R121 仍有一次真实跑次在首现实后暴露了阶段判据停滞，见 [2026-11-20 · R121 Android KVM 新档阶段推进与 P1 停滞](/developer/history/2026-11-20-r121-android-kvm)；现行 Android 结论仍以完整新档验收为准。

## 已确认与未确认

- **已确认**：现实可用判据、重置清空范围、`maxID1` 每现实重置、respec 抖动机制与频率。
- **未确认**：Android R121 修复后的完整终局与通关后持续确认（NOT RUN）；Android 与 Web 自动化是否逐场景等价（NOT RUN，见 [双端行为一致性](/developer/architecture/parity)）。
- **不适用**：不同平台版本的阈值可能不同，引用具体数字时请同时对版本与来源。

## 如何核查

1. 采样 `player.realities`、`maxEP`、`timeTheorems` 与 `TimeStudy.reality` 状态，区分「资源不够」与「条件被反复清空」。
2. 记录 respec 调用栈与间隔，判断是否存在多套自动化互相清树。
3. 对照稳定构建的同一时间窗口，避免把构建差异当成机制问题。

## 参考资料

- [docs/FACTS.md §22（DS6 只活一帧）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/eternity.md#f-22)
- [docs/FACTS.md §23（EC 分叉抖动）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/automation/strategy.md#f-23)
- [docs/FACTS.md §8.10（IU15 与 `maxID1`）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/endgame.md#f-8-10)
- [Android PR #92（现实自动永恒复位修复，已合并）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/92)

- [社区 Wiki：Reality](https://antimatterdimensions.wiki.gg/wiki/Reality)
- [官方源码：现实时间研究 DS6](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/eternity/time-studies/dilation-time-studies.js)

## 相关条目

[原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod) · [无限与永恒](/player/gameplay/progression-infinity-eternity) · [天神系统](/player/gameplay/celestials) · [挑战与真实结算](/player/gameplay/challenges) · [智能自动购买器](/player/gameplay/automation) · [2026-11-15 · R114-01 现实自动永恒复位修复](/developer/history/2026-11-15-r114-reality-autoeternity)
