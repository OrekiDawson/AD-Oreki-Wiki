// 本地最小扩展：复用官方 @quartz-community/explorer，仅注入固定的一级目录语义顺序。
// 目的：稳定语义顺序（游戏总览 → … → 历史归档 → 站务），不移动文件、不改 URL、不做 DOM hack。
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

// 一级目录固定语义顺序（slug = 目录名/文件名；不随显示名变化，URL 不变）。
function compare(a, b) {
  const ROOT_ORDER = [
    "player", // 1 玩家专区
    "developer", // 2 开发者专区
  ];
  // 末尾独立站务区（页脚也有固定链接）。
  const STATION = { "wiki-rules": 200, copyright: 201, "how-to-use": 202 };
  const rank = (node) => {
    if (!node || !node.slugSegment) return 100;
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
    copyright: "版权与许可",
    "how-to-use": "本站使用说明",
  };
  if (node && node.slugSegment && SIDEBAR_LABEL[node.slugSegment]) {
    node.displayName = SIDEBAR_LABEL[node.slugSegment];
  }
  return node;
}

export function OrderedExplorer(opts = {}) {
  return Explorer({ ...opts, sortFn: compare, mapFn: mapNode });
}
