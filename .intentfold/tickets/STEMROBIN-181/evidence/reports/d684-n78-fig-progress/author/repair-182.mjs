import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d662-n78-fig182183-author');
assert.equal(process.cwd(), repo);
assert.deepEqual(process.argv.slice(2), ['--execute']);
const first = path.join(owned, 'fig-182'), repaired = path.join(first, 'repair1');
assert.equal(fs.existsSync(repaired), false, 'repair already used');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => ({ path: file, sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  bytes: fs.statSync(file).size });
const original = read(path.join(first, 'spec.json'));
const nativeFailure = read(path.join(first, 'render.json'));
assert.equal(nativeFailure.status, 'fail');
assert.equal(nativeFailure.collisions.length, 1);
assert.equal(nativeFailure.collisions[0].id, 's182-d-panel-name-label');
assert.ok(nativeFailure.displayChecks.every(check => check.status === 'pass'));
const spec = structuredClone(original);
const label = spec.objects.find(object => object.id === 's182-d-panel-name');
assert.deepEqual(label.at, [348, 782]);
label.at = [348, 768];
const guard = structuredClone(spec);
guard.objects.find(object => object.id === label.id).at = [348, 782];
assert.deepEqual(guard, original);
fs.mkdirSync(repaired);
const write = (name, value) => {
  const target = path.join(repaired, name);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return target;
};
write('repair.json', {
  figure: 'fig-182', repairNumber: 1, remainingRepairs: 0,
  firstGenuineFAIL: bind(path.join(first, 'render.json')),
  firstNativeReceipt: bind(path.join(first, 'render.receipt.json')),
  firstSpec: bind(path.join(first, 'spec.json')), firstSVG: bind(path.join(first, 'figure.svg')),
  firstPNG: bind(path.join(first, 'native.png')),
  defect: 'Native padded d-label rectangle overlaps Small opening title. Actual initial native PNG was opened.',
  soleChange: { object: label.id, property: 'at', before: [348, 782], after: label.at },
  deepGuardAllOtherSpecFields: 'EXACTLY-UNCHANGED', sourceInventoryUnchanged: true,
  opticalGeometryUnchanged: true, SVGHandEdits: 0, authorModelCheckReusedForUnchangedGeometry: true,
});
const specPath = write('spec.json', spec);
const run = (name, executable, argv) => {
  const startedAt = new Date().toISOString();
  const result = spawnSync(executable, argv, { cwd: repo, encoding: 'utf8', timeout: 120000,
    maxBuffer: 12 * 1024 * 1024, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  const receipt = write(`${name}.receipt.json`, { cwd: repo, executable, argv, startedAt,
    finishedAt: new Date().toISOString(), exitCode: result.status, signal: result.signal,
    error: result.error?.message || null, stdout: result.stdout || '', stderr: result.stderr || '' });
  return { result, receipt };
};
const scripts = path.join(repo, '.agents/skills/ld-s10y-image/scripts');
const validation = run('validation', 'python3', [path.join(scripts, 'validate_spec.py'), specPath, '--stage', 'rendered', '--json']);
let render = null;
if (validation.result.status === 0) {
  render = run('render', 'node', [path.join(scripts, 'render_spec.mjs'), '--spec', specPath,
    '--svg', path.join(repaired, 'figure.svg'), '--png', path.join(repaired, 'native.png'),
    '--report', path.join(repaired, 'render.json')]);
}
const renderPath = path.join(repaired, 'render.json');
const outcome = {
  status: validation.result.status === 0 && render?.result.status === 0
    ? 'NATIVE-PASS-AFTER-SOLE-LABEL-REPAIR-NOT-APPROVAL' : 'STOP-REPAIR1-FAIL-NO-MORE-RETRIES',
  validation: bind(validation.receipt), renderReceipt: render ? bind(render.receipt) : null,
  nativeReport: fs.existsSync(renderPath) ? bind(renderPath) : null,
  repairsUsed: 1, remainingRepairs: 0, independentFIG: 'PENDING', independentVisual: 'PENDING',
};
write('attempt.json', outcome);
console.log(JSON.stringify(outcome));
