import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const cards = ['phy9-c1-s6-n54', 'phy9-c1-s6-t8', 'phy9-c1-s7-n56', 'phy9-c1-s7-n57'];
const initialResultPath = `${work}/offline-batch2/result-${[...cards].sort().join('--')}.json`;
const result = await read(initialResultPath);
const initialManifestPath = `${work}/offline-batch2/d016-screenshot-tiles.json`;
const manifest = await read(initialManifestPath);
const correctionPath = `${work}/d016-answer-display-finalization.json`;
const correction = await read(correctionPath);
const correctionManifestPath = `${work}/d016-answer-display-tiles.json`;
const correctionManifest = await read(correctionManifestPath);
assert.equal(result.status, 'pass');
assert.equal(result.results.length, 20);
assert.equal(correction.status, 'pass');
assert.equal(correction.results.length, 2);
result.results = result.results.map(surface => surface.id === 'phy9-c1-s6-t8' && surface.surface === 'answers'
  ? correction.results.find(entry => entry.viewport.width === surface.viewport.width) : surface);
manifest.tiles = [...manifest.tiles.filter(tile => tile.surface !== 'answers'), ...correctionManifest.tiles];
const resultPath = `${work}/d016-effective-offline-result.json`;
const manifestPath = `${work}/d016-effective-screenshot-tiles.json`;
await fs.writeFile(resultPath, JSON.stringify({
  ...result, originalBatch: await bind(initialResultPath),
  affectedAnswerDisplayCorrection: await bind(correctionPath),
  history: 'Initial20surface browser PASS followed by manual answer-display FAIL; onlytwo answer surfaces rechecked after display-only correction. Other18 browser results reused unchanged.',
}, null, 2) + '\n', { flag: 'wx' });
await fs.writeFile(manifestPath, JSON.stringify({
  ...manifest, originalManifest: await bind(initialManifestPath),
  answerCorrectionManifest: await bind(correctionManifestPath),
}, null, 2) + '\n', { flag: 'wx' });
const reports = [];
for (const name of ['d016-prose-screenshot-review.json', 'd016-written-screenshot-review.json',
  'd016-answer-display-screenshot-correction.json']) {
  const reportPath = `${work}/${name}`;
  const report = await read(reportPath);
  assert.equal(report.status, name === 'd016-written-screenshot-review.json' ? 'fail' : 'pass');
  assert.equal((await bind(report.batchResult.path)).sha256, report.batchResult.sha256);
  assert.equal(report.batchResult.sha256,
    (await bind(name.includes('screenshot-correction') ? correctionPath : initialResultPath)).sha256);
  reports.push({ path: reportPath, report });
}
const mainTiles = manifest.tiles.filter(tile => tile.surface === 'choices');
assert.equal(mainTiles.length, 7);
const tiles = [];
for (const tile of manifest.tiles) {
  assert.deepEqual(await bind(tile.path), { path: tile.path, sha256: tile.sha256 });
  if (tile.surface === 'choices') {
    tiles.push({ ...tile, actuallyOpened: true, reviewer: 'Main' });
    continue;
  }
  const matches = reports.flatMap(({ report }) => report.tiles)
    .filter(entry => path.resolve(entry.path) === path.resolve(tile.path));
  assert.equal(matches.length, 1, `Missing/duplicate inspected tile:${tile.path}`);
  const opened = matches[0];
  assert.equal(opened.actuallyOpened, true);
  for (const key of ['sha256', 'card', 'surface', 'viewport', 'crop', 'source']) assert.deepEqual(opened[key], tile[key]);
  assert.ok(opened.reviewer);
  tiles.push({ ...tile, actuallyOpened: true, reviewer: opened.reviewer });
}
const surfaces = [];
for (const surface of result.results) {
  const matchingTiles = tiles.filter(tile => tile.card === surface.id &&
    tile.surface === surface.surface && tile.viewport === surface.viewport.width);
  if (!matchingTiles.length) continue;
  let reviewer = 'Main';
  if (surface.surface !== 'choices') {
    const inspected = reports.flatMap(({ report }) => report.surfaces).find(entry =>
      entry.card === surface.id && entry.surface === surface.surface &&
      (entry.viewport.width ?? entry.viewport) === surface.viewport.width && entry.status === 'pass');
    assert.ok(inspected, `Missing full surface observation:${surface.id}/${surface.surface}`);
    assert.equal(inspected.status, 'pass');
    reviewer = inspected.reviewer;
  }
  surfaces.push({ card: surface.id, surface: surface.surface, viewport: surface.viewport.width, status: 'pass', reviewer });
}
assert.equal(surfaces.length, 12);
assert.equal(manifest.emptySourceDefinedSurfaces.length, 8);
await fs.writeFile(`${work}/d016-screenshot-review.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', batchResult: await bind(resultPath),
  initialBatchResult: await bind(initialResultPath),
  effectiveTileManifest: await bind(manifestPath),
  initialWrittenDisplayFailure: await bind(`${work}/d016-written-screenshot-review.json`),
  affectedOnlyCorrection: await bind(correctionPath),
  delegatedReviews: await Promise.all(reports.map(({ path }) => bind(path))),
  surfaces, tiles, emptySourceDefinedSurfaces: manifest.emptySourceDefinedSurfaces,
  mainObservations: [
    'Actually opened allsevenchoices tiles:3desktop and4mobile. All11questions/44options visible, including finalice/steam state alternatives and bottommargin; no key, rationale orsource-mapping prose shown.',
    'Completefig77appears in question4 withthreefaces and no ions/scale. Cube-root/diagonal-distance options fully render; longestmobileoption wraps theformula belowitsDlabel within the same option without clipping or overlap.',
    'Stress/modulus pairs wrap onmobile withclear superscripts andunits. Celsius/Kelvin conversion andlatentheat values remainreadable across alltile boundaries.',
    'Longquestion11suppliedconstants andfourdistinctstatealternatives fitmobilewidth; finalnegative-temperature alternative visible andnotcut off.',
    'Eight source-definedempty surfaces reflectt8no-prose andthreeprosecardsnoexercises; the batchassertions are not represented as missing learnercontent.',
  ],
  checkHistory: 'One20surface isolated headlessdesktop/mobile batchcheck. Manual review foundanswerformula truncation despitepage-overflowfalse. Onlytwo affected answer surfaces rerendered/rechecked aftersix display-only formula splits; other18 browser results andall passed prose/exercise/choice inspections reused. Initialfailedreport retained. Pixeltiles are unscaled original-pixel crops.',
  noRepeatedSCIChoiceAnswerOrFigureGate: true,
}, null, 2) + '\n', { flag: 'wx' });
console.log(`Recorded${tiles.length} actuallyopenedtiles,12nonempty and8source-definedempty surfaces.`);
