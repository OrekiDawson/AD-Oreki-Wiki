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
const config = fs.readFileSync(path.join(root, "quartz.config.yaml"), "utf8")
const configuredBase = scalar(config.split("\n").map(line => line.trimStart()).join("\n"), "baseUrl")
if (!configuredBase) throw new Error("quartz.config.yaml 缺少 baseUrl")
const siteBase = new URL("https://" + configuredBase.replace(/^https?:\/\//, "").replace(/\/+$/, "") + "/")
const normalize = (value, base = siteBase) => {
  try {
    const url = new URL(value, base)
    if (url.origin !== siteBase.origin || !url.pathname.startsWith(siteBase.pathname)) return null
    return "/" + decodeURI(url.pathname.slice(siteBase.pathname.length)).replace(/\/+$/, "")
  } catch { return null }
}
const normalizeSlug = slug => "/" + slug.replace(/^\/+/, "").replace(/(?:^|\/)index$/, "").replace(/\/+$/, "")
const xmlRoutes = text => [...text.matchAll(/<(loc|link|guid)(?:\s[^>]*)?>([^<]+)<\/\1>/gi)]
  .map(([, , url]) => normalize(url.trim()))
// 同一归档路由在源文件、JSON slug 和 URL 中必须一致；不同站点及更长路由不能误判。
const probe = "归档/中文条目"
const probeRoute = "/" + probe
const probeUrl = new URL(probe, siteBase)
if (normalize(probeUrl.href) !== probeRoute ||
    normalize(probe, siteBase) !== probeRoute ||
    normalizeSlug(probe) !== probeRoute ||
    normalize(new URL(probe + "/child", siteBase).href) === probeRoute ||
    normalize(new URL(probe, "https://example.invalid/").href) !== null)
  throw new Error("归档路由与 baseUrl 归一化一致性检查失败")
const archivedRoutes = new Set(archived.map(item => item.route))
if (fs.existsSync(path.join(root, "content", "all-entries.md"))) {
  const indexText = fs.readFileSync(path.join(root, "content", "all-entries.md"), "utf8")
  for (const route of archivedRoutes)
    if ([...indexText.matchAll(/\]\((\/[^)#]+(?:#[^)]*)?)\)/g)].some(([, href]) => normalize(href, siteBase) === route))
      errors.push(`归档页面进入全部条目索引：${route}`)
}
if (built) {
  if (!fs.existsSync(publicDir)) errors.push(`构建目录不存在：${publicDir}`)
  else {
    const htmlFiles = walk(publicDir).filter((file) => file.endsWith(".html"))
    for (const item of archived) {
      const candidates = item.route === "/" ? ["index.html"] : [item.route.slice(1) + ".html", path.join(item.route.slice(1), "index.html")]
      if (candidates.some(rel => fs.existsSync(path.join(publicDir, rel)))) errors.push(`归档页面生成公开 HTML：${item.route}`)
    }
    for (const file of [path.join(publicDir, "static", "contentIndex.json"), path.join(publicDir, "sitemap.xml"), path.join(publicDir, "index.xml"), path.join(publicDir, "rss.xml")]) if (fs.existsSync(file)) {
      const text = fs.readFileSync(file, "utf8")
      const routes = new Set(file.endsWith(".json") ? Object.keys(JSON.parse(text)).map(normalizeSlug) : xmlRoutes(text))
      for (const route of archivedRoutes) if (routes.has(route))
        errors.push(`归档页面进入公开索引：${route} -> ${path.relative(publicDir, file)}`)
    }
    for (const file of htmlFiles) {
      const text = fs.readFileSync(file, "utf8")
      const rel = path.relative(publicDir, file).replaceAll("\\", "/")
      const pageUrl = new URL(rel.replace(/(?:^|\/)index\.html$/, "/").replace(/^\//, "").replace(/\.html$/, ""), siteBase)
      for (const match of text.matchAll(/\bhref=(?:"([^"]+)"|'([^']+)')/gi)) {
        const href = match[1] ?? match[2]
        if (archivedRoutes.has(normalize(href, pageUrl))) errors.push(`公开页面泄露归档入口：${path.relative(publicDir, file)} -> ${href}`)
      }
    }
  }
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1) }
console.log(`OK 归档隔离检查通过：${archived.length} 个归档源文件${built ? "，含构建产物" : ""}`)
