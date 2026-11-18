import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(root, '../../../../..')
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const load = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const pin = p => {
  const file = path.resolve(p)
  const stat = fs.statSync(file)
  return { path: file, sha256: sha(file), bytes: stat.size,
    mode: (stat.mode & 0o777).toString(8).padStart(4, '0') }
}
const save = (name, data) => {
  const p = path.join(root, name)
  assert(!fs.existsSync(p), `Refusing to overwrite ${p}`)
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  fs.chmodSync(p, 0o444)
  return p
}
const files = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  assert(!e.isSymbolicLink(), 'Owned freeze excludes symlinks')
  const p = path.join(dir, e.name)
  return e.isDirectory() ? files(p) : [p]
}).sort()
const provenance = load('input-pins.json')
for (const input of provenance.inputs) assert.equal(sha(input.path), input.sha256)
const display = load('display-receipts.json')
assert.equal(display.resvgUsed, false)
assert.equal(display.browser.headless, true)
assert.equal(display.browser.isolated, true)
assert.equal(display.figures.length, 2)
const native = load('native-before-after.json')
assert.equal(native.targetedSpecRepairs, 0)
assert.equal(native.passRerenders, 0)
assert(!fs.existsSync(path.join(root, 'display-first-failure.json')))
const observations = []
for (const number of [177, 178]) {
  const figure = `fig-${number}`
  const receipt = display.figures.find(f => f.figure === figure)
  const dir = path.join(root, figure)
  const spec = load(`${figure}/spec.json`)
  const report = load(`${figure}/render.first.json`)
  assert.equal(report.status, 'pass')
  assert.equal(sha(receipt.svg.path), receipt.svg.sha256)
  assert.equal(sha(receipt.spec.path), receipt.spec.sha256)
  const group = spec.source.inventory[0]
  const coverage = load('assertion-coverage.json').find(f => f.figure === figure)
  assert.equal(coverage.uncoveredPoints.length, 0)
  assert.equal(coverage.mappedPoints, 11)
  observations.push({
    figure,
    authorOnly: true,
    originalSource: spec.source.image,
    inventory: pin(path.join(root, `source-inventory-${number}.json`)),
    spec: pin(path.join(dir, 'spec.json')),
    svg: pin(path.join(dir, `${figure}.svg`)),
    nativeReport: pin(path.join(dir, 'render.first.json')),
    sourceInventoryGroup: group.id,
    observations: [
      'Exactly one source subfigure is retained, with one solid horizontal principal axis and one solid perpendicular lens symbol.',
      `Two open chevron arrowheads are retained: upper ${number === 177 ? 'up/outward' : 'down/inward'}, lower ${number === 177 ? 'down/outward' : 'up/inward'}. Neither head is a light ray.`,
      'Both F markers are hollow with paper-colored interiors and labels above; their centers lie on opposite sides of O on the same principal axis.',
      'O labels the shared axis/lens intersection below-left; no independent center dot or extra visible construction-point marks appear.',
      'No source dashed strokes exist; all source solid strokes remain solid. No object/image arrows, extra rays, dimensions or answer-bearing annotations were introduced.',
      'Clean focal spacing and symbol dimensions are explicitly modern regularization, not exact measurements inferred from the scan.',
      'All source elements map to native objects/assertions; all 11 point IDs have at least one relationship wholly contained in the sole inventory group.',
      'Full-resolution native CSS-variable SVG screenshot was inspected with view_image original detail.',
      'Actual 342px native inline SVG screenshot was separately inspected with view_image original detail; labels and open arrowheads remain distinct and unclipped.',
      'Chromium computed styles resolve ink/paper roles. Pixel samples confirm axis, lens and all four arrow arms survive and both focal interiors stay light.',
    ],
    normalWidthText: receipt.checks.map(c => ({
      width: c.width, actualSvgWidth: c.actualSvgWidth, minTextPx: c.measuredMinTextPx,
      allTextAtLeast16: c.measuredMinTextPx >= 16,
      labelOverlapCount: c.labelOverlaps.length,
    })),
    unresolvedSemanticRelations: [],
    nativeMechanicalStatus: 'PASS',
    visualAuthorObservation: 'COMPLETE-NOT-INDEPENDENT-APPROVAL',
    independentFIG: 'PENDING',
    independentDISPLAY: 'PENDING',
  })
}
save('author-observations.json', {
  role: 'Fresh single bounded FIRST n76 modern FIG177178 author only; not permanent/replacement A-D',
  sourceExtractionApprovalScope: 'Existing original extraction PASS only, never modern FIG acceptance',
  currentSCIAndZHEN: 'Inherited effective-composed PASS; no passed text review repeated',
  figures: observations,
  noIndependentSignature: true,
  reviewAt1Written: false,
  completeCard: false,
})
const imageSequence = [
  [177, 'original', path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-177.png')],
  [178, 'original', path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-178.png')],
  [177, 'full-native', path.join(root, 'fig-177/fig-177.full.native.png')],
  [178, 'full-native', path.join(root, 'fig-178/fig-178.full.native.png')],
  [177, 'actual-342-native', path.join(root, 'fig-177/fig-177.actual-342.native.png')],
  [178, 'actual-342-native', path.join(root, 'fig-178/fig-178.actual-342.native.png')],
]
save('images-ledger.json', {
  currentContextStart: 0, currentContextEnd: 6, imageOpens: 6,
  boundedBatchLimit: 8, contextLimit: 24,
  parentAndOldContexts: { providedCount: 24, providedLimit: 24, changed: false, reset: false },
  sourceInventorySealed0444BeforeSkillsTextContextOrModernMaterial: true,
  firstTwoImageActionsAreSeparateOriginalInspections: true,
  sequence: imageSequence.map(([figure, purpose, p], i) => ({
    ordinal: i + 1, figure: `fig-${figure}`, purpose, ...pin(p),
    tool: 'functions.view_image', detail: 'original',
  })),
  originalOpens: 2, fullNativeOpens: 2, actual342NativeOpens: 2,
  reopens: 0, crops: 0, otherImageOpens: 0,
  resets: 0, imagePayloadsReturnedToParentOrFinalAnswer: 0,
  furtherImageOpensAuthorizedInThisBatch: false,
  boundedBatchEnded: true,
})
save('report.json', {
  schema: 'd603/n76-fig177178-first-modern-author@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76',
  role: 'Fresh single bounded FIRST figure author only; not permanent/replacement A-D',
  ownedRoot: root, status: 'FIRST-MODERN-AUTHOR-COMPLETE-PENDING-INDEPENDENT-FIG-DISPLAY',
  SCI: 'PASS-INHERITED-NOT-REPEATED', ZHEN: 'PASS-INHERITED-NOT-REPEATED',
  SOURCE: 'EXISTING-ORIGINAL-EXTRACTION-PASS-ONLY-NO-MODERN-APPROVAL',
  FIG: 'PENDING-INDEPENDENT-FIRST-REVIEW',
  DISPLAY: 'AUTHOR-NATIVE-OBSERVED-PENDING-INDEPENDENT-FIRST-REVIEW',
  nativeValidation: 'PASS', nativeRender: 'PASS',
  nativeWidthObservations: 'COMPLETE-331-342-640-NOT-INDEPENDENT-ACCEPTANCE',
  originalD585R08HOLD: 'RETAINED-NOT-REWRITTEN',
  inheritedTextReport: provenance.inputs.find(p => p.path.endsWith('d598-n76-r08-first-affected-text-review/report.json')),
  figureContextManifest: provenance.inputs.find(p => p.path.endsWith('d593-n76-first-figure-contexts/manifest.json')),
  figures: observations.map(o => ({
    figure: o.figure, spec: o.spec, svg: o.svg, nativeReport: o.nativeReport,
    unresolvedSemanticRelations: o.unresolvedSemanticRelations,
    nativeMechanicalStatus: o.nativeMechanicalStatus,
    independentFIG: 'PENDING', independentDISPLAY: 'PENDING',
  })),
  files: {
    inputPins: path.join(root, 'input-pins.json'),
    inventory177: path.join(root, 'source-inventory-177.json'),
    inventory178: path.join(root, 'source-inventory-178.json'),
    sourceToSpec: path.join(root, 'source-to-spec.json'),
    assertionCoverage: path.join(root, 'assertion-coverage.json'),
    nativeBeforeAfter: path.join(root, 'native-before-after.json'),
    displayReceipts: path.join(root, 'display-receipts.json'),
    authorObservations: path.join(root, 'author-observations.json'),
    imagesLedger: path.join(root, 'images-ledger.json'),
    authorFreeze: path.join(root, 'author-freeze.json'),
  },
  targetedGenuineSpecRepairs: 0, firstFAIL: null, passRerenders: 0,
  sourceGroupLosses: 0, modernArtifactFallbacks: 0,
  imageOpens: 6, batchImageLimit: 8, contextImageCount: 6,
  parentAndOldContextImageCount: 24, noBudgetReset: true,
  paidCalls: 0, directSVGEdits: 0,
  independentFIGSignatures: 0, independentDISPLAYSignatures: 0,
  fullCardSignatures: 0, reviewAt1Files: 0,
  sourcePagesAdded: 0, completeCardsAdded: 0, completeCard: false,
  canonicalEdits: 0, externalEvidenceEdits: 0, indexEdits: 0, meterEdits: 0,
  gitOperations: 0, DBOperations: 0, deployOperations: 0,
  newWorkers: 0, newWorktrees: 0, newBranches: 0,
  rollback: false, writesAndChmodsOnlyInsideOwnedRoot: true,
  historicalFAILHOLDAndSharedActiveWorkPreserved: true,
  terminal: { boundedBatchEnded: true, noFurtherWorkInThisBatch: true },
  freezePolicy: 'All owned files 0444; author-freeze hashes every other owned file including report. Freeze self hash is returned separately in text; no circular self signature.',
})
for (const p of files(root))
  if ((fs.statSync(p).mode & 0o777) !== 0o444) fs.chmodSync(p, 0o444)
const payloadFiles = files(root).map(pin)
const freezePath = save('author-freeze.json', {
  schema: 'd603/author-freeze@1', ownedRoot: root,
  kind: 'AUTHOR-FILE-FREEZE-NOT-INDEPENDENT-FIG-DISPLAY-OR-FULLCARD-REVIEW',
  report: pin(path.join(root, 'report.json')),
  payloadFileCount: payloadFiles.length,
  allOwnedFileCountIncludingFreeze: payloadFiles.length + 1,
  allOwnedMode: '0444', sourceInventoriesSealedFirst: true,
  files: payloadFiles,
  externalInputPins: provenance.inputs,
  nativeToolPins: [
    'scripts/validate_spec.py', 'scripts/render_spec.mjs', 'scripts/materialize_arrowheads.mjs',
    'assets/figure-spec.schema.json', 'references/figure-spec.md',
    'references/routing.md', 'references/quality-gate.md',
  ].map(p => pin(path.join(repo, '.agents/skills/ld-s10y-image', p))),
  displayStylesheetPin: display.stylesheet,
  imageOpens: 6, specRepairs: 0, budgetReset: false,
  independentFIG: 'PENDING', independentDISPLAY: 'PENDING', completeCard: false,
  selfHashPolicy: 'No circular self hash. Exact SHA-256 returned in final text.',
  boundedBatchEnded: true,
})
for (const file of load('author-freeze.json').files) {
  assert.equal(sha(file.path), file.sha256)
  assert.equal(fs.statSync(file.path).mode & 0o777, 0o444)
}
assert(files(root).every(p => (fs.statSync(p).mode & 0o777) === 0o444))
assert(files(root).every(p => !p.endsWith('.review.json')))
console.log(JSON.stringify({
  status: 'BOUNDED-AUTHOR-BATCH-FROZEN',
  report: pin(path.join(root, 'report.json')),
  authorFreeze: pin(freezePath),
  figures: observations.map(o => ({ figure: o.figure, spec: pin(o.spec.path), svg: pin(o.svg.path) })),
  allOwnedFiles0444: true, fileCount: files(root).length,
  imageOpens: 6, specRepairs: 0, independentFIG: 'PENDING', independentDISPLAY: 'PENDING',
}, null, 2))
