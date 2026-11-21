import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c');
const lesson = 'ana9-c4-s2-n47';
const modern = path.join(book, 'editions/modern-us-neutral/lessons', lesson);
const target = path.join(book, 'evidence/nov21-1846-n47');
const progressPath = path.join(base, 'source-progress.json');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length, sha256: hash(bytes) };
};
const progress = read(progressPath), usage = read(usagePath), n47 = progress.n47;
assert.equal(n47.choiceAuthor.closed, true);
assert.equal(n47.choiceReview.closed, true);
assert.equal(n47.choiceReview.stage3.outcome, 'pass');
assert.equal(n47.offline.closed, true);
assert(!n47.completeOffline);
assert(!fs.existsSync(target));
const firstReport = read(path.join(base, 'n47-offline/report.json'));
assert.equal(firstReport.overallVerdict, 'FAIL');
assert.equal(firstReport.accounting.actualImageToolViews, 6);
assert.equal(n47.choiceVisualFollowup.closed, true);
assert.equal(n47.choiceVisualFollowup.accepted, true);
const report = read(path.join(base, 'n47-choice-visual-followup/report.json'));
assert.equal(report.assertionVerdict, 'PASS');
assert(report.visualVerdict.startsWith('PASS'));
assert.equal(report.accounting.actualImageToolViews, 2);
assert.equal(report.accounting.historicalSartreImageViews, 8);
assert.equal(report.accounting.totalKnownN47ImageViews, 10);
assert.equal(report.accounting.parentImagesOrDecodes, 0);
assert.equal(report.accounting.hiddenBrowserImageInternals, 'UNKNOWN');
assert.equal(report.cleanup.browserClosed, true);
assert.deepEqual(report.unresolvedFailures, []);
const draft = read(path.join(modern, 'choice-set/draft.json'));
const review = read(path.join(modern, 'choice-set/review.json'));
assert.equal(review.outcome, 'pass');
const keys = read(path.join(modern, 'answer-keys.json'));
assert.equal(keys.status, 'ready');
const interactions = read(path.join(modern, 'interactions.json'));
assert.equal(interactions.status, 'ready');
const counts = {
  completeLessons: 1, proseBlocks: read(path.join(modern, 'lesson.json')).prose.length,
  writtenExercises: read(path.join(modern, 'exercises.json')).count,
  writtenRequests: 14, autoParts: keys.answers.reduce((sum, a) => sum + a.parts.length, 0),
  ungradedExercises: keys.answers.filter(a => a.grading === 'ungraded').length,
  choices: draft.questions.length,
  options: draft.questions.reduce((sum, q) => sum + q.view.options.length, 0),
  figures: 0,
};
assert.deepEqual([counts.proseBlocks, counts.writtenExercises, counts.autoParts,
  counts.choices, counts.options], [6, 4, 10, 4, 16]);
