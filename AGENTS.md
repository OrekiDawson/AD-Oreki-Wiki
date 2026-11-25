# 中文 Wiki / Quartz 5 · Agent 长期规则

> **AGENTS.md 章节规范（长期强制）**：文件名与根标题保持标准；正文只使用连续的 `## 1. ...`、`### 1.1 ...`、`#### 1.1.1 ...` 等层级编号。新增规则必须归入所属主题，不得无编号插入文件最前端、叠加第二套目录或为每轮创建重复章；修改编号时同步修复本文及跨仓 `§` 引用。跨仓共性规则以 Workspace 为权威；纯目录重排不改变权限、预算、验收或发布门禁。

## 1. 总则与授权

### 1.1 统一规则来源与继承

- **单一权威来源**：[Workspace 最新 AGENTS.md](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/blob/main/AGENTS.md) 是 ChatGPT/Agent 分工、任务编号与 `/goal`、费用/审查、游戏真实性与五阶段 180 分钟目标、Subagent 调度、GitHub/CI/CD、中文规范及交付的**全项目长期规则**。本仓继承其中适用条款；本仓 `AGENTS.md` 仅补充本平台技术和运行约束，**不得以内容未在本文件逐字重复为由忽略跨仓规则**。
- **每三分钟主动汇报（长期强制）**：执行中的主 Agent/Lead 必须按真实墙钟每 3 分钟至少向用户可见的会话或授权渠道反馈一次当前任务、可核实进展、当前动作、阻断及下一步；Subagent 同频向 Lead 汇报，由 Lead 汇总。长构建、测试及等待期间仍应反馈，无新增成果时如实说明。重要阻断、安全风险和任务结束立即反馈；反馈后继续执行，不视为停止或结束 Goal。不得为汇报重复轮询、付费调用或中断运行中的进程；工具无法支持时如实记录限制及超时。暂停或任务结束后停止空心跳。完整口径见 [Workspace AGENTS.md §1.1](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/blob/main/AGENTS.md)。
- **Android 五渠道发布协作（长期强制）**：遵循 [Workspace AGENTS.md](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/blob/main/AGENTS.md)，Stable Release 与 Pre-release 均使用 GitHub Releases、OneDrive、Google Drive、小米云盘、本地 SSH/SFTP 五渠道，复用同一签名 APK/SHA-256 及签名要求的配套 idsig/SHA-256；Windows 三家云盘使用官方客户端，不以 rclone 为交付依赖。逐渠道核实实际同步、下载、链接/路径及哈希，部分成功不得宣称五渠道完成；预发布独立路径，不覆盖稳定 latest。Android 为发行责任仓，其他仓仅维护适用引用和证据，不自动取得发布权限。旧四渠道规则以此为准。
- **业务优先（长期强制）**：遵循 [Workspace AGENTS.md §1.1](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/blob/main/AGENTS.md) 的 P0 游戏业务优先规则。全量反编译、全 APK 源码化、Smali 退役及非阻断 AGP/R8/旧构建链迁移为 P1；普通目录和工具链治理为 P2。仅直接阻断 P0 业务、构建、真实验收或安全交付的最小工程闭包临时升 P0。保留 Kotlin-only、源码化长期终局和全部安全、签名、存档、发布门禁，不以源码覆盖率冒充游戏进度。本条覆盖旧轮次相反优先级和一次性迁移时限，不授权接管其他仓库或本机任务。
- **先读取再执行**：启动、恢复、跨仓交接和关键合并/部署前，按照 Workspace 生效规则核验最新 `origin/main:AGENTS.md`（云端用 GitHub API 可替代只读刷新）、本仓规则、事实、任务书、实际 PR/CI 与运行证据；遵守已有 60 分钟常规刷新和关键动作前的短间隔刷新。读取失败或未证实最新版本时记录 `STALE/BLOCKED`，不能声称已同步。本仓更细的合法技术约束继续有效；**用户最新授权与安全/预算硬限制优先，其他冲突以 Workspace 跨仓规则为准**，发现不可兼容之处只作最小修复并报告，不静默放宽门禁。
- **运行方式**：当前已启动轮次仅续做，不重新发 `/goal` 或改编号；Agent 输出、人工注释/文档和有意义的 Commit 使用简体中文、LF；按风险做最小必要真实验证，结果如实为 `PASS / FAIL / BLOCKED / NOT RUN`；保护未提交文件、唯一构建/测试证据及 Git worktree，避免重复工具安装和无限临时工作树。不得把文档/CI/规则 PASS 冒充真实游戏、上线或正式发布 PASS。
- **本机资源保护与生命周期（长期强制）**：遵守 [Workspace AGENTS.md §2.1、§5.1、§5.3](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/blob/main/AGENTS.md) 与 [Git 工作树生命周期规范](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/blob/main/项目管理/Git工作树生命周期规范.md)。本机开发启动前核实实际 CPU/RAM/Swap/I/O/磁盘余量、cgroup 预算与唯一重型任务许可；重型构建、反编译、AVD、浏览器长跑、Timeshift 创建/清理不得重叠，保护桌面、网络与远程救援，压力异常先暂停新增负载，不自动重试失控任务。当前轮次若有资源硬门禁，须以真实验收及用户授权解除，不能以重启或文档合并代替。Subagent/Owner 任务完成、取消或替代后先保存独有成果、WIP 与证据，再实际回收安全的工作树与无引用临时生成物；Lead 交接/收尾核对主检出及全部 worktree、实际释放空间。禁止强制 remove/reset/clean、跨 Owner 删除、清空在用缓存或从 Windows 第三方 ext4 驱动批量清理；正式资产与有效回滚点只读保护。具体阈值由 Workspace 与当前任务书管理，不在本仓另设独立预算。本仓 Quartz/Node、浏览器验证与本地生成物纳入实际资源准入；保留原创/译文、来源、版权、内部事实核验及必要历史证据，回收无引用的可重建输出，不把清理当作发布授权。Wiki 内容与 Kody Balanced 门禁不变。

