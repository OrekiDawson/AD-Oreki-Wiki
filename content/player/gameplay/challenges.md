---
title: "挑战与真实结算"
description: "解释普通、无限与永恒挑战为什么必须走原版结算入口，以及 MOD 自动化怎样在不伪造结果的前提下加速挑战"
tags:
  - 玩法
  - 挑战
aliases:
  - "/gameplay/challenges"
---


挑战是《反物质维度》中期成长的主要来源之一：玩家在额外限制下重新完成目标，以换取奖励、解锁条件与更高的成长上限。Oreki Edition 的自动化可以加速挑战，但**不能改写结算结果**——本条目解释原版结算入口、MOD 自动化的分工与验收边界。

## 挑战的类型与关系

- **普通挑战**：早期在限制条件下重新完成成长目标。
- **无限挑战（IC）**：无限层之后开放，单个挑战可多次完成。
- **永恒挑战（EC1～EC12）**：永恒层之后开放，每关最多 5 次完成；EC 的完成数与 **DS1（时间膨胀）**、现实与天神链都有关（见 [无限与永恒](/player/gameplay/progression-infinity-eternity)）。
- 部分挑战还与膨胀研究条件、二级条件（如禁用某些时间研究）绑定。

EC 不是「点一下就开始」的独立副本，而是由原版状态机判定：资源、当前是否已有 EC 在进行、**前置普通时间研究是否买上**、二级条件是否满足。缺一项，`canBeBought` 就为 false。

## 原版的挑战体系

原版把挑战分成三类，各自的入口与奖励不同：

| 类型 | 原版入口 | 奖励方向 |
| --- | --- | --- |
| 普通挑战 | 前 9 个在至少完成 1 次无限后开放；第 10～12 个需要累计 16 次无限 | 解锁并强化无限层的基础自动购买器 |
| 无限挑战（IC） | 在无限层满足各自的资源条件后进入 | 强化此前的多种机制（产量、速度、解锁等） |
| 永恒挑战（EC） | 需要足够的时间之理，并满足各自的二级条件；每关最多完成 5 次 | 强化此前机制；完成度影响后续解锁 |

[来源：社区 Wiki：Challenges](https://antimatterdimensions.wiki.gg/wiki/Challenges)

「挑战是修改过的重置层运行」这一点很关键：进入挑战会强制一次对应层级的重置，而不是在一个平行副本里打。因此自动化的挑战推进必须理解重置层级，否则会把不该清的进度清掉。

Oreki Edition 保留这套分类与奖励语义，但把「补发奖励」做成一条真实结算路径：临时抬高与原版收益函数相关的记录值 → 调用**原版收益函数** → 立刻还原，而不是直接写完成标志。见下方「为什么必须真实结算」。

## 为什么必须真实结算

「挑战完成」在原版里不是一个可以随便写的布尔值，它牵动：

- 完成次数与奖励（影响 IP/EP 产量与后续解锁）；
- 成就与阶段门禁；
- 天神系统与终局链的前置条件。

直接写完成标志、直接发资源或跳过奖励函数，会让进度「看起来推进了」但实际上与原版规则不一致，后续阶段会出现无法解释的卡死。因此 MOD 的纪律是：**自动化只加速真实流程，不改变结算语义**。

对于需要「补发历史奖励」的场合，MOD 采用的做法是：临时抬高与原版收益函数相关的记录值 → 调用**原版收益函数** → **立刻还原**。还原本身是幂等性的一部分，而不是「先改数据再假装完成」。[读码 + 实测，[FACTS §8.7](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/challenges.md#f-8-7)]

## Android 端自动化的分工

Android 3.21 的自动化已按 Kotlin 模块拆分：

| 模块 | 作用 |
| --- | --- |
| `OrekiAutomationScheduler.kt` | 全局统一节拍（1～60 秒），所有真实购买动作要经过 `allow()` |
| `OrekiStageAuto.kt` | 首次无限之后的阶段自动化（购买、升级、尝试突破） |
| `OrekiEcAutomation.kt` | 永恒挑战推进，按原版购买 ABI 调用真实入口 |
| `OrekiStrategyLeaves.kt` | 策略叶子（目标判定所需的布尔条件） |

这些文件保留了旧调用点的 ABI（`invoke-static`），因此类名与签名必须逐字一致；业务逻辑不得再写回 Smali。旧类 `OrekiChallengeAuto` 属于静默实现，缺少可观测日志，代码中专门加了探针注释用于判断「到底有没有买前置研究」。

## 验收口径

**功能性验收（已确认）**：修复混合运行时 livelock 后的同一 APK 连续运行 5 分钟，0 FATAL / 0 NoSuchFieldError / 0 NoSuchMethodError / 0 ClassCastException / 0 ANR，自动化标记持续输出。修复前该路径会在新档约 6 秒必崩 `NoSuchFieldError`。[P0 闭环报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/ae734966bf712faca3ff7bbb389d8724a8efe7e5/reports/R113-01/P0-CLOSURE.md)

**不等于通关**：5 分钟功能性验收只证明这条路径在当前 APK 上不崩、能有响应，**不证明**全部挑战族都完成了原版真实结算，也不证明 180 分钟内能通关。

**当前未验证（NOT RUN）**：在 2026-11-15 之后的构建上，普通挑战、无限挑战与 EC1～EC12 的**完整真实结算链**没有重新做逐项验收；历史轮次（R40 等）的 EC12 夹具结论只作历史证据，不当作当前版本结论。

## 已知限制与常见问题

- **EC9～EC12 买不上**：常见原因是前置普通时间研究没被买上，而不是资源墙；自动化必须按 `requirement` 主动补前置链。([FACTS §8.8](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/challenges.md#f-8-8))
- **研究树被反复清空**：多套自动化对目标 EC 的定义不一致会导致 respec 抖动，见 [现实与时间研究](/player/gameplay/reality-time-studies)。
- **静默失败**：旧实现把异常吞掉时，界面看起来「在跑」但没有任何推进；排查时要看日志标记与存档字段，而不是只看按钮。
- **不得伪造**：不能手工生成完成记录、不能直接置成就位、不能把界面显示当作结算证据。

## 如何核查

1. 读存档里的挑战完成数组与奖励字段，确认是真实结算产物。
2. 在 logcat 中确认自动化标记持续、无 ABI 异常，并核对前置研究是否被买上。
3. 用稳定构建做对照；只在真实存档上验证，不使用手工构造的「已完成」存档。

## 参考资料

- [docs/FACTS.md §8.7（挑战必须真实结算）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/challenges.md#f-8-7)
- [docs/FACTS.md §8.8（EC9～EC12 前置研究）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/challenges.md#f-8-8)
- [P0 闭环报告（5 分钟功能性验收）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/ae734966bf712faca3ff7bbb389d8724a8efe7e5/reports/R113-01/P0-CLOSURE.md)

- [社区 Wiki：Challenges](https://antimatterdimensions.wiki.gg/wiki/Challenges)
- [官方网页源码（固定 Commit）](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca)

## 相关条目

[原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod) · [无限与永恒](/player/gameplay/progression-infinity-eternity) · [现实与时间研究](/player/gameplay/reality-time-studies) · [智能自动购买器](/player/gameplay/automation) · [阶段门禁](/player/gameplay/stage-gates)
