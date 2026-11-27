// `archive: true` 是公开内容是否发布的唯一归档标记。
// 过滤发生在 Quartz 内容索引、页面、站点地图、RSS 和搜索索引之前，
// 因而归档页不会靠 CSS 隐藏，也不会进入任何公开检索入口。
export function ArchiveFilter() {
  return {
    name: "ArchiveFilter",
    shouldPublish(_ctx, [_tree, vfile]) {
      const archive = vfile.data?.frontmatter?.archive
      return !(archive === true || archive === "true")
    },
  }
}
