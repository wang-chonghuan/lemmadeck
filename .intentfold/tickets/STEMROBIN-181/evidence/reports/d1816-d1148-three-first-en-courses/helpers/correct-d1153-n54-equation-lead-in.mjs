import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const previousPath = `${ticket}/tmp/d1816-d1130-n54-first-missing-en/authored.json`;
const previous = read(previousPath);
const reviewPath = `${ticket}/tmp/d1816-d1131-n54-first-en-independent-review/n54-first-en-review.json`;
assert.equal(bind(reviewPath).sha256, '57c1f4b297a5ead33e0905a20dce758d02017f250f6818f709296c888a935e17');
assert.deepEqual(read(reviewPath).findings.map(finding => finding.id), ['EN54-F1']);
assert.equal(bind(previous.englishDraft.path).sha256, previous.englishDraft.sha256);
const lesson = read(previous.englishDraft.path), before = structuredClone(lesson);
const from = 'at the same temperature is:\n';
const to = 'at the same temperature is given by the following equation.\n';
assert.equal(lesson.prose[5].text.split(from).length, 2);
lesson.prose[5].text = lesson.prose[5].text.replace(from, to);
assert(!lesson.section_breaks.some(boundary =>
  ['before', 'after'].some(side => boundary[side].includes(from))));
const comparison = structuredClone(lesson);
comparison.prose[5].text = before.prose[5].text;
assert.deepEqual(comparison, before);
const out = `${ticket}/tmp/d1816-d1153-n54-equation-lead-in`;
copy(reviewPath, `${out}/first-review-revise.original.json`);
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, lesson);
const flow = proseFlow(lesson.prose, lesson.section_breaks);
assert.equal(flow.filter(block => block.kind === 'p').length, previous.flowParagraphs);
save(`${out}/en.prose-flow.json`, { proseFlow: flow, paragraphs: flow.filter(block => block.kind === 'p') });
const receipt = run('d1153-n54-equation-lead-in-affected-native', [
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
index=5
modern,approved,source=lesson["prose"][index],zh["prose"][index],raw["prose"][index]
assert edition.normalize_prose_layout(modern["text"]) == modern["text"],"normalizer stability"
assert edition.math_signature(modern["text"]) == edition.math_signature(approved["text"])
errors.extend(edition.validate_identity_fields(source,modern,["kind","id","printed_page","source_refs"],"en.prose[5]"))
errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],"en.prose[5]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities")))
print(json.dumps({"status":"PASS" if not errors else "FAIL","affectedIndices":[5],"flowParagraphs":len(flow["paragraphs"]),"errors":errors}))
assert not errors,errors`,
]);
save(`${out}/authored.json`, {
  ...previous, task: 'D1153', status: 'AFFECTED_ONLY_ONE_EQUATION_LEAD_IN_NATIVE_PASS',
  previousAuthor: bind(previousPath), originalReview: bind(reviewPath),
  englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  affectedIndices: [5], replacement: { from, to }, changedAnchors: [],
  affectedNativeReceipt: receipt, qualifiersMathSourceSectionAndUnrelatedEnglishUnchanged: true,
  unaffectedEnglishReviewReplayed: false, affectedIndependentReview: 'pending',
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`), candidate: bind(draftPath) }));
