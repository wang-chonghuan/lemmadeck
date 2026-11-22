import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const display = bind(`${ticket}/tmp/d1816-d1447-n42-first-en-full-course-display/report.json`);
const firstPixels = bind(`${ticket}/tmp/d1816-d1445-n42-first-en-review/pixel-review-part1.json`);
assert.equal(display.sha256, '6e356da2612fc36c9da6ab7d61f87dc63b75b864da12b5fc5cf954c76d421d7c');
assert.equal(firstPixels.sha256, '8402aa1cc5408d2d6897580abfbcd5abbbb89ed26a325676d27000f719838be3');
assert.equal(read(firstPixels.path).status, 'REVISE');
assert.deepEqual(read(firstPixels.path).findings.map(finding => finding.id), ['EN-P1']);
const view = read(display.path).views.find(view => view.id === 'en-mobile');
for (const file of [view.lesson, view.html, view.nativeHtml, view.screenshot])
  assert.equal(bind(file.path).sha256, file.sha256);
const directory = `${ticket}/tmp/d1816-d1494-n42-mobile-ending-capture`;
const out = `${repo}/.tmp/STEMROBIN-181/d1816-d1494/mobile-ending`;
fs.mkdirSync(out, { recursive: true });
copy(import.meta.filename, `${directory}/check.executed-original.mjs`);
copy(firstPixels.path, `${directory}/first-pixel-revise.original.json`);
copy(`${ticket}/tmp/d1816-d1445-n42-first-en-review/image-ledger-part1.json`,
  `${directory}/first-image-ledger.original.json`);
const cropped = `${out}/original-mobile-ending-844px.png`;
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const cropReceipt = run('d1494-n42-original-mobile-ending-crop', [python, '-B', '-c',
  `import json
from PIL import Image
source=Image.open(${JSON.stringify(view.screenshot.path)}).convert("RGB")
assert source.width==390 and source.height>=844
box=(0,source.height-844,390,source.height)
source.crop(box).save(${JSON.stringify(cropped)})
print(json.dumps({"sourceSize":source.size,"box":box,"cropSize":[390,844],"resized":False}))`,
], [cropped]);
const crop = JSON.parse(fs.readFileSync(read(cropReceipt.path).streams.stdout.path, 'utf8'));
const { chromium } = createRequire(`${repo}/app/package.json`)('playwright');
let browser, failure = null, ending;
const requests = [], pageErrors = [];
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1, offline: true, serviceWorkers: 'block' });
  try {
    await context.route('**/*', route => { requests.push(route.request().url()); return route.abort(); });
    const page = await context.newPage();
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.setContent(fs.readFileSync(view.html.path, 'utf8'), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('p.para').count(), view.paragraphs);
    const annotations = await page.locator('p.para').last().locator('annotation').allTextContents();
    const conclusion = await page.locator('p.para').last().innerText();
    assert(conclusion.includes('The negative sign means the volume decreases'));
    assert(conclusion.includes('constant temperature'));
    assert(conclusion.includes('no loss of total mass'));
    assert(conclusion.includes('ideal-gas approximation'));
    await page.evaluate(() => window.scrollTo(0, document.scrollingElement.scrollHeight));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const geometry = await page.evaluate(() => {
      const paragraphs = [...document.querySelectorAll('p.para')].slice(-4);
      const rectangle = element => {
        const box = element.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height, bottom: box.bottom };
      };
      return { scrollY, scrollHeight: document.scrollingElement.scrollHeight,
        headings: document.querySelectorAll('h1').length,
        visibleHeading: [...document.querySelectorAll('h1')].some(element => rectangle(element).bottom > 0),
        paragraphs: paragraphs.map(element => ({ text: element.innerText, box: rectangle(element) })) };
    });
    assert.equal(geometry.scrollHeight, crop.sourceSize[1]);
    assert.equal(geometry.scrollY, crop.box[1]);
    assert.equal(geometry.visibleHeading, false);
    assert(geometry.paragraphs.at(-1).box.y >= 0 && geometry.paragraphs.at(-1).box.bottom <= 844);
    assert.deepEqual(requests, []);
    assert.deepEqual(pageErrors, []);
    const image = `${out}/unchanged-html-mobile-ending-viewport.png`;
    await page.screenshot({ path: image, fullPage: false });
    ending = { image: bind(image), viewport: { width: 390, height: 844 }, geometry, conclusion, annotations };
  } finally { await context.close(); }
} catch (error) { failure = { message: error.message, stack: error.stack }; }
finally { if (browser) await browser.close(); }
let comparison, comparisonReceipt;
if (!failure) {
  comparisonReceipt = run('d1494-n42-ending-pixel-comparison', [python, '-B', '-c',
    `import json
from PIL import Image,ImageChops
a=Image.open(${JSON.stringify(cropped)}).convert("RGB")
b=Image.open(${JSON.stringify(ending.image.path)}).convert("RGB")
assert a.size==b.size==(390,844)
difference=ImageChops.difference(a,b)
print(json.dumps({"size":a.size,"differenceBoundingBox":difference.getbbox(),
"differentPixels":sum(pixel!=(0,0,0) for pixel in difference.getdata()),
"totalPixels":a.width*a.height,"exactPixelsEqual":difference.getbbox() is None}))`,
  ]);
  comparison = JSON.parse(fs.readFileSync(read(comparisonReceipt.path).streams.stdout.path, 'utf8'));
}
const report = `${directory}/affected-report.json`;
save(report, {
  task: 'D1494', card: 'phy9-c1-s4-n42',
  status: failure ? 'FAIL' : 'AFFECTED_MOBILE_ENDING_CAPTURE_DOM_PASS_PIXELS_PENDING',
  display, firstPixels, native: read(display.path).native, currentLesson: view.lesson,
  unchangedNativeHtml: view.nativeHtml, unchangedDisplayedHtml: view.html,
  originalWholeImage: view.screenshot,
  originalCrop: { image: bind(cropped), ...crop, receipt: cropReceipt },
  freshEndingViewport: ending, comparison, comparisonReceipt,
  requests, pageErrors, failure, browserClosed: true,
  executedHelper: bind(`${directory}/check.executed-original.mjs`),
  rendererCalls: 0, sourceAndChineseAndFigureBytesUnchanged: true,
  originalPassedFullDomAndWidthNotReexecuted: true, onlyAffectedEndingDomObserved: true,
  parentImagesOpened: 0, newImagesSaved: failure ? 1 : 2,
  originalFirstEightImageUsageNotReset: true,
  cropAndFreshViewportNeedIndependentAffectedReview: true,
  diagnosis: 'Mechanical comparison supplements, but does not replace, independent observation of the affected ending.',
  databaseWrites: 0, paidCalls: 0, headedAcceptanceClaimed: false,
  fullEnglishAccessibilityApproval: false, allGlyphCertification: false,
});
assert.equal(failure, null, failure?.message);
console.log(JSON.stringify({ affected: bind(report), comparison, newSavedImages: 2, parentImagesOpened: 0 }));
