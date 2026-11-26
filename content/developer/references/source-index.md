---
title: "来源索引：怎样从证据找到真正的代码"
description: "把源码、构建资料、存档样本与历史报告分层，建立可复核的 Android/Web 技术调查路径"
tags:
  - 参考
  - 源码
aliases:
  - "/references/source-index"
---

开发者遇到的第一个问题通常不是“哪个文件最重要”，而是“我看到的这句话究竟是哪一种证据”。源码告诉你系统现在怎样做，构建配置告诉你哪些代码真的会进入产物，样本与测试报告告诉你某次候选是否表现过，历史记录则解释某个旧决定为什么出现。把这几层混成一层，索引就会变成一张漂亮但不可靠的藏宝图。

## 先确认你要回答的问题

如果问题是“按钮最终调用了什么”，从固定提交的源码入口开始，沿着调用链读到实际状态改变；如果问题是“这个类会不会进 APK”，再看 `app` 的构建配置、源码接管清单和产物检查。若问题是“某个存档是否能读”，源码只能说明格式与迁移意图，必须再配合固定样本和真实读写证据。

本站的规范页面按这个顺序组织：架构页解释模块和数据流，构建页解释从源码到 APK 的边界，排障页解释如何用日志和样本缩小范围，历史页保存曾经发生过什么。PR、Issue、Commit 和 CI 运行记录属于证据入口，不是技术正文的替代品。

## Android：从入口、映射到产物

[AD-Oreki-Edition-Android](https://github.com/OrekiDawson/AD-Oreki-Edition-Android) 的当前核查基线是 [`fb1299a132f134eb4fab009643ee3fc3d6c57edf`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/fb1299a132f134eb4fab009643ee3fc3d6c57edf)。从仓库根开始，通常按三步走：

1. 先读 `app/src/main/kotlin/` 中的 Kotlin 接管层，确认 MOD 自己拥有什么状态、调度和反射入口。`GameApi.kt` 是一个很好的例子：它不把混淆名当成稳定 API，而是集中缓存类、字段和方法解析，并保留 `Player.a`、`Player.c()` 等当前基线的事实映射。
2. 再读 `baseline/versions/3.21/bindings.json` 与 `docs/deobfuscation/data/first-party-3.21-index.csv`。它们回答“混淆符号在这个版本里对应什么”，不能被误读成未来版本永远不变的契约。
3. 最后读 `app/build.gradle.kts`、`build-logic/` 和源码接管清单，确认这些入口怎样被编译、打包和验证。只有能在构建链和产物中找到的代码，才是运行时调查对象。

需要证明某个结论时，优先给出固定提交、相对路径和符号名；行号会随着编辑移动，短 SHA 也容易在交接时失去上下文。DEX 或 Smali 只解决“产物里实际是什么”，不能单独证明 Kotlin 恢复代码的语义正确。

## Web：从游戏循环走到存档边界

[AD-Oreki-Edition-Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web) 的本次核查基线是 [`e1c93caa758de6c39cf814582123d4a35319eb25`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/tree/e1c93caa758de6c39cf814582123d4a35319eb25)。Web 调查通常从 `src/core/` 开始：游戏循环与机制模块说明状态怎样变化，`src/core/storage/` 说明状态怎样序列化、迁移、保存和恢复，组件目录则说明用户操作怎样进入这些服务。

例如，存档兼容问题不应只搜索 `save`。应同时读 `storage.js` 的槽位、备份与导入流程，`serializer.js` 的编码步骤，以及 `migrations.js` 的字段迁移。这样才能区分“文本无法解码”“对象可解码但缺少字段”“读档成功但阶段门禁重新计算”这三种完全不同的故障。

## 四层证据，四种可信度

可以把调查材料想成四层地基：

- **实现层**：当前源码、构建脚本和固定版本的上游源码。它回答系统被设计成怎样运作。
- **产物层**：APK、DEX、映射表和构建输出。它回答实现是否真的进入了运行时。
- **行为层**：可复现的日志、测试样本、浏览器或设备操作。它回答某个候选在特定条件下做了什么。
- **历史层**：PR、Issue、报告和旧版本归档。它解释变化背景，不能覆盖当前实现的直接证据。

遇到冲突时，先写清版本和问题边界，再回到更接近问题的证据层。不要用一份历史报告证明当前代码，也不要用“源码看起来合理”代替一次存档导入或设备运行。

## 原版资料与许可

涉及原版机制时，优先核对固定版本的[官方网页源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca)，社区 Wiki 只作为术语和分类参考。改编社区 Wiki 内容须遵守其 [CC BY-SA 4.0 说明](https://antimatterdimensions.wiki.gg/wiki/Meta:Copyrights)；代码、截图和报告则分别遵守各自仓库的许可证与署名要求。来源索引的职责是让读者回到原文，而不是把受版权保护的材料复制成第二份。

## 从索引到排障的最短路径

建议把一次调查写成可复核的链条：提出症状 → 固定版本 → 找到源码入口 → 找到构建或编码边界 → 选择最小样本 → 记录实际行为 → 用另一层证据交叉验证。沿途发现的旧 URL、历史报告和不再公开的入口保留在历史档案或迁移记录中；正式导航只链接规范页面。

## 相关条目

[Android 架构](/developer/architecture/android) · [Web 架构](/developer/architecture/web) · [DEX 与 ABI](/developer/reverse-engineering/dex-abi) · [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi) · [存档兼容排查](/developer/troubleshooting/save-compatibility) · [历史归档](/developer/history/)
