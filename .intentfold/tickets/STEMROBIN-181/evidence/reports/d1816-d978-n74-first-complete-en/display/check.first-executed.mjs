import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const nativePath = `${ticket}/tmp/d1816-d974-n74-first-en-native-recovery/result.json`;
const native = read(nativePath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
const out = `${repo}/.tmp/STEMROBIN-181/d1816-d972/full-course-display`;
assert(!fs.existsSync(out));
fs.mkdirSync(out, { recursive: true });
const comparable = text => text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\s/g, '');
const views = [], requests = [];
let browser, activeView, failure = null;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: false });
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const row = native.rows[0];
    activeView = `en-${viewport.name}`;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1, offline: true, serviceWorkers: 'block',
    });
    try {
      await context.route('**/*', route => {
        requests.push({ view: activeView, url: route.request().url() });
        return route.abort();
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      const lesson = read(row.lesson.path);
      const html = fs.readFileSync(row.textHtml.path, 'utf8');
      assert(!/<(?:script|link|iframe|object|embed|img)\b/i.test(html));
      assert(html.includes('data:font/woff2;base64,'));
      await page.setContent(html, { waitUntil: 'load' });
      await page.locator('a.jump').evaluateAll(nodes => nodes.forEach(node => node.remove()));
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('a,input,textarea,button,script,link,iframe,img,.err,.katex-error,.sr-tex-err').count(), 0);
      const standalone = await page.content();
      assert(!/correct_index|answerKey|answer-keys|displayAnswer|independent_solution|source_solution|rationales/.test(standalone));
      const expected = proseFlow(lesson.prose, lesson.section_breaks);
      const paragraphs = await page.locator('p.para').evaluateAll(nodes => nodes.map(node => {
        const clone = node.cloneNode(true);
        for (const formula of clone.querySelectorAll('.katex')) {
          const annotation = formula.querySelector('annotation');
          if (!annotation) throw Error('Missing KaTeX annotation');
          formula.replaceWith(document.createTextNode(`$${annotation.textContent}$`));
        }
        return clone.textContent;
      }));
      assert.equal(paragraphs.length, expected.length);
      for (let index = 0; index < expected.length; index++)
        assert.equal(comparable(paragraphs[index]), comparable(expected[index].text));
      const heading = await page.locator('h1').innerText();
      assert(heading.includes(lesson.title));
      assert(!/[\u3400-\u9fff]/.test(heading));
      const crumb = await page.locator('.crumb').innerText();
      assert(crumb.includes('Chapter 8. Electrostatics'));
      assert(!/[\u3400-\u9fff]/.test(crumb));
      assert(paragraphs.every(text => !/[\u3400-\u9fff]/.test(text)));
      assert.equal(await page.locator('figure').count(), 0);
      assert.equal(await page.locator('p.para').nth(5).locator('strong').count(), 1);
      const definition = await page.locator('p.para').nth(5).locator('strong').innerText();
      assert(definition.startsWith('The electric potential at a point'));
      const geometry = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        boxes: [...document.querySelector('.sheet').children].map(node => {
          const r = node.getBoundingClientRect();
          return { tag: node.tagName, x: r.x, y: r.y, right: r.right,
            bottom: r.bottom, width: r.width, height: r.height };
        }),
        mathCount: document.querySelectorAll('.katex').length,
        fontsLoaded: document.fonts.status === 'loaded',
        formulaScrollRegions: [...document.querySelectorAll('.nb')].map(node => ({
          clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
          overflowX: getComputedStyle(node).overflowX,
        })),
      }));
      assert(geometry.pageWidth <= viewport.width + 1);
      assert(geometry.fontsLoaded && geometry.mathCount > 0);
      assert(geometry.boxes.every(box => box.width > 0 && box.height > 0
        && box.x >= -1 && box.right <= viewport.width + 1));
      for (let index = 1; index < geometry.boxes.length; index++)
        assert(geometry.boxes[index].y >= geometry.boxes[index - 1].bottom - 1, 'Sheet item overlap');
      assert.deepEqual(requests, []);
      assert.deepEqual(errors, []);
      const htmlFile = `${out}/${activeView}.html`;
      fs.writeFileSync(htmlFile, standalone, { flag: 'wx' });
      const screenshot = `${out}/${activeView}-whole.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      await page.locator('p.para').nth(5).scrollIntoViewIfNeeded();
      const definitionScreenshot = `${out}/${activeView}-definition-viewport.png`;
      await page.screenshot({ path: definitionScreenshot, fullPage: false });
      await page.locator('.katex').last().scrollIntoViewIfNeeded();
      const formulaScreenshot = `${out}/${activeView}-formula-viewport.png`;
      await page.screenshot({ path: formulaScreenshot, fullPage: false });
      const lastFormula = page.locator('.nb').filter({ has: page.locator('.katex') }).last();
      const scroll = await lastFormula.evaluate(node => {
        const maximum = node.scrollWidth - node.clientWidth;
        node.scrollLeft = maximum;
        return { maximum, actual: node.scrollLeft, overflowX: getComputedStyle(node).overflowX };
      });
      let formulaRightScreenshot = null;
      if (scroll.maximum > 1) {
        assert.equal(scroll.overflowX, 'auto');
        assert(Math.abs(scroll.actual - scroll.maximum) <= 1);
        const file = `${out}/${activeView}-formula-right-viewport.png`;
        await page.screenshot({ path: file, fullPage: false });
        formulaRightScreenshot = bind(file);
      }
      views.push({
        id: activeView, locale: row.locale, edition: row.edition, viewport,
        status: 'FIRST_COMPLETE_EN_COURSE_DOM_PASS_PIXELS_PENDING',
        lesson: row.lesson, nativeHtml: row.textHtml, html: bind(htmlFile),
        screenshot: bind(screenshot), definitionScreenshot: bind(definitionScreenshot),
        formulaScreenshot: bind(formulaScreenshot), formulaRightScreenshot, scroll, heading, crumb, definition,
        paragraphs: paragraphs.length, geometry, errors,
        all25SourceObjectsRetained: true, originalTasks: 0, originalFigures: 0,
      });
    } finally { await context.close(); }
  }
} catch (error) {
  failure = { view: activeView, message: error.message, stack: error.stack };
} finally {
  if (browser) await browser.close();
}
const report = `${ticket}/tmp/d1816-d972-n74-first-en-full-course-display/report.json`;
save(report, {
  task: 'D972', status: failure ? 'FAIL' : 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING',
  views, requests, failure, browserClosed: true, headed: true,
  parentImagesOpened: 0, offline: true, native: bind(nativePath),
  databaseWrites: 0, paidCalls: 0, completeCourseApproval: false,
  sourceAndZhReviewReplayed: false, newCompleteCourses: 0, newSourcePages: 0,
});
assert.equal(failure, null, failure?.message);
assert.equal(views.length, 2);
console.log(JSON.stringify({ report: bind(report), views: 2,
  screenshots: views.reduce((count, view) => count + 3 + Number(Boolean(view.formulaRightScreenshot)), 0),
  browserClosed: true }));
