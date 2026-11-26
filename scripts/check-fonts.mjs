import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const errors = []
const config = fs.readFileSync(path.join(root, "quartz.config.yaml"), "utf8")
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) }

if (/quartz-fonts|fontOrigin:\s*(?:googleFonts|local|selfHosted)/.test(config))
  errors.push("Quartz 自定义网页字体插件或字体来源仍在配置中")
if (process.argv[2] !== "--built" && deps["@quartz-community/quartz-fonts"])
  errors.push("package.json 仍依赖 @quartz-community/quartz-fonts")
if (!/--headerFont:\s*(?:system-ui|sans-serif)/.test(fs.readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")))
  errors.push("标题未绑定系统原生无衬线字体")
if (!/--bodyFont:\s*(?:system-ui|sans-serif)/.test(fs.readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")))
  errors.push("正文未绑定系统原生无衬线字体")
if (!/--codeFont:\s*ui-monospace/.test(fs.readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")))
  errors.push("代码未绑定系统原生等宽字体")
if (/Source Sans|Schibsted|IBM Plex|Google Sans|Roboto|Noto Sans|font-family:\s*["'][^"']+["']/i.test(config))
  errors.push("配置中重新引入了固定网页字体；普通文本必须使用系统字体")
const styles = fs.readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")
if (!/:where\(body, body \*\)[\s\S]*?font-family:\s*var\(--bodyFont\)\s*!important/.test(styles))
  errors.push("普通文本没有在叶子节点强制继承系统无衬线字体")
if (!/:where\(pre, pre \*, code, code \*, kbd, kbd \*, samp, samp \*\)[\s\S]*?font-family:\s*var\(--codeFont\)\s*!important/.test(styles))
  errors.push("程序代码没有明确绑定系统等宽字体")
if (/fonts\.(googleapis|gstatic)\.com|use\.typekit\.net|@import\s+url\(/i.test(styles))
  errors.push("自定义样式仍加载远程字体")

const sourceFiles = []
const walkMarkdown = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
  const file = path.join(dir, entry.name)
  if (entry.isDirectory()) walkMarkdown(file)
  else if (entry.name.endsWith('.md')) sourceFiles.push(file)
})
walkMarkdown(path.join(root, 'content'))
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8')
  const numericCode = [...text.matchAll(/`([^`]+)`/g)].map((match) => match[1])
    .filter((value) => value.length <= 80 && /^[\s\d.eE+\-−×x^*/()→←=]+$/.test(value)
      && /(?:(?<![A-Za-z0-9])(?:\d{1,3}(?:\.\d+)?)\s*[eE][+-]?\d+(?![A-Za-z0-9])|(?<!\d)e\d{2,}|(?<![A-Za-z0-9])\d{1,3}(?:\.\d+)?\s*[×x]\s*10\^\d)/.test(value))
  if (numericCode.length) errors.push(`科学记数法不得使用行内代码：${path.relative(root, file)}：${numericCode.join('|')}`)
}

if (process.argv[2] === "--built") {
  const publicDir = path.resolve(root, process.argv[3] || "public")
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
  if (!fs.existsSync(publicDir)) errors.push(`构建产物目录不存在：${publicDir}`)
  else for (const file of walk(publicDir)) {
    if (!/\.(html|css)$/i.test(file)) continue
    const text = fs.readFileSync(file, "utf8")
    if (/fonts\.(googleapis|gstatic)\.com|use\.typekit\.net/i.test(text))
      errors.push(`构建产物仍请求第三方网页字体：${path.relative(publicDir, file)}`)
  }
}

if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log("OK 字体策略使用系统原生字体；保留 KaTeX 等功能性数学字体")
