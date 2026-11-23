import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1847-n82';
const html = `${evidence}/display/text.html`;
const out = `${evidence}/display-endpoints`;
assert(!fs.existsSync(out));
fs.mkdirSync(out);
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const report = { status: 'RUNNING', cwd: root, viewport: { width: 390, height: 844 },
  scope: 'Only two held prose formula endpoints; no content/HTML/CSS change or other display rerun.',
  html: { path: html, sha256: hash(html) }, formulas: [], screenshots: [],
  originalHold: `${evidence}/review/display-review.md`, hiddenRasterCosts: 'UNKNOWN' };
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: report.viewport });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => /^(file:|data:)/.test(route.request().url())
    ? route.continue() : route.abort());
  await page.goto(pathToFileURL(path.resolve(html)).href);
  await page.evaluate(() => document.fonts.ready);
  const targets = [
    ['components', 'f_1(t)=A_1\\cos(\\omega t+\\varphi_1),\\ f_2(t)=A_2\\cos(\\omega t+\\varphi_2)'],
    ['derivative-sum', "f''(t)=f_1''(t)+f_2''(t)=-kf_1(t)-kf_2(t)=-k[f_1(t)+f_2(t)]=-kf(t)"],
  ];
  for (const [id, tex] of targets) {
    const candidates = page.locator('p.para .nb').filter({
      has: page.locator('annotation', { hasText: tex }),
    });
    assert.equal(await candidates.count(), 1);
    const target = candidates.first();
    await target.scrollIntoViewIfNeeded();
    const before = await target.evaluate(el => ({
      tex: el.querySelector('annotation').textContent, scrollLeft: el.scrollLeft,
      clientWidth: el.clientWidth, scrollWidth: el.scrollWidth,
      overflowX: getComputedStyle(el).overflowX,
    }));
    assert.equal(before.tex, tex);
    assert(before.scrollWidth > before.clientWidth);
    assert.equal(before.overflowX, 'auto');
    const box = await target.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(2000, 0);
    await target.evaluate(el => new Promise((resolve, reject) => {
      const deadline = performance.now() + 3000;
      const poll = () => {
        if (Math.abs(el.scrollLeft - (el.scrollWidth - el.clientWidth)) <= 1) return resolve();
        if (performance.now() > deadline) return reject(new Error('Native formula wheel did not reach end'));
        requestAnimationFrame(poll);
      };
      poll();
    }));
    const after = await target.evaluate(el => {
      const frame = el.getBoundingClientRect();
      const formula = el.querySelector('.katex-html').getBoundingClientRect();
      return { scrollLeft: el.scrollLeft, end: el.scrollWidth - el.clientWidth,
        frameRight: frame.right, formulaRight: formula.right,
        tailInside: formula.right <= frame.right + 1,
        tex: el.querySelector('annotation').textContent };
    });
    assert(after.tailInside);
    assert.equal(after.tex, before.tex);
    const screenshot = `${out}/${id}-right-end.png`;
    await target.screenshot({ path: screenshot });
    report.formulas.push({ id, before, after, nativeWheel: true });
    report.screenshots.push({ id, path: screenshot, sha256: hash(screenshot) });
  }
  assert.deepEqual(errors, []);
  assert.equal(hash(html), report.html.sha256);
  report.status = 'PASS_VISUAL_ENDPOINT_REVIEW_PENDING';
} catch (error) {
  report.status = 'FAIL'; report.failure = error.stack; process.exitCode = 1;
} finally {
  await browser.close(); report.browserClosed = true;
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
}
console.log(JSON.stringify(report));
