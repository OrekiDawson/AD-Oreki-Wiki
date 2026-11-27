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
  return source
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<pre\b[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<code\b[\s\S]*?<\/code>/gi, ' ')
    .replace(/<math\b[\s\S]*?<\/math>/gi, ' ')
    .replace(/https?:\/\/[^\s"'<]+/gi, ' ')
    .replace(/<[^>]*>/g, ' ');
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
