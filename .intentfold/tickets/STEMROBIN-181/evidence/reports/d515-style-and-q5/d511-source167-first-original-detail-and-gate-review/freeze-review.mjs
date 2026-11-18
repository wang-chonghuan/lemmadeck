import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
const root = path.dirname(fileURLToPath(import.meta.url))
const record = (filename) => ({ path: filename, sha256: crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex'), bytes: fs.statSync(filename).size, mode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, '0') })
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const reportPath = path.join(root, 'report.json')
const report = read(reportPath)
for (const input of Object.values(report.inputs)) {
  assert.equal(record(input.path).sha256, input.sha256)
  if (input.mode) assert.equal(record(input.path).mode, input.mode)
}
const precompositionPath = path.join(root, 'precomposition-freeze.json')
const precomposition = read(precompositionPath)
assert.equal(record(precomposition.original_observation.path).sha256, precomposition.original_observation.sha256)
assert.equal(record(precomposition.actual_opens.path).sha256, precomposition.actual_opens.sha256)
const ledger = read(path.join(root, 'actual-opens.json'))
assert.equal(ledger.context_cumulative_opens, 24)
assert.equal(ledger.batch_actual_opens, 1)
assert.equal(ledger.remaining_context_capacity, 0)
const files = fs.readdirSync(root).map((name) => path.join(root, name)).sort()
for (const filename of files) fs.chmodSync(filename, 0o444)
const freeze = {
  schema: 'd511-original-detail-and-visible-gate-freeze@1',
  ticket: 'STEMROBIN-181',
  status: 'NARROW-VISIBLE-EXTRACTION-GATE-PASS-UNKNOWN-SEMANTICS-HOLD-FROZEN',
  files: files.map(record),
  original_observation_precomposition_seal: record(precompositionPath),
  actual_opens: ledger,
  RAW167: 'PASS-necessary-visible-source-structure-only',
  SVG167: 'PASS-necessary-visible-source-structure-only',
  unresolved_fine_stroke_semantics_and_detail: 'HOLD',
  exact_pixel_or_numerical_fit_not_certified: true,
  original_D505_complete_HOLD_bytes_preserved: true,
  D507_style_FAIL_preserved: true,
  source198_fullpage_modernFIG_DISPLAY_SCI_not_promoted: true,
  n75: 'OPEN',
  fig168: 'HOLD',
  fullcard: false,
  self_hash: 'Returned textually, not embedded recursively',
}
const output = path.join(root, 'review-freeze.json')
fs.writeFileSync(output, `${JSON.stringify(freeze, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(output, 0o444)
for (const filename of fs.readdirSync(root).map((name) => path.join(root, name))) assert.equal(record(filename).mode, '0444')
for (const input of Object.values(report.inputs)) assert.equal(record(input.path).sha256, input.sha256)
console.log(JSON.stringify({
  report: record(reportPath),
  detail_bindings: record(path.join(root, 'detail-bindings.json')),
  original_observation: record(path.join(root, 'original-observation.json')),
  freeze: record(output),
  actual_opens: record(path.join(root, 'actual-opens.json')),
  visible_gate: 'PASS',
  fine_unknowns: 'HOLD',
  new_images: 1,
  cumulative_images: 24,
  further_image_opens_forbidden: true,
}, null, 2))
