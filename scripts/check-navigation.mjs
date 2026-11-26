import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"

const root = process.cwd()
const content = path.join(root, "content")
const errors = []
const gitTimes = new Map()
try {
  let timestamp = 0
  const history = execFileSync("git", ["log", "--format=%ct", "--name-only", "--", "content"], {
    encoding: "utf8",
  })
  for (const line of history.split(/\r?\n/)) {
    if (/^\d+$/.test(line)) timestamp = Number(line)
    else if (line && timestamp && !gitTimes.has(line.replaceAll("\\", "/")))
      gitTimes.set(line.replaceAll("\\", "/"), timestamp)
  }
} catch {}
const updatedAt = (file) => {
  return (
    gitTimes.get(path.relative(root, file).replaceAll("\\", "/")) ??
    Math.floor(fs.statSync(file).mtimeMs / 1000)
  )
}
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : entry.name.endsWith(".md") ? [full] : []
  })
const files = walk(content)
if (files.some((file) => file.includes(`${path.sep}developer${path.sep}history${path.sep}`))) {
  errors.push("内部历史归档仍位于 content/developer/history，禁止进入公开构建")
}
const developerIndex = fs.readFileSync(path.join(content, "developer/index.md"), "utf8")
for (const alias of ["/history", "/developer/history"])
  if (!developerIndex.includes(`\"${alias}\"`))
    errors.push(`历史兼容入口缺少明确 alias：${alias}`)
const allEntries = fs.readFileSync(path.join(content, "all-entries.md"), "utf8")
const formal = files.filter(
  (file) =>
    !file.includes(`${path.sep}ai-drafts${path.sep}`) &&
    !file.endsWith(`${path.sep}all-entries.md`) &&
    !file.endsWith(`${path.sep}recent-updates.md`),
)
const routeFor = (file) => {
  const rel = path.relative(content, file).replaceAll("\\", "/").replace(/\.md$/, "")
  return rel.endsWith("/index") ? `/${rel.slice(0, -6)}` : `/${rel}`
}
for (const file of formal)
  if (!allEntries.includes(`](${routeFor(file)})`))
    errors.push(`正式页面未进入全部条目索引：${routeFor(file)}`)
const declaredCount = Number(
  allEntries.match(/当前公开发布的 \*\*(\d+)\*\* 个正式条目/)?.[1] ?? NaN,
)
if (declaredCount !== formal.length)
  errors.push(`全部条目数量过期：页面 ${formal.length}，索引声明 ${declaredCount}`)
const indexedRoutes = [...allEntries.matchAll(/\]\((\/[^)]+)\)/g)].map((match) =>
  match[1].replace(/\/$/, ""),
)
if (new Set(indexedRoutes).size !== formal.length)
  errors.push(`全部条目存在重复或额外入口：${new Set(indexedRoutes).size}/${formal.length}`)
const recentText = fs.readFileSync(path.join(content, "recent-updates.md"), "utf8")
const recentRoutes = [...recentText.matchAll(/\]\((\/[^)]+)\)/g)].map((match) =>
  match[1].replace(/\/$/, ""),
)
const formalRoutes = new Set(formal.map(routeFor))
if (recentRoutes.length !== 24)
  errors.push(`最近更新索引条目数应为 24，实际为 ${recentRoutes.length}`)
if (new Set(recentRoutes).size !== recentRoutes.length) errors.push("最近更新索引存在重复入口")
for (const route of recentRoutes)
  if (!formalRoutes.has(route)) errors.push(`最近更新索引包含非正式页面：${route}`)
const expectedRecentRoutes = formal
  .map((file) => ({ route: routeFor(file), updatedAt: updatedAt(file) }))
  .sort((a, b) => b.updatedAt - a.updatedAt || a.route.localeCompare(b.route))
  .slice(0, 24)
  .map((page) => page.route)
if (recentRoutes.some((route, index) => route !== expectedRecentRoutes[index]))
  errors.push("最近更新索引与页面更新时间不一致，请运行 node scripts/generate-navigation.mjs")
const config = fs.readFileSync(path.join(root, "quartz.config.yaml"), "utf8")
const yamlScalar = (name) => {
  const match = config.match(
    new RegExp(
      `^\\s*${name}:\\s*(?:"([^"\\r\\n]*)"|'([^'\\r\\n]*)'|([^#\\r\\n]*?))\\s*(?:#.*)?$`,
      "m",
    ),
  )
  return (match?.[1] ?? match?.[2] ?? match?.[3])?.trim()
}
if (yamlScalar("folderDefaultState") !== "open") errors.push("Explorer 未设置正式分类与条目默认展开")
if (yamlScalar("folderClickBehavior") !== "link") errors.push("Explorer 未启用独立展开按钮行为")
const orderedExplorer = fs.readFileSync(
  path.join(root, "scripts/quartz-plugins/ordered-explorer/dist/index.js"),
  "utf8",
)
if (!orderedExplorer.includes("developer/architecture") || !orderedExplorer.includes("developer/references"))
  errors.push("开发者导航缺少语义分类排序")
if (!orderedExplorer.includes("current-page-ancestors")) errors.push("导航缺少当前页面高亮定位标记")
const assetManifestPath = path.join(root, "docs/translation/original-image-manifest.json")
if (!fs.existsSync(assetManifestPath)) errors.push("缺少原版译文图片来源清单")
else {
  const assets = JSON.parse(fs.readFileSync(assetManifestPath, "utf8"))
  for (const page of assets.pages ?? [])
    for (const image of page.images ?? []) {
      if (image.local_path && !fs.existsSync(path.join(root, image.local_path)))
        errors.push(`图片资源不存在：${image.local_path}`)
      if (image.local_path && (!image.license || !image.attribution))
        errors.push(`图片缺少许可证或署名：${image.local_path}`)
    }
}
if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log(
  JSON.stringify({
    formalPages: formal.length,
    indexedPages: formal.length,
    orphanedPages: 0,
    historyPagesInContent: 0,
  }),
)
