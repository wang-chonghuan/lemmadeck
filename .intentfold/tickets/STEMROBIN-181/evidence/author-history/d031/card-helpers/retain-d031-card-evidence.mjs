import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, read, bytes, bind, hash,
  verify, exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

const [execute, card, pixelReviewPath] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.ok(['phy9-c2-s4-n113', 'phy9-c2-s5-n114'].includes(card));
const number = card.split('-').at(-1);
const tmp = `${ticket}/tmp`;
const nativePath = `${tmp}/d031-${number}-native/result.json`;
const displayPath = `${tmp}/offline-d024/result-${card}.json`;
const tilePath = `${tmp}/d031-${card}-offline-tiles.json`;
const manifestPath = `${evidence}/reports/d031-${number}-retention-manifest.json`;
assert.ok(!await exists(manifestPath));
const native = await read(nativePath);
const display = await read(displayPath);
const tiles = await read(tilePath);
const pixels = await read(pixelReviewPath);
assert.equal(native.status, 'pass-native-display-pending');
assert.equal(display.status, 'pass');
assert.equal(pixels.status, 'pass');
assert.equal(pixels.card, card);
assert.equal(display.results.length, 4);
assert.deepEqual(pixels.tiles.map(row => relative(row.path)).sort(),
  tiles.tiles.map(row => relative(row.path)).sort());
for (const row of native.outputs) await verify(row.path, row.sha256);
for (const row of native.figures) {
  await verify(row.path, row.sha256);
  assert.equal((await read(row.path)).status, 'pass');
}
const beforeIndex = await bytes(indexPath);
const index = JSON.parse(beforeIndex);
const retained = [];
const reused = [];
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
  destination ??= `${evidence}/author-history/d031/${number}/inputs/${sha256.slice(0, 16)}-${path.basename(file)}`;
  await immutableWrite(destination, data);
  const row = { path: destination, sha256, originalPath: file, batch: 'D-031',
    deliveryClaim: false };
  const old = index[collection].find(item => item.path === destination);
  if (old) assert.equal(old.sha256, sha256);
  else index[collection].push(row);
  retained.push(row);
  return { path: destination, sha256 };
}
await retain(native.science.path, 'reports', native.science.sha256);
for (const row of native.figures) await retain(row.path, 'reports', row.sha256);
for (const file of [displayPath, tilePath, pixelReviewPath])
  await retain(file, 'reports', undefined, `${evidence}/reports/${path.basename(file)}`);
for (const row of pixels.reviews ?? []) {
  await retain(row.path, 'reports', row.sha256, `${evidence}/reports/${path.basename(row.path)}`);
  assert.equal((await read(row.path)).status, 'pass');
}
for (const file of await walk(`${tmp}/d031-${number}-native`))
  await retain(file, 'reports', undefined,
    `${evidence}/author-history/d031/${number}/native/${path.relative(`${tmp}/d031-${number}-native`, file)}`);
for (const row of display.results) {
  await retain(row.sourceHtml.path, 'reports', row.sourceHtml.sha256);
  await retain(row.screenshot, 'surfaces', row.screenshotSha256);
  if (row.metrics.scrollEndScreenshot)
    await retain(row.metrics.scrollEndScreenshot, 'surfaces', row.metrics.scrollEndScreenshotSha256);
}
for (const tile of pixels.tiles) {
  const declared = tiles.tiles.find(row => relative(row.path) === relative(tile.path));
  assert.equal(tile.sha256, declared.sha256);
  assert.equal(tile.actuallyOpened, true);
  assert.equal(tile.status, 'pass');
  await retain(tile.path, 'surfaces', tile.sha256);
}
for (const row of tiles.emptySourceDefinedSurfaces) {
  assert.ok(display.results.some(surface =>
    surface.surface === row.surface && surface.viewport.width === row.viewport &&
    surface.screenshotSha256 === row.sha256));
}
for (const name of ['retain-d031-card-evidence.mjs', 'record-d031-card-ready.mjs',
  'crop-d031-offline-pixels.py', 'combine-d031-pixel-reviews.mjs',
  `finalize-d031-${number}.mjs`, 'offline-d024-check.mjs'])
  await retain(`${tmp}/${name}`, 'reports', undefined,
    `${evidence}/author-history/d031/card-helpers/${name}`);
await immutableWrite(manifestPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'exact-complete-card-evidence-retained',
  native: await bind(nativePath), display: await bind(displayPath),
  tiles: await bind(tilePath), pixels: await bind(pixelReviewPath),
  retained, reused, workedExamples: number === 'n113' ? 2 : 0,
  newUnsolvedTasks: 0,
  limits: 'Existing SCI/figure/native/browser and final pixel evidence retained without gate replay. Approved content/media/reviews unchanged. No DB, commit/push, delivery or formal handoff.',
}, null, 2)}\n`);
index.reports.push({ ...await bind(manifestPath), batch: 'D-031', deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), beforeIndex);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath),
  retained: retained.length, reused: reused.length }));
