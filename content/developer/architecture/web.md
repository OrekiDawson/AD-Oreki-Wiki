---
title: "Web 架构"
description: "Web 端冻结上游、开发与验证方式、oreki.net 部署边界，以及与 Android 端的关系"
tags:
  - Web
  - 架构
aliases:
  - "/architecture/web"
---


Oreki Edition 的 Web 端基于一个**冻结的上游源码快照**开发，运行在 `oreki.net`。它与 Android 端共享同一套游戏设计与验收目标，但代码、构建与部署链完全独立。本条目解释 Web 端的基线、验证方式与部署边界。

## 冻结上游

Web 基线固定为 2026-07-17 的上游快照：

- 仓库：`IvarK/AntimatterDimensionsSourceCode`
- Commit：`5409e320cecef96a917cca1dfb68f1f183e499ca`
- 冻结标识登记在 Web 仓库的 `docs/SHARED_GAMEPLAY_STANDARD.md` 与 `docs/FACTS.md`

未经用户授权，不得自动升级或合并上游；只允许只读监测安全与重大缺陷，用于评估选择性移植。

## 开发与验证方式

- Node + Chromium/Playwright，优先使用 Android Chrome 手机视口；
- 验证真实点击、DOM、console、存档与阶段行为，而不是只看静态渲染；
- 部署副本 `web/_deploy/site/` 是产物，不是源码入口。

Web 的 CI 与部署独立于 Android：Android 的 P0 或发布阻塞不应无故拖住已验证的 Web 部署，反之亦然。

## 与 Android 的关系

双端共享验收目标（阶段解锁、挑战结算、自动购买器、资源扣费、成就链、教程），但**版本并不完全一致**：Android 是 3.21.0 的反编译基线，Web 是 2026-07-17 的上游快照。因此：

- 「版本号相同」不能证明行为等价；
- 相同机制在两端的源码行号、字段编码可能不同；
- 跨端等价必须用可观察行为逐项验收，见 [双端行为一致性](/developer/architecture/parity)。

例如，Android 原版自带无限维度自动购买器，而 Web 原版没有，Web 端的相关能力是 MOD 自己补的；这类差异会让「同一功能在两端由不同代码实现」成为常态。[读码，[FACTS §8.11](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/game/mechanics.md#f-8-11)]

## 部署边界

Web 正式站在 `https://oreki.net`。部署必须走既有受控流程，不能用手工上传覆盖；线上验收与源 SHA、CI Run、Artifact 对应，不能以「本地能打开」代替部署成功。

## 已确认与未确认

- **已确认**：冻结上游 Commit、Playwright 验证方式、独立部署边界；历史上修复过窄屏通知条遮挡与侧栏资源刷新等 UI 缺陷。
- **未确认**：完整双端行为等价验收为 **NOT RUN**；跨端差异清单仍在补充。
- **不要误读**：Web 端某个修复 PASS 不能当作 Android 端同类问题已解决。

## 相关条目

[双端行为一致性](/developer/architecture/parity) · [项目概览](/developer/project-overview) · [智能自动购买器](/player/gameplay/automation) · [反物质维度](/player/antimatter-dimensions)
