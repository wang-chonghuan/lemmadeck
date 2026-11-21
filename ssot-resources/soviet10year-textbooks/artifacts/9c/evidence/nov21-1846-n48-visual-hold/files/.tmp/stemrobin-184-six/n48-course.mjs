import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const lesson = 'ana9-c4-s2-n48';
const raw = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
const scoped = path.join(base, 'n48-course-artifacts/9c');
const progressPath = path.join(base, 'source-progress.json');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const writeNew = (file, value) => fs.writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const progress = read(progressPath), usage = read(usagePath);
const [mode, agent, detail] = process.argv.slice(2);
const output = path.join(base, `n48-course-${mode}-receipt.json`);
assert(!fs.existsSync(output));
const entry = {
  schema: 'stemrobin1846/n48-course-local-stage@1', at: new Date().toISOString(),
  lesson, mode, finish: 'review', strictCompliance: false,
  parentImagesOrDecodes: 0, paidCalls: 0, source173PlusAccess: 0,
  databasePublicationGitMergeDeployOrTicketClosure: 0,
  historicalFailHoldUnknownPreserved: true, completeLessonDelta: 0,
};
if (mode === 'raw-promote') {
  assert(progress.n48.scienceReview.closed && progress.n48.scienceReview.stage2);
  assert.equal(progress.n48.scienceReview.scopedScienceAccepted, true);
  const recovered = path.join(base, 'n48-assembly-recovery/9c');
  const target = path.join(raw, 'lessons', lesson);
  assert(!fs.existsSync(target));
  const exercises = read(path.join(recovered, 'lessons', lesson, 'exercises.json'));
  assert.deepEqual(exercises.exercises.map(item => item.number),
    ['382', '383', '384', '385', '386', '387']);
  assert.deepEqual(exercises.exercises[5].pages, ['p0170#16', 'p0171#1']);
  fs.mkdirSync(target);
  entry.files = ['lesson.json', 'lesson.md', 'exercises.json'].map(name => {
    const source = path.join(recovered, 'lessons', lesson, name);
    const destination = path.join(target, name);
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(bind(destination).sha256, bind(source).sha256);
    return bind(destination);
  });
  fs.mkdirSync(path.join(scoped, 'lessons'), { recursive: true });
  fs.mkdirSync(path.join(scoped, 'pages'));
  fs.symlinkSync(target, path.join(scoped, 'lessons', lesson), 'dir');
  for (const page of ['0169', '0170', '0171'])
    fs.symlinkSync(path.join(raw, 'pages', page), path.join(scoped, 'pages', page), 'dir');
  fs.symlinkSync(path.join(recovered, 'book.json'), path.join(scoped, 'book.json'));
  entry.status = 'N48_RECOVERED_RAW_RETAINED_SCIENCE_QUALIFIED_NO_ASSEMBLER_REPLAY';
  entry.scopedInputs = 'Only n48 and its three bound source pages; symlink references, no old evidence copies or source173+ intake';
  entry.identityBridge = progress.n48.recovery.identity;
  entry.assemblyEvidence = progress.n48.assemblyEvidence;
  entry.scienceEvidence = progress.n48.scienceReview.stage2.manifest;
  progress.n48.rawPromotion = entry;
} else if (mode === 'modern-firstfail') {
  assert(progress.n48.rawPromotion && !progress.n48.modernFirstFailure);
  const stage = path.join(base, 'stages/n48-first-modern-finalize.receipt.json');
  assert.equal(read(stage).exitCode, 2);
  const work = path.join(base,
    'n48-course-work/adapt/9c/modern-us-neutral/lessons', lesson);
  const audit = path.join(scoped,
    'editions/modern-us-neutral/lessons', lesson, 'adaptation.audit.json');
  const target = path.join(base, 'n48-modern-first-failure');
  fs.mkdirSync(target);
  entry.files = [audit, ...['lesson.template.json', 'exercises.template.json',
    'figures.template.json'].map(name => path.join(work, name))].map(source => {
      const destination = path.join(target, path.basename(source));
      fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(destination, 0o444);
      return bind(destination);
    });
  fs.chmodSync(target, 0o555);
  entry.status = 'N48_FIRST_MODERN_FAILURE_CYRILLIC_ENUMERATION_RETAINED';
  entry.stage = bind(stage);
  entry.cause = 'Modern387 prose retains Cyrillic enumeration; mathematics unchanged';
  entry.indexFailure = bind(path.join(base, 'stages/n48-first-source-index-update.receipt.json'));
  entry.indexRecovery = bind(path.join(base, 'stages/n48-source-index-interpreter-recovery.receipt.json'));
  entry.indexRecoveryCause = 'Original wrapper accidentally invoked node on Python executable; actual p2c did not start; corrected interpreter only';
  progress.n48.modernFirstFailure = entry;
} else if (mode === 'modern-promote') {
  assert(progress.n48.rawPromotion && !progress.n48.modern);
  const generated = path.join(scoped, 'editions/modern-us-neutral/lessons', lesson);
  const target = path.join(raw, 'editions/modern-us-neutral/lessons', lesson);
  assert(!fs.existsSync(target));
  const audit = read(path.join(generated, 'adaptation.audit.json'));
  assert.equal(audit.status, 'pass');
  assert.equal(audit.exercises, 6);
  assert.equal(audit.figures, 0);
  fs.mkdirSync(target);
  entry.files = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => {
      const source = path.join(generated, name), destination = path.join(target, name);
      fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
      assert.equal(bind(destination).sha256, bind(source).sha256);
      return bind(destination);
    });
  entry.status = 'N48_MODERN_EDITION_FINALIZED_ONCE_RETAINED_INDEX_PENDING';
  entry.sourceSnapshot = progress.n48.rawPromotion.files;
  entry.sourceConvention = 'Conditional answer explanation pending; no source theorem/glyph rewrite';
  progress.n48.modern = entry;
} else if (mode === 'answer-gate2') {
  assert(progress.n48.modern && progress.n48.scienceReview.scopedScienceAccepted);
  assert(!progress.n48.answerGate2);
  const folder = path.join(scoped, 'editions/modern-us-neutral/lessons', lesson);
  const exercises = read(path.join(folder, 'exercises.json'));
  const answers = read(path.join(folder, 'answer-keys.json'));
  assert.deepEqual(answers.answers.map(item => item.exercise),
    exercises.exercises.map(item => item.number));
  assert.deepEqual(answers.answers.map(item => item.grading),
    ['auto', 'auto', 'auto', 'auto', 'ungraded', 'ungraded']);
  assert(answers.answers.every(item => item.displayAnswer && item.source === 'derived'));
  assert.equal(read(path.join(folder, 'figures.json')).figures.length, 0);
  entry.status = 'N48_ANSWER_GATE2_PARENT_SEMANTIC_CHECK_PASSED_ON_REUSED_EVIDENCE';
  entry.answerKeys = bind(path.join(folder, 'answer-keys.json'));
  entry.exercises = bind(path.join(folder, 'exercises.json'));
  entry.checks = [
    'Six unique keys exactly match modern382-387; no figure-dependent values or captured bookRaw claimed',
    'Four derivative results match retained382-385 science, with x!=0 in display and expression-only expected values',
    '386 preserves derivative existence versus literal evaluation and explicit constant versus punctured domain; no forced source convention',
    '387 explains both full branches, extrema scopes, intercepts, limits and asymptotes; no automatic graph grading',
    'No ignored subquestions, finite-sample-only argument, missing standard answer or historical source certainty promotion',
  ];
  entry.derivativeEvidenceReferences = [
    path.join(base, 'source170-review/stage1/math-review.txt'),
    path.join(base, 'source170-review/stage1/exact-results.json'),
  ].map(bind);
  entry.missingScience = progress.n48.scienceReview.stage2.manifest;
  entry.method = 'Parent semantic application of already accepted science to current modern prompts and written display; not a new independent review or scientific check replay';
  entry.mathlive = 'No exact parts; expression contract belongs to first answer finalizer';
  progress.n48.answerGate2 = entry;
} else if (mode === 'answers-promote') {
  assert(progress.n48.answerGate2 && !progress.n48.answers);
  const generated = path.join(scoped, 'editions/modern-us-neutral/lessons', lesson);
  const target = path.join(raw, 'editions/modern-us-neutral/lessons', lesson);
  assert.equal(read(path.join(generated, 'answer-keys.audit.json')).status, 'pass');
  const interactions = read(path.join(generated, 'interactions.json'));
  assert.equal(interactions.status, 'ready');
  entry.files = ['answer-keys.json', 'answer-keys.audit.json', 'interactions.json']
    .map(name => {
      const source = path.join(generated, name), destination = path.join(target, name);
      assert(!fs.existsSync(destination));
      fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
      assert.equal(bind(destination).sha256, bind(source).sha256);
      return bind(destination);
    });
  entry.status = 'N48_SIX_ANSWERS_FOUR_AUTO_TWO_UNGRADED_INTERACTIONS_RETAINED';
  entry.grading = { auto: 4, ungraded: 2, expressionParts: 4 };
  entry.interactionWidgets = interactions.interactions.map(item => item.widget);
  entry.answerGate2 = bind(path.join(base, 'n48-course-answer-gate2-receipt.json'));
  progress.n48.answers = entry;
} else if (mode === 'choice-author-intake') {
  const author = progress.n48.choiceAuthor;
  assert(author && !author.intake && !author.closed);
  assert.equal(agent, author.agent);
  const folder = path.join(base, 'n48-choice-author');
  const manifestPath = path.join(folder, 'outputmanifest.json');
  assert.equal(bind(manifestPath).sha256, detail);
  const manifest = read(manifestPath);
  entry.files = manifest.output_files.filter(row => row.sha256).map(row => {
    const actual = bind(path.resolve(root, row.path));
    assert.equal(actual.sha256, row.sha256);
    assert.equal(actual.bytes, row.bytes);
    return actual;
  });
  assert.equal(manifest.structural_inventory.question_count, 8);
  assert.equal(manifest.structural_inventory.option_count, 32);
  assert.equal(manifest.validation.attempts, 1);
  assert.equal(Number(fs.readFileSync(path.resolve(root, manifest.validation.exit_code), 'utf8')), 0);
  assert.equal(manifest.usage.self_reviews, 0);
  entry.status = 'N48_EIGHT_QUESTION_AUTHOR_INTAKEN_STRUCTURAL_PASS_ONLY';
  entry.manifest = bind(manifestPath);
  entry.seed = bind(path.join(folder, 'seed.json'));
  entry.draft = bind(path.join(folder, 'draft.json'));
  entry.sourceSolutions = bind(path.join(folder, 'source-first-solutions.md'));
  entry.firstTechnicalFailure = bind(path.join(folder, 'first-execution-failure.json'));
  entry.semanticReview = 'NOT_RUN';
  entry.substantiveCoverage = 'Four complete derivative/domain units, two conditional zero-point units, two whole connected graph descriptions; independent-writing/drawing losses declared';
  entry.localizationPending = 'All visible prose currently English; Chinese view-only candidate will receive the first cold semantic review';
  author.intake = entry;
} else if (mode === 'choice-author-close') {
  const author = progress.n48.choiceAuthor;
  assert(author.intake && !author.closed);
  assert.equal(agent, author.agent);
  assert(detail && detail.includes('completed'));
  entry.status = 'N48_CHOICE_AUTHOR_ACTUALLY_CLOSED_AFTER_BOUNDED_INTAKE';
  entry.actualClosure = detail;
  author.closed = true;
  author.closure = entry;
} else if (mode === 'choice-stage1-release') {
  assert(progress.n48.choiceAuthor.closed && !progress.n48.choiceReview);
  entry.status = 'N48_COLD_CHOICE_REVIEW_SOURCE_ONLY_RELEASED';
  entry.seed = progress.n48.choiceAuthor.intake.seed;
  entry.scope = bind(path.join(base, 'n48-choice-review-scope.md'));
  entry.permission = 'Seed and scope only; no author draft/views/solutions/keys, parent answer/science evidence, source images or previous choices';
  entry.imagesAuthorized = 0;
  progress.n48.choiceReview = { stage1Release: entry, closed: false };
} else if (mode === 'localization-intake') {
  assert(progress.n48.choiceAuthor.closed && !progress.n48.localization);
  const file = path.join(base, 'n48-choice-localized/receipt.json');
  const receipt = read(file);
  assert.equal(receipt.questions, 8);
  assert.equal(receipt.options, 32);
  assert.equal(receipt.nonViewFieldsAndCoverageAndCorrectSetsUnchanged, true);
  assert.equal(read(path.join(base,
    'stages/n48-first-localized-choice-structural-check.receipt.json')).exitCode, 0);
  entry.status = 'N48_CHINESE_CHOICE_CANDIDATE_BOUND_FIRST_SEMANTIC_REVIEW_PENDING';
  entry.receipt = bind(file);
  entry.candidate = receipt.candidate;
  entry.mathematicalSpans = receipt.mathematicalSpans;
  entry.firstFailure = receipt.firstFailure;
  entry.recoveryCause = receipt.recoveryCause;
  entry.semanticApproval = false;
  progress.n48.localization = entry;
} else if (mode === 'choice-stage1-intake' || mode === 'choice-stage2-intake') {
  const stage = mode.includes('stage1') ? 1 : 2;
  const review = progress.n48.choiceReview;
  assert(review.agent === agent && !review.closed && !review[`stage${stage}`]);
  if (stage === 2) assert(review.stage2Release);
  const folder = path.join(base, `n48-choice-review/stage${stage}`);
  const manifestPath = path.join(folder, 'manifest.json');
  assert.equal(bind(manifestPath).sha256, detail);
  const manifest = read(manifestPath);
  entry.files = manifest.files.map(row => {
    const actual = bind(path.resolve(root, row.path));
    assert.equal(actual.sha256, row.sha256);
    assert.equal(actual.bytes, row.bytes);
    return actual;
  });
  entry.status = stage === 1 ? 'N48_COLD_CHOICE_SOURCE_SOLUTIONS_INTAKEN'
    : 'N48_COLD_CHOICE_VISIBLE_OPTIONS_AND_TRUE_SETS_INTAKEN_BEFORE_KEYS';
  entry.manifest = bind(manifestPath);
  entry.findings = bind(path.join(folder, 'findings.json'));
  entry.scope = stage === 1
    ? 'Six independent source solutions and two definitions; zero-convention qualification/full connected graph conditions frozen before views'
    : 'All eight visible questions/32 alternatives, purpose/leakage/coverage judgments and full independent true sets frozen before keys';
  entry.intakeMethod = 'Manifest binding and substantive findings; no script/scalar/history reread gate';
  if (stage === 2) {
    const findings = read(path.join(folder, 'findings.json'));
    const solutions = read(path.join(folder, 'option-solutions.json'));
    assert.equal(solutions.question_reviews.length, 8);
    assert.equal(solutions.question_reviews.reduce((sum, question) =>
      sum + question.mathematics.option_checks.length, 0), 32);
    entry.trueSets = solutions.complete_true_sets;
    entry.observedCapacityLosses = findings.package_review.observed_losses;
    entry.visiblePurposeVerdict = findings.package_review.visible_purpose_verdict;
    entry.internalAuthorCoverageStillUnreleased = true;
  }
  review[`stage${stage}`] = entry;
} else if (mode === 'choice-stage2-release') {
  const review = progress.n48.choiceReview;
  assert(review.stage1 && progress.n48.localization && !review.stage2Release);
  const candidate = progress.n48.localization.candidate;
  const draft = read(path.resolve(root, candidate.path));
  const viewPath = path.join(base, 'n48-choice-view-only.json');
  writeNew(viewPath, draft.questions.map(question => ({ id: question.id, view: question.view })));
  fs.chmodSync(viewPath, 0o444);
  entry.status = 'N48_CHOICE_VIEW_ONLY_RELEASED_AFTER_INDEPENDENT_SOURCE_INTAKE';
  entry.viewOnly = bind(viewPath);
  entry.stage1Manifest = review.stage1.manifest;
  entry.permission = 'Only exact viewOnly and own frozen source solutions; full draft, mappings, intents, rationales, coverage and keys remain unreleased';
  review.stage2Release = entry;
} else if (mode === 'choice-stage3-release') {
  const review = progress.n48.choiceReview;
  assert(review.stage2 && !review.stage3Release);
  entry.status = 'N48_EXACT_FULL_CHOICE_DRAFT_RELEASED_AFTER_VISIBLE_MATH_FREEZE';
  entry.draft = progress.n48.localization.candidate;
  entry.stage2Manifest = review.stage2.manifest;
  entry.permission = 'Exact full localized draft and own frozen Stage1/2 only; no parent answers/science, old choices or source images; compare without proof replay';
  review.stage3Release = entry;
} else if (mode === 'choice-stage3-intake') {
  const review = progress.n48.choiceReview;
  assert(review.agent === agent && review.stage3Release && !review.closed && !review.stage3);
  const folder = path.join(base, 'n48-choice-review/stage3');
  const manifestPath = path.join(folder, 'manifest.json');
  assert.equal(bind(manifestPath).sha256, detail);
  const manifest = read(manifestPath);
  entry.files = manifest.files.map(row => {
    const actual = bind(path.resolve(root, row.path));
    assert.equal(actual.sha256, row.sha256);
    assert.equal(actual.bytes, row.bytes);
    return actual;
  });
  const findings = read(path.join(folder, 'findings.json'));
  const semantic = read(path.join(folder, 'review.json'));
  const validation = read(path.join(folder, 'validation.json'));
  assert.equal(semantic.outcome, findings.semantic_outcome);
  assert.equal(semantic.reviewer.kind, 'independent_agent');
  assert.equal(semantic.question_reviews.length, 8);
  assert.equal(semantic.question_reviews.reduce((sum, question) =>
    sum + question.mathematics.option_checks.length, 0), 32);
  assert.deepEqual(semantic.question_reviews.map(question => ({
    question_id: question.question_id, correct: question.mathematics.correct,
  })), review.stage2.trueSets);
  assert.equal(validation.attempts, 1);
  assert.equal(bind(path.join(folder, 'seed.json')).sha256,
    progress.n48.choiceAuthor.intake.seed.sha256);
  assert.equal(bind(path.join(folder, 'draft.json')).sha256,
    progress.n48.localization.candidate.sha256);
  entry.status = `N48_COLD_CHOICE_STAGE3_${semantic.outcome.toUpperCase()}_INTAKEN`;
  entry.outcome = semantic.outcome;
  entry.manifest = bind(manifestPath);
  entry.actualTrio = manifest.actual_trio;
  entry.findings = bind(path.join(folder, 'findings.json'));
  entry.validation = { receipt: bind(path.join(folder, 'validation.json')),
    attempts: validation.attempts, exitCode: validation.exit_code,
    stdout: validation.stdout, stderr: validation.stderr };
  entry.comparisonFindings = findings.comparison_findings;
  entry.preservedQualifications = findings.preserved_qualifications;
  entry.intakeMethod = 'Manifest binding, substantive source/question findings and actual validator result once; no script/scalar/history reread gate or proof replay';
  entry.visualApproval = false;
  review.stage3 = entry;
} else if (mode === 'choice-approved-materialize') {
  const review = progress.n48.choiceReview;
  assert.equal(review.stage3.outcome, 'pass');
  assert.equal(review.stage3.validation.exitCode, 0);
  assert(!progress.n48.choiceApproved);
  const source = path.join(base, 'n48-choice-review/stage3');
  const target = path.join(base, 'n48-choice-approved');
  assert(!fs.existsSync(target));
  fs.mkdirSync(target);
  entry.files = ['seed.json', 'draft.json', 'review.json'].map(name => {
    const input = path.join(source, name), output = path.join(target, name);
    const expected = review.stage3.actualTrio.find(row => row.path.endsWith('/' + name));
    assert.equal(bind(input).sha256, expected.sha256);
    fs.copyFileSync(input, output, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(output, 0o444);
    assert.equal(bind(output).sha256, expected.sha256);
    return bind(output);
  });
  fs.chmodSync(target, 0o555);
  entry.status = 'N48_APPROVED_CHOICE_TRIO_MATERIALIZED_BYTE_IDENTICAL';
  entry.stage3 = review.stage3.manifest;
  entry.officialRetentionPending = true;
  progress.n48.choiceApproved = entry;
} else if (mode === 'choice-retention-intake') {
  assert(progress.n48.choiceApproved && !progress.n48.choices);
  const stagePath = path.join(base, 'stages/n48-first-choice-official-retention.receipt.json');
  const stage = read(stagePath);
  assert.equal(stage.exitCode, 0);
  const target = path.join(raw, 'editions/modern-us-neutral/lessons', lesson, 'choice-set');
  entry.files = ['seed.json', 'draft.json', 'review.json'].map(name => {
    const expected = progress.n48.choiceApproved.files.find(row => row.path.endsWith('/' + name));
    const actual = bind(path.join(target, name));
    assert.equal(actual.sha256, expected.sha256);
    assert.equal(actual.bytes, expected.bytes);
    return actual;
  });
  entry.status = 'N48_APPROVED_CHOICES_OFFICIALLY_RETAINED_VISUAL_PENDING';
  entry.stage = bind(stagePath);
  entry.outputs = stage.outputs;
  entry.questions = 8;
  entry.options = 32;
  entry.method = 'First official retain_choices.py owner/freshness gate; no author, source, science or native replay';
  entry.preservedQualifications = progress.n48.choiceReview.stage3.preservedQualifications;
  progress.n48.choices = entry;
} else if (mode === 'visual-release') {
  const review = progress.n48.choiceReview;
  assert(review.agent === agent && review.stage3 && !review.closed && !review.visualRelease);
  assert.equal(review.stage3.outcome, 'pass');
  assert(progress.n48.offline && progress.n48.choices);
  entry.status = 'N48_SIX_EXISTING_SCREENSHOTS_RELEASED_AFTER_STAGE3_INTAKE';
  entry.scope = bind(path.join(base, 'n48-visual-scope.md'));
  entry.stage3Intake = bind(path.join(base, 'n48-course-choice-stage3-intake-receipt.json'));
  entry.nativeReport = progress.n48.offline.report;
  entry.screenshots = progress.n48.offline.screenshots;
  entry.imagesAuthorized = 6;
  entry.priorReviewerImageViews = 0;
  entry.permission = 'Exactly six existing screenshots, scope and native report; max6 views, no reopens/crops/new raster/source access or gate replay; TEXT return only';
  review.visualRelease = entry;
} else if (mode === 'visual-dispatch') {
  const review = progress.n48.choiceReview;
  assert(review.agent === agent && review.visualRelease && !review.closed && !review.visualDispatch);
  assert(detail);
  entry.status = 'N48_SIX_SCREENSHOT_VISUAL_REVIEW_ACTUALLY_DISPATCHED';
  entry.agent = agent;
  entry.actualSubmission = detail;
  entry.release = bind(path.join(base, 'n48-course-visual-release-receipt.json'));
  review.visualDispatch = entry;
} else if (mode === 'visual-intake') {
  const review = progress.n48.choiceReview;
  assert(review.agent === agent && review.visualDispatch && !review.closed && !review.visual);
  const folder = path.join(base, 'n48-choice-review/visual');
  const manifestPath = path.join(folder, 'manifest.json');
  assert.equal(bind(manifestPath).sha256, detail);
  const manifest = read(manifestPath);
  entry.files = manifest.files.map(row => {
    const actual = bind(path.resolve(root, row.path));
    assert.equal(actual.sha256, row.sha256);
    assert.equal(actual.bytes, row.bytes);
    return actual;
  });
  const report = read(path.join(folder, 'report.json'));
  assert.equal(typeof report.accepted, 'boolean');
  assert(report.imageUsage.views >= 0 && report.imageUsage.views <= 6);
  for (const field of ['reopens', 'crops', 'newRasterCreations', 'sourceImageAccess'])
    assert.equal(report.imageUsage[field], 0);
  if (report.accepted) {
    assert.equal(report.disposition, 'pass');
    assert.equal(report.imageUsage.views, 6);
  }
  entry.status = `N48_OFFLINE_VISUAL_${report.disposition.toUpperCase()}_INTAKEN`;
  entry.accepted = report.accepted;
  entry.disposition = report.disposition;
  entry.manifest = bind(manifestPath);
  entry.report = bind(path.join(folder, 'report.json'));
  entry.findings = bind(path.join(folder, 'findings.json'));
  entry.imageUsage = report.imageUsage;
  entry.imageAccounting = report.imageAccounting;
  entry.technicalEvent = report.technicalEvent;
  entry.observations = report.observations;
  entry.qualifications = report.qualifications;
  entry.intakeMethod = 'Manifest binding and actual screenshot observations/native-report qualifications; parent zero image views/decodes, no visual or browser replay';
  entry.liveProductOrAnswerRevealAcceptance = false;
  review.visual = entry;
} else if (mode === 'choice-review-close') {
  const review = progress.n48.choiceReview;
  assert(review.agent === agent && review.stage3 && review.visual && !review.closed);
  assert(detail && detail.includes('completed'));
  entry.status = 'N48_CHOICE_AND_VISUAL_REVIEWER_ACTUALLY_CLOSED_AFTER_INTAKE';
  entry.actualClosure = detail;
  entry.visualAccepted = review.visual.accepted;
  review.closed = true;
  review.closure = entry;
} else if (mode === 'visual-hold-retain') {
  const review = progress.n48.choiceReview;
  assert(review.closed && review.visual && !review.visualHoldEvidence);
  assert.equal(review.visual.accepted, false);
  assert.equal(progress.n48.completeLessonDelta, 0);
  const target = path.join(raw, 'evidence/nov21-1846-n48-visual-hold');
  assert(!fs.existsSync(target));
  const sources = [
    review.visual.manifest, ...review.visual.files,
    review.visualRelease.scope, progress.n48.offline.report,
    ...progress.n48.offline.screenshots,
    ...['visual-release', 'visual-dispatch', 'visual-intake', 'choice-review-close']
      .map(stage => bind(path.join(base, `n48-course-${stage}-receipt.json`))),
    bind(path.join(base, 'n48-course.mjs')),
  ];
  fs.mkdirSync(target);
  entry.files = sources.map(row => {
    const source = path.resolve(root, row.path), destination = path.join(target, 'files', row.path);
    assert.equal(bind(source).sha256, row.sha256);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(destination, 0o444);
    assert.equal(bind(destination).sha256, row.sha256);
    return { origin: row.path, ...bind(destination) };
  });
  entry.status = 'N48_OFFLINE_VISUAL_HOLD_RETAINED_SEMANTIC_PASS_COMPLETION_PENDING';
  entry.accepted = false;
  entry.disposition = review.visual.disposition;
  entry.findings = review.visual.qualifications;
  entry.imageUsage = review.visual.imageUsage;
  entry.imageAccounting = review.visual.imageAccounting;
  entry.technicalEvent = review.visual.technicalEvent;
  entry.actualReviewerClosure = review.closure.actualClosure;
  entry.priorEvidenceReferences = [review.stage3.manifest, progress.n48.choices.stage,
    ...progress.n48.choices.files];
  entry.priorPackagesRecopied = 0;
  entry.completionScriptExecuted = false;
  entry.source172StateSha256 = crypto.createHash('sha256')
    .update(JSON.stringify(progress.source172)).digest('hex');
  entry.scopeBoundary = 'Visual HOLD only; retained semantic PASS/native PASS are not replayed or demoted. No extra screenshots, repair or diagnostic chain. SOURCE172 local HOLD and SOURCE173+ unread unchanged.';
  const manifestPath = path.join(target, 'manifest.json');
  writeNew(manifestPath, entry);
  fs.chmodSync(manifestPath, 0o444);
  const freeze = directory => {
    for (const item of fs.readdirSync(directory, { withFileTypes: true }))
      if (item.isDirectory()) freeze(path.join(directory, item.name));
    fs.chmodSync(directory, 0o555);
  };
  freeze(target);
  entry.manifest = bind(manifestPath);
  review.visualHoldEvidence = entry;
} else if (mode === 'offline-native-intake') {
  assert(progress.n48.localization && !progress.n48.offline);
  const folder = path.join(base, 'n48-offline');
  const reportPath = path.join(folder, 'report.json');
  const report = read(reportPath);
  assert.equal(report.status, 'PASS_NATIVE_OFFLINE_RENDERING_AND_INPUTS_VISUAL_REVIEW_PENDING');
  assert.equal(report.assertions.length, 6);
  assert(report.assertions.every(item => item.status === 'PASS'));
  assert.equal(report.nativeClicks, 68);
  assert.equal(report.remoteRequests.length, 0);
  assert.equal(report.pageErrors.length, 0);
  assert.equal(report.consoleErrors.length, 0);
  assert.equal(report.bindings.draft.sha256, progress.n48.localization.candidate.sha256);
  entry.status = 'N48_NATIVE_OFFLINE_SIX_STATES_ACCEPTED_VISUAL_PENDING';
  entry.report = bind(reportPath);
  entry.screenshots = report.screenshots.map(row => {
    const actual = bind(path.resolve(root, row.path));
    assert.equal(actual.sha256, row.sha256);
    return { ...row, ...actual };
  });
  entry.assertions = report.assertions;
  entry.nativeClicks = report.nativeClicks;
  entry.remoteRequests = 0;
  entry.liveProductOrAnswerRevealAcceptance = false;
  entry.hiddenBrowserRasterInternals = 'UNKNOWN';
  progress.n48.offline = entry;
} else if (mode === 'choice-review-dispatch') {
  const review = progress.n48.choiceReview;
  assert(review.stage1Release && !review.agent && !review.closed);
  assert(agent && detail);
  entry.status = 'N48_COLD_CHOICE_REVIEW_SOURCE_ONLY_ACTUALLY_DISPATCHED';
  entry.agent = agent;
  entry.nickname = detail;
  entry.historyFork = false;
  review.agent = agent;
  review.dispatch = entry;
} else if (mode === 'choice-author-dispatch') {
  assert(progress.n48.modern && !progress.n48.choiceAuthor);
  assert(agent && detail);
  entry.status = 'N48_COLD_MODERN_PROSE_ONLY_CHOICE_AUTHOR_ACTUALLY_DISPATCHED';
  entry.agent = agent;
  entry.nickname = detail;
  entry.historyFork = false;
  entry.closed = false;
  entry.scope = bind(path.join(base, 'n48-choice-author-scope.md'));
  entry.allowedInputs = progress.n48.modern.files;
  entry.imagesViewsDecodesOrNewFiguresAuthorized = 0;
  progress.n48.choiceAuthor = entry;
} else throw new Error(`Unsupported mode: ${mode}`);
writeNew(output, entry);
progress.n48.status = entry.status;
progress.status = `${entry.status}; SOURCE172 local HOLD unchanged; SOURCE173+ unread`;
usage[`nov21_1846_n48_course_${mode}`] = entry;
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify({ status: entry.status, receipt: bind(output),
  files: entry.files, completeLessonDelta: entry.completeLessonDelta }));
