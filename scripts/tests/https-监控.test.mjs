import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { evaluate, HTTPS_SMOKE_PATHS, SITE_TITLE, collectHttps } from "../https-monitor.mjs";

const base = () => ({
  pages: { ok: true, cname: "wiki.oreki.net", https_enforced: true, cert_state: "approved", cert_expires: new Date(Date.now() + 90 * 86400000).toISOString() },
  tls: { ok: true, authorized: true, subjectaltname: "DNS:wiki.oreki.net", days: 45 },
  https: [ { path: "/", ok: true, status: 200, hasTitle: true }, { path: "/index.html", ok: true, status: 200, hasTitle: true } ],
  redirect: { ok: true, status: 301, location: "https://wiki.oreki.net/" },
  dns: { cname: ["orekidawson.github.io."], a: [], aaaa: [], caa: [], resolvers: { "1.1.1.1": ["orekidawson.github.io."], "8.8.8.8": ["orekidawson.github.io."] } },
});

test("正常证书 PASS", () => {
  assert.equal(evaluate(base()).overall, "PASS");
});

test("15-30 天 WARNING", () => {
  const input = base(); input.tls.days = 20;
  const r = evaluate(input);
  assert.equal(r.overall, "WARNING");
  assert.equal(r.checks.find((c) => c.id === "tls-expiry").state, "WARNING");
});

test("0-14 天 FAIL", () => {
  const input = base(); input.tls.days = 10;
  assert.equal(evaluate(input).overall, "FAIL");
});

test("已过期 FAIL", () => {
  const input = base(); input.tls.days = -3;
  const r = evaluate(input);
  assert.equal(r.overall, "FAIL");
  assert.match(r.checks.find((c) => c.id === "tls-expiry").detail, /已过期/);
});

test("HTTPS 未强制 FAIL", () => {
  const input = base(); input.pages.https_enforced = false;
  const r = evaluate(input);
  assert.equal(r.overall, "FAIL");
  assert.equal(r.checks.find((c) => c.id === "https-enforced").state, "FAIL");
});

test("域名不匹配 FAIL", () => {
  const input = base(); input.tls.subjectaltname = "DNS:example.com";
  const r = evaluate(input);
  assert.equal(r.overall, "FAIL");
  assert.equal(r.checks.find((c) => c.id === "tls-hostname").state, "FAIL");
});

test("DNS 错误 FAIL", () => {
  const input = base(); input.dns.cname = ["somewhere-else.example."];
  const r = evaluate(input);
  assert.equal(r.overall, "FAIL");
  assert.equal(r.checks.find((c) => c.id === "dns-cname").state, "FAIL");
});

test("HTTP 未跳转 FAIL", () => {
  const input = base(); input.redirect = { ok: true, status: 200, location: "" };
  const r = evaluate(input);
  assert.equal(r.overall, "FAIL");
  assert.equal(r.checks.find((c) => c.id === "http-redirect").state, "FAIL");
});

test("TLS 错误不得降级 HTTP：HTTPS 页面仍 FAIL", () => {
  const input = base(); input.tls = { ok: false, error: "certificate has expired" };
  input.https = [{ path: "/", ok: false, error: "certificate has expired", status: null, hasTitle: false }];
  const r = evaluate(input);
  assert.equal(r.overall, "FAIL");
  assert.equal(r.checks.find((c) => c.id === "https/").state, "FAIL");
});

test("Pages API 不可读时 UNKNOWN（不假报 PASS）", () => {
  const input = base(); input.pages = { ok: false, error: "404" };
  const r = evaluate(input);
  assert.equal(r.overall, "UNKNOWN");
});

test("跳转到非预期域名 FAIL", () => {
  const input = base(); input.redirect = { ok: true, status: 302, location: "https://example.com/" };
  assert.equal(evaluate(input).overall, "FAIL");
});

test("HTTPS 监控保留 Quartz 必需路径并排除已废弃索引", () => {
  for (const path of ["/", "/index.html", "/static/contentIndex.json"]) {
    assert.ok(HTTPS_SMOKE_PATHS.includes(path), `缺少必需路径 ${path}`);
  }
  assert.equal(HTTPS_SMOKE_PATHS.includes("/static/knowledge-index.json"), false);
});

test("HTTPS 冒烟确实请求生产清单，且不访问已废弃的知识索引", async () => {
  const requested = [];
  const response = await collectHttps({
    request: async (url) => {
      requested.push(new URL(url).pathname);
      return { ok: true, status: 200, body: `<title>${SITE_TITLE}</title>` };
    },
  });
  for (const path of [
    "/",
    "/index.html",
    "/static/contentIndex.json",
    "/player/",
    "/developer/",
    "/developer/architecture/kotlin-runtime",
  ]) {
    assert.ok(requested.includes(path), `实际请求缺少 ${path}`);
  }
  assert.ok(!requested.includes("/static/knowledge-index.json"), "不可请求已废弃的知识索引");
  assert.deepEqual(response.map((item) => item.path), requested);
  assert.ok(response.every((item) => item.ok && item.status === 200));
  for (const item of response.filter((i) => !i.path.endsWith(".json"))) {
    assert.equal(item.hasTitle, true, `${item.path} 缺少真实站点标题`);
  }
});

test("HTTPS 冒烟可以扩展合法页面，且不会将路径常量锁死", async () => {
  const urls = [];
  await collectHttps({
    // 显式固定域名：避免运行环境设置 KB_DOMAIN 时产生与被测行为无关的误报。
    domain: "wiki.oreki.net",
    paths: ["/", "/wiki-rules"],
    request: async (url) => {
      urls.push(url);
      return { ok: true, status: 200, body: "" };
    },
  });
  assert.deepEqual(urls, ["https://wiki.oreki.net/", "https://wiki.oreki.net/wiki-rules"]);
});

test("仅 HTML 路由与 .html 参与标题判定，静态资源一律跳过", async () => {
  const responses = await collectHttps({
    paths: ["/", "/index.html", "/static/contentIndex.json", "/robots.txt"],
    domain: "wiki.oreki.net",
    request: async () => ({
      ok: true,
      status: 200,
      // 所有桩正文都包含标题，确保用例只依赖 isHtml 白名单而非正文内容。
      body: `<title>${SITE_TITLE}</title>`,
    }),
  });
  assert.deepEqual(responses.map((item) => item.hasTitle), [true, true, false, false]);
});

test("SITE_TITLE 与 quartz.config.yaml 的 pageTitle 保持一致", () => {
  const cfg = fs.readFileSync(new URL("../../quartz.config.yaml", import.meta.url), "utf8");
  // 兼容 YAML 双引号、单引号与裸标量写法，并忽略行内注释。
  const matched = cfg.match(/^\s*pageTitle:\s*(?:"([^"]*)"|'([^']*)'|([^#\s][^#]*?))\s*(?:#.*)?$/m);
  assert.ok(matched, "quartz.config.yaml 缺少 pageTitle");
  const pageTitle = [matched[1], matched[2], matched[3]].find((value) => value !== undefined).trim();
  assert.equal(SITE_TITLE, pageTitle, "监控标题常量与站点配置漂移");
});
