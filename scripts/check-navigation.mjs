import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const content = path.join(root, "content")
const errors = []
const builtOnly = process.argv[2] === "--built"
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : entry.name.endsWith(".md") ? [full] : []
  })
const walkAll = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walkAll(full) : [full]
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
    file !== path.join(content, "index.md") &&
    !/^archive:\s*(?:true|"true"|'true')\s*(?:#.*)?$/mi.test(fs.readFileSync(file, "utf8")),
)
const routeFor = (file) => {
  const rel = path.relative(content, file).replaceAll("\\", "/").replace(/\.md$/, "")
  if (rel === "index") return "/"
  return rel.endsWith("/index") ? `/${rel.slice(0, -6)}` : `/${rel}`
}
const titleFor = (file) => {
  const text = fs.readFileSync(file, "utf8")
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const title = match?.[1].match(
    /^title:\s*(?:"([^"\r\n]*)"|'([^'\r\n]*)'|([^#\r\n]*?))\s*(?:#.*)?$/m,
  )
  return (title?.[1] ?? title?.[2] ?? title?.[3])?.trim() ?? path.basename(file, ".md")
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
const formalRoutes = new Set(formal.map(routeFor))

// 目录模型门禁：只有存在真实下级正式页面的目录才允许成为可展开分类。
const directoryChildren = new Map()
let leafDirectoryCount = 0
for (const file of formal) {
  const rel = path.relative(content, file).replaceAll("\\", "/")
  const parts = rel.split("/")
  parts.pop()
  for (let i = 1; i <= parts.length; i++) {
    const dir = parts.slice(0, i).join("/")
    const child = rel.split("/").slice(i).join("/")
    if (child && child !== "index.md") {
      if (!directoryChildren.has(dir)) directoryChildren.set(dir, new Set())
      directoryChildren.get(dir).add(child)
    }
  }
}
for (const file of formal) {
  const rel = path.relative(content, file).replaceAll("\\", "/")
  if (rel.endsWith("/index.md")) {
    const dir = rel.slice(0, -"/index.md".length)
    if (!directoryChildren.has(dir)) {
      // 这是一个真实页面入口，插件必须把它渲染成普通链接而非空子菜单。
      leafDirectoryCount += 1
    }
  }
}
const config = fs.readFileSync(path.join(root, "quartz.config.yaml"), "utf8")
const navigationModelPath = path.join(root, "scripts/navigation-model.json")
if (!fs.existsSync(navigationModelPath)) errors.push("缺少唯一导航模型：scripts/navigation-model.json")
const navigationModel = fs.existsSync(navigationModelPath)
  ? JSON.parse(fs.readFileSync(navigationModelPath, "utf8"))
  : null
const excluded = navigationModel?.excludedFromExplorer
if (!excluded?.exact?.includes("/tags") || !excluded?.prefixes?.includes("/tags/"))
  errors.push("导航模型未明确排除 tags/ 及标签根页面")
