import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d831-n86-fig200-first-author')
assert.equal(process.cwd(), R)
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const binding = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const write = (p, value) => {
  assert.ok(p.startsWith(`${D}/`))
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
}
let checkedInputBindings = 0
function verifyBindings(value) {
  if (value && typeof value === 'object') {
    if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
      assert.equal(hash(value.path), value.sha256, `Changed input: ${value.path}`)
      checkedInputBindings++
    }
    for (const entry of Object.values(value)) verifyBindings(entry)
  }
}
const inputs = read(path.join(D, 'inputs.json'))
verifyBindings(inputs)
const contexts = read(path.join(D, 'context-bindings.json'))
verifyBindings(contexts)
const specPath = path.join(D, 'frozen/fig-200.spec.json')
const svgPath = path.join(D, 'frozen/fig-200.svg')
const renderPath = path.join(D, 'frozen/fig-200.render.json')
const spec = read(specPath)
const render = read(renderPath)
const display = read(path.join(D, 'display-verification.json'))
const observations = read(path.join(D, 'author-observations.json'))
assert.equal(render.status, 'pass')
assert.equal(render.spec.sha256, hash(specPath))
assert.equal(render.output.svg.sha256, hash(svgPath))
assert.equal(display.status, 'pass')
verifyBindings(display)
assert.equal(spec.source.image.sha256, inputs.originalPng.sha256)
assert.equal(observations.imageLoads.length, 4)
assert.equal(observations.plateV.id, 'plateV')
assert.equal(observations.plateV.pixelsOpened, false)
assert.equal(fs.existsSync(path.join(D, 'frozen/fig-200.review.json')), false)
const firstSpec = read(path.join(D, 'attempts/revision-0/fig-200.spec.json'))
const firstRenderSpec = read(path.join(D, 'attempts/revision-1-first-render/fig-200.spec.json'))
const expectedFirstRepair = structuredClone(firstSpec)
expectedFirstRepair.display.widths = [331, 342, 640]
assert.deepEqual(firstRenderSpec, expectedFirstRepair)
const expectedFinal = structuredClone(firstRenderSpec)
expectedFinal.objects.find(o => o.id === 'raw200-oblique-R').at = [-2.6, 5.3]
expectedFinal.objects.find(o => o.id === 'raw200-gap-k-subscript').at = [-6.14, 0.54]
assert.deepEqual(spec, expectedFinal)
const geometry = read(path.join(D, 'geometry-basis.json'))
assert.ok(Math.abs(geometry.exactRelations.pythagoreanResidual) < 1e-9)
assert.ok(Math.abs(geometry.exactRelations.expandedResidual) < 1e-9)
assert.equal(fs.readdirSync(path.join(D, 'runtime-tmp')).length, 0)

