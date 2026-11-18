import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
const root = path.dirname(fileURLToPath(import.meta.url))
const authorRoot = '/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d496-source198-first-author'
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const record = (filename) => ({
  path: filename,
  sha256: sha(fs.readFileSync(filename)),
  bytes: fs.statSync(filename).size,
  mode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, '0'),
})
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const write = (filename, document) => {
  assert(filename.startsWith(`${root}/`))
  fs.writeFileSync(filename, `${JSON.stringify(document, null, 2)}\n`, { flag: 'wx' })
}
const baselinePath = path.join(root, 'precomparison-freeze.json')
const inventoryPath = path.join(root, 'source-inventory.json')
const ledgerPath = path.join(root, 'actual-opens.json')
const baseline = read(baselinePath)
const inventory = read(inventoryPath)
for (const filename of [baselinePath, inventoryPath, ledgerPath]) assert.equal(record(filename).mode, '0444')
assert.equal(record(inventoryPath).sha256, baseline.inventory.sha256)
assert.equal(record(ledgerPath).sha256, baseline.actual_opens.sha256)
const authorReportPath = path.join(authorRoot, 'report.json')
const authorFreezePath = path.join(authorRoot, 'author-freeze.json')
const candidatePath = path.join(authorRoot, 'source/10p/pages/0198/page.json')
const candidateMdPath = path.join(authorRoot, 'source/10p/pages/0198/page.md')
assert.equal(record(authorReportPath).sha256, '08940bb5560173d18bac2fc76171cf07873a5931174b4497bccf0b16e09b9c79')
assert.equal(record(authorFreezePath).sha256, '506b9ed1cda39ae6d122d0df5a6aef18eaa9cd4b38ac093cd516f9dd29b044ee')
const authorReport = read(authorReportPath)
const authorFreeze = read(authorFreezePath)
for (const filename of [authorReportPath, authorFreezePath, candidatePath, candidateMdPath]) {
  assert.equal(record(filename).mode, '0444')
  if (filename === authorFreezePath) continue
  const entry = authorFreeze.files.find((item) => item.path === filename)
  assert(entry)
  assert.equal(record(filename).sha256, entry.sha256)
}
const candidate = read(candidatePath)
const md = fs.readFileSync(candidateMdPath, 'utf8').split('\n')
const mapping = [
  { id: 's198-p1', blocks: [0], md_start: 48 },
  { id: 's198-p2', blocks: [2, 4], md_starts: [56, 63] },
  { id: 's198-p3', blocks: [5], md_start: 68 },
  { id: 's198-p4', blocks: [6], md_start: 73 },
  { id: 's198-p5', blocks: [7], md_start: 77 },
  { id: 's198-p6', blocks: [8], md_start: 86 },
  { id: 's198-footnote1', blocks: [9], md_start: 91 },
]
const canonical = (text) => text.replace(/\s+/g, '')
const rows = []
for (const object of mapping) {
  const observed = inventory.text_objects_in_reading_order.find((item) => item.id === object.id)
  const lines = object.blocks.flatMap((index) => candidate.blocks[index].lines)
  assert.equal(lines.length, observed.lines.length)
  for (const [index, line] of lines.entries()) {
    const mdLine = object.md_starts
      ? index < candidate.blocks[2].lines.length ? object.md_starts[0] + index : object.md_starts[1] + index - candidate.blocks[2].lines.length
      : object.md_start + index
    assert.equal(line, md[mdLine - 1])
    rows.push({
      independent_source_object: object.id,
      printed_line_in_object: index + 1,
      candidate_json_blocks: object.blocks,
      candidate_md_line: mdLine,
      expected_from_preexposure_pixels: observed.lines[index],
      candidate: line,
      verdict: canonical(line) === canonical(observed.lines[index]) ? 'PASS-visible-literal-and-recorded-bold' : 'FAIL',
    })
  }
}
const failures = rows.filter((row) => row.verdict === 'FAIL')
assert.equal(failures.length, 2)
assert.deepEqual(failures.map((row) => row.candidate_md_line), [86, 87])
const expectedMath = inventory.text_objects_in_reading_order.flatMap((object) => object.lines.flatMap((line) => line.match(/\$[^$]*\$/g) ?? []))
const actualMath = candidate.blocks.filter((block) => block.kind === 'p').flatMap((block) => block.lines.flatMap((line) => line.match(/\$[^$]*\$/g) ?? []))
assert.deepEqual(expectedMath, actualMath)
const expectedBold = inventory.text_objects_in_reading_order.flatMap((object) => object.lines.flatMap((line) => [...line.matchAll(/\*\*([^*]+)\*\*/g)].map((match) => match[1])))
const actualBold = candidate.blocks.filter((block) => block.kind === 'p').flatMap((block) => block.lines.flatMap((line) => [...line.matchAll(/\*\*([^*]+)\*\*/g)].map((match) => match[1])))
assert.deepEqual(expectedBold, actualBold)
assert(candidate.blocks[0].cont && !candidate.blocks[0].open)
assert(candidate.blocks[2].open && candidate.blocks[4].cont && !candidate.blocks[4].open)
assert(candidate.blocks[3].kind === 'cap' && candidate.blocks[3].samerow)
assert.equal(candidate.blocks[3].label, '图167')
assert.equal(candidate.blocks[3].lines[0], '图167')
assert(candidate.blocks[8].open)
assert(candidate.blocks[8].lines.at(-1).endsWith('沿副'))
assert.equal(candidate.blocks[9].label, 'footnote')
assert.equal(candidate.blocks[10].kind, 'foot')
assert.deepEqual(candidate.blocks[10].lines, ['188'])
assert(!candidate.blocks.some((block) => /^h[1-3]$/.test(block.kind)))
assert(!candidate.blocks.some((block) => block.kind === 'ex'))

