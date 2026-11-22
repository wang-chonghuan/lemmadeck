import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const originalPath = `${ticket}/tmp/d1816-d1309-n10-first-missing-en/authored.json`;
const original = read(originalPath);
const review = bind(`${ticket}/tmp/d1816-d1310-n10-independent-review/n10-first-en-review.json`);
assert.equal(review.sha256, '8ea551ae7d22eb6ddefb0ca58d11868236b2ee4a69ab479de392377a3ce08978');
assert.equal(read(review.path).status, 'REVISE');
assert.equal(bind(original.englishDraft.path).sha256, original.englishDraft.sha256);
const draft = read(original.englishDraft.path), indices = [0, 2, 3];
draft.prose[0].text = `The same gas can be in different states.
Even when its mass stays unchanged, its volume and pressure can differ between thermal-equilibrium states.
Thermal equilibrium means that parts in thermal contact have settled at the same temperature.
Heat does not flow overall from one of these parts to another.

For example, changing the space available to the gas, or changing how it exchanges energy with its surroundings, can change its state.
When comparing states, say which conditions stay unchanged.`;
draft.prose[2].text = String.raw`We can study matter as a macroscopic system without following each molecule's motion.
Quantities such as $V$, $p$, and $t$ describe its state.

They are called thermodynamic parameters.
Here we consider the same kind and mixture of gas, with the same quantity of gas.
We compare states in thermal equilibrium.

The parameters may be related;
they cannot all be changed independently in arbitrary ways.`;
draft.prose[3].text = String.raw`We consider a uniform gas: its temperature, pressure, and mixture of gases are the same throughout the sample.
The gas kind and quantity stay unchanged.
If its volume, pressure, and temperature also stay unchanged, changing only the sealed container's shape does not make a different thermodynamic state.
We look at the whole sample, not individual molecules.
We neglect small effects such as interactions between the gas and the container surface.

Figures $15$ and $16$ show differently shaped containers.
The original textbook uses the oxygen inside them to make this comparison: equal gas amounts, volumes, pressures, and temperatures are the conditions for the same state, not merely similar container outlines.

The figures are schematic, with thermometers and pressure-measuring apparatus.
They provide no precise readings or container dimensions, so drawn sizes or liquid-column lengths cannot determine measured values.

Heat capacity tells us how much heat the gas needs for a given rise in temperature under specified conditions.
Those heating conditions must match in a comparison.
For example, heating at unchanged volume is a different process from heating at unchanged pressure.
Under matching conditions, container shape itself does not determine the gas's heat capacity.

The heat capacity of the gas is different from the total heat capacity measured for the gas together with its container.`;
const out = `${ticket}/tmp/d1816-d1343-n10-two-readability-recovery`;
copy(review.path, `${out}/original-independent-review.json`);
copy(`${ticket}/tmp/d1816-recovery/d1341-first-review-intake-failure.json`,
  `${out}/original-intake-failure.json`);
const input = `${out}/en.before-native.json`;
save(input, draft);
const receipt = run('d1343-n10-three-affected-readability-fields-native-recovery', [
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
flow,errors=edition.prose_flow_contract(draft["prose"],draft["section_breaks"])
restored=json.loads(json.dumps(draft))
for i in ${JSON.stringify(indices)}: restored["prose"][i]["text"]=before["prose"][i]["text"]
assert restored==before,"Unrelated candidate field changed"
assert len(flow["paragraphs"])>0
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
assert.deepEqual(comparison, before);
save(`${out}/en.lesson.draft.json`, output.lesson);
save(`${out}/en.prose-flow.json`, output.flow);
save(`${out}/authored.json`, {
  ...original, task: 'D1343', status: 'AFFECTED_ONLY_TWO_N10_READABILITY_FINDINGS_AUTHOR_PASS',
  originalAuthor: bind(originalPath), originalDraft: original.englishDraft, originalFlow: original.englishFlow,
  originalIndependentReview: review,
  englishDraft: bind(`${out}/en.lesson.draft.json`), englishFlow: bind(`${out}/en.prose-flow.json`),
  englishBeforeNative: bind(input), nativeReceipt: receipt,
  changedPointers: indices.map(index => `/prose/${index}/text`),
  findingIds: ['N10-EN-R1', 'N10-EN-R2'],
  allOtherTextMetadataMathSourceAndSectionAnchorsUnchanged: true,
  affectedParagraphFlowRefreshedFromActualNativeOutput: true,
  originalParagraphCountAssumptionFailure: bind(`${ticket}/tmp/d1816-recovery/native/d1341-n10-three-affected-readability-fields-native/receipt.json`),
  flowParagraphs: output.flow.paragraphs.length,
  reader: 'Capable eight-year-old independently understanding gas-state comparisons',
  readerQuestion: 'Which conditions must match when comparing the same gas in different containers?',
  passedAuthorScienceSourceAndFigureReviewReplayed: false,
  independentAffectedTextReview: 'pending',
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), paragraphs: output.flow.paragraphs.length }));
