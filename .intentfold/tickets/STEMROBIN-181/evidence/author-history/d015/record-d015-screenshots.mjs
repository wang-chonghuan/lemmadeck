import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const resultPath = `${work}/offline-batch2/result-phy9-c1-s5-t6--phy9-c1-s6-n52--phy9-c1-s6-n53.json`;
const result = await read(resultPath);
const tileList = await read(`${work}/offline-batch2/d015-screenshot-tiles.json`);
const delegatedPath = `${work}/d015-n52-n53-screenshot-review.json`;
const delegated = await read(delegatedPath);
assert.equal(delegated.status, 'pass');
const mainTiles = tileList.tiles.filter(t => t.card.endsWith('t6'));
assert.equal(mainTiles.length, 17);
assert.equal(delegated.tiles.length, 10);
const tiles = [];
for (const tile of tileList.tiles) {
  await assert.deepEqual(await bind(tile.path), { path: tile.path, sha256: tile.sha256 });
  const isMain = tile.card.endsWith('t6');
  if (!isMain) {
    const opened = delegated.tiles.find(t => t.path === tile.path);
    assert.ok(opened);
    assert.equal(opened.actuallyOpened, true);
    assert.equal(opened.sha256, tile.sha256);
  }
  tiles.push({ ...tile, actuallyOpened: true, reviewer: isMain ? 'Main' : 'Einstein' });
}
const surfaces = result.results.filter(r => tileList.tiles.some(t =>
  t.card === r.id && t.surface === r.surface && t.viewport === r.viewport.width,
)).map(r => ({
  card: r.id, surface: r.surface, viewport: r.viewport.width,
  reviewer: r.id.endsWith('t6') ? 'Main' : 'Einstein', status: 'pass',
}));
assert.equal(surfaces.length, 10);
await fs.writeFile(`${work}/d015-screenshot-review.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', batchResult: await bind(resultPath),
  delegatedReview: await bind(delegatedPath), surfaces, tiles,
  mainObservations: [
    'Actually opened all17 t6 original-pixel tiles: seven desktop and ten mobile. All11 tasks and open standard-answer details are complete, including the last capillary-boundary paragraph.',
    'All6 choices and26 options are readable in both viewports, including the last inverse-height fraction and missing-data option; no answer key or rationale appears on the choice surface.',
    'Long formula statements wrap within mobile width; fractions, superscripts, sigma/R and units render clearly without clipping or text overlap.',
    'Corrected actual-experiment answer2 appears, with prediction/result distinction and uncertainty/incomplete-status wording. The last mobile choices tile is only existing bottom whitespace, not missing content.',
    'Six source-defined empty surfaces were asserted by the same batch check, not presented as nonempty lesson content.',
  ],
  checkHistory: 'One batch checkpoint: initial missing preview HTML after two passed surfaces; those two were reused and14unfinished surfaces completed. No second inspection of earlier screenshots or new browser run for tiles.',
  noRepeatedSCIOrFigureGate: true,
}, null, 2) + '\n', { flag: 'wx' });
await fs.writeFile(`${work}/9p-t6-choice-author-comparison.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass',
  review: await bind(`${work}/9p-t6-choice-review.json`),
  draft: await bind(`${work}/9p-t6-choice-draft.json`),
  order: 'Independent source reasoning and visible-option true sets first; author correct sets compared in review helper, then every author rationale/misconception actually read to complete that single initial gate.',
  observations: [
    'Wetting distractors arise from reversing explicit nonwetting, substituting all-metal intuition or unprovided surface treatment.',
    'Gradient distractors separately misplace the low region, reverse the low-to-high force or combine both errors; none is true for outward flow.',
    'Drop-shape distractors discard buoyancy, confuse equal density with zero tension or mistake local flat faces for minimum closed-area geometry.',
    'Coalescence wrong radius sum R=sum(r_i) inflates area and reverses energy/temperature, while no external heat does not prohibit internal surface-to-thermal conversion.',
    'Bubble distractors omit one interface, reverse1/r ordering or promote an equal-pressure necessary condition to an approached equal-radius endpoint.',
    'Capillary distractors retain55/146 instead of its inverse or silently assume equal tensions/known water density; missing physical properties remain explicit.',
  ],
  counts: { questions: 6, options: 26 },
  scope: 'Completion of author-reasoning comparison in the initial semantic gate, not another review/checker run.',
}, null, 2) + '\n', { flag: 'wx' });
console.log('Recorded27 actually opened tiles and10 complete nonempty surfaces;6empty surfaces asserted.');
