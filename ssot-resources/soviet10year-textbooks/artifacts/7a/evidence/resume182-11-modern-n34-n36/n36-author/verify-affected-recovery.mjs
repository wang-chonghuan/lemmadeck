import fs from 'node:fs'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
assert.equal(process.cwd(), root)
const out = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n36-author'
const scratch = '.tmp/ld-s10y-lesson/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n36'
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36'
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'))
const hash = path => crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')
const hashes = {}

for (const name of ['lesson', 'exercises']) {
  const beforePath = `${out}/finalize-FIRST-failed/${name}.template.json`
  const before = read(beforePath)
  const expected = structuredClone(before)
  if (name === 'lesson') expected.title = expected.source.data.title
  else expected.exercises.find(item => item.number === '776').changes = []
  const templatePath = `${scratch}/${name}.template.json`
  const durablePath = `${durable}/${name}.json`
  assert.deepEqual(read(templatePath), expected, `${name}: changes exceed authorized two-field recovery`)
  assert.deepEqual(read(durablePath), expected, `${name}: durable/template not synchronized`)
  hashes[beforePath] = hash(beforePath)
  hashes[templatePath] = hash(templatePath)
  hashes[durablePath] = hash(durablePath)
}
const auditPath = `${out}/finalize-FIRST-failed/adaptation.audit.json`
assert.deepEqual(read(auditPath).errors, [
  'lesson.title 不得改变',
  'exercises[15] 未改写但 changes 非空',
])
hashes[auditPath] = hash(auditPath)
const solutionsPath = `${out}/source-solutions.md`
assert.equal(hash(solutionsPath), '209b65e1c9e852103c1423d08cc0c2db64d26e53602c03af61fd3daeb927580c')
const receipt = {
  status: 'AFFECTED_RECOVERY_READY_PARENT_MAY_RERUN_FAILED_FINALIZE',
  cwd: root,
  failed_stage: {name: 'FIRST adapt-finalize', exit_code: 2, audit: auditPath},
  changes: [
    'Modern lesson.title restored to source.data.title = 恒 等 式 in template and durable draft',
    'Modern exercises[15] (776).changes = [] in template and durable draft',
  ],
  affected_only_comparison: 'passed; no other modern or source field changed',
  source_solutions: {path: solutionsPath, sha256: hash(solutionsPath), status: 'reused without re-solving'},
  hashes,
  images: 0,
  text_frozen: true,
  finalize: 'not executed by author',
  seed: 'not prepared',
  choices: 'waiting for parent successful failed-stage rerun notification',
  approval: 'candidate only; no self approval',
}
fs.writeFileSync(`${out}/affected-recovery-receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`, {flag: 'wx'})
console.log(JSON.stringify(receipt, null, 2))
