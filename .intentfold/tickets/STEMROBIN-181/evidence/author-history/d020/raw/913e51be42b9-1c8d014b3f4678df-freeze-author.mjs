import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = file => ({ path: path.relative(repo, file), sha256: hash(file) })
const fromBinding = value => path.join(repo, value.path)
const inputs = read(path.join(own, 'input-bindings.json'))
const observations = read(path.join(own, 'author-observations.json'))
const sourceInventory = read(path.join(own, 'source-inventory.json'))
assert.equal(observations.imageLoads.length, 8)
assert.deepEqual(observations.imageLoads.map(item => item.ordinal), [1, 2, 3, 4, 5, 6, 7, 8])

// Binding checks consume existing science evidence without performing another science review.
for (const input of Object.values(inputs)) assert.equal(hash(fromBinding(input)), input.sha256, `input drift: ${input.path}`)
const modern = read(fromBinding(inputs.lesson))
const fullText = modern.prose.filter(block => block.text?.trim()).map(block => ({ lesson: modern.id, text: block.text }))
const figures = {}
for (const id of ['fig-140', 'fig-141']) {
  const finalDir = path.join(own, id, 'repair')
  const specFile = path.join(finalDir, 'spec.json')
  const reportFile = path.join(finalDir, `${id}.render.json`)
  const svgFile = path.join(finalDir, `${id}.svg`)
  const contextFile = path.join(own, id, 'context.json')
  const nativeContextFile = path.join(own, id, 'context.native.json')
  const previewEvidenceFile = path.join(finalDir, 'previews/width-previews.json')
  const spec = read(specFile)
  const render = read(reportFile)
  const previews = read(previewEvidenceFile)
  assert.equal(render.status, 'pass')
  assert.equal(previews.status, 'pass')
  assert.equal(hash(specFile), render.spec.sha256)
  assert.equal(hash(svgFile), render.output.svg.sha256)
  assert.equal(hash(fromBinding(spec.source.image)), spec.source.image.sha256)
  assert.deepEqual(spec.source.authoritativeText, fullText)
  assert.deepEqual(read(contextFile).completeModernProse, modern.prose)
  assert.deepEqual(read(contextFile).authoritativeText, fullText)
  assert.deepEqual(spec.display.widths, [640, 331, 342])
  assert.equal(spec.display.minTextPx, 16)
  assert.equal(spec.display.purpose, 'instructional')
  assert.ok(spec.objects.every(object => !object.text?.includes('\u20d7')))
  assert.ok(spec.objects.filter(object => object.type === 'arrow').every(object => (
    spec.assertions.some(item => item.type === 'connects' && item.arrow === object.id)
  )))
  const initialDir = path.join(own, id, 'initial')
  const initialSpec = read(path.join(initialDir, 'spec.json'))
  const notationIds = new Set(['field-vector-label', 'displacement-vector-label'])
  const unchangedInitialGeometry = initialSpec.objects.filter(object => !notationIds.has(object.id))
  const unchangedFinalGeometry = spec.objects.filter(object => (
    !notationIds.has(object.id) && !['field-vector-mark', 'displacement-vector-mark'].includes(object.id)
  ))
  assert.deepEqual(unchangedFinalGeometry, unchangedInitialGeometry)
  assert.ok(initialSpec.assertions.every(item => spec.assertions.some(finalItem => JSON.stringify(finalItem) === JSON.stringify(item))))
  const previewBindings = previews.checks.map(check => {
    assert.equal(hash(fromBinding(check.preview)), check.preview.sha256)
    const seen = observations.imageLoads.find(item => item.path === check.preview.path)
    const minimum = Math.min(...check.metrics.labels.map(label => label.px))
    assert.ok(minimum >= 16)
    return {
      widthPx: check.width,
      ...check.preview,
      pngDimensions: check.png,
      measuredMinimumTextPx: minimum,
      machineStatus: check.status,
      authorPixelInspection: seen
        ? { status: 'observed-not-independent-approval', imageLoadOrdinal: seen.ordinal, observation: seen.observation }
        : { status: 'not-performed-image-budget-exhausted', requiredOwner: 'Main independent figure gate' },
    }
  })
  figures[id] = {
    mode: 'deterministic',
    finalAttempt: 'single-targeted-repair',
    attempts: 2,
    targetedCorrections: 1,
    nativeStatus: 'pass',
    authorVisualStatus: id === 'fig-140' ? 'partial-current-preview-inspection' : 'observed-not-independent-approval',
    bindings: {
      source: spec.source.image,
      lesson: inputs.lesson,
      scienceReviewConsumed: inputs.scienceReview,
      context: binding(contextFile),
      nativeContext: binding(nativeContextFile),
      contextCommand: binding(path.join(own, id, 'context-command.json')),
      inventoryBeforeDrawing: inputs.inventory,
      spec: binding(specFile),
      validation: binding(path.join(finalDir, 'validation-command.json')),
      render: binding(reportFile),
      renderCommand: binding(path.join(finalDir, 'render-command.json')),
      svg: binding(svgFile),
      previewsEvidence: binding(previewEvidenceFile),
      previews: previewBindings,
      correction: binding(path.join(finalDir, 'targeted-correction.json')),
      ...(id === 'fig-141' ? { projectedCrossings: binding(path.join(own, id, 'projection-bindings.json')) } : {}),
    },
    sourceFacts: sourceInventory.figures[id].sourceFacts,
    sourceInventoryMappedToFinalSpec: spec.source.inventory,
    modernAdditions: [
      ...sourceInventory.figures[id].modernAdditions,
      'Source vector notation is decomposed into base text and small native deterministic arrow marks to avoid an unsupported combining glyph. These notational arrows are not additional field lines or displacements.',
    ],
    derivedFinalStructure: {
      fieldLines: spec.objects.filter(object => /^field-\d+$/.test(object.id)).map(object => object.id),
      planeTraces: spec.objects.filter(object => /^plane-\d+$/.test(object.id)).map(object => object.id),
      points: spec.objects.filter(object => /^point-\d+$/.test(object.id)).map(object => object.id),
      sourcePointRelationshipRequirement: spec.source.inventory.some(group => group.requires?.includes('pointRelationships')),
      objectCountUsedAsRelationSubstitute: false,
      physicalNumericalCalibration: false,
      screenPerpendicularityClaim: false,
    },
    retainedInitial: {
      spec: binding(path.join(initialDir, 'spec.json')),
      validation: binding(path.join(initialDir, 'validation-command.json')),
      render: binding(path.join(initialDir, `${id}.render.json`)),
      renderCommand: binding(path.join(initialDir, 'render-command.json')),
      svg: binding(path.join(initialDir, `${id}.svg`)),
      previewsEvidence: binding(path.join(own, id, 'previews/width-previews.json')),
      previews: [640, 331, 342].map(width => binding(path.join(own, id, 'previews', `w${width}.png`))),
      note: 'All initial bytes retained. Initial native reports passed but fig140 w640 pixels exposed a vector-notation failure. Other initial previews were not opened.',
    },
  }
}
const loadBindings = observations.imageLoads.map(item => ({ ...item, sha256: hash(fromBinding(item)) }))
const artifactFiles = []
const stagingLinks = []
function inventoryFiles(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name)
    if (item.isSymbolicLink()) {
      stagingLinks.push({ ...binding(file), target: fs.readlinkSync(file), readOnlyUse: true })
    } else if (item.isDirectory()) {
      inventoryFiles(file)
    } else if (item.name !== 'author-freeze.json') {
      artifactFiles.push(binding(file))
    }
  }
}
inventoryFiles(own)
const freeze = {
  schema: 'ld-s10y-image/author-freeze@1',
  ticket: 'STEMROBIN-181',
  batch: 'D020',
  lesson: modern.id,
  role: 'figure-author-only',
  status: 'authored-with-explicit-current-preview-inspection-gap',
  approval: 'none; Main independent figure gate still required',
  ownedRoot: own,
  figures,
  bindings: {
    frozenInputs: inputs,
    authorObservations: binding(path.join(own, 'author-observations.json')),
    initialFailure: binding(path.join(own, 'initial-author-failure.json')),
    authorHelper: binding(path.join(own, 'author.mjs')),
    previewHelper: binding(path.join(own, 'width-previews.mjs')),
    correctionHelper: binding(path.join(own, 'repair-vector-marks.mjs')),
    freezeHelper: binding(fileURLToPath(import.meta.url)),
  },
  budgets: {
    maximumImageLoads: 8,
    actualImageLoads: 8,
    originalViews: 2,
    initialCandidatePreviewViews: 1,
    finalRepairedPreviewViews: 5,
    finalRepairedPreviewsCapturedAndMachineChecked: 6,
    initialPreviewsRetained: 6,
    contextsNativeBuilt: { 'fig-140': 1, 'fig-141': 1 },
    specAttempts: { 'fig-140': 2, 'fig-141': 2 },
    targetedCorrections: { 'fig-140': 1, 'fig-141': 1 },
    maximumTargetedCorrectionsPerFigure: 1,
    explicitDraftValidatorCommands: 4,
    nativeRenderCommands: 4,
    validatorInvocationsEmbeddedInNativeRender: 4,
    noThirdAttempt: true,
    gridsCropsOrSeparateInitialPreviewLoads: 0,
    initialCandidateReadBeforeCorrection: 1,
    earlierImageHistory: false,
    scienceReviewsRerun: 0,
    recordReviewCalls: 0,
    imageGenerationCalls: 0,
    cloudSpendUSD: 0,
    tokenUsage: 'not available',
  },
  failures: [
    {
      type: 'visual-notation-failure',
      evidence: binding(path.join(own, 'initial-author-failure.json')),
      nativeStatusBeforeFailure: 'pass',
      correction: 'Single targeted spec-only correction per figure; native vector marks replace missing-glyph combining marks.',
      currentStatus: 'corrected; five repaired previews observed, one repaired 640px preview uninspected',
    },
    {
      type: 'current-final-preview-inspection-not-performed',
      figure: 'fig-140',
      widthPx: 640,
      reason: 'Strict eight-image budget exhausted after initial visual failure; do not claim all six final previews were inspected.',
    },
    {
      type: 'read-only-ticket-response-parser-error',
      exitCode: 5,
      detail: 'Initial jq selected .[] instead of .results[] in Plane paginate responses. Both underlying GETs returned HTTP 200. Corrected only the stdout selector; live ticket read succeeded. No backend writes.',
    },
    {
      type: 'read-only-file-discovery-error',
      exitCode: 2,
      detail: 'Initial rg --files included the assigned scratch root before it existed. Root subsequently created only within assigned ownership. No existing files were reverted.',
    },
  ],
  imageLoadBindings: loadBindings,
  unperformedFinalPixelInspections: observations.unperformedFinalPixelInspections,
  artifactBindings: artifactFiles.sort((a, b) => a.path.localeCompare(b.path)),
  nativeInputStagingLinks: stagingLinks,
  workflowBoundary: {
    existingScienceReview: 'consumed unchanged, not rerun',
    authoritativeLesson: 'exact frozen modern prose, bound by supplied SHA',
    sourceInventory: 'independently read original pixels before authoring',
    nativeRenderer: 'existing JSXGraph renderer and validator, no shared code changes',
    previews: 'isolated headless native Playwright, actual 640/331/342 CSS widths; not headed product acceptance',
    independentGate: 'not performed; author observations cannot approve own output',
    untouched: [
      'lesson/exercises/figures templates',
      'manifests and durable edition assets',
      'indices',
      'Git state and branches',
      'database',
      'shared renderer and validator',
      'ticket artifacts outside assigned root',
    ],
    prohibitedStepsNotRun: [
      'record_review', 'promotion', 'native adapt finalize',
      'offline batch check', 'cloud generation or spend',
    ],
  },
  nextOwner: {
    owner: 'Main',
    required: 'Independent figure gate on the repaired current SVGs and bound source/context/lesson; explicitly inspect corrected fig140 w640 pixels. No independent approval is claimed here.',
  },
}
const output = path.join(own, 'author-freeze.json')
fs.writeFileSync(output, `${JSON.stringify(freeze, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  authorFreeze: binding(output),
  status: freeze.status,
  native: Object.fromEntries(Object.entries(figures).map(([id, figure]) => [id, figure.nativeStatus])),
  imageLoads: 8,
  finalPreviewPixelsObserved: 5,
  remainingPixelInspection: 'fig-140 repair w640',
}, null, 2))
