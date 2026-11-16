import assert from 'node:assert/strict';
import { bind, read, verify, immutableWrite, ticket } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const folder = `${work}/offline-d018-font-final`;
const manifestPath = `${folder}/d018-n64-effective-screenshot-tiles.json`;
const manifest = await read(manifestPath);
const notes = {
  '1440:2': 'Complete fig108 shows vector arrows above both F labels and G, legible elastic suffix, alpha angles, length and r/2. No missing-glyph boxes or label collisions. Surrounding worked-example prose is intact.',
  '1440:3': 'All six fig109 F vectors and two-digit subscripts render clearly. Charge signs, arrows and separation remain intact; complete adjacent force formulas and numbers fit the page.',
  '390:2': 'The mobile tension vector F has an arrow above its letter without a missing-glyph box. Worked-example conditions, exponents, formulas and Chinese prose wrap without clipping or overlap.',
  '390:3': 'Mobile repulsion F and weight G have complete vector arrows. r/2 and force arrows are intact. Tension result and following three-charge conditions and formulas remain readable.',
  '390:4': 'All six mobile fig109 vector labels and subscripts are visible and separate from force arrows. Final F1/F2/F3 expressions, units, directions, closing paragraph and zero-task button fit.',
};
assert.equal(manifest.newTilesToReview.length, 10);
assert.equal(manifest.reusedOriginalOpened.length, 6);
const observations = [];
for (const tile of manifest.newTilesToReview) {
  await verify(tile.path, tile.sha256);
  const number = /-tile-(\d+)\.png$/.exec(tile.path)?.[1];
  const observation = notes[`${tile.viewport}:${number}`];
  assert.ok(observation);
  observations.push({
    ...tile, actuallyOpened: true, reviewer: 'session-D', detail: 'original',
    status: 'pass', observations: observation,
  });
}
const result = await read(manifest.result.path);
assert.equal(result.status, 'pass');
await verify(manifest.result.path, manifest.result.sha256);
const output = `${work}/d018-n64-font-final-screenshot-review.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D018', status: 'pass',
  scope: 'F1-affected final-font page pixels only; ten changed tiles opened at original resolution.',
  bindings: {
    result: manifest.result, tiles: await bind(manifestPath),
    initialFailure: manifest.initialFailure,
    toolCorrection: await bind(`${work}/d018-vector-font-final-tool-binding.json`),
  },
  tiles: [...manifest.reusedOriginalOpened, ...observations],
  emptySourceDefinedSurfaces: manifest.emptySourceDefinedSurfaces,
  findings: [{
    id: 'F1', status: 'resolved',
    basis: 'Actual final desktop/mobile start/end screenshots show the intended vector arrows above F and G. Original failure retained unchanged.',
  }],
  changedTilesOpened: 10, unchangedTilesReused: 6,
  newBrowserOrScienceOrFigureGateRunByThisRecorder: false,
  in_flight_processes: [],
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
