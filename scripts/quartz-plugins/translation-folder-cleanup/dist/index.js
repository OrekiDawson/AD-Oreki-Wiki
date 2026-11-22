// 原版翻译首页已经提供按阶段分组的目录；隐藏 Quartz 自动追加的重复平铺列表，
// 同时移除仅用于维护的描述与标签属性表。CSS 只作用于该首页，不改变其他目录页。
const translationFolderCleanupCss = `
body[data-slug="player/original/index"] .page-listing,
body[data-slug="player/original/index"] .note-properties {
  display: none;
}
`;

export function TranslationFolderCleanup() {
  const Component = () => null;
  Component.css = translationFolderCleanupCss;
  return Component;
}
