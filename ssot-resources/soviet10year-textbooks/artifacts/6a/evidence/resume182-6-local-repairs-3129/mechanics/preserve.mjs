import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-182-six-3129/lemmadeck';
assert.equal(process.cwd(), root);
const base = '.tmp/ld-s10y-lesson/resume182-6-3129/local-repairs-FIRST';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = filename => JSON.parse(fs.readFileSync(filename));
const baseline = read(`${base}/before/baseline.json`);
const runtime = read(`${base}/display-FIRST/result.json`);
const observed = read(`${base}/visual-observations-FIRST.json`);
assert.equal(runtime.status, 'RUNTIME_PASS_VISUAL_PENDING');
assert.equal(runtime.ownedBrowsersClosed, true);
assert.equal(observed.imageViews, runtime.screenshots.length);
assert.equal(observed.status, 'AFFECTED_ONLY_DISPLAY_PASS');
const targets = [
  ['6a', 'alg6-c2-s1-n8'],
  ['8a', 'alg8-c3-s3-n20'],
];
const evidenceRoot = book =>
  `ssot-resources/soviet10year-textbooks/artifacts/${book}/evidence/resume182-6-local-repairs-3129`;
const targetRoot = (book, lesson) =>
  `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral/lessons/${lesson}`;
const ref = filename => {
  const bytes = fs.readFileSync(filename);
  return { path: filename, sha256: hash(bytes), bytes: bytes.length };
};
const save = (filename, bytes) => {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, bytes, { flag: 'wx' });
  return ref(filename);
};
const keep = (book, source, name) =>
  save(`${evidenceRoot(book)}/${name}`, fs.readFileSync(source));
for (const [book] of targets) assert.ok(!fs.existsSync(evidenceRoot(book)));

const allowed = new Set(targets.flatMap(([book, lesson]) => [
  'adaptation.audit.json', 'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json',
  ...(book === '6a' ? ['exercises.json', 'answer-keys.json', 'answer-keys.audit.json']
    : ['lesson.json', 'choice-set/retention.json', 'offline-display.json', 'offline/text.html']),
].map(name => `${targetRoot(book, lesson)}/${name}`)));
const changedBeforeBinding = baseline.retained.filter(item => hash(fs.readFileSync(item.path)) !== item.sha256);
assert.ok(changedBeforeBinding.every(item => allowed.has(item.path)));
const priorInputs = baseline.records.map(item => {
  assert.equal(hash(fs.readFileSync(item.snapshot)), item.sha256);
  const blob = execFileSync('git', ['show', `${baseline.head}:${item.path}`],
    { maxBuffer: 8 * 1024 * 1024 });
  assert.equal(hash(blob), item.sha256, `Original Git bytes differ: ${item.path}`);
  return { path: item.path, sha256: item.sha256, bytes: item.bytes, gitCommit: baseline.head };
});
const unchanged = { chapterTwoWrittenExercises: 0, chapterTwoChoiceQuestions: 0 };
for (const item of baseline.retained.filter(item =>
  /\/6a\/editions\/modern-us-neutral\/lessons\/alg6-c2-[^/]+\/exercises.json$/.test(item.path))) {
  const current = read(item.path);
  unchanged.chapterTwoWrittenExercises += current.exercises.length;
  if (item.path.includes('/alg6-c2-s1-n8/')) {
    const old = read(`${base}/before/6a/exercises.json`);
    assert.deepEqual(current.exercises.filter(item => item.number !== '188'),
      old.exercises.filter(item => item.number !== '188'));
    assert.deepEqual(current.source, old.source);
    assert.equal(current.exercises.find(item => item.number === '188').source_text,
      old.exercises.find(item => item.number === '188').source_text);
  } else assert.equal(hash(fs.readFileSync(item.path)), item.sha256);
}
for (const item of baseline.retained.filter(item =>
  /\/6a\/editions\/modern-us-neutral\/lessons\/alg6-c2-[^/]+\/choice-set\/draft.json$/.test(item.path))) {
  const current = read(item.path);
  unchanged.chapterTwoChoiceQuestions += current.questions.length;
  if (item.path.includes('/alg6-c2-s1-n8/')) {
    const old = read(`${base}/before/6a/choice-set/draft.json`);
    for (const key of ['questions', 'coverage', 'new_figures']) assert.deepEqual(current[key], old[key]);
    assert.deepEqual(current.questions.find(item => item.id.endsWith('-188')).key.correct, ['D']);
  } else assert.equal(hash(fs.readFileSync(item.path)), item.sha256);
}
assert.equal(unchanged.chapterTwoWrittenExercises, 233);
assert.equal(unchanged.chapterTwoChoiceQuestions, 266);
const n20 = targetRoot('8a', 'alg8-c3-s3-n20');
const n20Before = read(`${base}/before/8a/lesson.json`);
const n20Current = read(`${n20}/lesson.json`);
assert.deepEqual(n20Current.source, n20Before.source);
assert.deepEqual(n20Current.prose.filter((_, index) => index !== 6),
  n20Before.prose.filter((_, index) => index !== 6));
