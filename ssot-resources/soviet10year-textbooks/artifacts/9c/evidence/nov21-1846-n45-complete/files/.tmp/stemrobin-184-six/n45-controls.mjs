import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const lesson = 'ana9-c4-s2-n45';
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
const edition = path.join(raw, 'editions/modern-us-neutral/lessons', lesson);
const author = path.join(base, 'n45-choices');
const reviewRoot = path.join(base, 'n45-choice-independent');
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
const save = (suffix, entry) => {
  const key = `nov21_1846_n45_${suffix}`;
  assert(!Object.hasOwn(usage, key));
  usage[key] = entry;
  progress.observed_at = entry.at;
  fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2) + '\n');
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n');
  console.log(JSON.stringify(entry));
};
const entry = { at: new Date().toISOString(), lesson,
  parentImagesOrDecodes: 0, parentBudget: 'Permanent24/24;not reset',
  passedStageReplays: 0, completeLessonDelta: 0, finish: 'review' };

if (mode === 'author-intake') {
  assert(!progress.n45);
  const manifest = read(path.join(author, 'manifest.json'));
  assert.equal(manifest.status.first_structural_validation, 'pass');
  assert.equal(manifest.status.validation_attempts, 1);
  assert.equal(manifest.status.self_review, false);
  entry.files = manifest.files.map(verify);
  entry.manifest = bind(path.join(author, 'manifest.json'));
  entry.counts = manifest.counts;
  entry.fullTextConsumption = ['fc88f6-partial-truncated', '015c1e-full-draft',
    '1bce4d-full-solutions', '4d37bc-manifest', '4ebe28-seed-and-view'];
  for (const stage of manifest.stages) {
    const receipt = read(path.resolve(repo, stage.receipt));
    assert.equal(receipt.cwd, repo);
    assert.equal(receipt.exitCode, 0);
    Object.values(receipt.outputs).forEach(verify);
  }
  entry.agent = '01a1fbec-0251-7291-be61-133a340bcf5f';
  entry.name = 'Laplace';
  entry.status = 'FULL_AUTHOR_TEXT_INTAKEN_STRUCTURE_ONLY_READY_FOR_CLOSE';
  writeNew(path.join(base, 'n45-choice-author-parent-intake.json'), entry);
  progress.n45 = { status: 'MODERN_TEXT_PASS_ANSWERS_DRAFT_CHOICES_AUTHOR_INTAKEN',
    author: { ...entry, intake: bind(path.join(base, 'n45-choice-author-parent-intake.json')),
      closed: false }, completeLessonDelta: 0 };
  save('choice_author_FULL_intake', entry);
} else if (mode === 'author-close') {
  assert.equal(progress.n45.author.closed, false);
  entry.agent = progress.n45.author.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.status = 'ACTUALLY_CLOSED_AFTER_FULL_AUTHOR_TEXT_INTAKE';
  entry.intake = verify(progress.n45.author.intake);
  writeNew(path.join(base, 'n45-choice-author-closure.json'), entry);
  progress.n45.author.closed = true;
  progress.n45.author.closure = bind(path.join(base, 'n45-choice-author-closure.json'));
  save('choice_author_actual_close', entry);
} else if (mode === 'review-dispatch') {
  assert.equal(progress.n45.author.closed, true);
  assert(!progress.n45.independentChoice);
  entry.agent = process.argv[3];
  entry.name = process.argv[4];
  assert(entry.agent && entry.name);
  entry.status = 'SOURCE_FIRST_ONLY_ACTUALLY_DISPATCHED';
  entry.seed = bind(path.join(author, 'seed.json'));
  entry.stage2Released = false;
  entry.stage3Released = false;
  entry.closed = false;
  entry.imagesAuthorized = 0;
  writeNew(path.join(base, 'n45-choice-independent-dispatch.json'), entry);
  progress.n45.independentChoice = entry;
  save('choice_independent_dispatch', entry);
} else if (mode === 'review-intake') {
  const stage = Number(process.argv[3]);
  assert([1, 2, 3].includes(stage));
  const names = stage === 1
    ? ['stage1-source.json', 'stage1-source.md', 'stage1-receipt.json']
    : stage === 2
      ? ['stage2-view.json', 'stage2-view.md', 'stage2-receipt.json']
      : ['review.json', 'final-report.md', 'stage3-receipt.json'];
  const current = progress.n45.independentChoice;
  assert.equal(current.closed, false);
  if (stage > 1) assert(current[`stage${stage - 1}Intake`]);
  const receipt = read(path.join(reviewRoot, names.at(-1)));
  receipt.files.forEach(verify);
  entry.files = names.map(name => bind(path.join(reviewRoot, name)));
  entry.fullTextConsumption = process.argv[4];
  assert(entry.fullTextConsumption);
  entry.agent = current.agent;
  entry.stage = stage;
  entry.status = `FULL_CHOICE_STAGE${stage}_TEXT_INTAKEN`;
  if (stage === 3) {
    const review = read(path.join(reviewRoot, 'review.json'));
    assert.equal(review.reviewer.kind, 'independent_agent');
    entry.outcome = review.outcome;
    entry.strictCompliance = receipt.strictCompliance;
  }
  const output = path.join(base, `n45-choice-stage${stage}-parent-intake.json`);
  writeNew(output, entry);
  current[`stage${stage}Intake`] = bind(output);
  current.status = entry.status;
  if (stage < 3) current[`stage${stage + 1}Released`] = true;
  save(`choice_stage${stage}_FULL_intake`, entry);
} else if (mode === 'review-close') {
  const current = progress.n45.independentChoice;
  assert.equal(current.closed, false);
  entry.intake = verify(current.stage3Intake);
  entry.agent = current.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.status = 'ACTUALLY_CLOSED_AFTER_FULL_STAGED_CHOICE_INTAKES';
  writeNew(path.join(base, 'n45-choice-independent-closure.json'), entry);
  current.closed = true;
  current.closure = bind(path.join(base, 'n45-choice-independent-closure.json'));
  save('choice_independent_actual_close', entry);
} else if (mode === 'gate2') {
  assert.equal(progress.source164165.independentMath.closed, true);
  assert.equal(progress.source164165.native.closed, true);
  assert.equal(progress.source166_active.native_status, 'PASS');
  assert.equal(progress.source166_affected.closed, true);
  assert.deepEqual(progress.source166_affected.glyphRecovery.counts, [22, 22]);
  const keys = read(path.join(edition, 'answer-keys.json'));
  const exercises = read(path.join(edition, 'exercises.json')).exercises;
  assert.equal(keys.status, 'draft');
  assert.deepEqual(keys.answers.map(item => item.exercise),
    exercises.map(item => item.number));
  const expected = [
    ['\\frac{1}{5}', '-\\frac{3}{4}'], ['2', '-\\frac{7}{2}'],
    ['\\frac{6x-6}{5}', '\\frac{12x-5}{7}'], ['12x-7'],
    ['\\frac{9x^2+40x-83}{30}'], ['6(2x-3)^2'], ['6x-12x^3'], [],
  ];
  keys.answers.forEach((answer, index) => {
    assert.equal(answer.source, 'derived');
    assert(!answer.bookRaw);
    assert.equal(answer.grading, index === 7 ? 'ungraded' : 'auto');
    assert.deepEqual(answer.parts.map(part => part.expected[0]), expected[index]);
    assert(answer.parts.every(part => part.judge === 'expression'));
    assert(answer.displayAnswer.length > 0);
  });
  entry.status = 'GATE2_PASS_REUSED_INDEPENDENT_MATHEMATICS_NO_REVIEW_REPLAY';
  entry.answerDraft = bind(path.join(edition, 'answer-keys.json'));
  entry.exerciseInput = bind(path.join(edition, 'exercises.json'));
  entry.reusedEvidence = [
    progress.source164165.independentMath.intake,
    progress.source166_affected.intake,
    progress.source166_affected.glyphRecovery.intake,
  ].map(verify);
  entry.checks = {
    identity: 'Exact367-374 ordered one-to-one match, derived sources; no bookRaw or figures.',
    derivatives: '367 slopes1/5,-3/4;368 slopes2,-7/2;369 both product terms;37012x-7;371 three contributions sum(9x^2+40x-83)/30;372 three equal factors each contribute2(2x-3)^2;3736x(1-x^2)-6x^3.',
    parts: '10 independent expression parts with clear a/b or derivative labels and LaTeX values.',
    graphA: 'x!=0, no axis intersections, asymptotesx=0/y=x, extrema(-1,-2)/(1,2), correct split monotonic intervals, branch positions and disconnected range.',
    graphB: 'x!=0, unique zero/inflection(-cuberoot2,0), negative branch strictly decreases ontoR, right branch minimum(1,3) not global, quadratic asymptote not an oblique line.',
    grading: '7auto/1ungraded; two graph constructions remain ungraded with concrete sketch instructions.',
    inputContract: 'No exact candidates, hence no MathLive exact edit transaction required; expression parser check belongs to FIRST finalize.',
    display: 'Concrete methods, points, domains and both branches included, not generic advice.',
  };
  writeNew(path.join(base, 'n45-answer-gate2.json'), entry);
  progress.n45.answerGate2 = bind(path.join(base, 'n45-answer-gate2.json'));
  save('answer_Gate2', entry);
} else if (mode === 'choice-materialize') {
  assert.equal(progress.n45.independentChoice.closed, true);
  const review = read(path.join(reviewRoot, 'review.json'));
  assert.equal(review.outcome, 'pass');
  const target = path.join(base, 'n45-choice-approved');
  assert(!fs.existsSync(target));
  fs.mkdirSync(target);
  entry.files = ['seed.json', 'draft.json', 'review.json'].map(name => {
    const source = path.join(name === 'review.json' ? reviewRoot : author, name);
    const destination = path.join(target, name);
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(destination, 0o444);
    assert.equal(bind(source).sha256, bind(destination).sha256);
    return bind(destination);
  });
  fs.chmodSync(target, 0o555);
  entry.status = 'APPROVED_UNCHANGED_CHOICE_SNAPSHOT_MATERIALIZED_FOR_OFFICIAL_RETENTION';
  entry.originalAuthorSnapshotUnchanged = true;
  writeNew(path.join(base, 'n45-choice-approved-materialization.json'), entry);
  progress.n45.approvedChoices = entry;
  save('choice_approved_materialization', entry);
} else if (mode === 'offline-dispatch') {
  assert.equal(progress.n45.independentChoice.closed, true);
  assert(!progress.n45.offline);
  const receipt = read(path.join(base, 'stages/n45-choice-first-retention-nov21.receipt.json'));
  assert.equal(receipt.exitCode, 0);
  entry.agent = process.argv[3];
  entry.name = process.argv[4];
  assert(entry.agent && entry.name);
  entry.status = 'ONE_FRESH_OFFLINE_DISPLAY_BATCH_ACTUALLY_DISPATCHED';
  entry.imagesAuthorized = 8;
  entry.expectedScreenshotViews = 6;
  entry.newContextLimit = 24;
  entry.closed = false;
  entry.retentionReceipt = bind(path.join(base, 'stages/n45-choice-first-retention-nov21.receipt.json'));
  writeNew(path.join(base, 'n45-offline-dispatch.json'), entry);
  progress.n45.offline = entry;
  save('offline_actual_dispatch', entry);
} else if (mode === 'offline-recovery-intake') {
  const root = path.join(base, 'n45-offline');
  const recovery = read(path.join(root, 'written-number-recovery.json'));
  assert.equal(recovery.originalStageExit, 1);
  assert.equal(recovery.correctedAssertionVerdict, 'PASS');
  assert.equal(recovery.affectedChecks.length, 2);
  assert.deepEqual(recovery.unresolvedFailures, []);
  assert.equal(recovery.browserRuns, 0);
  entry.files = ['diagnosis.json', 'evidence.json', 'written-number-recovery.json',
    'recover-written-number.mjs'].map(name => bind(path.join(root, name)));
  entry.stageReceipts = ['n45-first-offline-check-nov21',
    'n45-offline-written-number-recovery-nov21'].map(stage => {
    const receipt = read(path.join(base, 'stages', `${stage}.receipt.json`));
    return { receipt: bind(path.join(base, 'stages', `${stage}.receipt.json`)),
      exitCode: receipt.exitCode, streams: Object.values(receipt.outputs).map(verify) };
  });
  assert.deepEqual(entry.stageReceipts.map(stage => stage.exitCode), [1, 0]);
  entry.fullDiagnosisAndStageTextConsumption = ['597b19', 'f6eedf', '3e0748'];
  entry.evidenceConsumption = 'Complete diagnostic projection, not a full read of raw87930-byte evidence; later finalized report intake remains required.';
  entry.status = 'FIRST_OFFLINE_CHECKER_FAILURE_RETAINED_AFFECTED_ONLY_COMPARISON_PASS';
  entry.originalFailures = recovery.originalFailures;
  entry.affectedChecks = recovery.affectedChecks;
  entry.newBrowserRuns = 0;
  entry.passedAssertionReplays = 0;
  entry.visualVerdict = 'NOT_YET_REVIEWED';
  writeNew(path.join(base, 'n45-offline-recovery-parent-intake.json'), entry);
  progress.n45.offline.recovery = bind(path.join(base, 'n45-offline-recovery-parent-intake.json'));
  save('offline_first_failure_affected_recovery', entry);
} else if (mode === 'offline-intake') {
  const root = path.join(base, 'n45-offline');
  const report = read(path.join(root, 'report.json'));
  assert.equal(report.stageExit, 0);
  assert.equal(report.assertionVerdict, 'PASS');
  assert.equal(report.visualVerdict, 'PASS');
  assert.deepEqual(report.failures, []);
  assert.equal(report.network.remoteDependencies, 0);
  assert.equal(report.accounting.actualImageToolViews, 6);
  assert.equal(report.screenshots.length, 6);
  entry.fullTextConsumption = process.argv[3];
  assert(entry.fullTextConsumption);
  entry.report = bind(path.join(root, 'report.json'));
  const finalizeReceiptPath = path.join(base, 'stages/n45-first-offline-finalize-nov21.receipt.json');
  const finalizeReceipt = read(finalizeReceiptPath);
  assert.equal(finalizeReceipt.exitCode, 0);
  entry.finalizeReceipt = bind(finalizeReceiptPath);
  entry.finalizeStreams = Object.values(finalizeReceipt.outputs).map(verify);
  entry.inputs = Object.values(report.bindings.inputs).map(verify);
  entry.outputs = Object.entries(report.bindings).filter(([key]) => key !== 'inputs')
    .map(([, value]) => verify(value));
  entry.screenshots = report.screenshots.map(screenshot => {
    assert.equal(screenshot.actualToolViews, 1);
    assert.equal(screenshot.visualVerdict, 'PASS');
    return { ...screenshot, ...verify(screenshot) };
  });
  entry.status = 'FULL_OFFLINE_PRESENTATION_TEXT_INTAKEN_READY_FOR_ACTUAL_CLOSE';
  entry.assertionVerdict = report.assertionVerdict;
  entry.visualVerdict = report.visualVerdict;
  entry.actualChildImageViews = 6;
  entry.knownChildScreenshotHashStreams = 12;
  entry.hashStreamsAreImageDecoding = false;
  entry.originalStageExit = report.originalStageExit;
  entry.firstFailures = report.firstFailures;
  entry.affectedOnlyRecovery = report.technicalRecovery;
  entry.childBudget = '6/8 task;6/24 context;hidden internals UNKNOWN';
  entry.actualProductAcceptance = false;
  writeNew(path.join(base, 'n45-offline-parent-intake.json'), entry);
  progress.n45.offline.intake = bind(path.join(base, 'n45-offline-parent-intake.json'));
  progress.n45.offline.report = entry.report;
  progress.n45.offline.status = entry.status;
  save('offline_FULL_intake', entry);
} else if (mode === 'offline-close') {
  const current = progress.n45.offline;
  assert.equal(current.closed, false);
  entry.intake = verify(current.intake);
  entry.agent = current.agent;
  entry.toolReceipt = process.argv[3];
  assert(entry.toolReceipt);
  entry.status = 'ACTUALLY_CLOSED_AFTER_FULL_OFFLINE_TEXT_INTAKE';
  writeNew(path.join(base, 'n45-offline-closure.json'), entry);
  current.closed = true;
  current.closure = bind(path.join(base, 'n45-offline-closure.json'));
  save('offline_actual_close', entry);
} else if (mode === 'pipeline-intake') {
  const stages = [
    'source165-request-367373-binding-nov21',
    'n45-first-scoped-assembly-nov21', 'n45-first-raw-text-retention-nov21',
    'n45-first-adapt-prepare-nov21', 'n45-first-modern-layout-nov21',
    'n45-first-prose-flow-nov21', 'n45-first-section-boundaries-nov21',
    'n45-first-adapt-finalize-nov21', 'n45-first-lesson-render-nov21',
    'n45-answer-first-prepare-nov21', 'n45-answer-gate2-first-nov21',
    'n45-answer-first-finalize-nov21',
    'n45-interactions-first-prepare-nov21', 'n45-interactions-first-finalize-nov21',
  ];
  entry.stages = stages.map(stage => {
    const file = path.join(base, 'stages', `${stage}.receipt.json`);
    const receipt = read(file);
    assert.equal(receipt.cwd, repo);
    assert.equal(receipt.exitCode, 0, stage);
    return { stage, receipt: bind(file), streams: Object.values(receipt.outputs).map(verify) };
  });
  entry.files = [
    ...['lesson.json', 'lesson.md', 'exercises.json'].map(name =>
      path.join(raw, 'lessons', lesson, name)),
    ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
      'answer-keys.json', 'answer-keys.audit.json', 'interactions.json'].map(name =>
      path.join(edition, name)),
    ...['text.html', 'exercises.html'].map(name =>
      path.join(repo, '.tmp/ld-s10y-lesson/render/9c/modern-us-neutral', lesson, name)),
  ].map(bind);
  const answers = read(path.join(edition, 'answer-keys.json'));
  const interactions = read(path.join(edition, 'interactions.json'));
  assert.equal(answers.status, 'ready');
  assert.equal(interactions.status, 'ready');
  entry.status = 'RAW_MODERN_ANSWERS_INTERACTIONS_RENDER_PASS_CHOICES_DISPLAY_PENDING';
  entry.technicalRecovery = {
    firstFailure: bind(path.join(base, 'stages/n45-pipeline-full-intake-nov21.receipt.json')),
    failedScript: bind(path.join(base, 'n45-controls.first-pipeline-failed.mjs')),
    cause: 'Stage-name prefix lookup missed actual source165-request-367373-binding receipt.',
    fix: 'Use exact retained receipt name; no content/native/assembly/render replay.',
  };
  entry.counts = { proseBlocks: 17, displayedParagraphs: 21, exercises: 8,
    figures: 0, auto: 7, ungraded: 1, expressionParts: 10, math: 7, free: 1 };
  writeNew(path.join(base, 'n45-pipeline-parent-intake.json'), entry);
  progress.n45.pipeline = { ...entry, intake: bind(path.join(base, 'n45-pipeline-parent-intake.json')) };
  progress.n45.status = entry.status;
  save('pipeline_passes_intake', entry);
} else {
  throw new Error('Unknown control mode');
}