- **Wiki 专属继承重点**：内容按简体中文百科条目与 CC BY-SA 4.0、已批准的 Wiki 编辑规范实施；优先核实可靠来源、准确引用、翻译、历史版本、旧 URL 与 `/player/`、`/developer/` 双专区；禁止用重复变更日志或未经审核 AI 草稿凑交付。Wiki 的 Kody 原生审查与独立配额按本仓已生效规则执行，不因跨仓继承而自动增加收费请求；本 PR 的规则同步明确写入本文件。

### 1.2 授权、预算与运行状态

- **实时授权优先**：用户明确授权的范围直接执行；未授权的付费调用、全量开发、自动发布和无人值守任务不得擅自启动。最新明确暂停优先于更早的恢复；当前 Goal/编号、PR、Kody 开关、测试状态以最新用户指令、实际平台配置及任务记录为准，不在本长期规则中永久冻结某一轮状态。历史 AGENTS 快照只供追溯。
- **付费门禁（最新授权）**：遵循 Workspace 权威规则：取消 DeepSeek 固定余额和余额未知的停工/付费前置门禁，余额仅供参考；实际 Provider 拒绝请求时仅阻断对应付费路径，不暂停无关已授权任务。周期预算 80% 预警、100% 或预计超额停止新增收费任务，保留真实授权、有效凭据、安全、Kody 额度及适用峰谷限制；不得自行充值、重建密钥或切换账号/Provider 绕限。
- **事实与验收**：未运行为 `NOT RUN`，失败为 `FAIL`，受阻为 `BLOCKED`，只有真实证据才能写 `PASS`。单测、CI、构建、安装、真实运行、发布及线上验证分开标识，不伪造结果或把旧候选结果移植到新提交。
- **风险分级**：P0 为真实游戏核心失效（包括核心自动化失效、进度死锁、非法解锁、严重节奏/终局阻断、核心跨端行为不一致）、崩溃、无法启动、存档损坏、伪造及直接阻断这些目标的必要工程问题；P1 为其他显著玩法/GUI/节奏差异及非阻断源码化、AGP/R8/旧链迁移；P2 为非阻断体验优化与普通目录/工具链整理。以 Workspace §1.1 为权威，优先真实复现和最小必要修复。

### 1.3 任务编号与 Goal

- ChatGPT 是所有项目任务编号的唯一分配者。
- Lead 只能使用 ChatGPT 已明确分配的编号；Subagent 继承当前编号；Codex、DeepSeek、其他 Agent、调度器和 GitHub Actions 不得自行创建、推算、递增或生成编号。
- 新任务只用单层 `R整数`；禁止新增子编号。用户说继续时沿用当前编号。
- **Goal 入口**：新一轮开发的首条 Prompt 必须严格使用 ChatGPT 按用户最新要求提供的完整 `/goal` 字面前缀，原文不得缩写、变更或自行推断；包含个人本地安装包路径的具体模板仅随当轮授权输入或受控本地任务记录提供，不在公开长期规则中重复写死。中途续做、补充、纠错和暂停恢复不得重新 `/goal`、改编号或重置计时。超长目标应使用经验证的官方 Goal 文件引用机制或自定义实现，不静默截断，也不假定本机已解除 4000 字符限制。
- 历史 `R121-01` 及相关提交、路径、证据保持原样，仅用于兼容与追溯；不表示该轮仍进行中。当前执行编号和状态由 ChatGPT 最新分配、用户明确授权、实际 Goal 与任务台账确定。
- 所有历史编号、提交和证据保持原样；下一轮编号只由 ChatGPT 明确分配。

## 2. Wiki 内容与发布

### 2.1 内容规范、玩家与开发者专区

