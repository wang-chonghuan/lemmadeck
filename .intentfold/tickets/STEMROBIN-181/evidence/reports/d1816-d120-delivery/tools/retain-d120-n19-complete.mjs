import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const C = '.tmp/STEMROBIN-181/d1816-d112/root/9p';
const I = 'phy9-c1-s2-n19';
const O = `${T}/evidence/reports/d1816-d120-delivery`;
const V = `${T}/tmp/d1816-d121-n19-display-review`;
const N = `${T}/tmp/d1816-recovery/native`;
const read = p => JSON.parse(fs.readFileSync(p));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const bind = p => ({ path: p, sha256: hash(p) });
const verify = r => assert.equal(hash(r.path), r.sha256, r.path);
const save = (p, data, exclusive = true) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(r =>
  r.isSymbolicLink() ? [] : r.isDirectory() ? files(`${directory}/${r.name}`) : [`${directory}/${r.name}`]);
const bindings = value => !value || typeof value !== 'object' ? [] : [
  ...(value.path && value.sha256 ? [value] : []),
  ...Object.values(value).flatMap(bindings),
];
const git = args => execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
const [reportHash, freezeHash] = process.argv.slice(2);
assert.match(reportHash || '', /^[a-f0-9]{64}$/);
assert.match(freezeHash || '', /^[a-f0-9]{64}$/);
assert.equal(hash(`${V}/display-report.json`), reportHash);
assert.equal(hash(`${V}/review-freeze.json`), freezeHash);
assert(!fs.existsSync(`${O}/batch-ready.json`));
assert.equal(git(['diff', '--cached', '--name-only']), '');
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 134);
assert.equal(meter.currentCheckpoint.sourcePagesFinalized, 561);
assert(!meter.currentCheckpoint.completeUnbatchedCards.includes(I));
const visual = read(`${V}/display-report.json`);
assert.equal(visual.status.toLowerCase(), 'pass');
const displayFile = `${T}/tmp/d1816-d112-n19-display/result.json`;
const display = read(displayFile);
assert.equal(display.status, 'pass');
assert.equal(display.records.length, 4);
const independent = [...bindings(visual), ...bindings(read(`${V}/review-freeze.json`))];
for (const record of display.records) {
  for (const key of ['lesson', 'html', 'screenshot']) verify(record[key]);
  assert(independent.some(r => path.resolve(r.path) === path.resolve(record.screenshot.path)
    && r.sha256 === record.screenshot.sha256), 'Missing independent screenshot binding');
}
const nativeFile = `${T}/tmp/d1816-d120-n19-native/native-finalized.json`;
const native = read(nativeFile);
assert.equal(native.status, 'pass');
for (const record of native.records) {
  for (const file of [...record.files, ...record.html]) verify(file);
}
const textReview = read(`${T}/tmp/d1816-d113-n19-text-review/report.json`);
for (const key of ['firstEnglishScience', 'firstEnglishLanguageAndSemanticFidelity',
  'recoveredChineseWordingAndSourceBinding', 'mathNumbersGroupingAndTopicRetention']) {
  assert.equal(textReview.verdicts[key], 'PASS');
}
assert.equal(read(`${T}/tmp/d1816-d116-n19-metadata-review/report.json`).status, 'PASS');
assert.equal(read(`${T}/tmp/d1816-d119-n19-fig26-label-review/report.json`).status, 'PASS');
const rawBookBefore = hash(`${R}/book.json`);
const products = new Set();
const retained = [];
const retain = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  assert(!fs.existsSync(to), to);
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(to), hash(from));
  retained.push({ ...bind(to), originalPath: from });
};
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const from = `${C}/editions/${edition}`;
  const sourceLesson = `${from}/lessons/${I}`;
  assert.equal(read(`${sourceLesson}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${sourceLesson}/exercises.json`).count, 0);
  assert.equal(read(`${sourceLesson}/lesson.json`).prose.length, 16);
  assert.deepEqual(read(`${sourceLesson}/figures.json`).figures.map(r => r.id), ['fig-26']);
  const targets = [
    ...files(sourceLesson),
    ...['spec.json', 'svg', 'render.json', 'review.json'].map(ext => `${from}/figures/fig-26.${ext}`),
  ];
  for (const p of targets) {
    assert(!fs.readFileSync(p, 'utf8').includes('.tmp/'), p);
    const to = p.replace(`${C}/editions/`, `${R}/editions/`);
    assert(!fs.existsSync(to), to);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(p, to, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(to), hash(p));
    products.add(to);
  }
  execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`,
    `d120-n19-${locale}-retain-native-edition-index`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    `${T}/tmp/d1816-recovery/update-edition-index.py`,
    '--book', R, '--carrier', C, '--edition', edition, '--lesson', I],
  { cwd: repo, stdio: 'inherit' });
  products.add(`${R}/editions/${edition}/book.json`);
}
assert.equal(hash(`${R}/book.json`), rawBookBefore);
for (const name of [
  'd1816-d112-n19-author', 'd1816-d113-n19-text-review',
  'd1816-d114-n19-fig26-author', 'd1816-d115-n19-text-metadata-author',
  'd1816-d116-n19-metadata-review', 'd1816-d117-n19-fig26-review',
  'd1816-d118-n19-fig26-label-author', 'd1816-d119-n19-fig26-label-review',
  'd1816-d120-n19-figure-install', 'd1816-d120-n19-native',
  'd1816-d112-n19-display', 'd1816-d121-n19-display-review',
]) {
  const directory = `${T}/tmp/${name}`;
  for (const p of files(directory).filter(p => !p.endsWith('.mjs'))) {
    retain(p, `${O}/stages/${name}/${path.relative(directory, p)}`);
  }
}
for (const name of ['author-report.json', 'author-freeze.json', 'source-observations.json',
  'image-ledger.json', 'first-freeze-failure.json']) {
  retain(`${T}/tmp/d1816-d111-n117-250252-author/${name}`, `${O}/reused-holds/d111/${name}`);
}
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  for (const stage of ['d112', 'd115']) {
    const directory = `.tmp/STEMROBIN-181/d1816-${stage}/work/adapt/9p/${edition}/lessons/${I}`;
    for (const p of files(directory)) {
      retain(p, `${O}/templates/${stage}/${edition}/${path.basename(p)}`);
    }
  }
}
const originalAuthor = read(`${T}/tmp/d1816-d114-n19-fig26-author/author-freeze.json`);
for (const key of ['candidate', 'svg', 'render', 'preview', 'retainedInitialCandidate']) {
  const row = originalAuthor[key];
  verify(row);
  retain(row.path, `${O}/failed-candidates/d114/${path.basename(row.path)}`);
}
const currentAuthor = read(`${T}/tmp/d1816-d118-n19-fig26-label-author/author-freeze.json`);
for (const key of ['candidate', 'preview']) {
  verify(currentAuthor[key]);
  retain(currentAuthor[key].path, `${O}/reviewed-candidates/d118/${path.basename(currentAuthor[key].path)}`);
}
for (const name of fs.readdirSync(N).filter(name => /^d(?:112|114|118|120)-/.test(name))) {
  for (const p of files(`${N}/${name}`)) {
    retain(p, `${O}/native/${name}/${path.basename(p)}`);
  }
}
for (const name of ['freeze-d115-n19-metadata.mjs', 'freeze-d118-n19-label.mjs',
  'preview-d118-n19-existing-svg.mjs', 'install-d120-n19-approved-figure.mjs',
  'finalize-d120-n19.mjs', 'check-d112-n19-offline.mjs',
  'update-edition-index.py', 'retain-d120-n19-complete.mjs']) {
  retain(`${T}/tmp/d1816-recovery/${name}`, `${O}/tools/${name}`);
}
const readyFile = `${O}/batch-ready.json`;
save(readyFile, {
  schema: 'STEMROBIN-181/offline-complete-batch@1',
  ticket: 'STEMROBIN-181', batch: 'D120',
  status: 'complete-retained-unbatched', parent: git(['rev-parse', 'HEAD']), cards: [I],
  productBindings: [...products].map(bind), retained,
  counts: { newCourses: 1, originalWrittenQuestions: 0, newQuestions: 0,
    standardsRequired: 0, choicesRequired: 0, sharedModernFigures: 1, sourcePagesAdded: 0 },
  deliveredBefore: 134, sourcePagesFinalized: 561, bookAnswersCaptured: 136,
  priorScienceAndSourceStagesReused: true, oldChineseTemplatePassNotRebound: true,
  sourcePhysicalAndCulturalPassReusedWithSingleAffectedLabelReview: true,
  fourOfflineScreenshotsPASS: true, headless: true, productAcceptance: false,
  wholeProjectChecks: false, formalHandoff: false,
  databaseWrites: false, paidCalls: 0, parentNewImageOpens: 0,
  batchSizing: 'One recovered complete course retained for the next small batch; t11 remains unfinished and is not counted.',
});
meter.updatedAt = new Date().toISOString();
meter.currentCheckpoint.completeUnbatchedCards.push(I);
meter.currentResume1816.D119 = {
  ...meter.currentResume1816.D119, status: 'affected-label-PASS-collected-reviewer-closed',
  report: bind(`${T}/tmp/d1816-d119-n19-fig26-label-review/report.json`),
  reviewFreeze: bind(`${T}/tmp/d1816-d119-n19-fig26-label-review/review-freeze.json`),
  independentReviewerClosed: true, imageOpensThisStage: 2, imageOpensCumulativeContext: 6,
};
meter.currentResume1816.D120 = {
  status: 'complete-offline-retained-unbatched', cards: [I], readiness: bind(readyFile),
  completeCoursesAdded: 1, sourcePagesAdded: 0, nativeFinalizers: 2, nativeRenders: 2,
  originalWrittenQuestions: 0, sharedModernFigures: 1, display: bind(displayFile),
  canonicalPromotionByteExact: true, productTmpDependencies: 0, databaseWrites: false,
};
meter.currentResume1816.D121 = {
  status: 'four-offline-pixels-PASS-collected-reviewer-closed',
  report: bind(`${V}/display-report.json`), reviewFreeze: bind(`${V}/review-freeze.json`),
  independentReviewerClosed: true, imageOpens: 4, productAcceptance: false,
};
meter.currentResume1816.currentContinuation = '134 complete courses pushed plus1 complete unbatched n19;561 SOURCE retained;136 captured book answers. D113/D116 text and metadata PASS reused, D117 source/physical/cultural PASS plus D119 single-label affected PASS composed. D120 first native bilingual finalizers/renders and four offline surfaces PASS; D121 four screenshot PASS. Approved n19 editions/fig26 copied byte-exact with durable metadata only; necessary author/review/failure evidence retained once. No new source pages, DB, deployment, whole-project checks or formal handoff. D122 t11 first three figures author active; all13 bilingual text/source objects and14 bindings reused, five SCI conditions and fig296 glyph HOLD unchanged. Continue missing stages and small-batch delivery.';
save(meterFile, meter, false);
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
index.updatedAt = meter.updatedAt;
for (const p of files(O)) {
  assert(!index.reports.some(r => r.path === p), p);
  index.reports.push({ ...bind(p), batch: 'D120' });
}
save(indexFile, index, false);
const capturedEvidence = `${T}/evidence/reports/d1816-d110-answer-capture`;
const priorPush = `${T}/evidence/reports/d1816-d100-tool-recovery/actual-push.json`;
const stageFiles = [...new Set([
  ...products, ...files(O), ...files(capturedEvidence), priorPush,
  `${R}/answers.json`, `${R}/answers.audit.json`, meterFile, indexFile,
])];
assert(stageFiles.every(p => !/(^|\/)\.env($|\.)/.test(p)));
assert(!stageFiles.some(p => /\/pages\/(?:0187|0307)\//.test(p)));
save(`${T}/tmp/d1816-recovery/d120-approved-scope.json`, {
  parent: git(['rev-parse', 'HEAD']), cards: [I], stageFiles,
  productBindings: [...products].map(bind), staged: false,
  completeDeliveredBefore: 134, completeUnbatched: meter.currentCheckpoint.completeUnbatchedCards,
  sourcePages: 561, sourcePagesAdded: 0, excludedExistingSourceChanges: [187, 307],
});
console.log(JSON.stringify({ completeUnbatched: meter.currentCheckpoint.completeUnbatchedCards,
  completeDelivered: 134, durableProducts: products.size, retainedFiles: retained.length,
  nativeOrDisplayReplayed: false, staged: false, databaseWrites: false }));
