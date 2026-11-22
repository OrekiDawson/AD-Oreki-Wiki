---
title: "历史归档"
description: "按日期与事件保存当时的判定、证据与后续变化；不代表当前状态"
tags:
  - 历史
  - 导航
---


本分类保存**带明确时间性**的材料：某次长跑的结果、某轮发布、某次流水线阻塞、某次根因定位过程。历史条目记录「当时发生了什么、当时怎么判定、后来是否被修正」，帮助读者理解现行专题结论是怎么来的。

**历史归档不代表当前状态。** 现行结论请看 [当前项目状态](/developer/current/project-status)、[发布状态](/developer/current/release-status) 与各专题条目；引用历史条目时，先确认它标注的「是否仍然有效」。

## 归档条目

| 日期 | 条目 | 当时结论 |
| --- | --- | --- |
| 2026-11-12 | [R103 四渠道正式发布与 versionCode 基线](/developer/history/2026-11-12-r103-release-baseline) | 当时四渠道发布 PASS、versionCode 为 30210000；后续已发布上限更新（参见条目） |
| 2026-11-15 | [R113-01 逻辑线程 livelock 的 P0 闭环](/developer/history/2026-11-15-r113-p0-livelock) | 功能闭环 PASS；跨构建晚期存档与 180 分钟通关 NOT RUN |
| 2026-11-15 | [R113-01 新档 180 分钟长跑 FAIL](/developer/history/2026-11-15-r113-180min-fail) | 180.1 分钟未通关，creditsFinished=false、realities=2 |
| 2026-11-15 | [天神策略叶子缺失与补实现](/developer/history/2026-11-15-celestial-leaves-fix) | 叶子补齐 PASS；realities 仍卡在 2 |
| 2026-11-15 | [签名环境阻塞与 AGP-only fail-closed](/developer/history/2026-11-15-signing-blocked) | 候选构建 BLOCKED；AGP-only 门禁静态复核失败 |
| 2026-11-15 | [R114-01 现实自动永恒复位修复](/developer/history/2026-11-15-r114-reality-autoeternity) | 修复已合并；首次现实门槛后续在 R116/R119 继续修正 |
| 2026-11-20 | [R121 Android KVM 新档与自动化 P1 停滞](/developer/history/2026-11-20-r121-android-kvm) | 到首现实；两次重置后自动化停摆；终局 NOT RUN |

## 归档规则

1. 文件名以日期开头（`YYYY-MM-DD-`），`tags` 含「历史」。
2. 写清三件事：**当时结论**（含 PASS/FAIL/BLOCKED/NOT RUN 与关键数字）、**原始证据**（固定 Commit / PR / Run）、**后续变化与是否仍然有效**。
3. 历史条目可以出现轮次编号、日期与流水线 Run；专题正文不得复制这些过程记录。
4. 已被推翻的结论保留必要解释，不删除；但现行状态页只写当前有效结论。

详细规则见 [知识库规则](/wiki-rules) 的「普通条目与历史归档：反日志化规则」。