- 本仓是中文知识库，公开内容规范以 `content/wiki-rules.md` 为总纲，另以 `content/wiki-not.md`（本站不是什么）明确正文收录边界：不以 PR 日志、宣传稿、未经审核 AI 草稿或资料堆砌充当百科；允许经核验的玩家攻略、开发者手册与可复核工程研究。写作前核实正文、原始来源、模板和 `docs/AGENT_GUIDE.md`。区分原版、MOD、历史、当前实测与推断；禁止虚构 SHA、ABI、测试结果、下载或上线状态。遵守 CC BY-SA 4.0 与各原始资料的许可、署名、翻译术语和版本溯源。
- **单站双专区**：`/player/` 面向普通玩家，含游戏百科、中文译文、MOD 玩法、教程、下载与 FAQ；`/developer/` 面向开发者，含架构、逆向、ABI、构建、故障、CI 和运行证据。共同规则/版权放公共区。混合文章按用途拆分，以来源和交叉链接避免事实重复与漂移。
- **下一次正式交付 P0 门禁**：下一次 Wiki 正式交付前，必须真实上线 `https://wiki.oreki.net/player/` 与 `https://wiki.oreki.net/developer/`，两个专区均有真实正文、独立分类导航和明确首页入口；验证移动端、搜索、面包屑、旧 URL 兼容、Quartz 构建、GitHub Required Checks、Pages HTTPS 和实际线上响应。关键项任一失败均为 `BLOCKED`；空目录、占位页、README 计划或仅 CI PASS 不能冒充双专区正式上线。完成后继续长期维护。
- **阅读体验与专区边界**：玩家专区以“新玩家能开始、当前阶段能推进、遇到困难能处理”为目标；开发者专区帮助真实开发者上手、理解架构、定位源码、验证与排障。玩家正文不塞 Kotlin/ABI/PR 流水账或项目审计，开发者正文不靠历史 PR/Run 和统一状态表凑篇幅。共同规则/版权独立；一项事实只维护一个权威解释，保留重要来源、旧 URL 和别名；纯文档 PR 不触发无关游戏长跑。
- **玩家专区按问题和阅读目的重构（2026-11-22）**：保留 `/player/` 公开路径与翻译署名，玩家正文分为**机制百科、入门教程、分阶段攻略、FAQ/故障处理、原版译文**五种用途；不将它们混成按 R 轮次汇编的“玩家技术报告”。机制百科回答“为什么”，教程回答“怎样第一次完成”，攻略回答“下一步如何选择”，FAQ 回答“当前问题如何处理”，译文只忠实呈现原版修订并有独立版权和审校状态。**不按固定“背景/意义/总结/参考资料”目录套写全部页面**，更不能用一句大而空的建议代替可操作路径。内容应按新档、无限、永恒、现实、天神/终局可渐进阅读，支持具体机制查找。
- **玩家事实与版本边界**：原版 Android 3.21.0、Web 冻结基线、当前 Android/Web MOD 和各自的真实游戏界面/源码必须分开标注；原版解锁和资源数值、MOD 缩放、调度器实际托管字段、存档互通与发布状态逐项核对；尤其禁止把历史实现、未合并 PR、旧版错误显示或目标体验表当作当前玩家事实。项目“真实新档 ≤180 分钟”是**目标/有条件的测试结果**而非所有玩家/版本保证，五阶段时段是体验设计而非强制具体解锁时间。无依据的攻略推荐、绝对化时间和跨平台等价宣称必须删除或注明未验证。
- **玩家正文质量门槛**：教程必须有真实界面/操作名称、前提、按序动作、到达下一步的判断和常见误区；机制页先解释资源、重置、保留项与解锁的因果；攻略应说明所依赖的存档阶段、难度/版本、选择原因和替代路线，不能把唯一最优路线写成已验证通用定律；FAQ 先给安全、可执行的排查步骤，危险的清档/改档/安装行为必须提示备份；原版译文逐段核对并如实记录 `TRANSLATED / STRUCTURE CHECKED / REVIEWED / VERIFIED AGAINST GAME`。首次使用的术语保持一致，较难的数值可辅以正确例子，**不复制工程报告或大量 AI 套话**。
- **玩家编辑与旧稿治理**：须完成原始事实核查、自然中文写作、作者自检并记录未执行项；独立内容/操作审校不是强制门禁，缺少独立审稿人不得单独标 `EDITORIAL_BLOCKED`。PR Ready、Kody 与 Quartz PASS 仍分别只是对应门禁结果，不能互相替代。存量先核对已有 77 个 `/player/` 页面（其中 61 个是 `/player/original/` 文件，含索引），九篇候选改稿 #81–#83 **不得因已写完便自动获放行**；先完成作者自检与事实核查，再考虑导航与批量拓展。公开细则及逐页台账以 `content/wiki-rules.md`、`docs/玩家专区重构台账.md` 为准。
- **开发者专区重构优先于新稿数量**：暂停批量新建或机械改写 `/developer/` 文章，先对现有页面按读者任务盘点为“保留 / 定点重写 / 归档 / 合并与重定向”，记录相互重复、有效来源、历史失效和旧 URL；一次只精修一组能够独立验收的页面，原始报告与固定来源不删除。规则调整不代表现有技术文档已经通过质量验收。
- **以读者任务划分四类内容**：①入门教程（从干净环境完成一件小事）；②操作指南（在明确前提下执行构建/测试/部署/排障）；③技术参考（入口、文件、符号、参数、配置和约束）；④原理说明（模块职责、调用链、数据流、关键权衡）。历史事件、R 轮次、CI 时间线仅作为独立档案和证据，不能冒充上述任一类；同一篇可交叉链接，**禁止强制统一标题模板**。
- **开发者质量硬门槛**：每篇先定义具体读者问题与适用 Android/Web 版本。讲架构须指出真实模块和调用/数据路径，必要时给准确图示；讲操作须给出已核实的前置环境、从仓库根可定位的命令/步骤、成功判据与失败定位；讲参考须列真实符号、文件与配置语义；讲故障须能复现、缩小范围并给出证据。源码/脚本引用优先固定 Commit，引用外部规范保留原始修订信息；**不能确认的路径、命令、数字或输出不得臆造**，未执行标 `NOT RUN`，不可把作者阅读视为运行 PASS。无需每篇同时塞入四种类型内容。
- **开发者内容核查**：正式新增或大改须经来源/源码核对、面向真实读者写作、作者自检和未运行范围记录；独立技术与可用性复审不是强制门禁，不因缺少独立审稿人单独标 `EDITORIAL_BLOCKED`。发现实际事实错误、读者无法完成任务、版权问题或 Kody 阻断项时才阻断；小幅文字/链接改动只做定向检查。
- **导航与技术档案**：将“开始开发→架构定位→构建与验证→排障与发布”作为未来主导航的四条读者路径，状态、来源、历史、AI 摘要放辅助入口。优先修复开发者首页、项目入门、Android/Web 架构、AGP 操作手册和故障排查这组核心页面，**但本规则 PR 不自动移动路径或发布未经复审的正文**。详细标准唯一以 `content/wiki-rules.md` 的“开发者文档质量与重构”章节为准，作业流程见 `docs/AGENT_GUIDE.md` 与 `docs/ARTICLE_TEMPLATE.md`。

