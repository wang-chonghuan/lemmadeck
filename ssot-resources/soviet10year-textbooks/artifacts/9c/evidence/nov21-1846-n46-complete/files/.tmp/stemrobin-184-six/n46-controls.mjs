import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { acceptOfflineEvidence } from './n46-offline-acceptance.mjs';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
const lesson = 'ana9-c4-s2-n46';
const edition = path.join(raw, 'editions/modern-us-neutral/lessons', lesson);
const author = path.join(base, 'n46-choices-recovered');
const reviewRoot = path.join(base, 'n46-choice-independent');
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
const mode = process.argv[2];
const entry = { at: new Date().toISOString(), lesson,
  parentImagesOrDecodes: 0, parentBudget: 'Permanent24/24;not reset',
  passedStageReplays: 0, completeLessonDelta: 0, finish: 'review',
  originalFailuresHoldsUnknowns: 'PRESERVED', sourceOrGroupComplete: false };
let suffix;
if (mode === 'author-dispatch') {
  assert.equal(progress.source167.review.closed, true);
  assert(!progress.n46);
  entry.agent = process.argv[3];
  entry.name = process.argv[4];
  assert(entry.agent && entry.name);
  entry.status = 'N46_COLD_WHITELIST_ONLY_CHOICE_AUTHOR_DISPATCHED';
  entry.forkContext = false;
  entry.imagesAuthorized = 0;
  entry.closed = false;
  progress.n46 = { status: entry.status, author: entry, completeLessonDelta: 0 };
  suffix = 'choice_author_actual_dispatch';
} else if (mode === 'author-technical-intake') {
  assert(!progress.n46.author.technicalFailure);
  const file = path.join(base, 'n46-choices/manifest.json');
  const manifest = read(file);
  assert.equal(manifest.authoring_status, 'STOPPED_AT_FIRST_INSPECT_FAILURE');
  entry.files = [bind(file)];
  entry.stages = manifest.stages.map(stage => {
    const receipt = read(stage.receipt.path);
    assert.equal(receipt.exitCode, 2);
    entry.files.push(verify(stage.receipt), verify(stage.stdout), verify(stage.stderr));
    return { stage: stage.stage, exitCode: receipt.exitCode };
  });
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  entry.status = 'N46_AUTHOR_FIRST_BAD_BOOK_ID_INSPECT_FAILURE_FULLY_INTAKEN';
  entry.badSelector = 'current9c';
  entry.actualAuthorizedBook = '9c';
  entry.newRecoveryRoot = path.relative(repo, author);
  entry.contentAuthored = 0;
  entry.validationRuns = 0;
  entry.independentApproval = false;
  writeNew(path.join(base, 'n46-choice-author-technical-parent-intake.json'), entry);
  progress.n46.author.technicalFailure = bind(path.join(base, 'n46-choice-author-technical-parent-intake.json'));
  progress.n46.author.recoveryRoot = entry.newRecoveryRoot;
  suffix = 'choice_author_first_failure_FULL_intake';
} else if (mode === 'author-intake') {
  assert.equal(progress.source167.review.closed, true);
  assert.equal(progress.source167.review.approved, true);
  assert(progress.n46.author);
  assert(!progress.n46.author.intake);
  const manifest = read(path.join(author, 'manifest.json'));
  assert.equal(manifest.validation.status, 'PASS');
  assert.equal(manifest.validation.attempt_count, 1);
  assert.equal(manifest.validation.kind, 'STRUCTURAL_ONLY');
  assert.equal(manifest.semantic_approval, 'NOT_GRANTED');
  entry.files = manifest.files.map(verify);
  entry.stageFiles = manifest.stage_files.map(verify);
  entry.sourceSnapshots = manifest.source_snapshots.map(verify);
  entry.historicalFailureReferences = manifest.historical_failure_references.map(verify);
  for (const stage of manifest.stage_commands) {
    const receipt = read(stage.receipt_path);
    assert.equal(receipt.cwd, repo);
    assert.equal(receipt.exitCode, 0);
    Object.values(receipt.outputs).forEach(verify);
  }
  entry.provenanceQualification = 'Child direct-human-message wording denotes parent dispatch/reported intake under existing human ordinary-production authorization; no new direct human prompt.';
  entry.manifest = bind(path.join(author, 'manifest.json'));
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  entry.agent = process.argv[4];
  assert(entry.agent);
  entry.counts = manifest.counts;
  entry.status = 'FULL_N46_AUTHOR_TEXT_INTAKEN_STRUCTURE_ONLY';
  writeNew(path.join(base, 'n46-choice-author-parent-intake.json'), entry);
  progress.n46 = { ...progress.n46, status: entry.status, author: {
    ...progress.n46.author, ...entry, closed: false,
    intake: bind(path.join(base, 'n46-choice-author-parent-intake.json')),
  }, completeLessonDelta: 0 };
  suffix = 'choice_author_FULL_intake';
} else if (mode === 'author-close') {
  assert.equal(progress.n46.author.closed, false);
  entry.agent = progress.n46.author.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.intake = verify(progress.n46.author.intake);
  entry.status = 'N46_AUTHOR_ACTUALLY_CLOSED_AFTER_FULL_TEXT_INTAKE';
  writeNew(path.join(base, 'n46-choice-author-closure.json'), entry);
  progress.n46.author.closed = true;
  progress.n46.author.closure = bind(path.join(base, 'n46-choice-author-closure.json'));
  suffix = 'choice_author_actual_close';
} else if (mode === 'review-dispatch') {
  assert.equal(progress.n46.author.closed, true);
  assert(!progress.n46.independentChoice);
  entry.agent = process.argv[3];
  assert(entry.agent);
  entry.status = 'N46_CHOICE_SOURCE_FIRST_ONLY_DISPATCHED';
  entry.closed = false;
  entry.stage2Released = false;
  entry.stage3Released = false;
  entry.imagesAuthorized = 0;
  entry.seed = bind(path.join(author, 'seed.json'));
  progress.n46.independentChoice = entry;
  suffix = 'choice_independent_dispatch';
} else if (mode === 'review-intake') {
  const stage = Number(process.argv[3]);
  assert([1, 2, 3].includes(stage));
  const current = progress.n46.independentChoice;
  assert.equal(current.closed, false);
  if (stage > 1) assert(current[`stage${stage - 1}Intake`]);
  const names = stage === 1
    ? ['stage1-source.md', 'stage1-source.json', 'stage1-receipt.json']
    : stage === 2
      ? ['stage2-view.md', 'stage2-view.json', 'stage2-receipt.json']
      : ['final-report.md', 'review.json', 'stage3-receipt.json'];
  const receipt = read(path.join(reviewRoot, names.at(-1)));
  entry.receiptFiles = receipt.files.map(verify);
  entry.files = names.map(name => bind(path.join(reviewRoot, name)));
  entry.provenanceQualification = 'Child direct-human/authorization wording denotes parent dispatch and reported facts under the existing human authorization, not new direct human prompts.';
  entry.fullTextConsumption = process.argv[4];
  assert(entry.fullTextConsumption);
  entry.status = `N46_CHOICE_STAGE${stage}_FULL_TEXT_INTAKEN`;
  entry.stage = stage;
  entry.agent = current.agent;
  if (stage === 1) {
    assert.equal(receipt.authorRead, false);
    assert.equal(receipt.viewRead, false);
    const source = read(path.join(reviewRoot, 'stage1-source.json'));
    assert.deepEqual(source.seed_snapshot, read(path.join(author, 'seed.json')));
    assert.equal(source.source_completeness.written_tasks_solved, 7);
    assert.equal(source.source_completeness.derivative_tasks_solved, 5);
    assert.equal(source.source_completeness.graph_construction_analyses_complete, 2);
    entry.recoveredReviewerTranscriptionFailure = 'One missing closing dollar in definition0 restored before freeze; original failure/delta retained; no source math or author candidate change.';
  }
  if (stage === 2) {
    verify(current.stage2Release);
    assert.equal(receipt.authorRead, false);
    assert.equal(receipt.viewRead, true);
    assert.equal(receipt.independent_question_and_option_coverage.options, 26);
    entry.outcome = receipt.visible_only_outcome;
    entry.visibleContentFindings = receipt.visible_content_findings;
    entry.mathematicsScope = 'Every original visible option independently classified before author key; not a fidelity approval.';
  }
  if (stage === 3) {
    const review = read(path.join(reviewRoot, 'review.json'));
    entry.outcome = review.outcome;
    entry.strictCompliance = receipt.strictCompliance;
  }
  const output = path.join(base, `n46-choice-stage${stage}-parent-intake.json`);
  writeNew(output, entry);
  current[`stage${stage}Intake`] = bind(output);
  if (stage < 3) current[`stage${stage + 1}ReadyForRelease`] = true;
  suffix = `choice_stage${stage}_FULL_intake`;
} else if (mode === 'review-release') {
  const stage = Number(process.argv[3]);
  assert([2, 3].includes(stage));
  const current = progress.n46.independentChoice;
  assert.equal(current.closed, false);
  assert(current[`stage${stage - 1}Intake`]);
  assert(!current[`stage${stage}Release`]);
  entry.toolSubmission = process.argv[4];
  assert(entry.toolSubmission);
  entry.agent = current.agent;
  entry.previousFullIntake = verify(current[`stage${stage - 1}Intake`]);
  entry.material = bind(path.join(author, stage === 2 ? 'view-only.json' : 'draft.json'));
  entry.status = stage === 2
    ? 'N46_CHOICE_STAGE2_VIEW_ONLY_ACTUALLY_RELEASED_AFTER_FULL_SOURCE_INTAKE'
    : 'N46_CHOICE_STAGE3_INTERNAL_DRAFT_ACTUALLY_RELEASED_AFTER_FULL_VIEW_INTAKE';
  const output = path.join(base, `n46-choice-stage${stage}-actual-release.json`);
  writeNew(output, entry);
  current[`stage${stage}Released`] = true;
  current[`stage${stage}Release`] = bind(output);
  suffix = `choice_stage${stage}_actual_release`;
} else if (mode === 'review-close') {
  const current = progress.n46.independentChoice;
  assert.equal(current.closed, false);
  entry.intake = verify(current.stage3Intake);
  if (current.repair) {
    entry.affectedIntake = verify(current.repair.stage2Intake);
    entry.affectedOutcome = current.repair.finalOutcome;
  }
  entry.agent = current.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.status = 'N46_CHOICE_REVIEWER_ACTUALLY_CLOSED_AFTER_FULL_STAGED_INTAKES';
  writeNew(path.join(base, 'n46-choice-independent-closure.json'), entry);
  current.closed = true;
  current.closure = bind(path.join(base, 'n46-choice-independent-closure.json'));
  suffix = 'choice_independent_actual_close';
} else if (mode === 'gate2') {
  assert.equal(progress.source167.review.closed, true);
  assert.equal(progress.source167.review.approved, true);
  const keys = read(path.join(edition, 'answer-keys.json'));
  const exercises = read(path.join(edition, 'exercises.json')).exercises;
  assert.equal(keys.status, 'draft');
  assert.deepEqual(exercises.map(exercise => exercise.number), ['375', '376', '377']);
  assert.deepEqual(keys.answers.map(answer => answer.exercise), ['375', '376', '377']);
  const expected = [
    ['4x^3', '3x^2', '4(x-4)^3'],
    ['10x^4-12x^3+14x-5', '4x^3-45x^8'], [],
  ];
  keys.answers.forEach((answer, index) => {
    assert.equal(answer.source, 'derived');
    assert(!answer.bookRaw);
    assert.equal(answer.grading, index === 2 ? 'ungraded' : 'auto');
    assert.deepEqual(answer.parts.map(part => part.expected[0]), expected[index]);
    assert(answer.parts.every(part => part.judge === 'expression'));
    assert(answer.displayAnswer.length > 0);
  });
  entry.status = 'N46_ANSWER_GATE2_PASS_REUSED_CLOSED_INDEPENDENT_MATH';
  entry.answerDraft = bind(path.join(edition, 'answer-keys.json'));
  entry.exerciseInput = bind(path.join(edition, 'exercises.json'));
  entry.reusedEvidence = [
    progress.source167.review.stage1Intake,
    progress.source167.review.recovery.intake,
    progress.source167.review.stage2Intake,
    progress.source167.review.affectedIntake,
  ].map(verify);
  entry.checks = {
    derivatives: 'Five labelled results independently verified;375c also expands as polynomial, no dependence on an untaught chain rule.',
    glyph: '376b BOTH ninth powers established in ONE blind ROI; old first3 and conditional derivatives retained as failures; affected-only repair checked.',
    graphA: 'zeros0double,2simple;extrema(0,0),(4/3,-32/27);inflection(2/3,-16/27);correct tails,signs,monotonicity,curvature and shifted central symmetry.',
    graphB: 'zeros0,+/-sqrt6;extrema(-sqrt2,4sqrt2),(sqrt2,-4sqrt2);origin inflection and odd symmetry;correct tails and monotonicity.',
    grading: '375/376auto,5expressionparts;BOTH377drawings remain ungraded with concrete standard sketch instructions.',
    inputContract: 'No exact parts; FIRST finalize owns real expression-parser check.',
  };
  writeNew(path.join(base, 'n46-answer-gate2.json'), entry);
  progress.n46.answerGate2 = bind(path.join(base, 'n46-answer-gate2.json'));
  suffix = 'answer_Gate2';
} else if (mode === 'pipeline-intake') {
  assert(progress.n46.answerGate2);
  assert(!progress.n46.pipeline);
  const stages = [
    'n46-first-scoped-assembly-nov21', 'n46-first-raw-retention-nov21',
    'n46-first-adapt-prepare-nov21', 'n46-first-modern-layout-nov21',
    'n46-first-prose-flow-nov21', 'n46-first-modern-boundaries-nov21',
    'n46-first-adapt-finalize-nov21', 'n46-first-lesson-render-nov21',
    'n46-answer-first-prepare-nov21', 'n46-answer-gate2-first-nov21',
    'n46-answer-first-finalize-nov21', 'n46-interactions-first-prepare-nov21',
    'n46-interactions-first-finalize-nov21',
  ];
  entry.stages = stages.map(stage => {
    const file = path.join(base, 'stages', `${stage}.receipt.json`);
    const receipt = read(file);
    assert.equal(receipt.cwd, repo);
    assert.equal(receipt.exitCode, 0);
    return { stage, receipt: bind(file),
      streams: Object.values(receipt.outputs).map(verify) };
  });
  entry.files = [
    ...['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
      bind(path.join(raw, 'lessons', lesson, name))),
    ...fs.readdirSync(edition).map(name => bind(path.join(edition, name))),
    ...['text.html', 'exercises.html'].map(name => bind(path.join(repo,
      '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral', lesson, name))),
    ...['assemble-n46.py', 'n46-modern-layout.mjs', 'n46-receipt-lookup-note.json',
      'source167-written-derived.md', 'source167-written-recovery-addendum.md']
      .map(name => bind(path.join(base, name))),
  ];
  assert.equal(read(path.join(edition, 'answer-keys.audit.json')).status, 'pass');
  assert.equal(read(path.join(edition, 'answer-keys.json')).status, 'ready');
  const interactions = read(path.join(edition, 'interactions.json'));
  assert.equal(interactions.status, 'ready');
  assert.deepEqual(interactions.interactions.map(row => row.widget), ['math', 'math', 'free']);
  entry.status = 'N46_FIRST_TEXT_ANSWER_INTERACTION_PIPELINE_FULL_RESULTS_INTAKEN';
  entry.counts = { proseBlocks: 7, displayedParagraphs: 8, exercises: 3,
    auto: 2, ungraded: 1, expressionParts: 5, figures: 0 };
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  entry.assemblyWarning = 'TOC47 starts on boundary page160 but deliberately excluded because its proof is OPEN after这时; no complete47 claim.';
  writeNew(path.join(base, 'n46-pipeline-parent-intake.json'), entry);
  progress.n46.pipeline = { ...entry,
    intake: bind(path.join(base, 'n46-pipeline-parent-intake.json')) };
  suffix = 'pipeline_FULL_intake';
} else if (mode === 'choice-materialize') {
  assert.equal(progress.n46.independentChoice.closed, true);
  const current = progress.n46.independentChoice;
  const finalReview = current.finalReview
    ? path.resolve(repo, verify(current.finalReview).path)
    : path.join(reviewRoot, 'review.json');
  const finalDraft = current.approvedDraft
    ? path.resolve(repo, verify(current.approvedDraft).path)
    : path.join(author, 'draft.json');
  assert.equal(read(finalReview).outcome, 'pass');
  if (current.repair) assert.equal(current.repair.finalOutcome, 'pass');
  const target = path.join(base, 'n46-choice-approved');
  assert(!fs.existsSync(target));
  fs.mkdirSync(target);
  entry.files = ['seed.json', 'draft.json', 'review.json'].map(name => {
    const input = name === 'review.json' ? finalReview
      : name === 'draft.json' ? finalDraft : path.join(author, name);
    const destination = path.join(target, name);
    fs.copyFileSync(input, destination, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(destination, 0o444);
    assert.equal(bind(input).sha256, bind(destination).sha256);
    return bind(destination);
  });
  fs.chmodSync(target, 0o555);
  entry.status = current.repair
    ? 'N46_APPROVED_ONCE_REPAIRED_CHOICES_MATERIALIZED_ORIGINAL_REVISE_PRESERVED'
    : 'N46_APPROVED_UNCHANGED_CHOICES_MATERIALIZED';
  progress.n46.approvedChoices = entry;
  suffix = 'choice_approved_materialization';
} else if (mode === 'offline-dispatch') {
  assert.equal(progress.n46.independentChoice.closed, true);
  assert(!progress.n46.offline);
  assert.equal(read(path.join(base,
    'stages/n46-choice-first-retention-nov21.receipt.json')).exitCode, 0);
  entry.agent = process.argv[3];
  entry.name = process.argv[4];
  assert(entry.agent && entry.name);
  entry.status = 'N46_ONE_FRESH_BOUNDED_OFFLINE_DISPLAY_BATCH_DISPATCHED';
  entry.imagesAuthorized = 6;
  entry.batchLimit = 8;
  entry.contextLimit = 24;
  entry.closed = false;
  progress.n46.offline = entry;
  suffix = 'offline_actual_dispatch';
} else if (mode === 'offline-intake') {
  const reportFile = path.join(base, 'n46-offline/report.json');
  const report = read(reportFile);
  entry.acceptance = acceptOfflineEvidence(repo, base, report);
  entry.report = bind(reportFile);
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  entry.status = 'N46_FULL_OFFLINE_TEXT_INTAKEN_WITH_SIX_FIRST_CONSOLE_FAILURES_AND_AFFECTED_RECOVERY_PASS';
  writeNew(path.join(base, 'n46-offline-parent-intake.json'), entry);
  progress.n46.offline.intake = bind(path.join(base, 'n46-offline-parent-intake.json'));
  progress.n46.offline.report = entry.report;
  suffix = 'offline_FULL_intake';
} else if (mode === 'offline-close') {
  const current = progress.n46.offline;
  assert.equal(current.closed, false);
  entry.intake = verify(current.intake);
  entry.agent = current.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.status = 'N46_OFFLINE_REVIEWER_ACTUALLY_CLOSED_AFTER_FULL_TEXT_INTAKE';
  writeNew(path.join(base, 'n46-offline-closure.json'), entry);
  current.closed = true;
  current.closure = bind(path.join(base, 'n46-offline-closure.json'));
  suffix = 'offline_actual_close';
} else {
  throw new Error('Explicit supported control mode required');
}
const key = `nov21_1846_n46_${suffix}`;
assert(!Object.hasOwn(usage, key));
usage[key] = entry;
progress.observed_at = entry.at;
fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2) + '\n');
fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n');
console.log(JSON.stringify({ status: entry.status, files: entry.files?.length,
  outcome: entry.outcome, strictCompliance: entry.strictCompliance,
  parentImagesOrDecodes: 0, completeLessonDelta: 0 }));
