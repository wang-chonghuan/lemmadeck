import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const root = '.intentfold/tickets/STEMROBIN-182/tmp/batch16-source'
const evidence = `${root}/diagnosis-8a-counts`
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const hash = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const pages = []
for (const number of ['0008', '0009']) {
  const before = `${evidence}/parent-before-finalize-p${number}`
  const current = `${root}/8a/pages/${number}`
  const unchanged = ['page.md', 'page.json'].map(name => {
    assert(fs.readFileSync(`${before}/${name}`).equals(fs.readFileSync(`${current}/${name}`)))
    return { name, byte_sha256: hash(`${current}/${name}`) }
  })
  const initial = read(`${before}/audit.json`)
  const final = read(`${current}/audit.json`)
  assert.equal(initial.errors.length, 1)
  assert.equal(final.errors.length, 0)
  assert.equal(final.lines_printed, final.lines_md)
  const command = read(`${evidence}/parent-finalize-p${number}-repaired.json`)
  assert.equal(command.exit_code, 0)
  pages.push({ number, unchanged, initial_audit: initial, final_audit: final,
    finalize_after_fix_count: 1, finalize_command_record: `parent-finalize-p${number}-repaired.json` })
}
for (const number of ['0010','0011','0012','0013','0014']) {
  assert.equal(read(`${root}/8a/pages/${number}/audit.json`).errors.length, 0)
}
const oldBookHash = 'd85febc9afa26749b0d3770c838b873702a00f5e2413e49543126cd269df501b'
assert.equal(hash(`${root}/8a/book.json`), oldBookHash)
const layout = '.claude/skills/ld-s10y-lesson/tools/layout.py'
const record = {
  stage: 'parent-counting-only-repair-and-actual-gate-result', raw_ready: true,
  source_objects_ready: ['alg8-c1-s1-n1', 'alg8-c1-s1-n2'], n3_complete: false,
  source_pixels_and_transcribed_page_json_unchanged: true,
  raw_book_byte_sha256: oldBookHash, raw_book_bytes_unchanged: true, pages,
  implementation: { path: layout, sha256: hash(layout),
    initial_layout_snapshot: 'layout.py.snapshot',
    rejected_support_extent_snapshot: 'layout-before-support-extent-repair.py',
    approach: 'Frozen genuine-glyph neighbor support; connected outer-bar topology for numerator/denominator across a short split; existing tall/stacked/wrapped safeguards retained.',
    rejected_revision: 'Initial glyph support upper extent bounds lost a valid split-glyph fraction rule; only bounds relaxed, existing tall narrow border exclusion retained.' },
  commands: ['parent-focused-source-tests.json', 'parent-related-layout-tests.json',
    'parent-related-layout-tests-support-repaired.json', 'parent-reassemble-after-count-repair.json'],
  test_results: { focused_initial: '4tests pass',
    related_initial: '57testsrun,1failure,4skippedsubcases',
    related_final: '57testsrun,pass,4skippedsubcases',
    repeated_test_notice: 'Related suite includes the4focusedtestmethods; executions retained, not counted as extra source or display coverage.' },
  unchanged_other_source_gates_reused: true, vectorize_reruns: 0,
  durable_promotions: 0, modern_or_choice_approvals: 0, model_service_calls: 0,
}
fs.writeFileSync(`${evidence}/parent-repair-result.json`, JSON.stringify(record, null, 2) + '\n',
  { flag: 'wx' })
console.log(JSON.stringify({ raw_ready: true, raw_book_bytes_unchanged: true, pages: 2 }))
