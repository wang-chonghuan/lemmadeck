import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
const root = path.dirname(fileURLToPath(import.meta.url))
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const record = (filename) => ({ path: filename, sha256: sha(fs.readFileSync(filename)), bytes: fs.statSync(filename).size, mode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, '0') })
assert(!fs.existsSync(path.join(root, 'precomparison-freeze.json')))
const inventoryPath = path.join(root, 'source-inventory.json')
const ledgerPath = path.join(root, 'actual-opens.json')
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'))
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
assert.equal(inventory.source_author_candidate_exposed, false)
assert.equal(ledger.batch_actual_opens, 2)
assert.equal(ledger.context_cumulative_opens, 20)
for (const image of inventory.observed_images) assert.equal(record(image.path).sha256, image.sha256)
assert.equal(record(ledger.prior_record.path).sha256, ledger.prior_record.sha256)
for (const filename of [inventoryPath, ledgerPath, fileURLToPath(import.meta.url)]) fs.chmodSync(filename, 0o444)
const baseline = {
  schema: 'd497-actual-preauthor-permission-seal@1',
  ticket: 'STEMROBIN-181',
  source_page: 198,
  role: 'first-independent-text-review',
  state: 'PREAUTHOR-INVENTORY-AND-ACTUAL-OPENS-SEALED',
  inventory: record(inventoryPath),
  actual_opens: record(ledgerPath),
  sealing_code: record(fileURLToPath(import.meta.url)),
  actual_modes_verified_before_author_exposure: true,
  d496_author_report_freeze_templates_source_metadata_not_yet_read: true,
  author_metadata_bbox_count_TOC_used_as_source_expectation: false,
  observed_source_images: 2,
  cumulative_images: 20,
  no_budget_reset: true,
  glyph_and_figure_detail_holds_preserved: true,
}
const output = path.join(root, 'precomparison-freeze.json')
fs.writeFileSync(output, `${JSON.stringify(baseline, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(output, 0o444)
assert.equal(record(output).mode, '0444')
assert.equal(record(inventoryPath).mode, '0444')
assert.equal(record(ledgerPath).mode, '0444')
console.log(JSON.stringify({ precomparison: record(output), inventory: record(inventoryPath), actual_opens: record(ledgerPath) }, null, 2))
