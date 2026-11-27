---
title: "DEX 与 ABI"
description: "理解 Android DEX、寄存器、方法描述符与反编译边界，并把混淆宿主隔离在可诊断的 Kotlin 适配层之后"
tags:
  - 逆向
  - DEX
  - Smali
  - ABI
  - Kotlin
aliases:
  - "/reverse-engineering/dex-abi"
---

把 APK 交给 JADX，得到一堆看起来像 Java 的文件，最容易让人产生一种错觉：源码已经回来了。实际上，DEX 只承诺运行时需要的结构和指令，反编译器是在这些事实之上补出变量名、控制流和类型解释。混淆后的 `a()` 可能是购买入口，也可能只是缓存读取；真正稳定的线索是描述符、寄存器流、调用者和状态写入。

本文以 Android 3.21 的固定基线为边界，讨论如何从 DEX/Smali 恢复足够可靠的语义，再把它收进本 MOD 的 Kotlin 适配层。目标不是把整款游戏“反编译回源码”，而是让一个需要读取玩家状态、调用原版动作的 MOD 知道：哪些事实已经证明，哪些仍是推断，哪些必须在版本升级时重新核对。

## DEX 里究竟保存了什么

DEX（Dalvik Executable）保存类、字段、方法、原型、访问标志和指令等运行时结构。它面向寄存器虚拟机，不是把 Java 源码压缩后原样装进 APK；注释、原始局部变量名和开发者意图通常已经不在里面。

一个 Smali 方法的最小阅读单位是“所有者 + 方法名 + 原型”：

```text
Lpkg/Player;->g(Ljava/lang/String;)Z
```

它表示 `pkg.Player` 上名为 `g` 的方法，接收一个 `java.lang.String`，返回原始 `boolean`。只看到 `g` 或只看到返回 `Z` 都不够：同名重载、静态/实例差异和所有者类都会改变调用契约。

常见描述符可以这样读：

| 描述符          | 含义              | 逆向时不能忽略的地方                    |
| --------------- | ----------------- | --------------------------------------- |
| `I` / `Z`       | `int` / `boolean` | `Z` 是原始布尔值，不等于可空 `Boolean`  |
| `J` / `D`       | `long` / `double` | 在寄存器文件中各占两个连续槽位          |
| `Lx/y;`         | 对象 `x.y`        | 斜杠是 DEX 内部名称，不是 Java 包的点号 |
| `[I` / `[Lx/y;` | 数组              | 数组层级和元素类型都属于 ABI            |
| `V`             | `void` 返回值     | 不能用 `move-result` 接收               |

