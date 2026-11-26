---
title: "当前资料导航：如何读懂一条工程结论"
description: "从项目状态、发布产物、运行证据和未决问题中找到可复核的最新信息"
tags:
  - 状态
  - 导航
aliases:
  - "/current"
---

“现在是什么状态？”在软件项目里不是一个数字，而是一组证据。源码已经合并，APK 已经构建，游戏已经在设备上运行，以及产物已经能够安全交付，这四件事可能发生在不同时间。本页提供阅读路线，帮助你找到答案，也提醒你不要把其中一层误读成全部结论。

## 按问题进入

### 我想知道当前双端实现到哪里了

阅读[当前项目状态](/developer/current/project-status)。它按 Android、Web、目标行为和证据边界组织信息，适合在准备改代码或复核一个结论前建立上下文。

### 我想知道哪个产物可以交付

阅读[发布状态](/developer/current/release-status)，重点核对版本、签名、哈希和渠道证据。发布状态回答的是产物能否交付，不替代[APK 签名与升级兼容](/developer/build/apk-signing)中的机制解释。

### 我遇到了 Android 自动化或重置后的停滞

阅读[Android 自动化停滞排查](/developer/current/known-issues)，沿着状态机、持久化字段和可观察证据缩小范围。需要理解调度器本身时，转到[双端行为一致性](/developer/architecture/parity)；需要理解 Kotlin/ABI 边界时，转到[Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)。

## 读状态页的顺序

```text
当前结论 → 适用版本 → 直接证据 → 未覆盖边界 → 下一步技术入口
```

先确认页面适用的 Android/Web 版本和更新时间，再看它引用的源码、产物或行为证据。最后检查“未覆盖边界”：没有设备运行、渠道回读或某个版本复现时，结论就不应被扩展成普遍保证。

## 继续深入

- 要理解结论背后的实现：[架构与运行时](/developer/architecture/)。
- 要复现构建或发布步骤：[构建与交付](/developer/build/)。
- 要处理具体错误：[故障排查](/developer/troubleshooting/)。
- 要查固定源码入口：[源码索引](/developer/references/source-index)。

历史事件和原始证据分别收录于[历史归档](/developer/history/)与[证据库](/developer/evidence/)。[AI Summary](/developer/ai-summaries/)只提供附属速览，不是当前状态的权威来源；判断最新结论时应回到上面的规范页面及其证据链接。
