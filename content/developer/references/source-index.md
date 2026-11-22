---
title: "来源索引"
description: "权威事实来源：Android/Web 仓库、规则文件、PR、Commit、Run 与报告的位置"
tags:
  - 参考
aliases:
  - "/references/source-index"
---


本页汇总本站引用的一手来源。原则是：**优先固定 Commit 的具体文件、报告或 Run**，不写会漂移的编号，不编造行号与哈希。

## 仓库

| 仓库 | 可见性 | 作用 |
| --- | --- | --- |
| [AD-Oreki-Edition-Android](https://github.com/OrekiDawson/AD-Oreki-Edition-Android) | 公开 | Android 源码、构建、基线、AVD 验收与发布 |
| [AD-Oreki-Edition-Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web) | 公开 | Web 源码、Playwright 验证、oreki.net 部署 |
| [AD-Oreki-Wiki](https://github.com/OrekiDawson/AD-Oreki-Wiki) | 公开 | 本站源码（Quartz 5 + GitHub Pages） |

项目另有一个统一管理仓库，用于规则、事实索引、报告与交接；它不包含子仓库源码，也不作为公开事实来源引用。

## 规则与事实文件

- Android：`AGENTS.md`、`docs/DELIVERY_RULES.md`、`docs/FACTS.md`（导航索引，≤400 行）与 `docs/facts/`（主题事实库，按主题文件查阅）
- Web：`AGENTS.md`、`docs/FACTS.md`、`docs/SHARED_GAMEPLAY_STANDARD.md`
- 本站权威规则：[反物质维度MOD Wiki:知识库规则](/wiki-rules)

## 关键证据

| 内容 | 位置 |
| --- | --- |
| 混合运行时 P0 闭环 | [PR #88](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/88)，合并 `ae734966`；[报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/ae734966bf712faca3ff7bbb389d8724a8efe7e5/reports/R113-01/P0-CLOSURE.md) |
| 180 分钟长跑 FAIL | [PR #90](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/90)，合并 `d950d110`；[结果](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/d950d1102f13e81f78dfdcdfb308359ee3eb1633/reports/R113-01/180min-RESULT.md) |
| 天神策略叶子修复 | [PR #91](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/91)，合并 `4a800464`；[报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/4a800464ef820bf6e3fcb692a835ee2c2c749aec/reports/R113-01/CELESTIAL-LEAVES-FIX.md) |
| 现实自动永恒复位修复 | [PR #92](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/92)，合并 `951fa231`；现行自动化专题见 [智能自动购买器](/player/gameplay/automation) |
| 签名环境阻塞 | [Run 43679508810](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/actions/runs/43679508810) |
| 目录迁移 | [PR #83](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/83)、[PR #84](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/84) |
| R103 四渠道发布 | [交付报告](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/R103-%E4%BA%A4%E4%BB%98%E6%8A%A5%E5%91%8A.md) |
| R101 非法永恒页签修复 | [reports/R101-p0-fix](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/tree/main/reports/R101-p0-fix) |
| Web R121 真实新档终局 | [完成记录](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/f7044da0f80a50ccbe5cd827fea717b4d5a1eae6/reports/R104/web/r121-01/README.md)，[摘要](https://github.com/OrekiDawson/AD-Oreki-Edition-Web/blob/f7044da0f80a50ccbe5cd827fea717b4d5a1eae6/reports/R104/web/r121-01/summary.json) |
| Android R121 EC/现实自动化停滞 | [P1 报告（固定提交）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/a1617a9e0d652a16ba050be25bb3f5b1a5ef1c43/reports/R121-01/R121-01-P1-post-ec-infinite-reset.md)，[PR #204](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/204) |

## 原版游戏资料

| 来源 | 用途 | 许可与注意 |
| --- | --- | --- |
| [官方网页源码（固定 Commit）](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca) | 原版公式、阈值与解锁条件的首要依据 | 遵循仓库自身许可 |
| [《反物质维度》社区 Wiki](https://antimatterdimensions.wiki.gg/wiki/Antimatter_Dimensions) | 概念、术语、分类与机制概览 | 文本与图像按 [CC BY-SA 4.0](https://antimatterdimensions.wiki.gg/wiki/Meta:Copyrights)；不批量复制 |
| [Steam 商店页面](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/) | 发行时间、平台与官方介绍 | 仅引用公开信息 |
| [上游源码仓库](https://github.com/IvarK/AntimatterDimensionsSourceCode) | 当前网页源码仓库 | 与旧仓库 `IvarK.github.io` 区分 |

本站解释原版机制时，优先用**官方源码**交叉核对；社区 Wiki 只作概念与分类参考。原版行为与 MOD 修改的集中对照见 [原版行为与 Oreki Edition 修改](/player/gameplay/original-vs-mod)。转载或改编受版权保护内容时，须保留署名、来源、修改说明并相同方式共享；图片与其他素材单独核实授权。

## 引用规范

- 链接优先绑定具体 Commit；不得只写「PR #88」而不给链接。
- 不编造 Commit、行号、测试报告或 ABI 描述符。
- 不引用未审核 AI 草稿或不存在的文件作为证据。

## 相关条目

[术语表](/player/terminology) · [反物质维度MOD Wiki:知识库规则](/wiki-rules) · [历史归档](/developer/history/)
