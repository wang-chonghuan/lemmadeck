import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const binding = read(path.join(out, 'source-binding.json'))
const solutionsPath = path.join(out, 'independent-source-solutions.json')
const solutions = read(solutionsPath)
assert.equal(solutions.options_or_keys_constructed, false)
assert.deepEqual(solutions.solutions.map(item => item.source_number), ['2', '3', '11', '12'])
const seeds = []
for (const item of binding.repositories) {
  assert(!fs.existsSync(path.join(out, item.language, 'draft.json')))
  const receiptPath = path.join(out, 'native-initial', item.language, 'prepare/receipt.json')
  const receipt = read(receiptPath)
  assert.equal(receipt.exitCode, 0)
  assert.equal(hash(item.seedPath), receipt.seed.sha256)
  const seed = read(item.seedPath)
  assert.deepEqual(seed.exercises.map(row => row.number), ['2', '3', '11', '12'])
  assert.deepEqual(seed.concepts, [])
  assert.deepEqual(seed.figures, [])
  assert(seed.exercises.every(row => row.figure_ids.length === 0))
  seeds.push({ language: item.language, seed: bound(item.seedPath), prepareReceipt: bound(receiptPath) })
}
const checkpointPath = path.join(out, 'pre-options-checkpoint.json')
fs.writeFileSync(checkpointPath, `${JSON.stringify({
  schema: 'bounded-t18-four-text-choice-pre-options-checkpoint@1',
  recordedAtUtc: new Date().toISOString(), independentSolutions: bound(solutionsPath),
  seeds, sourceBinding: bound(path.join(out, 'source-binding.json')),
  allFourSourceTasksPresolvedBeforeOptions: true, draftFilesPresent: [],
  noConcepts: true, source2And3UnresolvedScopesPreserved: true,
  independentReview: 'PENDING-RAMAN', semanticReviewCreated: false,
  newImages: 0, cumulativeImages: 24, budgetReset: false,
}, null, 2)}\n`, { flag: 'wx' })
for (const p of [solutionsPath, checkpointPath, ...seeds.map(item => item.seed.path)]) fs.chmodSync(p, 0o444)
console.log(JSON.stringify({ checkpoint: bound(checkpointPath), independentSolutions: bound(solutionsPath), seeds }, null, 2))
