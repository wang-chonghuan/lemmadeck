import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, read, bind, save } from './n42-native.mjs';

const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const native = bind(`${ticket}/tmp/d1816-d1476-n39-value-line-native/result.json`);
const previousNative = bind(`${ticket}/tmp/d1816-d1417-n39-first-en-native/result.json`);
const originalDisplay = bind(`${ticket}/tmp/d1816-d1434-n39-prose-figure-order-display-recovery/report.json`);
const originalFailure = bind(`${ticket}/tmp/d1816-d1416-n39-first-en-review/pixel-review.json`);
assert.equal(read(originalFailure.path).status, 'REVISE');
const row = read(native.path).rows[0], baseline = read(previousNative.path).rows[0];
const oldLesson = read(baseline.lesson.path), lesson = read(row.lesson.path);
const comparison = structuredClone(lesson);
comparison.prose[2].text = comparison.prose[2].text
  .replace('as approximately:\n', 'as approximately ')
  .replace('its approximate value is:\n', 'its approximate value is ');
assert.deepEqual(comparison, oldLesson);
for (const asset of row.assets) {
  assert.equal(asset.svg.sha256, baseline.assets.find(old => old.id === asset.id).svg.sha256);
}
const selectorFailure = bind(`${ticket}/tmp/d1816-d1469-n39-affected-unit-display/affected-report.json`);
assert.equal(read(selectorFailure.path).status, 'FAIL');
assert.equal(read(selectorFailure.path).views.length, 0);
const wordJoinerFailure = bind(`${ticket}/tmp/d1816-d1473-n39-unit-selector-display-recovery/affected-report.json`);
assert.equal(read(wordJoinerFailure.path).status, 'FAIL');
const directory = `${ticket}/tmp/d1816-d1477-n39-value-line-affected-display`;
const out = `${repo}/.tmp/STEMROBIN-181/d1816-d1477/affected-units`;
fs.mkdirSync(out, { recursive: true });
const snapshot = `${directory}/check.executed-original.mjs`;
fs.mkdirSync(directory, { recursive: true });
fs.copyFileSync(import.meta.filename, snapshot, fs.constants.COPYFILE_EXCL);
const views = [], requests = [];
let browser, failure = null, activeView;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const viewport of [{ name: 'desktop', width: 1440, height: 960 }, { name: 'mobile', width: 390, height: 844 }]) {
    activeView = `en-${viewport.name}`;
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1, offline: true, serviceWorkers: 'block' });
    try {
      const page = await context.newPage(), errors = [];
      await context.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
      page.on('pageerror', error => errors.push(error.message));
      await page.setContent(fs.readFileSync(row.textHtml.path, 'utf8'), { waitUntil: 'load' });
      await page.locator('a.jump').evaluateAll(nodes => nodes.forEach(node => node.remove()));
      await page.evaluate(() => document.fonts.ready);
      const target = page.locator('p.para').nth(11);
      const projection = await target.evaluate(node => {
        const clone = node.cloneNode(true);
        for (const formula of clone.querySelectorAll('.katex'))
          formula.replaceWith(document.createTextNode(`$${formula.querySelector('annotation').textContent}$`));
        return clone.textContent;
      });
      assert(projection.includes('N/m$^2$') && !projection.includes('\u2060'));
      const units = await target.evaluate(node => {
        const box = element => {
          const r = element.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
        };
        const exponents = [...node.querySelectorAll('.nb')]
          .filter(element => element.querySelector('annotation')?.textContent === '^2');
        return exponents.map(exponent => {
          const m = exponent.previousSibling;
          const slash = m?.previousSibling, n = slash?.previousSibling;
          if (m?.textContent !== 'm' || slash?.textContent !== '/' || n?.textContent !== 'N')
            throw Error('Expected unchanged N/m plus exponent DOM');
          return { n: box(n), m: box(m), exponent: box(exponent), paragraph: box(node),
            annotation: exponent.querySelector('annotation').textContent };
        });
      });
      assert.equal(units.length, 2);
      for (const unit of units) {
        assert(Math.abs(unit.n.top - unit.m.top) < 0.5);
        assert(unit.exponent.top < unit.m.bottom && unit.exponent.bottom > unit.m.top);
        assert(unit.exponent.left >= unit.m.right - 0.5 && unit.exponent.left - unit.m.right < 3);
        assert(unit.n.left >= unit.paragraph.left - 0.5 && unit.exponent.right <= unit.paragraph.right + 0.5);
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(requests, []);
      const html = `${out}/${activeView}.html`, image = `${out}/${activeView}-pressure-unit.png`;
      fs.writeFileSync(html, await page.content(), { flag: 'wx' });
      await target.screenshot({ path: image });
      views.push({ id: activeView, viewport, html: bind(html), screenshot: bind(image), units,
        affectedProsePointer: '/prose/2/text', flowParagraphIndex: 11, projectedText: projection,
        status: 'AFFECTED_UNITS_SAME_LINE_DOM_PASS_PIXELS_PENDING' });
    } finally { await context.close(); }
  }
} catch (error) { failure = { view: activeView, message: error.message, stack: error.stack }; }
finally { if (browser) await browser.close(); }
const affectedPath = `${directory}/affected-report.json`;
save(affectedPath, {
  task: 'D1477', card: lesson.id, status: failure ? 'FAIL' : 'AFFECTED_N39_UNITS_DOM_PASS_PIXELS_PENDING',
  native, previousNative, originalDisplay, originalFailure, views, requests, failure,
  executedHelper: bind(snapshot), browserClosed: true, browserMode: 'isolated-headless',
  sourceMathSubscriptsAndSourceAriaRetained: true, sourceMathAndNumbersUnchanged: true,
  onlyTwoValueIntroductionColonsAndLineBreaksChanged: true, wordJoinerFailure,
  originalFigurePixelsAndWidthEvidenceReused: true, originalFullCoursePixelsNotReopened: true,
  parentImagesOpened: 0, headedAcceptanceClaimed: false, completeEnglishAccessibilityApproval: false,
  databaseWrites: 0, paidCalls: 0,
  originalSelectorFailure: selectorFailure,
});
assert.equal(failure, null, failure?.message);
assert.equal(views.length, 2);
save(`${directory}/report.json`, {
  ...read(originalDisplay.path), task: 'D1477', originalFullDom: originalDisplay,
  affectedUnitLayout: bind(affectedPath), currentNativeAfterUnitOnlyEdit: native,
  originalFullDomViewsReusedNotReexecuted: true, originalWholePageImagesHaveKnownLocalDefectSupersededByAffectedUnitEvidence: true,
  currentNativeFullViewClaimed: false, completeCourseApproval: false,
  executedHelper: bind(snapshot),
  executedHelperSnapshot: bind(snapshot),
});
console.log(JSON.stringify({ affected: bind(affectedPath), composedDisplay: bind(`${directory}/report.json`), newSavedImages: 2 }));
