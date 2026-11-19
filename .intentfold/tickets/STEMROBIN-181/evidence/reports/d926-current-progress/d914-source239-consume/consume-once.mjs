import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const durable = path.join(ticket, 'evidence/reports/d914-source239-consumed')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const indexFile = path.join(ticket, 'evidence/index.json')
const meterFile = path.join(ticket, 'production-meter.json')
const index = read(indexFile)
const meter = read(meterFile)
const known = new Map(index.reports.map(b => [b.sha256, b]))
assert.equal(meter.sourcePagesFinalized, 469)
assert.equal(meter.imageCalls, 12)
assert.ok(!fs.existsSync(path.join(durable, 'consumed.json')))
const reviewRoot = path.join(tmp, 'd906-source239-first-independent-review')
const reviewFile = path.join(reviewRoot, 'review.json')
assert.equal(sha(reviewFile), 'f1c26c3c0adf37d57efa7d6e4da152c2683d46e4d541c30edb1ba425ecccb1f2')
const review = read(reviewFile)
assert.deepEqual(review.gates, {
  SOURCE239: 'PASS', RAW208: 'PASS', SVG208: 'PASS', boundary: 'PASS', fullcard: 'HOLD',
})
assert.deepEqual(review.hold_findings, [])
assert.deepEqual([review.reused_native_evidence.finalize_lines_printed,
  review.reused_native_evidence.finalize_lines_md], [25, 25])
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(sha(from), sha(to), to)
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(to))
  return bind(to)
}
function retain(from, suffix) {
  const prior = known.get(sha(from))
  if (prior && fs.existsSync(path.resolve(repo, prior.path))) {
    assert.equal(sha(path.resolve(repo, prior.path)), prior.sha256)
    return prior
  }
  const b = { ...copy(from, path.join(durable, suffix)),
    originalPath: path.relative(repo, from), batch: 'D034' }
  index.reports.push(b)
  known.set(b.sha256, b)
  return b
}
function tree(root, suffix) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const f = path.join(root, entry.name)
    if (entry.isDirectory()) tree(f, path.join(suffix, entry.name))
    else if (entry.isFile()) retain(f, path.join(suffix, entry.name))
  }
}
const candidate = path.join(tmp, 'd898-source239-first-author')
const outputs = []
for (const [name, hashName] of [
  ['page.md', 'finalized_page_md'], ['page.json', 'finalized_page_json'], ['audit.json', 'finalized_audit_json'],
]) {
  const f = path.join(candidate, '10p/pages/0239', name)
  assert.equal(sha(f), review.hashes[hashName])
  outputs.push(copy(f, path.join(raw, 'pages/0239', name)))
}
for (const [ext, hashName] of [['png', 'raw208_png'], ['svg', 'svg208']]) {
  const f = path.join(candidate, 'work/10p/pages/0239/figures', 'fig-208.' + ext)
  assert.equal(sha(f), review.hashes[hashName])
  outputs.push(copy(f, path.join(raw, 'figures', 'fig-208.' + ext)))
}
tree(reviewRoot, 'FIRST-independent-review')
const author = retain(path.join(candidate, 'FIRST-report.md'), 'FIRST-author/report.md')
const usage = retain(path.join(candidate, 'FIRST-usage.json'), 'FIRST-author/usage.json')
const receiptFile = path.join(durable, 'consumed.json')
fs.mkdirSync(durable, { recursive: true })
fs.writeFileSync(receiptFile, JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D034', physicalPage: 239,
  status: 'SOURCE-NATIVE-RAW-SVG-FIRST-PASS-CONSUMED', rows: [25, 25], outputs,
  independentReview: retain(reviewFile, 'FIRST-independent-review/review.json'), author, usage,
  actualHeading: 'p0239#1: 90. \u5149\u6ce2\u7684\u6a2a\u632f\u6027  \u5149\u7684\u504f\u632f',
  boundary: review.boundary_review,
  sourceGate: 'FIRST independently observed25 rows, RAW208 and SVG208 semantic PASS; native FIRST stages reused.',
  precedingN89SourceBoundary: 'Next90 heading closes preceding89 source only; no modern or colour-plate approval.',
  nativeReplays: 0, vectorReplays: 0, parentNewImages: 0, paidCalls: 0,
  newSourcePages: 1, newCompleteCards: 0, firstFailuresPreserved: true,
  fullN90OrModernCardApproved: false, databasePublisherDeploy: false, commitPush: false,
}, null, 2) + '\n', { flag: 'wx' })
const receipt = { ...bind(receiptFile), batch: 'D034' }
index.reports.push(receipt)
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 470
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE239 FIRST25/25 and RAW208/SVG208 independent PASS consumed; actual90 heading closes preceding89 source only.'
meter.currentCheckpoint.productionContinuation.source239 = {
  status: 'SOURCE-NATIVE-RAW-SVG-FIRST-PASS-CONSUMED', receipt,
}
meter.currentCheckpoint.productionContinuation.latestSourceReceipt = receipt
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n')
console.log(JSON.stringify({ receipt, sourcePages: 470, completePushed: 102,
  completeUnbatched: meter.currentCheckpoint.completeUnbatchedCards, paidCalls: 0 }))
