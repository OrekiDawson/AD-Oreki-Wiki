#!/usr/bin/env node
// wiki.oreki.net HTTPS/证书每日监测：Pages 配置、TLS、HTTPS 页面、HTTP 跳转、DNS。
// 说明：GitHub Pages 自动签发/续期证书；本脚本只读检测 + 幂等告警，不重新申请/删除证书。
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import https from "node:https"
import http from "node:http"
import tls from "node:tls"
import { createHash } from "node:crypto"

const DOMAIN = process.env.KB_DOMAIN || "wiki.oreki.net"
const REPO = process.env.GITHUB_REPOSITORY || "OrekiDawson/AD-Oreki-Wiki"
const ALERT_ISSUE = Number(process.env.KB_ALERT_ISSUE || "9")
const RUN_ID = process.env.GITHUB_RUN_ID || "local"
const SHA = process.env.GITHUB_SHA || ""
const FIXTURE = process.env.KB_FIXTURE || ""
const NOW = process.env.KB_NOW ? new Date(process.env.KB_NOW) : new Date()

// 与 scripts/verify-build.mjs 的 Quartz 发布产物契约保持一致，避免检查不存在的旧 AI 索引。
export const HTTPS_SMOKE_PATHS = [
  "/",
  "/index.html",
  "/static/contentIndex.json",
  "/player/",
  "/developer/",
  "/developer/architecture/kotlin-runtime",
]
// 站点标题单一来源：与 quartz.config.yaml 的 configuration.pageTitle 保持一致，
// 供监控判定与回归测试共用，避免测试用虚构字符串掩盖生产判据漂移。
export const SITE_TITLE = "反物质维度 MOD Wiki"

function sh(cmd, args) {
  return execFileSync(cmd, args, {
    encoding: "utf8",
    timeout: 30000,
    stdio: ["ignore", "pipe", "ignore"],
  }).trim()
}

async function collectPages() {
  try {
    const raw = sh("gh", ["api", "repos/" + REPO + "/pages"])
    const d = JSON.parse(raw)
    return {
      ok: true,
      cname: d.cname || null,
      https_enforced: d.https_enforced === true,
      cert_state: d.https_certificate ? d.https_certificate.state || null : null,
      cert_expires: d.https_certificate ? d.https_certificate.expires_at || null : null,
      status: d.status || null,
      html_url: d.html_url || null,
    }
  } catch (err) {
    return { ok: false, error: String(err).slice(0, 200) }
  }
}

function collectTls() {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: DOMAIN, port: 443, servername: DOMAIN, timeout: 20000, rejectUnauthorized: true },
      () => {
        const cert = socket.getPeerCertificate(true)
        const validTo = cert && cert.valid_to ? new Date(cert.valid_to) : null
        const days = validTo ? Math.floor((validTo.getTime() - NOW.getTime()) / 86400000) : null
        const alt = (cert && cert.subjectaltname) || ""
        socket.end()
        resolve({
          ok: true,
          authorized: socket.authorized,
          validTo: validTo ? validTo.toISOString() : null,
          days,
          subjectaltname: alt,
          issuer: cert ? cert.issuer : null,
        })
      },
    )
    socket.on("error", (err) => resolve({ ok: false, error: String(err).slice(0, 200) }))
    socket.on("timeout", () => {
      socket.destroy()
      resolve({ ok: false, error: "timeout" })
    })
  })
}

function httpGet(url, { method = "GET" } = {}) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https:") ? https : http
    const req = lib.request(url, { method, timeout: 25000 }, (res) => {
      let body = ""
      res.on("data", (c) => {
        if (body.length < 200000) body += c
      })
      res.on("end", () => resolve({ ok: true, status: res.statusCode, headers: res.headers, body }))
      res.on("error", (e) => resolve({ ok: false, error: String(e).slice(0, 150) }))
    })
    req.on("error", (e) => resolve({ ok: false, error: String(e).slice(0, 150) }))
    req.on("timeout", () => {
      req.destroy()
      resolve({ ok: false, error: "timeout" })
    })
    req.end()
  })
}