const calls = fs.readdirSync(path.join(D, 'calls')).filter(p => p.endsWith('.json')).map(p => read(path.join(D, 'calls', p)))
const nativeCalls = calls.filter(c => c.schema === 'd831/native-call@1')
assert.equal(nativeCalls.length, 7)
assert.equal(nativeCalls.filter(c => c.exitCode !== 0).length, 2)
const report = {
  schema: 'd831/fig200-first-author-freeze@1',
  ticket: 'STEMROBIN-181', child: 'STEMROBIN-181-3', card: 'phy10-c2-s3-n86', figure: 'fig-200',
  status: 'PASS-AUTHOR-NATIVE-ONLY-INDEPENDENT-REVIEW-PENDING',
  root: R, authorizedWriteRoot: D,
  mode: 'deterministic', displayPurpose: 'instructional',
  finalOutputs: {
    spec: binding(specPath), svg: binding(svgPath), render: binding(renderPath),
    native640Raster: binding(path.join(D, 'previews/fig-200-native-640.png')),
    displayRasters: display.outputs.map(o => ({ width: o.width, ...binding(o.screenshot.path), minTextPx: o.measured.minMeasuredTextPx })),
  },
  sourceInventory: binding(path.join(D, 'source-inventory.json')),
  sourceInventoryFacts: observations.observations,
  sourceLabels: ['R', 'R', 'r_k', 'h_k'], sourceNumericValues: [],
  sourceInventoryIndependentOfPreviousModernArtifacts: true,
  context: binding(path.join(D, 'context-bindings.json')),
  nativeContexts: contexts.contexts,
  contextSourceHashes: inputs,
  completeApprovedBilingualTextBound: true,
  scratchProjection: 'Byte-identical writable approved draft copies used by existing build_context; source PNG symlinks were never chmodded or written. Projection is not finalization.',
  native: {
    specValidation: 'PASS-DRAFT', render: 'PASS', renderer: render.renderer,
    assertions: spec.assertions.length, objects: spec.objects.length,
    visibleTextNodes: render.labels, sourceMathematicalLabelGroups: 4,
    collisions: render.collisions, displayChecks: render.displayChecks,
    finalValidationReceipt: binding(path.join(D, 'calls/validate-spec-revision-2.json')),
    finalRenderReceipt: binding(path.join(D, 'calls/render-revision-2.json')),
    lessonFinalization: 'NOT-RUN-NOT-AUTHORIZED',
    wholeLessonNativeAcceptance: 'NOT-CLEARED',
  },
  authorOfflineDisplay: {
    status: 'PASS-AUTHOR-OFFLINE-ONLY',
    verification: binding(path.join(D, 'display-verification.json')),
    observations: binding(path.join(D, 'author-observations.json')),
    requestedWidths: [342, 640], requiredExtraWidth: 331,
    nonblankNonblackUnclipped: true, separateKSubscriptsIncludedInMinimumTextCheck: true,
    headedProductOrWholeLessonDisplayAcceptance: 'NOT-CLEARED',
  },
  mathematicalConservation: {
    exactPythagoreanResidual: geometry.exactRelations.pythagoreanResidual,
    exactExpandedResidual: geometry.exactRelations.expandedResidual,
    equalityOfBothRadii: 'EXECUTABLE-equalDistance',
    circleMembership: 'EXECUTABLE-pointOnCircle-AT-SAMPLE-CONTACT-AND-ENDPOINTS',
    rightTriangleAndPlateTangency: 'EXECUTABLE-perpendicular',
    sharedAxisAndHeight: 'EXECUTABLE-collinear-equalDistance-parallel',
    verticalTriangleLeg: 'R-h_k; full vertical radius remains R',
    trueCenterContact: true, thinGapRatio: geometry.exactRelations.thinGapRatio,
    coordinatesAreIllustrativeNotSourceGivenNumbers: true,
    visibleNumericAnswerAnnotations: 0, answerKeyUsed: false,
  },
  preservation: {
    firstExplorationFailure: binding(path.join(D, 'FIRST-exploration-failure.json')),
    firstNativeFailure: binding(path.join(D, 'FIRST-native-failure.json')),
    firstRenderFailure: binding(path.join(D, 'FIRST-render-failure.json')),
    firstFailedDraft: binding(path.join(D, 'attempts/revision-0/fig-200.spec.json')),
    firstFailedRenderSpec: binding(path.join(D, 'attempts/revision-1-first-render/fig-200.spec.json')),
    firstFailedSvg: binding(path.join(D, 'attempts/revision-1-first-render/fig-200.svg')),
    firstFailedRaster: binding(path.join(D, 'attempts/revision-1-first-render/fig-200-native-640.png')),
    firstFailedRenderReport: binding(path.join(D, 'attempts/revision-1-first-render/fig-200.render.json')),
    repairs: [
      binding(path.join(D, 'revision-1-repair.json')),
      binding(path.join(D, 'revision-2-repair.json')),
    ],
    exactRepairDiffsVerified: true,
    specRevisions: 2, displayContractRepairs: 1, renderLayoutRepairs: 1,
    geometricRelationshipRepairs: 0, approvedTextRepairs: 0,
    regenerationDeterminismClaim: false,
  },
  independentReview: {
    status: 'PENDING-NOT-SELF-CERTIFIED', reviewFileCreated: false,
    figurePromotionApproved: false, separateHashBoundReviewRequired: true,
  },
  externalDependencies: [observations.plateV],
  wholeN86Complete: false, completeCardApproved: false,
  promotionApproved: false, publicationApproved: false,
  actualUsage: {
    firstFigureAuthorAssignments: 1, independentReviewAssignments: 0,
    nativeBuildContextCalls: 2, explicitNativeSpecValidationCalls: 3,
    nativeRenderCalls: 2, renderInternalSpecValidationCalls: 2,
    totalTopLevelNativeCalls: 7, nativeFailedCalls: 2,
    ordinaryReadOnlyProbeFailures: 1, nativeFinalizationCalls: 0,
    sourceImagesLoaded: 1, failedRenderImagesLoaded: 1, finalRenderImagesLoaded: 2,
    imageLoads: 4, imageBatches: 1, imageBatchLimit: 8, imageContextLimit: 24,
    localRasterGenerations: 5, retainedFailedRasterCopies: 1,
    modelImageGenerationCalls: 0, paidCalls: 0,
    specRevisions: 2, contentRevisions: 2, renderLayoutRepairRounds: 1,
    geometricRelationshipRevisions: 0, approvedTextRevisions: 0,
    headlessBrowserLaunches: 3, displayCheckInvocations: 1, rasterCheckInvocations: 1,
    fullProductChecks: 0, sourceReviewsReplayed: 0,
    meterReadsOrWrites: 0, canonicalWrites: 0, indexWrites: 0,
    repositoryCodeChanges: 0, gitCalls: 0, databaseCalls: 0,
    publisherCalls: 0, deployCalls: 0, branchOperations: 0,
    worktreeOperations: 0, crossChatMessages: 0, newAgents: 0,
    declaredArtifactWritesOutsideAuthorizedRoot: 0,
  },
  finalIntegrity: {
    checkedHashBindings: checkedInputBindings,
    allConsumedSourceTemplateInstructionAndToolHashesCurrent: true,
    exactFinalSpecMatchesRetainedDraftPlusTwoRecordedRevisions: true,
    allBrowsersClosed: true, runtimeScratchEmpty: true,
  },
  freeze: {
    regularFileMode: '0444', directoryMode: '0555',
    symlinksSkippedWithoutChangingTargets: true,
    hashManifest: path.join(D, 'hashes.sha256'),
    offlineTemporaryEvidenceOnlyNotDurablePromotionMetadata: true,
    finalDisposition: 'Freeze author-native outputs and stop. Do not finalize, review as independent, promote or clear PlateV.',
  },
}
write(path.join(D, 'report.json'), report)
const summary = [
  '# fig200 FIRST Author Freeze',
  '',
  'Status: PASS-AUTHOR-NATIVE-ONLY-INDEPENDENT-REVIEW-PENDING.',
  'Ticket: STEMROBIN-181 / STEMROBIN-181-3. Card: phy10-c2-s3-n86.',
  '',
  'Original RAW200 was opened FIRST. Its single cross-section has two R labels, r_k, h_k, a curved lens meeting a flat plate at center contact, and the shared right triangle. No numeric given values occur in the PNG.',
  'Both approved bilingual drafts and their exercises were byte-identically projected into writable scratch and bound through existing build_context. No finalization or source/template edits.',
  '',
  '## Outputs',
  ...Object.entries(report.finalOutputs).filter(([, v]) => v?.path).map(([name, b]) => `${name}: ${b.path}\nSHA-256: ${b.sha256}`),
  ...report.finalOutputs.displayRasters.map(b => `display ${b.width}px: ${b.path}\nSHA-256: ${b.sha256}; minimum text ${b.minTextPx}px`),
  '',
  `Source inventory: ${report.sourceInventory.path}\nSHA-256: ${report.sourceInventory.sha256}`,
  `Context provenance: ${report.context.path}\nSHA-256: ${report.context.sha256}`,
  `Original PNG SHA-256: ${inputs.originalPng.sha256}`,
  `Raw n86 lesson SHA-256: ${inputs.rawLesson.sha256}`,
  `Frozen requirements SHA-256: ${inputs.frozenRequirements.sha256}`,
  `Affected text PASS report SHA-256: ${inputs.affectedTextClearance.sha256}`,
  ...['zh', 'en'].map(locale => `${locale} approved lesson SHA-256: ${inputs.templates[locale].lesson.sha256}\n${locale} approved exercises SHA-256: ${inputs.templates[locale].exercises.sha256}\n${locale} native context SHA-256: ${contexts.contexts[locale].sha256}`),
  '',
  '## Verification',
  'Native draft validation and final render PASS. 23 assertions preserve equal R radii, circle membership, perpendicular triangle legs and plate tangent, shared axis, gap height and R-h_k. The figure shows no numeric answers.',
  'Requested 342/640px previews and an additional required 331px check PASS, including each separately drawn k subscript. No text overlap/clipping, blank/black raster or external browser request.',
  '',
  '## Usage',
  'Spec revisions: 2 exactly. Revision 1 adds required 331px display validation. Revision 2 moves only oblique R and h_k subscript labels; one render repair round. Geometry and approved-text revisions: 0.',
  'Native calls: build_context 2; explicit validate_spec 3; render_spec 2. Renderers internally validate 2 more times. FIRST failed native validation and FIRST failed render, including unchanged failed bytes and exact call receipts, are retained.',
  'Images loaded: 4 in one batch (limit 8; context limit 24). Local raster generations: 5; paid/model image calls: 0. No independent review, finalization, canonical/index/meter/git/code/DB/publisher/deploy changes, branch/worktree operations or chat messages.',
  '',
  '## Holds',
  'Independent hash-bound figure review is PENDING. Author-native pass is not promotion, lesson-native acceptance or whole-card display clearance.',
  'plateV remains HOLD-UNINSPECTED-SEPARATE-DEPENDENCY at p0229#3; literal citation retained. Its source pixels, Roman ownership and spectral-color approval remain pending. It is neither omitted nor renamed.',
  'Whole n86 is NOT complete. Outputs are frozen offline scratch evidence only. Stop.',
  '',
].join('\n')
fs.writeFileSync(path.join(D, 'summary.md'), summary, { flag: 'wx', mode: 0o600 })

