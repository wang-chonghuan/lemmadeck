import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10c');
const lessonDir = path.join(book, 'editions/modern-us-neutral/lessons/ana10-c6-s2-n81');
const evidenceDir = path.join(book, 'evidence/nov21-1846-n81-production');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const match = row => {
  const file = path.resolve(root, row.path);
  const actual = bind(file);
  assert.equal(actual.sha256, row.sha256 ?? row.byte_sha256);
  if (row.bytes !== undefined) assert.equal(actual.bytes, row.bytes);
  return actual;
};
const write = (file, value) => fs.writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const retain = file => {
  assert(file.startsWith(base + path.sep));
  const target = path.join(evidenceDir, path.relative(base, file));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target)) assert.equal(bind(target).sha256, bind(file).sha256);
  else {
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(target, 0o444);
  }
  return { origin: bind(file), retained: bind(target) };
};
const mode = process.argv[2];
if (mode === 'intake-stage1') {
  const manifestPath = path.join(base, 'n81-choice-review/STAGE1-MANIFEST.json');
  assert.equal(bind(manifestPath).sha256,
    '2928ea511c486eb8fa5f2718d3b9034a481600f41c07c2b19e8488f7bd65cad8');
  const manifest = read(manifestPath);
  assert.equal(manifest.status, 'FROZEN_OPEN');
  assert.equal(manifest.source_resolution.independently_solved, 9);
  assert.equal(manifest.independence_boundary.candidate_access, false);
  assert.equal(manifest.zero_image_ledger.images_opened, 0);
  const files = manifest.artifacts.map(match);
  const sources = manifest.source_inputs.map(match);
  const execution = read(path.join(base, 'n81-choice-review/stage1-execution.json'));
  const out = path.join(base, 'n81-choice-stage1-intake.json');
  write(out, { status: 'NINE_SOURCE_SOLUTIONS_FROZEN_BEFORE_CANDIDATE_ACCESS',
    at: new Date().toISOString(), agent: '01a1fea2-ff64-7433-963a-30d891eb8a47',
    manifest: bind(manifestPath), files, sources, actualExecution: execution,
    substantiveFindings: ['Required shared g1 request starts all tasks from cosine.',
      '64 is the identity; arbitrary unnecessary phase conversion is invalid.',
      '66/67 alternate operation orders require adjusted horizontal displacement.',
      '68 composes all four maps to 5cos(4x-2)-3.',
      'Literal k=1/A remains qualified HOLD_NOT_USED, not an invented convention.'],
    mathematicalProofReplays: 0, images: 0, candidateApproval: false });
  console.log(JSON.stringify({ intake: bind(out) }));
} else if (mode === 'intake-stage2') {
  const manifestPath = path.join(base, 'n81-choice-review/STAGE2-MANIFEST.json');
  assert.equal(bind(manifestPath).sha256,
    'f357993e3e605373ec79c69261952a5a166203735ab5bede3ea0fd2fe330ce33');
  const manifest = read(manifestPath);
  assert.equal(manifest.status, 'FROZEN_OPEN');
  assert.equal(manifest.visible_only_verdicts.outcome, 'pass');
  assert.equal(manifest.independence_boundary.author_key_access, false);
  assert.equal(manifest.coverage.alternatives_checked, 38);
  const files = manifest.artifacts.map(match);
  match(manifest.visible_input);
  const execution = read(path.join(base, 'n81-choice-review/stage2-execution.json'));
  assert.equal(execution.cwd, root);
  assert(execution.executions.every(row => row.exit_code === 0));
  const out = path.join(base, 'n81-choice-stage2-intake.json');
  write(out, { status: 'VISIBLE_FIDELITY_AND_ALL_OPTION_TRUTHS_FROZEN_BEFORE_KEYS',
    at: new Date().toISOString(), agent: '01a1fea2-ff64-7433-963a-30d891eb8a47',
    manifest: bind(manifestPath), files, actualExecution: execution,
    outcome: 'pass', alternatives: 38, trueAlternatives: 13, falseAlternatives: 25,
    qualifications: manifest.visible_only_verdicts.specific_losses,
    images: 0, authorKeysCompared: false, mathematicalProofReplays: 0 });
  console.log(JSON.stringify({ intake: bind(out) }));
} else if (mode === 'intake-stage3') {
  const dir = path.join(base, 'n81-choice-review');
  const manifestPath = path.join(dir, 'STAGE3-MANIFEST.json');
  assert.equal(bind(manifestPath).sha256,
    'f05bb07f396d60a591996682fd6fd83790291865758a2d41d0a136b8a153c41f');
  const manifest = read(manifestPath);
  assert.equal(manifest.semantic_result.outcome, 'pass');
  assert.equal(manifest.semantic_result.option_truths_and_derivations_compared, 38);
  const files = manifest.artifacts.map(match);
  const inputs = manifest.exact_inputs.map(match);
  const receipt = read(path.join(dir, 'validate-first.receipt.json'));
  assert.equal(receipt.cwd, root);
  assert.equal(receipt.exit_code, 0);
  Object.values(receipt.streams).forEach(match);
  const out = path.join(base, 'n81-choice-stage3-intake.json');
  write(out, { status: 'NINE_CHOICES_ALL38_OPTIONS_EXACT_KEY_AND_DERIVATIONS_PASS',
    at: new Date().toISOString(), agent: '01a1fea2-ff64-7433-963a-30d891eb8a47',
    manifest: bind(manifestPath), files, inputs, actualExecution: receipt,
    outcome: 'pass', questions: 9, alternatives: 38, wrongDerivationsChecked: 25,
    qualifications: read(path.join(base, 'n81-choice-stage2-intake.json')).qualifications,
    sourceNotationHoldPreserved: true, independentReview: true, images: 0,
    sourceOptionProofReplays: 0, validatorReplays: 0, actualClosure: 'PENDING_TOOL_CALL' });
  console.log(JSON.stringify({ intake: bind(out), outcome: 'pass' }));
} else if (mode === 'release-keys') {
  assert(fs.existsSync(path.join(base, 'n81-choice-stage2-intake.json')));
  const out = path.join(base, 'n81-choice-key-release.json');
  const files = ['draft.json', 'source-solutions.json', 'source-group-binding.json']
    .map(name => bind(path.join(base, 'n81-choice-author', name)));
  write(out, { status: 'STAGE3_AUTHOR_KEY_COMPARISON_RELEASE_AFTER_VISIBLE_FREEZE',
    stage2Intake: bind(path.join(base, 'n81-choice-stage2-intake.json')),
    stage1Intake: bind(path.join(base, 'n81-choice-stage1-intake.json')), files,
    priorSourceAndOptionProofsReplayed: false });
  console.log(JSON.stringify({ release: bind(out) }));
} else if (mode === 'intake-author') {
  const dir = path.join(base, 'n81-choice-author');
  const manifestPath = path.join(dir, 'manifest.json');
  assert.equal(bind(manifestPath).sha256,
    'a1f4fdb6e84b40c9616b7ddcc15a3f53cbf140fdc535e235014dc9a97d5e8fca');
  const manifest = read(manifestPath);
  const files = manifest.files.map(match);
  const receipt = read(path.join(dir, 'structural-first-receipt.json'));
  assert.equal(receipt.cwd, root);
  assert.equal(receipt.exit_code, 0);
  for (const row of Object.values(receipt.streams))
    match({ ...row, path: path.relative(root, path.resolve(dir, row.path)) });
  assert.equal(manifest.production.covered_source_count, 9);
  assert.equal(manifest.production.source_solution_frozen_before_options, true);
  assert.equal(manifest.production.semantic_approval, false);
  const out = path.join(base, 'n81-choice-author-intake.json');
  write(out, { status: 'NINE_COLD_AUTHORED_QUESTIONS_STRUCTURAL_PASS_ONLY',
    at: new Date().toISOString(), agent: '01a1fea2-55f6-70c1-bb9e-e5b61122fac8',
    manifest: bind(manifestPath), files, actualExecution: receipt,
    seedCanonical: manifest.external_inputs.official_seed.canonical_sha256,
    draftCanonical: receipt.bindings.draft_sha256,
    questions: 9, single: 5, multiple: 4, images: 0,
    groupProjectionLimitationPreserved: true,
    losses: ['Recognition/elimination does not prove independent discovery or writing.',
      '66/67 supply scaling factors; phase and operation-order judgment remain.',
      '68 supplies coordinate meanings, reducing historical wording interpretation.'],
    semanticApproval: false, validatorReplays: 0 });
  console.log(JSON.stringify({ intake: bind(out) }));
} else if (mode === 'close') {
  const [name, agent] = process.argv.slice(3);
  assert(['choice-author', 'choice-review', 'final-visual-review'].includes(name));
  const out = path.join(base, `n81-${name}-closure.json`);
  write(out, { status: 'ACTUAL_CLOSE_AGENT_COMPLETED', agent,
    at: new Date().toISOString(), afterIntake: true, parentImageViewsOrDecodes: 0 });
  console.log(JSON.stringify({ closure: bind(out) }));
} else if (mode === 'project-view') {
  assert(fs.existsSync(path.join(base, 'n81-choice-stage1-intake.json')));
  assert(fs.existsSync(path.join(base, 'n81-choice-author-intake.json')));
  const source = path.join(base, 'n81-choice-author/draft.json');
  const draft = read(source);
  const out = path.join(base, 'n81-choice-visible.json');
  write(out, { schema: 'stemrobin1846/choice-visible-projection@1',
    seed_sha256: draft.seed_sha256,
    questions: draft.questions.map(({ id, source_numbers, view }) =>
      ({ id, source_numbers, view })),
    coverage: draft.coverage });
  const receipt = path.join(base, 'n81-choice-view-release.json');
  write(receipt, { status: 'STAGE2_VISIBLE_ONLY_RELEASE_AFTER_SOURCE_FREEZE',
    sourceIntake: bind(path.join(base, 'n81-choice-stage1-intake.json')),
    authorIntake: bind(path.join(base, 'n81-choice-author-intake.json')),
    draft: bind(source), projection: bind(out), intentAndKeyExposed: false });
  console.log(JSON.stringify({ projection: bind(out), receipt: bind(receipt) }));
} else if (mode === 'intake-visual') {
  const [agent, manifestHash] = process.argv.slice(3);
  const dir = path.join(base, 'n81-final-visual-review');
  const manifestPath = path.join(dir, 'self-excluded-manifest.json');
  assert.equal(bind(manifestPath).sha256, manifestHash);
  const manifest = read(manifestPath);
  const files = ['RESULT.md', 'review.json', 'usage-ledger.json'].map(name => {
    const file = path.join(dir, name);
    const row = manifest.files.find(row => path.resolve(root, row.path) === file);
    assert(row);
    return match(row);
  });
  const reviewPath = path.join(dir, 'review.json');
  const review = read(reviewPath);
  assert.equal(typeof review.accepted, 'boolean');
  const nativePath = path.join(base,
    'n81-final-preview/ana10-c6-s2-n81/browser-evidence.json');
  const native = read(nativePath);
  assert.equal(native.status, 'MECHANICAL_OFFLINE_PASS_VISUAL_REVIEW_PENDING');
  assert.equal(native.browserClosed, true);
  const receiptPath = path.join(base, 'n81-n82-stages/n81-first-final-offline-check.receipt.json');
  const receipt = read(receiptPath);
  assert.equal(receipt.cwd, root);
  assert.equal(receipt.exitCode, 0);
  const out = path.join(base, 'n81-final-visual-intake.json');
  write(out, { status: review.accepted ? 'FINAL_CAPTURED_SURFACES_VISUAL_PASS'
    : 'FINAL_CAPTURED_SURFACES_VISUAL_FAIL_PRESERVED',
    at: new Date().toISOString(), agent, accepted: review.accepted,
    manifest: bind(manifestPath), files, review: bind(reviewPath),
    native: bind(nativePath), execution: bind(receiptPath),
    findings: review.findings, imageUsage: read(path.join(dir, 'usage-ledger.json')),
    parentImageViewsOrDecodes: 0, actualClosure: 'PENDING_TOOL_CALL',
    liveProductOrDatabaseCertification: false });
  console.log(JSON.stringify({ intake: bind(out), accepted: review.accepted }));
} else if (mode === 'prepare-approved-choices') {
  const intake = read(path.join(base, 'n81-choice-stage3-intake.json'));
  assert.equal(intake.outcome, 'pass');
  assert(fs.existsSync(path.join(base, 'n81-choice-review-closure.json')));
  const target = path.join(base, 'n81-choice-approved');
  fs.mkdirSync(target);
  const rows = [
    [path.join(base, 'n81-choice-source/seed.json'), 'seed.json'],
    [path.join(base, 'n81-choice-author/draft.json'), 'draft.json'],
    [path.join(base, 'n81-choice-review/review.json'), 'review.json'],
  ].map(([source, name]) => {
    const destination = path.join(target, name);
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    return { source: bind(source), destination: bind(destination) };
  });
  const out = path.join(base, 'n81-approved-choice-inputs.json');
  write(out, { status: 'EXACT_APPROVED_CHOICES_READY_FOR_OFFICIAL_RETENTION',
    rows, reviewIntake: bind(path.join(base, 'n81-choice-stage3-intake.json')),
    closure: bind(path.join(base, 'n81-choice-review-closure.json')),
    questionReauthoringOrReviewReplays: 0 });
  console.log(JSON.stringify({ inputs: bind(out) }));
} else if (mode === 'complete') {
  assert(!fs.existsSync(path.join(base, 'n81-completion.json')));
  const choiceIntake = read(path.join(base, 'n81-choice-stage3-intake.json'));
  const visual = read(path.join(base, 'n81-final-visual-intake.json'));
  assert.equal(choiceIntake.outcome, 'pass');
  assert.equal(visual.accepted, true);
  for (const name of ['choice-author', 'choice-review', 'final-visual-review'])
    assert(fs.existsSync(path.join(base, `n81-${name}-closure.json`)));
  const previewDir = path.join(base, 'n81-final-preview/ana10-c6-s2-n81');
  const native = read(path.join(previewDir, 'browser-evidence.json'));
  assert.equal(native.status, 'MECHANICAL_OFFLINE_PASS_VISUAL_REVIEW_PENDING');
  assert.equal(native.browserClosed, true);
  assert.equal(native.captures.length, 6);
  const lesson = read(path.join(lessonDir, 'lesson.json'));
  const exercises = read(path.join(lessonDir, 'exercises.json'));
  const figures = read(path.join(lessonDir, 'figures.json'));
  const answers = read(path.join(lessonDir, 'answer-keys.json'));
  const choices = read(path.join(lessonDir, 'choice-set/draft.json'));
  assert.equal(lesson.status, 'ready');
  assert.equal(answers.status, 'ready');
  assert.equal(read(path.join(lessonDir, 'interactions.json')).status, 'ready');
  assert.equal(read(path.join(lessonDir, 'choice-set/review.json')).outcome, 'pass');
  assert.deepEqual(exercises.exercises.map(e => e.number),
    ['60', '61', '62', '63', '64', '65', '66', '67', '68']);
  assert.equal(figures.figures.length, 9);
  assert.equal(answers.answers.length, 9);
  const durableFiles = ['lesson.json', 'exercises.json', 'figures.json',
    'adaptation.audit.json', 'answer-keys.json', 'answer-keys.audit.json',
    'interactions.json', 'choice-set/seed.json', 'choice-set/draft.json',
    'choice-set/review.json'].map(name => bind(path.join(lessonDir, name)));
  const figureFiles = figures.figures.flatMap(figure =>
    ['spec', 'svg', 'render', 'review'].map(key => bind(path.join(book,
      'editions/modern-us-neutral', figure[key]))));
  const retained = [];
  const walk = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile()) {
        if (file === path.join(base, 'n81-choice-author/draft.json')
          || file === path.join(base, 'n81-choice-review/review.json')) continue;
        retained.push(retain(file));
      }
    }
  };
  for (const name of ['n81-choice-author', 'n81-choice-review',
    'n81-final-visual-review', 'n81-final-preview']) walk(path.join(base, name));
  for (const name of ['n81-choice-stage1-intake.json', 'n81-choice-stage2-intake.json',
    'n81-choice-stage3-intake.json', 'n81-choice-author-intake.json',
    'n81-choice-author-closure.json', 'n81-choice-review-closure.json',
    'n81-choice-visible.json', 'n81-choice-view-release.json',
    'n81-choice-key-release.json', 'n81-approved-choice-inputs.json',
    'n81-final-visual-intake.json', 'n81-final-visual-review-closure.json',
    'n81-offline.mjs', 'n81-course.mjs', 'continue-n81.mjs', 'stage-n81.mjs',
    'n81-choice-author-scope.md', 'n81-choice-review-scope.md',
    'n81-final-visual-scope.md']) retained.push(retain(path.join(base, name)));
  for (const stage of ['fig13-durable-review-record', 'n81-first-modern-finalizer',
    'n81-choice-first-inspect', 'n81-choice-first-prepare',
    'n81-first-final-offline-render', 'n81-final-offline-render-argument-recovery',
    'n81-first-choice-retain', 'n81-first-final-offline-build',
    'n81-first-final-offline-check'])
    for (const ext of ['receipt.json', 'stdout.txt', 'stderr.txt'])
      retained.push(retain(path.join(base, 'n81-n82-stages', `${stage}.${ext}`)));
  const completion = {
    schema: 's10y-offline-lesson-completion@1', at: new Date().toISOString(),
    status: 'OFFLINE_COMPLETE_QUALIFIED_REVIEW_ARTIFACTS_NOT_GIT_DELIVERED',
    book: '10c', lesson: 'ana10-c6-s2-n81', finish: 'review',
    completeLessonDelta: 1, whole9c10cCompletionClaim: false, strictCompliance: false,
    proseBlocks: lesson.prose.length, conceptBreaks: lesson.section_breaks.length,
    writtenExercises: exercises.exercises.length,
    originalNumbers: exercises.exercises.map(e => e.number), figures: 9,
    answers: { count: 9,
      auto: answers.answers.filter(a => a.grading === 'auto').length,
      ungraded: answers.answers.filter(a => a.grading === 'ungraded').length,
      exactApprovedMeaningsUnchanged: true },
    interactions: { count: 9, widgets: { free: 8, math: 1 }, ready: true },
    choices: { questions: choices.questions.length,
      options: choices.questions.reduce((n, q) => n + q.view.options.length, 0),
      semanticOutcome: 'pass', qualifications: choiceIntake.qualifications },
    offline: { native: retained.find(row => row.origin.path.endsWith('/browser-evidence.json'))?.retained,
      nativeClicks: native.nativeClicks,
      finalVisualReview: retained.find(row =>
        row.origin.path.endsWith('/n81-final-visual-review/review.json'))?.retained,
      finalVisualImages: 6, figuresReusedWithoutSourceOrRenderReplay: true,
      liveAppKeyboardDatabaseOrServerJudgingCertification: false },
    qualifications: ['Source literal k=1/A remains qualified HOLD; no erratum or hidden ratio convention.',
      'Source O/0 origin codepoints remain UNKNOWN; modern O is declared editorial naming.',
      'Choice recognition/elimination does not demonstrate independent written discovery or construction.',
      'Official seed omits exercise.group; independent author and reviewer bind it separately.'],
    n82: 'Figure21 arc/sweep/vector-endpoint HOLD unchanged; excluded from completion.',
    source172: 'Local HOLD/canonical absent/known charges74 unchanged.',
    source173Plus: 'No new access, preparation or prefetch.',
    parentImages: 'Permanent24/24, zero new views or decodes.',
    paidDbPublicationMergeDeployOrTicketClosure: 0,
    hiddenRasterCharges: 'UNKNOWN', historicalFailuresHoldsUnknownsPreserved: true,
    priorEvidencePackagesRecopied: 0, durableFiles, figureFiles, retained,
  };
  const out = path.join(base, 'n81-completion.json');
  write(out, completion);
  const evidence = retain(out);
  const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
  const usage = read(usagePath);
  usage.nov21_1846_n81_complete = { ...completion, manifest: evidence.retained };
  fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
  console.log(JSON.stringify({ completion: evidence.retained,
    completeLessonDelta: 1, choices: completion.choices.questions,
    options: completion.choices.options }));
} else throw new Error('Unknown n81 continuation mode');
