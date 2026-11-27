---
title: "DEX 泛型签名回填：让 Gson 看见存档里的真实类型"
description: "解释 DEX 注解在转换链中丢失后为何会破坏 Gson 存档，以及如何在 D8 之前恢复并验证泛型 Signature"
tags:
  - DEX
  - Gson
  - 存档
  - ABI
aliases:
  - "/build/signature-backfill"
---

这里的“Signature”不是 APK 签名，而是 classfile/DEX 中描述 Java 泛型参数的元数据。APK 签名决定系统是否接受安装和升级；泛型 Signature 决定 Gson 在面对 `List<T>` 时能否知道 `T` 是什么。两者都叫签名，却分属完全不同的层，混在一起排查只会把线索带偏。

## 类型为什么会在转换后消失

Java 的字段描述符会把 `List<DarkMatterDimensionState>` 擦除成普通的 `Ljava/util/List;`。真正的元素类型位于 `dalvik/annotation/Signature` 注解中。DEX 转 JVM 的转换器若只恢复字段的擦除描述符、没有把这条注解转成 classfile 的 `Signature` 属性，生成的 class 仍然可以通过编译和加载，但它已经失去了泛型的运行时线索。

这对 Gson 很关键。Gson 反射字段时会区分一个裸 `List` 与一个带参数的 `List<DarkMatterDimensionState>`。前者只能按通用对象处理，JSON 数组里的对象可能落成 `LinkedTreeMap`；后续代码若把它当作游戏状态读取，问题往往不是立即崩溃，而是读档后某个维度、Glyph 效果或进度悄悄变形。这是最危险的“能启动但存档不再等价”。

项目里最能说明问题的是两个存档可达字段：Laitela 的暗物质维度集合，以及 Glyph 的效果集合。它们的外层容器都是 `List`，但元素类型决定了 Gson 如何创建对象、如何转换数值和如何在下一次写档时保持结构。

## 回填做的其实是什么

回填不是给 APK 加一层签名，也不是修改 JSON。它在 D8 之前修复中间 JAR 的类型元数据：

1. 从官方 DEX 或能保留注解的参考转换结果中取得字段的泛型 Signature。
2. 以同一个类的 enjarify/源码化产物为目标，用 ASM 写入对应的 classfile `Signature` 属性。
3. 对关键字段解析 `javap` 或等价 classfile 信息，确认签名的容器类型和元素类型都正确。
4. 以回填后的 JAR 重新执行 D8，让最终 DEX 重新带上 Gson 需要的注解。

这里必须以类名、字段名和描述符三者共同定位，不能用“所有 `List` 都补成某个类型”的模糊规则。混淆后的类名也不能靠人眼猜测；应以冻结 APK 的 Smali、JAR 和字段签名互相印证。

项目中的 `scripts/agp/sig_backfill.py` 负责这一类元数据处理，`docs/AGP_SIGNATURE_BACKFILL.md` 记录了它接入 AGP 完整游戏链的背景和边界。脚本的价值在于把回填变成可重复的构建步骤，而不是把一次手工修 JAR 当作永久解决方案。

## 如何验证，而不是只看编译成功

编译成功只能证明 Java/Kotlin 语法和类引用成立，不能证明存档类型恢复。建议按三个层次验证：

**先验检查。** 对关键字段读取生成后的 `Signature`，确认它仍是 `List<具体类型>`，而不是擦除后的 `List`。同时检查回填前的负向样本，避免校验脚本只要看到字段存在就报通过。

**结构检查。** 用一份包含暗物质维度和 Glyph 效果的合法晚期存档，执行读取、内存状态检查、写回，再重新读取。重点看数组元素是否仍是目标对象/数值类型，而不是只比较 JSON 文件能否打开。

**跨边界检查。** 分别覆盖“旧链路写、AGP 读”和“AGP 写、旧链路读”（若产品仍承诺该兼容性），并在进程重启后再读一次。只有这样才能发现某一侧虽然能读，却在写回时把对象降级成通用 Map 的问题。

## 常见误判

- **把 `Signature` 当作 APK 证书。** 前者属于类元数据，后者由 `apksigner` 校验，修复路径完全不同。
- **只检查 `javap`，不检查 DEX。** D8、R8 或后续打包可能改变注解，最终应以候选 APK 中的 DEX 为准。
- **把一个成功读档当作全覆盖。** 关键字段通过不代表所有存档可达泛型都已枚举；集合、Map、嵌套对象和可选字段都可能有独立风险。
- **用默认值掩盖类型错误。** 读档时遇到不匹配就重建空对象，会让玩家看到“能进游戏”的假象，却丢掉原有进度。排障阶段应保留明确的类型错误和原始存档备份。

## 适用边界

回填只解决“转换链丢失泛型元数据”这一类问题。它不能修复字段名被 R8 改写、类本身 ABI 不兼容、JSON schema 已经改变、APK 证书不匹配或业务代码错误。若错误发生在安装升级，先看 [APK 签名与升级兼容](/developer/build/apk-signing)；若错误发生在状态结构迁移，继续看[存档兼容与自动保存](/player/gameplay/saves)和[存档兼容排查](/developer/troubleshooting/save-compatibility)。

## 参考资料

- `sig_backfill.py`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@main/scripts/agp/sig_backfill.py；具体文件证据留在内部核验记录）
- AGP 完整游戏：泛型 Signature 回填（源码定位：OrekiDawson/AD-Oreki-Edition-Android@main/docs/AGP_SIGNATURE_BACKFILL.md；具体文件证据留在内部核验记录）
- 官方 DEX 与候选字段的 Signature 对照证据（源码定位：OrekiDawson/AD-Oreki-Edition-Android@main/reports/R111-01/p0-agp-save-reload/signature-loss-excerpt.txt；具体文件证据留在内部核验记录）
- 晚期存档读写矩阵说明（源码定位：OrekiDawson/AD-Oreki-Edition-Android@main/savestates/late/README.md；具体文件证据留在内部核验记录）
- [APK 签名与升级兼容](/developer/build/apk-signing)

## 相关条目

[DEX、Smali 与源码恢复](/developer/reverse-engineering/dex-abi) · [AGP 构建管线](/developer/build/agp) · [存档兼容排查](/developer/troubleshooting/save-compatibility)
