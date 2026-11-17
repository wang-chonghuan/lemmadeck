import assert from 'node:assert/strict';
import {
  ticket, relative, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const card = 'phy9-c2-s4-n113';
const output = `${tmp}/d031-n113-pixel-effective-review.json`;
assert.ok(!await exists(output));
const originalPath = `${tmp}/d031-n113-pixel-review.json`;
await verify(originalPath, '3a6b39e7f1b70019674d985a7270b5429a2ea5c110133c4c5f8dcaac824a333a');
const original = await read(originalPath);
assert.equal(original.status, 'fail');
assert.deepEqual(original.findings.map(row => row.id), ['D031-PIXEL-B-001']);
const originalManifestPath = `${tmp}/d031-${card}-offline-tiles.json`;
const originalManifest = await read(originalManifestPath);
const originalDisplay = await read(originalManifest.result.path);
const repairPath = `${tmp}/d031-n113-unit-repair/result.json`;
await verify(repairPath, 'b5faf5278eda8e04329cb9bd179ef06ea1a08d6c89998791161121fbcd95ea40');
const repair = await read(repairPath);
assert.equal(repair.status, 'pass-unit-browser-pixels-pending');
assert.equal(repair.htmlEquivalence.movedUnits, 5);
assert.equal(repair.unchangedText.bytesIdentical, true);
assert.equal(repair.unchangedText.before.sha256, repair.unchangedText.after.sha256);
for (const row of [...repair.protectedFiles, repair.toolAfter,
  repair.unchangedText.before, repair.unchangedText.after,
  repair.changedExercises.before, repair.changedExercises.after])
  await verify(row.path, row.sha256);
const changedManifestPath = `${tmp}/d031-n113-unit-tiles.json`;
const changedManifest = await read(changedManifestPath);
assert.equal(changedManifest.result.sha256, (await bind(repairPath)).sha256);
const changedReviewPath = `${tmp}/d031-n113-unit-pixel-review.json`;
const changedReview = await read(changedReviewPath);
assert.equal(changedReview.status, 'pass');
assert.equal(changedReview.card, card);
assert.deepEqual(changedReview.findings, []);
assert.equal(changedReview.tiles.length, 6);
assert.deepEqual(changedReview.tiles.map(row => relative(row.path)).sort(),
  changedManifest.tiles.map(row => relative(row.path)).sort());
for (const row of original.tiles) {
  assert.equal(row.actuallyOpened, true);
  await verify(row.path, row.sha256);
}
for (const row of changedReview.tiles) {
  const declared = changedManifest.tiles.find(tile => relative(tile.path) === relative(row.path));
  assert.equal(row.sha256, declared.sha256);
  assert.equal(row.actuallyOpened, true);
  assert.equal(row.openCount, 1);
  assert.equal(row.status, 'pass');
  await verify(row.path, row.sha256);
}
const textTiles = original.tiles.filter(row =>
  originalManifest.tiles.find(tile => relative(tile.path) === relative(row.path)).surface === 'text');
assert.equal(textTiles.length, 8);
assert.ok(textTiles.every(row => row.status === 'pass'));
const changedTiles = changedReview.tiles.map(row => ({
  ...changedManifest.tiles.find(tile => relative(tile.path) === relative(row.path)),
  ...row, reviewRole: 'new-affected-exercise-pixels',
}));
const tiles = [...textTiles, ...changedTiles];
assert.equal(new Set(tiles.map(row => relative(row.path))).size, 14);
const displayPath = `${tmp}/d031-n113-effective-offline-result.json`;
await immutableWrite(displayPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'pass',
  originalDisplay: originalManifest.result, unitRepair: await bind(repairPath),
  results: originalDisplay.results.map(row => row.surface === 'text' ? row :
    repair.results.find(after => after.viewport.width === row.viewport.width)),
  scope: 'Original unchanged text surfaces plus new affected exercise surfaces.',
  limits: 'Existing browser and pixel evidence combined; no new gate or full-card delivery claim.',
}, null, 2)}\n`);
const manifestPath = `${tmp}/d031-n113-effective-offline-tiles.json`;
const textPaths = new Set(textTiles.map(row => relative(row.path)));
await immutableWrite(manifestPath, `${JSON.stringify({
  role: 'Effective full-card pixel coverage; originals retained, exercise pixels replaced.',
  result: await bind(displayPath),
  originalManifest: await bind(originalManifestPath),
  changedManifest: await bind(changedManifestPath),
  tiles, emptySourceDefinedSurfaces: [],
  exactPixelReuse: [
    ...originalManifest.exactPixelReuse.filter(row => textPaths.has(relative(row.samePixelsAs.path))),
    ...changedManifest.exactPixelReuse,
  ],
}, null, 2)}\n`);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'pass',
  scope: 'Eight unchanged text tiles plus six independently inspected replacement exercise tiles.',
  manifest: await bind(manifestPath), display: await bind(displayPath),
  originalPixelReview: await bind(originalPath),
  originalTileManifest: await bind(originalManifestPath),
  unitRepair: await bind(repairPath), changedTileManifest: await bind(changedManifestPath),
  changedOnlyReview: await bind(changedReviewPath),
  reviews: [...original.reviews, await bind(changedReviewPath)],
  originalTileStatusesUnchanged: original.tiles.map(row => ({
    path: row.path, sha256: row.sha256, status: row.status,
  })),
  tiles, findings: [],
  resolvedFindings: [{
    id: 'D031-PIXEL-B-001', originalStatus: 'fail',
    status: 'resolved-by-new-affected-exercise-pixels',
    replacementReview: await bind(changedReviewPath),
    originalPixelsAreNotReclassifiedAsPass: true,
  }],
  emptySourceDefinedSurfaces: [], exactPixelReuse: (await read(manifestPath)).exactPixelReuse,
  limits: 'Original FAIL and all original tile statuses remain immutable. Reuses text PASS and SCI/figure approvals, consuming a separate repaired-exercise pixel PASS. No image/browser/native rerun, content write, delivery or handoff.',
}, null, 2)}\n`);
console.log(JSON.stringify({ pixels: await bind(output), status: 'pass',
  unchangedTextTiles: 8, replacementExerciseTiles: 6 }));
