import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d168-n5-figures23-author')
const figures = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d168/figures')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bind = p => ({path: p, bytes: fs.statSync(p).size, sha256: hash(p)})
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const write = (p, x) => fs.writeFileSync(p, JSON.stringify(x, null, 2) + '\n', {flag: 'wx'})
const freezeInput = path.join(author, 'input-freeze.json')
assert.equal(hash(freezeInput), '0cfe565887d4f6f4bdffdca15ec681a778dd513de874048b94f88bc43c8eafa3')
const inputFreeze = read(freezeInput)
const initialBindings = read(path.join(author, 'input-binding-check.json'))
for (const expected of initialBindings.bindings) {
  assert.deepEqual(bind(expected.path), expected, 'Input changed: ' + expected.path)
}
const repaired = read(path.join(author, 'repair-usage.json'))
const sourceFirst = read(path.join(author, 'source-first-inventory.json'))
const sourceSettled = read(path.join(author, 'source-settled-inventory.json'))
const nativeContextReceiptRoot = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native')
const contextCalls = ['zh', 'en'].flatMap(locale => ['02', '03'].map(n => {
  const p = path.join(nativeContextReceiptRoot, `d168-${locale}-fig${n}-first-context`, 'receipt.json')
  const receipt = read(p)
  assert.equal(receipt.exitCode, 0)
  assert.equal(receipt.cwd, cwd)
  return bind(p)
}))
const displayEvidence = []
const currentFigures = []
const imageEvents = [
  {ordinal: 1, figure: 'fig-02', kind: 'source-original-first', path: sourceFirst.figures['fig-02'].source.path},
  {ordinal: 2, figure: 'fig-03', kind: 'source-original-first', path: sourceFirst.figures['fig-03'].source.path},
  {ordinal: 3, figure: 'fig-02', kind: 'source-enlarged-reopen', path: path.join(author, 'fig-02.source-enlarged.png')},
  {ordinal: 4, figure: 'fig-03', kind: 'source-enlarged-reopen', path: path.join(author, 'fig-03.source-enlarged.png')},
  {ordinal: 5, figure: 'fig-02', kind: 'failed-current-render-diagnosis', path: path.join(figures, 'fig-02/candidate-01/fig-02.preview.png')},
  {ordinal: 6, figure: 'fig-03', kind: 'failed-current-render-diagnosis', path: path.join(figures, 'fig-03/candidate-01/fig-03.preview.png')},
  {ordinal: 7, figure: 'fig-02', kind: 'selected-current-output-640px', path: path.join(author, 'fig-02.current-640.png')},
  {ordinal: 8, figure: 'fig-03', kind: 'selected-current-output-640px', path: path.join(author, 'fig-03.current-640.png')}
].map(event => ({...event, tool: 'functions.view_image', image: bind(event.path)}))
const imageLedger = {
  role: 'author-only', totalActualImageOpens: imageEvents.length, maximumBatchImageOpens: 8,
  maximumContextImageOpens: 24, currentContextImageOpens: 8, parentImageOpens: 0,
  perFigure: {'fig-02': 4, 'fig-03': 4}, events: imageEvents,
  imagePayloadsReturnedToParent: false, furtherImageOpensAllowed: false
}
assert.equal(imageLedger.totalActualImageOpens, 8)
write(path.join(author, 'image-ledger.json'), imageLedger)

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
for (const id of ['fig-02', 'fig-03']) {
  const dir = path.join(figures, id, 'candidate-02')
  const specPath = path.join(dir, id + '.spec.json')
  const spec = read(specPath)
  const renderPath = path.join(dir, id + '.render.json')
  const render = read(renderPath)
  const svgPath = path.join(dir, id + '.svg')
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specPath))
  assert.equal(render.output.svg.sha256, hash(svgPath))
  assert.equal(path.resolve(render.output.svg.path), svgPath)
  assert.deepEqual(render.collisions, [])
  assert.ok(render.displayChecks.every(x => x.status === 'pass' && x.measuredMinPx >= 16))
  assert.deepEqual(spec.display, {purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16})
  const contextPath = path.join(author, id + '.input-context.json')
  const context = read(contextPath)
  assert.equal(spec.source.image.sha256, hash(spec.source.image.path))
  assert.equal(hash(context.sourceImage.path), spec.source.image.sha256)
  assert.deepEqual(spec.source.authoritativeText.map(x => x.text), [context.fullText.zh, context.fullText.en])
  const calls = ['01', '02'].flatMap(attempt => ['validate', 'render'].map(stage => {
    const p = path.join(author, 'receipts', `${id}-${stage}-candidate-${attempt}`, 'receipt.json')
    const r = read(p)
    assert.equal(r.cwd, cwd)
    assert.deepEqual(bind(r.input.path), r.input)
    assert.deepEqual(bind(r.stdout.path), r.stdout)
    assert.deepEqual(bind(r.stderr.path), r.stderr)
    assert.deepEqual(bind(r.tool.path), r.tool)
    for (const output of r.outputs) assert.deepEqual(bind(output.path), output)
    if (attempt === '02') assert.equal(r.exitCode, 0)
    return {stage, attempt, exitCode: r.exitCode, receipt: bind(p), input: r.input, outputs: r.outputs}
  }))
  const repair = repaired.repairs.find(x => x.figure === id)
  assert.equal(repair.TOTALRepairUsage, 1)
  assert.deepEqual(bind(repair.currentSpec.path), repair.currentSpec)
  const mapping = read(path.join(author, id + '.geometry-and-mapping.json'))
  const numericalObservations = []
  for (const ray of mapping.geometry.rays) {
    const origin = ray.origin
    const endpoint = ray.endpoint || ray.screen
    const from = ray.arrowStart
    const to = ray.arrowEnd
    assert.ok(Math.abs(cross(origin, from, endpoint)) < 1e-6)
    assert.ok(Math.abs(cross(origin, to, endpoint)) < 1e-6)
    assert.ok(dist(origin, from) < dist(origin, to))
    assert.ok(dist(origin, to) < dist(origin, endpoint))
    numericalObservations.push({ray: ray.id, radial: true, outward: true,
      endpoint: 'source-corresponding screen/film boundary', physicalLengthClaim: false})
  }
  if (id === 'fig-03') {
    const p = mapping.geometry.points
    const o = mapping.geometry.origin
    const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1,
      ((a[0] - o[0]) * (b[0] - o[0]) + (a[1] - o[1]) * (b[1] - o[1]))
      / (dist(o, a) * dist(o, b)))))
    const outerAngle = angle(p.A, p.B)
    const innerAngle = angle(p.a, p.b)
    assert.ok(Math.abs(outerAngle - innerAngle) < 1e-12)
    assert.ok(Math.abs(dist(o, p.A) / dist(o, p.a) - dist(o, p.B) / dist(o, p.b)) < 1e-12)
    assert.equal(spec.objects.filter(x => x.text === '\u03b1').length, 1)
    numericalObservations.push({
      fact: 'The two concentric arc intervals subtend the same angle and both paired rays have the same outward radial ratio.',
      commonAngleRadiansVerified: true, arcLengthRelation: 'AB = R alpha; ab = r alpha, with alpha in radians.',
      physicalValuesEncodedByDrawing: false,
      nonCalibratedDrawingRatioNotThePhysicalMagnification: true,
      radiusAndAngleNumbersIntentionallyNotPrinted: true
    })
  }
  const preview = path.join(author, id + '.current-640.png')
  displayEvidence.push({
    figure: id, nativeOutput: bind(svgPath),
    nativeRaster: bind(path.join(dir, id + '.preview.png')),
    openedNormalWidthRaster: bind(preview), cssWidthRepresented: 640,
    derivation: {cwd, command: ['sips', '-Z', '640', path.join(dir, id + '.preview.png'), '--out', preview]},
    role: 'author output inspection, not independent review or product acceptance',
    inspectedAtFinalImageOrdinal: id === 'fig-02' ? 7 : 8,
    observed: id === 'fig-02'
      ? 'All fifteen illustrative outward rays, central needle, conducting film, glass contour/rounded neck, open left pump sidearm and five translated labels are visible. No label crosses the curve or another label. No hidden joint, particle population, calibration or operating step is drawn.'
      : 'A/a and B/b lie on corresponding radial rays; both ion arrows are outward. Screen and tip arcs, R and r, one alpha sector mark, open surface texture and the two translated leader labels are visible. There is no isolated atom silhouette, particle count or measured length/angle.'
  })
  currentFigures.push({
    figure: id, candidateVerdict: 'authorready', holdReason: null,
    sourceClassification: {purpose: 'instructional', mode: 'deterministic', ambiguityAfterBoundedInspection: false},
    currentSource: bind(spec.source.image.path), actualSourceAlias: bind(context.sourceImage.path),
    currentInput: bind(contextPath), fullOriginalAndApprovedBilingualText: bind(contextPath),
    nativeContexts: context.nativeContexts, independentTextReviewReusedWithoutReplay: context.independentTextReview,
    templateBindings: inputFreeze.drafts.filter(x => x.operativeTemplate.path.includes('/figures.template.json')),
    allApprovedLessonExerciseAndFigureTemplateBindings: inputFreeze.drafts.map(x => x.operativeTemplate),
    selectedCandidate: {
      spec: bind(specPath), render: bind(renderPath), svg: bind(svgPath),
      rasterEvidenceOnly: bind(path.join(dir, id + '.preview.png'))
    },
    currentSourceInventory: {
      first: bind(path.join(author, 'source-first-inventory.json')),
      settled: bind(path.join(author, 'source-settled-inventory.json')),
      observations: sourceSettled.figures[id],
      sourceToObjectAndAssertionMappings: spec.source.inventory
    },
    validation: {status: 'pass', selectedReceipt: calls.find(x => x.stage === 'validate' && x.attempt === '02').receipt,
      directNativeCalls: 2, internallyInvokedByRenderer: 2, totalActualValidatorInvocations: 4},
    rendering: {status: 'pass', selectedReceipt: calls.find(x => x.stage === 'render' && x.attempt === '02').receipt,
      totalNativeCalls: 2, failedCalls: 1, currentCandidateRenderCalls: 1,
      collisions: render.collisions, displayChecks: render.displayChecks},
    priorCallsAndFailedOutputsRetained: calls.filter(x => x.attempt === '01'),
    repairUsage: {inherited: 0, TOTAL: 1, maximum: 1, remaining: 0, firstSpecCorrections: 1,
      firstRenderFailures: 1, evidence: bind(path.join(author, 'repair-usage.json'))},
    actualImageOpens: 4, parentImageOpens: 0,
    mathematicalObservations: numericalObservations,
    authorVisualObservations: displayEvidence.at(-1),
    independentReview: {performed: false, status: 'pending-parent-collection', nativeRecordReviewCalls: 0},
    promotionOrCourseApproval: false
  })
}
write(path.join(author, 'current-output-evidence.json'), {
  cwd, role: 'author-only', figures: displayEvidence,
  newBrowserScreenshots: 0, additionalImageOpens: 0,
  nativeProductAcceptancePerformed: false,
  displayWidthBasis: 'The immutable input contexts supply the existing product scroll media width of 640px. No product/page/text review is replayed.',
  separateDurableOutputBindingAndIndependentReviewStillRequired: true
})
const reportPath = path.join(author, 'report.json')
const report = {
  schema: 'd168/figure-author-report@1', batch: 'D168', ticket: 'STEMROBIN-181',
  book: '9p', lesson: 'phy9-c1-s1-n5', role: 'first-figure-author-only',
  cwd, createdAt: new Date().toISOString(), status: 'authorready-await-parent-collection',
  scope: ['fig-02', 'fig-03'],
  inputFreeze: bind(freezeInput), immutableInputBindingsCurrent: true,
  inheritedNativeContextCalls: 4, inheritedNativeContextCallReceipts: contextCalls,
  nativeContextCallsReplayed: 0, sourcePageOrTextReviewsReplayed: 0,
  nativeCallTotals: {directDraftValidation: 4, rendererInternalValidation: 4,
    totalValidatorInvocations: 8, rendering: 4, failedRenders: 2, currentCandidateRenders: 2,
    recordReview: 0, lessonPrepare: 0, lessonFinalize: 0, publisher: 0},
  figures: currentFigures,
  sourceFirstInventory: bind(path.join(author, 'source-first-inventory.json')),
  sourceSettledInventory: bind(path.join(author, 'source-settled-inventory.json')),
  imageLedger: {...imageLedger, binding: bind(path.join(author, 'image-ledger.json'))},
  currentOutputEvidence: bind(path.join(author, 'current-output-evidence.json')),
  repairUsageEvidence: bind(path.join(author, 'repair-usage.json')),
  nativeToolBindings: [
    bind(path.join(cwd, '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json')),
    bind(path.join(cwd, '.agents/skills/ld-s10y-image/scripts/validate_spec.py')),
    bind(path.join(cwd, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')),
    bind(path.join(cwd, '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs')),
    bind(path.join(cwd, '.agents/skills/node_modules/jsxgraph/package.json')),
    bind(path.join(cwd, '.agents/skills/node_modules/jsxgraph/distrib/jsxgraphcore.js'))
  ],
  authorScriptBindings: ['author-specs.mjs', 'run-native.mjs', 'repair-labels-once.mjs', 'write-author-delivery.mjs'].map(p => bind(path.join(author, p))),
  sharedRootOrWorkCarrierChangedOrChmodded: false, existingInputFreezeOrContextsChangedOrChmodded: false,
  generatedSvgHandEdited: false, nativeReceiptsOverwritten: false,
  modelApiCalls: 0, paidCalls: 0, paidArtFallback: false, databaseWrites: 0,
  productOrCourseApproval: false, independentFigureApproval: false, peerMessages: 0,
  gitOperations: 0, commitPushDeployMergeClosure: false,
  otherScopesTouched: false,
  dependentStagesPending: [
    'Parent collection and independent figure assessment.',
    'Any authorized durable output/metadata rebinding and affected lesson offline/product gate.',
    'Publication, course/product approval and closure belong to the parent and were not performed.'
  ]
}
write(reportPath, report)

const existingAuthorFiles = new Set([
  'input-freeze.json', 'fig-02.input-context.json', 'fig-03.input-context.json', 'dispatch-record.json'
])
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}
const authorOutputs = walk(author).filter(p => {
  const relative = path.relative(author, p)
  return !relative.startsWith('contexts' + path.sep) && !existingAuthorFiles.has(relative) &&
    !relative.endsWith('.mjs') && relative !== 'author-freeze.json'
})
const candidateOutputs = ['fig-02', 'fig-03'].flatMap(id => walk(path.join(figures, id)))
const snapshots = [...authorOutputs, ...candidateOutputs].sort().map(bind)
for (const snapshot of snapshots) {
  assert.ok(snapshot.path.startsWith(author + path.sep) || snapshot.path.startsWith(figures + path.sep))
  assert.ok(!snapshot.path.includes('/contexts/'))
  assert.ok(!existingAuthorFiles.has(path.relative(author, snapshot.path)))
}
const freezePath = path.join(author, 'author-freeze.json')
write(freezePath, {
  schema: 'd168/figure-author-freeze@1', role: 'author-only', batch: 'D168',
  ticket: 'STEMROBIN-181', cwd, createdAt: new Date().toISOString(),
  report: bind(reportPath),
  inputFreezeReferenceOnly: bind(freezeInput),
  selectedCandidates: currentFigures.map(x => ({figure: x.figure, verdict: x.candidateVerdict,
    spec: x.selectedCandidate.spec, render: x.selectedCandidate.render, svg: x.selectedCandidate.svg,
    actualImageOpens: x.actualImageOpens, TOTALRepairUsage: x.repairUsage.TOTAL})),
  newlyCreatedOutputSnapshots: snapshots,
  freezeMethod: 'SHA-256/byte-size manifest plus read-only permissions on only newly created output/evidence snapshots and this new freeze file.',
  inputsAndTemplatesReferenceOnlyNeverChmod: initialBindings.bindings,
  newOutputSnapshotCount: snapshots.length,
  originalContextAndInputFilesExcludedFromReadOnlyOperations: true,
  sharedCarrierExcludedFromReadOnlyOperations: true,
  totalActualImageOpens: 8, parentImageOpens: 0,
  TOTALRepairsPerFigure: {'fig-02': 1, 'fig-03': 1},
  independentReviewOrApproval: false,
  awaiting: 'parent collection and closure'
})
for (const snapshot of snapshots) fs.chmodSync(snapshot.path, 0o444)
fs.chmodSync(freezePath, 0o444)
console.log(JSON.stringify({
  report: bind(reportPath), freeze: bind(freezePath),
  candidates: currentFigures.map(x => ({figure: x.figure, verdict: x.candidateVerdict,
    selected: x.selectedCandidate, imageOpens: x.actualImageOpens, TOTALRepairs: x.repairUsage.TOTAL})),
  totalActualImageOpens: 8, parentImageOpens: 0, status: 'awaiting parent collection/closure'
}, null, 2))
