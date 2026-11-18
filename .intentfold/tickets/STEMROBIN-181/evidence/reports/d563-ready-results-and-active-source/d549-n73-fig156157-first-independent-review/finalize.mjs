import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const repo = process.cwd()
const author = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d537-n73-first-modern-figure-author')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = file => ({
  path: file,
  sha256: hash(file),
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
  bytes: fs.statSync(file).size,
})
const json = (name, data) => fs.writeFileSync(
  path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx', mode: 0o444 },
)
const walk = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  }).sort()

const observations = read(path.join(out, 'observations.json'))
const opens = read(path.join(out, 'actual-opens.json'))
const before = read(path.join(out, 'inputs-current.before.json'))
const previews = read(path.join(out, 'preview2-browser-evidence.json'))
if (hash(path.join(out, 'independent-inventory.json')) !== before.sourceInventory.sha256) {
  throw new Error('Source-first sealed inventory changed after registration')
}
for (const file of walk(out)) fs.chmodSync(file, 0o444)
const frozenInputRows = [...before.detached, ...before.inputs, ...before.authorFreeze.files]
const afterRows = frozenInputRows.map(item => {
  const current = binding(item.path)
  return {
    ...current,
    expectedSha256: item.sha256,
    expectedMode: item.mode,
    hashUnchanged: current.sha256 === item.sha256,
    modeUnchanged: current.mode === item.mode,
  }
})
const after = {
  schema: 'd549/current-inputs@1',
  phase: 'after-all-six-first-actual-opens',
  recordedAt: new Date().toISOString(),
  actualImageCount: opens.opens.length,
  allHashesUnchanged: afterRows.every(item => item.hashUnchanged),
  allModesUnchanged: afterRows.every(item => item.modeUnchanged),
  files: afterRows,
  sharedWorkspaceCleanupOrRollback: false,
}
json('inputs-current.after.json', after)
if (!after.allHashesUnchanged || !after.allModesUnchanged) {
  throw new Error('Current input drift: preserve observed first evidence, do not sign stale files')
}
if (
  opens.opens.length !== 6 ||
  opens.actualCounts.total !== 6 ||
  opens.contextFinalImageCount !== 6 ||
  new Set(opens.opens.map(item => item.path)).size !== 6 ||
  !opens.opens.every((item, index) => item.sequence === index + 1 && hash(item.path) === item.sha256)
) throw new Error('Actual-opens ledger or an observed PNG binding is inconsistent')
if (
  previews.screenshotsCreated !== 2 ||
  previews.resvgPreviewsCreated !== 0 ||
  !previews.browserClosed ||
  previews.figures.some(item => !item.svgBytesUnchanged || item.actualWidthPx !== 342)
) throw new Error('First mobile method evidence is inconsistent')

