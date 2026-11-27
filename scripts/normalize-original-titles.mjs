import fs from "node:fs"
import path from "node:path"

const root = path.join(process.cwd(), "content", "player", "original")
let changed = 0
for (const name of fs.readdirSync(root).filter((entry) => entry.endsWith(".md") && entry !== "index.md")) {
  const file = path.join(root, name)
  const before = fs.readFileSync(file, "utf8")
  const after = before.replace(/^(title:\s*["']?)([^"'\r\n]+)(["']?\s*)$/m, (full, prefix, title, suffix) => {
    if (title.startsWith("原版:")) return full
    changed += 1
    return `${prefix}原版:${title}${suffix}`
  })
  if (after !== before) fs.writeFileSync(file, after)
}
console.log(`已规范 ${changed} 个原版译文标题为「原版:条目名」`)
