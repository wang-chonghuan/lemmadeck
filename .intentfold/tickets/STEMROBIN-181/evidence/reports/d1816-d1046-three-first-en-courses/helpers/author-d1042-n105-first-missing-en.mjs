import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const preparedPath = `${ticket}/tmp/d1816-d1041-n105-first-missing-en/prepared.json`;
const prepared = read(preparedPath);
assert.equal(bind(prepared.approvedZh.path).sha256, prepared.approvedZh.sha256);
const lesson = read(prepared.approvedZh.path);
const tocPath = `${repo}/ssot-resources/soviet10year-textbooks/toc/9p/en.json`;
const matches = read(tocPath).contents.flatMap(chapter => (chapter.lessons || []).flatMap(section =>
  (section.topics || []).filter(topic => topic.id === prepared.card).map(topic => ({ chapter, topic }))));
assert.equal(matches.length, 1);
const { chapter, topic } = matches[0];
Object.assign(lesson, { edition: 'modern-us-neutral-en', locale: 'en', status: 'draft',
  title: topic.title, chapter: chapter.title, printed_title: `${topic.printedNumber}. ${topic.title}` });
const texts = [
  `When a gas is ionized, it contains electrons and ions that can move freely.
When positive and negative charges approximately balance over a sufficiently large region, and the charged particles interact through electric fields and respond collectively, the system forms a **plasma**.
A plasma is approximately electrically neutral overall, but this does not mean it contains no charged particles.

Here, overall neutrality means that positive and negative charges approximately cancel in total, not that every very small region must be exactly neutral.
The simplest plasma can consist of just electrons and positive ions.
If a gas is not completely ionized, neutral atoms also remain, forming a multicomponent system containing electrons, positive ions, and neutral atoms.

This case, which includes neutral particles, is called a **partially ionized plasma**.`,
  `In a glow discharge, some regions near the cathode contain excess positive charge; positive and negative charges do not approximately cancel there.
These regions do not meet the approximate-neutrality condition described above, so they cannot themselves be treated as approximately neutral plasma regions.
The **positive column** of a glow discharge, the region called the positive glow column in the original textbook, is approximately electrically neutral overall.

It is an example of plasma formed by a discharge, called a **gas-discharge plasma**.`,
  `**Applications of gas-discharge plasma**
Neon lamps and fluorescent tubes use plasma formed by a gas discharge.
The discharge transfers energy to particles inside the tube, which subsequently emit light and other radiation.

The inner glass surface of a fluorescent tube is coated with phosphors. These absorb radiation emitted by the plasma inside the tube and then emit visible light.
Choosing appropriate phosphors makes the tube's emitted light close to white.`,
  `Gas-discharge plasma is also used in instruments such as gas lasers.
In these lasers, the discharge transfers energy to the gas so that it can produce laser light.
Laser radiation has special properties, such as a highly directional beam, which will be discussed further in later optics lessons.

A laser's power depends on its particular design. Using gas does not by itself make a laser the most powerful light source.`,
  String.raw`**Charged particles in metals**
Liquid and solid metals also contain electrons that can move within the metal, together with positively charged ion cores.
An ion core is the part of a metal atom left after removing the electrons that participate in conduction; the positive and negative charges in the metal still approximately balance overall.

An **electron-plasma model** can be used to study the collective motion of many electrons in a metal.
This is a model for studying charged particles, not a statement that a solid metal is an ionized gas.
In the usual model of a metal crystal, positive ion cores occupy lattice positions and mainly vibrate near those positions. Unlike conduction electrons, they do not move freely throughout the metal.

This differs from gas-discharge plasma and liquid metals, whose ion cores are not fixed at such lattice positions.
The number density of charged particles in metals is typically of the order of $10^{22}\sim10^{23}$ cm$^{-3}$.
Number density means the number of particles per unit volume; here the unit represents particles per cubic centimeter.

At this high density, an accurate description of the electrons' motion requires quantum mechanics.
The laws describing particles in a dilute gas cannot be applied unchanged to these densely packed electrons.`,
  `**Plasma in astronomical objects**
High temperatures in stars such as the Sun, together with effects such as radiation capable of ionizing atoms, cause atoms of different elements to lose electrons.
Much of the matter in stars is therefore in a plasma state.`,
  `Plasma is also found in the very dilute interstellar medium between stars.
Its ionized component contains electrons and ions. Some atoms lose all their electrons, leaving only positively charged atomic nuclei.
Interstellar plasma can have a very low density, but its temperature is not uniformly low.

Temperatures vary greatly between regions, which include both warmer ionized gas and very hot plasma.
Low density alone is not enough to conclude that a plasma is cold.`,
  `Stars such as the Sun continually release energy. Maintaining their high internal temperature therefore requires a continuing supply of energy.
An important source of this energy is **thermonuclear reactions** in their interiors, in which light atomic nuclei combine into heavier nuclei and release energy.
This combining of nuclei is called **nuclear fusion**. The released energy helps maintain the high-temperature plasma inside stars.`,
  `On Earth, researchers are also studying how to control nuclear fusion so that energy released by thermonuclear reactions can become a usable energy source.
Controlled fusion holds the prospect of supplying large amounts of energy, but achieving a reaction and building a practical energy-producing system are not the same thing.
Long-term, stable energy production also requires addressing sustained operation, fuel supply, material durability, and the energy balance of the entire system.

It is therefore an important direction of energy research. Its potential should not be described as an inexhaustible energy source that has already been achieved.`,
];
assert.equal(texts.length, lesson.prose.length);
for (let i = 0; i < texts.length; i++) lesson.prose[i].text = texts[i];
const out = `${ticket}/tmp/d1816-d1042-n105-first-missing-en`;
const input = `${out}/en.before-native.json`;
save(input, lesson);
const receipt = run('d1042-n105-first-missing-en-author-native', [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(input)}))
prepared=edition.load(Path(${JSON.stringify(preparedPath)}))
raw=edition.load(Path(prepared["source"]["path"]))
zh=edition.load(Path(prepared["approvedZh"]["path"]))
edition.normalize_lesson_layout(lesson)
flow,errors=edition.prose_flow_contract(lesson["prose"],[])
boundaries=[]
for prefix in ["**Applications of gas-discharge plasma**","**Charged particles in metals**","**Plasma in astronomical objects**","On Earth, researchers"]:
    indices=[i for i,p in enumerate(flow["paragraphs"]) if p["text"].startswith(prefix)]
    assert len(indices)==1 and indices[0]>0,(prefix,indices)
    i=indices[0]
    boundaries.append({"before":flow["paragraphs"][i-1]["text"],"after":flow["paragraphs"][i]["text"]})
