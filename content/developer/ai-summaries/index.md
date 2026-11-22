---
title: "AI Summary 索引"
description: "仅属于开发者专区的已标识、可折叠、有来源 AI Summary 索引"
tags:
  - AI摘要
  - 开发者
  - 导航
---

本索引只收录依据已核实技术正文、固定来源和明确验证状态整理的 AI Summary。摘要不能替代正文、源码或运行证据；未经审核的 `content/ai-drafts/` 仍不进入公开 HTML、搜索或 RSS。

## 已审核摘要

<details>
<summary>AI Summary：Kotlin 混合运行时与 ABI 边界（审核日期 2026-11-21；依据：官方 3.21.0 反编译读码 + 已构建 APK 的 5 分钟自动化运行；180 分钟终局与正式发布验收 NOT RUN）</summary>

Oreki Edition Android 以官方 3.21.0 混淆 DEX 为只读基线，新增业务由 Kotlin 编译并与官方运行时共同组成最终 APK。风险集中在官方混淆类、方法、字段描述符与新增 Kotlin 调用之间的类型边界；修改 ABI 适配时必须核对当前 3.21.0 的签名和调用链，不能沿用旧版本符号。本文摘要依据 [Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime) 与 [DEX 与 ABI 反混淆](/developer/reverse-engineering/dex-abi) 的正文和固定来源整理，不新增技术断言，也不能代替构建或真实验收。

</details>

## 收录规则

1. 正文已经人工核对，并保留可直接打开的固定来源。
2. 摘要必须说明适用版本、验证状态和复核时间，不能把推断写成实测。
3. 默认折叠，只在开发者专区出现；玩家页面不嵌入机器摘要。
4. 摘要不得包含未经审核草稿、私人路径、凭据或不可公开的证据。
