import assert from 'node:assert/strict';
import fs from 'node:fs';
import { repo, ticket, read, bind, save, run } from './n42-native.mjs';
import { n40ReadabilityRepair } from './texts-d1485-n40-readability.mjs';
import { n42ReadabilityRepair } from './texts-d1486-n42-readability.mjs';

const card = process.argv[2];
const config = card === 'n42-sentence' ? {
  task: 'D1491', author: 'd1816-d1486-n42-affected-text', review: n42ReadabilityRepair.review,
  reviewName: 'affected-review.json',
  reviewHash: '6e699cb652d55e129f711bc0b0f653642ca04e0e6edbd5b315d28e647f1067a3',
  boundaryPrefixes: n42ReadabilityRepair.boundaryPrefixes,
  numericalEvidence: n42ReadabilityRepair.numericalEvidence,
  edits: [[25, 'The small subscripts identify these terms;\n\nthey are not multipliers.',
    'The small subscripts identify these terms.\nThey are not multipliers.']],
} : card === 'n43-sentence' ? {
  task: 'D1492', author: 'd1816-d1487-n43-affected-text', review: 'd1816-d1452-n43-first-en-review',
  reviewName: 'affected-review.json',
  reviewHash: '809fedb705348cfed4b8764e38153476c7fd876fb68dde5dc934085cae66b715',
  boundaryPrefixes: (await import('./texts-d1487-n43-readability.mjs')).n43ReadabilityRepair.boundaryPrefixes,
  edits: [[7, 'It also depends on pressure, or how hard the water pushes.',
    'Whether the sieve holds water also depends on pressure, or how hard the water pushes.']],
} : card === 'n40' ? n40ReadabilityRepair : card === 'n42' ? n42ReadabilityRepair
  : card === 'n43' ? (await import('./texts-d1487-n43-readability.mjs')).n43ReadabilityRepair
  : card === 'n46' ? (await import('./texts-d1488-n46-readability.mjs')).n46ReadabilityRepair : null;
assert(config);
const originalAuthor = bind(`${ticket}/tmp/${config.author}/authored.json`);
const original = read(originalAuthor.path);
const firstReview = bind(`${ticket}/tmp/${config.review}/${config.reviewName || 'review.json'}`);
assert.equal(firstReview.sha256, config.reviewHash);
assert.equal(read(firstReview.path).status, 'REVISE');
const lesson = read(original.englishDraft.path);
const repairs = [];
for (const [index, after] of Object.entries(config.updates || {})) {
  const before = lesson.prose[index].text;
  assert.notEqual(before, after);
  lesson.prose[index].text = after;
  repairs.push({ index: Number(index), before, after });
}
for (const [index, before, after] of config.edits || []) {
  assert.equal(lesson.prose[index].text.split(before).length, 2, `${card} exact fragment at ${index}`);
  lesson.prose[index].text = lesson.prose[index].text.replace(before, after);
  repairs.push({ index, before, after });
}
const indices = [...new Set(repairs.map(repair => repair.index))];
const directory = `${ticket}/tmp/d1816-${config.task.toLowerCase()}-${card}-affected-text`;
const input = `${directory}/en.before-native.json`;
save(input, lesson);
const numericalEvidence = config.numericalEvidence ? {
  ...config.numericalEvidence,
  report: bind(`${ticket}/evidence/reports/${config.numericalEvidence.report}`),
} : null;
const receipt = run(`${config.task.toLowerCase()}-${card}-affected-readability-native`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c',
  `import sys,json
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(input)}))
baseline=edition.load(Path(${JSON.stringify(original.englishDraft.path)}))
prepared=edition.load(Path(${JSON.stringify(original.prepared.path)}))
raw=edition.load(Path(prepared["source"]["path"]))
book=Path(prepared["source"]["path"]).parents[2]
raw_ex=edition.load(book/"lessons"/lesson["id"]/"exercises.json")
for i in ${JSON.stringify(indices)}:
    assert edition.math_signature(lesson["prose"][i]["text"])==edition.math_signature(baseline["prose"][i]["text"]),(i,"unchanged math")
edition.normalize_lesson_layout(lesson)
flow,errors=edition.prose_flow_contract(lesson["prose"],[])
boundaries=[]
for prefix in ${JSON.stringify(config.boundaryPrefixes)}:
    matches=[i for i,p in enumerate(flow["paragraphs"]) if p["text"].startswith(prefix)]
    assert len(matches)==1 and matches[0]>0,(prefix,matches)
    i=matches[0]
    boundaries.append({"before":flow["paragraphs"][i-1]["text"],"after":flow["paragraphs"][i]["text"]})
lesson["section_breaks"]=boundaries
flow,flow_errors=edition.prose_flow_contract(lesson["prose"],boundaries)
errors.extend(flow_errors)
corrections,errata_errors=edition.validate_errata(book,raw,raw_ex,lesson,{"exercises":[]})
errors.extend(errata_errors)
profile=edition.load(Path(${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json`)}))
for i in ${JSON.stringify(indices)}:
    source=raw["prose"][i]
    modern=lesson["prose"][i]
    errors.extend(edition.validate_text(source["text"],modern["text"],modern["changes"],modern["numeric_changes"],f"en.prose[{i}]",profile["forbidden_terms"]+profile["forbidden_person_names"],modern.get("historical_entities"),corrections.get(f"lesson.prose[{i}]"),modern.get("notation_changes")))
comparison=json.loads(json.dumps(lesson))
comparison["section_breaks"]=baseline["section_breaks"]
for i in ${JSON.stringify(indices)}:
    comparison["prose"][i]["text"]=baseline["prose"][i]["text"]
assert comparison==baseline,"Only named affected text and boundary anchors may change"
assert len(boundaries)==len(baseline["section_breaks"]),"Concept boundary count unchanged"
print(json.dumps({"lesson":lesson,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const result = read(receipt.path);
const output = JSON.parse(fs.readFileSync(result.streams.stdout.path, 'utf8'));
save(`${directory}/en.lesson.draft.json`, output.lesson);
save(`${directory}/en.prose-flow.json`, output.flow);
save(`${directory}/authored.json`, {
  ...original, task: config.task, status: 'AFFECTED_ONLY_SURFACE_HUMIDITY_READABILITY_AUTHOR_PASS',
  originalAuthor, firstIndependentReview: firstReview,
  englishBeforeNative: bind(input), englishDraft: bind(`${directory}/en.lesson.draft.json`),
  englishFlow: bind(`${directory}/en.prose-flow.json`), nativeReceipt: receipt,
  repairs, changedPointers: indices.map(index => `/prose/${index}/text`),
  numericalEvidence, onlyNamedReadabilityTextAndAdjacentAnchorsChanged: true,
  sourceMathNumbersFigureReferencesAndMetadataUnchanged: true,
  flowParagraphs: output.flow.paragraphs.length, derivedConceptBoundaries: output.flow.boundaries.length,
  conceptBoundaryCountUnchanged: true, independentAffectedReviewPending: true,
  imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ authored: bind(`${directory}/authored.json`),
  paragraphs: output.flow.paragraphs.length, affectedIndices: indices }));
