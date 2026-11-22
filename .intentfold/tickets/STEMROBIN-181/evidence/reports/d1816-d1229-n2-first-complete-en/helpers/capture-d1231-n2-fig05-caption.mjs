import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const originalPath = `${ticket}/tmp/d1816-d1226-n2-source-aria-display-recovery/report.json`;
const original = read(originalPath);
assert.equal(original.status, 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING');
const out = `${repo}/.tmp/STEMROBIN-181/d1816-d1231/fig05-caption`;
assert(!fs.existsSync(out));
fs.mkdirSync(out, { recursive: true });
const views = [], requests = [], browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const view of original.views) {
    assert.equal(bind(view.html.path).sha256, view.html.sha256);
    const context = await browser.newContext({ viewport: {
      width: view.viewport.width, height: view.viewport.height,
    }, offline: true, serviceWorkers: 'block' });
    try {
      const page = await context.newPage(), errors = [];
      await context.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
      page.on('pageerror', error => errors.push(error.message));
      await page.setContent(fs.readFileSync(view.html.path, 'utf8'), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.locator('figure#fig-05').evaluate(figure => {
        const caption = figure.nextElementSibling;
        if (!caption?.classList.contains('figcap') || caption.textContent.trim() !== 'Figure 5')
          throw Error('The actual next visible Figure 5 caption is missing');
        const initial = figure.getBoundingClientRect();
        window.scrollTo({ top: Math.max(0, initial.top + window.scrollY - 32), behavior: 'instant' });
        const f = figure.getBoundingClientRect(), c = caption.getBoundingClientRect();
        return { figure: { x: f.x, y: f.y, right: f.right, bottom: f.bottom },
          caption: { x: c.x, y: c.y, right: c.right, bottom: c.bottom, text: caption.textContent },
          viewport: { width: innerWidth, height: innerHeight } };
      });
      for (const box of [geometry.figure, geometry.caption])
        assert(box.x >= -1 && box.y >= -1 && box.right <= geometry.viewport.width + 1
          && box.bottom <= geometry.viewport.height + 1);
      assert(geometry.caption.y >= geometry.figure.bottom - 1);
      assert.deepEqual(errors, []);
      const screenshot = `${out}/${view.id}-fig05-with-caption.png`;
      await page.screenshot({ path: screenshot, fullPage: false });
      views.push({ id: view.id, viewport: view.viewport, screenshot: bind(screenshot), geometry,
        originalHtml: view.html, nativeHtml: view.nativeHtml,
        originalFigureScreenshot: view.figureScreenshots.find(figure => figure.id === 'fig-05').image });
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
assert.deepEqual(requests, []);
save(`${ticket}/tmp/d1816-d1231-n2-fig05-caption/report.json`, {
  task: 'D1231', card: 'phy10-c1-s2-n2',
  status: 'AFFECTED_FIG05_AND_CAPTION_SAME_VIEWPORT_DOM_PASS_PIXELS_PENDING',
  originalDisplay: bind(originalPath), views, requests, browserClosed: true,
  originalContentHtmlFiguresAndPassedDisplayUnchanged: true,
  fullNativeOrSourceScienceOrFigureReviewReplayed: false, parentImagesOpened: 0,
  browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  completeEnglishAccessibilityApproval: false, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ report: bind(`${ticket}/tmp/d1816-d1231-n2-fig05-caption/report.json`) }));
