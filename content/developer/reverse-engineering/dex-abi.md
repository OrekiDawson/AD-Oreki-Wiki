---
title: "DEX ABI"
description: "从 DEX 寄存器与方法描述符出发，说明如何恢复混淆代码的语义，并把不稳定的宿主接口隔离在可维护的 Kotlin 适配层之后"
tags:
  - 逆向
  - DEX
  - ABI
  - Kotlin
aliases:
  - "/reverse-engineering/dex-abi"
---

把一个 Android 游戏改造成 MOD，最容易误解的地方是“反编译”。看见 JADX 生成了一堆 Java 文件，并不意味着已经找回了原来的程序。DEX 保存的是虚拟机要执行的类、方法、字段和指令；混淆器只要保持这些东西的链接关系成立，就可以把有意义的名字压缩成 `a`、`g()` 或 `rj0`。真正困难的工作，是从这些关系中恢复出足以安全调用的语义，并接受一件不太浪漫但很重要的事实：**混淆名不是 API，描述符和调用契约才是。**

本文以 Android 3.21 基线为边界，讨论 AD-Oreki-Edition 如何把官方游戏 DEX 当作宿主、把可变业务放在 Kotlin 中，并在两者之间留下窄而清楚的 ABI 边界。历史反编译产物和映射表只用于取证；它们不是可以直接编译的“原始源码”。

## 先把 DEX 当成什么

### DEX 不是 Java 的另一种排版

DEX（Dalvik Executable）面向 Android 的寄存器虚拟机。一个方法由方法原型、访问标志和指令序列组成；指令操作的是寄存器，而不是 JVM 字节码常见的操作数栈。`invoke-virtual` 会根据对象和方法原型调用实例方法，`invoke-static` 调用静态方法，返回值通常再由 `move-result` 家族指令接住。

这解释了为什么一段 Smali 不能只靠“把每行翻成 Java”来理解。必须同时看：

- `v0`、`v1` 是局部寄存器，`p0`、`p1` 是参数视图；方法参数占用的寄存器数量取决于类型，`long` 和 `double` 还要占两个连续寄存器。
- `I`、`Z`、`J`、`D` 分别表示 `int`、`boolean`、`long`、`double`；对象类型写成 `L包名/类名;`，数组则以 `[` 开头。
- `Lx;->g(Ljava/lang/String;)Z` 不只是“调用 x 的 g”：它规定了所有者、方法名、参数布局和返回类型。名字相同而描述符不同，是两个不同的方法契约。
- `iget`、`iput`、`sget`、`sput` 暴露字段访问的对象/静态性质；把一次 `sget-object` 误读成实例字段，常常会把后面的整条推理带偏。

因此，读码的第一个产物不应是“`a` 可能叫玩家”，而应是一个可复核的事实：某个类声明了什么字段、实现了什么接口、哪些调用点要求它返回什么类型，以及这些关系是否在宿主 DEX 中唯一成立。

### 寄存器让控制流比变量名更诚实

反编译器会努力恢复 `player`、`isUnlocked` 这样的变量名，但那是推断结果。遇到异常处理、内联、桥接方法或 Kotlin 编译产物时，变量边界可能已经消失。此时应沿着寄存器的定义—使用链阅读：一个值在哪里产生，经过哪些条件分支，在哪个 `invoke` 前被当作什么类型使用。

这也是源码恢复最容易“看起来合理、实际错误”的地方。若一个值先被当作 `BigDouble` 比较，稍后又被当作普通 `double` 参与运算，不能仅凭反编译器给出的 Java 表达式下结论；必须回到方法描述符、字段声明和调用者的实际类型转换。游戏的超大数值对象尤其如此，浮点数近似与游戏内数值语义不能混为一谈。

## 从短名字恢复语义

### 先锁定类，再锁定成员

一个稳妥的恢复顺序是“类 → 继承/接口 → 方法或字段 → 调用场景”。例如，要判断某个 `g()` 是否是自动购买器的解锁判定，至少要问四个问题：它属于哪个类？返回类型是什么？调用者把返回值当成什么？同一类中是否存在同名重载？少一个问题，映射就可能只是猜测。

项目的 3.21 绑定资料把这种证据写成结构化数据，而不是只留一张“旧名→新名”的对照表。`baseline/versions/3.21/bindings.json` 的规则要求宿主描述符、结构指纹和稳定调用关系共同成立；`docs/deobfuscation/data/first-party-3.21-index.csv` 则记录 DEX 中的类描述符、父类、方法/字段数量、是否第一方以及映射状态。方法数量或字段数量不是语义本身，却能帮助排除“名字碰巧一样”的错误候选。

这套方法的关键思想是负责任地承认“不知道”。如果两个候选类都能解释当前调用点，应该保留未绑定状态，继续寻找新的稳定锚点，而不是用命名习惯投票。混淆器会复用短名；版本更新后，旧版的 `az1` 仍可能存在，却已经代表另一种结构。错误绑定比找不到类更危险，因为它可能让代码在错误数据上悄悄运行。

### 描述符是跨语言的最小契约

Kotlin、Java、Smali 和反射 API 对同一个方法有不同的表述方式，但最终都要落到 JVM/DEX 描述符。例如，一个返回布尔值、接收字符串的静态入口，其契约可以写成：

```text
allow(Ljava/lang/String;)Z
```

这串文字比 Kotlin 的函数名更适合做兼容性检查：它明确了参数是 `java.lang.String`，返回值是原始 `boolean`，而不是可空的 `Boolean`。同理，`J` 与 `java.lang.Long`、`D` 与游戏自己的大数对象，都不能因为“看起来都能存数字”而互换。

