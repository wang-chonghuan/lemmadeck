import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, read, bytes, bind, hash,
  verify, exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const card = 'phy9-c2-s4-n113';
const tmp = `${ticket}/tmp`;
const nativePath = `${tmp}/d031-n113-native/result.json`;
const displayPath = `${tmp}/d031-n113-effective-offline-result.json`;
const tilePath = `${tmp}/d031-n113-effective-offline-tiles.json`;
const pixelPath = `${tmp}/d031-n113-pixel-effective-review.json`;
const manifestPath = `${evidence}/reports/d031-n113-retention-manifest.json`;
assert.ok(!await exists(manifestPath));
const native = await read(nativePath);
const display = await read(displayPath);
const tiles = await read(tilePath);
const pixels = await read(pixelPath);
assert.equal(native.status, 'pass-native-display-pending');
assert.equal(display.status, 'pass');
assert.equal(pixels.status, 'pass');
assert.equal(display.results.length, 4);
assert.equal(pixels.tiles.length, 14);
assert.deepEqual(pixels.tiles.map(row => relative(row.path)).sort(),
  tiles.tiles.map(row => relative(row.path)).sort());
assert.deepEqual(pixels.resolvedFindings.map(row => row.id), ['D031-PIXEL-B-001']);
assert.equal((await read(pixels.originalPixelReview.path)).status, 'fail');
assert.equal((await read(pixels.changedOnlyReview.path)).status, 'pass');
for (const row of native.outputs) await verify(row.path, row.sha256);
const beforeIndex = await bytes(indexPath);
const index = JSON.parse(beforeIndex);
const retained = [], reused = [];
async function retain(file, collection = 'reports', expected, destination) {
  file = relative(file);
  const data = await bytes(file);
  const sha256 = hash(data);
  if (expected) assert.equal(sha256, expected, `Retained input drift: ${file}`);
  const previous = lookup(index, file, sha256);
  if (previous) {
    await verify(previous, sha256);
    reused.push({ path: previous, sha256, originalPath: file });
    return { path: previous, sha256 };
  }
  destination ??= `${evidence}/author-history/d031/n113/inputs/${sha256.slice(0, 16)}-${path.basename(file)}`;
  await immutableWrite(destination, data);
  const row = { ...await bind(destination), originalPath: file,
    batch: 'D-031', deliveryClaim: false };
  assert.ok(!index[collection].some(item => item.path === destination));
  index[collection].push(row);
  retained.push(row);
  return { path: destination, sha256 };
}
await retain(native.science.path, 'reports', native.science.sha256);
for (const row of native.figures) {
  assert.equal((await read(row.path)).status, 'pass');
  await retain(row.path, 'reports', row.sha256);
}
const original = await read(pixels.originalPixelReview.path);
const originalManifest = await read(pixels.originalTileManifest.path);
const originalDisplay = await read(originalManifest.result.path);
for (const file of [
  displayPath, tilePath, pixelPath, pixels.originalPixelReview.path,
  pixels.originalTileManifest.path, originalManifest.result.path,
  pixels.changedTileManifest.path, pixels.changedOnlyReview.path,
  ...pixels.reviews.map(row => row.path),
]) await retain(file, 'reports', undefined, `${evidence}/reports/${path.basename(file)}`);
for (const row of pixels.reviews) {
  await verify(row.path, row.sha256);
  const report = await read(row.path);
  if (report.status === 'fail')
    assert.deepEqual(report.findings.map(item => item.id), ['D031-PIXEL-B-001']);
  else assert.equal(report.status, 'pass');
}
for (const file of await walk(`${tmp}/d031-n113-native`))
  await retain(file, 'reports', undefined,
    `${evidence}/author-history/d031/n113/native/${path.relative(`${tmp}/d031-n113-native`, file)}`);
for (const file of await walk(`${tmp}/d031-n113-unit-repair`))
  await retain(file, file.endsWith('.png') ? 'surfaces' : 'reports', undefined,
    `${evidence}/author-history/d031/n113/unit-repair/${path.relative(`${tmp}/d031-n113-unit-repair`, file)}`);
for (const row of [...originalDisplay.results, ...display.results]) {
  await retain(row.sourceHtml.path, 'reports', row.sourceHtml.sha256);
  await retain(row.screenshot, 'surfaces', row.screenshotSha256);
  if (row.metrics.scrollEndScreenshot)
    await retain(row.metrics.scrollEndScreenshot, 'surfaces', row.metrics.scrollEndScreenshotSha256);
}
for (const row of [...original.tiles, ...pixels.tiles]) {
  assert.equal(row.actuallyOpened, true);
  await retain(row.path, 'surfaces', row.sha256);
}
for (const row of pixels.tiles) assert.equal(row.status, 'pass');
const repairBefore = await read(`${tmp}/d031-n113-unit-repair/before/result.json`);
for (const row of repairBefore.protectedFiles.filter(item =>
  item.path.endsWith('/production-meter.json') || item.path.endsWith('/book.json')))
  await retain(row.path, 'reports', row.sha256);
for (const name of [
  'prepare-d031-n113-unit-repair.mjs', 'capture-d031-n113-unit-attempt.mjs',
  'capture-d031-n113-unit-attempt-2.mjs', 'repair-d031-n113-unit-wrap.mjs',
  'crop-d031-n113-unit-pixels.py', 'combine-d031-n113-unit-evidence.mjs',
  'retain-d031-n113-unit-evidence.mjs', 'record-d031-card-ready.mjs',
  'finalize-d031-n113.mjs', 'offline-d024-check.mjs', 'crop-d031-offline-pixels.py',
  'combine-d031-pixel-reviews.mjs',
]) await retain(`${tmp}/${name}`, 'reports', undefined,
  `${evidence}/author-history/d031/n113/unit-helpers/${name}`);
await immutableWrite(manifestPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'exact-complete-card-evidence-retained',
  native: await bind(nativePath), display: await bind(displayPath),
  tiles: await bind(tilePath), pixels: await bind(pixelPath),
  originalFailure: await bind(pixels.originalPixelReview.path),
  unitRepair: await bind(pixels.unitRepair.path),
  retained, reused, workedExamples: 2, newUnsolvedTasks: 0,
  limits: 'Complete effective display and original failed evidence retained. Five unit-power text nodes alone regrouped by the renderer; approved lessons/exercises/SCI/figure bytes unchanged. Original FAIL statuses preserved. No gate replay, DB, commit/push, delivery or handoff.',
}, null, 2)}\n`);
index.reports.push({ ...await bind(manifestPath), batch: 'D-031', deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), beforeIndex);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath),
  retained: retained.length, reused: reused.length }));
