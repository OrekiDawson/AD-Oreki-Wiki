---
title: "Android 与 Web：版本和行为差异"
description: "理解 MOD 两端的基线、同名功能差异与玩家核对版本的方法"
tags:
  - 玩法
  - Android
  - Web
  - 版本
aliases:
  - "/gameplay/platform-differences"
---

Android 和 Web 都使用本 MOD 这个名称，却不是同一份程序。Android 以官方 3.21.0 游戏 DEX 和 Kotlin 适配层为基础，Web 则以冻结的上游网页源码和 JavaScript MOD 模块为基础；两端共享玩法目标，但不共享构建链、版本号或所有原版功能。

## 同名功能差异

同一个按钮可能由不同代码实现，同一个数值也可能处于不同的版本边界。例如已核对的一项差异是：Android 原版带有无限维度自动购买器，而 Web 原版没有，Web 端的相关能力由 MOD 自己补充。看到两端都有“无限维度自动化”时，不能因此推断它们使用相同的默认间隔、状态字段或重置时机。

自动化也存在两种时间：Web 的游戏循环根据浏览器经过的时间和离线模拟分段推进，Android 的调度器还受到 Activity、线程和设备休眠影响。因此可以比较“合法节拍后发生了什么”，不能要求两台设备在墙上时钟的同一秒执行动作。

## 识别当前规则

1. 先确认平台：Android APK、Web 浏览器或原版页面。
2. 再确认版本：APK 版本、网页发布版本或当前下载页面标识。
3. 对照游戏内按钮说明和实际保留/清除结果，不要只看攻略中的数字。
4. 如果涉及自动化，分别检查原版自动购买器设置和 MOD 的统一调度设置。
5. 遇到差异时记录平台、版本、存档阶段、操作顺序和真实结果，再与[玩家常见问题](/player/faq/)中的排障步骤对照。

## 三种常见误读

**把原版门槛套到 MOD。** MOD 可能缩放 V、虚构升级或莱特拉相关门槛；这只能说明当前 MOD 改了准备期，不能说明特殊现实的目标被取消。

**把 Android 的表现当成 Web 的保证。** Android 的 Kotlin 适配层、APK 生命周期和设备调度会影响行为；Web 的游戏循环、浏览器后台策略和离线模拟又是另一套边界。

**把一次成功尝试当成跨端等价。** 某次存档在 Android 上完成，不足以证明 Web 上同一存档、同一时间和同一路线也能得到相同结果。跨端比较应看阶段、资源变化、合法重置和可见结果，而不只是按钮名称。

## 遇到平台差异时怎样反馈

先不要清档或反复覆盖安装。保留存档备份，记录：

- 平台与版本；
- 当前阶段和正在进行的挑战/特殊现实；
- 自动化总开关、调度节拍和手动修改过的设置；
- 最近一次真实购买或重置；
- 两端实际显示和资源变化的差异。

若问题涉及签名、安装或升级，转到[下载与版本](/player/download-and-version/)；若涉及阶段提前开放，阅读[阶段解锁与页面显示](/player/gameplay/stage-gates)。不要用历史报告或开发者 CI 结果代替当前玩家设备上的观察。

## 来源与延伸

- [Android 3.21.0 基线](https://github.com/OrekiDawson/AD-Oreki-Edition-Android)
- [MOD Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web)
- 原版网页源码固定基线（源码定位：IvarK/AntimatterDimensionsSourceCode@5409e320cecef96a917cca1dfb68f1f183e499ca/；具体文件证据留在内部核验记录）
- [双端行为一致性](/developer/architecture/parity)：面向开发者的实现与行为契约说明。

继续阅读：[MOD 玩法改动：数值、解锁与自动化](/player/gameplay/mod-changes) · [智能自动购买器](/player/gameplay/automation) · [存档安全](/player/gameplay/saves)
