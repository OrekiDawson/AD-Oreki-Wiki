---
title: "Android 架构"
description: "从官方 DEX 与 Kotlin 适配层，到自动购买器调度、阶段判定及 AGP 完整游戏打包"
tags:
  - Android
  - 架构
aliases:
  - "/architecture/android"
---

Android 端最需要先理解的事实是：**Oreki Edition 不是从空白 Android 工程重新实现《反物质维度》**。它以官方 Android 3.21.0 的游戏数据和运行时为基线，在受限的接口边界上增加 Kotlin 业务、自动化与界面能力，再通过独立的 AGP 流程构建 MOD。

这直接决定了代码应该写在哪里、怎么找到原版对象，以及为什么“Gradle 构建成功”可能只证明骨架包通过，不能拿来测试完整游戏。

下面以 Android 仓库 **`3b2d8284`（2026-11-22 核查）** 为源码依据。这里解释模块与调用关系，而非承诺当前每个 APK 都已通过实际设备验收。

## 先认清四个边界

| 部分 | 真实代码或输入 | 主要职责 |
| --- | --- | --- |
| **官方游戏基线** | `baseline/versions/3.21/manifest.json` 与本地经过验证的官方 APK/DEX | 提供原版游戏与真实资源、挑战、存档和结算语义 |
| **MOD Kotlin 业务层** | `app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/` | 调度、策略、阶段判定、界面同步与合法操作 |
| **原版对象适配边界** | `GameApi.kt` 与已核实的 ABI 映射 | 读取原版玩家和自动购买器状态、调用真实可用的入口 |
| **构建与打包** | `agp/`、`scripts/agp/`、基线资源和经过验证的游戏 JAR | 编译 Kotlin、准备输入、验证资源身份、打包与签名 |

Android 新增或修改的业务逻辑应继续使用 Kotlin。官方 DEX 的混淆类名、方法签名和历史转换工序不是“可以随便替换的普通业务源码”；不应靠新增 Java/Smali 业务来绕过兼容约束。

**一条关键原则：策略可以决定何时尝试操作，但游戏资源和进度仍由原版真实入口改变。** 不应该为满足性能或通关指标，直接写资源、挑战完成次数、存档标志或结局字段。

## 从一帧自动化看模块怎样协作

要理解一次自动购买尝试，先打开 [`OrekiStageAuto.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt)。它的 `onAutoBuyerTick()` 是自动化集成入口之一，而不是独立的游戏货币引擎。

该函数中的真实调用可简化为：

```text
原版自动购买器相关 tick
          │
          ▼
OrekiStageAuto.onAutoBuyerTick()
          │
          ├─ OrekiAutomationScheduler.beginFrame()
          │    初始化本帧调度状态
          │
          ├─ globalGuiTickDue() / GameApi.forceGuiTickSync(...)
          │    检查受管配置节拍，维护界面显示同步
          │
          ├─ applyManagedAutobuyerStates(...)
          │    在有效节拍按策略对账明确受管字段
          │
          └─ 对符合阶段条件的动作调用 runScheduled(...)
                    │
                    ├─ OrekiAutomationScheduler.allow(taskId)
                    ├─ 实际 action() 调用原版允许的操作
                    └─ noteActed / noteNoop / noteFail
```

这个图是对**主要控制关系**的提炼，不表示代码总是严格按上图执行完所有分支。真实函数还有挑战 C9、首次无限、IU15、佩勒、调度暂停和失败恢复等早退/特殊处理；要定位具体异常，仍应按当时分支回到源码。

### `OrekiAutomationScheduler`：控制是否轮到这个动作

[`OrekiAutomationScheduler.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt) 提供 `beginFrame()`、`allow(taskId)`、`noteActed()`、`noteNoop()`、`noteFail()` 等方法。它维护的是调度节拍、任务预约和动作结果，而不是凭空生产 IP、EP 或其他货币。