lesson["section_breaks"]=boundaries
flow,flow_errors=edition.prose_flow_contract(lesson["prose"],boundaries)
errors.extend(flow_errors)
errors.extend(edition.validate_lesson_identity(raw,lesson))
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
for i,(modern,approved,source) in enumerate(zip(lesson["prose"],zh["prose"],raw["prose"])):
    modern["changes"]=[] if modern["text"]==source["text"] else list(dict.fromkeys(modern["changes"]+["translation"]))
    assert edition.math_signature(modern["text"])==edition.math_signature(approved["text"]),(i,"math signature")
    errors.extend(edition.validate_identity_fields(source,modern,["kind","id","printed_page","source_refs"],f"en.prose[{i}]"))
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{i}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities")))
print(json.dumps({"lesson":lesson,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const output = JSON.parse(fs.readFileSync(read(receipt.path).streams.stdout.path, 'utf8'));
save(`${out}/en.lesson.draft.json`, output.lesson);
save(`${out}/en.prose-flow.json`, output.flow);
save(`${out}/authored.json`, {
  task: 'D1042', card: prepared.card, status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS',
  prepared: bind(preparedPath), source: prepared.source, approvedZh: prepared.approvedZh,
  historicalZhNative: prepared.completeChineseHistoricalNative, historicalZhScience: prepared.historicalZhScience,
  englishToc: bind(tocPath), englishBeforeNative: bind(input),
  englishDraft: bind(`${out}/en.lesson.draft.json`), englishFlow: bind(`${out}/en.prose-flow.json`),
  nativeReceipt: receipt, errors: output.errors, originalObjects: 9, originalTasks: 0, originalFigures: 0,
  flowParagraphs: output.flow.paragraphs.length, derivedConceptBoundaries: 4,
  originalSourceZhAndFigureReviewReplayed: false, alreadyCountedInD025: true,
  independentEnglishReviewAndFullNativeFinalize: 'pending',
  fullCourseApproval: false, parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), paragraphs: output.flow.paragraphs.length }));
