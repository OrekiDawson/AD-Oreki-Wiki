---
title: "架构导航：从入口到运行时"
description: "沿着 Android、Web 与双端一致性的任务路径理解 Oreki Edition 的架构"
tags:
  - 架构
  - 导航
aliases:
  - "/architecture"
---

开发者第一次打开源码时，最容易迷失在两个入口之间：Android 把官方游戏带进自己的构建与运行时，Web 则从冻结的上游继续演化。这里不是提交记录，而是一张阅读地图：先找到边界，再沿着真实调用路径深入实现。

## 先选你的问题

### 我想先跑通一个最小改动

从[第一次贡献](/developer/first-contribution)开始，随后用[项目总览](/developer/project-overview)确认仓库、模块和验证边界。需要知道目录为什么这样摆放时，再读[目录标准化迁移](/developer/architecture/directory-migration)。

### 我想理解 Android 的运行时

先读[Android 架构](/developer/architecture/android)，它解释 AGP 输入、官方 DEX、新增源码和最终 APK 如何接在一起。若改动涉及 Kotlin 与原有混淆代码的交界，再读[Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)；若遇到类、方法或寄存器找不到，转到[DEX 与 ABI 语义恢复](/developer/reverse-engineering/dex-abi)。

### 我想理解 Web 端以及双端差异

[Web 架构](/developer/architecture/web)说明冻结上游、MOD 层和浏览器验证各自负责什么；[双端行为一致性](/developer/architecture/parity)则把阶段、资源、挑战和自动购买器拆成可比较的行为契约。实现天神或阶段门禁时，继续看[天神解锁与跨端实现](/developer/architecture/celestial-implementation)和[GUI 阶段门禁](/developer/architecture/gui-stage-gates)。

## 一条从源码到行为的阅读路线

```text
入口与目录 → Android/Web 模块边界 → 调用与数据路径 → 跨端行为契约 → 构建与验证
```

1. 用[项目总览](/developer/project-overview)建立名词和目录的共同坐标。
2. 选择[Android 架构](/developer/architecture/android)或[Web 架构](/developer/architecture/web)，确认你要改的功能属于哪一端。
3. 沿着具体实现阅读：Kotlin 运行时、DEX/ABI 映射或天神/阶段门禁专题都给出源码入口，而不是只给文件清单。
4. 用[双端行为一致性](/developer/architecture/parity)检查改动是否改变了另一端应该保持的玩家行为。
5. 最后进入[构建与交付](/developer/build/)，把“代码能编译”与“产物能安装、能验证、能发布”分开处理。

## 按模块查找

- **Android 与混合运行时**：[Android 架构](/developer/architecture/android)、[Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)、[目录标准化迁移](/developer/architecture/directory-migration)。
- **Web 与浏览器行为**：[Web 架构](/developer/architecture/web)、[双端行为一致性](/developer/architecture/parity)。
- **游戏机制落地**：[天神解锁与跨端实现](/developer/architecture/celestial-implementation)、[GUI 阶段门禁](/developer/architecture/gui-stage-gates)。
- **逆向与源码恢复**：[逆向与语义映射](/developer/reverse-engineering/)、[DEX 与 ABI 语义恢复](/developer/reverse-engineering/dex-abi)。

## 附属资料

实现证据与固定源码索引集中在[源码索引](/developer/references/source-index)和[证据库](/developer/evidence/)，历史变更放在[历史归档](/developer/history/)。[AI Summary](/developer/ai-summaries/)仅作已核实正文的辅助速览，不替代上述技术文章。

继续阅读：[构建与交付](/developer/build/) · [故障排查](/developer/troubleshooting/) · [开发者首页](/developer/)
