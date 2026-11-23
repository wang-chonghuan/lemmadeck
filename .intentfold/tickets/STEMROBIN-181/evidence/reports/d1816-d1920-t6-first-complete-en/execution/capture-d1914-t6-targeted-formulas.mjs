import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const domFile = `${ticket}/tmp/d1816-d1913-t6-formula-display-recovery/report.json`;
const dom = read(domFile);
assert.equal(dom.status, 'FIRST_EN_EIGHT_SURFACE_DOM_PASS_PIXEL_REVIEW_PENDING');
const out = `${ticket}/tmp/d1816-d1914-t6-targeted-formulas`;
const images = `${repo}/.tmp/STEMROBIN-181/d1816-d1914/display`;
fs.mkdirSync(images, { recursive: true });
const report = {
  card: 'phy9-c1-s5-t6', status: 'IN_PROGRESS', dom: bind(domFile), images: [], requests: [],
  parentImageOpens: 0, databaseWrites: 0, paidCalls: 0,
  scope: 'Additional formula-focused viewport captures only; original whole surfaces and DOM gates reused.',
};
const browser = await chromium.launch({ headless: true });
try {
  for (const view of dom.views.filter(view => ['answers', 'choices'].includes(view.surface))) {
    assert.equal(bind(view.html.path).sha256, view.html.sha256);
    const context = await browser.newContext({ viewport: view.viewport });
    await context.route('**/*', route => {
      report.requests.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setContent(fs.readFileSync(view.html.path, 'utf8'), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const indices = view.surface === 'answers' ? [9, 10] : [4, 5];
    for (const index of indices) {
      const unit = page.locator(view.surface === 'answers' ? '.answer' : '.question').nth(index);
      const focus = await unit.evaluate(node => {
        const wrappers = [...node.querySelectorAll('.sr-nb')];
        const formula = wrappers.find(wrapper =>
          /dfrac|frac/.test(wrapper.querySelector('annotation')?.textContent ?? ''));
        (formula ?? node).scrollIntoView({ block: formula ? 'center' : 'start', behavior: 'instant' });
        return { tex: formula?.querySelector('annotation')?.textContent ?? null };
      });
      const file = `${images}/en-${view.viewport.name}-${view.surface}-${index + 1}-formula-viewport.png`;
      await page.screenshot({ path: file });
      report.images.push({
        surface: view.surface, viewport: view.viewport.name, question: index + 1,
        focusedTex: focus.tex, ...bind(file),
      });
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  assert.equal(report.images.length, 8);
  assert.deepEqual(report.requests, []);
  report.status = 'TARGETED_VIEWPORT_CAPTURE_COMPLETE_PIXEL_REVIEW_PENDING';
} catch (error) {
  report.status = 'FAIL';
  report.error = { name: error.name, message: error.message };
  process.exitCode = 1;
} finally {
  await browser.close();
  report.browserClosed = true;
  save(`${out}/report.json`, report);
}
console.log(JSON.stringify({ card: report.card, status: report.status, report: bind(`${out}/report.json`) }));
