---
title: "Android 构建与 AGP"
description: "从仓库根 :app 准备完整游戏输入、执行构建并判断签名与产物门禁"
tags:
  - 构建
  - AGP
  - Android
aliases:
  - "/build/agp"
---

Android 构建页最容易让人迷路的地方，不是 Gradle 命令本身，而是“能编译”与“得到可交付的完整游戏包”之间隔着几道门。当前仓库的根 `:app` 就是完整游戏应用模块；它还需要由构建逻辑准备好的游戏资源、生成绑定、原生库和签名配置。本文解释这些输入如何汇合，以及每一步成功到底能证明什么。

## 先确认当前工程入口

固定源码依据为 Android `main` Commit [`9d8fc46ce99279720b5b3068027bb76bceb35756`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/9d8fc46ce99279720b5b3068027bb76bceb35756)。当前工程的关键位置如下：

| 位置 | 作用 |
| --- | --- |
| 根 `settings.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/settings.gradle.kts；具体文件证据留在内部核验记录） | 注册唯一 Android 模块 `:app` |
| 根 `build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/build.gradle.kts；具体文件证据留在内部核验记录） | 声明 Android Gradle Plugin 9.5.2 |
| `app/build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/build.gradle.kts；具体文件证据留在内部核验记录） | 定义 SDK、ABI、source set、构建类型和签名入口 |
| `build-logic/` | 准备完整游戏输入、元数据、资源和策略门禁 |
| 根 `gradlew` / `gradlew.bat` | 从仓库根执行 Gradle |

旧文档中的 `agp/` 子工程、`-p agp`、`orekiFullGame` 和 bridge/fullGame 双工程口径不适用于这个固定版本；不要把历史命令复制到当前仓库。

## 输入怎样进入 `:app`

`app/build.gradle.kts` 通过 `local.properties` 中的 `oreki.fullGameStage` 选择完整游戏阶段目录；没有该属性时使用 `build/agp-fullgame`。随后 source set 会把以下输入加入应用：

- 阶段目录中的 `AndroidManifest.xml` 和 `res/`；
- `build/agp-generated-res` 中的生成资源；
- `build/agp-fullgame-assets` 中的游戏资源；
- `build/kt/generated` 中唯一允许的生成 Kotlin 绑定；
- `scripts/payload/lib` 中的生产 JNI 库。

这条链路像一条装配线：Kotlin 编译通过，只说明其中一个工位完成；输入缺失、资源指纹不匹配、ABI 不在正式支持范围，或签名门禁拒绝，后面的包仍应失败。不要为了让构建继续而直接写入游戏进度、替换官方基线或绕过 fail-closed 检查。

## 如何执行定向构建

命令应从 Android 仓库根目录执行。源码层面可核对的命令形态是：

~~~bash
./gradlew :app:assembleDebug --no-daemon --console=plain
~~~

这是操作入口，不是本轮实测结果。缺少 Android SDK、完整游戏阶段输入或构建缓存时，可能在配置、资源或任务执行阶段失败。Release 还要经过 `verifyReleaseSigning`；只有存在 `keys/oreki.jks` 并满足仓库签名配置，才能使用生产签名路径。未签名实验必须显式设置 `oreki.allowUnsignedReleaseExperiment=true`，实验包不得当作发布包。

当前应用配置为 `compileSdk = 37`、`targetSdk = 37`、`minSdk = 32`，正式 ABI 为 `arm64-v8a` 与 `x86_64`。这些是构建约束，不等于对应设备、完整游戏行为或存档兼容已经通过。

## 用什么标准判断结果

构建结果至少要分成四层：

1. **Gradle 任务成功**：对应任务完成，输入配置和编译/打包阶段没有报错。
2. **产物可追溯**：记录 APK、输入和必要元数据的固定 Commit、哈希与构建类型。
3. **安装或运行验证**：在匹配的 Android 环境观察启动、页面、自动化、存档和真实结算；需要独立证据。
4. **允许交付**：还要满足签名、发布渠道、Required Checks 和回滚门禁。

第一层不能推出后三层。本文没有执行 Gradle、D8/R8、APK 安装、AVD、真机、存档读写或完整游戏长跑，均为 `NOT RUN`。

## 常见故障的最短路径

- **配置阶段找不到完整游戏输入**：先检查 `oreki.fullGameStage` 的实际解析路径，再查阶段目录、`build/agp-generated-res`、`build/agp-fullgame-assets` 和 `scripts/payload/lib`。
- **资源或 Manifest 阶段失败**：核对输入是否属于同一冻结基线，不要用旧缓存或同名 APK 代替来源不明的文件。
- **Release 被签名门禁拒绝**：确认 `keys/oreki.jks` 和密码环境变量是否按仓库规则可用；不要把 unsigned 实验包上传为正式包。
- **构建成功但游戏行为异常**：回到 [Android 架构](/developer/architecture/android)，分别检查 `GameApi`、自动化调度和阶段判定；构建绿灯不能证明这些运行时路径正确。

## 相关条目

[Android 架构](/developer/architecture/android) · [签名与升级兼容](/developer/build/apk-signing) · [CI/CD 与受保护门禁](/developer/build/ci-cd) · [R8 分层策略](/developer/build/r8) · [存档兼容与自动保存](/developer/troubleshooting/save-compatibility)
