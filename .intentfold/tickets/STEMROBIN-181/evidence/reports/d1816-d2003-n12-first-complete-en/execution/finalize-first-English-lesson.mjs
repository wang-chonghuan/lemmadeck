import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const config = read(process.argv[2]);
const { book, stage, author, preparedFile, out } = config;
const prepared = read(preparedFile), { card, edition } = prepared;
const chinese = `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral/lessons/${card}`;
const exerciseTemplateFile = config.exerciseTemplateFile ?? `${author}/exercises.template.json`;
const lessonTemplateFile = config.lessonTemplateFile ?? `${author}/lesson.template.json`;
const source = read(`${chinese}/exercises.json`), authored = read(exerciseTemplateFile);
assert.equal(authored.edition, edition);
assert.equal(authored.source.sha256, source.source.sha256);
assert.equal(authored.exercises.length, prepared.sourceQuestions);
assert.equal(read(lessonTemplateFile).prose.length, prepared.proseObjects ?? 0);
assert.equal(read(`${author}/figures.template.json`).figures.length, prepared.figures ?? 0);
for (let index = 0; index < source.exercises.length; index++) {
  for (const name of ['number', 'source_number', 'group', 'group_id', 'pages', 'source_text',
    'figure_refs', 'figures', 'numeric_changes'])
    assert.deepEqual(authored.exercises[index][name], source.exercises[index][name]);
  assert(authored.exercises[index].changes.includes('translation'));
}
const draft = read(`${author}/draft.json`), oldDraft = read(`${chinese}/choice-set/draft.json`);
assert.equal(draft.questions.length, oldDraft.questions.length);
assert.equal(draft.questions.reduce((sum, question) => sum + question.view.options.length, 0), prepared.choiceOptions);
for (let index = 0; index < draft.questions.length; index++) {
  const current = draft.questions[index], old = oldDraft.questions[index];
  assert.equal(current.id, old.id);
  assert.equal(current.view.mode, old.view.mode);
  assert.deepEqual(current.source_numbers, old.source_numbers);
  assert.deepEqual(current.key.correct, old.key.correct);
  assert.deepEqual(current.view.options.map(option => option.id), old.view.options.map(option => option.id));
}
const answers = read(`${author}/answer-keys.json`), oldAnswers = read(`${chinese}/answer-keys.json`);
assert.equal(answers.answers.length, prepared.readonlyAnswers);
for (let index = 0; index < answers.answers.length; index++) {
  assert.equal(answers.answers[index].grading, 'ungraded');
  assert.deepEqual(answers.answers[index].parts, []);
  assert.deepEqual(answers.answers[index].bookRaw, oldAnswers.answers[index].bookRaw);
}
let normalizedLessonFile = lessonTemplateFile, layout = null, flowParagraphs = 0;
if (prepared.proseObjects) {
  const prefixes = config.boundaryPrefixes ?? read(`${author}/source-binding/report.json`).boundary_suggestions
    .map(item => item.after_suggestion.split('\n')[0]);
  layout = run(`${stage}-native-layout-and-boundaries`, [
    `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B', '-c', `import json,sys,re
from pathlib import Path
sys.path.insert(0,${JSON.stringify(`${repo}/.claude/skills/ld-s10y-lesson/tools`)})
import edition
lesson=edition.load(Path(${JSON.stringify(normalizedLessonFile)}))
for block in lesson["prose"]:
    match=re.fullmatch(r"\\u56fe\\s*([0-9]+)",block["text"].strip()) if block["kind"]=="cap" else None
    if match:
        block["text"]="Figure "+match.group(1)
        block["changes"]=list(dict.fromkeys(block["changes"]+["translation"]))
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
  normalizedLessonFile = `${out}/lesson.normalized.json`;
  save(normalizedLessonFile, normalized.lesson);
  save(`${out}/flow.json`, normalized.flow);
  flowParagraphs = normalized.flow.paragraphs.length;
}
for (const name of ['lesson', 'exercises', 'figures'])
  fs.copyFileSync(name === 'exercises' ? exerciseTemplateFile
    : name === 'lesson' ? normalizedLessonFile : `${author}/${name}.template.json`,
    `${prepared.templates}/${name}.template.json`);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const pipeline = `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`;
for (const item of prepared.figureDependencies ?? []) {
  assert.equal(bind(item.input.path).sha256, item.input.sha256);
  const destination = `${prepared.carrier}/editions/${edition}/${item.relative}`;
  if (fs.existsSync(destination)) {
    assert.equal(bind(destination).sha256, item.input.sha256);
  } else {
    copy(item.input.path, destination);
  }
}
const finalize = run(`${stage}-adapt-finalize`, [
  python, '-B', pipeline, 'adapt-finalize', '--book', book, '--edition', edition,
  '--lesson', card, '--root', prepared.root, '--work', prepared.work,
]);
const target = `${prepared.carrier}/editions/${edition}/lessons/${card}`;
copy(`${author}/answer-keys.json`, `${target}/answer-keys.json`);
const answerFinalize = run(`${stage}-readonly-answer-finalize`, [
  python, '-B', `${repo}/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`,
  'finalize', '--book', book, '--edition', edition, '--lesson', card,
  '--root', prepared.root, '--work', prepared.work,
]);
const render = run(`${stage}-first-render`, [
  python, '-B', pipeline, 'render', '--book', book, '--edition', edition,
  '--lesson', card, '--root', prepared.root, '--work', prepared.work,
]);
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json'])
  copy(`${target}/${name}`, `${prepared.target}/${name}`);
for (const item of prepared.figureDependencies ?? [])
  copy(item.input.path, `${repo}/ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/${edition}/${item.relative}`);
save(`${out}/result.json`, {
  card, book, edition, status: 'NATIVE_EN_PASS_INDEPENDENT_EN_REVIEW_REQUIRED',
  prepared: bind(preparedFile), author: bind(`${author}/source-binding/report.json`),
  root: prepared.root, work: prepared.work, target: prepared.target, layout, finalize, answerFinalize, render,
  products: fs.readdirSync(prepared.target).map(name => bind(`${prepared.target}/${name}`)),
  html: ['text', 'exercises'].map(name => bind(`${prepared.work}/render/${book}/${edition}/${card}/${name}.html`)),
  sourceQuestions: prepared.sourceQuestions, readonlyAnswers: prepared.readonlyAnswers,
  proseObjects: prepared.proseObjects ?? 0, flowParagraphs,
  choiceQuestions: prepared.choiceQuestions, choiceOptions: prepared.choiceOptions,
  approvedCoverageLossesPreserved: true, englishIndependentReviewPending: true,
  canonicalCandidateNotIndexedOrPublished: true,
  originalChineseChanged: false, imagesOpened: 0, databaseWrites: 0, paidCalls: 0,
});
console.log(JSON.stringify({ card, native: bind(`${out}/result.json`) }));
