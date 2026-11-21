import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
const lesson = 'ana9-c4-s2-n45';
const edition = path.join(raw, 'editions/modern-us-neutral/lessons', lesson);
const retained = path.join(raw, 'evidence/nov21-1846-n45-complete');
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
assert.equal(progress.n45.completeLessonDelta, 0);
assert.equal(progress.n45.author.closed, true);
assert.equal(progress.n45.independentChoice.closed, true);
assert.equal(progress.n45.offline.closed, true);
assert.equal(progress.source164165.independentMath.closed, true);
assert.equal(progress.source164165.native.closed, true);
assert.equal(progress.source166_affected.closed, true);
assert.deepEqual(progress.source166_affected.glyphRecovery.counts, [22, 22]);
assert.equal(progress.source166_active.native_status, 'PASS');
assert(!fs.existsSync(retained));
const review = read(path.join(edition, 'choice-set/review.json'));
assert.equal(review.reviewer.kind, 'independent_agent');
assert.equal(review.outcome, 'pass');
assert.equal(review.question_reviews.length, 7);
assert.equal(review.question_reviews.reduce((n, question) =>
  n + question.mathematics.option_checks.length, 0), 34);
const offline = read(path.join(base, 'n45-offline/report.json'));
assert.equal(offline.assertionVerdict, 'PASS');
assert.equal(offline.visualVerdict, 'PASS');
assert.equal(offline.network.remoteDependencies, 0);
assert.equal(offline.accounting.actualImageToolViews, 6);
const gatePath = path.join(base, 'stages/n45-current-publication-gate-nov21.receipt.json');
assert.equal(read(gatePath).exitCode, 0);
const answers = read(path.join(edition, 'answer-keys.json'));
assert.equal(answers.status, 'ready');
assert.equal(answers.answers.length, 8);
assert.equal(answers.answers.filter(answer => answer.grading === 'auto').length, 7);
assert.equal(answers.answers.at(-1).grading, 'ungraded');
assert.equal(read(path.join(edition, 'interactions.json')).status, 'ready');

const durableBindings = progress.n45.pipeline.files
  .filter(row => row.path.startsWith('ssot-resources/')).map(verify);
for (const page of ['0164', '0165', '0166']) {
  assert.deepEqual(read(path.join(raw, 'pages', page, 'page.json')),
    read(path.join(base, 'n45-assembly-input/9c/pages', page, 'page.json')));
  assert.deepEqual(read(path.join(raw, 'pages', page, 'audit.json')).errors, []);
  for (const name of ['page.md', 'page.json', 'audit.json'])
    durableBindings.push(bind(path.join(raw, 'pages', page, name)));
}
for (const name of ['seed.json', 'draft.json', 'review.json'])
  durableBindings.push(bind(path.join(edition, 'choice-set', name)));
const inheritedEvidence = [
  'nov21-1846-source164165', 'nov21-1846-native164165',
  'nov21-1846-n45-math', 'nov21-1846-source166',
  'nov21-1846-source166-affected', 'nov21-1846-source166-glyph',
].map(name => bind(path.join(raw, 'evidence', name, 'manifest.json')));

const files = new Map();
const add = file => {
  const row = typeof file === 'string' ? bind(file) : verify(file);
  files.set(row.path, row);
};
for (const row of progress.n45.author.files) add(row);
add(progress.n45.author.manifest);
for (const name of fs.readdirSync(path.join(base, 'n45-choice-independent'))) {
  const file = path.join(base, 'n45-choice-independent', name);
  assert(fs.statSync(file).isFile(), file);
  add(file);
}
for (const name of [
  'n45-controls.mjs', 'n45-controls.first-pipeline-failed.mjs',
  'complete-n45.mjs', 'assemble-n45.py', 'n45-modern-layout.mjs',
  'n45-choice-author-parent-intake.json', 'n45-choice-author-closure.json',
  'n45-choice-independent-dispatch.json', 'n45-choice-stage1-parent-intake.json',
  'n45-choice-stage2-parent-intake.json', 'n45-choice-stage3-parent-intake.json',
  'n45-choice-independent-closure.json', 'n45-answer-gate2.json',
  'n45-pipeline-parent-intake.json', 'n45-choice-approved-materialization.json',
  'n45-offline-dispatch.json', 'n45-offline-parent-intake.json',
  'n45-offline-closure.json', 'n45-offline-recovery-parent-intake.json',
  'source165-request-working/page.md',
  'source165-request-working/page.json',
]) add(path.join(base, name));
for (const name of fs.readdirSync(path.join(base, 'stages'))) {
  if (name.startsWith('n45-') || name.startsWith('source165-request-367373'))
    add(path.join(base, 'stages', name));
}
for (const row of progress.n45.pipeline.files.filter(row => row.path.startsWith('.tmp/'))) add(row);
Object.values(offline.bindings.inputs).forEach(add);
Object.entries(offline.bindings).filter(([key]) => key !== 'inputs')
  .forEach(([, row]) => add(row));
