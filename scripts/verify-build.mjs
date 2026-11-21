#!/usr/bin/env node
// 构建产物检查：双专区 / Quartz 原生搜索 / 中文类目 / 历史归档 / 旧 URL / 草稿隔离
import fs from "node:fs";
import path from "node:path";

const PUB = "public";
let failed = 0;
const fail = (m) => {
  failed += 1;
  console.error("FAIL " + m);
};
const exists = (p) => fs.existsSync(path.join(PUB, p));
const pageExists = (slug) =>
  exists(slug + ".html") || exists(path.join(slug, "index.html"));

if (!exists("index.html")) fail("缺少 public/index.html");
if (!fs.existsSync(path.join(PUB, "static"))) fail("缺少 public/static");
if (!fs.existsSync(path.join(PUB, "static", "contentIndex.json"))) fail("缺少搜索索引 static/contentIndex.json");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}
const htmlFiles = fs.existsSync(PUB) ? walk(PUB).filter((f) => f.endsWith(".html")) : [];
if (htmlFiles.length < 15) fail("HTML 页面数不足: " + htmlFiles.length);

// 未审核 AI 草稿不得进入公开 HTML 或 Quartz 内建搜索。
if (htmlFiles.some(file => file.includes(path.sep + "ai-drafts" + path.sep))) {
  fail("未审核 AI 草稿被输出成公开 HTML 页面");
}
try {
  const index = JSON.parse(fs.readFileSync(path.join(PUB, "static/contentIndex.json"), "utf8"));
  if (!index || typeof index !== "object" || Array.isArray(index)) throw new Error("搜索索引结构无效");
  for (const [slug, entry] of Object.entries(index)) {
    if (slug.includes("ai-drafts") || String(entry?.title ?? "").startsWith("AI 草稿：")) {
      fail("未审草稿出现在 Quartz 搜索索引中: " + slug);
    }
  }
} catch (error) { fail("无法可靠校验 Quartz 搜索索引: " + error.message); }

const home = fs.readFileSync(path.join(PUB, "index.html"), "utf8");
for (const term of ["玩家专区", "开发者专区", "知识库规则", "玩法机制"]) {
  if (!home.includes(term)) fail("首页缺少文案: " + term);
}

// 规则页、版权页、游戏总览、类目页
for (const slug of ["wiki-rules", "copyright", "antimatter-dimensions"]) {
  if (!pageExists(slug)) fail("缺少页面 /" + slug);
}
for (const slug of ["player", "developer", "player/getting-started", "developer/ai-summaries", "developer/evidence"]) {
  if (!pageExists(slug)) fail("缺少双专区页面: /" + slug);
}
// 类目显示名必须是中文（由各目录 index.md 的 title 提供）
const CATEGORY_TITLES = {
  "player/getting-started": "开始游玩 Oreki Edition",
  "player/gameplay": "玩法机制",
  "player/original": "原版 Wiki 中文翻译",
  "player/mods": "Oreki Edition 介绍",
  "player/download-and-version": "下载与版本说明",
  "player/faq": "玩家常见问题",
  "developer/architecture": "架构与运行时",
  "developer/reverse-engineering": "逆向与语义映射",
  "developer/build": "构建与交付",
  "developer/current": "当前状态",
  "developer/troubleshooting": "故障排查",
  "developer/references": "参考资料",
  "developer/history": "历史归档",
  "developer/evidence": "运行证据索引",
  "developer/ai-summaries": "AI Summary 索引",
};
for (const [dir, title] of Object.entries(CATEGORY_TITLES)) {
  const file = path.join(PUB, dir, "index.html");
  if (!fs.existsSync(file)) {
    fail("缺少类目页 /" + dir + "/");
    continue;
  }
  if (!fs.readFileSync(file, "utf8").includes(title)) fail("类目页 /" + dir + "/ 未显示中文类目名: " + title);
}