const currentText = before.inputs.filter(item => item.path.endsWith('/lesson.template.json'))
const textReview = before.inputs.find(item => item.path.includes('d486-n73-first-independent-text-review'))
const tools = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  'app/node_modules/playwright/package.json',
  'app/node_modules/playwright-core/lib/tools/cli-client/skill/SKILL.md',
].map(file => binding(path.join(repo, file)))
const firstAuthorFAILBindings = observations.authorFirstFAILs.pathsRemainUnchanged.map(binding)
const figures = observations.figures.map(observation => {
  const id = observation.figure
  const dir = path.join(author, id, 'after')
  const specFile = path.join(dir, 'spec.json')
  const spec = read(specFile)
  const render = read(path.join(dir, 'render.json'))
  const nativePNG = path.join(dir, `${id}.png`)
  const svgFile = path.join(dir, `${id}.svg`)
  const specBinding = binding(specFile)
  const svgBinding = binding(svgFile)
  if (render.spec.sha256 !== specBinding.sha256 || render.output.svg.sha256 !== svgBinding.sha256) {
    throw new Error('Frozen render bindings do not name the current spec/SVG')
  }
  const objectIds = new Set(spec.objects.map(item => item.id))
  const assertionIds = new Set(spec.assertions.map(item => item.id))
  const inventory = read(path.join(out, 'independent-inventory.json')).figures.find(item => item.figure === id)
  if (!inventory || observation.sourceMapping.length !== inventory.items.length) {
    throw new Error('Independent source inventory mapping is incomplete')
  }
  const sourceMapping = observation.sourceMapping.map(item => {
    const inventoryItemExists = inventory.items.some(sourceItem => sourceItem.id === item.inventoryId)
    const objectsResolve = item.objectIds.every(objectId => objectIds.has(objectId))
    const assertionsResolve = item.assertionIds.every(assertionId => assertionIds.has(assertionId))
    if (!inventoryItemExists || !objectsResolve || !assertionsResolve) {
      throw new Error(`Source mapping references do not resolve: ${id}/${item.inventoryId}`)
    }
    return { ...item, inventoryItemExists, allObjectIdsResolve: objectsResolve, allAssertionIdsResolve: assertionsResolve }
  })
  const coordinate = name => spec.objects.find(item => item.id === name).at
  const angle = (point, vertex) => Math.atan2(
    Math.abs(point[0] - vertex[0]), Math.abs(point[1] - vertex[1]),
  ) * 180 / Math.PI
  const vertex = coordinate(id === 'fig-156' ? 'interface-hit' : 'source-interface-hit')
  const entry = coordinate(id === 'fig-156' ? 'curved-entry' : 'source-incident-entry')
  const reflected = coordinate(id === 'fig-156' ? 'reflected-exit' : 'source-reflected-exit')
  const refracted = coordinate(id === 'fig-156' ? 'refracted-end' : 'source-grazing-end')
  const alpha = angle(entry, vertex)
  const gamma = angle(reflected, vertex)
  const beta = angle(refracted, vertex)
  const coordinateReading = {
    basis: 'Independent read-only arithmetic on the current frozen coordinates after actual visual observation; not validate_spec, render_spec or a native-validator rerun.',
    incidenceAngleDeg: alpha,
    reflectionAngleDeg: gamma,
    refractionAngleDeg: beta,
    equalReflectionAngles: Math.abs(alpha - gamma) < 1e-10,
    inferredRelativeIndexFromCoordinates: Math.sin(beta * Math.PI / 180) / Math.sin(alpha * Math.PI / 180),
    sourceMeasurementsClaimed: false,
    sourceRoundedExamplesRecomputedOrReplaced: false,
    ...(id === 'fig-156'
      ? { subcritical: alpha < Math.asin(1 / 1.5) * 180 / Math.PI, betaGreaterThanAlpha: beta > alpha }
      : { grazingEndpointOnInterface: refracted[1] === vertex[1], betaIsRightAngle: beta === 90 }),
  }
  const preview = previews.figures.find(item => item.figure === id)
  const contextBinding = before.inputs.find(item => item.path.endsWith(`/${id}.context.json`))
  const sourceBinding = before.inputs.find(item => item.path === inventory.source.path)
  return {
    ...observation,
    sourceMapping,
    currentBindings: {
      source: sourceBinding,
      context: contextBinding,
      spec: specBinding,
      render: binding(path.join(dir, 'render.json')),
      outputSVG: svgBinding,
      outputNativePNG: binding(nativePNG),
      firstObservedMobilePNG: binding(preview.png.path),
      currentText,
      inheritedTextReview: textReview,
      independentInventory: binding(path.join(out, 'independent-inventory.json')),
      actualOpens: binding(path.join(out, 'actual-opens.json')),
      allObservedPNGsForThisFigure: opens.opens.filter(item => item.figure === id),
    },
    coordinateReading,
    priorNativeEvidence: {
      inspectedAsTextOnly: true,
      status: render.status,
      displayChecks: render.displayChecks,
      renderSpecAndSVGBindingsMatchCurrent: true,
      nativeReruns: 0,
      independentlyObservedFIGStatusNotInheritedFromNative: true,
      scratchMetadataNotPromotableDurableEditionMetadata: true,
    },
    desktop495px: {
      widthSource: binding(path.join(author, 'display-after.json')),
      scope: 'Previously measured isolated headed figure-media width, corroborated in frozen native declared width. No 495px browser screenshot or full card was observed in this batch.',
      DISPLAY: 'pending-fullcard',
    },
  }
})

