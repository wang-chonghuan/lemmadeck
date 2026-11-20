import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const author = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d185-n21-figures32-33-author')
const output = path.join(cwd, '.tmp/STEMROBIN-181/d1816-d185/figures')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = data => crypto.createHash('sha256').update(data).digest('hex')
const binding = file => {
  const data = fs.readFileSync(file)
  return { path: file, bytes: data.length, sha256: hash(data) }
}
function writeNew(file, value) {
  assert.ok(file.startsWith(`${author}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  fs.chmodSync(file, 0o444)
  return binding(file)
}
const finalCopies = []
function freeze(file, relative) {
  const target = path.join(author, 'frozen', relative)
  assert.ok(target.startsWith(`${author}/`))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(target, 0o444)
  const item = { original: binding(file), frozen: binding(target) }
  assert.equal(item.original.sha256, item.frozen.sha256)
  finalCopies.push(item)
  return item.frozen
}
const prepared = read(path.join(author, 'prepared-bindings.json'))
const inspection = read(path.join(author, 'author-inspection.json'))
const repair = read(path.join(author, 'fig-33.repair-consumption.json'))
const attempt1 = read(path.join(author, 'fig-33.render-attempt-1.json'))
const attempt2 = read(path.join(author, 'fig-33.render-attempt-2.json'))
const candidateDir = path.join(output, 'attempt-2')
const render = read(path.join(candidateDir, 'fig-33.render.json'))
assert.equal(attempt2.exitCode, 0)
assert.equal(render.status, 'pass')
assert.equal(inspection.actualImageOpens, 3)
assert.equal(repair.totalContentRepairsConsumed, 1)
const specPath = path.join(output, 'fig-33.spec.json')
const spec = read(specPath)
assert.equal(binding(specPath).sha256, render.spec.sha256)
assert.equal(binding(path.join(cwd, render.output.svg.path)).sha256, render.output.svg.sha256)
const currentGeometry = writeNew(path.join(author, 'fig-33.current-geometry.json'), {
  schema: 'ld-s10y-image/author-current-geometry@1',
  spec: binding(specPath),
  sourceInventory: binding(path.join(author, 'fig-33.source-inventory.json')),
  coordinateMeaning: 'Schematic exact rendering geometry, not numerical measurements supplied by the source.',
  renderRelevantObjects: spec.objects,
  assertions: spec.assertions,
  initialDraftBasis: {
    binding: binding(path.join(author, 'fig-33.geometry-basis.json')),
    status: 'Historical initial draft. Two label anchors were adjusted before the first render; this current receipt and the final spec are operative.',
  },
  initialPreRenderCompositionAdjustment: {
    repairConsumed: false,
    reason: 'Initial placement work before any rendering, not a repair of a failed candidate.',
    n: { initial: [310, 142], current: [262, 152] },
    alpha: { initial: [318, 184], current: [337, 174] },
  },
  solePostFailureContentRepair: repair.targetedChange,
  independentReview: false,
})
const candidates = {
  spec: freeze(specPath, 'candidate/fig-33.spec.json'),
  svg: freeze(path.join(candidateDir, 'fig-33.svg'), 'candidate/fig-33.svg'),
  render: freeze(path.join(candidateDir, 'fig-33.render.json'), 'candidate/fig-33.render.json'),
  display640: freeze(path.join(candidateDir, 'fig-33.display640.png'), 'candidate/fig-33.display640.png'),
  currentGeometry: freeze(currentGeometry.path, 'candidate/fig-33.current-geometry.json'),
}
const receipts = {}
for (const name of [
  'fig-32.source-inventory.json', 'fig-33.source-inventory.json',
  'routing.json', 'prepared-bindings.json', 'author-inspection.json',
  'discovery-failure.json', 'native-read-failure.json',
  'fig-33.render-attempt-1.json', 'fig-33.render-attempt-2.json',
  'fig-33.repair-consumption.json',
]) {
  receipts[name] = freeze(path.join(author, name), `author/${name}`)
}
const failedAttemptSnapshots = []
for (const name of fs.readdirSync(path.join(output, 'attempt-1'))) {
  failedAttemptSnapshots.push(freeze(
    path.join(output, 'attempt-1', name), `failure/attempt-1/${name}`,
  ))
}
for (const name of ['spec.before-render.json', 'stdout.txt', 'stderr.txt']) {
  freeze(path.join(candidateDir, name), `evidence/attempt-2/${name}`)
}
const toolBindings = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.intentfold/charter/product.md',
  '.intentfold/charter/ui.md',
].map(relative => binding(path.join(cwd, relative)))
for (const name of ['author.mjs', 'render-once.mjs', 'finalize-author.mjs']) {
  freeze(path.join(author, name), `tooling/${name}`)
}
const usage = {
  nativeContextCallsInherited: 4,
  nativeContextProducerCallsThisAuthor: 0,
  nativeContextsReplayed: false,
  nativeFigureRendererCallsThisAuthor: 2,
  nativeFigureRendererSuccessfulCalls: 1,
  standaloneSpecCheckerCallsThisAuthor: 0,
  rendererInternalSpecValidationInvocations: 2,
  explanation: 'The proven renderer validates its own input on each invocation. Only its failed render stage was retried after one targeted spec repair; no standalone passed checker was rerun.',
  totalActualImageOpens: 3,
  totalContextImageOpens: 3,
  parentImageOpens: 0,
  remainingActualImageOpens: 5,
  remainingContextImageOpens: 21,
  fig32InheritedContentRepairs: 0,
  fig32TotalContentRepairs: 0,
  fig33InheritedContentRepairs: 0,
  fig33TotalContentRepairs: 1,
  inheritedN21TextRepairs: 1,
  textRepairsThisAuthor: 0,
  textReviewsThisAuthor: 0,
  modelCalls: 0,
  paidCalls: 0,
  networkCalls: 0,
  generationCalls: 0,
  independentFigureReviewCalls: 0,
  sourceReviewReplayCalls: 0,
  nativeLessonFinalizeCalls: 0,
  nativeLessonRenderCalls: 0,
  supervisorOrPeerMessages: 0,
  canonicalPromotions: 0,
  completeCoursesAdded: 0,
  databaseCalls: 0,
  publisherCalls: 0,
  gitCalls: 0,
  deployCalls: 0,
}
const failures = [
  {
    stage: 'read-only discovery', exitCode: 2,
    receipt: receipts['discovery-failure.json'],
    classification: 'Technical absent output directory; subsequently created within the authorized boundary.',
    contentRepairsConsumed: 0, candidateSnapshot: null, resolved: true,
  },
  {
    stage: 'read-only native context read', exitCode: 1,
    receipt: receipts['native-read-failure.json'],
    classification: 'Technical path typo; read only the failed fourth file at the corrected path.',
    contentRepairsConsumed: 0, candidateSnapshot: null, resolved: true,
  },
  {
    stage: 'first native figure render', exitCode: attempt1.exitCode,
    receipt: receipts['fig-33.render-attempt-1.json'],
    classification: 'Unsupported degenerate marker on a short rotation arrow; one targeted content/interface repair consumed conservatively despite exitCode 1.',
    contentRepairsConsumed: 1,
    diagnosis: receipts['fig-33.repair-consumption.json'],
    candidateSnapshot: attempt1.specSnapshot,
    rasterOrSvgAtFailure: null,
    immutableFailureSnapshots: failedAttemptSnapshots,
    resolved: true,
  },
]
const report = {
  schema: 'bounded-modern-figure-author-report@1',
  ticket: 'STEMROBIN-181', batch: 'D185', book: '10p', lesson: 'phy10-c1-s3-n21',
  cwd, date: '2026-11-20',
  role: 'FIRST_BOUNDED_AUTHOR',
  status: 'PARTIAL_AUTHORREADY_WITH_HOLD',
  invocation: 'Same offline production invocation; finish=review and Grill=self retained. No setup/freshness/grill repeat.',
  authority: prepared.authority,
  bilingualFulltext: prepared.texts,
  nativeContextReceipts: prepared.native,
  figures: {
    'fig-32': {
      status: 'HOLD', authorready: false, requiredMode: 'hybrid',
      sourceInventory: receipts['fig-32.source-inventory.json'],
      routing: receipts['routing.json'],
      holdReason: 'Semantic physical CRT artwork is indispensable and no generation is authorized. Exact degraded screen lattice counts are unresolved. No invented deterministic apparatus or numeric time/voltage calibration.',
      safety: 'Descriptive historic CRT only, never a live-mains child experiment.',
      spec: null, svg: null, artwork: null, render: null,
      inheritedRepairs: 0, totalContentRepairs: 0,
      remainingContentRepairs: 1,
      candidateRenderAttempts: 0,
      remainingTheoreticalCandidateAttempts: 2,
      currentlyExecutableCandidateAttempts: 0,
      figureApproved: false,
    },
    'fig-33': {
      status: 'authorready', authorready: true, mode: 'deterministic',
      candidates,
      sourceInventory: receipts['fig-33.source-inventory.json'],
      authorInspection: receipts['author-inspection.json'],
      nativeRenderReceipt: receipts['fig-33.render-attempt-2.json'],
      renderer: render.renderer,
      validationStatus: 'pass via renderer internal FigureSpec validator',
      renderStatus: render.status,
      assertionCount: spec.assertions.length,
      display: spec.display,
      measuredMinLabelPx: render.displayChecks[0].measuredMinPx,
      alphaMeaning: 'Angle between loop NORMAL and B. Accumulated rotational phase remains explained only in the retained approved text; no new numeric angle is visible.',
      inheritedRepairs: 0, totalContentRepairs: 1,
      remainingContentRepairs: 0,
      candidateRenderAttempts: 2,
      remainingCandidateAttempts: 0,
      independentReview: null,
      figureApproved: false,
      promotableNow: false,
      metadataScope: 'Offline author candidates retain scoped temporary paths. No durable-output/promotion review is claimed.',
    },
  },
  usage,
  failures,
  allFailuresPreserved: true,
  repairsReset: false,
  inputsTemplatesCarrierRootEdited: false,
  writeBoundaries: [author, output],
  otherAuthorsEditsPreserved: true,
  noIndependentReviewOrPromotion: true,
  noCourseApproval: true,
  productAcceptance: false,
  formalHandoff: false,
  authorFreezePath: path.join(author, 'author-freeze.json'),
  nextBoundary: 'Parent collects and closes this author before starting the separate figure reviewer. This author sends no supervisor or peer messages.',
}
const reportBinding = writeNew(path.join(author, 'report.json'), report)
const freezeBinding = writeNew(path.join(author, 'author-freeze.json'), {
  schema: 'bounded-modern-figure-author-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D185', book: '10p', lesson: 'phy10-c1-s3-n21',
  cwd, date: '2026-11-20', status: report.status,
  report: reportBinding,
  immutableInputCopies: prepared.copies,
  bilingualFulltext: prepared.texts,
  inheritedTextAuthority: prepared.authority,
  nativeContextReceipts: prepared.native,
  immutableFinalCopies: finalCopies,
  candidates,
  currentGeometry,
  authorInspection: receipts['author-inspection.json'],
  sourceInventories: [receipts['fig-32.source-inventory.json'], receipts['fig-33.source-inventory.json']],
  toolBindings,
  usage,
  failures,
  policy: {
    snapshotPermissions: '0444',
    exclusiveCreation: true,
    valuesAreActualFileBytesAndSha256: true,
    selfHash: 'Returned separately to avoid circular hashing.',
    inspectionIsAuthorOnly: true,
    sourceInventorySavedFromOriginalPixelsBeforeSpecs: true,
    noIndependentFigureApproval: true,
    noNativeContextReplay: true,
    noTextReviewReplay: true,
    noCanonicalPromotion: true,
    noWholeCourseApproval: true,
    invalidatedByChangedFrozenBytes: true,
  },
})
fs.chmodSync(specPath, 0o444)
console.log(JSON.stringify({ report: reportBinding, authorFreeze: freezeBinding }, null, 2))
