import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import {
  ticket, absolute, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const base = `${ticket}/tmp`;
const out = `${base}/d335-t18-existing-desktop-capture-tiles`;
assert.equal(await exists(`${out}/manifest.json`), false);
const priorPath = `${base}/d334-t18-desktop-choice-display-repair/dom-capture.json`;
await verify(priorPath, '37a6b481265f5b8e01fb1a01b780e900553114891d4625f4767e6f2d32f4cfc4');
const prior = await read(priorPath);
assert.equal(prior.execution.actualDOMInspections, 2);
assert.equal(prior.execution.fullPageCaptures, 2);
assert.equal(prior.execution.imagesOpenedByScript, 0);
assert.equal(prior.tiles.length, 0);
assert.equal(prior.failures.length, 2);
assert.ok(prior.failures.every(row => row.label === 'First capture failure retained; no retry'));
const runtimePackage = '/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/package.json';
const sharp = createRequire(runtimePackage)('sharp');
const tiles = [], surfaceReceipts = [];
for (const surface of prior.surfaces) {
  assert.equal(surface.failures.length, 1);
  assert.ok(surface.checks.filter(row => !row.pass).every(row => row.label === 'First capture failure retained; no retry'));
  assert.ok(surface.checks.filter(row => row.pass).length > 25);
  const capture = surface.capture;
  await verify(capture.path, capture.sha256);
  const sheet = surface.layout.sheet;
  const meta = await sharp(absolute(capture.path)).metadata();
  assert.equal(meta.width, capture.width);
  assert.equal(meta.height, capture.height);
  const left = Math.floor(sheet.x), top = Math.floor(sheet.y);
  const right = Math.ceil(sheet.x + sheet.width);
  const floatBottom = sheet.y + sheet.height;
  assert.ok(left >= 0 && top >= 0 && right <= meta.width);
  assert.ok(floatBottom >= meta.height && floatBottom - meta.height < 1);
  const contentBoxes = [
    ...surface.layout.fragments.flatMap(row => row.boxes),
    ...surface.observed.formulas.flatMap(row => row.visual ? [row.visual] : []),
    ...surface.layout.controls.map(row => row.box),
    ...surface.layout.questions.flatMap(row => [row.box, ...row.options.map(option => option.box)]),
  ];
  assert.ok(contentBoxes.length > 59);
  assert.ok(contentBoxes.every(box => box.y >= top && box.y + box.height <= meta.height));
  const bottom = meta.height;
  for (let y = top, i = 1; y < bottom; y += 960, i++) {
    const crop = { left, top: y, width: right - left, height: Math.min(960, bottom - y) };
    const file = `${out}/${surface.language}-choices-sheet-${String(i).padStart(3, '0')}.png`;
    assert.equal(await exists(file), false);
    await fs.mkdir(path.dirname(absolute(file)), { recursive: true });
    await sharp(absolute(capture.path)).extract(crop).png().toFile(absolute(file));
    await fs.chmod(absolute(file), 0o444);
    tiles.push({
      ...await bind(file), language: surface.language, crop,
      parentCapture: capture, parentHTML: surface.inputHTML,
      originalPixels: true, resampled: false, opened: false,
      sequence: tiles.length + 1,
      contentRanges: surface.layout.questions.filter(row =>
        row.box.y < y + crop.height && row.box.y + row.box.height > y)
        .map(row => ({ id: row.id, number: row.number,
          fullyContained: row.box.y >= y && row.box.y + row.box.height <= y + crop.height })),
    });
  }
  assert.equal(tiles.filter(row => row.language === surface.language)
    .reduce((sum, row) => sum + row.crop.width * row.crop.height, 0),
  (right - left) * (bottom - top));
  surfaceReceipts.push({
    language: surface.language, inputHTML: surface.inputHTML,
    retainedDOMStatus: 'PASS-OBSERVED-CHECKS-ONLY',
    passedChecks: surface.checks.filter(row => row.pass).length,
    originalCaptureFailurePreserved: surface.failures,
    observedSheetBottom: floatBottom, actualImageBottom: bottom,
    discardedFractionalPaddingPx: floatBottom - bottom,
    allContentInsideOriginalCapture: true,
    contentBottom: Math.max(...contentBoxes.map(box => box.y + box.height)),
    screenshotRecaptures: 0, DOMRechecks: 0,
  });
}
const manifestPath = `${out}/manifest.json`;
await immutableWrite(manifestPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy9-c2-s4-t18',
  status: 'EXISTING-DESKTOP-CAPTURE-TILES-FIRST-VISUAL-PENDING',
  preservedFirstDOMCaptureReport: await bind(priorPath), surfaceReceipts, tiles,
  tileCoverage: 'Every captured sheet pixel covered once; subpixel bottom padding has no source image pixel and no content outside the original image.',
  visualBatches: [tiles.slice(0, 8), tiles.slice(8)],
  parentImageOpens: 0, parentImageCount: 24, newScreenshots: 0, newBrowserLaunches: 0,
  semanticReviewsRepeated: false, fullGate2PASS: false, completeCardClaim: false,
  originalFAILAndUncommittedBytesPreserved: true,
}, null, 2)}\n`);
await fs.chmod(absolute(manifestPath), 0o444);
console.log(JSON.stringify({ manifest: await bind(manifestPath), tiles: tiles.length,
  batchSizes: [tiles.slice(0, 8).length, tiles.slice(8).length], newScreenshots: 0, parentImageOpens: 0 }));
