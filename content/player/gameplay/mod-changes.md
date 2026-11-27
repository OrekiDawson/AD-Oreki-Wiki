---
title: "MOD 玩法改动：数值、解锁与自动化"
description: "集中查看 Oreki Edition 相对原版已核对的门槛缩放、玩法调整与自动化边界"
tags:
  - 玩法
  - MOD
  - 数值
aliases:
  - "/gameplay/mod-changes"
---

Oreki Edition 的改动大致分成两类：一类改变数字或解锁门槛，让后期系统更早进入可玩的节奏；另一类增加操作层，例如统一自动化调度和阶段提示。无论哪一类，真正的挑战结算、资源扣除和重置保留关系仍应由游戏的合法入口完成。

## 已核对的玩家可见差异

下表只列出当前资料能够支持的代表性差异。数值属于对应版本的实现，不是永远不变的规则：

| 机制                | 原版                        | Oreki Edition                   | 玩家应该怎样理解                                 |
| ------------------- | --------------------------- | ------------------------------- | ------------------------------------------------ |
| V 解锁所需现实次数  | 10000                       | 60                              | MOD 缩短准备期，但仍需满足当前页面列出的其他条件 |
| V 解锁所需膨胀时间  | $10^{320}$                  | $10^{30}$                       | 数字变小不等于可以跳过 V 的特殊目标              |
| V 解锁所需复制体    | $10^{320000}$               | $10^{20000}$                    | 仍应以当前版本实际条件为准                       |
| IU15 反物质指数门槛 | $1.5 \times 10^{12}$        | $10^8$                          | 这是门槛缩放，不是直接赠送虚幻升级               |
| IU25 成本           | $1.6 \times 10^{15}$        | $5 \times 10^9$                 | 购买仍需经过真实升级入口                         |
| 莱特拉熵速率除数    | $10^{11}$                   | $2 \times 10^7$                 | 熵增长节奏改变，具体效果取决于当前实现           |
| 全局自动化节拍      | 各自动购买器自己的间隔/批量 | 统一调度层 1～60 秒，默认 10 秒 | 调度器重新判断策略，不把所有购买器锁成 10 秒     |

原版常量可从[固定上游源码](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca)核对，MOD 侧则应查看当前 Android/Web 实现。表中的数字是帮助玩家建立方向感，不应替代当前版本的游戏内说明。

## 自动化改动改变的是操作，不是裁决

原版已经有自己的自动购买器。MOD 增加的统一调度层负责判断阶段、目标和受管配置，减少重复点击，但不会凭空创造 IP、EP 或天神解锁，也不会把一次 no-op 当作真实结算。

自动永恒等受管设置还有“玩家明确关闭优先”的边界；若原版现实结算触发了专门复位，MOD 才可能按条件重新接管。具体使用方式见[智能自动购买器](/player/gameplay/automation)。

## 原版语义仍然保留的部分

- 挑战必须通过真实条件和结算入口完成；
- 阶段解锁不能只靠页面按钮或手动直达；
- 重置后的保留与清除关系由游戏逻辑决定；
- 自动化可以调用合法购买/重置，但不应直接写入“已完成”状态；
- 存档字段的读取和恢复不能因为界面调整就被当成另一种语义。

这条边界很实用：如果 MOD 页面显示得更早、按钮按得更快，不代表游戏已经获得了原版结算应产生的奖励。遇到阶段或存档异常时，先读[阶段解锁与页面显示](/player/gameplay/stage-gates)和[存档安全](/player/gameplay/saves)。

## 参考来源

- [V 原版门槛](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/celestials/v.js)
- [虚构升级原版门槛](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/reality/imaginary-upgrades.js)
- [莱特拉原版实现](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/laitela/laitela.js)
- [原版社区 Wiki](https://antimatterdimensions.wiki.gg/wiki/Antimatter_Dimensions)

继续阅读：[Android 与 Web：版本和行为差异](/player/gameplay/platform-differences) · [天神系统](/player/gameplay/celestials) · [原版玩法译文](/player/original/)
