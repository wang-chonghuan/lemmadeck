import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(owned, '../../../../..')
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d603-n76-fig177178-first-modern-author')
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const load = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const record = p => ({ path: p, sha256: sha(p), bytes: fs.statSync(p).size, mode: (fs.statSync(p).mode & 0o777).toString(8).padStart(4, '0') })
const save = (name, data) => fs.writeFileSync(path.join(owned, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const ledger = load(path.join(owned, 'openledger.json'))
assert.deepEqual(ledger.imageOpens.map(o => o.ordinal), [1, 2, 3, 4, 5, 6, 7, 8])
assert.equal(ledger.totalOpens, 8)
assert.equal(ledger.parentHistoricalImageCount, 24)
assert.equal(ledger.parentHistoricalCountReset, false)
for (const open of ledger.imageOpens) assert.equal(sha(path.join(repo, open.path)), open.sha256)
const observations = load(path.join(owned, 'visual-observations.json'))
assert.equal(observations.FIG, 'PASS')
assert.equal(observations.DISPLAY, 'PASS')
const authorFreeze = load(path.join(author, 'author-freeze.json'))
assert.equal(sha(path.join(author, 'author-freeze.json')), '8296d6e9c97c18555e9cd51656457c3493444e01113716fa330a524f4ac506bb')
for (const pin of [...authorFreeze.files, ...authorFreeze.externalInputPins, ...authorFreeze.nativeToolPins, authorFreeze.displayStylesheetPin]) {
  assert.equal(sha(pin.path), pin.sha256)
}
const reviews = [177, 178].map(n => {
  const file = path.join(owned, `fig-${n}.review.json`)
  const review = load(file)
  assert.equal(review.schema, 'ld-s10y-image/review@1')
  assert.equal(review.status, 'pass')
  for (const binding of [review.source, review.spec, review.render, ...Object.values(review.outputs)]) {
    assert.equal(sha(path.resolve(repo, binding.path)), binding.sha256)
  }
  return { figure: `fig-${n}`, FIG: 'PASS', DISPLAY: 'PASS', reviewPath: file, source: review.source, spec: review.spec, render: review.render, outputs: review.outputs }
})
for (const name of fs.readdirSync(owned)) fs.chmodSync(path.join(owned, name), 0o444)
for (const review of reviews) {
  review.review = record(review.reviewPath)
  delete review.reviewPath
}
save('report.json', {
  schema: 'd611/n76-fig177178-first-independent-review@1',
  ticket: 'STEMROBIN-181',
  slice: 'D033',
  card: 'phy10-c2-s2-n76',
  ownedRoot: owned,
  workspace: repo,
  reviewRole: 'Fresh short-lived FIRST independent FIG177/178 plus standalone DISPLAY only',
  status: 'PASS-FIRST-INDEPENDENT-FIG-AND-STANDALONE-DISPLAY',
  FIG: 'PASS',
  DISPLAY: 'PASS',
  SCI: 'PASS-INHERITED-NOT-REPEATED',
  ZHEN: 'PASS-INHERITED-NOT-REPEATED',
  fullN76CardCertified: false,
  completeCard: false,
  completeCardsAdded: 0,
  sourcePagesAdded: 0,
  scopedFigures: reviews,
  originalInventoryReadOrder: {
    originalOpens: [1, 2],
    independentInventorySealedBeforeAuthorSpecOrInventory: true,
    inventory: record(path.join(owned, 'independent-inventory.json')),
    authorInventoryNotUsedToDeriveIndependentOriginalFacts: true,
  },
  evidence: Object.fromEntries([
    'independent-inventory.json', 'openledger.json', 'visual-observations.json',
    'input-verification.json', 'independent-assertion-mapping.json', 'display-receipts.json',
  ].map(name => [name, record(path.join(owned, name))])),
  externalBindings: {
    authorReport: record(path.join(author, 'report.json')),
    authorFreeze: record(path.join(author, 'author-freeze.json')),
    manifest: record(path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d593-n76-first-figure-contexts/manifest.json')),
    currentText: ['zh', 'en'].map(locale => record(path.join(repo, `.intentfold/tickets/STEMROBIN-181/tmp/d597-n76-r08-first-text-repair/candidate/${locale}/lesson.template.json`))),
    inheritedTextReview: record(path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d598-n76-r08-first-affected-text-review/report.json')),
  },
  verification: {
    all45ListedFrozenAndExternalToolPinsVerified: true,
    authorNativeValidation: 'PASS-INHERITED-NOT-RERUN',
    authorNativeRender: 'PASS-INHERITED-NOT-RERUN',
    independentlyEvaluatedExecutableAssertionFacts: 40,
    inventoryMappedPointRelationshipsCoveredWithinAuthorGroup: true,
    nativeRenderSpecInvocations: 0,
    standaloneNativeValidateSpecInvocations: 0,
    recordReviewInvocations: 2,
    recordReviewMandatoryInternalRenderedValidationCalls: 2,
    recordReviewScript: record(path.join(repo, '.agents/skills/ld-s10y-image/scripts/record_review.py')),
    SVGModified: false,
    specModified: false,
    resvgUsed: false,
    browser: load(path.join(owned, 'display-receipts.json')).browser,
    browserClosed: true,
    inspectedWidths: [640, 342, 331],
    minimumMeasuredLabelPx: 16.54971590909091,
    imageOpens: 8,
    batchLimit: 8,
    contextLimit: 24,
    currentFreshContextImageCount: 8,
    parentHistoricalImageCount: 24,
    parentHistoricalCountReset: false,
    parentImagePayloadsLoaded: 0,
    allEightOwnImageOpensDocumented: true,
    headedFullCardAcceptancePerformed: false,
  },
  blockers: [],
  boundaries: {
    repairs: 0,
    canonicalPromotion: false,
    canonicalEdits: 0,
    DBOperations: 0,
    gitOperations: 0,
    deployOperations: 0,
    newPaidGeneration: 0,
    newWorkers: 0,
    newWorktrees: 0,
    newBranches: 0,
    charterEdits: 0,
    externalEvidenceEdits: 0,
    authorArtifactsUnchanged: true,
    historicalFailHoldAndOtherWorkersPreserved: true,
    writesAndChmodsOnlyInsideOwnedRoot: true,
  },
  terminal: { boundedFirstReviewClosed: true, noMoreImageOpens: true, noFurtherWorkInThisBatch: true },
  freezePolicy: 'All owned payload files plus review-freeze.json mode 0444. Review freeze hashes every payload including report; self hash returned separately in final text.',
})
const files = fs.readdirSync(owned).map(name => path.join(owned, name)).sort()
assert(files.every(p => fs.statSync(p).isFile()))
for (const file of files) fs.chmodSync(file, 0o444)
save('review-freeze.json', {
  schema: 'd611/independent-review-freeze@1',
  ownedRoot: owned,
  FIG: 'PASS',
  DISPLAY: 'PASS',
  SCI: 'PASS-INHERITED-NOT-REPEATED',
  ZHEN: 'PASS-INHERITED-NOT-REPEATED',
  completeCard: false,
  allOwnedMode: '0444',
  payloadFileCount: files.length,
  allOwnedFileCountIncludingFreeze: files.length + 1,
  files: files.map(record),
  externalAuthorFreeze: record(path.join(author, 'author-freeze.json')),
  imageOpens: 8,
  parentHistoricalImageCount: 24,
  parentHistoricalCountReset: false,
  browserClosed: true,
  terminal: true,
  selfHashPolicy: 'No circular self hash; exact SHA-256 returned in final text.',
})
const freezePath = path.join(owned, 'review-freeze.json')
fs.chmodSync(freezePath, 0o444)
const sealed = load(freezePath)
for (const file of sealed.files) {
  assert.equal(sha(file.path), file.sha256)
  assert.equal(record(file.path).mode, '0444')
}
assert.equal(record(freezePath).mode, '0444')
console.log(JSON.stringify({
  FIG177: 'PASS', FIG178: 'PASS', DISPLAY177: 'PASS', DISPLAY178: 'PASS',
  fullN76CardCertified: false, imageOpens: 8, browserClosed: true,
  artifacts: [...sealed.files, record(freezePath)],
}, null, 2))
