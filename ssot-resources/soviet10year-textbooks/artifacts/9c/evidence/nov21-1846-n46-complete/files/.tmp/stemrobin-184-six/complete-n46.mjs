import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
const lesson = 'ana9-c4-s2-n46';
const edition = path.join(raw, 'editions/modern-us-neutral/lessons', lesson);
const retained = path.join(raw, 'evidence/nov21-1846-n46-complete');
const usageFile = path.join(repo, '.intentfold/tickets/STEMROBIN-184/usage.json');
const progressFile = path.join(base, 'source-progress.json');
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
const progress = read(progressFile);
const usage = read(usageFile);
assert.equal(progress.n46.completeLessonDelta, 0);
assert.equal(progress.n46.author.closed, true);
assert.equal(progress.n46.independentChoice.closed, true);
verify(progress.n46.independentChoice.stage2Release);
verify(progress.n46.independentChoice.stage3Release);
assert.equal(progress.n46.independentChoice.repair.finalOutcome, 'pass');
for (const key of ['stage1Release', 'stage1Intake', 'stage2Release', 'stage2Intake'])
  verify(progress.n46.independentChoice.repair[key]);
assert.equal(progress.n46.offline.closed, true);
assert.equal(progress.source167.review.closed, true);
assert.equal(progress.source167.review.approved, true);
assert(progress.source167.review.affectedIntake);
assert.equal(progress.source166_active.native_status, 'PASS');
assert.equal(progress.source166_affected.closed, true);
assert(!fs.existsSync(retained));

const draft = read(path.join(edition, 'choice-set/draft.json'));
const review = read(path.join(edition, 'choice-set/review.json'));
assert.equal(review.reviewer.kind, 'independent_agent');
assert.equal(review.outcome, 'pass');
assert.equal(review.question_reviews.length, draft.questions.length);
const options = draft.questions.reduce((sum, question) => sum + question.view.options.length, 0);
assert.equal(review.question_reviews.reduce((sum, question) =>
  sum + question.mathematics.option_checks.length, 0), options);
const originalStrictCompliance = read(path.join(base,
  'n46-choice-independent/stage3-receipt.json')).strictCompliance;
assert.equal(originalStrictCompliance.status, 'COMPLIANT_WITH_STAGED_SCOPE');
assert.equal(originalStrictCompliance.source_first_view_next_internal_last_with_explicit_parent_gates, true);
assert.equal(originalStrictCompliance.all_prior_frozen_content_unchanged, true);
assert.equal(originalStrictCompliance.zero_images, true);
assert.equal(read(path.join(base, 'n46-choice-independent/review.json')).outcome, 'revise');
const affectedStrictCompliance = read(path.join(base,
  'n46-choice-affected/final-receipt.json')).strictCompliance;
assert.equal(affectedStrictCompliance, true);
const strictCompliance = true;
const offline = read(path.join(base, 'n46-offline/report.json'));
const offlineIntake = read(path.resolve(repo,
  verify(progress.n46.offline.intake).path));
verify(progress.n46.offline.report);
assert.equal(offlineIntake.acceptance.firstStageExit, 1);
assert.equal(offlineIntake.acceptance.recoveredStageExit, 0);
assert.equal(offlineIntake.acceptance.preservedFirstFailures, 6);
assert.equal(offlineIntake.acceptance.recoveredAssertions, 6);
assert.equal(offline.stageExit, 1);
assert.equal(offline.assertionVerdict, 'PASS_WITH_AFFECTED_ONLY_TECHNICAL_RECOVERY');
assert.equal(offline.visualVerdict, 'PASS_WITH_PERMITTED_LOCAL_FORMULA_SCROLLING');
assert.equal(offline.network.remoteDependencies, 0);
assert.equal(offline.accounting.actualImageToolViews, 6);
assert.equal(read(path.join(base,
  'stages/n46-current-publication-gate-nov21.receipt.json')).exitCode, 0);
