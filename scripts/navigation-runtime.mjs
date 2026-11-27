// 唯一的导航数据来自 navigation-model.json。Explorer 会序列化回调，故将受控 JSON
// 作为字面量编入独立函数，而不是引用浏览器不可访问的模块作用域。
export function createNavigationCallbacks(model) {
  const roots = model.categories.root.map((entry) => entry.key)
  const ranks = Object.fromEntries(Object.values(model.childOrder).flatMap((routes) =>
    routes.map((route, index) => [route, index + 1])))
  const labels = model.folderLabels
  const excluded = model.excludedFromExplorer
  const compare = new Function("a", "b", `
    const roots = ${JSON.stringify(roots)};
    const ranks = ${JSON.stringify(ranks)};
    const rank = (node) => {
      const key = String(node?.slug || "").replace(/\\/index$/, "");
      const root = roots.indexOf(key);
      if (root !== -1) return root;
      return Object.hasOwn(ranks, key) ? ranks[key] : 1000;
    };
    return rank(a) - rank(b) || (a.displayName || "").localeCompare(b.displayName || "", "zh-CN", {numeric:true,sensitivity:"base"});
  `)
  const mapNode = new Function("node", `
    const labels = ${JSON.stringify(labels)};
    const key = String(node?.slug || "").replace(/\\/index$/, "");
    if (node && node.isFolder && (!node.children || node.children.length === 0) && node.data) node.isFolder = false;
    if (node && Object.hasOwn(labels, key)) node.displayName = labels[key];
    return node;
  `)
  const filterNode = new Function("node", `
    const excluded = ${JSON.stringify(excluded)};
    const route = "/" + String(node?.slug || "").replace(/\\/index$/, "").replace(/^\\/+/, "");
    if (excluded.exact.includes(route) || excluded.prefixes.some(p => route === p.replace(/\\/$/, "") || route.startsWith(p))) return false;
    return !(node.isFolder && (!node.children || node.children.length === 0) && !node.data);
  `)
  return { compare, mapNode, filterNode }
}

// 将完整页面路径按每一级兄弟节点排序；父页面先于其子页面。
// 未列入手工排序模型的新条目仍保留，并按标题自然排序。
export function comparePageRoutes(model, a, b) {
  const roots = model.categories.root.map(x => x.key)
  const aa = a.route.replace(/^\//, "").split("/")
  const bb = b.route.replace(/^\//, "").split("/")
  let parent = ""
  for (let i = 0; i < Math.min(aa.length, bb.length); i++) {
    if (aa[i] !== bb[i]) {
      const order = parent ? (model.childOrder[parent] || []) : roots
      const prefix = parent ? parent + "/" : ""
      const rank = key => { const n = order.indexOf(prefix + key); return n < 0 ? 1000 : n }
      return rank(aa[i]) - rank(bb[i]) ||
        (aa.length === i + 1 && bb.length === i + 1
          ? a.title.localeCompare(b.title, "zh-CN")
          : aa[i].localeCompare(bb[i], "zh-CN", { numeric: true }))
    }
    parent = parent ? parent + "/" + aa[i] : aa[i]
  }
  return aa.length - bb.length
}