write(path.join(root, 'line-comparison.json'), {
  schema: 'd497-first-independent-line-comparison@1',
  baseline: record(inventoryPath),
  candidate: record(candidatePath),
  normalization: 'Whitespace only for matching printed figure-reference spacing; no punctuation replacement or semantic normalization.',
  rows,
  visible_math: { verdict: 'PASS', expected: expectedMath, actual: actualMath },
  recorded_bold_terms: { verdict: 'PASS', expected: expectedBold, actual: actualBold },
  extra_italic_style_not_established_by_baseline: 'HOLD',
  no_native_count_used_as_literal_evidence: true,
})
const report = {
  schema: 'd497-first-independent-source198-text-review-report@1',
  ticket: 'STEMROBIN-181',
  batch: 'd497-source198-first-independent-text-review',
  role: 'Independent first SOURCE198 text review; not SOURCE198 author.',
  status: 'SOURCE198-TEXT-FAIL-PUNCTUATION-STYLE-HOLD-NO-REPAIR',
  inputs: {
    inventory: record(inventoryPath),
    actual_opens: record(ledgerPath),
    precomparison_seal: record(baselinePath),
    author_report: record(authorReportPath),
    author_freeze: record(authorFreezePath),
    candidate_json: record(candidatePath),
    candidate_md: record(candidateMdPath),
  },
  exposure_order: {
    own_source_page_then_grid_first_observations: true,
    source_inventory_and_ledger_actual_0444_verified_before_author_exposure: true,
    precomparison_freeze_actual_0444_before_author_exposure: true,
    author_read_only_after_ready_report_and_freeze_hashes_matched: true,
    no_author_bbox_count_shape_style_HOLD_used_to_build_inventory: true,
    own_baseline_bytes_unchanged_after_exposure: true,
  },
  findings: [
    {
      id: 'D497-PUNCT-01',
      verdict: 'FAIL',
      file: candidateMdPath,
      md_line: 86,
      json_pointer: '/blocks/8/lines/0',
      source_object: 's198-p6',
      source_printed_line: 1,
      expected_visible_literal: '会聚透镜中光线的折射可以用实验观察。把',
      candidate_literal: '会聚透镜中光线的折射可以用实验观察：把',
      evidence: 'Preexposure inventory independently records a sentence-ending dot after 观察. Candidate inserts a colon instead.',
      author_candidate_repaired: false,
    },
    {
      id: 'D497-PUNCT-02',
      verdict: 'FAIL',
      file: candidateMdPath,
      md_line: 87,
      json_pointer: '/blocks/8/lines/1',
      source_object: 's198-p6',
      source_printed_line: 2,
      expected_visible_literal: '透镜水平地放置在圆盘的中心。首先让光线沿主光轴竖直入',
      candidate_literal: '透镜水平地放置在圆盘的中心，首先让光线沿主光轴竖直入',
      evidence: 'Preexposure inventory independently records a sentence-ending dot after 中心. Candidate changes it to a comma.',
      author_candidate_repaired: false,
    },
    {
      id: 'D497-STYLE-01',
      verdict: 'HOLD',
      file: candidateMdPath,
      md_line: 78,
      json_pointer: '/blocks/7/lines/1',
      literal: '物体',
      evidence: 'The own sealed baseline records the words but does not independently certify any extra slanted/italic emphasis on them. The later author HOLD is preserved, not used retroactively as source evidence. No re-open or crop was performed.',
      source_word_literal: 'PASS',
      exact_italic_style: 'HOLD',
    },
  ],
  verdicts: {
    SOURCE198_literal_text_including_punctuation: 'FAIL',
    main_body_and_footnote_visible_word_coverage: 'PASS-local-with-two-punctuation-failures-separate',
    source_math_tokens: 'PASS-visible',
    recorded_bold_terms: 'PASS-visible',
    complete_style: 'HOLD',
    caption167_literal_and_owner: 'PASS-visible',
    caption167_shared_row: 'PASS-visible',
    source_object_structure: 'PASS-local',
    near_axis_footnote_literal_marker_and_owner: 'PASS-visible',
    left_continuation: 'PASS-local',
    right_open_boundary_after_沿副: 'PASS-local-open-no-unit-closure',
    full_SOURCE198_fidelity: 'FAIL-with-style-and-figure-detail-HOLD',
    RAW167: 'PENDING-separate-first-figure-review',
    SVG167: 'PENDING-separate-first-figure-review',
    modern_FIG_DISPLAY: 'NOT-REVIEWED',
    fullcard: false,
  },
  caption_and_footnote: {
    fig167_caption_is_not_body_words: true,
    fig164_and_fig168_are_references_not_locally_observed_images: true,
    footnote_qualifier: '当光线和主光轴间的夹角很小时',
    footnote_callout_owner: 's198-p5',
    footnote_not_page_number_or_body_tail_closure: true,
    decorated_printed_page: 'Visible188 with ornamental dots; faithful pagefoot188 is acceptable without decorative glyphs.',
  },
  per_line_comparison: path.join(root, 'line-comparison.json'),
  no_candidate_or_original_input_changes: true,
  no_native_prepare_finalize_vectorize_render_or_tests: true,
  no_consume_index_meter_DB_Git_modernFIG_DISPLAY: true,
  no_new_worker_worktree_branch_paid_generation: true,
  historical_holds: {
    author_style: authorReport.holds.find((hold) => hold.id === 'D496-STYLE-01'),
    fig167_fine_detail: 'HOLD preserved from own preexposure fullpage inventory; separate figure batch may assess only what that inventory supports.',
    open_n75: 'OPEN-HOLD preserved',
    SOURCE196_permission_seal: 'PROCEDURAL-HOLD preserved',
    earlier_SOURCE197_and_other_FAIL_HOLD_bytes: 'Untouched',
  },
  image_ledger: read(ledgerPath),
  new_images: 2,
  cumulative_images: 20,
  no_budget_reset: true,
  images_returned_to_parent: 0,
  queued_d505_not_started_before_this_review_freeze: true,
}
write(path.join(root, 'report.json'), report)
for (const filename of fs.readdirSync(root).map((name) => path.join(root, name))) fs.chmodSync(filename, 0o444)
const files = fs.readdirSync(root).map((name) => path.join(root, name)).sort()
write(path.join(root, 'review-freeze.json'), {
  schema: 'd497-independent-review-freeze@1',
  ticket: 'STEMROBIN-181',
  status: 'FIRST-INDEPENDENT-TEXT-FAIL-STYLE-HOLD-FROZEN',
  files: files.map(record),
  source_baseline_preserved: record(inventoryPath),
  image_ledger: read(ledgerPath),
  source_text: 'FAIL',
  source_style: 'HOLD',
  fullcard: false,
  self_hash: 'Returned textually; not embedded recursively.',
})
fs.chmodSync(path.join(root, 'review-freeze.json'), 0o444)
for (const filename of fs.readdirSync(root).map((name) => path.join(root, name))) assert.equal(record(filename).mode, '0444')
assert.equal(record(inventoryPath).sha256, baseline.inventory.sha256)
assert.equal(record(ledgerPath).sha256, baseline.actual_opens.sha256)
console.log(JSON.stringify({
  report: record(path.join(root, 'report.json')),
  inventory: record(inventoryPath),
  actual_opens: record(ledgerPath),
  review_freeze: record(path.join(root, 'review-freeze.json')),
  findings: report.findings.map((finding) => ({ id: finding.id, verdict: finding.verdict })),
  new_images: 2,
  cumulative_images: 20,
}, null, 2))
