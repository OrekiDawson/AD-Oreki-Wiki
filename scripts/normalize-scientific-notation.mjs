import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const contentRoot = path.join(root, "content")
const files = []
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
  const file = path.join(dir, entry.name)
  if (entry.isDirectory()) walk(file)
  else if (entry.name.endsWith(".md")) files.push(file)
})
walk(contentRoot)

// 纯数字 + e 记数法是正文数值，不是公式；含分式、对数、幂或乘法结构的
// 数学表达式保留 KaTeX。此转换只处理单美元行内数学，不触碰 $$ 块公式。
const plainScientific = /^(?:[\d.,]+|\\text\{e\}|\\mathrm\{e\}|e|\\,|~|\s)+$/
const toPlain = (value) => value
  .replace(/\\text\{e\}|\\mathrm\{e\}/g, "e")
  .replace(/\\,/g, "")
  .replace(/~/g, " ")

let changed = 0
for (const file of files) {
  const before = fs.readFileSync(file, "utf8")
  const after = before.replace(/(?<!\$)\$([^$\n]+)\$(?!\$)/g, (full, value) => {
    if (!plainScientific.test(value)) return full
    changed += 1
    return toPlain(value)
  })
  if (after !== before) fs.writeFileSync(file, after)
}

console.log(`已将 ${changed} 个纯科学记数法从 KaTeX 改为系统正文文本`)
