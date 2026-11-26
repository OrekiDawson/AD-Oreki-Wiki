---
title: "构建导航：从源码到可交付产物"
description: "沿着输入、编译、签名、验证与发布门禁定位 Android/Web 的构建任务"
tags:
  - 构建
  - 导航
aliases:
  - "/build"
---

构建不是一个绿色的 `assemble` 任务，而是一条有边界的生产线：源码和官方输入先被组合，工具链把它们变成 APK 或 Web 产物，签名决定能否升级安装，最后还要经过行为和发布门禁。本页按开发任务组织这条路线，读者可以从自己卡住的环节进入。

## 先判断你卡在哪一步

### 1. 输入和编译阶段

想知道 Android 工程怎样吸收官方 DEX、资源和新增 Kotlin，先读[AGP 构建管线](/developer/build/agp)，再结合[Android 架构](/developer/architecture/android)理解每个输入为什么存在。需要修改混淆代码边界时，先看[DEX 与 ABI 语义恢复](/developer/reverse-engineering/dex-abi)，不要把反编译结果直接当成可编译源码。

### 2. 优化与产物阶段

[R8 分层策略](/developer/build/r8)解释 Release 优化为何有边界；[build_mod.py 退役](/developer/build/build-mod-retirement)说明旧补丁链与标准 AGP 工程之间的迁移关系。两篇文章关注的是设计取舍，不是某次构建的结果清单。

### 3. 安装与升级阶段

[APK 签名与升级兼容](/developer/build/apk-signing)回答“为什么同一个包名仍然不能覆盖安装”：证书、`versionCode`、签名方案和 Android 版本共同决定升级是否成立。涉及历史产物或泛型字段恢复时，再看[Signature 回填与 Gson 存档](/developer/build/signature-backfill)。

### 4. CI、发布与回滚阶段

[CI/CD 与受保护门禁](/developer/build/ci-cd)按职责解释工作流、Required Checks 和交付渠道；[发布状态](/developer/current/release-status)只用于查当前候选产物及其证据。若问题发生在发布之后，转到[当前状态](/developer/current/)的双端证据地图，而不是把旧运行记录当作现状。

## 一条可复用的构建路线

```text
确认版本与输入 → 组合源码/DEX/资源 → 编译与打包 → 签名与升级检查 → 行为验证 → 受保护交付
```

每一步都有不同的成功含义：能生成文件不代表能安装，能安装不代表游戏行为正确，行为正确也不代表满足发布渠道和回滚要求。对应的故障入口见[构建与交付故障排查](/developer/troubleshooting/)。

## 相关入口

- [架构与运行时](/developer/architecture/)：先弄清构建输入从哪里来。
- [故障排查](/developer/troubleshooting/)：按症状缩小到工具链、ABI、存档或运行时。
- [源码索引](/developer/references/source-index)：查固定源码入口和版本边界。
- [证据库](/developer/evidence/)：查看实现、产物、行为与历史证据的分层方式。

历史构建事件放在[历史归档](/developer/history/)，[AI Summary](/developer/ai-summaries/)仅作为已审核正文的附属速览。两者都不替代本页列出的操作指南和原理文章。
