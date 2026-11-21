import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const H = `${T}/evidence/reports/d684-n78-fig-progress/author`;
const O = `${T}/evidence/reports/d1816-d524-fig182-label-repair`;
const source = `${T}/evidence/reports/d646-active-stages/d638-n78-first-closed-source-text-author/root/10p/figures/fig-182.png`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const write = (name, value) => fs.writeFileSync(`${O}/${name}`,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(O));
const originalPath = `${H}/fig-182/repair1/spec.json`;
const original = read(originalPath);
assert.equal(bind(originalPath).sha256, 'd5b72e71233da5529eda112cd7a1f5dc676d35a6dff2c37be2f0bed7ab5c783b');
assert.equal(bind(source).sha256, original.source.image.sha256);
const failurePath = `${H}/fig-182/repair1/render.json`;
const failure = read(failurePath);
assert.equal(failure.status, 'fail');
assert.deepEqual(failure.collisions.map(row => row.id), ['s182-d-panel-name-label']);
fs.mkdirSync(`${O}/candidate`, { recursive: true });
fs.mkdirSync(`${O}/before`, { recursive: true });
for (const file of ['spec.json', 'render.json', 'figure.svg', 'native.png', 'repair.json', 'attempt.json'])
  fs.copyFileSync(`${H}/fig-182/repair1/${file}`, `${O}/before/${file}`, fs.constants.COPYFILE_EXCL);

const spec = structuredClone(original);
const label = spec.objects.find(object => object.id === 's182-d-panel-name');
assert.deepEqual(label.at, [348, 768]);
label.at = [332, 782];
spec.source.image.path = source;
const guard = structuredClone(spec);
guard.objects.find(object => object.id === label.id).at = [348, 768];
guard.source.image.path = original.source.image.path;
assert.deepEqual(guard, original);
write('source-observation.json', {
  figure: 'fig-182', observer: 'Current local repair author; actual source PNG opened once in this continuation.',
  source: bind(source), sourceImageOpenCount: 1,
  sourceFacts: [
    'Two columns, three rows; original Cyrillic panel letters transliterate to a,b,c left and d,e,f right.',
    'Each row has a left source point, convex lens with interior diagonal strokes, directed rays and an upright film at right.',
    'A row: bounding wide rays meet at film; B row: nearer source with rays separated at film; C row: farther source with rays crossing before film.',
    'Right-column rows retain corresponding source distances; outer rays meet aperture bars immediately right of lens, while inner rays pass a smaller gap.',
    'Right A rays meet at film; right B and C retain smaller nonzero film separation than their wide-opening counterparts.',
    'A/A-prime, B/B-prime and C/C-prime labels occur in both columns. No numeric distances, scale or axes.',
  ],
  modernAdditions: ['English panel names and opening headings', 'Paraxial-model footer', 'Regularized thin-lens ray coordinates'],
  preservedSemanticHold: 'Source places stop bars right of lens; current prose says before the objective. This label repair does not resolve that disagreement.',
  mappedInventoryUnchanged: true, existingSpecInventory: original.source.inventory,
  authorIsIndependentReviewer: false, sourceFidelityApproval: false,
});
write('repair.json', {
  stage: 'D524', figure: '10p fig-182',
  status: 'LOCAL_LABEL_REPAIR_NOT_APPROVAL',
  previousFailedSpec: bind(originalPath), previousFailedRender: bind(failurePath),
  retainedFailureCopies: ['spec.json', 'render.json', 'figure.svg', 'native.png', 'repair.json', 'attempt.json'].map(file => bind(`${O}/before/${file}`)),
  originalHistoricalRepairCount: 1, additionalLocalRepairCount: 1,
  soleContentChange: { object: label.id, property: 'at', before: [348, 768], after: label.at },
  sourcePointerOnly: { before: original.source.image.path, after: source, sha256Unchanged: true },
  rationale: 'Place d at its matching first-row panel height with enough horizontal clearance from Small opening. No labels or optical objects removed.',
  deepGuardAllOtherFieldsUnchanged: true, opticalGeometryUnchanged: true,
  originalApprovalsAndHoldsUnchanged: true, manualSVGEdits: 0,
  independentReview: 'PENDING', sourceTextApertureSide: 'HOLD',
  fig181: 'MISSING_PAID_OUTPUT_HOLD_NO_REPURCHASE',
  fig183: 'EXISTING_PASS_REUSED_UNTOUCHED',
  promoted: false, completeCourseAdded: false, paidCalls: 0,
});
write('candidate/spec.json', spec);
fs.copyFileSync(import.meta.filename, `${O}/repair-fig182-label.mjs`, fs.constants.COPYFILE_EXCL);
const command = ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', `${O}/candidate/spec.json`, '--svg', `${O}/candidate/figure.svg`,
  '--png', `${O}/candidate/native.png`, '--report', `${O}/candidate/render.json`];
const startedAt = new Date().toISOString();
const result = spawnSync('node', command, { cwd: repo, encoding: 'utf8',
  timeout: 120000, maxBuffer: 12 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
write('render-receipt.json', { command: ['node', ...command], startedAt,
  finishedAt: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message || null,
  stdout: result.stdout || '', stderr: result.stderr || '' });
if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exitCode = result.status ?? 1;
} else {
  const current = read(`${O}/candidate/render.json`);
  assert.equal(current.status, 'pass');
  assert.equal(current.collisions.length, 0);
  assert.equal(current.objects, failure.objects);
  assert.equal(current.labels, failure.labels);
  assert.deepEqual(current.displayChecks, failure.displayChecks);
  write('affected-check.json', {
    figure: 'fig-182', native: 'PASS', removedCollision: failure.collisions,
    currentCollisions: current.collisions, displayChecks: current.displayChecks,
    actualContentChanges: 1, preservedObjects: current.objects, preservedLabels: current.labels,
    spec: bind(`${O}/candidate/spec.json`), svg: bind(`${O}/candidate/figure.svg`),
    render: bind(`${O}/candidate/render.json`), nativePreview: bind(`${O}/candidate/native.png`),
    authorVisual: 'PENDING', independentReview: 'PENDING',
    apertureSideSemanticHold: true, approvalInherited: false,
    contentOrCourseDisplayReplayed: false, fullCoursePromoted: false,
  });
  console.log(JSON.stringify({ stage: 'D524', native: 'PASS', collisions: 0,
    objects: current.objects, labels: current.labels, approval: 'PENDING' }));
}
