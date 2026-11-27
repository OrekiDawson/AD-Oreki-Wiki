#!/usr/bin/env node
// 将公开正文中的 GitHub 文件链接改为可读的源码定位文字；证据链接留在内部记录。
import fs from "node:fs"
import path from "node:path"

const forbidden = /https?:\/\/(?:raw\.githubusercontent\.com|github\.com\/[^\s)<>"']+\/(?:blob|raw)\/)[^\s)<>"']*/i
const roots = ["content"]

function filesUnder(dir) {
  if (!fs.existsSync(dir)) return []
  const result = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...filesUnder(full))
    else if (full.endsWith(".md") && !full.includes(`${path.sep}ai-drafts${path.sep}`)) result.push(full)
  }
  return result
}

function sourceNote(url) {
  try {
    const parsed = new URL(url)
    const pieces = parsed.pathname.split("/").filter(Boolean)
    if (parsed.hostname === "raw.githubusercontent.com") {
      return `源码定位：${pieces.slice(0, 2).join("/")}@${pieces[2] ?? "unknown"}/${pieces.slice(3).join("/")}；具体文件证据留在内部核验记录`
    }
    const repo = pieces.slice(0, 2).join("/")
    const marker = pieces.indexOf("blob") >= 0 ? pieces.indexOf("blob") : pieces.indexOf("raw")
    const ref = marker >= 0 ? pieces[marker + 1] : "unknown"
    const file = marker >= 0 ? pieces.slice(marker + 2).join("/") : pieces.slice(2).join("/")
    return `源码定位：${repo}@${ref}/${file}${parsed.hash ? parsed.hash : ""}；具体文件证据留在内部核验记录`
  } catch {
    return "源码定位与具体文件证据留在内部核验记录"
  }
}

for (const root of roots) {
  for (const file of filesUnder(root)) {
    const before = fs.readFileSync(file, "utf8")
    let after = before
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi, (full, label, url) =>
        forbidden.test(url) ? `${label}（${sourceNote(url)}）` : full)
      .replace(/<((?:https?:\/\/)[^>]+)>/gi, (full, url) =>
        forbidden.test(url) ? `（${sourceNote(url)}）` : full)
    if (after !== before) fs.writeFileSync(file, after)
  }
}
