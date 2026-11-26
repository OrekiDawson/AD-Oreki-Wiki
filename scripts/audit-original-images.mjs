import fs from "node:fs/promises"

const manifest = JSON.parse(await fs.readFile("docs/translation/source-manifest.json", "utf8"))
const pages = manifest.pages.filter((page) => page.namespace === 0 || !page.namespace)
const site = String(manifest.source?.site ?? "").replace(/\/+$/, "")
if (!site) throw new Error("source-manifest.json 缺少 source.site")
const apiBase = `${site}/api.php`
const result = []
let limitedBatches = 0
for (let offset = 0; offset < pages.length; offset += 20) {
  const batch = pages.slice(offset, offset + 20)
  const titles = encodeURIComponent(batch.map((page) => page.title.replaceAll(" ", "_")).join("|"))
  const api = `${apiBase}?action=query&titles=${titles}&prop=images%7Cinfo&imlimit=500&redirects=1&format=json`
  let response = await fetch(api, {
    headers: { "User-Agent": "AD-Oreki-Wiki/1.0 (image audit; contact via repository)" },
  })
  if (response.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    response = await fetch(api, {
      headers: { "User-Agent": "AD-Oreki-Wiki/1.0 (image audit; contact via repository)" },
    })
  }
  if (response.status === 429) {
    limitedBatches += 1
    for (const page of batch)
      result.push({
        source_title: page.title,
        source_url: page.url,
        revid: page.revid ?? null,
        audit_status: "待 API 审计（频率限制）",
        images: [],
      })
    continue
  }
  if (!response.ok)
    throw new Error(`${response.status} ${batch.map((page) => page.title).join(", ")}`)
  const data = await response.json()
  const redirects = new Map([
    ...(data.query?.normalized ?? []).map((item) => [item.from, item.to]),
    ...(data.query?.redirects ?? []).map((item) => [item.from, item.to]),
  ])
  for (const page of batch) {
    const requestedTitle = page.title.replaceAll("_", " ")
    const resolvedTitle = redirects.get(requestedTitle) ?? requestedTitle
    const item = Object.values(data.query?.pages ?? {}).find(
      (candidate) => candidate.title === resolvedTitle,
    )
    const images = (item?.images ?? []).map((image) => image.title)
    result.push({
      source_title: page.title,
      source_url: page.url,
      revid: item?.lastrevid ?? page.revid ?? null,
      resolved_title: resolvedTitle !== requestedTitle ? resolvedTitle : null,
      audit_status: item
        ? resolvedTitle !== requestedTitle
          ? "已解析重定向，待逐项核实"
          : "已取得页面修订号，待逐项核实"
        : "待 API 审计（标题未匹配）",
      images: images.map((title) => ({
        title,
        local_path: null,
        status: "待核实",
        license: null,
        attribution: null,
      })),
    })
  }
}
await fs.writeFile(
  "docs/translation/original-image-manifest.json",
  `${JSON.stringify({ schema: 1, generated_at: new Date().toISOString(), source: manifest.source.site, note: "图片逐项核对许可证后才可下载到 static/；待核实素材不得进入正式页面。API 频率限制时保持待审状态，不将空结果当作无图片。", audit_status: limitedBatches ? "INCOMPLETE" : "COMPLETE", pages: result }, null, 2)}\n`,
)
console.log(
  JSON.stringify({
    pages: result.length,
    pagesWithImages: result.filter((page) => page.images.length).length,
    images: result.reduce((count, page) => count + page.images.length, 0),
    limitedBatches,
  }),
)
