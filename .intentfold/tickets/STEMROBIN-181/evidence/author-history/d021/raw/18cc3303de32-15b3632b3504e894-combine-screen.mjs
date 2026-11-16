import assert from 'node:assert/strict';
import {
  out, pinned, affected, absolute, bind, binding, read, load, verify, absent, immutableWrite,
  oldHistory, verifyEffective, exactSet, expectedSurfaces, surfaceKey, tileKey,
  assertTile, assertActualObservation,
} from './common.mjs';

const args = process.argv.slice(2);
assert.equal(args.length, 1, 'Usage: node combine-screen.mjs ACTUAL-FRESH-AFFECTED-REVIEW.json');
const output = `${out}/screenshot-review-effective.json`;
const manifestPath = `${out}/tiles-effective.json`;
const assignmentPath = `${out}/assigned-new82-changed-tiles.json`;
await absent(output);
const history = await oldHistory();
const manifest = await read(manifestPath);
const manifestBinding = await bind(manifestPath);
const assignment = await read(assignmentPath);
const assignmentBinding = await bind(assignmentPath);
const result = await load(manifest.result);
await verifyEffective(result);
assert.deepEqual(binding(manifest.rawResult), binding(result.rawResult));
assert.deepEqual(binding(assignment.batchResult), binding(manifest.result));
assert.deepEqual(binding(assignment.tileManifest), manifestBinding);
assert.deepEqual(manifest.initialReviewBindings, pinned.reviews);
assert.equal(assignment.assignment.fork_context, false);
assert.equal(assignment.assignment.maxImagesPerBatch, 8);
const fresh = await read(args[0]);
const freshBinding = await bind(args[0]);
assert.ok(['pass', 'fail'].includes(fresh.status), 'Actual review outcome required');
assert.ok(fresh.reviewer && fresh.freshContext === true);
assert.equal(fresh.imagesLoaded, assignment.tiles.length);
assert.ok(fresh.imagesLoaded > 0 && fresh.imagesLoaded <= 8);
assert.deepEqual(binding(fresh.batchResult), binding(manifest.result));
assert.deepEqual(binding(fresh.tileManifest), manifestBinding);
assert.deepEqual(binding(fresh.assignmentManifest), assignmentBinding);
exactSet(fresh.tiles.map(tileKey), assignment.tiles.map(tileKey), 'Only assigned changed82 images');
exactSet(assignment.tiles.map(tileKey),
  manifest.tiles.filter(tile => tile.reviewRequired).map(tileKey), 'All new effective tiles assigned');
const actual = new Map();
for (const tile of fresh.tiles) {
  const assigned = assignment.tiles.find(item => tileKey(item) === tileKey(tile));
  assert.equal(tile.card, affected);
  assert.equal(tile.surface, 'text');
  assertTile(tile, assigned);
  assertActualObservation(tile);
  assert.ok(['pass', 'fail'].includes(tile.status));
  await verify(tile);
  await verify({ path: tile.source, sha256: tile.sourceSha256 });
  actual.set(tileKey(tile), { ...tile, reviewer: fresh.reviewer,
    observationProvenance: { kind: 'fresh-affected-review', report: freshBinding,
      observedImage: binding(tile), actuallyOpened: true, openCount: 1 },
    aliases: [], newImageOpened: true });
}
// Old PASS records retain their old path/source/actual-open identity. Aliases, not
// invented opens, connect an unchanged crop of a new screenshot to that observation.
const tiles = [];
for (const tile of manifest.tiles) {
  await verify(tile);
  await verify({ path: tile.source, sha256: tile.sourceSha256 });
  if (tile.reviewRequired) {
    tiles.push(actual.get(tileKey(tile)));
    continue;
  }
  const supplied = history.observed.get(tileKey(tile));
  assert.ok(supplied, 'Reused tile must have an exact old observation');
  assert.equal(supplied.tile.status, 'pass', 'An old FAIL is never passing evidence');
  assertTile(tile, supplied.tile);
  assert.deepEqual(binding(tile.observationProvenance.report), binding(supplied.report));
  assertActualObservation(supplied.tile);
  if (tile.card === affected) {
    assert.equal(tile.observationProvenance.kind, 'exact-old-PASS');
    assert.ok(tile.aliases.length > 0, 'New82 screenshot must carry an explicit old-pixels alias');
    for (const alias of tile.aliases) {
      assert.equal(alias.kind, 'exact-old-PASS');
      assert.equal(alias.oldReviewStatus, 'pass');
      assert.deepEqual(binding(alias.samePixelsAs), binding(tile));
      assert.deepEqual(binding(alias.initialReview), binding(supplied.report));
      assert.deepEqual(alias.oldPixelProof, alias.newPixelProof, 'Exact raw pixels/dimensions/mode');
      assert.deepEqual(alias.crop, alias.oldCrop, 'Exact crop geometry');
      assert.equal(alias.newPixelInspectionRequired, false);
      await verify({ path: alias.source, sha256: alias.sourceSha256 });
      const row = result.results.find(item => surfaceKey(item) === surfaceKey(alias));
      assert.ok(row && (
        (absolute(alias.source) === absolute(row.screenshot) && alias.sourceSha256 === row.screenshotSha256) ||
        (row.metrics.scrollEndScreenshot &&
          absolute(alias.source) === absolute(row.metrics.scrollEndScreenshot) &&
          alias.sourceSha256 === row.metrics.scrollEndScreenshotSha256)));
      assert.ok(manifest.exactPixelReuse.some(item =>
        JSON.stringify(item) === JSON.stringify(alias)), 'Alias lacks manifest raw proof');
    }
  } else {
    assert.equal(tile.observationProvenance.kind, 'unchanged-old-PASS');
    assert.deepEqual(tile.aliases, []);
  }
  tiles.push({
    ...supplied.tile, reviewer: supplied.reviewer,
    observationProvenance: tile.observationProvenance,
    rawPixelSha256: tile.rawPixelSha256, dimensions: tile.dimensions, mode: tile.mode,
    aliases: tile.aliases, newImageOpened: false,
  });
}
exactSet(tiles.map(tileKey), manifest.tiles.map(tileKey), 'Effective unique actual observation coverage');
const keys = [...new Set(tiles.map(surfaceKey))];
exactSet([...keys, ...manifest.emptySourceDefinedSurfaces.map(surfaceKey)],
  expectedSurfaces, 'Original12 result coverage including defined empty surfaces');
