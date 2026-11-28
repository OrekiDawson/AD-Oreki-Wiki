---
title: "MOD 介绍"
description: "了解 MOD 保留的成长链、自动化功能与 Android/Web 使用边界"
tags:
  - MOD
  - 介绍
  - 玩家
aliases:
  - "/mods"
---

本 MOD 是基于《反物质维度》的 Android/Web 修改版，不是原版游戏的官方更新。它保留“购买维度、积累反物质、通过重置换取更高层成长”的主循环；反物质维度、维度提升、星系、大坍缩、无限、永恒、时间研究、现实和天神仍然按照各自的游戏规则逐步展开。

因此，原版攻略并不会因为换成 MOD 就全部失效，但也不能把原版页面上的每个数字直接套过来。遇到门槛、自动化或平台行为的差异，应转到 [原版与 MOD](/player/gameplay/original-vs-mod) 查看范围，再以当前版本的游戏提示为准。

## 专题导航

- [原版与 MOD](/player/gameplay/original-vs-mod)：明确两套规则的区别。
- [MOD 玩法改动](/player/gameplay/mod-changes)：查阅数值、解锁与自动化调整。
- [平台差异](/player/gameplay/platform-differences)：了解 Android 与 Web 的实际区别。

## MOD 改了什么

### 自动化仍受游戏规则约束

原版自动购买器负责执行已经明确的购买或重置动作；本 MOD 另外提供统一调度器，定期根据当前阶段、资源和目标重新安排受管的自动化。它解决的是重复操作和路线判断，不是替玩家创造资源。

自动化不会绕过购买价格、解锁条件或挑战限制，也不会把尚未完成的重置写成已经完成。一个按钮出现在页面上，或者调度器尝试过一次，都不等于对应阶段已经结算。有关自动购买器、调度节拍和 `acted`、`no-op`、`fail` 三种结果的说明，见[自动化](/player/gameplay/automation)。

这也解释了为什么手动操作仍然有意义：新阶段刚出现时，先观察一次真实结算，再决定是否交给自动化，通常比一开始就让所有策略接管更容易发现条件和路线问题。自动化停在原地时，先查目标资源、阶段门禁和挑战限制，不要把调度间隔调得更短就当成解决方案。

### 阶段不会因页面显示而提前完成

页面入口、按钮状态和真实结算是三件不同的事。测试版本、旧存档或界面刷新可能让后续入口提前出现；只有对应的重置产物和长期资源真正写入存档，才能说明阶段已经完成。遇到“看得见却不能用”或“重置后页面变少”，请先读[阶段解锁](/player/gameplay/stage-gates)，不要直接修改存档字段。

## Android 与 Web

两端都称为本 MOD，但它们不是同一个存档容器。Android 使用独立的 APK 和设备存储；Web 使用浏览器的站点数据。平台、游戏基线和版本不同，可能导致同名功能的界面、默认设置或存档字段不同，所以不能因为两端看起来相似，就假定可以直接互导。

| 你的目的 | 适合的入口 |
| --- | --- |
| 想在移动设备上持续游玩 | [Android：Release、安装与升级](/player/download-and-version/android) |
| 不想安装 APK，先体验网页端 | [Web：入口、缓存与版本识别](/player/download-and-version/web) |
| 想测试尚未稳定的改动 | [下载与版本](/player/download-and-version/)中的 Pre-release 说明 |
| 想核对网页端的实现 | [Web 端开发说明](/developer/architecture/web) |

安装更新、换设备或尝试 Pre-release 前，先按[存档](/player/gameplay/saves)导出并保留独立备份。能打开导入窗口，只说明入口存在；导入后还要检查阶段、资源、研究和自动购买器，并重新打开确认状态仍然存在。跨平台或跨版本迁移没有经过当前版本确认时，不要拿唯一主档试验。

## 游玩参考

- 想知道具体的自动化动作和停滞原因，读[自动化](/player/gameplay/automation)。
- 想判断某个按钮是否真的解锁，读[阶段解锁](/player/gameplay/stage-gates)。
- 想比较原版规则与 MOD 调整，读[原版与 MOD](/player/gameplay/original-vs-mod)。
- 想下载稳定版或查看测试版入口，读[下载与版本](/player/download-and-version/)。

## 资料

- [MOD Web 源码仓库](https://github.com/OrekiDawson/AD-Oreki-Edition-Web)
- [MOD Android Releases](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/releases)
- [玩家专区](/player/)
