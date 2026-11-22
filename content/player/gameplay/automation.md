---
title: "智能自动购买器"
description: "解释 Oreki Edition 自动化的统一节拍、阶段感知、手动优先与开关托管设计"
tags:
  - 玩法
  - 自动化
aliases:
  - "/gameplay/automation"
---


Oreki Edition 的自动化不是一组每帧都去购买的脚本，而是一套分层的调度系统：它只处理当前阶段允许的操作，按目标决定优先级，并且尊重玩家的手动设置。

调度器每 1～60 秒（默认 10 秒）执行一次策略动作，不跟着游戏帧率反复抢操作。每个动作都要先通过阶段判定与 allow() 检查，确认当前阶段允许购买、且不会越阶段解锁；总开关关闭后立即停止，配置修改在下一个节拍生效。玩家手动关闭某个受管开关时，调度层不会马上覆盖，而是等到下一个节拍才按最新策略恢复——这一条是为了避免玩家刚点完就被自动逻辑改回去。所有购买都必须走原版入口并真实扣费，不能直接写资源、挑战完成或成就字段。

## 原版自动化怎样工作

原版的自动化在游戏早期就会解锁，核心概念是 **interval（间隔）** 与 **bulk（单次批量）**：

- **interval** 决定自动器多久执行一次；它不能比游戏更新率更快——移动端更新率固定约 25 毫秒，网页/Steam 可在约 33～200 毫秒之间调整。当 interval 小于更新率时，界面会显示「Instant」，表示每个 tick 都会触发。
- **bulk** 决定一次触发能买多少；例如反物质维度自动器初始为 `×1`，可升级到无限。
- 自动器不能一帧内触发多次，因此实际间隔不会小于更新率。

