import fs from "node:fs/promises"

const inputPath = "docs/translation/original-image-manifest.json"
const outputPath = "docs/translation/original-image-metadata.json"
const manifest = JSON.parse(await fs.readFile(inputPath, "utf8"))
const site = String(manifest.source ?? "").replace(/\/+$/, "")
if (!site) throw new Error("图片清单缺少 source")

const pages = []
const seen = new Set()
for (const page of manifest.pages ?? []) {
  for (const image of page.images ?? []) {
    if (!seen.has(image.title)) {
      seen.add(image.title)
      pages.push({ title: image.title, pages: [page.source_title] })
    } else {
      const item = pages.find((entry) => entry.title === image.title)
      if (item && !item.pages.includes(page.source_title)) item.pages.push(page.source_title)
    }
  }
}

const value = (metadata, name) => metadata?.[name]?.value ?? null
const records = []
let limitedBatches = 0
for (let offset = 0; offset < pages.length; offset += 20) {
  const batch = pages.slice(offset, offset + 20)
  const titles = encodeURIComponent(batch.map((image) => image.title).join("|"))
  const url = `${site}/api.php?action=query&titles=${titles}&prop=imageinfo&iiprop=url%7Cextmetadata%7Ccommonmetadata%7Csize%7Csha1&iiurlwidth=240&format=json`
  let response = await fetch(url, {
    headers: { "User-Agent": "AD-Oreki-Wiki/1.0 (image metadata audit; repository contact)" },
  })
  if (response.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    response = await fetch(url, {
      headers: { "User-Agent": "AD-Oreki-Wiki/1.0 (image metadata audit; repository contact)" },
    })
  }
  if (response.status === 429) {
    limitedBatches += 1
    for (const image of batch)
      records.push({ ...image, status: "待 API 审计（频率限制）", source_url: null, license: null })
    continue
  }
  if (!response.ok) throw new Error(`${response.status} ${url}`)
  const data = await response.json()
  for (const image of batch) {
    const page = Object.values(data.query?.pages ?? {}).find((item) => item.title === image.title)
    const info = page?.imageinfo?.[0]
    const metadata = info?.extmetadata ?? {}
    const license = value(metadata, "LicenseShortName") ?? value(metadata, "License")
    const explicitOpenLicense = /CC0|CC BY|CC-BY|public domain|公有领域/i.test(String(license ?? ""))
    records.push({
      ...image,
      status: info ? (explicitOpenLicense ? "许可字段已取得，待人工确认署名" : "已取得文件信息，许可待核实") : "未找到文件信息",
      source_url: info?.descriptionurl ?? null,
      file_url: info?.url ?? null,
      thumb_url: info?.thumburl ?? null,
      sha1: info?.sha1 ?? null,
      width: info?.width ?? null,
      height: info?.height ?? null,
      size: info?.size ?? null,
      license,
      license_text: value(metadata, "License") ?? null,
      artist: value(metadata, "Artist") ?? null,
      credit: value(metadata, "Credit") ?? null,
      source: value(metadata, "Source") ?? null,
      permission: value(metadata, "Permission") ?? null,
      description: value(metadata, "ImageDescription") ?? null,
    })
  }
}

const open = records.filter((record) => record.status === "许可字段已取得，待人工确认署名")
await fs.writeFile(
  outputPath,
  `${JSON.stringify({ schema: 1, generated_at: new Date().toISOString(), source: site, unique_images: records.length, metadata_complete: limitedBatches === 0, open_license_candidates: open.length, images: records }, null, 2)}\n`,
)
console.log(JSON.stringify({ unique_images: records.length, open_license_candidates: open.length, limitedBatches }))
