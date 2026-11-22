import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy } from './n42-native.mjs';

const previousPath = `${ticket}/tmp/d1816-d1048-n130-approved-en-metadata/authored.json`;
const previous = read(previousPath);
assert.equal(bind(previous.englishDraft.path).sha256, previous.englishDraft.sha256);
const failedPath = `${ticket}/tmp/d1816-recovery/native/d1050-n130-approved-en-affected-metadata-identity-native/receipt.json`;
const failure = read(failedPath);
assert.equal(failure.exitCode, 1);
const prepared = read(previous.prepared.path), source = read(prepared.source.path);
const candidate = read(previous.englishDraft.path), before = structuredClone(candidate);
assert.equal(source.chapter, null);
assert.equal(read(previous.approvedEnglish.path).chapter, null);
candidate.chapter = source.chapter;
assert.deepEqual({ ...candidate, chapter: before.chapter }, before);
const out = `${ticket}/tmp/d1816-d1063-n130-source-chapter-identity`;
const draft = `${out}/en.lesson.draft.json`;
save(draft, candidate);
copy(previous.englishFlow.path, `${out}/en.prose-flow.json`);
save(`${out}/authored.json`, {
  ...previous, task: 'D1063', previousAuthor: bind(previousPath),
  englishDraft: bind(draft), englishFlow: bind(`${out}/en.prose-flow.json`),
  changedPointersSinceFirstMetadataReview: ['/chapter'],
  originalMetadataReview: bind(`${ticket}/tmp/d1816-d1051-n130-independent-metadata-review/n130-metadata-review.json`),
  originalNativeIdentityFailure: bind(failedPath),
  machineChapterRestoredToSourceNull: true, nativeFirstRenderNotYetInvoked: true,
  englishTitlePrintedTitleLocaleBodySectionBreaksAndOtherFieldsUnchanged: true,
  firstMetadataPassReplayed: false, affectedMetadataReview: 'pending',
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`), candidate: bind(draft),
  failedNative: bind(failedPath), parentImages: 0 }));
