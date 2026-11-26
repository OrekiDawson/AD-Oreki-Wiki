#!/usr/bin/env node
// 翻译专区检查：清单一致性 / 页面来源与许可 / 状态 / 占位符 / 覆盖率
import fs from "node:fs";
import path from "node:path";

const MANIFEST = "docs/translation/source-manifest.json";
const PAGES_DIR = "content/player/original";
// 等级定义见 content/wiki-rules.md「内容验收等级」；STRUCTURE CHECKED 明确不算语义审校
const ALLOWED_STATUS = new Set(["NOT STARTED", "IN PROGRESS", "TRANSLATED", "STRUCTURE CHECKED", "REVIEWED", "VERIFIED AGAINST GAME", "BLOCKED"]);
const ALLOWED_REVIEW = new Set(["NOT REVIEWED", "TRANSLATED", "STRUCTURE CHECKED", "REVIEWED", "VERIFIED AGAINST GAME"]);
const REVIEW_DIR = "docs/translation/reviews";
const REQUIRED_FIELDS = [
  "original_title",
  "original_url",
  "original_revid",
  "original_fetched_at",
  "original_license",
  "original_license_url",
  "translation_status",
  "review_status",
];
let failed = 0;
const fail = (m) => { failed += 1; console.error("FAIL " + m); };
const warn = (m) => console.warn("WARN " + m);

if (!fs.existsSync(MANIFEST)) { console.error("FAIL 缺少翻译清单 " + MANIFEST); process.exit(1); }
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
if (manifest.schema !== 1) fail("清单 schema 必须为 1");
if (!Array.isArray(manifest.pages) || manifest.pages.length === 0) fail("清单 pages 为空");
if (!manifest.source || manifest.source.license !== "CC BY-SA 4.0") fail("清单缺少 CC BY-SA 4.0 来源许可");
const articles = manifest.pages.filter((p) => p.type === "article");
if (manifest.counts && manifest.counts.articles !== articles.length) fail("清单 counts.articles 与实际 article 数不一致");

const pages = fs.existsSync(PAGES_DIR)
  ? fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".md") && f !== "index.md")
  : [];
if (pages.length === 0) fail("翻译专区没有正文页面");

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const body = m[1];
  const out = {};
  for (const key of REQUIRED_FIELDS) {
    const mm = body.match(new RegExp("^" + key + ":\\s*[\"']?(.*?)[\"']?\\s*$", "m"));
    out[key] = mm ? mm[1].trim() : "";
  }
  out.raw = body;
  return out;
}

const seenTitles = new Set();
for (const file of pages) {
  const full = path.join(PAGES_DIR, file);
  const text = fs.readFileSync(full, "utf8");
  const fm = frontmatter(text);
  if (!fm) { fail("缺少 frontmatter: " + file); continue; }
  for (const key of REQUIRED_FIELDS) if (!fm[key]) fail(file + " 缺少字段 " + key);
  if (!ALLOWED_STATUS.has(fm.translation_status)) fail(file + " 非法 translation_status: " + fm.translation_status);
  if (!ALLOWED_REVIEW.has(fm.review_status)) fail(file + " 非法 review_status: " + fm.review_status);
  if (!fm.original_url.startsWith("https://antimatterdimensions.wiki.gg/wiki/")) fail(file + " original_url 不是原站链接");
  if (!/^\d+$/.test(fm.original_revid)) fail(file + " original_revid 必须是数字");
  if (fm.original_license !== "CC BY-SA 4.0") fail(file + " original_license 必须为 CC BY-SA 4.0");
  if (fm.original_license_url !== "https://creativecommons.org/licenses/by-sa/4.0/") fail(file + " original_license_url 必须是 CC BY-SA 4.0 链接");
  if (!seenTitles.has(fm.original_title)) seenTitles.add(fm.original_title);
  else fail("同一原文标题出现多个译文页: " + fm.original_title);

  // 来源与许可块
  if (!/## 来源与许可/.test(text)) fail(file + " 缺少「来源与许可」章节");
  if (!/CC BY-SA 4\.0/.test(text)) fail(file + " 缺少 CC BY-SA 4.0 说明");
  if (!/页面历史/.test(text)) fail(file + " 缺少原文贡献者/页面历史链接");
  if (!/已修改/.test(text)) fail(file + " 缺少「已修改」说明");
  if (!/原文图片未转载|图片未转载|媒体未转载/.test(text)) warn(file + " 未说明媒体是否转载");

  // 占位符
  if (/TODO|待补充|以下略|详见英文原文|（略）/.test(text)) fail(file + " 存在未完成占位符");

  // 清单对应
  const entry = articles.find((p) => p.title === fm.original_title);
  if (!entry) fail(file + " 在清单中找不到原文标题: " + fm.original_title);
  else {
    if (entry.status !== fm.translation_status) fail(file + " 清单状态不一致: " + entry.status + " vs " + fm.translation_status);
    if (entry.review_status !== fm.review_status) fail(file + " 清单校对状态不一致: " + entry.review_status + " vs " + fm.review_status);
    if (String(entry.revid) !== fm.original_revid) fail(file + " 清单修订 ID 不一致: " + entry.revid + " vs " + fm.original_revid);
    if (entry.path !== full) fail(file + " 清单 path 不一致: " + entry.path);
    if (entry.zh_title !== "") {
      const title = text.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1] ?? "";
      const comparableTitle = title.replace(/^原版:/, "");
      if (comparableTitle !== entry.zh_title) fail(file + " 中文标题与清单 zh_title 不一致: " + title + " vs " + entry.zh_title);
    }
  }
}

