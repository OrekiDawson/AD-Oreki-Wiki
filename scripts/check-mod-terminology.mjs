import fs from 'node:fs';
import path from 'node:path';

const forbidden = /Oreki[\s_-]*Edition/gi;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function scan(file, label) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const hits = [];
  const legacyTagMetadata = /content[\\/]player[\\/]mods[\\/]index\.md$/i.test(label);
  const legacyTagPage = /(?:^|[\\/])tags[\\/]OrekiEdition(?:[\\/]index)?\.html$/i.test(label);
  lines.forEach((line, index) => {
    if (legacyTagMetadata && /^\s*-\s*OrekiEdition\s*$/.test(line)) return;
    if (legacyTagPage) return;
    const visible = line
      .replace(/`[^`]*`/g, ' ')
      .replace(/https?:\/\/[^\s)>]+/gi, ' ')
      .replace(/OrekiDawson\/AD-Oreki-Edition-(?:Android|Web)/g, ' ')
      .replace(/AD-Oreki-Edition(?:-(?:Android|Web))?/g, ' ');
    if (forbidden.test(visible)) hits.push({ file: label, line: index + 1, text: line.trim() });
    forbidden.lastIndex = 0;
  });
  return hits;
}

const built = process.argv[2] === '--built';
const root = built ? process.argv[3] : 'content';
if (!root || !fs.existsSync(root)) {
  console.error(`缺少扫描目录: ${root}`);
  process.exit(2);
}

const files = walk(root).filter((file) => built ? file.endsWith('.html') : file.endsWith('.md') && !file.includes(`${path.sep}ai-drafts${path.sep}`));
const hits = files.flatMap((file) => scan(file, path.relative(process.cwd(), file)));
if (hits.length) {
  console.error(JSON.stringify({ error: '公开内容仍包含禁止的 MOD 旧称', hits }, null, 2));
  process.exit(1);
}
console.log(`OK MOD 术语检查通过: ${files.length}${built ? ' 个HTML文件' : ' 个Markdown文件'}`);
