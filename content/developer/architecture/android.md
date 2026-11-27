---
title: "Android 架构"
description: "从 Kotlin 业务入口、原版对象适配到自动化调度、阶段判定和完整游戏构建边界"
tags:
  - Android
  - 架构
aliases:
  - "/architecture/android"
---

Android 端不是从空白工程重写《反物质维度》。当前 Android 仓库的 Kotlin 业务位于 `app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/`，通过 `GameApi` 读取或调用原版运行时，再由自动化和界面模块决定何时尝试合法操作。仓库根目录的 `:app` 是实际 Android 应用模块，构建参数以当前 `app/build.gradle.kts` 和构建逻辑为准。

本文依据 Android `main` 的固定 Commit [`9d8fc46ce99279720b5b3068027bb76bceb35756`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/9d8fc46ce99279720b5b3068027bb76bceb35756)。它帮助你定位代码和理解构建边界；本文没有运行 Gradle、安装 APK 或在设备上验证完整游戏行为。

可以把这一套代码想成“两层合奏”：原版运行时负责真正改变游戏世界，Kotlin 层负责判断这一拍该不该尝试、尝试后发生了什么。调度器不是凭空制造资源的魔法棒；它更像交通指挥，能让动作错开、记录空转和失败，却不能把一辆没有油的车判成已经到站。这个比喻只帮助理解职责，具体边界仍以固定版本源码为准。

## 功能入口：先找到真正负责这件事的代码

仓库的 `settings.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/settings.gradle.kts；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 把项目命名为 `oreki-antimatterdimensions`，并只声明 `:app` 模块。根 `build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/build.gradle.kts；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 为应用模块提供 Android Gradle Plugin 9.5.2；实际应用配置在 `app/build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/build.gradle.kts；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录）。生产业务源码则在标准的 `app/src/main/kotlin/` 下，另有构建时生成的绑定目录作为输入。

修改功能时，可以按下面的任务入口寻找文件：

| 你要改的内容 | 先看哪里 | 为什么 |
| --- | --- | --- |
| 自动购买器或阶段自动化 | `OrekiStageAuto.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） | `onAutoBuyerTick()` 组织一拍内的同步、策略和动作入口 |
| 动作节拍、任务闸门和结果记账 | `OrekiAutomationScheduler.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） | `allow()`、`noteActed()`、`noteNoop()` 和 `noteFail()` 共同决定任务何时再试 |
| 侧栏或页面阶段可见性 | `OrekiGuiStage.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiGuiStage.kt；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） | 它把真实结算产物归并为统一阶段，不应由某个页面单独猜测 |
| 原版玩家、货币和自动购买器对象 | `GameApi.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） | 反射、缓存和原版对象访问集中在适配层，避免业务模块各自猜 ABI |
| 构建输入、ABI 或签名门禁 | `app/build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/build.gradle.kts；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 及 `build-logic/` | 当前完整游戏构建由根 `:app` 和构建逻辑共同准备输入 |

Android 新增或修改的业务逻辑应写在 Kotlin 业务层。原版 DEX 的类名、方法签名和存档语义属于适配边界，不应为了绕过兼容问题，在业务模块里复制一套未经核对的反射或直接改写资源、结算字段。

## 状态与调用链：一拍自动化到底做了什么

一次自动购买器 tick 从 `OrekiStageAuto.onAutoBuyerTick()`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt#L304-L341；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 开始。函数首先调用 `OrekiAutomationScheduler.beginFrame()`，清除上一帧的“已执行动作”占位，然后进行速度和界面同步检查；即使这一拍没有买到东西，也不能因此跳过 GUI 状态同步。

后面的业务分支会按阶段处理受管自动购买器、维度、挑战、永恒、膨胀、现实升级等任务。具体顺序和早退条件以当前函数为准，不要把下面的简化图当成所有分支的完整顺序：

```text
OrekiStageAuto.onAutoBuyerTick()
        │
        ├─ OrekiAutomationScheduler.beginFrame()
        ├─ GameApi.retryPendingGuiSync() / forceGuiTickSync(...)
        ├─ applyManagedAutobuyerStates(...)
        └─ runScheduled(taskId) { action() }
                 │
                 ├─ allow(taskId)
                 ├─ action()：调用真实的游戏操作
                 └─ noteActed / noteNoop / noteFail
```

`runScheduled`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt#L695-L708；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 的返回值有明确含义：动作返回 `true` 才记为 `noteActed`，返回 `false` 记为 `noteNoop`，抛出异常才进入 `noteFail`。所以“尝试购买”不等于“购买成功”。如果只看调用次数或日志中的尝试次数，不能据此判断资源已经变化。

`OrekiAutomationScheduler` 负责节拍和结果，而不是生成游戏资源。`beginFrame()`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt#L512-L518；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 为一帧清空动作名额；`allow()`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt#L649-L688；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 会检查调度器是否启用、原版自动购买器总开关、任务 ID、同帧名额、失败冷却、无操作重试和全局间隔等条件。成功动作由 `noteActed()`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt#L810-L858；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 推进全局节拍并封住本帧名额；`noteNoop()` 不推进全局节拍，`noteFail()` 则进入独立失败冷却。这个区别是排查“一个任务空转后其他任务也不动”的第一条线索。

