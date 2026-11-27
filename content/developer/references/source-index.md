---
title: "源码索引"
description: "把源码、构建资料、产物、存档样本与历史记录分层，建立可复核的 Android/Web 技术调查路径"
tags:
  - 开发者
  - 参考
  - 源码
aliases:
  - "/references/source-index"
---

来源索引是开发者参考区的规范证据页。它不复制源码，也不把旧报告改写成结论，而是回答一个更实际的问题：当你看到一句技术说明时，应该回到哪一层材料确认它。

## 先固定问题和版本

先写清楚平台、版本、候选 Commit 和要回答的问题：

- “谁改变了这个状态？”应从固定提交的源码入口沿调用链读到实际状态改变；
- “这段代码是否进入 APK？”应继续查看 `app` 构建配置、生成输入和产物；
- “存档是否能读写？”源码只能说明格式和迁移意图，还需要固定样本与真实读写证据；
- “为什么过去这样设计？”才进入 Issue、PR 和历史归档。

固定版本不是形式主义。混淆名、构建输入、Web 存储字段和组件入口都会变化；没有版本边界的“源码路径”很可能只是另一个候选的事实。

## 四层证据

| 层次   | 能回答什么                                               | 不能单独证明什么                         |
| ------ | -------------------------------------------------------- | ---------------------------------------- |
| 实现层 | 当前源码、构建脚本和固定版本的上游代码怎样设计、怎样调用 | 不能证明代码已经进入产物或设备运行正常   |
| 产物层 | APK、DEX、mapping、资源和构建输出是否包含某个实现        | 不能单独证明玩家流程、存档兼容或结算正确 |
| 行为层 | 设备、浏览器、日志和固定样本在特定候选下实际做了什么     | 不能把一次候选结果推广为所有版本         |
| 历史层 | Issue、PR、报告和旧版本为什么发生变化                    | 不能覆盖当前实现的直接证据               |

遇到冲突时，先写清版本和问题边界，再回到离问题最近的证据层。一个“源码看起来合理”的解释，不能代替一次真实导入、安装或运行验证；一份 CI 记录也不能自动证明玩家流程。

## Android 源码路径

[AD-Oreki-Edition-Android](https://github.com/OrekiDawson/AD-Oreki-Edition-Android)  的本批核查基线是  [`9d8fc46`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/9d8fc46ce99279720b5b3068027bb76bceb35756)。建议按三步调查：

1. 先读 `app/src/main/kotlin/` 中的 Kotlin 接管层。`GameApi.kt` 集中缓存混淆宿主的类、字段和方法解析；架构页解释这些入口怎样被调度器使用。
2. 再读基线绑定和 DEX/Smali 证据，确认一个短名类的真实签名、继承关系和调用契约。绑定表是这个版本的映射，不是未来版本的永久 API。
3. 最后读 `app/build.gradle.kts`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@9d8fc46ce99279720b5b3068027bb76bceb35756/app/build.gradle.kts）、`build-logic/`、`app/proguard-rules.pro` 和产物检查，确认代码怎样进入变体、APK 和运行时。

源码能证明设计和调用关系；只有构建输入、APK/DEX 与运行证据都对上，才可以继续声称“该实现到达设备”。

## Web 源码路径

[AD-Oreki-Edition-Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web)  的调查应固定一个具体 Commit，从 `src/core/` 的游戏循环和机制模块开始，再进入存储目录。存档问题不要只搜索 `save`：应同时核对槽位/备份、序列化编码和字段迁移，区分“文本无法解码”“对象能解码但缺少字段”“读档后阶段重新计算”三类故障。

Web 源码说明状态怎样变化，浏览器实际行为才说明某个候选怎样运行。不要用源码仓库的分支或 CI 成功替代正式站点验收。

## 一条可复核的调查链

一次可靠调查通常沿着这条链走：

```text
可观察症状
  → 固定平台、版本和 Commit
  → 找到源码入口与调用者
  → 确认构建/编码/存档边界
  → 准备最小样本
  → 记录真实行为
  → 用另一层证据交叉验证
```

调查记录应保留相对路径、符号、适用版本和证据类型。行号会随着编辑移动，短 SHA 也容易失去上下文；优先链接固定 Commit 的具体文件，并说明该链接支持什么、不支持什么。

## 原版资料与许可

涉及原版机制时，优先核对固定版本的[官方网页源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca)，社区 Wiki 主要用于术语和分类参考。改编社区 Wiki 内容须遵守其  [CC BY-SA 4.0 说明](https://antimatterdimensions.wiki.gg/wiki/Meta:Copyrights)；代码、图像和报告分别遵守各自来源的许可证与署名要求。

来源索引的职责是把读者带回原文，而不是复制受版权保护的材料。旧入口、历史报告和不再公开的页面可在迁移记录或历史档案中追溯；正式正文应链接当前规范页面。

## 继续阅读

[参考资料入口](/developer/references/) · [Android 架构](/developer/architecture/android) · [Web 架构](/developer/architecture/web) · [DEX 与 ABI](/developer/reverse-engineering/dex-abi) · [构建与交付](/developer/build/) · [故障排查](/developer/troubleshooting/)
