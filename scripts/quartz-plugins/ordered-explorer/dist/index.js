// 本地最小扩展：复用官方 @quartz-community/explorer，仅注入固定的一级目录语义顺序。
// 目的：稳定语义顺序（玩家专区 → 开发者专区 → 站务），不移动文件、不改 URL、不做 DOM hack。
// 说明：官方 Explorer 通过 options.sortFn / mapFn 支持自定义排序与显示名（见其 dist/index.d.ts），
// 但 quartz.config.yaml 无法表达函数；因此以本地组件插件方式注入。未修改官方包。
//
// 注意：Explorer 会把 sortFn/mapFn 用 toString() 序列化到前端 new Function 执行，
// 这两个函数必须**自包含**（不能引用模块作用域变量），常量需写在函数体内。
import path from "node:path";
import { pathToFileURL } from "node:url";

// 以构建目录为基准解析官方 Explorer（npm ci 固定安装，即使 config 中禁用该条目仍存在）。
const explorerModule = await import(
  pathToFileURL(path.join(process.cwd(), "node_modules/@quartz-community/explorer/dist/index.js")).href
);
const Explorer = explorerModule.Explorer;

// 一级目录和开发者专区固定语义顺序（slug = 目录名/文件名；不随显示名变化，URL 不变）。
function compare(a, b) {
  const ROOT_ORDER = [
    "player", // 1 玩家专区
    "developer", // 2 开发者专区
  ];
  // 末尾独立站务区（页脚也有固定链接）。
  const STATION = {
    "all-entries": 90,
    "recent-updates": 91,
    "wiki-rules": 200,
    "wiki-not": 201,
    copyright: 202,
    "how-to-use": 203,
  };
  const DEVELOPER_ORDER = {
    "developer": 0,
    "developer/first-contribution": 10,
    "developer/project-overview": 20,
    "developer/architecture": 30,
    "developer/reverse-engineering": 40,
    "developer/build": 50,
    "developer/troubleshooting": 60,
    "developer/current": 70,
    "developer/references": 80,
    "developer/evidence": 90,
    "developer/ai-summaries": 100,
    "developer/editorial-guidelines": 110,
  };
  const rank = (node) => {
    if (!node || !node.slugSegment) return 100;
    if (DEVELOPER_ORDER[node.slug] !== undefined) return DEVELOPER_ORDER[node.slug];
    if (STATION[node.slugSegment] !== undefined) return STATION[node.slugSegment];
    const idx = ROOT_ORDER.indexOf(node.slugSegment);
    return idx === -1 ? 100 : idx;
  };
  const ra = rank(a);
  const rb = rank(b);
  if (ra !== rb) return ra - rb;
  // 非一级节点沿用官方默认排序，避免改变既有子目录顺序。
  return (a.displayName || "").localeCompare(b.displayName || "", undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

// 仅侧栏显示名覆盖：站务规则标题过长→短名；其余保持页面标题不变。
function mapNode(node) {
  const SIDEBAR_LABEL = {
    player: "玩家专区",
    developer: "开发者专区",
    "wiki-rules": "知识库规则",
    "wiki-not": "本站不是什么",
    copyright: "版权与许可",
    "how-to-use": "本站使用说明",
    "developer/first-contribution": "第一次改动",
    "developer/project-overview": "项目概览",
    "developer/architecture": "系统架构",
    "developer/reverse-engineering": "源码与逆向",
    "developer/build": "构建与发布",
    "developer/troubleshooting": "故障排查",
    "developer/current": "项目状态",
    "developer/references": "参考资料",
    "developer/evidence": "运行证据",
    "developer/ai-summaries": "AI 摘要",
    "developer/editorial-guidelines": "编辑指南",
    "developer/architecture/android": "Android 架构",
    "developer/architecture/web": "Web 架构",
    "developer/architecture/parity": "双端一致性",
    "developer/architecture/celestial-implementation": "天神实现",
    "developer/architecture/numeric-model": "超大数值",
    "developer/architecture/kotlin-runtime": "Kotlin 运行时",
    "developer/reverse-engineering/dex-abi": "DEX 与 ABI",
    "developer/build/agp": "AGP 构建",
    "developer/build/r8": "R8",
    "developer/build/apk-signing": "APK 签名",
    "developer/build/ci-cd": "CI/CD",
    "developer/troubleshooting/coroutine-abi": "协程 ABI",
    "developer/troubleshooting/save-compatibility": "存档兼容",
    "developer/current/known-issues": "已知问题",
    "developer/current/project-status": "双端状态",
    "developer/current/release-status": "发布资格",
    "developer/references/source-index": "来源索引",
  };
  if (node && node.slug && SIDEBAR_LABEL[node.slug]) {
    node.displayName = SIDEBAR_LABEL[node.slug];
  }
  return node;
}

export function OrderedExplorer(opts = {}) {
  const explorer = Explorer({ ...opts, sortFn: compare, mapFn: mapNode });
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
