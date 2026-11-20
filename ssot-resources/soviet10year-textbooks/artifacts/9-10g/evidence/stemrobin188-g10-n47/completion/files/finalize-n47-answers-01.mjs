import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const lesson = 'geo910-c2-s2-n47'
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const reviewRoot = path.join(tmp, 'n47-answer-choice-surfaces-review-01')
const output = path.join(tmp, 'n47-answer-finalize-01')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const check = binding => assert.equal(hash(binding.path), binding.sha256, binding.path)
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const manifestPath = path.join(tmp, 'n47-answer-choice-surfaces-review-inputs-01/manifest.json')
const manifest = read(manifestPath)
manifest.bindings.forEach(check)
check(manifest.keyLast.answerCandidate)
const reviewPath = path.join(reviewRoot, 'answer-review.json')
const review = read(reviewPath)
assert.equal(review.status, 'pass')
assert.equal(review.lesson, lesson)
assert.deepEqual(review.candidate, manifest.keyLast.answerCandidate)
assert.deepEqual(review.exercises.map(item => String(item.exercise)), ['49', '50', '51', '52', '53', '54'])
assert.ok(review.exercises.every(item => item.status === 'pass'))
const candidate = read(manifest.keyLast.answerCandidate.path)
assert.equal(candidate.status, 'draft')
assert.equal(candidate.answers.length, 6)
assert.equal(candidate.answers.filter(item => item.grading === 'auto').length, 5)
assert.equal(candidate.answers.find(item => String(item.exercise) === '52').grading, 'ungraded')
assert.ok(!fs.existsSync(output), 'Never replace a first native receipt')
assert.ok(!fs.existsSync(path.join(target, 'answer-keys.json')), 'Never replace existing keys')
fs.mkdirSync(output)
save(path.join(output, 'admission.json'), {
  status: 'pass-for-answer-keys-only', candidate: manifest.keyLast.answerCandidate,
  review: bind(reviewPath), inputs: bind(manifestPath),
  authorCandidatePreserved: true, sourceHoldsPreserved: true, wholeLessonApproved: false,
})
fs.copyFileSync(manifest.keyLast.answerCandidate.path, path.join(target, 'answer-keys.json'), fs.constants.COPYFILE_EXCL)
fs.chmodSync(path.join(target, 'answer-keys.json'), 0o644)
const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const args = ['-B', '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize',
  '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', lesson,
  '--root', path.dirname(core), '--work', path.join(tmp, 'n47-answer-author/work')]
save(path.join(output, 'started.json'), { cwd: repo, command, args })
const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
fs.writeFileSync(path.join(output, 'stdout.txt'), result.stdout || '', { flag: 'wx' })
fs.writeFileSync(path.join(output, 'stderr.txt'), result.stderr || '', { flag: 'wx' })
save(path.join(output, 'command.json'), {
  cwd: repo, command, args, exitCode: result.status, error: result.error?.message,
  sourceHoldsPreserved: true, published: false, authorCandidatePreserved: true,
})
check(manifest.keyLast.answerCandidate)
if (result.status === 0) {
  const keys = read(path.join(target, 'answer-keys.json'))
  assert.equal(keys.status, 'ready')
  assert.deepEqual(keys.answers, candidate.answers)
  save(path.join(output, 'ready-bindings.json'), {
    keys: bind(path.join(target, 'answer-keys.json')),
    audit: bind(path.join(target, 'answer-keys.audit.json')),
    reviewer: bind(reviewPath), candidate: manifest.keyLast.answerCandidate,
    auto: 5, ungraded: 1, sourceHoldsPreserved: true,
    constructionOrProofAutomaticallyCertified: false, wholeLessonApproved: false,
  })
}
console.log(result.stdout || '')
if (result.stderr) console.error(result.stderr)
process.exitCode = result.status ?? 1
