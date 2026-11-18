import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const author = path.join(path.dirname(own), 'd604-n76-fig179180-first-modern-author')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const pin = file => {
  const s = fs.statSync(file)
  return { path: file, sha256: sha(file), bytes: s.size, mode: (s.mode & 0o777).toString(8).padStart(4, '0') }
}
const write = (name, payload) => fs.writeFileSync(path.join(own, name), JSON.stringify(payload, null, 2) + '\n', { flag: 'wx' })
const comparison = read(path.join(own, 'comparison.json'))
const evidence = read(path.join(own, 'evidence.json'))
const ledger = read(path.join(own, 'open-ledger.json'))
assert.equal(ledger.actualTotal, 6)
assert.equal(ledger.opens.length, 6)
assert.deepEqual(ledger.opens.map(o => o.ordinal), [1, 2, 3, 4, 5, 6])
assert.equal(ledger.reopens, 0)
assert.equal(ledger.crops, 0)
for (const record of ledger.opens) assert.equal(sha(path.resolve(repo, record.path)), record.sha256)
for (const record of evidence.verifiedRecords) assert.equal(sha(record.path), record.sha256)
assert.equal(evidence.applicationCSSMatchesCapturedReceipt, true)
for (const name of fs.readdirSync(own)) {
  const file = path.join(own, name)
  assert(fs.statSync(file).isFile(), 'No unrelated directory in owned review root')
  fs.chmodSync(file, 0o444)
}
const figures = comparison.figures.map(item => {
  const file = path.join(own, `${item.id}.review.json`)
  const receipt = read(file)
  assert.equal(receipt.schema, 'ld-s10y-image/review@1')
  assert.equal(receipt.status, 'pass')
  assert.equal(receipt.spec.sha256, sha(path.join(author, `${item.id}.repair1.spec.json`)))
  assert.equal(receipt.render.sha256, sha(path.join(author, `${item.id}.repair1.render.json`)))
  for (const output of Object.values(receipt.outputs)) assert.equal(sha(path.resolve(repo, output.path)), output.sha256)
  return {
    figure: item.id, FIG: item.FIG, DISPLAY: item.DISPLAY,
    essentialBlockers: item.essentialBlockers, displayScope: item.displayScope,
    visualAssessment: item.visualAssessment,
    modernAdditionsNotSourceFacts: item.modernAdditionsNotSourceFacts,
    sameFigureN77: item.sameFigureN77 ?? null,
    authorInventoryComparison: item.authorInventoryComparison ?? null,
    source: receipt.source, spec: receipt.spec, render: receipt.render, outputs: receipt.outputs,
    reviewAt1: pin(file), canonicalPromoted: false, wholeCard: 'PENDING'
  }
})
write('report.json', {
  schema: 'STEMROBIN-181/d614-first-independent-fig179180-review@1',
  ticket: 'STEMROBIN-181', decision: 'D033', card: 'phy10-c2-s2-n76',
  recordedAtUTC: new Date().toISOString(),
  role: 'Fresh short-lived FIRST independent modern FIG179/180 and scoped DISPLAY reviewer; bounded batch finished.',
  ownedRoot: own,
  status: 'FIRST-INDEPENDENT-FIG-PASS-DISPLAY-PASS-FULLCARD-PENDING',
  FIG: 'PASS', DISPLAY: 'PASS',
  SCI: 'PASS-INHERITED-D598-NO-TEXT-REPLAY',
  ZHEN: 'PASS-INHERITED-D598-NO-TEXT-REPLAY',
  wholeCard: 'PENDING', headedProductAcceptance: 'PENDING-NOT-RUN',
  essentialBlockers: [], figures,
  independentInventories: pin(path.join(own, 'independent-inventories.json')),
  comparison: pin(path.join(own, 'comparison.json')),
  openLedger: pin(path.join(own, 'open-ledger.json')),
  evidence: pin(path.join(own, 'evidence.json')),
  byteVerification: {
    status: 'PASS', verifiedHashRecords: evidence.verifiedRecords.length,
    uniqueVerifiedPaths: evidence.uniqueVerifiedPaths,
    currentApplicationCSSMatchesExactCapture: true,
    manifests: evidence.manifests,
    evidenceRecordedBeforeReviewRecorderCalls: true
  },
  method: [
    'Read ld-s10y-image SKILL, quality-gate, figure-spec and repository binding rules.',
    'Verified original hashes, opened the original two PNGs first, and froze independent inventories at open count 2 before author material.',
    'Compared independently against retained author inventory/reconciliation, current repair1 FigureSpec assertions, frozen n76 zh/en prose, and exact Chromium captures.',
    'Only n77 candidate TEXT was read to check reuse consistency of the same fig-179; no n77 figure or answer inspection or generation.',
    'Checked every source mark mapping and every mapped point relationship wholly inside its inventory group; object counts were not substituted for coverage.',
    'Inspected both full and 342px captures; used existing 331px mechanical evidence without opening another image.',
    'Recorded the two genuine PASS decisions through existing record_review.py, without a separate native-validator command or renderer replay.'
  ],
  repairBoundary: {
    firstNativeFAILInputsAndOutputs: 'RETAINED-UNCHANGED-IN-D604',
    soleRepair1PerFigure: 'ALREADY-USED-BY-AUTHOR',
    additionalRepairCount: 0, furtherRepairsAllowed: false,
    separateNativeValidatorCLIInvocations: 0,
    nativeRendererInvocations: 0,
    standardRecordReviewInvocations: 2,
    recorderIntrinsicValidateFunctionCalls: 2,
    recorderGuardDisclosure: 'The required unchanged record_review.py internally calls validate(spec, rendered) while recording each receipt. No independent validate_spec.py CLI replay was run; the recorder was not patched or bypassed.'
  },
  counts: {
    imageOpens: 6, batchMaximum: 8, contextMaximum: 24,
    originalOpens: 2, fullNativeOpens: 2, actual342Opens: 2,
    crops: 0, reopens: 0, imagePayloadsReturned: 0,
    screenshotsCreated: 0, extraWorkers: 0, newWorktrees: 0, newBranches: 0,
    figureGenerations: 0, paidCalls: 0, DBCalls: 0, gitCommands: 0,
    deployCalls: 0, textPassReplays: 0
  },
  boundaries: {
    noCanonicalPromotion: true, noWholeCardPass: true,
    noOutsideEdits: true, noToolOrCharterEdits: true,
    noEnvReadsOrEdits: true, noPermanentOrReplacementWorker: true,
    textOnlyReturn: true, moreImageOpensPlanned: false
  }
})
fs.chmodSync(path.join(own, 'report.json'), 0o444)
const files = fs.readdirSync(own).sort().map(name => pin(path.join(own, name)))
assert(files.every(file => file.mode === '0444'))
write('review-freeze.json', {
  schema: 'STEMROBIN-181/d614-independent-review-freeze@1',
  status: 'FROZEN-0444-BOUNDED-BATCH-FINISHED',
  ownedRoot: own, report: pin(path.join(own, 'report.json')),
  files, inputEvidence: pin(path.join(own, 'evidence.json')),
  note: 'External source/spec/render/SVG/screenshots and all other frozen input bindings are enumerated in evidence.json. No external file was edited or chmodded.'
})
fs.chmodSync(path.join(own, 'review-freeze.json'), 0o444)
const sealFiles = [...files, pin(path.join(own, 'review-freeze.json'))]
fs.writeFileSync(path.join(own, 'review-freeze.sha256'), sealFiles.map(file => `${file.sha256}  ${file.path}`).join('\n') + '\n', { flag: 'wx', mode: 0o444 })
console.log(JSON.stringify({
  status: 'FIG179/180 PASS; scoped DISPLAY full/342 PASS; whole-card PENDING',
  report: pin(path.join(own, 'report.json')),
  inventories: pin(path.join(own, 'independent-inventories.json')),
  openLedger: pin(path.join(own, 'open-ledger.json')),
  evidence: pin(path.join(own, 'evidence.json')),
  reviews: figures.map(f => f.reviewAt1),
  freeze: pin(path.join(own, 'review-freeze.json')),
  hashSeal: pin(path.join(own, 'review-freeze.sha256'))
}, null, 2))
