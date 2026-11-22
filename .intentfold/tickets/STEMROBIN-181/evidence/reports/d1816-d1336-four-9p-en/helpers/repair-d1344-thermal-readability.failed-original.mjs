import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const number = process.argv[2];
assert(['n15', 'n18'].includes(number));
const configurations = {
  n15: {
    task: 'D1344', author: 'd1816-d1316-n15-first-missing-en',
    review: 'd1816-d1317-n15-independent-review/n15-first-en-review.json',
    reviewHash: 'cd8b21e0b3cdc68aba3bc34316fc1ba75dc328e7913e8bfb92cba74517d95053',
    indices: [2, 3, 5, 10, 11],
    texts: [
      `At constant pressure, extending the ideal gas's volume-temperature relation to zero volume gives the zero point called absolute zero.
Such an extension beyond the measured range is called extrapolation.
A real gas may first become a liquid or solid as it cools.

Matter still takes up space at absolute zero.
Zero volume on this extrapolated graph is a result of the model, not a real-gas cooling experiment that can be carried out directly.`,
      `A dilute gas has particles spread far apart.
In suitable temperature and pressure ranges, it can behave approximately like an ideal gas.

Measurements on increasingly dilute gases, compared through their volume-temperature relations, can identify the limiting zero point of the ideal-gas temperature scale.
Being dilute and approaching low temperature are not the same condition.

If the same real gas keeps cooling, it can depart from ideal-gas behavior.
It need not remain gaseous and actually shrink to zero volume.`,
      String.raw`This gives the approximate Celsius temperature of absolute zero, $t=-273^\circ\mathrm{C}$①.
Absolute zero is the lower limit of the ordinary thermal-equilibrium temperature scale.

In thermal equilibrium, parts that can exchange heat have the same temperature.
There is no overall flow of heat between them.
The textbook quotes Lomonosov's phrase "the final degree of cold" to describe this limit.

The integer value here is approximate.`,
      String.raw`Classical kinetic theory is the model used here to describe the gas particles' motion.
Kinetic energy is energy of motion.
In this model, absolute temperature is related to the average kinetic energy of the gas particles' irregular motion.

As $T=0$ is approached as a limit, the average thermal kinetic energy in this classical model approaches zero.
Microscopic motion means motion on a scale too small to see directly.
This does not justify saying that all microscopic motion in every material stops completely.

The third chapter discusses temperature and microscopic motion further.`,
      String.raw`With the kelvin scale, the constant-pressure relation for a fixed amount of ideal gas has a simpler form.
Here the expansion-coefficient symbol, alpha, means just the coefficient's number, 1/273, when the coefficient is expressed per kelvin or per degree Celsius of temperature difference.

The physical coefficient still has its inverse-temperature unit.
These numerical equations use only its number.
Using the same integer approximation:
$1+\alpha t=1+\frac{1}{273}(T-273)=\alpha T$.

Therefore:
$V=V_0\alpha T$.
(2-7)

These equations use the temperature and coefficient values just specified.
For a fixed amount of gas at fixed pressure, volume is proportional to absolute temperature.`,
    ],
  },
  n18: {
    task: 'D1345', author: 'd1816-d1323-n18-first-missing-en',
    review: 'd1816-d1324-n18-independent-review/n18-first-en-review.json',
    reviewHash: '978366df4419059b7b90f430c7ab29a96da96d7cef51840ac8d523b70cc4abde',
    indices: [8],
    texts: [String.raw`Extending these straight isochores toward lower temperatures is called extrapolation.
The extended lines pass through the origin $O$.
This is a statement about the ideal-gas model.

At fixed volume, pressure approaches zero as absolute temperature approaches absolute zero.
That fixed volume does not also become zero.
Holding a nonzero pressure fixed would be a different, constant-pressure extrapolation, in which volume approaches zero with absolute temperature.

A real gas can liquefy, meaning turn into a liquid, at low temperature.
The extrapolated origin is not a state that a real gas necessarily approaches continuously.`],
  },
};
const config = configurations[number], originalPath = `${ticket}/tmp/${config.author}/authored.json`;
const original = read(originalPath), review = bind(`${ticket}/tmp/${config.review}`);
assert.equal(review.sha256, config.reviewHash);
assert.equal(read(review.path).status, 'REVISE');
assert.equal(bind(original.englishDraft.path).sha256, original.englishDraft.sha256);
const draft = read(original.englishDraft.path);
for (const [offset, index] of config.indices.entries()) draft.prose[index].text = config.texts[offset];
const out = `${ticket}/tmp/d1816-${config.task.toLowerCase()}-${number}-readability`;
copy(review.path, `${out}/original-independent-review.json`);
const input = `${out}/en.before-native.json`;
save(input, draft);
const receipt = run(`${config.task.toLowerCase()}-${number}-affected-readability-native`, [
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
for boundary in before["section_breaks"]:
    matches=[i for i,p in enumerate(flow["paragraphs"]) if p["text"]==boundary["after"]]
    assert len(matches)==1 and matches[0]>0,(boundary,matches)
    index=matches[0]
    boundaries.append({"before":flow["paragraphs"][index-1]["text"],"after":flow["paragraphs"][index]["text"]})
draft["section_breaks"]=boundaries
flow,flow_errors=edition.prose_flow_contract(draft["prose"],boundaries)
errors.extend(flow_errors)
restored=json.loads(json.dumps(draft))
for i in ${JSON.stringify(config.indices)}: restored["prose"][i]["text"]=before["prose"][i]["text"]
restored["section_breaks"]=before["section_breaks"]
assert restored==before,"Unrelated candidate field changed"
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
for i in ${JSON.stringify(config.indices)}:
    source,modern=raw["prose"][i],draft["prose"][i]
    assert edition.math_signature(modern["text"])==edition.math_signature(zh["prose"][i]["text"])
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{i}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities"),[]))
print(json.dumps({"lesson":draft,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const output = JSON.parse(fs.readFileSync(read(receipt.path).streams.stdout.path, 'utf8'));
const comparison = structuredClone(output.lesson), before = read(original.englishDraft.path);
for (const index of config.indices) comparison.prose[index].text = before.prose[index].text;
comparison.section_breaks = before.section_breaks;
assert.deepEqual(comparison, before);
save(`${out}/en.lesson.draft.json`, output.lesson);
save(`${out}/en.prose-flow.json`, output.flow);
save(`${out}/authored.json`, {
  ...original, task: config.task, status: 'AFFECTED_ONLY_THERMAL_READABILITY_FINDINGS_AUTHOR_PASS',
  originalAuthor: bind(originalPath), originalDraft: original.englishDraft, originalFlow: original.englishFlow,
  originalIndependentReview: review, englishDraft: bind(`${out}/en.lesson.draft.json`),
  englishFlow: bind(`${out}/en.prose-flow.json`), englishBeforeNative: bind(input), nativeReceipt: receipt,
  changedPointers: config.indices.map(index => `/prose/${index}/text`),
  directlyAffectedSectionAnchorsReboundFromActualFlow: true,
  allOtherTextMetadataMathAndSourceUnchanged: true, flowParagraphs: output.flow.paragraphs.length,
  reader: 'Capable eight-year-old independently reading the original gas-law lesson',
  readerQuestion: number === 'n15' ? 'What do the ideal-gas zero point and numerical coefficient mean?'
    : 'What does extending the isochore toward the origin say about the model and the real gas?',
  passedAuthorScienceSourceAndFigureReviewReplayed: false, independentAffectedTextReview: 'pending',
});
console.log(JSON.stringify({ authored: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), paragraphs: output.flow.paragraphs.length }));
