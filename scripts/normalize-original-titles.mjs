import fs from "node:fs"
import path from "node:path"

const root = path.resolve("content/player/original")
const files = fs.readdirSync(root).filter((name) => name.endsWith(".md") && name !== "index.md")
const changed = []

for (const name of files) {
  const file = path.join(root, name)
  const source = fs.readFileSync(file, "utf8")
  const match = source.match(/^title:\s*(?:"([^"]*)"|'([^']*)'|(.+))\s*$/m)
  if (!match) throw new Error("缺少 frontmatter title: " + file)
  const current = (match[1] ?? match[2] ?? match[3]).trim()
  const bare = current.replace(/^原版:/, "")
  const next = 'title: "原版:' + bare + '"'
  const updated = source.replace(/^title:\s*(?:"[^"]*"|'[^']*'|.+)\s*$/m, next)
  if (updated !== source) {
    fs.writeFileSync(file, updated)
    changed.push({ file: path.relative(process.cwd(), file), from: current, to: "原版:" + bare })
  }
}

console.log(JSON.stringify({ scanned: files.length, changed }, null, 2))
