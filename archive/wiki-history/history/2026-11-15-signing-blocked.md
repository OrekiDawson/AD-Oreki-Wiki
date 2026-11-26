---
title: "2026-11-15 · 签名环境阻塞与 AGP-only fail-closed"
description: "记录候选构建 Run 43679508810 等待 android-signing 环境批准，以及 AGP-only 门禁静态复核失败的事实"
tags:
  - 历史
  - 发布
  - BLOCKED
aliases:
  - "/history/2026-11-15-signing-blocked"
---


> 本页是历史归档，记录 2026-11-15 的阻塞状态。**当前是否解除，以 [发布状态](/developer/current/release-status) 的最新核实为准。**

## 事件与时间

2026-11-15，Android 仓库手动触发受保护候选构建工作流 `Android candidate build`（Run `43679508810`），请求对 `main` 上 Commit `ae734966bf712faca3ff7bbb389d8724a8efe7e5` 构建候选 APK。

## 当时结论

**已确认（CONFIRMED）**：

| 项 | 事实 |
| --- | --- |
| Run | [43679508810](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43679508810)，`workflow_dispatch`，head `ae734966…` |
| 验证 Job | 2026-11-15T05:04:55Z–05:05:00Z，**success**（源码 SHA 与 Web 策略来源校验通过） |
| 构建 Job | 「构建、签名并证明候选 APK」自 2026-11-15T05:05:00Z 起 **waiting** |
| 阻塞原因 | `environment: android-signing` 需要仓库所有者批准（pending deployment，reviewer `OrekiDawson`） |

**已确认（静态复核）**：在本地对 Android 仓库执行 `python3 scripts/enforce_agp_only.py candidate`，退出码 `1`，首个失败项为 `AGP_ONLY_BLOCKED: AGP still builds a bridge or a different package`；同时 `candidate-unified.yml` 仍包含 `buildKotlinDex`、`assembleRelease`、`installToRelease` 等旧链调用，而 AGP-only 门禁要求生产工作流调用 `bash ./gradlew -p agp :app:assembleRelease` 并禁止这些旧入口。

**推断（INFERRED）**：因此即使人工批准 `android-signing` 环境，候选构建也很可能仍会因 AGP-only 门禁而 FAIL。此推断尚未在 Run 中实际发生，不能写成「已失败」。

## 后续变化与是否仍然有效

- 截至 2026-11-15 20:30（UTC+8），该 Run 仍处于 waiting，未批准、未构建、未发布。
- 「源码 CI 通过」不能推断「候选构建通过」，更不能推断「已发布」。
- 当前发布状态以 [发布状态](/developer/current/release-status) 为准。

## 原始证据

- [Run 43679508810](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43679508810)
- [candidate-unified.yml](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/ae734966bf712faca3ff7bbb389d8724a8efe7e5/.github/workflows/candidate-unified.yml)
- [scripts/enforce_agp_only.py](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/ae734966bf712faca3ff7bbb389d8724a8efe7e5/scripts/enforce_agp_only.py)

## 相关条目

[发布状态](/developer/current/release-status) · [CI/CD 与受保护门禁](/developer/build/ci-cd) · [APK 签名与升级兼容](/developer/build/apk-signing)
