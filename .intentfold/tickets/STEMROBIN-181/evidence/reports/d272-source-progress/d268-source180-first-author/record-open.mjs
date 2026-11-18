import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const p = path.join(out, 'actual-opens.json')
const ledger = JSON.parse(fs.readFileSync(p, 'utf8'))
const [phase, number, observation] = process.argv.slice(2)
const ordinalThisBatch = Number(number)
assert([1, 2].includes(ordinalThisBatch))
const input = ledger.plannedInputs[ordinalThisBatch - 1]
const actualHash = crypto.createHash('sha256').update(fs.readFileSync(input.path)).digest('hex')
assert.equal(actualHash, input.sha256)
if (phase === 'begin') {
  assert.equal(ledger.attempts.length, ordinalThisBatch - 1)
  assert.equal(ledger.opens.length, ordinalThisBatch - 1)
  ledger.attempts.push({
    ordinalThisBatch, ordinalInContext: 22 + ordinalThisBatch,
    path: input.path, sha256: input.sha256, nativeWidth: input.nativeWidth,
    nativeHeight: input.nativeHeight, tool: 'functions.view_image', detail: 'original',
    hashBoundBeforeOpen: true, status: 'REGISTERED-BEFORE-TOOL-CALL',
  })
} else {
  assert.equal(phase, 'complete')
  assert(observation)
  assert.equal(ledger.opens.length, ordinalThisBatch - 1)
  const attempt = ledger.attempts[ordinalThisBatch - 1]
  assert.equal(attempt.status, 'REGISTERED-BEFORE-TOOL-CALL')
  attempt.status = 'ACTUALLY-OBSERVED-ONCE'
  ledger.opens.push({
    ...attempt, page: 180, result: observation,
    cumulativeContextImagesAfterOpen: 22 + ordinalThisBatch,
  })
  ledger.budget.newImages = ledger.opens.length
  ledger.budget.cumulativeContextImages = 22 + ledger.opens.length
  if (ordinalThisBatch === 2) ledger.status = 'COMPLETE-AUTHOR-ONLY-ZERO-IMAGES-REMAINING'
}
fs.writeFileSync(p, `${JSON.stringify(ledger, null, 2)}\n`)
console.log(JSON.stringify({ phase, ordinalThisBatch, budget: ledger.budget, input: input.path }, null, 2))
