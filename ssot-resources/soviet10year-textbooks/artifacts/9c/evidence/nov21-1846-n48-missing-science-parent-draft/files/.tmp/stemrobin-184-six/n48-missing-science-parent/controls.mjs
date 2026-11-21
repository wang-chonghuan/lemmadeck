import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const folder = path.join(base, 'n48-missing-science-parent');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const [mode] = process.argv.slice(2);
const freezePath = path.join(folder, 'preregistration-freeze.json');
const sourcePath = path.join(base, 'n48-assembly-recovery/9c/lessons/ana9-c4-s2-n48/exercises.json');
if (mode === 'preregister') {
  assert(!fs.existsSync(freezePath));
  assert(!fs.existsSync(path.join(base, 'stages/n48-missing-graph-arithmetic-first.stdout')));
  const inputs = ['derivations.md', 'expected.json', 'check.py', 'controls.mjs']
    .map(name => bind(path.join(folder, name)));
  inputs.forEach(item => fs.chmodSync(path.join(root, item.path), 0o444));
  const record = { at: new Date().toISOString(), inputs,
    sourceExercises: bind(sourcePath), expectedCases: 10,
    status: 'NEW_MISSING_GRAPH_DRAFT_AND_EXPECTATIONS_FROZEN_BEFORE_FIRST_EXECUTION',
    sourceMathNativeGateReplays: 0, parentNewImagesOrDecodes: 0,
    independentReview: 'NOT_RUN', completeLessonDelta: 0 };
  fs.writeFileSync(freezePath, JSON.stringify(record, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
  console.log(JSON.stringify({ status: record.status, freeze: bind(freezePath) }));
} else if (mode === 'intake') {
  const frozen = read(freezePath);
  for (const item of [...frozen.inputs, frozen.sourceExercises]) {
    assert.deepEqual(bind(path.join(root, item.path)), item);
  }
  const stagePath = path.join(base, 'stages/n48-missing-graph-arithmetic-first.receipt.json');
  const stage = read(stagePath);
  assert.equal(stage.exitCode, 0);
  assert(new Date(frozen.at) < new Date(stage.started));
  const result = read(path.join(base, 'stages/n48-missing-graph-arithmetic-first.stdout'));
  assert.equal(result.cases.length, 10);
  assert(result.cases.every(item => item.status === 'PASS'));
  assert.equal(result.expected_sha256, bind(path.join(folder, 'expected.json')).sha256);
  assert.equal(result.independent_review, 'NOT_RUN');
  const progressPath = path.join(base, 'source-progress.json');
  const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
  const progress = read(progressPath), usage = read(usagePath);
  assert(progress.n48.recovery && !progress.n48.missingScienceDraft);
  const manifestPath = path.join(folder, 'manifest.json');
  assert(!fs.existsSync(manifestPath));
  const outputs = [...frozen.inputs, bind(freezePath)];
  for (const suffix of ['stdout', 'stderr', 'receipt.json']) {
    const file = path.join(base, `stages/n48-missing-graph-arithmetic-first.${suffix}`);
    fs.chmodSync(file, 0o444);
    outputs.push(bind(file));
  }
  const record = {
    at: new Date().toISOString(),
    status: 'N48_NEW_MISSING_SCIENCE_PARENT_DRAFT_ONLY_NOT_INDEPENDENT_APPROVAL',
    outputs, sourceExercises: frozen.sourceExercises, arithmetic: result,
    completeLessonDelta: 0, sourceMathNativeGateReplays: 0,
    parentNewImagesOrDecodes: 0, parentPermanentBudget: '24/24 unchanged',
    historicalFailHoldUnknownPreserved: true, strictCompliance: false,
    approvalScope: 'No approval;386conditional convention explanation and387graph construction draft awaiting independent comparison',
  };
  fs.writeFileSync(manifestPath, JSON.stringify(record, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
  fs.chmodSync(folder, 0o555);
  progress.n48.missingScienceDraft = { ...record, manifest: bind(manifestPath) };
  usage.nov21_1846_n48_missing_science_parent_draft = progress.n48.missingScienceDraft;
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
  fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
  console.log(JSON.stringify({ status: record.status, manifest: bind(manifestPath),
    exactCases: 10, independentApproval: false, completeLessonDelta: 0 }));
} else throw new Error(`Unsupported mode: ${mode}`);
