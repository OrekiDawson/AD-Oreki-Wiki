---
title: "Signature 回填与 Gson 存档"
description: "解释泛型签名为什么会在 DEX→JVM 转换中丢失、如何回填，以及它和 APK 签名不是同一件事"
tags:
  - 构建
  - 存档
aliases:
  - "/build/signature-backfill"
---


**Signature 回填**是构建管线里恢复 Java 泛型签名的步骤。它解决的是存档反序列化问题，和「APK 签名」完全是两件事——后者见 [APK 签名与升级兼容](/developer/build/apk-signing)。本条目解释问题、做法与验证。

## 问题：泛型签名丢失

游戏用 Gson 读取存档。Gson 需要知道 `List<T>` 里 `T` 到底是什么类型；如果泛型 `Signature` 缺失，它会退化成 `LinkedTreeMap` 之类的通用结构。典型受害字段：

- `Player$Laitela.dimensions`（`List<DarkMatterDimensionState>`）
- `Glyph.effects`（`List<reality.glyphs.a>`）

DEX 本身不保留完整泛型信息，而 enjarify 默认也不输出 `Signature`。于是「转换出来的 class 能跑，但存档字段类型不对」，轻则数值异常，重则静默重置。

## 做法

1. 用 dex2jar 对官方 DEX 生成保留泛型的参考 jar；
2. 用 ASM 把参考 jar 的 `Signature` 回填到 game jar（`SigBackfill`）；
3. 用 `javap` 做 fail-closed 校验，确认关键类签名存在且符合期望；
4. 回填后重新执行整包 D8。

## 验证结果

| 字段 | 期望签名 | 结果 |
| --- | --- | --- |
| `Player$Laitela.dimensions` | `Ljava/util/List<L...DarkMatterDimensionState;>;` | PASS |
| `Glyph.effects` | `Ljava/util/List<L...reality/glyphs/a;>;` | PASS |
| 未回填的旧候选 | — | 0 处签名（负向对照） |

回填后的候选在 AVD 上完成了合法晚期存档的读取与回写（realities=12、Lai'tela、11 glyph）。[实测，[P0 闭环报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/ae734966bf712faca3ff7bbb389d8724a8efe7e5/reports/R113-01/P0-CLOSURE.md)]

## 常见误区

- **把 Signature 回填当成 APK 签名**：两者一个影响反序列化，一个影响安装升级，互不替代。
- **只看编译通过**：签名缺失不会让编译失败，只会在运行期读档时出问题。
- **以为可以事后补**：必须在下一次 D8 之前回填，否则产物已经丢掉信息。

## 已确认与未确认

- **已确认**：两个关键字段的回填与校验 PASS；晚期存档读写 PASS。
- **未确认**：全部存档字段都已覆盖（目前是重点字段校验，不是全字段等价）；AGP↔Smali 晚期存档互读仍 NOT RUN。

## 相关条目

[存档兼容与自动保存](/player/gameplay/saves) · [存档兼容排查](/developer/troubleshooting/save-compatibility) · [AGP 构建管线](/developer/build/agp) · [APK 签名与升级兼容](/developer/build/apk-signing)