const answers = read(path.join(edition, 'answer-keys.json'));
assert.equal(answers.status, 'ready');
assert.deepEqual(answers.answers.map(answer => answer.exercise), ['375', '376', '377']);
assert.deepEqual(answers.answers.map(answer => answer.grading), ['auto', 'auto', 'ungraded']);
assert.equal(read(path.join(edition, 'interactions.json')).status, 'ready');
assert.equal(read(path.join(base, 'source167-review/comparison.json')).outcome, 'REVISE');

const inheritedNames = ['nov21-1846-source167', 'nov21-1846-source167-review'];
const inheritedEvidence = inheritedNames.map(name =>
  bind(path.join(raw, 'evidence', name, 'manifest.json')));
const alreadyRetainedOrigins = new Set();
for (const name of inheritedNames)
  for (const row of read(path.join(raw, 'evidence', name, 'manifest.json')).rows)
    alreadyRetainedOrigins.add(path.relative(repo, path.resolve(repo, row.origin)));
const durableBindings = progress.n46.pipeline.files
  .filter(row => row.path.startsWith('ssot-resources/')).map(verify);
for (const name of ['page.md', 'page.json', 'audit.json'])
  durableBindings.push(bind(path.join(raw, 'pages/0167', name)));
for (const name of ['seed.json', 'draft.json', 'review.json'])
  durableBindings.push(bind(path.join(edition, 'choice-set', name)));
durableBindings.push(bind(path.join(raw, 'book.json')));
assert.deepEqual(read(path.join(raw, 'pages/0167/page.json')),
  read(path.join(base, 'n46-assembly-input/9c/pages/0167/page.json')));

const files = new Map();
const add = row => {
  const actual = typeof row === 'string' ? bind(row) : verify(row);
  files.set(actual.path, actual);
};
progress.n46.author.files.forEach(add);
add(progress.n46.author.manifest);
progress.n46.author.stageFiles.forEach(add);
progress.n46.author.historicalFailureReferences.forEach(add);
const directories = [
  'n46-choice-independent', 'n46-choice-repair', 'n46-choice-affected', 'n46-offline',
];
for (const directory of directories)
  for (const entry of fs.readdirSync(path.join(base, directory), { withFileTypes: true }))
    if (entry.isFile()) add(path.join(base, directory, entry.name));
for (const name of [
  'n46-controls.mjs', 'n46-offline-acceptance.mjs', 'complete-n46.mjs', 'assemble-n46.py',
  'materialize-n46-repair.mjs', 'n46-repair-controls.mjs',
  'n46-modern-layout.mjs', 'n46-receipt-lookup-note.json',
  'n46-continuation-read-note.json', 'n46-offline-scope.md',
  'n46-choice-author-parent-intake.json', 'n46-choice-author-technical-parent-intake.json',
  'n46-choice-author-closure.json', 'n46-choice-stage1-parent-intake.json',
  'n46-choice-stage2-parent-intake.json', 'n46-choice-stage3-parent-intake.json',
  'n46-choice-stage2-actual-release.json', 'n46-choice-stage3-actual-release.json',
  'n46-choice-affected-stage1-parent-intake.json', 'n46-choice-affected-stage2-parent-intake.json',
  'n46-choice-affected-stage1-actual-release.json', 'n46-choice-affected-stage2-actual-release.json',
  'n46-choice-independent-closure.json', 'n46-answer-gate2.json',
  'n46-pipeline-parent-intake.json', 'n46-offline-parent-intake.json',
  'n46-offline-closure.json', 'n46-offline-parent-shell-failure.json',
  'source167-canonical-retention.json',
]) add(path.join(base, name));
for (const name of fs.readdirSync(path.join(base, 'stages')))
  if (name.startsWith('n46-') || name.startsWith('source167-'))
    add(path.join(base, 'stages', name));
progress.n46.pipeline.files.filter(row => row.path.startsWith('.tmp/')).forEach(add);
Object.values(offline.bindings.inputs).forEach(add);
Object.entries(offline.bindings).filter(([name]) => name !== 'inputs')
  .forEach(([, row]) => add(row));
