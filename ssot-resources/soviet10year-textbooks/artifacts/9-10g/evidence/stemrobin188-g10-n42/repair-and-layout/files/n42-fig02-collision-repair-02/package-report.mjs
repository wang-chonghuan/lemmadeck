import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), root)
const out = path.dirname(new URL(import.meta.url).pathname)
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const read = name => JSON.parse(fs.readFileSync(path.join(out, name), 'utf8'))
const provenance = read('provenance.json')
for (const item of Object.values(provenance.bindings)) assert.equal(hash(item.path), item.sha256)
assert.equal(hash(provenance.beforeCopy.path), provenance.beforeCopy.sha256)
assert.equal(hash(provenance.candidate.path), provenance.candidate.sha256)
const firstFailure = JSON.parse(fs.readFileSync(provenance.bindings.firstIndependentFailure.path))
const f01 = firstFailure.figures.find(item => item.id === 'fig-g10-01')
const f02 = firstFailure.figures.find(item => item.id === 'fig-g10-02')
assert.equal(f01.status, 'PASS')
assert.equal(f02.status, 'HOLD')
assert.equal(f02.sourceFidelityExcludingCollision, 'PASS')
assert.equal(f02.spatialMathematics, 'PASS')
assert.equal(f02.findings[0].id, 'N42-F02-01')
const renderCommand = read('render.command.json')
const recoveryCommand = read('measurement-recovery.command.json')
const render = read('fig-g10-02.candidate.render.json')
const recovered = read('display-measurements.recovered.json')
assert.equal(renderCommand.exitCode, 0)
assert.equal(render.status, 'pass')
assert.equal(recoveryCommand.exitCode, 0)
assert.equal(recovered.measurements.collision.positiveFilledIntersection, false)
const outputs = {
  beforeSpec: bind(path.join(out, 'fig-g10-02.before.spec.json')),
  candidateSpec: bind(path.join(out, 'fig-g10-02.candidate.spec.json')),
  candidateSvg: bind(path.join(out, 'fig-g10-02.candidate.svg')),
  candidateRender: bind(path.join(out, 'fig-g10-02.candidate.render.json')),
  new480: bind(path.join(out, 'fig-g10-02.candidate.width-480.png')),
  new300: bind(path.join(out, 'fig-g10-02.candidate.width-300.png')),
}
assert.equal(render.spec.sha256, outputs.candidateSpec.sha256)
assert.equal(render.output.svg.sha256, outputs.candidateSvg.sha256)
assert.equal(recovered.screenshot.sha256, outputs.new300.sha256)
const loads = [
  { sequence: 1, tool: 'functions.view_image', ...provenance.bindings.source, loaded: true, purpose: 'Actual original source PNG read once for bounded patch.' },
  { sequence: 2, tool: 'functions.view_image', ...outputs.new480, loaded: true, purpose: 'Actual new full 480px renderer output.' },
  { sequence: 3, tool: 'functions.view_image', path: `${root}/.intentfold/tickets/STEMROBIN-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n42-fig02-collision-repair-02/fig-g10-02.candidate.width-300.png`, loaded: false, imagePayloads: 0, reason: 'Duplicated-path typo; file not found; no image loaded.' },
  { sequence: 4, tool: 'functions.view_image', ...outputs.new300, loaded: true, purpose: 'Actually viewed fresh 300px screenshot using existing approved presentation style.' },
]
const report = {
  schema: 'n42-fig02-collision-repair-author@1',
  ticket: 'STEMROBIN-188', session: 'SAME188-6', cwd: root,
  role: 'AUTHOR-only', status: 'author-repair-complete-pending-affected-only-independent-review',
  independentReview: { performed: false, status: 'pending', approvalGranted: false, wholeReviewPass: false },
  defect: {
    id: 'N42-F02-01', originalStatus: f02.status,
    originalFinding: f02.findings[0],
    provenance: provenance.bindings.firstIndependentFailure,
    authorObservation: 'New filled k notation overarrow is clearly separated from the undirected hidden horizontal edge at 480 and 300; no remaining content defect observed in the affected region.',
    historicalFailureReclassifiedAsPass: false,
  },
  authorization: provenance.authorization,
  inheritedEvidence: {
    scope: 'Only unchanged source/math/fig01/other-label facts; not the whole independent review.',
    firstReport: provenance.bindings.firstIndependentFailure,
    figure01: { status: f01.status, sourceFidelity: f01.sourceFidelity, spatialMathematics: f01.spatialMathematics, visual480And300: f01.visual480And300, imagesLoaded: 0, contentChanges: 0, rendererCalls: 0 },
    figure02: { sourceFidelityExcludingCollision: f02.sourceFidelityExcludingCollision, spatialMathematics: f02.spatialMathematics, cultureAndNotationContent: f02.cultureAndNotationContent, otherLabels: 'Inherited PASS premise; unchanged spec text/layout and exported label nodes verified.' },
  },
  sourcePixelObservation: {
    source: provenance.bindings.source, actualOpens: 1,
    description: 'One oblique cuboid; eight unlabelled vertices, twelve edges (nine solid/three dashed hidden); dashed diagonal a; unit vectors i oblique-up-right, j left, k up from a shared front-lower-right tail; notation i,j,k,xi,yj,zk,a. Hidden horizontal edge is undirected. No printed dimensions/grid/coordinate triples/answer labels.',
    sourcePixelsChanged: false,
    kMapping: { actualSpatialArrow: 'box-k', tail: 'box-o', tip: 'box-k-unit', label: 'box-k-label', notationArrow: 'vector-mark-box-k-label', connects: 'connects-vector-mark-box-k-label' },
    inventoryUnchanged: true,
  },
  changedFields: provenance.changedFields,
  scopeVerification: provenance.scopeVerification,
  exportedSvgDelta: recovered.measurements.unchangedGeometryAndOtherLabelCheck,
  hiddenAnnotationHelpers: recovered.measurements.hiddenAnnotationHelpers,
  collisionClearance: recovered.measurements.collision,
  actualVisualObservations: {
    new480: 'Visible white gap separates k notation overarrow from hidden edge; k remains beside upward unit vector; no new mark on hidden edge.',
    new300: 'Same separation visible at fresh 300px width; k and its overarrow readable and correctly associated.',
    remainingAffectedContentDefects: [],
    scope: 'Author observation only, not independent review.',
  },
  execution: {
    rendererCalls: 1, internalDraftValidations: 1, rendererExit: 0,
    renderStatus: render.status, collisions: render.collisions, displayChecks: render.displayChecks,
    screenshotCallsOutsideRenderer: 1,
    firstMeasurementExit: read('display.command.json').exitCode,
    technicalMeasurementRecoveryExit: 0,
    recovery: recoveryCommand.technicalCause,
    recoveryContentChanges: 0, recoveryRendererCalls: 0, recoveryNewScreenshots: 0,
    invalidReceiptWarning: recovered.originalFailedMeasurement.warning,
    headed: false, liveProductAcceptancePerformed: false,
  },
  outputs,
  evidence: Object.fromEntries([
    'provenance.json', 'render.command.json', 'render.stdout.txt', 'render.stderr.txt',
    'display.command.json', 'display.stdout.txt', 'display.stderr.txt', 'display-measurements.json',
    'measurement-recovery.command.json', 'measurement-recovery.stdout.txt', 'measurement-recovery.stderr.txt',
    'display-measurements.recovered.json', 'repair.mjs', 'display-check.mjs', 'run-display.mjs',
    'recover-measurement.mjs', 'package-report.mjs',
  ].map(name => [name, bind(path.join(out, name))])),
  oldProvenance: provenance.bindings,
  imageLedger: {
    freshBatch: true, perBatchLimit: 4, perContextLimit: 24,
    priorContextImages: 0, actualImagesLoaded: 3, contextImagesAfter: 3,
    imageOpenRequests: 4, failedOpenRequestsWithoutPayload: 1,
    sourceOpens: 1, sourceReopens: 0, old480Loads: 0, figure01Loads: 0, crops: 0,
    loads,
  },
  contentRevisionCounter: { figure: 'fig-g10-02', prior: 1, newDelta: 1, cumulative: 2, reset: false, historicalExhaustedCountersPreserved: true },
  boundaries: {
    ownedDirectory: out, writeScopeOnlyOwnedDirectory: true, oldBindingsReverifiedUnchanged: true,
    sourceTextGeometryOtherLabelsFigure01Changes: 0,
    generatedSvgManualEdits: 0, paidModelServiceInstallCalls: 0,
    dbEnvBackendGitOperations: 0, promotePublishDeployOperations: 0,
    reviewApprovalOperations: 0, otherAgentContacts: 0,
  },
  nextStage: 'Parent integrates candidate and obtains affected-only independent review later; neither performed here.',
}
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
const deliverables = {
  cwd: root, status: report.status, contentRevisionCounter: report.contentRevisionCounter,
  outputs, reports: { json: bind(path.join(out, 'report.json')), md: bind(path.join(out, 'report.md')) },
}
fs.writeFileSync(path.join(out, 'deliverables.json'), `${JSON.stringify(deliverables, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(deliverables, null, 2))
