import fs from "node:fs"
import path from "node:path"
import { ORIGINAL_NAMESPACE, ORIGINAL_ROUTE_PREFIX } from "./wiki-paths.mjs"

const root = process.cwd()
const contentRoot = path.join(root, "content")
const builtOnly = process.argv[2] === "--built"
const modelPath = path.join(root, "scripts/navigation-model.json")
const exceptionsPath = path.join(root, "scripts/title-exceptions.json")
if (!fs.existsSync(modelPath)) {
  console.error(JSON.stringify({ violations: [{ kind: "MISSING_MODEL", file: modelPath, line: 1, title: "", actual: 0, limit: 0 }] }, null, 2))
  process.exit(1)
}
const navigationModel = JSON.parse(fs.readFileSync(modelPath, "utf8"))
const exceptions = fs.existsSync(exceptionsPath) ? JSON.parse(fs.readFileSync(exceptionsPath, "utf8")) : {}
const violations = []
const seen = new Map()
const usedExceptions = new Set()

const width = (value) => [...value].reduce((sum, char) => sum + (/^[\x00-\x7f]$/.test(char) ? 0.5 : 1), 0)
const routeFor = (file, base = contentRoot) => {
  const rel = path.relative(base, file).replaceAll("\\", "/").replace(/\.md$/, "")
  return rel === "index" ? "/" : rel.endsWith("/index") ? `/${rel.slice(0, -6)}` : `/${rel}`
}
const isTask = (route) => /\/(getting-started|faq|troubleshooting|guides)(?:\/|$)/.test(route)
const categoryRoutes = new Set([
  "/player", "/player/download-and-version", "/player/gameplay", "/player/mods", "/player/faq",
  "/player/terminology", "/player/original", "/developer", "/developer/architecture",
  "/developer/reverse-engineering", "/developer/build", "/developer/troubleshooting",
  "/developer/current", "/developer/references",
])
const limitFor = (kind, route) => {
  if (kind === "NAV" || kind === "SIDEBAR") return kind === "NAV" ? 8 : 12
  if (kind === "H1") return categoryRoutes.has(route) ? 8 : isTask(route) ? 20 : 16
  return kind === "H2" ? 12 : 16
}
const bareOriginalTitle = (title, route) => route.startsWith(ORIGINAL_ROUTE_PREFIX) ? title.replace(/^原版:/, "") : title
const record = ({ kind, route, file, line, title }) => {
  const actual = width(title)
  const limit = limitFor(kind, route)
  const key = `${kind}:${route}:${line}`
  if (exceptions[key]) {
    usedExceptions.add(key)
    if (!exceptions[key].reason) violations.push({ kind: "INVALID_EXCEPTION", route, file, line, title, actual, limit })
    return
  }
  if (actual > limit) violations.push({ kind, route, file, line, title, actual, limit })
  if (kind === "H1") {
  // 原版译文拥有独立命名空间：其中文标题可以与玩家专区原创机制页相同，
  // 但同一命名空间内仍必须保持唯一，避免把命名空间例外变成重复标题豁免。
  const duplicateKey = route.startsWith(ORIGINAL_ROUTE_PREFIX) ? `${ORIGINAL_NAMESPACE}${title}` : title
  const owner = seen.get(duplicateKey)
  if (owner) violations.push({ kind: "DUPLICATE_H1", route, file, line, title, actual, limit, duplicate: owner })
  else seen.set(duplicateKey, route)
  }
}
const walk = (dir, extension = ".md", base = contentRoot) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name)
  if (entry.isDirectory()) {
    const rel = path.relative(base, full).replaceAll("\\", "/")
    if (base === contentRoot && (rel === "ai-drafts" || rel === "developer/history")) return []
    return walk(full, extension, base)
  }
  return entry.name.endsWith(extension) ? [full] : []
})
const frontmatterTitle = (text) => text.match(/^title:[ \t]*(?:"([^"]*)"|'([^']*)'|([^#\r\n][^#\r\n]*?))[ \t]*(?:#.*)?$/m)?.slice(1).find(Boolean)?.trim() ?? ""

for (const file of walk(contentRoot)) {
  const text = fs.readFileSync(file, "utf8")
  const route = routeFor(file)
  const relative = path.relative(root, file).replaceAll("\\", "/")
  const title = bareOriginalTitle(frontmatterTitle(text), route)
  if (title) record({ kind: "H1", route, file: relative, line: 2, title })
  let fence = false
  text.split(/\r?\n/).forEach((line, index) => {
    if (/^\s*```/.test(line)) { fence = !fence; return }
    if (fence) return
    const heading = line.match(/^(#{2,4})\s+(.+?)\s*#*\s*$/)
    if (heading) record({ kind: `H${heading[1].length}`, route, file: relative, line: index + 1, title: heading[2] })
  })
}

for (const rules of Object.values(navigationModel.categories ?? {})) for (const rule of rules) {
  record({ kind: "NAV", route: rule.route ?? `/${rule.key}`, file: "scripts/navigation-model.json", line: 1, title: rule.label })
}
for (const label of Object.values(navigationModel.folderLabels ?? {}))
  record({ kind: "SIDEBAR", route: "(explorer)", file: "scripts/navigation-model.json", line: 1, title: label })
for (const key of Object.keys(exceptions)) if (!usedExceptions.has(key))
  violations.push({ kind: "STALE_EXCEPTION", route: "(exception)", file: exceptionsPath, line: 1, title: key, actual: 0, limit: 0 })

if (builtOnly) {
  const publicDir = path.resolve(root, process.argv[3] || "public")
  const htmlFiles = fs.existsSync(publicDir) ? walk(publicDir, ".html", publicDir) : []
  if (!htmlFiles.length) violations.push({ kind: "MISSING_BUILT_HTML", route: "(build)", file: publicDir, line: 1, title: "", actual: 0, limit: 0 })
  for (const file of htmlFiles) {
    const rel = path.relative(publicDir, file).replaceAll("\\", "/")
    const route = rel === "index.html" ? "/" : `/${rel.replace(/\/index\.html$/, "").replace(/\.html$/, "")}`
    // 标签页保留 URL 和元数据，但属于 Quartz 自动生成的辅助索引；
    // 不把其重复的文章标题当作公开条目的 H1-H4 违规。
    if (route === "/tags" || route.startsWith("/tags/")) continue
    const html = fs.readFileSync(file, "utf8")
    for (const match of html.matchAll(/<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
      const kind = `H${match[1]}`
      const title = match[2].replace(/<[^>]+>/g, "").replace(/&(?:amp|lt|gt|quot|#39);/g, " ").trim()
      const actual = width(title)
      const limit = limitFor(kind, route)
      if (actual > limit) violations.push({ kind: `BUILT_${kind}`, route, file: `public/${rel}`, line: 1, title, actual, limit })
    }
  }
}

if (violations.length) {
  console.error(JSON.stringify({ violations }, null, 2))
  process.exit(1)
}
console.log(JSON.stringify({ pages: seen.size, exceptions: Object.keys(exceptions).length, status: "PASS" }))
