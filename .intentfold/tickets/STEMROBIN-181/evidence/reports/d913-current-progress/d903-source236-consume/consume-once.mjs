import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const finishOnly = process.argv.includes('--finish-only')
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const tmp = path.join(ticket, 'tmp')
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const durable = path.join(ticket, 'evidence/reports/d903-source236-consumed')
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const indexFile = path.join(ticket, 'evidence/index.json')
const meterFile = path.join(ticket, 'production-meter.json')
const index = read(indexFile)
const meter = read(meterFile)
const known = new Map(index.reports.map(b => [b.sha256, b]))
assert.equal(meter.sourcePagesFinalized, 467)
assert.equal(meter.imageCalls, 12)
assert.ok(!fs.existsSync(path.join(durable, 'consumed.json')))
const reviewFile = path.join(tmp, 'd894-source236-eleven-finding-affected-review/report.json')
assert.equal(sha(reviewFile), '8fdfe5f0d3c00e22978000582655ea3c7dfbebd538f968c9860b36f4609614c5')
const review = read(reviewFile)
assert.equal(review.status, 'PASS')
assert.equal(review.affectedStatus, 'PASS')
assert.equal(review.composedSourceStatus, 'SOURCE_PASS')
assert.equal(review.sourceApproval, true)
assert.equal(review.fullCardApproval, false)
assert.equal(review.findings.length, 11)
assert.ok(review.findings.every(f => f.affectedStatus === 'PASS'))
function copy(from, to) {
  if (finishOnly) {
    assert.ok(fs.existsSync(to), 'Finish-only cannot replay a missing copy: ' + to)
    assert.equal(sha(to), sha(from), to)
    return bind(to)
  }
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(sha(to), sha(from), to)
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(to))
  return bind(to)
}
function retain(f, suffix) {
  const prior = known.get(sha(f))
  if (prior && fs.existsSync(path.resolve(repo, prior.path))) {
    assert.equal(sha(path.resolve(repo, prior.path)), prior.sha256)
    return prior
  }
  const b = { ...copy(f, path.join(durable, suffix)),
    originalPath: path.relative(repo, f), batch: 'D034' }
  index.reports.push(b)
  known.set(b.sha256, b)
  return b
}
const outputs = []
for (const b of review.bindings.candidate) {
  assert.equal(sha(b.path), b.sha256)
  outputs.push(copy(b.path, path.join(raw, 'pages/0236', path.basename(b.path))))
}
const audit = read(path.join(raw, 'pages/0236/audit.json'))
assert.deepEqual([audit.lines_printed, audit.lines_md], [26, 26])
assert.deepEqual(audit.errors, [])
const portraitPNG = path.join(tmp, 'd893-source236-eleven-finding-repair/work/10p/pages/0236/figures/tbl-p0236-01.png')
const portraitSVG = path.join(tmp, 'd891-source236-portrait-first-vectorize/work/10p/pages/0236/figures/tbl-p0236-01.svg')
assert.equal(sha(portraitPNG), '96e76c45711addcd4cdf619cb47bb3192328aa4619000608c8517ec7eee9e82a')
assert.equal(sha(portraitSVG), '261bcec095ab2123b5d4ab52b3369a8627345385d01a4ec05aa3234128af4a49')
for (const f of [portraitPNG, portraitSVG])
  outputs.push(copy(f, path.join(raw, 'figures', path.basename(f))))
const priorReview = retain(review.bindings.priorReport.path, 'FIRST-review.json')
const affected = retain(reviewFile, 'affected-review.json')
const svgReview = retain(review.bindings.svgReview.path, 'portrait-FIRST-svg-review.json')
const repair = retain(review.bindings.repairReport.path, 'repair.json')
const native = retain(review.bindings.native.path, 'native.json')
const receiptFile = path.join(durable, 'consumed.json')
fs.mkdirSync(durable, { recursive: true })
fs.writeFileSync(receiptFile, JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D034', physicalPage: 236,
  status: 'SOURCE-NATIVE-PORTRAIT-COMPOSED-PASS-CONSUMED', rows: [26, 26],
  firstReview: priorReview, affectedReview: affected, repair, native, svgReview, outputs,
  sourceGate: 'FIRST unaffected16 rows and typography/block/boundary PASS plus independent11-finding/10-row affected PASS.',
  portraitGate: 'Byte-identical reviewed PNG and independently reviewed FIRST SVG reused; no vector/render/review replay.',
  actualNextHeading: 'p0236#7: 89. \u884d\u5c04\u5149\u6805',
  boundary: 'Heading closes preceding n88 source only. n89 outgoing p0236#8 remains open until SOURCE237; no modern-card approval.',
  nativeReplays: 0, vectorReplays: 0, parentNewImages: 0, paidCalls: 0,
  newSourcePages: 1, newCompleteCards: 0, firstFailuresPreserved: true,
  wholeCardApproved: false, databasePublisherDeploy: false, commitPush: false,
  finishOnlyRecovery: finishOnly,
  firstExecutionFailure: finishOnly
    ? bind(path.join(tmp, 'd903-source236-consume/FIRST-finish-failure.json')) : null,
}, null, 2) + '\n', { flag: 'wx' })
const receipt = { ...bind(receiptFile), batch: 'D034' }
index.reports.push(receipt)
meter.sourcePagesFinalized = meter.currentCheckpoint.sourcePagesFinalized = 468
meter.currentCheckpoint.sourcePagesBasis += '; SOURCE236 FIRST unaffected plus11-finding affected PASS consumed, native26/26; portraitPNG and FIRSTSVG PASS reused without replay. Actual89 heading closes preceding source only.'
meter.currentCheckpoint.productionContinuation.source236 = {
  status: 'SOURCE-NATIVE-PORTRAIT-COMPOSED-PASS-CONSUMED', receipt,
}
meter.currentCheckpoint.productionContinuation.latestSourceReceipt = receipt
index.updatedAt = meter.updatedAt = new Date().toISOString()
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n')
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n')
console.log(JSON.stringify({ receipt, sourcePages: 468, completePushed: 102,
  completeUnbatched: meter.currentCheckpoint.completeUnbatchedCards, paidCalls: 0 }))