// 历史归档必须位于开发者专区，且至少有一条历史条目
if (!exists(path.join("developer", "history", "index.html"))) fail("缺少历史归档索引 /developer/history/");
const historyEntries = htmlFiles.filter(
  (f) => f.includes(path.sep + "developer" + path.sep + "history" + path.sep) &&
    path.basename(f) !== "index.html",
);
if (historyEntries.length < 3) {
  fail("历史归档条目不足（应把时间性材料移入 content/developer/history/）: " + historyEntries.length);
}

// 旧 URL 兼容：既有页面路径不得因专题化改造而消失
const LEGACY_URLS = [
  "gameplay",
  "original",
  "architecture",
  "reverse-engineering",
  "build",
  "current",
  "troubleshooting",
  "references",
  "history",
  "getting-started",
  "architecture/android",
  "architecture/kotlin-runtime",
  "architecture/web",
  "architecture/directory-migration",
  "reverse-engineering/dex-abi",
  "build/agp",
  "build/ci-cd",
  "build/r8",
  "build/signature-backfill",
  "build/build-mod-retirement",
  "gameplay/automation",
  "gameplay/challenges",
  "gameplay/saves",
  "gameplay/stage-gates",
  "current/project-status",
  "current/release-status",
  "current/known-issues",
  "getting-started/editorial-guidelines",
  "getting-started/how-to-use",
  "getting-started/project-overview",
  "references/source-index",
  "references/terminology",
  "troubleshooting/coroutine-abi",
  "troubleshooting/save-compatibility",
];
for (const slug of LEGACY_URLS) if (!pageExists(slug)) fail("旧页面 URL 丢失: /" + slug);

const LEGACY_URL_TARGETS = {
  "architecture/android": "developer/architecture/android",
  "architecture/kotlin-runtime": "developer/architecture/kotlin-runtime",
  "architecture/web": "developer/architecture/web",
  "architecture/directory-migration": "developer/architecture/directory-migration",
  "reverse-engineering/dex-abi": "developer/reverse-engineering/dex-abi",
  "build/agp": "developer/build/agp",
  "build/ci-cd": "developer/build/ci-cd",
  "build/r8": "developer/build/r8",
  "build/signature-backfill": "developer/build/signature-backfill",
  "build/build-mod-retirement": "developer/build/build-mod-retirement",
  "gameplay/automation": "player/gameplay/automation",
  "gameplay/challenges": "player/gameplay/challenges",
  "gameplay/saves": "player/gameplay/saves",
  "gameplay/stage-gates": "player/gameplay/stage-gates",
  "current/project-status": "developer/current/project-status",
  "current/release-status": "developer/current/release-status",
  "current/known-issues": "developer/current/known-issues",
  "getting-started/editorial-guidelines": "developer/editorial-guidelines",
  "getting-started/how-to-use": "how-to-use",
  "getting-started/project-overview": "developer/project-overview",
  "references/source-index": "developer/references/source-index",
  "references/terminology": "player/terminology",
  "troubleshooting/coroutine-abi": "developer/troubleshooting/coroutine-abi",
  "troubleshooting/save-compatibility": "developer/troubleshooting/save-compatibility",
};
for (const [legacy, target] of Object.entries(LEGACY_URL_TARGETS)) {
  const aliasFile = path.join(PUB, legacy + ".html");
  if (!fs.existsSync(aliasFile)) continue;
  const html = fs.readFileSync(aliasFile, "utf8");
  if (!html.includes(target) || !html.includes('http-equiv="refresh"')) {
    fail("旧页面兼容目标错误: /" + legacy + " -> /" + target);
  }
}

