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
assert.deepEqual(solutions.solutions.map(item => item.source_number), ['1', '2', '3', '4'])
assert.equal(solutions.options_or_keys_constructed, false)
const seeds = []
for (const item of binding.repositories) {
  assert(!fs.existsSync(path.join(out, item.language, 'draft.json')), 'Pre-solve must precede draft options.')
  const receiptPath = path.join(out, 'native-initial', item.language, 'prepare/receipt.json')
  const receipt = read(receiptPath)
  assert.equal(receipt.exitCode, 0)
  assert.equal(hash(item.seedPath), receipt.seed.sha256)
  const seed = read(item.seedPath)
  assert.deepEqual(seed.exercises.map(item => item.number), ['1', '2', '3', '4'])
  assert.deepEqual(seed.figures, [])
  assert.deepEqual(seed.source.concept_figure_ids, [])
  assert(seed.exercises.every(item => item.figure_ids.length === 0))
  assert.deepEqual(seed.concepts.map(item => item.block), [1, 2, 3, 8, 22])
  seeds.push({ language: item.language, seed: bound(item.seedPath), prepareReceipt: bound(receiptPath) })
}
const checkpointPath = path.join(out, 'pre-options-checkpoint.json')
fs.writeFileSync(checkpointPath, `${JSON.stringify({
  schema: 'bounded-n68-first-choice-author-pre-options-checkpoint@1',
  recordedAtUtc: new Date().toISOString(),
  independentSolutions: bound(solutionsPath),
  conceptSelection: bound(path.join(out, 'concept-selection.json')),
  seeds, allFourSourcesSolvedBeforeDraftFilesExist: true,
  draftFilesPresent: [], role: 'Author process checkpoint, not independent review.',
  noAnswersOrOldQuestionOutputsConsulted: true,
  newImages: 0, cumulativeImages: 24, budgetReset: false,
}, null, 2)}\n`, { flag: 'wx' })
for (const file of [solutionsPath, checkpointPath, path.join(out, 'concept-selection.json'), ...seeds.map(item => item.seed.path)]) {
  fs.chmodSync(file, 0o444)
}
console.log(JSON.stringify({ checkpoint: bound(checkpointPath), independentSolutions: bound(solutionsPath), seeds }, null, 2))
