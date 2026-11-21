import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const lesson = 'ana9-c4-s2-n47';
const artifact = path.join(root,
  'ssot-resources/soviet10year-textbooks/artifacts/9c');
const modern = path.join(artifact, 'editions/modern-us-neutral/lessons', lesson);
const progressPath = path.join(base, 'source-progress.json');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length, sha256: hash(bytes) };
};
const writeNew = (file, value) => fs.writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const progress = read(progressPath);
const usage = read(usagePath);
const [mode, ...args] = process.argv.slice(2);
const receipt = {
  schema: 'stemrobin1846/n47-production-control@1',
  mode, at: new Date().toISOString(), lesson, book: '9c',
  authority: 'Same continuous parent-agent delegated production; not a new human prompt',
  parentNewImagesOrDecodes: 0, paidCalls: 0, databaseOrPublisherOperations: 0,
  passedStageReplays: 0, completeLessonDelta: 0, finish: 'review',
};
assert.equal(progress.source169.review.closed, true);
assert.equal(progress.source169.review.approved, true);
assert.equal(progress.source169.review.boundaryApproved, true);
progress.n47 ??= { status: 'IN_PRODUCTION', completeLessonDelta: 0 };
if (mode === 'answer-materialize-gate2') {
  const draftPath = path.join(base, 'n47-answer-keys.json');
  const templatePath = path.join(base,
    'n47-work/9c/modern-us-neutral/lessons', lesson, 'answer-keys.template.json');
  const draft = read(draftPath);
  const template = read(templatePath);
  const exercises = read(path.join(modern, 'exercises.json')).exercises;
  assert.equal(draft.lesson, lesson);
  assert.deepEqual(draft.answers.map(a => a.exercise), exercises.map(e => e.number));
  assert.deepEqual(template.answers.map(a => a.exercise), exercises.map(e => e.number));
  assert.equal(draft.answers.length, 4);
  assert.equal(draft.answers.reduce((sum, a) => sum + a.parts.length, 0), 10);
  for (const answer of draft.answers) {
    const prepared = template.answers.find(a => a.exercise === answer.exercise);
    assert.equal(prepared.figureEvidence.length, 0);
    assert.equal(prepared.source, 'derived');
    if ('bookRaw' in prepared) answer.bookRaw = prepared.bookRaw;
  }
  assert.equal(draft.answers[3].grading, 'ungraded');
  assert.equal(draft.answers[3].parts.length, 0);
  const target = path.join(modern, 'answer-keys.json');
  writeNew(target, draft);
  receipt.inputs = [bind(draftPath), bind(templatePath),
    bind(path.join(modern, 'exercises.json'))];
  receipt.reusedMathEvidence = bind(path.join(base, 'source168-review/math.json'));
  receipt.mathEvidencePurpose = 'Answer production reuse only; no new source/math review';
  receipt.gate2 = {
    outcome: 'PASS',
    exercises: ['378', '379', '380', '381'],
    originalRequestsPreserved: 14,
    automaticParts: 10,
    source: 'derived; no bookRaw supplied by official preparation',
    figureEvidence: 'None in all four official prepared records',
    conditions: 'All denominator-zero exclusions preserved; no ad-bc nonzero assumption',
    parameterCases: 'c nonzero with zero determinant retains hole; c=0,d nonzero gives a/d; c=d=0 empty domain',
    ungradedRationale: '381 needs conditional domain and undefined-value discussion, not one unconditional expression key',
    expectedFormat: 'LaTeX; expression/numeric only, no exact candidates',
    mechanicalFinalization: 'Pending FIRST official answer finalize',
    approvalScope: 'New lesson answer materialization; source168 original HOLDs unchanged',
  };
  receipt.output = bind(target);
  progress.n47.answerGate2 = receipt.gate2;
} else if (mode === 'author-dispatch') {
  assert(!progress.n47.choiceAuthor);
  receipt.agent = args[0];
  receipt.nickname = args[1];
  receipt.root = '.tmp/stemrobin-184-six/n47-choice-author';
  receipt.imagesAuthorized = 0;
  receipt.historyFork = false;
  receipt.scope = 'Whitelist seed and independent choice authoring only; no answers/interactions/history';
  progress.n47.choiceAuthor = { ...receipt, closed: false };
} else if (mode === 'offline-dispatch') {
  assert.equal(progress.n47.choiceReview.closed, true);
  assert(!progress.n47.offline);
  receipt.agent = args[0];
  receipt.nickname = args[1];
  receipt.historyFork = false;
  receipt.plannedScreenshotViews = 6;
  receipt.maximumScreenshotViews = 8;
  receipt.scope = 'New n47 offline text/written+answers/choice desktop and mobile only; not live server/DB/keyboard acceptance';
  progress.n47.offline = { ...receipt, closed: false };
} else if (mode === 'offline-intake') {
  assert(progress.n47.offline);
  assert(!progress.n47.offline.intake);
  assert(progress.n47.offline.failureIntake);
  assert.equal(progress.n47.choiceVisualFollowup.closed, true);
  assert.equal(progress.n47.choiceVisualFollowup.accepted, true);
  const firstReportPath = path.join(base, 'n47-offline/report.json');
  const firstReport = read(firstReportPath);
  assert.equal(firstReport.overallVerdict, 'FAIL');
  assert.equal(firstReport.accounting.actualImageToolViews, 6);
  const failedRecoveryPath = path.join(base, 'n47-offline-recovery/report.json');
  assert.equal(read(failedRecoveryPath).overallVerdict, 'FAIL');
  const directory = path.join(base, 'n47-choice-visual-followup');
  const reportPath = path.join(directory, 'report.json');
  const report = read(reportPath);
  assert.equal(report.assertionVerdict, 'PASS');
  assert(report.visualVerdict.startsWith('PASS'));
  assert.equal(report.accounting.actualImageToolViews, 2);
  assert.equal(report.accounting.historicalSartreImageViews, 8);
  assert.equal(report.accounting.totalKnownN47ImageViews, 10);
  assert.equal(report.accounting.parentImagesOrDecodes, 0);
  assert.equal(report.accounting.hiddenBrowserImageInternals, 'UNKNOWN');
  assert.equal(report.cleanup.browserClosed, true);
  assert.deepEqual(report.unresolvedFailures, []);
  const rows = [];
  const walk = folder => {
    assert.equal(fs.statSync(folder).mode & 0o777, 0o555);
    for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
      const file = path.join(folder, item.name);
      assert(!item.isSymbolicLink());
      if (item.isDirectory()) walk(file);
      else {
        assert.equal(fs.statSync(file).mode & 0o777, 0o444);
        const row = bind(file);
        if (file.endsWith('.json')) {
          const value = read(file);
          const leaves = item => item !== null && typeof item === 'object'
            ? Object.values(item).reduce((sum, child) => sum + leaves(child), 0) : 1;
          row.scalarLeaves = leaves(value);
          row.intake = 'Complete structured JSON parse/traversal; no image payload';
        } else row.intake = file.endsWith('.png') ? 'Hash custody only; no parent image/decode'
          : 'Full UTF-8 read; primary checker/report consumed separately by parent';
        rows.push(row);
      }
    }
  };
  walk(directory);
  receipt.files = rows;
  receipt.report = bind(reportPath);
  receipt.originalFirstFailReport = bind(firstReportPath);
  receipt.originalFailedHarnessReport = bind(failedRecoveryPath);
  receipt.affectedTextAnd111DOM64Clicks = 'Reused original passed portions; not rerun by followup';
  receipt.originalSixImageObservationsReused = true;
  receipt.newAffectedImageObservations = 2;
  receipt.historicalExhaustedCheckerObservations = 8;
  receipt.totalKnownN47ImageObservations = 10;
  receipt.originalFirstFailUnchanged = true;
  receipt.assertionVerdict = report.assertionVerdict;
  receipt.visualVerdict = report.visualVerdict;
  receipt.screenshotHandling = 'Hash-bound custody only; no parent view or decoder';
  progress.n47.offline.intake = receipt;
  progress.n47.offline.finalAcceptance = {
    assertionVerdict: 'PASS', visualVerdict: 'PASS',
    scope: 'Original passed portions plus affected text/DOM proof plus new standalone choice visual proof',
    originalFirstAndHarnessFailPreserved: true,
  };
} else if (mode === 'offline-close') {
  assert(progress.n47.offline.intake);
  assert.equal(args[0], progress.n47.offline.agent);
  assert.equal(args[1], 'completed');
  receipt.agent = args[0];
  receipt.previousStatusFromActualClose = args[1];
  progress.n47.offline.closed = true;
  progress.n47.offline.closure = receipt;
} else {
  throw new Error(`Unknown mode ${mode}`);
}
const receiptPath = path.join(base, `n47-${mode}-parent-receipt.json`);
writeNew(receiptPath, receipt);
progress.n47[`${mode}Receipt`] = bind(receiptPath);
progress.status = `1846 n47 ${mode}; remaining independent choice and offline gates`;
usage[`nov21_1846_n47_${mode.replaceAll('-', '_')}`] = receipt;
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify(receipt));