// 新增主题条目
for (const slug of [
  "player/index",
  "developer/index",
  "developer/architecture/parity",
  "developer/build/apk-signing",
  "player/gameplay/progression-infinity-eternity",
  "player/gameplay/reality-time-studies",
  "player/gameplay/celestials",
  "player/gameplay/original-vs-mod",
  "player/original/index",
  "player/original/ow-infinity",
  "player/original/ow-dimensions",
  "player/original/ow-replicanti",
  "player/original/ow-eternity",
  "player/original/ow-break-infinity",
  "player/original/ow-time-dimensions",
  "player/original/ow-eternity-challenges",
  "player/original/ow-dilation",
]) {
  if (!pageExists(slug)) fail("缺少新增主题条目: /" + slug);
}

// 原版翻译专区：类目页与译文必须显示 CC BY-SA 4.0 与来源说明
if (fs.existsSync(path.join(PUB, "player", "original", "index.html"))) {
  const originalIndex = fs.readFileSync(path.join(PUB, "player", "original", "index.html"), "utf8");
  if (!originalIndex.includes("CC BY-SA 4.0")) fail("原版翻译专区首页缺少 CC BY-SA 4.0 说明");
  if (!originalIndex.includes("来源")) fail("原版翻译专区首页缺少来源说明");
}
for (const rel of ["player/original/ow-infinity.html", "player/original/ow-dimensions.html"]) {
  const full = path.join(PUB, rel);
  if (!fs.existsSync(full)) { fail("缺少翻译页: " + rel); continue; }
  const html = fs.readFileSync(full, "utf8");
  if (!html.includes("来源与许可")) fail("翻译页缺少来源与许可块: " + rel);
  if (!html.includes("antimatterdimensions.wiki.gg")) fail("翻译页缺少原文链接: " + rel);
}

// 旧目录页继续可访问，并明确指向新专区。
for (const [legacy, zone] of Object.entries({
  gameplay: "player/gameplay",
  original: "player/original",
  "getting-started": "player/getting-started",
  architecture: "developer/architecture",
  "reverse-engineering": "developer/reverse-engineering",
  build: "developer/build",
  current: "developer/current",
  troubleshooting: "developer/troubleshooting",
  references: "developer/references",
  history: "developer/history",
})) {
  const file = path.join(PUB, legacy, "index.html");
  if (!fs.existsSync(file)) {
    fail("旧目录入口丢失: /" + legacy + "/");
    continue;
  }
  if (!fs.readFileSync(file, "utf8").includes(`/${zone}/`)) {
    fail("旧目录入口未链接新专区: /" + legacy + "/");
  }
}

// AI Summary 仅允许在开发者专区公开，并须默认折叠、带审核标识。
const aiSummary = path.join(PUB, "developer", "ai-summaries", "index.html");
if (fs.existsSync(aiSummary)) {
  const html = fs.readFileSync(aiSummary, "utf8");
  if (!html.includes("审核日期") || !html.includes("<details")) {
    fail("AI Summary 索引缺少审核标识或默认折叠结构");
  }
}

// 旧兼容 stub、AI 草稿均不得进入 Quartz 搜索索引。
const contentIndexPath = path.join(PUB, "static/contentIndex.json");
if (fs.existsSync(contentIndexPath)) {
  const searchIndex = JSON.parse(fs.readFileSync(contentIndexPath, "utf8"));
  const keys = Object.keys(searchIndex);
  if (!keys.some(key => key === "player" || key.startsWith("player/"))) {
    fail("Quartz 搜索索引缺少玩家专区");
  }
  if (!keys.some(key => key === "developer" || key.startsWith("developer/"))) {
    fail("Quartz 搜索索引缺少开发者专区");
  }
  for (const legacy of ["gameplay", "original", "architecture", "history"]) {
    if (keys.some(key => key === legacy || key.startsWith(legacy + "/"))) {
      fail("旧兼容目录仍出现在搜索索引: /" + legacy + "/");
    }
  }
}

if (failed > 0) {
  console.error("构建产物检查未通过: " + failed);
  process.exit(1);
}
console.log("OK 构建产物检查通过: " + htmlFiles.length + " 个 HTML 页面；类目中文名、历史归档、旧 URL 与新条目均通过");
