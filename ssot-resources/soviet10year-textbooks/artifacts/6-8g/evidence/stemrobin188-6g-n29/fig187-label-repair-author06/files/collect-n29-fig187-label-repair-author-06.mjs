import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n29-fig187-label-repair-author-06')
const reportFile = path.join(own, 'Report.json')
assert.equal(hash(reportFile), 'dd9017bd7564776e5015c472405130b6aa172e9675b305c78336f9669c301e1b')
const report = read(reportFile)
assert.equal(report.status, 'AUTHOR_ONLY_LABEL_REPAIR_NATIVE_PASS_VISUAL_HOLD')
assert.equal(report.allExecAndBrowserSessions.execSessionsOpen, 0)
assert.equal(report.allExecAndBrowserSessions.browserSessionsOpen, 0)
const references = new Map([[reportFile, bind(reportFile)]])
function add(item) {
  assert.equal(hash(item.path), item.sha256, item.path)
  references.set(item.path, { path: item.path, sha256: item.sha256 })
}
function addBindings(value) {
  if (!value || typeof value !== 'object') return
  if (value.path && value.sha256) add(value)
  else for (const child of Object.values(value)) addBindings(child)
}
for (const item of report.allOwnedEvidenceManifest) {
  assert.ok(item.path.startsWith(own + '/'), item.path)
  if (item.sha256) add(item)
}
addBindings(report.current)
addBindings(report.historical)
addBindings(report.firstSeal)
assert.equal(fs.statSync(report.firstSeal.ownFirst.path).mode & 0o777, 0o444)
const receiptFacts = report.executions.map(item => {
  add(item.binding)
  const actual = read(item.binding.path)
  assert.equal(actual.cwd ?? actual.workdir, repo)
  assert.equal(actual.exitCode ?? actual.exit_code ?? actual.returncode, item.exitCode)
  for (const stream of Object.values(actual.streams)) add(stream)
  return { stage: item.stage, execution: bind(item.binding.path),
    exitCode: item.exitCode, replayed: false }
})
assert.equal(read(report.current.render.path).status, 'pass')
const collectionRoot = path.join(tmp, 'n29-fig187-label-repair-author-collection-06')
fs.mkdirSync(collectionRoot)
const collectionFile = path.join(collectionRoot, 'collection.json')
save(collectionFile, {
  status: 'FIG187_H_LABEL_NATIVE_REPAIRED_SIX_SPAN_VISUAL_HOLD',
  report: bind(reportFile), current: report.current, edit: report.edit,
  receiptFacts, firstSeal: report.firstSeal, native: report.native,
  physicalDisplay: report.physicalDisplay, authorVisual: report.authorVisual,
  holds: report.holds, totals: report.totals, imageLedger: report.imageLedger,
  historical: report.historical, unaffected: report.unaffected,
  nativeValidationStreamLimitation: report.nativeValidationStreamLimitation,
  completedChildReportsAllOwnSessionsEnded: true,
  nativePASSDoesNotEstablishVisualFidelity: true,
  independentReviewPending: true, parentImageLoads: 0, wholeLessonApproved: false,
  published: false,
})
add(bind(collectionFile))
const textRepair = read(path.join(tmp, 'n29-panel-reference-repair-06/repair.json'))
const repairInput = path.join(collectionRoot, 'six-span-repair-author-input.json')
save(repairInput, {
  status: 'AUTHOR_ONLY_FIG187_SIX_OFFCANVAS_BRACKET_SPANS_REPAIR',
  figure: 'fig-187', source: report.current.source,
  currentModernText: textRepair.repairedLesson,
  currentModernTextPanelRepairAffectedReviewPending: true,
  previousSpec: report.current.spec, previousSvg: report.current.svg,
  previousRender: report.current.render, priorContext: report.current.context,
  report: bind(reportFile), collection: bind(collectionFile),
  visualFailure: report.holds[0],
  scope: 'Repair only six h/r bracket paths so their source spans are visible in the same intended places. Preserve all circle/point/line geometry, h/r values, inequalities, point names, three panel order and repaired h/B label placements.',
  technicalCause: 'Raw svgPath layer applies scale(30 30) to already-pixel path coordinates. Correct coordinate representation, not physical lengths or source givens.',
  priorNativeRenderPASSNotReplayedWithoutNewSpec: true,
  expectedHistoricalCharges: 16, historicalNativeRenderFailures: 3,
  historicalFigureRepairCount: 3, priorVisualFailureCount: 1,
  parentPermanentImageLoads: 24, freshBatchMaxChargedImages: 8,
  doNotOpenOrEdit186188189OrAnyProse: true,
  modernPanelReferencesAreNewCopyOnlyNotOriginalSourceGlyphIdentity: true,
  independentReviewPending: true, wholeLessonApproved: false, published: false,
})
add(bind(repairInput))
add(bind(path.join(tmp, 'collect-n29-fig187-label-repair-author-06.mjs')))
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-n29/fig187-label-repair-author06',
  [...references.values()],
  ['evidence/stemrobin188-6g-n29/fig187189-author-first06/retention.json'],
  {
    status: 'FIG187_H_LABEL_NATIVE_REPAIRED_SIX_SPAN_VISUAL_HOLD',
    chargedImagesThisContext: 8, actualImageOpens: 2, historicalImageCharges: 8,
    cumulativeConservativeImageCharges: 16,
    historicalFailedRenders: 3, ownNativeRenderFailures: 0,
    nativeRenderPASSOnly: true, sourceVisualFailureCount: 1,
    nativeRepairsAcrossHistory: 3, labelOnlyEdit: true,
    sixOffcanvasBracketSpansHoldPreserved: true, panelTextAffectedReviewStillPending: true,
    sourceReopens: 0, rendererReplays: 0, authorOnlyNotIndependentApproval: true,
  },
)
console.log(JSON.stringify({
  collection: bind(collectionFile), retained, nextRepairAuthorInput: bind(repairInput),
}))
