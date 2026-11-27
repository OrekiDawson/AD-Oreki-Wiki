import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function visibleMarkdown(line) {
  return line
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?(?:\[[^\]]*\])\([^)]*\)/g, ' ')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/<[^>]*>/g, ' ');
}

function visibleHtml(text) {
  return text
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(?:pre|code)\b[\s\S]*?<\/(?:pre|code)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/[^\s"'<>]+/gi, ' ');
}

const auditPatterns = [
  /已用\s*(?:MediaWiki|GitHub)\s*API/i,
  /(?:MediaWiki|GitHub)\s*API.{0,30}(?:核对|验证|复核|可达|HTTP\s*200)/i,
  /HTTP\s*(?:状态码\s*)?200.{0,35}(?:核对|验证|复核|审查|抓取|可达)/i,
  /(?:核对|验证|复核|审查|抓取).{0,25}HTTP\s*(?:状态码\s*)?200/i,
  /(?:抓取于|首次抓取|复核抓取|核对日|复核日期|复核时间)/i,
  /(?:Kody|EDITORIAL_BLOCKED|REVIEW_BLOCKED).{0,25}(?:PASS|通过|复核|验收|审查|状态|结论)/i,
];

function scan(file, built) {
  const source = fs.readFileSync(file, 'utf8');
  const lines = built ? visibleHtml(source).split(/\r?\n/) : source.split(/\r?\n/);
  let fenced = false;
  const hits = [];
  lines.forEach((line, index) => {
    if (!built && /^\s*```/.test(line)) {
      fenced = !fenced;
      return;
    }
    if (fenced) return;
    const visible = built ? line : visibleMarkdown(line);
    if (visible.includes('不得把 MediaWiki') && visible.includes('核验模板')) return;
    if (auditPatterns.some((pattern) => pattern.test(visible))) {
      hits.push({ file, line: index + 1, text: line.trim() });
    }
  });
  return hits;
}

const built = process.argv[2] === '--built';
const root = built ? process.argv[3] : 'content';
if (!root || !fs.existsSync(root)) {
  console.error(`缺少扫描目录: ${root}`);
  process.exit(2);
}

const files = walk(root).filter((file) => built
  ? file.endsWith('.html')
  : file.endsWith('.md') && !file.split(path.sep).includes('ai-drafts'));
const hits = files.flatMap((file) => scan(path.relative(process.cwd(), file), built));
if (hits.length) {
  console.error(JSON.stringify({
    error: '公开内容包含机器核验流水账；请将核验过程移入内部证据',
    hits,
  }, null, 2));
  process.exit(1);
}
console.log(`OK 公开审计信息检查通过: ${files.length}${built ? ' 个HTML文件' : ' 个Markdown文件'}`);
