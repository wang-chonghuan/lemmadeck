import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const previousPath = `${ticket}/tmp/d1816-d1086-n30-first-missing-en/authored.json`;
const previous = read(previousPath);
const reviewPath = `${ticket}/tmp/d1816-d1089-thermal-four-first-en-independent-review/n30-first-en-review.json`;
assert.equal(bind(reviewPath).sha256, '3a03645af5784c3959add52dc6f147e2c8692927f33c7bce89cbb6bf0c77bd03');
assert.deepEqual(read(reviewPath).findings.map(finding => finding.id), ['n30-interaction-effects']);
assert.equal(bind(previous.englishDraft.path).sha256, previous.englishDraft.sha256);
const lesson = read(previous.englishDraft.path), before = structuredClone(lesson);
const from = 'its temperature and other conditions make intermolecular interactions small';
const to = 'its temperature and other conditions make the effects of intermolecular interactions small';
assert.equal(lesson.prose[2].text.split(from).length, 2);
lesson.prose[2].text = lesson.prose[2].text.replace(from, to);
const changedAnchors = [];
for (const [index, boundary] of lesson.section_breaks.entries())
  for (const side of ['before', 'after'])
    if (boundary[side].includes(from)) {
      boundary[side] = boundary[side].replace(from, to);
      changedAnchors.push({ index, side });
    }
assert.deepEqual(changedAnchors, [{ index: 0, side: 'after' }]);
const comparison = structuredClone(lesson);
comparison.prose[2].text = before.prose[2].text;
comparison.section_breaks = before.section_breaks;
assert.deepEqual(comparison, before);
const out = `${ticket}/tmp/d1816-d1123-n30-interaction-effects`;
copy(reviewPath, `${out}/first-review-revise.original.json`);
const draftPath = `${out}/en.lesson.draft.json`;
save(draftPath, lesson);
const flow = proseFlow(lesson.prose, lesson.section_breaks);
assert.equal(flow.filter(block => block.kind === 'p').length, previous.flowParagraphs);
save(`${out}/en.prose-flow.json`, { proseFlow: flow, paragraphs: flow.filter(block => block.kind === 'p') });
const receipt = run('d1123-n30-interaction-effects-affected-native', [
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
  ...previous, task: 'D1123', status: 'AFFECTED_ONLY_ONE_INTERACTION_EFFECTS_PHRASE_NATIVE_PASS',
  previousAuthor: bind(previousPath), originalReview: bind(reviewPath),
  englishDraft: bind(draftPath), englishFlow: bind(`${out}/en.prose-flow.json`),
  affectedIndices: [2], replacement: { from, to }, changedAnchors,
  affectedNativeReceipt: receipt, sourceEquationsNumbersUnitsNullSectionAndUnrelatedEnglishUnchanged: true,
  unaffectedEnglishReviewReplayed: false, affectedIndependentReview: 'pending',
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`), candidate: bind(draftPath) }));
