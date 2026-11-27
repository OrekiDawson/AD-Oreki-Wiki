---
title: "逆向与语义映射"
description: "从 DEX、寄存器和描述符出发，建立可验证的混淆代码阅读与 ABI 适配路径"
tags:
  - 开发者
  - 逆向
  - DEX
  - ABI
aliases:
  - "/reverse-engineering"
---

逆向工程不是把混淆类名机械翻译成漂亮的 Kotlin 名称，而是证明一段运行时代码究竟接受什么输入、返回什么结果，以及这份理解能否安全地被新代码使用。对 本 MOD 来说，DEX 是冻结的事实边界；语义映射是研究资料；Kotlin 适配层才是新增业务应该依赖的工程边界。

## 一次调查从哪里开始

先固定 Android 3.21 基线和待调查的行为，再从 DEX 或反编译结果找到类、方法、字段和调用点。接着用描述符确认参数与返回类型，用寄存器和控制流确认数据怎样流动，最后把结果与 3.21 绑定规则（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/baseline/versions/3.21/bindings.json）和第一方类索引（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/docs/deobfuscation/data/first-party-3.21-index.csv）交叉核对。

这个顺序很重要。短类名只能告诉你“产物里有一个符号”，不能告诉你它是玩家状态、视图对象还是临时包装器；绑定表也只能说明某个版本的映射，不能承诺下一版仍然如此。

## DEX 中真正值得看的三件事

DEX 保存的是类、字段、方法和字节码等运行时结构，不是带有原始变量名和注释的源码。Smali 中的寄存器因此格外重要：它们让参数、临时值、对象引用和返回值的流向变得可见。阅读时先记录方法描述符，再追踪关键寄存器从输入到分支、字段写入和返回的位置；不要因为反编译器生成了一段像 Java 的代码，就把它当成原作者的源码。

描述符是跨工具最小、也最可靠的契约。例如同样叫 `a` 的方法，如果参数数量、对象类型或返回值不同，它们就是不同的调用边界。只有类名、方法名、字段名和描述符一起吻合，映射才足以进入适配层；缺少其中一项时，应保留为待核实线索。

## 从结构恢复语义

语义恢复要把三种证据拼在一起：调用者怎样使用结果，被调用者怎样读写状态，附近的常量、条件和生命周期如何限制它。一个返回布尔值的方法可能代表“已解锁”，也可能只是“缓存已存在”；只有追到状态变化和调用场景，才知道它在游戏中的意义。

建议把恢复结果分成三层：

1. **结构事实**：类、字段、方法和描述符在固定 DEX 中确实存在；
2. **行为解释**：控制流和调用点支持某个语义判断；
3. **工程契约**：Kotlin 或其他新代码已经用稳定的入口隔离了这个判断，并能在版本变化时集中修正。

这三层不能互相冒充。结构事实不是功能验证，行为解释也不是发布许可。需要更完整的寄存器、描述符和恢复示例时，阅读 [DEX 与 ABI 反混淆](/developer/reverse-engineering/dex-abi)。

如果需要从反编译器的伪代码回到可验证的行为，继续阅读[反编译与源码恢复](/developer/reverse-engineering/decompilation)：它把版本固定、描述符核对、寄存器追踪和 Kotlin 适配层串成一条调查路径。

## 混淆 ABI 边界

直接让新业务到处调用混淆类，会把一次逆向推断扩散成整个项目的隐形依赖：版本一换，许多文件同时失效；一次反射失败，还可能在主循环里表现成看似无关的进度停滞。当前做法是把类、字段和方法解析集中在 `GameApi.kt` 等入口，把自动化和其他新业务依赖的语义接口留在 Kotlin 代码中；需要保留旧静态调用契约的地方，再通过明确的桥接进入旧运行时。

这不是把旧 DEX“源码化”，而是承认它是外部 ABI，并把不稳定性关进一个可诊断的边界。新增业务应优先使用 Kotlin 适配层，不要复制混淆名、在各处散落反射字符串，也不要把一次成功解析写成永远兼容。

## 发现冲突时怎样排查

当调用失败、返回类型不符或状态没有推进时，按边界缩小问题：

- 先确认运行的是哪一版 APK、哪一版绑定资料，以及类加载器是否来自预期环境；
- 再核对类、方法、字段和描述符是否完整匹配，避免把重载方法当成同一个入口；
- 接着观察异常发生在解析、调用、结果转换还是状态写回；
- 最后用最小游戏状态复现，并把行为与 DEX 控制流和 Kotlin 适配层日志对照。

协程或线程边界上的错误尤其容易伪装成“游戏逻辑坏了”。可继续阅读[协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi)和[混合运行时 ABI](/developer/architecture/kotlin-runtime)。如果只完成了源码阅读或静态映射，文章和交接记录必须明确写出运行验证尚未完成。

## 这套方法能迁移到哪里

混淆代码只是一个极端例子。面对没有文档的旧协议、插件 ABI、生成代码或跨语言 FFI，同样可以先固定版本，再用结构事实锁定边界，用调用者和被调用者恢复语义，最后把不稳定部分隔离在适配层。真正可迁移的经验不是某个短类名，而是：让每条推断都有证据，让每个不稳定入口都有一个可替换的家。

## 资料与相关条目

- [Android 开发者：DEX 文件格式](https://source.android.com/docs/core/runtime/dex-format)：DEX 的类、方法、字段和数据结构。
- [Android 开发者：Dalvik 字节码](https://source.android.com/docs/core/runtime/dalvik-bytecode)：寄存器、指令和调用约定。
- Android `GameApi.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt）：集中式运行时适配入口。
- Android `OrekiAutomationScheduler.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt）：Kotlin 调度器与旧调用契约的结合点。
- [Android 逆向资料目录](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/fb1299a132f134eb4fab009643ee3fc3d6c57edf/docs/deobfuscation)：反编译、索引和版本迁移资料；不等同于可直接编译的游戏源码。

返回[开发者参考](/developer/references/) · [架构与运行时](/developer/architecture/) · [构建与交付](/developer/build/)
