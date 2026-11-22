---
title: "2026-11-15 · R114-01 现实自动永恒复位修复"
description: "记录 R114-01 对「第 2 次现实后 realities 卡在 2」的根因定位、已合并修复与当时长跑边界"
tags:
  - 历史
  - 现实
  - 已合并
aliases:
  - "/history/2026-11-15-r114-reality-autoeternity"
---


> 本页是历史归档，记录当时的根因与修复过程。修复已在后续合并，但当时那次长跑不是正式终局证据；现行状态以 [当前项目状态](/developer/current/project-status) 为准。

## 事件与时间

2026-11-15 19:58 起，分支 `r114-01/reality-autoeternity` 提交修复，目标是「第 2 次现实后原版自动永恒复位导致 `realities` 卡在 2」。PR #92 后续已合并；当时的冲突描述只属于提交时状态。

## 当时结论（截至 2026-11-15 21:25 UTC+8）

| 项 | 状态 |
| --- | --- |
| 根因 | 已用真实 AVD logcat 证据确认：Reality 之后原版自动永恒复位把现实条件重置，导致 `realities` 停在 2 |
| 修复提交 | `70a8329a` → `aadebba7` → `53febade` → `6c7dbb87` |
| PR | [Android PR #92](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/92)，**OPEN，未合并、未发布** |
| 当时长跑 | 新真新档自 20:07:19 开始，截至 21:22 `realities=6`、`creditsFinished=false`，终局 **NOT RUN** |
| 附带修正 | `imaginaryUpgradeBits` 位号改为 Android 移植版内部 id：莱特拉 bit4、佩勒 bit14 |

新长跑已确认的里程碑（截至 21:22）：首无限/首永恒 275.8 秒；首次 Reality 576.7 秒；第 2 次 1218.6 秒；第 3 次 1901.2 秒；第 4 次 2603.5 秒；第 5 次 3285.6 秒；第 6 次 3948.6 秒；最新采样 t=4510.2 秒、`realities=6`、`creditsFinished=false`。20:27:22 日志记录托管层 `re-enabled after reality reset realities=2`（`isActive` 由 true→false→true），说明修复在真新档的 Reality 复位后生效。**但这是进行中跑次的过程数据，通关结论仍未产生。**

## 后续变化与是否仍然有效

- 复位后的自动永恒补回语义已经合入，并在后续 R116/R119 继续修正首次现实门槛与 EC 门禁；这些修复不能替代当前版本的完整终局验收。
- PR #92 后续由合并提交 `951fa231` 合入；该事实发生在上面的「当时结论」之后。
- 当时记录中的 `realities=6` 只是过程数据，不是通关结论。
- 前序 180 分钟 FAIL 记录见 [2026-11-15 · R113-01 新档 180 分钟长跑 FAIL](/developer/history/2026-11-15-r113-180min-fail)；策略叶子修复见 [2026-11-15 · 天神策略叶子缺失与补实现](/developer/history/2026-11-15-celestial-leaves-fix)。

## 原始证据

- [Android PR #92](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/92)
- 修复提交：[`70a8329a`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/70a8329a)、[`aadebba7`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/aadebba7)、[`53febade`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/53febade)、[`6c7dbb87`](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/commit/6c7dbb87)

## 相关条目

[当前项目状态](/developer/current/project-status) · [现实与时间研究](/player/gameplay/reality-time-studies) · [待核实事项与已知问题](/developer/current/known-issues)
