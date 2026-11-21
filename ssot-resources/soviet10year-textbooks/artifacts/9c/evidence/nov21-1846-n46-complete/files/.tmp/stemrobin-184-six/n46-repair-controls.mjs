import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const author = path.join(base, 'n46-choice-repair');
const reviewer = path.join(base, 'n46-choice-affected');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  file = path.resolve(repo, file);
  const bytes = fs.readFileSync(file);
  return { path: path.relative(repo, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = row => {
  const actual = bind(row.path);
  assert.equal(actual.sha256, row.sha256, row.path);
  if (row.bytes !== undefined) assert.equal(actual.bytes, row.bytes, row.path);
  return actual;
};
const writeNew = (file, value) => fs.writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
const progressFile = path.join(base, 'source-progress.json');
const usageFile = path.join(repo, '.intentfold/tickets/STEMROBIN-184/usage.json');
const progress = read(progressFile);
const usage = read(usageFile);
const current = progress.n46.independentChoice;
assert.equal(current.closed, false);
assert(current.stage3Intake);
const mode = process.argv[2];
const entry = { at: new Date().toISOString(), lesson: 'ana9-c4-s2-n46',
  agent: current.agent, parentImagesOrDecodes: 0,
  parentBudget: 'Permanent24/24;not reset', passedContentStageReplays: 0,
  contentRevisionCyclesCumulative: 1, completeLessonDelta: 0, finish: 'review',
  originalFailuresHoldsUnknowns: 'PRESERVED', sourceOrGroupComplete: false };
let suffix;

if (mode === 'seal') {
  assert(!current.repair);
  const original = read(path.join(base, 'n46-choices-recovered/draft.json'));
  const draft = read(path.join(author, 'draft.json'));
  assert.deepEqual(draft.questions.slice(0, 3), original.questions.slice(0, 3));
  assert.deepEqual(draft.coverage.slice(0, 2), original.coverage.slice(0, 2));
  assert.deepEqual(draft.new_figures, []);
  assert.equal(draft.schema, original.schema);
  assert.equal(draft.seed_sha256, original.seed_sha256);
  const changed = [];
  draft.questions.slice(3).forEach((question, index) => {
    const before = original.questions[index + 3];
    for (const key of ['id', 'source_numbers'])
      assert.deepEqual(question[key], before[key]);
    for (const key of ['mode', 'stem', 'figure_ids'])
      assert.deepEqual(question.view[key], before.view[key]);
    for (const key of ['source_solution', 'concept_blocks', 'figure_observations'])
      assert.deepEqual(question.intent[key], before.intent[key]);
    assert.equal(question.view.options.length, before.view.options.length);
    question.view.options.forEach((option, optionIndex) => {
      const old = before.view.options[optionIndex];
      assert.equal(option.id, old.id);
      assert.deepEqual(option.figure_ids, old.figure_ids);
      if (option.text !== old.text) changed.push(`${question.id}/${option.id}`);
      else assert.deepEqual(question.key.rationales[optionIndex], before.key.rationales[optionIndex]);
    });
  });
  assert.deepEqual(changed, [
    'n46-choice-04/b', 'n46-choice-04/g', 'n46-choice-05/d', 'n46-choice-05/f',
  ]);
  assert.deepEqual(read(path.join(author, 'seed.json')),
    read(path.join(base, 'n46-choices-recovered/seed.json')));
  const digestCall = spawnSync('python3', [
    '-B', path.join(repo, '.agents/skills/ld-s10y-choice/scripts/prepare.py'),
    'digest', path.join(author, 'draft.json'),
  ], { cwd: repo, encoding: 'utf8' });
  assert.equal(digestCall.status, 0, digestCall.stderr);
  const canonicalDigest = digestCall.stdout.trim();
  assert(/^[a-f0-9]{64}$/.test(canonicalDigest));
  const all = draft.questions.map(({ id, view }) => ({ id, view }));
  writeNew(path.join(author, 'view-affected.json'), all.slice(3));
  writeNew(path.join(author, 'view-all.json'), all);
  const manifest = {
    ...entry, status: 'ONE_AFFECTED_GRAPH_REPAIR_SEALED_NOT_APPROVED',
    originalDraft: bind(path.join(base, 'n46-choices-recovered/draft.json')),
    originalRejectedReview: bind(path.join(base, 'n46-choice-independent/review.json')),
    originalFullIntake: verify(current.stage3Intake),
    canonicalDraftDigest: canonicalDigest,
    changedOptions: changed, unchangedOptions: 22,
    questions: 5, single: 3, multiple: 2, options: 26, figures: 0,
    independentlyWrittenRepairBasis: 'Parent derived p prime/second-prime and translated odd identity, and q prime/second-prime/oddness from unchanged source polynomials. Complete connected profiles join ordered landmarks, tails and unique inflection; incorrect profiles swap both regional curvature labels. No new blind author or new source solve is claimed.',
    losses: 'Recognition still cannot demonstrate unaided drawing, scales, plotting or every calculation; coupling and non-separate sign-interval performance remain explicit.',
    provenance: 'Original author and original rejected staged review stay immutable; no reviewer key for this changed snapshot has been disclosed.',
    files: ['seed.json', 'draft.json', 'view-affected.json', 'view-all.json'].map(name => bind(path.join(author, name))),
  };
  writeNew(path.join(author, 'manifest.json'), manifest);
  for (const name of fs.readdirSync(author)) fs.chmodSync(path.join(author, name), 0o444);
  fs.chmodSync(author, 0o555);
  entry.status = manifest.status;
  entry.manifest = bind(path.join(author, 'manifest.json'));
  entry.files = manifest.files;
  entry.canonicalDraftDigest = canonicalDigest;
  entry.changedOptions = changed;
  entry.unchangedOptions = 22;
  current.repair = entry;
  suffix = 'one_repair_sealed';
} else if (mode === 'intake') {
  const stage = Number(process.argv[3]);
  assert([1, 2].includes(stage));
  const repair = current.repair;
  assert(repair[`stage${stage}Release`]);
  if (stage === 2) assert(repair.stage1Intake);
  const names = stage === 1
    ? ['affected-view.md', 'affected-view.json', 'affected-view-receipt.json']
    : ['final-report.md', 'review.json', 'final-receipt.json'];
  const receipt = read(path.join(reviewer, names.at(-1)));
  entry.receiptFiles = receipt.files.map(verify);
  entry.files = names.map(name => bind(path.join(reviewer, name)));
  entry.fullTextConsumption = process.argv[4];
  assert(entry.fullTextConsumption);
  entry.status = `N46_AFFECTED_STAGE${stage}_FULL_TEXT_INTAKEN`;
  if (stage === 1) {
    assert.equal(receipt.newAuthorRead, false);
    assert.equal(receipt.originalkeyExposure, true);
    assert.equal(receipt.accounting.fresh_changed_options, 4);
    assert.equal(receipt.accounting.reused_unchanged_options, 22);
    assert.equal(receipt.affected_visible_findings['04_task_fidelity'], 'pass');
    assert.equal(receipt.affected_visible_findings['05_task_fidelity'], 'pass');
    entry.outcome = 'pass';
    entry.oldKeyExposureDisclosed = true;
    entry.changedKeyStillUnread = true;
  }
  if (stage === 2) {
    const review = read(path.join(reviewer, 'review.json'));
    entry.outcome = review.outcome;
    entry.strictCompliance = receipt.strictCompliance;
    if (review.outcome === 'pass') {
      current.approvedDraft = bind(path.join(author, 'draft.json'));
      current.finalReview = bind(path.join(reviewer, 'review.json'));
    }
  }
  const output = path.join(base, `n46-choice-affected-stage${stage}-parent-intake.json`);
  writeNew(output, entry);
  repair[`stage${stage}Intake`] = bind(output);
  if (stage === 2) repair.finalOutcome = entry.outcome;
  suffix = `affected_stage${stage}_FULL_intake`;
} else if (mode === 'release') {
  const stage = Number(process.argv[3]);
  assert([1, 2].includes(stage));
  const repair = current.repair;
  assert(repair);
  assert(!repair[`stage${stage}Release`]);
  if (stage === 2) assert(repair.stage1Intake);
  entry.toolSubmission = process.argv[4];
  assert(entry.toolSubmission);
  entry.material = bind(path.join(author, stage === 1 ? 'view-affected.json' : 'draft.json'));
  entry.status = stage === 1
    ? 'N46_AFFECTED_VIEW_ONLY_ACTUALLY_RELEASED'
    : 'N46_AFFECTED_INTERNAL_DRAFT_ACTUALLY_RELEASED_AFTER_FULL_VIEW_INTAKE';
  const output = path.join(base, `n46-choice-affected-stage${stage}-actual-release.json`);
  writeNew(output, entry);
  repair[`stage${stage}Release`] = bind(output);
  suffix = `affected_stage${stage}_actual_release`;
} else {
  throw new Error('Supported mode required');
}

const key = `nov21_1846_n46_${suffix}`;
assert(!Object.hasOwn(usage, key));
usage[key] = entry;
progress.n46.status = entry.status;
progress.observed_at = entry.at;
fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2) + '\n');
fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n');
console.log(JSON.stringify(entry, null, 2));
