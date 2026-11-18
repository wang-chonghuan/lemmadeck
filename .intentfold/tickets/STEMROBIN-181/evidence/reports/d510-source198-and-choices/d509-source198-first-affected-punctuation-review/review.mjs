import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
const root = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const original = path.join(tmp, 'd496-source198-first-author')
const repaired = path.join(tmp, 'd508-source198-first-punctuation-repair')
const previous = path.join(tmp, 'd497-source198-first-independent-text-review')
const ledgerPath = path.join(tmp, 'd505-source167-first-independent-figure-review/actual-opens.json')
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const record = (filename) => ({
  path: filename,
  sha256: sha(fs.readFileSync(filename)),
  bytes: fs.statSync(filename).size,
  mode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, '0'),
})
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const write = (filename, value) => fs.writeFileSync(path.join(root, filename), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const repairReportPath = path.join(repaired, 'report.json')
const repairFreezePath = path.join(repaired, 'author-freeze.json')
assert.equal(record(repairReportPath).sha256, '8aeaf67a1f808a526060a22044625bd68319d3b6e1667d2469b308a4c87fc086')
assert.equal(record(repairFreezePath).sha256, 'd742939cad20d0a47ba96f94e9fc181c1720ede82da044fb312a7c88926d30ba')
assert.equal(record(ledgerPath).sha256, 'cf840c48dfe828f4f8571a9d7d49d9e3b810c6e3d0b618c179c758036f5ab8e8')
assert.equal(record(path.join(previous, 'report.json')).sha256, 'f2dc5dd12af27d32b3e66fbbbbbf9e7249980c3eda65950ac48e9fbd15f2b44c')
const repairFreeze = read(repairFreezePath)
const repairReport = read(repairReportPath)
for (const filename of [repairReportPath, repairFreezePath, ledgerPath]) assert.equal(record(filename).mode, '0444')
for (const entry of repairFreeze.files) {
  const filename = path.isAbsolute(entry.path) ? entry.path : path.join(repo, entry.path)
  assert.equal(record(filename).sha256, entry.sha256)
  assert.equal(record(filename).mode, '0444')
}
const oldJsonPath = path.join(original, 'source/10p/pages/0198/page.json')
const newJsonPath = path.join(repo, repairReport.pageJSON.path)
const oldMdPath = path.join(original, 'source/10p/pages/0198/page.md')
const newMdPath = path.join(repo, repairReport.pageMD.path)
assert.equal(record(oldJsonPath).sha256, 'a5693ebb377181e4e553921e3ffc91631370582f7bd57f0ae27bbc9a1c28f071')
assert.equal(record(oldMdPath).sha256, 'da99e10359a0741a1a97c2fdec97b171aff2759810b33b890ce659b2ba9ec82a')
assert.equal(record(path.join(previous, 'source-inventory.json')).sha256, '3e1456cfc2213308eceaf6451d6fde849504f15abec38cb66b33724297df67fd')
for (const filename of [oldJsonPath, oldMdPath, path.join(previous, 'source-inventory.json')]) assert.equal(record(filename).mode, '0444')
const oldJson = read(oldJsonPath)
const newJson = read(newJsonPath)
const differences = []
const walk = (before, after, pointer = '') => {
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    assert.equal(Array.isArray(before), Array.isArray(after))
    assert.deepEqual(Object.keys(before), Object.keys(after))
    for (const key of Object.keys(before)) walk(before[key], after[key], `${pointer}/${key}`)
  } else if (before !== after) differences.push({ pointer, before, after })
}
walk(oldJson, newJson)
assert.deepEqual(differences.map((difference) => difference.pointer), ['/blocks/8/lines/0', '/blocks/8/lines/1'])
const oldMd = fs.readFileSync(oldMdPath, 'utf8').split('\n')
const newMd = fs.readFileSync(newMdPath, 'utf8').split('\n')
assert.equal(oldMd.length, newMd.length)
const mdDifferences = oldMd.flatMap((before, index) => before === newMd[index] ? [] : [{ line: index + 1, before, after: newMd[index] }])
assert.deepEqual(mdDifferences.map((difference) => difference.line), [86, 87])
const ownInventory = read(path.join(previous, 'source-inventory.json'))
const observed = ownInventory.text_objects_in_reading_order.find((object) => object.id === 's198-p6')
const literals = differences.map((difference, index) => {
  assert.equal(difference.after, observed.lines[index])
  assert.equal(difference.after, newMd[85 + index])
  return {
    prior_finding: `D497-PUNCT-0${index + 1}`,
    json_pointer: difference.pointer,
    md_line: 86 + index,
    before: difference.before,
    after: difference.after,
    expected_from_existing_preexposure_source_inventory: observed.lines[index],
    verdict: 'PASS-AFFECTED-LITERAL-ONLY',
  }
})
const unchanged = []
for (const entry of repairFreeze.files) {
  const filename = path.isAbsolute(entry.path) ? entry.path : path.join(repo, entry.path)
  const relative = path.relative(repaired, filename)
  if (!relative.startsWith('source/') && !relative.startsWith('work/')) continue
  if (relative.endsWith('/page.md') || relative.endsWith('/page.json')) continue
  const old = path.join(original, relative)
  assert.equal(record(filename).sha256, record(old).sha256)
  unchanged.push({ relative, before: record(old), after: record(filename), verdict: 'BYTE-UNCHANGED-NOT-REVIEW-REPLAY' })
}
const previousLedger = read(ledgerPath)
assert.equal(previousLedger.context_cumulative_opens, 22)
const ledger = {
  schema: 'd509-zero-image-affected-review-ledger@1',
  ticket: 'STEMROBIN-181',
  prior_record: record(ledgerPath),
  prior_actual_opens: 22,
  batch_actual_opens: 0,
  context_cumulative_opens: 22,
  context_cumulative_limit: 24,
  no_budget_reset: true,
  entries: [],
  reopens: 0,
  crops: 0,
  native_or_visual_review_replays: 0,
  images_returned_to_parent: 0,
  batch_complete: true,
}
write('actual-opens.json', ledger)
const report = {
  schema: 'd509-source198-first-affected-punctuation-review@1',
  ticket: 'STEMROBIN-181',
  status: 'TWO-AFFECTED-PUNCTUATION-LITERALS-PASS-STYLE-HOLD-FULLPAGE-PENDING',
  scope: 'Only the two d497 punctuation failures, sole two JSON leaves, sole two MD lines, and byte-preservation scope. No pixel reobservation, native execution, or unaffected semantic review replay.',
  inputs: {
    repair_report: record(repairReportPath),
    repair_freeze: record(repairFreezePath),
    original_json: record(oldJsonPath),
    repaired_json: record(newJsonPath),
    original_md: record(oldMdPath),
    repaired_md: record(newMdPath),
    original_independent_review: record(path.join(previous, 'report.json')),
    source_baseline: record(path.join(previous, 'source-inventory.json')),
  },
  all_repair_freeze_hashes_and_actual_0444_verified: true,
  affected_literals: literals,
  unique_json_leaf_differences: differences,
  unique_md_line_differences: mdDifferences,
  exact_two_leaf_and_two_line_diff: true,
  all_other_comparable_source_work_files_byte_unchanged: unchanged,
  byte_identity_does_not_promote_source_or_figure_fidelity: true,
  inheritance: {
    d497_unaffected_text_math_bold_caption_footnote_and_open_boundaries: 'Inherited without replay',
    original_D497_PUNCT_01_and_02_FAIL_records: 'Preserved immutable; this report approves only the repaired literals',
    D497_STYLE_01: 'HOLD-unchanged; not reviewed here',
    d505_RAW167_SVG167_fine_detail: 'HOLD; limited visible structure PASS inherited only',
    source198_fullpage: 'PENDING',
    n75_right_boundary: 'OPEN',
    fig168: 'HOLD-unobserved-offpage',
    SOURCE196_permission_seal: 'PROCEDURAL-HOLD',
    all_other_historical_FAIL_HOLD: 'Preserved',
  },
  verdicts: {
    affected_punctuation: 'PASS',
    unique_repair_scope: 'PASS',
    unchanged_bytes: 'PASS-mechanical-only',
    style: 'HOLD',
    source198_fullpage: 'PENDING',
    modern_FIG_DISPLAY_SCI: 'NOT-REVIEWED',
    fullcard: false,
  },
  native_runs: 0,
  new_images: 0,
  cumulative_images: 22,
  no_source_or_candidate_modification: true,
  no_consume_index_meter_DB_Git_paid_newworker: true,
  actual_opens: ledger,
}
write('report.json', report)
const files = fs.readdirSync(root).map((filename) => path.join(root, filename)).sort()
for (const filename of files) fs.chmodSync(filename, 0o444)
write('review-freeze.json', {
  schema: 'd509-affected-review-freeze@1',
  ticket: 'STEMROBIN-181',
  status: 'AFFECTED-TWO-LITERALS-PASS-FROZEN-UNRELATED-HOLDS-PRESERVED',
  files: files.map(record),
  actual_opens: ledger,
  style: 'HOLD',
  fullpage: 'PENDING',
  fullcard: false,
  self_hash: 'Returned textually, not embedded recursively',
})
fs.chmodSync(path.join(root, 'review-freeze.json'), 0o444)
for (const filename of fs.readdirSync(root).map((name) => path.join(root, name))) assert.equal(record(filename).mode, '0444')
console.log(JSON.stringify({
  report: record(path.join(root, 'report.json')),
  freeze: record(path.join(root, 'review-freeze.json')),
  actual_opens: record(path.join(root, 'actual-opens.json')),
  affected: 'PASS',
  sole_json_leaves: differences.map((difference) => difference.pointer),
  unchanged_comparable_files: unchanged.length,
  new_images: 0,
  cumulative_images: 22,
}, null, 2))