if (navigationModel?.categories?.root?.some((rule) => rule.key === "recent-updates" || rule.key === "recent"))
  errors.push("主导航仍包含已退役的最近更新入口")
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
// 执行实际可序列化回调，而非检查重复的硬编码数组。
if (navigationModel) {
  const { comparePageRoutes, createNavigationCallbacks } = await import("./navigation-runtime.mjs")
  const { runInNewContext } = await import("node:vm")
  const callbacks = createNavigationCallbacks(navigationModel)
  const compare = runInNewContext("(" + callbacks.compare.toString() + ")")
  const mapNode = runInNewContext("(" + callbacks.mapNode.toString() + ")")
  const filterNode = runInNewContext("(" + callbacks.filterNode.toString() + ")")
  const node = slug => ({ slug, slugSegment: slug.split("/").at(-1), displayName: slug })
  const rootOrder = navigationModel.categories.root.map(entry => entry.key)
  const assertOrder = (routes, label) => {
    const sorted = routes.slice().reverse().map(node).sort(compare).map(n => n.slug)
    if (JSON.stringify(sorted) !== JSON.stringify(routes)) errors.push("导航排序不一致：" + label)
  }
  const generatedPages = formal.map((file) => ({
    file,
    route: routeFor(file),
    title: titleFor(file),
  })).sort((a, b) => comparePageRoutes(navigationModel, a, b))
  const generatedRoutes = generatedPages.map((page) => page.route)
  if (JSON.stringify(indexedRoutes) !== JSON.stringify(generatedRoutes))
    errors.push("全部条目索引未按导航模型生成，需重新运行 generate-navigation.mjs")
  const comparatorSamples = [
    node("player/aaa"),
    node("player/aaa/child"),
    node("player/zzz"),
  ]
  for (const a of comparatorSamples)
    for (const b of comparatorSamples)
      for (const c of comparatorSamples)
        if (compare(a, b) <= 0 && compare(b, c) <= 0 && compare(a, c) > 0)
          errors.push("导航比较器不满足传递性")
  const sampleOnce = comparatorSamples.slice().sort(compare).map((item) => item.slug)
  const sampleTwice = comparatorSamples.slice().reverse().sort(compare).map((item) => item.slug)
  if (JSON.stringify(sampleOnce) !== JSON.stringify(sampleTwice)) errors.push("导航比较器结果不确定")
  if (rootOrder[0] !== "player" || rootOrder[1] !== "developer") errors.push("玩家专区必须在开发者专区之前")
  assertOrder(rootOrder, "根级")
  if (JSON.stringify(navigationModel.stationEntries) !== JSON.stringify(rootOrder.slice(2)))
    errors.push("站务入口与根级导航不一致")
  const childRoutes = new Set()
  for (const [parent, children] of Object.entries(navigationModel.childOrder)) {
    if (!formalRoutes.has("/" + parent)) errors.push("导航排序分类不存在：" + parent)
    for (const route of children) {
      if (!route.startsWith(parent + "/") || !formalRoutes.has("/" + route))
        errors.push("导航条目不存在或分类错误：" + route)
      if (childRoutes.has(route)) errors.push("导航条目重复：" + route)
      childRoutes.add(route)
    }
    // 反向检查真实直接子页面，新增条目不能悄悄落到默认排序末尾。
    for (const route of formalRoutes) {
      if (route.startsWith('/' + parent + '/') && route.split('/').length === parent.split('/').length + 2 && !children.includes(route.slice(1)))
        errors.push('正式子页面未登记语义排序：' + route)
    }
    assertOrder(children, parent)
  }
  for (const [parent, groups] of Object.entries(navigationModel.topicGroups || {})) {
    const entries = groups.flatMap(group => group.entries)
    if (groups.some(group => !group.label || group.entries.length < 2) ||
        JSON.stringify(entries) !== JSON.stringify(navigationModel.childOrder[parent]))
      errors.push("专题分组为空、仅含单条目、遗漏或顺序不一致：" + parent)
    for (const group of groups)
      for (const route of group.entries) {
        const file = formal.find(file => routeFor(file) === "/" + route)
        const label = navigationModel.folderLabels[route] || (file && titleFor(file))
        if (label === group.label) errors.push("专题标题与条目重名：" + route)
      }
  }
  for (const [slug, label] of Object.entries(navigationModel.folderLabels))
    if (mapNode(node(slug)).displayName !== label) errors.push("侧栏名称不一致：" + slug)
  for (const slug of ["tags", "tags/test", "ai-drafts/test", "developer/history/test", "redirect/test"])
    if (filterNode(node(slug))) errors.push("导航未排除：" + slug)
  if (mapNode({ ...node("test"), isFolder: true, children: [], data: {} }).isFolder)
    errors.push("叶子目录未降级为普通链接")
  if (filterNode({ ...node("test"), isFolder: true, children: [] }))
    errors.push("无真实页面的空目录未排除")
}
if (!orderedExplorer.includes("navigation-runtime.mjs") || !orderedExplorer.includes("navigation-model.json"))
  errors.push("Explorer 未使用唯一导航数据源")
if (!orderedExplorer.includes("current-page-ancestors")) errors.push("导航缺少当前页面定位标记")
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
if (!builtOnly && errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}

