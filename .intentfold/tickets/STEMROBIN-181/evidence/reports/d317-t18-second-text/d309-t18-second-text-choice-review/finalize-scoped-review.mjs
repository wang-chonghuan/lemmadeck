import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bytes, bind, verify, immutableWrite,
} from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d309-t18-second-text-choice-review`;
const internalPath = `${folder}/phase3-internal-comparison.json`;
const internal = await read(internalPath);
for (const binding of [internal.visibleReview, internal.authorFreeze, internal.authorReport]) {
  await verify(binding.path, binding.sha256);
}
const visibleReview = await read(internal.visibleReview.path);
await verify(visibleReview.baseline.path, visibleReview.baseline.sha256);
const baseline = await read(visibleReview.baseline.path);
const freeze = await read(internal.authorFreeze.path);
assert.equal(internal.outcome, 'pass');
assert.deepEqual(internal.comparisons.map(row => row.source_number), ['4', '5', '6', '7']);
await fs.chmod(absolute(internalPath), 0o444);
const nativeValidation = [];
const languageReviews = [];
for (const language of ['zh', 'en']) {
  const entry = freeze.languages.find(row => row.language === language);
  assert.ok(entry);
  for (const binding of [entry.seed, entry.draft, entry.visibleOnly]) {
    await verify(binding.path, binding.sha256);
  }
  const draft = await read(entry.draft.path), views = await read(entry.visibleOnly.path);
  assert.deepEqual(draft.questions.map(question => question.view), views);
  const questionReviews = draft.questions.map((question, i) => {
    const prior = visibleReview.question_reviews[i];
    const comparison = internal.comparisons[i];
    assert.equal(question.id, comparison.question_id);
    assert.deepEqual(question.source_numbers, prior.inferred_source_numbers);
    assert.deepEqual(question.key.correct, prior.mathematics.correct);
    for (const option of prior.mathematics.option_checks) {
      const rationale = question.key.rationales.find(row => row.option_id === option.option_id);
      assert.equal(rationale.truth, option.truth);
    }
    return {
      question_id: question.id,
      task_fidelity: prior.task_fidelity,
      redundancy: prior.redundancy,
      answer_leakage: prior.answer_leakage,
      mathematics: prior.mathematics,
    };
  });
  const review = {
    schema: 's10y-choice-review-v1',
    seed_sha256: entry.seed.canonicalSha256,
    draft_sha256: entry.draft.canonicalSha256,
    reviewer: visibleReview.reviewer,
    source_reviews: baseline.tasks.map(task => ({
      source_number: task.source_number,
      independent_solution: task.independent_solution,
      coverage: {
        verdict: 'pass',
        evidence: internal.comparisons.find(row => row.source_number === task.source_number).coverageEvidence,
      },
    })),
    figure_checks: [], new_figure_reviews: [],
    question_reviews: questionReviews, outcome: 'pass',
  };
  const reviewPath = `${folder}/${language}/review.json`;
  await immutableWrite(reviewPath, `${JSON.stringify(review, null, 2)}\n`);
  await fs.chmod(absolute(reviewPath), 0o444);
  const receiptPath = `${folder}/${language}/native-validation.receipt.json`;
  const args = [
    '.agents/skills/ld-s10y-choice/scripts/validate.py',
    '--repo', entry.isolatedRepo, '--seed', entry.seed.path,
    '--draft', entry.draft.path, '--review', absolute(reviewPath),
  ];
  const startedAt = new Date().toISOString();
  const result = spawnSync('python3', args, {
    cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 4 * 1024 * 1024,
  });
  const receipt = {
    language, command: ['python3', ...args], cwd: root, startedAt,
    finishedAt: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout, stderr: result.stderr,
    attempts: 1, reviewSupplied: true,
    seed: entry.seed, draft: entry.draft, review: await bind(reviewPath),
    scope: 'First native review validation of the new four-choice snapshot only; no prepare, old validation, source review, images or full-project tests.',
  };
  await immutableWrite(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  await fs.chmod(absolute(receiptPath), 0o444);
  nativeValidation.push({
    language, receipt: await bind(receiptPath),
    exitCode: result.status, attempts: 1, reviewSupplied: true,
  });
  languageReviews.push({ language, review: await bind(reviewPath), questions: 4, options: 17 });
}
const outcome = nativeValidation.every(row => row.exitCode === 0) ? 'pass' : 'blocked';
const reportPath = `${folder}/report.json`;
const report = {
  schema: 'STEMROBIN-181/scoped-second-t18-choice-review@1',
  ticket: 'STEMROBIN-181', batch: 'D033', card: 'phy9-c2-s4-t18',
  status: outcome === 'pass' ? 'FOUR-SELECTED-BILINGUAL-CHOICES-PASS' : 'NATIVE-REVIEW-FAILURE-PRESERVED',
  outcome, reviewer: visibleReview.reviewer,
  phase1: visibleReview.baseline, phase2: internal.visibleReview,
  phase3: await bind(internalPath), authorFreeze: internal.authorFreeze,
  languageReviews, nativeValidation,
  coverage: {
    selectedSourceNumbers: ['4', '5', '6', '7'], selectedOriginalTasks: 4,
    questionsPerLanguage: 4, optionsPerLanguage: 17, bilingualOptions: 34,
    completeOriginalTasks: 16, wholeCardApproved: false,
    recognitionNotIndependentWriting: true,
    unconditionalRealDepositionHOLD: true,
  },
  sourceAndVisibleReviewRepeated: false, nativePrepareOrOldValidationRepeated: false,
  imagesOpened: 0, parentCumulativeImages: 24, compactionReset: false,
  originalHoldsPreserved: internal.sourceHoldsPreserved,
  fullGate2PASS: false, actualVisualDISPLAY: false,
  newWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
  wholeProjectChecks: false, oldFAILHOLDAndUncommittedBytesPreserved: true,
};
await immutableWrite(reportPath, `${JSON.stringify(report, null, 2)}\n`);
await fs.chmod(absolute(reportPath), 0o444);
console.log(JSON.stringify({ report: await bind(reportPath), outcome, nativeValidation }));
assert.equal(outcome, 'pass', 'Native failure retained; do not retry unchanged inputs.');
