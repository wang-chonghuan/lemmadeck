import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const work = path.join(root, '.tmp/STEMROBIN-181/d1816-d333')
const evidence = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d333-fig277-first-author')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const frozenAtUtc = new Date().toISOString()
const specPath = path.join(work, 'fig-277.spec.json')
const firstPath = path.join(work, 'attempt-1/fig-277.spec.json')
const correctedPath = path.join(work, 'attempt-1-technical-recovery/fig-277.spec.json')
const finalSnapshot = path.join(work, 'attempt-2/fig-277.spec.json')
const spec = read(specPath)
const first = read(firstPath)
const corrected = read(correctedPath)
const final = read(finalSnapshot)
assert.deepEqual(spec, final)
assert.equal(hash(specPath), 'bdee7015054c8bb86c8cfd05f72057c5355aa4c16233a791632192990c218857')
assert.deepEqual(first.source, spec.source)
assert.deepEqual(first.display, spec.display)
assert.deepEqual(first.canvas, spec.canvas)
const objectChanges = []
for (let index = 0; index < spec.objects.length; index += 1) {
  assert.equal(first.objects[index].id, spec.objects[index].id)
  if (JSON.stringify(first.objects[index]) !== JSON.stringify(spec.objects[index])) {
    objectChanges.push({ id: spec.objects[index].id, before: first.objects[index], after: spec.objects[index] })
  }
}
assert.deepEqual(objectChanges.map(item => item.id), ['positron-direction-tip'])
assert.deepEqual(first.objects, corrected.objects)
assert.deepEqual(corrected.assertions, spec.assertions)
assert.deepEqual(first.assertions.filter(item => item.type !== 'collinear'),
  spec.assertions.filter(item => item.type !== 'collinear'))
const syntaxChanges = first.assertions.filter(item => item.type === 'collinear').map(before => ({
  id: before.id,
  before,
  after: spec.assertions.find(item => item.id === before.id),
}))
assert.equal(syntaxChanges.length, 8)
const edges = spec.objects.filter(item => ['segment', 'arrow'].includes(item.type))
for (const edge of edges) {
  assert.equal(typeof edge.from, 'string')
  assert.equal(typeof edge.to, 'string')
  assert(spec.assertions.some(item => item.type === 'connects' && item.arrow === edge.id &&
    item.from === edge.from && item.to === edge.to))
}
const authority = read(path.join(evidence, 'authoritative-context.json'))
for (const record of authority.records) assert.equal(hash(record.template.path), record.template.sha256)
assert.equal(spec.source.authoritativeText.length, 40)
const ledger = read(path.join(evidence, 'image-open-ledger.json'))
assert.equal(ledger.opens.length, 1)
assert.equal(hash(spec.source.image.path), spec.source.image.sha256)

const nativeFiles = [
  'attempt-1-validate-spec.receipt.json',
  'attempt-1-technical-recovery-validate-spec.receipt.json',
  'attempt-2-validate-spec.receipt.json',
  'attempt-2-render-spec.receipt.json',
  'render-diagnostic.receipt.json',
]
const receipts = nativeFiles.map(name => ({
  artifact: bind(path.join(evidence, name)),
  content: read(path.join(evidence, name)),
}))
const validationReceipt = receipts[2]
const validation = JSON.parse(validationReceipt.content.stdout)
assert.equal(validation.status, 'pass')
assert.equal(receipts[3].content.exitCode, 1)
assert.equal(receipts[4].content.exitCode, 1)
const diagnostic = receipts[4].content
const jsonStart = diagnostic.stderr.indexOf('{"viewBox":')
assert(jsonStart >= 0)
const jsonEnd = diagnostic.stderr.indexOf('\n    at materializeArrowheads', jsonStart)
const markerValues = JSON.parse(diagnostic.stderr.slice(jsonStart, jsonEnd))
assert.deepEqual(markerValues.viewBox, [0, 0, 0, 0])
assert.equal(markerValues.width, 0)
assert.equal(markerValues.height, 0)
const outputNames = ['fig-277.svg', 'fig-277.render.json', 'fig-277.native-screen.png', 'fig-277.preview.png']
const absentOutputs = ['attempt-1', 'attempt-1-technical-recovery', 'attempt-2', 'render-diagnostic']
  .flatMap(directory => outputNames.map(name => path.join(work, directory, name)))
for (const output of absentOutputs) assert(!fs.existsSync(output), `Unexpected output ${output}`)
assert(!fs.existsSync(path.join(evidence, 'render-recovery.receipt.json')))
assert(!fs.existsSync(path.join(evidence, 'marker-recovery-hook.mjs')))

