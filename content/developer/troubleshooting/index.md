---
title: "故障排查"
description: "协程 ABI 崩溃、逻辑线程卡死、存档读取失败与字段类型漂移的定位方法"
tags:
  - 排查
  - 导航
aliases:
  - "/troubleshooting"
---


本分类面向「出现症状后怎样定位」：从崩溃信息、线程栈和存档内容出发，判断问题属于 ABI 不匹配、调度空转、反序列化类型漂移，还是存档注入方式错误。

## 页面

| 页面 | 适用症状 |
| --- | --- |
| [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi) | NoSuchFieldError / NoSuchMethodError、无崩溃但 tick 不推进 |
| [存档兼容排查](/developer/troubleshooting/save-compatibility) | 读档后资源或阶段异常、静默重置、注入存档后冻结 |

## 排查纪律

- 先用日志与线程栈确定症状类型，再猜原因。
- 对照一个已知可用的稳定构建，避免把环境问题当成产品缺陷。
- 不把「暂时没复现」写成已修复，也不伪造 SHA、Run 或截图证据。

## 相关分类

[玩法机制](/player/gameplay/) · [架构与运行时](/developer/architecture/) · [参考资料](/developer/references/)
