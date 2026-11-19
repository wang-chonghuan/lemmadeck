import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d848-n87-fig201202-first-author')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const ref = file => ({ path: file, sha256: hash(file) })
function write(name, data) {
  const file = path.join(D, name)
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
  return file
}
const firstReceipt = load(path.join(D, 'author-input-receipt.FIRST.json'))
const display = load(path.join(D, 'display/report.repair-1.json'))
assert.equal(display.status, 'pass')
assert.equal(display.measurements.length, 24)
assert.equal(display.scrollControls.length, 4)
const currentBindings = firstReceipt.exactInputs.map(input => ({
  ...input, currentSha256: hash(input.path), unchanged: hash(input.path) === input.sha256,
}))
const currentTextUnchanged = currentBindings.every(item => item.unchanged)
const imageLoads = [
  ['source', path.join(R, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-201.png')],
  ['source', path.join(R, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-202.png')],
  ['native-failed-render-preview', path.join(D, 'figures/fig-201/repair-1/fig-201.png')],
  ['native-failed-render-preview', path.join(D, 'figures/fig-202/repair-1/fig-202.png')],
  ['final-exercise-mobile-probe', path.join(D, 'display/fig-201.exercise-probe.331.png')],
  ['final-exercise-mobile-probe', path.join(D, 'display/fig-202.exercise-probe.331.png')],
  ['final-prose-mobile', path.join(D, 'display/fig-201.prose.342.png')],
  ['final-prose-mobile', path.join(D, 'display/fig-202.prose.342.png')],
].map(([purpose, file], index) => ({ load: index + 1, purpose, ...ref(file) }))
const figures = []
for (const figure of ['fig-201', 'fig-202']) {
  const final = path.join(D, 'figures', figure, 'repair-2')
  const specFile = path.join(final, 'spec.json')
  const spec = load(specFile)
  const renderFile = path.join(final, `${figure}.render.json`)
  const render = load(renderFile)
  assert.equal(render.status, 'pass')
  assert.equal(render.collisions.length, 0)
  assert.ok(render.displayChecks.every(check => check.status === 'pass'))
  assert.equal(hash(path.join(R, spec.source.image.path)), spec.source.image.sha256)
  assert.equal(hash(specFile), render.spec.sha256)
  assert.equal(hash(path.join(final, `${figure}.svg`)), render.output.svg.sha256)
  const points = spec.objects.filter(object => object.type === 'point')
  const coverage = points.map(point => ({
    point: point.id, at: point.at, hiddenConstruction: point.visible === false,
    assertions: spec.assertions.filter(assertion => {
      if (assertion.type === 'objectCount') return false
      return ['a', 'b', 'c', 'd', 'from', 'to', 'point', 'center'].some(key => assertion[key] === point.id)
    }).map(assertion => assertion.id),
  }))
  assert.ok(coverage.every(point => point.assertions.length > 0), 'Uncovered apparatus/ray endpoint')
  const coverageFile = write(`${figure}.relationship-coverage.json`, {
    schema: 'd848/relationship-coverage@1', figure, spec: ref(specFile),
    scope: 'Diagnostic coverage of every hidden construction endpoint; native validator remains the executable mathematical authority.',
    sourcePointLabels: [], gridDimensions: 'Not applicable: neither PNG contains a grid; hatching is material shading.',
    points: coverage, status: 'pass',
  })
  figures.push({
    figure, mode: 'deterministic',
    authorStatus: currentTextUnchanged ? 'PASS' : 'HOLD',
    authorStatusMeaning: 'Bounded figure author result only, not independent review or promotion eligibility',
    first: {
      spec: ref(path.join(D, 'figures', figure, 'FIRST/spec.json')),
      validation: ref(path.join(D, 'calls', `${figure}-FIRST-validation.json`)),
      outcome: 'Native validator failed; preserved. No SVG rendered from FIRST spec because dependent stages stopped.',
    },
    finalCandidate: {
      spec: ref(specFile), svg: ref(path.join(final, `${figure}.svg`)),
      preview: ref(path.join(final, `${figure}.png`)), render: ref(renderFile),
      validation: ref(path.join(D, 'calls', `${figure}-repair-2-validation.json`)),
      nativeRenderCall: ref(path.join(D, 'calls', `${figure}-repair-2-render.json`)),
    },
    sourceInventory: ref(path.join(D, 'source-inventory', `${figure}.FIRST.json`)),
    source: { ...spec.source.image, currentSha256: hash(path.join(R, spec.source.image.path)) },
    relationships: ref(coverageFile),
    assertions: spec.assertions.length,
    nativeDisplay: render.displayChecks,
    actualDisplay: display.measurements.filter(item => item.figure === figure),
    authorVisualObservation: figure === 'fig-201'
      ? 'At 331px and 342px, both plates, the left near-contact, widening air wedge and right-hand spacer remain visible. Added English labels fit without touching the geometry. No source-absent rays, fringe pattern or surface roughness is invented. Wedge depth is deliberately exaggerated and nonmetric.'
      : 'At 331px and 342px, incident light reaches the upper interface, wave 1 leaves the upper hit, the film path reaches the lower hit, wave 2 returns through the upper interface, and the transmitted ray continues downward into glass. Two thickness arrowheads span only the film. Source numerals and English medium labels are readable. Lateral path separation is explicitly a source-style schematic, not an asserted oblique-incidence model.',
    independentReviewStatus: 'HOLD / NOT RUN',
    textReviewStatus: 'HOLD / independent bilingual text review pending',
    promotionStatus: 'HOLD / NOT AUTHORIZED',
    cumulativeRounds: { author: 3, initial: 1, validatorRepair: 1, renderRepair: 1, independentReview: 0 },
  })
}
const usage = {
  imageLoadsIntoModelContext: imageLoads.length,
  batchImageLoadLimit: 8, cumulativeContextImageLoads: 8, cumulativeContextImageLimit: 24,
  crops: 0, sourceReopens: 0, repeatedImageFileLoads: 0,
  imageLoadLedger: imageLoads,
  paidCalls: 0, paidImageCalls: 0, paidCostUSD: 0,
  nativeBuildContextCalls: 4,
  specAuthorRoundsPerFigure: 3, specAuthorRoundsTotal: 6,
  directNativeValidatorCalls: 6, directNativeValidatorFailures: 2,
  nativeRendererCalls: 4, nativeRendererFailures: 2,
  rendererInternalValidatorCalls: 4,
  totalNativeValidatorExecutionsIncludingRendererInternalCalls: 10,
  nativeOfflineLessonRenderCalls: 2, nativeOfflineLessonRenderFailures: 0,
  headedDisplayProbeAttempts: 2, displayExecutionRepairs: 1,
  successfulInlineMeasurements: 24, successfulScrollControls: 4,
  savedFinalMobileScreenshots: 4, nativeSavedPreviews: 4,
  independentFigureReviewCalls: 0, independentTextReviewCalls: 0,
  promotions: 0, adaptFinalizeCalls: 0, databaseCalls: 0,
  publisherCalls: 0, deployCalls: 0, gitCommands: 0,
  fullTests: 0, fullBuilds: 0, newChats: 0, newWorktrees: 0, newBranches: 0,
  sharedMeterWrites: 0, canonicalAssetWrites: 0,
  tokenUsage: 'Not exposed by this execution interface; not estimated',
}
const report = {
  schema: 'd848/bounded-first-author-report@1',
  batch: 'd848', ticket: 'STEMROBIN-181', successor: 'successor181-3',
  card: 'phy10-c2-s3-n87', soleRoot: R, onlyWriteRoot: D,
  result: currentTextUnchanged ? 'AUTHOR PASS; REVIEW AND PROMOTION HOLD' : 'HOLD: candidate text changed concurrently after context freeze',
  stop: 'First bounded figure-author batch complete. No next batch, independent review, self-approval, promotion, adapt-finalize or publication performed.',
  authority: {
    inputReceipt: ref(path.join(D, 'author-input-receipt.FIRST.json')),
    fullBilingualContext: ref(path.join(D, 'context/full-bilingual.FIRST.json')),
    exactFourCandidates: currentBindings,
    currentTextUnchanged, textApprovalClaimed: false,
    nativeContexts: firstReceipt.nativeContexts,
    sourceInventoryFrozenBeforeSpec: true,
    liveTicketRead: 'Plane STEMROBIN-181, UUID 7ebae0e0-c024-481d-8360-5b3d3bfdda79; read-only through n-plane. No ticket update.',
  },
  repairs: {
    validator: ref(path.join(D, 'repair-1-receipt.json')),
    render: ref(path.join(D, 'repair-2-receipt.json')),
    displayFirstFailure: ref(path.join(D, 'display/report.json')),
    displayFirstScript: ref(path.join(D, 'check-display.FIRST.mjs')),
    displayRepairedScript: ref(path.join(D, 'check-display.mjs')),
    displayRepairDiagnosis: 'The first headed display attempt failed on page.addStyleTag because imported stylesheet dependencies were blocked by the offline network contract. PostCSS removed import nodes from a private CSS projection; no product rules, tokens, source text or figures were changed. Successful native offline rendering was reused, not repeated.',
    sourceInventoryMappingDelta: 'The frozen FIRST inventory records planned subset hatch-count assertion IDs. Native objectCount cannot count subsets; repaired FigureSpecs remove those IDs from source-fact mappings and put a global authored-segment count in explicit modern-additions groups. Source observations and relationships are unchanged.',
    nativePointInventoryRationale: 'Neither source contains visible or labelled point markers. Hidden construction points cannot appear in native source.inventory.objects because validate_spec explicitly rejects invisible mapped objects. Visible source apparatus/rays are mapped, and all 27 hidden endpoints are covered by executable relationship assertions. No fabricated source point markers or source-grid claims.',
  },
  displayEvidence: ref(path.join(D, 'display/report.repair-1.json')),
  figures, usage,
  limitations: [
    'This is author evidence, not a separate ld-s10y-image/review@1, text-review receipt or independent scientific/cultural gate.',
    'Product CSS and FigureMedia markup are exercised in headed offline DOM projections at measured widths, not on a DB-backed app route. External CSS imports are excluded; system font fallback is used offline. SVG figure labels use the native renderer font and are measured.',
    'Original exercises contain no figure_refs or figures in either locale. Exercise probes are preventive fixtures only, never new question-figure associations.',
    'No answer-key or choice content was opened. Read-only renderer/route inspection encountered helper and loader symbol names, not answer or option data.',
    'No shared manifest, index, canonical figure or meter was changed. Every generated output and mechanical projection is below onlyWriteRoot.',
  ],
}
const reportFile = write('author-report.json', report)
const note = [
  '# d848 n87 FIRST Figure Author',
  '',
  'fig-201: AUTHOR PASS. fig-202: AUTHOR PASS.',
  'Independent figure review: HOLD, not run. Independent bilingual text review: HOLD, pending. Promotion: HOLD, not authorized.',
  '',
  'Both deterministic candidates pass native FigureSpec validation and JSXGraph rendering.',
  'Final candidates are under figures/<figure>/repair-2/; source inventories and FIRST specs remain frozen separately.',
  'FIRST had a native validator failure. repair-1 corrected the validator contract; its real render collision failures are retained. repair-2 is the sole label/canvas render repair.',
  'Native FIRST validation stopped rendering, so no FIRST SVG is fabricated.',
  '',
  'Widths 331 / 342 / 640: minimum label size 16.55 / 17.10 / 32.00 px.',
  'Headed offline product-CSS probes: 24 inline measurements and 4 scroll controls passed.',
  'The original six written tasks have no figure associations; exercise probes do not add any.',
  'Source-style lateral ray offsets are nonmetric schematic separation; normal incidence remains a prose condition.',
  '',
  'Usage: 8 image loads this batch and this context, 0 crops, 0 reopens, 0 paid calls.',
  'Per figure: 1 FIRST + 1 validator repair + 1 render repair = 3 cumulative author rounds.',
  'Native calls: 4 build_context; 6 explicit validations (plus 4 renderer-internal); 4 renders; 2 offline lesson renders.',
  'Headed display: 2 attempts, 1 technical CSS-import repair; failed attempt and original script preserved.',
  'Tokens: not exposed, not estimated.',
  '',
  `Machine report: ${reportFile}`,
  `Report SHA-256: ${hash(reportFile)}`,
  '',
  'STOP after this bounded author batch. No independent review, self-approval, promotion, finalization, shared writes, DB, publisher, deployment, git, full tests/build, new chat or worktree.',
  '',
].join('\n')
fs.writeFileSync(path.join(D, 'author-report.md'), note, { flag: 'wx' })

function entries(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(folder, entry.name)
    if (entry.isSymbolicLink()) return [{ type: 'symlink', path: file, target: fs.readlinkSync(file) }]
    if (entry.isDirectory()) return entries(file)
    return [{ type: 'file', path: file, sha256: hash(file), bytes: fs.statSync(file).size }]
  })
}
const manifest = write('frozen-artifacts.json', {
  schema: 'd848/frozen-artifacts@1', root: D,
  rule: 'This manifest hashes every regular file existing before itself. Symlinks are recorded without changing or chmod-ing their targets.',
  artifacts: entries(D),
})
for (const item of entries(D)) if (item.type === 'file') fs.chmodSync(item.path, 0o444)
console.log(`AUTHOR report ${hash(reportFile)} ${reportFile}`)
console.log(`FROZEN manifest ${hash(manifest)} ${manifest}`)
for (const figure of figures) {
  console.log(`${figure.figure} ${figure.authorStatus} SVG ${figure.finalCandidate.svg.sha256} ${figure.finalCandidate.svg.path}`)
}
console.log('STOP: 8/8 image loads; independent review and promotion HOLD')
