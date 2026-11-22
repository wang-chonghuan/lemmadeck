import assert from 'node:assert/strict';
import fs from 'node:fs';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const originalPath = `${ticket}/tmp/d1816-d1264-n97-first-missing-en/authored.json`;
const original = read(originalPath);
const review = bind(`${ticket}/tmp/d1816-d1266-n97-independent-review/n97-first-en-review.json`);
assert.equal(read(review.path).verdict, 'REVISE');
assert.equal(bind(original.englishDraft.path).sha256, original.englishDraft.sha256);
const draft = read(original.englishDraft.path);
draft.prose[1].text = `The textbook also calls insulators dielectrics.
Under ordinary operating conditions, they have very few freely mobile charged particles, so the current is usually small even when there is a potential difference across them.

This describes their behavior under ordinary conditions.
At sufficiently high voltage, an insulator can undergo electrical breakdown and conduct a much larger current.`;
draft.prose[5].text = `The textbook describes theoretical studies followed by experimental research into ways of controlling semiconductor conductivity.
As this understanding developed, semiconductor devices came into widespread use.
Electronics and radio technology changed significantly as a result.`;
const out = `${ticket}/tmp/d1816-d1271-n97-two-findings`;
save(`${out}/first-preflight-failure.json`, {
  chunk: '00a9da', exitCode: 1, nativeCalls: 0,
  cause: 'The scratch helper expected REVISE in status; this review stores the decision in verdict.',
  actualStatus: read(review.path).status, actualVerdict: read(review.path).verdict,
  review, correction: 'Read the actual structured verdict without changing the review or its content.',
  sourceOrScienceFailure: false, failedInputWritten: false,
});
const input = `${out}/en.before-native.json`;
save(input, draft);
const receipt = run('d1271-n97-two-affected-text-fields-native', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
draft=edition.load(Path(${JSON.stringify(input)}))
before=edition.load(Path(${JSON.stringify(original.englishDraft.path)}))
raw=edition.load(Path(${JSON.stringify(original.source.path)}))
zh=edition.load(Path(${JSON.stringify(original.approvedZh.path)}))
edition.normalize_lesson_layout(draft)
restored=json.loads(json.dumps(draft))
for i in (1,5): restored["prose"][i]["text"]=before["prose"][i]["text"]
assert restored==before,"Unrelated candidate field changed"
flow,errors=edition.prose_flow_contract(draft["prose"],draft["section_breaks"])
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
for i in (1,5):
    source,modern=raw["prose"][i],draft["prose"][i]
    assert edition.math_signature(modern["text"])==edition.math_signature(zh["prose"][i]["text"])
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{i}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities"),[]))
print(json.dumps({"lesson":draft,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const output = JSON.parse(fs.readFileSync(read(receipt.path).streams.stdout.path, 'utf8'));
const comparison = structuredClone(output.lesson);
for (const index of [1, 5]) comparison.prose[index].text = read(original.englishDraft.path).prose[index].text;
assert.deepEqual(comparison, read(original.englishDraft.path));
save(`${out}/en.lesson.draft.json`, output.lesson);
save(`${out}/en.prose-flow.json`, output.flow);
save(`${out}/authored.json`, {
  ...original, task: 'D1271', status: 'AFFECTED_ONLY_TWO_N97_TEXT_FINDINGS_AUTHOR_PASS',
  originalAuthor: bind(originalPath), originalDraft: original.englishDraft,
  originalFlow: original.englishFlow, originalIndependentReview: review,
  englishDraft: bind(`${out}/en.lesson.draft.json`), englishFlow: bind(`${out}/en.prose-flow.json`),
  englishBeforeNative: bind(input), nativeReceipt: receipt,
  changedPointers: ['/prose/1/text', '/prose/5/text'],
  allOtherTextMetadataMathSourceAndSectionBreaksUnchanged: true,
  flowParagraphs: output.flow.paragraphs.length,
  sourceLiteralSectionNullAndChapterIdentityPreserved: true,
  passedAuthorScienceSourceAndFigureReviewReplayed: false,
  independentAffectedTextReview: 'pending',
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), paragraphs: output.flow.paragraphs.length }));
