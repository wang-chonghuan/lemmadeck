import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const card = 'phy9-c2-s2-n72';
const nativePath = `${ticket}/tmp/d1816-d997-n72-first-en-native/result.json`;
const native = read(nativePath);
assert.equal(native.status, 'FIRST_MISSING_EN_NATIVE_FINALIZE_RENDER_PASS');
const row = native.rows[0], lesson = read(row.lesson.path);
assert.equal(lesson.prose.length, 13);
const out = `${repo}/.tmp/STEMROBIN-181/d1816-d998/full-course-display`;
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
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      const html = fs.readFileSync(row.textHtml.path, 'utf8');
      assert(!/<(?:script|link|iframe|object|embed|img)\b/i.test(html));
      assert(html.includes('data:font/woff2;base64,'));
      await page.setContent(html, { waitUntil: 'load' });
      await page.locator('a.jump').evaluateAll(nodes => nodes.forEach(node => node.remove()));
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('a,input,textarea,button,script,link,iframe,img,.err,.katex-error,.sr-tex-err').count(), 0);
      const expected = proseFlow(lesson.prose, lesson.section_breaks).filter(block => block.kind === 'p');
      const paragraphs = await page.locator('p.para').evaluateAll(nodes => nodes.map(node => {
        const clone = node.cloneNode(true);
        for (const formula of clone.querySelectorAll('.katex')) {
          const annotation = formula.querySelector('annotation');
          if (!annotation) throw Error('Missing KaTeX annotation');
          formula.replaceWith(document.createTextNode(`$${annotation.textContent}$`));
        }
        return clone.textContent;
      }));
      assert.equal(paragraphs.length, 14);
      assert.equal(paragraphs.length, expected.length);
      for (let index = 0; index < expected.length; index++)
        assert.equal(comparable(paragraphs[index]), comparable(expected[index].text));
      const heading = await page.locator('h1').innerText(), crumb = await page.locator('.crumb').innerText();
      assert(heading.includes(lesson.title));
      assert(crumb.includes('Chapter 8. Electrostatics'));
      const visibleText = await page.locator('.sheet').innerText();
      assert(!/[\u3400-\u9fff]/.test(visibleText));
      assert(!/correct_index|answerKey|answer-keys|displayAnswer|independent_solution|source_solution/.test(html));
      const captions = await page.locator('.figcap').allTextContents();
      assert.deepEqual(captions, ['Figure 134', 'Figure 135', 'Figure 136', 'Figure 137']);
      const figureIds = await page.locator('figure').evaluateAll(nodes => nodes.map(node => node.id));
      assert.deepEqual(figureIds, row.assets.map(asset => asset.id));
      assert.equal(await page.locator('figure .figure-media > svg').count(), 4);
      const geometry = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        boxes: [...document.querySelector('.sheet').children].map(node => {
          const rect = node.getBoundingClientRect();
          return { tag: node.tagName, x: rect.x, y: rect.y, right: rect.right,
            bottom: rect.bottom, width: rect.width, height: rect.height };
        }),
        fontsLoaded: document.fonts.status === 'loaded',
        figures: [...document.querySelectorAll('figure')].map(node => {
          const media = node.querySelector('.figure-media'), svg = media.querySelector('svg');
          const rect = media.getBoundingClientRect();
          const labels = [...svg.querySelectorAll('[data-label-id]')].map(label => {
            const matrix = label.getScreenCTM(), box = label.getBoundingClientRect();
            return { id: label.getAttribute('data-label-id'),
              pixels: parseFloat(getComputedStyle(label).fontSize) * Math.hypot(matrix.a, matrix.b),
              box: { x: box.x, y: box.y, width: box.width, height: box.height },
              text: label.textContent };
          });
          return { id: node.id, width: rect.width, height: rect.height,
            ariaLabel: node.getAttribute('aria-label'),
            graphicElements: svg.querySelectorAll('path,line,circle,ellipse,polygon,polyline,rect').length,
            labels };
        }),
      }));
      assert(geometry.pageWidth <= viewport.width + 1);
      assert(geometry.fontsLoaded);
      assert(geometry.boxes.every(box => box.width > 0 && box.height > 0
        && box.x >= -1 && box.right <= viewport.width + 1));
      for (let index = 1; index < geometry.boxes.length; index++)
        assert(geometry.boxes[index].y >= geometry.boxes[index - 1].bottom - 1, 'Sheet item overlap');
      for (const figure of geometry.figures) {
        assert(figure.width > 0 && figure.height > 0 && figure.graphicElements > 0);
        assert(figure.labels.length > 0);
        assert(figure.labels.every(label => label.pixels >= 16 - 0.01));
        assert.equal(figure.ariaLabel, `\u56fe${figure.id.slice(4)}`);
      }
      assert.deepEqual(requests, []);
      assert.deepEqual(errors, []);
      const standalone = await page.content(), htmlFile = `${out}/${activeView}.html`;
      fs.writeFileSync(htmlFile, standalone, { flag: 'wx' });
      const screenshot = `${out}/${activeView}-whole.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      const definitionIndex = expected.findIndex(block =>
        block.text.startsWith('**Electric polarization and the internal field**'));
      assert(definitionIndex >= 0);
      await page.locator('p.para').nth(definitionIndex).scrollIntoViewIfNeeded();
      const definitionScreenshot = `${out}/${activeView}-polarization-viewport.png`;
      await page.screenshot({ path: definitionScreenshot, fullPage: false });
      const figureScreenshots = [];
      for (const id of figureIds) {
        const locator = page.locator(`figure#${id}`);
        await locator.scrollIntoViewIfNeeded();
        const file = `${out}/${activeView}-${id}.png`;
        await locator.screenshot({ path: file });
        figureScreenshots.push({ id, image: bind(file),
          actualMediaWidth: geometry.figures.find(figure => figure.id === id).width });
      }
      views.push({
        id: activeView, locale: row.locale, edition: row.edition, viewport,
        status: 'FIRST_COMPLETE_EN_COURSE_DOM_PASS_PIXELS_PENDING',
        lesson: row.lesson, nativeHtml: row.textHtml, html: bind(htmlFile),
        screenshot: bind(screenshot), definitionScreenshot: bind(definitionScreenshot),
        figureScreenshots, heading, crumb, captions, paragraphs: paragraphs.length, geometry, errors,
        allOriginalSourceObjectsRetained: true, originalObjects: 13, originalTasks: 0, originalFigures: 4,
        completeEnglishAccessibilityApproval: false,
        machineChineseAriaLabelsRetainedAndDisclosed: true,
      });
    } finally { await context.close(); }
  }
} catch (error) {
  failure = { view: activeView, message: error.message, stack: error.stack };
} finally { if (browser) await browser.close(); }
const report = `${ticket}/tmp/d1816-d998-n72-first-en-full-course-display/report.json`;
save(report, {
  task: 'D998', card, status: failure ? 'FAIL' : 'TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING',
  views, requests, failure, browserClosed: true, headed: true, parentImagesOpened: 0,
  native: bind(nativePath), offline: true, databaseWrites: 0, paidCalls: 0,
  completeCourseApproval: false, completeEnglishAccessibilityApproval: false,
  sourceAndZhReviewReplayed: false, newCompleteCourses: 0, newSourcePages: 0,
});
assert.equal(failure, null, failure?.message);
assert.equal(views.length, 2);
console.log(JSON.stringify({ report: bind(report), views: 2, screenshots: 12, browserClosed: true }));