assert.equal(n20Current.prose[6].source_text, n20Before.prose[6].source_text);
for (const name of ['exercises.json', 'answer-keys.json', 'figures.json']) {
  assert.equal(hash(fs.readFileSync(`${n20}/${name}`)),
    baseline.records.find(item => item.path === `${n20}/${name}`).sha256);
}

const mechanics = [];
for (const name of ['baseline.mjs', 'baseline-failed-FIRST.mjs', 'baseline-failed-RECOVERY1.mjs',
  'check.py', 'check-failed-FIRST.py', 'rebind.py', 'format-bindings.py', 'preserve.mjs',
  'display.mjs', 'self-review-FIRST.md', 'visual-observations-FIRST.json',
  'native-check-FIRST.json', 'binding-check-FIRST.json']) {
  mechanics.push(keep('6a', `${base}/${name}`, `mechanics/${name}`));
}
const executionNames = [
  'baseline-execution-FIRST', 'baseline-execution-RECOVERY1', 'baseline-execution-RECOVERY2',
  'native-check-execution-FIRST', 'native-check-execution-RECOVERY1',
  'rebind-execution-FIRST', 'render-6a-execution-FIRST', 'render-8a-execution-FIRST',
  'display-execution-FIRST', 'format-execution-FIRST',
];
const executions = executionNames.map(name => {
  const source = `.tmp/ld-s10y-lesson/resume182-6-3129/local-repairs-${name}`;
  const receipt = read(`${source}/execution.json`);
  assert.equal(receipt.cwd, root);
  const execution = keep('6a', `${source}/execution.json`, `executions/${name}/execution.json`);
  const streams = Object.fromEntries(Object.entries(receipt.streams).map(([key, value]) => {
    const bytes = fs.readFileSync(value.path);
    assert.equal(hash(bytes), value.sha256);
    return [key, save(`${evidenceRoot('6a')}/executions/${name}/${key}`, bytes)];
  }));
  return { ...execution, exitCode: receipt.exitCode, startedAt: receipt.startedAt,
    endedAt: receipt.endedAt, historicalPathsUnchanged: true, streams };
});
const selfReview = mechanics.find(item => item.path.endsWith('/self-review-FIRST.md'));
const imagesByBook = {};
for (const [book] of targets) {
  imagesByBook[book] = runtime.screenshots
    .filter(item => book === '6a' ? item.target !== 'proof-supplement' : item.target === 'proof-supplement')
    .map(item => {
      const bytes = fs.readFileSync(item.path);
      assert.equal(hash(bytes), item.sha256);
      return { ...save(`${evidenceRoot(book)}/${path.basename(item.path)}`, bytes),
        viewport: item.viewport, target: item.target, verdict: 'PASS',
        observation: observed.observations.find(row => row.image === path.basename(item.path)).observation };
    });
}
const n8Surface = keep('6a', `${base}/display-FIRST/6a-exercises.html`, 'exercises.html');
const newN20Bytes = fs.readFileSync(`${base}/display-FIRST/8a-text.html`);
fs.writeFileSync(`${n20}/offline/text.html`, newN20Bytes);
const n20Surface = ref(`${n20}/offline/text.html`);
const recordFor = book => ({
  schema: 'stemrobin-182/affected-repair@1',
  ticket: 'STEMROBIN-182', book, root, date: new Date().toISOString(),
  status: 'LOCAL_REPAIR_PAUSED_PENDING_INDEPENDENT_CONTENT_REVIEW',
  scope: book === '6a' ? 'N8 written188 and its standard answer' : 'N20 p0114#4 proof supplement',
  sourceAndFigureChanges: 0, priorInputs: priorInputs.filter(item => item.path.includes(`/artifacts/${book}/`)),
  currentInputs: ['lesson.json', 'exercises.json', 'answer-keys.json', 'adaptation.audit.json',
    'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json']
    .map(name => ref(`${targetRoot(book, book === '6a' ? 'alg6-c2-s1-n8' : 'alg8-c3-s3-n20')}/${name}`)),
  nativeEditionAndSnapshotBindings: 'PASS',
  display: { status: 'AFFECTED_ONLY_DISPLAY_PASS', kind: 'self_review',
    surfaces: [book === '6a' ? n8Surface : n20Surface], images: imagesByBook[book],
    runtimeInputsPinnedBeforeCaptures: true },
  independentContentReview: {
    status: 'PENDING', attempted: true, error: 'agent thread limit reached',
    oldPausedReviewersResumedOrClosed: false, selfReview,
  },
  executions, preserved: unchanged,
  usage: { affectedNewImagesViewed: imagesByBook[book].length, reopens: 0,
    sharedFailedImagePathLoads: book === '6a' ? 1 : 0,
    newFigureRendererCalls: 0, newSourceCalls: 0, paidServiceCalls: 0,
    hostTokens: 'UNKNOWN', totalCost: 'UNKNOWN',
    priorCountsAndCostsPreserved: true, historicalUnknownBytesRecovered: false },
  ownedBrowsersClosed: true, databaseWrites: 0, planeWrites: 0, commits: 0, pushes: 0,
  merges: 0, deployments: 0, otherLessonsResumed: false, finish: 'review',
});
const record6 = save(`${evidenceRoot('6a')}/binding.record`,
  Buffer.from(`${JSON.stringify(recordFor('6a'), null, 2)}\n`));
