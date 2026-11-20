import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const lesson = 'geo910-c2-s2-n47'
const authorRoot = path.join(tmp, 'n47-choice-author')
const reviewPath = path.join(tmp, 'n47-choice-internal-affected-review-01/review.json')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const check = binding => assert.equal(hash(binding.path), binding.sha256, binding.path)
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const stage = process.argv[2]
assert.ok(['check', 'retain', 'display'].includes(stage))
const output = path.join(tmp, `n47-choice-${stage}-01`)
assert.ok(!fs.existsSync(output), 'Never replace a first stage receipt')
assert.equal(read(reviewPath).outcome, 'pass')
const repairPath = path.join(tmp, 'n47-choice-internal-repair-01/manifest.json')
const repair = read(repairPath)
repair.bindings.forEach(check)
assert.equal(repair.cumulativeContentRepairs, 1)
assert.equal(repair.allViewsAndOptionsAndKeysAndOtherFieldsUnchanged, true)
const seedPath = repair.seed.path
const draftPath = repair.repaired.path
const inputs = read(path.join(tmp, 'n47-answer-choice-surfaces-review-inputs-01/manifest.json'))
inputs.bindings.forEach(check)
check(inputs.keyLast.draft)
const draft = read(draftPath)
assert.deepEqual(draft.questions.map(item => item.view),
  read(inputs.keyLast.draft.path).questions.map(item => item.view))
assert.equal(draft.questions.length, 7)
assert.equal(draft.questions.reduce((sum, item) => sum + item.view.options.length, 0), 24)
assert.deepEqual(draft.new_figures, [])
if (stage !== 'check')
  assert.equal(read(path.join(tmp, 'n47-choice-check-01/command.json')).exitCode, 0)
if (stage === 'display')
  assert.equal(read(path.join(tmp, 'n47-choice-retain-01/command.json')).exitCode, 0)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const command = stage === 'display' ? 'node' : python
const args = stage === 'check'
  ? ['-B', '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', repo,
    '--seed', seedPath, '--draft', draftPath,
    '--review', reviewPath]
  : stage === 'retain'
    ? ['-B', '.claude/skills/ld-s10y-lesson/tools/retain_choices.py', '--repo', repo,
      '--book', '9-10g', '--lesson', lesson, '--source', path.join(tmp, 'n47-choice-retention-source-01')]
    : [path.join(tmp, 'offline-display.mjs'), `9-10g:${lesson}`, '--choices-only',
      `--render-work=${path.join(tmp, 'g10-n47/work')}`]
fs.mkdirSync(output)
save(path.join(output, 'inputs-before.json'), [
  bind(seedPath), bind(draftPath), bind(reviewPath), bind(repairPath),
])
if (stage === 'retain') {
  const source = path.join(tmp, 'n47-choice-retention-source-01')
  assert.ok(!fs.existsSync(source))
  fs.mkdirSync(source)
  for (const [name, from] of [
    ['seed.json', seedPath],
    ['draft.json', draftPath],
    ['review.json', reviewPath],
  ]) {
    fs.copyFileSync(from, path.join(source, name), fs.constants.COPYFILE_EXCL)
    assert.equal(hash(path.join(source, name)), hash(from))
  }
}
save(path.join(output, 'started.json'), { cwd: repo, command, args })
const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
fs.writeFileSync(path.join(output, 'stdout.txt'), result.stdout || '', { flag: 'wx' })
fs.writeFileSync(path.join(output, 'stderr.txt'), result.stderr || '', { flag: 'wx' })
save(path.join(output, 'command.json'), {
  cwd: repo, command, args, exitCode: result.status, error: result.error?.message,
  sourceHoldsPreserved: true, originalAuthorFilesPreserved: true, published: false,
  textOrExerciseDisplaysRepeated: false, wholeLessonApproved: false,
})
inputs.bindings.forEach(check)
repair.bindings.forEach(check)
console.log(result.stdout || '')
if (result.stderr) console.error(result.stderr)
process.exitCode = result.status ?? 1
