---
title: "APK 签名与升级兼容"
description: "从 APK 签名方案、密钥轮换和版本身份理解 Oreki Edition 的安装与发布门禁"
tags:
  - 构建
  - 签名
  - 发布
aliases:
  - "/build/apk-signing"
---

APK 签名解决的不是“发布前给文件盖章”，而是 Android 的两个核心问题：这个包是不是同一个应用，以及这次更新是否仍然被系统信任。包名、证书身份、`versionCode` 和签名方案一起决定安装与覆盖升级；它们都正确，也只说明系统接受这份 APK，不说明游戏一定能读取旧存档或通过真实运行验收。

本文先解释 Android 的签名模型，再落到 Oreki Edition 当前构建配置。项目里的实验脚本可以支持更多签名组合，但实验能力不等于当前 Release 策略；这条边界是本文最重要的结论。

## Android 到底签了什么

APK 外形上是 ZIP，但现代 Android 不把签名只理解为 ZIP 内文件的 JAR 清单。不同签名方案在不同位置保护 APK 内容，并由不同版本的 Android 校验。Android 官方的 [应用签名说明](https://developer.android.com/studio/publish/app-signing) 和 [`apksigner` 文档](https://developer.android.com/tools/apksigner) 是判断工具行为的依据。

### V1：JAR 签名

V1 是传统的 JAR 签名：APK 内的文件由清单、签名文件和签名块建立完整性关系。它兼容很早的 Android，但保护范围和验证方式不如 APK Signature Scheme 完整。它仍然是一个可以显式选择的兼容方案，却不应因为“以前都用 V1”就默认打开。

### V2：整包内容签名

V2 在 APK Signing Block 中对整个 APK 内容建立签名，避免了 V1 逐文件模型的一些边界问题。它要求签名后不能再改变 APK；例如重新对齐、替换资源或修改 ZIP 中央目录，都可能使签名失效。`zipalign` 必须在签名之前完成，这也是 Android 官方对 [`apksigner`](https://developer.android.com/tools/apksigner) 的明确要求。

### V3：带签名谱系的升级模型

V3 延续 V2 的整包保护，并增加签名证书轮换所需的 lineage 信息。轮换不是把新证书放进 keystore、然后期待 Android 自动理解“这是同一个应用”；系统需要一条由旧签名指向新签名的受信谱系，并且不同 API 级别要使用兼容的签名块。Android 官方的 [APK Signature Scheme v3 说明](https://source.android.com/docs/security/features/apksigning/v3) 详细描述了这一模型。

V3.1 是面向较新 Android 版本的轮换签名块。`apksigner` 可以根据 `--rotation-min-sdk-version` 决定从哪个 API 级别开始使用轮换密钥；旧平台仍要看到原签名。密钥轮换因此是兼容性设计，不是单纯的密码替换。

### V4：独立的增量安装签名

V4 生成与 APK 配对的 `.idsig` 文件，用于支持增量安装等场景。它不取代 APK 本身的 V2/V3 完整性签名，也不能脱离对应 APK 单独发布。Android 官方文档说明，V4 是侧车签名；使用 `apksigner --v4-signing-enabled only` 时，输入 APK 必须已经有兼容的 V2 或 V3 签名，而且签名密钥必须匹配。

可以用下面的关系记忆四种方案：

```text
V1：传统兼容层
V2：保护整份 APK
V3：保护整份 APK + 描述可验证的签名轮换
V4：为增量安装准备的 APK 侧车签名
```

这不是“版本越高就把前面全部替换掉”的简单阶梯。最终选择要同时考虑 `minSdk`、目标设备、升级路径、发布渠道和工具版本。

## Oreki Edition 当前配置

当前 Android 仓库的 [`app/build.gradle.kts`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/app/build.gradle.kts) 把应用身份和签名配置集中在构建逻辑中：

- `applicationId` 是 `net.oreki.antimatterdimensions`；
- `compileSdk` 和 `targetSdk` 为 37，`minSdk` 为 32；
- `versionCode`、`versionName` 从 [`scripts/release-gate-policy.json`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/scripts/release-gate-policy.json) 读取；
- Release 当前显式启用 V3，关闭 V1、V2 和 V4；
- Release 默认关闭 R8 和资源压缩；独立的 `r8` 变体才打开代码压缩实验；
- `keys/oreki.jks` 存在时才接入生产签名配置，别名为 `oreki`。

因此当前 Release 的签名结论是“V3 生产签名路径”，不是“脚本能生成的所有方案都已启用”。仓库里的 [`scripts/sign_apk_hybrid.py`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/scripts/sign_apk_hybrid.py) 可以调用官方工具生成和验证更复杂的签名组合，包括 V3.2/V4 实验输出；它是实验与验签入口，不能反推 Gradle Release 已经改成 V3.2 或 V4。

## 应用身份的三个坐标

### 包名：系统认出的应用

`applicationId` 改变后，Android 通常会把 APK 当成另一个应用。旧应用的存档、权限和覆盖安装关系不会因为显示名称相同而自动延续。Oreki Edition 的包名由发布策略约束，不能在构建脚本里随意改成临时名称后再拿去做升级测试。

### 证书：谁有权更新

覆盖安装时，系统会检查新包的签名身份是否与已安装应用兼容。仓库策略保存公开的证书 SHA-256 指纹；指纹可以用来核对身份，但不能替代 keystore、私钥或签名谱系。私钥不能进入源码、普通 PR 日志或公开构建输出。

### `versionCode`：哪一个更新更晚

`versionName` 主要给人阅读，`versionCode` 是系统和发布门禁比较新旧版本的整数。新 APK 即使签名正确，如果 `versionCode` 重复或倒退，也可能无法按预期升级。版本值应从发布策略和候选 APK 同时核对，不能只看文件名。

## 密钥轮换：先设计升级链，再生成新包

密钥轮换通常有两种原因：原密钥存在泄露风险，或希望迁移到更强的密钥。两种情况都不能靠“换一个密码”解决，因为密码只保护 keystore 的使用，应用身份由证书和签名谱系决定。

一个可审查的轮换方案应回答：

1. 旧签名是否仍能验证旧设备上的已安装版本？
2. 新签名是否通过 V3 lineage 表达为旧应用的合法后继？
3. 哪些 API 级别使用旧证书，哪些 API 级别使用轮换后的证书？
4. 新包能否覆盖安装旧包，并保留应用数据和存档？
5. 失败时能否恢复到旧的可安装版本？

`apksigner` 提供 `--lineage` 和 `rotate` 等工具路径；但“工具命令成功”不等于工程轮换完成。必须在目标 API 范围中验证覆盖安装、签名信息、权限关系和回滚策略。若应用还通过其他商店或侧载渠道分发，所有渠道都必须认识同一条身份链。

## 签名、存档与运行验收是三道门

签名正确只回答“系统允许安装”。它不回答游戏能否解析旧的 `player.json`；字段名称、泛型签名、混淆 ABI 和迁移逻辑共同决定存档是否可继续使用。一次升级验收至少应分成：旧包建立存档 → 安装新包 → 新包读取并修改存档 → 再保存并重新打开。

同样，证书指纹一致只回答“身份一致”，不回答游戏行为一致。阶段门禁、自动购买器、GUI、挑战结算和跨端行为仍需要独立的设备或 Web 验收。把这些证据混成一条“签名检查通过”会让发布链看起来很完整，却漏掉真正的玩家风险。

## 工程门禁怎样阻止错误的 Release

当前构建把签名判断放进 [`app/build.gradle.kts`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/app/build.gradle.kts) 的 `verifyReleaseSigning` 任务：

1. 有 `keys/oreki.jks` 时，Release 走生产 keystore，并由后续工具核对 APK 的包名、版本和证书指纹。
2. 没有 keystore 时，只有显式设置 `oreki.allowUnsignedReleaseExperiment=true` 才允许生成未签名隔离实验包。
3. 这个实验状态会写入构建产物的 signing disposition，并明确标记“不得发布”。它不能被 Required Check 或文件存在本身升级成生产资格。
4. `r8` 变体另有 `verifyR8SigningDisposition`，避免把 R8 实验包误当成稳定 Release。

候选 APK 还要经过项目的 [`verify_release.py`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/scripts/verify_release.py) 和官方 `apksigner verify`。发布链应继续核对 APK SHA-256、`.idsig` 是否属于同一候选（只有启用 V4 时需要）、安装升级、启动、存档和真实 GUI 行为。

可以把发布资格写成一个交集，而不是一个按钮：

```text
身份正确 ∩ 签名有效 ∩ 版本可升级 ∩ 存档可迁移
        ∩ 运行行为通过 ∩ 发布渠道拿到同一份文件
```

任意一项缺失，结论都只能停留在“签名/构建的某一层通过”，不能写成“可发布”。

## 最小排查路径

- **覆盖安装失败：** 先比较包名、证书指纹和 `versionCode`；不要先删除旧应用，否则会丢失最有价值的升级复现条件。
- **`apksigner verify` 失败：** 检查是否在签名后又运行了 `zipalign`、替换了资源或修改了 ZIP；确认 V1/V2/V3/V4 选择与目标 API 一致。
- **安装成功但读档异常：** 转到 [存档兼容排查](/developer/troubleshooting/save-compatibility)，检查序列化字段和迁移逻辑，不要把问题归咎于证书。
- **实验包被发布门禁拦截：** 保留 unsigned 或 R8 实验标记，回到 `verifyReleaseSigning`/`verifyR8SigningDisposition` 检查是否缺少生产 keystore 或明确授权。
- **不同渠道行为不同：** 比较每个渠道的 APK SHA-256；若不是同一文件，先收回分叉产物，再谈设备行为差异。

## 官方资料

- [Sign your app](https://developer.android.com/studio/publish/app-signing)
- [`apksigner` 命令行工具](https://developer.android.com/tools/apksigner)
- [APK Signature Scheme v1](https://source.android.com/docs/security/features/apksigning/v1)
- [APK Signature Scheme v2](https://source.android.com/docs/security/features/apksigning/v2)
- [APK Signature Scheme v3](https://source.android.com/docs/security/features/apksigning/v3)
- [APK Signature Scheme v4](https://source.android.com/docs/security/features/apksigning/v4)

## 相关条目

[AGP 构建管线](/developer/build/agp) · [R8 分层策略](/developer/build/r8) · [CI/CD 与受保护门禁](/developer/build/ci-cd) · [存档兼容排查](/developer/troubleshooting/save-compatibility) · [当前发布状态](/developer/current/release-status)
