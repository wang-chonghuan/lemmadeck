import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const E = path.dirname(fileURLToPath(import.meta.url))
const T = path.dirname(E)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: sha(file) })
const auditFile = path.join(E, 'mechanical-audit.json')
const observationsFile = path.join(E, 'visual-observations.json')
const gateFile = path.join(E, 'fig-302.review.json')
const audit = read(auditFile)
const visual = read(observationsFile)
const gate = read(gateFile)
assert.equal(audit.status, 'pass')
assert.equal(gate.schema, 'ld-s10y-image/review@1')
assert.equal(gate.status, 'pass')
assert.equal(gate.figure, 'fig-302')
assert.equal(visual.imageCount, 3)
assert.equal(visual.wholeCardApproved, false)
assert.equal(sha(observationsFile), audit.visualObservations.sha256)
for (const record of [...audit.inputManifests, ...audit.bindings]) {
  assert(path.isAbsolute(record.path))
  assert.equal(sha(record.path), record.sha256, `Changed input: ${record.path}`)
}
for (const record of [gate.source, gate.spec, gate.render, ...Object.values(gate.outputs)]) {
  assert(path.isAbsolute(record.path))
  assert.equal(sha(record.path), record.sha256, `Stale gate: ${record.path}`)
}
for (const name of ['source', 'spec', 'render']) assert.deepEqual(gate[name], audit[name])
assert.deepEqual(gate.outputs.svg, audit.svg)
const reportFile = path.join(T, 'd042-9p-fig302-independent-review.json')
assert(!fs.existsSync(reportFile), `Retain prior independent report: ${reportFile}`)
const report = {
  schema: 'ld-s10y-image/independent-figure-review@1',
  ticket: 'STEMROBIN-181',
  card: 'phy9-c2-s7-n134',
  figure: 'fig-302',
  reviewedAt: new Date().toISOString(),
  reviewRole: 'Independent fresh image context, original pixels plus frozen candidate actual display',
  status: 'PASS-FIGURE-ONLY',
  effectiveFIG: 'PASS',
  mathematicalStatus: 'pass',
  sourceFidelityStatus: 'pass',
  culturalStatus: 'pass',
  readabilityStatus: 'pass',
  scope: 'Independent fig-302 hysteresis graph only. Current repaired bilingual text and affected SCI/ZHEN pass consumed as context; no repeated scientific/source-page review, native geometry rerender, whole-card display, app acceptance, canonical promotion or publication.',
  consumedInputs: {
    authorGraphFreeze: audit.inputManifests[0],
    currentTextRepairFreeze: audit.inputManifests[1],
    affectedScienceBilingualReview: audit.inputManifests[2],
    effectiveSCI: 'PASS',
    effectiveZHEN: 'PASS',
    existingScienceReviewRepeated: false,
  },
  currentFigureBindings: {
    source: audit.source,
    spec: audit.spec,
    render: audit.render,
    svg: audit.svg,
  },
  independentSourceCounts: visual.independentSourceCounts,
  independentSourceInventory: visual.independentSourceInventory,
  modernRegularization: visual.modernRegularization,
  mathematicalReview: visual.mathematicalReview,
  culturalReview: visual.culturalReview,
  readabilityReview: visual.readabilityReview,
  independentMechanicalChecks: {
    evidence: bind(auditFile),
    checkedPathShaBindings: audit.checkedPathShaBindings,
    frozenInputManifestsMatchExactRequestedHashes: true,
    allBindingsRecheckedAtFinalization: true,
    bindingFailures: [],
    currentSourcePathAbsoluteAndExactCanonical9p: true,
    nativeSpecValidation: 'pass',
    nativeRenderStatus: 'pass',
    nativeRenderChecksCoverEveryDeclaredWidth: true,
    declaredWidths: [316, 640],
    actualWidths: audit.actualDisplayMeasurements,
    completeCurrentBilingualAuthoritativeTextBinding: true,
    authoritativeTextBlocks: audit.authoritativeTextBlocks,
    allObjectAndAssertionReferencesResolve: true,
    allSourceNamedPointsCoveredByInGroupExecutableRelationships: true,
    allSemanticEdgesAndArrowsHaveConnects: true,
    semanticEdgeCount: audit.semanticEdgeCount,
    branchChecks: audit.branchChecks,
    arrowDirections: audit.arrows,
    exactIdealCentralSymmetryDefiningVertices: audit.loopDefiningVertices,
    exactIdealCentralSymmetryPairs: audit.completeSymmetryPairCount,
    nativeSvgTextRuns: audit.nativeTextRunCount,
    nativeRenderObjectCountIsNotSourceCountEvidence: true,
    svgTextParsedWithStructuredXmlParser: true,
    actualGlyphPresenceAndReadabilityVisuallyInspected: true,
    everyDisplayedFontAtLeast16pxAfterScreenTransform: true,
    inlineLayoutAppropriateNoScrollNeeded: true,
    sourceNumericTicksOrGrid: 'absent; no gridDimensions needed',
    geometryRerenders: 0,
  },
  nativeGate: {
    ...bind(gateFile),
    schema: gate.schema,
    status: gate.status,
    recorder: '/Users/yong/.codex/worktrees/00b1/lemmadeck/.agents/skills/ld-s10y-image/scripts/record_review.py',
    recordedNatively: true,
    recorderCwd: path.join(T, 'd042-9p-fig302-author/graph/frozen'),
    ownedGateOnlyPathNormalization: {
      fields: ['spec.path', 'render.path', 'outputs.svg.path'],
      reason: 'Native producer uses same-directory relative names. Resolve them to the current frozen directory, not the independent gate directory or repo root.',
      allGateReferencesAbsoluteAndCurrent: true,
      sourceAlreadyAbsoluteUnchanged: true,
      hashesStatusAndProducerFilesUnchanged: true,
    },
  },
  evidence: [
    bind(observationsFile), bind(auditFile),
    bind(path.join(E, 'audit.mjs')), bind(path.join(E, 'finalize.mjs')),
    ...visual.imageLedger.map(image => bind(image.path)),
  ],
  imageLedger: visual.imageLedger,
  imageCount: 3,
  imageLimit: 8,
  sourcePngOpens: 1,
  candidateActualWidthImageOpens: 2,
  sourcePageOpens: 0,
  reopens: 0,
  crops: 0,
  findings: [],
  recommendations: [],
  executionBoundaries: {
    onlyOwnedReportAndEvidenceWritten: true,
    authorOrCanonicalInputsEdited: false,
    nativeGeometryRerenders: 0,
    repeatedSCIReview: false,
    sourcePageReviewRepeated: false,
    setupUpdateGrill: false,
    gitOperations: 0,
    backendOperations: 0,
    appOperations: 0,
    browserLaunches: 0,
    dependencyEdits: 0,
    charterEdits: 0,
    databaseOperations: 0,
    externalMessages: 0,
    repairs: 0,
  },
  approval: {
    figureOnlyIndependentNativeVisualGate: 'pass',
    wholeCardDisplay: 'pending',
    offlineLessonRender: 'pending',
    fullCardApproved: false,
    appOrProductDisplayApproved: false,
    canonicalPromotionPerformed: false,
    publicationReleased: false,
  },
  reportHashPolicy: 'Final byte SHA-256 is returned externally; no self-referential report hash.',
}
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  status: report.status,
  report: bind(reportFile),
  gate: bind(gateFile),
  imageCount: report.imageCount,
  wholeCardDisplay: 'pending',
}, null, 2))
