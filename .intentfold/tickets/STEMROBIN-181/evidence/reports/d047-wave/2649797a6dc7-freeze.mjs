import assert from 'node:assert/strict'
import fs from 'node:fs'
import { G, W, bind, command, destination, read, sha, write } from './author.mjs'

const inputs = read(`${G}/inputs/input-bindings.json`)
for (const item of inputs.contexts) {
  assert.equal(sha(item.original.path), item.original.sha256)
  assert.equal(sha(item.frozen.path), item.original.sha256)
}
for (const item of inputs.contracts) assert.equal(sha(item.path), item.sha256)
assert.equal(sha(inputs.source.path), inputs.source.sha256)
const initial = read(`${G}/initial/fig-72.render.json`)
const repaired = read(`${G}/repair/fig-72.render.json`)
assert.equal(initial.status, 'fail')
assert.equal(repaired.status, 'pass')
assert.equal(read(`${G}/receipts/mathematical-gates.json`).status, 'pass')
assert.equal(read(`${G}/receipts/actual-media-preview.json`).status, 'pass')
const before = read(`${G}/initial/fig-72.spec.json`)
const after = read(`${G}/repair/fig-72.spec.json`)
const adjusted = structuredClone(before)
adjusted.objects.find(item => item.id === 'source-v-symbol').at = [613.5, 158]
assert.deepEqual(adjusted, after)
assert.deepEqual(before.assertions, after.assertions)
const repairReceipt = read(`${G}/receipts/sole-targeted-repair.json`)
for (const name of ['initialSpec', 'initialSvg', 'initialReport', 'initialPreview', 'initialRenderCommand']) {
  assert.equal(sha(repairReceipt[name].path), repairReceipt[name].sha256)
}
for (const name of ['fig-72.spec.json', 'fig-72.svg', 'fig-72.render.json']) {
  const original = `${G}/repair/${name}`
  const frozen = `${G}/frozen/${name}`
  fs.copyFileSync(original, destination(frozen))
  assert.equal(sha(original), sha(frozen))
}
const spec = read(`${G}/frozen/fig-72.spec.json`)
const report = read(`${G}/frozen/fig-72.render.json`)
assert.equal(report.spec.path, 'fig-72.spec.json')
assert.equal(report.output.svg.path, 'fig-72.svg')
assert.equal(sha(`${G}/frozen/${report.spec.path}`), report.spec.sha256)
assert.equal(sha(`${G}/frozen/${report.output.svg.path}`), report.output.svg.sha256)
const native = command('frozen-native-validation', 'python3', [
  `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`,
  'fig-72.spec.json', '--stage', 'rendered', '--json',
], `${G}/frozen`)
assert.equal(native.status, 0, native.stdout + native.stderr)
write(`${G}/frozen/source-inventory-mapping.json`, spec.source.inventory)
const previewFiles = ['media-640.png', 'mobile-start-390.png', 'mobile-end-390.png']
  .map(name => `${G}/previews/${name}`)
