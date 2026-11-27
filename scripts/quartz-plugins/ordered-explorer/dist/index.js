// 复用官方 Explorer；排序、短名、排除项和专题均来自统一模型。
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const model = JSON.parse(fs.readFileSync(path.join(root, "scripts/navigation-model.json"), "utf8"));
const { createNavigationCallbacks } = await import(pathToFileURL(path.join(root, "scripts/navigation-runtime.mjs")).href);
const { Explorer } = await import(pathToFileURL(path.join(root, "node_modules/@quartz-community/explorer/dist/index.js")).href);

// 浏览器端增强只重排真实链接，不合成虚拟页面、不改变 URL 或 Explorer 折叠状态。
function clientNavigation(model) {
  if (window.__wikiNavInitialized) return;
  window.__wikiNavInitialized = true;
  let observed = null, observer = null, panel = null, savedTop = 0, pending = false, scheduled = false;
  const normalize = value => {
    try {
      const url = new URL(value, location.href);
      if (url.origin !== location.origin) return "";
      return decodeURI(url.pathname).replace(/^\/+|\/+$/g, "").replace(/\/index(?:\.html)?$/, "").replace(/\.html$/, "");
    } catch { return ""; }
  };
  const ownLink = li => li.querySelector(":scope > a[href], :scope > .folder-container a[href]");
  const routeOf = li => { const href = ownLink(li)?.getAttribute("href"); return href ? normalize(href) : ""; };
  const group = (list, definition) => {
    const keys = new Set(definition.entries);
    if (!list || [...list.children].some(li => li.dataset.wikiGroup === definition.label)) return;
    const children = [...list.children].filter(li => keys.has(routeOf(li)));
    // 等待 Explorer 完成该组全部真实链接的渲染，避免异步阶段只收进部分条目。
    if (children.length !== keys.size) return;
    const item = document.createElement("li");
    item.className = "wiki-nav-group";
    item.dataset.wikiGroup = definition.label;
    const heading = document.createElement("span");
    heading.className = "wiki-nav-group-label";
    heading.textContent = definition.label;
    const inner = document.createElement("ul");
    inner.className = "wiki-nav-group-list";
    inner.setAttribute("aria-label", definition.label);
    item.append(heading, inner);
    list.insertBefore(item, children[0]);
    inner.append(...children);
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; enhance(); });
  };
  function enhance() {
    const explorer = document.querySelector(".explorer");
    const scroll = explorer?.querySelector(".explorer-content");
    const rootList = scroll?.querySelector("ul.explorer-ul");
    if (!explorer) return;
    if (observed !== explorer) {
      observer?.disconnect();
      observed = explorer;
      observer = new MutationObserver(schedule);
      observer.observe(explorer, { childList: true, subtree: true });
    }
    if (!rootList) return;
    explorer.setAttribute('data-current-page-ancestors', 'ready');
    if (panel !== scroll) {
      panel = scroll;
      panel.scrollTop = savedTop;
      panel.addEventListener("scroll", () => {
        if (panel === scroll && scroll.clientHeight && !explorer.classList.contains('collapsed')) savedTop = scroll.scrollTop;
      }, { passive: true });
      pending = true;
    }
    for (const [parent, definitions] of Object.entries(model.topicGroups || {})) {
      const li = [...rootList.querySelectorAll("li")].find(node => routeOf(node) === parent);
      const list = li?.querySelector(":scope > .folder-outer > ul");
      for (const definition of definitions) group(list, definition);
    }
    group(rootList, { label: model.stationLabel, entries: model.stationEntries });
    const links = [...rootList.querySelectorAll("a[href]")];
    const current = normalize(location.href);
    const active = links.find(a => normalize(a.getAttribute("href")) === current);
    if (active && pending && scroll.clientHeight && !explorer.classList.contains("collapsed")) {
      const frame = scroll.getBoundingClientRect(), rect = active.getBoundingClientRect();
      if (rect.height && (rect.top < frame.top || rect.bottom > frame.bottom))
        scroll.scrollTop += rect.top - frame.top - Math.min(56, frame.height / 4);
      pending = false;
    }
    // 原有折叠记忆由 Explorer 管理。此处仅保存滚动位置并按需定位当前页。
    const article = document.querySelector("article");
    if (!article) return;
    const previousNav = article.querySelector(".wiki-related-nav");
    if (previousNav?.dataset.route === current) return;
    previousNav?.remove();
    if (!active) return;
    const parent = current.slice(0, current.lastIndexOf("/"));
    const topic = model.topicGroups?.[parent]?.find(x => x.entries.includes(current));
    const siblings = topic?.entries || model.childOrder[parent] || [];
    const i = siblings.indexOf(current);
    if (i < 0) return;
    const nav = document.createElement("nav");
    nav.className = "wiki-related-nav";
    nav.dataset.route = current;
    nav.setAttribute("aria-label", "同主题阅读");
    const heading = document.createElement("strong");
    heading.textContent = "继续阅读";
    nav.append(heading);
    const row = document.createElement("div");
    for (const [label, key] of [["上一篇", siblings[i - 1]], ["返回专题", parent], ["下一篇", siblings[i + 1]]]) {
      const original = key && links.find(a => normalize(a.getAttribute("href")) === key);
      if (!original) continue;
      const link = document.createElement("a");
      link.className = "internal";
      link.href = original.href;
      link.textContent = label + "：" + (model.folderLabels[key] || original.textContent.trim());
      row.append(link);
    }
    if (!row.children.length) return;
    nav.append(row);
    article.append(nav);
  }
  document.addEventListener("nav", () => { pending = true; schedule(); }, { passive: true });
  document.addEventListener("click", event => {
    if (event.target.closest?.(".explorer-toggle")) { pending = true; schedule(); }
  }, { passive: true });
  schedule();
}

export function OrderedExplorer(opts = {}) {
  const { compare, mapNode, filterNode } = createNavigationCallbacks(model);
  const explorer = Explorer({ ...opts, sortFn: compare, mapFn: mapNode, filterFn: filterNode });
  // current-page-ancestors：沿用官方 Explorer 的活动路径与折叠记忆。
  const client = "(" + clientNavigation.toString() + ")(" + JSON.stringify(model) + ");";
  explorer.afterDOMLoaded = [explorer.afterDOMLoaded || "", client];
  return explorer;
}
