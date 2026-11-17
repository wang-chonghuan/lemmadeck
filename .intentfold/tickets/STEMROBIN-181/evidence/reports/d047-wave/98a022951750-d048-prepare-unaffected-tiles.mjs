import assert from 'node:assert/strict';
import {
  ticket, read, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';
assert.deepEqual(process.argv.slice(2), ['--execute']);
const displayPath = `${ticket}/tmp/d048-effective-wave-display.json`;
await verify(displayPath, '4e0d37f0848ae850a5c22adc71a9cd08543653f062315a2a6d3172bfef83196d');
const display = await read(displayPath);
const byPath = new Map(display.tiles.map(row => [row.path, row]));
const affected = row => {
  const surface = row.surface ?? byPath.get(row.path)?.surface;
  assert.ok(surface);
  return surface.startsWith('phy10-c1-s5-n39-') && /-(exercises|answers)-/.test(surface);
};
const previouslyOpened = new Set();
const approvedTiles = [];
const reports = [];
for (let n = 1; n <= 5; n++) {
  const file = `${ticket}/tmp/d048-display-review-${String(n).padStart(2, '0')}.json`;
  const review = await read(file);
  assert.equal(review.imagesOpened, review.tiles.length);
  reports.push(await bind(file));
  for (const tile of review.tiles) {
    assert.ok(!previouslyOpened.has(tile.path));
    previouslyOpened.add(tile.path);
    if (!affected(tile)) {
      assert.equal(tile.status, 'PASS');
      assert.deepEqual(tile.defects, []);
      assert.equal(tile.sha256, byPath.get(tile.path)?.sha256);
      approvedTiles.push({ ...byPath.get(tile.path), ...tile, reviewer: review.reviewer, report: await bind(file) });
    }
  }
}
const assets = display.tiles.filter(tile => !affected(tile) && !previouslyOpened.has(tile.path));
const reviewBatches = [];
for (let i = 0; i < assets.length; i += 8)
  reviewBatches.push({ batch: reviewBatches.length + 1, assets: assets.slice(i, i + 8), maxImageOpens: 8 });
const destination = `${ticket}/tmp/d048-unaffected-display-tiles.json`;
await immutableWrite(destination, `${JSON.stringify({
  ticket: 'STEMROBIN-181', display: await bind(displayPath), reports,
  approvedTiles, reviewBatches,
  supersededSurfaces: display.surfaces.filter(row => affected({ surface: row.id })).map(row => row.id),
  policy: 'Reuse first-person PASS for unchanged surfaces only; exclude every n39 exercise/answer screenshot affected by the single numbering repair.',
}, null, 2)}\n`);
console.log(JSON.stringify({ plan: await bind(destination), approvedTiles: approvedTiles.length,
  unreviewed: assets.length, batches: reviewBatches.length }));
