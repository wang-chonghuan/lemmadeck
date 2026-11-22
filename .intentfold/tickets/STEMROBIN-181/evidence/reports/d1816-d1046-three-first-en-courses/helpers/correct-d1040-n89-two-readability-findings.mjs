import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const previousPath = `${ticket}/tmp/d1816-d1035-n89-first-missing-en/authored.json`;
const previous = read(previousPath);
const reviewPath = `${ticket}/tmp/d1816-d1028-n81-first-en-independent-review/n89-first-en-review.json`;
assert.equal(bind(reviewPath).sha256, 'b0a42efbdb23315a570f379dbd01340af5c870092c64a8d5e67870ec8c434fea');
assert.deepEqual(read(reviewPath).findings.map(finding => finding.id), ['N89-ZHEN-001', 'N89-READ-002']);
assert.equal(bind(previous.englishDraft.path).sha256, previous.englishDraft.sha256);
const lesson = read(previous.englishDraft.path), before = structuredClone(lesson);
const changes = [
  { index: 2, from: 'Electrons carry negative charge;\n\nhere we use',
    to: 'Electrons carry negative charge.\n\nHere we use' },
  { index: 3, from: 'start moving quickly.**\nThe speed',
    to: 'start moving quickly. **The speed' },
];
for (const { index, from, to } of changes) {
  assert.equal(lesson.prose[index].text.split(from).length, 2);
  lesson.prose[index].text = lesson.prose[index].text.replace(from, to);
}
const comparison = structuredClone(lesson);
for (const { index } of changes) comparison.prose[index].text = before.prose[index].text;
assert.deepEqual(comparison, before);
const out = `${ticket}/tmp/d1816-d1040-n89-two-readability-findings`;
copy(reviewPath, `${out}/first-review-revise.original.json`);
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, lesson);
const flow = proseFlow(lesson.prose, lesson.section_breaks);
assert.equal(flow.filter(block => block.kind === 'p').length, previous.flowParagraphs);
save(`${out}/en.prose-flow.json`, { proseFlow: flow, paragraphs: flow.filter(block => block.kind === 'p') });
const receipt = run('d1040-n89-two-readability-findings-affected-native', [
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
for index in [2,3]:
    modern,approved,source=lesson["prose"][index],zh["prose"][index],raw["prose"][index]
    assert edition.normalize_prose_layout(modern["text"]) == modern["text"],(index,"normalizer stability")
    assert edition.math_signature(modern["text"]) == edition.math_signature(approved["text"])
    errors.extend(edition.validate_identity_fields(source,modern,["kind","id","printed_page","source_refs"],f"en.prose[{index}]"))
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{index}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities")))
print(json.dumps({"status":"PASS" if not errors else "FAIL","affectedIndices":[2,3],"flowParagraphs":len(flow["paragraphs"]),"errors":errors}))
assert not errors,errors`,
]);
save(`${out}/authored.json`, {
  ...previous, task: 'D1040', status: 'AFFECTED_ONLY_TWO_INDEPENDENT_EN_READABILITY_FINDINGS_NATIVE_PASS',
  previousAuthor: bind(previousPath), originalReview: bind(reviewPath),
  englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  affectedIndices: [2, 3], replacements: changes, affectedNativeReceipt: receipt,
  strongMarkerInlineForNativeStability: true,
  deviationFromSuggestedNewline: 'Inline strong opener preserves emphasis and paragraph shape without native line-leading marker movement.',
  sourceEquationsNumbersUnitsAndUnrelatedEnglishUnchanged: true,
  unchangedEnglishScienceReviewReplayed: false, affectedIndependentReview: 'pending',
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`), candidate: bind(draftPath) }));
