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

await fs.writeFile(outputPath, `${JSON.stringify(summary, null, 2)}\n`)
console.log(JSON.stringify(summary.totals))
