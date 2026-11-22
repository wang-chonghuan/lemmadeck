import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const previousPath = `${ticket}/tmp/d1816-d1068-n6-first-missing-en/authored.json`;
const previous = read(previousPath);
const reviewPath = `${ticket}/tmp/d1816-d1069-early-9p-first-en-independent-review/n6-first-en-review.json`;
assert.equal(bind(reviewPath).sha256, '27455fcad3f9256981297df736a24ef4c19c1b07064b3ee18f9153b302709df1');
assert.deepEqual(read(reviewPath).findings.map(finding => finding.id), ['N6-EN-FLOW-01', 'N6-EN-FLOW-02']);
assert.equal(bind(previous.englishDraft.path).sha256, previous.englishDraft.sha256);
const lesson = read(previous.englishDraft.path), before = structuredClone(lesson);
const changes = [
  { index: 7, from: 'specified entities;\n\nstate whether', to: 'specified entities.\n\nState whether' },
  { index: 13, from: 'their respective uncertainties;\n\nnot all', to: 'their respective uncertainties.\n\nNot all' },
];
for (const { index, from, to } of changes) {
  assert.equal(lesson.prose[index].text.split(from).length, 2);
  lesson.prose[index].text = lesson.prose[index].text.replace(from, to);
}
const comparison = structuredClone(lesson);
for (const { index } of changes) comparison.prose[index].text = before.prose[index].text;
assert.deepEqual(comparison, before);
const out = `${ticket}/tmp/d1816-d1080-n6-two-flow-findings`;
copy(reviewPath, `${out}/first-review-revise.original.json`);
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, lesson);
const flow = proseFlow(lesson.prose, lesson.section_breaks);
assert.equal(flow.filter(block => block.kind === 'p').length, previous.flowParagraphs);
save(`${out}/en.prose-flow.json`, { proseFlow: flow, paragraphs: flow.filter(block => block.kind === 'p') });
const receipt = run('d1080-n6-two-flow-findings-affected-native', [
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
for index in [7,13]:
    modern,approved,source=lesson["prose"][index],zh["prose"][index],raw["prose"][index]
    assert edition.normalize_prose_layout(modern["text"]) == modern["text"],(index,"normalizer stability")
    assert edition.math_signature(modern["text"]) == edition.math_signature(approved["text"])
    errors.extend(edition.validate_identity_fields(source,modern,["kind","id","printed_page","source_refs"],f"en.prose[{index}]"))
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{index}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities")))
print(json.dumps({"status":"PASS" if not errors else "FAIL","affectedIndices":[7,13],"flowParagraphs":len(flow["paragraphs"]),"errors":errors}))
assert not errors,errors`,
]);
save(`${out}/authored.json`, {
  ...previous, task: 'D1080', status: 'AFFECTED_ONLY_TWO_INDEPENDENT_EN_FLOW_FINDINGS_NATIVE_PASS',
  previousAuthor: bind(previousPath), originalReview: bind(reviewPath),
  englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  affectedIndices: [7, 13], replacements: changes, affectedNativeReceipt: receipt,
  sourceEquationsNumbersUnitsErrataAndUnrelatedEnglishUnchanged: true,
  unchangedEnglishScienceReviewReplayed: false, affectedIndependentReview: 'pending',
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`), candidate: bind(draftPath) }));
