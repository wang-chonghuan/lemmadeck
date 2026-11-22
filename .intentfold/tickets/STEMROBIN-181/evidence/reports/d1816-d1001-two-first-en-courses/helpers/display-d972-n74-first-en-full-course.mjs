import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const card = process.argv[2] || 'phy9-c2-s2-n74';
const configurations = {
  'phy9-c2-s2-n74': { task: 'D972', native: 'd1816-d974-n74-first-en-native-recovery',
    directory: 'd1816-d972-n74-first-en-full-course-display', objects: 25,
    definitionIndex: 5, definitionStarts: 'The electric potential at a point' },
  'phy9-c2-s2-n79': { task: 'D980', native: 'd1816-d979-n79-first-en-native',
    directory: 'd1816-d980-n79-first-en-full-course-display', objects: 9,
    definitionIndex: 1, definitionStarts: 'Under these conditions' },
  'phy9-c2-s2-n63': { task: 'D992', native: 'd1816-d991-n63-first-en-native',
    directory: 'd1816-d992-n63-first-en-full-course-display', objects: 26,
    definitionStarts: 'For two equal point charges in vacuum',
    formulaTex: '\\varepsilon_0=\\frac{1}{4\\pi k}' },
};
const config = configurations[card];
assert(config);
const nativePath = `${ticket}/tmp/${config.native}/result.json`;
const native = read(nativePath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
assert.equal(native.card, card);
const out = `${repo}/.tmp/STEMROBIN-181/d1816-${config.task.toLowerCase()}/full-course-display`;
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
      assert.equal(lesson.prose.length, config.objects);
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
      const definitionIndex = config.definitionIndex ?? expected.findIndex(block =>
        block.text.includes(`**${config.definitionStarts}`));
      assert(definitionIndex >= 0);
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
      assert.equal(await page.locator('p.para').nth(definitionIndex).locator('strong').count(), 1);
      const definition = await page.locator('p.para').nth(definitionIndex).locator('strong').innerText();
      assert(definition.startsWith(config.definitionStarts));
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
      await page.locator('p.para').nth(definitionIndex).scrollIntoViewIfNeeded();
      const definitionScreenshot = `${out}/${activeView}-definition-viewport.png`;
      await page.screenshot({ path: definitionScreenshot, fullPage: false });
      const formulaRegion = config.formulaTex
        ? page.locator('.nb').filter({
          has: page.locator('annotation').filter({ hasText: config.formulaTex }),
        })
        : page.locator('.nb').filter({ has: page.locator('.katex') }).last();
      assert.equal(await formulaRegion.count(), 1);
      await formulaRegion.scrollIntoViewIfNeeded();
      const formulaScreenshot = `${out}/${activeView}-formula-viewport.png`;
      await page.screenshot({ path: formulaScreenshot, fullPage: false });
      const scroll = await formulaRegion.evaluate(node => {
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
        allOriginalSourceObjectsRetained: true, originalObjects: config.objects,
        originalTasks: 0, originalFigures: 0,
      });
    } finally { await context.close(); }
  }
} catch (error) {
  failure = { view: activeView, message: error.message, stack: error.stack };
} finally {
  if (browser) await browser.close();
}
const report = `${ticket}/tmp/${config.directory}/report.json`;
save(report, {
  task: config.task, card, status: failure ? 'FAIL' : 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING',
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
