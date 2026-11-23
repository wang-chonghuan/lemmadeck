import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const require = createRequire(`${W}/app/package.json`);
const { chromium } = require('playwright');
const { choiceHtml } = await import(`${W}/.claude/skills/ld-s10y-lesson/tools/choice_html.mjs`);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const L = 'geo68-c3-s2-n38';
const D = `${B}/editions/modern-us-neutral/lessons/${L}`;
const N = `${B}/evidence/stemrobin188-6g-n38`;
const O = `${N}/display7`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const manifestFile = `${O}/exercises.json`;
const reviewFile = `${N}/exercises-display-independent7/review7.json`;
assert.equal(sha(manifestFile), '7befdf4734ae35a41decf78686543eb920d1ee7c54515ebcdb24616338e23f75');
assert.equal(sha(reviewFile), '9b5429d29ea4bc095beaf4fd9279f3ecf1412ffab7addd1fb0f102986e2c0c5d');
const manifest = read(manifestFile);
for (const [file, hash] of Object.entries(manifest.sourceHashes))
  assert.equal(sha(`${D}/${file}`), hash, `Changed display content: ${file}`);
const targets = read(reviewFile).unknownObservations;
assert.equal(targets.length, 6);
const keys = read(`${D}/answer-keys.json`);
const html = `.tmp/ld-s10y-lesson/render/6-8g/modern-us-neutral/${L}/exercises.html`;
assert.equal(sha(html), 'eec26ead41a0f8970cbb19817ce3093132a66aadad331a363d666d4bcc8504d5');
const screenshot = `${O}/exercises-six-mobile-formula-windows7.png`;
const output = `${O}/exercises-six-mobile-formula-windows7.json`;
assert.ok(!fs.existsSync(screenshot) && !fs.existsSync(output), 'Existing affected evidence');
const css = '.sr-nb{display:inline-block;max-width:100%;overflow-x:auto;scrollbar-width:none;text-indent:0;vertical-align:middle;white-space:nowrap}.sr-nb::-webkit-scrollbar{display:none}.answer-support{margin-top:16px;padding-top:12px;border-top:1px solid #ddd;overflow-x:auto;font-size:16px;line-height:1.8}.answer-support p{margin:8px 0}';
const records = [];
const rows = [];
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route(/^https?:/, route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve(html)).href);
  for (const answer of keys.answers) {
    await page.locator(`#ex-${answer.exercise} .body`).evaluate((node, rendered) => {
      const support = document.createElement('div');
      support.className = 'answer-support';
      support.innerHTML = rendered;
      node.append(support);
    }, choiceHtml(answer.displayAnswer));
  }
  await page.addStyleTag({ content: css });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('input, textarea, math-field, .katex-error').count(), 0);
  assert.equal(await page.locator('.answer-support').count(), 18);
  for (const target of targets) {
    const wrappers = page.locator(`#ex-${target.exercise} .answer-support .sr-nb`);
    const indexes = await wrappers.evaluateAll((nodes, tex) => nodes.flatMap((node, index) =>
      node.querySelector('annotation')?.textContent === tex ? [index] : []), target.expectedTex);
    assert.equal(indexes.length, 1, `Ambiguous affected formula: ${target.id}`);
    const formula = wrappers.nth(indexes[0]);
    const before = await formula.evaluate(node => ({
      tex: node.querySelector('annotation').textContent,
      clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
      rectWidth: node.getBoundingClientRect().width,
      end: Math.max(0, node.scrollWidth - node.clientWidth),
      overflowX: getComputedStyle(node).overflowX,
      minMathPx: parseFloat(getComputedStyle(node.querySelector('.katex')).fontSize),
    }));
    assert.ok(before.end > 0, `No actual hidden right end: ${target.id}`);
    assert.ok(before.minMathPx >= 16);
    const positions = [0];
    while (positions.at(-1) < before.end)
      positions.push(Math.min(before.end, positions.at(-1) + before.clientWidth - 20));
    assert.ok(positions.length <= 4, 'Affected formula needs a wider evidence sheet');
    const windows = [];
    const images = [];
    for (const position of positions) {
      const reached = await formula.evaluate((node, value) => {
        node.scrollLeft = value;
        return node.scrollLeft;
      }, position);
      assert.ok(Math.abs(reached - position) <= 1, `${target.id} scroll window not reachable`);
      await formula.scrollIntoViewIfNeeded();
      const buffer = await formula.screenshot();
      windows.push({ requested: position, reached, overlapPx: 20, imageSha256:
        crypto.createHash('sha256').update(buffer).digest('hex') });
      images.push(`<div><p>scrollLeft ${reached}</p><img src="data:image/png;base64,${buffer.toString('base64')}"></div>`);
    }
    const tail = await formula.evaluate(node => {
      const box = node.getBoundingClientRect();
      const last = node.querySelector('.katex-html').lastElementChild.getBoundingClientRect();
      return { wrapperRight: box.right, tailRight: last.right, scrollLeft: node.scrollLeft };
    });
    assert.ok(tail.tailRight <= tail.wrapperRight + 1, `${target.id} final glyph remains clipped`);
    records.push({ id: target.id, exercise: target.exercise, before, windows, tail,
      allContinuousWindowsCaptured: true, rightEndpointReached: true });
    rows.push(`<section><h2>${target.id}</h2><div class="windows">${images.join('')}</div></section>`);
  }
  assert.deepEqual(errors, []);
  const sheet = await context.newPage();
  await sheet.setViewportSize({ width: 1420, height: 1000 });
  await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>
    body{margin:16px;color:#111;background:#fff;font:16px Arial,sans-serif}
    h1{font-size:20px;margin:0 0 12px}h2{font-size:16px;margin:0 0 4px}
    section{padding:10px 0;border-bottom:1px solid #ddd}
    .windows{display:flex;gap:18px;align-items:flex-start}
    .windows p{font-size:14px;margin:0 0 4px}.windows img{display:block}
    </style><h1>390 px mobile: six affected formula windows, original display scale</h1>${rows.join('')}`);
  await sheet.evaluate(() => document.fonts.ready);
  assert.ok(await sheet.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await sheet.screenshot({ path: screenshot, fullPage: true });
  await context.close();
} finally {
  await browser.close();
}
fs.writeFileSync(output, `${JSON.stringify({
  lesson: L, scope: 'Six unknown mobile formula windows only', headless: true, offline: true,
  originalDisplayManifest: manifestFile, originalDisplayManifestSha256: sha(manifestFile),
  originalHold: reviewFile, originalHoldSha256: sha(reviewFile),
  sourceHashes: manifest.sourceHashes, originalHtml: html, originalHtmlSha256: sha(html),
  answerOverlayAndCssIdenticalToOriginalCapture: true, canonicalOrSharedEdits: false,
  sourceOrMathReReview: false, nativeRerenders: 0, records,
  screenshot, screenshotSha256: sha(screenshot), parentImageLoads: 0,
  visualImagesForAffectedReviewer: 1, sourceInputsUnchanged: true, browserClosed: true,
  status: 'mechanical-pass-affected-visual-review-pending',
}, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ output, sha256: sha(output), screenshot, screenshotSha256: sha(screenshot) }));
