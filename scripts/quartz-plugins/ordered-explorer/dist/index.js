// 本地最小扩展：复用官方 @quartz-community/explorer，注入固定的一级目录与开发专题语义顺序。
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
  const ROOT_ORDER = ["player","developer","all-entries","wiki-rules","wiki-not","copyright","how-to-use"];
  // 同一分类中按阅读路线排列，而非按中文标题排序。
  const CHILD_ORDER = {
    "developer/architecture/parity": 1,
    "developer/architecture/numeric-model": 2,
    "developer/architecture/save-progress-comparator": 3,
    "developer/architecture/effect-model": 4,
    "developer/architecture/derived-state-invalidation": 5,
    "developer/architecture/scheduler-state-machine": 6,
    "developer/architecture/automation-ownership": 7,
    "developer/architecture/celestial-implementation": 8,
    "developer/architecture/tutorial-content-pipeline": 9,
    "developer/architecture/android": 10,
    "developer/architecture/directory-migration": 11,
    "developer/architecture/kotlin-runtime": 12,
    "developer/architecture/gui-stage-gates": 13,
    "developer/architecture/android-gui-sync": 14,
    "developer/architecture/web": 15,
    "developer/architecture/web-ui-reactivity": 16,
    "developer/architecture/web-offline-simulation": 17,
    "developer/reverse-engineering/decompilation": 1,
    "developer/reverse-engineering/smali-recovery": 2,
    "developer/reverse-engineering/dex-abi": 3,
    "developer/build/agp": 1,
    "developer/build/build-mod-retirement": 2,
    "developer/build/r8": 3,
    "developer/build/apk-signing": 4,
    "developer/build/signature-backfill": 5,
    "developer/build/artifact-provenance": 6,
    "developer/build/ci-cd": 7,
    "developer/troubleshooting/save-compatibility": 1,
    "developer/troubleshooting/coroutine-abi": 2,
    "developer/troubleshooting/web-module-startup": 3,
    "developer/troubleshooting/web-pages-artifact-integrity": 4,
    "developer/current/project-status": 1,
    "developer/current/known-issues": 2,
    "developer/current/release-status": 3,
    "player/getting-started": 1,
    "player/download-and-version": 2,
    "player/antimatter-dimensions": 3,
    "player/antimatter-dimensions-core-loop": 4,
    "player/antimatter-dimensions-decisions": 5,
    "player/gameplay": 6,
    "player/mods": 7,
    "player/faq": 8,
    "player/terminology": 9,
    "player/original": 10,
    "player/getting-started/first-session": 1,
    "player/getting-started/first-crunch": 2,
    "player/download-and-version/android": 1,
    "player/download-and-version/web": 2,
    "player/gameplay/stage-progression": 1,
    "player/gameplay/infinity": 2,
    "player/gameplay/progression-infinity-eternity": 3,
    "player/gameplay/eternity": 4,
    "player/gameplay/time-studies": 5,
    "player/gameplay/reality-time-studies": 6,
    "player/gameplay/reality": 7,
    "player/gameplay/celestials": 8,
    "player/gameplay/celestial-realities": 9,
    "player/gameplay/challenges": 10,
    "player/gameplay/challenge-troubleshooting": 11,
    "player/gameplay/automation": 12,
    "player/gameplay/stage-gates": 13,
    "player/gameplay/saves": 14,
    "player/gameplay/original-vs-mod": 15,
    "player/gameplay/mod-changes": 16,
    "player/gameplay/platform-differences": 17,
    "player/faq/platform-and-version": 1,
    "player/faq/progression": 2,
    "player/faq/automation-and-unlocks": 3,
    "player/faq/saves-and-compatibility": 4,
    "player/original/ow-antimatter-dimensions": 1,
    "player/original/ow-dimensions": 2,
    "player/original/ow-dimension-boosts": 3,
    "player/original/ow-dimensional-sacrifice": 4,
    "player/original/ow-antimatter-galaxies": 5,
    "player/original/ow-prestige": 6,
    "player/original/ow-automation": 7,
    "player/original/ow-normal-challenges": 8,
    "player/original/ow-infinity": 9,
    "player/original/ow-infinity-upgrades": 10,
    "player/original/ow-infinity-upgrades-upgrades": 11,
    "player/original/ow-break-infinity": 12,
    "player/original/ow-infinity-dimensions": 13,
    "player/original/ow-infinity-challenges": 14,
    "player/original/ow-replicanti": 15,
    "player/original/ow-eternity": 16,
    "player/original/ow-eternity-upgrades": 17,
    "player/original/ow-eternity-milestones": 18,
    "player/original/ow-time-studies": 19,
    "player/original/ow-time-dimensions": 20,
    "player/original/ow-eternity-challenges": 21,
    "player/original/ow-eternity-challenges-challenges": 22,
    "player/original/ow-dilation": 23,
    "player/original/ow-dilation-upgrades": 24,
    "player/original/ow-reality": 25,
    "player/original/ow-reality-upgrades": 26,
    "player/original/ow-perks": 27,
    "player/original/ow-black-hole": 28,
    "player/original/ow-celestials": 29,
    "player/original/ow-celestial-navigation": 30,
    "player/original/ow-celestial-navigation-gallery": 31,
    "player/original/ow-teresa": 32,
    "player/original/ow-effarig": 33,
    "player/original/ow-effarig-quotes": 34,
    "player/original/ow-nameless-ones": 35,
    "player/original/ow-nameless-ones-quotes": 36,
    "player/original/ow-v": 37,
    "player/original/ow-v-quotes": 38,
    "player/original/ow-ra": 39,
    "player/original/ow-ra-quotes": 40,
    "player/original/ow-charged-infinity-upgrades": 41,
    "player/original/ow-glyph-alchemy": 42,
    "player/original/ow-laitela": 43,
    "player/original/ow-laitela-quotes": 44,
    "player/original/ow-imaginary-upgrades": 45,
    "player/original/ow-pelle": 46,
    "player/original/ow-pelle-upgrades": 47,
    "player/original/ow-eternity-challenges-challenges-pelle": 48,
    "player/original/ow-dilation-upgrades-doomed": 49,
    "player/original/ow-tickspeed-galaxy-breakdown-doomed": 50,
    "player/original/ow-terminology": 51,
    "player/original/ow-challenges": 52,
    "player/original/ow-achievements": 53,
    "player/original/ow-achievements-secret-achievements": 54,
    "player/original/ow-tickspeed": 55,
    "player/original/ow-notations": 56,
    "player/original/ow-shortcuts": 57,
    "player/original/ow-save-bank": 58,
    "player/original/ow-ad-bonus": 59,
    "player/original/ow-mods": 60,
    "developer/first-contribution": 1,
    "developer/project-overview": 2,
    "developer/architecture": 3,
    "developer/reverse-engineering": 4,
    "developer/build": 5,
    "developer/troubleshooting": 6,
    "developer/current": 7,
    "developer/references": 8,
    "developer/evidence": 9,
    "developer/ai-summaries": 10,
    "developer/editorial-guidelines": 11,
  };
  const rank = (node) => {
    if (!node || !node.slugSegment) return 100;
    const key = (node.slug || "").replace(/\/index$/, "");
    // 根级优先级只匹配完整 slug，不能与子目录排序发生冲突。
    const idx = ROOT_ORDER.indexOf(key);
    if (idx !== -1) return idx;
    if (CHILD_ORDER[key] !== undefined) return CHILD_ORDER[key];
    return 100;
  };
  const ra = rank(a);
  const rb = rank(b);
  if (ra !== rb) return ra - rb;
  // 未显式排序的节点仍按名称排列，新增条目不会被隐藏。
  return (a.displayName || "").localeCompare(b.displayName || "", undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

// 仅侧栏显示名覆盖：站务规则标题过长→短名；其余保持页面标题不变。
function mapNode(node) {
  const SIDEBAR_LABEL = {
    "player": "玩家专区",
    "developer": "开发者专区",
    "wiki-rules": "知识库规则",
    "wiki-not": "本站不是什么",
    "copyright": "版权与许可",
    "how-to-use": "本站使用说明",
    "developer/first-contribution": "第一次改动",
    "developer/project-overview": "项目概览",
    "developer/architecture": "架构与机制",
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
    "developer/architecture/directory-migration": "Android 目录迁移",
    "developer/architecture/save-progress-comparator": "存档进度比较",
    "developer/architecture/scheduler-state-machine": "调度器状态机",
    "developer/architecture/automation-ownership": "自动化所有权",
    "developer/architecture/tutorial-content-pipeline": "教程管线",
    "developer/architecture/gui-stage-gates": "Android 阶段门禁",
    "developer/architecture/android-gui-sync": "Android 界面同步",
    "developer/architecture/derived-state-invalidation": "派生状态",
    "developer/architecture/effect-model": "效果模型",
    "developer/architecture/web-ui-reactivity": "Web 界面响应",
    "developer/architecture/web-offline-simulation": "Web 离线进度",
    "developer/reverse-engineering/smali-recovery": "Smali 接口恢复",
    "developer/reverse-engineering/decompilation": "反编译与源码恢复",
    "developer/build/build-mod-retirement": "旧构建脚本退役",
    "developer/build/artifact-provenance": "构建溯源",
    "developer/build/signature-backfill": "DEX 签名回填",
    "developer/troubleshooting/web-module-startup": "Web 启动链",
    "developer/troubleshooting/web-pages-artifact-integrity": "Pages 产物校验",
    "player/getting-started": "开始游玩",
    "player/download-and-version": "下载与版本",
    "player/antimatter-dimensions": "游戏总览",
    "player/antimatter-dimensions-core-loop": "生产机制",
    "player/antimatter-dimensions-decisions": "增长与重置",
    "player/gameplay": "玩法机制",
    "player/mods": "MOD 介绍",
    "player/faq": "常见问题",
    "player/terminology": "术语表",
    "player/original": "原版译文",
    "player/gameplay/stage-progression": "成长路线",
    "player/gameplay/progression-infinity-eternity": "无限与永恒",
    "player/gameplay/reality-time-studies": "时间研究路线",
    "player/gameplay/celestial-realities": "特殊现实",
    "player/gameplay/challenge-troubleshooting": "挑战排障",
    "player/gameplay/automation": "智能自动购买器",
    "player/gameplay/stage-gates": "阶段解锁",
    "player/gameplay/original-vs-mod": "原版与 MOD",
    "player/gameplay/mod-changes": "MOD 玩法改动",
    "player/gameplay/platform-differences": "平台差异",
    "player/download-and-version/android": "Android 安装与升级",
    "player/download-and-version/web": "Web 入口与缓存",
    "player/faq/progression": "进度与挑战",
    "player/faq/saves-and-compatibility": "存档与兼容",
    "player/faq/automation-and-unlocks": "自动化与解锁",
    "player/original/ow-achievements": "成就",
    "player/original/ow-charged-infinity-upgrades": "充能无限升级",
    "player/original/ow-save-bank": "存档库",
    "player/original/ow-break-infinity": "打破无限",
    "player/original/ow-antimatter-dimensions": "反物质维度（游戏机制）",
    "player/original/ow-antimatter-galaxies": "反物质星系",
    "player/original/ow-glyph-alchemy": "符文炼金",
    "player/original/ow-perks": "复兴",
    "player/original/ow-replicanti": "复制器",
    "player/original/ow-ad-bonus": "广告加成",
    "player/original/ow-black-hole": "黑洞",
    "player/original/ow-tickspeed": "计数频率",
    "player/original/ow-tickspeed-galaxy-breakdown-doomed": "计数频率明细",
    "player/original/ow-notations": "记数法",
    "player/original/ow-shortcuts": "快捷键",
    "player/original/ow-laitela": "莱特拉",
    "player/original/ow-laitela-quotes": "莱特拉·引语",
    "player/original/ow-effarig": "鹿颈长",
    "player/original/ow-effarig-quotes": "鹿颈长·引语",
    "player/original/ow-achievements-secret-achievements": "秘密成就",
    "player/original/ow-pelle": "佩勒",
    "player/original/ow-pelle-upgrades": "佩勒升级",
    "player/original/ow-dilation-upgrades": "膨胀升级",
    "player/original/ow-dilation-upgrades-doomed": "膨胀升级（被毁灭的现实）",
    "player/original/ow-normal-challenges": "普通挑战",
    "player/original/ow-dilation": "时间膨胀",
    "player/original/ow-time-dimensions": "时间维度",
    "player/original/ow-time-studies": "时间研究",
    "player/original/ow-terminology": "术语（佩勒用词）",
    "player/original/ow-ra": "太阳神",
    "player/original/ow-ra-quotes": "太阳神·引语",
    "player/original/ow-teresa": "特蕾莎",
    "player/original/ow-celestials": "天神",
    "player/original/ow-celestial-navigation": "天神导航",
    "player/original/ow-celestial-navigation-gallery": "天神导航·图库",
    "player/original/ow-challenges": "挑战",
    "player/original/ow-v": "薇",
    "player/original/ow-v-quotes": "薇·引语",
    "player/original/ow-dimensions": "维度",
    "player/original/ow-dimension-boosts": "维度提升",
    "player/original/ow-dimensional-sacrifice": "维度献祭",
    "player/original/ow-nameless-ones": "无名氏",
    "player/original/ow-nameless-ones-quotes": "无名氏·引语",
    "player/original/ow-infinity": "无限",
    "player/original/ow-infinity-upgrades": "无限升级",
    "player/original/ow-infinity-upgrades-upgrades": "无限升级（升级表）",
    "player/original/ow-infinity-challenges": "无限挑战",
    "player/original/ow-infinity-dimensions": "无限维度",
    "player/original/ow-reality": "现实",
    "player/original/ow-reality-upgrades": "现实升级",
    "player/original/ow-imaginary-upgrades": "虚幻升级",
    "player/original/ow-eternity": "永恒",
    "player/original/ow-eternity-milestones": "永恒里程碑",
    "player/original/ow-eternity-upgrades": "永恒升级",
    "player/original/ow-eternity-challenges": "永恒挑战",
    "player/original/ow-eternity-challenges-challenges": "永恒挑战·挑战明细",
    "player/original/ow-eternity-challenges-challenges-pelle": "永恒挑战明细",
    "player/original/ow-prestige": "重置成长（威望）",
    "player/original/ow-automation": "自动化",
    "player/original/ow-mods": "Mod 一览",
  };
  // 只有存在真实下级页面的节点才是分类；仅有 index.md 的目录降级为普通链接。
  if (node && node.isFolder && (!node.children || node.children.length === 0) && node.data) {
    node.isFolder = false;
  }
  const labelKey = node?.slug?.replace(/\/index$/, "");
  if (node && labelKey && SIDEBAR_LABEL[labelKey]) {
    node.displayName = SIDEBAR_LABEL[labelKey];
  }
  return node;
}

// 标签页、内部归档和重定向仍可由 Quartz 生成或保留 URL，但不属于主导航。
// 过滤函数必须自包含，因为 Explorer 会把它序列化到浏览器端执行。
function filterNode(node) {
  const EXCLUDED = {
    exact: ["/tags"],
    prefixes: ["/tags/", "/ai-drafts/", "/developer/history/", "/redirect/"],
  };
  const route = "/" + String(node?.slug || "").replace(/\/index$/, "").replace(/^\/+/, "");
  if (EXCLUDED.exact.includes(route)) return false;
  if (EXCLUDED.prefixes.some((prefix) => route === prefix.replace(/\/$/, "") || route.startsWith(prefix))) return false;
  return !(node.isFolder && (!node.children || node.children.length === 0) && !node.data);
}

export function OrderedExplorer(opts = {}) {
  const explorer = Explorer({
    ...opts,
    sortFn: compare,
    mapFn: mapNode,
    filterFn: filterNode,
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