// 允许在单元测试中注入只读请求函数，避免访问生产站点或写入 Issue。
// hasTitle 仅作诊断信号（不计入 PASS/FAIL）：HTML 页面核对真实站点标题，
// JSON 等静态资源本身不含标题，跳过判定，避免永久为假值的无效检查。
export async function collectHttps({
  request = httpGet,
  paths = HTTPS_SMOKE_PATHS,
  domain = DOMAIN,
} = {}) {
  const results = []
  for (const path of paths) {
    const r = await request("https://" + domain + path)
    const hasFileExtension = /\.[a-z0-9]+(?:[?#]|$)/i.test(path)
    const isHtml = !hasFileExtension || /\.html?(?:[?#]|$)/i.test(path)
    results.push({
      path,
      ok: r.ok,
      status: r.status || null,
      error: r.error || null,
      hasTitle: Boolean(isHtml && r.body && r.body.includes(SITE_TITLE)),
    })
  }
  return results
}

async function collectRedirect() {
  const r = await httpGet("http://" + DOMAIN + "/", { method: "GET" })
  const loc = r.headers && r.headers.location ? String(r.headers.location) : ""
  return { ok: r.ok, status: r.status || null, location: loc, error: r.error || null }
}

function collectDns() {
  const out = { cname: [], a: [], aaaa: [], caa: [], resolvers: {}, error: null }
  try {
    const dig = (args) =>
      sh("dig", args)
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    out.cname = dig(["+short", "CNAME", DOMAIN])
    out.a = dig(["+short", "A", DOMAIN])
    out.aaaa = dig(["+short", "AAAA", DOMAIN])
    out.caa = dig(["+short", "CAA", DOMAIN])
    for (const resolver of ["1.1.1.1", "8.8.8.8"]) {
      try {
        out.resolvers[resolver] = dig(["@" + resolver, "+short", "CNAME", DOMAIN])
      } catch {
        out.resolvers[resolver] = null
      }
    }
  } catch (err) {
    out.error = String(err).slice(0, 200)
  }
  return out
}

export function evaluate(input) {
  const checks = []
  const add = (id, state, detail) => checks.push({ id, state, detail })
  const pages = input.pages || {}
  if (!pages.ok) add("pages-api", "UNKNOWN", "Pages API 不可读: " + (pages.error || ""))
  else {
    add(
      "pages-cname",
      pages.cname === DOMAIN ? "PASS" : "FAIL",
      "cname=" + (pages.cname || "<null>"),
    )
    add(
      "https-enforced",
      pages.https_enforced === true ? "PASS" : "FAIL",
      "https_enforced=" + pages.https_enforced,
    )
    add(
      "pages-cert-state",
      pages.cert_state ? "PASS" : "UNKNOWN",
      "state=" + (pages.cert_state || "<missing>"),
    )
    if (pages.cert_expires) {
      const d = Math.floor((new Date(pages.cert_expires).getTime() - NOW.getTime()) / 86400000)
      add(
        "pages-cert-expiry",
        d > 30 ? "PASS" : d >= 15 ? "WARNING" : "FAIL",
        "expires=" + pages.cert_expires + " days=" + d,
      )
    }
  }
  const tlsInfo = input.tls || {}
  if (!tlsInfo.ok) add("tls-handshake", "FAIL", "TLS 握手失败: " + (tlsInfo.error || ""))
  else {
    add("tls-authorized", tlsInfo.authorized ? "PASS" : "FAIL", "authorized=" + tlsInfo.authorized)
    add(
      "tls-hostname",
      String(tlsInfo.subjectaltname || "").includes("DNS:" + DOMAIN) ? "PASS" : "FAIL",
      "SAN=" + String(tlsInfo.subjectaltname || "").slice(0, 120),
    )
    const days = tlsInfo.days
    if (days === null || days === undefined) add("tls-expiry", "UNKNOWN", "证书到期时间未知")
    else if (days < 0) add("tls-expiry", "FAIL", "证书已过期 " + Math.abs(days) + " 天")
    else if (days <= 14) add("tls-expiry", "FAIL", "剩余 " + days + " 天")
    else if (days <= 30) add("tls-expiry", "WARNING", "剩余 " + days + " 天")
    else add("tls-expiry", "PASS", "剩余 " + days + " 天")
  }
  for (const page of input.https || []) {
    add(
      "https" + page.path,
      page.ok && page.status === 200 ? "PASS" : "FAIL",
      "status=" + (page.status || page.error) + (page.hasTitle ? " title=ok" : ""),
    )
  }
  const redirect = input.redirect || {}
  const loc = String(redirect.location || "")
  const isRedirect = [301, 302, 307, 308].includes(redirect.status)
  if (!isRedirect)
    add("http-redirect", "FAIL", "HTTP 未返回 3xx: " + (redirect.status || redirect.error))
  else if (!/^https:\/\/wiki\.oreki\.net(\/|$|[?#])/.test(loc))
    add("http-redirect", "FAIL", "跳转目标不符: " + loc)
  else add("http-redirect", "PASS", "3xx -> " + loc)
  const dns = input.dns || {}
  if (dns.error) add("dns", "UNKNOWN", "dig 不可用或失败: " + dns.error)
  else {
    const cnameOk = (dns.cname || []).some((c) => /orekidawson\.github\.io\.?$/i.test(c))
    add("dns-cname", cnameOk ? "PASS" : "FAIL", "CNAME=" + JSON.stringify(dns.cname || []))
    // CNAME 到 GitHub Pages 时，A/AAAA 记录是 GitHub 自带托管记录（正常），不能当冲突。
    if ((dns.a || []).length) {
      add(
        "dns-a-records",
        cnameOk ? "PASS" : "WARNING",
        "A 记录（CNAME " +
          (cnameOk ? "已正确，属 GitHub Pages 托管）" : "未指向 github.io，需检查）") +
          ": " +
          JSON.stringify(dns.a),
      )
    }
    if ((dns.aaaa || []).length) {
      add(
        "dns-aaaa-records",
        cnameOk ? "PASS" : "WARNING",
        "AAAA 记录: " + JSON.stringify(dns.aaaa),
      )
    }
    if ((dns.caa || []).length) {
      const ok =
        dns.caa.some((r) => /letsencrypt/i.test(r)) || dns.caa.every((r) => !/0 issue/i.test(r))
      add("dns-caa", ok ? "PASS" : "FAIL", "CAA=" + JSON.stringify(dns.caa))
    } else add("dns-caa", "PASS", "无 CAA 限制")
    const vals = Object.entries(dns.resolvers || {}).filter(([, v]) => Array.isArray(v))
    if (vals.length >= 2) {
      const normalized = vals.map(([, v]) => JSON.stringify(v).toLowerCase())
      add(
        "dns-resolver-consistency",
        new Set(normalized).size === 1 ? "PASS" : "WARNING",
        "多个解析器结果: " + JSON.stringify(dns.resolvers),
      )
    }
  }
  const worst = checks.some((c) => c.state === "FAIL")
    ? "FAIL"
    : checks.some((c) => c.state === "WARNING")
      ? "WARNING"
      : checks.some((c) => c.state === "UNKNOWN")
        ? "UNKNOWN"
        : "PASS"
  return { overall: worst, checks }
}

function findAlertIssue() {
  try {
    const raw = sh("gh", ["api", "repos/" + REPO + "/issues/" + ALERT_ISSUE])
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function bodyWithState(issue, result, collected) {
  const marker =
    "<!-- https-monitor:v1 status=" +
    result.overall +
    " evidence=" +
    createHash("sha256").update(JSON.stringify(result.checks)).digest("hex").slice(0, 12) +
    " -->"
  const lines = result.checks.map((c) => "- [" + c.state + "] " + c.id + " — " + c.detail)
  const header = ["## wiki.oreki.net HTTPS 每日监测", "", marker]
  const meta = [
    "",
    "检查时间（UTC+8）：" +
      new Date(NOW.getTime() + 8 * 3600000).toISOString().replace("Z", "+08:00"),
    "Commit：" + (SHA || "<local>"),
    "Run：" + RUN_ID,
    "总体状态：" + result.overall,
    "",
    "### 检查明细",
  ]
  const footer = [
    "",
    "### 处置",
    result.overall === "PASS"
      ? "全部通过；无需人工操作。"
      : "按明细处理：若证书尚未签发，等待 GitHub Pages 自动签发；不得手动上传或重复申请证书。若 https_enforced=false，需 Pages 管理权限在 Settings 中启用 Enforce HTTPS。",
  ]
  return header.concat(meta, lines, footer).join("\n")
}

async function main() {
  let input
  if (FIXTURE) {
    input = JSON.parse(fs.readFileSync(FIXTURE, "utf8"))
  } else {
    const [pages, tlsInfo, httpsPages, redirect, dns] = await Promise.all([
      collectPages(),
      collectTls(),
      collectHttps(),
      collectRedirect(),
      Promise.resolve(collectDns()),
    ])
    input = { pages, tls: tlsInfo, https: httpsPages, redirect, dns }
  }
  const result = evaluate(input)
  console.log(JSON.stringify(result, null, 1))
  if (FIXTURE || process.env.KB_NO_ALERT) return
  const issue = findAlertIssue()
  if (!issue) {
    console.error("找不到告警 Issue #" + ALERT_ISSUE)
    process.exitCode = 2
    return
  }
  const newBody = bodyWithState(issue, result, input)
  const same = (issue.body || "").includes("<!-- https-monitor:v1")
  const changed = !same || !(issue.body || "").includes("总体状态：" + result.overall)
  try {
    if (changed) {
      const tmpBody = "/tmp/https-monitor-body.json"
      fs.writeFileSync(tmpBody, JSON.stringify({ body: newBody }))
      sh("gh", [
        "api",
        "-X",
        "PATCH",
        "repos/" + REPO + "/issues/" + ALERT_ISSUE,
        "--input",
        tmpBody,
      ])
      const summary =
        result.overall === "PASS"
          ? "检查通过（含证书与强制 HTTPS）"
          : "检测到 " + result.overall + "，见 Issue 正文明细"
      const tmpComment = "/tmp/https-monitor-comment.json"
      fs.writeFileSync(
        tmpComment,
        JSON.stringify({ body: "每日监测 Run " + RUN_ID + "：" + summary }),
      )
      sh("gh", [
        "api",
        "-X",
        "POST",
        "repos/" + REPO + "/issues/" + ALERT_ISSUE + "/comments",
        "--input",
        tmpComment,
      ])
    }
    if (result.overall === "PASS" && issue.state === "open") {
      sh("gh", [
        "api",
        "-X",
        "PATCH",
        "repos/" + REPO + "/issues/" + ALERT_ISSUE,
        "-f",
        "state=closed",
      ])
    } else if (result.overall !== "PASS" && issue.state !== "open") {
      sh("gh", [
        "api",
        "-X",
        "PATCH",
        "repos/" + REPO + "/issues/" + ALERT_ISSUE,
        "-f",
        "state=open",
      ])
    }
  } catch (err) {
    console.error("告警更新失败: " + String(err).slice(0, 300))
    process.exitCode = 2
  }
  // WARNING 是可运行状态（如证书剩余天数 15-30 天），不作为失败；FAIL/UNKNOWN 才返回非零。
  process.exitCode = result.overall === "FAIL" || result.overall === "UNKNOWN" ? 1 : 0
}

if (import.meta.url === "file://" + process.argv[1]) main()
