# Wiki GitHub 合并门禁

本页记录仓库 `OrekiDawson/AD-Oreki-Wiki` 的合并保护目标和实际配置核验方法，供 Codex Lead / Wiki 专职 Subagent 执行。**修改本文件不会自动启用 GitHub Ruleset。** 只有 GitHub 服务端配置成功并重新读取确认后，才能称“已上锁”。

## 目标规则

对默认分支 `main` 启用 **GitHub 原生 Ruleset** 或功能等效的分支保护，使用与 Android/Web 相同类型的两道硬门禁：

1. **必须经过 Pull Request**：禁止直接推送到 `main`；禁止强推和删除。无需额外强制第二位文笔审稿人，批准人数保持现行明确授权的值；不要把 Kody Review 自动伪装成人工批准。
2. **必需 CI**：选定唯一、稳定的检查上下文 `Wiki PR CI`，检查来源为 GitHub Actions。它来自 `.github/workflows/pr-check.yml` 工作流（`KB PR check`）中的 `build` Job，涵盖翻译许可与清单、内容规范、Quartz 构建和生成物验证。缺失、运行中或失败不得合并。建议勾选保持 PR 与目标分支最新同步，以实际合并频率和 GitHub 验证为准。
3. **审查线程锁**：启用 `Require conversation resolution before merging`（Ruleset API 中的 `required_review_thread_resolution: true`）。所有尚未解决的 inline review thread（包括 Kody 等审查者留下的线程）都要实质处理，再由有权限者在 GitHub 标为已解决；不能只回复一句“已修复”或关闭 Issue 就当作线程归零。
4. **无管理员绕过**：不设置可绕过者；已有 Ruleset 时先核对优先级与保护覆盖，不破坏既有实际约束。确认旧自动化帐号/Pages 部署是否会受影响，只对 `main` 的入站代码进行保护。

**注意：**此处的线程锁是 GitHub 原生 Review Thread 合并限制，不是给 PR 评论“加锁”、锁定 Issue、禁止讨论或强制收取一次 Kody 费用。它不等于 Kody 审查结果、作者事实核验、CI 结果或真实网站上线验证。

## 服务端配置步骤

使用具备 **Administration / Edit repository rules** 权限的 GitHub 登录：

1. 打开仓库 **Settings → Rules → Rulesets**，新增 `New branch ruleset`；名称建议 `wiki-main-protection`，目标为默认分支 `main`，Enforcement 选 **Active**。
2. 选择 Require a pull request before merging、Restrict deletions、Block force pushes。
3. 启用 Require status checks to pass，添加 **`Wiki PR CI`**，来源选择 **GitHub Actions**。勿误选 `build`、Pages 部署 `build`、`Kody Code Review` 或只读提示 Job `PR 原子化与范围提示`。
4. 启用 **Require conversation resolution before merging**。不要通过设置“一个审批人”来代替解决 Review Threads；它们是不同约束。
5. 认真核对 bypass 列表，保持无绕过者，然后保存。该项需要实际的 GitHub 仓库管理权限；仅提交规则文件或 CI 绿灯**不会**自动开启保护。

GitHub 官方说明：[配置规则集](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)、[关于受保护分支](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)。

## 生效核验

以 GitHub API 或仓库管理 UI 核对：

- `GET /repos/OrekiDawson/AD-Oreki-Wiki/rulesets` 返回目标规则集且 `enforcement=active`；
- 查看规则详情：`conditions.ref_name` 命中 `main`，`pull_request.parameters.required_review_thread_resolution=true`，`required_status_checks.parameters.required_status_checks` 包含精确名称 `Wiki PR CI`，且禁止 `deletion` 与 `non_fast_forward`；
- 一个新的测试 PR 上确实出现 `Wiki PR CI`，检查未完成或失败时不可合并；构造或使用一个真实尚未解决的行级审查线程，确认合并被阻断，处理并解决后方可继续；
- Kody 有效结果、作者核查、必要 CI、分支保护和 Pages 部署分别记录，互不冒充通过。

权限不足、Ruleset 不存在、配置与说明不一致或无法执行测试时，记录 `PROTECTION_BLOCKED` 与实际阻断原因，不得宣称已经“启用”。不要通过将检查设为可选、跳过提交状态或管理员绕过来掩盖失败。

## 修改与维护

当 CI Job 名称、触发器、分支名或 Ruleset 被调整时，**同时更新本页、`AGENTS.md` 和实际 GitHub Ruleset**；先在新 PR 中核验正确的检查上下文，避免出现一个永远等不到的 Required Check。仓库 CI 只负责文档、许可、Quartz、网站生成物等机器验证；编辑质量、Kody 和线上 HTTPS/移动端按原规则各自验收。
