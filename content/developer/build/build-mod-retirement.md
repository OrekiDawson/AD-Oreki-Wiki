---
title: "build_mod.py 退役"
description: "解释旧 Python 补丁构建链为什么要退役、当前迁移状态与不牺牲玩法正确性的边界"
tags:
  - 构建
  - 迁移
aliases:
  - "/build/build-mod-retirement"
---


`scripts/build_mod.py` 是历史上用于把补丁打进官方 APK 的 Python 构建脚本。项目目标是**最终删除它**：正式构建、Candidate/Verify/Release 与相关生成/校验流程都不得再依赖该文件或其换名包装。本条目解释为什么退役、现在到哪一步、以及哪些东西不能被牺牲。

## 为什么必须退役

1. **可追溯性**：脚本式补丁链难以稳定复现，产物与输入的对应关系弱于标准 Gradle/AGP 构建。
2. **可验证性**：大量文本替换逻辑把「构建期」和「运行期」的语义混在一起，ABI 问题更晚暴露。
3. **安全与维护**：正式发布不应依赖一条难以审计的脚本；CI 也需要能阻止它被重新引用。
4. **架构收敛**：AGP 9.5.1 + Kotlin 业务源码是长期生产入口，退役是同一主线的一部分，见 [目录标准化迁移](/developer/architecture/directory-migration)。

## 当前状态

| 项 | 状态 |
| --- | --- |
| 依赖清单与函数分级 | 进行中 |
| 资源/Manifest 迁移 | 部分 |
| 教程与生成绑定 | 部分 |
| 业务补丁迁移（Kotlin 重建） | 部分 |
| 删除文件 | **NOT RUN**（需 AGP 原生完整游戏验收） |

未删除不等于可以继续扩大依赖：新代码应写进 Kotlin 业务层，而不是继续加补丁。

## 退役不得牺牲什么

- 玩家真实结算、阶段门禁、自动购买器、实时 UI、存档与双端等价行为；
- 原版签名/包名/版本升级兼容；
- 受保护 Candidate/Verify/Release 门禁与四渠道同一 SHA。

历史报告中的引用保留，不重写历史。删除后 CI 需要阻止正式构建重新引用旧脚本或旧构建链。

## 先决条件

退役的最终验收依赖 AGP 原生完整游戏可运行与独立发布门禁通过。当前这两项分别是「本地产物可用」与「受保护门禁 BLOCKED」，所以退役仍处于进行中，不能宣布完成。

## 已确认与未确认

- **已确认**：退役是长期强制目标；部分功能已由 Kotlin/AGP 接管；删除尚未发生。
- **未确认**：干净工作区无脚本完整构建、独立发布门禁、真实 APK 安装与存档/挑战/GUI 的联合验收（部分 NOT RUN）。
- **禁止**：为宣布退役而绕过门禁、手改产物或删除历史证据。

## 参考资料

- [Issue #52（build_mod.py 退役）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/52)
- [docs/BUILDMOD_RETIREMENT_LEDGER.md](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/BUILDMOD_RETIREMENT_LEDGER.md)
- [Android AGENTS.md 第 14 节](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/AGENTS.md)

## 相关条目

[AGP 构建管线](/developer/build/agp) · [目录标准化迁移](/developer/architecture/directory-migration) · [CI/CD 与受保护门禁](/developer/build/ci-cd)
