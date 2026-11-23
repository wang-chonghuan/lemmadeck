import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, read, save, bind, copy, run } from './n42-native.mjs';

const config = read(process.argv[2]);
const { book, stage, author, preparedFile, out } = config;
const prepared = read(preparedFile), { card, edition } = prepared;
const input = `${author}/lesson.template.json`;
const report = read(`${author}/source-binding/report.json`);
const prefixes = report.boundary_suggestions.map(item => item.after_suggestion.split('\n')[0]);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const layout = run(`${stage}-native-layout-and-boundaries`, [
  python, '-B', '-c', `import json,sys
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(input)}))
edition.normalize_lesson_layout(lesson)
flow,errors=edition.prose_flow_contract(lesson["prose"],[])
boundaries=[]
for prefix in ${JSON.stringify(prefixes)}:
    indices=[i for i,p in enumerate(flow["paragraphs"]) if p["text"].startswith(prefix)]
    assert len(indices)==1 and indices[0]>0,(prefix,indices)
    i=indices[0]
    boundaries.append({"before":flow["paragraphs"][i-1]["text"],"after":flow["paragraphs"][i]["text"]})
lesson["section_breaks"]=boundaries
flow,flow_errors=edition.prose_flow_contract(lesson["prose"],boundaries)
errors.extend(flow_errors)
print(json.dumps({"lesson":lesson,"flow":flow,"errors":errors},ensure_ascii=False))
assert not errors,errors`,
]);
const normalized = JSON.parse(fs.readFileSync(read(layout.path).streams.stdout.path, 'utf8'));
save(`${out}/lesson.normalized.json`, normalized.lesson);
save(`${out}/flow.json`, normalized.flow);
fs.copyFileSync(`${out}/lesson.normalized.json`, `${prepared.templates}/lesson.template.json`);
for (const name of ['exercises', 'figures'])
  fs.copyFileSync(`${author}/${name}.template.json`, `${prepared.templates}/${name}.template.json`);
for (const item of prepared.figureDependencies) {
  assert.equal(bind(item.input.path).sha256, item.input.sha256);
  copy(item.input.path, `${prepared.carrier}/editions/${edition}/${item.relative}`);
}
const pipeline = `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`;
const finalize = run(`${stage}-adapt-finalize`, [
  python, '-B', pipeline, 'adapt-finalize', '--book', book, '--edition', edition,
  '--lesson', card, '--root', prepared.root, '--work', prepared.work,
]);
const render = run(`${stage}-first-render`, [
  python, '-B', pipeline, 'render', '--book', book, '--edition', edition,
  '--lesson', card, '--root', prepared.root, '--work', prepared.work,
]);
const carrierTarget = `${prepared.carrier}/editions/${edition}/lessons/${card}`;
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'])
  copy(`${carrierTarget}/${name}`, `${prepared.target}/${name}`);
for (const item of prepared.figureDependencies)
  copy(item.input.path, `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/${edition}/${item.relative}`);
save(`${out}/result.json`, {
  card, book, edition, status: 'NATIVE_EN_PASS_INDEPENDENT_EN_REVIEW_REQUIRED',
  prepared: bind(preparedFile), author: bind(`${author}/source-binding/report.json`),
  root: prepared.root, work: prepared.work, target: prepared.target, layout, finalize, render,
  products: fs.readdirSync(prepared.target).map(name => bind(`${prepared.target}/${name}`)),
  html: ['text', 'exercises'].map(name => bind(`${prepared.work}/render/${book}/${edition}/${card}/${name}.html`)),
  proseObjects: prepared.proseObjects, solvedExamples: prepared.solvedExamples,
  writtenExercises: 0, requiredWrites: ['base'], figures: prepared.figures,
  flowParagraphs: normalized.flow.paragraphs.length, conceptBoundaries: prefixes.length,
  originalChineseChanged: false, unchangedFigureEvidenceReused: true,
  independentEnglishReviewPending: true, canonicalNotIndexedOrPublished: true,
  imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ card, result: bind(`${out}/result.json`) }));
