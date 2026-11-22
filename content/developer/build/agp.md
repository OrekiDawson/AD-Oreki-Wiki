---
title: "AGP 构建管线"
description: "从官方 DEX 到完整游戏 APK 的构建步骤、输入来源、构建守卫与产物追溯"
tags:
  - 构建
  - AGP
  - Gradle
aliases:
  - "/build/agp"
---


Oreki Edition 的 Android 正式构建以 **AGP 9.5.1 + Gradle + Kotlin** 为核心。由于输入包含官方混淆 DEX、补丁类与生成资源，构建不是一次普通的 `assembleRelease`，而是一条带校验的管线。本条目解释这条管线在做什么、每一步为什么存在，以及本地产物与受保护候选的区别。

## 为什么需要自定义管线

官方游戏只有混淆后的 DEX，没有可编译的源码工程。MOD 既要复用官方类，又要加入自己的 Kotlin 业务代码，于是需要：

1. 把官方 DEX 转成 JVM class，供 AGP 编译与打包；
2. 修正两类 ABI 差异（shadow 命名与协程热路径转换）；
3. 回填 Gson 泛型签名，避免存档类型漂移；
4. 整包 D8 后交给 AGP 打包、签名；
5. 在构建期用 fail-closed 守卫拦住会到运行期才暴露的问题。

## 单命令入口与步骤

本地构建入口是 `scripts/agp/build_fullgame_sig.sh`，参数包含官方 APK、staged APK、dex2jar、ASM jar、工具目录与输出目录：

~~~bash
bash scripts/agp/build_fullgame_sig.sh \
  --official-apk <官方 3.21.0 base APK> \
  --staged-apk  build/gradle-stage/unsigned.apk \
  --dex2jar     <d2j-dex2jar.sh> \
  --asm-jar     <asm-9.10.1.jar> \
  --tools-dir   <构建工具暂存目录> \
  --outdir      build/<轮次> --variant off
~~~

管线的主要步骤：

| 步骤 | 内容 |
| --- | --- |
| [1/4] | 官方 APK 的 `classes*.dex` 用 dex2jar 转参考 jar（Signature 来源） |
| [2/4] | `agp_gamejar2.py`：enjarify 官方/补丁输入 → J8 混合 → shadow remap → 补丁类覆盖 → 逐类 D8 → 整包 D8 → Signature 回填与校验 |
| [2.5/4] | A 批协程 ABI fail-closed 守卫 |
| [3/4] | AGP Release 构建（默认 R8 OFF） |
| [4/4] | 输出 `build-receipt.json`（输入/产物 SHA-256 与类数） |

## 关键约定

- **官方类基础必须保持 J8 混合**：enjarify 为基线，协程调度热路径类（默认 `ox0,gk0,dc2,tf2,vf2,t01`）用 dex2jar。全量 enjarify 会 livelock，全量 dex2jar 会 `VerifyError`，原因见 [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)。
- **补丁类检测用 enjarify 对 enjarify 比较**：混用转换器时，错误比较会把所有类判为「被修改」。
- **最终 jar = 官方基础 + 仅补丁类覆盖**：不能整体使用补丁 jar。
- **构建守卫**：类集合精确、继承层级可解析、dash 类名还原无残留、plain Kotlin 引用为 0。

## 本地产物与受保护候选的区别

本地能构建出完整游戏 APK，不等于能发布。正式候选必须在受保护工作流中构建，并满足 AGP-only 门禁：

- 生产工作流必须调用 `bash ./gradlew -p agp :app:assembleRelease`；
- 不允许 `buildKotlinDex`、`installToRelease`、`apktool b` 等旧链入口；
- 候选 APK 必须带 AGP provenance 与候选元数据。

2026-11-15 的静态复核执行 `python3 scripts/enforce_agp_only.py candidate` 退出码为 1（`AGP_ONLY_BLOCKED: AGP still builds a bridge or a different package`）。这是历史静态结果，**不能外推为 2026-11-16 发布链失败**：受保护候选构建 [#43735315296](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43735315296)、独立验证 [#43735739171](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43735739171) 与[正式发布 #43761268754](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43761268754) 均 SUCCESS。AGP-only 是否完全满足仍以当前脚本重跑与 Issue [#25](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/25)/[#61](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/61) 的分闭包验收为准（本轮未重跑脚本，**NOT RUN**）。详见 [发布状态](/developer/current/release-status) 与 [CI/CD 门禁](/developer/build/ci-cd)。

## 已确认与未确认

- **已确认**：本地管线步骤、J8 混合必要性、签名回填与构建守卫；产出的 APK/jar 有 SHA-256 与类数记录；2026-11-16 受保护 Candidate 构建、独立验证与正式发布均 SUCCESS，公开 Release 存在。
- **未确认**：AGP-only 门禁在当前脚本下是否 PASS（NOT RUN）；最新发布 APK 的八项 AVD、180 分钟发布级运行与本地 SSH/SFTP 实物回执。
- **版本边界**：管线参数与默认类列表对应 Android 3.21.0 / AGP 9.5.1，改动需同步 [签名与升级约束](/developer/build/apk-signing)。

## 参考资料

- [docs/FACTS.md 构建与产物记录](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/build.md#f-3)
- [Android PR #88（构建链修复）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/88)
- [scripts/enforce_agp_only.py](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/scripts/enforce_agp_only.py)

## 相关条目

[Android 架构](/developer/architecture/android) · [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) · [Signature 回填与 Gson 存档](/developer/build/signature-backfill) · [CI/CD 与受保护门禁](/developer/build/ci-cd) · [R8 分层策略](/developer/build/r8)
