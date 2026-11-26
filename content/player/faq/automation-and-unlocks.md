---
title: "自动化与阶段入口"
description: "排查自动购买器、统一调度器和挑战、天神入口的解锁条件"
tags:
  - FAQ
  - 玩家
  - 自动化
aliases:
  - "/faq/automation-and-saves"
---

自动购买器没有动作，或挑战、天神的入口已经出现在页面上却不能使用时，先区分“页面可见”“按钮可点击”和“真实条件已满足”。这三件事并不等价。

## 自动购买器不工作怎么办？

按以下顺序排查：

1. 确认对应自动购买器已经解锁，且总开关打开。
2. 确认当前资源足够，没有挑战或特殊现实禁用这项操作。
3. 如果使用 Oreki Edition，观察一个完整的调度节拍。统一调度器默认每 10 秒检查一次受管策略，可调整为 1～60 秒；这不是原版每个自动购买器自己的内部间隔。
4. 仍无变化时，记录平台、版本、阶段和受影响的项目，再反馈问题。

原版自动器和 MOD 调度器各自负责什么，见[智能自动购买器](/player/gameplay/automation)。

## 我手动关掉的自动购买器又打开了，正常吗？

先区分受管项目和自动永恒。反物质维度、计数频率、维度提升、星系和大坍缩等受管项目，可能在下一次有效调度时按照当前策略重新设置；要长期改变它们，应调整调度器目标或管理设置，而不是只改一次被托管的字段。

自动永恒是一个单独的边界。原版现实结算可能复位它，MOD 的专用逻辑会在符合条件时处理这种复位，同时应尊重玩家明确关闭自动永恒的选择。若它在没有合理结算复位的情况下重新打开，记录版本、当前阶段、操作顺序和是否发生过现实结算，再反馈问题。

## 永恒挑战买不了，只是资源不够吗？

不一定。永恒挑战通常同时检查时间之理、时间研究路径和挑战本身的额外条件。只积累 TT 或 IP，却没有买齐通往入口的研究，按钮仍然不会开放。

打开挑战说明，沿研究树检查前置节点；确认条件后，再决定继续积累资源还是重新规划研究路线。[挑战与真实结算](/player/gameplay/challenges)和[现实与时间研究](/player/gameplay/reality-time-studies)分别解释挑战结算与研究树。

## 挑战或天神入口为什么显示了却不能用？

检查入口旁的条件、研究、资源、累计次数，以及当前是否处在另一种挑战或特殊现实中。不要编辑存档来跳过门槛；若状态与条件明显矛盾，先保留备份并记录复现步骤。[阶段解锁与页面显示](/player/gameplay/stage-gates)、[挑战与真实结算](/player/gameplay/challenges)和[天神系统](/player/gameplay/celestials)分别提供排查方向。

## 什么时候该报告自动化或存档问题？

先停止反复点击、清档或覆盖导入，保留备份。报告时写清平台与版本、当前阶段、最近一次合法购买或重置、自动化设置、预期动作和实际结果；不要公开账号令牌、私人路径或包含个人数据的存档。跨平台导入的具体风险和检查步骤见[存档与兼容性](/player/faq/saves-and-compatibility)。

## 相关条目

[智能自动购买器](/player/gameplay/automation) · [挑战完成判定与卡关排障](/player/gameplay/challenge-troubleshooting) · [阶段门禁](/player/gameplay/stage-gates) · [原版与 Oreki Edition 的区别](/player/gameplay/original-vs-mod)

原版自动化与挑战条件的基础资料：[Automation](https://antimatterdimensions.wiki.gg/wiki/Automation?oldid=3396)、[Challenges](https://antimatterdimensions.wiki.gg/wiki/Challenges?oldid=3106) 和 [Eternity Challenges](https://antimatterdimensions.wiki.gg/wiki/Eternity_Challenges?oldid=3347)。
