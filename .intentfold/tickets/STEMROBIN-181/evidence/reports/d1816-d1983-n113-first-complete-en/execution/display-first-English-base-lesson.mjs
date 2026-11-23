import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, read, save, bind } from './n42-native.mjs';

const config = read(process.argv[2]);
const native = read(config.nativeFile);
const first = config.firstFile ? read(config.firstFile) : null;
const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
fs.mkdirSync(config.images, { recursive: true });
const report = {
  card: native.card, status: 'IN_PROGRESS', native: bind(config.nativeFile),
  views: [], images: [], requests: [], browserMode: 'isolated-headless-offline',
  unchangedFigurePixelsAndReviewReused: true, parentImagesOpened: 0,
  headedAcceptanceClaimed: false, completeEnglishAccessibilityApproval: false,
  inputInteractionTested: false, paidCalls: 0, databaseWrites: 0,
  firstFailure: first ? bind(config.firstFile) : null,
  affectedRecovery: config.mobileMediaConstraint
    ? 'Only mobile preview media containers constrained to content width; example numbering moved to a separate grid row. Original SVG/artwork/labels/native HTML untouched.' : null,
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
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [index, surface] of ['text', 'worked-examples'].entries()) {
      const previous = first?.views.find(view => view.surface === surface && view.viewport.name === viewport.name);
      if (previous && !(config.changedSurfaces ?? []).includes(surface)) {
        report.views.push({ ...previous, unchangedSuccessfulCaptureReused: true });
        report.images.push(previous.whole, previous.focused);
        continue;
      }
      await page.setContent(fs.readFileSync(native.html[index].path, 'utf8'), { waitUntil: 'load' });
      if (config.mobileMediaConstraint && viewport.name === 'mobile')
        await page.addStyleTag({ content: '.fig{min-width:0;width:100%}.figure-media{min-width:0;max-width:100% !important}.figure-layered{min-width:0;grid-template-columns:minmax(0,1fr)}li.ex{grid-template-columns:minmax(0,1fr)}' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.katex-error,.err,.sr-tex-err').count(), 0);
      if (surface === 'worked-examples') assert.equal(await page.locator('li.ex').count(), native.solvedExamples);
      const geometry = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth,
        figures: [...document.querySelectorAll('.figure-media')].map(node => {
          const box = node.getBoundingClientRect();
          return { width: box.width, height: box.height, left: box.left, right: box.right,
            purpose: node.closest('figure').dataset.figurePurpose };
        }),
        wrappers: [...document.querySelectorAll('.nb,.sr-nb')].map(node => ({
          clientHeight: node.clientHeight, scrollHeight: node.scrollHeight,
          clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
          tex: node.querySelector('annotation')?.textContent ?? null,
        })),
      }));
      assert(geometry.pageWidth <= viewport.width + 1);
      assert(geometry.figures.every(figure => figure.width > 0 && figure.height > 0
        && figure.left >= -1 && figure.right <= viewport.width + 1));
      assert(geometry.wrappers.every(wrapper => wrapper.scrollHeight <= wrapper.clientHeight + 1));
      const prefix = `${config.images}/en-${viewport.name}-${surface}`;
      fs.writeFileSync(`${prefix}.html`, await page.content(), { flag: 'wx' });
      await page.screenshot({ path: `${prefix}.png`, fullPage: true });
      const whole = { surface, viewport: viewport.name, kind: 'whole', ...bind(`${prefix}.png`) };
      report.images.push(whole);
      if (surface === 'text' && config.focusFormula) {
        const paragraph = await page.locator('.para').evaluateAll((nodes, tex) =>
          nodes.findIndex(node => node.querySelector('annotation')?.textContent.includes(tex)), config.focusFormula);
        assert(paragraph >= 0);
        await page.locator('.para').nth(paragraph).evaluate(node =>
          node.scrollIntoView({ block: 'start', behavior: 'instant' }));
      } else {
        await page.locator(`#${config.focusFigures?.[surface] ?? config.focusFigure}`).evaluate(node =>
          node.scrollIntoView({ block: 'start', behavior: 'instant' }));
      }
      await page.screenshot({ path: `${prefix}-focused.png` });
      const focused = { surface, viewport: viewport.name, kind: 'focused', ...bind(`${prefix}-focused.png`) };
      report.images.push(focused);
      report.views.push({ surface, viewport, geometry, html: bind(`${prefix}.html`), whole, focused });
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  assert.deepEqual(report.requests, []);
  report.status = 'BASE_EN_FOUR_SURFACE_DOM_PASS_PIXEL_REVIEW_PENDING';
} catch (error) {
  report.status = 'FAIL';
  report.error = { name: error.name, message: error.message };
  process.exitCode = 1;
} finally {
  await browser.close();
  report.browserClosed = true;
  save(`${config.out}/report.json`, report);
}
console.log(JSON.stringify({ card: native.card, status: report.status, images: report.images.length,
  report: bind(`${config.out}/report.json`) }));
