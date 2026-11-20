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
const O = `${D}/affected-en-mobile-unit`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) =>
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(O) || fs.readdirSync(O).length === 0);
assert.equal(read(`${V}/en/report.json`).status, 'revise');
fs.mkdirSync(O, { recursive: true });
const current = read(`${D}/current-result.json`);
const records = [...current.records];
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const changed = [];
try {
  for (const surface of ['written', 'answers']) {
    const index = records.findIndex(row =>
      row.locale === 'en' && row.surface === surface && row.viewport.name === 'mobile');
    assert(index >= 0);
    const first = records[index];
    assert.equal(bind(first.html.path).sha256, first.html.sha256);
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.abort());
    await page.setContent(fs.readFileSync(first.html.path, 'utf8'), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const annotations = await page.locator('annotation').allTextContents();
    const text = await page.locator('li.ex').allTextContents();
    const figureBytes = await page.locator('figure svg').evaluateAll(nodes => nodes.map(node => node.outerHTML));
    const edit = await page.locator('[id="ex-3"] .body').evaluate(body => {
      const number = [...body.children].find(node =>
        node.classList.contains('nb') && node.querySelector('annotation')?.textContent === '50');
      if (!number) throw new Error('Q3 room volume missing');
      const unit = number.nextSibling;
      const exponent = unit?.nextSibling;
      if (unit?.nodeType !== Node.TEXT_NODE || unit.textContent !== ' m'
        || exponent?.querySelector('annotation')?.textContent !== '^3') {
        throw new Error('Q3 cubic unit structure changed');
      }
      const originalNodes = [number.outerHTML, unit.textContent, exponent.outerHTML];
      const wrapper = document.createElement('span');
      wrapper.className = 's10y-unit-nowrap';
      number.before(wrapper);
      wrapper.append(number, unit, exponent);
      return { originalNodes, groupedUnit: wrapper.textContent };
    });
    await page.addStyleTag({ content: '.s10y-unit-nowrap{display:inline-block;white-space:nowrap}' });
    assert.deepEqual(await page.locator('annotation').allTextContents(), annotations);
    assert.deepEqual(await page.locator('li.ex').allTextContents(), text);
    assert.deepEqual(await page.locator('figure svg').evaluateAll(nodes => nodes.map(node => node.outerHTML)), figureBytes);
    const unitGeometry = await page.locator('.s10y-unit-nowrap').evaluate(node => {
      const box = node.getBoundingClientRect();
      const body = node.closest('.body').getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom,
        bodyLeft: body.left, bodyRight: body.right,
        children: [...node.children].map(child => {
          const rect = child.getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
        }),
        childBytesUnchanged: [node.children[0].outerHTML, node.childNodes[1].textContent,
          node.children[1].outerHTML] };
    });
    assert.deepEqual(unitGeometry.childBytesUnchanged, edit.originalNodes);
    assert.equal(unitGeometry.children.length, 2);
    assert(Math.abs(unitGeometry.children[0].top - unitGeometry.children[1].top) < .5);
    assert(unitGeometry.left >= unitGeometry.bodyLeft - .5 && unitGeometry.right <= unitGeometry.bodyRight + .5);
    const geometry = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      boxes: [...document.querySelectorAll('li.ex')].map(node => {
        const box = node.getBoundingClientRect();
        return { x: box.x, right: box.right, y: box.y, bottom: box.bottom, width: box.width, height: box.height };
      }),
    }));
    assert.equal(geometry.boxes.length, 6);
    assert(geometry.width <= 390);
    assert(geometry.boxes.every(box => box.x >= -1 && box.right <= 391 && box.height > 0));
    for (let i = 1; i < geometry.boxes.length; i++) assert(geometry.boxes[i].y >= geometry.boxes[i - 1].bottom - 1);
    assert.equal(await page.locator('.katex-error,.err,input,textarea,script').count(), 0);
    if (surface === 'answers') {
      assert.equal(await page.locator('.answer').count(), 6);
      const formulas = await page.locator('.s10y-long-equation').evaluateAll(nodes => nodes.map(node => {
        const answer = node.closest('.answer').getBoundingClientRect();
        return { exercise: node.closest('.answer').dataset.exercise, left: answer.left, right: answer.right,
          bases: [...node.querySelectorAll('.base')].map(base => {
            const rect = base.getBoundingClientRect();
            return { left: rect.left, right: rect.right };
          }) };
      }));
      assert.deepEqual(formulas.map(row => row.exercise), ['4', '5', '6']);
      for (const row of formulas) assert(row.bases.every(base => base.left >= row.left - .5 && base.right <= row.right + .5));
    }
    await page.locator('figure.fig').evaluateAll(nodes => nodes.forEach(node => { node.scrollLeft = node.scrollWidth; }));
    assert.deepEqual(errors, []);
    const html = `${O}/en-mobile-${surface}.html`;
    const screenshot = `${O}/en-mobile-${surface}.png`;
    fs.writeFileSync(html, await page.content(), { flag: 'wx' });
    await page.screenshot({ path: screenshot, fullPage: true });
    records[index] = { ...first, html: bind(html), screenshot: bind(screenshot), geometry, unitGeometry,
      originalHtml: first.html, originalScreenshot: first.screenshot, affectedDisplayOnly: true,
      geometryFreshlyMeasured: true, texAnnotationsByteExact: true, visibleTextByteExact: true };
    changed.push(records[index]);
    await page.close();
  }
} finally { await browser.close(); }
save(`${O}/result.json`, { batch: 'D138', status: 'pass', affectedRecords: changed,
  originalDisplay: bind(`${D}/current-result.json`), originalEnglishFailure: bind(`${V}/en/report.json`),
  firstTechnicalFailure: bind(`${T}/tmp/d1816-recovery/d138-en-q3-original-layout-call-failure.json`),
  layoutOnly: true, nativeSpanBytesUnchanged: true, texAnnotationsByteExact: true,
  answerOrChoiceFilesChanged: false, parentImageOpens: 0, independentPixels: 'PENDING' });
save(`${D}/latest-result.json`, { ...current, records,
  affectedEnglishUnitDisplay: bind(`${O}/result.json`), independentPixels: 'PENDING' });
save(`${V}/input.en.affected.json`, { batch: 'D138', locale: 'en',
  role: 'AFFECTED_Q3_EN_MOBILE_UNIT_PIXELS_ONLY', records: changed, requiredScreenshots: 2,
  display: bind(`${D}/latest-result.json`), originalEnglishFailure: bind(`${V}/en/report.json`),
  unchangedPassedScreenshotsReused: 4, texAnnotationsByteExact: true,
  visibleTextByteExact: true, productAcceptance: false });
console.log(JSON.stringify({ latestDisplay: bind(`${D}/latest-result.json`),
  affectedSurfaces: 2, unitGroupsChanged: 2, contentChanged: false, imagesOpened: 0 }));
