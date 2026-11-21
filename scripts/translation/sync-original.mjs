#!/usr/bin/env node
// 原版 Wiki 修订增量检查：只读比对清单 revid 与原站当前修订。
// 用法：
//   node scripts/translation/sync-original.mjs            # 检查（默认，不写文件）
//   node scripts/translation/sync-original.mjs --check    # 同上
//   node scripts/translation/sync-original.mjs --write    # 更新清单 revid/last_edited/last_source_check
//   --limit N   单次最多检查 N 页（默认 60；总上限 120）
// 速率：每页间隔 300ms；失败重试 2 次；不抓取正文、不下载图片。
import fs from "node:fs";

const MANIFEST = "docs/translation/source-manifest.json";
const API = "https://antimatterdimensions.wiki.gg/api.php";
const UA = "AD-Oreki-Wiki-translation/1.0 (+https://github.com/OrekiDawson/AD-Oreki-Wiki)";
const argv = process.argv.slice(2);
const write = argv.includes("--write");
const limitArg = argv.indexOf("--limit");
const limit = Math.min(120, Math.max(1, limitArg >= 0 ? Number(argv[limitArg + 1]) || 60 : 60));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = new URL(API);
  for (const [k, v] of Object.entries({ format: "json", formatversion: "2", ...params })) url.searchParams.set(k, String(v));
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } catch (e) { lastErr = e; await sleep(800 * (attempt + 1)); }
  }
  throw lastErr;
}

if (!fs.existsSync(MANIFEST)) { console.error("缺少清单 " + MANIFEST); process.exit(1); }
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const targets = manifest.pages.filter((p) => p.type === "article").slice(0, limit);
const stale = [];
const missing = [];
let checked = 0;

for (const page of targets) {
  const d = await api({ action: "query", prop: "revisions", pageids: page.pageid, rvprop: "ids|timestamp|user", rvlimit: "1" });
  const rev = (d.query?.pages?.[0]?.revisions || [])[0];
  checked += 1;
  if (!rev) { missing.push(page.title); await sleep(300); continue; }
  if (String(rev.revid) !== String(page.revid)) {
    stale.push({ title: page.title, old: page.revid, now: rev.revid, last_edited: rev.timestamp, last_editor: rev.user, status: page.status, path: page.path });
    if (write) { page.revid = rev.revid; page.last_edited = rev.timestamp; page.last_editor = rev.user; page.last_source_check = new Date().toISOString().slice(0, 10); }
  }
  await sleep(300);
}

if (write && stale.length) {
  manifest.generated_at = new Date().toISOString();
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + "\n");
}
console.log("检查页数: " + checked + "；原文有更新: " + stale.length + "；缺失页面: " + missing.length);
for (const s of stale) console.log("- STALE " + s.title + " revid " + s.old + " -> " + s.now + "（" + s.status + "，" + (s.path || "未翻译") + "）");
for (const m of missing) console.log("- MISSING " + m);
if (stale.length && !write) console.log("提示：加 --write 可更新清单中的 revid 与核对日期（不修改译文正文）。");
if (missing.length) process.exit(2);
