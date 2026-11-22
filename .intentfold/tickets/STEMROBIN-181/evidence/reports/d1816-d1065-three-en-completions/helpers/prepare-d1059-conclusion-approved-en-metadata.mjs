import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const card = 'phy9-conclusion', edition = 'modern-us-neutral-en';
const artifacts = `${repo}/ssot-resources/soviet10year-textbooks/artifacts`;
const book = `${artifacts}/9p`;
const readinessPath = `${ticket}/evidence/reports/d038-conclusion-readiness.json`;
const readiness = read(readinessPath);
assert.equal(readiness.SCI, 'PASS');
assert.equal(readiness.ZHEN, 'PASS');
const originalBinding = file => {
  const current = bind(`${repo}/${file.path}`);
  assert.equal(current.sha256, file.sha256);
  return current;
};
const historicalScience = originalBinding(readiness.reports.SCI);
const historicalNative = originalBinding(readiness.reports.native);
const historicalDisplay = originalBinding(readiness.reports.display);
const historicalDisplayReview = originalBinding(readiness.reports.displayReview);
const science = read(historicalScience.path), freeze = read(historicalNative.path);
assert.equal(science.status, 'PASS');
assert.equal(science.findings.length, 0);
assert.equal(freeze.finalized, true);
assert.equal(science.bindings.authorFreeze.sha256, historicalNative.sha256);
const originalEnglishProducts = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
  .map(name => {
    const matches = readiness.retained.filter(item =>
      item.originalPath.endsWith(`/root-en/9p/editions/modern-us-neutral/lessons/${card}/${name}`));
    assert.equal(matches.length, 1);
    const original = matches[0];
    assert(freeze.artifacts.some(item => item.sha256 === original.sha256
      && item.path.endsWith(`/root-en/9p/editions/modern-us-neutral/lessons/${card}/${name}`)));
    return originalBinding(original);
  });
const approvedEnglish = originalEnglishProducts[0], originalEnglish = read(approvedEnglish.path);
assert.equal(approvedEnglish.sha256, science.bindings.en.lesson.sha256);
const source = bind(`${book}/lessons/${card}/lesson.json`);
assert.equal(source.sha256, science.bindings.zh.source.sha256);
assert.deepEqual(originalEnglish.source.data, read(source.path));
const sourcePage = bind(`${book}/pages/0331/page.json`);
assert.equal(sourcePage.sha256, science.bindings.sourcePage.sha256);
const productsReusedExactly = readiness.outputs.filter(item =>
  item.path.includes(`/editions/modern-us-neutral/lessons/${card}/`)).map(originalBinding);
const approvedZh = productsReusedExactly.find(file => file.path.endsWith('/lesson.json'));
assert.equal(approvedZh.sha256, science.bindings.zh.lesson.sha256);
const delivery = read(`${ticket}/production-meter.json`).deliveryBatches.find(batch =>
  batch.status === 'complete-committed-pushed' && batch.cards.includes(card));
assert.equal(delivery.id, 'D-028');
assert(!fs.existsSync(`${book}/editions/${edition}/lessons/${card}`));
assert(!read(`${book}/editions/${edition}/book.json`).lessons.some(item => item.id === card));
const tocPath = `${repo}/ssot-resources/soviet10year-textbooks/toc/9p/en.json`;
const matches = read(tocPath).contents.filter(item => item.id === card);
assert.equal(matches.length, 1);
const topic = matches[0];
assert.equal(topic.number, null);
const candidate = structuredClone(originalEnglish);
Object.assign(candidate, { edition, locale: 'en', status: 'draft',
  title: topic.title, printed_title: topic.title });
const changedKeys = ['edition', 'locale', 'status', 'title', 'printed_title'];
const comparison = structuredClone(candidate);
for (const key of changedKeys) {
  if (Object.hasOwn(originalEnglish, key)) comparison[key] = originalEnglish[key];
  else delete comparison[key];
}
assert.deepEqual(comparison, originalEnglish);
const work = `${repo}/.tmp/STEMROBIN-181/d1816-d1059/work`;
const receipt = run('d1059-conclusion-approved-en-metadata-first-prepare', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', '9p', '--edition', edition, '--lesson', card, '--root', artifacts, '--work', work,
]);
const out = `${ticket}/tmp/d1816-d1059-conclusion-approved-en-metadata`;
const preparedPath = `${out}/prepared.json`;
save(preparedPath, {
  task: 'D1059', card, work, firstEnglishPrepare: receipt, source, sourcePages: [sourcePage],
  approvedZh, productsReusedExactly, originalObjects: 2, originalTasks: 0, originalFigures: 0,
  historicalRetention: bind(readinessPath), completeChineseHistoricalNative: historicalNative,
  historicalZhScience: historicalScience, historicalZhAuthorFreeze: historicalNative,
  historicalDisplay, historicalDisplayReview, originalEnglishProducts, frozenEnglish: approvedEnglish,
  historicalFigureGate: null, existingFigureTupleInventory: [],
  alreadyDeliveredAndCountedInHistoricalBatch: 'D028', originalDeliveryCommit: delivery.commit,
  originalSourceZhAndFigurePassReplayed: false, exactCompleteEnglishRestorationClaimed: false,
  onlyEnglishMetadataReviewAndCurrentRenderDisplayPending: true,
  parentNewImages: 0, paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0, newSourcePages: 0,
});
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, candidate);
const flow = proseFlow(candidate.prose, candidate.section_breaks);
save(`${out}/en.prose-flow.json`, { proseFlow: flow, paragraphs: flow.filter(block => block.kind === 'p') });
save(`${out}/authored.json`, {
  task: 'D1059', card, status: 'APPROVED_EN_BODY_REUSED_ONLY_CURRENT_METADATA_REVIEW_PENDING',
  prepared: bind(preparedPath), source, approvedZh, historicalScience,
  approvedEnglish, frozenEnglish: approvedEnglish, originalEnglishProducts,
  englishToc: bind(tocPath), englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  metadataChanges: changedKeys, englishBodyAndSectionBreaksExactApprovedBytes: true,
  historicalTitle: originalEnglish.title, currentTitle: candidate.title,
  flowParagraphs: flow.filter(block => block.kind === 'p').length,
  originalObjects: 2, originalTasks: 0, originalFigures: 0,
  originalSourceZhAndEnglishBodyApprovalReplayed: false, completeEnglishRestorationClaimed: false,
  fullCourseApproval: false, parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ prepared: bind(preparedPath), author: bind(`${out}/authored.json`),
  candidate: bind(draftPath), paragraphs: flow.filter(block => block.kind === 'p').length }));
