import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const O = `${W}/.intentfold/tickets/STEMROBIN-188/tmp/n37-exercises-display-independent7`;
const B = `${W}/ssot-resources/soviet10year-textbooks/artifacts/6-8g`;
const E = `${B}/editions/modern-us-neutral/lessons/geo68-c3-s2-n37`;
const N = `${B}/evidence/stemrobin188-6g-n37`;
const html = `${W}/.tmp/ld-s10y-lesson/render/6-8g/modern-us-neutral/geo68-c3-s2-n37/exercises.html`;
const producer = `${W}/.intentfold/tickets/STEMROBIN-188/tmp/display-n37-7.mjs`;
const helper = `${W}/.claude/skills/ld-s10y-lesson/tools/choice_html.mjs`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const manifest = read(`${N}/display7/exercises.json`);
assert.equal(manifest.status, 'mechanical-pass-visual-review-pending');
const bindings = Object.entries(manifest.sourceHashes).map(([name, expected]) => {
  const file = `${E}/${name}`;
  const actual = sha(file);
  assert.equal(actual, expected, `Changed source: ${name}`);
  return { path: file, sha256: actual, expectedSha256: expected };
});
assert.equal(sha(html), '066e4717db4bf42ad05c5d93bcb176b1227df0d159647f8f027c5e60b8ceda27');
const keys = read(`${E}/answer-keys.json`);
const receipt = read(`${N}/resume7/render-first7.json`);
assert.equal(receipt.cwd, W);
assert.equal(receipt.exitCode, 0);
const header = read(`${N}/resume7/render-first7.stdout`);
assert.equal(header.ok, true);
assert.equal(header.lessons[0].lesson, 'geo68-c3-s2-n37');
assert.equal(header.lessons[0].exercises, 9);
const screenshot = `${O}/486-answer-first-paragraph-390-right-end.png`;
const output = `${O}/486-endpoint.json`;
assert.ok(!fs.existsSync(screenshot) && !fs.existsSync(output), 'Preserve existing evidence');
const require = createRequire(`${W}/app/package.json`);
const { chromium } = require('playwright');
const { choiceHtml } = await import(pathToFileURL(helper).href);
const browser = await chromium.launch({ headless: true });
let result;
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route(/^https?:/, route => route.abort());
  const page = await context.newPage();
  await page.goto(pathToFileURL(html).href);
  for (const answer of keys.answers) {
    await page.locator(`#ex-${answer.exercise} .body`).evaluate((node, rendered) => {
      const support = document.createElement('div');
      support.className = 'answer-support';
      support.innerHTML = rendered;
      node.append(support);
    }, choiceHtml(answer.displayAnswer));
  }
  await page.addStyleTag({ content: '.sr-nb{display:inline-block;max-width:100%;overflow-x:auto;scrollbar-width:none;text-indent:0;vertical-align:middle;white-space:nowrap}.sr-nb::-webkit-scrollbar{display:none}.answer-support{margin-top:16px;padding-top:12px;border-top:1px solid #ddd;overflow-x:auto;font-size:16px;line-height:1.8}.answer-support p{margin:8px 0}' });
  await page.evaluate(() => document.fonts.ready);
  const formula = page.locator('#ex-486 .answer-support .sr-nb').first();
  const expectedTex = '\\angle CBD=\\angle ABR=\\angle EDP=\\angle FDR=\\alpha';
  assert.equal(await formula.locator('annotation').textContent(), expectedTex);
  assert.equal(await formula.locator('.katex-error').count(), 0);
  const before = await formula.evaluate(node => {
    const rect = node.getBoundingClientRect();
    return {
      selector: '#ex-486 .answer-support .sr-nb (first)',
      tex: node.querySelector('annotation').textContent,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      clientWidth: node.clientWidth, scrollWidth: node.scrollWidth,
      scrollLeft: node.scrollLeft,
      end: Math.max(0, node.scrollWidth - node.clientWidth),
      overflowX: getComputedStyle(node).overflowX,
    };
  });
  assert.ok(before.end > 0, 'The observed truncation must be diagnosed, not assumed');
  const reached = await formula.evaluate(node => {
    node.scrollLeft = node.scrollWidth - node.clientWidth;
    return node.scrollLeft;
  });
  assert.ok(Math.abs(reached - before.end) <= 1, 'Right endpoint is not reachable');
  await formula.scrollIntoViewIfNeeded();
  const rect = await formula.boundingBox();
  const finalGlyph = await formula.evaluate(node => {
    const last = node.querySelector('.katex-html').lastElementChild;
    const box = node.getBoundingClientRect();
    const tail = last.getBoundingClientRect();
    return { wrapperRight: box.right, tailRight: tail.right, tailText: last.textContent };
  });
  assert.ok(finalGlyph.tailRight <= finalGlyph.wrapperRight + 1, 'Formula tail remains clipped at right endpoint');
  const clip = {
    x: Math.max(0, Math.floor(rect.x) - 8),
    y: Math.max(0, Math.floor(rect.y) - 8),
    width: Math.min(390 - Math.max(0, Math.floor(rect.x) - 8), Math.ceil(rect.width) + 16),
    height: Math.ceil(rect.height) + 16,
  };
  await page.screenshot({ path: screenshot, clip });
  result = {
    scope: '486 displayAnswer first paragraph, 390x844, right endpoint only',
    sourceBindings: bindings,
    existingInputs: [html, producer, helper, `${N}/resume7/render-first7.json`, `${N}/resume7/render-first7.stdout`]
      .map(file => ({ path: file, sha256: sha(file) })),
    nativeRenderReexecuted: false,
    canonicalOrStyleEdits: false,
    originalEvidencePreserved: true,
    before, reached, finalGlyph, clip,
    screenshot: { path: screenshot, sha256: sha(screenshot) },
    diagnosis: 'original screenshot is at scrollLeft=0; formula has a reachable horizontal right endpoint; visual endpoint review pending',
    productFunctionalityTested: false,
    browserClosed: true,
    actualNewImages: 1,
  };
  await context.close();
} finally {
  await browser.close();
}
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify(result, null, 2));
