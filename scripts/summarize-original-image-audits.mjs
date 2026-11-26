import fs from "node:fs/promises"
import path from "node:path"

const directory = "docs/translation"
const outputPath = path.join(directory, "original-image-audit-summary.json")
const names = (await fs.readdir(directory))
  .filter((name) => /^original-image-license-audit-.*\.json$/.test(name))
  .sort()

const records = []
const batches = []
for (const name of names) {
  const file = JSON.parse(await fs.readFile(path.join(directory, name), "utf8"))
  const batchRecords = Array.isArray(file.records) ? file.records : []
  batches.push({
    file: name,
    checked_at: file.checked_at ?? null,
    batch: file.batch ?? null,
    records: batchRecords.length,
  })
  for (const record of batchRecords) records.push({ ...record, audit_file: name })
}

const count = (predicate) => records.filter(predicate).length
const titles = new Map()
for (const record of records) titles.set(record.title, (titles.get(record.title) ?? 0) + 1)
const duplicates = [...titles.entries()]
  .filter(([, occurrences]) => occurrences > 1)
  .map(([title, occurrences]) => ({ title, occurrences }))

const summary = {
  schema: 1,
  source: "docs/translation/original-image-license-audit-*.json",
  policy: "未明确确认许可证和署名条件的素材不得下载或集成；原版 Wiki 来源不等于 Commons 授权。",
  batch_files: batches,
  totals: {
    batches: batches.length,
    records: records.length,
    unique_titles: titles.size,
    duplicate_titles: duplicates.length,
    commons_file_pages_exist: count((record) => record.file_page_exists === true),
    pending_authorization: count((record) => record.result === "BLOCKED_AUTHORIZATION"),
    missing_from_commons: count((record) => record.result === "BLOCKED_NOT_ON_COMMONS"),
    downloaded: count((record) => record.downloaded === true),
    integrated: count((record) => record.integrated === true),
  },
  duplicate_titles: duplicates,
}

// MediaWiki API 元数据与授权落地是两个阶段：取得 URL/SHA-1 不等于获得再发布许可。
// 将 API 阶段单独写入汇总，避免把“已核查文件信息”误报成“已恢复图片”。
const metadataPath = path.join(directory, "original-image-metadata.json")
if (await fs.stat(metadataPath).catch(() => null)) {
  const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"))
  const images = Array.isArray(metadata.images) ? metadata.images : []
  summary.mediawiki_api = {
    unique_images: images.length,
    file_metadata_found: images.filter((image) => Boolean(image.file_url)).length,
    file_metadata_missing: images.filter((image) => !image.file_url).length,
    explicit_open_license_candidates: Number(metadata.open_license_candidates ?? 0),
    local_assets: images.filter((image) => Boolean(image.local_path)).length,
    note: "文件信息、许可证确认和本地落地分别统计；原版 Wiki 文件没有明确许可证时不得下载。",
  }
}

await fs.writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`)
console.log(JSON.stringify(summary.totals))
