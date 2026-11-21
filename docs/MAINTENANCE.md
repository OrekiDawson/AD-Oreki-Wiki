# 维护说明

## 仓库形态

薄仓库：只保存 `content/`（Markdown）、`quartz.config.yaml`、`scripts/`、`.github/`。
构建时由 `scripts/bootstrap-quartz.sh` 克隆**固定版本**的官方 Quartz 5 源码（pin 在脚本内），再叠加本仓库内容。

> 本地 Node 26 构建会触发 esbuild service SIGBUS。CI 已固定 Node 24；本地请使用 Node 24（`.node-version` 也指向 24.x）。若本机默认是 Node 26，可用 nvm 安装 24 后在构建 shell 中切换。

## 规则文件

- 唯一权威编写规则：`content/wiki-rules.md`（公开页面 `/wiki-rules`）。
- `docs/CONTENT_QUALITY.md` 是兼容入口，只保留摘要与指向；`docs/ARTICLE_TEMPLATE.md` 是编辑模板。
- 不要在两处同时维护规则正文；要改规则就改 `content/wiki-rules.md`。

## 日常流程

1. 修改/新增 Markdown（必须含 frontmatter `title`；专题条目要有中文导语与就近来源）。
2. 内部链接用 `[[页面名]]`；CI 会检查断链。
3. 专题条目写当前有效结论；玩家内容放 `content/player/`，开发者内容放 `content/developer/`，时间线、逐日改动与轮次结案写进 `content/developer/history/`。
4. PR -> `KB PR check`（构建 + 内容检查 + 产物检查）。
5. 合并 main -> `Deploy wiki to GitHub Pages`（构建、部署、线上验收）。

浏览器验收脚本不把 Playwright 写进生产依赖。干净检出首次运行前执行
`npm i -D playwright`；若使用外部已安装模块，设置
`KB_PLAYWRIGHT=<模块绝对路径>`。站点地址可用 `KB_URL=<URL>` 覆盖。

## 内容检查（`scripts/check-content.mjs`）

机器可判断的规则会被 CI 拦截，当前包括：

- frontmatter 与 `title` 存在，规则页标题固定；
- 普通条目标题不带命名空间前缀；
- 内部 `[[链接]]` 可达；
- 敏感信息与私有路径扫描；
- 未审核 AI 草稿不得作为正式内容被引用；
- 反日志化：普通条目不得出现「## R113-01」这类轮次章节，新增条目必须有主题导语；
- 双专区入口 `/player/`、`/developer/` 与真实分类内容必须存在；玩家页不得出现 AI Summary。
- 历史归档必须位于 `content/developer/history/` 且带「历史」标签，其他目录不得伪装成历史。
- 移动页面必须写旧 URL alias，并验证旧分类入口和旧页面仍可访问。

流畅性、解释深度与事实真实性仍依靠人工复核，CI 不做逐字审计。

## AI 草稿自动化已停用（2026-11-17）

已按用户要求移除 `.github/workflows/ai-knowledge-sync.yml`，不再在每天 18:30 触发 DeepSeek 模型调用或生成草稿 PR，也不新增其他自动 AI 草稿任务。需要新的 Wiki 条目时，仅根据用户明确提出的内容和实际来源执行人工核验、正常 PR 与审阅。

保留历史 `content/ai-drafts/`、`.ai/state.json`、`evidence/ai-sync/` 和 `scripts/ai/` 用于追溯，均不再由定时 Workflow 自动执行。不要为恢复旧同步任务而自行调用模型或创建新的触发器。

正常 `KB PR check`、Quartz 原生搜索、Pages 与 HTTPS 验证继续运行；外部 GitHub App 的真实审查状态以 GitHub 为准，避免把旧文档中的「未启用 Kody」当作现状。人工内容审阅与版权核验要求保持不变。

## 历史归档工作流

1. 把带明确时间性的材料写进 `content/developer/history/`，文件名以日期开头（如 `2026-11-15-....md`），`tags` 含「历史」。
2. 历史条目写清「当时结论 / 现在是否仍然有效 / 适用版本」，并链接原始 PR、Run 或报告。
3. 专题页用「历史变化」或「参考资料」按需链接历史条目，不复制整段历史。
4. `content/developer/history/index.md` 是归档索引，负责分类与检索入口；旧 `/history/` 只保留兼容入口。

## 安全约束

- 不提交 Token、私钥、用户存档、私人路径、内部服务器地址。
- `scripts/check-content.mjs` 会扫描 `cfat_`/`ghp_`/`sk-`/私钥/`/home/oreki/` 等模式，命中即失败。
- 旧有 AI 草稿和 PR 仍须逐条核对来源 Commit 后才能用于正式正文；不因草稿已合并到 Git 仓库就视为已正式审校。
- 不在 `pull_request_target` 中执行外部 PR 代码。

## 回滚

- 站点回滚：main 上 revert 对应合并提交，推送后自动重新部署。
- 历史 AI 同步状态：`.ai/state.json` 仅作追溯，无自动「下次同步」；禁止通过重启定时工作流重做旧草稿。
