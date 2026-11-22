---
title: "CI/CD 与受保护门禁"
description: "公开源码检查、受保护候选构建、独立验签与四渠道发布的流水线分工和失败处理原则"
tags:
  - CI
  - 发布
aliases:
  - "/build/ci-cd"
---


正式构建、签名、验签与发布必须走受保护的 GitHub Actions 流水线，而不是在本机手动打包上传。理解流水线分工，才能判断「现在到底卡在哪一步」。本条目解释工作流职责、门禁冻结点与常见误区。

**最后核实：2026-11-17（UTC+8）**；历史 Run 状态与当前发布状态分开记录，当前结论以 [发布状态](/developer/current/release-status) 为准。

## 工作流分工

| 工作流 | 作用 | 是否受保护 |
| --- | --- | --- |
| `ci.yml` | 公开源码规范与回归检查（Required Check） | 否（公开源码） |
| `candidate-unified.yml` | 完整游戏候选构建，输入为 `main` 上的精确 SHA | 是，`android-signing` 环境 |
| `verify-unified.yml` | 独立验证候选 APK 的 SHA 与签名 | 是 |
| `release-validate-unified.yml` | 发布流程验证（不发布） | 是 |
| `release-unified.yml` | 四渠道正式发布 | 是，`stable-release` 环境 |
| `release-gate-unified.yml` | 发布门禁评审 | 是，`android-release-review` 环境 |

候选构建只接受公开 `main` 上、且已有成功源码 CI 的精确 SHA；它不会构建任意分支或未经验证的提交。

## 硬规则

- 正式构建/签名/验签/发布必须走 CI/CD；禁止直推绕过、跳过检查、关闭 Ruleset、手动上传 APK。
- 发布用 APK 必须四渠道同一 SHA-256。
- 受保护 Runner 不执行不可信公开 PR 代码；Secrets 不进 Git。
- 失败修流水线，不修门禁；不得删除测试、吞异常或改预期来制造 PASS。
- 有强制人工批准的环境（如 `android-signing`），必须获得批准，不能由自动化替代。

## 历史阻塞与当前状态

1. **签名环境未批准（历史，已解除）**：2026-11-15 的 Run [43679508810](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43679508810) 当时等待 `android-signing` 批准。2026-11-16 的[候选构建 #43735315296](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43735315296)、[独立验证 #43735739171](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43735739171) 与[正式发布 #43761268754](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43761268754) 均为 SUCCESS，[Release `android-update-3.21.0-a12b5cd6`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases/tag/android-update-3.21.0-a12b5cd6) 已公开。**不能把 2026-11-15 的等待写成现行 BLOCKED**。
2. **AGP-only 静态复核失败（历史，2026-11-15）**：当时 `python3 scripts/enforce_agp_only.py candidate` 退出码 1；该结果不能外推为 2026-11-16 发布链失败。全面原生化仍按 Android Issue [#25](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/25)、[#61](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/61) 的分闭包验收。
3. **真实通关**：R113-01 的 180 分钟 FAIL 是历史跑次；最新发布 APK 的八项 AVD、完整新档与 180 分钟证据仍须按 [发布状态](/developer/current/release-status) 的核验边界检查，不能以历史 FAIL 或历史 PASS 互相替代。

## 记录字段

一次可追溯的发布应记录：源码 SHA、Candidate Run ID、Verify Run ID、APK SHA-256、证书 SHA-256、包名、`versionCode`/`versionName`、AVD 验收结果、存档与结算结论。缺任何一项都不能称为「已发布稳定版」。

## 容易误判的地方

- **源码 CI PASS ≠ 候选构建 PASS**：前者只检查公开源码。
- **候选构建 PASS ≠ 可发布**：还要独立验签、AVD 验收与发布门禁。
- **本地构建 PASS ≠ 受保护构建 PASS**：本地产物没有签名环境与独立验签记录。
- **工作流 waiting ≠ 失败**：需要人工批准的 Job 会长时间等待，不能写成 FAIL 或 PASS。

## 已确认与未确认

- **已确认（2026-11-17 核对）**：工作流分工与保护环境；2026-11-16 候选构建、独立验证与正式发布均 SUCCESS，公开 Release 存在；2026-11-12 曾完成一次四渠道发布（见 [历史归档](/developer/history/)）。
- **仍未确认**：最新发布 APK 的八项 AVD 完整场景、180 分钟发布级运行记录与本地 SSH/SFTP 实物回执；CI 发布作业 SUCCESS 不能代替这些验收。

## 相关条目

[发布状态](/developer/current/release-status) · [APK 签名与升级兼容](/developer/build/apk-signing) · [AGP 构建管线](/developer/build/agp) · [2026-11-15 · 签名环境阻塞与 AGP-only fail-closed](/developer/history/2026-11-15-signing-blocked)
