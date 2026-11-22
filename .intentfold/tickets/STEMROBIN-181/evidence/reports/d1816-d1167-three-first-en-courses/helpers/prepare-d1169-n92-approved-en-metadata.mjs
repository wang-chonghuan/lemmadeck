import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const card = 'phy10-c2-s4-n92', bookId = '10p', edition = 'modern-us-neutral-en';
const artifacts = `${repo}/ssot-resources/soviet10year-textbooks/artifacts`;
const book = `${artifacts}/${bookId}`;
const retained = `${ticket}/evidence/reports/d1048-n92`;
const readinessPath = `${retained}/readiness.json`, readiness = read(readinessPath);
assert.equal(readiness.SCI, 'PASS-AFFECTED-COMPOSED');
assert.equal(readiness.ZHEN, 'PASS-AFFECTED-COMPOSED');
const currentBinding = file => {
  const current = bind(path.resolve(repo, file.path));
  assert.equal(current.sha256, file.sha256);
  return current;
};
const historicalScience = currentBinding(readiness.sourceTextReview);
const historicalNative = currentBinding(readiness.native);
const historicalDisplay = currentBinding(readiness.display);
const native = read(historicalNative.path), science = read(historicalScience.path);
assert.equal(native.status, 'FIRST-BILINGUAL-NATIVE-PASS-WITH-SECTION-MARKER-RECOVERY');
assert.equal(native.textReview.sha256, historicalScience.sha256);
assert.equal(science.effectiveVerdicts.SCI.verdict, 'PASS');
assert.equal(science.effectiveVerdicts.ZHEN.verdict, 'PASS');
const originalEnglishProducts = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
  .map(name => {
    const file = bind(`${retained}/en/native/${name}`);
    const original = native.outputs.en.nativeFiles.find(item => item.path.endsWith(`/${name}`));
    assert.equal(file.sha256, original.sha256);
    return file;
  });
const approvedEnglish = originalEnglishProducts[0], old = read(approvedEnglish.path);
const productsReusedExactly = readiness.outputs.filter(item =>
  item.path.includes(`/editions/modern-us-neutral/lessons/${card}/`)).map(currentBinding);
const approvedZh = productsReusedExactly.find(file => file.path.endsWith('/lesson.json'));
const source = bind(`${book}/lessons/${card}/lesson.json`), raw = read(source.path);
assert.equal(source.sha256, readiness.outputs.find(file =>
  file.path.endsWith(`/10p/lessons/${card}/lesson.json`)).sha256);
assert.deepEqual(old.source.data, raw);
assert.equal(raw.prose.length, 13);
assert.equal(read(originalEnglishProducts[2].path).figures.length, 0);
assert.equal(read(originalEnglishProducts[3].path).status, 'pass');
assert.equal(read(originalEnglishProducts[1].path).count, 0);
const pages = [...new Set(raw.prose.flatMap(block => block.source_refs)
  .map(ref => /^p(\d+)#/.exec(ref)?.[1]))];
assert(pages.length && pages.every(Boolean));
const sourcePages = pages.flatMap(page => ['json', 'md'].map(ext =>
  bind(`${book}/pages/${page}/page.${ext}`)));
const delivery = read(`${ticket}/production-meter.json`).deliveryBatches.find(batch =>
  batch.id === 'D-035');
assert.equal(delivery.status, 'complete-committed-pushed');
assert(delivery.cards.includes(card));
assert(!fs.existsSync(`${book}/editions/${edition}/lessons/${card}`));
assert(!read(`${book}/editions/${edition}/book.json`).lessons.some(item => item.id === card));
const tocPath = `${repo}/ssot-resources/soviet10year-textbooks/toc/${bookId}/en.json`;
const matches = read(tocPath).contents.flatMap(chapter => (chapter.lessons || []).flatMap(section =>
  (section.topics || []).filter(topic => topic.id === card).map(topic => ({ chapter, topic }))));
assert.equal(matches.length, 1);
const { chapter, topic } = matches[0];
const candidate = structuredClone(old);
Object.assign(candidate, { edition, locale: 'en', status: 'draft', title: topic.title,
  chapter: chapter.title, printed_title: `${topic.printedNumber}. ${topic.title}` });
const changedKeys = ['edition', 'locale', 'status', 'title', 'chapter', 'printed_title'];
if (Object.hasOwn(old, 'translated_title')) {
  candidate.translated_title = topic.title;
  changedKeys.push('translated_title');
}
const comparison = structuredClone(candidate);
for (const key of changedKeys) {
  if (Object.hasOwn(old, key)) comparison[key] = old[key];
  else delete comparison[key];
}
assert.deepEqual(comparison, old);
const work = `${repo}/.tmp/STEMROBIN-181/d1816-d1169/work`;
const receipt = run('d1169-n92-approved-en-metadata-first-prepare', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', bookId, '--edition', edition, '--lesson', card, '--root', artifacts, '--work', work,
]);
const out = `${ticket}/tmp/d1816-d1169-n92-approved-en-metadata`;
const preparedPath = `${out}/prepared.json`;
save(preparedPath, {
  task: 'D1169', book: bookId, card, work, firstEnglishPrepare: receipt, source, sourcePages,
  approvedZh, productsReusedExactly, originalObjects: 13, originalTasks: 0, originalFigures: 0,
  historicalRetention: bind(readinessPath), completeChineseHistoricalNative: historicalNative,
  historicalZhScience: historicalScience, historicalZhAuthorFreeze: historicalNative,
  historicalZhScienceBinding: historicalNative, historicalDisplay, historicalDisplayReview: historicalDisplay,
  originalEnglishProducts, frozenEnglish: approvedEnglish, historicalFigureGate: null,
  existingFigureTupleInventory: [], alreadyDeliveredAndCountedInHistoricalBatch: 'D-035',
  originalDeliveryCommit: delivery.commit, originalSourceZhAndFigurePassReplayed: false,
  exactCompleteEnglishRestorationClaimed: false, onlyEnglishMetadataReviewAndCurrentRenderDisplayPending: true,
  parentNewImages: 0, paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0, newSourcePages: 0,
});
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, candidate);
const flow = proseFlow(candidate.prose, candidate.section_breaks);
save(`${out}/en.prose-flow.json`, { proseFlow: flow, paragraphs: flow.filter(block => block.kind === 'p') });
save(`${out}/authored.json`, {
  task: 'D1169', card, status: 'APPROVED_EN_BODY_REUSED_ONLY_CURRENT_METADATA_REVIEW_PENDING',
  prepared: bind(preparedPath), source, approvedZh, historicalScience,
  approvedEnglish, frozenEnglish: approvedEnglish, originalEnglishProducts,
  englishToc: bind(tocPath), englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  metadataChanges: changedKeys, englishBodyAndSectionBreaksExactApprovedBytes: true,
  sourceSectionUnchanged: true, historicalTitle: old.title, currentTitle: candidate.title,
  flowParagraphs: flow.filter(block => block.kind === 'p').length,
  originalObjects: 13, originalTasks: 0, originalFigures: 0,
  originalSourceZhAndEnglishBodyApprovalReplayed: false, completeEnglishRestorationClaimed: false,
  fullCourseApproval: false, parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ prepared: bind(preparedPath), author: bind(`${out}/authored.json`),
  candidate: bind(draftPath), paragraphs: flow.filter(block => block.kind === 'p').length }));