在项目里，`OrekiAutomationScheduler` 通过 `object` 与 `@JvmStatic` 暴露静态桥，保留了旧调用方所需的 `init(Context)`、`allow(String)`、`noteActed(String)` 等签名。这样做的价值不是让 Kotlin 看起来像 Smali，而是把既有调用点视为外部协议：业务实现可以迁移，协议边界不能在没有迁移计划时随意改名或改类型。

## 为什么采用混合运行时

### DEX 与 Kotlin

Kotlin 编译器需要可用的源码或编译期类型信息；宿主游戏类只存在于 APK 的 DEX 中，不能简单地把 DEX 当作 Kotlin 类路径来编译。项目曾考虑生成同名类型桩，也考虑过把游戏整体反编译成 Java 再编译，但这两条路都把问题扩大了：泛型擦除、内部类命名、继承树和数千个互相引用的类型，会制造一套需要长期同步的伪源码。

于是边界被刻意切成两层：Kotlin 负责 MOD 的状态机、调度策略和 UI；`GameApi` 负责以反射解析宿主类、字段和方法。解析出来的 `Method`、`Field` 句柄按需缓存，后续调用不再每次按字符串查找。业务层看到的是语义化方法，例如读取自动永恒状态或比较游戏大数，而不是到处散落的 `Class.forName("bq0")`。

这是一种工程取舍：反射牺牲了部分编译期类型安全，换来不必重写整个游戏；适配层则把风险集中在少数可以审阅、可以替换、可以记录证据的位置。边界越窄，版本升级时越容易知道该查哪里。

### 失败必须可见，但不能拖垮主循环

`GameApi.kt` 的解析辅助函数把类、方法和字段查找集中起来，并把解析失败转成可观察的 `OREKI_API_MISS` 日志。调用方收到空值后，应把它当作“当前能力不可用”处理，而不是继续用默认值伪装成功。句柄只有在必要的解析成功后才缓存；否则第一次启动时的偶发失败可能被永久锁死，之后即使宿主已经可访问也不会恢复。

这个策略同时避免两种坏结果：让一个版本不兼容直接崩溃，或让自动化悄悄停摆却没有线索。日志不是正文里的验收奖章，而是开发者排查时要关联到具体类、描述符和调用路径的证据。

## 定位 ABI 故障

先区分“找不到”与“找错了”。`ClassNotFoundException`、`NoSuchMethodException` 和 `NoSuchFieldException` 指向解析边界；`IllegalArgumentException`、`ClassCastException` 或返回值语义异常，则可能意味着描述符、所有者类或版本绑定错误。不要先改调用方的条件判断，先把日志中的语义名称还原成宿主 DEX 的完整描述符。

可以按以下路径缩小问题：

1. 确认 APK 的游戏版本和 DEX 是否来自预期基线；不要用另一版本的短名表去解释当前包。
2. 在 DEX/JADX/Smali 中确认类描述符、父类、方法原型和字段类型；优先看调用关系与结构指纹，不要按名字搜索后直接采信第一项。
3. 对照 `bindings.json` 与索引 CSV，确认绑定状态、证据和是否存在版本迁移；未唯一确认的符号保持未绑定。
4. 检查 `GameApi` 是否通过统一绑定入口解析。绕过绑定表直接 `Class.forName`，会跳过版本别名与失败日志，让“找不到”变成难以追踪的分支。
5. 若解析成功但功能仍不工作，沿着 `Method.invoke` 前后的参数和返回值追踪：是宿主拒绝了调用，还是调用者把 `null`、装箱布尔值或大数对象误当成了另一种语义？

修改时也要反向检查所有调用点。新增 Kotlin 代码应依赖 `GameApi` 的语义化接口，不能把混淆名传播到调度器、UI 或存档逻辑；若确实要改 ABI，先保留旧签名或同步迁移全部调用者，再用构建期检查防止映射表和适配层漂移。

## 可迁移的经验

混淆并不等于不可维护，前提是不要把“能运行”误认为“已理解”。对任何没有源码的宿主，最有价值的接口往往不是它的名字，而是由描述符、调用关系、数据形状和失败行为共同组成的契约。把这些证据存成可审阅的绑定资料，把不稳定部分关进适配层，把业务逻辑留在正常的 Kotlin/Java 代码里，后续换版本时就能把一次大规模猜谜，缩小成一组可验证的兼容性问题。

## 资料与历史证据

- [Android 开发者：DEX 文件格式](https://source.android.com/docs/core/runtime/dex-format)：类、方法、字段及 DEX 数据结构的官方说明。
- [Android 开发者：Dalvik 字节码](https://source.android.com/docs/core/runtime/dalvik-bytecode)：寄存器、指令与调用约定的官方参考。
- Android 仓库 `GameApi.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt；具体文件证据留在内部核验记录）：当前缓存式反射适配层。
- Android 仓库 `OrekiAutomationScheduler.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt；具体文件证据留在内部核验记录）：以 Kotlin 实现并保持旧静态调用契约的调度器。
- 3.21 基线绑定规则（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/baseline/versions/3.21/bindings.json；具体文件证据留在内部核验记录） 与 第一方类索引（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/docs/deobfuscation/data/first-party-3.21-index.csv；具体文件证据留在内部核验记录）：历史映射和结构证据入口。
- [Android 仓库逆向资料目录](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/fb1299a132f134eb4fab009643ee3fc3d6c57edf/docs/deobfuscation)：反编译、索引和版本迁移的历史证据；不等同于可直接编译的游戏源码。

本页保留旧入口 `/reverse-engineering/dex-abi` 以兼容历史链接；正式导航应链接本页的新标题和所在专区路径。

## 相关条目

[Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) · [Android 架构](/developer/architecture/android) · [构建与签名](/developer/build/agp) · [来源索引](/developer/references/source-index)
