---
title: "2026-11-12 · R103 四渠道正式发布与 versionCode 基线"
description: "记录 R103 修复永恒门禁缓存溢出 P0、四渠道发布同一 APK，以及 versionCode 30210000 的历史基线"
tags:
  - 历史
  - 发布
aliases:
  - "/history/2026-11-12-r103-release-baseline"
---


> 本页是历史归档，记录当时的发布结论与身份信息，**不代表当前状态**。当前发布状态见 [发布状态](/developer/current/release-status)。

## 事件与时间

2026-11-12，Android 端完成 R103 交付：修复 R101 引入的**永恒门禁缓存溢出**回归（合法永恒存档冷启动后没有「永恒」入口、时间研究不可达），重建候选并完成四渠道发布。

## 当时结论

| 项 | 值 |
| --- | --- |
| 源码 SHA | `fa6886232867b4812c857b4829bd784e58bbc80f` |
| 候选 Run / 验证 Run / 发布 Run | `43239315658` / `43240570620` / `43244024960`，均 success |
| APK SHA-256 | `3d92427153b4a8b22c6bc5b281e0a1affe961f5cdbd8f56f0f23053d48397de6` |
| 包名 / 版本 | `com.oreki.antimatterdimensions` / 3.21.0 (30210000) |
| 证书 SHA-256 | `95960bce0d8806124d72755d827fcd9216919cac29147635767a967360ed3197` |
| 交付渠道 | GitHub Releases、OneDrive、Google Drive、本地 SSH/SFTP，同一 APK |

当时判定为 Android 四渠道真实发布 PASS；“最近一次正式稳定版”仅是 **2026-11-12 当时**的判断，不代表后续版本状态。

## 后续变化与是否仍然有效

- **仍然有效**：R103 当时使用的包名、签名证书及发布身份 `versionCode = 30210000` 是真实历史记录；但 `30210000` **不再是当前已发布最大值**。截至 2026-11-17，[正式发布策略](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/scripts/release-gate-policy.json)记录已发布上限 `30210001`、下个候选 `30210002`，新正式发布必须严格大于届时已发布最大值。
- **不再代表当前状态**：R113-01 阶段记录的 180 分钟长跑 FAIL 和签名环境 BLOCKED 均为历史时点结论；[2026-11-16 的新 GitHub Release](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases/tag/android-update-3.21.0-a12b5cd6)已存在，不能再宣称此后从未发布。新版本的完整四渠道实物验证和通关证据需按各自 Run 单独核实，详见 [发布状态](/developer/current/release-status)。
- 原版基线自身的 `versionCode`（30210000）与 MOD 独立发布 `versionCode` 需分开记录，见 [APK 签名与升级兼容](/developer/build/apk-signing)。

## 原始证据

- [R103 交付报告（Android 仓库）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/R103-%E4%BA%A4%E4%BB%98%E6%8A%A5%E5%91%8A.md)
- [冻结基线与 `versionCode` 清单](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/baseline/versions/3.21/manifest.json)

## 相关条目

[APK 签名与升级兼容](/developer/build/apk-signing) · [发布状态](/developer/current/release-status) · [项目概览](/developer/project-overview)
