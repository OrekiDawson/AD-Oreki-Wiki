---
title: "Android 工程为什么要回到根目录"
description: "从旧的脚本源码树迁移到根级 AGP 工程：目录、Source Set 与构建输入如何重新对齐"
tags:
  - Android
  - AGP
  - 工程结构
aliases:
  - "/architecture/directory-migration"
---

Android 工程的目录不是收纳箱，而是构建系统的一张地图。地图画错时，开发者看到的文件和 AGP 实际编译的文件可能不是同一批；最危险的情况是代码“明明改了”，APK 却仍然运行旧输入。

本 MOD 曾同时保留脚本生成的 Kotlin 树、嵌套 AGP 工程和补丁资产。目录迁移的真正目标不是把文件摆得更整齐，而是让三个问题有唯一答案：生产代码在哪里，Gradle 从哪里取它，最终 APK 能否追溯到这些输入。

## 工程地图

当前 Android 仓库的 `settings.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/settings.gradle.kts） 只注册根项目和 `:app`，并通过 `includeBuild("build-logic")` 加载本地约定插件。根 `build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/build.gradle.kts） 提供 Android Gradle Plugin；真正决定 SDK、变体、Source Set 和签名策略的是 `app/build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/build.gradle.kts）。

生产 Kotlin 的规范位置是：

```text
app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/
```

这里的“规范”有一个容易忽略的含义：目录本身并不会让 Kotlin 自动进入 APK，AGP 仍要在 `main` Source Set 中注册它；反过来，Source Set 也不应继续把已退役的旧目录偷偷加入编译。当前目录策略文件 `scripts/agp/directory-layout.json`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/scripts/agp/directory-layout.json） 标记为 `root`，布局守卫 `scripts/check_directory_layout.py`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/scripts/check_directory_layout.py） 会检查这一点。

## 输入边界

一次可靠的迁移至少要同时处理四条边：

1. **源码边界**：将生产 Kotlin 放入 `app/src/main/kotlin/`，不让旧 `scripts/payload/kotlin` 与新目录产生同名类。
2. **构建边界**：让 `app/build.gradle.kts` 的 Source Set、生成绑定目录和完整游戏资源各自有明确职责。
3. **工具边界**：命名守卫、绑定生成、R8 保留规则和 CI 路径过滤不能继续假定旧目录。
4. **证据边界**：迁移前后的构建输入与 APK 指纹必须能够比较；“文件移动成功”不是运行正确的证明。

当前 `main` Source Set 一方面编译手写的 `app/src/main/kotlin/`，另一方面只额外接入构建时生成的 `build/kt/generated`。完整游戏的 Manifest、资源、assets 和 JNI 库则分别来自 `oreki.fullGameStage` 指向的阶段目录、生成资源目录、完整游戏资产目录和 `scripts/payload/lib`。把这些输入混成一个“源码目录”会让排障变得困难：Kotlin 编译通过，只能说明 Kotlin 输入可用，不能说明游戏资源或 JNI 输入齐全。

## 为什么要从旧树迁走

旧布局最容易制造两种假象。第一种是重复类：旧目录和新目录各有一份同名 Kotlin，Gradle 可能在编译阶段报重复，也可能因为 Source Set 配置变化而悄悄换用另一份。第二种是错觉：开发者编辑了 `app/src/main/kotlin/`，但某个脚本仍从旧树生成或复制文件，最后看到的 APK 与编辑内容脱节。

因此迁移期间不能只改目录。每次移动都要反查消费者：`sourceSets`、生成脚本、绑定表、R8 keep 规则、CI 路径过滤和教程命令。迁移记录中曾使用 `git mv` 保留文件历史，并以目录守卫确认旧树与新树没有重叠；这些历史证据可从  [Android Issue #61](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/61)、[PR #83](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/83)  和  [PR #84](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/84)  追溯，但它们是迁移证据，不是今天构建成功的替代品。

## 修改目录时怎样保持可追溯

先从仓库根目录确认实际阶段和活动 Source Set，再移动一小组具有同一依赖边界的文件。移动后至少检查：

```bash
python scripts/check_directory_layout.py
git diff --find-renames --stat
git diff --check
```

守卫通过只说明目录契约满足；`git diff --find-renames` 用来确认这确实是移动而不是删除后重写；`git diff --check` 只检查格式。若要证明行为未变，还需用同一套完整游戏输入构建并比较产物，不能用一个空壳或缺少游戏 JAR 的构建代替。

迁移后新增 Kotlin 应直接放在规范目录，并让调用方依赖语义化的适配层，例如 `GameApi.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt），不要把旧目录名或混淆类名继续扩散到业务代码中。这样目录迁移和 ABI 迁移才不会互相打架。

## 常见故障

遇到“源码能找到、运行时没有变化”，按输入链缩小范围：

- **文件在旧目录**：确认文件位于 `app/src/main/kotlin/`，并检查 `app/build.gradle.kts` 是否仍存在指向旧树的 Source Set。
- **生成绑定缺失**：确认绑定是否写入 `build/kt/generated`，以及输入是否来自当前版本的绑定数据。
- **资源或 JNI 缺失**：检查 `oreki.fullGameStage` 指向的 Manifest、资源和 assets 是否完整；这类失败不是目录迁移本身能修复的。
- **反射功能失效**：转到 [混合运行时 ABI](/developer/architecture/kotlin-runtime)，检查 `GameApi` 的版本映射与日志，而不要继续移动文件。

## 相关资料与边界

本文依据 Android `9d8fc46ce99279720b5b3068027bb76bceb35756` 的根工程、Source Set、目录策略和守卫源码撰写。旧 URL `/architecture/directory-migration` 保留为兼容别名，规范入口是本文；目录迁移已经进入根工程阶段，但完整 APK 的输入准备、签名和设备运行仍是独立门禁。

[Android 架构](/developer/architecture/android) · [AGP 构建管线](/developer/build/agp) · [混合运行时 ABI](/developer/architecture/kotlin-runtime) · [build_mod.py 退役](/developer/build/build-mod-retirement)
