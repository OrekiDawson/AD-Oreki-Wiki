---
title: "从 Smali 调用点恢复可用 API"
description: "用寄存器、方法描述符和调用者关系，把混淆 Android DEX 还原成可验证的 Kotlin 适配契约"
tags:
  - 逆向
  - Smali
  - DEX
  - ABI
---

反编译器给出的 Java 代码很适合快速浏览，却不适合直接拿来写适配层。混淆会抹掉语义化名称，Kotlin 编译器还会生成默认参数桥、Continuation 和静态桥；真正决定调用是否安全的，往往是一行看起来不太友好的 Smali：寄存器怎样传参、`invoke-*` 调用哪个所有者、描述符返回什么，以及调用者如何消费返回值。

本页提供一条可重复的恢复路径：从一个实际调用点开始，恢复最小 ABI 契约，再把它接到 Kotlin 的窄适配层。它不是反编译报告，也不要求把整个 APK“还原成源码”。

## 先定义要恢复的契约

对一个待调用的方法，最小事实表应至少包含：

| 事实 | 要回答的问题 |
| --- | --- |
| 所有者 | 方法属于哪个类？是宿主对象、静态工具类，还是 Kotlin 生成类？ |
| 名称 | 混淆名是什么？它只是定位符，不应直接当作业务语义。 |
| 描述符 | 参数顺序、参数类型和返回类型是什么？ |
| 调用形式 | 是 `invoke-static`、`invoke-virtual`、`invoke-interface` 还是构造调用？ |
| 结果用途 | 调用者把返回值拿去比较、强转、保存，还是继续传给另一个方法？ |
| 版本边界 | 这个事实来自哪一份固定 APK/DEX，是否与绑定表同一版本？ |

例如：

```smali
invoke-static {v0}, L.../OrekiAutomationScheduler;->allow(Ljava/lang/String;)Z
move-result v1
if-eqz v1, :blocked
```

这几行已经给出比函数名更多的事实：调用是静态的，唯一参数是 `java.lang.String`，返回值是原始 `boolean`，且调用者把它当作条件分支。Kotlin 侧若改成可空 `Boolean`、交换参数或删掉静态桥，问题就不再是“策略逻辑不同”，而是 ABI 已经断裂。

## 第一步：从方法原型读取寄存器

Smali 的 `p0`、`p1` 是参数视图，`v0`、`v1` 是局部寄存器视图。不要按变量名猜类型，要从方法声明和调用指令一起读。

```smali
.method public static allow(Ljava/lang/String;)Z
    .locals 2
    .param p0, "taskId"
    ...
.end method
```

这里的 `Ljava/lang/String;` 是对象参数，末尾的 `Z` 是原始布尔返回值。若参数是 `J` 或 `D`，它会占用一对连续寄存器；在 `invoke-*` 中必须把寄存器宽度算进去，否则后面的寄存器解释会整体错位。

常用描述符可以先记成这张小表：

| 描述符 | JVM/DEX 类型 | 恢复时的风险 |
| --- | --- | --- |
| `Z` | `boolean` | 不要误接成可空 `Boolean` 或整数状态码 |
| `I` | `int` | 可能是索引，也可能是位掩码；需要看调用者 |
| `J` | `long` | 占两个寄存器，不能按单个 `int` 读 |
| `D` | `double` | 既可能是普通数值，也可能是大数对象的字段 |
| `Lx/y/Z;` | 对象 | 必须核对完整类描述符和继承关系 |
| `Lx/y/Z;` | 对象数组 | 元素类型影响序列化和强转 |

对 `BigDouble` 一类数值对象尤其要谨慎：字段里出现两个 `double`，不代表调用方可以把对象拆成一个普通 `double`。对象的归一化、比较和序列化都属于它的 ABI 语义。

## 第二步：沿着调用者确认语义

同一个混淆方法名可能有重载，也可能被不同阶段以不同方式调用。恢复语义时，至少向上追一个调用者、向下追一个被调用者：

```text
调用者准备了什么参数？
        ↓
目标方法的描述符与分支
        ↓
返回值被怎样消费？是否写回状态？
```

如果调用者只用返回值作 `if-eqz`，它更像判定函数；如果调用者先传入资源对象和价格，再看到 `subtract`/写回，才有理由把它解释成购买动作。注释、反编译器变量名和附近的字符串都是线索，不能替代数据流。

## 第三步：辨认 Kotlin 生成的桥

Kotlin 的 `object`、默认参数和协程会产生源码中没有直接写出的类成员。一个常见的适配方式是：

```kotlin
object OrekiAutomationScheduler {
    @JvmStatic
    fun allow(taskId: String): Boolean = ...
}
```

