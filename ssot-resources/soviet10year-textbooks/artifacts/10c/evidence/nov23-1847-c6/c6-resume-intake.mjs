import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const work = '.tmp/stemrobin-184-six/c6-resume';
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov23-1847-c6';
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n',
  { flag: 'wx' });
const expected = {
  'view-first.md': '46e8953accce5861b495601d69095a82aafa3d283ca0d70460ebce3b12a3befc',
  'view-first.json': '62c682b20f2c306bf4353b268a827a1b1bde9f0681a553cc5b6009c93e9a1f56',
};
assert.equal(sha(`${work}/reviewer/source-first.md`),
  '1ceba2991cb864c26bbfb102ddf6323b4783ab4a43f5f4e46388302fea669b52');
const viewReview = read(`${work}/reviewer/view-first.json`);
const views = read(`${work}/question-views.json`);
assert.equal(viewReview.question_reviews.length, 60);
assert.equal(viewReview.binding.views_file_sha256, sha(`${work}/question-views.json`));
assert.equal(viewReview.blindness.author_key_seen, false);
let options = 0;
for (const view of views) {
  const review = viewReview.question_reviews.find(r => r.question_id === view.id);
  assert(review);
  const checks = review.mathematics.option_checks;
  assert.deepEqual(checks.map(o => o.option_id), view.view.options.map(o => o.id));
  assert(checks.every(o => ['correct', 'incorrect'].includes(o.truth) && o.evidence));
  assert.deepEqual(review.mathematics.correct,
    checks.filter(o => o.truth === 'correct').map(o => o.option_id));
  options += checks.length;
}
assert.equal(options, 215);
const retained = [];
for (const [name, hash] of Object.entries(expected)) {
  const source = `${work}/reviewer/${name}`;
  assert.equal(sha(source), hash);
  const target = `${evidence}/reviewer/${name}`;
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  retained.push({ source, target, sha256: hash });
}
fs.mkdirSync(`${evidence}/snapshots`, { recursive: true });
for (const name of ['draft.json', 'seed.json', 'question-views.json']) {
  const source = `${work}/${name}`;
  const target = `${evidence}/snapshots/original-${name}`;
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  retained.push({ source, target, sha256: sha(source) });
}
const receipt = {
  status: 'BLIND_STAGE_B_REVISE_FREEZE_RETAINED_BEFORE_INTERNAL_DISCLOSURE',
  reviewer: '01a205d3-3435-79f2-a46b-47ba43de4314',
  questions: 60, independentOptionChecks: options,
  nonpassingVisibleQuestions: ['c6-370', 'c6-372', 'c6-373'],
  retained, images: 0, originalSourceFreezeUnchanged: true,
  semanticApproval: false, databaseWrites: 0,
  parentResumeNavigationNonzeroCommands: [
    'rg: guessed .agents/skills choice-retainer path absent (exit 2)',
    'sed: guessed n82-resume evidence-helper path absent (exit 1)',
    'rg: bounded helper filename search returned no match (exit 1)',
  ],
  parentResumeTruncatedRoutingOutputs: [
    'Full git status routing output',
    'Broad historical usage field search',
    'Top-level usage key inventory',
    'Stage B nonpassing projection used absent mathematics.verdict and included all records',
  ],
  substantiveIntake: 'Corrected bounded findings, all 60 independent solution/true-set summaries, '
    + 'capacity notes and stage-boundary report received; all 215 option records retained and checked structurally.',
  modelAndHiddenCosts: 'UNKNOWN',
};
write(`${evidence}/stage-b-intake.json`, receipt);
const checkpointPath = '.intentfold/tickets/STEMROBIN-184/usage.json';
const checkpoint = read(checkpointPath);
Object.assign(checkpoint.nov22_1847_resume.c6Supplement, {
  status: 'BLIND_REVISE_RETAINED_INTERNAL_COMPARISON_NEXT',
  independentViewFirst: `${evidence}/reviewer/view-first.md`,
  independentViewFirstSha256: expected['view-first.md'],
  independentOptionChecks: options,
  initialVisibleReviseQuestions: receipt.nonpassingVisibleQuestions,
  stageBIntake: `${evidence}/stage-b-intake.json`,
  originalDraftPreserved: `${evidence}/snapshots/original-draft.json`,
});
fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2) + '\n');
console.log(JSON.stringify(receipt, null, 2));
