---
title: "开发者专区"
description: "Oreki Edition 的 Android/Web 架构、逆向、ABI、构建发布、CI/CD、故障分析、证据与 AI Summary"
tags:
  - 开发者
  - 导航
---

这里面向需要阅读源码、复现问题、检查构建或参与发布的开发者。内容保留精确的代码标识、Commit、PR、Actions Run、测试状态与证据边界；普通玩家教程、下载步骤和玩法说明集中在 [玩家专区](/player/)。

## 先确认事实与当前状态

- [当前项目状态](/developer/current/project-status)：双端进度、已确认结果与尚未完成的验证。
- [发布状态](/developer/current/release-status)：版本、APK、部署与渠道证据分别记录。
- [待核实事项与已知问题](/developer/current/known-issues)：按影响范围区分待确认、FAIL、BLOCKED 与 NOT RUN。
- [来源索引](/developer/references/source-index)：Android、Web、统一管理、Wiki 与规则文件的权威位置。

## 架构与技术实现

- [架构与运行时](/developer/architecture/)：Android 混合运行时、Web 冻结上游、双端一致性和目录迁移。
- [逆向与语义映射](/developer/reverse-engineering/)：官方混淆 DEX、ABI 描述符与适配纪律。
- [构建与交付](/developer/build/)：AGP/Gradle、签名、CI/CD、R8 和旧构建链退役。
- [故障排查](/developer/troubleshooting/)：协程 ABI、逻辑卡死、存档失败与字段漂移。

## 证据、历史和摘要

- [运行证据索引](/developer/evidence/)：把验收摘要、固定来源和证据边界放在一起，不复制完整日志。
- [历史归档](/developer/history/)：记录当时结论、版本与后续变化，不代表当前状态。
- [AI Summary 索引](/developer/ai-summaries/)：仅收录已标识、可折叠、依据已核实正文与固定来源的摘要；未审核 AI 草稿仍不公开。

## 开发者工作边界

本站的工程事实以源码、PR、Run、设备日志和存档测试为准。**代码已合并、CI 成功、APK 可安装、真实游戏通关和正式发布是不同证据**，未运行的验证必须标记 `NOT RUN`。涉及游戏节奏、存档兼容、商店或阶段门禁的结论，必须绑定明确版本与真实运行证据。

交叉阅读：[项目与仓库概览](/developer/project-overview) · [知识库编写规范](/developer/editorial-guidelines) · [知识库规则](/wiki-rules) · [版权与许可](/copyright)。