官方的 [DEX 文件格式](https://source.android.com/docs/core/runtime/dex-format)和 [Dalvik 字节码](https://source.android.com/docs/core/runtime/dalvik-bytecode)是工具输出之外的参照。遇到反编译器与 Smali 不一致时，先回到原型和指令，不要让一段漂亮的 Java 代码替 DEX 作证。

## 调用约定

DEX 方法使用寄存器而不是操作数栈。`.registers N` 给出整个方法的寄存器数量；参数通常以 `p0`、`p1` 的参数视图表示，临时值以 `v0`、`v1` 表示。实例方法的 `p0` 是 `this`，静态方法没有这个隐含对象；参数宽度由描述符决定，`J` 和 `D` 会占用两个连续槽位。

下面是一段示意代码，展示一次实例调用和返回值接收；它不是 Oreki 仓库的逐字摘录：

```smali
.method public canBuy(Ljava/lang/String;)Z
    .registers 3
    .param p1, "id"    # Ljava/lang/String;

    invoke-virtual {p0, p1}, Lpkg/Player;->has(Ljava/lang/String;)Z
    move-result v0
    return v0
.end method
```

读这段代码时应得到一组结构事实：调用者是实例 `p0`，参数 `p1` 是字符串，`invoke-virtual` 的目标原型返回 `Z`，随后 `move-result` 把结果放入 `v0`。如果反编译器把它写成 `return this.has(id);`，那是合理的表达；如果它把 `id` 推成整数或把 `has` 推成静态方法，就应以 Smali 和原型为准。

需要特别留意四类指令：

- `invoke-static`、`invoke-virtual`、`invoke-direct`、`invoke-interface` 分别表达不同的调用边界；构造函数通常通过 `invoke-direct` 调用 `<init>`。
- `move-result`、`move-result-object`、`move-result-wide` 必须与返回类型对应；漏读这一步，常会把后续寄存器误认成新变量。
- `iget`/`iput` 访问实例字段，`sget`/`sput` 访问静态字段；对象寄存器与字段描述符共同决定这一读写是否合法。
- `check-cast` 既是类型约束，也是控制流线索；它失败时说明前面对对象来源或版本绑定的推断出了问题。

因此，逆向笔记的第一列应是“寄存器在本指令前后的类型和来源”，而不是“我猜它叫玩家”。沿定义—使用链追踪值，遇到异常处理、Kotlin 桥接、内联或编译器生成访问器时尤其重要。

## 从结构事实恢复语义

源码恢复不是给短名字投票，而是把三层证据拼起来：

1. **结构事实**：固定 DEX 中确实存在这个类、字段、方法和描述符。
2. **行为证据**：调用者如何使用结果，被调用者读取或写回哪些状态，条件分支和常量怎样限制它。
3. **工程契约**：新增 Kotlin 是否通过稳定入口使用这个语义，并能在版本变化时集中替换映射。

举例说，一个返回 `Z` 的 `g()` 可能表示“已解锁”、“缓存存在”或“本次操作允许”。只有追到它的调用场景、相关字段写入和生命周期，才能把结构事实升级成行为解释。若两个候选类都能解释当前调用点，正确做法是保留未绑定状态，继续寻找父类、接口、字段形状、调用者或资源引用等锚点；错误绑定比找不到类更危险，因为它会让错误数据看似正常地流过主循环。

项目把这类证据集中在 Android 3.21 资料中：绑定规则 `bindings.json`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/baseline/versions/3.21/bindings.json）约束描述符、结构指纹和调用关系，第一方类索引（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/docs/deobfuscation/data/first-party-3.21-index.csv）提供类描述符、父类以及方法/字段数量等排除线索。数量不是语义，但能帮助识别“名字碰巧相同”的候选。

## 为何不直译 DEX

Kotlin 编译器需要编译期可见的源码或类型信息；宿主游戏的混淆类只作为 APK 输入 DEX 存在，不能自然地当作一个可维护的 Kotlin module。生成类型桩或把整个游戏反编译后重编译，也会引入泛型擦除、内部类命名、继承树和数千个互相引用的同步问题。

当前工程选择窄边界：Kotlin 负责 MOD 的状态、策略、调度和 UI，`GameApi.kt` 集中解析宿主的类、字段和方法，业务代码通过语义化入口使用它。句柄在解析成功后缓存，解析失败以可观察的 `OREKI_API_MISS` 和安全的不可用结果暴露给上层；上层应把“无法确认”当成暂不执行，而不是用默认值伪装已成功。

这是一种取舍，不是魔法：反射把一部分错误从编译期推迟到运行期，但把不稳定名称集中到少数适配点，版本升级时就能逐项复核。新增业务不应散落 `Class.forName("a/b")` 或混淆字段字符串，更不应绕过适配层直接写存档状态。

## 静态桥接入

旧调用点可能以静态 JVM 入口调用新增代码。Kotlin 的 `object` 保存调度器状态，`@JvmStatic` 为 `init(Context)`、`allow(String)`、`noteActed(String)` 等入口生成静态桥；这解决的是“调用者如何找到 Kotlin 函数”，并没有免除参数、返回类型和异常语义的 ABI 约束。

例如 `allow(Ljava/lang/String;)Z` 与 Kotlin 的 `allow(id: String): Boolean` 可以对应；若改成可空 `Boolean`、移动参数或把静态桥变成实例调用，旧的 `invoke-static` 调用者就可能在进入业务逻辑前失败。检查桥接时要同时看生成的 JVM 形状、调用点指令和实际宿主版本，不能只看 Kotlin 源码签名。

## 一次 ABI 故障的排查顺序

### ABI 三类故障

- `ClassNotFoundException`：类描述符、类加载器或版本边界不匹配。
- `NoSuchMethodException` / `NoSuchFieldException`：所有者、名称、参数原型或静态/实例性质不匹配。
- `IllegalArgumentException` / `ClassCastException`：解析到了对象，但参数、返回值或装箱类型不符合调用约定。
- 没有异常但进度停滞：可能是返回值被错误解释、`null` 被吞掉、映射命中了错误类，或调度器把 no-op 当成真实动作。

### 再沿固定版本缩小范围

1. 固定 APK、DEX 和绑定资料的版本；不要用另一版本的短名表解释当前包。
2. 在 DEX/Smali 中核对类描述符、父类、方法原型、字段类型和调用指令。
3. 对照 `bindings.json` 与索引 CSV，确认映射是否唯一、是否有迁移说明；不唯一就保持未绑定。
4. 确认业务调用经过 `GameApi` 等统一入口，而不是自行反射混淆名。
5. 沿 `Method.invoke` 前后的参数、返回值和状态写回追踪，区分宿主拒绝调用与调用方误读结果。

在 Oreki 的自动化路径中，还要把 ABI 边界与调度状态分开看：`OrekiAutomationScheduler.allow()` 通过不代表动作真的发生，`noteActed`、`noteNoop` 和 `noteFail` 的状态转移必须由真实结果驱动。这样才能避免把“解析成功但动作未执行”误诊为游戏数值问题。

## 可迁移的工程经验

面对没有源码的旧协议、插件 ABI、生成代码或跨语言 FFI，同样可以采用这条路线：先固定版本，再用结构事实锁定边界；用调用者、被调用者和数据形状恢复语义；把不稳定名称隔离在适配层；为找不到、找错和暂不可用分别设计失败行为。真正可维护的逆向成果不是一张漂亮的重命名表，而是一组能被下一次版本升级重新验证的契约。

## 资料与相关条目

- [Android DEX 文件格式](https://source.android.com/docs/core/runtime/dex-format)：类、方法、字段及 DEX 数据结构。
- [Dalvik 字节码参考](https://source.android.com/docs/core/runtime/dalvik-bytecode)：寄存器、指令和调用约定。
- Android `GameApi.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/GameApi.kt）：集中式运行时适配入口。
- Android `OrekiAutomationScheduler.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt）：Kotlin 调度器与旧调用契约的结合点。
- 3.21 绑定规则（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/baseline/versions/3.21/bindings.json）与第一方类索引（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/docs/deobfuscation/data/first-party-3.21-index.csv）：版本绑定与结构证据。
- Android 逆向资料目录（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/docs/deobfuscation）：反编译、索引和版本迁移资料，不等同于可直接编译的游戏源码。

继续阅读：[逆向与语义映射](/developer/reverse-engineering/) · [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) · [Android 架构](/developer/architecture/android) · [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi)
