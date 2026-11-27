#!/usr/bin/env node
// 公开内容不得把 GitHub 文件页当作 Wiki 正文或公开证据入口。
import fs from "node:fs"
import path from "node:path"

const root = process.argv.includes("--built") ? process.argv[process.argv.indexOf("--built") + 1] : "content"
const isBuilt = process.argv.includes("--built")
const forbidden = /https?:\/\/(?:raw\.githubusercontent\.com|github\.com\/[^\s)<>"']+\/(?:blob|raw)\/)[^\s)<>"']*/gi
const failures = []

function filesUnder(dir, extensions) {
  if (!fs.existsSync(dir)) return []
  const result = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...filesUnder(full, extensions))
    else if (extensions.has(path.extname(entry.name).toLowerCase())) result.push(full)
  }
  return result
}

const files = filesUnder(root, isBuilt ? new Set([".html"]) : new Set([".md"]))
  .filter(file => !file.includes(`${path.sep}ai-drafts${path.sep}`))

for (const file of files) {
  const text = fs.readFileSync(file, "utf8")
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    for (const match of line.matchAll(forbidden)) {
      failures.push({ file, line: index + 1, url: match[0] })
    }
  }
}

if (failures.length) {
  console.error(JSON.stringify({ error: "公开内容包含 GitHub 文件级外链", root, failures }, null, 2))
  process.exitCode = 1
} else {
  console.log(`OK 公开链接检查通过: ${files.length} 个${isBuilt ? "HTML" : "Markdown"}文件`)
}