const usage = {
  authorBuilds: 1,
  contentAttempts: 2,
  contentRepairsUsed: 1,
  contentRepairsRemaining: 0,
  technicalAssertionEncodingCorrections: 1,
  standaloneNativeValidateSpecCalls: 3,
  embeddedNativeValidateSpecCalls: 2,
  totalNativeValidateSpecCalls: 5,
  standaloneValidationResults: ['fail-field-contract', 'fail-positron-collinearity', 'pass'],
  embeddedValidationEvidence: 'Both renderer calls reached page.evaluate after native validateSpec(), so their embedded draft validations completed; no extra standalone invocation was made.',
  unmodifiedNativeRenderSpecCalls: 1,
  diagnosticNativeRenderSpecCalls: 1,
  totalRenderSpecCalls: 2,
  rendererRecoveryCalls: 0,
  actualRenderMetadataFiles: 0,
  resvgCalls: 0,
  previewFiles: 0,
  imagesOpened: 1,
  sourceImagesOpened: 1,
  candidateImagesOpened: 0,
  imageReopens: 0,
  maximumImageOpens: 8,
  paidCalls: 0,
  nestedDelegations: 0,
  chatOperations: 0,
  independentReviewPasses: 0,
  promotions: 0,
  originalTasksAdded: 0,
  addedTasks: 0,
  sourcePagesAdded: 0,
  sourceFiguresAdded: 0,
  completeCoursesAdded: 0,
  databaseWrites: 0,
  canonicalEdits: 0,
  meterEdits: 0,
  templateEdits: 0,
  repositoryRendererCodeEdits: 0,
  gitOperations: 0,
  publishOperations: 0,
  deployOperations: 0,
  mergeOperations: 0,
  closureOperations: 0,
  renderingRetriesAfterLatestUserInstruction: 0,
}
const inputArtifacts = {
  source: bind(spec.source.image.path),
  D330AuthorFreeze: bind(path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d330-n149-first-preparation/author-freeze.json')),
  D320TextOnlyInventory: bind(path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d320-raw277-first-review/original-fine-inventory.json')),
  templates: authority.records.map(record => ({ locale: record.locale, ...bind(record.template.path) })),
}
const authorArtifacts = fs.readdirSync(evidence).filter(name => name !== 'report.json' && name !== 'author-freeze.json')
  .sort().map(name => bind(path.join(evidence, name)))
const currentSpec = bind(specPath)
const report = {
  schema: 'STEMROBIN-181/fig277-first-author-report@1',
  stage: 'D333',
  ticket: 'STEMROBIN-181',
  cwd: root,
  frozenAtUtc,
  status: 'AUTHOR_SPEC_FROZEN_RENDERER_BLOCKED_PARENT_OWNS_RECOVERY',
  latestInstruction: 'Stop further rendering/diagnostic retries; preserve exact current source/spec/content repair usage; parent owns renderer-only recovery.',
  scope: 'First FIG277 author output only. No independent review, promotion or completion claim.',
  writeRoots: [work, evidence],
  inputs: inputArtifacts,
  ownSourceInventory: bind(path.join(evidence, 'source-pixel-inventory.json')),
  ownInventoryOrdering: 'Original PNG opened once; full source inventory frozen before D320 text-only inventory, specs or candidate evidence.',
  authoritativeContext: bind(path.join(evidence, 'authoritative-context.json')),
  authorityCompleteness: {
    locales: ['zh', 'en'],
    stableLessonIdentifiers: true,
    completeNonemptyCurrentTextsIncluded: true,
    entries: 40,
    emptyFigurePlacementPreservedInContext: true,
    rawSourceTextOrAnswersUsedAsModernAuthority: false,
  },
  spec: currentSpec,
  specSnapshots: [bind(firstPath), bind(correctedPath), bind(finalSnapshot)],
  validation: { status: validation.status, receipt: validationReceipt.artifact },
  rendering: {
    status: 'technical-failure-no-output',
    failedNativeCall: receipts[3].artifact,
    existingDiagnosticCall: receipts[4].artifact,
    blocker: 'Unsupported arrow marker aspect ratio: ld-fig-277_ld-positron-arrowTriangleEnd1',
    marker: {
      id: 'ld-fig-277_ld-positron-arrowTriangleEnd1',
      viewBox: markerValues.viewBox,
      markerWidth: markerValues.width,
      markerHeight: markerValues.height,
      lineId: markerValues.lineId,
      strokeWidth: markerValues.stroke,
      markerXML: markerValues.marker,
      lineXML: markerValues.line,
      evidence: receipts[4].artifact,
      interpretation: 'Actual DOM has zero marker viewBox and zero marker dimensions, not merely unequal positive aspect ratios. Diagnosis captured before latest stop instruction; no recovery or new diagnostic authorized here.',
    },
    svg: null,
    nativeRenderMetadata: null,
    nativeScreenshot: null,
    resvgPreview: null,
    absentOutputPaths: absentOutputs,
    collisionStatus: 'Not returned: materialization error occurred before report generation. No collision/visual pass claimed.',
  },
  sourceConstruction: {
    neutronLandmarksIncludingAAndC: 19,
    neutronInteriorElbows: 17,
    neutronInternalArrowheads: 5,
    neutronSelfCrossings: 2,
    neutronLowerBGammaCrossing: 1,
    BGammaWaves: 2,
    CGammaWaves: 3,
    sourcePresentLabels: 11,
    allSemanticEdgesHaveStableEndpointIDsAndConnects: true,
    meaningfulEdges: edges.length,
    CMark: 'Paper/light-centered open loop, no distinct filled nucleus; tiny joins stay qualified.',
    sourceAndRegularizationSeparated: true,
    holds: ['O384-GLYPH-V', 'O384-GLYPH-ABC-E', 'O277-C-SUBPIXEL-JOIN'],
    barredNuPolicy: 'Greek nu plus overbar chosen from complete modern ZH/EN text; original Greek-versus-Latin codepoint identity remains HOLD.',
    display: spec.display,
    initialConstructionMap: {
      ...bind(path.join(evidence, 'construction-map.json')),
      qualification: 'Immutable initial construction map binds first spec; final spec is separately bound with exact affected-only deltas below.',
    },
  },
  preservedChanges: {
    technicalEncoding: syntaxChanges,
    contentRepair: objectChanges,
    technicalReceipt: bind(path.join(evidence, 'technical-recovery.json')),
    contentRepairReceipt: bind(path.join(evidence, 'content-repair.json')),
    noFurtherContentRepairAvailable: true,
  },
  imageLedger: bind(path.join(evidence, 'image-open-ledger.json')),
  authorVisualInspection: 'Source only. No candidate existed; no screenshot or preview inspection, independent visual review or approval was possible.',
  nativeReceipts: receipts.map(item => item.artifact),
  rendererCode: {
    nativeRenderer: bind(path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs')),
    nativeMaterializer: bind(path.join(root, '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs')),
    repositoryCodeEdited: false,
    diagnosticHook: bind(path.join(evidence, 'marker-diagnostic-hook.mjs')),
    diagnosticQualification: 'Scoped in-memory error-message instrumentation only; native source files were not modified. No marker recovery hook was authored or executed.',
    unusedRecoveryDriver: {
      ...bind(path.join(evidence, 'render-recovery.mjs')),
      recoveryModeExecuted: false,
    },
  },
  allAuthorEvidenceBeforeReport: authorArtifacts,
  usage,
  approvals: {
    sourceText: false,
    sourceScriptIdentity: false,
    modernFigure: false,
    independentReview: false,
    promotion: false,
    fullLessonDisplay: false,
    completeCourse: false,
  },
  parentHandoff: 'Current draft source.image is the actual absolute D330 working PNG. Parent owns any renderer-only technical recovery and rebases paths only after approval. Preserve first failure, syntax correction, single positron endpoint content repair, all source/text HOLDs and actual usage; this author authorizes no new geometry/content repairs.',
}
const reportPath = path.join(evidence, 'report.json')
writeNew(reportPath, report)
const freezeOutput = {
  schema: 'STEMROBIN-181/fig277-first-author-freeze@1',
  stage: 'D333',
  ticket: 'STEMROBIN-181',
  frozenAtUtc,
  status: report.status,
  source: inputArtifacts.source,
  authority: inputArtifacts.D330AuthorFreeze,
  ownInventory: report.ownSourceInventory,
  contextualInventory: inputArtifacts.D320TextOnlyInventory,
  authoritativeText: report.authoritativeContext,
  spec: currentSpec,
  specSnapshots: report.specSnapshots,
  svg: null,
  render: null,
  preview: null,
  nativeReceipts: report.nativeReceipts,
  diagnosticMarker: report.rendering.marker,
  evidence: authorArtifacts,
  report: bind(reportPath),
  usage,
  independentReview: false,
  promotion: false,
  parentOwnsRendererRecovery: true,
}
const authorFreezePath = path.join(evidence, 'author-freeze.json')
writeNew(authorFreezePath, freezeOutput)
console.log(JSON.stringify({
  status: report.status,
  spec: currentSpec,
  report: bind(reportPath),
  authorFreeze: bind(authorFreezePath),
  diagnostic: receipts[4].artifact,
  usage,
}, null, 2))
