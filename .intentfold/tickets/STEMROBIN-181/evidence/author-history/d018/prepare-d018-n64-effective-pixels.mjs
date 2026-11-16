import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { bind, read, verify, ticket } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const folder = `${work}/offline-d018-font-final`;
const rawPath = `${folder}/d018-n64-final-screenshot-tiles.json`;
const initialPath = `${work}/offline-d018/d018-n64-screenshot-tiles.json`;
const failedPath = `${work}/d018-n64-screenshot-review.json`;
const raw = await read(rawPath);
const initial = await read(initialPath);
const failed = await read(failedPath);
assert.equal(failed.status, 'fail');
const key = tile => JSON.stringify([tile.card, tile.surface, tile.viewport, tile.scrollPosition, tile.crop]);
const tiles = [];
const newTilesToReview = [];
const reusedOriginalOpened = [];
const exactPixelReuse = [];
for (const tile of raw.tiles) {
  const old = initial.tiles.find(item => key(item) === key(tile));
  assert.ok(old);
  await verify(tile.path, tile.sha256);
  if (old.sha256 === tile.sha256) {
    const observation = failed.tiles.find(item => key(item) === key(old) && item.sha256 === old.sha256);
    assert.equal(observation.status, 'pass');
    assert.equal(observation.actuallyOpened, true);
    tiles.push(old);
    reusedOriginalOpened.push(observation);
    exactPixelReuse.push({ initial: old, currentSamePixels: tile });
  } else {
    tiles.push(tile);
    newTilesToReview.push(tile);
  }
}
assert.equal(tiles.length, 16);
assert.equal(reusedOriginalOpened.length, 6);
assert.equal(newTilesToReview.length, 10);
const output = `${folder}/d018-n64-effective-screenshot-tiles.json`;
await fs.writeFile(output, `${JSON.stringify({
  role: 'Only F1-affected pixels require a new inspection; six unchanged original tiles reuse their original PASS observations byte-exact.',
  result: raw.result, initialFailure: await bind(failedPath),
  initialManifest: await bind(initialPath), correctedManifest: await bind(rawPath),
  tiles, emptySourceDefinedSurfaces: raw.emptySourceDefinedSurfaces,
  newTilesToReview, reusedOriginalOpened, exactPixelReuse,
}, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ output, newTiles: 10, reusedTiles: 6 }));