function walk(dir) {
  const files = []
  for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name)
    const stat = fs.lstatSync(p)
    if (stat.isSymbolicLink()) continue
    if (stat.isDirectory()) files.push(...walk(p))
    else if (stat.isFile()) files.push(p)
  }
  return files
}
const files = walk(D)
const manifestPath = path.join(D, 'hashes.sha256')
fs.writeFileSync(manifestPath, files.map(p => `${hash(p)}  ${p}\n`).join(''), { flag: 'wx', mode: 0o600 })
const links = []
function freeze(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const stat = fs.lstatSync(p)
    if (stat.isSymbolicLink()) { links.push(p); continue }
    if (stat.isDirectory()) freeze(p)
    else if (stat.isFile()) fs.chmodSync(p, 0o444)
  }
  fs.chmodSync(dir, 0o555)
}
freeze(D)
for (const p of [...files, manifestPath]) assert.equal(fs.statSync(p).mode & 0o222, 0)
assert.equal(links.length, 2)
for (const line of fs.readFileSync(manifestPath, 'utf8').trim().split('\n')) {
  const h = line.slice(0, 64)
  const p = line.slice(66)
  assert.equal(hash(p), h, `Frozen hash mismatch: ${p}`)
}
console.log(JSON.stringify({
  status: 'FROZEN-PASS-AUTHOR-NATIVE-ONLY',
  report: binding(path.join(D, 'report.json')),
  summary: binding(path.join(D, 'summary.md')),
  manifest: binding(manifestPath),
  finalOutputs: report.finalOutputs,
  readonlyFiles: files.length + 1, unchangedSourceSymlinks: links.length,
  nativeCalls: nativeCalls.length, specRevisions: 2, imageLoads: 4,
  independentReview: 'PENDING', plateV: 'HOLD-UNINSPECTED-SEPARATE-DEPENDENCY',
  wholeN86Complete: false,
}, null, 2))
