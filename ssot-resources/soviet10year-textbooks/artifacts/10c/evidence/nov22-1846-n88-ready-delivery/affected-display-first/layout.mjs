import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const out = path.dirname(fileURLToPath(import.meta.url));
const name = process.argv[2];
assert(['desktop', 'mobile'].includes(name));
const targets = JSON.parse(fs.readFileSync(path.join(out, 'targets.json'), 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
assert.equal(hash(targets.html.path), targets.html.sha256);
assert.equal(hash(targets.canonicalLesson.path), targets.canonicalLesson.sha256);
const viewport = name === 'desktop' ? { width: 1440, height: 960 } : { width: 390, height: 844 };
const dir = path.join(out, `${name}-evidence`);
fs.mkdirSync(dir);
const runtime = path.join(dir, 'runtime');
fs.mkdirSync(runtime);
process.env.TMPDIR = runtime;
const appRequire = createRequire(path.join(root, 'app/package.json'));
const { chromium } = appRequire('playwright');
const report = {
  schema: 'stemrobin1846/n88-ready-affected-layout@1', status: 'RUNNING',
  cwd: root, argv: process.argv, startedAt: new Date().toISOString(), name, viewport,
  html: targets.html, canonicalLesson: targets.canonicalLesson,
  url: pathToFileURL(targets.html.path).href,
  runtime: { playwright: appRequire.resolve('playwright'), chromium: chromium.executablePath(),
    headed: true, runtimeDirectory: runtime },
  affectedBlocks: targets.affectedBlocks, paragraphs: [], boundaries: [], captures: [],
  captureCount: 0, imageViewCount: 0, externalRequests: [], pageErrors: [],
  consoleErrors: [], requestFailures: [], navigations: [],
  browserClosed: false, contextClosed: false,
  scope: 'Affected prose and all five boundaries only; actual layout, no mathematical reassessment.',
  countClarification: targets.countClarification,
};
let browser;
let context;
let page;
const save = () => fs.writeFileSync(path.join(dir, 'browser-evidence.json'),
  JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
try {
  browser = await chromium.launch({ headless: false });
  report.runtime.version = browser.version();
  context = await browser.newContext({ viewport, serviceWorkers: 'block', offline: true });
  await context.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith('file:') || url.startsWith('data:')) return route.continue();
    report.externalRequests.push(url);
    return route.abort();
  });
  // Visibility-only suppression prevents old figures entering this new prose image batch.
  await context.addInitScript(() => {
    const observer = new MutationObserver(() => {
      for (const media of document.querySelectorAll('.figure-media')) {
        media.style.setProperty('visibility', 'hidden', 'important');
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  page = await context.newPage();
  page.on('pageerror', error => report.pageErrors.push(String(error)));
  page.on('console', message => {
    if (message.type() === 'error') report.consoleErrors.push(message.text());
  });
  page.on('requestfailed', request => report.requestFailures.push({
    url: request.url(), error: request.failure()?.errorText,
  }));
  page.on('framenavigated', frame => report.navigations.push(frame.url()));
  await page.goto(report.url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const census = await page.evaluate(() => ({
    paragraphs: document.querySelectorAll('p.para').length,
    sections: document.querySelectorAll('p.para.section').length,
    figures: document.querySelectorAll('figure.fig').length,
    captions: document.querySelectorAll('.figcap').length,
    mediaVisibility: [...document.querySelectorAll('.figure-media')].map(n => getComputedStyle(n).visibility),
    fontStatus: document.fonts.status,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    sheet: (() => { const r = document.querySelector('.sheet').getBoundingClientRect();
      return { x: r.x, width: r.width }; })(),
  }));
  report.census = census;
  assert.equal(census.paragraphs, targets.paragraphCount);
  assert.equal(census.sections, 5);
  assert.equal(census.figures, 4);
  assert.equal(census.captions, 4);
  assert(census.mediaVisibility.every(v => v === 'hidden'));
  assert.equal(census.fontStatus, 'loaded');
  assert(census.documentWidth <= viewport.width && census.bodyWidth <= viewport.width,
    'Full-page horizontal overflow');
  const relevant = new Set(targets.outline.filter(p => targets.affectedBlocks.includes(p.blockIndex))
    .map(p => p.index));
  for (const boundary of targets.boundaries) {
    relevant.add(boundary.beforeIndex);
    relevant.add(boundary.afterIndex);
  }
  const baseline = await page.locator('p.para').first().evaluate(node => {
    const s = getComputedStyle(node);
    return { family: s.fontFamily, fontPx: parseFloat(s.fontSize), weight: s.fontWeight };
  });
  report.bodyBaseline = baseline;
  for (const index of [...relevant].sort((a, b) => a - b)) {
    const locator = page.locator('p.para').nth(index);
    await locator.scrollIntoViewIfNeeded();
    const observed = await locator.evaluate(node => {
      const r = node.getBoundingClientRect();
      const s = getComputedStyle(node);
      const copy = node.cloneNode(true);
      for (const math of copy.querySelectorAll('.katex')) {
        const annotation = math.querySelector('annotation[encoding="application/x-tex"]');
        math.replaceWith(document.createTextNode(`$${annotation.textContent}$`));
      }
      for (const br of copy.querySelectorAll('br')) br.replaceWith(document.createTextNode('\n'));
      const chinese = [];
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      let text;
      while ((text = walker.nextNode())) {
        if (text.parentElement.closest('.katex')) continue;
        for (let i = 0; i < text.textContent.length; i++) {
          if (!/[\u3400-\u9fff]/.test(text.textContent[i])) continue;
          const range = document.createRange();
          range.setStart(text, i);
          range.setEnd(text, i + 1);
          const box = range.getBoundingClientRect();
          const style = getComputedStyle(text.parentElement);
          chinese.push({ x: box.x, right: box.right, y: box.y, bottom: box.bottom,
            width: box.width, height: box.height,
            fontPx: parseFloat(style.fontSize), family: style.fontFamily, weight: style.fontWeight });
        }
      }
      const clipped = chinese.filter(c => c.x < r.x - 1 || c.right > r.right + 1
        || c.y < r.y - 1 || c.bottom > r.bottom + 1 || c.width <= 0 || c.height <= 0);
      const narrowOverflow = [...node.querySelectorAll('.nb')].map(math => ({
        clientWidth: math.clientWidth, scrollWidth: math.scrollWidth,
        overflowX: getComputedStyle(math).overflowX,
      }));
      return {
        text: copy.textContent, brCount: node.querySelectorAll('br').length,
        rect: { x: r.x, right: r.right, y: r.y + scrollY, bottom: r.bottom + scrollY,
          width: r.width, height: r.height },
        style: { textIndent: s.textIndent, fontPx: parseFloat(s.fontSize),
          family: s.fontFamily, weight: s.fontWeight, lineHeight: s.lineHeight },
        chineseGlyphCount: chinese.length,
        chineseMinFontPx: chinese.length ? Math.min(...chinese.map(c => c.fontPx)) : null,
        chineseFamilies: [...new Set(chinese.map(c => c.family))],
        chineseWeights: [...new Set(chinese.map(c => c.weight))],
        clippedChineseGlyphs: clipped,
        firstChineseX: chinese[0]?.x ?? null,
        narrowOverflow,
        section: node.classList.contains('section'),
        borderTopPx: parseFloat(s.borderTopWidth), paddingTopPx: parseFloat(s.paddingTop),
        marginTopPx: parseFloat(s.marginTop),
      };
    });
    const expected = targets.outline[index];
    observed.index = index;
    observed.blockIndex = expected.blockIndex;
    observed.paragraphInBlock = expected.paragraphInBlock;
    observed.affected = targets.affectedBlocks.includes(expected.blockIndex);
    report.paragraphs.push(observed);
    assert.equal(observed.text, expected.text, `paragraph ${index}: exact joins/text`);
    assert.equal(observed.brCount, expected.text.split('\n').length - 1,
      `paragraph ${index}: sentence-line joins`);
    assert.equal(parseFloat(observed.style.textIndent), 0, `paragraph ${index}: indent`);
    assert.equal(observed.style.family, baseline.family);
    assert.equal(observed.style.fontPx, baseline.fontPx);
    assert.equal(observed.style.weight, baseline.weight);
    assert(observed.style.fontPx >= 16, `paragraph ${index}: minimum body size`);
    assert(observed.chineseMinFontPx === null || observed.chineseMinFontPx >= 16);
    assert(observed.chineseFamilies.every(f => f === baseline.family));
    assert.deepEqual(observed.clippedChineseGlyphs, [], `paragraph ${index}: clipped prose`);
    assert(observed.rect.x >= 0 && observed.rect.right <= viewport.width);
    assert(observed.narrowOverflow.every(n => n.scrollWidth <= n.clientWidth + 1
      || ['auto', 'scroll'].includes(n.overflowX)), `paragraph ${index}: clipped inline text`);
    observed.layoutStatus = 'PASS';
  }
  for (const boundary of targets.boundaries) {
    const before = report.paragraphs.find(p => p.index === boundary.beforeIndex);
    const after = report.paragraphs.find(p => p.index === boundary.afterIndex);
    assert.equal(before.text, boundary.before);
    assert.equal(after.text, boundary.after);
    assert.equal(after.index, before.index + 1);
    assert.equal(after.section, true);
    assert.equal(after.borderTopPx, 1);
    assert(after.paddingTopPx > 0 && after.marginTopPx > 0);
    assert(before.rect.bottom <= after.rect.y + 1);
    report.boundaries.push({ ...boundary, exactAdjacentTextPair: true,
      borderTopPx: after.borderTopPx, paddingTopPx: after.paddingTopPx,
      marginTopPx: after.marginTopPx, gapPx: after.rect.y - before.rect.bottom, status: 'PASS' });
  }
  // Four bounded vertical bands cover all affected paragraphs and boundary pairs.
  const bands = [[0,8], [8,20], [20,30], [30,34]];
  await page.evaluate(() => scrollTo(0, 0));
  for (const [number, [first, last]] of bands.entries()) {
    const bounds = await page.evaluate(({ first, last }) => {
      const nodes = [...document.querySelectorAll('p.para')];
      const top = nodes[first].getBoundingClientRect().top + scrollY;
      const bottom = nodes[last].getBoundingClientRect().bottom + scrollY;
      const sheet = document.querySelector('.sheet').getBoundingClientRect();
      return { x: Math.floor(sheet.x), y: Math.max(0, Math.floor(top - 8)),
        width: Math.ceil(sheet.width), height: Math.ceil(bottom - top + 16) };
    }, { first, last });
    assert(bounds.height <= 4200, `${name}: bounded screenshot height`);
    const file = path.join(dir, `${name}-prose-band-${number + 1}.png`);
    await page.screenshot({ path: file, clip: bounds, fullPage: true, animations: 'disabled',
      mask: [page.locator('.figure-media')], maskColor: '#ffffff' });
    report.captureCount += 1;
    report.captures.push({ path: file, sha256: hash(file), firstParagraph: first,
      lastParagraph: last, clip: bounds, figureMediaHiddenAndMasked: true, inspected: false });
    assert(report.captureCount <= 4);
  }
  assert.deepEqual(report.externalRequests, []);
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.consoleErrors, []);
  assert.deepEqual(report.requestFailures, []);
  assert(report.navigations.every(url => url === report.url));
  report.status = 'DOM_LAYOUT_PASS_PENDING_NEW_VISUAL_INSPECTION';
} catch (error) {
  report.status = 'HOLD';
  report.firstFailure = { message: String(error), stack: error.stack };
  process.exitCode = 1;
} finally {
  if (context) { await context.close(); report.contextClosed = true; }
  if (browser) { await browser.close(); report.browserClosed = true; }
  report.finishedAt = new Date().toISOString();
  save();
  console.log(JSON.stringify(report, null, 2));
}
