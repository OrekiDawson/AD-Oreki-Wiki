---
title: "构建与交付：从源码到可交付产物"
description: "沿着输入、编译、签名、验证与发布门禁定位 Android/Web 的构建任务"
tags:
  - 构建
  - 导航
aliases:
  - "/build"
---

构建不是一个绿色的 `assemble` 任务，而是一条有边界的生产线：源码和官方输入先被组合，工具链把它们变成 APK 或 Web 产物，签名决定能否升级安装，最后还要经过行为和发布门禁。本页按开发任务组织这条路线，读者可以从自己卡住的环节进入。

## 先判断你卡在哪一步

### 输入与编译

先读[AGP 构建管线](/developer/build/agp)，再结合[Android 架构](/developer/architecture/android)确认官方 DEX、资源、新增 Kotlin 和构建逻辑分别从哪里进入。需要修改混淆代码边界时，先看[DEX 与 ABI 语义恢复](/developer/reverse-engineering/dex-abi)，不要把反编译结果直接当成可编译源码。

### 优化与产物

[R8 分层策略](/developer/build/r8)解释 Release 优化为何有边界；[build_mod.py 退役](/developer/build/build-mod-retirement)说明旧补丁链怎样让位给标准 AGP 工程。这里关注的是输入和设计取舍，而不是某次构建的 PASS/FAIL 清单。

[构建可追溯性](/developer/build/artifact-provenance)解释如何用输入指纹、私有资源摘要和 APK provenance 把交付产物绑定回确定的源码；当“同一提交”生成的文件不一致时，从这里开始排查。

### 安装与升级

[APK 签名与升级兼容](/developer/build/apk-signing)回答“为什么同一个包名仍然不能覆盖安装”：证书、`versionCode`、签名方案和 Android 版本共同决定升级是否成立。涉及泛型字段恢复时，再看[Signature 回填与 Gson 存档](/developer/build/signature-backfill)。

### CI、交付与回滚

[CI/CD 与受保护门禁](/developer/build/ci-cd)解释工作流、Required Checks 和交付渠道各自负责什么；[发布状态](/developer/current/release-status)用于核对当前候选产物及其证据。发布之后的双端判断进入[当前资料导航](/developer/current/)，不要把旧运行记录当作现状。

## 一条可复用的构建路线

```text
确认版本与输入 → 组合源码/DEX/资源 → 编译与打包 → 签名与升级检查 → 行为验证 → 受保护交付
```

每一步都有不同的成功含义：能生成文件不代表能安装，能安装不代表游戏行为正确，行为正确也不代表满足发布渠道和回滚要求。遇到问题时，沿[故障排查](/developer/troubleshooting/)回到具体输入或边界。

## 相关入口

- [架构与运行时](/developer/architecture/)：确认构建输入从哪里来。
- [源码索引](/developer/references/source-index)：查固定源码入口和版本边界。
- [证据库](/developer/evidence/)：区分实现、产物、行为和历史证据。
- [发布状态](/developer/current/release-status)：查可交付候选，不替代发布机制说明。

历史构建事件保留在源码仓库或内部证据目录，[AI Summary](/developer/ai-summaries/)仅作为已审核正文的附属速览；两者都不替代本页列出的操作指南和原理文章。
