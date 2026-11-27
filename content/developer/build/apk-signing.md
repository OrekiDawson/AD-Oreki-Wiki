---
title: "APK 签名与升级兼容"
description: "从 Android 签名块、证书身份和版本号理解覆盖安装、密钥轮换与发布验签"
tags:
  - 构建
  - 签名
  - 发布
aliases:
  - "/build/apk-signing"
---

APK 的签名不是发布前贴上的装饰章，而是 Android 判断“这是不是同一个应用”的身份系统。文件内容、包名、证书和版本号共同决定它能否安装、能否覆盖旧版本，以及更新后是否仍有机会读取旧存档。

## 覆盖安装究竟在比较什么

对 Oreki Edition，当前发布策略把应用身份集中在 `scripts/release-gate-policy.json`：包名为 `net.oreki.antimatterdimensions`，原版基线为 3.21.0，证书指纹和 `versionCode` 由策略文件与发布工件共同约束。包名改变会得到另一个应用；签名身份不兼容时，Android 不会把它当成原应用的升级；`versionCode` 不能重复或倒退，否则更新排序和门禁都会出问题。

`versionName` 是给人看的版本标签，`versionCode` 是系统比较新旧的整数。当前策略中的 `30210002` 是开发中的候选身份，不能写成“已发布版本”；真正的发布上限应以已核验的公开 Release 和策略状态为准。

这三者不要混成一个字段：包名回答“是哪一个应用”，证书回答“谁有权更新它”，`versionCode` 回答“这次更新是否比旧包新”。

## 签名发生在 APK 的哪一层

APK 本质上是一个 ZIP，但 Android 签名不只是给 ZIP 里的文件附加一份 JAR 清单。现代 APK 在 ZIP 中央目录附近带有 APK Signing Block；平台按支持的签名方案验证它。`apksigner` 可以签名并验证 APK，且官方特别提醒：签名之后再修改 APK 会使签名失效，`zipalign` 必须发生在签名前（[apksigner 工具文档](https://developer.android.com/tools/apksigner)）。

工程里的 `scripts/sign_apk_hybrid.py` 因此坚持“输入未签名 → 官方工具签名 → 立即独立验签 → 成对发布 APK 与 `.idsig`”的顺序。它拒绝已经带 JAR 签名或 Signing Block 的输入，要求密钥库和密码环境变量存在，并检查预先生成的签名谱系。生产脚本不是把密码写进 Gradle，而是让受保护环境提供它。

需要特别区分“工具支持的实验路径”和“当前 Release 配置”。当前 Android `app/build.gradle.kts` 的 Release 配置启用 V3、关闭 V1/V2/V4；因此现行候选的签名结论应以 `apksigner` 实际输出和该配置为准。项目中的混合签名脚本可以作为后量子或 V4 实验的证据入口，但 V3.2、PQC 或 `.idsig` 只有在对应候选明确启用、生成并完成版本兼容验收时才成立，不能从脚本存在推断为当前发布要求。没有相同的 APK 字节和对应的 `.idsig`，V4 侧车文件也没有意义。

## 密钥轮换

密码只是打开密钥库的凭据，不是应用身份本身。真正的轮换要考虑证书谱系、旧设备支持的签名方案、更新链和回滚路径。Android 官方的应用签名文档区分上传密钥与应用签名密钥，并建议把签名信息从公开构建脚本中移出、妥善保管（[Sign your app](https://developer.android.com/studio/publish/app-signing)）。

对本项目，轮换必须先在隔离候选上验证：旧 APK 能否被新 APK 覆盖安装、支持的 API 范围能否验证新签名、签名谱系是否被工具接受、发布渠道是否仍分发同一 SHA-256。任何一项没有证据，都只能称为候选轮换，不能把它写入稳定发布结论。

## 签名和存档是两条兼容轴

签名正确只回答“系统允许安装”。它不回答游戏能否解析旧的 `player.json`。存档字段、序列化名称、混淆 ABI 和版本迁移共同决定数据能否继续使用；因此升级验收至少应分成两步：先在旧包建立存档并覆盖安装，再启动新包读取、修改和重新保存它。

同理，四渠道的 SHA-256 一致只能证明文件一致，不能证明真实游戏已经通过启动、阶段门禁、自动购买器和 GUI 验收。发布链把签名/版本验证与设备验收分开，正是为了不让一个漂亮的证书摘要替代另一类证据。

## 从构建到验签的最小路径

1. 从根项目构建目标变体；`app/build.gradle.kts` 的 `release` 只有在 `keys/oreki.jks` 存在时才接入生产签名，显式未签名实验不得发布。
2. 对 APK 运行 `apksigner verify --print-certs`，同时用 `apkanalyzer` 或 `aapt2 dump badging` 检查包名和版本身份。
3. 用项目的 `sign_apk_hybrid.py` 完成受策略约束的签名与独立验证；不要对已经签名的 APK 再次处理。
4. 计算 APK 与 `.idsig` 的 SHA-256，确认它们来自同一候选，并在测试设备上执行覆盖安装和存档读写。

排障时先分层：包名/版本错误是 manifest 或策略问题，证书不匹配是密钥或谱系问题，`apksigner` 之后摘要改变通常意味着文件被再次修改，存档失败则应转到序列化和迁移逻辑，而不是盲目换证书。

## 相关条目

[CI/CD 与受保护门禁](/developer/build/ci-cd) · [AGP 构建管线](/developer/build/agp) · [R8 分层策略](/developer/build/r8) · [存档兼容与自动保存](/player/gameplay/saves) · [发布状态](/developer/current/release-status)
