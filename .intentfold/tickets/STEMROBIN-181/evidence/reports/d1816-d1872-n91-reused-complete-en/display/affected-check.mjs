import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const card = 'phy10-c2-s3-n91';
const prior = `${ticket}/evidence/reports/d1059-n91`;
const native = read(`${ticket}/tmp/d1816-d1866-n91-printed-title-recovery/result.json`);
const out = `${ticket}/tmp/d1816-d1869-n91-formula-style-display`;
const images = `${repo}/.tmp/STEMROBIN-181/d1816-d1869/display`;
fs.mkdirSync(images, { recursive: true });
const oldCss = '.nb{display:inline-block;max-width:100%;overflow-x:auto;overflow-y:hidden;padding-block:.15em;vertical-align:middle;white-space:nowrap}';
const newCss = '.nb{display:inline-block;box-sizing:border-box;max-width:100%;overflow-x:auto;overflow-y:hidden;padding:.15em .1em .25em;vertical-align:middle;white-space:nowrap}';
const htmlApplicability = native.html.map(file => {
  const name = file.path.split('/').at(-1);
  const oldFile = `${prior}/en/html/${name}`;
  const original = fs.readFileSync(oldFile, 'utf8');
  const current = fs.readFileSync(file.path, 'utf8');
  assert.equal(original.replace(oldCss, newCss), current);
  return { original: bind(oldFile), current: bind(file.path), onlyChangedSelector: '.nb' };
});
const reviewedDisplay = read(`${prior}/display-composition.json`);
assert.equal(reviewedDisplay.fullDISPLAY, true);
for (const review of reviewedDisplay.reviews)
  assert.equal(bind(`${repo}/${review.path}`).sha256, review.sha256);
const oldExercises = fs.readFileSync(`${prior}/en/html/exercises.html`, 'utf8');
assert.equal((oldExercises.match(/class="nb"/g) || []).length, 0);
const report = {
  card, status: 'IN_PROGRESS', htmlApplicability,
  priorCompleteDisplay: bind(`${prior}/display-composition.json`),
  unchangedExerciseAnswerChoiceDisplaysReused: true,
  changedSelector: '.nb', views: [], requests: [],
  browserMode: 'isolated-headless-offline',
  headedAcceptanceClaimed: false, completeEnglishAccessibilityApproval: false,
  embeddedFontCertificationClaimed: false, databaseWrites: 0, paidCalls: 0,
};
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 960 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport });
    await context.route('**/*', route => {
      report.requests.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setContent(fs.readFileSync(native.html[0].path, 'utf8'), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => ({
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      paragraphs: document.querySelectorAll('p.para').length,
      wrappers: [...document.querySelectorAll('.nb')].map(node => {
        const box = node.getBoundingClientRect();
        const parent = node.closest('p').getBoundingClientRect();
        const formula = node.querySelector('.katex');
        const formulaBox = formula.getBoundingClientRect();
        return {
          text: node.textContent,
          width: box.width, height: box.height,
          clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
          clientHeight: node.clientHeight, scrollHeight: node.scrollHeight,
          left: box.left, right: box.right, parentLeft: parent.left, parentRight: parent.right,
          formulaTop: formulaBox.top, formulaBottom: formulaBox.bottom,
          top: box.top, bottom: box.bottom,
        };
      }),
    }));
    assert.equal(geometry.paragraphs, 28);
    assert.equal(geometry.wrappers.length, 12);
    assert(geometry.pageWidth <= viewport.width + 1);
    for (const row of geometry.wrappers) {
      assert(row.left >= row.parentLeft - 1 && row.right <= row.parentRight + 1);
      assert(row.scrollHeight <= row.clientHeight + 1);
      assert(row.formulaTop >= row.top - 1 && row.formulaBottom <= row.bottom + 1);
    }
    const screenshots = [];
    for (const [name, text] of [
      ['fields', 'For a plane electromagnetic wave traveling through a vacuum'],
      ['ratio', 'The source gives'],
    ]) {
      const paragraph = page.locator('p').filter({ hasText: text });
      assert.equal(await paragraph.count(), 1);
      await paragraph.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
      const file = `${images}/en-${viewport.name}-${name}.png`;
      await page.screenshot({ path: file });
      screenshots.push(bind(file));
    }
    assert.deepEqual(errors, []);
    report.views.push({ viewport, geometry, errors, screenshots });
    await context.close();
  }
  assert.deepEqual(report.requests, []);
  report.status = 'AFFECTED_FORMULA_STYLE_DESKTOP_MOBILE_DOM_PASS_PIXELS_PENDING';
} catch (error) {
  report.status = 'FAIL';
  report.error = { name: error.name, message: error.message };
  process.exitCode = 1;
} finally {
  await browser.close();
  report.browserClosed = true;
  save(`${out}/report.json`, report);
}
console.log(JSON.stringify({ status: report.status, report: bind(`${out}/report.json`) }));
