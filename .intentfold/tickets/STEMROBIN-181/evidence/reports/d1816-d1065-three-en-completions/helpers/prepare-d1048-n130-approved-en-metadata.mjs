import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const card = 'phy9-c2-s6-n130', edition = 'modern-us-neutral-en';
const artifacts = `${repo}/ssot-resources/soviet10year-textbooks/artifacts`;
const book = `${artifacts}/9p`;
const manifestPath = `${ticket}/evidence/reports/d035-n130-retention-manifest.json`;
const manifest = read(manifestPath);
assert.equal(manifest.status, 'exact-complete-card-evidence-retained');
assert.equal(manifest.fullCardDisplayPASS, true);
const originalBinding = file => {
  const current = bind(`${repo}/${file.path}`);
  assert.equal(current.sha256, file.sha256);
  return current;
};
const historicalNative = originalBinding(manifest.native);
const historicalScience = originalBinding(manifest.effectiveScience);
const historicalDisplay = originalBinding(manifest.displayResult);
const historicalDisplayReview = originalBinding(manifest.displayReview);
const historicalFreeze = originalBinding(manifest.freeze);
const native = read(historicalNative.path), science = read(historicalScience.path);
assert.equal(native.status, 'PASS-native-bilingual-full-card-display-pending');
assert.equal(science.status, 'complete-single-substantive-pass');
assert.equal(science.findings.length, 0);
assert.equal(native.science.sha256, historicalScience.sha256);
const lane = native.languages.find(item => item.language === 'en');
assert(lane);
const resolveRetained = original => {
  const originalPath = original.path.replace(/^.*\/lemmadeck\//, '');
  const matches = [...new Map(manifest.dependencies.filter(item =>
    item.originalPath === originalPath && item.sha256 === original.sha256)
    .map(item => [item.path, item])).values()];
  assert.equal(matches.length, 1, original.path);
  return originalBinding(matches[0]);
};
const originalEnglishProducts = lane.outputs.map(resolveRetained);
const approvedEnglish = originalEnglishProducts.find(file => file.path.endsWith('-lesson.json'));
const originalEnglish = read(approvedEnglish.path);
const frozenEnglish = resolveRetained(science.bindings.frozenFiles.en);
assert.deepEqual(originalEnglish.prose, read(frozenEnglish.path).prose);
assert.deepEqual(originalEnglish.section_breaks, read(frozenEnglish.path).section_breaks);
const source = bind(`${book}/lessons/${card}/lesson.json`);
assert.equal(source.sha256, science.bindings.source.sha256);
assert.deepEqual(originalEnglish.source.data, read(source.path));
const sourcePages = manifest.sourcePages.map(originalBinding);
const productsReusedExactly = manifest.promotionPlan.filter(item =>
  item.destination.includes(`/editions/modern-us-neutral/lessons/${card}/`)).map(item => {
  const current = bind(`${repo}/${item.destination}`);
  assert.equal(current.sha256, item.source.sha256);
  return current;
});
const approvedZh = productsReusedExactly.find(file => file.path.endsWith('/lesson.json'));
assert(approvedZh);
assert(!fs.existsSync(`${book}/editions/${edition}/lessons/${card}`));
assert(!read(`${book}/editions/${edition}/book.json`).lessons.some(item => item.id === card));
const tocPath = `${repo}/ssot-resources/soviet10year-textbooks/toc/9p/en.json`;
const matches = read(tocPath).contents.flatMap(chapter => (chapter.lessons || []).flatMap(section =>
  (section.topics || []).filter(topic => topic.id === card).map(topic => ({ chapter, topic }))));
assert.equal(matches.length, 1);
const { chapter, topic } = matches[0];
const candidate = structuredClone(originalEnglish);
Object.assign(candidate, { edition, locale: 'en', status: 'draft', title: topic.title,
  chapter: chapter.title, printed_title: `${topic.printedNumber}. ${topic.title}` });
const changedKeys = ['edition', 'locale', 'status', 'title', 'chapter', 'printed_title'];
const comparison = structuredClone(candidate);
for (const key of changedKeys) {
  if (Object.hasOwn(originalEnglish, key)) comparison[key] = originalEnglish[key];
  else delete comparison[key];
}
assert.deepEqual(comparison, originalEnglish);
const work = `${repo}/.tmp/STEMROBIN-181/d1816-d1048/work`;
const receipt = run('d1048-n130-approved-en-metadata-first-prepare', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', '9p', '--edition', edition, '--lesson', card, '--root', artifacts, '--work', work,
]);
const out = `${ticket}/tmp/d1816-d1048-n130-approved-en-metadata`;
const preparedPath = `${out}/prepared.json`;
save(preparedPath, {
  task: 'D1048', card, work, firstEnglishPrepare: receipt, source, sourcePages,
  approvedZh, productsReusedExactly, originalObjects: 7, originalTasks: 0, originalFigures: 0,
  historicalRetention: bind(manifestPath), completeChineseHistoricalNative: historicalNative,
  historicalZhScience: historicalScience, historicalZhAuthorFreeze: historicalFreeze,
  historicalDisplay, historicalDisplayReview, originalEnglishProducts, frozenEnglish,
  historicalFigureGate: null, existingFigureTupleInventory: [],
  source318WholePageRawApproval: false, source130OwnedProseApproved: true,
  sourceAndChineseEnglishBodyScienceNativeDisplayApprovalsReplayed: false,
  originalSourceZhAndFigurePassReplayed: false, alreadyDeliveredAndCountedInHistoricalBatch: 'D035',
  englishCanonicalAndIndexAbsent: true, exactCompleteEnglishRestorationClaimed: false,
  onlyEnglishMetadataReviewAndCurrentRenderDisplayPending: true,
  parentNewImages: 0, paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0, newSourcePages: 0,
});
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, candidate);
const flow = proseFlow(candidate.prose, candidate.section_breaks);
save(`${out}/en.prose-flow.json`, { proseFlow: flow, paragraphs: flow.filter(block => block.kind === 'p') });
save(`${out}/authored.json`, {
  task: 'D1048', card, status: 'APPROVED_EN_BODY_REUSED_ONLY_CURRENT_METADATA_REVIEW_PENDING',
  prepared: bind(preparedPath), source, approvedZh, historicalScience,
  approvedEnglish, frozenEnglish, originalEnglishProducts,
  englishToc: bind(tocPath), englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  metadataChanges: changedKeys, englishBodyAndSectionBreaksExactApprovedBytes: true,
  historicalTitle: originalEnglish.title, currentTitle: candidate.title,
  flowParagraphs: flow.filter(block => block.kind === 'p').length,
  originalObjects: 7, originalTasks: 0, originalFigures: 0,
  originalSourceZhAndEnglishBodyApprovalReplayed: false, completeEnglishRestorationClaimed: false,
  fullCourseApproval: false, parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ prepared: bind(preparedPath), author: bind(`${out}/authored.json`),
  candidate: bind(draftPath), paragraphs: flow.filter(block => block.kind === 'p').length }));