const rows = [];
const reusedHeldFiles = [];
const offlineHold = path.join(book, 'evidence/nov21-1846-n47-offline-hold/manifest.json');
assert(n47.offline.holdEvidence);
assert.equal(bind(offlineHold).sha256, n47.offline.holdEvidence.sha256);
const heldFiles = new Map(read(offlineHold).rows.map(row => [row.origin, row]));
const copy = (input, relative) => {
  const binding = bind(input);
  const held = heldFiles.get(binding.path);
  if (held && held.sha256 === binding.sha256 && held.bytes === binding.bytes) {
    reusedHeldFiles.push({
      origin: binding.path,
      path: path.relative(root, path.join(path.dirname(offlineHold), held.path)),
      bytes: binding.bytes, sha256: binding.sha256,
    });
    return;
  }
  const output = path.join(target, 'files', relative);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(input, output, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(output, 0o444);
  rows.push({ origin: binding.path, path: path.relative(target, output),
    bytes: binding.bytes, sha256: binding.sha256 });
};
const copyTree = (input, relative) => {
  for (const item of fs.readdirSync(input, { withFileTypes: true })) {
    const file = path.join(input, item.name), output = path.join(relative, item.name);
    assert(!item.isSymbolicLink(), file);
    if (item.isDirectory()) copyTree(file, output);
    else copy(file, output);
  }
};
fs.mkdirSync(target);
for (const directory of ['n47-choice-author', 'n47-choice-review', 'n47-choice-visual-followup']) {
  copyTree(path.join(base, directory), directory);
}
for (const name of fs.readdirSync(base)) {
  if (/^n47-.*parent-(intake|receipt)\.json$/.test(name)
      || /^n47-offline-.*\.json$/.test(name)) {
    copy(path.join(base, name), `controls/${name}`);
  }
}
for (const name of [
  'assemble-n47.py', 'n47-answer-keys.json', 'n47-production.mjs',
  'n47-choice-control.mjs', 'n47-preview.mjs', 'n47-retain-final.mjs',
  'n47-stage-delivery.mjs', 'n47-parent-operation-notes.json',
  'n47-offline-failure-intake.mjs', 'n47-layout-repair.mjs',
  'n47-layout-repair-first-failed.mjs',
  'n47-record-delivery.mjs',
  'n47-choice-visual-control.mjs',
]) copy(path.join(base, name), `controls/${name}`);
copy(path.join(base, 'n47-preview/manifest.json'), 'controls/n47-preview-manifest.json');
copy(path.join(base, 'n47-preview-repaired/manifest.json'),
  'controls/n47-preview-repaired-manifest.json');
const stageDirectory = path.join(base, 'stages');
for (const name of fs.readdirSync(stageDirectory)) {
  if (name.startsWith('n47-')
      || name.startsWith('source169-post-intake-new-controls-retain.')) {
    copy(path.join(stageDirectory, name), `stages/${name}`);
  }
}
const finalFiles = [];
for (const relative of [
  `lessons/${lesson}/lesson.json`, `lessons/${lesson}/lesson.md`,
  `lessons/${lesson}/exercises.json`,
  ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
    'answer-keys.json', 'answer-keys.audit.json', 'interactions.json',
    'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json']
    .map(name => `editions/modern-us-neutral/lessons/${lesson}/${name}`),
]) finalFiles.push(bind(path.join(book, relative)));
const sourceReferences = [
  'nov21-1846-source168/manifest.json', 'nov21-1846-source168-review-stage1/manifest.json',
  'nov21-1846-source168-review-stage2/manifest.json',
  'nov21-1846-source168-count-repair/manifest.json',
  'nov21-1846-source169/manifest.json', 'nov21-1846-source169-review-stage1/manifest.json',
  'nov21-1846-source169-review-stage2/manifest.json',
  'nov21-1846-source169-post-intake/manifest.json',
].map(name => bind(path.join(book, 'evidence', name)));
sourceReferences.push(bind(offlineHold));
const manifest = {
  schema: 'stemrobin1846/n47-complete-offline@1', at: new Date().toISOString(),
  status: 'N47_COMPLETE_OFFLINE_QUALIFIED_REVIEW_READY', book: '9c', lesson,
  finish: 'review', rows, reusedHeldFiles, finalFiles, sourceReferences, counts,
  strictCompliance: false,
  qualification: 'Complete bounded offline lesson/answers/choices/visual workflow, not a full source glyph/mark-registration census',
  preservedHolds: {
    source168: 'H-B17 exact/fine registration and original15/14 failure retained',
    source169: 'n=1 domain-wording interpretation and glyph/mark provenance/cross-reference UNKNOWN remain separate from prior n47 boundary',
    earlier: 'oldn17; n44 strictCompliance=false; all original FAIL/HOLD/UNKNOWN unchanged',
  },
  offlineScope: report.scope,
  offlineRecovery: {
    originalFirstVerdict: 'FAIL', originalFirstImageObservations: 6,
    originalFirstAssertions: 150, originalFirstNativeClicks: 64,
    zeroImageDiagnosis: true, newAffectedImageObservations: 2,
    historicalSartreImageObservations: 8, freshChoiceFollowupImageObservations: 2,
    totalKnownN47ImageObservations: 10, parentImageObservationsOrDecodes: 0,
    originalFailRetained: true, contentAndBehaviorPassedEvidenceReused: true,
    codeRepair: bind(path.join(root, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')),
    repairedPreview: bind(path.join(base, 'n47-preview-repaired/manifest.json')),
    acceptance: 'Original bounded PASS portions, corrected text/111DOM proof and new standalone choices visual proof; not a whole-gate replay',
  },
  pipelineReplayCount: 0, parentNewImagesOrDecodes: 0,
  knownTracked164169: 46, hiddenImageInternals: 'UNKNOWN',
  databaseOrPublisherOperations: 0, paidCalls: 0,
  noHistoricalRecount: true, completeLessonDelta: 1,
  next: 'Narrow commit/push then actual serial SOURCE170; no n48 completion claim',
};
const manifestPath = path.join(target, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n',
  { flag: 'wx', mode: 0o444 });
const freeze = directory => {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (item.isDirectory()) freeze(path.join(directory, item.name));
  }
  fs.chmodSync(directory, 0o555);
};
freeze(target);
n47.completeOffline = true;
n47.strictCompliance = false;
n47.completeLessonDelta = 1;
n47.counts = counts;
n47.status = manifest.status;
n47.evidence = bind(manifestPath);
progress.status = '1846 n47 complete qualified offline; narrow delivery then serial SOURCE170';
usage.nov21_1846_n47_complete_offline = {
  at: manifest.at, status: manifest.status, lesson, counts,
  strictCompliance: false, evidence: n47.evidence, completeLessonDelta: 1,
  cumulativeTotals: 'Not recounted; this lesson only', finish: 'review',
  parentNewImagesOrDecodes: 0, knownTracked164169: 46,
};
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify({ status: manifest.status, files: rows.length,
  evidence: n47.evidence, counts, strictCompliance: false }));
