---
title: "存档兼容排查：先辨认格式，再追踪迁移"
description: "从编码边界、字段迁移、备份槽位和运行时状态入手，诊断读档失败与静默重置"
tags:
  - 排查
  - 存档
aliases:
  - "/troubleshooting/save-compatibility"
---

“文件能打开”不是“存档兼容”。存档要经过编码、解码、对象校验、字段迁移、默认值合并和游戏状态重建；其中任何一层出错，最终都可能只表现为资源变少、页面回到早期阶段，甚至像新档一样安静地出现。排查的第一步不是手改 JSON，而是确认这份文件属于哪个运行时、哪一种编码和哪一代字段结构。

## 平台文件差异

Android 测试样本的核心是 `files/player.json` 原文。仓内 `tools/savecodec-rs` 记录的文本格式以 `AntimatterDimensionsAndroidSaveFormat` 开头，载荷经过替换规则、Base64 和 gzip；工具还设置了 32 MiB 输入与 64 MiB 解压上限。它是 Android 端的编解码边界，不因为里面也出现 `player` 字段就自动等于 Web 导出文本。

Web 则由 `GameSaveSerializer` 先把对象 `JSON.stringify`，把 `Set` 转成数组、把 `Infinity` 表示成字符串，再经过 `TextEncoder`、pako deflate、可打印化 Base64 和字符替换，最后附加 `EndOfSavefile`。开头的 `AntimatterDimensionsSavefileFormatAAB` 是 Web 编码版本标记。没有经过明确适配和真实读写验证时，不要把 Web 导出直接推给 Android，也不要把 Android 的 `player.json` 当成 Web 导入文本。

## 读档其实是一个管线

Web 的 `GameStorage.load()` 先取出本地存储值并解码；`loadRoot()` 再区分旧的单对象格式和包含 `current`、`saves` 的多槽格式。进入玩家对象后，`checkPlayerObject()` 只做最低限度的可识别性和 NaN 检查，随后 `migrations.patchPreReality()`、开发环境迁移和 `patchPostReality()` 按顺序改写对象，再用默认玩家结构补齐缺失字段。最后才重建 UI、符文缓存、自动化后端并决定是否模拟离线时间。

这解释了两个常见错觉：字段缺失不一定意味着文件损坏，因为迁移可能会补上它；迁移完成也不意味着游戏状态可信，因为阶段、缓存和离线模拟还会重新计算。诊断时要记录“解码后对象”“迁移后对象”和“首次显示的游戏状态”这三个边界，而不是只看导入按钮有没有弹出成功提示。

## 逐层缩小故障范围

先保留原文件副本并计算 SHA-256，记录来源、版本、平台和导入前后时间。对 Android，确认文件是否放在应用实际使用的 `files` 目录，并且备份槽位没有把刚注入的主文件回滚掉；仓内样本说明了覆盖 `player.json` 与若干 `playerBackup*` 的测试方法，但这只适用于受控测试设备，不应照搬到用户真实存档。

然后判断失败发生在哪一层：

- 开头不符合平台格式、解压失败或 JSON 无法解析，是编码边界问题；先查文件是否被截断、是否把另一平台的导出当作输入。
- 能解析但缺少关键字段，查看迁移函数是否覆盖该版本；重点关注字段改名、数组到对象的重组、`Decimal`/数字类型转换和旧自动购买器结构。
- 能读入但进度退回，比较迁移前后的阶段判据与保留字段；不要只盯着显示数值，许多资源会在下一次 tick 依据维度和解锁状态重算。
- 导入后完全不保存或界面不再推进，转查逻辑线程、保存条件和协程 ABI。保存管线可能根本没有获得一次运行机会，不能先给存档背锅。

Web 还要检查 `canSave()`：选择符文、模拟进度或游戏结束状态可能暂时禁止保存；`save()` 写入的是带 `current` 和 `saves` 的根对象，备份则使用独立的 `backupSave-*` 与备份时间键。文件存在不代表它是最近一次有效保存。

## 样本验证

仓内 `savestates/manifest.json` 为测试夹具记录了路径、大小、SHA-256 和部分阶段字段；`late/invalid/` 中的损坏样本明确标为负向夹具。它们适合验证“错误是否被识别”和“合法阶段是否保留”，不适合伪造玩家进度。测试时应先用新档建立基线，再导入一个固定样本，读回关键字段，重启后再次读取；每一步都保留输入哈希和输出差异。

Rust `savecodec` 适合检查 Android 编码层，Web 的 `serializer.js` 和迁移源码适合解释 Web 行为。二者都不能代替设备或浏览器上的真实导入，因为文件权限、localStorage、备份回滚、离线模拟和 UI 阶段门禁都在编解码器之外。

## 安全边界与可迁移经验

任何实验都先复制存档，绝不覆盖唯一用户文件；不要用手写 JSON 冒充合法夹具，也不要把“解析成功”写成“跨版本互通”。跨版本兼容的可靠做法是：为每个格式保留版本标记和迁移入口，迁移后执行最小结构校验，再用真实阶段样本验证读、写、重启三件事。跨平台则应设计显式转换器，逐字段定义精度、缺省值、枚举和不可转换字段，而不是依赖两个 JSON 恰好长得相似。

## 参考资料

- Android 当前仓库的 `savestates/README.md`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/savestates/README.md；具体文件证据留在内部核验记录）、`manifest.json`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/savestates/manifest.json；具体文件证据留在内部核验记录） 与 `savecodec-rs/README.md`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/tools/savecodec-rs/README.md；具体文件证据留在内部核验记录）。
- Web 当前基线  [`e1c93caa`](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/tree/e1c93caa758de6c39cf814582123d4a35319eb25)  中的 `src/core/storage/storage.js`、`serializer.js` 与 `migrations.js`。
- [MDN：Web Storage API](https://developer.mozilla.org/docs/Web/API/Web_Storage_API)  与  [Android：应用数据和文件](https://developer.android.com/training/data-storage/app-specific)。

## 相关条目

[存档兼容与自动保存](/player/gameplay/saves) · [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi) · [来源索引](/developer/references/source-index) · [DEX 与 ABI](/developer/reverse-engineering/dex-abi)
