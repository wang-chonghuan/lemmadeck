import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const author = path.join(tmp, 'source6g155156-author-first-08')
const reportFile = path.join(author, 'Report.json')
const manifestFile = path.join(author, 'owned-manifest.json')
assert.equal(hash(reportFile), '1deb069d104e2fda1d8b27b3ede65f8fd5d345bb11892dece575d06b0d09abfe')
assert.equal(hash(manifestFile), '6c8d9373ba81fbe83c36eebeae727e3ffac66ba0c2e450cebabea863467b85ea')
const report = read(reportFile)
assert.equal(report.status, 'AUTHOR_ONLY')
assert.deepEqual(report.pages.map(page => page.physical), [155, 156])
assert.equal(report.execution_sessions, 'All owned commands exited; no active sessions')
const refs = [bind(reportFile), bind(manifestFile)]
for (const item of read(manifestFile).files) {
  assert.ok(item.path.startsWith(author + path.sep))
  assert.equal(hash(item.path), item.sha256, item.path)
  refs.push(bind(item.path))
}
const receipts = report.pages.map(page => {
  const receiptFile = path.join(author, `evidence/${String(page.physical).padStart(4, '0')}/finalize.0001.execution.json`)
  const receipt = read(receiptFile)
  assert.equal(receipt.cwd, repo)
  assert.equal(receipt.exitCode, page.exit)
  assert.equal(page.finalize_calls, 1)
  for (const stream of Object.values(receipt.streams))
    assert.equal(hash(stream.path), stream.sha256)
  const first = path.join(author, page.first)
  assert.equal(hash(first), page.first_sha256)
  assert.equal(fs.statSync(first).mode & 0o777, 0o444)
  return { physical: page.physical, exitCode: page.exit, receipt: bind(receiptFile) }
})
const own = path.join(tmp, 'receive-source155156-author-09')
fs.mkdirSync(own)
const record = {
  status: 'SOURCE155156_AUTHOR_ONLY_RECEIVED_FIRST_FAILURE_PRESERVED',
  report: bind(reportFile), receipts, pages: report.pages,
  preparationReused: true, preparationReplay: false,
  sourceReviewPending: true, source155LineMismatch: [21, 20],
  source155GlyphHold: 'U+25BC and its unassigned printing role remain unchanged',
  source156PassReused: true, parentImageLoads: 0,
  completeLessonClaimed: false, wholeLessonApproved: false, published: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
refs.push(bind(recordFile), bind(path.join(tmp, 'receive-source155156-author-09.mjs')))
const retained = retainCurrent6g('evidence/stemrobin188-6g-source155156/author-first09', refs, [], record)

const inputs = path.join(tmp, 'source155156-independent-inputs-09')
fs.mkdirSync(inputs)
save(path.join(inputs, 'source-only.json'), {
  status: 'FIRST_SOURCE155156_ORIGINALS_ONLY',
  originals: report.pages.map(page => ({
    physical: page.physical,
    png: bind(path.join(author, `work/6-8g/pages/${String(page.physical).padStart(4, '0')}/page.png`)),
  })),
  incoming154: {
    authority: 'Text-only prior author boundary hint, not source approval',
    exercise: 437, open: false,
  },
  originalViewsExpected: 2, maximumChargedImages: 8,
  parentImageLoads: 0, noCandidatesAuthorFIRSTOrKeysBeforeIndependentFIRST: true,
})
save(path.join(inputs, 'post-FIRST.json'), {
  status: 'ONLY_AFTER_SUBSTANTIVE_FIRST_ACTUAL_CHMOD_STAT_HASH',
  authorReport: bind(reportFile), record: bind(recordFile),
  candidates: report.pages.map(page => ({
    physical: page.physical,
    files: ['page.md', 'page.json', 'audit.json'].map(name =>
      bind(path.join(author, `artifacts/6-8g/pages/${String(page.physical).padStart(4, '0')}`, name))),
    crops: (page.physical === 155 ? [208] : [209, 210, 211]).map(number =>
      bind(path.join(author, `work/6-8g/pages/${String(page.physical).padStart(4, '0')}/figures/fig-${number}.png`))),
    receipt: receipts.find(item => item.physical === page.physical).receipt,
  })),
  scope: 'Full readable source fidelity, cross-page object closure, crop fidelity; identify actual separator/glyph defects without repairing or approving modern content.',
  noModernOrMathApproval: true,
})
console.log(JSON.stringify({
  record: bind(recordFile), retained,
  sourceOnly: bind(path.join(inputs, 'source-only.json')),
  postFIRST: bind(path.join(inputs, 'post-FIRST.json')),
}))
