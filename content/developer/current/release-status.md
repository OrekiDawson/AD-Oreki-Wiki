---
title: "发布资格：从一个 APK 到可交付版本"
description: "解释 Android 版本身份、签名、安装升级、玩法门禁与渠道交付如何共同决定一个候选能否成为正式版本"
tags:
  - 发布
  - Android
  - 版本管理
aliases:
  - "/current/release-status"
---

“APK 能安装”不是“版本可以发布”。Android 交付链把一个候选包看成一组必须同时成立的关系：版本身份指向正确的基线，签名允许正确的安装/升级，产物内容与源码和工具一致，关键玩法与存档没有回归，最后同一个已核验的 APK 才能被复制到各个交付渠道。本页讲这套判定如何工作，不把某一轮发布过程改写成时间线。

## 版本身份先于版本号大小

当前 Android 仓库把发布身份集中写在 [scripts/release-gate-policy.json](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/scripts/release-gate-policy.json)。其中明确了：

- 官方基线版本是 3.21.0；
- 当前开发身份的 versionCode 是 30210002，modVersion 是 1.0.2，状态为 development；
- 历史已发布上限是 30210001；
- 包名是 net.oreki.antimatterdimensions；
- 真实新档的目标上限是 10800 秒；
- 必需检查包括安装升级、启动、签名版本、阶段门禁、自动购买器、存档导入和 GUI；Android 与 Web 都必须有完成证据。

这些字段解决的是不同问题。versionCode 让 Android 判断升级顺序，versionName 给人看，modVersionState 则防止一个尚未完成真实验收的开发候选被误标为稳定版。版本号变大本身没有资格授予发布权限。

## 签名是升级链的一部分

Release 构建默认要求 keys/oreki.jks 存在，并由 OREKI_KS_PASS 提供密码；app/build.gradle.kts 的正式配置启用 V3 签名，关闭 V1、V2 和 V4。若只是隔离实验，可以显式打开 oreki.allowUnsignedReleaseExperiment=true，但构建脚本会把它标成未签名实验，并且它不能进入发布渠道。

排查“旧版能装、新版不能升级”时，先比较包名和证书指纹，再看签名方案和 Android 版本兼容性；不要先删除旧应用，因为那会把升级问题伪装成全新安装成功。证书指纹也应来自实际 APK 的 apksigner verify --print-certs 输出，而不是来自配置文件的预期值。

## 候选如何通过交付门

一个候选至少要经过四个相互独立的边界：

1. **产物边界。** 记录输入指纹、工具链、APK SHA-256 和大小，确保构建与验证使用的是同一个文件。Release 预算脚本的作用是拦截无输入变化的重复构建，避免“最后一次构建”在不同候选之间失去指代。
2. **平台边界。** 在目标 Android 环境安装、升级、启动并确认前台 Activity 和进程稳定。仅有 Gradle 或 CI 通过不等于 APK 在设备上可运行。
3. **游戏边界。** 验证阶段门禁、自动购买器、存档导入、GUI 和关键玩法；如果真实新档没有走到约定终点，就不能用启动成功代替终局证据。
4. **渠道边界。** 各渠道应复用同一个已核验 APK 和对应 SHA-256，而不是每个渠道重新构建一份“看起来相同”的文件。任一渠道无法核对，都只能报告部分交付。

这四层故意不合并成一个绿色按钮：签名正确不能证明存档正确，游戏跑通不能证明发布包来自当前源码，GitHub Release 存在也不能证明所有渠道都拿到了同一字节流。

## 读懂当前公开版本与开发候选

Android 仓库当前公开的稳定 Release 是 [Android 3.21.0（a12b5cd6）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases/tag/android-update-3.21.0-a12b5cd6)。其 APK AD-Oreki-Edition-3.21.0.apk 的 SHA-256 为：

a12b5cd620280465805ec844ea9a8554277e51d87d769dde4120fa5db842da87

这个事实只说明该 Release 资产可下载且身份可追溯，不自动替当前开发候选背书。开发候选必须按当前策略重新满足签名、安装升级、玩法、存档、GUI、双端和渠道门禁；历史 Release 的哈希不能移植到新 APK 上。

## 排障顺序

遇到“候选不能发布”时，按最不容易误判的顺序缩小范围：

1. 读取 release-gate-policy.json，确认包名、版本状态和必需检查没有被旧配置覆盖。
2. 对候选 APK 做 SHA-256 和 apksigner 校验，确认检查对象就是准备交付的文件。
3. 在保留旧应用的设备上做安装升级；失败时记录证书、签名方案和 Android 版本。
4. 把安装问题与游戏问题分开：先确认进程和 Activity，再定位阶段、自动购买器、存档或 GUI。
5. 最后核对每个渠道的文件大小和 SHA-256；出现分歧就回到同一个候选重新交付，而不是在渠道端“修一下”。

历史发布报告、CI 运行和渠道回执适合作为证据索引，放在[发布历史档案](/developer/history/)中；它们不应替代本页对发布资格和技术边界的解释。

## 参考资料

- [Android 发布门禁策略](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/scripts/release-gate-policy.json)
- [Android 应用构建与签名配置](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/app/build.gradle.kts)
- [当前公开稳定 Release](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases/tag/android-update-3.21.0-a12b5cd6)
- [Release 构建预算脚本](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/scripts/release_budget.py)
- [APK 签名与升级兼容](/developer/build/apk-signing)
- [CI/CD 与受保护门禁](/developer/build/ci-cd)

## 相关条目

[AGP 构建管线](/developer/build/agp) · [从脚本补丁到 AGP](/developer/build/build-mod-retirement) · [存档兼容排查](/developer/troubleshooting/save-compatibility) · [发布历史档案](/developer/history)
