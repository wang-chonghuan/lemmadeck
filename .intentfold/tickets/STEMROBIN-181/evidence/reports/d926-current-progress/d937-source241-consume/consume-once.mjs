import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const author = path.join(ticket, 'tmp/d922-source241-first-author')
const reviewer = path.join(ticket, 'tmp/d929-source241-first-independent-review')
const durable = path.join(ticket, 'evidence/reports/d937-source241-consumed')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const indexFile = path.join(ticket, 'evidence/index.json')
const meterFile = path.join(ticket, 'production-meter.json')
const index = read(indexFile)
const meter = read(meterFile)
const known = new Map(index.reports.map(b => [b.sha256, b]))
assert.equal(meter.sourcePagesFinalized, 471)
assert.equal(meter.imageCalls, 12)
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 102)
assert.ok(!fs.existsSync(path.join(durable, 'consumed.json')))
const reviewFile = path.join(reviewer, 'report.json')
assert.equal(sha(reviewFile), 'c005f83b40ca66ee565a891d7c63e51c0394c23b6ef2b59b0719a8712d08fd37')
const review = read(reviewFile)
assert.equal(review.status, 'PASS')
assert.deepEqual(review.findings, [])
assert.equal(review.boundaries.status, 'PASS')
assert.equal(review.boundaries.source241_start.native_cont, true)
assert.equal(review.boundaries.outgoing241.native_open, false)
assert.deepEqual([review.printed_rows.native_printed_total, review.printed_rows.native_markdown_total], [22, 22])
assert.equal(review.approval_boundary.fullcard_approval, false)
const manifestFile = path.join(author, 'hashes.first.json')
assert.equal(sha(manifestFile), review.integrity.manifest_sha256)
const manifest = new Map(read(manifestFile).outputs.map(b => [b.path, b]))
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(sha(from), sha(to))
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(to))
  return bind(to)
}
function retain(from, suffix) {
  const previous = known.get(sha(from))
  if (previous && fs.existsSync(path.resolve(repo, previous.path))) {
    assert.equal(sha(path.resolve(repo, previous.path)), previous.sha256)
    return previous
  }
  const b = { ...copy(from, path.join(durable, suffix)),
    originalPath: path.relative(repo, from), batch: 'D034' }
  known.set(b.sha256, b)
  index.reports.push(b)
  return b
}
const outputs = []
for (const name of ['page.md', 'page.json', 'audit.json']) {
  const f = path.join(author, 'root/10p/pages/0241', name)
  assert.equal(sha(f), manifest.get(f).sha256)
  outputs.push(copy(f, path.join(raw, 'pages/0241', name)))
}
for (const figure of review.figures) {
  assert.equal(figure.status, 'PASS')
  for (const ext of ['png', 'svg']) {
    const f = path.join(author, 'work/10p/pages/0241/figures', `${figure.id}.${ext}`)
    assert.equal(sha(f), manifest.get(f).sha256)
    assert.equal(sha(f), figure[ext === 'png' ? 'raw_sha256' : 'svg_sha256'])
    outputs.push(copy(f, path.join(raw, 'figures', `${figure.id}.${ext}`)))
  }
}
const independentReview = retain(reviewFile, 'FIRST-independent-review/report.json')
const reviewerUsage = retain(path.join(reviewer, 'usage.json'), 'FIRST-independent-review/usage.json')
for (const name of ['freeze.json', 'SHA256SUMS'])
  retain(path.join(reviewer, name), `FIRST-independent-review/${name}`)
const authorReport = retain(path.join(author, 'report.first.md'), 'FIRST-author/report.first.md')
retain(manifestFile, 'FIRST-author/hashes.first.json')
for (const stage of ['finalize', 'vectorize'])
  retain(path.join(author, 'first', stage, 'receipt.json'), `FIRST-author/${stage}.receipt.json`)
fs.mkdirSync(durable, { recursive: true })
const receiptFile = path.join(durable, 'consumed.json')
fs.writeFileSync(receiptFile, JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D034', physicalPage: 241,
  status: 'SOURCE-NATIVE-RAW-SVG-FIRST-PASS-CONSUMED', rows: [22, 22], outputs,
  independentReview, reviewerUsage, authorReport, boundary: review.boundaries,
  source240241Join: 'Supplied open240 tail coherently joins actual241 first cont; no page replay.',
  sourceGate: 'FIRST independent 22 rows plus RAW210211/SVG210211 fidelity PASS; native FIRST reused.',
  nativeReplays: 0, vectorReplays: 0, parentNewImages: 0, paidCalls: 0,
  newSourcePages: 1, newCompleteCards: 0, firstFailuresPreserved: true,
  fullN90OrModernCardApproved: false, source242Read: false,
  databasePublisherDeploy: false, commitPush: false,
}, null, 2) + '\n', { flag: 'wx' })
const receipt = { ...bind(receiptFile), batch: 'D034' }
index.reports.push(receipt)
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 472
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE241 FIRST22/22 and RAW210211/SVG210211 independent PASS consumed; supplied240 tail joins first241 cont, outgoing paragraph closed but n90 next heading unread.'
meter.currentCheckpoint.productionContinuation.source241 = {
  status: 'SOURCE-NATIVE-RAW-SVG-FIRST-PASS-CONSUMED', receipt,
}
meter.currentCheckpoint.productionContinuation.latestSourceReceipt = receipt
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n')
console.log(JSON.stringify({ receipt, sourcePages: 472, completePushed: 102,
  completeUnbatched: meter.currentCheckpoint.completeUnbatchedCards, paidCalls: 0 }))
