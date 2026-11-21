# 反物质维度 MOD 中文知识库

[**访问知识库：wiki.oreki.net**](https://wiki.oreki.net)

[中文目录与文件命名约定](docs/目录与中文命名约定.md) · [内容编辑指引](docs/AGENT_GUIDE.md) · [构建维护](docs/MAINTENANCE.md)

本仓库为《反物质维度》（Antimatter Dimensions）及 **Oreki Edition** Android/Web MOD 提供中文百科与技术资料，使用 Quartz 5 构建，并通过 GitHub Pages 发布。欢迎从游戏玩法开始读，也可以查找开发原理与实测证据。

## 阅读入口

- **玩家内容**：原版游戏介绍、[原版 Wiki 中文翻译](https://wiki.oreki.net/original/)、[玩法机制](https://wiki.oreki.net/gameplay/)、MOD 教程和常见问题。
- **开发者内容**：[项目架构](https://wiki.oreki.net/architecture/)、[逆向与技术映射](https://wiki.oreki.net/reverse-engineering/)、[构建交付](https://wiki.oreki.net/build/)及[历史证据](https://wiki.oreki.net/history/)。
- **事实与发布**：[当前项目状态](https://wiki.oreki.net/current/)、[知识库规则](https://wiki.oreki.net/wiki-rules)、[版权与许可](https://wiki.oreki.net/copyright)。

**信息架构正在渐进调整为 `/player/` 与 `/developer/` 双专区。** 上面列出的是当前已有的阅读路径，不能把规划中的新 URL 当成已经上线。迁移必须保留旧页面的链接兼容，并验证移动端导航与搜索。

**审查配额：** Wiki 的 Kody 审查独立统计，不占用 Android/Web 每日共享的 100 次额度；已由 Kody 确认跳过的审查不计项目额度。实际审查仍受用户授权、Balanced 模式、平台额度及收费规则约束，不能解释为无限免费审查。

## 内容原则

1. **人类读者优先**：用自然简体中文解释玩法及术语。原版机制、MOD 改动和历史结论分别说明，避免把 PR 日志直接当百科正文。
2. **结论可核查**：重要事实提供原始源码、Commit、PR、运行报告或官方出处；标明适用版本与核实时间，不能把构建、运行和正式发布混成一个 PASS。
3. **AI Summary 仅属于开发者专区**：可对已核实技术正文提供标识清晰、可折叠、有证据的摘要；玩家正文不放机器专用摘要。未审 AI 草稿不进入公开 HTML、RSS、搜索或索引。
4. **版权明确**：本站可授权的原创百科文字采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；第三方代码、图片、翻译材料仍受各自许可证和署名义务约束。

正式内容规范以 [知识库规则](content/wiki-rules.md) 为准；新条目参考 [中文条目模板](docs/ARTICLE_TEMPLATE.md)，翻译遵守 [翻译政策](docs/translation/POLICY.md)。如旧模板与“开发者专区允许经审核 AI Summary”的新约束冲突，应在专门的内容 PR 中同步修订，不擅自把未审内容公开。

## 本地构建

使用 Node.js **24**（项目文档记录 Node 26 环境曾触发 esbuild SIGBUS），按仓库现有依赖和 Quartz 插件配置执行：

```bash
npm ci
npx quartz plugin install --from-config
node scripts/check-content.mjs
npx quartz build
node scripts/verify-build.mjs
```

需要 Chromium 手机视口验证时，运行 `node scripts/acceptance.cjs`；首次使用 Playwright 或采用已安装模块的配置见 [维护说明](docs/MAINTENANCE.md)。

代码仓只存储 Markdown、配置、脚本和必要证据；Quartz 的具体引导、检查和验证流程以当前构建配置与维护文档为准。

## 发布与运行状态

- `main` 分支触发 `.github/workflows/deploy-wiki.yml` 发布 GitHub Pages；PR 使用 `pr-check.yml` 验证，不直接部署。
- 正式站点必须使用 `https://wiki.oreki.net` 并通过服务器端 Enforce HTTPS 和线上核验；[Pages 设置](https://github.com/OrekiDawson/AD-Oreki-Wiki/settings/pages)。
- 长期目标为每 **48 小时**交付一版有实质价值的合格内容，但不能用空提交、规则修改或低质量 AI 生成条目凑数。
- 旧定时 AI 草稿生成保持停用。付费 Kody 审查和其他自动化以最新用户授权、实际云端配置和 GitHub 工作流为准，不能从 README 推断当前已启用。

## 仓库与贡献

- [AGENTS.md](AGENTS.md)：Agent 长期执行约束。
- [docs/AGENT_GUIDE.md](docs/AGENT_GUIDE.md)：编辑与事实核查指引。
- [docs/MAINTENANCE.md](docs/MAINTENANCE.md)：构建、PR、部署与回滚流程。
- [LICENSE-CONTENT.md](LICENSE-CONTENT.md)：原创内容许可范围；`LICENSE.txt` 的软件许可及上游声明另行适用。

问题反馈请附具体页面、失效链接、原始证据与建议修正，不包含 Token、私钥、私人路径或用户存档。
