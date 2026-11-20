import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const D = `${T}/tmp/d1816-d138-t9-display`;
const V = `${T}/tmp/d1816-d138-t9-display-review`;
const O = `${D}/affected-mobile-answers`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(O));
assert.equal(read(`${V}/zh/report.json`).status, 'revise');
fs.mkdirSync(O, { recursive: true });
const original = read(`${D}/result.json`);
const records = [...original.records];
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const changed = [];
try {
  for (const locale of ['zh', 'en']) {
    const index = records.findIndex(row => row.locale === locale && row.surface === 'answers' && row.viewport.name === 'mobile');
    assert(index >= 0);
    const first = records[index];
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.abort());
    await page.setContent(fs.readFileSync(first.html.path, 'utf8'), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const annotations = () => page.locator('.answer annotation').allTextContents();
    const before = await annotations();
    await page.locator('.answer .sr-nb').evaluateAll(nodes => {
      for (const node of nodes) {
        if (node.querySelector('annotation')?.textContent.startsWith('\\displaystyle')) {
          node.classList.add('s10y-long-equation');
        }
      }
    });
    await page.addStyleTag({ content: '.answer .sr-nb.s10y-long-equation{display:inline;white-space:normal;overflow:visible;padding:0}' });
    assert.deepEqual(await annotations(), before);
    const geometry = await page.locator('.s10y-long-equation').evaluateAll(nodes => nodes.map(node => {
      const answer = node.closest('.answer').getBoundingClientRect();
      return {
        exercise: node.closest('.answer').dataset.exercise,
        text: node.querySelector('annotation').textContent,
        left: answer.left, right: answer.right,
        bases: [...node.querySelectorAll('.base')].map(base => {
          const rect = base.getBoundingClientRect();
          return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
        }),
      };
    }));
    assert.deepEqual(geometry.map(row => row.exercise), ['4', '5', '6']);
    for (const row of geometry) {
      assert(row.bases.length > 0);
      assert(row.bases.every(base => base.left >= row.left - .5 && base.right <= row.right + .5));
    }
    assert.equal(await page.locator('.answer').count(), 6);
    assert.equal(await page.locator('.katex-error,.err,input,textarea,script').count(), 0);
    assert((await page.evaluate(() => document.documentElement.scrollWidth)) <= 390);
    await page.locator('figure.fig').evaluateAll(nodes => nodes.forEach(node => { node.scrollLeft = node.scrollWidth; }));
    assert.deepEqual(errors, []);
    const html = `${O}/${locale}-mobile-answers.html`;
    const screenshot = `${O}/${locale}-mobile-answers.png`;
    fs.writeFileSync(html, await page.content(), { flag: 'wx' });
    await page.screenshot({ path: screenshot, fullPage: true });
    records[index] = { ...first, html: bind(html), screenshot: bind(screenshot),
      mathWrapping: geometry, originalHtml: first.html, originalScreenshot: first.screenshot,
      affectedDisplayOnly: true };
    changed.push(records[index]);
    await page.close();
  }
} finally { await browser.close(); }
save(`${O}/result.json`, {
  batch: 'D138', status: 'pass', affectedRecords: changed, offline: true,
  texAnnotationsByteExact: true, answerFilesChanged: false, choicesChanged: false,
  passedSurfacesReplayed: 0, parentImageOpens: 0, independentPixels: 'PENDING',
  originalDisplay: bind(`${D}/result.json`), firstPixelFailure: bind(`${V}/zh/report.json`),
});
save(`${D}/current-result.json`, { ...original, records, independentPixels: 'PENDING',
  affectedDisplay: bind(`${O}/result.json`), originalDisplay: bind(`${D}/result.json`) });
for (const locale of ['zh', 'en']) {
  const initial = read(`${V}/input.${locale}.json`);
  const current = records.filter(row => row.locale === locale &&
    (locale === 'en' || (row.surface === 'answers' && row.viewport.name === 'mobile')));
  save(`${V}/input.${locale}.current.json`, { ...initial, records: current,
    requiredScreenshots: current.length, display: bind(`${D}/current-result.json`),
    role: locale === 'zh' ? 'AFFECTED_MOBILE_ANSWER_PIXELS_ONLY' : 'FIRST_OFFLINE_DISPLAY_PIXELS_ONLY',
    answerFilesUnchanged: true, texAnnotationsByteExact: true });
}
console.log(JSON.stringify({ currentDisplay: bind(`${D}/current-result.json`),
  affectedSurfaces: 2, answersOrOptionsChanged: false, imagesOpened: 0 }));
