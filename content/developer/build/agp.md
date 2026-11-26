---
title: "AGP 构建管线：从源码到 APK"
description: "沿着 Oreki Edition 的真实 Gradle 配置，理解 :app 如何组装完整游戏、编译变体、签名并产出 APK"
tags:
  - 开发者
  - Android
  - AGP
  - 构建
aliases:
  - "/build/agp"
---

Android 的构建不是“把 Kotlin 编译一下”。对 Oreki Edition 来说，APK 是一条装配线的终点：Gradle 先决定项目和插件，AGP 再为某个变体合并源码、资源、Manifest 与原生库，最后才进入打包和签名。任何一层输入不完整，得到的都可能只是一个能安装、却不是完整游戏的壳。

本文以 Android 仓库固定基线 [`9d8fc46`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/9d8fc46ce99279720b5b3068027bb76bceb35756) 为例。若你正在研究其他 Commit，先替换文中的链接和事实，不要把历史目录结构当成当前工程入口。

## Gradle 先回答三个问题

从仓库根目录开始，Gradle 的配置顺序大致是：

1. [`settings.gradle.kts`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/settings.gradle.kts) 通过 `include(":app")` 注册唯一 Android 应用模块，并用 `includeBuild("build-logic")` 加载本地约定插件。
2. 根 [`build.gradle.kts`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/build.gradle.kts) 声明 `com.android.application` 版本 `9.5.2`，但不直接应用到根项目。
3. [`app/build.gradle.kts`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/9d8fc46ce99279720b5b3068027bb76bceb35756/app/build.gradle.kts) 应用 Android 插件和 `oreki.android.*` 约定插件，随后配置 Android DSL、source set、build type、签名和验证任务。

这解释了一个常见误会：`build-logic/` 不是第二个游戏 App，`app/` 也不是只放 MOD 代码的桥接模块。当前配置把根 `:app` 定义为完整游戏应用；机器相关的完整游戏输入由 `local.properties` 和 `build-logic` 解析。

## 一个 APK 是怎样被组装出来的

`app/build.gradle.kts` 先从 `scripts/release-gate-policy.json` 读取版本身份，再解析几个输入：

- `oreki.fullGameStage`：完整游戏阶段目录；未设置时回退到 `build/agp-fullgame`；
- `build/kt/generated`：唯一允许加入主 source set 的生成 Kotlin 绑定；
- `build/agp-generated-res`：构建期生成资源；
- `build/agp-fullgame-assets`：游戏资源；
- `scripts/payload/lib`：随 APK 打包的 JNI 库。

然后 `sourceSets["main"]` 把阶段目录中的 `AndroidManifest.xml`、`res/`，以及上述生成资源、assets 和 JNI 目录接入 AGP。换句话说，Kotlin 源码只是程序输入的一部分；Manifest 决定组件入口，资源决定界面与资源表，assets 承载游戏数据，JNI 则是运行时的另一条 ABI 边界。

可以把变体生命周期画成这样：

```text
settings.gradle.kts
        ↓ 发现 :app 与 build-logic
app/build.gradle.kts
        ↓ 解析版本、阶段输入、source set 与 build type
源码 + 生成 Kotlin + res/assets/Manifest + JNI
        ↓ Java/Kotlin 编译、资源处理、合并 Manifest、DEX 转换
debug / release / r8 变体
        ↓ package、校验签名处置、输出 APK
```

AGP 的价值在于把这些输入映射到标准任务图，而不是替开发者维护一套手工 APK 拼装脚本。修改输入位置时，应先确认它属于源码、生成物、资源、assets 还是 JNI；把文件塞进“看起来能被找到”的目录，往往只会制造一个不稳定的隐式依赖。

## 三种变体不是三种发布许可

当前配置中的 `debug` 只追加 `.debug` application ID，适合开发安装；`release` 关闭代码压缩和资源压缩：`isMinifyEnabled = false`、`isShrinkResources = false`。这不是忘记配置 R8，而是将稳定发布路径与独立优化实验分开。

