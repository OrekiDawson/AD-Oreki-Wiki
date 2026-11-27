---
title: "第一次参与 Android 开发"
description: "从根级 AGP 工程完成一次可解释的源码阅读、构建检查与最小改动"
tags:
  - 开发入门
  - Android
  - AGP
  - Git
---

第一次参与这个项目，不必从反编译整套官方 DEX 开始。更稳妥的练习是：拿到 Android 仓库，认出真正的构建入口，沿着一条 Kotlin 调用链读到原版适配层，再做一个有事实依据的小改动。这样你学到的是项目如何工作，而不是只记住几个目录名。

本文以 Android `main` 的 [`9d8fc46`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/9d8fc46ce99279720b5b3068027bb76bceb35756) 为源码基线。命令适合在仓库根目录执行；构建是否能继续取决于本机 Android SDK、JDK 17、Gradle 输入和权限，本文作者没有把读码结果冒充设备运行结果。

## 先认出真正的工程入口

克隆仓库后，先不要急着找某个“主类”：

```bash
git clone https://github.com/OrekiDawson/AD-Oreki-Edition-Android.git
cd AD-Oreki-Edition-Android
git status --short
git rev-parse HEAD
```

当前根 `settings.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/settings.gradle.kts；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 只包含 `:app`，并引入 `build-logic`。因此生产应用的第一观察点是根 `:app`，不是历史上的嵌套 `agp/` 目录。接着阅读 `app/build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/build.gradle.kts；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录）：这里能看到 SDK、ABI、变体、签名、生成 Kotlin 和完整游戏资源是怎样接进 APK 的。

环境检查可以先做成只读动作：

```bash
java -version
./gradlew --version
python --version
```

Windows PowerShell 使用 `./gradlew.bat --version`。项目的 Kotlin/Java 编译目标是 Java 17；`compileSdk`、`targetSdk`、`minSdk` 和 ABI 以当前 `app/build.gradle.kts` 为准，不要照抄旧文章里的数字。

## 读一条比目录更有用的调用链

从 `OrekiStageAuto.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiStageAuto.kt；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 的自动购买 tick 开始，关注三个问题：谁决定现在能不能动作，谁调用原版对象，谁把结果告诉下一次 tick。

调度器 `OrekiAutomationScheduler.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 只负责节拍和闸门。调用方先通过 `allow(taskId)` 请求名额，真实动作发生后调用 `noteActed`；没有满足原版条件时使用 `noteNoop`，异常则进入失败冷却。于是“调度器允许尝试”和“游戏真的买到东西”是两个不同事实。

原版对象则由 `GameApi.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt；[固定提交 9d8fc46](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/9d8fc46ce99279720b5b3068027bb76bceb35756)；具体文件证据留在内部核验记录） 适配。因为官方游戏类来自 DEX，MOD 的 Kotlin 不能在普通编译期直接引用完整类型；`GameApi` 集中解析并缓存类、字段和方法，把混淆名与版本差异挡在边界内。修改自动化策略时，优先调用这个语义层，不要在新文件里复制 `Class.forName` 或散落混淆字段。

这条链的阅读结果应该能用一句话说清：

```text
OrekiStageAuto 的 tick → Scheduler 闸门 → GameApi 原版调用 → noteActed/noteNoop/noteFail
```

如果你只能说“我改了一个 Kotlin 文件”，还没有真正理解改动会影响什么。

## 做一个安全的最小改动

第一次改动建议选择有明确来源的开发者文档或诊断日志说明，而不是直接改资源、重置逻辑、签名配置或存档格式。建立分支并在提交前核对：

```bash
git switch -c docs/first-android-contribution
git diff --check
git diff -- app/src/main/kotlin/kajfosz/antimatterdimensions/oreki
```

若修改了 Kotlin，至少解释它为什么属于 `app/src/main/kotlin/`、调用了哪一个适配层、在失败时怎样保持安全。若涉及调度器，尤其要说明 `no-op` 是否推进全局节拍；把一次“返回 true”当成“动作成功”是这类代码最常见的误读。

对构建先做与改动相称的验证。没有完整游戏输入时，可以先运行 Gradle 任务列表或静态检查；不要把缺少 `oreki.fullGameStage`、生成绑定或签名密钥导致的失败隐藏掉：

```bash
./gradlew :app:tasks
./gradlew :app:assembleDebug
git diff --check
```

当前根 `:app` 是完整游戏应用模块。`assembleDebug` 仍需要构建逻辑能找到完整游戏 Manifest、资源、assets、JNI 库和生成绑定；它不是一个与游戏无关的空壳示例。Release 还会检查 `keys/oreki.jks`，没有生产密钥时只能做明确标记的未签名实验，不能发布。

提交信息和 PR 描述要回答三个实际问题：改了什么行为或说明，用哪个源码版本核对，执行了哪些验证。只做静态读码就写静态读码；没有安装、启动、AVD 或完整通关，就不要使用这些词替代证据。

## 出现故障时先分层

- **Gradle 找不到任务或模块**：先看根 `settings.gradle.kts` 与 `build-logic`，不要从旧 `agp/` 路径猜命令。
- **Kotlin 编译找不到官方游戏类**：检查你是否绕过了 `GameApi`，或误以为 DEX 会自动成为 `kotlinc` 的类型输入。
- **APK 能构建但自动化不动**：按 `allow` → 原版前置 → `noteActed/noteNoop/noteFail` 顺序查，不要先改间隔上限。
- **Release 被拒绝**：检查 `keys/oreki.jks` 和 `local.properties` 的显式实验开关；签名门禁是交付保护，不是构建噪声。

本文作者自检：源码路径和调用关系已对照 Android `9d8fc46` 的 `settings.gradle.kts`、`app/build.gradle.kts`、`OrekiStageAuto.kt`、`OrekiAutomationScheduler.kt`、`GameApi.kt`；命令按当前工程结构撰写。作者环境未执行克隆、Gradle 构建、APK 安装、AVD 启动或真实游戏运行，读者应把这些步骤作为待执行验证，而不是历史 PASS。

[Android 架构](/developer/architecture/android) · [Android 工程目录迁移](/developer/architecture/directory-migration) · [AGP 构建管线](/developer/build/agp) · [混合运行时 ABI](/developer/architecture/kotlin-runtime)
