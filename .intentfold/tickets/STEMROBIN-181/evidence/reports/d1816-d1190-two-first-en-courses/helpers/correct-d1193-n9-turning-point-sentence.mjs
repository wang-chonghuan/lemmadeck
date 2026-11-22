import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const previousPath = `${ticket}/tmp/d1816-d1182-n9-emphasis-boundary/authored.json`;
const previous = read(previousPath);
const reviewPath = `${ticket}/tmp/d1816-d1181-n9-n15-first-en-independent-review/n9-first-en-review.json`;
const review = read(reviewPath);
assert.equal(review.result, 'REVISE');
assert.deepEqual(review.blockingFindings.map(finding => finding.id), ['D1181-N9-F1']);
assert.equal(bind(previous.englishDraft.path).sha256, previous.englishDraft.sha256);
assert.equal(review.englishDraftSha256, previous.englishDraft.sha256);
const lesson = read(previous.englishDraft.path), before = structuredClone(lesson);
const from = 'The positive turning point gives the positive maximum displacement;\n\nthe negative turning point gives its negative minimum.';
const to = 'The positive turning point gives the positive maximum displacement.\n\nThe negative turning point gives its negative minimum.';
assert.equal(lesson.prose[2].text.split(from).length, 2);
lesson.prose[2].text = lesson.prose[2].text.replace(from, to);
assert(!lesson.section_breaks.some(boundary =>
  ['before', 'after'].some(side => boundary[side].includes(from))));
const comparison = structuredClone(lesson);
comparison.prose[2].text = before.prose[2].text;
assert.deepEqual(comparison, before);
const out = `${ticket}/tmp/d1816-d1193-n9-turning-point-sentence`;
copy(reviewPath, `${out}/first-review-revise.original.json`);
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, lesson);
const flow = proseFlow(lesson.prose, lesson.section_breaks);
assert.equal(flow.filter(block => block.kind === 'p').length, previous.flowParagraphs);
save(`${out}/en.prose-flow.json`, { proseFlow: flow, paragraphs: flow.filter(block => block.kind === 'p') });
const receipt = run('d1193-n9-turning-point-sentence-affected-native', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0, ${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(draftPath)}))
prepared=edition.load(Path(${JSON.stringify(previous.prepared.path)}))
zh=edition.load(Path(prepared["approvedZh"]["path"]))
raw=edition.load(Path(prepared["source"]["path"]))
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
flow,errors=edition.prose_flow_contract(lesson["prose"],lesson["section_breaks"])
index=2
modern,approved,source=lesson["prose"][index],zh["prose"][index],raw["prose"][index]
assert edition.normalize_prose_layout(modern["text"]) == modern["text"],"normalizer stability"
assert edition.math_signature(modern["text"]) == edition.math_signature(approved["text"])
errors.extend(edition.validate_identity_fields(source,modern,["kind","id","printed_page","source_refs"],"en.prose[2]"))
errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],"en.prose[2]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities")))
print(json.dumps({"status":"PASS" if not errors else "FAIL","affectedIndices":[2],"flowParagraphs":len(flow["paragraphs"]),"errors":errors}))
assert not errors,errors`,
]);
save(`${out}/authored.json`, {
  ...previous, task: 'D1193', status: 'AFFECTED_ONLY_ONE_TURNING_POINT_SENTENCE_NATIVE_PASS',
  previousAuthor: bind(previousPath), originalReview: bind(reviewPath),
  englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  affectedIndices: [2], replacement: { from, to }, changedAnchors: [],
  affectedNativeReceipt: receipt, signedExtremaMathSourceSectionAndUnrelatedEnglishUnchanged: true,
  unaffectedEnglishReviewReplayed: false, affectedIndependentReview: 'pending',
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`), candidate: bind(draftPath) }));
