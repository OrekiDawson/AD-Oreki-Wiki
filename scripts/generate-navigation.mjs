import fs from "node:fs"
import path from "node:path"
import { comparePageRoutes, createNavigationCallbacks } from "./navigation-runtime.mjs"

const root = process.cwd()
const contentRoot = path.join(root, "content")
const generated = new Set(["all-entries.md"])
const model = JSON.parse(fs.readFileSync(path.join(root, "scripts/navigation-model.json"), "utf8"))
const { filterNode } = createNavigationCallbacks(model)
const configText = fs.readFileSync(path.join(root, "quartz.config.yaml"), "utf8")
const pageTitleMatch = configText.match(
  /^\s*pageTitle:\s*(?:"([^"\r\n]*)"|'([^'\r\n]*)'|([^#\r\n]*?))\s*(?:#.*)?$/m,
)
const pageTitle = (pageTitleMatch?.[1] ?? pageTitleMatch?.[2] ?? pageTitleMatch?.[3])?.trim() ?? "反物质维度 MOD Wiki"

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (
        ["ai-drafts", "developer/history"].includes(
          path.relative(contentRoot, full).replaceAll("\\", "/"),
        )
      )
        return []
      return walk(full)
    }
    return entry.name.endsWith(".md") ? [full] : []
  })
}

function frontmatter(file) {
  const text = fs.readFileSync(file, "utf8")
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const titleMatch = match?.[1].match(
    /^title:\s*(?:"([^"\r\n]*)"|'([^'\r\n]*)'|([^#\r\n]*?))\s*(?:#.*)?$/m,
  )
  const title = (titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3])?.trim()
  const archive = /^archive:\s*(?:true|"true"|'true')\s*(?:#.*)?$/mi.test(match?.[1] ?? "")
  return { title: title || path.basename(file, ".md"), archive, text }
}

function route(file) {
  const rel = path.relative(contentRoot, file).replaceAll("\\", "/").replace(/\.md$/, "")
  if (rel === "index") return "/"
  return rel.endsWith("/index") ? `/${rel.slice(0, -6)}` : `/${rel}`
}

const pages = walk(contentRoot)
  .filter((file) => !generated.has(path.basename(file)))
  .map((file) => ({ file, route: route(file), ...frontmatter(file) }))
  .filter(page => !page.archive && filterNode({ slug: page.route.slice(1), data: {} }))
  .sort((a, b) => comparePageRoutes(model, a, b))

const groups = new Map([
    [
      "玩家专区",
      pages.filter((page) => page.route === "/player" || page.route.startsWith("/player/")),
    ],
    [
      "开发者专区",
      pages.filter((page) => page.route === "/developer" || page.route.startsWith("/developer/")),
    ],
  [
    "站务与公共页面",
    pages.filter(
      (page) =>
        page.route !== "/player" &&
        !page.route.startsWith("/player/") &&
        page.route !== "/developer" &&
        !page.route.startsWith("/developer/"),
    ),
  ],
])

const lines = [
  "---",
  'title: "全部条目"',
  `description: "按主题与中文标题浏览 ${pageTitle} 的 ${pages.length} 个正式条目"`,
  "tags:",
  "  - 导航",
  "  - 索引",
  "---",
  "",
  `这里列出当前公开发布的 **${pages.length}** 个正式条目。草稿、内部归档、兼容入口和重定向不计入索引。`,
  "",
]
for (const [name, entries] of groups) {
  lines.push(`## ${name}`, "")
  for (const page of entries) lines.push(`- [${page.title}](${page.route})`)
  lines.push("")
}
fs.writeFileSync(path.join(contentRoot, "all-entries.md"), `${lines.join("\n")}\n`)

console.log(
  JSON.stringify({
    formalPages: pages.length,
    generated: ["all-entries.md"],
  }),
)
