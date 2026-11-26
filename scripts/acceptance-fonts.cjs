#!/usr/bin/env node
// 在线/本地字体一致性验收：用 Android Chrome 视口读取真实 computed style。
const fs = require('node:fs');
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
const pages = [
  '/player/antimatter-dimensions',
  '/developer/architecture',
  '/player/original/ow-infinity',
];

async function inspect(page) {
  return page.evaluate(() => {
    const selectors = {
      body: 'body',
      title: 'article h1, h1',
      paragraph: 'article p',
      scientific: 'article p, article li, article td',
      navigation: '.explorer, .explorer-content',
      search: '.search input, .search button',
      table: 'article table',
      quote: 'article blockquote',
      code: 'article pre code',
      math: '.katex, .math-inline, .math-block',
    };
    const read = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        selector,
        text: (el.textContent || '').trim().slice(0, 120),
        fontFamily: s.fontFamily,
        fontStyle: s.fontStyle,
        fontWeight: s.fontWeight,
      };
    };
    const ordinary = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return rect.width > 0 && rect.height > 0 && (el.textContent || '').trim()
          && !el.closest('pre, code, .katex, .math-inline, .math-block')
          && !['SCRIPT', 'STYLE', 'SVG', 'PATH'].includes(el.tagName);
      })
      .map((el) => getComputedStyle(el).fontFamily);
    const numericCode = [...document.querySelectorAll('article p code, article li code, article td code')]
      .map((el) => (el.textContent || '').trim())
      .filter((text) => text.length <= 80 && /^[\s\d.eE+\-−×x^*/()→←=]+$/.test(text)
        && /(?:(?<![A-Za-z0-9])(?:\d{1,3}(?:\.\d+)?)\s*[eE][+-]?\d+(?![A-Za-z0-9])|(?<!\d)e\d{2,}|(?<![A-Za-z0-9])\d{1,3}(?:\.\d+)?\s*[×x]\s*10\^\d)/.test(text));
    return {
      samples: Object.fromEntries(Object.entries(selectors).map(([key, selector]) => [key, read(selector)])),
      ordinaryFamilies: [...new Set(ordinary)],
      numericCode,
      thirdPartyFonts: performance.getEntriesByType('resource')
        .map((entry) => entry.name)
        .filter((name) => /fonts\.(googleapis|gstatic)|typekit/i.test(name)),
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/141.0 Mobile Safari/537.36',
  });
  const page = await context.newPage();
  const results = { base, viewport: { width: 412, height: 915 }, pages: {}, errors: [] };
  for (const slug of pages) {
    await page.goto(base + slug, { waitUntil: 'networkidle' });
    results.pages[slug] = await inspect(page);
    await page.screenshot({ path: `reports/font-${slug.replace(/\W+/g, '-').replace(/^-|-$/g, '')}.png`, fullPage: true });
  }
  await browser.close();
  fs.mkdirSync(require('node:path').dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(results, null, 2));
  const ordinaryFamilies = [...new Set(Object.values(results.pages)
    .flatMap((pageResult) => pageResult.ordinaryFamilies)
    .filter((family) => !/KaTeX|math/i.test(family)))];
  const thirdPartyFonts = Object.values(results.pages).flatMap((pageResult) => pageResult.thirdPartyFonts);
  if (ordinaryFamilies.length !== 1) results.errors.push(`ordinary-font-families:${ordinaryFamilies.join('|')}`);
  const numericCode = Object.values(results.pages).flatMap((pageResult) => pageResult.numericCode || []);
  if (numericCode.length) results.errors.push(`scientific-notation-in-code:${numericCode.join('|')}`);
  if (thirdPartyFonts.length) results.errors.push(`third-party-fonts:${thirdPartyFonts.join('|')}`);
  console.log(JSON.stringify({ ordinaryFamilies, thirdPartyFonts, errors: results.errors }, null, 2));
  process.exit(results.errors.length ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
