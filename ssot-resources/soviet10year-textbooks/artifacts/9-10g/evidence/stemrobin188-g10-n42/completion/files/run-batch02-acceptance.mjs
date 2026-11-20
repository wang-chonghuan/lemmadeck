import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const [admissionFile, action] = process.argv.slice(2)
const admission = json(admissionFile)
assert.equal(admission.status, 'pass-for-keys-and-choices-only')
const selectors = {
  'geo910-c1-s3-n41': 'n41',
  'geo910-c2-s1-n42': 'n42',
  'geo910-c2-s1-n45': 'n45',
}
const prefix = selectors[admission.lesson]
assert.ok(prefix, 'This helper is limited to the three declared second-batch lessons')
for (const binding of admission.bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
assert.ok(['answer-finalize', 'choice-check', 'choice-retain'].includes(action))
const output = path.join(tmp, `${prefix}-${action}-01`)
assert.ok(!fs.existsSync(output), 'Preserve the first gate receipt; recovery needs a separate entry')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts')
const target = path.join(core, '9-10g/editions/modern-us-neutral/lessons', admission.lesson)
assert.equal(json(path.join(target, 'lesson.json')).status, 'ready')
assert.equal(json(path.join(target, 'adaptation.audit.json')).status, 'pass')
const env = { ...process.env }
let args
if (action === 'answer-finalize') {
  assert.equal(hash(admission.candidate.path), admission.candidate.sha256)
  assert.ok(!fs.existsSync(path.join(target, 'answer-keys.json')), 'Never replace existing keys')
} else {
  for (const name of ['seed', 'draft', 'review'])
    assert.equal(hash(admission.choice[name].path), admission.choice[name].sha256)
  assert.equal(json(admission.choice.review.path).outcome, 'pass')
}
if (action === 'choice-retain')
  assert.equal(json(path.join(tmp, `${prefix}-choice-check-01/command.json`)).exitCode, 0)
fs.mkdirSync(output)
if (action === 'answer-finalize') {
  const key = path.join(target, 'answer-keys.json')
  fs.copyFileSync(admission.candidate.path, key, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(key, 0o644)
  save(path.join(output, 'candidate-binding.json'), {
    from: admission.candidate.path, to: key, sha256: hash(key), sourceUnchanged: true,
  })
  args = ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize',
    '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', admission.lesson,
    '--root', core, '--work', admission.answerWork]
  env.NODE_OPTIONS = `${env.NODE_OPTIONS || ''} --import=${path.join(tmp, 'capture-n43-checks.mjs')}`.trim()
  env.LD_N43_CHECK_EVIDENCE = output
} else if (action === 'choice-check') {
  args = ['.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', repo,
    '--seed', admission.choice.seed.path, '--draft', admission.choice.draft.path,
    '--review', admission.choice.review.path]
} else {
  const source = path.join(output, 'approved')
  fs.mkdirSync(source)
  for (const name of ['seed', 'draft', 'review'])
    fs.copyFileSync(admission.choice[name].path, path.join(source, `${name}.json`), fs.constants.COPYFILE_EXCL)
  args = ['.claude/skills/ld-s10y-lesson/tools/retain_choices.py', '--repo', repo,
    '--book', '9-10g', '--lesson', admission.lesson, '--source', source]
}
const result = spawnSync('python3', args, { cwd: repo, env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
fs.writeFileSync(path.join(output, 'stdout.txt'), result.stdout || '', { flag: 'wx' })
fs.writeFileSync(path.join(output, 'stderr.txt'), result.stderr || '', { flag: 'wx' })
save(path.join(output, 'command.json'), {
  cwd: repo, command: 'python3', args, exitCode: result.status, error: result.error?.message,
  offline: true, published: false, humanFinish: 'review',
})
if (action === 'answer-finalize' && result.status === 0) {
  const key = json(path.join(target, 'answer-keys.json'))
  assert.equal(key.status, 'ready')
  const expectedCases = key.answers.flatMap(answer => answer.parts)
    .filter(part => part.judge === 'exact').reduce((sum, part) => sum + part.expected.length, 0)
  if (expectedCases > 0) {
    const check = json(path.join(output, 'check_mathlive_exact.mjs.json'))
    const report = JSON.parse(check.stdout)
    assert.equal(check.exitCode, 0)
    assert.equal(report.status, 'pass')
    assert.equal(report.caseCount, expectedCases)
    for (const item of report.results) {
      assert.equal(item.accepted, true)
      assert.equal(item.preserved, true)
      assert.ok(item.inputEvents >= 2 && item.attempts <= 3)
    }
  }
  save(path.join(output, 'ready-bindings.json'), ['answer-keys.json', 'answer-keys.audit.json']
    .map(name => ({ path: path.join(target, name), sha256: hash(path.join(target, name)) })))
}
console.log(result.stdout)
if (result.stderr) console.error(result.stderr)
console.log(JSON.stringify({ action, exitCode: result.status, output }))
process.exitCode = result.status ?? 1
