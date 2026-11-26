#!/usr/bin/env node
// 用 Android Chrome 视口读取真实 computed style，验证普通文本没有回退到网页字体。
const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');
let chromium;
try {
  ({ chromium } = require(process.env.KB_PLAYWRIGHT || 'playwright'));
} catch (error) {
  console.error('需要 Playwright：请安装 playwright 或设置 KB_PLAYWRIGHT。');
  console.error(String(error).slice(0, 300));
  process.exit(2);
}

const base = process.env.KB_URL || 'http://127.0.0.1:8080';
const out = process.env.KB_FONT_OUT || 'evidence/playwright-fonts.json';
const siteConfig = YAML.parse(fs.readFileSync('quartz.config.yaml', 'utf8'));
const configuredHost = String(siteConfig?.configuration?.baseUrl || '').replace(/^https?:\/\//i, '').replace(/\/$/, '');
const productionHost = new RegExp(`^https://${configuredHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`, 'i');
const pages = ['/player/antimatter-dimensions', '/developer/architecture', '/player/original/ow-infinity', '/player/original/ow-v'];

const sampleKinds = {
  body: 'ordinary',
  heading: 'ordinary',
  ordinary: 'ordinary',
  explorer: 'ordinary',
  search: 'ordinary',
  table: 'ordinary',
  code: 'code',
  math: 'math',
};

const requiredByPage = {
  '/player/antimatter-dimensions': new Set(['body', 'heading', 'ordinary', 'explorer', 'search']),
  '/developer/architecture': new Set(['body', 'heading', 'ordinary', 'explorer', 'search', 'code']),
  '/player/original/ow-infinity': new Set(['body', 'heading', 'ordinary', 'explorer', 'search', 'math']),
  '/player/original/ow-v': new Set(['body', 'heading', 'ordinary', 'explorer', 'search', 'table']),
};

function familyAllowed(kind, family) {
  const value = String(family || '').toLowerCase();
  if (kind === 'code') return /ui-monospace|monospace|menlo|consolas|cascadia|sfmono/.test(value);
  if (kind === 'math') return /\bkatex[-_ ]?(?:ams|cal(?:igraphic)?|fraktur|main|math|sans[- ]?serif|script|size[1-4]|typewriter)\b/i.test(value)
    && !/^\s*sans-serif\b/i.test(value.trim());
  return /system-ui|sans-serif|-apple-system|blinkmacsystemfont|segoe ui|microsoft yahei|noto sans/.test(value)
    && !/source sans|schibsted|roboto|ibm plex|inter|open sans|lato|poppins|nunito/.test(value);
}

async function inspect(page) {
  return page.evaluate(() => {
    const ordinary = [...document.querySelectorAll('article p, article li, article td, article blockquote')]
      .filter((el) => !el.closest('pre, code, .katex, .math-inline, .math-block'))
      .map((el) => getComputedStyle(el).fontFamily);
    const sample = (name, selector) => {
      const el = document.querySelector(selector);
      if (!el) return { name, selector, missing: true, text: '', fontFamily: '' };
      const style = getComputedStyle(el);
      return { name, selector, missing: false, text: (el.textContent || '').trim().slice(0, 100), fontFamily: style.fontFamily };
    };
    return {
      samples: [
        ['body', 'body'],
        ['heading', 'article h1, h1'],
        ['ordinary', 'article p, article li, article td, article blockquote'],
        ['explorer', '.explorer'],
        ['search', '.search input'],
        ['table', 'article table'],
        ['code', 'article pre code'],
        ['math', '.katex'],
      ].map(([name, selector]) => sample(name, selector)),
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
  if (productionHost.test(base) && process.env.KB_ALLOW_PRODUCTION !== '1') {
    result.errors.push('production-url-requires-KB_ALLOW_PRODUCTION=1');
  }
  for (const slug of pages) {
    const response = await page.goto(base + slug, { waitUntil: 'networkidle' });
    if (!response || response.status() !== 200) {
      result.errors.push(`http:${slug}:${response ? response.status() : 'no-response'}`);
    }
    const inspected = await inspect(page);
    result.pages[slug] = inspected;
    for (const name of requiredByPage[slug]) {
      const sample = inspected.samples.find((item) => item.name === name);
      if (!sample || sample.missing) result.errors.push(`missing-sample:${slug}:${name}`);
      else if (!familyAllowed(sampleKinds[name], sample.fontFamily)) {
        result.errors.push(`font-family:${slug}:${name}:${sample.fontFamily}`);
      }
    }
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
