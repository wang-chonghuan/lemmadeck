import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const lesson = 'geo910-c1-s3-n41'
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const work = path.join(tmp, 'g10-n41/work')
const templates = path.join(work, 'adapt/9-10g/modern-us-neutral/lessons', lesson)
const output = path.join(tmp, 'n41-answer-display-repair-01')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
}
const action = process.argv[2]
if (action === 'repair') {
  assert.ok(!fs.existsSync(output))
  const review = path.join(tmp, 'n41-answer-choice-review-01')
  assert.equal(json(path.join(review, 'answer-review.json')).outcome, 'revise')
  assert.equal(json(path.join(review, 'review.json')).outcome, 'pass')
  fs.mkdirSync(output)
  const candidatePath = path.join(tmp, 'n41-answer-author/answer-keys.candidate.json')
  assert.equal(hash(candidatePath), '83011f5701b6cade19fdb7a79c596e9a0e516e7dafc9560f0985d105ececae43')
  copy(candidatePath, path.join(output, 'before/answer-keys.candidate.json'))
  const candidate = json(candidatePath)
  for (const number of ['392', '397']) {
    const answer = candidate.answers.find(item => item.exercise === number)
    assert.equal(answer.grading, 'auto')
    answer.grading = 'ungraded'
    answer.parts = []
    answer.notes = number === '392'
      ? 'Open interval notation has equivalent correct forms not reliably recognized by the current exact judge. Retain the full range answer without automatic correctness grading.'
      : 'The distance parameter is nonnegative; the current expression judge has no domain-aware equivalence contract for alternative square-root forms. Retain the full symbolic answer without automatic correctness grading.'
  }
  save(path.join(output, 'answer-keys.candidate.json'), candidate)
  const templatePath = path.join(templates, 'exercises.template.json')
  copy(templatePath, path.join(output, 'before/exercises.template.json'))
  const template = json(templatePath)
  const changes = []
  for (const number of ['391', '392', '393', '394', '396', '397']) {
    const exercise = template.exercises.find(item => item.number === number)
    const prefix = `${number}．`
    assert.ok(exercise.text.startsWith(prefix))
    exercise.text = `${number}.` + exercise.text.slice(prefix.length)
    exercise.lines[0] = `${number}.` + exercise.lines[0].slice(prefix.length)
    if (!exercise.changes.includes('layout')) exercise.changes.push('layout')
    changes.push({ number, field: 'printed-number punctuation only', before: prefix, after: `${number}.` })
  }
  const exercise = template.exercises.find(item => item.number === '395')
  const boundary = '证明：$'
  assert.equal(exercise.text.split(boundary).length, 2)
  exercise.text = exercise.text.replace(boundary, '证明：\n$')
  exercise.lines = exercise.text.split('\n')
  if (!exercise.changes.includes('layout')) exercise.changes.push('layout')
  changes.push({ number: '395', field: 'line break before unchanged full formula', mathChanged: false })
  save(path.join(output, 'exercises.template.candidate.json'), template)
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'])
    copy(path.join(target, name), path.join(output, 'before/modern', name))
  fs.copyFileSync(path.join(output, 'exercises.template.candidate.json'), templatePath)
  save(path.join(output, 'repair.json'), {
    status: 'candidate-awaiting-affected-review', lesson, changes,
    answerChanges: ['392', '397'], mathAndDisplayAnswersChanged: false,
    gradingCapacity: { before: { auto: 8, ungraded: 6 }, after: { auto: 6, ungraded: 8 } },
    automaticCorrectnessForHeldContracts: false, oldReviewsPreserved: true,
    sourceAndFigureChanged: false, cumulativeAnswerContentRepairs: 1,
    cumulativeExercisePresentationRepairs: 1, historyReset: false,
    bindings: [bind(candidatePath), ...['answer-review.json', 'visual-observation.json', 'review.json']
      .map(name => bind(path.join(review, name))), bind(templatePath),
    ...['answer-keys.candidate.json', 'exercises.template.candidate.json']
      .map(name => bind(path.join(output, name)))],
  })
  console.log(JSON.stringify({ output, answerChanges: 2, exerciseChanges: changes.length }))
} else {
  const tool = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py')
  const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  assert.ok(['adapt-finalize-01', 'render-01'].includes(action))
  if (action === 'render-01')
    assert.equal(json(path.join(output, 'adapt-finalize-01/command.json')).exitCode, 0)
  const receipt = path.join(output, action)
  assert.ok(!fs.existsSync(receipt))
  fs.mkdirSync(receipt)
  const args = [tool, action === 'render-01' ? 'render' : 'adapt-finalize',
    '--book', '9-10g', '--root', path.dirname(core), '--work', work,
    '--edition', 'modern-us-neutral', '--lesson', lesson]
  const result = spawnSync(python, args, { cwd: repo, encoding: 'utf8' })
  save(path.join(receipt, 'command.json'), { cwd: repo, command: python, args,
    exitCode: result.status, error: result.error?.message, offline: true, published: false })
  for (const [name, text] of [['stdout.txt', result.stdout || ''], ['stderr.txt', result.stderr || '']])
    fs.writeFileSync(path.join(receipt, name), text, { flag: 'wx' })
  if (result.status === 0 && action === 'adapt-finalize-01') {
    assert.equal(hash(path.join(target, 'lesson.json')), hash(path.join(output, 'before/modern/lesson.json')))
    assert.equal(hash(path.join(target, 'figures.json')), hash(path.join(output, 'before/modern/figures.json')))
    save(path.join(output, 'modern-transition.json'), {
      status: 'pass-for-exercise-presentation-only', lesson,
      before: bind(path.join(output, 'before/modern/exercises.json')),
      after: bind(path.join(target, 'exercises.json')),
      lessonAndFiguresUnchanged: true, mathChanged: false, originalOverallRevisePreserved: true,
    })
  }
  console.log(result.stdout)
  if (result.stderr) console.error(result.stderr)
  process.exitCode = result.status ?? 1
}
