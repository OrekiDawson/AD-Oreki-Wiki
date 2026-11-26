import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const errors = []
const configFiles = ["quartz.config.yaml", "quartz.config.default.yaml"]
  .map((file) => path.join(root, file))
  .filter((file) => fs.existsSync(file))
const configs = configFiles.map((file) => ({ file, text: fs.readFileSync(file, "utf8") }))
const config = configs.find(({ file }) => path.basename(file) === "quartz.config.yaml")?.text || ""
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
const deps = { ...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {}) }
const customStyles = fs.readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")

for (const { file, text } of configs) {
  if (/quartz-fonts|fontOrigin:\s*(?:googleFonts|local|selfHosted)/.test(text))
    errors.push(`Quartz 自定义网页字体插件或字体来源仍在配置中：${path.basename(file)}`)
  if (/Source Sans|Schibsted|IBM Plex|Google Sans|Roboto|Noto Sans|font-family:\s*["'][^"']+["']/i.test(text))
    errors.push(`配置中重新引入了固定网页字体：${path.basename(file)}`)
}
if (process.argv[2] !== "--built" && deps["@quartz-community/quartz-fonts"])
  errors.push("package.json 仍依赖 @quartz-community/quartz-fonts")
if (!/--headerFont:\s*(?:system-ui|sans-serif)/.test(fs.readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")))
  errors.push("标题未绑定系统原生无衬线字体")
if (!/--bodyFont:\s*(?:system-ui|sans-serif)/.test(fs.readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")))
  errors.push("正文未绑定系统原生无衬线字体")
if (!/--codeFont:\s*ui-monospace/.test(fs.readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")))
  errors.push("代码未绑定系统原生等宽字体")
if (!/article[\s\S]+?font-family:\s*var\(--bodyFont\)/.test(customStyles))
  errors.push("正文没有显式绑定统一的系统无衬线字体")
const styles = fs.readFileSync(path.join(root, "quartz/styles/custom.scss"), "utf8")
if (!/:where\(body, body \*\)[\s\S]*?font-family:\s*var\(--bodyFont\)\s*!important/.test(styles))
  errors.push("普通文本没有在叶子节点强制继承系统无衬线字体")
if (!/:where\(pre, pre \*, code, code \*, kbd, kbd \*, samp, samp \*\)[\s\S]*?font-family:\s*var\(--codeFont\)\s*!important/.test(customStyles))
  errors.push("程序代码没有明确绑定系统等宽字体")
if (/fonts\.(googleapis|gstatic)\.com|use\.typekit\.net|@import\s+url\(/i.test(customStyles))
  errors.push("自定义样式仍加载远程字体")

// 所有 Quartz 组件样式都属于公开构建输入；防止未来在 custom.scss 之外重新引入网页字体。
const walkSource = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name)
  return entry.isDirectory() ? walkSource(file) : [file]
})
for (const file of walkSource(path.join(root, "quartz"))) {
  if (!/\.(css|scss|sass|ts|tsx|js|jsx)$/.test(file)) continue
  const text = fs.readFileSync(file, "utf8")
  if (/fonts\.(googleapis|gstatic)\.com|use\.typekit\.net|@import\s+url\(/i.test(text))
    errors.push(`Quartz 源码仍加载远程字体：${path.relative(root, file)}`)
  if (/font-family\s*:\s*["'][^"']+["']/i.test(text)
    && !/font-family\s*:\s*["'](?:KaTeX_[^"']+)["']/i.test(text))
    errors.push(`Quartz 源码存在固定网页字体声明：${path.relative(root, file)}`)
}

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
    if (/font-family\s*:[^;]*(?:Source Sans|Schibsted|IBM Plex|Google Sans|Roboto|Inter|Open Sans|Lato|Poppins|Nunito)/i.test(text))
      errors.push(`构建产物仍包含普通网页字体声明：${path.relative(publicDir, file)}`)
  }
}

if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log("OK 字体策略使用系统原生字体；保留 KaTeX 等功能性数学字体")
