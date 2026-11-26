import fs from "node:fs"
import path from "node:path"

const root = path.resolve("content/player/original")
const files = fs.readdirSync(root).filter((name) => name.endsWith(".md") && name !== "index.md")
const errors = []

for (const name of files) {
  const file = path.join(root, name)
  const source = fs.readFileSync(file, "utf8")
  const match = source.match(/^title:[ \t]*"([^"]*)"[ \t]*$/m)
  if (!match) {
    errors.push(`${name}: 缺少可解析的 frontmatter title`)
    continue
  }
  if (!match[1].startsWith("原版:")) errors.push(`${name}: title 未使用原版:命名空间`)
  if (match[1].startsWith("原版:原版:")) errors.push(`${name}: title 重复添加原版:前缀`)
}

const index = fs.readFileSync(path.join(root, "index.md"), "utf8")
if (!/^title:[ \t]*"原版 Wiki 中文翻译"[ \t]*$/m.test(index)) {
  errors.push("index.md: 原版翻译专区首页标题被错误加上命名空间")
}

if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}

console.log(`原版译文标题命名空间检查通过：${files.length} 篇正文，首页保持独立标题`)
