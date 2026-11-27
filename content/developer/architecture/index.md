---
title: "架构"
description: "沿着 Android、Web 与双端行为契约定位开发任务"
tags:
  - 架构
  - 导航
aliases:
  - "/architecture"
---

开发者第一次打开源码时，最容易迷失在两个入口之间：Android 把官方游戏带进自己的构建与运行时，Web 则从冻结的上游继续演化。本页是一张任务地图，不是提交记录；先找到边界，再沿着真实调用路径深入实现。

## 先按问题进入

### 我想先跑通一个最小改动

从[第一次参与开发](/developer/first-contribution)开始，用[项目总览](/developer/project-overview)确认仓库、模块和验证边界。需要理解目录为什么这样摆放时，再读[目录标准化迁移](/developer/architecture/directory-migration)。

### 我想理解 Android 的运行时

[Android 架构](/developer/architecture/android)解释 AGP 输入、官方 DEX、新增 Kotlin 与最终 APK 如何接在一起。[Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)解释编译期看不见宿主时如何建立调用边界；遇到类、方法或寄存器找不到，则转到[DEX 与 ABI 语义恢复](/developer/reverse-engineering/dex-abi)。

### 我想理解 Web 与双端差异

[Web 架构](/developer/architecture/web)沿启动、主循环和 MOD 调度器追踪浏览器端；[双端行为一致性](/developer/architecture/parity)把阶段、资源、挑战和自动化拆成可观察的行为契约；遇到 $e^{308}$ 以上的资源、阈值或读档差异时，继续看[超大数值：从尾数与指数到跨端一致性](/developer/architecture/numeric-model)。实现阶段门禁或天神时，继续看[GUI 阶段门禁](/developer/architecture/gui-stage-gates)和[天神解锁与跨端实现](/developer/architecture/celestial-implementation)。

## 一条从源码到行为的路线

```text
入口与目录 → Android/Web 模块 → 调用与数据路径 → 跨端行为契约 → 构建与验证
```

1. 用[项目总览](/developer/project-overview)建立名词和目录坐标。
2. 选择[Android 架构](/developer/architecture/android)或[Web 架构](/developer/architecture/web)，确认改动属于哪一端。
3. 沿具体实现阅读 Kotlin 运行时、DEX/ABI 映射或阶段门禁专题，不只看文件清单。
4. 用[双端行为一致性](/developer/architecture/parity)检查改动是否改变另一端应保持的玩家行为。
5. 进入[构建与交付](/developer/build/)，把“代码能编译”与“产物能安装、能验证、能发布”分开处理。

## 按模块查找

- **Android 与混合运行时**：[Android 架构](/developer/architecture/android)、[Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)。
- **Web 与浏览器行为**：[Web 架构](/developer/architecture/web)、[双端行为一致性](/developer/architecture/parity)、[派生状态与缓存失效](/developer/architecture/derived-state-invalidation)、[效果对象与倍率组合](/developer/architecture/effect-model)。
- **Web 状态与内容**：[Web 离线进度](/developer/architecture/web-offline-simulation)、[Web UI 反应式更新](/developer/architecture/web-ui-reactivity)、[教程内容管线](/developer/architecture/tutorial-content-pipeline)。
- **机制落地**：[GUI 阶段门禁](/developer/architecture/gui-stage-gates)、[天神解锁与跨端实现](/developer/architecture/celestial-implementation)。
- **同步与调度**：[Android GUI 同步桥](/developer/architecture/android-gui-sync)、[调度器状态机](/developer/architecture/scheduler-state-machine)、[自动化状态所有权](/developer/architecture/automation-ownership)。
- **数值与兼容**：[超大数值](/developer/architecture/numeric-model)、[存档进度比较器](/developer/architecture/save-progress-comparator)、[Kotlin 混合运行时 ABI](/developer/architecture/kotlin-runtime)。
- **逆向与源码恢复**：[逆向与语义映射](/developer/reverse-engineering/)、[DEX 与 ABI 语义恢复](/developer/reverse-engineering/dex-abi)。

## 附属资料

固定源码入口见[源码索引](/developer/references/source-index)，实现与产物证据见[证据库](/developer/evidence/)，版本变化请回到对应源码仓库的提交历史。[AI Summary](/developer/ai-summaries/)只作已核实正文的辅助速览，不替代技术文章。

继续阅读：[构建与交付](/developer/build/) · [故障排查](/developer/troubleshooting/) · [开发者首页](/developer/)
