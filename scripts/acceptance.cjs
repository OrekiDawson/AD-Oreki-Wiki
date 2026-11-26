#!/usr/bin/env node
// 知识库本地/线上验收：Chromium 手机视口 + 桌面
// 覆盖：双专区、搜索、旧 URL、类目中文名、历史归档、AI 草稿隔离、暗色与移动端溢出
const path = require('node:path');
const fs = require('node:fs');

// 默认使用当前 Node 模块解析；需要指定外部工作树时通过 KB_PLAYWRIGHT 显式覆盖，
// 不把任何维护者的私人绝对路径写入仓库。
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
const OUT = process.env.KB_OUT || 'evidence/playwright-mobile.json';

const SEARCH_TERMS = [
  ['永恒挑战', 'player/gameplay/challenges'],
  ['自动购买器', 'player/gameplay/automation'],
  ['Kotlin', 'developer/architecture/kotlin-runtime'],
  ['AGP', 'developer/build/agp'],
  ['Lai', 'player/gameplay/saves'],
  ['build_mod.py', 'developer/build/build-mod-retirement'],
];

const OLD_URLS = ['/architecture/kotlin-runtime', '/architecture/android', '/gameplay/challenges', '/gameplay/progression-infinity-eternity', '/build/agp', '/current/project-status', '/developer/history/2026-11-12-r103-release-baseline', '/developer/history/2026-11-15-celestial-leaves-fix', '/history/2026-11-15-r113-180min-fail', '/developer/history/2026-11-15-r113-180min-fail', '/developer/history/2026-11-15-r113-p0-livelock', '/developer/history/2026-11-15-r114-reality-autoeternity', '/developer/history/2026-11-15-signing-blocked', '/developer/history/2026-11-20-r121-android-kvm'];
const HISTORY_REDIRECTS = {
  '/history': '/developer',
  '/developer/history/': '/developer',
  '/developer/history/2026-11-12-r103-release-baseline': '/developer/current/release-status',
  '/developer/history/2026-11-15-celestial-leaves-fix': '/developer/architecture/celestial-implementation',
  '/history/2026-11-15-r113-180min-fail': '/developer/current/known-issues',
  '/developer/history/2026-11-15-r113-180min-fail': '/developer/current/known-issues',
  '/developer/history/2026-11-15-r113-p0-livelock': '/developer/current/known-issues',
  '/developer/history/2026-11-15-r114-reality-autoeternity': '/developer/architecture/automation-ownership',
  '/developer/history/2026-11-15-signing-blocked': '/developer/build/apk-signing',
  '/developer/history/2026-11-20-r121-android-kvm': '/developer/current/project-status',
};
const NEW_PAGES = [
  '/',
  '/player/',
  '/developer/',
  '/player/getting-started/',
  '/player/gameplay/celestials',
  '/player/gameplay/stage-progression',
  '/player/gameplay/reality-time-studies',
  '/player/gameplay/original-vs-mod',
  '/player/mods/',
  '/player/download-and-version/',
  '/player/faq/',
  '/player/original/',
  '/player/original/ow-infinity',
  '/player/original/ow-dimensions',
  '/developer/architecture/parity',
  '/developer/build/apk-signing',
  '/developer/evidence/',
  '/developer/ai-summaries/',
];
const CATEGORY_LABELS = ['玩家专区', '开发者专区', '玩法机制', '架构与运行时', '运行证据索引'];