const report = {
  schema: 'd549/first-independent-necessary-FIG-report@1',
  ticket: 'STEMROBIN-181',
  card: 'phy10-c2-s2-n73',
  batch: 'd549-n73-fig156157-first-independent-review',
  date: '2026-11-18',
  completedAt: new Date().toISOString(),
  status: 'FIRST-INDEPENDENT-FIG156-PASS-FIG157-PASS-SOURCE-DETAILS-HOLD',
  workerRole: observations.reviewer,
  branchContextFromHumanOnly: 'Original STEMROBIN-181 branch in the shared /Users/yong/.codex/worktrees/00b1/lemmadeck workspace; no Git command used to inspect or change it.',
  FIG: 'PASS',
  passScope: observations.passScope,
  sourceAuthenticity: 'HOLD',
  sourceHOLDsCleared: false,
  allSourceDetailsVerified: false,
  SCI: observations.SCI,
  ZHEN: observations.ZHEN,
  repeatedSCIOrZHEN: false,
  DISPLAY: 'pending-fullcard',
  fullcard: false,
  completeCard: false,
  cardPASS: false,
  promotable: false,
  standardPromotionReviewCreated: false,
  figures,
  actualOpens: {
    ...opens.actualCounts,
    contextStartingCount: 0,
    contextFinalCount: 6,
    batchLimit: 8,
    contextLimit: 24,
    ledger: binding(path.join(out, 'actual-opens.json')),
    allObservedPNGs: opens.opens,
    imagesReturnedToParentOrOldReviewers: 0,
    imageBudgetReset: false,
  },
  preflightAndCurrentProvenance: {
    beforeAnyImageOpenPreflightPerformed: true,
    authorFreezeAll125EntriesAndDetachedSelfHashVerified: true,
    authorReportAndFreezeMode: '0444',
    sourceContextManifestMode: '0644',
    writableSourceAndContextBytesBoundAndRecheckedAtEnd: true,
    originalAndContextModesNotSilentlyChanged: true,
    before: binding(path.join(out, 'inputs-current.before.json')),
    after: binding(path.join(out, 'inputs-current.after.json')),
    authorDetached: before.detached,
    allCurrentInputHashesAndModesUnchanged: after.allHashesUnchanged && after.allModesUnchanged,
  },
  reviewEvidence: {
    independentInventory: binding(path.join(out, 'independent-inventory.json')),
    directObservations: binding(path.join(out, 'observations.json')),
    actualOpens: binding(path.join(out, 'actual-opens.json')),
    firstMobilePreview: binding(path.join(out, 'preview2-browser-evidence.json')),
    toolsRead: tools,
  },
  methodCorrection: observations.methodCorrection,
  readabilityScope: observations.readabilityScope,
  firstFAILPreservation: {
    ...observations.authorFirstFAILs,
    frozenEvidence: firstAuthorFAILBindings,
    independentFirstFIGFAILs: [],
    firstMobilePreviewFAILs: [],
    authorRepairCountPerReviewedFigure: 1,
    reviewerRepairCountPerReviewedFigure: 0,
    noFurtherFigureRepairAllowed: true,
  },
  forbiddenOperationsRun: {
    git: 0,
    nativeValidator: 0,
    render_spec: 0,
    sourceEdits: 0,
    candidateOrSpecOrFrozenSVGEdits: 0,
    frozenAuthorReportEdits: 0,
    record_review: 0,
    promotion: 0,
    DB: 0,
    paidCalls: 0,
    commitPush: 0,
    wholeProjectChecks: 0,
    newSubagents: 0,
    newResidentOrReplacementWorkers: 0,
    newWorktreesOrBranches: 0,
    sharedWorkspaceRollbackOrCleanup: 0,
  },
  writeScope: out,
  limitations: observations.limitations,
  closed: true,
  browserClosed: true,
  noSecondBatch: true,
  unusedImageCapacityIsNotAuthorization: true,
  responseContract: 'Return only textual evidence paths and detached report/freeze SHA256 values; no image payloads and no further batch.',
  finalFileMode: '0444',
}
json('report.json', report)
const ready = {
  schema: 'd549/READY@1',
  ticket: 'STEMROBIN-181',
  batch: 'd549-n73-fig156157-first-independent-review',
  status: 'CLOSED-FIRST-INDEPENDENT-NECESSARY-FIG-OBSERVATIONS',
  FIG: { 'fig-156': 'PASS', 'fig-157': 'PASS' },
  sourceDetails: 'HOLD-PRESERVED',
  sourceAuthenticityPASS: false,
  DISPLAY: 'pending-fullcard',
  fullcard: false,
  cardPASS: false,
  promotionAuthorized: false,
  actualImageOpens: 6,
  batchLimit: 8,
  contextFinalCount: 6,
  parentAndOldReviewerCountsRemain: '24/24 permanently',
  noPayloadsReturned: true,
  report: { path: path.join(out, 'report.json'), sha256: hash(path.join(out, 'report.json')) },
  inventory: { path: path.join(out, 'independent-inventory.json'), sha256: hash(path.join(out, 'independent-inventory.json')) },
  actualOpens: { path: path.join(out, 'actual-opens.json'), sha256: hash(path.join(out, 'actual-opens.json')) },
  reviewFreezePath: path.join(out, 'review-freeze.json'),
  closed: true,
  browserClosed: true,
  secondBatchAccepted: false,
  fileMode: '0444',
}
json('READY.json', ready)
for (const file of walk(out)) fs.chmodSync(file, 0o444)
const files = walk(out).map(binding)
const freeze = {
  schema: 'd549/review-freeze@1',
  ticket: 'STEMROBIN-181',
  batch: 'd549-n73-fig156157-first-independent-review',
  status: ready.status,
  date: '2026-11-18',
  closed: true,
  browserClosed: true,
  secondBatchAccepted: false,
  FIG: ready.FIG,
  sourceDetails: 'HOLD-PRESERVED',
  DISPLAY: 'pending-fullcard',
  fullcard: false,
  cardPASS: false,
  actualImageOpens: 6,
  report: ready.report,
  allExternalInputHashesAndModesUnchanged: true,
  filesMode: '0444',
  fileCountIncludingThisManifest: files.length + 1,
  manifestSelfHash: 'Detached SHA256 returned in final text; this manifest does not hash itself.',
  files,
}
json('review-freeze.json', freeze)
fs.chmodSync(path.join(out, 'review-freeze.json'), 0o444)
const checkedFiles = walk(out).map(binding)
if (checkedFiles.some(item => item.mode !== '0444')) throw new Error('A review artifact is not 0444')
if (freeze.files.some(item => hash(item.path) !== item.sha256)) throw new Error('Review freeze mismatch')
console.log(JSON.stringify({
  report: binding(path.join(out, 'report.json')),
  reviewFreeze: binding(path.join(out, 'review-freeze.json')),
  READY: binding(path.join(out, 'READY.json')),
  figures: ready.FIG,
  sourceDetails: ready.sourceDetails,
  DISPLAY: ready.DISPLAY,
  actualImageOpens: 6,
  files: checkedFiles.length,
  allFilesMode0444: true,
  browserClosed: true,
  closed: true,
}, null, 2))
