import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d259-delivery`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const retained = [];
const products = [];
const copied = new Map();
const copy = (from, to, list = retained) => {
  from = path.resolve(from);
  if (copied.has(from)) return copied.get(from);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  const row = { ...bind(to), originalPath: from };
  list.push(row);
  copied.set(from, row);
  return row;
};
assert(!fs.existsSync(O));
const displayFile = `${T}/tmp/d1816-d259-display/result.json`;
const display = read(displayFile);
assert.equal(display.status, 'pass');
assert.equal(display.records.length, 8);
assert.equal(display.offline, true);
assert.deepEqual(display.requests, []);
for (const row of display.records) {
  assert.equal(row.status, 'pass');
  assert.equal(row.emptyExercisesChecked, true);
  for (const key of ['lesson', 'html', 'screenshot']) verify(row[key]);
}
const pixelsFile = `${T}/tmp/d1816-d259-display/parent-visual-observation.json`;
save(pixelsFile, {
  schema: 'STEMROBIN-181/offline-pixel-observation@1', batch: 'D259', status: 'pass',
  display: bind(displayFile), screenshots: display.records.map(row => row.screenshot),
  observationBasis: 'Parent personally opened all eight complete screenshots before context compaction. Continued from that observed outcome; no screenshot reopen or repeated display test.',
  observations: 'Both complete courses in Chinese and English at desktop 1440x960 and mobile 390x844: all prose, formulas, section transitions, figure labels and captions visible and legible. No incoherent overlaps, clipping, missing media or page overflow observed. Native checks separately verify empty exercise pages.',
  parentContinuationImageOpens: 11, earlierParentImageOpens: 3,
  finalScreenshotImageOpens: 8, newImageOpensAfterCompaction: 0,
  historicalImageUsageReset: false, headless: true, productAcceptance: false,
});
const rawBook = bind(`${R}/book.json`);
const reused = [];
for (const name of ['n44', 'n51']) {
  const nativeFile = `${T}/tmp/d1816-d259-${name}-native/result.json`;
  const native = read(nativeFile);
  assert.equal(native.originalTasks, 0);
  const carrier = `${native.root}/9p`;
  const scienceFile = `${T}/evidence/reports/9p-${name}-science-review.json`;
  const science = read(scienceFile);
  assert.equal(science.status, 'pass');
  verify(science.bindings.source);
  reused.push(bind(scienceFile));
  for (const filename of ['lesson.json', 'lesson.md', 'exercises.json']) {
    assert.equal(bind(`${carrier}/lessons/${native.id}/${filename}`).sha256,
      bind(`${R}/lessons/${native.id}/${filename}`).sha256);
  }
  for (const key of ['englishReview', 'figureReview']) {
    verify(native[key]);
    assert.equal(read(native[key].path).status, 'pass');
    copy(native[key].path, `${O}/reviews/${name}/${path.basename(native[key].path)}`);
  }
  for (const record of native.records) {
    for (const key of ['lesson', 'spec', 'render', 'review', 'svg']) verify(record[key]);
    const directory = `${carrier}/editions/${record.edition}/lessons/${native.id}`;
    assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
    assert.equal(read(`${directory}/exercises.json`).count, 0);
    assert.equal(read(`${directory}/lesson.json`).prose.length, name === 'n44' ? 7 : 10);
    assert.deepEqual(read(`${directory}/figures.json`).figures.map(row => row.id), [native.figure]);
    for (const file of [...walk(directory), ...['spec', 'render', 'review', 'svg'].map(key =>
      record[key].path)]) {
      assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
      copy(file, file.replace(`${carrier}/editions/`, `${R}/editions/`), products);
    }
    execFileSync(process.execPath, [
      `${T}/tmp/d1816-recovery/run-native.mjs`, `d266-${name}-${record.locale}-retain-edition-index`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      `${T}/tmp/d1816-recovery/update-edition-index.py`,
      '--book', R, '--carrier', carrier, '--edition', record.edition, '--lesson', native.id,
    ], { cwd: repo, stdio: 'inherit' });
  }
}
verify(rawBook);
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en'])
  products.push(bind(`${R}/editions/${edition}/book.json`));

for (const stage of [
  'd255-n51-figure-author', 'd256-n44-author', 'd257-n51-text-author',
  'd258-n44-review', 'd259-n44-native', 'd259-n51-native', 'd259-display',
  'd260-n51-review', 'd261-n44-preview-recovery', 'd262-n44-affected-visual',
  'd263-n44-pronoun-author', 'd264-n44-pronoun-review',
]) {
  const dir = `${T}/tmp/d1816-${stage}`;
  for (const from of walk(dir)) copy(from, `${O}/stages/${stage}/${path.relative(dir, from)}`);
}
for (const name of ['d255', 'd256']) {
  const dir = `.tmp/STEMROBIN-181/d1816-${name}${name === 'd256' ? '/figures' : ''}`;
  for (const from of fs.readdirSync(dir).map(file => `${dir}/${file}`).filter(file =>
    fs.statSync(file).isFile())) {
    copy(from, `${O}/figure-candidates/${name}/${path.basename(from)}`);
  }
}
for (const [name, stage] of [['n44', 'd256'], ['n51', 'd257']]) {
  const native = read(`${T}/tmp/d1816-d259-${name}-native/result.json`);
  for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
    const dir = `${native.work}/adapt/9p/${edition}/lessons/${native.id}`;
    for (const file of walk(dir))
      copy(file, `${O}/final-templates/${name}/${edition}/${path.relative(dir, file)}`);
  }
}
const calls = `${T}/tmp/d1816-recovery/native`;
for (const name of fs.readdirSync(calls).filter(name => /^d2(5[5-9]|6[0-6])-/.test(name))) {
  for (const file of walk(`${calls}/${name}`))
    copy(file, `${O}/native/${name}/${path.basename(file)}`);
}
for (const name of [
  'install-d259-courses.mjs', 'complete-d265-n44.mjs', 'check-d259-offline.mjs',
  'repair-d259-english-identity.mjs', 'recover-d261-n44-preview.mjs',
  'repair-d263-n44-pronoun.mjs', 'update-edition-index.py',
  'deliver-d259.mjs',
]) {
  const from = `${T}/tmp/d1816-recovery/${name}`;
  if (fs.existsSync(from)) copy(from, `${O}/tools/${name}`);
}
const cards = ['phy9-c1-s5-n44', 'phy9-c1-s6-n51'];
const readyFile = `${O}/batch-ready.json`;
save(readyFile, {
  schema: 'STEMROBIN-181/offline-complete-batch@1', batch: 'D259',
  ticket: 'STEMROBIN-181', status: 'complete-retained-unbatched', cards,
  productBindings: products, retained, reusedScienceEvidence: reused,
  display: copied.get(path.resolve(displayFile)),
  pixels: copied.get(path.resolve(pixelsFile)),
  counts: { newCourses: 2, sourceBlocksPerLocale: { n44: 7, n51: 10 },
    originalWrittenQuestions: 0, readonlyStandards: 0, choiceResponseUnits: 0,
    choiceOptions: 0, sharedModernFigures: 2, sourcePagesAdded: 0,
    newlyCapturedBookAnswerRecords: 0 },
  bookAnswerDisposition: 'Both authoritative courses have zero tasks; no answer or choice content invented.',
  passedSubstantiveStagesReplayed: 0, originalFailuresPreserved: true,
  affectedOnlyReviews: true, eightOfflineWholePageScreenshotsPASS: true,
  parentContinuationImageOpens: 11, newImageOpensAfterCompaction: 0,
  historicalRepairsAndSpendPreserved: true, newPaidCalls: 0,
  sourceAndUnapprovedChangesExcluded: true, headless: true,
  productAcceptance: false, wholeProjectChecks: false, formalHandoff: false,
  databaseWrites: false, publish: false, deploy: false, merge: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 137);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
assert(!meter.deliveryBatches.some(row => row.id === 'D259'));
Object.assign(meter.currentResume1816.D260, {
  status: 'N51_EN_SOURCE_SEMANTIC_VISUAL_PASS_REVIEWER_CLOSED',
  reviewerClosed: true,
  report: copied.get(path.resolve(`${T}/tmp/d1816-d260-n51-review/report.json`)),
});
meter.currentResume1816.D262 = {
  status: 'N44_AFFECTED_VISUAL_PASS_REVIEWER_CLOSED', reviewerClosed: true,
  report: copied.get(path.resolve(`${T}/tmp/d1816-d262-n44-affected-visual/report.json`)),
  imageOpens: 2, priorReviewerImageOpens: 3, cumulativeReviewerImageOpens: 5,
};
meter.currentResume1816.D263 = {
  status: 'N44_ONE_RECIPIENT_PRONOUN_AUTHOR_COMPLETE',
  bindings: copied.get(path.resolve(`${T}/tmp/d1816-d263-n44-pronoun-author/bindings.json`)),
  substantiveSentenceChanges: 1, imageOpens: 0,
};
meter.currentResume1816.D264 = {
  status: 'N44_AFFECTED_ENGLISH_AND_CONTEXT_PASS_REVIEWER_CLOSED', reviewerClosed: true,
  report: copied.get(path.resolve(`${T}/tmp/d1816-d264-n44-pronoun-review/report.json`)),
  imageOpens: 0, cumulativeReviewerImageOpens: 5,
};
meter.currentResume1816.D265 = {
  status: 'N44_NATIVE_BILINGUAL_FINALIZATION_AND_FIRST_COMPLETE_EN_RENDER_PASS',
  report: copied.get(path.resolve(`${T}/tmp/d1816-d259-n44-native/result.json`)),
  numericParserFix: '.claude/skills/ld-s10y-lesson/tools/edition.py',
  focusedTest: '.claude/skills/ld-s10y-lesson/tests/test_prose_sentence_numbers.py',
  focusedTestsPassed: 4, sourceAndFormulasChanged: false,
};
meter.currentResume1816.D259 = {
  status: 'COMPLETE_N44_N51_OFFLINE_BATCH_READY_TO_COMMIT_PUSH',
  completeCoursesAdded: 2, canonicalPromotions: 2, readiness: bind(readyFile),
  deliveryCards: cards, display: copied.get(path.resolve(displayFile)),
  pixels: copied.get(path.resolve(pixelsFile)), parentContinuationImageOpens: 11,
};
Object.assign(meter.currentResume1816.D261, {
  status: 'N44_UNCHANGED_SVG_PREVIEW_RECOVERY_RESOLVED_BY_D262',
});
meter.currentCheckpoint.completeUnbatchedCards = cards;
meter.currentCheckpoint.date = '2026-11-20';
meter.currentCheckpoint.status = 'developing';
meter.currentCheckpoint.fullProjectTestsOrBuildRunOnResume = false;
meter.currentResume1816.currentContinuation =
  '137 complete offline courses pushed plus two complete retained N44/N51 courses ready to commit/push. Chinese SCI PASS reused; English/source/semantic/visual reviews, native finalization and eight desktop/mobile offline surfaces PASS. Original black-preview, identity, boundary and number-parser failures preserved; changed sentence reviewed only in context. Parent continuation image opens 11, including eight final screenshots personally observed before compaction; no reset, new paid call, source promotion, DB/publisher/deploy/merge/closure or formal handoff. Continue missing authorized stages after this batch push.';
meter.countsStaleReason =
  '137 complete offline courses pushed, two complete unbatched courses retained. Other source/modern/question aggregates remain historical and are not global approval. All earlier source-glyph and figure HOLDs and usage remain intact.';
meter.deliveryBatches.push({
  id: 'D259', cards, status: 'complete-ready-to-commit-push', newlyCompletedCards: 2,
  evidence: bind(readyFile), elapsedSeconds: null, inputTokens: null,
  outputTokens: null, costUsd: null,
  batchSizing: 'Two complete recovered bilingual courses; other partial source/figure stages remain separate, with no invented tasks.',
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
const indexed = new Set(index.reports.map(row => row.path));
for (const file of walk(O)) {
  assert(!indexed.has(file), file);
  index.reports.push({ ...bind(file), batch: 'D259' });
}
index.updatedAt = meter.updatedAt;
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ readiness: bind(readyFile), products: products.length,
  retained: retained.length, completeUnbatched: cards, staged: false }));
