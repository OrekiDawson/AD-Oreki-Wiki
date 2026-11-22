---
title: "存档兼容排查"
description: "读档失败、字段类型漂移与静默重置的症状、原因与排查步骤"
tags:
  - 排查
  - 存档
aliases:
  - "/troubleshooting/save-compatibility"
---


存档问题往往表现为「读档后世界不对」而不是崩溃：资源异常、阶段错乱、进度静默重置、注入存档后游戏冻结。本条目按症状归类常见原因，并给出可执行的排查顺序。

## 症状与常见原因

| 症状 | 常见原因 |
| --- | --- |
| 读出后资源/阶段异常 | Gson 泛型缺失导致类型漂移（见 [Signature 回填](/developer/build/signature-backfill)） |
| 读档后静默重置 | 反序列化异常被吞，或字段类型不符导致默认值覆盖 |
| 注入真实存档后冻结 | 混合运行时 livelock（见 [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi)） |
| 完全不写档 | tick 停止 / 保存调度未触发 |
| 备份文件缺失 | 保存通道未走到，或生命周期回调未触发 |

## 排查步骤

1. **确认注入方式**：必须使用 app 的 uid/gid 注入；否则应用读不到文件并静默回到新游戏。
2. **对照 SHA**：记录注入前后 `player.json` 的 SHA-256，确认文件真的被替换。
3. **检查备份**：确认 `playerBackup*` 是否按预期生成。
4. **查日志**：logcat 中搜索 Gson 异常、`NoSuchFieldError`/`NoSuchMethodError`、FATAL。
5. **对照构建**：用 smali 稳定版或已验证的历史稳定构建做对照，区分存档问题与构建问题。
6. **检查 tick**：如果完全不写档，先确认游戏逻辑线程是否还在推进。

## 禁止

- 不得手工生成 player JSON 冒充自动存档。
- 不得把损坏存档当正常夹具。
- 不得覆盖用户真实存档。
- 不得把「文件存在」当成「存档内容正确」。

## 已确认与未确认

- **已确认**：早中期跨构建写读曾 PASS；合法晚期存档在同一候选 APK 上读写 PASS。
- **未确认**：AGP↔Smali 晚期存档互读 NOT RUN；全字段签名等价未验证。
- **边界**：单次读档成功不等于任意版本互通，也不等于发布门禁通过。

## 参考资料

- [docs/FACTS.md 存档与已修复根因](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/blob/main/docs/facts/methodology.md#f-10)
- [Android PR #74（跨构建写读）](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/pull/74)

## 相关条目

[存档兼容与自动保存](/player/gameplay/saves) · [Signature 回填与 Gson 存档](/developer/build/signature-backfill) · [协程 ABI 崩溃排查](/developer/troubleshooting/coroutine-abi)
