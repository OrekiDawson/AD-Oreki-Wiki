---
title: "下载与版本说明"
description: "Android APK、Web 站点、源码仓库、版本辨识与存档备份的玩家入口"
tags:
  - 下载
  - 版本
  - 玩家
---

下载前先确认平台和版本。正式 Android 版本从 GitHub Releases 发布；Web 版通过独立站点提供，源码与部署记录保留在 GitHub。预发布、Draft、失败候选或旧构建不能因为“能安装”就被当作当前稳定版本。

## Android

- [Android 正式 Releases](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases)：查看标签、发布时间、APK 资产与 Release 说明。
- 当前可见最新非预发布 Release 为 `android-update-3.21.0-a12b5cd6`，发布于 2026-11-15；发布页应同时核对实际资产、哈希与说明，而不是只看标签。
- 安装新版前备份游戏存档。不同签名、包名或测试候选可能无法覆盖安装，也不能混用旧 APK 的验收结论。

## Web

- [打开 Oreki Edition Web](https://oreki.net/)
- [Web 源码仓库](https://github.com/OrekiDawson/AD-Oreki-Edition-Web)
- Web 版本以正式部署 Commit 和线上页面为准。刷新页面不会自动把未部署分支变成正式版本。

## 怎样报告版本

提交问题时至少说明：平台（Android/Web）、版本名或部署 Commit、使用的存档来源、复现步骤、预期结果和实际结果。Android 可附 Release 标签与 APK 哈希；Web 可附页面版本信息或部署记录。不要在公开问题中上传包含账户信息、密钥或私人数据的存档。

## 版本边界

“源码已合并”“CI 通过”“APK 已构建”“真实新档通关”和“正式发布”是不同状态。当前发布与验收状态可在开发者专区核对：[项目状态](/developer/current/project-status) · [发布状态](/developer/current/release-status)。遇到下载或启动问题，请继续阅读 [常见问题](/player/faq/)。
