import assert from 'node:assert/strict';
import fs from 'node:fs';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const originalPath = `${ticket}/tmp/d1816-d1298-n2-first-missing-en/authored.json`;
const original = read(originalPath);
const review = bind(`${ticket}/tmp/d1816-d1283-n2-independent-review/n2-first-en-review.json`);
assert.equal(review.sha256, '1d6e0b7f314d36668b81e381ec8dbbe63fc381d4d802ac10d471bd2a4dfbc881');
assert.equal(read(review.path).status, 'REVISE');
assert.equal(bind(original.englishDraft.path).sha256, original.englishDraft.sha256);
const draft = read(original.englishDraft.path), indices = [2, 4, 7, 8, 9, 10, 11, 12];
draft.prose[2].text = `The textbook places an important development in the early seventeenth century: instruments for comparing temperature.
Thermometers made quantitative investigation possible, meaning that thermal processes could be studied using numerical measurements.
The text describes them as powerful tools for distinguishing sound explanations from mistaken ones.`;
draft.prose[4].text = `A competing view connected thermal behavior with the internal motion of particles.
In this historical picture, faster particle motion was associated with higher temperature.

An ideal gas is a simplified model in which interactions between particles can be neglected except during collisions.
In the classical ideal-gas model at thermal equilibrium, the gas has a well-defined temperature.
For the same kind of particles, higher temperature means greater average kinetic energy of their random motion; kinetic energy is energy of motion.

The average concerns many particles, not the speed of one particle or the bulk movement of the whole gas.
Heat itself is energy transferred because of a temperature difference, not the name for all microscopic motion stored in a body.`;
draft.prose[7].text = `The textbook's biographical note describes Lomonosov, who lived from 1711 to 1765.
It presents him as a Russian scholar, poet, public figure, and founder of Moscow University.
It attributes to Pushkin the description of him as the first Russian university.

The note discusses work in physics, chemistry, mining, and metallurgy, and writing about Russian history; it describes him as the founder of modern Russian grammar.
It also credits his writings with anticipating ideas associated with conservation of mass and energy.
These are retained as the textbook's historical account, not a claim that the fully developed modern laws were already established in those writings.`;
draft.prose[8].text = `In the textbook's account, Lomonosov made important contributions to the particle theory of heat.
He associated heat with the rotational motion of particles and used his theory to explain melting, evaporation, and thermal conduction.
The textbook judges those explanations broadly successful for the phenomena discussed; this is its historical assessment, not endorsement of that model as modern physics.

Thermal conduction is heat transfer through a material from warmer parts to cooler parts.
He also proposed a greatest possible degree of cold, associated in that theory with the stopping of particle motion.
This historical proposal is not the modern assertion that all microscopic motion simply stops at absolute zero.

The textbook says his influence reduced support for caloric theory among Russian scholars.`;
draft.prose[9].text = `In the textbook's mid-eighteenth-century account, caloric theory temporarily became more successful.
Heat-exchange experiments suggested a balance between the amounts of heat lost and gained in the systems being studied.
Supporters interpreted that balance as conservation of caloric.

They introduced heat capacity, which describes the energy needed to raise a body's temperature by one degree under stated conditions without a change of state.
They also developed a quantitative theory of thermal conduction, one that makes predictions with numbers.
Some terminology survived even though the fluid interpretation was later abandoned.

Heat-exchange balance does not establish that heat is a conserved material substance in every process.`;
draft.prose[10].text = `The early particle theory had difficulty producing useful quantitative relations.
In particular, it did not yet explain the connection between temperature and the particles' kinetic energy, their energy of motion, or the observed heat-exchange balance.
The modern concept of energy was not yet part of that account.

This helps explain why the simpler caloric picture could be more effective for some calculations at that stage.`;
draft.prose[11].text = `By the late eighteenth century, difficulties with caloric theory were growing.
The textbook describes its rejection by the middle of the nineteenth century.
Mechanical work transfers energy when a force moves something, and experiments showed that continued rubbing could warm a body as mechanical energy was supplied.

Continued rubbing requires a continued supply of energy, rather than a fixed store of caloric fluid.
The textbook also points to steam cooling as it does work in an engine: some of its energy leaves as work, rather than necessarily as heat passed to another body.
Neither example creates energy from nothing or eliminates the need to account for energy transfers.`;
draft.prose[12].text = `The textbook describes a result established by the middle of the nineteenth century: experiments demonstrated the quantitative equivalence of mechanical work and heat transfer.
This means that the amounts transferred by working on a body and by heating it can be compared using the same measure of energy.
It does not mean that an engine can convert all the heat it receives into work.

Heat and work are two ways of transferring energy, not substances contained in an object.
Heat transfer is caused by a temperature difference, while mechanical work transfers energy when a force moves something.
Supplying heat can increase a body's internal energy; it does not add a weightless fluid.

Energy conservation replaced the supposed conservation of caloric.
The textbook's phrase that heat is a form of energy is understood here as energy transferred thermally, not a separate stored material.`;
const out = `${ticket}/tmp/d1816-d1301-n2-four-findings`;
const input = `${out}/en.before-native.json`;
save(input, draft);
const receipt = run('d1301-n2-eight-affected-text-fields-native', [
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
for prefix in ("Experiments with thermometers","In the textbook's account, Lomonosov","By the late eighteenth"):
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
  ...original, task: 'D1301', status: 'AFFECTED_ONLY_FOUR_N2_FINDINGS_AUTHOR_PASS',
  originalAuthor: bind(originalPath), originalDraft: original.englishDraft,
  originalFlow: original.englishFlow, originalIndependentReview: review,
  englishDraft: bind(`${out}/en.lesson.draft.json`), englishFlow: bind(`${out}/en.prose-flow.json`),
  englishBeforeNative: bind(input), nativeReceipt: receipt,
  changedPointers: indices.map(index => `/prose/${index}/text`),
  directlyAffectedSectionAnchorsReboundFromActualFlow: true,
  allOtherTextMetadataMathAndSourceUnchanged: true, flowParagraphs: output.flow.paragraphs.length,
  firstQuantitativeOccurrenceGlossDirectlyClosesReadabilityFinding: true,
  passedAuthorScienceSourceAndFigureReviewReplayed: false,
  independentAffectedTextReview: 'pending',
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), paragraphs: output.flow.paragraphs.length }));
