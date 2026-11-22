import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const reviewPath = `${ticket}/tmp/d1816-d1219-n2-first-en-independent-review/first-en-review.json`;
assert.equal(bind(reviewPath).sha256, 'd721fb1f2cf4fcd7dae9048873b9683c63695b862558034aa92e08cbee84ab8c');
const review = read(reviewPath);
assert.equal(review.status, 'REVISE');
assert.equal(review.findings.length, 1);
const repair = review.findings[0].requiredRepair;
const previousPath = `${ticket}/tmp/d1816-d1224-n2-paragraph-start/authored.json`;
const previous = read(previousPath);
assert.equal(bind(previous.englishDraft.path).sha256, previous.englishDraft.sha256);
const lesson = read(previous.englishDraft.path), before = structuredClone(lesson);
for (const [holder, key] of [[lesson.prose[11], 'text'], [lesson.section_breaks[1], 'after']]) {
  assert.equal(holder[key].split(repair.replaceExact).length, 2);
  holder[key] = holder[key].replace(repair.replaceExact, repair.with);
}
const comparison = structuredClone(lesson);
comparison.prose[11].text = before.prose[11].text;
comparison.section_breaks[1].after = before.section_breaks[1].after;
assert.deepEqual(comparison, before);
const out = `${ticket}/tmp/d1816-d1225-n2-horizontal-referent`;
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, lesson);
const receipt = run('d1225-n2-horizontal-referent-affected-native', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(draftPath)}))
prepared=edition.load(Path(${JSON.stringify(previous.prepared.path)}))
raw=edition.load(Path(prepared["source"]["path"]))
zh=edition.load(Path(prepared["approvedZh"]["path"]))
flow,errors=edition.prose_flow_contract(lesson["prose"],lesson["section_breaks"])
index=11
modern,approved,source=lesson["prose"][index],zh["prose"][index],raw["prose"][index]
assert edition.normalize_prose_layout(modern["text"])==modern["text"]
assert edition.math_signature(modern["text"])==edition.math_signature(approved["text"])
errors.extend(edition.validate_identity_fields(source,modern,["kind","id","printed_page","source_refs"],"en.prose[11]"))
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],"en.prose[11]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities")))
print(json.dumps({"status":"PASS" if not errors else "FAIL","flow":flow,"errors":errors}))
assert not errors,errors`,
]);
const result = read(read(receipt.path).streams.stdout.path);
assert.equal(result.flow.paragraphs.length, previous.flowParagraphs);
save(`${out}/en.prose-flow.json`, result.flow);
save(`${out}/authored.json`, {
  ...previous, task: 'D1225', status: 'AFFECTED_ONLY_ONE_HORIZONTAL_SPRING_REFERENT_NATIVE_PASS',
  previousAuthor: bind(previousPath), firstReview: bind(reviewPath),
  englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  replacement: repair, affectedIndices: [11], affectedAnchor: '/section_breaks/1/after', receipt,
  originalAuthorNativePassReplayed: false, sourceFormulasReferencesAndOtherTextUnchanged: true,
  affectedIndependentEnglishReviewPending: true,
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`), paragraphs: result.flow.paragraphs.length }));
