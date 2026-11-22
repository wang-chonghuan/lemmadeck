import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const firstReceipt = `${ticket}/tmp/d1816-recovery/native/d1107-n36-first-missing-en-author-native/receipt.json`;
assert.equal(read(firstReceipt).exitCode, 1);
const output = read(read(firstReceipt).streams.stdout.path);
assert.equal(output.errors.length, 6);
const lesson = output.lesson, before = structuredClone(lesson);
const changes = [
  { index: 2, from: '(see formulas 1-2 and 1-6 in Section 6)', to: '(see \u00a7 6, formulas 1-2 and 1-6)' },
  { index: 7, from: '(see Section 25)', to: '(see \u00a7 25)' },
  { index: 8, from: '(see Section 26)', to: '(see \u00a7 26)' },
];
for (const { index, from, to } of changes) {
  assert.equal(lesson.prose[index].text.split(from).length, 2);
  lesson.prose[index].text = lesson.prose[index].text.replace(from, to);
}
const comparison = structuredClone(lesson);
for (const { index } of changes) comparison.prose[index].text = before.prose[index].text;
assert.deepEqual(comparison, before);
const preparedPath = `${ticket}/tmp/d1816-d1106-n36-first-missing-en/prepared.json`;
const prepared = read(preparedPath);
const out = `${ticket}/tmp/d1816-d1111-n36-three-citation-identities`;
copy(firstReceipt, `${out}/first-author-failure.receipt.original.json`);
save(`${out}/first-author-failure.json`, {
  task: 'D1107', status: 'FAIL_NATIVE_BARE_SECTION_CITATION_IDENTITIES',
  firstReceipt: bind(firstReceipt), originalStdout: read(firstReceipt).streams.stdout,
  errors: output.errors, affectedIndices: [2, 7, 8], contentHold: false,
});
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, lesson);
const flow = proseFlow(lesson.prose, lesson.section_breaks);
assert.equal(flow.filter(block => block.kind === 'p').length, output.flow.paragraphs.length);
save(`${out}/en.prose-flow.json`, { proseFlow: flow, paragraphs: flow.filter(block => block.kind === 'p') });
const receipt = run('d1111-n36-three-citation-identities-affected-native', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0, ${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(draftPath)}))
prepared=edition.load(Path(${JSON.stringify(preparedPath)}))
zh=edition.load(Path(prepared["approvedZh"]["path"]))
raw=edition.load(Path(prepared["source"]["path"]))
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
flow,errors=edition.prose_flow_contract(lesson["prose"],lesson["section_breaks"])
for index in [2,7,8]:
    modern,approved,source=lesson["prose"][index],zh["prose"][index],raw["prose"][index]
    assert edition.normalize_prose_layout(modern["text"]) == modern["text"],(index,"normalizer stability")
    assert edition.math_signature(modern["text"]) == edition.math_signature(approved["text"])
    errors.extend(edition.validate_identity_fields(source,modern,["kind","id","printed_page","source_refs"],f"en.prose[{index}]"))
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{index}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities")))
print(json.dumps({"status":"PASS" if not errors else "FAIL","affectedIndices":[2,7,8],"flowParagraphs":len(flow["paragraphs"]),"errors":errors}))
assert not errors,errors`,
]);
save(`${out}/authored.json`, {
  task: 'D1111', card: 'phy9-c1-s3-n36', status: 'AFFECTED_ONLY_THREE_BARE_SECTION_CITATION_IDENTITIES_NATIVE_PASS',
  prepared: bind(preparedPath), source: prepared.source, approvedZh: prepared.approvedZh,
  historicalZhNative: prepared.completeChineseHistoricalNative,
  historicalZhScience: prepared.historicalZhScience,
  historicalZhScienceBinding: prepared.historicalZhScienceBinding,
  englishToc: bind(`${repo}/ssot-resources/soviet10year-textbooks/toc/9p/en.json`),
  englishBeforeNative: bind(`${ticket}/tmp/d1816-d1107-n36-first-missing-en/en.before-native.json`),
  englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  firstNativeReceipt: bind(firstReceipt), affectedNativeReceipt: receipt,
  affectedIndices: [2, 7, 8], replacements: changes, errors: [], originalObjects: 18,
  originalTasks: 0, originalFigures: 0, flowParagraphs: output.flow.paragraphs.length,
  derivedConceptBoundaries: 3, unchangedNativePassFieldsReplayed: false,
  sourceScienceEquationsUnitsAndUnrelatedEnglishUnchanged: true,
  registeredErrataSourceOriginalReasonAndTargetsUnchanged: true,
  originalSourceZhAndFigureReviewReplayed: false, alreadyCountedInHistoricalBatch: 'D-011',
  independentEnglishReviewAndFullNativeFinalize: 'pending',
  fullCourseApproval: false, parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`), draft: bind(draftPath) }));
