import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const preparedPath = `${ticket}/tmp/d1816-d1034-n89-first-missing-en/prepared.json`;
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
  `The establishment of an electric field propagates along a conductor.
In the approximate description used in this section, its propagation speed is close to the speed of light, 300000 kilometers per second.
The directed motion of the electrons themselves in the conductor is much slower.

Next, we calculate the speed of the electrons' directed motion in a copper conductor, also called the drift speed, to distinguish these two speeds.`,
  String.raw`**Use formula (9-2) to find the drift speed.**
$v=\frac{|I|}{|q_0|nS}.$

The magnitudes of the current and the electron charge are used here. The result is a speed, not a velocity with a direction.`,
  String.raw`For example, let the current be $I=1$ ampere and the conductor's cross-sectional area be $S=10^{-6}$ m$^2$.
Electrons carry negative charge; here we use the magnitude of that charge, $e=|q_0|=1.6\times10^{-19}$ coulomb.
In a model where each copper atom contributes one free electron, the number of free electrons in $1$ m$^3$ of copper equals the number of atoms.

These valence electrons are shared throughout the metal and can move freely.
The free-electron number density is $n=8.5\times10^{28}/$m$^3$ (see Exercise 1, Question 7).
Using approximate values at the stated precision, substitution gives:
$v=\frac{1}{1.6\times10^{-19}\times8.5\times10^{28}\times10^{-6}}$m/s$=7\times10^{-5}$m/s.

This drift speed is much smaller than the electric field's propagation speed.
A current can become established quickly without electrons first traveling the entire wire from the power source.`,
  `A pipe filled with water provides an analogy.
When a pump starts pumping, a change in pressure propagates along the pipe at hundreds of meters per second, causing the water in its different sections to start moving quickly.
**The speed of each portion of water itself, however, is only tens of centimeters per second.**

A pressure change propagating quickly does not mean that the water itself flows quickly.
Likewise, rapid field propagation does not mean rapid electron drift.`,
];
assert.equal(texts.length, lesson.prose.length);
for (let i = 0; i < texts.length; i++) lesson.prose[i].text = texts[i];
const out = `${ticket}/tmp/d1816-d1035-n89-first-missing-en`;
const input = `${out}/en.before-native.json`;
save(input, lesson);
const receipt = run('d1035-n89-first-missing-en-author-native', [
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
indices=[i for i,p in enumerate(flow["paragraphs"]) if p["text"].startswith("**Use formula (9-2)")]
assert len(indices)==1 and indices[0]>0,indices
i=indices[0]
lesson["section_breaks"]=[{"before":flow["paragraphs"][i-1]["text"],"after":flow["paragraphs"][i]["text"]}]
flow,flow_errors=edition.prose_flow_contract(lesson["prose"],lesson["section_breaks"])
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
  task: 'D1035', card: prepared.card, status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS',
  prepared: bind(preparedPath), source: prepared.source, approvedZh: prepared.approvedZh,
  historicalZhNative: prepared.completeChineseHistoricalNative, historicalZhScience: prepared.historicalZhScience,
  englishToc: bind(tocPath), englishBeforeNative: bind(input),
  englishDraft: bind(`${out}/en.lesson.draft.json`), englishFlow: bind(`${out}/en.prose-flow.json`),
  nativeReceipt: receipt, errors: output.errors, originalObjects: 4, originalTasks: 0, originalFigures: 0,
  flowParagraphs: output.flow.paragraphs.length, derivedConceptBoundaries: 1,
  originalSourceZhAndFigureReviewReplayed: false, alreadyCountedInD022: true,
  independentEnglishReviewAndFullNativeFinalize: 'pending',
  fullCourseApproval: false, parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), paragraphs: output.flow.paragraphs.length }));
