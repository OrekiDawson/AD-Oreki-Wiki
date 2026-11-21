// 与 acceptance.cjs 使用同一套 Playwright 覆盖方式，并允许独立设置探针站点地址。
let chromium;
try {
  ({ chromium } = require(process.env.KB_PLAYWRIGHT || 'playwright'));
} catch (error) {
  console.error(
    '需要 Playwright。请运行 `npm i -D playwright`，或通过 `KB_PLAYWRIGHT=<模块绝对路径>` 指定已安装模块。',
  );
  console.error(String(error).slice(0, 300));
  process.exit(2);
}
const BASE = process.env.KB_URL || 'http://localhost:8081';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const out = {};
  await page.goto(BASE + '/developer/build/agp', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  out.agp = {
    pre: await page.locator('pre').count(),
    code: await page.locator('pre code, code').count(),
    table: await page.locator('table').count(),
  };
  await page.goto(BASE + '/developer/architecture/kotlin-runtime', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const html = await page.content();
  out.kotlin = {
    hasBacklinksHeading: /Backlinks|反向链接/.test(html),
    graphNodes: await page.locator('canvas, svg .node, .graph-container').count(),
    allButtons: await page.locator('button').evaluateAll((bs) => bs.map((b) => (b.getAttribute('aria-label') || b.getAttribute('title') || b.className || '').slice(0, 40))).then((a) => a.slice(0, 12)),
    htmlClass: await page.evaluate(() => document.documentElement.className),
  };
  // 暗色模式：点击带 dark 的按钮
  const darkBtns = page.locator('button');
  const n = await darkBtns.count();
  for (let i = 0; i < n; i += 1) {
    const label = (await darkBtns.nth(i).getAttribute('aria-label')) || (await darkBtns.nth(i).getAttribute('title')) || '';
    if (/dark|theme|暗色|主题/i.test(label)) { await darkBtns.nth(i).click({ force: true }); await page.waitForTimeout(700); break; }
  }
  out.kotlin.afterDarkClass = await page.evaluate(() => document.documentElement.className);
  out.kotlin.afterDarkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
}
main().catch((e) => { console.error('ERR', String(e).slice(0, 300)); process.exit(2); });