`r8` 通过 `initWith(getByName("release"))` 继承 Release，再打开 `isMinifyEnabled = true`。因此它共享大部分应用配置，却不应被当作正式 Release 的替代品。R8 的输入边界、keep 规则和签名处置见 [R8 专题](/developer/build/r8)。

## 签名门禁为什么在构建脚本里

Release 变体只有在 `keys/oreki.jks` 存在时才绑定 `release` signing config，并使用 `OREKI_KS_PASS` 提供密码；配置启用 V3 签名，关闭 V1、V2 与 V4。`packageRelease` 依赖 `verifyReleaseSigning`：没有密钥时，只有明确设置 `oreki.allowUnsignedReleaseExperiment=true` 才允许生成隔离实验包，而且脚本会把它标为不可发布的 unsigned experiment。

`packageR8` 同样依赖 `verifyR8SigningDisposition`。这是一项设计取舍：签名不是构建末尾才补上的装饰，而是产物身份的一部分；实验开关必须显式写入本机配置，避免“本地能打包”被误读成“可以交付”。

## 从仓库根执行与判断结果

在 Android 仓库根目录执行定向任务：

```bash
./gradlew :app:assembleDebug --no-daemon --console=plain
```

想观察任务图而不执行，可先使用：

```bash
./gradlew :app:assembleDebug --dry-run --console=plain
```

这两条命令是操作入口，不代表本文已经替你跑过完整 APK 构建。成功的 Gradle 任务只证明配置、编译和打包阶段没有报错；它不证明 APK 已安装、游戏能启动、存档能读写或自动化结算正确。Release 和 R8 还必须分别核对签名处置文件与最终 APK 的证书。

## 排障要从最早的失败层开始

**配置阶段失败**：先看 `local.properties` 是否把 `oreki.fullGameStage` 指向存在的目录，再检查默认的 `build/agp-fullgame` 是否包含 Manifest 和 `res/`。不要把旧的 `agp/` 子工程、`-p agp` 命令或历史 `bridge/fullGame` 目录重新带回来。

**资源或 Manifest 合并失败**：确认阶段输入、生成资源和版本身份来自同一冻结基线。Manifest 错误优先看组件类名与资源引用；不要先清理缓存掩盖输入漂移。

**编译成功但 APK 不完整**：对照 APK 内的 Manifest、assets、`lib/arm64-v8a` 和 `lib/x86_64`，再检查 `build/kt/generated` 是否是本次构建生成的绑定。当前正式 ABI 在配置中明确为 `arm64-v8a` 与 `x86_64`，`compileSdk`/`targetSdk` 为 37，`minSdk` 为 32。

**Release 被拒绝**：先判断是缺少 `keys/oreki.jks`，还是密码环境变量不可用。只有隔离实验才可显式允许 unsigned；不能把实验 APK 上传到正式渠道。

**APK 能安装但游戏行为异常**：构建链只能证明产物被组装出来。回到[Android 架构](/developer/architecture/android)，分别验证 GameApi 反射、Kotlin/Smali 桥、存档和自动化调度；构建成功不能替代运行时证据。

## 这个设计值得带走的经验

把“完整输入”放在构建逻辑中、把 `:app` 留在标准 AGP 生命周期里，是为了让 APK 仍能被普通 Android 工具理解；把 R8 和签名实验做成独立变体与任务门禁，是为了让高风险优化不会悄悄改变发布路径。以后迁移 AGP 或增加资源生成器时，最重要的不是复制旧命令，而是重新画出输入、变体、产物和证书之间的边界。

## 相关条目

[R8：代码压缩与运行时边界](/developer/build/r8) · [APK 签名与升级兼容](/developer/build/apk-signing) · [CI/CD 与受保护门禁](/developer/build/ci-cd) · [Android 架构](/developer/architecture/android) · [DEX 与 ABI](/developer/reverse-engineering/dex-abi)
