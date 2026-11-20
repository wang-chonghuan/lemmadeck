import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const lesson = 'geo910-c2-s3-n68'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const stage = process.argv[2]
assert.ok(['answer-prepare', 'answer-admit', 'answer-finalize',
  'interaction-prepare', 'interaction-finalize'].includes(stage))
const output = path.join(tmp, `n68-completion-${stage}-01`)
assert.ok(!fs.existsSync(output), output)
assert.equal(read(path.join(tmp, 'n68-modern-adopt-01/result.json')).producerRuns, 0)
fs.mkdirSync(output)
if (stage === 'answer-admit') {
  const candidate = path.join(tmp, 'n68-answer-author/answer-keys.candidate.json')
  const reviewPath = path.join(tmp, 'n68-answer-choice-review-01/answer-review.json')
  const review = read(reviewPath)
  assert.equal(review.result, 'PASS')
  assert.deepEqual(review.findings, [])
  assert.deepEqual(review.perExercise.map(item => item.exercise),
    Array.from({ length: 8 }, (_, index) => String(252 + index)))
  assert.ok(review.perExercise.every(item => item.result === 'PASS'))
  Object.values(review.inputBindings).forEach(item => {
    const file = path.isAbsolute(item.path) ? item.path : path.resolve(path.dirname(reviewPath), item.path)
    assert.equal(hash(file), item.sha256After || item.sha256)
  })
  assert.ok(!fs.existsSync(path.join(target, 'answer-keys.json')))
  fs.copyFileSync(candidate, path.join(target, 'answer-keys.json'), fs.constants.COPYFILE_EXCL)
  fs.chmodSync(path.join(target, 'answer-keys.json'), 0o644)
  save(path.join(output, 'result.json'), {
    status: 'pass-for-answer-candidate-only', candidate: bind(candidate), review: bind(reviewPath),
    nativeFinalizationPending: true, wholeLessonApproved: false, published: false,
  })
} else {
  const answer = stage.startsWith('answer')
  const action = stage.endsWith('prepare') ? 'prepare' : 'finalize'
  const file = path.join(target, answer ? 'answer-keys.json' : 'interactions.json')
  if (action === 'prepare') assert.ok(!fs.existsSync(file), file)
  const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const args = ['-B', `.claude/skills/ld-s10y-answer/tools/${answer
    ? 'lesson_answers.py' : 'lesson_interactions.py'}`, action,
  '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', lesson,
  '--root', path.dirname(core)]
  if (answer) args.push('--work', path.join(tmp, 'n68-answer-author/work'))
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024 })
  save(path.join(output, 'command.json'), {
    command, args, cwd: repo, exitCode: result.status, stdout: result.stdout,
    stderr: result.stderr, error: result.error?.message,
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  save(path.join(output, 'result.json'), {
    status: 'pass', stage, outputs: action === 'finalize' ? [bind(file)] : [],
    published: false, wholeLessonApproved: false,
  })
}
console.log(JSON.stringify({ stage, output, published: false }))
