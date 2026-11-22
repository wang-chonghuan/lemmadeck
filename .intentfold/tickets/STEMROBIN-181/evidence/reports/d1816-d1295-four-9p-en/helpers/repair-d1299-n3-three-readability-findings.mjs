import assert from 'node:assert/strict';
import fs from 'node:fs';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const originalPath = `${ticket}/tmp/d1816-d1289-n3-first-missing-en/authored.json`;
const original = read(originalPath);
const review = bind(`${ticket}/tmp/d1816-d1290-n3-independent-review/n3-first-en-review.json`);
assert.equal(review.sha256, '9915642b18274e556b1dc57db7a90690148d1b143efcb43a172d5604f9ed3521');
assert.equal(read(review.path).status, 'REVISE');
assert.equal(bind(original.englishDraft.path).sha256, original.englishDraft.sha256);
const draft = read(original.englishDraft.path), indices = [2, 5, 6, 9, 11];
draft.prose[2].text = String.raw`Thermodynamics uses quantities measured with instruments such as thermometers and pressure gauges.
It describes macroscopic systems rather than the path of each individual molecule.
A macroscopic body contains many particles and can be described by large-scale properties.

Gas in a bottle, water in a glass, a grain of sand, a stone, a steel rod, and Earth are the examples associated with Figure $1$.
The objects in the illustration are not drawn to a common physical scale.
For a calculation, we choose a model: a simplified description whose assumptions fit the body and the conditions being studied.

For example, we must ask whether one temperature can adequately describe the body, or whether different parts need different temperatures.
Being a large body does not mean that Earth, a steel rod, or every other example always has one uniform temperature.`;
draft.prose[5].text = `Thermal processes often involve energy transfer and conversion.
The system is the body or material chosen for study.
Everything outside it is called the surroundings.

Heat is energy transferred because of a temperature difference.
Work is another way of transferring energy, for example by pushing, compressing, or stirring.
For a system that exchanges no matter with its surroundings, the first law of thermodynamics says that its change in stored energy equals the net energy transferred to it as heat and work.`;
draft.prose[6].text = `The development of energy conservation also helped the particle theory of heat, now called kinetic theory.
Kinetic theory connects large-scale behavior with the motion and interactions of atoms or molecules.
The classical model describes particle motion with Newton's laws, an approximation that works only when its assumptions fit the conditions.

For atoms under conditions where quantum effects matter, this classical model may not give correct predictions.
It is not a complete description of every microscopic process under every possible condition.`;
draft.prose[9].text = `A body's heat capacity describes how much energy is needed to raise that body's temperature by one degree under stated conditions, without a change of phase.
This property can be measured experimentally and used in a thermodynamic calculation.
The thermodynamic laws alone do not give every body's heat capacity.`;
draft.prose[11].text = `Thermodynamics and statistical mechanics are complementary.
Thermodynamics relates large-scale properties, while statistical mechanics connects those properties with a microscopic model.
Each explanation depends on whether the model's assumptions fit the body and the conditions being studied.

Statistical mechanics can explain thermodynamic laws when its microscopic model and the system's conditions are suitable.
Neither approach eliminates every limitation or every need for experimental evidence.`;
const out = `${ticket}/tmp/d1816-d1299-n3-three-readability-findings`;
const input = `${out}/en.before-native.json`;
save(input, draft);
const receipt = run('d1299-n3-five-affected-text-fields-native', [
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
for prefix in ("Thermal processes","Kinetic theory did not"):
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
  ...original, task: 'D1299', status: 'AFFECTED_ONLY_THREE_N3_READABILITY_FINDINGS_AUTHOR_PASS',
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
