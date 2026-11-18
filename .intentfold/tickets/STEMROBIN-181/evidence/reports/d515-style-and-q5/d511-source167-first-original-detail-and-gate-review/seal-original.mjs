import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
const root = path.dirname(fileURLToPath(import.meta.url))
const record = (filename) => ({ path: filename, sha256: crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex'), bytes: fs.statSync(filename).size, mode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, '0') })
const observationPath = path.join(root, 'original-observation.json')
const ledgerPath = path.join(root, 'actual-opens.json')
const observation = JSON.parse(fs.readFileSync(observationPath, 'utf8'))
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
assert.equal(record(observation.original_detail.path).sha256, observation.original_detail.sha256)
assert.equal(record(ledger.prior_record.path).sha256, ledger.prior_record.sha256)
assert.equal(ledger.context_cumulative_opens, 24)
assert.equal(ledger.batch_actual_opens, 1)
for (const filename of [observationPath, ledgerPath, fileURLToPath(import.meta.url)]) fs.chmodSync(filename, 0o444)
const seal = {
  schema: 'd511-original-detail-precomposition-freeze@1',
  ticket: 'STEMROBIN-181',
  original_observation: record(observationPath),
  detail_bindings: record(path.join(root, 'detail-bindings.json')),
  actual_opens: record(ledgerPath),
  original_region: record(observation.original_detail.path),
  actual_0444_verified_before_affected_candidate_record_composition: true,
  no_candidate_image_reopens: true,
  cumulative_images: 24,
  further_image_opens_forbidden: true,
}
const output = path.join(root, 'precomposition-freeze.json')
fs.writeFileSync(output, `${JSON.stringify(seal, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(output, 0o444)
for (const filename of [observationPath, ledgerPath, output]) assert.equal(record(filename).mode, '0444')
console.log(JSON.stringify({ original_observation: record(observationPath), actual_opens: record(ledgerPath), precomposition_freeze: record(output) }, null, 2))
