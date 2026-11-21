---
title: "目录标准化迁移"
description: "从双 Gradle/脚本布局迁移到标准 AGP 工程的目标、阶段划分与迁移纪律"
tags:
  - Android
  - 迁移
aliases:
  - "/architecture/directory-migration"
---


Android 仓库历史上同时存在根级 Groovy 构建、`agp/app` Kotlin DSL、脚本生成源码与补丁树等多套布局。目录标准化迁移（Issue #61）的目标是把生产代码收敛到标准 AGP 工程结构，让「代码在哪里、由谁编译、产物如何追溯」不再依赖脚本约定。

本条目解释迁移目标、已完成阶段与仍然存在的限制，不逐条记录每一轮改动。

## 目标结构

最终形态是标准 AGP 9.5.1 工程：根级 `app/`、`settings.gradle.kts`、`build.gradle.kts`，生产 Kotlin 代码在 `app/src/main/kotlin/`，资源与运行资产由 Android Source Set 或有声明输入输出的 Gradle 生成目录管理；`baseline/`、`scripts/`、`docs/`、`reports/` 等保持职责清晰。

这与 `build_mod.py` 退役（Issue #52）属于同一条「AGP 原生化、去旧构建链」主线，但两者是不同目标：目录迁移解决布局，退役解决构建依赖，见 [build_mod.py 退役](/developer/build/build-mod-retirement)。

## 阶段划分

| 阶段 | 内容 | 状态 |
| --- | --- | --- |
| S0/S1 | 盘点、依赖与消费者核对 | 完成 |
| S2-6 | 生产 Kotlin 源码迁入 `app/src/main/kotlin/` | **完成**（PASS） |
| S3 | 根级正式 AGP 入口切换 | NOT RUN |
| S4 | 退役旧 Groovy 入口与 build_mod.py | NOT RUN |

S3/S4 的启动条件是完整原生游戏构建与独立发布门禁都满足，而不是「目录看起来整齐」。未切换根级正式入口前，不得声称迁移全部完成。

## S2-6 的做法与结果

- 用 `git mv` 迁移 36 个 `.kt` 文件，保留 Git 历史；
- 同步全部消费者：AGP sourceSets、根 `build.gradle`、`build_mod.py`、命名守卫、Rust 指纹、R8 keepgen、教程链、调度检查、CI 路径过滤与测试；
- 验证：同一 game jar 重建的 AGP 完整游戏 APK 与迁移前**逐字节相同**（APK SHA-256 `15a21f5d57c4b2e0c513398a17944a512b95fe17d186036dc1e234c395958d17`）；
- 命名增量守卫支持 rename 配对：36 moved / 历史违规 15 / 当前 15 / 无新增；
- CI 增加目录门禁 `scripts/check_directory_layout.py`，迁移后阶段为 `nested-new`。

「逐字节相同」是这次迁移最有价值的一条证据：它说明迁移只改变了文件位置，没有改变构建产物内容。

## 迁移纪律

- 一次一个可验收闭包，小 PR、Required Checks；
- 旧/新并存期必须显式声明 Source Sets，避免重复类；
- 未切换根级正式入口前，不得声称迁移全部完成；
- 不移动 `build/`、`release/`、`savestates/`、冻结基线与唯一证据。

## 已确认与未确认

- **已确认**：S2-6 完成且 APK 逐字节一致；目录门禁已进入 CI。
- **未确认**：S3/S4 未开始；根级标准工程与 `build_mod.py` 退役仍未完成。
- **版本边界**：以上结论对应 Android 3.21.0 与 AGP 9.5.1。

## 参考资料

- [Issue #61（目录标准化）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/61)
- [docs/FACTS.md 目录迁移记录](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/build.md#f-r113-01)
- [Android PR #83（S2-6 迁移）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/83)、[PR #84（目录门禁进 CI）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/84)

## 相关条目

[Android 架构](/developer/architecture/android) · [AGP 构建管线](/developer/build/agp) · [build_mod.py 退役](/developer/build/build-mod-retirement)
