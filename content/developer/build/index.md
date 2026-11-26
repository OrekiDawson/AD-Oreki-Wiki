---
title: "构建与交付"
description: "AGP/Gradle 构建体系、APK 签名与升级兼容、CI/CD 门禁、Signature 回填与版本交付"
tags:
  - 构建
  - 导航
aliases:
  - "/build"
---


本分类覆盖从官方 DEX 到可安装 APK，再到受保护发布门禁的完整链路：构建输入怎样准备，签名与升级兼容受哪些约束，哪些检查会让流水线失败，以及「构建成功」与「可以发布」之间的差别。

## 页面

| 页面 | 主题 |
| --- | --- |
| [AGP 构建管线](/developer/build/agp) | 完整游戏 APK 的构建步骤、输入来源与构建守卫 |
| [APK 签名与升级兼容](/developer/build/apk-signing) | 包名、证书、versionCode 与覆盖安装约束 |
| [CI/CD 与受保护门禁](/developer/build/ci-cd) | 工作流分工、Required Checks、四渠道交付 |
| [Signature 回填与 Gson 存档](/developer/build/signature-backfill) | 恢复泛型签名，避免存档字段类型漂移 |
| [R8 分层策略](/developer/build/r8) | Release 默认关闭 R8 的原因与实验边界 |
| [build_mod.py 退役](/developer/build/build-mod-retirement) | 旧 Python 补丁链的退役目标与当前依赖 |

## 关键区别

- **能构建**：本地产出 APK。
- **能安装运行**：AVD/真机冷启动与基本功能正常。
- **能发布**：通过受保护 Candidate / Verify / Release 门禁，四渠道同一 SHA-256。

三者不能互相替代，详见 [发布状态](/developer/current/release-status)。

## 相关分类

[架构与运行时](/developer/architecture/) · [当前状态](/developer/current/) · [历史归档](/developer/history/)
