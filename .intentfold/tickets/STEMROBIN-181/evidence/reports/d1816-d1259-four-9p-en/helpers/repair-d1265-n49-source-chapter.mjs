import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const originalPath = `${ticket}/tmp/d1816-d1249-n49-first-missing-en/authored.json`;
const original = read(originalPath);
const firstReview = bind(`${ticket}/tmp/d1816-d1250-n7-n49-independent-review/n49-first-en-review.json`);
assert.equal(read(firstReview.path).status, 'REVISE');
assert.equal(bind(original.englishDraft.path).sha256, original.englishDraft.sha256);
const draft = read(original.englishDraft.path);
const source = read(original.source.path);
assert.equal(source.chapter, '\u7b2c\u516d\u7ae0 \u56fa\u4f53\u548c\u56fa-\u6db2\u8f6c\u53d8');
assert.equal(source.section, null);
const matches = read(original.englishToc.path).contents.flatMap(chapter =>
  (chapter.lessons || []).filter(section => (section.topics || []).some(topic => topic.id === draft.id)));
assert.equal(matches.length, 1);
draft.chapter = matches[0].title;
assert.equal(draft.chapter, 'Chapter 6. Solids and the solid\u2013liquid transition');
const comparison = structuredClone(draft);
comparison.chapter = read(original.englishDraft.path).chapter;
assert.deepEqual(comparison, read(original.englishDraft.path));
const out = `${ticket}/tmp/d1816-d1265-n49-source-chapter`;
const input = `${out}/en.lesson.draft.json`;
save(input, draft);
const receipt = run('d1265-n49-affected-chapter-identity-only', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
raw=edition.load(Path(${JSON.stringify(original.source.path)}))
lesson=edition.load(Path(${JSON.stringify(input)}))
errors=edition.validate_lesson_identity(raw,lesson)
assert lesson["section"] is None
print(json.dumps({"status":"PASS" if not errors else "FAIL","errors":errors,"scope":"Affected chapter identity only"}))
assert not errors,errors`,
]);
save(`${out}/authored.json`, {
  ...original, task: 'D1265', status: 'AFFECTED_ONLY_SOURCE_CHAPTER_IDENTITY_AUTHOR_PASS',
  originalAuthor: bind(originalPath), originalDraft: original.englishDraft,
  originalIndependentReview: firstReview, englishDraft: bind(input),
  nativeReceipt: receipt, changedPointers: ['/chapter'],
  allProseMathMetadataOutsideChapterAndSectionBreaksUnchanged: true,
  sourceLiteralSectionNullPreserved: true,
  passedAuthorScienceAndFigureReviewReplayed: false,
  independentAffectedChapterReview: 'pending',
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`), draft: bind(input) }));