offline.screenshots.forEach(add);
fs.mkdirSync(retained);
const rows = [];
for (const row of files.values()) {
  if (!row.path.startsWith('.tmp/') || alreadyRetainedOrigins.has(row.path)) continue;
  const destination = path.join(retained, 'files', row.path);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(repo, row.path), destination, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(destination, 0o444);
  assert.equal(bind(destination).sha256, row.sha256);
  rows.push({ origin: row.path, path: path.relative(retained, destination),
    bytes: row.bytes, sha256: row.sha256 });
}
const completion = {
  schema: 's10y-offline-lesson-completion@1', date: '2026-11-21', lesson,
  status: 'OFFLINE_COMPLETE_PENDING_NARROW_TAIL_DELIVERY', completeLessonDelta: 1,
  proseBlocks: 7, displayedParagraphs: 8, originalNumbers: ['375', '376', '377'],
  writtenExercises: 3, writtenSubparts: 7, figures: 0,
  answers: { count: 3, auto: 2, ungraded: 1, expressionParts: 5,
    gate2: 'Reused closed independent SOURCE167 mathematics plus blind U1/U2 recovery and affected-only repaired input; FIRST finalize PASS.',
    corrected376b: '4x^3-45x^8; both source ninth powers established before author disclosure.',
    graphConstruction: 'BOTH377 written drawings remain ungraded with concrete complete standard-sketch methods.' },
  interactions: { math: 2, free: 1, authoringPending: 0, firstFinalize: 'PASS' },
  choices: { questions: draft.questions.length, options,
    single: draft.questions.filter(question => question.view.mode === 'single').length,
    multiple: draft.questions.filter(question => question.view.mode === 'multiple').length,
    outcome: 'pass', reviewer: review.reviewer, strictCompliance,
    originalStrictCompliance, originalReviewOutcome: 'revise',
    originalMechanicalScope: 'Current draft/review functions on frozen seed only; no CLI freshness pass claimed. Semantic exit3 retained.',
    affectedOnlyRepair: { cycles: 1, changedOptions: 4, reusedUnchangedOptions: 22,
      changedUnits: ['n46-choice-04', 'n46-choice-05', 'source377 coverage'],
      separateChangedViewThenInternalStages: true,
      fullConnectedShapeRecognition: true,
      productionAndIndependentCalculationLossesStillDeclared: true },
    sourceFirstViewFirstKeyLast: true, originalAuthorSnapshotRetained: true,
    coverageAndCapacityLosses: draft.coverage },
  offline: { assertions: offline.assertionVerdict, visual: offline.visualVerdict,
    firstStageExit: 1, preservedFirstFailures: 6, affectedConsoleRecoveryExit: 0,
    affectedConsoleAssertions: 6, actualNativeClicks: 80, screenshots: 6,
    actualViews: '6/8 task;6/24 fresh context', remoteDependencies: 0,
    limitation: 'Authorized isolated/headless whole-lesson offline presentation only; not live-product or answer-reveal acceptance.',
    hiddenImageAndRendererInternalLoads: 'UNKNOWN', parentImagesOrDecodes: 0 },
  source167: { firstNative: '22/22 PASS reused; not source-fidelity approval',
    initialIndependent: 'HOLD U1; first exponent3 and conditional derivatives were wrong and remain historical.',
    blindRecovery: 'One source decode and one tight ROI view before author disclosure resolved BOTH exponents9.',
    originalAllRowComparison: 'REVISE F01;21/22rows and12/13objects agree; original failed author immutable.',
    repair: 'One glyph3->9 in376b; affected-only review PASS; all other bytes/metadata/ownership unchanged.',
    canonical: 'Retained corrected working MD/JSON with unchanged FIRST native audit; no native or passed review replay.',
    knownCharge: 8, knownTracked164165166167: 32,
    originalChild31: 'Retained arithmetic/dispatch discrepancy, not an observed extra operation.',
    hiddenInternals: 'UNKNOWN', reviewerActuallyClosedAfterFullTextIntakes: true },
  preservedTechnicalFailures: [
    'Choice author first inspect used current9c instead of9c, exit2; exact selector-only recovery succeeded without content rollback.',
    'Source reviewer local TEXT delimiter offset failure retained; corrected only failed suffix/header assertions.',
    'Parent read-only mistaken render-receipt and answer-audit names retained in lookup note; actual paths read, no producer replay.',
    'Parent continuation read-only scripts/tools path lookup error and truncated broad reads retained; no producer replay or FULL intake claimed for truncated outputs.',
    'Choice reviewer Stage1 pre-freeze source mirror omitted one closing dollar in definition0; exact failed field/delta retained and restored before freeze; no source math or candidate change.',
    'Affected choice-review bookkeeping expected30 recursive delta paths but observed26; original failure retained and exact changed-path allowlist recovery PASS, without semantic or structural replay.',
    'Offline first stage exit1 retained six CDP CSS.enable file-origin console failures; instrumentation-only diagnosis and six console-only assertions recovered at exit0, without new screenshots or passed visual replay.',
    'Parent offline intake producer succeeded exit0, followed by outer shell exit127 from two unquoted annotation fragments; exact command/errors retained, successful intake reused without replay, reviewer actually closed.',
  ],
  n44: 'Previously delivered; no recount; strictCompliance=false retained.',
  n45: 'Previously deliveredb805588d98f51d272fed4a820877459e7e857ad3; no recount or passed-stage replay.',
  n47: 'OPEN proof ends这时 on167; no168+ source prefetch or complete47 claim.',
  parentImageBudget: 'Permanent24/24, zero new views/decodes; never reset',
  completeGroup: false, sourceOrWholeCorpusApproval: false, finish: 'review',
  DBPaidPublishMergeDeployTicketClosure: 0, inheritedEvidence, durableBindings,
  next: 'Later permitted narrow delivery, then actual serialSOURCE168 to continue open47; no Git operations or speculative future preparation in this continuation.',
};
writeNew(path.join(retained, 'completion.json'), completion);
writeNew(path.join(retained, 'manifest.json'), {
  schema: 's10y-evidence-retention@1', lesson, copied: rows.length, rows,
  bytes: rows.reduce((sum, row) => sum + row.bytes, 0),
  completion: { ...bind(path.join(retained, 'completion.json')), path: 'completion.json' },
  inheritedEvidence, durableBindings, alreadyRetainedSourceEvidenceNotCopiedAgain: true,
  rawByteHashAndCopyIsImageDecoding: false,
});
const seal = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }))
    if (entry.isDirectory()) seal(path.join(directory, entry.name));
  fs.chmodSync(directory, 0o555);
};
seal(retained);
seal(path.join(raw, 'evidence/nov21-1846-source167-review'));
const entry = { at: new Date().toISOString(), lesson, status: completion.status,
  completeLessonDelta: 1, completion: bind(path.join(retained, 'completion.json')),
  manifest: bind(path.join(retained, 'manifest.json')), retainedFiles: rows.length,
  retainedBytes: rows.reduce((sum, row) => sum + row.bytes, 0),
  parentImagesOrDecodes: 0, passedStageReplays: 0,
  sourceReviewRetentionDirectoriesSealedWithoutContentChanges: true,
  sourceOrGroupComplete: false, finish: 'review', previousLessonsRecounted: false,
  source168Dispatched: false };
const key = 'nov21_1846_n46_COMPLETE_retention';
assert(!Object.hasOwn(usage, key));
usage[key] = entry;
progress.n46.completion = entry;
progress.n46.completeLessonDelta = 1;
progress.n46.status = entry.status;
progress.new_complete_lesson_delta_after_n17 += 1;
progress.observed_at = entry.at;
progress.status = '1846 n46 offline complete; awaiting later permitted narrow delivery then serial168; no Git this continuation; not group complete';
fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2) + '\n');
fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n');
console.log(JSON.stringify(entry));
