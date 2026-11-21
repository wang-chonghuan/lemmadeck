import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const usagePath = path.join(repo, '.intentfold/tickets/STEMROBIN-184/usage.json');
const progressPath = path.join(base, 'source-progress.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = expected => {
  const actual = bind(path.resolve(repo, expected.path));
  assert.equal(actual.bytes, expected.bytes);
  assert.equal(actual.sha256, expected.sha256);
  return actual;
};
const writeNew = (file, value) => fs.writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
const usage = read(usagePath);
const progress = read(progressPath);
const lesson = 'ana9-c4-s2-n44';
const edition = path.join(repo,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons', lesson);
const independent = path.join(base, 'n44-choice-independent');
const reviewPath = path.join(independent, 'review.json');
const review = read(reviewPath);
assert.equal(review.reviewer.kind, 'independent_agent');
assert.equal(review.outcome, 'pass');
assert.equal(review.seed_sha256, '6c973ae2b14ffa33c58cc6df92f8af945368567753b2864b7ab533a86f7e42f1');
assert.equal(review.draft_sha256, 'fbe0d46b0c34ae68b4b35c335bfe7a40db9608d3e575364e23d6c4c9e8ecf710');
assert.equal(progress.n44.independentChoice.closed, true);
assert(progress.n44.independentChoice.stage3Intake);
assert.equal(progress.n44.offline.closed, true);
assert.equal(progress.n44.offline.visualVerdict, 'PASS');
const oldFiles = progress.n44.files.map(verify);
assert.equal(read(path.join(edition, 'choice-set/review.json')).reviewer.kind, 'self_review');
const gatePrefix = path.join(base, 'stages/n44-first-independent-choice-validation-nov21');
const gate = read(`${gatePrefix}.receipt.json`);
assert.equal(gate.cwd, repo);
assert.equal(gate.exitCode, 0);
const gateFiles = [bind(`${gatePrefix}.receipt.json`),
  ...Object.values(gate.outputs).map(verify)];
const draft = read(path.join(edition, 'choice-set/draft.json'));
assert.equal(draft.questions.length, 5);
assert.equal(draft.questions.reduce((sum, item) => sum + item.view.options.length, 0), 20);
assert.equal(review.question_reviews.length, 5);
assert.equal(review.question_reviews.reduce((sum, item) =>
  sum + item.mathematics.option_checks.length, 0), 20);

const retained = path.join(repo,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov21-1846-n44-complete');
assert(!fs.existsSync(retained));
const sidecar = path.join(edition, 'choice-set/review.independent.json');
assert(!fs.existsSync(sidecar));
fs.copyFileSync(reviewPath, sidecar, fs.constants.COPYFILE_EXCL);
fs.chmodSync(sidecar, 0o444);
fs.mkdirSync(retained);
const files = new Map();
const add = file => {
  const item = typeof file === 'string' ? bind(file) : verify(file);
  files.set(item.path, item);
};
oldFiles.forEach(add);
add(sidecar);
for (const entry of progress.n44.stages) {
  add(entry.receipt);
  entry.streams.forEach(add);
}
gateFiles.forEach(add);
for (const name of fs.readdirSync(independent)) {
  const file = path.join(independent, name);
  assert(fs.statSync(file).isFile(), `Unexpected directory: ${file}`);
  add(file);
}
for (const name of ['n44-offline-parent-intake.json', 'n44-offline-closure.json',
  'n44-choice-independent-dispatch.json', 'n44-choice-stage1-parent-intake.json',
  'n44-choice-stage2-parent-intake.json', 'n44-choice-stage3-parent-intake.json',
  'n44-choice-independent-closure.json', 'source162163-affected-native-parent-intake.json',
  'source162-source-parent-intake.json', 'source163-source-parent-intake.json',
  'source163-boundary-native-parent-intake.json', 'source163-independent-math-parent-intake.json',
  'source163-math-comparison-parent-intake.json',
  'source162-native-parent-intake.json',
  'source162163-count-diagnostic/recovery/seal.json',
  'seal-n44.mjs', 'complete-n44.mjs', 'assemble-n44.py']) {
  add(path.join(base, name));
}
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
for (const page of ['0162', '0163'])
  for (const name of ['page.md', 'page.json', 'audit.json'])
    add(path.join(raw, 'pages', page, name));
for (const name of ['lesson.json', 'exercises.json', 'figures.json'])
  add(path.join(raw, 'lessons', lesson, name));
const rows = [];
for (const item of files.values()) {
  const relative = path.relative(repo, item.path);
  assert(!relative.startsWith('..'));
  const target = path.join(retained, 'files', relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(item.path, target, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(target, 0o444);
  assert.equal(bind(target).sha256, item.sha256);
  rows.push({ origin: item.path, path: path.relative(retained, target),
    bytes: item.bytes, sha256: item.sha256 });
}
const inheritedOffline = progress.n44.offline.retainedManifest;
verify(inheritedOffline);
const relativeBinding = item => ({ ...item, path: path.relative(repo, item.path) });
const completion = {
  schema: 's10y-offline-lesson-completion@1', date: '2026-11-21', lesson,
  status: 'offline-complete; uncommitted; continue authorized production',
  newCompleteLessonDelta: 1, proseBlocks: 9, exercises: 4, figures: 0,
  answers: { count: 4, auto: 3, ungraded: 1,
    gate: 'Existing finalized answers and original independent written mathematics PASS reused; no answer-stage replay.' },
  interactions: { math: 3, free: 1, authoringPending: 0,
    gate: 'Existing interaction finalize PASS reused; offline written HTML has no answer-display controls.' },
  choices: { questions: 5, options: 20,
    originalReview: { kind: 'self_review',
      binding: relativeBinding(oldFiles.find(item => item.path.endsWith('choice-set/review.json'))) },
    additionalIndependentReview: { ...review.reviewer,
      binding: relativeBinding(bind(sidecar)),
      sourceFirstViewFirstKeyLast: true, outcome: 'pass',
      strictStage3AllowlistCompliance: false,
      retainedProceduralException: 'One generic contract reread; no candidate/answer/review leakage; semantic independence accepted without rereview' },
    gate: relativeBinding(bind(`${gatePrefix}.receipt.json`)),
    losses: draft.coverage,
    initialSelfReviewReclassified: false },
  offline: { assertionVerdict: 'PASS', visualVerdict: 'PASS',
    evidence: relativeBinding(inheritedOffline),
    reviewerClosedAfterFullTextIntake: true, newDisplayRuns: 0,
    newScreenshotViewsOrDecodes: 0,
    intentionallyHorizontalProofScrollers: 'Both ends previously reached; not page overflow',
    liveProductAcceptanceOrAnswerRevealClaim: false },
  inheritedNative: { page162: '21/21 PASS', page163: '25/25 PASS',
    technicalBudget: '4/8 unchanged', knownCumulativePerPage: 7,
    originalFailures: ['162 23/21 FAIL', '163 24/25 FAIL'],
    historicalFailuresRewritten: false, newNativeRuns: 0 },
  bindings: oldFiles.map(relativeBinding),
  preservedHolds: [
    'Original SOURCE/residual/glyph/pixel/ancestry UNKNOWN and historical FAIL/HOLD records unchanged.',
    'Earlier358-362 and four source162 rendered graph answers remain outside n44 and PENDING.',
    'Section45 is excluded and not claimed closed.',
    'Trailing ASCII dots inside two source math spans remain preserved by the math-signature contract.',
    'All unrelated held lessons and dirty edits remain unchanged.'
  ],
  parentImageBudget: 'Permanent24/24;zero new image views/decodes;not reset',
  sourceOrWholeCorpusApproval: false, completeGroup: false, finish: 'review',
  DBPaidPublishMergeDeployTicketClosure: 0,
  next: 'Continue prepared but unexecuted sequential SOURCE164/165; no166 prefetch.'
};
writeNew(path.join(retained, 'completion.json'), completion);
writeNew(path.join(retained, 'manifest.json'), {
  schema: 's10y-evidence-retention@1', lesson,
  status: 'OFFLINE_COMPLETE_NOT_GROUP_OR_TICKET_COMPLETE',
  copied: rows.length, bytes: rows.reduce((sum, row) => sum + row.bytes, 0),
  rows, inheritedOffline: relativeBinding(inheritedOffline),
  completion: relativeBinding(bind(path.join(retained, 'completion.json'))) });
const sealDirectories = directory => {
  for (const item of fs.readdirSync(directory, { withFileTypes: true }))
    if (item.isDirectory()) sealDirectories(path.join(directory, item.name));
  fs.chmodSync(directory, 0o555);
};
sealDirectories(retained);
const entry = { at: new Date().toISOString(), lesson, status: completion.status,
  completion: bind(path.join(retained, 'completion.json')),
  manifest: bind(path.join(retained, 'manifest.json')),
  retainedFiles: rows.length, retainedBytes: rows.reduce((sum, row) => sum + row.bytes, 0),
  additionalIndependentReview: bind(sidecar), initialSelfReviewPreserved: true,
  newCompleteLessonDelta: 1, parentImagesOrDecodes: 0, stageReplays: 0,
  groupComplete: false, finish: 'review', nextSourceDispatched: false };
const key = 'nov21_1846_n44_COMPLETE_final_retention';
assert(!Object.hasOwn(usage, key));
usage[key] = entry;
progress.n44.completion = entry;
progress.n44.status = 'OFFLINE_COMPLETE_PENDING_SMALL_BATCH_DELIVERY';
progress.n44.completeLessonDelta = 1;
progress.new_complete_lesson_delta_after_n17 += 1;
progress.observed_at = entry.at;
progress.status = '1846 n44 offline complete/retained;next sequential SOURCE164/165;not complete group';
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
console.log(JSON.stringify(entry));