`GameApi` 是原版对象的适配边界。它在 `GameApi.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 中缓存类、字段和方法解析，并提供玩家状态、货币、重置及自动购买器相关的读取和调用。遇到 `canEternity()`、`crunchState()` 或自动购买器状态异常时，先核对适配层解析到的原版类和当前基线，再检查调用方的前置条件；不要在每个业务模块里复制一套混淆字段访问。

## 阶段判定：页面显示依赖什么状态

`OrekiGuiStage`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiGuiStage.kt#L36-L59；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 暴露四个阶段码：尚未首次无限、无限、永恒和现实。它的 `compute()`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiGuiStage.kt#L132-L216；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 读取真实状态：是否有无限、永恒点数或大永恒记录、是否购买过永恒升级，以及现实或大现实记录。

判定顺序是现实优先于永恒，永恒优先于无限。现实结算后低层计数可能被清零，因此 `realityReached` 本身也会使 `eternityReached` 成立；`eternities` 单一字段只用于诊断，不独自决定永恒阶段。读取异常按未达成处理，避免把未知状态当成解锁。若出现“刚完成大坍缩就看到后续页面”，应先查 `OrekiGuiStage.compute()` 使用的真实结算产物，再查页面刷新和导航调用方，而不是只隐藏一个按钮。

## 构建与验证边界：当前入口是根 `:app`

当前 `:app` 是完整游戏应用模块。`app/build.gradle.kts` 的 `fullGameStage` 通过 `local.properties` 中的 `oreki.fullGameStage` 指定，未指定时使用仓库内的 `build/agp-fullgame`；同一配置还把该阶段目录的 Manifest 和资源、`build/agp-generated-res`、`build/agp-fullgame-assets` 以及 `scripts/payload/lib` 加入 Android source set。也就是说，构建是否能继续不仅取决于 Kotlin 是否编译，还取决于构建逻辑准备的完整游戏输入是否存在且匹配。

配置文件还明确了几个交付边界：`compileSdk` 和 `targetSdk` 是 37，`minSdk` 是 32，生产 ABI 过滤为 `arm64-v8a` 与 `x86_64`。Release 产物会经过 `verifyReleaseSigning`；有 `keys/oreki.jks` 才能按生产签名配置继续，未签名实验必须在 `local.properties` 中显式设置 `oreki.allowUnsignedReleaseExperiment=true`，而脚本会明确警告该包不得发布。R8 构建有独立的签名处置检查。

仓库根目录提供 `gradlew`/`gradlew.bat`。从仓库根尝试定向构建时，命令形态是：

```text
./gradlew :app:assembleDebug --no-daemon --console=plain
```

这是基于当前 Gradle 项目结构给出的操作入口，不是本次实测结果；缺少完整游戏阶段输入、Android SDK、构建缓存或其他受保护输入时，构建可能在配置或资源阶段失败。本文没有运行 Gradle、D8/R8、APK 安装、AVD、真机、存档读写或完整游戏长跑，均为 `NOT RUN`。即使构建成功，也只能说明对应构建任务和输入门禁通过，不能推出 GUI、自动化、存档兼容或真实结算已经通过。

## 排障线索：按症状回到入口

- **自动化完全没有动作**：先看 `OrekiAutomationScheduler.allow()` 的拒绝条件，尤其是调度器开关、原版自动购买器总开关、任务 ID、全局间隔和失败/无操作冷却；再确认 `onAutoBuyerTick()` 是否真的被调用。
- **某任务反复尝试但资源不变**：检查动作返回值是否为 `false`。这应记为 `noteNoop()`，不能当作购买成功；同时查看是否因错误地推进节拍而饿死了其他任务。
- **自动化动作发生但页面没更新**：检查 `GameApi.retryPendingGuiSync()`、`forceGuiTickSync()` 及其待同步状态；不要用切换页签或手动刷新掩盖同步问题。
- **阶段页面过早出现或消失**：沿 `OrekiGuiStage.compute()` 逐项核对无限、永恒升级、永恒点数、大永恒、现实和大现实字段，并确认是否把较高层现实结算后的低层清零误当成“从未完成”。
- **构建在资源或 Manifest 阶段失败**：先核对 `oreki.fullGameStage` 指向的目录及其生成输入，再检查 `build/agp-generated-res`、`build/agp-fullgame-assets` 和 `scripts/payload/lib`；不要套用历史构建参数。
- **Release 被签名门禁拒绝**：确认 `keys/oreki.jks` 和环境变量是否按仓库要求可用。未签名实验只能显式授权，不能把实验 APK 当成发布包。

## 本文依据与未完成验证

本次依据 Android `9d8fc46ce99279720b5b3068027bb76bceb35756` 直接核对了 `settings.gradle.kts`、`build.gradle.kts`、`app/build.gradle.kts`、`OrekiStageAuto.kt`、`OrekiAutomationScheduler.kt`、`OrekiGuiStage.kt` 和 `GameApi.kt`。文章只陈述这些文件能够支持的入口、字段和调用关系；Android 运行时行为、完整游戏输入的来源完整性和设备结果仍需单独验证，当前均为 `NOT VERIFIED` 或 `NOT RUN`。

进一步阅读：[第一次参与开发](/developer/first-contribution) · [Web 架构](/developer/architecture/web) · [混合运行时 ABI](/developer/architecture/kotlin-runtime) · [AGP 构建](/developer/build/agp) · [双端一致性](/developer/architecture/parity) · [故障排查](/developer/troubleshooting/)
