# 原版 Wiki 中文翻译专区规范

本文件定义 `content/player/original/` 玩家专区原版翻译的来源、许可、署名、翻译标准、状态与增量同步方式。规则受 `content/wiki-rules.md` 约束；两者冲突时以 `content/wiki-rules.md` 为准。

## 1. 专区边界

- **原版 Wiki 翻译专区**（`content/player/original/`，路由 `/player/original/`）：忠实翻译 `https://antimatterdimensions.wiki.gg` 的原版游戏正文。
- **Oreki Edition MOD 专题**（其余分类）：MOD 的玩法变化、自动化、技术实现与验证结果。
- **开发历史档案**（`content/developer/history/`）：Changelog、Release Notes、轮次记录与报告索引。

三者可以通过「相关条目」互相链接，但不得混写：翻译页不得加入 MOD 的数值、结论或自动化描述；MOD 页也不得把翻译页当作 MOD 事实来源。

## 2. 来源与许可核实

1. 站点级许可：社区 Wiki 的 [Meta:Copyrights](https://antimatterdimensions.wiki.gg/wiki/Meta:Copyrights) 声明，其可合法授权的文本与图像内容按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 提供。**站点级声明不足以替代逐页检查**。
2. 每个待翻译页面记录：原始标题、URL、页面 ID、修订 ID、最后编辑时间与编辑者、页面历史链接、抓取时间、页面分类。
3. 逐页检查第三方素材：
   - 页面内的图片、图标、截图：先逐项确认页面或素材本身的许可。许可明确允许转载时，优先将图片复制到仓库并记录原始 URL、文件名、修订/抓取时间、作者与许可；许可不明或含第三方素材时不复制，改为保留原页链接并注明「原文图片未转载」；
   - 页面若包含单独版权声明、转载授权模板或第三方长引文，标记 `BLOCKED` 并跳过，不猜测许可；
   - 信息框、导航模板（navbox）与游戏数据模板：只翻译有正文价值的文字，模板结构不复制。
4. 译文属于**改编作品**：必须按 CC BY-SA 4.0 署名、注明修改、并以相同或兼容许可共享。原站内容不得被表述为 Oreki Edition 团队的原创作品。

## 3. 页面署名模板

每个正式翻译页必须有可见的来源块（放在正文末尾、相关条目前）：

```markdown
## 来源与许可

- 原文：[英文标题](原页 URL)（修订 ID `12345`；最后编辑者 Name；抓取于 YYYY-MM-DD）
- 原文贡献者与修订历史：[页面历史](history URL)
- 许可：[CC BY-SA 4.0](许可链接)。本页为**简体中文翻译（改编）**，已修改：翻译正文与表格、统一术语、移除导航模板与信息框、按许可复制或未转载图片并记录素材来源；本页按相同许可共享。
```

frontmatter 机器字段（CI 校验）：

```yaml
original_title: "英文原标题"
original_url: "https://antimatterdimensions.wiki.gg/wiki/..."
original_revid: 12345
original_fetched_at: "YYYY-MM-DDTHH:MM:SS+08:00"
original_license: "CC BY-SA 4.0"
original_license_url: "https://creativecommons.org/licenses/by-sa/4.0/"
translation_status: "TRANSLATED"   # NOT STARTED / IN PROGRESS / TRANSLATED / STRUCTURE CHECKED / REVIEWED / VERIFIED AGAINST GAME / BLOCKED
review_status: "NOT REVIEWED"      # NOT REVIEWED / STRUCTURE CHECKED / REVIEWED / VERIFIED AGAINST GAME
```

## 4. 翻译标准

1. **完整**：标题、导语、全部正文章节、列表、表格、公式、解锁条件、数值与重要提示都要翻译；不得只译前半篇，不得用「以下略」「详见英文原文」代替可合法翻译的正文。
2. **忠实**：原文讲述原版行为就译原版行为，不得为了迎合 MOD 改动原文含义；原文错误或与官方源码冲突时，保留原文并加显著「译者注」，不静默篡改。
3. **公式与数值**：LaTeX 公式保留为 `$...$` / `$$...$$`，变量名、数值、单位、代码标识符不翻译。
4. **术语统一**：使用 `docs/translation/glossary.md`；新术语先入表再使用。
5. **结构**：保留原文的小节层级与顺序；「琐事」「脚注」「参考资料」等章节若原文为空，可注明「原文此节为空」，不得虚构内容。
6. **中文质量**：简体中文、自然通顺、避免机器翻译式病句；技术名称首次出现附英文原词。
7. **媒体缺失**：图片、音频、视频未转载时，在对应位置或来源块明确说明；不得声称「该页已完全翻译」而不提媒体缺失。

## 5. 状态与覆盖率

以下翻译状态等级由本文件统一定义；`content/wiki-rules.md` 只规定译文应忠实、可查证并保留许可信息：

- `NOT STARTED`：仅进入清单，未翻译。
- `IN PROGRESS`：已建立页面但正文不完整，**不得合并发布**。
- `TRANSLATED`：正文已翻译（可含机器辅助），尚未充分核对。
- `STRUCTURE CHECKED`：章节/表格/公式/来源字段与原站结构一致；**明确不算语义审校**。
- `REVIEWED`：已对照原文逐段审校，确认术语、数字、公式、解锁条件与语义无明显缺陷；**必须有页面级审校记录**（`docs/translation/reviews/`）。
- `VERIFIED AGAINST GAME`：关键机制/数值已与游戏源码或真实运行证据交叉核实。
- `BLOCKED`：许可不明、含受限第三方材料或无法合规转载；在清单与专区首页列出原因。

覆盖率分两项报告：

1. **已审校覆盖率** = （`REVIEWED` + `VERIFIED AGAINST GAME`）合规正文页数 / 合规正文页总数；
2. **结构核对覆盖率** = `STRUCTURE CHECKED` 合规正文页数 / 合规正文页总数。

同时单独报告：版权阻塞数、媒体缺失页数、已翻译未校对（`TRANSLATED`）页数。**状态必须与证据相符**：没有逐段审校记录不得标 `REVIEWED`；机器比对、格式检查、字符串比对都不等于内容审校。

## 6. 页面路径与命名

- 文件：`content/player/original/ow-<english-slug>.md`（`ow-` 前缀避免与 MOD 页面同名冲突；旧 `/original/` URL 由兼容入口保持可访问）。
- 标题：术语表中文名；与 MOD 页面同名冲突时加限定语（例如「反物质维度（游戏机制）」）。
- 不得移动或覆盖既有 MOD 页面与 URL。

## 7. 增量同步

- 清单：`docs/translation/source-manifest.json`（每页记录 `revid`、`last_edited`、状态与中文路径）。
- 手动同步脚本：`node scripts/translation/sync-original.mjs --check` 只读比对原站修订，列出「原文已更新、译文需复核」的页面；`--write` 才更新清单中的 `revid` 与核对时间。
- 不放入 CI 定时任务，避免持续消耗网络与模型资源；同步采用温和速率（默认每页间隔 300 ms，单次不超过 120 页）。
- 原文更新后：保留中文历史与人工校对结果，只标「待复核」，不得整页无条件覆盖译文。

## 8. 批次与验收

- 每批数量依作者逐段自检与事实核查能力而定，历史的 5–10 页仅供安排工作，**不得为凑页数扩大批次或绕过审校**。更新时附清单及真实来源和审校状态；每批机器检查仍必须通过：
  - `node scripts/check-content.mjs`（全站内容规则）
  - `node scripts/check-translation.mjs`（翻译专区来源/许可/状态一致性）
  - `node scripts/verify-build.mjs`（构建产物、旧 URL、类目）
  - `node scripts/acceptance.cjs`（Chromium 手机视口）

  首次运行浏览器验收前执行 `npm i -D playwright`，或在环境中设置
  `KB_PLAYWRIGHT=<已安装 Playwright 模块路径>`。
- 批次提交前逐页核对：章节齐全、公式与表格无缺行缺列、术语一致、内部链接可用、来源块完整。
- 合并后由 `deploy-wiki.yml` 部署；翻译页与 MOD 页同站但分区显示。

## 9. 禁止事项

- 未核实许可时不复制原站图片、图标与第三方素材；许可明确且完成署名与来源记录时，优先复制到仓库，避免依赖外部热链。
- 不把机器翻译输出未经校对直接发布。
- 不用翻译页篡改或替代 MOD 技术结论。
- 不在许可不明时「先发布再补许可」。
- 不做全站无差别批量抓取；按清单与批次进行。
