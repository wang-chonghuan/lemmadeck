import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n68-answer-choice-review-inputs-01')
assert.ok(!fs.existsSync(output))
for (const name of ['n68-answer-author', 'n68-choice-author'])
  assert.equal(read(path.join(tmp, `${name}-collection-01.json`)).status, 'closed-agent-outputs-verified-once')
const lesson = 'geo910-c2-s3-n68'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const seed = path.join(tmp, 'n68-choice-author/seed.json')
const draft = path.join(tmp, 'n68-choice-author/draft.json')
const answer = path.join(tmp, 'n68-answer-author/answer-keys.candidate.json')
const choice = read(draft)
assert.deepEqual(read(seed).exercises.map(item => item.number),
  Array.from({ length: 8 }, (_, index) => String(252 + index)))
assert.equal(read(seed).figures.length, 0)
assert.equal(choice.new_figures.length, 0)
assert.deepEqual(read(answer).answers.map(item => item.exercise),
  Array.from({ length: 8 }, (_, index) => String(252 + index)))
fs.mkdirSync(output)
const visible = path.join(output, 'visible-questions.json')
save(visible, { questions: choice.questions.map(item => ({
  id: item.id, source_numbers: item.source_numbers, view: item.view,
})) })
fs.chmodSync(visible, 0o444)
const inputs = [seed, visible, draft, answer,
  ...['lesson.json', 'exercises.json', 'figures.json'].map(file => path.join(target, file))]
save(path.join(output, 'manifest.json'), {
  schema: 'stemrobin188-source-first-view-first-key-last-review-inputs@1',
  status: 'pending-one-independent-reviewer', lesson, book: '9-10g',
  seed: bind(seed), visible: bind(visible), draftKeyLast: bind(draft), answersKeyLast: bind(answer),
  inputs: inputs.map(file => ({ ...bind(file), bytes: fs.statSync(file).size,
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0') })),
  reviewOrder: ['Independently solve252-259 from seed and seal.',
    'Visible questions only: fidelity,redundancy,leakage; solve each option and seal.',
    'Only then compare draft keys and answer candidate; assess grading reliability.'],
  outputRoot: path.join(tmp, 'n68-answer-choice-review-01'),
  maxImageLoads: 0, passedTextAndFigureNotReaudited: true,
  preserve253AmbiguityAnd255MissingDensity: true,
  noExactFallbackForParameterDomainFalseRejections: true,
  authorInputsNotEdited: true, wholeLessonApproved: false, published: false,
})
