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
    if (/Source Sans|Schibsted|IBM Plex|Google Sans|Roboto|Noto Sans/i.test(text))
      errors.push(`构建产物仍包含固定网页字体：${path.relative(publicDir, file)}`)
  }
}

if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log("OK 字体策略使用系统原生字体；保留 KaTeX 等功能性数学字体")
