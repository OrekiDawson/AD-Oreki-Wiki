#!/usr/bin/env node
// 用 Android Chrome 视口读取真实 computed style，验证普通文本没有回退到网页字体。
const fs = require('node:fs');
const path = require('node:path');
let chromium;
try {
  ({ chromium } = require(process.env.KB_PLAYWRIGHT || 'playwright'));
} catch (error) {
  console.error('需要 Playwright：请安装 playwright 或设置 KB_PLAYWRIGHT。');
  console.error(String(error).slice(0, 300));
  process.exit(2);
}

const base = process.env.KB_URL || 'https://wiki.oreki.net';
const out = process.env.KB_FONT_OUT || 'evidence/playwright-fonts.json';
const pages = ['/player/antimatter-dimensions', '/developer/architecture', '/player/original/ow-infinity'];

async function inspect(page) {
  return page.evaluate(() => {
    const ordinary = [...document.querySelectorAll('article p, article li, article td, article blockquote')]
      .filter((el) => !el.closest('pre, code, .katex, .math-inline, .math-block'))
      .map((el) => getComputedStyle(el).fontFamily);
    const sample = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const style = getComputedStyle(el);
      return { selector, text: (el.textContent || '').trim().slice(0, 100), fontFamily: style.fontFamily };
    };
    return {
      samples: ['body', 'article h1, h1', 'article p', '.explorer', '.search input', 'article table', 'article pre code', '.katex']
        .map(sample).filter(Boolean),
      ordinaryFamilies: [...new Set(ordinary)],
      thirdPartyFonts: performance.getEntriesByType('resource').map((entry) => entry.name)
        .filter((name) => /fonts\.(googleapis|gstatic)|typekit/i.test(name)),
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/141.0 Mobile Safari/537.36',
  });
  const page = await context.newPage();
  const result = { base, viewport: { width: 412, height: 915 }, pages: {}, errors: [] };
  for (const slug of pages) {
    await page.goto(base + slug, { waitUntil: 'networkidle' });
    result.pages[slug] = await inspect(page);
    await page.screenshot({ path: `reports/font-${slug.replace(/\W+/g, '-').replace(/^-|-$/g, '')}.png`, fullPage: true });
  }
  await browser.close();
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(result, null, 2));
  const families = [...new Set(Object.values(result.pages).flatMap((item) => item.ordinaryFamilies))];
  const thirdParty = Object.values(result.pages).flatMap((item) => item.thirdPartyFonts);
  if (families.length !== 1) result.errors.push(`ordinary-font-families:${families.join('|')}`);
  if (thirdParty.length) result.errors.push(`third-party-fonts:${thirdParty.join('|')}`);
  console.log(JSON.stringify({ families, thirdParty, errors: result.errors }, null, 2));
  process.exit(result.errors.length ? 1 : 0);
}

main().catch((error) => { console.error(error); process.exit(2); });