在 `runScheduled(...)` 中，先由 `allow` 判定能否尝试；动作返回 `true` 才记为确实发生了变化，返回 `false` 则记为无操作，异常单独记录失败。这个结果区分很重要：**“尝试购买”不等于“已经购买成功”**。若单纯把每次尝试当成成功动作，调度器会错误地占用节拍，导致其他任务无意义等待。

源码位置：[执行包装 `runScheduled`（约 698 行）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt#L698-L711)。

### `GameApi`：负责与官方游戏对象打交道

[`GameApi.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt) 是适配层。它包含对原版玩家对象、货币、无限、永恒、挑战和自动购买器的读取与调用，也封装了不少反射和兼容性处理。

因此，发现 `GameApi.canEternity()`、`GameApi.crunchState()` 或其他功能异常时，不能直接假定“数值比较写错了”。需要同时核对：读取对象是不是正确的原版对象、调用描述符是否仍匹配官方 DEX、当前存档是否真满足该操作条件。

不要在多个 MOD 模块里复制对混淆字段的直接反射。能复用适配层时应集中维护 ABI 映射，再按相应基线和实际运行验证。

### 受管自动购买器：配置归属不等于动作归属

[`OrekiManagedAutobuyerAuthority.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiManagedAutobuyerAuthority.kt) 提供受管字段与特定挑战策略的纯判据，`OrekiStageAuto` 再通过实际入口应用这些配置。当前代码对部分受管项的**启用状态、购买方式、间隔或阈值**执行策略对账，要求在新调度 tick 时处理，不是每一帧反复强写。

**自动永恒另有边界。** [`OrekiAutoEternityAdoption.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutoEternityAdoption.kt) 区分原版现实结算导致的开关复位与玩家主动关闭；其 `userClosed` 逻辑应尊重明确的手动关闭。不能把普通受管字段“下一 tick 恢复”概括成所有自动购买器一律重开。

代码里较早的注释可能记录过相反的历史规则。判断当前行为必须读实际执行条件，尤其是 `applyManagedAutobuyerStates` 与自动永恒托管代码，而不是只看某次 R 编号。

## 阶段门禁如何避免“第一次大坍缩就看见永恒”？

[`OrekiGuiStage.kt`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiGuiStage.kt) 负责把玩家已达成的进度转成统一阶段结论。它用 `PHASE_BEFORE_FIRST_INFINITY`、`PHASE_INFINITY`、`PHASE_ETERNITY`、`PHASE_REALITY` 四个整型阶段码，而不是仅凭一个画面入口推断进度。

它的 `compute()` 会检查：

- 无限是否真正达到；
- 永恒点数是否为正、历史大永恒计数是否为正、是否已有永恒升级；
- 现实计数或历史大现实计数是否为正。

现实已经达成时，也被视为越过永恒阶段，因为更高层重置可能清空低层计数。相反，`eternities` 的单一字段仅用于诊断，不独自决定永恒页是否解锁。关键读取失败时按未到达处理，避免把未知状态当作已解锁。

这里特意不再调用某些已经被替换的原版阶段判据，以避免“原版判据 → MOD 阶段刷新 → 原版判据”的递归环。**代码中实现了这些防护，不等于最新构建已完成所有 GUI 与存档场景复验。** 如要修门禁，既需核对纯判据，也要用实际存档检查侧栏、底栏、按钮及非法直达后的恢复。

参考：[阶段计算源码（约 132–216 行）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiGuiStage.kt#L132-L216) · [GUI 技术资料](/developer/architecture/)。

## AGP 为什么有两种构建模式？

Android 仓库的 Gradle Wrapper 从仓库根调用，而实际 Android Gradle Plugin 工程在 `agp/`。[`agp/settings.gradle.kts`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/agp/settings.gradle.kts) 注册 `:app`，[`agp/build.gradle.kts`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/agp/build.gradle.kts) 声明 AGP **9.5.1**。

在 [`agp/app/build.gradle.kts`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/agp/app/build.gradle.kts) 中，`orekiFullGame` 默认为 `false`。这两个模式不能混淆：

| 模式 | 触发方式 | 实际含义 |
| --- | --- | --- |
| bridge / 骨架包（默认） | 不传 `orekiFullGame` | 使用骨架 Application ID `kajfosz.antimatterdimensions.agpbridge`，检查工程/适配层能否构建；**不是完整可玩的官方游戏** |
| fullGame 完整游戏 | `-PorekiFullGame=true` 并提供 `-PorekiGameJar=...` | 使用 MOD Application ID `com.oreki.antimatterdimensions`，还需匹配的官方 base/split 输入、资源指纹、Manifest 和构建门禁 |

仅做默认模式的**本地候选构建**：

```bash
./gradlew -p agp :app:assembleRelease --offline --no-daemon --console=plain
```

如果有已经验证的游戏 JAR 及完整基线输入，完整模式的命令形态是：

```bash
GAME_JAR=/absolute/path/to/verified-game.jar
./gradlew -p agp :app:assembleRelease \
  -PorekiFullGame=true -PorekiGameJar="$GAME_JAR" \
  --offline --no-daemon --console=plain
```

**上面是命令形态，不是本次实测。** `/absolute/path/to/verified-game.jar` 是必须由开发者自行提供的真实、可追溯输入示意值，不能直接照抄运行；缺少该输入时会拒绝进入完整模式。官方 base 和 mdpi split 的对应输入仍需按构建脚本及交付规则准备，绝不能从旧缓存或任意同名 APK 猜测其来源。

构建源码还会校验官方包名与 MOD Application ID、Manifest、资源数量、stable IDs 和来源指纹；对不上就应失败。它们是**输入可信度与打包完整性的门禁**，不能证明游戏挑战结算、存档兼容、全部页面或 180 分钟终局都已通过。

完整构建执行顺序、签名和验证请以[AGP 构建管线](/developer/build/agp)、[签名与升级兼容](/developer/build/apk-signing)和[交付规则](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/3b2d8284f2aca7132168998ee32497b3c4c17b8e/docs/DELIVERY_RULES.md)为准。

## 真正修改时从哪里定位？

想改自动购买器节奏，先看 `OrekiAutomationScheduler.kt` 中的 `allow` 和节拍计算，再看 `OrekiStageAuto.kt` 的执行顺序与结果记账；不要只调低某个 interval 就认为性能或公平性得到改善。

想改 GUI 阶段可见性，先看 `OrekiGuiStage.kt` 的真实结算判据，再查实际页面刷新和导航使用这些判据的位置。遇到“刚大坍缩就显示永恒”，不能用隐藏按钮掩盖错误的阶段真值。

想改构建，先看 `agp/app/build.gradle.kts` 的两种模式，再查 `scripts/agp/` 和候选工作流。不要为了方便直接修改官方冻结 DEX、签名或构建输入来源。

想修存档，先查当前适配层和原版的真实读写入口，准备**脱敏的代表性存档**做定向验证；不能把“能导入”直接理解为“能保存、重启并在两端互通”。

## 这篇文章验证到了哪一步？

已直接阅读 Android Commit `3b2d8284` 的 Kotlin 文件、AGP 设置和应用 Gradle 配置，核对上述文件、函数、属性、Application ID 和主要调用关系。**本次未执行 Gradle、D8、DEX 转换、APK 安装、AVD、真机、存档读写或完整游戏长跑，均为 `NOT RUN`。**

如果当前 `main` 已继续变化，请先读取其新的 `AGENTS.md`、`agp/app/build.gradle.kts` 与对应 Kotlin 实现，再决定是否沿用这些说明。旧版经过验证不意味着最新候选也已通过同一门禁。

## 进一步阅读

[第一次参与开发](/developer/first-contribution) · [Web 架构](/developer/architecture/web) · [混合运行时 ABI](/developer/architecture/kotlin-runtime) · [AGP 构建](/developer/build/agp) · [双端一致性](/developer/architecture/parity) · [故障排查](/developer/troubleshooting/)
