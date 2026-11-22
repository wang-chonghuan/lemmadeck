import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const preparedPath = `${ticket}/tmp/d1816-d1054-n61-first-missing-en/prepared.json`;
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
  `Electrification by friction involves the transfer of charged particles between objects. In common cases, electrons are transferred.
An electron carries one negative elementary charge, but not every kind of charged particle carries one positive elementary charge.
If the objects being rubbed and the charged particles involved are considered together as a system, and no charge crosses its boundary, the system's total charge stays unchanged.

The algebraic sum of the positive and negative charges after electrification remains zero only if the system's total charge was zero initially.
An individual object can gain or lose electrons and become charged.`,
  `Electrification obeys the **law of conservation of electric charge**.
In this lesson, a system across whose chosen boundary no charge passes is called isolated with respect to charge. **In such a system, the algebraic sum of the charges of all its particles stays constant**.

This does not mean that no charge can be transferred inside the system, nor does it require the number of particles to stay unchanged.
Whether the system exchanges energy is a separate condition.
The total charge keeps its initial value, which is not necessarily zero. This can be expressed as:`,
  String.raw`$q_1+q_2+q_3+\cdots+q_n=$constant (8-1)
Each term represents a particle's signed charge, and "constant" is the initial total charge of the chosen system.
Positive and negative charges must be combined algebraically, not by adding only the magnitudes of their charges.`,
  `**Conservation of charge is not conservation of the number of charged particles**.
If the types, charges, and number of particles do not change, their total charge naturally remains unchanged.
But particles can be created, transformed, or cease to exist in their original particle form through interactions①.

Creating a pair of charged particles with equal charge magnitudes and opposite signs, or the mutual annihilation of such a pair, provides examples in which total charge stays unchanged.
These examples do not mean that every particle process must occur in pairs, or that each resulting particle must be electrically neutral.
Regardless of changes in particle types or number, the total charge before and after a complete process is the same when that process is isolated with respect to charge.`,
  `① The original textbook notes that particle creation and mutual transformations will be discussed further in the tenth-grade physics textbook.`,
  `Many experiments involving particle interactions and transformations support the law of conservation of charge, which reflects a basic property of electric charge.
The original textbook's final sentence describes the reason for charge conservation as unknown at that time. This is a statement about knowledge in the textbook's era, not a complete account of present-day theoretical research.
This lesson does not develop a deeper theoretical explanation of the law.

For now, focus on accounting for the signed total charge within the chosen system.`,
];
assert.equal(texts.length, lesson.prose.length);
for (let i = 0; i < texts.length; i++) lesson.prose[i].text = texts[i];
const out = `${ticket}/tmp/d1816-d1055-n61-first-missing-en`;
const input = `${out}/en.before-native.json`;
save(input, lesson);
const receipt = run('d1055-n61-first-missing-en-author-native', [
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
for prefix in ["Electrification obeys","**Conservation of charge is not","Many experiments"]:
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
  task: 'D1055', card: prepared.card, status: 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS',
  prepared: bind(preparedPath), source: prepared.source, approvedZh: prepared.approvedZh,
  historicalZhNative: prepared.completeChineseHistoricalNative, historicalZhScience: prepared.historicalZhScience,
  englishToc: bind(tocPath), englishBeforeNative: bind(input),
  englishDraft: bind(`${out}/en.lesson.draft.json`), englishFlow: bind(`${out}/en.prose-flow.json`),
  nativeReceipt: receipt, errors: output.errors, originalObjects: 6, originalTasks: 0, originalFigures: 0,
  flowParagraphs: output.flow.paragraphs.length, derivedConceptBoundaries: 3,
  originalSourceZhAndFigureReviewReplayed: false, alreadyCountedInD017: true,
  independentEnglishReviewAndFullNativeFinalize: 'pending',
  fullCourseApproval: false, parentNewImages: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ author: bind(`${out}/authored.json`),
  draft: bind(`${out}/en.lesson.draft.json`), paragraphs: output.flow.paragraphs.length }));