- **通用内容门禁**：玩家与开发者新稿/大改均须源材料核对 → 按真实读者任务写作 → 作者完成事实、步骤、版权、链接和未运行范围自检。原版翻译还须符合独立翻译/版权政策，`STRUCTURE CHECKED` 不能冒充 `REVIEWED`。CI/Kody 和模型自评不代替事实核查；缺少独立审稿人不得单独标记 `EDITORIAL_BLOCKED`。实际文件改动的 Wiki PR 仍必须取得 Kody Balanced 的真实 PASS；`skipped`、`KODY NOT RUN`、运行中、失败或 Provider 不可用均不是 PASS，不能合并。
- **AI Summary 是可选附属资料，不是开发者内容分类**：只允许在经独立核实的开发者技术正文后附已审核、默认折叠、带来源和适用版本的摘要；不得将 `AI Summary` 放到开发者主学习导航、作为文章替代品或发布 KPI。玩家正文无机器摘要；未审 `content/ai-drafts/` 永不进入公开 HTML、RSS、搜索与索引。现有 AI Summary 索引在后续导航重构时安全降级，不在规则 PR 中直接删历史文件。
- 双专区先完整落地，后续主题调整再分批迁移；保留已发布页面旧 URL，通过实测别名/重定向保持外链有效；主页、侧栏、移动视口、表格、搜索、面包屑、Pages HTTPS 均须核验，不假定搜索已具备专区过滤。
- **质量优先，暂停 Wiki 48 小时内容数量/发布频率考核**：不以页面数、翻译字数、Commit、自动摘要或日历频率衡量质量；优先修复已有文章而不是批量新建。作者自检、来源核查、版权、CI、Kody 和 Pages 门禁分别如实记录；独立编辑审校可作为增强项，不因缺失单独阻断。每次上线仍遵守 Quartz、GitHub、权限和 HTTPS 门禁；Kody 停用时不自动重启。参阅 `content/wiki-rules.md` 与 `docs/MAINTENANCE.md`。

- **公开内容与核验记录必须分层（Wiki 内容长期强制）**：玩家文章只保留有阅读价值、真实可追踪的来源与必要版本边界，不得在正文、脚注或每条参考文献后反复插入 `NOT RUN`、`HTTP 200`、`API 核对`、`revid 归属证明`、Kody/CI/PR 处理记录、核验模板和一串审查用技术括号；验证日志、未运行项及证据详情集中写入 PR 说明、Review Threads 或内部来源核验记录。开发者的构建、测试与故障文章可按真实任务需要呈现验证状态，但不以报告流水账代替技术解释。不得因清理冗余而假称来源已验证；未经查实的关键来源、数字或解锁条件必须先核对，仍无法确认的内容保留具体事实阻断、寻找可靠替代或暂不公开。
- **Kody 意见与文章质量分开判断**：Kody Balanced 对所有有真实改动的 Wiki PR 仍是用户要求的必经审查，不把 `skipped`、待审或 `NOT RUN` 冒充通过；但 Kody finding 属于待判断的问题线索，不是写作模板，也不得凌驾于用户明确授权。先识别真实缺陷，再以不伤害读者体验的最小修改修复；不能为迎合审查而机械复制机器核验状态、不断增加括号或把 Kody 必审改成可选。`EDITORIAL_BLOCKED` 只表示实际事实、版权、误导或可用性缺陷；审查、CI 与 Provider 阻断另记 `REVIEW_BLOCKED(原因)`。缺少第二文笔审稿人本身不阻断。
- **文章可读性回归与外部等待防空转**：新稿、大幅改写与 Kody 整改提交前，检查正文是否自然连贯、读者能否照着操作、参考资料是否重复、是否混入审查状态或机器报告腔；发现此类污染视为内容质量回归，先定点修复，不无故全文重写。等待同一 HEAD 的 Kody/CI 回执时只记录必要状态和下一动作，转做其他独立任务或结束当前执行；不得靠空轮询、重复 `@kody start-review`、空提交消耗资源。

## 3. Android 跨仓协作

