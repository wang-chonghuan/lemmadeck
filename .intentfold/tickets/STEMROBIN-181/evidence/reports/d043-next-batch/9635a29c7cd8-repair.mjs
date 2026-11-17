import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const hash = filename => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
const bind = filename => ({ path: filename, sha256: hash(filename) })
assert(!fs.existsSync(path.join(owned, 'author-freeze.json')))
const repaired = []
for (const figure of ['fig-66', 'fig-67']) {
  const initial = path.join(owned, figure, 'initial')
  const state = JSON.parse(fs.readFileSync(path.join(initial, 'attempt.json')))
  assert.equal(state.status, 'fail')
  assert.equal(state.renderExitCode, null)
  const validation = JSON.parse(JSON.parse(
    fs.readFileSync(path.join(initial, 'validation-command.json')),
  ).stdout)
  assert(validation.errors.every(error => /expected None (segment|text), found (80|2)/.test(error)))
  const original = path.join(initial, `${figure}.spec.json`)
  const spec = JSON.parse(fs.readFileSync(original))
  const changes = []
  for (const [index, assertion] of spec.assertions.entries()) {
    if (assertion.type !== 'objectCount') continue
    assert([2, 80].includes(assertion.value))
    assertion.count = assertion.value
    delete assertion.value
    changes.push({ pointer: `/assertions/${index}`, change: 'value -> count; numeric count unchanged' })
  }
  const diagnosis = {
    figure, initialStatus: 'fail', initial: bind(path.join(initial, 'attempt.json')),
    initialSpec: bind(original), validation: bind(path.join(initial, 'validation-command.json')),
    failures: validation.errors,
    cause: 'Author used value instead of the existing validator objectCount.count contract.',
    targetedRepairNumber: 1, changes,
    geometryLabelsTextSourceAndDisplayUnchanged: true,
    secondFailurePolicy: 'HOLD; no additional repair or native rerender.',
  }
  const diagnosisPath = path.join(owned, figure, 'diagnosis.json')
  fs.writeFileSync(diagnosisPath, `${JSON.stringify(diagnosis, null, 2)}\n`, { flag: 'wx' })
  const repair = path.join(owned, figure, 'repair-1')
  fs.mkdirSync(repair)
  const repairedPath = path.join(repair, `${figure}.spec.json`)
  fs.writeFileSync(repairedPath, `${JSON.stringify(spec, null, 2)}\n`, { flag: 'wx' })
  const reverse = structuredClone(spec)
  for (const assertion of reverse.assertions) {
    if (assertion.type !== 'objectCount') continue
    assertion.value = assertion.count
    delete assertion.count
  }
  assert.deepEqual(reverse, JSON.parse(fs.readFileSync(original)))
  assert.equal(hash(original), diagnosis.initialSpec.sha256)
  repaired.push({ figure, diagnosis: bind(diagnosisPath), repairedSpec: bind(repairedPath) })
}
fs.writeFileSync(path.join(owned, 'targeted-repair.json'), `${JSON.stringify({
  batchRepairRounds: 1, repaired,
  scope: 'Only the objectCount field contract; initial failed files preserved unchanged.',
  imageOpens: 0,
}, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: 'single-targeted-schema-repair-prepared', figures: repaired.map(item => item.figure) }))
