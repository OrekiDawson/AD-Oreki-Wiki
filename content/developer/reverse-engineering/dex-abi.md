---
title: "DEX 与 ABI 反混淆"
description: "解释官方混淆 DEX 的类、方法、字段映射怎样建立，以及新增代码应如何与混淆 ABI 隔离"
tags:
  - 逆向
  - ABI
aliases:
  - "/reverse-engineering/dex-abi"
---


Android 版 MOD 只能在官方 3.21.0 的**混淆 DEX** 上工作：类名、方法名与字段名大多被替换成 `a`、`b`、`rj0` 这样的短标识符。要让新增的 Kotlin 代码安全地调用它们，先要建立可信的**语义映射**。本条目解释这套映射怎么建立、怎么使用，以及哪些做法属于猜测、必须禁止。

## 为什么混淆会让事情变难

DEX 里没有源代码，只有字节码与混淆名。一个类可能叫 `bm4`，一个方法可能叫 `g()`，字段可能叫 `a`。如果只看名字，很容易把两个不同的 `a` 当成同一个；而一旦调用错，运行期才会出现 `NoSuchFieldError`、`NoSuchMethodError` 或类型转换异常。

因此「反混淆」不是把名字换回可读形式那么简单，而是要确认：**这个标识符在真实调用关系里承担什么语义**。

## 映射是怎么建立的

1. **全量导出**：用 JADX 等工具导出官方 DEX，得到类、方法、字段与字节码。
2. **第一方类索引**：区分「官方自己的类」与第三方库（如 Kotlin stdlib、Gson），只对第一方类建立语义映射。
3. **调用关系核对**：从已知的 UI 入口、存档字段或事件回调反向追踪，确认真实调用链。
4. **描述符记录**：记录完整的方法/字段描述符（参数类型、返回值、是否静态），而不是只记名字。
5. **固定基线**：映射固定到 3.21.0，不因上游发版重置。

映射成果保存在仓库的 `docs/deobfuscation/data/first-party-3.21-index.csv` 等文件；已登记的默认包混淆名（如 `rj0` = `Continuation`、`ek0` = `CoroutineContext`）可以在条目中直接引用。

## 使用纪律

- **新业务代码优先 Kotlin**，并且尽量不直接依赖混淆标识符；
- 确需 ABI 适配时，集中到适配层，命名语义化；
- 混淆标识符只用于必要的 ABI 适配，不扩散到业务逻辑；
- **无法唯一确认时停止**，不猜字段或方法别名；
- 任何 ABI 修改都要有构建期守卫（见 [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)）。

## 常见错误

- **只按名字猜语义**：两个 `a` 可能属于不同类、不同类型；
- **忽略描述符**：同名方法可能重载，参数类型不同就是不同方法；
- **忽略继承**：方法可能声明在父类而不是当前类，直接按当前类调用会失败；
- **把库类当第一方类**：Kotlin stdlib 的字段与方法有自己的版本语义，混用会触发 ABI 冲突。

## 已确认与未确认

- **已确认**：JADX 导出、第一方类索引、默认包混淆名与若干关键描述符；这套映射支撑了 shadow 隔离与 ABI 守卫。
- **未确认**：映射覆盖并非 100%，新接触的类仍需逐项核对；上游版本变化不会自动更新映射。
- **版本边界**：固定 Android 3.21.0；其他版本不保证适用。

## 参考资料

- [docs/FACTS.md 第 9 节（Android 逆向事实）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/android-internals.md#f-9)
- [docs/deobfuscation/data/first-party-3.21-index.csv](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/deobfuscation/data/first-party-3.21-index.csv)
- [Android 仓库 docs/deobfuscation](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/main/docs/deobfuscation)

## 相关条目

[Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) · [Signature 回填与 Gson 存档](/developer/build/signature-backfill) · [来源索引](/developer/references/source-index)
