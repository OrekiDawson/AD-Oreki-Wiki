---
title: "build_mod.py 退役"
description: "从 APK 构建边界、源码接管和可复现性解释旧补丁脚本的退役路径，以及如何判断迁移是否真的安全"
tags:
  - 构建
  - AGP
  - 源码接管
aliases:
  - "/build/build-mod-retirement"
---

`build_mod.py` 退役不是把一个 Python 文件删掉这么简单。它真正改变的是“谁拥有 APK 中的代码”：过去由脚本把编译结果、Smali 补丁和资源拼进官方 APK；现在则由 Android Gradle Plugin（AGP）把 MOD 业务当作正常的 Java/Kotlin、资源和依赖来编译。前者像在成品上打补丁，后者才是一个能被编译器、R8 和安装器共同理解的工程。

## 构建边界发生了什么变化

旧链路通常有三个相互缠绕的阶段：先从官方 APK 拆出 DEX 和资源，再由 Python 对字节码或文本做替换，最后重新打包。这样的链路能很快验证一个想法，却把源码语义藏在变换脚本里：同一个类可能同时存在于官方 JAR、Smali 补丁和生成目录，输入顺序稍有变化，产物就可能改变。

现行主线的入口是根级 `./gradlew :app:assembleRelease`。`app` 负责标准 Android 变体、Manifest、资源、Java/Kotlin 编译和 D8/R8；`build-logic/` 负责把仍需处理的冻结游戏输入整理成 AGP 能消费的形式。关键区别不是“脚本变少了”，而是每个输入都有了明确的归属：MOD 自有类进入源码集，仍未恢复的原版类留在受控的游戏输入中，最终 DEX 再由守卫检查。

这也解释了为什么不能把 `scripts/build_mod.py` 改名成 `build_mod_v2.py`。只要正式入口仍依赖“先改成品、再让 Gradle 打包”，语义边界就没有移动，审计和增量构建仍然会面对同一个问题。

## 迁移时要保留的 ABI

源码化并不等于可以顺手重命名混淆类。官方 DEX 的调用方只认识类描述符、方法描述符、字段类型、访问位和继承关系；其中任何一项变化，都可能在启动或某个晚期玩法路径上变成 `NoSuchMethodError`、`NoSuchFieldError` 或 `VerifyError`。

因此源码接管通常按以下顺序进行：

1. 用冻结的 JAR、DEX 和 Smali 互相核对类的真实成员，而不是把 JADX 输出直接当成源码。
2. 在 `app/src/main/java` 或 `app/src/main/kotlin` 写出可维护实现，明确哪些逻辑是 MOD 自有的，哪些只是原版 ABI 的兼容桥。
3. 编译后比较 class/DEX 描述符，并检查旧输入中的同名类是否已被确定性地排除。
4. 让 D8/R8、安装启动和存档/玩法回归共同验证“能编译”没有掩盖“不能运行”。

`build-logic` 中的 source-takeover 清单就是这条边界的机器可读部分。它不能证明业务行为正确，却能防止一个很隐蔽的错误：源码看似接管成功，最终 APK 里却仍混入旧类，或者新旧两个版本同时存在。

## 为什么增量构建尤其容易骗人

Gradle 能看到文件输入和输出的快照，但原地修改 class、JAR 或 DEX 的脚本若没有把变换声明为任务输入输出，Gradle 可能复用变换前的缓存。结果是“源码已经改了，APK 仍来自旧字节码”。这也是退役工作必须把后处理建模进任务依赖、必要时关闭不透明缓存复用的原因。

排查这类问题时，先不要盯着 APK 的文件大小。应从同一工作区记录：

- 参与构建的源码、冻结游戏输入和工具版本是否发生变化；
- `adaptSourceAbi`、DEX 构建及 R8 的任务依赖是否经过实际执行；
- 最终 APK 中的类描述符是否来自预期的源码接管清单；
- 安装后是否能走到依赖该类的真实入口，而不只是启动首页。

如果只删除脚本而没有完成这些检查，得到的只是一个更难重现的失败；如果只让 CI 通过而未检查最终 DEX，则可能只是验证了错误的缓存产物。

## 什么时候才算真正退役

退役的判据是“正式构建不再需要它”，不是“仓库里搜不到它”。至少要同时满足：

- Release/Candidate/Verify 的入口直接使用 AGP，不调用旧脚本或其包装器；
- 生产 Smali 补丁不再是 MOD 业务的编译来源；
- 源码接管类的 ABI、DEX 存在性和排除清单由构建守卫闭环检查；
- R8、安装升级、存档读写和关键玩法在同一候选产物上完成相应验收；
- 历史报告仍能追溯旧链路，但不会被构建任务重新引用。

Android 仓库的迁移台账记录了旧脚本已从当前主线物理删除，以及剩余的源码接管和运行验证边界。台账是证据索引，不是本页的技术正文：本页关心的是为什么构建边界必须改变，以及改变后如何避免 ABI 和缓存问题悄悄回潮。

## 参考资料

- [Android 仓库的 build_mod 退役迁移台账](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/BUILDMOD_RETIREMENT_LEDGER.md)
- [Android `app/build.gradle.kts`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/app/build.gradle.kts)
- [Android AGP 构建管线](/developer/build/agp)
- [源码接管与 ABI 兼容](/developer/architecture/android)
- [CI/CD 与受保护门禁](/developer/build/ci-cd)

## 相关条目

[APK 签名与升级兼容](/developer/build/apk-signing) · [Signature 回填与 Gson 存档](/developer/build/signature-backfill) · [存档兼容排查](/developer/troubleshooting/save-compatibility)
