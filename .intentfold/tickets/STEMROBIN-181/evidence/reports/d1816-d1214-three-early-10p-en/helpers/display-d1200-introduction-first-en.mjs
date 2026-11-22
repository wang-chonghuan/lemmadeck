import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const { proseFlow } = createRequire(import.meta.url)(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const nativePath = `${ticket}/tmp/d1816-d1196-introduction-first-en/native-result.json`;
const native = read(nativePath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
const row = native.rows[0], lesson = read(row.lesson.path);
const out = `${ticket}/tmp/d1816-d1200-introduction-first-en-display`;
assert.equal(lesson.prose.length, 4);
assert.equal(read(row.audit.path).status, 'pass');
assert.equal(read(row.exercises.path).count, 0);
assert.equal(read(row.figures.path).figures.length, 0);
fs.mkdirSync(out, { recursive: false });
const allowed = new Set([row.textHtml, row.exercisesHtml].map(file => pathToFileURL(file.path).href));
const views = [], requests = [];
const comparable = text => text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\s/g, '');
let browser, failure = null;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, serviceWorkers: 'block' });
    try {
      await context.route('**/*', route => {
        const url = route.request().url(), permitted = allowed.has(url);
        requests.push({ url, permitted });
        return permitted ? route.continue() : route.abort();
      });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      const html = fs.readFileSync(row.textHtml.path, 'utf8');
      assert(!/<(?:script|link|iframe|object|embed)\b/i.test(html));
      assert(html.includes('data:font/woff2;base64,'));
      await page.goto(pathToFileURL(row.textHtml.path).href, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('input,textarea,button,figure,img,svg,.err,.katex-error,.sr-tex-err').count(), 0);
      const expected = proseFlow(lesson.prose, lesson.section_breaks).filter(block => block.kind === 'p');
      const paragraphs = await page.locator('p.para').evaluateAll(nodes => nodes.map(node => ({
        text: node.textContent, lineBreaks: node.querySelectorAll('br').length,
      })));
      assert.equal(paragraphs.length, expected.length);
      for (const [i, paragraph] of paragraphs.entries()) {
        assert.equal(comparable(paragraph.text), comparable(expected[i].text));
        assert.equal(paragraph.lineBreaks, (expected[i].text.match(/\n/g) || []).length);
      }
      const heading = await page.locator('h1').innerText(), crumb = await page.locator('.crumb').innerText();
      assert(heading.includes('Introduction'));
      assert(crumb.includes('Oscillations and Waves'));
      assert(!/[\u3400-\u9fff]/.test(await page.locator('.sheet').innerText()));
      const geometry = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        fontsLoaded: document.fonts.status === 'loaded',
        boxes: [...document.querySelector('.sheet').children].map(node => {
          const rect = node.getBoundingClientRect();
          return { tag: node.tagName, x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom,
            width: rect.width, height: rect.height };
        }),
      }));
      assert(geometry.fontsLoaded && geometry.pageWidth <= viewport.width + 1);
      assert(geometry.boxes.every(box => box.width > 0 && box.height > 0 && box.x >= -1
        && box.right <= viewport.width + 1));
      for (let i = 1; i < geometry.boxes.length; i++)
        assert(geometry.boxes[i].y >= geometry.boxes[i - 1].bottom - 1, 'Sheet item overlap');
      const screenshot = `${out}/en-${viewport.name}-whole.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      const focusIndex = expected.findIndex(block => block.text.startsWith('At first,'));
      assert(focusIndex >= 0);
      await page.locator('p.para').nth(focusIndex).scrollIntoViewIfNeeded();
      const focusScreenshot = `${out}/en-${viewport.name}-analogy-viewport.png`;
      await page.screenshot({ path: focusScreenshot });
      const renderedHtml = `${out}/en-${viewport.name}.html`;
      fs.writeFileSync(renderedHtml, await page.content(), { flag: 'wx' });
      const forward = page.getByRole('link', { name: 'Exercises · 0 →', exact: true });
      await forward.click();
      await page.waitForURL(pathToFileURL(row.exercisesHtml.path).href);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('li.ex,figure,input,textarea,.err,.katex-error').count(), 0);
      const back = page.getByRole('link', { name: '← Back to text', exact: true });
      assert(await back.isVisible());
      await back.click();
      await page.waitForURL(pathToFileURL(row.textHtml.path).href);
      assert.deepEqual(errors, []);
      views.push({
        id: `en-${viewport.name}`, viewport, status: 'PASS',
        nativeHtml: row.textHtml, html: bind(renderedHtml), screenshot: bind(screenshot),
        focusScreenshot: bind(focusScreenshot), heading, crumb, geometry,
        paragraphs: paragraphs.length, originalObjects: 4, originalTasks: 0, originalFigures: 0,
        forwardAndBackNavigation: true, errors,
      });
    } finally { await context.close(); }
  }
} catch (error) {
  failure = { message: error.message, stack: error.stack };
} finally { if (browser) await browser.close(); }
save(`${out}/report.json`, {
  task: 'D1200', card: lesson.id, status: failure ? 'FAIL' : 'FIRST_EN_DESKTOP_MOBILE_DOM_PASS_PIXELS_PENDING',
  native: bind(nativePath), views, requests, failure, browserClosed: true, headed: false,
  browserMode: 'isolated-headless', offlineLocalFilesOnly: true, parentImagesOpened: 0,
  executedHelper: bind(import.meta.filename), databaseWrites: 0, paidCalls: 0,
  fullResolutionAllGlyphOrHeadedAcceptanceClaimed: false,
});
assert.equal(failure, null, failure?.message);
assert.equal(views.length, 2);
assert(requests.every(request => request.permitted));
console.log(JSON.stringify({ report: bind(`${out}/report.json`), images: 4 }));
