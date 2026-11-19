import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = process.cwd()
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const entry = (relative) => {
  const absolute = path.join(root, relative)
  return { path: path.relative(repo, absolute), sha256: hash(absolute), bytes: fs.statSync(absolute).size }
}
const external = (relative) => ({ path: relative, sha256: hash(path.join(repo, relative)) })
const load = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'))
const render = load('fig-226.render.json')
const firstRender = load('FIRST/fig-226.render.json')
const spec = load('fig-226.spec.json')
const originalSource = '.intentfold/tickets/STEMROBIN-181/tmp/d1142-source262-footer-only-repair/work/10p/pages/0262/figures/fig-226.png'
assert.equal(hash(path.join(repo, originalSource)), spec.source.image.sha256)
assert.equal(render.spec.sha256, entry('fig-226.spec.json').sha256)
assert.equal(render.output.svg.sha256, entry('fig-226.svg').sha256)
assert.equal(firstRender.spec.sha256, entry('FIRST/fig-226.spec.json').sha256)
assert.equal(firstRender.output.svg.sha256, entry('FIRST/fig-226.svg').sha256)
const usage = {
  schema: 'bounded-figure-author-usage/v1',
  ticket: 'STEMROBIN-181',
  batch: 'D037',
  freshImageBatch: true,
  actualImageOpens: 2,
  imageOpenLimit: 8,
  imageBearingContextCount: 2,
  contextImageLimit: 24,
  imageOpenEvents: [
    { ordinal: 1, tool: 'view_image', purpose: 'FIRST TOOL original RAW inspection before all drafts and context', ...external(originalSource) },
    { ordinal: 2, tool: 'view_image', purpose: 'Only own preview inspected; actual SVG rasterization at product 640 px; observed missing shafts', ...entry('fig-226.actual-svg-preview.png') },
  ],
  imagesReturnedInFinal: 0,
  nativeRendererInvocations: 2,
  nativeRendererOutcomes: ['fail: origin-O1-label collision', 'pass: one targeted O1 label offset repair'],
  figureRepairs: { allowed: 1, used: 1, remaining: 0 },
  existingRasterToolInvocations: 2,
  rasterToolOutputs: ['FIRST/fig-226.actual-svg-preview.png', 'fig-226.actual-svg-preview.png'],
  offlineCheckInvocations: 2,
  offlineCheckOutcomes: ['halted before browser: actual PNG IHDR height 309 differs from frozen visual estimate 311', 'completed with metadata addendum; media widths and SVG computed strokes measured'],
  paidCalls: 0,
  imagegenCalls: 0,
  externalNetworkRequestsAuthorized: 0,
  databaseCalls: 0,
  publisherCalls: 0,
  gitCalls: 0,
  chatManagementCalls: 0,
  skillEdits: 0,
  durableWrites: 0,
  globalWrites: 0,
  ownWriteRoot: root,
  browserScratchPolicy: 'HOME, TMPDIR and XDG_CACHE_HOME redirected beneath own write root; offline browser routes deny requests.',
  role: 'FIRST author only',
  independentFigureReview: 'pending',
}
fs.writeFileSync(path.join(root, 'usage.json'), `${JSON.stringify(usage, null, 2)}\n`)
const report = {
  schema: 'modern-figure-first-author-checkpoint/v1',
  ticket: 'STEMROBIN-181',
  batch: 'D037',
  card: 'phy10-c2-s4-n98',
  figure: 'fig-226',
  role: 'FIRST author only',
  authorOutcome: 'AUTHOR-VISUAL-BLOCKED',
  independentFigureReview: 'pending; no review@1 file or independent PASS recorded',
  assetsPromoted: false,
  completeLessonFinalized: false,
  source: {
    original: external(originalSource),
    copiedOriginal: entry('root/10p/figures/fig-226.png'),
    independentlyFrozenPixelInventory: entry('source.inventory.json'),
    frozenBeforeAllRequirementsContextAndDrafts: true,
    actualPngHeaderDimensions: [508, 309],
    metadataOnlyHeightCorrection: entry('source.inventory-metadata-addendum.json'),
    allSourceSymbols: ['K', 'K_1', 'O', 'O_1', 'X', 'X_1', 'Y', 'Y_1', 'Z', 'Z_1', 'vector(v)', 'vector(v_1)'],
    requirements: external('.intentfold/tickets/STEMROBIN-181/tmp/d1201-n97n99-first-preparation/cards/phy10-c2-s4-n98/source-requirements.json'),
  },
  context: {
    builtByExistingToolWithOwnRoot: true,
    context: entry('context.json'),
    lesson: entry('root/10p/editions/modern-us-neutral/lessons/phy10-c2-s4-n98/lesson.json'),
    exercises: entry('root/10p/editions/modern-us-neutral/lessons/phy10-c2-s4-n98/exercises.json'),
    copiesAreContextOnly: true,
    copiesAreByteIdenticalToSpecifiedCurrentChineseTemplates: true,
    completeAuthoritativeParagraphsInSpec: 9,
    textNativePass: 'Supplied by delegation; not figure-author approval.',
    independentTextReview: 'Parallel outside this author scope; no independent approval asserted.',
  },
  sourceMapping: {
    inventoryGroups: spec.source.inventory.length,
    executableRelationshipAssertions: spec.assertions.length,
    semanticArrowsWithConnectsAssertions: 8,
    countOnlyAssertions: 0,
    preserved: [
      'Shared X/X_1 straight support, O left of O_1, X arrowhead before X_1.',
      'Y/Y_1 parallel and upward; Z/Z_1 parallel and left/down.',
      'Every origin joins its own three axes.',
      'Both velocity arrows rightward; v tail on Y_1; v_1 detached above shared axis.',
      'All original symbols, vector accents and numeral-one subscripts.',
    ],
    clarityAdditionsSeparateFromSourceFacts: entry('clarity-additions.json'),
  },
  FIRST: {
    preservedBeforeOnlyRepair: true,
    spec: entry('FIRST/fig-226.spec.json'),
    svg: entry('FIRST/fig-226.svg'),
    render: entry('FIRST/fig-226.render.json'),
    actualSvgPreview: entry('FIRST/fig-226.actual-svg-preview.png'),
    nativeOutcome: 'fail: origin-O1-label collision, score 10000',
    originalReportPathsAreHistorical: 'Copied FIRST report is immutable. Its historical spec/output paths name the pre-repair locations; hashes resolve to the preserved files in this FIRST section.',
    firstPreviewNotOpened: true,
  },
  candidateAfterOnlyAffectedRepair: {
    spec: entry('fig-226.spec.json'),
    svg: entry('fig-226.svg'),
    render: entry('fig-226.render.json'),
    actualSvgPreview: entry('fig-226.actual-svg-preview.png'),
    repair: entry('repair.json'),
    specValidation: entry('spec-validation.json'),
    nativeRenderStatus: render.status,
    nativeRenderCollisions: render.collisions,
    measuredNativeMinimumTextPx: render.displayChecks[0].measuredMinPx,
    repairDiffConfirmed: 'Only origin-O1.labelPlacement.offset changed to [0, -10]; geometry, assertions and authoritative text unchanged.',
  },
  authorVisualObservation: {
    openedImage: entry('fig-226.actual-svg-preview.png'),
    status: 'fail',
    observed: 'White preview has all 12 mathematical labels and arrowheads but omits the coordinate and velocity shafts. It is instructional and therefore this raster cannot be approved.',
    noFurtherFigureRepair: 'One figure repair already used. No third native render, manual SVG-path edit, fallback asset or generation.',
    diagnostic: 'Current SVG retains semantic CSS-variable strokes. Offline headed browser computes all 8 shafts as visible, nonzero-length strokes. The existing resvg preview is missing shafts despite raster command exit 0; this identifies a raster representation discrepancy, not a source-fidelity PASS.',
    issueNotSilentlyReplaced: true,
    independentReviewStillPending: true,
  },
  productWidthEvidence: {
    evidence: entry('offline-product-width.json'),
    surface: 'Restricted headed offline harness with current product CSS and unchanged candidate SVG, not a live lesson render or deployed route.',
    viewports: ['390x844', '1440x960'],
    mediaSurfaces: ['sr-read-fig', 'sr-ex-fig'],
    measuredMediaWidthPx: 640,
    minimumTextPx: 28,
    clippingOrLabelCollisionsInNativeReport: false,
    scrollEndReachable: true,
    visualApproval: false,
  },
  usage: entry('usage.json'),
  reproductionTools: [
    external('.agents/skills/ld-s10y-image/scripts/build_context.py'),
    external('.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
    external('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
    external('.claude/skills/ld-s10y-lesson/tools/svg_raster.js'),
  ],
  ownVerificationScript: entry('offline-author-check.mjs'),
  scope: {
    ownWriteRoot: root,
    noChangesOutsideOwnRootIntendedOrAuthorized: true,
    noNativeIndependentReviewRecorded: true,
    noPromotionPublisherDatabaseGitNetworkOrChatOperations: true,
    frozenSourceInventoryPreservedUnchanged: true,
  },
  handoff: 'All FIRST and repaired-candidate evidence is retained for independent figure review. Author visual approval is withheld because the only inspected actual-SVG raster preview omits shafts. No asset promotion or complete-lesson finalization is authorized.',
}
fs.writeFileSync(path.join(root, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify({
  outcome: report.authorOutcome,
  report: entry('report.json'),
  sourceInventory: report.source.independentlyFrozenPixelInventory,
  context: report.context.context,
  candidate: report.candidateAfterOnlyAffectedRepair,
  usage: report.usage,
  actualImageOpens: 2,
  independentFigureReview: 'pending',
}, null, 2))