[来源：社区 Wiki：Automation](https://antimatterdimensions.wiki.gg/wiki/Automation)

这套机制描述的是「**原版自动器本身多快**」。它和 Oreki Edition 额外加入的「策略层多快」是两件事，见下一节。

## 模块分工（Android）

Android 端的自动化已经从历史 Smali 实现迁移到 Kotlin 业务代码，主要模块如下：

| 模块 | 职责 |
| --- | --- |
| `OrekiAutomationScheduler.kt` | 全局统一节拍；提供 `beginFrame()`、`allow(项)`、`noteActed/noteNoop/noteFail` 等接口，决定某一帧是否允许某个受管动作 |
| `OrekiStageAuto.kt` | 「首次无限之后」的阶段自动化：购买、升级、尝试突破等 14 个 public static 入口，所有真实购买动作纳入全局节拍 |
| `OrekiAutobuyerBeat.kt` | 受管项的节拍恢复：只恢复**明确受管**的工作间隔配置，不在下一帧抢写，不碰原版自动器的 `isActive` |
| `OrekiAutoEternityAdoption.kt` | 托管原版「自动永恒」开关：区分「原版 Reality 复位」与「玩家手动关闭」，后者粘滞尊重 |
| `OrekiEcAutomation.kt` | 永恒挑战推进，按原版购买入口与 ABI 调用 |
| `OrekiIu15Sprint.kt` | IU15 冲刺状态机：在干净现实窗口内拦住全部无限维度购买入口 |

这些类的 public static 方法签名必须与原调用点逐字一致（调用方都是 `invoke-static`），否则整条链失效；因此 Kotlin 实现大量使用 `object` + `@JvmStatic` 来对齐字节码形态。

## 原版自动器与 MOD 调度器的关系

可以把两层分开理解：

| 层 | 归属 | 作用 |
| --- | --- | --- |
| 原版自动购买器 | 原版游戏 | 按自己的 interval/bulk 执行购买与重置；MOD 不改变其结算语义 |
| MOD 统一调度器 | Oreki Edition 新增 | 以 1～60 秒（默认 10 秒）的节拍决定「策略动作」何时执行，避免逐帧抢操作 |
| MOD 目标驱动策略 | Oreki Edition 新增 | 根据阶段与目标决定买什么、何时重置；遵守手动优先 |

因此，「原版自动器很快」不等于「MOD 策略会每帧动手」；反过来，MOD 调度器变慢也不代表原版自动器停止工作。排查时需要说明在看哪一层。

## 手动优先与「不抢开关」

一个容易误解的点是：**自动化不应该替玩家打开原版自动器**。当前实现的纪律是：

- 只管理明确的受管项（如某些工作间隔配置），不把原版自动器的启用状态纳入策略范围；
- 玩家手动关闭「自动永恒」后，托管层必须**粘滞尊重**，直到玩家自己重新打开；
- 原版 Reality 结算会把自动永恒开关复位（这是原版设计行为，不是 MOD 写坏），MOD 托管层只负责在**确认是原版复位**时补回开关，并区分玩家手动关闭的情况。

这条区分由 `OrekiAutoEternityAdoption` 落盘到 `oreki_prefs` 实现，不依赖一次性内存标记，因此应用重启后仍然有效。Reality 复位后的补回和玩家手动关闭的粘滞语义已在 [PR #92](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/92) 合入，并有 AVD 状态变化记录。后续首次现实门槛与坍缩策略又分别在 [PR #158](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/158)、[PR #179](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/179) 修正；这些提交完成不等于所有版本的真实终局均已通过。

## 重置后的“曾完成无限”必须保留

自动化的早期门禁需要判断当前是否仍处于“第一次无限之前”。问题在于，永恒挑战和 Reality 会合法清空当前 `infinities`、IP、Break，甚至清空低层永恒计数；如果门禁只用这些**当前值**，历史进度会在重置后看起来像新档。

正确判据必须承认不可逆结算产物：大永恒次数、永恒次数和现实次数都能证明无限层曾经完成。运行期的 `OrekiStageAuto.onAutoBuyerTick()` 一旦误判为新档就会提前返回，后续挑战、Reality 与终局逻辑都不会执行。R121 KVM 新档因此先后在 EC5 后停约 649 秒、首现实后停约 570 秒；第二个停点只剩 `realities=1` 可识别。

R121 的源码修复只扩展这个只读阶段判据，不写资源、不改门槛、不跳过挑战，也没有把“已修复”扩展成“已通关”。当前证据、失败时间线与 PR 状态见 [2026-11-20 · R121 Android KVM 新档阶段推进与 P1 停滞](/developer/history/2026-11-20-r121-android-kvm)。

## 验证与已知限制

验证分几层做。功能层是同一 APK 连续运行 5 分钟，确认 0 FATAL、0 ABI 崩溃、0 ANR，并检查 logcat 里 `OREKI_SCHED`、`OREKI_ACHAUDIT`、`OREKI_GUI` 等标记持续输出。行为层要确认资源真实扣费、购买来自原版入口、阶段切换后行为正确（见 [阶段门禁](/player/gameplay/stage-gates)）。持久化层看重启与读档后的开关状态，尤其是玩家手动关闭的项不被覆盖。这些检查不能只看界面表现，最终以存档字段和日志为准。

阶段判断依赖 GUI 阶段真值（`OrekiGuiStage.kt`），而阶段判定本身出过缺陷，所以自动化是否正确首先取决于阶段判定是否正确；相关排查见 [阶段门禁](/player/gameplay/stage-gates)。部分历史模块（例如静默的 `OrekiChallengeAuto`）没有日志，只能靠额外探针观察。R121 已完成 Web 真实新档终局，但 Android 重置后阶段判据 P1 的运行复验为 **NOT RUN**（源码修复已提交，等待新构建实跑）；EC 切换固定等待 P1 的定向复验为 **PASS**（约 10 秒触发坍缩、约 30 秒恢复 Break，[固定报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/a1617a9e0d652a16ba050be25bb3f5b1a5ef1c43/reports/R121-01/R121-01-P1-break-recovery.md)），完整终局仍为 **NOT RUN**；不能用 Web 的通关时间替代 Android 自动化验收，Android 与 Web 的自动化等价性也尚未独立验收（见 [双端行为一致性](/developer/architecture/parity)）。

实际核查时，抓 logcat 确认动作经过 `allow()` 而不是逐帧直调，再对比存档中的资源与购买记录确认扣费真实发生，最后手动关闭总开关或单项配置，确认立即停止且不会被自动恢复。

## 参考资料

- [Android 仓库 Kotlin 业务目录](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/main/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki)
- [docs/FACTS.md 自动化与已修复根因](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/methodology.md#f-10)

- [社区 Wiki：Automation](https://antimatterdimensions.wiki.gg/wiki/Automation)
- [官方网页源码（固定 Commit）](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca)

## 相关条目

[原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod) · [挑战与真实结算](/player/gameplay/challenges) · [阶段门禁](/player/gameplay/stage-gates) · [存档兼容与自动保存](/player/gameplay/saves) · [双端行为一致性](/developer/architecture/parity/) · [2026-11-15 · R114-01 现实自动永恒复位修复](/developer/history/2026-11-15-r114-reality-autoeternity)
