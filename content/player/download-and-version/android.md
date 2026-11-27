---
title: "Android：Release、安装与升级"
description: "从官方 Release 选择 Android 包，理解签名覆盖安装并安全测试新版本"
tags:
  - 玩家
  - Android
  - 下载
  - 版本
aliases:
  - "/download-and-version/android"
---

Android 版本请从 [AD MOD Android Releases](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases) 进入。优先选择正式 Release，在发布页核对 APK 资产、版本标签和说明；不要把 Draft、预发布或失败候选当成稳定包。

## 安装前先保护存档

1. 在游戏内导出存档，并把文本或文件放到应用之外；不要只依赖自动保存。
2. 记录当前版本、游戏阶段和导出时间，避免未来拿错副本。
3. 如果要测试 Pre-release，先使用新档或备份副本，不要覆盖唯一主档。

## 覆盖安装

系统是否允许覆盖安装，不只看版本号。包名、签名和版本条件必须满足升级关系；如果系统提示无法安装，不要立刻卸载旧版，因为卸载可能同时删除本地存档。需要理解证书与升级机制时，参见[APK 签名与升级兼容](/developer/build/apk-signing)。

安装新包后先导入副本，检查维度、升级、挑战和现实进度是否合理；正常离开并重新打开后，再考虑继续使用主进度。能够启动不等于存档已经通过兼容验证，完整步骤见[存档安全](/player/gameplay/saves)。

## 不要使用来路不明的 APK

如果安装包来自他人转发，回到官方 Release 页面核对标签、资产和版本说明。不要向他人提供签名文件、密钥或本地路径，也不要在公开问题中上传包含完整进度和设置的存档。

## 出现异常时

保留原始备份、Release 标签、安装前后的版本和系统错误提示。不要通过卸载、清除数据和反复覆盖安装来“碰碰运气”；先到[玩家常见问题](/player/faq/)区分安装、升级、存档和游戏行为问题。

相关入口：[下载与版本总览](/player/download-and-version/) · [存档安全](/player/gameplay/saves) · [原版与 MOD 的区别](/player/gameplay/original-vs-mod)
