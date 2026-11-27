import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const built = process.argv[2] === "--built"
const publicDir = path.resolve(root, process.argv[3] || "public")
const errors = []
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name)
  return entry.isDirectory() ? walk(full) : [full]
})
const routeFor = (file) => {
  const rel = path.relative(path.join(root, "content"), file).replaceAll("\\", "/").replace(/\.md$/, "")
  if (rel === "index") return "/"
  return "/" + (rel.endsWith("/index") ? rel.slice(0, -6) : rel)
}
const scalar = (text, name) => text.match(new RegExp(`^${name}:\\s*(?:"([^"]*)"|'([^']*)'|([^#\\r\\n]*?))\\s*(?:#.*)?$`, "mi"))?.slice(1).find(Boolean)?.trim() ?? ""
const contentFiles = fs.existsSync(path.join(root, "content"))
  ? walk(path.join(root, "content")).filter((file) => file.endsWith(".md") && !file.split(path.sep).includes("ai-drafts"))
  : []
const allRoutes = new Set(contentFiles.map(routeFor))
const archived = []
for (const file of contentFiles) {
  const text = fs.readFileSync(file, "utf8")
  if (!/^(?:true|"true"|'true')$/i.test(scalar(text, "archive"))) continue
  const route = routeFor(file)
  const replacement = scalar(text, "replaced_by")
  if (replacement) {
    const target = "/" + replacement.replace(/^\/+/, "").replace(/\/$/, "")
    if (!allRoutes.has(target)) errors.push(`归档替代目标不存在：${route} -> ${target}`)
  }
  archived.push({ file, route })
}
const normalize = (value) => {
  try { return new URL(value, "https://wiki.oreki.net").pathname.replace(/\/$/, "") || "/" }
  catch { return value.split("#")[0].replace(/\/$/, "") || "/" }
}
const archivedRoutes = new Set(archived.map((item) => normalize(item.route)))
if (fs.existsSync(path.join(root, "content", "all-entries.md"))) {
  const indexText = fs.readFileSync(path.join(root, "content", "all-entries.md"), "utf8")
  for (const route of archivedRoutes)
    if (indexText.split("\n").some((line) => normalize(line.match(/\]\((\/[^)#]+(?:#[^)]*)?)\)/)?.[1] || "") === route))
      errors.push(`归档页面进入全部条目索引：${route}`)
}
if (built) {
  if (!fs.existsSync(publicDir)) errors.push(`构建目录不存在：${publicDir}`)
  else {
    const htmlFiles = walk(publicDir).filter((file) => file.endsWith(".html"))
    for (const item of archived) {
      const rel = item.route === "/" ? "index.html" : path.join(item.route.slice(1), "index.html")
      if (fs.existsSync(path.join(publicDir, rel))) errors.push(`归档页面生成公开 HTML：${item.route}`)
    }
    for (const file of [path.join(publicDir, "static", "contentIndex.json"), path.join(publicDir, "sitemap.xml"), path.join(publicDir, "index.xml"), path.join(publicDir, "rss.xml")]) if (fs.existsSync(file)) {
      const text = fs.readFileSync(file, "utf8")
      for (const route of archivedRoutes) if (text.split(/\r?\n/).some((line) => normalize(line.match(/https?:\/\/[^<"']+|\/(?:[^\s<"']*)/i)?.[0] || "") === route))
        errors.push(`归档页面进入公开索引：${route} -> ${path.relative(publicDir, file)}`)
    }
    for (const file of htmlFiles) {
      const text = fs.readFileSync(file, "utf8")
      for (const match of text.matchAll(/\bhref=(?:"([^"]+)"|'([^']+)')/gi)) {
        const href = match[1] ?? match[2]
        if (archivedRoutes.has(normalize(href))) errors.push(`公开页面泄露归档入口：${path.relative(publicDir, file)} -> ${href}`)
      }
    }
  }
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1) }
console.log(`OK 归档隔离检查通过：${archived.length} 个归档源文件${built ? "，含构建产物" : ""}`)