assert.equal(manifest.emptySourceDefinedSurfaces.length, 4);
const status = tiles.every(tile => tile.status === 'pass') && fresh.status === 'pass' ? 'pass' : 'fail';
const surfaces = keys.map(key => {
  const observations = tiles.filter(tile => surfaceKey(tile) === key);
  const { card, surface, viewport } = observations[0];
  return {
    card, surface, viewport,
    status: observations.every(tile => tile.status === 'pass') ? 'pass' : 'fail',
    reviewer: [...new Set(observations.map(tile => tile.reviewer))].join(', '),
    actuallyObservedTiles: observations.length,
    freshActuallyOpenedTiles: observations.filter(tile => tile.newImageOpened).length,
    reusedOldActuallyOpenedTiles: observations.filter(tile => !tile.newImageOpened).length,
  };
});
await verifyEffective(result);
await verify(manifestBinding);
await verify(assignmentBinding);
await verify(freshBinding);
await immutableWrite(output, {
  ticket: 'STEMROBIN-181', batch: 'D021', status,
  batchResult: manifest.result, tileManifest: manifestBinding,
  independentReports: [...pinned.reviews, freshBinding],
  initialReviewBindings: pinned.reviews, freshAffectedReview: freshBinding,
  assignmentManifest: assignmentBinding, surfaces, tiles,
  emptySourceDefinedSurfaces: manifest.emptySourceDefinedSurfaces,
  exactPixelReuse: manifest.exactPixelReuse, aliases: manifest.aliases,
  pixelComparisons: manifest.pixelComparisons,
  supersededOld82Tiles: manifest.supersededOld82Tiles,
  rawHistory: result.rawHistory, rawResult: result.rawResult,
  oldHtmlAliases: result.oldHtmlAliases, oldRendererAlias: result.oldRendererAlias,
  nativeRender: result.nativeRender, nativeHelper: result.nativeHelper, helpers: result.helpers,
  imageLedger: {
    imagesOpenedByComposer: 0, freshActualOpenCount: fresh.imagesLoaded,
    effectiveReusedOldPassObservations: tiles.filter(tile => !tile.newImageOpened).length,
    initialReviewActualOpenCount: history.reviews.reduce((sum, review) => sum + review.imagesLoaded, 0),
    oldFailedObservationsRetainedOnlyAsHistory: 2,
    effectiveTileCount: tiles.length, reopenCount: 0,
  },
  scope: 'Original12 surfaces: old10 exact machine receipts plus new82 text desktop/mobile. Raw83/84 PASS and exact-old82 PASS observations reused without reopening. Only assigned changed82 tiles freshly opened once.',
  nativeRenderOrBrowserRerun: false, newSemanticOrSourceGate: false,
  consumeReceiptsContract: 'batchResult/tileManifest exact bindings; tiles match manifest paths/SHA and carry actual old-or-fresh observations. aliases explicitly identify old passed pixels, never new-image approvals.',
});
console.log(JSON.stringify(await bind(output)));
if (status !== 'pass') process.exitCode = 1;
