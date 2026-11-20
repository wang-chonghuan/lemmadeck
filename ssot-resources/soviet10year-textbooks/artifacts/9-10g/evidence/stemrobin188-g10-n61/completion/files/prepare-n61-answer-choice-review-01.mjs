import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n61-answer-choice-review-inputs-01')
assert.ok(!fs.existsSync(output), output)
for (const author of ['n61-answer-author', 'n61-choice-author'])
  assert.equal(read(path.join(tmp, `${author}-collection-01.json`)).status,
    'closed-agent-outputs-verified-once')
const lesson = 'geo910-c2-s3-n61'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const seedPath = path.join(tmp, 'n61-choice-author/seed.json')
const draftPath = path.join(tmp, 'n61-choice-author/draft.json')
const answerPath = path.join(tmp, 'n61-answer-author/work/9-10g/modern-us-neutral/lessons',
  lesson, 'answer-keys.candidate.v2.json')
const draft = read(draftPath)
assert.equal(draft.new_figures.length, 0)
assert.equal(read(answerPath).answers.length, 10)
assert.equal(hash(answerPath),
  '60d5c4de1cdb8f01fcf25a0125939b409864bf21e7735f4094179e85148bcf0d')
fs.mkdirSync(output)
const visible = path.join(output, 'visible-questions.json')
save(visible, { questions: draft.questions.map(question => ({
  id: question.id, source_numbers: question.source_numbers, view: question.view,
})) })
fs.chmodSync(visible, 0o444)
const inputs = [
  seedPath, draftPath, answerPath, visible,
  ...['lesson.json', 'exercises.json', 'figures.json'].map(file => path.join(target, file)),
  path.join(core, 'figures/fig-g10-88.png'),
  ...['svg', 'spec.json'].map(extension =>
    path.join(core, 'editions/modern-us-neutral/figures', `fig-g10-88.${extension}`)),
  path.join(tmp, 'n61-answer-author/fig-g10-88.current-render.png'),
  ...['n61-answer-author/report.json', 'n61-choice-author/report.json']
    .map(file => path.join(tmp, file)),
].filter(file => fs.existsSync(file))
save(path.join(output, 'manifest.json'), {
  schema: 'stemrobin188-N61-source-first-view-first-key-last-review-inputs@1',
  status: 'pending-one-independent-reviewer', lesson, book: '9-10g',
  seed: bind(seedPath), visible: bind(visible), draftKeyLast: bind(draftPath),
  answersKeyLast: bind(answerPath), inputs: inputs.map(file => ({
    ...bind(file), bytes: fs.statSync(file).size,
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
  })),
  reviewOrder: [
    'seed/definitions/prose/source88 pixels/current88 pixels then own sealed source solutions',
    'visible only fidelity/redundancy/leakage then independently solve every option and seal',
    'only then author draft/key and answer candidate comparison',
  ],
  outputRoot: path.join(tmp, 'n61-answer-choice-review-01'),
  maxImageLoads: 8, maxContextImageLoads: 24, passedTextAndFiguresNotReaudited: true,
  authorInputsNotEdited: true, wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ output, imagesLoadedByParent: 0, questions: draft.questions.length }))
