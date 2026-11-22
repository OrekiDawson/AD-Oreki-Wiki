# 反物质维度 MOD 中文知识库

[**访问知识库：wiki.oreki.net**](https://wiki.oreki.net)

反物质维度 MOD（Oreki Edition）双专区知识库。GitHub 是权威事实源，本仓库是 Quartz 5 玩家专区与开发者专区的展示和检索层。

[中文目录与文件命名约定](docs/目录与中文命名约定.md) · [内容编辑指引](docs/AGENT_GUIDE.md) · [构建维护](docs/MAINTENANCE.md)

本仓库为《反物质维度》（Antimatter Dimensions）及 **Oreki Edition** Android/Web MOD 提供中文百科与技术资料，使用 Quartz 5 构建并通过 GitHub Pages 发布。

- 站点：https://wiki.oreki.net（自定义域名；仓库地址 `OrekiDawson/AD-Oreki-Wiki`）
- 玩家专区：https://wiki.oreki.net/player/
- 开发者专区：https://wiki.oreki.net/developer/
- **公开的正式知识库规则**：https://wiki.oreki.net/wiki-rules（网站首页、目录与页脚均可进入）
- **规则页专用名称**：`反物质维度MOD Wiki:知识库规则`；普通条目标题、正文保持自然简体中文，不加前缀，URL 保持不变。
- 构建：Quartz 5 + Node 24（本地 Node 26 时 esbuild service 会 SIGBUS，请用 Node 24 构建）
- 内容：content/ 下 Markdown，frontmatter + 证据区
- 检查：scripts/check-content.mjs（页面/链接/敏感信息/术语）、scripts/verify-build.mjs（产物）
- 验收：`node scripts/acceptance.cjs`（Chromium 手机视口，搜索/导航/反向链接/图谱/暗色/溢出）；首次使用先运行 `npm i -D playwright`，或设置 `KB_PLAYWRIGHT=<已安装 Playwright 模块路径>`。

## 阅读入口

- **玩家内容**：原版游戏介绍、[原版 Wiki 中文翻译](https://wiki.oreki.net/player/original/)、[玩法机制](https://wiki.oreki.net/player/gameplay/)、MOD 教程和常见问题。
- **开发者内容**：[项目架构](https://wiki.oreki.net/developer/architecture/)、[逆向与技术映射](https://wiki.oreki.net/developer/reverse-engineering/)、[构建交付](https://wiki.oreki.net/developer/build/)及[历史证据](https://wiki.oreki.net/developer/history/)。
- **事实与发布**：[当前项目状态](https://wiki.oreki.net/developer/current/project-status)、[知识库规则](https://wiki.oreki.net/wiki-rules)、[版权与许可](https://wiki.oreki.net/copyright)。

**双专区现已正式提供。** 首页、`/player/`、`/developer/`、旧 URL 兼容与移动端导航均通过构建和本地 Chromium 验收；正式线上状态以合并部署后的 HTTPS 验证为准。

**审查配额：** Wiki 的 Kody 审查独立统计，不占用 Android/Web 每日共享的 100 次额度；已由 Kody 确认跳过的审查不计项目额度。实际审查仍受用户授权、Balanced 模式、平台额度及收费规则约束，不能解释为无限免费审查。

## 内容原则

1. **人类读者优先**：用自然简体中文解释玩法及术语。原版机制、MOD 改动和历史结论分别说明，避免把 PR 日志直接当百科正文。
2. **结论可核查**：重要事实提供原始源码、Commit、PR、运行报告或官方出处；标明适用版本与核实时间，不能把构建、运行和正式发布混成一个 PASS。
3. **AI Summary 仅属于开发者专区**：可对已核实技术正文提供标识清晰、可折叠、有证据的摘要；玩家正文不放机器专用摘要。未审 AI 草稿不进入公开 HTML、RSS、搜索或索引。
4. **版权明确**：本站可授权的原创百科文字采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；第三方代码、图片、翻译材料仍受各自许可证和署名义务约束。

正式内容规范以 [知识库规则](content/wiki-rules.md) 为准；新条目参考 [中文条目模板](docs/ARTICLE_TEMPLATE.md)，翻译遵守 [翻译政策](docs/translation/POLICY.md)。如旧模板与“开发者专区允许经审核 AI Summary”的新约束冲突，应在专门的内容 PR 中同步修订，不擅自把未审内容公开。

## 本地构建

使用 Node.js **24** 构建；运行：

~~~bash
bash scripts/build-site.sh
~~~

需要 Chromium 手机视口验证时，运行 `node scripts/acceptance.cjs`；首次使用 Playwright 或采用已安装模块的配置见 [维护说明](docs/MAINTENANCE.md)。

代码仓只存储 Markdown、配置、脚本和必要证据；Quartz 的具体引导、检查和验证流程以当前构建配置与维护文档为准。

## 发布与运行状态

- `main` 分支触发 `.github/workflows/deploy-wiki.yml` 发布 GitHub Pages；PR 使用 `pr-check.yml` 验证，不直接部署。
- 正式站点必须使用 `https://wiki.oreki.net` 并通过服务器端 Enforce HTTPS 和线上核验；[Pages 设置](https://github.com/OrekiDawson/AD-Oreki-Wiki/settings/pages)。
- **内容质量优先**：暂停“每 48 小时交付一版”的内容频率考核。新稿/大幅修订必须经过原始资料核查、自然中文写作与独立编辑审校；宁可精修一篇旧条目，也不按数量发布 AI 生成稿。优先完成玩家标杆《开始游玩》《无限与永恒》《智能自动购买器》，无独立审校标 `EDITORIAL_BLOCKED`；网站维护、事实纠错与安全修复不因此停止。
- 旧定时 AI 草稿生成保持停用。付费 Kody 审查和其他自动化以最新用户授权、实际云端配置和 GitHub 工作流为准，不能从 README 推断当前已启用。

## 仓库与贡献

- [AGENTS.md](AGENTS.md)：Agent 长期执行约束。
- [docs/AGENT_GUIDE.md](docs/AGENT_GUIDE.md)：编辑与事实核查指引。
- [docs/MAINTENANCE.md](docs/MAINTENANCE.md)：构建、PR、部署与回滚流程。
- [LICENSE-CONTENT.md](LICENSE-CONTENT.md)：原创内容许可范围；`LICENSE.txt` 的软件许可及上游声明另行适用。

正式域名：**https://wiki.oreki.net**。GitHub Pages 必须启用服务器端 `Enforce HTTPS`，不能用 Quartz 链接或浏览器端 JavaScript 跳转代替。

仓库管理员在 [Settings → Pages](https://github.com/OrekiDawson/AD-Oreki-Wiki/settings/pages) 中确认：

1. Custom domain 为 `wiki.oreki.net`，DNS 的 `wiki` CNAME 指向 `orekidawson.github.io`。
2. GitHub Pages 的 HTTPS 证书签发完成后，选中 **Enforce HTTPS**。
3. 完成后重新运行 `.github/workflows/deploy-wiki.yml`，`verify-online` 必须通过。

`scripts/verify-https.sh` 会从 GitHub Pages API 检查 `https_enforced=true`，并使用正常 TLS 证书校验访问 HTTPS 页面，确认 HTTP 请求收到指向相同域名 HTTPS 的 301/302/307/308 跳转。证书尚未签发、设置未开启或出现 HTTP 回退时，验收明确 FAIL，不得以 HTTP 200 代替。

GitHub Actions 的普通 `GITHUB_TOKEN` 不具备修改 Pages 管理设置所需的 Administration 写权限，因此正式 Enforce HTTPS 开关由具有仓库管理权限的账户操作，不向 Actions 添加个人管理员 Token。

## 版权与内容许可

**本站有权授权的原创百科文字采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)**，允许署名转载、改写、翻译和商业使用，改编作品按相同或兼容许可共享。转载应说明作者、具体条目地址、许可链接与修改情况。

- [版权与许可（公开页面）](https://wiki.oreki.net/copyright)
- [原创文字许可范围（仓库文件）](LICENSE-CONTENT.md)
- 本仓库既有 [LICENSE.txt](LICENSE.txt) 中的 **MIT 软件许可及上游版权声明不变**；第三方游戏素材、代码和图片不由本站再授权。

## 中文百科式写作

本站正文以简体中文、通俗解释、客观核查为主。统一依据 [知识库规则全文](content/wiki-rules.md)（旧路径 [docs/CONTENT_QUALITY.md](docs/CONTENT_QUALITY.md) 为兼容入口），新条目参考 [中文知识条目模板](docs/ARTICLE_TEMPLATE.md)。Quartz 网站的 [知识库编写规范](https://wiki.oreki.net/developer/editorial-guidelines) 介绍这些原则。

**人类读者优先**：技术名称、API、哈希保持原文并附中文解释；每条重大结论可点到原始证据。玩家正文不嵌入 AI Summary；开发者专区可使用已审核、默认折叠、带固定来源的摘要。站内检索依赖 Quartz 原生搜索。

知识库已从中文维基百科的官方方针中选择适合技术文档的原则：中立表述、可供查证、来源质量、禁止无证据推断、文明协作与版权署名。具体改写和原始方针链接统一放在公开的 [知识库规则页](content/wiki-rules.md)，不复制方针原文，也不直接套用百科条目收录门槛。

## 内容质量门禁

正式知识条目的验收标准见 [docs/CONTENT_QUALITY.md](docs/CONTENT_QUALITY.md)。核心标准是：**可点击的固定来源、具体机制和验证步骤、事实等级、适用范围、最新状态**，不能以页面数量或构建 PASS 代替事实正确性。

未经人工审核的 AI 草稿仍存于 GitHub 的 `content/ai-drafts/` 供回查，但不得发布到 Quartz、公开搜索索引或问答检索。当前状态必须以真实上游 PR / 运行报告为准。

## 内容纪律

- 不编造 Commit、行号、ABI 描述符与测试结果。
- 被推翻结论保留历史解释，标注「旧结论 → 新证据 → 当前判断」。
- 不把私有构建产物、用户存档、Token、内部路径写入公开仓库。

问题反馈请附具体页面、失效链接、原始证据与建议修正，不包含 Token、私钥、私人路径或用户存档。