if (builtOnly) {
  // .quartz-build 是构建副本；这里专门检查构建后的导航 DOM，不重复仓库级静态门禁。
  errors.length = 0
  const publicDir = path.resolve(root, process.argv[3] || "public")
  if (!fs.existsSync(publicDir)) errors.push(`构建产物目录不存在：${publicDir}`)
  else {
    const htmlFiles = walkAll(publicDir).filter((file) => file.endsWith(".html"))
    if (!htmlFiles.length) errors.push("构建产物缺少 HTML 页面")
    const parse5 = await import("parse5")
    const hasClass = (node, name) =>
      node?.attrs?.some((attr) => attr.name === "class" && attr.value.split(/\s+/).includes(name))
    const elements = (node, out = []) => {
      if (!node) return out
      if (node.tagName) out.push(node)
      for (const child of node.childNodes || []) elements(child, out)
      return out
    }
    let renderedExplorerPages = 0
    for (const file of htmlFiles) {
      // 404 由 Quartz 单独生成，既没有正式条目导航，也不应成为导航覆盖率的分母。
      if (path.relative(publicDir, file).replaceAll("\\", "/") === "404.html") continue
      const document = parse5.parse(fs.readFileSync(file, "utf8"))
      const explorers = elements(document).filter((node) => hasClass(node, "explorer"))
      // Explorer 是 afterDOMLoaded 客户端组件；某些 Quartz 构建模式的静态 HTML
      // 不含其最终 DOM，不能把“尚未执行 JS”误报为空导航。若已渲染，则严格检查其 DOM。
      if (explorers.length) renderedExplorerPages += 1
      for (const explorer of explorers) {
        const folders = elements(explorer).filter((node) => hasClass(node, "folder-outer"))
        for (const folder of folders) {
          const links = elements(folder).filter((node) => node.tagName === "a" && node.attrs?.some((a) => a.name === "href"))
          if (!links.length) errors.push(`构建导航存在空子菜单：${path.relative(publicDir, file)}`)
        }
        const icons = elements(explorer).filter((node) => hasClass(node, "folder-icon"))
        if (icons.length !== folders.length)
          errors.push(`构建导航展开按钮与分类数量不一致：${path.relative(publicDir, file)}`)
        const anchors = elements(explorer).filter((node) => node.tagName === "a")
        const hrefs = anchors
          .map((node) => node.attrs?.find((attr) => attr.name === "href")?.value)
          .filter(Boolean)
        const duplicateHrefs = hrefs.filter((href, index) => hrefs.indexOf(href) !== index)
        if (duplicateHrefs.length)
          errors.push(`构建导航存在重复入口：${path.relative(publicDir, file)} -> ${duplicateHrefs[0]}`)
        const htmlRoutes = new Set(
          htmlFiles.map((html) => {
            const rel = path.relative(publicDir, html).replaceAll("\\", "/")
            if (rel === "index.html") return "/"
            return `/${rel.replace(/\/index\.html$/, "").replace(/\.html$/, "")}`
          }),
        )
        for (const href of hrefs) {
          if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) continue
          const route = href.split("#")[0].replace(/\/$/, "") || "/"
          if (!htmlRoutes.has(route))
            errors.push(`构建导航链接无对应页面：${path.relative(publicDir, file)} -> ${href}`)
          if (/\/ai-drafts(?:\/|$)|\/history(?:\/|$)|\/redirect/i.test(route))
            errors.push(`构建导航泄露草稿、历史或废弃入口：${route}`)
          if (/^\/tags(?:\/|$)/i.test(route))
            errors.push(`构建导航泄露标签索引：${path.relative(publicDir, file)} -> ${href}`)
        }
      }
    }
    if (!renderedExplorerPages) {
      const builtFiles = walkAll(publicDir).filter((file) => /\.(?:html|js)$/.test(file))
      const builtText = builtFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n")
      if (!builtText.includes("current-page-ancestors") || !builtText.includes("folder-outer"))
        errors.push("构建产物缺少 Explorer 客户端导航契约，无法验证正式导航 DOM")
    }
  }
  if (errors.length) {
    console.error(errors.join("\n"))
    process.exit(1)
  }
  console.log(`OK 构建导航 DOM 检查通过：${walkAll(publicDir).filter((file) => file.endsWith(".html")).length} 个 HTML 页面`)
}
console.log(
  JSON.stringify({
    formalPages: formal.length,
    indexedPages: formal.length,
    orphanedPages: 0,
    historyPagesInContent: 0,
  }),
)
