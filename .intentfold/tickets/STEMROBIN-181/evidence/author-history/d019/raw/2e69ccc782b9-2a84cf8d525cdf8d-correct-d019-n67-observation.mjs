import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ticket, book, read, bind, bytes, verify, exists, immutableWrite } from './retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/9p-n67-observation-correction-1`;
assert.ok(!await exists(folder));
const gatePath = `${ticket}/tmp/9p-n67-figure-review.json`;
const tracePath = `${ticket}/tmp/d019-n67-native-finalization.json`;
const figureFolder = `${book}/editions/modern-us-neutral/figures`;
const targets = [gatePath, tracePath, ...['fig-113', 'fig-114']
  .map(id => `${figureFolder}/${id}.independent-review.json`)];
const before = [];
await fs.mkdir(folder);
for (const file of targets) {
  const original = await bind(file);
  const snapshotPath = `${folder}/${path.basename(file)}`;
  await fs.copyFile(file, snapshotPath, fs.constants.COPYFILE_EXCL);
  before.push({ ...await bind(snapshotPath), original });
}
const gate = await read(gatePath);
const affected = gate.figures.find(figure => figure.id === 'fig-113');
assert.ok(affected.independentSourceAndPixelObservations.some(text => text.includes('eight')));
const unchanged = await Promise.all(['fig-113', 'fig-114'].flatMap(id =>
  ['spec.json', 'svg', 'render.json', 'review.json'].map(name => bind(`${figureFolder}/${id}.${name}`))));
const correctionPath = `${folder}/affected-observation-correction.json`;
await immutableWrite(correctionPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D019', status: 'pass-affected-observation-correction',
  cause: 'Initial Main gate narrative mistakenly described eight radial arrows; source inventory/spec/native output actually encode one radial vector per panel.',
  before, unchangedProductBindings: unchanged,
  source: affected.bindings.source,
  evidence: await bind(`${ticket}/tmp/offline-d019/phy9-c2-s2-n67-text-1440-start-tile-2.png`),
  sourcePixelOpen: {
    actuallyOpened: true, detail: 'original', affectedReopenCount: 1,
    observation: 'Original113 confirms two panels, each with one lower source charge and one higher observation point joined by a solid radial line. Left q>0 E arrow points away/up-right; right q<0 E arrow points toward/down-left. No eight-arrow arrangement is printed.',
  },
  changedOnly: ['fig113 independent observation wording', 'Dependent figure-gate path hashes'],
  unaffectedFig114SubstantiveGateRepeated: false,
  newGeometryRepairRenderFinalizeOrBrowserRun: false,
}, null, 2)}\n`);
affected.independentSourceAndPixelObservations = [
  'Initial Main pixel inspection is retained, but its eight-arrow narrative was incorrect. The affected-only correction reopens original113 once after this batch display exposed the record discrepancy; it does not rerun native rendering or inspect unrelated original figures.',
  'Two panels, two filled points and one solid radial line per panel. Left q>0 field vector points up-right away from the lower source charge; right q<0 field vector points down-left toward the lower source charge. One field vector per panel, not eight.',
  'Source panel order is retained as modern(a)/(b), and both E overhead vector marks are visible. No calibrated distance, added probe label, trajectory or answer marking. Existing640/331/342 pixel observations and native display evidence are unchanged; the current offline desktop tile confirms the same geometry.',
];
affected.affectedObservationCorrection = await bind(correctionPath);
gate.affectedObservationCorrection = await bind(correctionPath);
await fs.writeFile(gatePath, `${JSON.stringify(gate, null, 2)}\n`);
const currentGate = await bind(gatePath);
for (const id of ['fig-113', 'fig-114']) {
  const file = `${figureFolder}/${id}.independent-review.json`;
  const independent = await read(file);
  if (id === 'fig-113') {
    independent.independentSourceAndPixelObservations = affected.independentSourceAndPixelObservations;
    independent.affectedObservationCorrection = await bind(correctionPath);
  }
  independent.originalReport.sha256 = currentGate.sha256;
  await fs.writeFile(file, `${JSON.stringify(independent, null, 2)}\n`);
}
const trace = await read(tracePath);
trace.figureGate = currentGate;
trace.affectedObservationCorrection = await bind(correctionPath);
await fs.writeFile(tracePath, `${JSON.stringify(trace, null, 2)}\n`);
for (const binding of unchanged) await verify(binding.path, binding.sha256);
for (const binding of before) await verify(binding.path, binding.sha256);
console.log('Corrected113 observation and dependent gate hashes; originals archived, both figure outputs/native reviews and all lesson outputs unchanged.');
