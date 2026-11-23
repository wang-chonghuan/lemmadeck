import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const O = path.dirname(fileURLToPath(import.meta.url))
const T = path.dirname(O)
assert.equal(process.cwd(), W)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const write = (file, data) => {
  assert.ok(file.startsWith(`${O}/`))
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const contextFile = path.join(T, 'n30-proposed-math-preview-18/context.json')
const context = read(contextFile)
assert.equal(hash(contextFile), 'a51ae14d6bcf5ec8d24c9907bc04e663469671a9cdf1e9b7efd8aaf13fcd7236')
const before = read(path.join(O, 'inputs-before.json'))
const inputs = [before.context, before.lesson, before.raw, ...before.figures.map(f => f.source)]
for (const input of inputs) assert.equal(hash(input.path), input.sha256)
write(path.join(O, 'inputs-after.json'), {
  unchanged: true, files: inputs.map(i => bind(i.path)),
  rawSourceEdited: false, contextEdited: false, candidateLessonEdited: false,
})
const stateFile = path.join(O, 'state.json')
const state = read(stateFile)
assert.equal(state.counters.chargedImageAttempts, 6)
assert.equal(state.counters.imageContextLoads, 6)
assert.equal(state.imageAttempts.length, 6)
for (const image of state.imageAttempts) {
  assert.equal(hash(image.path), image.sha256)
  image.outcome = 'opened-and-author-observed'
}
state.status = 'AUTHOR_DRAFT_COMPLETE_HOLD_INDEPENDENT_REVIEW_AND_PROPOSAL_REGISTRATION'
state.counters.successfulImageOpens = 6
state.counters.failedImageOpens = 0
state.counters.imageReopens = 0
state.counters.imageCropsLoaded = 0
state.counters.screenshotOutputsGenerated = 4
state.counters.displayWidthFigureChecks = 8
state.counters.semanticOrDisplayRepairs = 2
state.counters.failedChargedImageAttempts = 0
state.counters.remainingChargedImageAttempts = 2
state.counters.remainingImageContextCapacity = 18
state.imageAccounting = 'Generated screenshots and browser pixel decoding do not enter image-bearing model context. Every original/output functions.view_image call was charged; there were no failed calls, reopens or crops.'
state.executionAccounting = {
  initialAuthorVersions: 2,
  figureSpecRevisionsIncludingInitialAuthoring: 5,
  changedCandidatesAfterInitialAuthoring: 3,
  textScopeRepair: 'Both specs revised; first fig-190 validation failure kept immutable.',
  pLabelRepair: 'Only fig-191 label anchor revised; failed render/SVG/spec kept immutable.',
  technicalDisplayRepair: 'One missing pngjs import failure, then browser canvas implementation, no dependency installation.',
  preparationToolFailure: 'One nonexistent scripts/ path in initial discovery; retained in state, no image or source-content effect.',
  totalObservedFailedExecutionAttempts: 4,
  failedContentGateAttempts: 2,
  failedTechnicalStageAttempts: 1,
  failedPreparationToolAttempts: 1,
}
fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`)
const display = read(path.join(O, 'display/checks.json'))
assert.equal(display.checks.length, 8)
assert.deepEqual(display.requests, [])
assert.deepEqual(display.errors, [])
const sourceInventory = read(path.join(O, 'source-inventory.json'))
const figures = ['fig-190', 'fig-191'].map(id => {
  const specPath = path.join(O, 'figures', `${id}.spec.json`)
  const spec = read(specPath)
  const renderPath = path.join(O, 'figures', `${id}.render.json`)
  const render = read(renderPath)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specPath))
  assert.equal(render.output.svg.sha256, hash(path.join(W, render.output.svg.path)))
  const group = spec.source.inventory[0]
  assert.deepEqual(group.requires, ['pointRelationships'])
  const groupIDs = new Set(group.objects)
  const assertionByID = new Map(spec.assertions.map(a => [a.id, a]))
  const points = spec.objects.filter(o => o.type === 'point')
  const pointIDs = new Set(points.map(p => p.id))
  const coverage = points.map(point => {
    assert.ok(groupIDs.has(point.id))
    const covering = group.assertions.filter(id => {
      const assertion = assertionByID.get(id)
      assert.ok(assertion)
      const fields = {
        distance: ['a', 'b'], equalDistance: ['a', 'b', 'c', 'd'],
        perpendicular: ['a', 'b', 'c', 'd'], collinear: ['a', 'b', 'c'],
        pointOnLine: ['point', 'a', 'b'], pointOnCircle: ['point', 'center'],
        parallel: ['a', 'b', 'c', 'd'],
      }[assertion.type] || []
      const refs = fields.map(f => assertion[f]).filter(f => pointIDs.has(f))
      return new Set(refs).size >= 2 && refs.includes(point.id) && refs.every(p => groupIDs.has(p))
    })
    assert.ok(covering.length > 0, `Missing within-group source point coverage: ${point.id}`)
    return { point: point.id, label: point.label, assertionsWhollyWithinGroup: covering }
  })
  const literalCrossings = id === 'fig-191' ? [
    { sourcePoint: 'unlabelled lower circle/p intersection', coordinate: [-4, -3], objects: ['construction-circle', 'construction-p'], assertions: ['lower-crossing-on-circle', 'lower-crossing-on-p'] },
    { sourcePoint: 'unlabelled left circle/horizontal intersection', coordinate: [-5, 0], objects: ['construction-circle', 'construction-horizontal'], assertions: ['left-crossing-on-circle', 'left-crossing-on-horizontal'] },
    { sourcePoint: 'unlabelled right circle/horizontal intersection', coordinate: [5, 0], objects: ['construction-circle', 'construction-horizontal'], assertions: ['right-crossing-on-circle', 'right-crossing-on-horizontal'] },
  ] : []
  for (const crossing of literalCrossings) {
    assert.ok(crossing.objects.every(object => groupIDs.has(object)))
    assert.ok(crossing.assertions.every(id => group.assertions.includes(id) && assertionByID.has(id)))
  }
  const opened = state.imageAttempts.filter(a => a.figure === id)
  assert.equal(opened.length, 3)
  const observed = sourceInventory.figures.find(f => f.id === id)
  const observation = {
    id, status: 'AUTHOR_DRAFT_OBSERVED_NOT_INDEPENDENTLY_REVIEWED',
    sourcePNGActuallyOpened: true, openedEvidence: opened,
    visibleSourcePoints: coverage, unlabelledSourceCrossings: literalCrossings,
    sourceFootprint: observed.footprint,
    sourceDashes: 'None observed; all instructional strokes preserved as solid.',
    knownGivenLabels: id === 'fig-190' ? ['top c', 'top a', 'a on CB', 'c on AB'] : ['a above CB', 'c beside AB', 'p on perpendicular'],
    mobileObservation: id === 'fig-190'
      ? 'At actual 358 px media width: both capped bars and their c/a labels readable; A upper-left, C lower-left, B lower-right; right-angle mark at C; a on CB and c on AB readable; three solid sides, no dots or extra quantities.'
      : 'At actual 358 px media width: circle complete and round; p passes through C and upper A and continues through unlabelled lower crossing. Horizontal passes through C and centre B and both circle crossings. AB and a/c/p labels readable. No second diagonal, invented dot, right-angle box or numeric given.',
    desktopObservation: 'At 640 px media in desktop 1440 viewport: inspected full output, no missing instructional object, clipped label or incoherent overlap. Screenshot includes the surrounding prose figure/caption; its outer width is not the SVG media width.',
    naturalCanvas: spec.canvas,
    naturalMobileMediaHeight: 358 * spec.canvas.height / spec.canvas.width,
    finalLabelMeasurements: display.checks.filter(c => c.figure === id).map(c => ({
      mediaWidth: c.width, height: c.height, viewport: c.viewport.width, minimumTextPx: c.minTextPx,
    })),
    sourceUncertainty: observed.uncertainty,
    deliberateRegularization: observed.regularization,
    forbiddenAdditionAudit: 'No answer key, exercise solution, new branch label, second triangle, extra numeric label, guessed source ratio or correction-approval claim added.',
  }
  write(path.join(O, `${id}.author-observations.json`), observation)
  return {
    id, mode: 'deterministic', purpose: 'instructional',
    status: 'DRAFT_READY_FOR_INDEPENDENT_REVIEW_NOT_PROMOTABLE',
    source: spec.source.image, spec: bind(specPath),
    svg: bind(path.join(O, 'figures', `${id}.svg`)),
    render: bind(renderPath),
    authorObservations: bind(path.join(O, `${id}.author-observations.json`)),
    objects: render.objects, labels: render.labels,
    sourcePointCoverage: { namedPoints: coverage, unlabelledCrossings: literalCrossings },
    screenshots: ['mobile-prose', 'desktop-max'].map(label => ({
      image: bind(path.join(O, 'display', `${id}-${label}.png`)),
      pixels: bind(path.join(O, 'display', `${id}-${label}.pixels.json`)),
    })),
    review: null, independentReviewStatus: 'NOT_PERFORMED',
  }
})

function filesBelow(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(item =>
    item.isDirectory() ? filesBelow(path.join(dir, item.name)) : [path.join(dir, item.name)])
}
const fileList = filesBelow(O)
assert.equal(fileList.filter(f => /review.*\.json$|\.review\.json$/.test(path.basename(f))).length, 0)
const manifestPath = path.join(O, 'manifest.json')
write(manifestPath, {
  schema: 'same188-6/offline-image-author-manifest@1',
  status: state.status, ticket: 'STEMROBIN-188', lesson: 'geo68-c2-s4-n30',
  scope: ['fig-190', 'fig-191'], ownerOnlyNewDirectory: O, cwd: W,
  sourceBindingsUnchanged: true, inputsBefore: bind(path.join(O, 'inputs-before.json')),
  inputsAfter: bind(path.join(O, 'inputs-after.json')),
  sourceInventory: bind(path.join(O, 'source-inventory.json')),
  literalSourceC: sourceInventory.literalSourceC,
  mathematicalRadiusc: sourceInventory.mathematicalRadiusc,
  figures, counters: state.counters, executionAccounting: state.executionAccounting,
  state: bind(stateFile),
  display: {
    html: bind(path.join(O, 'draft-display/geo68-c2-s4-n30/text.html')),
    scope: bind(path.join(O, 'draft-scope.json')),
    checks: bind(path.join(O, 'display/checks.json')),
    execution: bind(path.join(O, 'display/execution.json')),
    authoritativeSurface: 'Offline draft only; no application started or inspected.',
    likelyMobileProseWidth: 358, narrowWidth: 331, width640: 640, desktopMaximum: 640,
    headedProductCheck: false, offlineHeadlessChecks: true,
  },
  firstFailures: fileList.filter(f => f.includes('/failures/')).map(bind),
  immutableSpecHistory: fileList.filter(f => f.includes('/snapshots/')).map(bind),
  constraints: {
    networkCalls: 0, paidCalls: 0, modelCalls: 0, dbCalls: 0, envAccess: false,
    gitOperations: false, dependencyChanges: false, appChangesOrRuntime: false,
    charterChanges: false, otherLessonsAuthored: false, newAgents: false,
    answerKeysAccessedOrProduced: false, svgManuallyEdited: false,
    reviewPASSFileWritten: false, sourceCorrectionApprovalClaim: false,
    registeredErrata: 0, nativeFinalization: false, canonicalPromotion: false,
  },
  holds: [
    'Sole independent source-fidelity/math/visual reviewer has not reviewed these drafts.',
    'C-to-c proposal comparison, approval and registration remain pending. Current coherent geometry is proposed mathematical preview only.',
    'No complete lesson approval, native finalization, DB write, canonical asset promotion or live-app acceptance is authorized.',
  ],
  files: fileList.map(bind),
})
console.log(JSON.stringify({
  manifest: bind(manifestPath), status: state.status,
  figures: figures.map(f => ({ id: f.id, spec: f.spec.sha256, svg: f.svg.sha256, render: f.render.sha256 })),
  counters: state.counters,
}, null, 2))
