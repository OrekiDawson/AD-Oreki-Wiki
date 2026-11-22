---
title: "存档兼容与自动保存"
description: "解释自动保存的周期与触发条件、跨构建读写边界、Gson 类型漂移风险，以及安全验证存档的方法"
tags:
  - 玩法
  - 存档
aliases:
  - "/gameplay/saves"
---


《反物质维度》的进度保存在本地 JSON 文件里（Android 是 `player.json` 与 `playerBackup*`）。存档既是玩家进度的唯一载体，也是 MOD 兼容性最容易出问题的地方：一个字段类型漂移就可能表现为「读档后资源异常」甚至静默重置。本条目解释保存机制、跨构建兼容的已验证范围与验证方法。

## 保存路径与触发时机

Android 端存在两条保存通道：

1. **周期自动保存**：游戏循环中按固定间隔写档；
2. **页面生命周期保存**：HOME / `onPause` / `onStop` 时立即再写一次。

在 smali 稳定版上实测的行为是：冷启动进入游戏后约 65 秒首次写 `player.json`，之后约每 30 秒一次；`playerBackup` 约 60 秒一次；HOME 触发立即再写。修复混合运行时 livelock 后的候选 APK 上，新档首写为 40.2 秒，HOME 保存与 `force-stop` 后文件保留，进程重启后能正常加载并继续写档。[实测，[P0 闭环报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/ae734966bf712faca3ff7bbb389d8724a8efe7e5/reports/R113-01/P0-CLOSURE.md)]

**关键点**：周期保存依赖游戏 tick 持续运行。如果 tick 停住（例如逻辑线程 livelock），两条周期通道都不会触发，表现为「游戏看起来还在，但存档不更新」——这不是保存链断裂。机制见 [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi)。

## 跨构建兼容边界

| 场景 | 状态 |
| --- | --- |
| AGP 候选写出的**早中期存档** → smali 稳定版读入并回写 | PASS（历史轮次，PR #74） |
| **晚期存档**（realities=12、Lai'tela、11 glyph）在 AGP 候选上读写 | PASS（同一候选 APK） |
| **晚期存档**在 AGP 候选与 smali 稳定版之间**互读** | **NOT RUN** |

「同一 APK 上能读写合法晚期存档」与「AGP↔Smali 双向互读」是两个不同结论，不能互相替代。[早中期跨构建记录](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/74)、[晚期存档读写记录](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/ae734966bf712faca3ff7bbb389d8724a8efe7e5/reports/R113-01/P0-CLOSURE.md)

## 类型漂移：为什么存档字段会「读错」

游戏用 Gson 反序列化存档。DEX→JVM 转换工具（enjarify）默认不保留泛型签名（`Signature`），于是 `List<DarkMatterDimensionState>` 这类字段在反序列化时丢失元素类型，被读成 `LinkedTreeMap` 之类的通用结构。表现可能不是崩溃，而是**字段类型漂移、数值异常或静默重置**。

MOD 的修法是：用保留泛型的参考 jar 生成签名，再通过 ASM 把 `Signature` 回填到游戏 jar，并用 `javap` 做 fail-closed 校验。典型受害字段包括 `Player$Laitela.dimensions` 与 `Glyph.effects`；未回填的旧候选在对照中为 0 处签名。[见 [Signature 回填与 Gson 存档](/developer/build/signature-backfill)]

## 安全验证存档的方法

1. **注入方式**：必须使用 app 的 uid/gid 注入，否则应用会读不到文件并静默回到新游戏。
2. **SHA 对照**：注入前后记录 `player.json` 的 SHA-256，确认文件真的被替换。
3. **备份文件**：确认 `playerBackup*` 是否按预期生成。
4. **日志**：检查 logcat 中的 Gson 异常、`NoSuchFieldError`/`NoSuchMethodError` 与 FATAL。
5. **对照构建**：用已知可用的稳定版做对照，区分存档问题与构建问题。

## 禁止事项

- 不得手工生成 `player.json` 冒充「自动存档成功」。
- 不得把损坏或手工构造的存档当作合法夹具。
- 不得覆盖玩家真实存档或使用他人存档做公开证据。
- 不得把「文件存在」当成「存档内容正确」。

## 已知限制

- 晚期跨构建互读尚未完成，不能宣称「任意版本存档互通」。
- 存档字段的可用性随版本变化；引用字段名时需注明适用版本。
- 2026-11-15 的新长跑仍在进行，其存档行为没有终局结论。

## 相关条目

[存档兼容排查](/developer/troubleshooting/save-compatibility) · [Signature 回填与 Gson 存档](/developer/build/signature-backfill) · [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi) · [2026-11-15 · R113-01 逻辑线程 livelock 的 P0 闭环](/developer/history/2026-11-15-r113-p0-livelock)
