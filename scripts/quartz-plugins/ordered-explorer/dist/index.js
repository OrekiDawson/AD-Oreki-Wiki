// 本地最小扩展：复用官方 @quartz-community/explorer，仅注入固定的一级目录语义顺序。
// 目的：稳定语义顺序（玩家专区 → 开发者专区 → 站务），不移动文件、不改 URL、不做 DOM hack。
// 说明：官方 Explorer 通过 options.sortFn / mapFn 支持自定义排序与显示名（见其 dist/index.d.ts），
// 但 quartz.config.yaml 无法表达函数；因此以本地组件插件方式注入。未修改官方包。
//
// 注意：Explorer 会把 sortFn/mapFn 用 toString() 序列化到前端 new Function 执行，
// 这两个函数必须**自包含**（不能引用模块作用域变量），常量需写在函数体内。
import path from "node:path";
import { pathToFileURL } from "node:url";
import fs from "node:fs";

// 以构建目录为基准解析官方 Explorer（npm ci 固定安装，即使 config 中禁用该条目仍存在）。
const explorerModule = await import(
  pathToFileURL(path.join(process.cwd(), "node_modules/@quartz-community/explorer/dist/index.js")).href
);
const Explorer = explorerModule.Explorer;

// 统一导航模型是唯一分类、顺序和侧栏短标题来源；生成索引与 CI 也读取同一份 JSON。
const navigationModel = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts/navigation-model.json"), "utf8"));
const modelSource = JSON.stringify(navigationModel);
const compare = new Function("return function compare(a, b) {" +
  "const MODEL = " + modelSource + ";" +
  "const route = (node) => '/' + String(node?.slug || '').replace(/\\/index$/, '');" +
  "const matches = (rule, value) => (rule.exact || []).includes(value) || (rule.prefixes || []).some((prefix) => value === prefix.replace(/\\/$/, '') || value.startsWith(prefix));" +
  "const category = (value) => { for (const rootKey of ['player','developer','station']) { const rules = MODEL.categories[rootKey] || []; const exact = rules.find((rule) => (rule.exact || []).includes(value)); if (exact) return { rootKey, rule: exact }; } for (const rootKey of ['player','developer','station']) { const rule = (MODEL.categories[rootKey] || []).find((candidate) => matches(candidate, value)); if (rule) return { rootKey, rule }; } return null; };" +
  "const rank = (node) => { const value = route(node); const root = MODEL.root.find((item) => item.key === node?.slugSegment); if (root) return root.order * 1000; const group = category(value); if (group) return (MODEL.root.find((item) => item.key === group.rootKey)?.order || 999) * 1000 + group.rule.order; const label = MODEL.stationLabels[node?.slugSegment]; return label ? 90000 : 50000; };" +
  "const ra = rank(a), rb = rank(b); if (ra !== rb) return ra - rb; return (a.displayName || '').localeCompare((b.displayName || ''), undefined, { numeric: true, sensitivity: 'base' });" +
"}")();
const mapNode = new Function("return function mapNode(node) {" +
  "const MODEL = " + modelSource + ";" +
  "const key = '/' + String(node?.slug || '').replace(/\\/index$/, '');" +
  "const labelKey = node?.slugSegment;" +
  "if (node && MODEL.folderLabels[key]) node.displayName = MODEL.folderLabels[key];" +
  "if (node && !node.isFolder && MODEL.stationLabels[labelKey]) node.displayName = MODEL.stationLabels[labelKey];" +
  "if (node && node.isFolder && (!node.children || node.children.length === 0) && node.data) node.isFolder = false;" +
  "return node;" +
"}")();

export function OrderedExplorer(opts = {}) {
  const explorer = Explorer({
    ...opts,
    sortFn: compare,
    mapFn: mapNode,
    filterFn: (node) => !(node.isFolder && (!node.children || node.children.length === 0) && !node.data),
  });
  const expandCurrent = `
document.addEventListener("nav", () => {
  window.setTimeout(() => {
    const explorer = document.querySelector(".explorer");
    if (!explorer) return;
    const current = location.pathname.replace(/^\\/+|\\/+$/g, "").split("/").filter(Boolean);
    for (const outer of explorer.querySelectorAll(".folder-outer")) {
      const path = outer.previousElementSibling?.dataset.folderpath || "";
      const parts = path.split("/").filter(Boolean);
      // 正式分类与条目始终可见；当前路径仍由 Explorer 自带 active 类高亮并滚动定位。
      const open = parts.length > 0;
      outer.classList.toggle("open", open);
      const parent = outer.previousElementSibling;
      if (parent) parent.querySelector(".folder-icon")?.setAttribute("aria-expanded", open ? "true" : "false");
    }
  }, 0);
}, { passive: true });
// current-page-ancestors: all formal folders remain visible after SPA navigation; active is positioned by Explorer.
`;
  explorer.afterDOMLoaded = [explorer.afterDOMLoaded || "", expandCurrent];
  return explorer;
}