offline.screenshots.forEach(add);
fs.mkdirSync(retained);
const rows = [];
for (const row of files.values()) {
  const relative = path.relative(repo, path.resolve(repo, row.path));
  assert(!relative.startsWith('..'));
  // Durable resources already have canonical owners; only scratch evidence is copied.
  if (relative.startsWith('ssot-resources/')) continue;
  const destination = path.join(retained, 'files', relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.resolve(repo, row.path), destination, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(destination, 0o444);
  assert.equal(bind(destination).sha256, row.sha256);
  rows.push({ origin: row.path, path: path.relative(retained, destination),
    bytes: row.bytes, sha256: row.sha256 });
}
const completion = {
  schema: 's10y-offline-lesson-completion@1', date: '2026-11-21', lesson,
  status: 'OFFLINE_COMPLETE_PENDING_NARROW_TAIL_DELIVERY',
  completeLessonDelta: 1, proseBlocks: 17, displayedParagraphs: 21,
  writtenExercises: 8, originalNumbers: ['367', '368', '369', '370', '371', '372', '373', '374'],
  figures: 0, answers: { count: 8, auto: 7, ungraded: 1, expressionParts: 10,
    gate2: 'Reused previously closed independent mathematics; FIRST finalize PASS.',
    graphConstruction: 'Both374 curves remain ungraded written drawing with concrete standard sketch methods.' },
  interactions: { math: 7, free: 1, authoringPending: 0, firstFinalize: 'PASS' },
  choices: { questions: 7, single: 5, multiple: 2, options: 34, sourceCoverage: 8,
    outcome: 'pass', reviewer: review.reviewer,
    sourceFirstViewFirstKeyLast: true,
    strictCompliance: read(path.join(base, 'n45-choice-independent/stage3-receipt.json')).strictCompliance,
    retainedOriginalAuthorSnapshot: true,
    losses: read(path.join(edition, 'choice-set/draft.json')).coverage,
    additionalReviewerLimitations: [
      'nc02 can be discriminated by p alone; selecting the tuple does not establish independent q and r calculations.',
      'Graph choices do not separately test all symmetry, curvature, inflection and asymptotic-side relationships, or prove graph construction.',
    ] },
  offline: { assertions: 'PASS', actualScreenshotObservations: 'PASS', screenshots: 6,
    independentDisplayReviewerClosedAfterFullTextIntake: true, headless: true,
    limitation: 'Explicit isolated/headless authorization, offline whole-lesson presentation only; no live product or answer-reveal claim.',
    remoteDependencies: 0, parentImageViewsOrDecodes: 0, childImageViews: '6/8;6/24',
    hiddenImageToolAndRendererInternalLoads: 'UNKNOWN',
    mathematicalProofScrollers: 'Both ends reached; not page overflow',
    firstCheckerFailure: offline.firstFailures,
    affectedOnlyRecovery: offline.technicalRecovery,
    originalStageExit: offline.originalStageExit,
    recoveredComparisonStageExit: offline.stageExit },
  inheritedNative: { page164: '25/25 PASS', page165: '21/21 PASS', page166: '22/22 PASS',
    source165Binding: 'Only request ownership367->367-373 changed; old MD/JSON hashes stay historical and are verified against retained originals, not annotated current165.',
    page166FirstFailure: '23/22 FAIL preserved', page166GlyphHolds: 'Original disagreement retained; only two authorized native row views confirmedn>1.',
    known164165CumulativePerPage: 6, known166Cumulative: 12,
    source166ReviewerBudget: '7/8 task;7/24 context', stageReplays: 0 },
  retainedTechnicalFailure: 'FIRST pipeline intake missed actual request-binding stage name; exact-name-only recovery preserved. FIRST offline checker omitted separately rendered374 number in two body comparisons; affected-only saved-DOM recovery passed, no browser or passed-check replay.',
  n44: 'Delivered39e5f6d1; no recount/review; strictCompliance=false retained.',
  n46: 'OPEN_NOT_COMPLETE; tail多项式是处处 remains unfinished; no167+ prefetch.',
  parentImageBudget: 'Permanent24/24, zero new views/decodes; not reset',
  sourceOrWholeCorpusApproval: false, completeGroup: false, finish: 'review',
  DBPaidPublishMergeDeployTicketClosure: 0, inheritedEvidence, durableBindings,
  next: 'Narrow ordinary commit/push, then next actual serial SOURCE167 to continue open46; no speculative future prefetch.',
};
writeNew(path.join(retained, 'completion.json'), completion);
writeNew(path.join(retained, 'manifest.json'), {
  schema: 's10y-evidence-retention@1', lesson, copied: rows.length,
  bytes: rows.reduce((n, row) => n + row.bytes, 0), rows,
  completion: { ...bind(path.join(retained, 'completion.json')), path: 'completion.json' },
  inheritedEvidence, durableBindings, rawByteCopyAndHashIsImageDecoding: false,
});
const seal = directory => {
  for (const child of fs.readdirSync(directory, { withFileTypes: true }))
    if (child.isDirectory()) seal(path.join(directory, child.name));
  fs.chmodSync(directory, 0o555);
};
seal(retained);
const entry = { at: new Date().toISOString(), lesson, status: completion.status,
  completeLessonDelta: 1, completion: bind(path.join(retained, 'completion.json')),
  manifest: bind(path.join(retained, 'manifest.json')), retainedFiles: rows.length,
  retainedBytes: rows.reduce((n, row) => n + row.bytes, 0),
  parentImagesOrDecodes: 0, passedContentStageReplays: 0, completeGroup: false,
  finish: 'review', n44Recount: false, n46Complete: false, nextSourceDispatched: false };
const key = 'nov21_1846_n45_COMPLETE_retention';
assert(!Object.hasOwn(usage, key));
usage[key] = entry;
progress.n45.completion = entry;
progress.n45.completeLessonDelta = 1;
progress.n45.status = entry.status;
progress.new_complete_lesson_delta_after_n17 += 1;
progress.status = '1846 n45 offline-complete; narrow tail delivery then next serial source; not group complete';
progress.observed_at = entry.at;
fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2) + '\n');
fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n');
console.log(JSON.stringify(entry));
