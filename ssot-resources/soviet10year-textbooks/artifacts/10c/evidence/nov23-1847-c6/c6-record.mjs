import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const work = '.tmp/stemrobin-184-six/c6-resume';
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov23-1847-c6';
const checkpointPath = '.intentfold/tickets/STEMROBIN-184/usage.json';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const checkpoint = read(checkpointPath);
const run = checkpoint.nov22_1847_resume;
const c6 = run.c6Supplement;
const phase = process.argv[2];
if (phase === 'affected') {
  Object.assign(c6, {
    status: 'AFFECTED3_VIEWS_REVIEW_PENDING_AFTER_OFFICIAL_INITIAL_REVISE',
    authorInternalsDisclosedToReviewer: true,
    initialOfficialReview: `${evidence}/snapshots/original-review.json`,
    initialOfficialReviewSha256: sha(`${work}/review.json`),
    initialSemanticValidationExit: 3,
    initialComparison: `${evidence}/reviewer/internal-comparison.md`,
    initialComparisonSha256: sha(`${work}/reviewer/internal-comparison.md`),
    affectedCandidate: `${work}/revision1/draft.json`,
    affectedCandidateSha256: sha(`${work}/revision1/draft.json`),
    changedViews: read(`${work}/revision1/repair.json`).changedViews,
    limitationsOnly: read(`${work}/revision1/repair.json`).limitationsOnly,
    misconceptionOnly: 'c6-389/a',
    parentRepairSyntaxCheckExit: 0,
    originalCorrectSetsAndTruthLabelsUnchanged: true,
    parentAdditionalRoutingNoMatch: 'n86 evidence filename search returned no match (exit 1)',
    parentAdditionalTruncatedRoutingOutputs: [
      'Broad n82 helper/stage filename search',
      'Historical forward182189 metadata projection',
    ],
  });
} else if (phase === 'affected2') {
  Object.assign(c6, {
    status: 'SECOND_AFFECTED3_VIEWS_PENDING_FIRST_AFFECTED_REVISE_PRESERVED',
    firstAffectedViewReview: `${evidence}/reviewer/affected-view-first.md`,
    firstAffectedViewReviewSha256: sha(`${work}/reviewer/affected-view-first.md`),
    firstAffectedOutcome: 'revise',
    secondAffectedCandidate: `${work}/revision2/draft.json`,
    secondAffectedCandidateSha256: sha(`${work}/revision2/draft.json`),
    secondAffectedChangedRationales: read(`${work}/revision2/repair.json`).changedDistractorRationales,
    firstAffectedFailurePreserved: true,
  });
} else if (phase === 'mechanical') {
  const review = read(`${work}/revision2/review.json`);
  const display = read(`${evidence}/display-new/report.json`);
  assert.equal(review.outcome, 'pass');
  assert.equal(display.status, 'MECHANICAL_PASS_REPRESENTATIVE_VISUAL_REVIEW_PENDING');
  assert.equal(read(`${evidence}/stages/choices-retain.receipt.json`).exit, 0);
  Object.assign(c6, {
    status: 'SEMANTIC_PASS_RETAINED_MECHANICAL_DISPLAY_PASS_PIXEL_REVIEW_PENDING',
    independentSemanticApproval: true,
    finalReview: `${work}/revision2/review.json`,
    finalReviewSha256: sha(`${work}/revision2/review.json`),
    choicesRetainExit: 0,
    newDisplayExecuted: true, newDisplayMechanicalExit: 0,
    displayImages: display.captures.length,
    displayControlClicks: display.clicks, displayBrowserActuallyClosed: display.browserClosed,
    newKeyboardInteractions: 0, databaseWrites: 0,
  });
} else if (phase === 'approved') {
  const review = read(`${work}/revision2/review.json`);
  assert.equal(review.outcome, 'pass');
  const display = read(`${evidence}/display-new/report.json`);
  assert.equal(display.status, 'MECHANICAL_PASS_REPRESENTATIVE_VISUAL_REVIEW_PENDING');
  const finalDisplay = read(`${work}/reviewer/display-review.json`);
  assert.equal(finalDisplay.outcome, 'pass');
  Object.assign(c6, {
    status: 'COMPLETE_REVIEW_APPROVED_CANONICAL_RETAINED_COMMIT_PENDING',
    independentSemanticApproval: true,
    finalReview: `${work}/revision2/review.json`,
    finalReviewSha256: sha(`${work}/revision2/review.json`),
    choicesRetainExit: 0,
    newDisplayExecuted: true, newDisplayMechanicalExit: 0,
    displayImages: display.captures.length,
    displayControlClicks: display.clicks,
    displayReview: `${evidence}/reviewer/display-review.json`,
    displayReviewSha256: sha(`${work}/reviewer/display-review.json`),
    independentReviewerImageOpens: finalDisplay.imagesOpened,
    independentReviewerActuallyClosed: true,
    wholeLessonReady: true,
    newCompleteLessonCredit: 1,
    newKeyboardInteractions: 0,
    databaseWrites: 0,
  });
} else if (phase === 'delivered') {
  assert.equal(c6.wholeLessonReady, true);
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const short = commit.slice(0, 9);
  const push = read(`${evidence}/stages/c6-push.receipt.json`);
  assert.equal(push.exit, 0);
  Object.assign(c6, { status: 'COMPLETE_REVIEW_COMMITTED_AND_ORDINARY_PUSHED',
    commit: short, commitFull: commit,
    push: 'SUCCESS HEAD -> codex/STEMROBIN-184-textbooks',
    evidencePath: evidence });
  assert(!run.writerQueue.some(item => item.lesson === c6.lesson));
  run.writerQueue.push({
    book: '10c', lesson: c6.lesson, branch: run.branch, commit: short,
    lessonPath: 'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-ex',
    rawLessonPath: 'ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-ex',
    evidencePath: evidence,
    components: 'Modern base, 57 previously reviewed ungraded answers and 57 existing free interactions, 60 reviewed choices/215 options; complete display at explicit recorded sampling scope; no new keyboard interactions',
    publication: 'NOT_RUN_BY_PRODUCER_SUPERVISOR_IS_SOLE_DB_WRITER',
    submission: 'Existing checkpoint only; no supervisor or peer message',
  });
  run.completeLessonsThisRun = run.writerQueue.length;
  run.status = 'ACTIVE_NEXT_MISSING_LESSON_AFTER_C6_PUSH';
  const planPath = '.intentfold/tickets/STEMROBIN-184/plan.md';
  const plan = fs.readFileSync(planPath, 'utf8');
  const marker = '## 184-7 Current Production (2026-11-23)';
  assert(plan.includes(marker));
  const updatedPlan = plan.replace(marker, marker + `\n\nC6 \`ana10-c6-ex\` completed at finish=review and ordinary pushed as \`${short}\`.\n57 reviewed ungraded answers and 57 existing free interactions reused unchanged;\n60 choices/215 options approved after affected repairs. Initial semantic revise\nand all independent freezes retained. New desktop/mobile control/math-port checks\nand eight representative screenshots PASS at the explicit sampling scope; prior\nwritten-display PASS reused without replay. No DB or new keyboard interaction.\nReviewer Sagan actually closed; writer queue recorded in existing usage.json.\nImmediately continue next missing authorized 9c/10c lesson; existing HOLDs remain.\n`)
    .replace('Continue immediately with `ana10-c6-ex`: reuse its already reviewed 57 answers,\nvalid interactions and modern written-display evidence; only missing choices/new\naffected display.',
      'C6 is now complete and queued above. Continue with the next missing authorized\n9c/10c lesson without replaying passed C6 stages.');
  fs.writeFileSync(planPath, updatedPlan);
} else {
  throw new Error('Unknown checkpoint phase');
}
fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2) + '\n');
console.log(JSON.stringify({ phase, status: c6.status, writerQueue: run.writerQueue }, null, 2));
