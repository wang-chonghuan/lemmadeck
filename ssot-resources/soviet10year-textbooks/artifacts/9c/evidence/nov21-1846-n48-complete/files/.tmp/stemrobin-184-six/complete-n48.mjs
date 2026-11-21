import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const candidate = path.join(base, 'n48-display-resume');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const writeNew = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const usage = read(usagePath);
const [mode, agent, detail] = process.argv.slice(2);
const key = 'nov21_1846_n48_display_resume';
if (mode === 'intake') {
  assert(!usage[key]);
  const folder = path.join(candidate, 'review');
  const manifestPath = path.join(folder, 'manifest.json');
  assert.equal(bind(manifestPath).sha256, detail);
  const manifest = read(manifestPath);
  const files = manifest.files.map(row => {
    const actual = bind(path.resolve(root, row.path));
    assert.equal(actual.sha256, row.sha256);
    assert.equal(actual.bytes, row.bytes);
    return actual;
  });
  const reportPath = path.join(folder, 'report.json');
  const report = read(reportPath);
  const executionPath = path.join(candidate, 'affected/execution.json');
  const execution = read(executionPath);
  assert.equal(typeof report.accepted, 'boolean');
  const views = report.imageUsage.views;
  assert(views >= 0 && views <= 8);
  usage[key] = {
    schema: 'stemrobin1846/n48-affected-display-intake@1',
    at: new Date().toISOString(), agent, closed: false,
    status: `AFFECTED_DISPLAY_${report.disposition.toUpperCase()}_INTAKEN`,
    accepted: report.accepted, disposition: report.disposition,
    manifest: bind(manifestPath), report: bind(reportPath), files,
    execution: bind(executionPath), actualExecutionStatus: execution.status,
    findings: report.findings, actualExecution: report.actualExecution,
    imageUsage: report.imageUsage,
    candidate: bind(path.join(candidate, 'receipt.json')),
    oldIgnoredDraftReconstructedNotRecovered: true,
    oldFullProgressNotReconstructed: true,
    parentImageViewsOrDecodes: 0, completeLessonDelta: 0,
    method: 'One manifest/status and substantive affected finding intake; no source/scientific/choice/original native replay or scalar/script/history gate',
  };
  writeNew(path.join(candidate, 'intake.json'), usage[key]);
} else if (mode === 'close') {
  const entry = usage[key];
  assert(entry && entry.agent === agent && !entry.closed);
  assert(detail && detail.includes('completed'));
  entry.closed = true;
  entry.actualClosure = detail;
  writeNew(path.join(candidate, 'reviewer-closure.json'), { agent, actualClosure: detail,
    at: new Date().toISOString(), accepted: entry.accepted });
} else if (mode === 'complete') {
  const review = usage[key];
  assert(review && review.closed && review.accepted);
  assert.equal(review.actualExecutionStatus, 'PASS_AFFECTED_NATIVE_EXECUTION_INDEPENDENT_VISUAL_REVIEW_PENDING');
  assert(!usage.nov21_1846_n48_complete);
  const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
  const edition = path.join(book, 'editions/modern-us-neutral/lessons/ana9-c4-s2-n48');
  const approved = ['raw-promote', 'modern-promote', 'answers-promote', 'choice-retention-intake']
    .flatMap(stage => usage[`nov21_1846_n48_course_${stage}`].files);
  const durableFiles = approved.map(row => {
    const actual = bind(path.resolve(root, row.path));
    assert.equal(actual.sha256, row.sha256);
    assert.equal(actual.bytes, row.bytes);
    return actual;
  });
  assert.equal(usage['nov21_1846_n48_course_choice-stage3-intake'].outcome, 'pass');
  const lesson = read(path.join(edition, 'lesson.json'));
  const exercises = read(path.join(edition, 'exercises.json'));
  const answers = read(path.join(edition, 'answer-keys.json'));
  const interactions = read(path.join(edition, 'interactions.json'));
  const draft = read(path.join(edition, 'choice-set/draft.json'));
  assert.equal(lesson.prose.length, 14);
  assert.deepEqual(exercises.exercises.map(item => item.number), ['382', '383', '384', '385', '386', '387']);
  assert.equal(answers.answers.length, 6);
  assert.equal(answers.answers.filter(item => item.grading === 'auto').length, 4);
  assert.equal(interactions.status, 'ready');
  assert.equal(draft.questions.length, 8);
  assert.equal(draft.questions.reduce((sum, question) => sum + question.view.options.length, 0), 32);
  const target = path.join(book, 'evidence/nov21-1846-n48-complete');
  assert(!fs.existsSync(target));
  const inputs = [];
  const walk = directory => {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, item.name);
      if (item.isDirectory()) walk(file);
      else if (item.isFile()) inputs.push(file);
    }
  };
  walk(candidate);
  inputs.push(...['n48-display-resume.mjs', 'n48-display-affected-check.mjs', 'complete-n48.mjs']
    .map(name => path.join(base, name)));
  fs.mkdirSync(target);
  const rows = inputs.map(file => {
    const origin = bind(file), destination = path.join(target, 'files', origin.path);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(destination, 0o444);
    assert.equal(bind(destination).sha256, origin.sha256);
    return { origin: origin.path, ...bind(destination) };
  });
  const completion = {
    schema: 's10y-offline-lesson-completion@1', at: new Date().toISOString(),
    lesson: 'ana9-c4-s2-n48', book: '9c', finish: 'review',
    status: 'OFFLINE_COMPLETE_QUALIFIED_REVIEW_ARTIFACTS_NOT_GIT_DELIVERED',
    completeLessonDelta: 1, historicalCompletionDelta4Unchanged: true,
    strictCompliance: false, proseBlocks: 14, conceptBreaks: lesson.section_breaks.length,
    writtenExercises: 6, originalNumbers: exercises.exercises.map(item => item.number),
    figures: read(path.join(edition, 'figures.json')).figures.length,
    answers: { count: 6, auto: 4, ungraded: 2, source: 'derived',
      convention: '386 remains conditional; no unconditional historical0^0/n=0 interpretation',
      graphs: '387 drawing tasks retain complete ungraded construction explanations' },
    interactions: { count: 6, ready: true },
    choices: { questions: 8, options: 32, semanticOutcome: 'pass',
      capacityLosses: usage['nov21_1846_n48_course_choice-stage3-intake'].preservedQualifications },
    offline: {
      originalNative: read(path.join(candidate, 'receipt.json')).reusedNativeReport,
      nativeClicks: 68, originalSixStateDisplayObservationsReused: true,
      oldVisualHold: usage['nov21_1846_n48_course_visual-hold-retain'].manifest,
      affectedReview: review, extraNativeHorizontalWheelActions: 1,
      parentImageViewsOrDecodes: 0, hiddenBrowserRasterInternals: 'UNKNOWN',
      liveProductDatabaseOrAnswerRevealAcceptance: false,
    },
    recovery: {
      missingIgnoredMetadataAndDraftNotClaimedRecovered: true,
      completionDraftReconstructedFromExistingPlanUsageAndDurableEvidence: true,
      completeOldTemporaryProgressNotReconstructed: true,
      missingRenderTechnicalStageRebuiltWithOriginalInputHashesMatched: true,
      installedRepair: 'db61360143e803e746f5fe47700dee24beb80c22',
    },
    historicalFailHoldUnknownPreserved: true,
    source172: 'Local HOLD unchanged; scientific/count/punctuation/radical claims not promoted',
    source173Plus: 'No new source-page access during n48 completion',
    parentPermanentImageBudget: '24/24 unchanged',
    paidDatabasePublicationMergeDeployOrTicketClosure: 0,
    whole9c10cCompletionClaim: false,
    priorEvidenceReferences: [usage['nov21_1846_n48_course_visual-hold-retain'].manifest,
      usage.nov21_1846_n48_assembly_recovery_retention.manifest],
    priorPackagesRecopied: 0, durableFiles, rows,
  };
  const manifestPath = path.join(target, 'manifest.json');
  writeNew(manifestPath, completion);
  fs.chmodSync(manifestPath, 0o444);
  const freeze = directory => {
    for (const item of fs.readdirSync(directory, { withFileTypes: true }))
      if (item.isDirectory()) freeze(path.join(directory, item.name));
    fs.chmodSync(directory, 0o555);
  };
  freeze(target);
  usage.nov21_1846_n48_complete = { ...completion, manifest: bind(manifestPath) };
} else throw new Error(`Unsupported mode ${mode}`);
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify({ mode, status: usage.nov21_1846_n48_complete?.status || usage[key]?.status,
  completeLessonDelta: usage.nov21_1846_n48_complete?.completeLessonDelta || 0,
  completionManifest: usage.nov21_1846_n48_complete?.manifest }));
