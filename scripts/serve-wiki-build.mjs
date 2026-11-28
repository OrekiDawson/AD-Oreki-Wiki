#!/usr/bin/env node
// Minimal static server for the exact Quartz build artifact used by browser acceptance.
// Quartz emits clean routes as <slug>.html; map both /slug and /slug/ explicitly.
import fs from "node:fs"
import path from "node:path"
import http from "node:http"
import { fileURLToPath } from "node:url"

const root = path.resolve(process.argv[2] || "public")
const host = process.argv[3] || "127.0.0.1"
const port = Number(process.argv[4] || 8081)
const mime = new Map([
  [".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"], [".svg", "image/svg+xml"],
  [".png", "image/png"], [".jpg", "image/jpeg"], [".jpeg", "image/jpeg"],
  [".webp", "image/webp"], [".ico", "image/x-icon"], [".xml", "application/xml; charset=utf-8"],
  [".woff2", "font/woff2"], [".woff", "font/woff"], [".txt", "text/plain; charset=utf-8"],
])

if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`Build directory does not exist: ${root}`)

http.createServer((req, res) => {
  let pathname
  try { pathname = decodeURIComponent(new URL(req.url || "/", `http://${host}:${port}`).pathname) }
  catch { res.writeHead(400).end("Bad request"); return }

  const relative = pathname.replace(/^\/+/, "")
  const candidates = pathname.endsWith("/")
    ? [path.join(root, relative, "index.html"), path.join(root, `${relative.replace(/\/+$/, "")}.html`)]
    : [path.join(root, relative), path.join(root, `${relative}.html`), path.join(root, relative, "index.html")]
  const target = candidates.find(file => file.startsWith(root + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile())
  if (!target) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found"); return }

  res.writeHead(200, { "content-type": mime.get(path.extname(target)) || "application/octet-stream", "x-content-type-options": "nosniff" })
  if (req.method === "HEAD") { res.end(); return }
  fs.createReadStream(target).pipe(res)
}).listen(port, host, () => console.log(`Serving ${root} at http://${host}:${port}`))
