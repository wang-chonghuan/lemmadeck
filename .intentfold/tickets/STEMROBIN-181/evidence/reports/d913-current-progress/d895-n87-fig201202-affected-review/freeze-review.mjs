import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp')
const D = path.join(T, 'd895-n87-fig201202-affected-review')
const A = path.join(T, 'd886-n87-fig201202-affected-repair')
const V = path.join(T, 'd877-n87-fig201202-first-independent-review')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const info = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, data) => {
  const file = path.join(D, name)
  assert.ok(file.startsWith(`${D}/`))
  fs.writeFileSync(file, typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  return info(file)
}
const findings = load(path.join(D, 'independent-findings-AFFECTED.json'))
const display = load(path.join(D, 'display-measurements.json'))
const geometry = load(path.join(D, 'binding-and-geometry.json'))
const preservation = load(path.join(D, 'input-preservation.json'))
const selection = load(path.join(A, 'current-outputs.json'))
assert.equal(findings.result, 'PASS')
assert.deepEqual(findings.blockingFindings, [])
assert.equal(display.status, 'PASS')
assert.equal(geometry.status, 'PASS')
assert.deepEqual(display.widths.map(w => w.width), [331, 342, 640])
assert.equal(display.screenshots.length, 3)
for (const image of findings.visualObservations) {
  assert.equal(hash(image.image), image.sha256)
  assert.equal(image.contextLoads, 1)
  assert.equal(image.status, 'PASS')
}
const finalPreservation = preservation.files.map(binding => ({
  path: binding.path, beforeSha256: binding.sha256, afterSha256: hash(binding.path),
  unchanged: hash(binding.path) === binding.sha256,
}))
assert.ok(finalPreservation.every(b => b.unchanged))
const preserved = write('final-input-preservation.json', {
  status: 'PASS', checked: finalPreservation.length, drift: 0,
  scope: 'All 40 hash-bound files consumed by the affected audit; read-only. This does not claim a scan of unrelated concurrently edited files.',
  files: finalPreservation,
})
const priorUsage = geometry.inheritedUsage
const usage = write('usage.json', {
  schema: 'd895/bounded-affected-independent-review-usage@1',
  ticket: 'STEMROBIN-181', batch: 'd895', successor: 'successor181-3',
  soleRoot: R, onlyWriteRoot: D, reviewRounds: 1,
  images: {
    batches: 1, contextImageLoads: 3, uniqueImages: 3,
    screenshotCaptures: 3, screenshotContextLoads: 3,
    screenshotExtraReopens: 0, originalPngContextLoads: 0, originalPngReopens: 0,
    fig201ContextImages: 0, crops: 0, failedLabelOutputContextLoads: 0,
    geometryRendererPngs: 0, batchLimit: 8, contextLimit: 24,
    conservativeCapturePlusContextCharges: 6,
    ledger: findings.visualObservations.map((image, i) => ({
      load: i + 1, batch: 1, figure: 'fig-202', width: image.width,
      purpose: 'final-selected-svg-affected-width-inspection-once',
      path: image.image, sha256: image.sha256,
    })),
    note: 'Original PNG bytes were hashed, never visually reopened. Pixel nonblank checks reused the same three saved screenshots without further context loads or captures.',
  },
  calls: {
    independentAffectedAudit: 1, localBrowserLaunch: 1, localWidthChecks: 3,
    figureGeometryEdits: 0, figureGeometryRender: 0,
    nativeValidator: 0, nativeOfflineLessonRender: 0, nativeFinalize: 0,
    producerReruns: 0, passingRenderReplay: 0, sourceFirstReplay: 0,
    fig201VisualReplay: 0, recordReview: 0, promotionReceipts: 0,
    fullTextReviews: 0, scopedReportFreeze: 1,
  },
  paid: { imageGeneration: 0, modelApiCalls: 0, costUsd: 0 },
  canonicalWrites: 0, indexWrites: 0, meterWrites: 0,
  gitCommands: 0, dbCalls: 0, publisherCalls: 0, deployCalls: 0, otherChatCalls: 0,
  inheritedUsage: {
    firstReview: info(path.join(V, 'usage.json')),
    affectedAuthor: info(path.join(A, 'usage.json')),
    firstReviewContextImages: priorUsage.first.imageLoads,
    affectedAuthorContextImages: priorUsage.affectedAuthor.images.contextImageLoads,
    affectedAuthorInitialRenderCalls: priorUsage.affectedAuthor.calls.fig202RenderInitial,
    affectedAuthorGenuineLabelRecoveryRenderCalls: priorUsage.affectedAuthor.calls.fig202RenderTargetedGenuineFailureRecovery,
    countersRetainedNotReset: true,
    note: 'Historical context loads stay in their original bounded sessions; they are not reopened in d895. Author content repair and label failure/recovery remain historical usage, not new review work or approval.',
  },
  tokenUsage: 'Not exposed by the runtime; not estimated.',
})
const report = {
  schema: 'd895/bounded-affected-independent-figure-review@1',
  ticket: 'STEMROBIN-181', batch: 'd895', successor: 'successor181-3',
  card: 'phy10-c2-s3-n87', round: 'AFFECTED',
  soleRoot: R, onlyWriteRoot: D, frozenAt: new Date().toISOString(),
  result: 'PASS', status: 'SCOPED-AFFECTED-INDEPENDENT-PASS',
  scope: 'Current-text bindings of fig201/202 and actual affected fig202 normal-incidence model, labels and disclosure at 331/342/640 px, composed with inherited d877 unchanged source inventory and unaffected passes.',
  independence: {
    author: 'd886', predecessorReview: 'd877', reviewer: 'd895',
    finalSelectedCandidatesReadDirectly: true, assertionsIndependentlyComparedWithTextModel: true,
    originalPixelObservationsReusedNotReplayed: true,
  },
  predecessor: { ...info(path.join(V, 'report.json')), expectedSha256: '27995205ff564553f1d0e90a1cd74ae9163285f8cd38740355ebc8562bb28844', matched: true, originalResultRetained: 'HOLD' },
  affectedAuthor: { ...info(path.join(A, 'report.json')), expectedSha256: '1fc832e3890840e9b1a1cd1c8c26cc0b2b427311735d0d971ca16f32e6584806', matched: true },
  currentSelection: info(path.join(A, 'current-outputs.json')),
  authoritativeText: { candidates: geometry.text.candidates, reconstructedEntries: 52, bothSpecsExact: true, actualUsages: geometry.text.actualUsages },
  figures: [
    {
      figure: 'fig-201', result: 'PASS',
      metadataCurrentText: 'PASS',
      inheritedGeometrySourceReadabilityCulture: 'd877 PASS reused; no visual replay',
      onlyChangedSpecField: '/source/authoritativeText',
      unchangedOtherSpecFieldsAndSvg: true,
      historicalRenderNotRebound: true, nativeFreshRenderClaimed: false,
      source: geometry.fig202.sourceChecks.find(c => c.figure === 'fig-201').originalImage,
      outputs: selection.figures['fig-201'],
      resolvedFinding: 'd877-201-C01',
    },
    {
      figure: 'fig-202', result: 'PASS',
      metadataCurrentText: 'PASS', normalIncidenceModel: 'PASS',
      inheritedSourceInventoryAndUnchangedTopology: 'PASS by scoped composition',
      affectedVisibleLabelsAndMeaning: 'PASS',
      source: geometry.fig202.sourceChecks.find(c => c.figure === 'fig-202').originalImage,
      outputs: selection.figures['fig-202'],
      resolvedFindings: ['d877-202-C01', 'd877-202-G01'],
      normalLegs: geometry.fig202.normalLegs,
      forwardAndReturnEachEqualH: true,
      widths: display.widths.map(w => ({
        width: w.width, result: 'PASS', minTextPx: w.minTextPx,
        labelCollisions: w.collisions, geometryClipping: w.geometryClipping,
        labelsInside: w.labels.every(l => l.inside),
        visualCollisionClippingMeaningAmbiguity: 'none observed',
        screenshot: { ...display.screenshots.find(s => s.width === w.width), contextInspected: true },
      })),
    },
  ],
  sourceGateComposition: {
    originalInventory: info(path.join(V, 'source-inventory-FIRST.json')),
    originalIndependentGeometry: info(path.join(V, 'geometry-and-bindings-FIRST.json')),
    sourceHashesUnchanged: true, originalContextLoads: 0,
    fig201UnchangedSourceAndGeometryPassReused: true,
    fig202OriginalTopologyAndMediumThicknessOrderingRetained: true,
    sourceSlantOrSeparationClaimedUnchanged: false,
    changedDepiction: 'Disclosed modern coincident normal-incidence model, required by d858, replacing unmeasured source-separated visual paths.',
    sourceMetricAngleOrThicknessInferred: false,
    verdict: 'PASS for this composition; not a new full FIRST source-fidelity approval.',
  },
  findings: info(path.join(D, 'independent-findings-AFFECTED.json')),
  substantiveFindings: findings.findings,
  blockingFindings: [],
  mathematicalAndBindingEvidence: info(path.join(D, 'binding-and-geometry.json')),
  localDisplayEvidence: info(path.join(D, 'display-measurements.json')),
  inspectedImages: findings.visualObservations,
  preservedFailureAndRecovery: geometry.failureAndRecovery,
  inputPreservation: preserved, usage,
  limitations: findings.limitations,
  fullCardApproved: false, promotionApproved: false,
  nativeReviewReceiptCreated: false, recordReviewCalls: 0, nativeFinalizeCalls: 0,
  stop: 'Scoped substantive report frozen. No promote/publish/finalize/card approval or other downstream action.',
}
for (const binding of [report.predecessor, report.affectedAuthor]) assert.equal(binding.sha256, binding.expectedSha256)
write('report.json', report)
write('report.md', `# d895 AFFECTED Independent Review

Result: **PASS**, scoped to the exact d886-selected fig201/202 candidates. No blocking finding remains in the assigned affected scope. This is **not card approval or promotion**.

## Disposition

- **fig201 / d877-201-C01:** PASS. Both specs bind the exact 52-entry bilingual d858 context. Every other fig201 spec field and its SVG bytes are unchanged; d877's source, geometry, culture and width passes are reused without visual replay. Its old render is retained as historical evidence, not rebound.
- **fig202 / d877-202-C01:** PASS. The selected recovery spec contains the complete current d858 context, including normal incidence, frequency clarification and the footnote warning.
- **fig202 / d877-202-G01:** PASS. All six optical legs share x=275 and are perpendicular to the actual horizontal interfaces. The return rejoins the upper hit. Each film leg equals h=80; the round trip is 160=2h. Connects, perpendicular, coincidence and equalDistance assertions cover the intended current-text geometry, not just self-consistent coordinates.
- **Visible affected labels:** PASS at 331, 342 and 640 px, inspected once each. Minimum text is 16.55, 17.1 and 32 px. Normal incidence and All rays share one line. visibly explain the model. Incident, upward identities 1/2, h and medium labels are clear; no collisions, clipping or meaning ambiguity observed. The optical line is truly normal and coincident, with transmission terminating inside glass.

## Source Composition

Reuse d877's independent original-PNG observations and unchanged source hashes; no originals were reopened. Fig202 retains the source optical branch topology, media, interfaces, thickness and transmission. The unmeasured source slant/separation is deliberately replaced by the disclosed modern normal-incidence model, not claimed literally preserved. Added annotation heights, regularization, hidden vertices and hatch repetition are not source measurements.

## Failure History

The FIRST fig202 label failure remains immutable and hash-bound. Only label 2 moved from [330,305] to [330,285] in the selected targeted-label-recovery candidate; geometry and assertions did not change during that recovery. The failed FIRST SVG was not selected or visually loaded. No producer or passing render was rerun.

## Evidence

- Substantive findings: \`${path.join(D, 'independent-findings-AFFECTED.json')}\`
- Bindings/geometry: \`${path.join(D, 'binding-and-geometry.json')}\`
- Browser measurements: \`${path.join(D, 'display-measurements.json')}\`
- Usage: \`${path.join(D, 'usage.json')}\`
- Preservation: 40 consumed input files, zero drift. Unrelated concurrent files were not scanned or claimed unchanged.
- d877 report SHA256: \`${report.predecessor.sha256}\`
- d886 report SHA256: \`${report.affectedAuthor.sha256}\`
- fig201 spec / SVG: \`${selection.figures['fig-201'].spec.sha256}\` / \`${selection.figures['fig-201'].svg.sha256}\`
- fig202 final spec / SVG / render: \`${selection.figures['fig-202'].spec.sha256}\` / \`${selection.figures['fig-202'].svg.sha256}\` / \`${selection.figures['fig-202'].render.sha256}\`

One image batch: 3 captures, 3 context loads, zero reopens/crops/originals/fig201 images; conservative capture-plus-load charge 6, within 8/batch and 24/context. Historical d877/d886 usage is retained, never reset. Zero paid calls, Git, DB, publisher, producer reruns, native finalize, record_review, promotion or other-chat actions.

## Limits

Standalone final-SVG product-class screenshots are not an assembled offline lesson, live route, theme sweep, exercise workflow or whole-card acceptance. Upstream text/SCI/ZHEN decisions are not re-reviewed or extended. Temporary candidates and fig201's historical render do not satisfy durable native promotion contracts. No \`ld-s10y-image/review@1\` promotion receipt was created.

Frozen at ${report.frozenAt}. Stop at this scoped substantive report.
`)
const packageFiles = fs.readdirSync(D).sort().map(name => path.join(D, name))
assert.ok(packageFiles.every(file => fs.statSync(file).isFile()))
const manifest = write('frozen-artifacts.json', {
  schema: 'd895/frozen-review-artifacts@1',
  frozenAt: report.frozenAt, onlyWriteRoot: D,
  result: report.result, report: info(path.join(D, 'report.json')),
  artifacts: packageFiles.map(info),
  freeze: 'Package regular files set read-only; SHA256SUMS covers this manifest and all prior package files, excluding only itself. No input file mode was changed.',
  downstreamApproval: false,
})
write('SHA256SUMS', [...packageFiles.map(info), manifest].map(binding => `${binding.sha256}  ${binding.path}\n`).join(''))
for (const name of fs.readdirSync(D)) {
  const file = path.join(D, name)
  assert.ok(fs.statSync(file).isFile())
  fs.chmodSync(file, 0o444)
}
console.log(JSON.stringify({
  result: report.result, report: info(path.join(D, 'report.json')),
  markdown: info(path.join(D, 'report.md')), manifest: info(path.join(D, 'frozen-artifacts.json')),
  usage: info(path.join(D, 'usage.json')), fullCardApproved: false, promotionApproved: false,
}, null, 2))