function weakMustSee(items) {
  return ['玩家专区', '开发者专区'].some((label) => {
    const item = items.find((i) => i.label === label);
    return !item || item.inViewport !== true;
  });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = { base: BASE, mobile: {}, desktop: {}, errors: [], searches: [], urls: [], categories: [] };
  const mobile = await browser.newContext({
    viewport: { width: 412, height: 915 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36',
  });
  const page = await mobile.newPage();
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200));
  });

  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  results.mobile.title = await page.title();
  results.mobile.explorerLinks = await page.locator('a[href*="player"], a[href*="developer"]').count();
  results.mobile.overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

  // 左侧目录的类目显示名应为中文
  const homeHtml = await page.content();
  for (const label of CATEGORY_LABELS) {
    const hit = homeHtml.includes(label);
    results.categories.push({ label, hit });
    if (!hit) results.errors.push('missing-category-label:' + label);
  }

  // 移动端侧栏：真实 DOM 渲染顺序断言（不读配置文本）
  const EXPECTED_SIDEBAR = [
    '玩家专区',
    '开发者专区',
    '知识库规则',
    '本站不是什么',
    '版权与许可',
    '本站使用说明',
  ];
  const sidebarToggle = page.locator('.explorer .explorer-toggle').first();
  if (await sidebarToggle.count()) {
    await sidebarToggle.click({ force: true }).catch(() => {});
    await page.waitForTimeout(700);
  }
  const sidebar = await page.evaluate(() => {
    const ul = document.querySelector('.explorer-content ul.explorer-ul');
    if (!ul) return null;
    const items = [...ul.children]
      .filter((li) => !li.classList.contains('overflow-end'))
      .map((li) => {
        const a = li.querySelector(':scope > a, :scope > .folder-container a');
        const labelEl = li.querySelector(':scope > .folder-container .folder-title') || a;
        const label = (labelEl && labelEl.textContent || '').trim();
        const box = a ? a.getBoundingClientRect() : null;
        return {
          label,
          href: a ? a.getAttribute('href') : null,
          truncated: labelEl ? labelEl.scrollWidth > labelEl.clientWidth + 1 : false,
          inViewport: box ? box.top >= 0 && box.top < window.innerHeight : false,
        };
      });
    return { items, expanded: !document.querySelector('.explorer').classList.contains('collapsed') };
  });
  results.mobile.sidebar = sidebar;
  if (!sidebar) results.errors.push('sidebar-missing');
  else {
    const labels = sidebar.items.map((i) => i.label);
    if (labels.join('|') !== EXPECTED_SIDEBAR.join('|')) {
      results.errors.push('sidebar-order:' + labels.join('>'));
    }
    if (!sidebar.expanded) results.errors.push('sidebar-not-expanded');
    if (sidebar.items.some((i) => i.truncated)) results.errors.push('sidebar-truncated');
    const mustSee = ['玩家专区', '开发者专区'];
    for (const label of mustSee) {
      const item = sidebar.items.find((i) => i.label === label);
      if (!item || item.inViewport !== true) results.errors.push('sidebar-not-visible:' + label);
    }
  }

  // 折叠可用：再点一次折叠按钮
  if (await sidebarToggle.count()) {
    await sidebarToggle.click({ force: true }).catch(() => {});
    await page.waitForTimeout(500);
    results.mobile.sidebarCollapsed = await page.evaluate(() =>
      document.querySelector('.explorer').classList.contains('collapsed')
    );
    if (!results.mobile.sidebarCollapsed) results.errors.push('sidebar-collapse-failed');
  }

  // 当前页高亮：进入具体文章页后侧栏应有 active 链接指向它
  await page.goto(BASE + '/player/gameplay/challenges', { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const toggle2 = page.locator('.explorer .explorer-toggle').first();
  if (await toggle2.count()) { await toggle2.click({ force: true }).catch(() => {}); await page.waitForTimeout(600); }
  results.mobile.sidebarActive = await page.evaluate(() => {
    const links = [...document.querySelectorAll('.explorer-content a.active, .explorer-content a.is-active')];
    return links.map((a) => a.getAttribute('href'));
  });
  if (!results.mobile.sidebarActive.includes('/player/gameplay/challenges')) {
    results.errors.push('sidebar-active-highlight');
  }
  if (await toggle2.count()) { await toggle2.click({ force: true }).catch(() => {}); await page.waitForTimeout(400); }

  // 搜索
  const searchInput = page.locator('input.search-bar, input[name="search"], input[type="search"], input[placeholder]').first();
  if (await searchInput.count()) {
    await searchInput.click({ force: true }).catch(() => {});
    await page.waitForTimeout(500);
    for (const [term, expectSlug] of SEARCH_TERMS) {
      await searchInput.fill('', { force: true }).catch(() => {});
      await searchInput.fill(term, { force: true }).catch(async () => {
        await searchInput.evaluate((el, v) => {
          el.value = v;
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }, term);
      });
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(1200);
      const html = await page.content();
      results.searches.push({ term, expectSlug, hit: html.includes(expectSlug) });
    }
  } else {
    results.searches.push({ error: 'no search input' });
  }

  // 旧 URL 与新增页面可达
  for (const url of [
    ...OLD_URLS,
    ...NEW_PAGES,
    '/history',
    '/developer/history/',
  ]) {
    const resp = await page.goto(BASE + url, { waitUntil: 'load' }).catch(() => null);
    const finalPath = new URL(page.url()).pathname.replace(/\/$/, '') || '/';
    const expectedPath = HISTORY_REDIRECTS[url.replace(/\/$/, '')] || HISTORY_REDIRECTS[url];
    results.urls.push({
      url,
      ok: !!resp && resp.status() === 200,
      finalPath,
      ...(expectedPath ? { redirectOk: finalPath === expectedPath } : {}),
    });
    if (expectedPath && finalPath !== expectedPath) {
      results.errors.push(`history redirect mismatch: ${url} -> ${finalPath}; expected ${expectedPath}`);
    }
  }

  // 未审核 AI 草稿不得公开
  const draftResp = await page.goto(BASE + '/ai-drafts/2026-11-15-agents-md-59f1fc50', { waitUntil: 'load' }).catch(() => null);
  results.mobile.aiDraftStatus = draftResp ? draftResp.status() : 'ERR';

  // 专题页：代码块、表格、反向链接、图谱
  await page.goto(BASE + '/developer/architecture/kotlin-runtime', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  results.mobile.kotlinPage = (await page.title()).includes('Kotlin');
  results.mobile.codeBlocks = await page.locator('pre code').count();
  results.mobile.backlinksHeading = /Backlinks|反向链接/.test(await page.content());
  results.mobile.graphWidget = (await page.content()).includes('Global Graph');
  results.mobile.overflowKotlin = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

  await page.goto(BASE + '/player/gameplay/challenges', { waitUntil: 'load' });
  results.mobile.challengePageHasZenith = (await page.content()).includes('永恒挑战');

  // 原版翻译页：来源与许可必须可见
  await page.goto(BASE + '/player/original/ow-infinity', { waitUntil: 'load' });
  const trHtml = await page.content();
  results.mobile.translationHasLicense = trHtml.includes('CC BY-SA 4.0') && trHtml.includes('来源与许可');
  await page.goto(BASE + '/player/original/', { waitUntil: 'load' });
  const folderListing = page.locator('.page-listing');
  results.mobile.translationFolderListingHidden =
    (await folderListing.count()) === 0 ||
    (await folderListing.first().evaluate((el) => getComputedStyle(el).display === 'none'));
  const noteProperties = page.locator('.note-properties');
  results.mobile.translationPropertiesHidden =
    (await noteProperties.count()) === 0 ||
    (await noteProperties.first().evaluate((el) => getComputedStyle(el).display === 'none'));
  await page.goto(BASE + '/developer/build/agp', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  results.mobile.codePre = await page.locator('pre').count();
  results.mobile.codeSpans = await page.locator('pre code span').count();
  results.mobile.tables = await page.locator('table').count();

  // 暗色模式
  await page.goto(BASE + '/developer/architecture/kotlin-runtime', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  const beforeBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const darkBtn = page.locator('button[aria-label*="暗色"], button[aria-label*="dark" i]').first();
  if (await darkBtn.count()) {
    await darkBtn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(800);
  }
  const afterBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  results.mobile.darkmodeToggled = beforeBg !== afterBg;
  results.mobile.bgBefore = beforeBg;
  results.mobile.bgAfter = afterBg;

  // 桌面可读性
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const dpage = await desktop.newPage();
  await dpage.goto(BASE + '/', { waitUntil: 'load' });
  results.desktop.title = await dpage.title();
  results.desktop.overflow = await dpage.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  results.desktop.hasSearch = (await dpage.locator('input[type="search"], input[placeholder]').count()) > 0;
  results.errors = consoleErrors;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(results, null, 1));

  const bad = [];
  if (!results.mobile.title.includes('反物质维度')) bad.push('title');
  if (results.mobile.overflow > 2) bad.push('mobile-overflow:' + results.mobile.overflow);
  if (!results.searches.length || results.searches.some((s) => s.hit === false)) bad.push('search');
  if (results.categories.some((c) => !c.hit)) bad.push('category-labels');
  if (results.urls.some((u) => !u.ok)) bad.push('urls:' + results.urls.filter((u) => !u.ok).map((u) => u.url).join(','));
  if (results.mobile.aiDraftStatus !== 404) bad.push('ai-draft-public:' + results.mobile.aiDraftStatus);
  if (!results.mobile.translationHasLicense) bad.push('translation-license-block');
  if (!results.mobile.translationFolderListingHidden) bad.push('translation-folder-listing-visible');
  if (!results.mobile.translationPropertiesHidden) bad.push('translation-properties-visible');
  if (!results.mobile.kotlinPage) bad.push('kotlin-nav');
  if (!results.mobile.sidebar) bad.push('sidebar-missing');
  else {
    if (results.mobile.sidebar.items.map((i) => i.label).join('|') !== EXPECTED_SIDEBAR.join('|')) bad.push('sidebar-order');
    if (!results.mobile.sidebar.expanded) bad.push('sidebar-expanded');
    if (results.mobile.sidebar.items.some((i) => i.truncated)) bad.push('sidebar-truncated');
    if (weakMustSee(results.mobile.sidebar.items)) bad.push('sidebar-visibility');
  }
  if (!results.mobile.sidebarCollapsed) bad.push('sidebar-collapse');
  if (!results.mobile.sidebarActive ||
    !results.mobile.sidebarActive.includes('/player/gameplay/challenges')) bad.push('sidebar-active');
  if (!results.mobile.darkmodeToggled) bad.push('darkmode');
  if (results.errors.length > 3) bad.push('console-errors');
  console.log(JSON.stringify({ bad, results }, null, 1).slice(0, 6000));
  await browser.close();
  process.exit(bad.length ? 1 : 0);
}
run().catch((e) => {
  console.error('E2E FAIL', String(e).slice(0, 500));
  process.exit(2);
});