// 审校记录：REVIEWED / VERIFIED 必须有页面级记录（不能只凭结构核对就标「已审校」）
let reviewCorpus = "";
if (fs.existsSync(REVIEW_DIR)) {
  for (const f of fs.readdirSync(REVIEW_DIR).filter((f) => f.endsWith(".md"))) {
    reviewCorpus += fs.readFileSync(path.join(REVIEW_DIR, f), "utf8") + "\n";
  }
} else {
  warn("缺少审校记录目录 " + REVIEW_DIR);
}

// 清单中标记已翻译/已核对的页面必须存在
for (const p of articles) {
  if (["TRANSLATED", "STRUCTURE CHECKED", "REVIEWED", "VERIFIED AGAINST GAME"].includes(p.status)) {
    if (!p.path || !fs.existsSync(p.path)) fail("清单标记已翻译但页面不存在: " + p.title + " -> " + p.path);
  }
  if (["REVIEWED", "VERIFIED AGAINST GAME"].includes(p.status)) {
    const key = p.path || p.zh_title || p.title;
    const zhTitle = p.zh_title || "";
    const bareZhTitle = zhTitle.replace(/^原版:/, "");
    if (!reviewCorpus.includes(key) && !reviewCorpus.includes(zhTitle || "\u0000") && !reviewCorpus.includes(bareZhTitle || "\u0000")) {
      fail("清单标记 " + p.status + " 但缺少页面级审校记录: " + p.title);
    }
  }
  if (p.status === "BLOCKED" && !p.notes) warn("清单 BLOCKED 页缺少原因: " + p.title);
}

const reviewed = articles.filter((p) => ["REVIEWED", "VERIFIED AGAINST GAME"].includes(p.status)).length;
const verified = articles.filter((p) => p.status === "VERIFIED AGAINST GAME").length;
const structure = articles.filter((p) => p.status === "STRUCTURE CHECKED").length;
const translated = articles.filter((p) => p.status === "TRANSLATED").length;
const blocked = articles.filter((p) => p.status === "BLOCKED").length;
const coverage = articles.length ? ((reviewed / articles.length) * 100).toFixed(1) : "0.0";
const structureCoverage = articles.length ? ((structure / articles.length) * 100).toFixed(1) : "0.0";
console.log("已审校覆盖率: " + reviewed + "/" + articles.length + " (" + coverage + "%)；其中 VERIFIED " + verified + "；STRUCTURE CHECKED " + structure + "/" + articles.length + " (" + structureCoverage + "%)；TRANSLATED " + translated + "；BLOCKED " + blocked + "；页面 " + pages.length);

if (failed > 0) { console.error("翻译专区检查未通过: " + failed); process.exit(1); }
console.log("OK 翻译专区检查通过: 清单/来源/许可/状态/占位符均通过");
