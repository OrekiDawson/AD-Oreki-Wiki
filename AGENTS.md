# 中文 Wiki / Quartz 5 · Agent 长期规则

> 跨仓共性规则以 [Workspace AGENTS.md](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/blob/main/AGENTS.md) 为唯一权威。启动先读该入口、本文件、当前任务与必要事实；涉及对应事项必须先读以下细则适用章节，不默认全文加载所有细则。共享重复条款不作为另一权威来源，最新用户授权与 Workspace 权威口径优先；根入口的按需加载及 PATH 约定覆盖旧措辞，不降低安全、预算、审查、CI、验收或发布门禁。根 AGENTS.md 目标 100 行、8 KiB，复杂例外说明；规则按主题编号、避免重复，临时任务进 Issue、事实进 FACTS、可机器检查约束进 CI。

## 1. 总则与授权

- 继承 Workspace 共性规则，遵守 Owner、预算、PR、任务编号及 Goal。Wiki 独立 Kody 额度；不争抢游戏 P0 或既有 PR。
- 详细口径：[执行细则 1](docs/agent-policy/执行细则-01.md)。

### 1.1 统一规则来源与继承
- 详见[执行细则 1](docs/agent-policy/执行细则-01.md)对应章节。

### 1.2 授权、预算与运行状态
- 详见[执行细则 1](docs/agent-policy/执行细则-01.md)对应章节。

### 1.3 任务编号与 Goal
- 详见[执行细则 1](docs/agent-policy/执行细则-01.md)对应章节。

## 2. Wiki 内容与发布

- 玩家、开发者双专区，简体中文、自然作者化、有趣且有知识深度；不把报告/审计流水账充当文章。全站原创作者化 P0，开发者正式正文从零重写，已达标不重复施工；原版译文忠实、区分 MOD、来源及 CC BY-SA 4.0 署名。Lead 完整复审 Subagent 正文，作者化独立验收列，逐页台账。
- 禁止公开 GitHub 具体文件外链（/blob/、/raw/、raw.githubusercontent.com），内部保留可追溯证据；不得添加 HTTP 200、API 核验、CI/Kody 流水账。公开不使用 Oreki Edition，按语义用 MOD 或本 MOD；简洁条目名，不机械增系统/机制后缀。汉字与 ASCII 适当空格，技术标识保持准确。成熟一批、审查一批、上线一批，不设数量 KPI。
- 详细口径：[执行细则 2](docs/agent-policy/执行细则-02.md)。

### 2.1 内容规范、玩家与开发者专区
- 详见[执行细则 2](docs/agent-policy/执行细则-02.md)对应章节。

## 3. Android 跨仓协作

- Android 工程、ABI、包名迁移只维护准确受影响文档与引用；真实源码/版本/证据优先，不展开无关迁移或抢改。
- 详细口径：[执行细则 3](docs/agent-policy/执行细则-03.md)。

### 3.1 P1 全量 Smali/DEX 清零
- 详见[执行细则 3](docs/agent-policy/执行细则-03.md)对应章节。

### 3.2 P1 AGP 与目录治理
- 详见[执行细则 3](docs/agent-policy/执行细则-03.md)对应章节。

### 3.3 P1 64 位 ABI 与测试设备
- 详见[执行细则 3](docs/agent-policy/执行细则-03.md)对应章节。

### 3.4 P0 包名变更的 Wiki 文档协作
- 详见[执行细则 3](docs/agent-policy/执行细则-03.md)对应章节。

## 4. 质量、审查与合并

- Wiki 有实际变更的 Ready PR 由 Kody Balanced 原生审查；同 HEAD 不重复触发，纯 AGENTS.md 官方 skipped 例外按 Workspace，含细则不适用。Wiki PR CI、线程解决、Ruleset、Lead 正文复审均独立满足；真实 Pages/Playwright 桌面移动验收后才算上线。
- 详细口径：[执行细则 4](docs/agent-policy/执行细则-04.md)。

### 4.1 GitHub 审查与内容质量
- 详见[执行细则 4](docs/agent-policy/执行细则-04.md)对应章节。

#### 4.1.1 仅规则变更时的 Kody skipped 例外
- 详见[执行细则 4](docs/agent-policy/执行细则-04.md)对应章节。

## 5. 工作方式与环境

- Coreutils/Shell 优先，PATH 命令名；Quartz/Playwright 确需 JS 可用 Node。按范围最小验证、完整日志、真实交付。及时派遣独立内容、信息架构、前端工程任务，不重复审计、无故闲置或空轮询。
- 详细口径：[执行细则 5](docs/agent-policy/执行细则-05.md)。

### 5.1 执行效率与反馈
- 详见[执行细则 5](docs/agent-policy/执行细则-05.md)对应章节。

### 5.2 持续推进与有效验证
- 详见[执行细则 5](docs/agent-policy/执行细则-05.md)对应章节。

### 5.3 环境故障诊断与安全恢复
- 详见[执行细则 5](docs/agent-policy/执行细则-05.md)对应章节。

## 公开门面与首页

- README、首页和公开方针面向读者，不展示内部 PR、审查、机器字段或轮次流水账。
- 详细口径：[执行细则 6](docs/agent-policy/执行细则-06.md)。



## 6. P1 导航覆盖与公开内容边界

- 条目合并、拆分、新增为 P0；切页零动画 P0（保留 SPA，禁止进度条/过渡延迟）。MediaWiki 式版式仍用 Quartz；正式分类默认展开，短导航标签、独立滚动、当前高亮，零有效子项普通链接。系统字体、移除关系图/无意义 Properties；历史和草稿排除公开构建/导航/搜索，旧 URL 兼容。CI 检查真实导航、空菜单、外链、字体与切页；移动/桌面验收。R130 不以 Wikipedia 维护或图片恢复/引用数量为完成条件，实际素材许可与署名仍强制。
- 详细口径：[执行细则 7](docs/agent-policy/执行细则-07.md)。

### 6.1 导航是正式内容的发现入口
- 详见[执行细则 7](docs/agent-policy/执行细则-07.md)对应章节。

### 6.2 内部历史归档不得进入公开内容树
- 详见[执行细则 7](docs/agent-policy/执行细则-07.md)对应章节。

### 6.5 P1 MediaWiki 式百科界面方向
- 详见[执行细则 7](docs/agent-policy/执行细则-07.md)对应章节。

### 6.6 P0 内容结构治理：合并、拆分与新增
- 详见[执行细则 7](docs/agent-policy/执行细则-07.md)对应章节。

### 6.3 P1 交付门禁
- 详见[执行细则 7](docs/agent-policy/执行细则-07.md)对应章节。

### 6.4 第三方版权与原版译文视觉资料
- 详见[执行细则 7](docs/agent-policy/执行细则-07.md)对应章节。