### 3.1 P1 全量 Smali/DEX 清零

- **权威目标（P1）**：Android 按业务需求增量恢复生产 Smali/DEX 为经 AGP 标准源码编译与运行验证的过渡 Java/Kotlin，最终清零生产 Smali 补丁、手工 DEX 注入、`build_mod.py` 依赖及 APK 二次打包。JADX/REA 只是恢复分析工具，反编译输出不等于编译/语义 PASS；新增、修复和实质修改的 Android 业务必须 Kotlin。仅直接阻断 P0 的最小闭包临时升 P0；不再要求 R126 单一窗口一次性恢复。CI/Kody/发布门禁不变。
- **本仓职责（中文 Wiki）**：仅跟踪/修复实际受 Android 迁移影响的共享接口、跨端存档兼容、发布/下载链接、官方构建指令或文档引用；Android 源码/工具链的唯一 Owner 仍在 Android 仓。没有受影响的引用就记录“无需改业务”，不以 Android 工程迁移擅自调整 Web 游戏、Wiki 正文、Pages 部署、签名或本地环境。
- **验收**：要求 Android 权威 Issue 的 `PRODUCTION_SMALI_FILES=0`、`PRODUCTION_SMALI_DEPENDENCIES=0`、`MANUAL_DEX_INJECTION_PATHS=0`、`BUILDMOD_PRODUCTION_DEPENDENCIES=0`、`LEGACY_APK_REPACK_PATHS=0` 与 AGP 全游戏、Tick、存档、关键运行 PASS 真实证据；缺失时保持 OPEN/BLOCKED，不能在本仓宣称迁移成功。用户数据、安全、真实玩家 P0 优先。权威入口：[Android #52](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/52)、[#61](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/61)、[#25](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/25)、[Workspace #47](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/issues/47)、[#20](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/issues/20)。

### 3.2 P1 AGP 与目录治理

- Android [#61](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/61) 目录标准化列为 **P1 工程迁移（普通目录整理 P2）**，与 [#52](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/52) `build_mod.py` 完全退役同步执行「迁移即清理」。迁移批次删除旧生产入口、无用独占工具和失效目录引用；仍有消费者的共享工具不得误删。跨仓 Owner/PR 见 [Workspace #20](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/issues/20)。
- Wiki 仅在文档确实引用已变更 Android 路径、构建命令或工具时据实更新内链/开发者指南；保留历史事实及引用，不借 Android 工程迁移开展无关大规模内容改写。尊重 Wiki 编辑质量、Kody 与 Pages 门禁。规则合并后立即发起本机安全同步，未经回读不能宣称完成。


> 适用于 `wiki.oreki.net` 的长期编辑规范；当前内容轮次、实际 Kody 开关、PR 和 Pages 状态按实时证据判定，不写死在这里。

### 3.3 P1 64 位 ABI 与测试设备

- **Android 正式支持**仅 `arm64-v8a`、`x86_64`；停止 `armeabi-v7a`、`x86` 32 位兼容。实施归 Android [#285](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/285)，协同 #52 生产 Smali 全量清零/#61 根级 AGP；生产 `.so`、AGP ABI 过滤、包内 JNI、启动/Tick/存档、发布必须真实验证。原版历史 ABI/DEX/研究/存档不因移除 32 位 JNI 而抹除。未获得 ARM64 原生库/实机证据时如实保留 BLOCKED 或 NOT RUN，不得伪造完成。
- **日常设备策略**：优先使用 x86_64 Linux 电脑的唯一 API37 AVD 作为日常开发与大多数定向回归机；用户 Android ARM64 真机仅在可用、授权时偶尔做抽样安装、JNI、存档、冷启动与性能验证。**不要求每个普通 PR 跑手机**；本次 ABI 全面退役需单独提供 ARM64 真机证据或明确 NOT RUN。
- **本仓协作（Wiki）**：仅修复确有影响的共享发布元数据、下载/安装指南、ABI 支持说明、CI/交叉引用及跨端存档说明，不因此触碰 Android 构建脚本、改变 Web 业务、Wiki 独立写作或 Pages 部署门禁。继续当前 R126，不新 `/goal`。权威任务：[Android #285](https://github.com/OrekiDawson/AD-Oreki-Edition-Android/issues/285)、[Workspace #47](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/issues/47)、[#20](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/issues/20)。

### 3.4 P0 包名变更的 Wiki 文档协作

- Android MOD 的 P0 正式包名为 `net.oreki.antimatterdimensions`（来自 `oreki.net`），Debug 为 `net.oreki.antimatterdimensions.debug`；原旧版 `com.oreki.antimatterdimensions`、原版 `kajfosz.antimatterdimensions` 仍可出现在准确的历史/迁移说明与 ABI 记录，**不能无差别全文替换**。Android #52/#61/#17 和 PR #276 主责实施；Workspace #20 统筹。
- 仅当官方新包实际构建/分发并验证后，更新相应玩家安装指南、下载链接、包名说明、旧版存档导出→新版导入与新版不可覆盖安装的警示；在此之前清楚区分**目标包名**和**已发布包名**，不写成已经迁移成功。开发者文档按真实 AGP 源码与验证结果更新，引用有效内链，避免将审查状态写进玩家正文。
- 不因 Android P0 牺牲 Wiki 自身内容质量、版权/翻译、Kody/Quartz/Pages 门禁。规则合并后立即发起本机安全同步，实际回读通过后才记成功。

## 4. 质量、审查与合并

### 4.1 GitHub 审查与内容质量

- **风险分级**：A 类为纯文档/注释/索引，定向核实事实、版权、链接及敏感信息；B 类为 Actions、审查触发器、共享配额、权限、构建与发布工具，重点核实并发、幂等、边界、失败恢复和回滚，不因“未改游戏代码”而轻审；C 类为游戏业务、存档、结算和高风险机制，完整审查风险并做最小必要真实验证。混合 PR 按最高真实风险设置门禁，按文件聚焦测试。
- **集中修复、避免复审循环**：先核对最新 PR HEAD、Diff、普通评论、Reviews、Review Threads 与 Required Checks；同一 HEAD、同一审查配置和适用范围已经有效审过时不重复主动请求。集中解决同一批问题、定向验证后再复审；不制造空提交，不因风格建议无限扩项，也不为归零机械关闭线程。
- **规则治理专职 Subagent（三仓共用，唯一跨仓权威）**：Android、Web、Wiki（兼顾 Workspace 交接）共用最多 1 名规则治理 Subagent。统一调度顺序、游戏开发优先边界、任务优先级和 Lead/Subagent 权责以 [Workspace `AGENTS.md` §1.1](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/blob/main/AGENTS.md) 为唯一权威；Android/Web 的本地执行边界分别由其仓库 `AGENTS.md` 维护。本仓只补充 Wiki 专项职责：规则 Subagent 是当前授权窗口内的持续任务执行者，在 Wiki 侧负责 `AGENTS.md` 与专项规范一致性、规则 PR 定向修复、Kody/Codex Threads 核实、必要 CI/Ruleset 检查和 [Workspace Issue #20](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/issues/20) 交接；优先监督已配置的 **Kody 原生自动审查**，只在真实失败且费用/Provider/授权允许时人工兜底，同 HEAD/配置不重复收费审查。并发在途付费审查上限及 Android/Web 共享池阈值以 Workspace `AGENTS.md` §1.1 为唯一来源（当前为全项目最多 3 个已授权且相互独立的在途付费 Kody 审查；80 次仅预警、100 次硬上限）；本仓只补充 Wiki 差异：原生审查占用同一在途槽、额度独立统计、多个 PR 可 Ready，额度和资源不足时记录 `REVIEW_BLOCKED`。基础设施无法安全实施并发控制时，记录具体 `REVIEW_BLOCKED` 并修复隔离机制，期间不得在本仓另立不同上限、退回“全局只准一个审查”或放大并发。同一已授权队列内 Subagent 可自续跑，但每次 PR 状态变化须向 Lead 上报真实证据；Lead 保留核实、叫停、改派、优先级与预算否决权。Lead 保留最终合并和发布权；Subagent 不得绕过门禁或冒充 Review PASS。非阻断规则不得无限修改措辞或制造空轮询；出现实际结果或单个 PR 进入 `WAITING` / `BLOCKED` 后，应记录下一动作并继续处理队列中其他独立规则项；当队列已清空、无可安全执行事项、全部剩余事项均不可安全执行或出现峰时、预算、安全、用户暂停等硬停止条件时正常释放。Wiki 内容与 Pages 的必要工作不因规则队列停摆。
- **`REVIEW_BLOCKED` 原因与解除口径**：所有审查阻断记录必须带原因子状态，裸 `REVIEW_BLOCKED` 不作为可执行交接。`REVIEW_BLOCKED(quota)` 表示授权、Provider 实际可用性、预算或审查额度不足，记录 `Owner / HEAD / CI / Review / 已用量与在途量 / 阻断依据 / 下一动作`，仅在授权放行或对应额度恢复并重新核验后解除；`REVIEW_BLOCKED(concurrency-guard)` 表示现有触发器无法在收费事件前执行并发隔离，记录同一组字段及隔离缺口，仅在隔离机制修复并完成定向验证后解除。两类状态都不得重复请求同一 HEAD 审查或冒充 Review PASS；解除后先回读最新 HEAD、额度与在途状态再继续。
- **Subagent 完成后再调度（长期强制）**：每次 Subagent 完成、失败、取消或释放资源后，Lead 应及时接收并核实真实 Commit/PR/测试证据、更新队列，再按已授权且无冲突的任务继续派发；无安全且有价值的任务时正常释放并记录原因，不制造占位任务。Lead 占用 AVD、签名、最终构建/部署或等待长跑/CI 时，不依赖这些资源的 Android/Web 游戏修复、定向测试准备或 AGP/R8 工程工作，在已授权且处于合法谷时（或安全可执行窗口）时仍应并行推进；不得因等待 Lead 合并 PR 而让已完成 Agent 无故闲置，也不得改动他人认领的 PR 或工作树。峰时停工、预算停工与本条冲突时优先。
- **合并底线**：真实 P0/P1 与阻塞性问题必须修复或有充分反证；必要线程、审批、Ruleset、Required Checks 与测试均满足后正常合并。不得强推、跳过平台保护、虚构审核或将 `Skipped` / `KODY NOT RUN` 写作 PASS。文档变更不机械运行无关游戏长跑。
- **Kodus 的规则分层**：通用审查标准归 Kodus Global Rules，项目执行规范归本仓 `AGENTS.md`；不重复抄写为项目级 Kody Rules。Kody 从仓库文件读指令与否以实际配置/证据核实。自动生成的规则先审批去重，只有真正跨仓适用的候选可提升 Global，不能默认未经批准直接生效。
- **Kody 与额度**：Kody 仅限 Balanced，严禁 Heavy；授权、Provider 或云端审查配置暂停、未知或不确定时，禁止主动触发付费审查或重新连接付费 Provider；按实时授权、Provider、云端配置及费用状态执行。Android/Web 在 UTC+8 自然日共享最多 100 次主动审查请求（80 次预警，无单仓 50 次硬上限）；按原始 `@kody start-review` 评论唯一 ID 去重，避免同 Head SHA/配置重复审查。**Wiki Kody 独立统计，不消耗 Android/Web 这 100 次**，但不意味着无限、免费或自动授权。`Skipped` / `KODY NOT RUN` 不是 PASS；通用审查标准归 Kodus Global Rules，仓库执行规则归 `AGENTS.md`。
- **Kody 跳过一律不计额度**：所有 Kody 已确认 `skipped` 的审查均不计入项目主动审查额度。触发前跳过不占位；已预占或已发 `@kody start-review` 而 Kody 官方 Check Run 最终确认为 `skipped` 的，按仓库、PR、HEAD 与 Kody Check Run 证据幂等退额；Android/Web 共享 100 次池与 Wiki 独立统计均遵守。未完成审查可临时预占防并发超额；真正完成的审查（即使无问题）仍计数。只有 GitHub Actions 的 `skipped`、缺失回执或不明状态不足以认定 Kody 已跳过，不得擅自退额或把 `SKIPPED` 写为审查 PASS。Kody 平台实际收费另行遵循其规则。
- **Wiki Kody 自动审查**：Wiki 通过 Kodus 仓库级原生自动审查，为具备实际文件改动且进入 Ready 状态的 PR 发起 Kody；Draft 不提前审查，转 Ready 或 Ready PR 新提交后按仓库配置自动审查，同一 HEAD 与配置不得重复主动请求。确实无文件改动的 PR 是唯一常规豁免。配置由 Kodus 平台设置维护，GitHub 规则只约束监督与兜底，不伪造平台开关。自动 `Kody Code Review` 为 `skipped`、运行中、超时、Provider 不可用或只有 Codex Review 时均不得视为 Kody PASS；Agent 必须核对真实回执，在确认未重复、授权与预算允许时人工兜底。Wiki 审查额度独立统计，仍遵守 Balanced、80%/100% 预警停付；未被触发记为 `KODY NOT RUN`，执行失败记为 `FAIL`，仅当审查确实尝试并被外部阻断时才记为 `BLOCKED`，三者均不代表 PASS，并在对应任务记录中注明原因与兜底条件。

- **Wiki `main` 原生 CI 与审查线程锁（长期强制）**：`main` 必须由 GitHub 原生 Ruleset/受保护分支约束，要求通过 PR 合并、**Required Status Check `Wiki PR CI`（GitHub Actions 的 `KB PR check` 工作流）**以及 **Require conversation resolution before merging（所有 Review Threads 解决后才可合并）**；禁止强推、删除、绕过保护或使用 CI 绿灯冒充 Kody 审查通过。该工作流 `build` Job 的显示名必须唯一，避免与 Pages 部署 `build` 混淆；权限与实际门禁状态必须在合并前由 GitHub API 验证。Ruleset 缺失、未启用、检查名称不匹配或未完成线程时，记录 `PROTECTION_BLOCKED`，不得声称已经上锁；不通过新增付费 AI 审查实现线程锁。完整启用与验证方法见 `docs/GitHub合并门禁.md`。

#### 4.1.1 仅规则变更时的 Kody skipped 例外

- 对当前 PR HEAD 的**实际完整 Diff** 核验：仅新增/修改 `AGENTS.md`（含子目录同名文件），不得混入代码、CI、其他文档、构建或发布文件；若混入任何其他路径，不适用本例外。
- 当 Kody **官方**针对该 HEAD/配置确认因纯规则文件而 `skipped`，该结果不计付费审查配额，亦不等于 Review PASS；不为取得形式上的 PASS 重复触发 Kody。若 Kody skipped 的原因不明、服务故障或未返回官方结论，不得套用本例外。
- 只要当前 HEAD 的适用 Required Checks、审批、分支保护、Ruleset、合并冲突及其他人工阻断均已核验满足，允许直接自动合并纯 AGENTS.md PR，无需额外等待 Kody 的 PASS 或逐项向用户征询。**不得**绕过 GitHub 强制要求的 Kody Check 或任何其他保护规则；若平台仍将其判为 Required 且未满足，保持 BLOCKED。
- 合并后回读 GitHub 验证 merged 状态、merge commit 和 main；记录 Kody skipped 的真实原因、HEAD、门禁证据及结果。规则本身的授权不等于任何 PR 已满足合并条件。

## 5. 工作方式与环境

### 5.1 执行效率与反馈

- 先按路径/符号/Diff 缩小任务范围，复用未失效的测试及日志；工具相同失败两次应先诊断，不做无价值全量扫描、重试或无关重构。脚本尽量单责复用，不为假想需求提前增加复杂度。
- 重要进展、失败、预算预警及交付及时用简体中文反馈；长任务原则上每 2 分钟至少反馈一次有实质内容的完成情况、真实障碍与下一步。Lead/Subagent 使用可复核交接资料，避免重复读取上下文、无任务轮询或资源冲突。
- 详细事实、当轮步骤、当前状态、工具版本、PR、构建回执和历史报告放在对应 `tasks/`、`reports/`、`docs/`；`AGENTS.md` 只留长期约束。任何规则整理不得改写历史任务编号、源代码证据或已发布产物；用户最新明确指令、实际 GitHub 门禁和预算安全约束优先。
- **PR 原子化**：一个 PR 只处理一个独立且可审查的目标；约 400 行有效改动为软建议，超过约 800 行须评估拆分，不机械拆开必要的原子改动。禁止巨型混合 PR、强推、覆盖他人修改、绕过 CI/Ruleset 或重复付费审查。
- **证据与命名**：连续测试存档、长日志、截图和大量构建输出独立归档，保留可追溯索引及必要 SHA-256，源码 PR 仅保留摘要、关键复现样本，禁止删除唯一证据。所有项目人工维护文件、目录优先准确简体中文；技术必需的源代码、`AGENTS.md`、`.github/`、构建配置、协议及工具名保持兼容，迁移后验证引用与 CI。
- **多 Agent 协作**：Lead 动态派发已授权、可执行且无文件冲突的任务，文件派单与汇报，及时核实 Subagent 结果并决策；独立工作树和明确文件归属。AVD、签名、最终 Release 构建及部署独占；无有价值任务时正常空闲，不空唤醒、不造占位任务，Subagent 完成不等于 Goal 完成。Lead 及时用简体中文反馈实际进展。

### 5.2 持续推进与有效验证

- **继承跨仓权威**：遵循 [Workspace AGENTS.md](https://github.com/OrekiDawson/AD-Oreki-Edition-Workspace/blob/main/AGENTS.md) 的持续执行、短测收敛、Owner 避让和 Subagent 连续调度规则；以该规则实际合并进入 main 后的版本为准，不提前宣称未合并 PR 已生效。
- **阶段完成不等于停工**：当前 Goal active、合法窗口且存在已授权、无冲突的安全工作时，完成一次修复、测试、PR 或报告后立即处理下一项；只在真实完成、用户暂停、峰时/预算/安全限制、资源或权限阻断等条件下安全收口。不为凑时长空转。
- **测试假设驱动**：每轮定向测试记录候选 HEAD、输入、预期状态变化、实际证据和停止条件；同一代码/条件下不得反复做没有新增验证目标的相同短测，失败先定位根因。Wiki 应连续推进可独立收口的条目、审校、内链、专区与 Pages 验证；CI 绿灯不等于线上功能 PASS，不能为凑工作量反复改写已合格条目。
- **外部等待期间独立推进**：云端 GitHub 写入窗口、Kody/CI/审批等待期间，在其他规则允许的工作窗口继续不冲突的本地工作和证据整理；禁止抢占共享分支、AVD、签名或覆盖他人修改。及时报告真实进展，但报告不是停止信号。

### 5.3 环境故障诊断与安全恢复

- **禁止过早 BLOCKED**：遇到 Quartz/Node 依赖、Pages 构建部署、线上路由与资源加载或 CI 等环境异常，Agent 必须先在授权时间/权限/预算/Owner 边界内完成有证据的自主定位和最小安全恢复；一次或两次失败、单独的 `offline`、构建工具存在或静态检查 PASS 都不能证明环境不可恢复，也不能把环境失败归咎于 APK/业务代码。
- **诊断闭环**：先核对是否与其他 Agent、AVD、浏览器、构建任务争用资源；收集命令、版本、退出码、stderr/日志、进程/端口、磁盘/内存/OOM、权限及相关设备状态；区分进程退出、连接未就绪、系统未启动、应用安装/启动失败。依据证据逐项选择不同的最小恢复方案，并验证恢复后的真实功能，不按固定次数机械重试。
- **保护现场与密钥**：优先只读诊断、冷启动/禁用快照、兼容渲染或隔离临时环境等非破坏性手段；不得未经核实抢占共享 ADB server、AVD、浏览器或工作树，不清空 userdata、不删他人 AVD、不重置共享环境、不打印/复制密钥、不强推或绕过安全门禁。涉及系统级修改须符合用户已有授权及最小影响原则。
- **BLOCKED 的证据门槛**：只有确认硬件、权限、资源、外部服务、安全限制或不可安全修复的实际阻断，才标记 `ENVIRONMENT_BLOCKED`，附已尝试的互不重复方案、日志/退出码、已排除原因、剩余根因、Owner 和可执行恢复步骤；否则保持 `DIAGNOSING`。受峰时或截止限制应标 `DEFERRED`，不伪称永久阻断。
- **隔离与持续推进**：环境故障期间继续其他合法、不冲突任务；恢复后重跑受影响的最小真实验证。环境修复成功、CI PASS 或 APK 构建成功均不得代替 Android AVD/真机、Web 真实浏览器、Wiki 线上功能等各自的实际验收。