const pixelFiles = [`${G}/initial/fig-72.full.png`, `${G}/repair/fig-72.full.png`, ...previewFiles]
const pixels = command('raster-nonblank', `${W}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, [
  '-c',
  'from PIL import Image; import sys,json; result=[]\nfor p in sys.argv[1:]:\n im=Image.open(p).convert("RGB"); n=sum(1 for r,g,b in im.getdata() if max(r,g,b)<220); result.append({"path":p,"width":im.width,"height":im.height,"darkPixels":n,"totalPixels":im.width*im.height})\nprint(json.dumps(result))',
  ...pixelFiles,
])
assert.equal(pixels.status, 0, pixels.stderr)
const pixelChecks = JSON.parse(pixels.stdout)
assert(pixelChecks.every(item => item.darkPixels > 500 && item.darkPixels < item.totalPixels * 0.3))
write(`${G}/receipts/output-and-input-integrity.json`, {
  status: 'pass', allEightOriginalFrozenContextFilesStillCurrent: true,
  sourceStillCurrent: true, nativeContractsStillCurrent: true,
  initialFailArtifactsRetainedVerbatim: true,
  soleRepairChangedOnlyVLabelPosition: true, assertionsUnchanged: true,
  frozenOutputsByteIdenticalToRepairedOutputs: true,
  reportPathsResolveInsideFrozenDirectory: true,
  rendererOutputHandEdited: false, nativeRenderInvocations: 2,
  targetedRepairsUsed: 1, targetedRepairsAllowed: 1,
  pixelChecks,
  rasterScope: 'Automated pixel decoding only; these checks do not load image payloads into model context or assert independent visual/source-fidelity approval.',
})
const opened = [
  { number: 1, ...bind(inputs.source.path), kind: 'canonical-source',
    observation: 'Original wave graph inspected before any spec. Inventoried all source geometry and literal symbols, both solid styles, finite endpoints, extrema, crossings, axes, dimension guides and ten arrowheads.' },
  { number: 2, ...bind(`${G}/inputs/source-delta-detail.png`), kind: 'source-detail-crop',
    observation: 'Magnified original source crop resolves the middle multiplication dot and the two outward shift-span arrowheads. Not an independent source or new drawing.' },
  { number: 3, ...bind(`${G}/initial/fig-72.full.png`), kind: 'initial-failed-native-render',
    observation: 'Initial graph is visible and both wave labels attach correctly. Native report flags padded v/accent-anchor clearance; this initial failed result is retained, not approved.' },
  { number: 4, ...bind(`${G}/previews/media-640.png`), kind: 'actual-640px-native-preview',
    observation: 'After the sole repair, x/s axes, capital O, two solid distinct phase-shifted waves, lambda span, v and vector accent, shift equation and both leaders are readable with no overlap. No ticks, numerical scale, units, extra answer annotations or cultural lettering. Literal math glyphs retained.' },
  { number: 5, ...bind(`${G}/previews/mobile-end-390.png`), kind: 'actual-mobile-scroll-end',
    observation: '390px viewport with 316px host reaches scrollLeft 324 of 324. The right-hand wave endpoints, third-crest shift span, velocity annotation and s arrow/label are reachable and legible at unchanged 640px media width.' },
  { number: 6, ...bind(`${G}/previews/mobile-start-390.png`), kind: 'actual-mobile-scroll-start',
    observation: 'At the left scroll position, x and O, earlier rising-through-O curve, later below-origin curve, first-to-second-crest lambda span and later-curve label are legible. The right edge is intentionally scroll-clipped, not a canvas-clipping defect.' },
]
const authorReview = {
  schema: 'ld-s10y-image/author-review@1',
  figure: 'fig-72', card: 'phy10-c1-s5-n39', ticket: 'STEMROBIN-181',
  status: 'author-reviewed-independent-and-SCI-pending',
  reviewedAt: new Date().toISOString(),
  source: inputs.source,
  inputBindings: bind(`${G}/inputs/input-bindings.json`),
  spec: bind(`${G}/frozen/fig-72.spec.json`),
  render: bind(`${G}/frozen/fig-72.render.json`),
  svg: bind(`${G}/frozen/fig-72.svg`),
  sourceInventory: bind(`${G}/source-inventory.json`),
  mapping: bind(`${G}/frozen/source-inventory-mapping.json`),
  mathematics: bind(`${G}/receipts/mathematical-gates.json`),
  actualDisplay: bind(`${G}/receipts/actual-media-preview.json`),
  sourceFactsAndRegularizationDistinct: true,
  observations: opened,
  imageOpens: { totalLoadedIntoContext: 6, maximumThisBatch: 8, maximumContext: 24,
    canonicalSource: 1, sourceDetailCrop: 1, initialFailedPreview: 1, actualFinalPreviews: 3,
    sourceReopens: 0, priorImageHistoryIncluded: false },
  nativeRenderStatus: 'pass',
  authorMathematicalGatesStatus: 'pass',
  authorVisualObservation: 'Inspected, no author-visible issue after sole repair.',
  SCI: 'pending; exact current complete bilingual context only, no semantic approval',
  independentReview: 'pending; author is not an independent reviewer',
  promotion: false,
  wholeCardAcceptance: 'not performed or claimed',
  recordReviewCalled: false,
  nativeReviewNotCreatedReason: 'record_review.py only supports pass/fail. Author-only pending evidence uses a separate author-review schema and must not be mistaken for promotable ld-s10y-image/review@1.',
}
write(`${G}/author-review.json`, authorReview)
const math = read(`${G}/receipts/mathematical-gates.json`)
const freeze = {
  schema: 'ld-s10y-image/bounded-author-freeze@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c1-s5-n39', figure: 'fig-72',
  owner: G, frozenAt: new Date().toISOString(),
  status: 'AUTHOR-FROZEN-NATIVE-PASS-SCI-AND-INDEPENDENT-REVIEW-PENDING',
  source: inputs.source,
  sourcePixelInventory: bind(`${G}/source-inventory.json`),
  sourceCounts: read(`${G}/source-inventory.json`).counts,
  sourceInventoryGroups: spec.source.inventory.length,
  sourceInventoryMapping: bind(`${G}/frozen/source-inventory-mapping.json`),
  inputs: bind(`${G}/inputs/input-bindings.json`),
  fullAuthoritativeCurrentContext: inputs.contexts,
  authoritativeTextBlocks: spec.source.authoritativeText.length,
  textContextStatus: 'complete current ZH/EN prose verbatim plus current exercises; SCI pending',
  mode: spec.mode, display: spec.display,
  outputs: {
    spec: bind(`${G}/frozen/fig-72.spec.json`),
    svg: bind(`${G}/frozen/fig-72.svg`),
    render: bind(`${G}/frozen/fig-72.render.json`),
  },
  previews: previewFiles.map(bind),
  nativeFullPreviews: [`${G}/initial/fig-72.full.png`, `${G}/repair/fig-72.full.png`].map(bind),
  sourceDetail: bind(`${G}/inputs/source-delta-detail.png`),
  mathematicalGates: { ...math.gates,
    receipt: bind(`${G}/receipts/mathematical-gates.json`),
    nativeConnections: math.nativeConnections, nativeAssertions: math.nativeAssertions,
    nativeCurveVertices: math.nativeCurveVertices,
    phaseTranslatedCommonSamples: math.phaseTranslatedCommonSamples },
  nativeValidation: { draft: 'pass', rendered: 'pass',
    receipt: bind(`${G}/receipts/frozen-native-validation.json`) },
  renderChecks: { status: report.status, collisions: report.collisions,
    objects: report.objects, labels: report.labels, displayChecks: report.displayChecks },
  actualPreviewChecks: { status: 'pass', actualMediaWidth: 640,
    minimumActualTextPx: 20, mobileContainerWidth: 316,
    mobileScrollEnd: 324, receipt: bind(`${G}/receipts/actual-media-preview.json`) },
  geometryDefinition: bind(`${G}/geometry-definition.json`),
  authorReview: bind(`${G}/author-review.json`),
  integrity: bind(`${G}/receipts/output-and-input-integrity.json`),
  receipts: ['initial-validation', 'initial-render', 'sole-targeted-repair',
    'repair-validation', 'repair-render', 'raster-nonblank'].map(name => bind(`${G}/receipts/${name}.json`)),
  scripts: ['author.mjs', 'repair.mjs', 'inspect.mjs', 'freeze.mjs'].map(name => bind(`${G}/${name}`)),
  imagesOpened: authorReview.imageOpens,
  nativeRenderInvocations: 2,
  initialAttemptStatus: 'fail; artifacts retained verbatim',
  targetedRepairsUsed: 1, targetedRepairsAllowed: 1, secondRepair: false,
  handEditedRendererOutput: false,
  deterministicRegenerationClaim: 'not rerun; exact translation construction and native renderer used. Byte-preserving freeze is not claimed as proof of source fidelity.',
  SCI: 'pending', independentReview: 'pending', recordReviewCalled: false,
  durablePromotion: false, fullCardAcceptance: false,
  forbiddenWrites: { Git: false, database: false, ticketBackend: false, app: false,
    sharedTools: false, charter: false, otherOwnedDirectories: false, otherChatMessages: false },
  acceptanceScope: 'Figure authoring, native validator/renderer, executable author mathematical checks and isolated headed media640 scroll preview only. Not independent PASS, SCI approval, full-card acceptance or durable promotion.',
}
write(`${G}/author-freeze.json`, freeze)
console.log(JSON.stringify({ status: freeze.status,
  authorFreeze: bind(`${G}/author-freeze.json`),
  inputs: freeze.inputs, outputs: freeze.outputs, previews: freeze.previews,
  sourceCounts: freeze.sourceCounts, mathematicalGates: freeze.mathematicalGates,
  imagesOpened: freeze.imagesOpened }, null, 2))
