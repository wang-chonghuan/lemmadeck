import assert from 'node:assert/strict';
import {
  ticket, read, bind, verify, exists, immutableWrite, relative,
} from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const manifestPath = `${work}/d023-offline-tiles.json`;
const output = `${work}/d023-screenshot-review.json`;
assert.ok(!await exists(output), 'Screenshot review already consumed');
const manifest = await read(manifestPath);
await verify(manifest.result.path, manifest.result.sha256);
const result = await read(manifest.result.path);
assert.equal(result.status, 'pass');
const reports = process.argv.slice(2);
assert.ok(reports.length);
const reviews = [];
const observed = new Map();
const tileKey = item => `${relative(item.path)}:${item.sha256}`;
const surfaceKey = item => `${item.card ?? item.id}:${item.surface}:${item.viewport?.width ?? item.viewport}`;
for (const file of reports) {
  const review = await read(file);
  assert.equal(review.status, 'pass');
  assert.equal(review.imagesLoaded, review.tiles.length);
  assert.ok(review.imagesLoaded > 0 && review.imagesLoaded <= 8);
  assert.deepEqual(review.batchResult, manifest.result);
  assert.ok(review.reviewer && review.freshContext === true);
  for (const tile of review.tiles) {
    const original = manifest.tiles.find(item => tileKey(item) === tileKey(tile));
    assert.ok(original, `Unknown observed tile:${tile.path}`);
    assert.ok(!observed.has(tileKey(tile)), `Duplicate inspection:${tile.path}`);
    assert.equal(tile.status, 'pass');
    assert.equal(tile.actuallyOpened, true);
    assert.equal(tile.openCount, 1);
    assert.ok(tile.observations?.trim());
    await verify(tile.path, tile.sha256);
    for (const key of ['card', 'surface', 'viewport', 'crop']) {
      assert.deepEqual(tile[key], original[key]);
    }
    assert.equal(relative(tile.source), relative(original.source));
    observed.set(tileKey(tile), { ...tile, reviewer: review.reviewer });
  }
  reviews.push(await bind(file));
}
assert.deepEqual([...observed.keys()].sort(), manifest.tiles.map(tileKey).sort(),
  'Every unique final tile must have exactly one actual observation');
const nonemptyKeys = [...new Set(manifest.tiles.map(surfaceKey))];
const emptyKeys = manifest.emptySourceDefinedSurfaces.map(surfaceKey);
assert.deepEqual([...nonemptyKeys, ...emptyKeys].sort(), result.results.map(surfaceKey).sort());
const surfaces = nonemptyKeys.map(key => {
  const tiles = [...observed.values()].filter(tile => surfaceKey(tile) === key);
  const { card, surface, viewport } = tiles[0];
  return { card, surface, viewport, status: 'pass',
    reviewer: [...new Set(tiles.map(tile => tile.reviewer))].join(', '),
    actuallyObservedTiles: tiles.length };
});
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D023', status: 'pass',
  batchResult: manifest.result, tileManifest: await bind(manifestPath),
  independentReports: reviews, surfaces, tiles: [...observed.values()],
  emptySourceDefinedSurfaces: manifest.emptySourceDefinedSurfaces,
  exactPixelReuse: manifest.exactPixelReuse,
  scope: 'Single selected-card desktop/mobile offline run. Fresh bounded reviewers observed every unique tile once; exact identical scroll-state pixels reused. Parent opened no images.',
  nativeRenderOrBrowserRerun: false, newSemanticOrSourceGate: false,
}, null, 2)}\n`);
console.log(`D023 screenshot observations combined:${observed.size} unique tiles`);
