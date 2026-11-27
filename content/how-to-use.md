---
title: "如何使用本知识库"
description: "按读者目标给出的检索路径、证据核对方法与贡献流程"
tags:
  - 指南
aliases:
  - "/getting-started/how-to-use"
---


本站是《反物质维度》本 MOD MOD 的**中文技术百科**，主要供人阅读，同时提供结构化索引帮助检索。本条目说明不同读者该从哪里开始、怎样核对一条结论，以及怎样提交修改。

## 按目标选择入口

| 你的目标 | 建议路径 |
| --- | --- |
| 不熟悉游戏，想先理解玩法 | [游戏总览](/player/antimatter-dimensions) → [无限与永恒](/player/gameplay/progression-infinity-eternity) |
| 想知道 MOD 现在做到哪一步 | [当前项目状态](/developer/current/project-status) → [发布状态](/developer/current/release-status) |
| 想理解构建与发布 | [构建与交付](/developer/build/) → [AGP 构建管线](/developer/build/agp) → [APK 签名](/developer/build/apk-signing) |
| 想理解 Kotlin 与官方 DEX 的兼容 | [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) → [DEX 与 ABI 反混淆](/developer/reverse-engineering/dex-abi) |
| 遇到崩溃或存档问题 | [故障排查](/developer/troubleshooting/) |
| 想查版本变化 | [开发者专区](/developer/)并打开对应源码仓库的提交历史 |

## 怎样核对一条结论

1. 在条目正文中找到**就近的来源链接**，优先打开固定 Commit 的文件、报告或 Run。
2. 对照该结论的**适用版本与最后核实时间**；状态页可能过期。
3. 区分四类叙述：已证实、来源声明、合理推断、待核实；本站会标注。
4. 如果 Wiki 与源码、PR、AVD 报告冲突，**以原始证据为准**，并提交修正。

## 本站的组织方式

- 正文按**主题**组织，不按开发轮次；每个条目回答「这是什么、为什么、如何工作、已确认什么、有哪些限制、如何核查」。
- 时间线与逐日改动属于仓库内部维护资料；公开正文只保留能解释现行机制的长期结论。
- 文章末尾的「供 AI 检索（简要摘要）」只是索引，不是证据。

## 贡献流程

1. 在 Android/Web 仓库完成实际修改与验证；
2. 回到本仓库，**更新受影响的专题条目**（不新建重复页）；
3. 被推翻的结论保留「旧结论 → 新证据 → 当前判断」；
4. 时间性材料保存在仓库内部归档目录，不进入公开内容树；
5. 中文 Commit + PR，通过内容检查与 Quartz 构建后合并。

## 禁止

- 不得悄悄修改 GitHub 已验证结论再反向引用为权威。
- 不得编造 Commit、行号、测试报告或 ABI 描述符。
- 不得把私有构建产物、用户存档、Token、内部地址写入公开站点。
- 不得把未审核 AI 草稿当作正式条目发布。

## 参考资料

- [Android 仓库](https://github.com/OrekiDawson/AD-Oreki-Edition-Android)：源码、构建与报告
- [Web 仓库](https://github.com/OrekiDawson/AD-Oreki-Edition-Web)：Web 源码与 Playwright 验证
- [本知识库仓库](https://github.com/OrekiDawson/AD-Oreki-Wiki)：本站内容源码与修订历史

## 相关条目

[入门指南](/player/getting-started/) · [反物质维度 MOD Wiki:知识库规则](/wiki-rules) · [来源索引](/developer/references/source-index)
