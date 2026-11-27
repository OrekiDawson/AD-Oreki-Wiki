---
title: "CI/CD"
description: "用 Gradle、GitHub Actions 和受保护环境把公开检查、候选构建、验签与发布串成可追溯的交付链"
tags:
  - CI
  - 发布
  - 构建
aliases:
  - "/build/ci-cd"
---

一条可靠的 Android 发布流水线，不是把“构建 APK”塞进一个更大的脚本，而是把不同信任等级的工作拆开：公开代码可以被任意拉取和检查，私钥只能在受保护环境中使用，发布只能消费已经核验过的那一个产物。这样做的好处很朴素——出了问题时，我们知道是在“造包”、在“验包”，还是在“送包”，而不是对着一条红色流水线猜测。

本文以 Oreki Edition 当前 Android 仓库为例，解释这条链为什么这样分层，以及如何定位失败。它描述的是工程设计，不是某次 Run 的成绩单。

## 从 Gradle 任务到发布产物

Gradle 先把工程变成任务图，再执行任务。官方定义的三个阶段是初始化、配置和执行：`settings.gradle.kts` 决定参与构建的项目，构建脚本注册插件、变体和任务，最后才运行诸如 `:app:assembleDebug` 或 `:app:assembleRelease` 的任务图（[Gradle Build Lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html)）。

当前工程的入口很小但含义明确：`settings.gradle.kts` 只包含根项目和 `:app`，并以 `includeBuild("build-logic")` 引入本地约定插件。`app/build.gradle.kts` 再把生成的 Kotlin、游戏输入、资源、Manifest 与 JNI 库接到 `main` source set；因此“找到 Gradle 文件”不等于“输入已经齐全”。完整游戏输入和机器上的 `local.properties` 仍是构建是否可执行的前置条件。

可以把产物链想成四个相邻的房间：

1. **源码房间**：Kotlin、构建逻辑、测试和策略文件接受公开检查。
2. **候选房间**：在固定源码 SHA 上准备完整游戏输入，生成 APK 与元数据。
3. **验证房间**：另一个作业重新计算 APK/证书摘要，检查版本、签名和运行验收收据。
4. **发布房间**：只接收验证房间认可的文件，把同一份 APK 发布到渠道。

这不是形式上的多几个 YAML 文件，而是把“能编译”与“值得交付”分成不同的证明。

## 四层流水线各自证明什么

### 公开源码 CI：证明代码可被检查

`.github/workflows/ci.yml` 的 `source-policy` 运行 Python 契约测试、Gradle 配置 smoke test、工作流 lint、构建脚本语法检查、目录与 ABI 守卫等。它可以证明仓库里的公开规则和构建配置没有违反契约，却不能凭空获得冻结的完整游戏输入，也不能替代设备上的启动、存档或阶段测试。

因此 Required Check 通过时，准确的解释是“公开源码门禁通过”。它不是“APK 已签名”，更不是“玩家已经完成真实验收”。

### 候选构建：把输入和源码钉在一起

`candidate-unified.yml` 面向一个精确的 `main` SHA。它先检查 `game-final.jar`、官方解码树和 mdpi split 等冻结输入是否存在，再执行根项目的 Gradle 任务和 ABI/DEX 契约。缺少这些输入时，完整游戏 APK 应被记为未运行，而不是用一个容易构建的空壳包制造成功假象。

候选产物应同时携带能回答以下问题的元数据：它从哪个源码 SHA 来、使用哪个 Web 引用、版本身份是什么、APK 的 SHA-256 是什么。没有这些绑定，后续“验证了 APK”可能只是验证了另一份同名文件。

### 独立验证：重新看同一个文件

`verify-unified.yml` 不重新相信构建步骤的口头输出，而是下载候选工件，校验 `SHA256SUMS.txt`，检查包名、版本和签名，并读取独立验收收据。它的价值类似验钞机：不能生产钞票，但能防止发布环节把另一张纸当成刚才那张。

### 发布门禁：把证据绑定到动作

`release-gate-unified.yml` 先确认候选 Run 和验证 Run 是不同且成功的作业，再确认验收文件属于可信的公开提交历史，最后才允许 `release-unified.yml` 使用受保护的 `stable-release` 环境。发布作业使用同一 APK 的 SHA-256，并把 GitHub Release、云端渠道和本地拉取状态分开记录。

GitHub Actions 的 environment protection rule 会在作业获得环境批准前阻止它访问该环境的 secrets（[GitHub Environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)）。所以私钥和上传凭据不应放在普通 PR 作业里；公开 PR 可以检查脚本，却不应获得生产签名能力。

## 如何定位失败

先问失败发生在哪个房间，再选择证据：

- **源码检查失败**：先看失败测试、脚本行号和差异范围。修改规则或测试使其“变绿”不是修复，必须说明被守护的契约为何仍成立。
- **候选构建失败**：区分 Gradle 配置错误、输入缺失、ABI/DEX 守卫失败和真正的编译错误。尤其不要把“专有输入不存在”解释成 Kotlin 编译成功。
- **验证失败**：先比较候选文件的 SHA-256、版本元数据和证书摘要；若文件摘要不同，继续看签名没有意义。
- **发布门禁等待**：`waiting` 通常表示环境审批或外部保护规则尚未满足，不等于失败；但未获批准前也不能称为已发布。
- **渠道不一致**：把每个渠道的摘要与候选摘要逐一比较。任何一个渠道不是同一文件，都应阻断该次发布，而不是用“多数渠道成功”掩盖分叉。

## 修改流水线时的工程边界

新任务应先画出输入、输出和信任边界，再修改工作流。任务之间用明确的工件和 SHA 连接；密钥只通过受保护环境注入；日志记录足以复现的版本和摘要，但不泄露密码、私钥或完整 secrets。任何“跳过步骤”的优化都必须证明它没有把独立验证降级成自证。

本项目的完整游戏构建、签名和设备验收是否实际运行，必须以对应 Run 与收据为准；本文不把本地 `gradlew help` 或公开 CI 结果扩展成发布结论。

## 相关条目

[AGP 构建管线](/developer/build/agp) · [APK 签名与升级兼容](/developer/build/apk-signing) · [R8 分层策略](/developer/build/r8) · [Android 架构](/developer/architecture/android) · [发布状态](/developer/current/release-status)
