import assert from 'node:assert/strict';
import {
  ticket, relative, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [execute, card, ...reviewPaths] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.ok(['phy9-c2-s4-n113', 'phy9-c2-s5-n114'].includes(card));
assert.ok(reviewPaths.length);
const number = card.split('-').at(-1);
const output = `${ticket}/tmp/d031-${number}-pixel-review.json`;
assert.ok(!await exists(output));
const manifestPath = `${ticket}/tmp/d031-${card}-offline-tiles.json`;
const manifest = await read(manifestPath);
await verify(manifest.result.path, manifest.result.sha256);
const reviews = await Promise.all(reviewPaths.map(read));
const tiles = reviews.flatMap(row => row.tiles);
assert.deepEqual(tiles.map(row => relative(row.path)).sort(),
  manifest.tiles.map(row => relative(row.path)).sort(), 'Every unique tile must be reviewed exactly once.');
for (const review of reviews) {
  assert.equal(review.card, card);
  assert.ok(['pass', 'fail'].includes(review.status));
  assert.ok(review.tiles.length <= 8);
  for (const tile of review.tiles) {
    const declared = manifest.tiles.find(row => relative(row.path) === relative(tile.path));
    assert.ok(declared);
    assert.equal(tile.sha256, declared.sha256);
    await verify(tile.path, tile.sha256);
    assert.equal(tile.actuallyOpened, true);
    assert.ok(['pass', 'fail'].includes(tile.status));
  }
}
const findings = reviews.flatMap(row => row.findings ?? []);
const status = reviews.every(row => row.status === 'pass') &&
  tiles.every(row => row.status === 'pass') && findings.length === 0 ? 'pass' : 'fail';
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status,
  scope: 'Complete unique offline screenshot-tile coverage from sequential fresh bounded reviewers.',
  manifest: await bind(manifestPath), reviews: await Promise.all(reviewPaths.map(bind)),
  tiles, findings, emptySourceDefinedSurfaces: manifest.emptySourceDefinedSurfaces,
  exactPixelReuse: manifest.exactPixelReuse,
  limits: 'Combines existing independent pixel observations and verifies hashes only. No image/browser/native/SCI/figure rerun, content changes, delivery or formal handoff.',
}, null, 2)}\n`);
console.log(JSON.stringify({ pixels: await bind(output), status, tiles: tiles.length }));
