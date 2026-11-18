import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, relative, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [comparisonPath] = process.argv.slice(2);
assert.ok(relative(comparisonPath).startsWith(`${ticket}/tmp/`));
const folder = path.dirname(relative(comparisonPath));
const reportPath = `${folder}/report.json`;
assert.equal(await exists(reportPath), false, 'Do not rerun an existing review.');
const internal = await read(comparisonPath);
assert.equal(internal.outcome, 'pass');
for (const binding of [internal.visibleReview, internal.authorFreeze, internal.authorReport]) {
  await verify(binding.path, binding.sha256);
}
const visible = await read(internal.visibleReview.path);
await verify(visible.baseline.path, visible.baseline.sha256);
const baseline = await read(visible.baseline.path);
assert.equal(visible.outcome, 'pass');
assert.deepEqual(internal.comparisons.map(row => row.source_number),
  baseline.tasks.map(row => row.source_number));
assert.deepEqual(internal.languageSnapshots.map(row => row.language), ['zh', 'en']);
await fs.chmod(absolute(comparisonPath), 0o444);
const nativeValidation = [], languageReviews = [];
for (const snapshot of internal.languageSnapshots) {
  const language = snapshot.language;
  const viewBinding = visible.visibleBindings.find(row => row.language === language);
  assert.ok(viewBinding);
  for (const binding of [snapshot.seed, snapshot.draft, viewBinding]) {
    await verify(binding.path, binding.sha256);
  }
  const draft = await read(snapshot.draft.path), views = await read(viewBinding.path);
  assert.deepEqual(draft.questions.map(row => row.view), views);
  const questionReviews = draft.questions.map((question, i) => {
    const prior = visible.question_reviews[i], comparison = internal.comparisons[i];
    assert.equal(question.id, comparison.question_id);
    assert.deepEqual(question.source_numbers, prior.inferred_source_numbers);
    assert.deepEqual(question.key.correct, prior.mathematics.correct);
    for (const option of prior.mathematics.option_checks) {
      assert.equal(question.key.rationales.find(row => row.option_id === option.option_id).truth, option.truth);
    }
    return {
      question_id: question.id, task_fidelity: prior.task_fidelity,
      redundancy: prior.redundancy, answer_leakage: prior.answer_leakage,
      mathematics: prior.mathematics,
    };
  });
  const reviewPath = `${folder}/${language}/review.json`;
  await immutableWrite(reviewPath, `${JSON.stringify({
    schema: 's10y-choice-review-v1',
    seed_sha256: snapshot.seed.canonicalSha256,
    draft_sha256: snapshot.draft.canonicalSha256,
    reviewer: visible.reviewer,
    source_reviews: baseline.tasks.map(task => ({
      source_number: task.source_number, independent_solution: task.independent_solution,
      coverage: {
        verdict: 'pass',
        evidence: internal.comparisons.find(row => row.source_number === task.source_number).coverageEvidence,
      },
    })),
    figure_checks: [], new_figure_reviews: [], question_reviews: questionReviews,
    outcome: 'pass',
  }, null, 2)}\n`);
  await fs.chmod(absolute(reviewPath), 0o444);
  const receiptPath = `${folder}/${language}/native-validation.receipt.json`;
  const args = [
    '.agents/skills/ld-s10y-choice/scripts/validate.py',
    '--repo', absolute(snapshot.repo), '--seed', absolute(snapshot.seed.path),
    '--draft', absolute(snapshot.draft.path), '--review', absolute(reviewPath),
  ];
  const startedAt = new Date().toISOString();
  const result = spawnSync('python3', args, {
    cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 4 * 1024 * 1024,
  });
  await immutableWrite(receiptPath, `${JSON.stringify({
    language, command: ['python3', ...args], cwd: root, startedAt,
    finishedAt: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout, stderr: result.stderr,
    attempts: 1, reviewSupplied: true,
    seed: snapshot.seed, draft: snapshot.draft, review: await bind(reviewPath),
    scope: 'First native review validation for these newly reviewed choices only; no prepare, old checks or images.',
  }, null, 2)}\n`);
  await fs.chmod(absolute(receiptPath), 0o444);
  nativeValidation.push({
    language, receipt: await bind(receiptPath), exitCode: result.status,
    attempts: 1, reviewSupplied: true,
  });
  languageReviews.push({
    language, review: await bind(reviewPath), questions: questionReviews.length,
    options: questionReviews.reduce((sum, row) => sum + row.mathematics.option_checks.length, 0),
  });
}
const outcome = nativeValidation.every(row => row.exitCode === 0) ? 'pass' : 'blocked';
await immutableWrite(reportPath, `${JSON.stringify({
  schema: 'STEMROBIN-181/new-scoped-bilingual-choice-review@1',
  ticket: 'STEMROBIN-181', batch: 'D033', card: internal.card,
  status: outcome === 'pass' ? 'SCOPED-BILINGUAL-CHOICES-PASS' : 'NATIVE-FAILURE-PRESERVED',
  outcome, reviewer: visible.reviewer,
  phase1: visible.baseline, phase2: internal.visibleReview,
  phase3: await bind(comparisonPath), authorFreeze: internal.authorFreeze,
  languageReviews, nativeValidation,
  sourceTasks: internal.comparisons.map(row => row.source_number),
  imagesOpened: 0, parentCumulativeImages: 24, compactionReset: false,
  sourceAndVisibleReviewsRepeated: false, oldValidationOrPrepareRepeated: false,
  wholeCardApproved: false, fullGate2PASS: false, actualVisualDISPLAY: false,
  originalHoldsPreserved: ['exercise1-fig189', 'exercise9-discharge-type'],
  newWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
  wholeProjectChecks: false, oldFAILHOLDAndUncommittedBytesPreserved: true,
}, null, 2)}\n`);
await fs.chmod(absolute(reportPath), 0o444);
console.log(JSON.stringify({ report: await bind(reportPath), outcome, nativeValidation, languageReviews }));
assert.equal(outcome, 'pass', 'Failure retained; do not rerun unchanged inputs.');
