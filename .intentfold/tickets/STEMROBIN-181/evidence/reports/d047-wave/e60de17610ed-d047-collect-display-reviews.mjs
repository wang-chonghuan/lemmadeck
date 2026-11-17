import assert from 'node:assert/strict';
import {
  ticket, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [execute, resultPath, resultSha, reviewListPath] = process.argv.slice(2);
assert.equal(execute, '--execute');
await verify(resultPath, resultSha);
const display = await read(resultPath);
assert.match(display.status, /^PASS/);
assert.deepEqual(display.failures, []);
assert.equal(display.execution.browserClosed, true);
assert.equal(display.surfaces.length, 40);
const target = `${ticket}/tmp/d047-wave-display-review.json`;
assert.equal(await exists(target), false);
const key = row => `${row.path}:${row.sha256}`;
const planned = new Map(display.tiles.map(row => [key(row), row]));
assert.equal(planned.size, display.tiles.length);
const opened = new Map();
const reviews = await read(reviewListPath);
let imageOpens = 0;
for (const binding of reviews.reports) {
  await verify(binding.path, binding.sha256);
  const review = await read(binding.path);
  assert.equal(review.status, 'PASS');
  assert.ok(review.tiles.length <= 8);
  assert.equal(review.imagesOpened, review.tiles.length);
  imageOpens += review.imagesOpened;
  for (const row of review.tiles) {
    assert.equal(row.actuallyOpened, true);
    assert.equal(row.status, 'PASS');
    assert.deepEqual(row.defects, []);
    assert.ok(planned.has(key(row)), `Unplanned image: ${row.path}`);
    assert.ok(!opened.has(key(row)), `Duplicate review: ${row.path}`);
    await verify(row.path, row.sha256);
    opened.set(key(row), { ...planned.get(key(row)), actuallyOpened: true,
      reviewer: review.reviewer, status: 'PASS', observations: row.observations,
      report: binding });
  }
}
assert.deepEqual([...opened.keys()].sort(), [...planned.keys()].sort());
const covered = new Set([...opened.values()].map(row => row.surface));
assert.deepEqual([...covered].sort(), display.surfaces.map(row => row.id).sort());
const surfaces = display.surfaces.map(row => ({
  id: row.id, card: row.card, language: row.language, kind: row.kind, viewport: row.viewport,
  status: 'PASS', defects: [], inputHTML: row.inputHTML,
  screenshots: row.screenshots,
  tiles: [...opened.values()].filter(tile => tile.surface === row.id),
}));
await immutableWrite(target, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D029', status: 'PASS',
  displayResult: await bind(resultPath), reviewList: await bind(reviewListPath),
  reports: reviews.reports, surfaces, tiles: [...opened.values()],
  allSurfacesCovered: true, allRequiredTilesActuallyOpened: true,
  imagesOpened: imageOpens, parentImageOpens: 0,
  passedStagesReplayed: false,
  affectedDisplayRepairs: display.execution.repairs,
  browserPasses: display.execution.browserPasses,
  limits: 'Combination of disjoint firsthand pixel reviews; no repeated SOURCE/SCI/figure/choice/answer review, app integration or corpus completion.',
}, null, 2)}\n`);
console.log(JSON.stringify({ displayReview: await bind(target), surfaces: surfaces.length, imageOpens }));
