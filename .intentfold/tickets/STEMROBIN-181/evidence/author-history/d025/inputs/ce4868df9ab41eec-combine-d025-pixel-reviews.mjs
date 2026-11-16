import assert from 'node:assert/strict';
import {
  ticket, read, bytes, bind, verify, relative, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const manifestPath = `${tmp}/d025-offline-tiles.json`;
const manifestBinding = await bind(manifestPath);
const manifest = await read(manifestPath);
await verify(manifest.result.path, manifest.result.sha256);
assert.equal((await read(manifest.result.path)).status, 'pass');
const selections = [
  ['d025-pixel-review-n101-desktop.json', '8fe231f219feef859e77b05e8abe81a285759ae71513a0bb2d74b0e73cca9dab', 6],
  ['d025-pixel-review-n101-mobile.json', '4c809f03e69978d0da6e10eb98b39f1603faba070b4c0f9a1d612acc6d88bd66', 7],
  ['d025-pixel-review-n105.json', '5619865c5b996964512c3b64f853350e507f544f4c13ab31ae7f64930a30ec4b', 5],
];
const reports = [];
const reviewed = new Map();
for (const [name, sha256, count] of selections) {
  const file = `${tmp}/${name}`;
  await verify(file, sha256);
  const report = JSON.parse(await bytes(file));
  assert.equal(report.status, 'pass');
  assert.equal(report.tiles.length, count);
  assert.equal(report.imageAccounting.actuallyOpenedImages, count);
  assert.equal(report.imageAccounting.repeatOpens, 0);
  const tileBinding = report.sourceTileManifest ?? report.tileManifest;
  const displayBinding = report.browserResult ?? report.browserReport;
  assert.equal(relative(tileBinding.path), manifestBinding.path);
  assert.equal(tileBinding.sha256, manifestBinding.sha256);
  assert.equal(relative(displayBinding.path), relative(manifest.result.path));
  assert.equal(displayBinding.sha256, manifest.result.sha256);
  for (const tile of report.tiles) {
    const file = relative(tile.path);
    assert.ok(!reviewed.has(file), `Duplicate reviewed tile: ${file}`);
    assert.equal(tile.status, 'pass');
    assert.equal(tile.actuallyOpened, true);
    await verify(file, tile.sha256);
    reviewed.set(file, { ...tile, path: file, report: { path: `${tmp}/${name}`, sha256 } });
  }
  reports.push({ path: file, sha256, actuallyOpenedImages: count });
}
assert.equal(reviewed.size, 18);
assert.deepEqual([...reviewed.keys()].sort(), manifest.tiles.map(row => relative(row.path)).sort());
const tiles = manifest.tiles.map(tile => {
  const review = reviewed.get(relative(tile.path));
  assert.equal(review.sha256, tile.sha256);
  return { ...tile, path: relative(tile.path), actuallyOpened: true, status: 'pass',
    owningReview: review.report };
});
const output = `${tmp}/d025-combined-pixel-review.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D025', status: 'pass',
  manifest: manifestBinding, display: manifest.result, reports, tiles,
  emptySourceDefinedSurfaces: manifest.emptySourceDefinedSurfaces,
  exactPixelReuse: manifest.exactPixelReuse,
  imageAccounting: { uniqueTiles: 18, independentAgentOpens: 18, repeatOpens: 0,
    mainAgentImageOpens: 0, newBrowserRuns: 0 },
  limits: 'Combines three completed independent saved-pixel reports. No images reopened, no screenshots recropped, no native/SCI/figure/display gate replay.',
}, null, 2)}\n`);
console.log(JSON.stringify({ output: await bind(output), reports: reports.length, tiles: tiles.length }));
