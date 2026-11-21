---
title: "发布状态"
description: "截至 2026-11-20：旧正式版 a12b5cd6 仍为公开版本，R121 的 30210002 只是未发布开发候选"
tags:
  - 发布
aliases:
  - "/current/release-status"
---

本页回答“哪个 Android APK 已正式发布、哪个只是候选、发布证据覆盖到哪一步”。**Release 页面存在、CI 成功、AVD 安装成功与四渠道实物校验不是同一结论。**

**最后核实：2026 年 11 月 20 日 21:18（UTC+8）。**

## 当前公开版本

[Android 3.21.0（a12b5cd6）GitHub Release](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases/tag/android-update-3.21.0-a12b5cd6) 仍是当前可下载的正式版本。APK 文件名 `AD-Oreki-Edition-3.21.0.apk`，大小 **81,587,691 字节**，SHA-256：

`a12b5cd620280465805ec844ea9a8554277e51d87d769dde4120fa5db842da87`

该 release 的发布作业 [#43761268754](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43761268754) 记录了 GitHub、OneDrive 和 Google Drive 的发布步骤；本地 SSH/SFTP 第四渠道需要独立回执，不能仅由工作流 SUCCESS 推断。上一轮的构建与验证记录见 [R103 历史记录](/developer/history/2026-11-12-r103-release-baseline)。

## 当前开发候选不是正式 Release

Android 当前 [发布策略](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/b0e0881b5eadabf40e2eb35ef8547e5aa56d40ae/scripts/release-gate-policy.json) 定义：

- `versionCode=30210002`；
- `modVersion=1.0.2`；
- `modVersionState=development`；
- 历史已发布上限仍是 `30210001`；
- 新档硬上限仍是 `10800s`。

因此 `30210002` 不能因为版本号大于上一版就自动称为稳定版。R121 的 `43e3f4fc…f1ac` APK 已安装到 KVM 并完成设备回拉 SHA 校验，但其真实新档跑次（到首次现实）暴露了自动化 P1，终局仍未运行，当前只属于**开发候选**。它的最终源码仍由 [PR #204](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/204) 推进。

## 证据分级

| 环节 | 当前状态 | 可以证明什么 |
| --- | --- | --- |
| GitHub Release a12b5cd6 | **PASS** | 旧正式 APK 可下载、身份和哈希可核对 |
| R121 APK 安装到 KVM | **PASS** | 该精确构建能在 API 32 AVD 安装并启动 |
| R121 真实新档终局 | **NOT RUN / 未 PASS** | 当前未到 `isGameEnd=true` |
| R121 正式发布 | **NOT RUN** | 开发状态门禁未满足，未发布到四渠道 |
| Android/Web 统一完成证据 | **未 PASS** | Web 已有合法完成证据；Android 仍需真实终局 |

## 怎样读懂版本号

“版本号更大”“APK 能安装”“源码 CI 通过”都只说明交付链的某一段。正式发布至少还需要精确 APK、签名、安装升级、启动、阶段门禁、自动购买器、存档、GUI、真实终局和四渠道哈希逐项通过。当前文档不会用 R121 候选占用这些结论。

## 相关页面

[当前项目状态](/developer/current/project-status) · [CI/CD 与受保护门禁](/developer/build/ci-cd) · [APK 签名与升级兼容](/developer/build/apk-signing) · [待核实事项与已知问题](/developer/current/known-issues) · [2026-11-12 · R103 四渠道正式发布与 versionCode 基线](/developer/history/2026-11-12-r103-release-baseline)
