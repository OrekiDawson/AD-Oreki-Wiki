# 知识库内容质量标准（兼容入口）

**完整、正式且唯一的现行规则公开在网站根目录与仓库根目录的内容文件中：**

- [反物质维度MOD Wiki:知识库规则](https://wiki.oreki.net/wiki-rules)
- [GitHub 中的正式规则源文件：content/wiki-rules.md](https://github.com/OrekiDawson/AD-Oreki-Wiki/blob/main/content/wiki-rules.md)

这份兼容入口只用于保持旧的 `docs/CONTENT_QUALITY.md` 链接有效，避免同一套规则在两处维护并发生漂移。历史版本可通过本文件的 Git 记录查看；任何编写规则的更改，都以 `content/wiki-rules.md` 为对象提交 PR。

## 关键约定（摘要，细节以正式规则为准）

- 简体中文、客观准确、通俗易懂、逐项可查证；玩家正文不嵌入 AI Summary，开发者技术条目只可在已核实正文后附经审校、默认折叠、带固定来源的可选 AI Summary；它不是独立学习路径或内容质量指标。
- **普通条目标题使用自然中文短名称，不加命名空间前缀。** 仅正式规则页使用 `反物质维度MOD Wiki:知识库规则` 这一特殊名称（旧版本本文件曾写成「正式页面名称统一为 `反物质维度MOD Wiki:[条目名]`」，与正式规则不一致，已按正式规则更正）。
- **玩家专区按机制百科、入门教程、分阶段攻略、FAQ/故障指引及原版翻译五类用途编写**。准确区分原版与 Android/Web MOD 的版本和数值，教程/攻略说明实际前提与步骤，译文保留来源、许可及逐段审校等级。
- **普通条目围绕实际读者问题组织，不写成开发更新日志。** 开发者文章根据任务区分入门教程、操作指南、技术参考、原理说明；不再统一套用「背景/原理/已确认与未确认/历史变化」模板。内部时间线归 `archive/wiki-history/`，原始开发过程归源码仓库。
- 文件路径与 URL 保持稳定；确需移动时使用 alias 重定向并验证旧链接。

## 规则文件对照

| 文件 | 作用 |
| --- | --- |
| `content/wiki-rules.md` | 唯一权威规则，网站 `/wiki-rules` 页面 |
| `docs/CONTENT_QUALITY.md` | 本兼容入口，只做摘要与指向 |
| `docs/ARTICLE_TEMPLATE.md` | 按用途选择的入门、操作、参考、原理与历史档案写作样板 |
| `content/developer/editorial-guidelines.md` | 面向贡献者的编写指南，同样指向正式规则；旧 `/getting-started/editorial-guidelines` 保留兼容 |
