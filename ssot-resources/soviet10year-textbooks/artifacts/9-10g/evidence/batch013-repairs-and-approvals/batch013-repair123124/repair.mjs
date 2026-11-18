import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
assert.equal(process.cwd(), cwd);
const root = path.join(cwd, '.tmp/s10y-image/batch013-repair123124');
const previous = path.join(cwd, '.tmp/s10y-image/batch012-n33');
const ids = ['fig-123', 'fig-124'];
const allowed = { 'fig-123': ['M', 'N'], 'fig-124': ['A', 'B', 'a1-name', 'a2-name', 'b1-name', 'b2-name'] };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const ref = file => ({ path: path.resolve(file), sha256: hash(file) });
const write = (file, data) => {
  assert.ok(path.resolve(file).startsWith(`${root}/`));
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
};
const stamp = () => new Date().toISOString();
const action = process.argv[2];

if (action === 'prepare') {
  const startedAt = stamp();
  const report = read(path.join(previous, 'report.json'));
  const templateDir = path.join(cwd, '.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s3-n33');
  const templateFiles = ['lesson.template.json', 'exercises.template.json'].map(file => path.join(templateDir, file));
  const lesson = read(templateFiles[0]);
  const exercises = read(templateFiles[1]);
  const preserved = [ref(path.join(previous, 'report.json')), ...templateFiles.map(ref)];
  for (const id of ids) {
    const old = path.join(previous, id);
    const spec = read(path.join(old, 'spec.repaired.json'));
    const spatial = read(path.join(old, `${id}.spatial.json`));
    const facts = report.figures.find(figure => figure.id === id);
    assert.equal(facts.repairCount, 1);
    assert.equal(spatial.status, 'pass');
    assert.equal(spatial.spec.sha256, hash(path.join(old, 'spec.repaired.json')));
    assert.equal(spatial.source.sha256, hash(path.resolve(cwd, spatial.source.path)));
    assert.equal(spatial.executable.sha256, hash(spatial.executable.path));
    for (const entry of spec.source.authoritativeText) {
      assert.ok(lesson.prose.some(prose => prose.text === entry.text));
    }
    assert.equal(exercises.exercises.flatMap(exercise => exercise.figure_refs || []).includes(id), false);
    for (const file of ['spec.repaired.json', `${id}.render.json`, `${id}.svg`, `${id}.preview.png`, `${id}.review.json`, `${id}.spatial.json`, `${id}.geometry.mjs`]) {
      preserved.push(ref(path.join(old, file)));
    }
    preserved.push(ref(path.resolve(cwd, spec.source.image.path)));
    fs.mkdirSync(path.join(root, id));
    fs.copyFileSync(path.join(old, 'spec.repaired.json'), path.join(root, id, 'spec.repaired.json'), fs.constants.COPYFILE_EXCL);
  }
  write(path.join(root, 'inputs.json'), { schema: 'ld-s10y-image/repair-inputs@1', cwd, previousReport: ref(path.join(previous, 'report.json')), preserved });
  write(path.join(root, 'prepare.call.json'), {
    schema: 'ld-s10y-image/repair-call@1', stage: 'prepare', cwd,
    command: [process.execPath, ...process.argv.slice(1)], startedAt, endedAt: stamp(), exitCode: 0,
    paidModelCalls: 0, spatialProofReruns: 0,
  });
  console.log('Prepared only two changed-spec candidates; previous bytes hash-bound.');
} else if (action === 'diff') {
  const startedAt = stamp();
  const figures = ids.map(id => {
    const oldFile = path.join(previous, id, 'spec.repaired.json');
    const newFile = path.join(root, id, 'spec.repaired.json');
    const before = read(oldFile);
    const after = read(newFile);
    const masked = structuredClone(after);
    const changes = [];
    assert.equal(after.objects.length, before.objects.length);
    before.objects.forEach((oldObject, index) => {
      const newObject = after.objects[index];
      assert.equal(oldObject.id, newObject.id);
      const unchanged = structuredClone(newObject);
      if (Object.hasOwn(oldObject, 'labelPlacement')) unchanged.labelPlacement = oldObject.labelPlacement;
      else delete unchanged.labelPlacement;
      assert.deepEqual(unchanged, oldObject);
      if (JSON.stringify(newObject.labelPlacement) !== JSON.stringify(oldObject.labelPlacement)) {
        assert.ok(allowed[id].includes(oldObject.id));
        changes.push({ object: oldObject.id, label: `${oldObject.id}-label`, field: 'labelPlacement', before: oldObject.labelPlacement, after: newObject.labelPlacement });
        masked.objects[index].labelPlacement = oldObject.labelPlacement;
      }
    });
    assert.deepEqual(masked, before);
    assert.deepEqual(changes.map(change => change.object).sort(), [...allowed[id]].sort());
    return { id, before: ref(oldFile), after: ref(newFile), changes, onlyOffendingPlacementsChanged: true, sourceGeometryAssertionsDisplayFontsAndLabelTextsUnchanged: true };
  });
  write(path.join(root, 'diff.json'), { schema: 'ld-s10y-image/affected-label-diff@1', cwd, figures });
  write(path.join(root, 'diff.call.json'), { schema: 'ld-s10y-image/repair-call@1', stage: 'affected-label-diff', cwd, command: [process.execPath, ...process.argv.slice(1)], startedAt, endedAt: stamp(), exitCode: 0, paidModelCalls: 0, spatialProofReruns: 0 });
  console.log(JSON.stringify(figures.map(figure => ({ id: figure.id, changes: figure.changes })), null, 2));
} else if (action === 'render') {
  const id = process.argv[3];
  assert.ok(ids.includes(id));
  const dir = path.join(root, id);
  const diff = read(path.join(root, 'diff.json')).figures.find(figure => figure.id === id);
  assert.equal(diff.after.sha256, hash(path.join(dir, 'spec.repaired.json')));
  const serial = fs.readdirSync(dir).filter(file => /^render-\d+\.call\.json$/.test(file)).length + 1;
  const command = [process.execPath, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', path.join(dir, 'spec.repaired.json'), '--svg', path.join(dir, `${id}.svg`),
    '--png', path.join(dir, `${id}.preview.png`), '--report', path.join(dir, `${id}.render.json`)];
  const startedAt = stamp();
  const result = spawnSync(command[0], command.slice(1), { cwd, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  write(path.join(dir, `render-${serial}.call.json`), {
    schema: 'ld-s10y-image/repair-call@1', figure: id, stage: 'jsxgraph-render-with-spec-validation', cwd,
    command, startedAt, endedAt: stamp(), exitCode: result.status, signal: result.signal,
    executionError: result.error?.message || null, stdout: result.stdout, stderr: result.stderr,
    spec: ref(path.join(dir, 'spec.repaired.json')), paidModelCalls: 0, spatialProofReruns: 0,
  });
  console.log(result.stdout || result.stderr || result.error?.message);
  process.exitCode = result.status ?? 1;
} else if (action === 'finish') {
  const startedAt = stamp();
  const inputs = read(path.join(root, 'inputs.json'));
  for (const file of inputs.preserved) assert.equal(hash(file.path), file.sha256, `Changed external input: ${file.path}`);
  const oldReport = read(path.join(previous, 'report.json'));
  const diff = read(path.join(root, 'diff.json'));
  const selfCheck = read(path.join(root, 'self-check.json'));
  assert.equal(selfCheck.status, 'pass');
  assert.equal(selfCheck.images.newContext, 4);
  const figures = ids.map(id => {
    const dir = path.join(root, id);
    const render = read(path.join(dir, `${id}.render.json`));
    const oldFacts = oldReport.figures.find(figure => figure.id === id);
    const change = diff.figures.find(figure => figure.id === id);
    assert.equal(hash(change.after.path), change.after.sha256);
    assert.equal(render.status, 'pass');
    assert.deepEqual(render.collisions, []);
    assert.ok(render.displayChecks.every(check => check.status === 'pass' && check.measuredMinPx >= 16));
    assert.equal(render.spec.sha256, change.after.sha256);
    assert.equal(render.output.svg.sha256, hash(path.join(dir, `${id}.svg`)));
    const calls = fs.readdirSync(dir).filter(file => /^render-\d+\.call\.json$/.test(file)).sort().map(file => read(path.join(dir, file)));
    return {
      id, status: 'AUTHOR_LABEL_SELF_CHECK_PASS_PENDING_PARENT_REVIEW', changes: change.changes,
      priorRepairCount: oldFacts.repairCount, newRepairCount: 1, cumulativeRepairCount: oldFacts.repairCount + 1,
      priorStageCalls: oldFacts.calls, newCalls: { jsxgraphRender: calls.length, embeddedSpecValidation: calls.length, paidModel: 0, spatialProofReruns: 0 },
      priorImages: oldFacts.imageCount, newImages: { originalPNGReads: 1, renderPreviewReads: 1, total: 2 },
      cumulativeImages: oldFacts.imageCount.total + 2,
      renderStatus: render.status, collisions: render.collisions, checkedDisplay: render.displayChecks,
      reusedSpatialEvidence: { ...ref(path.join(previous, id, `${id}.spatial.json`)), status: 'pass', rerun: false, applicability: 'Only labelPlacement changed; source, geometry, object anchors, assertions, and spatial executable unchanged; exact diff binds new spec to passed historical spec.' },
      priorReview: { ...ref(path.join(previous, id, `${id}.review.json`)), status: 'historical-fail-preserved-not-current-approval' },
      artifacts: { source: oldFacts.artifacts.source, spec: ref(path.join(dir, 'spec.repaired.json')), svg: ref(path.join(dir, `${id}.svg`)), preview: ref(path.join(dir, `${id}.preview.png`)), render: ref(path.join(dir, `${id}.render.json`)) },
      calls,
    };
  });
  write(path.join(root, 'finish.call.json'), { schema: 'ld-s10y-image/repair-call@1', stage: 'preservation-and-hash-bound-report', cwd, command: [process.execPath, ...process.argv.slice(1)], startedAt, endedAt: stamp(), exitCode: 0, paidModelCalls: 0, spatialProofReruns: 0 });
  write(path.join(root, 'report.json'), {
    schema: 'ld-s10y-image/bounded-repair-report@1', ticket: 'STEMROBIN-184', scope: 'same184-3', lesson: 'geo910-c1-s3-n33', cwd,
    status: 'AUTHOR_LABEL_SELF_CHECK_PASS_PENDING_PARENT_REVIEW', batch: 'batch013-repair123124',
    authorization: 'Latest direct human instruction authorizes ordinary reversible zero-paid affected-label repairs beyond the internal one-repair/third-attempt gate; historical usage remains unchanged.',
    previousReport: inputs.previousReport, diff: ref(path.join(root, 'diff.json')), selfCheck: ref(path.join(root, 'self-check.json')),
    preservation: { inputs: ref(path.join(root, 'inputs.json')), checkedFiles: inputs.preserved.length, allPreviousBytesUnchanged: true, writes: root },
    calls: { prepare: 1, affectedLabelDiff: 1, jsxgraphRender: figures.reduce((sum, figure) => sum + figure.calls.length, 0), embeddedSpecValidation: figures.reduce((sum, figure) => sum + figure.calls.length, 0), manualTargetedFigureRepairs: 2, authorAffectedSelfChecks: 2, reportFinalization: 1, spatialProofReruns: 0, paidModel: 0, newExecutionFailures: figures.flatMap(figure => figure.calls).filter(call => call.executionError || (call.exitCode !== 0 && !call.stderr?.includes('"status": "fail"'))).length },
    images: { previousBatch: oldReport.imageCount, newContext: selfCheck.images.newContext, combinedHistoricalAndNew: oldReport.imageCount + selfCheck.images.newContext, originalPNGReads: 2, newPreviewReads: 2, priorPreviewReads: 0, requestedNewMaximum: 6, hardBatchLimit: 8, hardContextLimit: 24 },
    figures, prepareCall: ref(path.join(root, 'prepare.call.json')), diffCall: ref(path.join(root, 'diff.call.json')), finishCall: ref(path.join(root, 'finish.call.json')),
    remainingIssues: ['Parent independent affected-label review remains required; no current approval or promotion is claimed.', 'Final offline lesson/product display acceptance remains with the parent and was not rerun here.'],
    forbiddenActionsPerformed: [],
  });
  console.log(JSON.stringify({ report: ref(path.join(root, 'report.json')), status: 'AUTHOR_LABEL_SELF_CHECK_PASS_PENDING_PARENT_REVIEW', newCalls: { render: 2, embeddedValidation: 2, paid: 0, spatialReruns: 0 }, preservedFiles: inputs.preserved.length }, null, 2));
} else {
  throw new Error(`Unsupported action: ${action}`);
}
