#!/usr/bin/env node
// 知识库内容检查（轻量、可机器判断）：
//   1) frontmatter 合法（--- 闭合、title/description/tags）
//   2) 标题与页面类型一致（规则页命名空间、普通条目不加前缀、分类页中文标题）
//   3) 内部 [[链接]] 可达
//   4) 敏感信息与私有路径扫描
//   5) 未审核 AI 草稿隔离（不得被正式条目引用、必须带待审标记）
//   6) 反日志化：普通条目不得用 R 轮次/日期章节充当正文，必须有主题导语
//   7) 内部历史归档不得进入 content/；公开版本历史另行按百科内容审核
//   8) 非历史条目不得带「历史」标签、标题不得以 R 编号或日期开头
//   9) 标题唯一（防止同一事实复制成多页）
//  10) 关键检索术语仍存在（不破坏既有搜索）
// 规则的权威文本在 content/wiki-rules.md；本脚本只覆盖可机器判断的部分。
import fs from "node:fs"
import path from "node:path"

const ROOT = "content"
const RULE_PAGE_TITLE = "反物质维度MOD Wiki:知识库规则"
const RULE_PAGE = "content/wiki-rules.md"
const POLICY_PAGE = "content/wiki-not.md"
const POLICY_PAGE_TITLE = "反物质维度MOD Wiki:本站不是什么"
const DRAFT_DIR = "content/ai-drafts/"
const PLAYER_DIR = "content/player/"
const DEVELOPER_DIR = "content/developer/"
const CATEGORY_DIRS = [
  "content/player/",
  "content/player/getting-started/",
  "content/player/gameplay/",
  "content/player/original/",
  "content/player/mods/",
  "content/player/download-and-version/",
  "content/player/faq/",
  "content/developer/",
  "content/developer/architecture/",
  "content/developer/reverse-engineering/",
  "content/developer/build/",
  "content/developer/current/",
  "content/developer/troubleshooting/",
  "content/developer/references/",
  "content/developer/evidence/",
  "content/developer/ai-summaries/",
]
const REQUIRED_TERMS = ["永恒挑战", "自动购买器", "AGP", "Kotlin", "Lai Tela", "build_mod.py"]
const MIN_PAGES = 15
const SECRET_PATTERNS = [
  /cfat_[A-Za-z0-9]{20,}/g,
  /ghp_[A-Za-z0-9]{20,}/g,
  /github_pat_[A-Za-z0-9_]{20,}/g,
  /sk-[A-Za-z0-9]{20,}/g,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
]
const PRIVATE_PATHS = [/\/home\/oreki\//g, /\/opt\/node-v/g]
// 反日志化：R 轮次作为章节标题、日期流水账章节、Release Notes 章节。
const CHANGELOG_HEADING =
  /^#{2,4}[ \t]+(?:R\d{2,3}(?:-\d{1,2})?|第?\s*R?\d{2,3}\s*轮|\d{4}-\d{2}-\d{2}|Release Notes)/m
const ROUND_LEAD_TITLE = /^(?:R\d{2,3}(?:-\d{1,2})?|\d{4}-\d{2}-\d{2})/
const CJK = /[\u4e00-\u9fff]/

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

function frontmatterOf(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return null
  const body = match[1]
  const scalar = (name) => {
    const value = body.match(
      new RegExp(
        `^${name}:\\s*(?:"([^"\\r\\n]*)"|'([^'\\r\\n]*)'|([^#\\r\\n]*?))\\s*(?:#.*)?$`,
        "m",
      ),
    )
    return (value?.[1] ?? value?.[2] ?? value?.[3])?.trim() ?? ""
  }
  const title = scalar("title")
  const description = scalar("description")
  const tagsBlock = body.match(/^tags:\n((?:[ \t]+-[ \t]+.*\n?)*)/m)?.[1] ?? ""
  const tags = (tagsBlock.match(/^[ \t]+-[ \t]+(.*)$/gm) || []).map((line) =>
    line
      .replace(/^[ \t]+-[ \t]+/, "")
      .trim()
      .replace(/^["']|["']$/g, ""),
  )
  return { title, description, tags, raw: body }
}

const files = walk(ROOT)
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replaceAll("\\", "/"))
  .sort()
let failed = 0
const fail = (msg) => {
  failed += 1
  console.error("FAIL " + msg)
}

if (!fs.existsSync(RULE_PAGE)) fail("网站根目录缺少公开知识库规则页 content/wiki-rules.md")
if (!fs.existsSync(POLICY_PAGE)) fail("网站根目录缺少公开内容边界方针 content/wiki-not.md")
if (!fs.existsSync("content/copyright.md")) fail("网站根目录缺少版权与许可页面")
if (!fs.existsSync("LICENSE-CONTENT.md")) fail("缺少 CC BY-SA 4.0 原创内容许可说明")
if (!fs.existsSync(PLAYER_DIR + "index.md")) fail("缺少玩家专区首页 content/player/index.md")
if (!fs.existsSync(DEVELOPER_DIR + "index.md"))
  fail("缺少开发者专区首页 content/developer/index.md")
if (!fs.existsSync(DEVELOPER_DIR + "ai-summaries/index.md")) {
  fail("缺少开发者 AI Summary 索引 content/developer/ai-summaries/index.md")
}
for (const dir of CATEGORY_DIRS) {
  const index = dir + "index.md"
  if (!fs.existsSync(index)) fail("分类目录缺少中文类目页（index.md 提供显示名）: " + dir)
}
if (files.length < MIN_PAGES) fail("页面数不足: " + files.length + " < " + MIN_PAGES)

const slugs = new Set(files.map((f) => path.basename(f, ".md")))
const allText = files.map((f) => fs.readFileSync(f, "utf8")).join("\n")
const titleOwners = new Map()

for (const f of files) {
  const text = fs.readFileSync(f, "utf8")
  const isDraft = f.startsWith(DRAFT_DIR)
  const isPlayer = f.startsWith(PLAYER_DIR)
  const isRule = f === RULE_PAGE
  const isPolicy = f === POLICY_PAGE
  const isIndex = path.basename(f) === "index.md"
  const isCategoryIndex = isIndex && CATEGORY_DIRS.includes(path.dirname(f) + "/")
  const fm = frontmatterOf(text)

  if (!fm) {
    fail("缺少或未闭合的 frontmatter: " + f)
    continue
  }
  if (!fm.title) fail("缺少 title: " + f)
  if (!fm.description) fail("缺少 description: " + f)
  if (!fm.tags.length) fail("缺少 tags: " + f)

  // 标题与页面类型
  if (fm.title) {
    if (isRule || isPolicy) {
      const expectedTitle = isRule ? RULE_PAGE_TITLE : POLICY_PAGE_TITLE
      if (fm.title !== expectedTitle) fail("正式规则或方针页标题必须为 " + expectedTitle + ": " + f)
    } else if (!isDraft) {
      if (fm.title.startsWith("反物质维度MOD Wiki:"))
        fail("普通条目标题不应带规则页命名空间前缀: " + f)
      if (ROUND_LEAD_TITLE.test(fm.title)) {
        fail("专题条目标题不应以 R 轮次或日期开头（时间性材料请移出 content/，放入仓库内部归档目录）: " + f)
      }
      if (!CJK.test(fm.title)) fail("条目标题应使用简体中文: " + f)
    }
    if (!isDraft) {
      const key = fm.title.toLowerCase()
      if (titleOwners.has(key))
        fail("标题重复（同一事实应更新原条目）: " + f + " 与 " + titleOwners.get(key))
      else titleOwners.set(key, f)
    }
  }

  // 分类页标题必须是中文
  if (isCategoryIndex && !CJK.test(fm.title)) fail("分类页 title 必须是简体中文类目名: " + f)

  // 内部历史材料不得进入 content/；公开条目不使用历史归档标签。
  if (!isDraft) {
    if (fm.tags.includes("历史"))
      fail("正式条目不应带「历史」标签；时间性材料请移出 content/，放入仓库内部归档目录: " + f)
  }

  // 内部链接
  for (const m of text.matchAll(/\[\[([^\]|#]+)/g)) {
    const target = m[1].trim()
    if (target.startsWith("http")) continue
    if (!slugs.has(target)) fail("内部链接失效: " + f + " -> " + target)
    const draftSlug = path.basename(DRAFT_DIR.replace(/\/$/, "")) + "/"
    if (target.startsWith(draftSlug) || text.includes("[[" + DRAFT_DIR)) {
      fail("正式条目不应直接引用未审核 AI 草稿: " + f)
    }
  }
  // 正式条目不得把 ai-drafts 当作来源链接
  if (!isDraft && /\]\([^)]*ai-drafts[^)]*\)/.test(text))
    fail("正式条目不应链接未审核 AI 草稿: " + f)

  // 未审核草稿标记
  if (isDraft) {
    if (!/待人工审核|AI 草稿/.test(text)) fail("AI 草稿必须标注「待人工审核 / AI 草稿」: " + f)
  }

  // AI Summary 只属于开发者专区；玩家正文不得嵌入机器摘要。
  if (isPlayer && /AI\s*Summary|AI 摘要/i.test(text)) {
    fail("玩家专区不得出现 AI Summary: " + f)
  }

  // 反日志化：专题条目（非草稿、非首页/规则/版权/分类页）
  const isGeneratedIndex = f === "content/all-entries.md" || f === "content/recent-updates.md"
  const isTopic =
    !isDraft &&
    !isIndex &&
    !isRule &&
    !isGeneratedIndex &&
    f !== "content/copyright.md"
  if (isTopic) {
    const bodyAfterFront = text.replace(/^---\n[\s\S]*?\n---\n?/, "")
    const beforeFirstHeading = bodyAfterFront.split(/\n#{2,4}[ \t]/)[0] || ""
    const introLines = beforeFirstHeading
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"))
    if (introLines.length === 0) {
      fail("专题条目缺少主题导语（正文开头需说明主题与阅读价值）: " + f)
    }
    if (CHANGELOG_HEADING.test(text)) {
      fail("专题条目出现 R 轮次/日期/Release Notes 式章节；时间性材料请移出 content/，放入仓库内部归档目录: " + f)
    }
    if (!/https?:\/\//.test(text) && !/源码定位：/.test(text)) fail("专题条目缺少可追溯的原始来源或源码定位: " + f)
  }

  for (const re of SECRET_PATTERNS)
    if (re.test(text)) fail("疑似敏感信息: " + f + " / " + re.source)
  for (const re of PRIVATE_PATHS) if (re.test(text)) fail("内部路径泄露: " + f + " / " + re.source)
}

for (const term of REQUIRED_TERMS) if (!allText.includes(term)) fail("缺少检索术语: " + term)

const playerHome = "content/player/index.md"
const developerHome = "content/developer/index.md"
const rootHome = "content/index.md"
for (const file of [playerHome, developerHome, rootHome]) {
  const text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""
  if (!text.includes("player") || !text.includes("developer")) {
    fail("双专区首页必须同时链接 /player/ 与 /developer/: " + file)
  }
}

const aiIndex = "content/developer/ai-summaries/index.md"
if (fs.existsSync(aiIndex)) {
  const text = fs.readFileSync(aiIndex, "utf8")
  if (!text.includes("<details>") || !text.includes("审核日期")) {
    fail("开发者 AI Summary 索引缺少默认折叠或审核标识: " + aiIndex)
  }
}

if (failed > 0) {
  console.error("内容检查未通过: " + failed + " 项")
  process.exit(1)
}
console.log(
  "OK 内容检查通过: " + files.length + " 页；frontmatter/链接/敏感信息/反日志化/历史归档分类均通过",
)
