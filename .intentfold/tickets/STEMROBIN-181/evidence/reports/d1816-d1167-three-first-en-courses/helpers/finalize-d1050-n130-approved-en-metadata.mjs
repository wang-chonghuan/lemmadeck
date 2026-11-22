import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const [reviewPath, reviewHash, requestedCard = 'phy9-c2-s6-n130', recovery] = process.argv.slice(2);
const titleBindingRecovery = recovery === '--resume-approved-title-binding';
assert(recovery === undefined || recovery === '--resume-source-chapter-identity' || titleBindingRecovery);
assert.equal(bind(reviewPath).sha256, reviewHash);
assert.equal(read(reviewPath).status, 'PASS');
const configurations = {
  'phy9-c2-s6-n130': { task: 'D1050', author: 'd1816-d1048-n130-approved-en-metadata',
    out: 'd1816-d1050-n130-approved-en-metadata-native', title: 'Inductance' },
  'phy9-conclusion': { task: 'D1060', author: 'd1816-d1059-conclusion-approved-en-metadata',
    out: 'd1816-d1060-conclusion-approved-en-metadata-native', title: 'Concluding remarks' },
  'phy10-c2-s4-n92': { book: '10p', task: 'D1170', author: 'd1816-d1169-n92-approved-en-metadata',
    out: 'd1816-d1170-n92-approved-en-metadata-native',
    title: 'The laws of electrodynamics and the principle of relativity', retainedNamesAreBasenames: true },
};
const config = { ...configurations[requestedCard] };
assert(config);
if (titleBindingRecovery) {
  assert.equal(requestedCard, 'phy10-c2-s4-n92');
  assert.equal(read(`${ticket}/tmp/${config.out}/first-title-binding-failure.json`).officialNativeCommandsInvoked, 0);
} else if (recovery) {
  assert.equal(requestedCard, 'phy9-c2-s6-n130');
  config.task = 'D1064';
  config.prepared = config.author;
  config.author = 'd1816-d1063-n130-source-chapter-identity';
  config.out = 'd1816-d1064-n130-source-chapter-native-recovery';
  assert.equal(read(`${ticket}/tmp/d1816-recovery/native/d1050-n130-approved-en-affected-metadata-identity-native/receipt.json`).exitCode, 1);
}
const preparedPath = `${ticket}/tmp/${config.prepared || config.author}/prepared.json`;
const authorPath = `${ticket}/tmp/${config.author}/authored.json`;
const prepared = read(preparedPath), author = read(authorPath);
assert.equal(author.status, 'APPROVED_EN_BODY_REUSED_ONLY_CURRENT_METADATA_REVIEW_PENDING');
assert(JSON.stringify(read(reviewPath)).includes(author.englishDraft.sha256));
assert.equal(bind(author.englishDraft.path).sha256, author.englishDraft.sha256);
const card = prepared.card, edition = 'modern-us-neutral-en';
const bookId = config.book || '9p';
assert(card.startsWith(`phy${bookId.slice(0, -1)}-`));
const book = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${bookId}`;
const root = `${repo}/.tmp/STEMROBIN-181/d1816-${config.task.toLowerCase()}/root`;
const out = `${ticket}/tmp/${config.out}`;
fs.mkdirSync(`${root}/${bookId}/lessons`, { recursive: true });
for (const name of ['book.json', 'pages', 'figures', `lessons/${card}`]) {
  if (titleBindingRecovery) assert.equal(fs.readlinkSync(`${root}/${bookId}/${name}`), `${book}/${name}`);
  else fs.symlinkSync(`${book}/${name}`, `${root}/${bookId}/${name}`, fs.statSync(`${book}/${name}`).isDirectory() ? 'dir' : 'file');
}
if (titleBindingRecovery) assert.equal(bind(`${out}/metadata-review.original.json`).sha256, reviewHash);
else copy(reviewPath, `${out}/metadata-review.original.json`);
const protectedFiles = [prepared.source, ...prepared.sourcePages, ...prepared.productsReusedExactly,
  ...prepared.originalEnglishProducts, prepared.frozenEnglish];
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
const candidate = read(author.englishDraft.path);
const old = read(author.approvedEnglish.path);
assert.deepEqual(candidate.prose, old.prose);
assert.deepEqual(candidate.section_breaks, old.section_breaks);
const canonicalZhIndex = read(`${book}/editions/modern-us-neutral/book.json`);
const zhRow = canonicalZhIndex.lessons.find(item => item.id === card);
assert(zhRow);
assert.equal(zhRow.source_lesson_sha256, prepared.source.sha256);
if (titleBindingRecovery) {
  assert.equal(zhRow.title, read(prepared.source.path).title);
  assert.equal(old.source.sha256, prepared.source.sha256);
} else assert.equal(zhRow.title, old.title);
const carrierRow = { ...zhRow, title: candidate.title };
const canonicalEnIndex = read(`${book}/editions/${edition}/book.json`);
save(`${root}/${bookId}/editions/${edition}/book.json`, { ...canonicalEnIndex, lessons: [carrierRow] });
const products = [];
for (const [index, original] of prepared.originalEnglishProducts.entries()) {
  const name = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'][index];
  assert(config.retainedNamesAreBasenames ? path.basename(original.path) === name : original.path.endsWith(`-${name}`));
  const value = name === 'lesson.json' ? { ...candidate, status: old.status } : { ...read(original.path), edition };
  const destination = `${root}/${bookId}/editions/${edition}/lessons/${card}/${name}`;
  save(destination, value);
  products.push({ name, original, current: bind(destination) });
}
const directory = `${root}/${bookId}/editions/${edition}/lessons/${card}`;
const receipt = run(`${config.task.toLowerCase()}-${card.split('-').at(-1)}-approved-en-affected-metadata-identity-native`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0, ${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(`${directory}/lesson.json`)}))
old=edition.load(Path(${JSON.stringify(author.approvedEnglish.path)}))
raw=edition.load(Path(${JSON.stringify(prepared.source.path)}))
assert lesson["prose"]==old["prose"] and lesson["section_breaks"]==old["section_breaks"]
assert lesson["source"]==old["source"] and lesson["source"]["data"]==raw
assert lesson["locale"]=="en" and lesson["title"]==${JSON.stringify(config.title)}
if lesson.get("translated_title"):
    assert lesson["translated_title"]==lesson["title"]
errors=edition.validate_lesson_identity(raw,lesson)
print(json.dumps({"status":"PASS" if not errors else "FAIL","errors":errors,"approvedBodyUnchanged":True,"fullAdaptFinalizeReplayed":False}))
assert not errors,errors`,
]);
const render = run(`${config.task.toLowerCase()}-${card.split('-').at(-1)}-first-current-english-metadata-render`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'render',
  '--book', bookId, '--root', root, '--work', prepared.work, '--edition', edition, '--lesson', card,
]);
const row = {
  locale: 'en', edition, assets: [],
  lesson: bind(`${directory}/lesson.json`), exercises: bind(`${directory}/exercises.json`),
  figures: bind(`${directory}/figures.json`), audit: bind(`${directory}/adaptation.audit.json`),
  textHtml: bind(`${prepared.work}/render/${bookId}/${edition}/${card}/text.html`),
};
assert.equal(read(row.audit.path).status, 'pass');
assert.equal(read(row.exercises.path).count, 0);
assert.equal(read(row.figures.path).figures.length, 0);
for (const file of protectedFiles) assert.equal(bind(file.path).sha256, file.sha256);
save(`${out}/result.json`, {
  task: config.task, card, status: 'APPROVED_EN_BODY_METADATA_RECONCILED_NATIVE_RENDER_PASS',
  root, work: prepared.work, rows: [row], receipts: [receipt, render], products,
  prepared: bind(preparedPath), authored: bind(authorPath), review: bind(reviewPath),
  historicalEnglishNativeBody: author.approvedEnglish,
  historicalScience: prepared.historicalZhScience, historicalDisplay: prepared.historicalDisplayReview,
  metadataOnlyNativeCheck: true, firstCurrentEnglishMetadataRender: true,
  sourceChapterIdentityRecovery: recovery === '--resume-source-chapter-identity',
  preNativeApprovedTitleBindingRecovery: titleBindingRecovery,
  ...(titleBindingRecovery ? { firstTitleBindingFailure: bind(`${out}/first-title-binding-failure.json`),
    originalHelper: bind(`${ticket}/tmp/d1816-recovery/finalize-d1170-n92.failed-original.mjs`) } : {}),
  derivedCarrierRow: carrierRow, sourceNativeIndexRowUnchangedExceptEnglishTitle: true,
  fullAdaptFinalizeAndSourceZhEnglishBodyScienceDisplayApprovalReplayed: false,
  englishBodyAndSectionBreaksAndSourceUnchanged: true,
  originalObjects: candidate.prose.length, originalTasks: 0, originalFigures: 0, parentImages: 0,
  databaseWrites: 0, paidCalls: 0, fullCourseApproved: false,
  newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ result: bind(`${out}/result.json`), metadataNativeAndRenderPASS: true }));
