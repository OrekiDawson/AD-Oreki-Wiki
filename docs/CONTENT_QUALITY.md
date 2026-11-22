# 知识库内容质量标准（兼容入口）

**完整、正式且唯一的现行规则公开在网站根目录与仓库根目录的内容文件中：**

- [反物质维度MOD Wiki:知识库规则](https://wiki.oreki.net/wiki-rules)
- [GitHub 中的正式规则源文件：content/wiki-rules.md](https://github.com/OrekiDawson/AD-Oreki-Wiki/blob/main/content/wiki-rules.md)

这份兼容入口只用于保持旧的 `docs/CONTENT_QUALITY.md` 链接有效，避免同一套规则在两处维护并发生漂移。历史版本可通过本文件的 Git 记录查看；任何编写规则的更改，都以 `content/wiki-rules.md` 为对象提交 PR。

## 关键约定（摘要，细节以正式规则为准）

- 简体中文、客观准确、通俗易懂、逐项可查证；玩家正文不嵌入 AI Summary，开发者技术条目可使用已审核、默认折叠、带固定来源的 AI Summary。
- **普通条目标题使用自然中文短名称，不加命名空间前缀。** 仅正式规则页使用 `反物质维度MOD Wiki:知识库规则` 这一特殊名称（旧版本本文件曾写成「正式页面名称统一为 `反物质维度MOD Wiki:[条目名]`」，与正式规则不一致，已按正式规则更正）。
- **普通条目围绕独立知识主题组织，不写成开发更新日志。** 时间线与轮次记录归 `content/developer/history/`，开发过程归各源码仓库的 `reports/`、PR 与 Issue。
- 文件路径与 URL 保持稳定；确需移动时使用 alias 重定向并验证旧链接。

## 规则文件对照

| 文件 | 作用 |
| --- | --- |
| `content/wiki-rules.md` | 唯一权威规则，网站 `/wiki-rules` 页面 |
| `docs/CONTENT_QUALITY.md` | 本兼容入口，只做摘要与指向 |
| `docs/ARTICLE_TEMPLATE.md` | 主题条目与历史归档条目的编辑模板 |
| `content/developer/editorial-guidelines.md` | 面向贡献者的编写指南，同样指向正式规则；旧 `/getting-started/editorial-guidelines` 保留兼容 |
