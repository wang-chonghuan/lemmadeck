import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const nativePath = `${ticket}/tmp/d1816-d1007-n73-first-en-native/result.json`;
const displayPath = `${ticket}/tmp/d1816-d1008-n73-first-en-full-course-display/report.json`;
const holdPath = `${ticket}/tmp/d1816-d1006-n73-first-en-independent-review/batch2-saved-pixel-review.json`;
const row = read(nativePath).rows[0], lesson = read(row.lesson.path);
assert.equal(read(holdPath).findings[0].id, 'N73-MOBILE-01');
assert.equal(bind(row.textHtml.path).sha256, row.textHtml.sha256);
const equation = lesson.prose[12].text.match(/^\$([^$]+)\$/)[1];
assert(equation.endsWith('=-\\Delta E_P'));
const out = `${repo}/.tmp/STEMROBIN-181/d1816-d1024/mobile-equation`;
assert(!fs.existsSync(out));
fs.mkdirSync(out, { recursive: true });
const reportPath = `${ticket}/tmp/d1816-d1024-n73-mobile-equation-scroll-end/report.json`;
save(reportPath.replace('report.json', 'inputs.freeze.json'), {
  task: 'D1024', native: bind(nativePath), display: bind(displayPath), firstMobileHold: bind(holdPath),
  nativeHtml: row.textHtml, lesson: row.lesson, equation, affectedObject: 12,
  viewport: { width: 390, height: 844 }, browserMode: 'isolated-headless',
  wholeCourseDomAndPixelsReplayed: false, rendererInvoked: false, contentChanged: false,
});
let browser, failure = null, screenshot = null, observation = null;
const requests = [], errors = [];
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, offline: true, serviceWorkers: 'block',
  });
  await context.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setContent(fs.readFileSync(row.textHtml.path, 'utf8'), { waitUntil: 'load' });
  await page.locator('a.jump').evaluateAll(nodes => nodes.forEach(node => node.remove()));
  await page.evaluate(() => document.fonts.ready);
  const formula = page.locator('.nb').filter({ has: page.locator('annotation').filter({ hasText: equation }) });
  assert.equal(await formula.count(), 1);
  assert.equal(await formula.locator('annotation').textContent(), equation);
  await formula.scrollIntoViewIfNeeded();
  const measure = node => {
    const rect = node.getBoundingClientRect();
    const base = [...node.querySelectorAll('.katex-html .base')].at(-1);
    if (!base) throw Error('Missing terminal KaTeX base');
    const end = base.getBoundingClientRect();
    return {
      clientWidth: node.clientWidth, scrollWidth: node.scrollWidth, scrollLeft: node.scrollLeft,
      overflowX: getComputedStyle(node).overflowX,
      formulaBox: { x: rect.x, y: rect.y, right: rect.right, width: rect.width, height: rect.height },
      terminalText: base.textContent,
      terminalBox: { x: end.x, y: end.y, right: end.right, width: end.width, height: end.height },
    };
  };
  const before = await formula.evaluate(measure);
  assert(before.scrollWidth > before.clientWidth);
  assert(['auto', 'scroll'].includes(before.overflowX));
  await formula.evaluate(node => { node.scrollLeft = node.scrollWidth; });
  await page.waitForFunction(text => {
    const annotation = [...document.querySelectorAll('annotation')].find(node => node.textContent === text);
    const node = annotation?.closest('.nb');
    return node && Math.abs(node.scrollWidth - node.clientWidth - node.scrollLeft) <= 1;
  }, equation);
  const after = await formula.evaluate(measure);
  assert(after.scrollLeft > before.scrollLeft);
  assert(after.terminalText.includes('\u0394'));
  assert(after.terminalBox.x >= after.formulaBox.x - 1);
  assert(after.terminalBox.right <= after.formulaBox.right + 1);
  const paragraph = formula.locator('xpath=ancestor::p[1]');
  assert.equal(await paragraph.count(), 1);
  assert((await paragraph.innerText()).includes('(8-21)'));
  const file = `${out}/en-mobile-equation-8-21-scroll-end.png`;
  await paragraph.screenshot({ path: file });
  screenshot = bind(file);
  observation = { before, after, equationLabel: '(8-21)',
    terminalGlyphsReached: true, maxScrollPositionReached: true,
    horizontalScrollChangesOnlyAffectedFormula: true, fontsLoaded: await page.evaluate(() => document.fonts.status === 'loaded') };
  assert(observation.fontsLoaded);
  assert.deepEqual(requests, []);
  assert.deepEqual(errors, []);
  await context.close();
} catch (error) {
  failure = { message: error.message, stack: error.stack };
} finally { if (browser) await browser.close(); }
save(reportPath, {
  task: 'D1024', status: failure ? 'FAIL' : 'AFFECTED_MOBILE_EQUATION_TERMINAL_SCROLL_DOM_PASS_PIXELS_PENDING',
  native: bind(nativePath), originalDisplay: bind(displayPath), firstMobileHold: bind(holdPath),
  affectedObject: 12, equation, observation, screenshot, requests, errors, failure,
  browserClosed: true, browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  originalContentAndHtmlAndFiguresUnchanged: bind(row.textHtml.path).sha256 === row.textHtml.sha256,
  wholeCourseDomAndPixelReplay: false, rendererCalls: 0, newImagesProduced: screenshot ? 1 : 0,
  parentImagesOpened: 0, paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0,
});
assert.equal(failure, null, failure?.message);
console.log(JSON.stringify({ report: bind(reportPath), screenshot }));
