import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const out = path.join(own, 'initial')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, value) => fs.writeFileSync(path.join(own, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const preparation = read(path.join(own, 'preparation-freeze.json'))
for (const file of preparation.files) assert.equal(hash(path.join(own, file.path)), file.sha256)
for (const file of preparation.readContracts) assert.equal(hash(path.join(repo, file.path)), file.sha256)
const context = read(path.join(own, 'context.json'))
for (const file of Object.values(context.frozenBindings)) assert.equal(hash(path.join(repo, file.path)), file.sha256)
const specFile = path.join(out, 'spec.json')
const spec = read(specFile)
const renderFile = path.join(out, 'render.json')
const render = read(renderFile)
const svgFile = path.join(out, 'fig-152.svg')
const observations = read(path.join(own, 'author-observations.json'))
const previews = read(path.join(out, 'width-previews.json'))
const nativeContextCall = read(path.join(own, 'native-context-call.json'))
const nativeCalls = read(path.join(out, 'native-calls.json'))
assert.equal(nativeContextCall.status, 'pass')
assert.equal(nativeContextCall.invocationOrdinal, 1)
assert.equal(nativeCalls.status, 'pass')
assert.equal(read(path.join(out, 'draft-validation.json')).status, 'pass')
assert.equal(read(path.join(out, 'rendered-validation.json')).status, 'pass')
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specFile))
assert.equal(render.output.svg.sha256, hash(svgFile))
assert.equal(previews.status, 'pass')
assert.equal(observations.status, 'pass')
assert.equal(observations.targetedRepairCount, 0)
assert.equal(observations.contextImageLoads, 4)
assert.deepEqual(spec.source.authoritativeText, context.lessons[0].authoritativeText)
assert.ok(spec.objects.length <= preparation.geometryPlan.maxDeclaredObjectsIncludingHiddenNodes)
assert.ok(!spec.objects.some(object => object.text || object.label))
assert.equal(spec.source.image.sha256, preparation.source.sha256Before)
assert.equal(hash(path.join(repo, spec.source.image.path)), spec.source.image.sha256)
for (const preview of observations.currentPreviewLoads) {
  assert.equal(hash(path.join(repo, preview.path)), preview.sha256)
  const check = previews.checks.find(item => item.widthPx === preview.widthPx)
  assert.equal(check.preview.sha256, preview.sha256)
  assert.equal(check.status, 'pass')
}
const geometry = read(path.join(out, 'geometry.json'))
const objectMap = new Map(spec.objects.map(object => [object.id, object]))
const points = new Map(spec.objects.filter(object => object.type === 'point').map(object => [object.id, object.at]))
const resolve = value => typeof value === 'string' ? points.get(value) : value
const rim = objectMap.get('instrument-face-rim')
const fineObjects = spec.objects.filter(object => object.type === 'segment' && (
  object.id.startsWith('instrument-upper-fine-') ||
  object.id.startsWith('instrument-lower-short-') ||
  object.id.startsWith('instrument-lower-right-fine-') ||
  object.id === 'instrument-lower-oblique-mark'
))
for (const object of fineObjects) {
  for (const value of [object.from, object.to]) {
    const p = resolve(value)
    assert.ok(Math.hypot(p[0] - rim.center[0], p[1] - rim.center[1]) < rim.radius, `${object.id} outside face`)
  }
}
write('author-checks.json', {
  schema: 'ld-s10y-image/author-checks@1', status: 'pass',
  scope: 'Final author byte/graph/containment binding checks; not independent review.',
  frozenAuthorityAndPreparationUnchanged: true,
  completeFrozenParagraphBlocks: spec.source.authoritativeText.length,
  allInstrumentFineEndpointsInsideRim: true,
  actualLeadNodeContinuity: previews.actualLeadNodeContinuity,
  nativeDraftRenderedAndRenderStatus: 'pass',
  exactPreviewHashesAtWidths: observations.currentPreviewLoads.map(item => ({ widthPx: item.widthPx, sha256: item.sha256 })),
  sourceScaleCount: null, numericReadings: [], labels: [],
})
const freeze = {
  schema: 'ld-s10y-image/author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D020', lesson: 'phy9-c2-s2-n81', figure: 'fig-152',
  stage: 'figure-author', status: 'pass',
  role: 'source-inventory and deterministic figure author',
  scope: 'Native author validation/render and actual 640/331/342 preview inspection. Not an independent modern gate, ld-s10y-image/review@1, approval, promotion or lesson finalization.',
  ownedRoot: own,
  bindings: {
    source: context.frozenBindings.source,
    sourceInventory: bind(path.join(own, 'source-inventory.json')),
    preparationFreeze: bind(path.join(own, 'preparation-freeze.json')),
    preparationImageLedger: bind(path.join(own, 'one-image-ledger.json')),
    lesson: context.frozenBindings.lesson,
    proseAuthorFreeze: context.frozenBindings.proseFreeze,
    independentScience: context.frozenBindings.science,
    exercises: context.frozenBindings.exercises,
    nativeContext: bind(path.join(own, 'context.native.json')),
    currentFullTextContext: bind(path.join(own, 'context.json')),
    authorityBindings: bind(path.join(own, 'authority-bindings.json')),
    spec: bind(specFile),
    geometry: bind(path.join(out, 'geometry.json')),
    draftValidation: bind(path.join(out, 'draft-validation.json')),
    renderedValidation: bind(path.join(out, 'rendered-validation.json')),
    render: bind(renderFile),
    svg: bind(svgFile),
    previewEvidence: bind(path.join(out, 'width-previews.json')),
    authorObservations: bind(path.join(own, 'author-observations.json')),
    authorChecks: bind(path.join(own, 'author-checks.json')),
    contextCallStart: bind(path.join(own, 'native-context-call-start.json')),
    nativeContextCall: bind(path.join(own, 'native-context-call.json')),
    nativeAuthorCalls: bind(path.join(out, 'native-calls.json')),
    contextAuthorScript: bind(path.join(own, 'build-author-context.mjs')),
    figureAuthorScript: bind(path.join(own, 'author.mjs')),
    nativeRunScript: bind(path.join(own, 'native-author-run.mjs')),
    widthPreviewScript: bind(path.join(own, 'width-previews.mjs')),
    freezeScript: bind(path.join(own, 'freeze-author.mjs')),
  },
  currentPreviews: observations.currentPreviewLoads.map(item => ({
    widthPx: item.widthPx, path: item.path, sha256: item.sha256,
    actualImageLoads: item.loads, authorInspectionStatus: item.status,
  })),
  nativeCalls: {
    contextBuilderInvocations: 1,
    contextBuilder: nativeContextCall,
    authorValidationAndRender: nativeCalls.calls,
    rendererInternalDraftValidationInvocations: 1,
    previewCaptureInvocations: 1,
    noRecordReviewInvocation: true,
  },
  sourceInventoryMaps: spec.source.inventory,
  sourceLabelAbsenceMap: geometry.labelAbsence,
  sourceInventoryMappingDecision: geometry.mappingDecision,
  modernRegularization: geometry.modernRegularization,
  geometrySummary: { declaredObjects: spec.objects.length, assertions: spec.assertions.length, sourceScaleCount: null, numericalReadings: [], labels: [] },
  initialAttempt: {
    status: 'pass',
    spec: bind(specFile), render: bind(renderFile), svg: bind(svgFile),
    previewEvidence: bind(path.join(out, 'width-previews.json')),
  },
  initialFailures: [],
  repairCount: 0,
  repairLimit: 1,
  replacementPreviews: [],
  imageLedger: {
    sameContext: true, originalLoads: 1, originalReopens: 0,
    initialPreviewLoads: 3, replacementPreviewLoads: 0,
    contextTotal: 4, contextMaximum: 7, unusedRepairImageAllowance: 3,
    currentPreviewObservations: observations.currentPreviewLoads,
  },
  sourcePreservation: { beforeSha256: preparation.source.sha256Before, currentSha256: hash(path.join(repo, spec.source.image.path)), unchanged: true },
  sharedContractsUnchanged: preparation.readContracts,
  remainingAuthorIssues: [],
  independentModernGateRequired: true,
  nextStage: 'Fresh agent inspects these exact frozen artifacts. Author pass is not modern approval.',
  noSharedRendererContractPromotionRecordReviewTemplateIndexDBGitWrites: true,
}
write('author-freeze.json', freeze)
console.log(JSON.stringify({ status: 'pass', freeze: bind(path.join(own, 'author-freeze.json')), currentSpec: bind(specFile), currentSvg: bind(svgFile), repairCount: 0, contextImages: 4, remainingAuthorIssues: [] }, null, 2))
