import assert from 'node:assert/strict';
import fs from 'node:fs';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const originalPath = `${ticket}/tmp/d1816-d1297-n1-first-missing-en/authored.json`;
const original = read(originalPath);
const review = bind(`${ticket}/tmp/d1816-d1276-n1-independent-review/n1-first-en-review.json`);
assert.equal(review.sha256, 'b46931e5c9d0493adb9bc5f600a6ca15deee71ec51eb36e938a4bcd700dffdf1');
assert.equal(read(review.path).status, 'REVISE');
assert.equal(bind(original.englishDraft.path).sha256, original.englishDraft.sha256);
const draft = read(original.englishDraft.path), indices = [0, 1, 3, 8];
draft.prose[0].text = `Newton's laws are the basic rules of classical mechanics, a description of motion and forces.
They describe many motions of large bodies and their parts very accurately when this description applies.
To calculate a motion, we need the body's mass, its initial position and velocity, and the forces acting on it.

Initial means at the start.
Velocity tells us both the speed and the direction of motion.
Newton's laws are not a universal description of every tiny particle or every possible motion.

At the scale of atoms or at speeds approaching the speed of light, other physical theories may be needed.`;
draft.prose[1].text = `Knowing the laws of motion alone does not explain every property of matter.
Why does deforming a body produce an elastic force?
Why can matter occur as a gas, a liquid, or a solid?

Deforming means changing an object's shape, for example by stretching it.
An elastic force tends to bring the object back toward its original shape.
To explain where that force comes from, we also need to understand the structure of matter and the interactions within it.

Gas, liquid, and solid are the three states considered here, not a list of every possible state.`;
draft.prose[3].text = `Thermal phenomena include changes connected with temperature and changes of state.
For example, liquid water can become a gas.
Such changes may not look like the movement of a large object, but they are connected with energy and microscopic behavior: the movement and interactions of tiny particles within matter.

The original course introduced thermal phenomena in an earlier school year.
Here we will build on these familiar observations.`;
draft.prose[8].text = String.raw`Temperature changes can affect dimensions, volume, elasticity, and other properties of a material.
Many solids expand and many liquids increase in volume when heated, although thermal expansion is not identical for all substances or temperature ranges.
The textbook describes a flexible rubber tube that withstands a hammer blow without damage at the start of the comparison.

The same kind of rubber, when cooled below $-100^{\circ}\mathrm{C}$ in that example, becomes brittle like glass.
A light blow then shatters it into many small pieces.
The quoted temperature is an example for the material being described, not a universal brittleness threshold for every rubber.

Flexible rubber can return toward its earlier shape after stretching, as elastic forces act.
Warming an unbroken piece can restore flexibility; warming does not rejoin a tube that has already broken.`;
const out = `${ticket}/tmp/d1816-d1300-n1-two-findings`;
const input = `${out}/en.before-native.json`;
save(input, draft);
const receipt = run('d1300-n1-four-affected-text-fields-native', [
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
flow,errors=edition.prose_flow_contract(draft["prose"],[])
boundaries=[]
for prefix in ("Thermal phenomena include changes","Temperature changes"):
    matched=[i for i,p in enumerate(flow["paragraphs"]) if p["text"].startswith(prefix)]
    assert len(matched)==1 and matched[0]>0,(prefix,matched)
    i=matched[0]
    boundaries.append({"before":flow["paragraphs"][i-1]["text"],"after":flow["paragraphs"][i]["text"]})
draft["section_breaks"]=boundaries
flow,flow_errors=edition.prose_flow_contract(draft["prose"],boundaries)
errors.extend(flow_errors)
restored=json.loads(json.dumps(draft))
for i in ${JSON.stringify(indices)}: restored["prose"][i]["text"]=before["prose"][i]["text"]
restored["section_breaks"]=before["section_breaks"]
assert restored==before,"Unrelated candidate field changed"
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
for i in ${JSON.stringify(indices)}:
    source,modern=raw["prose"][i],draft["prose"][i]
    assert edition.math_signature(modern["text"])==edition.math_signature(zh["prose"][i]["text"])
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{i}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities"),[]))
print(json.dumps({"lesson":draft,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const output = JSON.parse(fs.readFileSync(read(receipt.path).streams.stdout.path, 'utf8'));
const comparison = structuredClone(output.lesson), before = read(original.englishDraft.path);
for (const index of indices) comparison.prose[index].text = before.prose[index].text;
comparison.section_breaks = before.section_breaks;
assert.deepEqual(comparison, before);
save(`${out}/en.lesson.draft.json`, output.lesson);
save(`${out}/en.prose-flow.json`, output.flow);
save(`${out}/authored.json`, {
  ...original, task: 'D1300', status: 'AFFECTED_ONLY_TWO_N1_FINDINGS_AUTHOR_PASS',
  originalAuthor: bind(originalPath), originalDraft: original.englishDraft,
  originalFlow: original.englishFlow, originalIndependentReview: review,
  englishDraft: bind(`${out}/en.lesson.draft.json`), englishFlow: bind(`${out}/en.prose-flow.json`),
  englishBeforeNative: bind(input), nativeReceipt: receipt,
  changedPointers: indices.map(index => `/prose/${index}/text`),
  directlyAffectedSectionAnchorsReboundFromActualFlow: true,
  allOtherTextMetadataMathAndSourceUnchanged: true, flowParagraphs: output.flow.paragraphs.length,
  passedAuthorScienceSourceAndFigureReviewReplayed: false,
  independentAffectedTextReview: 'pending',
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), paragraphs: output.flow.paragraphs.length }));
