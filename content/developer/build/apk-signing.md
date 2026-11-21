---
title: "APK 签名与升级兼容"
description: "解释包名、签名证书、versionCode 与覆盖安装的约束，以及为什么签名环境是发布门禁的一部分"
tags:
  - 构建
  - 签名
  - 发布
aliases:
  - "/build/apk-signing"
---


Android 应用的「升级」不是替换文件，而是系统按**包名 + 签名证书 + versionCode** 判断能否覆盖安装。对 MOD 来说，这三项一旦变化，轻则无法覆盖安装，重则让玩家的存档与更新链断开。本条目解释这些约束，以及为什么签名环境本身是发布门禁的一部分。

## 三项硬约束

| 项 | Oreki Edition 的值 | 说明 |
| --- | --- | --- |
| 包名 | `com.oreki.antimatterdimensions` | 不得改变；改变等于变成另一个应用，无法覆盖升级 |
| 签名证书 SHA-256 | `95960bce0d8806124d72755d827fcd9216919cac29147635767a967360ed3197` | 必须与原版一致，否则系统拒绝覆盖安装 |
| `versionCode` | MOD 已发布最大值 `30210001`（截至 2026-11-17，按发布策略及公开 Release 核对） | 下一次正式发布须**严格大于**已发布最大值；策略候选 `30210002` 不代表已发布 |

注意区分两个 `versionCode`：

- **原版基线**的 `versionCode` 是 3.21.0 自带的 `30210000`；
- **MOD 独立发布**的 `versionCode` 是项目自己的发布序号，要求严格递增，且必须与原版基线分开记录。

两者混用会导致「看起来升级了、实际系统认为没有更新」或无法回退到已验证稳定版。

**版本证据（2026-11-17 核对）**：[最新核对的公开 Release（2026-11-16）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases/tag/android-update-3.21.0-a12b5cd6) 与 [当前发布门禁策略](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/scripts/release-gate-policy.json) 共同作为核对依据。策略中的 `lastPublishedVersionCode=30210001` 是已发布上限记录，`versionCode=30210002` 是准备发布的候选身份。后续正式发布需重新核实，不能把此时间点的最大值永久当作当前值。

固定提交证据：[`b0d44c93`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/b0d44c93eaf06a9d3df88a5b2cfec239c7329bcb)（2026-11-16 将发布身份递增到 `30210002`）、[`e3f881e7`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/e3f881e703e51b0e41cd30e9060a64ad17159e5a)（2026-11-15 发布准备 `30210001`）。

## 为什么签名环境是门禁

正式 APK 必须在受保护的 CI/CD 环境中构建、签名、验签，不允许手动上传或本地签名冒充。Android 仓库的候选构建工作流在 `candidate-unified.yml` 中使用 `environment: android-signing`，需要仓库所有者批准后才会执行签名步骤。

**历史阻塞（2026-11-15）**：[Run 43679508810](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43679508810) 的候选构建 Job 当时等待签名环境审批，因此**该 Run** 为 BLOCKED；这是当时的发布门禁状态，不能外推到后续版本。随后 [2026-11-16 的候选构建与正式发布](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases/tag/android-update-3.21.0-a12b5cd6)已有成功记录。详见 [签名阻塞历史记录](/developer/history/2026-11-15-signing-blocked)和 [当前发布状态](/developer/current/release-status)。

## 升级兼容还依赖什么

签名与包名只解决「能不能覆盖安装」，不解决「装上去能不能读旧档」。存档兼容是另一个维度（见 [存档兼容与自动保存](/player/gameplay/saves)）：字段类型漂移、泛型签名丢失、晚期存档互读都会影响升级后的可用性。因此发布门禁同时要求：

- 覆盖安装成功；
- 旧档可读、可继续写；
- 新增字段不会让旧版本静默重置；
- 四渠道分发的是**同一个 APK 的同一 SHA-256**。

## 已确认与未确认

- **已确认（按各自证据时间）**：包名、证书与官方 3.21.0 基线 `versionCode=30210000`；截至 2026-11-17 的发布策略记录已发布上限 `30210001`；2026-11-15 签名环境等待批准的历史 Run 状态；2026-11-12 曾完成四渠道同一 APK 发布（见 [历史归档](/developer/history/)）。
- **未独立核实**：2026-11-16 已发布 APK 的完整八项 AVD 场景、180 分钟发布级长跑、覆盖升级细节与本地 SSH/SFTP 实物回执；专项验证状态须依据对应 Run/报告判断，不能因早期 AGP-only 门禁 BLOCKED 就否定后来已完成的正式发布。
- **禁止**：不得手动上传 APK、不得关闭签名环境审批、不得绕过 Ruleset 或 Required Checks。

## 如何核查

1. 用 `apksigner verify --print-certs` 检查证书 SHA-256 是否为 `95960bce…3197`。
2. 用 `aapt2 dump badging` 或 `apkanalyzer` 核对包名与 `versionCode`。
3. 在测试机上先用旧版本建立存档，再覆盖安装新版本，确认存档可读。
4. 对照四个渠道的 APK SHA-256 是否一致。

## 相关条目

[发布状态](/developer/current/release-status) · [CI/CD 与受保护门禁](/developer/build/ci-cd) · [存档兼容与自动保存](/player/gameplay/saves) · [2026-11-15 · 签名环境阻塞与 AGP-only fail-closed](/developer/history/2026-11-15-signing-blocked)