const record8 = save(`${evidenceRoot('8a')}/binding.record`,
  Buffer.from(`${JSON.stringify(recordFor('8a'), null, 2)}\n`));
const n8 = targetRoot('6a', 'alg6-c2-s1-n8');
save(`${n8}/offline-display.json`, Buffer.from(`${JSON.stringify({
  schema: 'stemrobin-182/offline-display-binding@1', ticket: 'STEMROBIN-182',
  book: '6a', lesson: 'alg6-c2-s1-n8', edition: 'modern-us-neutral',
  date: new Date().toISOString(),
  status: 'AFFECTED_ONLY_DISPLAY_PASS_INDEPENDENT_CONTENT_REVIEW_PENDING',
  scope: 'written188 and standard answer only', surfaces: [n8Surface], images: imagesByBook['6a'],
  affectedRepair: record6, wholeLessonApproved: false, finish: 'review',
}, null, 2)}\n`));
const oldDisplay = read(`${base}/before/8a/offline-display.json`);
oldDisplay.priorBinding = priorInputs.find(item => item.path === `${n20}/offline-display.json`);
oldDisplay.status = 'AFFECTED_ONLY_DISPLAY_PASS_INDEPENDENT_CONTENT_REVIEW_PENDING';
oldDisplay.date = new Date().toISOString();
const textSurface = oldDisplay.surfaces.find(item => item.name === 'text');
Object.assign(textSurface, n20Surface, { affectedRegionOnlyReobserved: 'p0114#4',
  unaffectedParagraphDomPreserved: true });
oldDisplay.content.renderedParagraphs = 16;
oldDisplay.contentApprovals.textPrior = oldDisplay.contentApprovals.text;
oldDisplay.contentApprovals.text = {
  status: 'PENDING_INDEPENDENT_REPAIR_REVIEW', affectedBlock: 'p0114#4',
  priorUnchangedTextApprovalRetained: true, evidence: record8,
};
oldDisplay.contentApprovals.choices = ref(`${n20}/choice-set/review.json`);
oldDisplay.affectedRepair = record8;
oldDisplay.affectedDisplayImages = imagesByBook['8a'];
oldDisplay.originalImagesAndRuntimeApplicability =
  'Frozen historical observations; unchanged fragments only. They do not approve the changed proof supplement.';
oldDisplay.currentRepairInputs = recordFor('8a').currentInputs;
fs.writeFileSync(`${n20}/offline-display.json`, `${JSON.stringify(oldDisplay, null, 2)}\n`);
const retention = read(`${n20}/choice-set/retention.json`);
for (const [key, name] of [['current_seed', 'seed.json'], ['current_draft', 'draft.json'], ['current_review', 'review.json']]) {
  retention[key] = ref(`${n20}/choice-set/${name}`);
}
retention.affectedRepair = record8;
retention.broader_display_pending = true;
retention.boundary += '; affected proof supplement requires fresh independent content review before renewed whole-lesson approval.';
fs.writeFileSync(`${n20}/choice-set/retention.json`, `${JSON.stringify(retention, null, 2)}\n`);
const finalChanged = baseline.retained.filter(item => hash(fs.readFileSync(item.path)) !== item.sha256);
assert.ok(finalChanged.every(item => allowed.has(item.path)));
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), baseline.head);
assert.equal(execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' }).trim(), '');
save(`${base}/preservation-result-FIRST.json`, Buffer.from(`${JSON.stringify({
  status: 'PAUSED_PENDING_INDEPENDENT_REVIEW', date: new Date().toISOString(),
  changedPaths: finalChanged.map(item => item.path), newN8DisplayBinding: `${n8}/offline-display.json`,
  records: [record6, record8], preserved: unchanged, viewedImages: 6, reopens: 0,
  gitHeadUnchanged: true, indexUntouched: true,
}, null, 2)}\n`));
console.log(JSON.stringify({ status: 'PAUSED_PENDING_INDEPENDENT_REVIEW',
  changedPaths: finalChanged.map(item => item.path), records: [record6, record8],
  preserved: unchanged, viewedImages: 6, reopens: 0 }));
