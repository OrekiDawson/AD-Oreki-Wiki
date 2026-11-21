---
title: "术语表"
description: "MOD、AGP、ABI、shadow、J8 混合、门禁等常用术语的中文解释"
tags:
  - 参考
aliases:
  - "/references/terminology"
---


本表解释本站反复出现的术语。技术标识符、API、哈希与命令保留真实拼写；首次出现时正文会给出中文解释。

| 术语 | 含义 |
| --- | --- |
| Oreki Edition | 本 MOD 的产品名 |
| 官方基线 | Android 端固定的官方 3.21.0 APK；Web 端固定的 2026-07-17 上游快照 |
| AGP | Android Gradle Plugin，本工程使用 9.5.1 |
| Gradle | Android 构建工具，负责编译、打包与任务编排 |
| DEX | Android 的可执行字节码格式；官方游戏只发布混淆 DEX |
| ABI | 二进制接口：类名、方法/字段描述符、继承关系等运行期约定 |
| shadow 类 | 官方 Kotlin 类被改名为 `oreki/shadow/kotlin/**` 的副本，用于隔离命名 |
| J8 混合 | enjarify 基线 + 少量 dex2jar 热路径替换的官方类转换形态 |
| enjarify / dex2jar | DEX→JVM class 的两种转换器，语义与副作用不同 |
| livelock | 线程持续空转、逻辑不推进（不是死锁） |
| Signature 回填 | 恢复 Java 泛型签名，供 Gson 正确反序列化 |
| Gson | 游戏使用的 JSON 序列化库，依赖泛型与反射 |
| 夹具 | 用于验收的合法存档样本 |
| 门禁 | Candidate / Verify / Release 等受保护检查 |
| 四渠道 | GitHub Releases、OneDrive、Google Drive、本地 SSH/SFTP |
| 现实（Reality） | 永恒之上的重置层，重置时间研究与膨胀进度 |
| 天神（Celestial） | 现实之后的后期系统，包含 V、Ra、Lai'tela、Pelle 等 |

## 参考资料

- [docs/FACTS.md（Android 事实导航索引）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/FACTS.md) 与 [docs/facts/（主题事实库）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/main/docs/facts)
- [知识库仓库](https://github.com/OrekiDawson/AD-Oreki-Wiki)

## 相关条目

[来源索引](/developer/references/source-index) · [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) · [存档兼容与自动保存](/player/gameplay/saves) · [APK 签名与升级兼容](/developer/build/apk-signing)
