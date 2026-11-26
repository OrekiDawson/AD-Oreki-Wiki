import fs from "node:fs"
import path from "node:path"

const ORIGINAL_TRANSLATION_DIR = "content/player/original"
const root = path.resolve(ORIGINAL_TRANSLATION_DIR)
const manifestFile = path.resolve("docs/translation/source-manifest.json")
const files = fs.readdirSync(root).filter((name) => name.endsWith(".md") && name !== "index.md")
const changed = []

for (const name of files) {
  const file = path.join(root, name)
  const source = fs.readFileSync(file, "utf8")
  const match = source.match(/^title:[ \t]*(?:"([^"]*)"|'([^']*)'|([^#\n][^#\n]*?))[ \t]*(?:#[^\n]*)?$/m)
  if (!match) throw new Error("缺少 frontmatter title: " + file)
  const current = (match[1] ?? match[2] ?? match[3]).trim()
  const bare = current.replace(/^原版:/, "")
  const next = 'title: "原版:' + bare + '"'
  const updated = source.replace(/^title:[ \t]*(?:"[^"]*"|'[^']*'|[^#\n][^#\n]*?)[ \t]*(?:#[^\n]*)?$/m, next)
  if (updated !== source) {
    fs.writeFileSync(file, updated)
    changed.push({ file: path.relative(process.cwd(), file), from: current, to: "原版:" + bare })
  }
}

const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"))
const manifestChanged = []
for (const entry of manifest.pages ?? []) {
  if (!entry.path?.startsWith(ORIGINAL_TRANSLATION_DIR) || !entry.zh_title || entry.zh_title.startsWith("原版:")) continue
  manifestChanged.push({ path: entry.path, from: entry.zh_title, to: "原版:" + entry.zh_title })
  entry.zh_title = "原版:" + entry.zh_title
}
if (manifestChanged.length) fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 1) + "\n")

console.log(JSON.stringify({ scanned: files.length, changed, manifestChanged }, null, 2))
