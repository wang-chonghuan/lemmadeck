import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
const root = path.dirname(fileURLToPath(import.meta.url))
const record = (filename) => ({ path: filename, sha256: crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex'), bytes: fs.statSync(filename).size, mode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, '0') })
const inventoryPath = path.join(root, 'source-inventory.json')
const ledgerPath = path.join(root, 'actual-opens.json')
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'))
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
assert.equal(record(inventory.strip.path).sha256, inventory.strip.sha256)
assert.equal(record(ledger.prior_record.path).sha256, ledger.prior_record.sha256)
assert.equal(ledger.context_cumulative_opens, 23)
for (const filename of [inventoryPath, ledgerPath, fileURLToPath(import.meta.url)]) fs.chmodSync(filename, 0o444)
const freeze = {
  schema: 'd507-source-style-precomparison-freeze@1',
  ticket: 'STEMROBIN-181',
  inventory: record(inventoryPath),
  actual_opens: record(ledgerPath),
  source_strip: record(inventory.strip.path),
  source_observation: 'First new original-pixel detail, not a replay of the former fullpage review.',
  actual_inventory_and_ledger_0444_verified_before_fresh_candidate_leaf_read: true,
  previous_HOLD_not_used_as_source_font_expectation: true,
  current_candidate_style_comparison: 'PENDING',
  cumulative_images: 23,
}
const output = path.join(root, 'precomparison-freeze.json')
fs.writeFileSync(output, `${JSON.stringify(freeze, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(output, 0o444)
for (const filename of [inventoryPath, ledgerPath, output]) assert.equal(record(filename).mode, '0444')
console.log(JSON.stringify({ inventory: record(inventoryPath), actual_opens: record(ledgerPath), precomparison: record(output) }, null, 2))