`@JvmStatic` 让 Java/Smali 调用方能够看见静态入口；它解决的是“怎样调用 Kotlin 单例”，不解决“这个入口应该执行什么”。真正的兼容契约仍是生成后的所有者、方法名、参数描述符和返回类型。

Android 当前调度器源码 [`OrekiAutomationScheduler.kt`（源码定位：OrekiDawson/AD-Oreki-Edition-Android@1ec0c9cadd803f8f4e0e1c0e743c3557ab15a545/app/src/main/kotlin/kajfosz/antimatterdimensions/oreki/OrekiAutomationScheduler.kt；具体文件证据留在内部核验记录） 采用 `object` 并暴露静态桥；它维护全局节拍、`beginFrame`、`allow`、`noteActed`、`noteNoop` 和 `noteFail`。因此逆向恢复不能只看“有一个 allow 函数”，还要确认调用方是否在真实动作后按结果通知调度器，避免把 no-op 或失败记成成功。

协程方法则要额外注意 `Continuation` 参数、返回的挂起标记和生成的内部类。看到一个看似多余的对象参数时，先回到方法描述符与调用者，不要为了让 Kotlin 签名“变得好看”而删除它。

## 第四步：用固定证据排除错误绑定

项目的 3.21 绑定表（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/baseline/versions/3.21/bindings.json；具体文件证据留在内部核验记录） 与第一方类索引（源码定位：OrekiDawson/AD-Oreki-Edition-Android@fb1299a132f134eb4fab009643ee3fc3d6c57edf/docs/deobfuscation/data/first-party-3.21-index.csv；具体文件证据留在内部核验记录）用于验证结构事实：类描述符、父类、方法/字段数量和映射状态应与目标 APK 属于同一基线。

一个短类名匹配不够。至少要交叉检查：

1. 类的父类和实现接口是否一致；
2. 目标方法的参数/返回描述符是否一致；
3. 调用者使用的字段类型与方法返回类型是否能连起来；
4. 关键路径在同一版本的 DEX、绑定表和源码适配层中是否闭合。

若两个候选类都能解释当前调用点，应暂时保持未绑定，并继续寻找结构锚点。错误绑定比找不到更危险：它可能让代码成功读到一个“形状正确、语义错误”的对象。

## 一个实际的适配闭环

以自动化任务为例，安全的闭环不是“找到了一个购买方法”这么简单：

1. 从调用点确认任务 ID、静态桥和返回类型；
2. 在宿主 DEX 中确认原版购买/重置入口及其真实参数；
3. 在 Kotlin 适配层把混淆名集中封装成语义方法；
4. 由调度器决定何时尝试，调用原版入口决定是否真的改变状态；
5. 依据返回值、资源扣除、重置副作用和保存字段确认结果；
6. 为成功、no-op、解析失败和宿主拒绝分别保留可诊断的结果。

这条链可以防止两种常见错误：调度器“认为”动作已完成，但原版入口其实拒绝了它；或者适配层直接写状态字段，界面暂时变化却没有经过合法结算。

## 排查 ABI 故障

- **`ClassNotFoundException`：** 先核对完整类描述符、DEX 版本和构建时映射，不要只换一个短类名。
- **`NoSuchMethodException`：** 比较方法名、参数顺序和描述符；重载方法不能靠名称区分。
- **`IllegalArgumentException` 或 `ClassCastException`：** 检查调用者传入的对象类型、装箱/原始类型和宿主实际返回值。
- **没有崩溃但状态不推进：** 检查每次动作是否先经过 `allow`，再按真实结果回报 `noteActed`、`noteNoop` 或 `noteFail` 之一，并核对宿主入口是否真的写回状态。
- **只在更新基线后出错：** 重新生成绑定证据；旧版短名存在，不代表它在新 DEX 中仍代表同一结构。

排障时保留最小事实集：APK/DEX 基线、完整描述符、调用点前后的关键寄存器、宿主返回值和适配层结果。不要把整份反编译目录当作解释；越大的资料堆，越容易让一个未经核实的变量名看起来像事实。

## 这套方法能迁移到哪里

Smali 恢复的可迁移经验不是记住某个混淆类名，而是把不稳定的宿主接口拆成可验证的契约：结构事实锁定边界，数据流恢复语义，Kotlin 适配层隔离变化，测试则检查真实结果而不是“调用没有抛异常”。插件 ABI、生成代码、JNI 和跨语言 FFI 都可以用同样的顺序处理。

## 资料入口

- [Android DEX 文件格式](https://source.android.com/docs/core/runtime/dex-format)
- [Android Dalvik 字节码](https://source.android.com/docs/core/runtime/dalvik-bytecode)
- [DEX 与 ABI 反混淆](/developer/reverse-engineering/dex-abi)
- [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)
- [故障排查](/developer/troubleshooting/)
