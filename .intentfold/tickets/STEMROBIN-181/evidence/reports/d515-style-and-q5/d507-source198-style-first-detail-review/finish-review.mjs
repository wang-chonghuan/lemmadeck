import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
const root = path.dirname(fileURLToPath(import.meta.url))
const candidateRoot = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d508-source198-first-punctuation-repair/source/10p/pages/0198'
const record = (filename) => ({ path: filename, sha256: crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex'), bytes: fs.statSync(filename).size, mode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, '0') })
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const write = (filename, value) => fs.writeFileSync(path.join(root, filename), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const inventoryPath = path.join(root, 'source-inventory.json')
const ledgerPath = path.join(root, 'actual-opens.json')
const precomparisonPath = path.join(root, 'precomparison-freeze.json')
const inventory = read(inventoryPath)
const precomparison = read(precomparisonPath)
const ledger = read(ledgerPath)
assert.equal(record(inventoryPath).sha256, precomparison.inventory.sha256)
assert.equal(record(ledgerPath).sha256, precomparison.actual_opens.sha256)
for (const filename of [inventoryPath, ledgerPath, precomparisonPath]) assert.equal(record(filename).mode, '0444')
const jsonPath = path.join(candidateRoot, 'page.json')
const mdPath = path.join(candidateRoot, 'page.md')
assert.equal(record(jsonPath).sha256, 'fea7f4d9734391b8726f1ae9acf9b48f16389604f95c2fc6c76af4c7bfabbae5')
assert.equal(record(mdPath).sha256, '4ea9d34e1be2c252455199acf8f34a47099162130ddd3279478ba73ebeb17a26')
for (const filename of [jsonPath, mdPath]) assert.equal(record(filename).mode, '0444')
const candidate = read(jsonPath).blocks[7].lines[1]
assert.equal(candidate, fs.readFileSync(mdPath, 'utf8').split('\n')[77])
assert.equal(candidate, inventory.visible_line_literal)
const expected = inventory.expected_line_with_visible_style
assert.equal(expected, candidate.replace('物体', '*物体*'))
assert(!candidate.includes('*物体*') && !candidate.includes('_物体_'))
const report = {
  schema: 'd507-first-source198-style-detail-review@1',
  ticket: 'STEMROBIN-181',
  status: 'FIRST-NEW-SOURCE-DETAIL-CONFIRMS-LOCAL-STYLE-FAIL',
  scope: 'D497-STYLE-01 only; first new unscaled original-pixel line-context strip, not replay of page/grid or whole text review.',
  source_inventory: record(inventoryPath),
  source_strip: record(inventory.strip.path),
  source_precomparison_seal: record(precomparisonPath),
  crop_receipt: record(path.join(root, 'crop-receipt.json')),
  actual_source_inventory_and_opens_0444_before_fresh_candidate_leaf: true,
  fresh_source_style_not_inferred_from_author_HOLD: true,
  candidate_json: record(jsonPath),
  candidate_md: record(mdPath),
  finding: {
    id: 'D507-STYLE-01',
    previous_scope: 'D497-STYLE-01',
    verdict: 'FAIL',
    literal: '物体',
    md_line: 78,
    json_pointer: '/blocks/7/lines/1',
    observed_source_style: 'Slanted emphasis/italic word span, visible against upright neighbors in the unique source strip.',
    candidate_style: 'Plain text without an emphasis marker.',
    source_word_literal: 'PASS',
    expected_semantics: 'emphasis/italic, not an extra bold marker',
    exact_local_markup_difference: { before: candidate, after: expected },
    proposed_edit_scope: 'Insert one single-asterisk emphasis delimiter on each side of 物体 only; preserve all other characters and the printed line.',
    equivalent_italic_markup: '_物体_ is semantically equivalent; no specific delimiter style is a source glyph.',
    candidate_modified: false,
  },
  verdicts: {
    new_source_detail_legibility: 'PASS',
    target_literal_identity: 'PASS',
    target_candidate_style_fidelity: 'FAIL',
    all_other_source198_text_or_style: 'INHERITED-NOT-REVIEWED',
    source198_fullpage: 'PENDING-with-local-style-FAIL',
    n75: 'OPEN',
    fig168: 'HOLD-unobserved-offpage',
    modern_FIG_DISPLAY_SCI: 'NOT-REVIEWED',
    fullcard: false,
  },
  history: {
    original_D497_STYLE_HOLD: 'Original report and inventory bytes preserved; this new source-detail finding is additional evidence, not a rewrite.',
    original_D497_punctuation_FAIL: 'Preserved immutable',
    D509_affected_punctuation: 'PASS inherited without replay',
    D505_source167_full_fidelity: 'HOLD unchanged',
    other_FAIL_HOLD_records: 'Preserved',
  },
  no_candidate_or_original_file_changes: true,
  native_runs_or_review_replays: 0,
  no_consume_index_meter_DB_Git_paid_newworker_worktree: true,
  actual_opens: ledger,
  new_images: 1,
  cumulative_images: 23,
  no_budget_reset: true,
  remaining_capacity: 1,
  queued_d511_not_started_before_this_freeze: true,
}
write('report.json', report)
const files = fs.readdirSync(root).map((name) => path.join(root, name)).sort()
for (const filename of files) fs.chmodSync(filename, 0o444)
write('review-freeze.json', {
  schema: 'd507-style-detail-review-freeze@1',
  ticket: 'STEMROBIN-181',
  status: 'FIRST-NEW-SOURCE-STYLE-DETAIL-LOCAL-FAIL-FROZEN',
  files: files.map(record),
  source_precomparison_seal: record(precomparisonPath),
  actual_opens: ledger,
  source_style_detail: 'CONFIRMED',
  candidate_style: 'FAIL',
  fullpage: 'PENDING',
  fullcard: false,
  self_hash: 'Returned textually, not embedded recursively',
})
fs.chmodSync(path.join(root, 'review-freeze.json'), 0o444)
for (const filename of fs.readdirSync(root).map((name) => path.join(root, name))) assert.equal(record(filename).mode, '0444')
assert.equal(record(inventoryPath).sha256, precomparison.inventory.sha256)
assert.equal(record(ledgerPath).sha256, precomparison.actual_opens.sha256)
console.log(JSON.stringify({
  report: record(path.join(root, 'report.json')),
  freeze: record(path.join(root, 'review-freeze.json')),
  actual_opens: record(ledgerPath),
  source_inventory: record(inventoryPath),
  finding: 'FAIL: missing italic emphasis on 物体',
  new_images: 1,
  cumulative_images: 23,
}, null, 2))
