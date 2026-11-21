import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const H = `${T}/evidence/reports/d595-source205-and-next-physics/d577-n75-fig164165-first-modern-author/fig-164`;
const O = `${T}/evidence/reports/d1816-d527-fig164-label-repair`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const write = (file, value) => fs.writeFileSync(`${O}/${file}`, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(O));
const spec = read(`${H}/repair/spec.json`), original = structuredClone(spec);
const failure = read(`${H}/repair/native.render.json`);
assert.equal(bind(`${H}/repair/spec.json`).sha256, '407d1a8b2294ac4eb3197594d651a9cb56faddfe55e089be60ce06acbd5a9b86');
assert.equal(bind(spec.source.image.path).sha256, spec.source.image.sha256);
assert.equal(failure.status, 'fail');
assert.deepEqual(failure.collisions.map(row => row.id), ['m164-axis-label-label']);
const label = spec.objects.find(object => object.id === 'm164-axis-label');
assert.deepEqual(label.at, [2.95, -1.65]);
label.at = [2.95, -2.35];
const guard = structuredClone(spec);
guard.objects.find(object => object.id === label.id).at = original.objects.find(object => object.id === label.id).at;
assert.deepEqual(guard, original);
fs.mkdirSync(`${O}/candidate`, { recursive: true });
fs.mkdirSync(`${O}/before`, { recursive: true });
for (const [from, to] of [['spec.json', 'spec.json'], ['native.render.json', 'render.json'],
  ['fig-164.svg', 'figure.svg'], ['native.full.png', 'native.png']])
  fs.copyFileSync(`${H}/repair/${from}`, `${O}/before/${to}`, fs.constants.COPYFILE_EXCL);
write('repair.json', {
  stage: 'D527', figure: '10p fig-164', status: 'LOCAL_AXIS_LABEL_REPAIR_NOT_APPROVAL',
  source: bind(spec.source.image.path), previousFailedSpec: bind(`${H}/repair/spec.json`),
  previousFailedRender: bind(`${H}/repair/native.render.json`), previousFindings: bind(`${H}/report.json`),
  originalHistoricalRepairCount: 1, additionalLocalRepairCount: 1,
  soleContentChange: { object: label.id, property: 'at', before: [2.95, -1.65], after: label.at },
  deepGuardAllOtherFieldsUnchanged: true, sourceInventoryAndGeometryUnchanged: true,
  sourceOpenedCurrentContinuation: true,
  freshPixelObservation: 'One biconvex section on an axis: O1 at left, A at left vertex, O inside, B at right vertex, O2 at right. Directed radius segments R1 and R2 run from opposite centers to the other curved surfaces. Lens joins at top and bottom and contains diagonal interior marks. No numeric measurements.',
  modernAdditions: ['English Principal axis caption', 'Edition-defined l = |AB| bracket', 'Regularized circular geometry and neutral material fill'],
  currentRepairSourceOpens: 1, currentContinuationPriorOpens: 5,
  manualSVGEdits: 0, oldFailAndOtherN75HoldsPreserved: true,
  independentReview: 'PENDING', approvalInherited: false, promoted: false,
  paidCalls: 0, coursesAdded: 0, pagesAdded: 0,
});
write('candidate/spec.json', spec);
fs.copyFileSync(import.meta.filename, `${O}/repair-fig164-label.mjs`, fs.constants.COPYFILE_EXCL);
const args = ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', `${O}/candidate/spec.json`, '--svg', `${O}/candidate/figure.svg`,
  '--png', `${O}/candidate/native.png`, '--report', `${O}/candidate/render.json`];
const startedAt = new Date().toISOString();
const result = spawnSync('node', args, { cwd: repo, encoding: 'utf8', timeout: 120000,
  maxBuffer: 12 * 1024 * 1024, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
write('render-receipt.json', { command: ['node', ...args], startedAt,
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
  write('affected-check.json', { figure: spec.id, native: 'PASS',
    removedCollision: failure.collisions, currentCollisions: [],
    objects: current.objects, labels: current.labels, displayChecks: current.displayChecks,
    spec: bind(`${O}/candidate/spec.json`), svg: bind(`${O}/candidate/figure.svg`),
    render: bind(`${O}/candidate/render.json`), independentReview: 'PENDING',
    oldApprovalInherited: false, promoted: false });
  console.log(JSON.stringify({ stage: 'D527', figure: spec.id, native: 'PASS',
    collisions: 0, objects: current.objects, labels: current.labels, independentReview: 'PENDING' }));
}
