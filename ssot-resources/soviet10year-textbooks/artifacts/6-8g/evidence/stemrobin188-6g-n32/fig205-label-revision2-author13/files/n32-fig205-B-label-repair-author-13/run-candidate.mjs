import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const priorRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig204206-author-first-10/fig-205');
const revision = Number(process.argv[2]);
assert.ok(revision === 2 || revision === 3, 'Only cumulative revisions 2 and 3 are authorized.');
const specPath = path.join(root, `spec.r${revision}.json`);
const digest = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = (file) => ({ path: file, sha256: digest(file), bytes: fs.statSync(file).size });
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const priorPath = path.join(priorRoot, 'spec.r1.json');
assert.equal(digest(priorPath), '02ca84a88c11e5bf468177457f91f72735f540754218fad5da9f24d5d3ecac6e');
const prior = JSON.parse(fs.readFileSync(priorPath, 'utf8'));
const candidate = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const oldB = prior.objects.find((object) => object.id === 's205-B');
const newB = candidate.objects.find((object) => object.id === 's205-B');
assert.ok(oldB && newB);
assert.notDeepEqual(newB.labelPlacement, oldB.labelPlacement);
const changes = [];
function diff(before, after, pointer = '') {
  if (JSON.stringify(before) === JSON.stringify(after)) return;
  if (before !== null && after !== null && typeof before === 'object' && typeof after === 'object') {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      diff(before[key], after[key], `${pointer}/${key}`);
    }
  } else {
    changes.push({ pointer, before, after });
  }
}
diff(prior, candidate);
const objectIndex = prior.objects.findIndex((object) => object.id === 's205-B');
assert.ok(changes.length > 0);
assert.ok(changes.every((change) => change.pointer.startsWith(`/objects/${objectIndex}/labelPlacement/`)));
const restored = structuredClone(candidate);
restored.objects[objectIndex].labelPlacement = structuredClone(oldB.labelPlacement);
assert.deepEqual(restored, prior, 'All fields outside B labelPlacement must be identical.');
save(path.join(root, `diff.r${revision}.json`), {
  role: 'AUTHOR_ONLY_NOT_REVIEW',
  cumulativeContentRevision: revision,
  baseline: binding(priorPath),
  candidate: binding(specPath),
  owner: 's205-B',
  anchorUnchanged: oldB.at,
  before: oldB.labelPlacement,
  after: newB.labelPlacement,
  changes,
  onlyBLabelPlacementChanged: true,
  sourceInventoryGeometryAssertionsTextStylingCanvasDisplayAndOtherLabelsUnchanged: true,
  titleOrMetadataChanged: false,
});

const toolDir = path.join(repo, '.agents/skills/ld-s10y-image/scripts');
function execute(stage, argv, outputPaths) {
  const receiptPath = path.join(root, `${stage}.call.json`);
  assert.ok(!fs.existsSync(receiptPath), `Refusing to replay ${stage}.`);
  const startedAt = new Date().toISOString();
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  const finishedAt = new Date().toISOString();
  const stdout = path.join(root, `${stage}.stdout.txt`);
  const stderr = path.join(root, `${stage}.stderr.txt`);
  fs.writeFileSync(stdout, result.stdout || '');
  fs.writeFileSync(stderr, result.stderr || '');
  const record = {
    schema: 'native-figure-call@1',
    stage,
    figure: 'fig-205',
    argv,
    cwd: repo,
    startedAt,
    finishedAt,
    exitCode: result.status,
    signal: result.signal,
    error: result.error?.message || null,
    status: result.status === 0 && !result.error && !result.signal ? 'completed' : 'failed',
    inputs: [binding(path.join(root, 'FIRST.json')), binding(specPath)],
    tools: [binding(argv[1])],
    streams: { stdout: binding(stdout), stderr: binding(stderr) },
    outputs: outputPaths.filter((file) => fs.existsSync(file)).map(binding),
    contentRevision: revision,
    previousContentRevisions: 1,
    newContentRevisionsThisAssignment: revision - 1,
    maximumNewContentRevisionsThisAssignment: 2,
    technicalRecoveries: 0,
    independentReview: false,
  };
  save(receiptPath, record);
  if (result.status !== 0) save(path.join(root, `failure.${stage}.json`), { call: binding(receiptPath), evidence: record });
  console.log(JSON.stringify({ stage, exitCode: result.status, receipt: binding(receiptPath), stdout: result.stdout, stderr: result.stderr }));
  return result.status === 0;
}

const validationPassed = execute(`validate.r${revision}`, [
  'python3', path.join(toolDir, 'validate_spec.py'), specPath, '--stage', 'draft', '--json',
], []);
if (!validationPassed) {
  process.exitCode = 2;
} else {
  const svg = path.join(root, `fig-205.r${revision}.svg`);
  const report = path.join(root, `fig-205.r${revision}.render.json`);
  const png = path.join(root, `fig-205.r${revision}.native.png`);
  const renderPassed = execute(`render.r${revision}`, [
    'node', path.join(toolDir, 'render_spec.mjs'),
    '--spec', specPath, '--svg', svg, '--report', report, '--png', png,
  ], [svg, report, png]);
  process.exitCode = renderPassed ? 0 : 2;
}
