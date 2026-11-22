# Agent 检索指引

## 规则与事实的读取顺序

1. 本知识库的**唯一权威编写规则**是 `content/wiki-rules.md`（网站 `/wiki-rules`）。旧入口 `docs/CONTENT_QUALITY.md` 已改为兼容页，只做摘要与指向。
2. 工程规则与交付门禁不在本仓库：Android 端见 [AD-Oreki-Edition-Android](https://github.com/OrekiDawson/AD-Oreki-Edition-Android) 的 `AGENTS.md` 与 `docs/DELIVERY_RULES.md`，Web 端见 [AD-Oreki-Edition-Web](https://github.com/OrekiDawson/AD-Oreki-Edition-Web) 对应文件。本仓库不复制这些规则，避免漂移。
3. 按关键词检索本站：使用顶部搜索框或 Quartz 正式搜索索引 `/static/contentIndex.json`。旧的 `/static/knowledge-index.json` 不属于当前构建产物契约，线上返回 404，**不得将其当作可用接口**。
4. 找到专题页后，查看正文中就近的「参考资料」与页底证据区，**回到 GitHub 原始 Commit、PR、Run 与 AVD 报告核对**。

## 内容地图

| 目录 | 读者会在这里找到 |
| --- | --- |
| `content/` 根目录 | 双专区首页、正式规则、版权说明与本站使用说明 |
| `content/player/` | 玩家专区：游戏百科、MOD 介绍、教程、下载、FAQ 与术语 |
| `content/player/gameplay/` | 玩法机制：无限与永恒、现实、天神、挑战、自动购买器、存档、阶段门禁 |
| `content/player/original/` | 原版 Wiki 中文翻译与来源、许可、审校等级 |
| `content/player/getting-started/` | 玩家开始游玩、平台选择与版本辨识 |
| `content/player/mods/` | Oreki Edition 产品目标与玩家可见差异 |
| `content/player/download-and-version/` | Android/Web 下载入口与版本边界 |
| `content/player/faq/` | 玩家常见问题 |
| `content/developer/` | 开发者专区：架构、逆向、构建、状态、证据、历史与 AI Summary |
| `content/developer/architecture/` | Android/Web 架构、Kotlin 混合运行时 ABI、双端一致性与目录迁移 |
| `content/developer/reverse-engineering/` | 混淆 DEX 的语义映射与 ABI 适配方法 |
| `content/developer/build/` | AGP/Gradle、APK 签名、CI/CD、R8 与旧构建链退役 |
| `content/developer/current/` | 当前状态、发布状态与已知问题 |
| `content/developer/troubleshooting/` | 协程 ABI 与存档兼容排查 |
| `content/developer/references/` | 开发来源索引；通用术语位于 `/player/terminology` |
| `content/developer/evidence/` | 运行证据的类型、阅读顺序与门禁边界 |
| `content/developer/ai-summaries/` | 已审核、默认折叠、带固定来源的 AI Summary |
| `content/developer/history/` | 历史归档：按日期与事件记录当时结论，**不代表现行状态** |

## 判断纪律

- 状态：已验证 / 进行中 / FAIL / BLOCKED / 待确认 / 已推翻；证据等级：实测 / 读码 / 推断 / 未知。
- `content/ai-drafts/` 下的页面是 AI 抽取草稿，**不能**直接当权威事实，也不进入公开站点。
- `content/developer/history/` 是历史归档，**不能**代替现行技术解释；引用前先确认它标注的「是否仍然有效」。
- 历史结论保留但标注状态；不得用新旧段落推断旧结论失效，也不得把「修复已提交」当成 PASS。
- 不在知识库里修改 GitHub 已验证结论后反向引用为权威。
