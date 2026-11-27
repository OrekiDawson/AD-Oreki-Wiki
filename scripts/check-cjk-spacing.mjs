import fs from 'node:fs';
import path from 'node:path';

const built = process.argv[2] === '--built';
const root = built ? process.argv[3] : 'content';
if (!root || !fs.existsSync(root)) {
  console.error(`缺少扫描目录: ${root}`);
  process.exit(2);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function visibleMarkdown(source) {
  let fenced = false;
  let frontmatter = false;
  return source.split(/\r?\n/).map((line) => {
    if (line.trim() === '---' && !fenced) {
      frontmatter = !frontmatter;
      return '';
    }
    if (frontmatter && !/^\s*(title|description):/.test(line)) return '';
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      return '';
    }
    if (fenced) return '';
    return line
      .replace(/`[^`]*`/g, ' ')
      .replace(/!?(?:\[([^\]]*)\])\([^)]*\)/g, '$1')
      .replace(/https?:\/\/[^\s)>]+/g, ' ')
      .replace(/\$\$?[\s\S]*?\$\$?/g, ' ')
      .replace(/<[^>]*>/g, ' ');
  }).join('\n');
}

function visibleHtml(source) {
  const generatedClasses = new Set([
    'sidebar', 'page-header', 'page-footer', 'content-meta', 'breadcrumbs',
    'breadcrumb-container', 'explorer', 'toc', 'recent-notes',
    'folder-container', 'page-listing', 'section-ul', 'section', 'tags', 'meta', 'page-list',
  ]);
  const sanitized = source
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<pre\b[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<code\b[\s\S]*?<\/code>/gi, ' ')
    .replace(/<math\b[\s\S]*?<\/math>/gi, ' ');
  const withoutGeneratedChrome = removeElements(sanitized, (tag, attrs) => {
    if (['nav', 'aside', 'footer', 'header'].includes(tag)) return true;
    const classes = attrs.match(/\bclass=["']([^"']*)["']/i)?.[1]?.split(/\s+/) ?? [];
    return classes.some((name) => generatedClasses.has(name));
  });
  return withoutGeneratedChrome
    // Quartz 插件可能把函数序列化到 data 属性；属性不是读者可见正文，
    // 且其中的比较符号会干扰 HTML 标签过滤。
    .replace(/\sdata-quartz-[\w:-]+=("[\s\S]*?"|'[\s\S]*?')/gi, ' ')
    .replace(/https?:\/\/[^\s"'<]+/gi, ' ')
    // 属性值可能包含字面 `>`；按引号边界匹配标签，避免把属性代码当成正文。
    .replace(/<(?:[^>"']|"[^"]*"|'[^']*')*>/g, ' ');
}

// 只剥离 Quartz 生成的导航、侧栏、元数据和页脚。不能用简单的
// `<div.*?</div>`，因为这些容器内部还会嵌套多个 div。
function removeElements(source, shouldRemove) {
  const token = /<(?:(?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  const stack = [];
  let output = '';
  let cursor = 0;
  let suppressed = 0;
  for (const match of source.matchAll(token)) {
    const raw = match[0];
    const start = match.index ?? 0;
    if (!suppressed) output += source.slice(cursor, start) + ' ';
    cursor = start + raw.length;
    const close = raw.match(/^<\/\s*([\w-]+)/);
    if (close) {
      const entry = stack.pop();
      if (entry?.remove) suppressed -= 1;
      continue;
    }
    const open = raw.match(/^<\s*([\w-]+)([^>]*)>/);
    if (!open) continue;
    const selfClosing = /\/\s*>$/.test(raw) || voidElements.has(open[1].toLowerCase());
    const remove = shouldRemove(open[1].toLowerCase(), open[2]);
    if (remove) suppressed += 1;
    if (!selfClosing) stack.push({ remove });
  }
  if (!suppressed) output += source.slice(cursor);
  if (suppressed) throw new Error('生成 HTML 的过滤容器未闭合，拒绝以截断文本通过混排检查');
  return output;
}

function scan(text, file) {
  const violations = [];
  text.split(/\r?\n/).forEach((line, index) => {
    for (const [kind, re] of [
      ['汉字后缺少空格', /[\u3400-\u9fff](?=[A-Za-z0-9])/g],
      ['汉字前缺少空格', /(?<=[A-Za-z0-9])[\u3400-\u9fff]/g],
    ]) {
      let match;
      while ((match = re.exec(line))) {
        violations.push({ file, line: index + 1, column: match.index + 1, kind, text: line.trim() });
      }
    }
  });
  return violations;
}

const files = walk(root).filter((file) => built
  ? file.endsWith('.html')
  : file.endsWith('.md') && !file.includes(`${path.sep}ai-drafts${path.sep}`));
const violations = files.flatMap((file) => scan(
  built ? visibleHtml(fs.readFileSync(file, 'utf8')) : visibleMarkdown(fs.readFileSync(file, 'utf8')),
  path.relative(process.cwd(), file),
));
if (violations.length) {
  console.error(JSON.stringify({ error: '中西文混排缺少半角空格', violations }, null, 2));
  process.exit(1);
}
console.log(`OK 中西文混排检查通过: ${files.length}${built ? ' 个HTML文件' : ' 个Markdown文件'}`);
