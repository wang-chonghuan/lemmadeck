import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const durable = path.join(ticket, 'evidence/reports/d925-source240-consumed')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const author = path.join(tmp, 'd912-source240-first-author')
const reviewRoot = path.join(tmp, 'd918-source240-first-independent-review')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const indexFile = path.join(ticket, 'evidence/index.json')
const meterFile = path.join(ticket, 'production-meter.json')
const index = read(indexFile)
const meter = read(meterFile)
const known = new Map(index.reports.map(b => [b.sha256, b]))
assert.equal(meter.sourcePagesFinalized, 470)
assert.equal(meter.imageCalls, 12)
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 102)
assert.ok(!fs.existsSync(path.join(durable, 'consumed.json')))
const reviewFile = path.join(reviewRoot, 'report.json')
assert.equal(sha(reviewFile), 'eb78b92e9e94b674e9352c240654427ac4184952a0c5db481b65df82bf5efd7c')
const review = read(reviewFile)
assert.equal(review.status, 'PASS')
assert.deepEqual(review.findings, [])
assert.deepEqual(review.hold_reasons_in_reviewed_scope, [])
for (const field of ['source240_faithful_page', 'raw_png209_fidelity', 'raw_svg209_fidelity'])
  assert.equal(review.scope_status[field], 'PASS')
assert.equal(review.scope_status.full_card, 'HOLD')
assert.deepEqual([review.source_page.native_evidence.lines_printed,
  review.source_page.native_evidence.lines_md], [26, 26])
const manifestFile = path.join(author, 'hashes.first.json')
assert.equal(sha(manifestFile), review.input_verification.manifest_sha256)
const manifest = new Map(read(manifestFile).files.map(b => [b.path, b]))
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(sha(from), sha(to))
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(to))
  return bind(to)
}
function retain(from, suffix) {
  const existing = known.get(sha(from))
  if (existing && fs.existsSync(path.resolve(repo, existing.path))) {
    assert.equal(sha(path.resolve(repo, existing.path)), existing.sha256)
    return existing
  }
  const b = { ...copy(from, path.join(durable, suffix)),
    originalPath: path.relative(repo, from), batch: 'D034' }
  index.reports.push(b)
  known.set(b.sha256, b)
  return b
}
const outputs = []
for (const name of ['page.md', 'page.json', 'audit.json']) {
  const f = path.join(author, 'root/10p/pages/0240', name)
  assert.equal(sha(f), manifest.get(f).sha256)
  outputs.push(copy(f, path.join(raw, 'pages/0240', name)))
}
for (const ext of ['png', 'svg']) {
  const f = path.join(author, 'work/10p/pages/0240/figures', 'fig-209.' + ext)
  assert.equal(sha(f), manifest.get(f).sha256)
  assert.equal(sha(f), review.figure209[ext === 'png' ? 'raw_png_sha256' : 'raw_svg_sha256'])
  outputs.push(copy(f, path.join(raw, 'figures', 'fig-209.' + ext)))
}
const independent = retain(reviewFile, 'FIRST-independent-review/report.json')
const reviewerUsage = retain(path.join(reviewRoot, 'usage.json'), 'FIRST-independent-review/usage.json')
retain(path.join(reviewRoot, 'SHA256SUMS'), 'FIRST-independent-review/SHA256SUMS')
const authorEvidence = retain(path.join(author, 'first-observations.json'), 'FIRST-author/first-observations.json')
const authorUsage = retain(path.join(author, 'usage.first.json'), 'FIRST-author/usage.first.json')
for (const kind of ['finalize', 'vectorize'])
  retain(path.join(author, `${kind}.0001.receipt.json`), `FIRST-author/${kind}.0001.receipt.json`)
fs.mkdirSync(durable, { recursive: true })
const receiptFile = path.join(durable, 'consumed.json')
fs.writeFileSync(receiptFile, JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D034', physicalPage: 240,
  status: 'SOURCE-NATIVE-RAW-SVG-FIRST-PASS-CONSUMED', rows: [26, 26], outputs,
  independentReview: independent, reviewerUsage, author: authorEvidence, authorUsage,
  boundary: review.source_page.boundaries, outgoingOpen: true,
  sourceGate: 'FIRST independent 26 rows plus RAW209/SVG209 fidelity PASS; existing native FIRST reused.',
  nativeReplays: 0, vectorReplays: 0, parentNewImages: 0, paidCalls: 0,
  newSourcePages: 1, newCompleteCards: 0, firstFailuresPreserved: true,
  fullN90OrModernCardApproved: false, databasePublisherDeploy: false, commitPush: false,
}, null, 2) + '\n', { flag: 'wx' })
const receipt = { ...bind(receiptFile), batch: 'D034' }
index.reports.push(receipt)
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 471
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE240 FIRST26/26 and RAW209/SVG209 independent PASS consumed; outgoing240 remains open.'
meter.currentCheckpoint.productionContinuation.source240 = {
  status: 'SOURCE-NATIVE-RAW-SVG-FIRST-PASS-CONSUMED', receipt,
}
meter.currentCheckpoint.productionContinuation.latestSourceReceipt = receipt
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n')
console.log(JSON.stringify({ receipt, sourcePages: 471, completePushed: 102,
  completeUnbatched: meter.currentCheckpoint.completeUnbatchedCards, paidCalls: 0 }))
