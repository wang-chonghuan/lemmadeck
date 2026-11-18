import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = process.cwd()
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
assert.equal(root, path.join(tmp, 'd550-n73-fig158159-first-independent-review'))
const author = path.join(tmp, 'd537-n73-first-modern-figure-author')
const contextsRoot = path.join(tmp, 'd535-n73-first-figure-contexts')
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const absolute = file => path.resolve(repo, file)
const bind = file => {
  const resolved = absolute(file)
  return {
    path: resolved,
    sha256: hash(fs.readFileSync(resolved)),
    mode: (fs.statSync(resolved).mode & 0o777).toString(8).padStart(4, '0'),
  }
}
const read = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'))
const verify = record => {
  const current = bind(record.path)
  assert.equal(current.sha256, record.sha256, `Changed input: ${current.path}`)
  return { ...current, expectedSha256: record.sha256, hashMatches: true }
}
const writeNew = (name, value) => {
  fs.writeFileSync(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
}
for (const name of ['report.json', 'review-freeze.json', 'READY.json']) {
  assert.equal(fs.existsSync(path.join(root, name)), false, 'Do not overwrite a closed review')
}
const anchors = [
  { path: path.join(author, 'report.json'), sha256: '2f49f83facb5df1868f11ed83f802c2cf44f074d3246fd2165b9ae96273331b6' },
  { path: path.join(author, 'author-freeze.json'), sha256: 'deb0f8af88181e13438eb3b4ed243f2cf88e2ff60e945c4a46b28b98b1ffed7e' },
  { path: path.join(contextsRoot, 'manifest.json'), sha256: '98025ba46ba8227721246f58ca9882f834e79f896046e34907dc171f7bc28bb9' },
].map(verify)
const authorFreeze = read(anchors[1].path)
const authorFileRecords = authorFreeze.files.map(verify)
assert.equal(authorFileRecords.length, 125)
assert.equal(authorFreeze.fileCountIncludingThisManifest, 126)
assert.ok(authorFileRecords.every(file => file.mode === '0444'))
assert.equal(anchors[0].mode, '0444')
assert.equal(anchors[1].mode, '0444')
const manifest = read(anchors[2].path)
const text = { en: verify(manifest.fullEN), zh: verify(manifest.fullZH) }
const textReview = verify(manifest.textReview)
const inventoryFile = path.join(root, 'independent-inventory.json')
const inventory = read(inventoryFile)
assert.equal(inventory.recordedBeforeAnyCandidateImageOpen, true)
assert.equal(inventory.authorInventoryUsed, false)
const opensFile = path.join(root, 'actual-opens.json')
const opens = read(opensFile)
assert.equal(opens.totalActualOpens, 6)
assert.equal(opens.contextImageCount, 6)
assert.equal(opens.opens.length, 6)
assert.equal(opens.closed, true)
opens.opens.forEach(verify)
assert.deepEqual(opens.opens.map(item => item.order), [1, 2, 3, 4, 5, 6])
const firstFile = path.join(root, 'candidate-first-observations.json')
const first = read(firstFile)
assert.equal(first.figures.find(item => item.figure === 'fig-159').FIGAtThisStage, 'FAIL')
const previewFile = path.join(root, 'preview2-generation.json')
const preview = read(previewFile)
assert.equal(preview.screenshotsCreated, 2)
assert.equal(preview.resvgGenerated, 0)
assert.equal(preview.browserClosed, true)
verify(preview.sourceCSS)
const firstAuthorVisual = read(path.join(author, 'first-author-visual.json'))
const authorReport = read(anchors[0].path)
const repair = read(path.join(author, 'repair.json'))
const nativeDisplay = read(path.join(author, 'display-after.json'))
verify(nativeDisplay.sourceCSS)
const tools = [
  path.join(repo, '.agents/skills/ld-s10y-image/SKILL.md'),
  path.join(repo, '.agents/skills/ld-s10y-image/references/quality-gate.md'),
].map(bind)
const makeMapping = (spec, ids, item, objectIds, assertionIds = [], status = 'PASS', note = '') => {
  assert.ok(objectIds.every(id => ids.has(id)), `Missing mapped object for ${item.id}`)
  assert.ok(assertionIds.every(id => spec.assertions.some(entry => entry.id === id)))
  return { independentSourceItem: item.id, objectIds, assertionIds, status, note }
}
const figures = ['fig-158', 'fig-159'].map(figure => {
  const entry = manifest.contexts.find(item => item.figure === figure)
  const source = verify(entry.originalImage)
  const context = verify(entry.context)
  const dir = path.join(author, figure, 'after')
  const specFile = path.join(dir, 'spec.json')
  const spec = read(specFile)
  const renderFile = path.join(dir, 'render.json')
  const render = read(renderFile)
  verify(spec.source.image)
  verify(render.spec)
  verify(render.output.svg)
  const fullTextEmbeddedMatches = {}
  for (const language of ['en', 'zh']) {
    const current = read(text[language].path)
    const heading = language === 'en' ? 'English' : 'Chinese'
    const expected = `[${heading}: complete approved edition prose]\n${current.prose.map(item => item.text || item.label || '').filter(Boolean).join('\n\n')}`
    fullTextEmbeddedMatches[language] = spec.source.authoritativeText.some(item => item.lesson === current.id && item.text === expected)
  }
  assert.ok(Object.values(fullTextEmbeddedMatches).every(Boolean))
  const ownSource = inventory.figures.find(item => item.figure === figure)
  const ids = new Set(spec.objects.map(item => item.id))
  const allAssertions = spec.assertions.map(item => item.id)
  const objectIds = spec.objects.map(item => item.id)
  const mapping = []
  for (const item of ownSource.items) {
    let objects = []
    let assertions = []
    let status = 'PASS'
    let note = 'Qualitative visible source structure; not approval of unresolved original-source details.'
    if (figure === 'fig-158') {
      if (item.id.endsWith('single-panel')) objects = ['source-S', 'source-water-surface', 'modern-water-region']
      if (item.id.endsWith('surface')) {
        objects = ['source-water-surface', 'source-interface-left', 'source-interface-right', 'modern-water-region']
        assertions = allAssertions.filter(id => id.endsWith('-on-interface'))
        note = 'Irregular water hatching is replaced by a labelled pale water region; no source instructional lattice is lost.'
      }
      if (item.id.endsWith('source-S')) {
        objects = ['source-S', 'source-S-label']
        assertions = allAssertions.filter(id => id.endsWith('-incident-connects'))
      }
      for (const [suffix, ending] of [['incident-fan', '-incident'], ['transmitted-fan', '-refracted'], ['reflected-fan', '-reflected']]) {
        if (item.id.endsWith(suffix)) {
          objects = spec.objects.filter(object => object.type === 'arrow' && object.id.endsWith(ending)).map(object => object.id)
          assertions = objects.map(id => `${id}-connects`)
        }
      }
      if (item.id.endsWith('direction')) {
        objects = spec.objects.filter(object => object.type === 'arrow').map(object => object.id)
        assertions = allAssertions.filter(id => id.endsWith('-connects') || id.endsWith('-reflection-direction'))
      }
      if (item.id.endsWith('strength')) {
        objects = spec.objects.filter(object => object.type === 'arrow').map(object => object.id).concat('modern-strength')
        note = 'Qualitative stroke-weight progression is visible; no Fresnel coefficient, intensity conservation or exact source linewidth certified.'
      }
      if (item.id.endsWith('labels')) objects = ['source-S-label', 'modern-heading', 'modern-air', 'modern-water', 'modern-strength']
    } else {
      if (item.id.endsWith('single-bundle') || item.id.endsWith('loop')) {
        objects = objectIds.filter(id => /^source-loop-strand-/.test(id)).concat('source-input-end-face', 'source-output-end-face')
        assertions = allAssertions
        status = 'FAIL'
        note = 'Complete closed circles plus collinear terminal segments leave a visible straight bypass and a loop/straight merge. Counts and tangency do not establish a single curved input-output route.'
      }
      if (item.id.endsWith('left-end')) objects = ['source-input-end-face', 'modern-input', 'source-loop-strand-0-input', 'source-loop-strand-8-input']
      if (item.id.endsWith('right-end')) objects = ['source-output-end-face', 'modern-output', 'source-loop-strand-0-output', 'source-loop-strand-8-output']
      if (item.id.endsWith('end-correspondence')) {
        objects = ['source-input-end-face', 'source-output-end-face', 'modern-correspondence']
        assertions = allAssertions.filter(id => id.endsWith('-matched-terminal-level'))
        note = 'The modern matching-order caption and equal terminal levels are present; original pixel-by-pixel order stays HOLD and a guided route through the loop is not proved.'
      }
      if (item.id.endsWith('labels-direction')) {
        objects = ['modern-input', 'modern-output', 'modern-bundle', 'modern-heading', 'modern-correspondence']
        note = 'Input/Output are clearly labelled modern direction conventions. No source arrows, prism, numerical bend radius or internal optical ray is inferred.'
      }
    }
    assert.ok(objects.length, `Unmapped independent item: ${item.id}`)
    mapping.push(makeMapping(spec, ids, item, objects, assertions, status, note))
  }
  const mobile = preview.figures.find(item => item.figure === figure)
  verify(mobile.inputSVG)
  verify(mobile.screenshot)
  const oldVisual = firstAuthorVisual.figures.find(item => item.figure === figure)
  verify(oldVisual.firstPNG)
  const authorFigure = authorReport.figures.find(item => item.figure === figure)
  const authorRepair = repair.figures.find(item => item.figure === figure)
  assert.equal(authorRepair.repairCount, 1)
  assert.equal(authorRepair.additionalRepairAllowed, false)
  const firstObservation = first.figures.find(item => item.figure === figure)
  const mobileObservation = figure === 'fig-158'
    ? 'At actual 342px width, S, water-air interface, all visible upper branches and the downward return directions remain discernible. The central downward return arrow is small but visible on its superposed normal trace. Thin near-grazing transmissions and thicker outer water returns are distinguishable. All five labels fit, are readable and do not occlude necessary geometry. Crowding at outer surface contacts does not erase the incident-versus-reflected direction distinction. The shaded lower medium is not a missing source lattice.'
    : 'At actual 342px width the two end faces, closed hollow loops and straight terminal bar remain visible. The merged/crossing lower strokes still permit an apparent direct Input-to-Output path without taking the loop. Matching fiber order is readable text, not visual proof of route continuity or guidance. This is the same topology failure first observed in the actual after native PNG, not resvg stroke loss; all original CSS-variable strokes render in Chromium.';
  return {
    figure,
    FIG: figure === 'fig-158' ? 'PASS' : 'FAIL',
    independent: true,
    onlyFirstNecessaryFIGObservations: true,
    signedBy: 'd550-one-shot-independent-FIG-context',
    source,
    context,
    spec: bind(specFile),
    render: bind(renderFile),
    outputs: [bind(path.join(dir, `${figure}.svg`)), bind(path.join(dir, `${figure}.png`))],
    currentText: text,
    currentTextReview: textReview,
    fullCurrentTextEmbeddedMatches: fullTextEmbeddedMatches,
    observations: {
      source: { evidence: bind(inventoryFile), actualOpenOrder: source.path === opens.opens[0].path ? 1 : 2, facts: ownSource.items, relationships: ownSource.relationships },
      finalAfterNative: { ...firstObservation, evidence: bind(firstFile), actualOpened: true },
      firstActualMobile: { png: bind(mobile.screenshot.path), width: mobile.screenshot.width, height: mobile.screenshot.height, actualOpenOrder: figure === 'fig-158' ? 5 : 6, actualOpened: true, observation: mobileObservation },
    },
    independentInventoryMapping: mapping,
    sourceRelationshipAssessment: ownSource.relationships.map(item => ({
      id: item.id,
      status: figure === 'fig-159' && ['d550-159-R-continuity', 'd550-159-R-curved-path'].includes(item.id) ? 'FAIL' : 'PASS',
      basis: 'Source-first inventory compared with first actual after native and actual-width Chromium pixels; original exact details not inferred.',
    })),
    inheritedNativeEvidenceOnly: {
      renderStatus: render.status,
      nativeRerun: false,
      validatorRerun: false,
      measuredMedia: nativeDisplay.figures.find(item => item.figure === figure).widths.map(item => ({ viewport: item.viewport, mediaWidth: item.mediaWidth, minTextPx: item.minTextPx })),
      displayEvidence: bind(path.join(author, 'display-after.json')),
      geometryEvidence: bind(path.join(author, 'geometry-check.json')),
      notIndependentFullcardDISPLAY: true,
    },
    actualMobileEvidence: {
      method: preview.method,
      generation: bind(previewFile),
      sourceSVG: mobile.inputSVG,
      mediaWidthPx: mobile.metrics.mediaWidth,
      minimumScreenFontPx: mobile.metrics.minScreenFontPx,
      nativeBasisTargetPx: 17,
      labels: mobile.metrics.labels,
      readableByActualObservation: true,
      notMeasuredTextInLieuOfReading: true,
      noResvgStrokeLossInference: true,
    },
    scopeChecks: {
      apparatus: figure === 'fig-158' ? 'Single underwater source/interface schematic, not the glass-disk apparatus of another figure.' : 'Fiber-bundle apparatus with two terminal faces; curved route fails the independent visual gate.',
      totalInternalReflection: figure === 'fig-158' ? 'Outer reflected families have no upward propagating continuation; nearly grazing inner branches are kept distinct.' : 'Conditions remain in approved full prose; no unsupported internal ray path or arbitrary-sharp-bend guarantee is introduced, but the apparatus route is ambiguous.',
      fortyFiveDegreePrism: 'NOT-APPLICABLE: absent from these two original PNGs and their current prose; not invented or certified.',
      rightAngleTurn: 'NOT-APPLICABLE: no source prism or standalone right-angle reflection device; a radius-versus-tangent perpendicular assertion is not an optical right-angle fold.',
      EnglishLabels: 'PASS',
      clippingAndLabelCollisionAtObservedWidths: 'PASS',
      visibleCulturalLeakage: 'NONE-OBSERVED',
      answerOrNumericalDataAdded: 'NONE-OBSERVED',
    },
    historyPreserved: {
      authorFirstVisual: oldVisual.firstAuthorVisual,
      authorFirstWidthDeclaration: oldVisual.firstDisplayDeclarationGate,
      authorFirstFailure: oldVisual.failure,
      oldFirstCandidatePNG: { ...bind(oldVisual.firstPNG.path), openedByD550: false },
      authorFirstVisualEvidence: bind(path.join(author, 'first-author-visual.json')),
      authorFirstWidthFailureEvidence: bind(path.join(author, 'display-before.json')),
      authorRepairEvidence: bind(path.join(author, 'repair.json')),
      authorFinalCandidateOpens: authorFigure.afterCandidateOpens,
      firstIndependentNativeFAIL: figure === 'fig-159' ? 'd550-159-F-route-topology' : null,
      ownFirstObservationEvidence: bind(firstFile),
    },
    terminalFailure: figure === 'fig-159' ? {
      id: 'd550-159-F-route-topology',
      status: 'FAIL',
      reason: 'Actual browser and actual after native images fail to distinguish a single continuous curved fiber path from a closed-ring-plus-straight-bypass construction.',
      downstreamDisposition: 'BLOCKED-FOR-FIG-ACCEPTANCE; retain FAIL and HOLD, do not repair or promote.',
      isMethodFailure: false,
    } : null,
    holdsPreserved: ownSource.holds,
    exactSourceDetailsCertified: false,
    modernAdditionDisclosure: ownSource.modernAdditionsMustRemainSeparate,
    authorRepairCount: 1,
    additionalRepairBudget: 0,
    figureRepairsThisBatch: 0,
    recordReviewOrPromotion: false,
    DISPLAY: 'pending-fullcard',
    fullcard: false,
    cardPASS: false,
  }
})
for (const name of fs.readdirSync(root)) {
  const file = path.join(root, name)
  assert.ok(fs.statSync(file).isFile())
  fs.chmodSync(file, 0o444)
}
const report = {
  schema: 'd550/first-independent-FIG-review-report@1',
  date: '2026-11-18',
  ticket: 'STEMROBIN-181',
  card: 'phy10-c2-s2-n73',
  batch: 'd550',
  workspace: repo,
  branchContextFromHumanOnly: 'original STEMROBIN-181 branch; not queried or modified',
  reviewer: 'd550-one-shot-independent-FIG-context',
  noResidentOrReplacementADWorker: true,
  status: 'COMPLETED-INDEPENDENT-FIG-REVIEW-WITH-TERMINAL-FAIL',
  FIG: 'FAIL',
  perFigure: { 'fig-158': 'PASS', 'fig-159': 'FAIL' },
  closed: true,
  acceptsSecondBatch: false,
  scope: 'Only first necessary FIG observations for n73 fig158/159; no full-card DISPLAY, cardPASS, source-HOLD clearance, native rerun or promotion.',
  instructionsLoaded: tools,
  preflight: {
    performedBeforeFirstImageOpen: true,
    anchorHashesMatchedAtEntryAndClose: anchors,
    authorFreezeListedFilesChecked: 125,
    authorFreezeTotalIncludingSelf: 126,
    authorFreezeHashMismatches: 0,
    authorFreezeModeMismatches: 0,
    allAuthorFilesCurrentMode: '0444',
    finalAuthorFreezeRecheck: 'Every listed SHA and 0444 mode rechecked at closure; no author bytes altered.',
    contextAndSourceCurrentModes: '0644; accurately recorded and not changed',
    authorReadyIsNotIndependentPASS: true,
    currentInputs: [anchors[2], text.en, text.zh, textReview, ...figures.flatMap(item => [item.context, item.source, item.spec, item.render, ...item.outputs]), preview.sourceCSS],
  },
  inventory: bind(inventoryFile),
  actualOpens: { ...bind(opensFile), count: 6, startingContextCount: 0, batchLimit: 8, contextLimit: 24, originals: 2, finalNative: 2, firstActualMobile: 2, reopens: 0, crops: 0, oldCandidates: 0, resvg: 0 },
  allObservedPNGs: opens.opens.map(item => ({ ...bind(item.path), actualOpenOrder: item.order, figure: item.figure, role: item.role })),
  mobileMethod: {
    correctionReceivedBeforeGeneration: true,
    authorizedMethod: preview.method,
    generation: bind(previewFile),
    resvgGenerated: 0,
    resvgFirstFAILBytes: 'Not applicable: no resvg was generated in d550.',
    originalFrozenSVGUnmodified: true,
    CSSVarFallbackReplaced: false,
    originalProductCSSUnmodified: true,
    isFigureRepair: false,
    isBudgetReset: false,
    browserClosed: true,
  },
  figures,
  SCI: 'PASS-INHERITED-d486',
  ZHEN: 'PASS-INHERITED-d486',
  repeatedSCIOrZHENReview: false,
  fullTextReadPurpose: 'Complete current EN/ZH context for FIG comparison only; no new body-text verdict.',
  DISPLAY: 'pending-fullcard',
  fullcard: false,
  cardPASS: false,
  independentFIGPASSIsNotDurableReviewAt1: true,
  priorSourceRAWAndSVGHOLDsPreserved: true,
  firstFAILsRetained: true,
  allFigureRepairBudgetsAlreadyExhausted: true,
  writesOnlyBelow: root,
  forbiddenOperationsRun: {
    git: 0, sourceOrCandidateRepairs: 0, renderSpec: 0, nativeValidator: 0,
    recordReview: 0, promotion: 0, DB: 0, paidGeneration: 0, commitPush: 0,
    wholeProjectChecks: 0, newSubagents: 0, newWorkersWorktreesBranches: 0,
  },
  returnContract: 'Text paths and hashes only; batch closed with no second batch.',
}
writeNew('report.json', report)
const ready = {
  schema: 'd550/READY@1',
  date: '2026-11-18',
  status: 'REVIEW-EVIDENCE-READY-NOT-FIG-ALL-PASS',
  readyMeans: 'Frozen first independent observations are complete and ready for textual retrieval only.',
  report: bind(path.join(root, 'report.json')),
  inventory: bind(inventoryFile),
  actualOpens: { ...bind(opensFile), count: 6 },
  perFigure: report.perFigure,
  FIG: 'FAIL',
  DISPLAY: 'pending-fullcard',
  fullcard: false,
  cardPASS: false,
  sourceHOLDsPreserved: true,
  promotionAllowed: false,
  repairsAllowed: false,
  browserClosed: true,
  closed: true,
  acceptsSecondBatch: false,
  reviewFreezePath: path.join(root, 'review-freeze.json'),
  reviewFreezeSHA256: 'Detached final-text hash; avoids a cyclic manifest hash.',
  allFilesMode: '0444',
  textOnlyReturn: true,
}
writeNew('READY.json', ready)
const files = fs.readdirSync(root).sort().map(name => bind(path.join(root, name)))
assert.ok(files.every(file => file.mode === '0444'))
const reviewFreeze = {
  schema: 'd550/review-freeze@1',
  date: '2026-11-18',
  status: report.status,
  closed: true,
  filesMode: '0444',
  fileCountIncludingThisManifest: files.length + 1,
  manifestSelfHash: 'Detached SHA256 returned in final text; no self/cyclic hash.',
  report: ready.report,
  READY: bind(path.join(root, 'READY.json')),
  authorReport: anchors[0],
  authorFreeze: anchors[1],
  sourceContextManifest: anchors[2],
  inputs: report.preflight.currentInputs,
  allObservedPNGs: report.allObservedPNGs,
  actualOpens: report.actualOpens,
  perFigure: report.perFigure,
  FIG: 'FAIL',
  DISPLAY: 'pending-fullcard',
  fullcard: false,
  cardPASS: false,
  sourceHOLDsPreserved: true,
  firstFAILsPreserved: true,
  files,
  browserClosed: true,
  acceptsSecondBatch: false,
  textOnlyReturn: true,
}
writeNew('review-freeze.json', reviewFreeze)
console.log(JSON.stringify({
  report: bind(path.join(root, 'report.json')),
  reviewFreeze: bind(path.join(root, 'review-freeze.json')),
  READY: bind(path.join(root, 'READY.json')),
  inventory: bind(inventoryFile),
  actualOpens: { ...bind(opensFile), count: 6 },
  perFigure: report.perFigure,
  fileCountIncludingFreeze: reviewFreeze.fileCountIncludingThisManifest,
  closed: true,
}, null, 2))
