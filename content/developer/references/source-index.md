---
title: "源码索引：从问题反推证据"
description: "按读者问题定位 Android/Web 源码、构建产物、存档样本和历史证据"
tags:
  - 参考
  - 源码
  - 证据
aliases:
  - "/references/source-index"
---

源码索引不是文件名目录，而是一张“问题 → 证据 → 验证”的路线图。先明确要证明什么，再选择最接近问题的证据层：源码解释实现，构建配置解释是否会进入产物，APK/DEX 解释运行时实际装进了什么，样本和设备行为解释某次运行发生了什么，历史记录只解释变化背景。

## 先写出要证明的句子

把“我想查一下存档”改写成可检验的问题，检索会立刻收敛：

| 问题                         | 第一入口                                      | 必须补的证据                             |
| ---------------------------- | --------------------------------------------- | ---------------------------------------- |
| 一个按钮最终改了哪个状态？   | Web 组件或 Android Kotlin 入口                | 调用链、状态写入点、一次行为复现         |
| 某字段为什么在旧档里不存在？ | Web `migrations.js`                           | 输入版本、迁移函数、迁移前后字段差异     |
| 存档文本属于哪个平台？       | Web `serializer.js` 或 Android `savecodec-rs` | 前缀、编码步骤、固定样本                 |
| Kotlin 代码真的进 APK 了吗？ | `app/build.gradle.kts` 与源码接管清单         | APK/DEX、映射或产物检查                  |
| 一个旧结论今天还成立吗？     | 当前固定提交的源码                            | 当前构建或运行证据；历史报告不能单独作答 |

Issue、PR、Commit 和 CI 页面适合保存证据链接与变化背景，不应代替正文解释技术原理。读者需要的是能复现的入口，而不是一串工作流水账。

## Android：从语义入口走到产物

[AD-Oreki-Edition-Android](https://github.com/OrekiDawson/AD-Oreki-Edition-Android) 的本文核查基线为 [`fb1299a132f134eb4fab009643ee3fc3d6c57edf`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/fb1299a132f134eb4fab009643ee3fc3d6c57edf)。建议按下面的顺序查：

1. 从 `app/src/main/kotlin/` 的接管层开始。先找游戏事件、状态容器和反射入口，弄清 MOD 代码试图控制什么；不要把混淆类名本身当作稳定 API。
2. 用 `baseline/versions/3.21/bindings.json` 和 `docs/deobfuscation/data/first-party-3.21-index.csv` 对照符号。它们是特定版本的映射证据，不是未来版本的兼容承诺。
3. 查看 `app/build.gradle.kts`、`build-logic/` 和源码接管清单，确认源码是否被编译、哪个变体会打包它、是否还有 Smali/Dex 后处理。
4. 最后检查 APK/DEX 产物。源码存在只能证明工作树里有文件；只有产物中出现预期类、方法和资源，才证明它进入了运行时。

涉及 ABI 或反射时，引用应至少包含固定提交、仓库相对路径、符号名和版本边界。行号可以作为辅助，但不应成为唯一定位方式；短 SHA 也应链接到完整提交。

## Web：从循环和组件走到状态边界

[AD-Oreki-Edition-Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web) 的本文核查基线为 [`e1c93caa758de6c39cf814582123d4a35319eb25`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/tree/e1c93caa758de6c39cf814582123d4a35319eb25)。`src/core/` 是主入口，但不同问题要落到不同边界：

- 游戏循环和数值变化：从循环调度进入具体机制模块，追踪“读状态 → 计算 → 写状态”。
- 读档与保存：读 [`storage.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/e1c93caa758de6c39cf814582123d4a35319eb25/src/core/storage/storage.js)，再读 [`serializer.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/e1c93caa758de6c39cf814582123d4a35319eb25/src/core/storage/serializer.js) 和 [`migrations.js`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/e1c93caa758de6c39cf814582123d4a35319eb25/src/core/storage/migrations.js)。只有三者合起来，才能解释“文本能解码、对象能迁移、状态能恢复”之间的差异。
- 用户操作：从组件事件进入服务或状态模块，确认是否存在保存条件、阶段门禁或异步模拟。
- 视觉异常：先确认状态是否正确，再沿渲染层追查；不要用截图反推数据结构。

一个实用的检索组合是：先搜功能名，再搜状态字段，最后搜写入点和测试。只搜 `save` 会把自动保存、导出文件、备份槽和云端状态混在一起；按边界分组能显著减少误判。

## 证据的四层关系

### 实现层：它应该怎样工作

固定提交中的源码、配置和迁移函数解释设计意图与控制流。适合回答“为什么会这样”，不单独证明某个 APK 或浏览器实例真的运行了这段代码。

### 产物层：它实际装进了什么

APK、DEX、R8 映射、资源包和构建输出解释编译链的结果。它能发现源码与产物脱节，但不能单独解释用户操作后的状态变化。

### 行为层：它在这个条件下做了什么

设备日志、浏览器复现、固定存档样本和测试结果解释现实行为。必须同时记录版本、输入、步骤和成功判据；“我点过一次”不是可复核证据。

### 历史层：它为什么曾经这样做

PR、Issue、报告和旧版本归档有助于理解迁移背景、已知回归和弃用路径。它们不能覆盖当前源码，也不能把历史 PASS 迁移成当前版本 PASS。

当证据冲突时，先固定版本和问题边界，再选择距离问题最近的层交叉验证。例如“旧档读入后显示新档”不能只引用迁移报告：需要同时看当前迁移源码、原始存档哈希和一次重启后的行为。

## 原版资料与许可证边界

涉及原版机制时，优先核对固定版本的[官方源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca)，社区 Wiki 用于术语和页面结构对照。改编 Wiki 内容遵守 [CC BY-SA 4.0](https://antimatterdimensions.wiki.gg/wiki/Meta:Copyrights)；代码、截图、构建报告和存档样本分别遵守各自仓库或来源的许可。索引应把读者带回原始证据，不复制受限材料，也不把内部审查记录混进技术正文。

## 一次调查的最短闭环

```text
症状
  -> 固定版本与输入
  -> 找到语义入口
  -> 追到状态/编码/构建边界
  -> 选择最小可复现样本
  -> 记录实际行为
  -> 用产物或源码交叉验证
```

报告结论时，把“源码显示的设计”“本次运行观察到的行为”和“尚未验证的推断”分开写。旧 URL、历史文件和废弃入口保留在历史或迁移记录中，公开导航只指向规范页面。

## 相关条目

[Android 架构](/developer/architecture/android) · [Web 架构](/developer/architecture/web) · [DEX 与 ABI](/developer/reverse-engineering/dex-abi) · [存档兼容排查](/developer/troubleshooting/save-compatibility) · [故障排查](/developer/troubleshooting/) · [历史归档](/developer/history/)
