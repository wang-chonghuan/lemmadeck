import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const work = '.tmp/STEMROBIN-181/9p-d019-n70-figures'
const dir = `${work}/fig-127/repair-1`
const ticket = '.intentfold/tickets/STEMROBIN-181/tmp'
const initialFreeze = `${ticket}/d019-n70-figures-author-freeze.json`
const initialReview = `${ticket}/9p-n70-figure-review-initial.json`
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, value) => {
  assert(!fs.existsSync(file), `Preserve existing evidence: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const point = (id, at) => ({ id, type: 'point', at, visible: false })
const relation = (id, type, fields) => ({ id, type, ...fields })
const familyIds = ['front', 'middle', 'back']
const familyXs = [295, 340, 385]
const levelStep = 48
const normalLength = 215
const slope = 110 / 135

function assertBinding(binding) {
  assert.equal(sha(binding.path), binding.sha256, binding.path)
}

function inputs() {
  assert.equal(sha(initialFreeze), '6f6caef4b858949e3914667322a8c181cbb3afebc6ca158a1d4c9c2e8b39cd0c')
  const frozen = load(initialFreeze)
  const reviewed = load(initialReview)
  const initial = frozen.figures.find(figure => figure.id === 'fig-127')
  assert.equal(initial.repairsUsed, 0)
  assert.equal(reviewed.remainingRepairBudget['fig-127'], 1)
  for (const binding of Object.values(initial.bindings)) assertBinding(binding)
  for (const binding of reviewed.source127Detail) assertBinding(binding)
  for (const figure of frozen.figures.filter(figure => figure.id !== 'fig-127')) {
    for (const binding of Object.values(figure.bindings)) assertBinding(binding)
  }
  const context = load(`${work}/context.json`)
  const spec = load(initial.bindings.spec.path)
  assert.deepEqual(spec.source.authoritativeText, context.authoritativeText)
  return { frozen, reviewed, initial, context, spec }
}

function author() {
  assert(!fs.existsSync(`${dir}/spec.json`))
  assert(!fs.existsSync(`${dir}/render.json`))
  const { frozen, reviewed, initial, spec } = inputs()
  const retained = spec.objects.filter(object =>
    object.id === 'charged-sheet-plane' || object.id.startsWith('sheet-hatching-'))
  spec.objects = retained
  spec.assertions = []
  spec.source.inventory = []
  spec.description = 'One uniformly charged sheet in perspective with all twenty-one outward arrow pairs, three staggered depth families of seven levels. Opposed equal normal fields apply only to the authoritative isolated infinite-sheet model with identical media on both sides; coordinates and graphical arrow lengths are uncalibrated.'
  const familyRecords = []
  const allPointIds = []
  const allArrowIds = []
  for (const [familyIndex, family] of familyIds.entries()) {
    const origins = []
    for (let level = 0; level < 7; level++) {
      const stem = `${family}-level-${level + 1}`
      const x = familyXs[familyIndex]
      const y = 88 + level * levelStep + (x - 275) * slope
      const origin = [x, y]
      const left = [x - normalLength, y]
      const right = [x + normalLength, y]
      const originId = `${stem}-origin`
      const leftId = `${stem}-left-tip`
      const rightId = `${stem}-right-tip`
      const leftArrow = `${stem}-left-arrow`
      const rightArrow = `${stem}-right-arrow`
      assert(y > 55 + (x - 275) * slope)
      assert(y < 395 + (x - 275) * slope)
      spec.objects.push(point(originId, origin), point(leftId, left), point(rightId, right))
      allPointIds.push(originId, leftId, rightId)
      for (const [arrowId, tipId, dx] of [
        [leftArrow, leftId, -normalLength], [rightArrow, rightId, normalLength],
      ]) {
        spec.objects.push({
          id: arrowId, type: 'arrow', from: originId, to: tipId,
          stroke: 'ink', strokeWidth: 3.4,
        })
        allArrowIds.push(arrowId)
        spec.assertions.push(
          relation(`${arrowId}-connects`, 'connects', { arrow: arrowId, from: originId, to: tipId }),
          relation(`${arrowId}-opposed-normal-displacement`, 'displacement', { from: originId, to: tipId, dx, dy: 0 }),
          relation(`${arrowId}-normal-parallel`, 'parallel', { a: originId, b: tipId, c: [0, 0], d: [1, 0] }),
        )
      }
      spec.assertions.push(
        relation(`${stem}-equal-two-sided-field-length`, 'equalDistance', {
          a: originId, b: leftId, c: originId, d: rightId,
        }),
        relation(`${stem}-origin-on-sheet`, 'inside', { point: originId, container: 'charged-sheet-plane' }),
      )
      if (level > 0) {
        spec.assertions.push(relation(`${stem}-height-level-offset`, 'displacement', {
          from: `${family}-level-${level}-origin`, to: originId, dx: 0, dy: levelStep,
        }))
      }
      if (familyIndex > 0) {
        spec.assertions.push(relation(`${stem}-depth-family-offset`, 'displacement', {
          from: `${familyIds[familyIndex - 1]}-level-${level + 1}-origin`,
          to: originId, dx: 45, dy: 45 * slope,
        }))
      }
      origins.push({ level: level + 1, origin, left, right, originId, leftId, rightId, leftArrow, rightArrow })
    }
    familyRecords.push({ family, levels: 7, pairs: 7, origins })
  }
  spec.assertions.push(
    relation('complete-twenty-one-two-sided-pairs', 'objectCount', { objectType: 'arrow', count: 42 }),
    relation('complete-three-by-seven-origin-and-tip-points', 'objectCount', { objectType: 'point', count: 63 }),
  )
  spec.objects.push({
    id: 'sheet-surface-density-label', type: 'text', at: [260, 30], text: '\u03c3',
    fontSize: 36, fontWeight: 600, labelColor: 'ink',
    labelPlacement: { position: 'CENTER', gap: 0 },
  })
  spec.source.inventory.push({
    id: 'fig-127-sheet-and-density-source',
    description: 'Actual source: one diagonally hatched perspective sheet and a sigma surface-density label near its lower-left portion. The existing plane outline and hatch objects are retained. Modern layout relocates sigma just outside the lower-left corner, without a new symbol, leader, value or solution and without removing arrow levels to reserve a central label gap.',
    objects: [...retained.map(object => object.id), 'sheet-surface-density-label'],
    assertions: [],
  }, {
    id: 'fig-127-complete-field-family-source',
    description: 'Actual affected original and the two supplied original-pixel strips show twenty-one leftward and twenty-one rightward arrow tips: three staggered depth families with seven levels each. Lower printed strokes overprint and are not calibrated intervals. This complete uncalibrated regularization preserves the family and level counts, both outward directions and the uniform-field interpretation. Native assertions cover every origin and both tips, every arrow, all family/level offsets and two-sided equality. Physical normal-to-sheet meaning uses the separately checked three-dimensional model, not a false perpendicularity to the projected slanted edge.',
    requires: ['pointRelationships'],
    objects: ['charged-sheet-plane', ...allPointIds, ...allArrowIds],
    assertions: spec.assertions.map(item => item.id),
  })
  const normal = [1, 0, 0]
  const tangents = [[0, 1, 0], [0, 0, 1]]
  const dotProducts = tangents.map(tangent => normal.reduce((sum, value, i) => sum + value * tangent[i], 0))
  assert.deepEqual(dotProducts, [0, 0])
  const model = {
    normal, sheetTangents: tangents, normalTangentDotProducts: dotProducts,
    oppositeSideNormals: [[-1, 0, 0], [1, 0, 0]],
    projection: 'screen/user-space x = 295 + 215*normalCoordinate + 45*depthCoordinate; user-space y = 88 + 20*(110/135) + 48*heightCoordinate + 45*(110/135)*depthCoordinate. Projection is not a calibrated source measurement.',
    allOriginsLieInNormalCoordinateZeroPlane: true,
    physicalNormalCheck: 'Both normal dot tangent values are zero before perspective projection; all native projected arrows have opposed horizontal displacements and parallel shafts.',
  }
  writeNew(`${dir}/spec.json`, spec)
  writeNew(`${dir}/source-inventory-and-construction.json`, {
    role: 'targeted-fig127-repair-author-only-not-independent-gate',
    initialFreeze: bind(initialFreeze), initialReview: bind(initialReview),
    initialBindings: initial.bindings,
    source: spec.source.image,
    originalActuallyOpened: true, sourceOpenCount: 1, sourceOpenDetail: 'original',
    sourceDetails: reviewed.source127Detail.map(binding => ({
      ...binding, actuallyOpened: true, openCount: 1, detail: 'original',
    })),
    sourceTipInventory: {
      depthFamilies: 3, levelsPerFamily: 7, leftTips: 21, rightTips: 21, pairs: 21,
      countAgreesWithInitialIndependentFinding: true,
      leftOuterFamilyRowBands: [[77, 85], [125, 133], [173, 182], [222, 231], [267, 274], [313, 322], [361, 370]],
      leftOuterBandEvidence: 'Read-only source x20..44 at threshold128 and at least45% ink; seven bands, not new image crops.',
      leftMiddleTipBands: [[63, 67], [108, 116], [155, 163], [201, 209], [246, 254], [291, 298], [337, 343]],
      limitations: ['Printed lower shafts/arrowheads partly overprint. Source counts and three-by-seven structure are preserved; pixel positions, spacing and lengths are not numerical givens.'],
    },
    familyRecords, model,
    changes: [
      'Replace fifteen incomplete pairs and their assertions with twenty-one pairs and sixty-three individually mapped construction points.',
      'Enforce three depth families, seven uninterrupted levels per family, every endpoint, opposite directions, native parallelism and two-sided equality.',
      'Retain sheet polygon and hatch objects byte-equivalent in the spec; move only sigma to the clear lower-left exterior so no central arrow levels are omitted.',
    ],
    immutableOtherFigures: frozen.figures.filter(figure => figure.id !== 'fig-127').map(figure => ({
      id: figure.id, bindings: figure.bindings, pixelsReopened: false, changed: false,
    })),
    spec: bind(`${dir}/spec.json`), helper: bind(`${dir}/author-repair.mjs`),
    repairsUsedBefore: 0, repairsUsedAfter: 1, remainingRepairs: 0,
    renderInvocationsAtAuthoring: 0, independentApproval: false,
  })
  console.log(JSON.stringify({ spec: bind(`${dir}/spec.json`), inventory: bind(`${dir}/source-inventory-and-construction.json`), pairs: 21, remainingRepairs: 0 }, null, 2))
}

function freeze() {
  const { frozen, initial, context } = inputs()
  const specPath = `${dir}/spec.json`
  const spec = load(specPath)
  const render = load(`${dir}/render.json`)
  const manifest = load(`${dir}/width-previews.json`)
  const observations = load(`${dir}/author-pixel-observations.json`)
  assert.equal(render.spec.sha256, sha(specPath))
  assertBinding(render.output.svg)
  assert.deepEqual(spec.source.authoritativeText, context.authoritativeText)
  assert.deepEqual(manifest.previews.map(preview => preview.width), [640, 331, 342])
  const previews = manifest.previews.map(preview => {
    assertBinding(preview)
    const opened = observations.images.find(image => path.resolve(image.path) === path.resolve(preview.path))
    assert(opened?.actuallyOpened && opened.openCount === 1 && opened.detail === 'original')
    assert.equal(opened.sha256, preview.sha256)
    return { ...preview, ...opened }
  })
  const output = `${ticket}/d019-n70-fig127-repair-freeze.json`
  writeNew(output, {
    ticket: 'STEMROBIN-181', batch: 'D019', lesson: 'phy9-c2-s2-n70', figure: 'fig-127',
    author: 'Einstein', role: 'single-targeted-figure-repair-author-only',
    status: render.status === 'pass' && observations.findings.length === 0
      ? 'frozen-author-repair-awaiting-main-affected-only-independent-gate'
      : 'blocked-author-repair-budget-exhausted',
    initialAuthorFreeze: bind(initialFreeze), initialIndependentReview: bind(initialReview),
    bindings: {
      source: spec.source.image, context: bind(`${work}/context.json`),
      lesson: frozen.lesson, lessonSnapshot: initial.bindings.lessonSnapshot,
      proseFreeze: frozen.proseFreeze, canonicalSource: frozen.canonicalSource,
      spec: bind(specPath), render: bind(`${dir}/render.json`),
      svg: bind(`${dir}/fig-127.svg`), fullPNG: bind(`${dir}/fig-127.png`),
      previewManifest: bind(`${dir}/width-previews.json`),
      sourceInventoryAndConstruction: bind(`${dir}/source-inventory-and-construction.json`),
      authorPixelObservations: bind(`${dir}/author-pixel-observations.json`),
      targetedAuthorHelper: bind(`${dir}/author-repair.mjs`),
      existingAuthorHelper: frozen.authorHelper,
      existingNativeFontBridge: frozen.rendererRuntimeOverride,
      nativeRenderer: frozen.nativeRenderer, nativeValidator: frozen.nativeValidator,
    },
    sourceDetails: load(`${dir}/source-inventory-and-construction.json`).sourceDetails,
    sourceTipInventory: { depthFamilies: 3, levelsPerFamily: 7, leftTips: 21, rightTips: 21, pairs: 21 },
    native: { status: render.status, collisions: render.collisions, displayChecks: render.displayChecks, assertionCount: spec.assertions.length },
    previews, authorObservations: observations,
    retainedIndependentPassFigures: ['fig-125', 'fig-126'],
    retainedFiguresReopenedOrEditedOrRendered: false,
    initialEvidenceUnchanged: true,
    repairBudget: { previousRepairs: 0, repairNumber: 1, repairRenderInvocations: 1, totalFigureRenderInvocations: 2, remainingRepairs: 0 },
    independentApproval: false, promotionOrFinalize: false,
    sourceOrModernProseOrDurableOrDbOrGitOrGlobalToolWrites: false,
    svgHandEdited: false, noSourceOrScienceGateRepeated: true,
    browser: 'Only existing native renderer isolated headless session, existing font bridge; network blocked and no user browser.',
    inFlightProcesses: [],
  })
  console.log(JSON.stringify({ freeze: bind(output), status: load(output).status, inFlightProcesses: [] }, null, 2))
}

if (process.argv[2] === 'author') author()
else if (process.argv[2] === 'freeze') freeze()
else throw new Error('Only targeted author/freeze; never render, promote or approve here')
