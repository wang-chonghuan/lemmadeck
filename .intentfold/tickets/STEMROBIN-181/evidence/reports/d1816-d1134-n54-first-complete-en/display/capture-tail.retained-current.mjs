import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { chromium } = require('playwright');
const originalReport = bind(`${ticket}/tmp/d1816-d1133-n54-first-en-full-course-display/report.json`);
assert.equal(originalReport.sha256, '3214c54f7bada3beb258617856684beb28ddf152d277d03683809dd53e8c0823');
const original = read(originalReport.path);
const originalPixelReview = bind(`${ticket}/tmp/d1816-d1131-n54-first-en-independent-review/n54-pixel-review.json`);
assert.equal(originalPixelReview.sha256, 'ad7f44f875f3484618679f4b0e944ed6d239c4dfcc7bf05d990fae79e0ee5d6c');
assert.deepEqual(read(originalPixelReview.path).findings.map(finding => finding.id), ['EN54-PX1']);
const mobile = original.views.find(view => view.viewport.name === 'mobile');
assert(mobile);
for (const file of [mobile.html, mobile.screenshot, mobile.definitionScreenshot])
  assert.equal(bind(file.path).sha256, file.sha256);
const out = `${ticket}/tmp/d1816-d1173-n54-affected-mobile-tail`;
const captures = `${repo}/.tmp/STEMROBIN-181/d1816-d1173/mobile-tail`;
assert(!fs.existsSync(captures));
fs.mkdirSync(captures, { recursive: true });
save(`${out}/first-machine-diagnosis.json`, {
  executionChunk: 'c3e7be', exitCode: 0, originalScreenshot: mobile.screenshot,
  width: 390, height: 16656, beyond16384: 272,
  last272RowsExactlyEqualFirst272Rows: true,
  machinePixelComparisonOnlyNotIndependentVisualApproval: true,
});
let browser, failure, geometry;
const requests = [], errors = [];
const bottomFile = `${captures}/en-mobile-bottom-viewport.png`;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, offline: true,
    serviceWorkers: 'block',
  });
  try {
    await context.route('**/*', route => {
      requests.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const html = fs.readFileSync(mobile.html.path, 'utf8');
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForFunction(() =>
      Math.abs(window.scrollY + window.innerHeight - document.documentElement.scrollHeight) <= 1);
    geometry = await page.evaluate(() => {
      const rect = node => {
        const r = node.getBoundingClientRect();
        return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
      };
      const paragraphs = [...document.querySelectorAll('p.para')];
      const last = paragraphs.at(-1);
      return {
        scrollY: window.scrollY, documentHeight: document.documentElement.scrollHeight,
        pageWidth: document.documentElement.scrollWidth, headingCount: document.querySelectorAll('h1').length,
        heading: rect(document.querySelector('h1')), paragraphCount: paragraphs.length,
        lastParagraph: rect(last), lastParagraphText: last.innerText,
        nodesAfterFinalParagraph: [...last.parentElement.children].slice(
          [...last.parentElement.children].indexOf(last) + 1).map(node => node.tagName),
        headingBelowFinalParagraph: [...document.querySelectorAll('h1,.crumb')].some(node =>
          node.getBoundingClientRect().top >= last.getBoundingClientRect().bottom),
        fontsLoaded: document.fonts.status === 'loaded',
      };
    });
    assert.equal(geometry.documentHeight, 16656);
    assert.equal(geometry.pageWidth, 390);
    assert.equal(geometry.headingCount, 1);
    assert.equal(geometry.paragraphCount, mobile.paragraphs);
    assert.equal(geometry.headingBelowFinalParagraph, false);
    assert.deepEqual(geometry.nodesAfterFinalParagraph, []);
    assert(geometry.lastParagraph.bottom > 0 && geometry.lastParagraph.bottom <= 844);
    assert(geometry.fontsLoaded);
    assert.deepEqual(requests, []);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: bottomFile, fullPage: false });
  } finally { await context.close(); }
} catch (error) {
  failure = { message: error.message, stack: error.stack };
} finally { if (browser) await browser.close(); }
save(`${out}/bottom-dom.json`, {
  task: 'D1173', status: failure ? 'FAIL' : 'AFFECTED_BOTTOM_DOM_PASS',
  originalReport, originalPixelReview, originalHtml: mobile.html,
  geometry, requests, errors, failure, browserClosed: true, browserMode: 'isolated-headless',
  nativeOrWholeCourseChecksReplayed: false, parentImageOpens: 0,
  bottomScreenshot: fs.existsSync(bottomFile) ? bind(bottomFile) : null,
});
assert.equal(failure, undefined);
const correctedFile = `${captures}/en-mobile-whole-tail-corrected.png`;
const receipt = run('d1173-n54-replace-only-defective-saved-png-tail', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `from PIL import Image,ImageChops
import json
original=Image.open(${JSON.stringify(mobile.screenshot.path)}).convert("RGB")
bottom=Image.open(${JSON.stringify(bottomFile)}).convert(original.mode)
assert original.size==(390,16656) and bottom.size==(390,844)
assert ImageChops.difference(original.crop((0,0,390,272)),original.crop((0,16384,390,16656))).getbbox() is None
fixed=original.copy()
fixed.paste(bottom.crop((0,572,390,844)),(0,16384))
assert ImageChops.difference(original.crop((0,0,390,16384)),fixed.crop((0,0,390,16384))).getbbox() is None
assert ImageChops.difference(fixed.crop((0,16384,390,16656)),bottom.crop((0,572,390,844))).getbbox() is None
assert ImageChops.difference(original.crop((0,16384,390,16656)),fixed.crop((0,16384,390,16656))).getbbox() is not None
fixed.save(${JSON.stringify(correctedFile)})
print(json.dumps({"status":"PASS","dimensions":[390,16656],"replacedRows":[16384,16656],"pixelsBefore16384Unchanged":True,"tailEqualsActualBottomViewport":True,"originalDefectiveImageUnmodified":True,"independentPixelApproval":False}))`,
]);
const recovery = {
  task: 'D1173', status: 'AFFECTED_MOBILE_CAPTURE_TAIL_REPLACED_DOM_PASS_PIXELS_PENDING',
  card: 'phy9-c1-s6-n54', originalReport, originalPixelReview,
  originalBrokenScreenshot: mobile.screenshot, originalHtml: mobile.html,
  bottomDom: bind(`${out}/bottom-dom.json`), bottomScreenshot: bind(bottomFile),
  correctedScreenshot: bind(correctedFile), pixelsBefore16384Unchanged: true,
  replacedRows: [16384, 16656], compositionReceipt: receipt,
  originalHtmlNativeContentAndOtherCapturesUnchanged: true,
  officialNativeCalls: 0, wholeCourseBrowserChecksReplayed: false,
  browserClosed: true, browserMode: 'isolated-headless', headedAcceptanceClaimed: false,
  parentImageOpens: 0, paidCalls: 0, databaseWrites: 0, independentAffectedPixelsPending: true,
};
save(`${out}/tail-recovery.json`, recovery);
const composed = structuredClone(original);
composed.views.find(view => view.id === mobile.id).screenshot = bind(correctedFile);
composed.captureTailRecovery = bind(`${out}/tail-recovery.json`);
composed.originalReport = originalReport;
composed.allOtherViewsAndCapturesReusedWithoutReplay = true;
save(`${out}/report.json`, composed);
for (const file of [mobile.html, mobile.screenshot, mobile.definitionScreenshot])
  assert.equal(bind(file.path).sha256, file.sha256);
console.log(JSON.stringify({ recovery: bind(`${out}/tail-recovery.json`),
  composedReport: bind(`${out}/report.json`), imagesForAffectedReview: 2 }));
