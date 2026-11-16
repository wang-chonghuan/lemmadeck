import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const work = '.tmp/STEMROBIN-181/9p-d019-n67-figures'
const lessonId = 'phy9-c2-s2-n67'
const templatePath = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${lessonId}/lesson.template.json`
const rawPath = `ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${lessonId}/lesson.json`
const oldReviewPath = '.intentfold/tickets/STEMROBIN-181/tmp/source-review-9p-0168-0171.json'
const freezePath = '.intentfold/tickets/STEMROBIN-181/tmp/d019-n67-figures-author-freeze.json'
const ids = ['fig-113', 'fig-114']
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
function writeNew(file, data) {
  assert(!fs.existsSync(file), `Preserve existing output: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}
function snapshot(file, output) {
  assert(!fs.existsSync(output), `Preserve existing snapshot: ${output}`)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.copyFileSync(file, output)
  return bind(output)
}
const point = (id, at, visible = true) => ({
  id, type: 'point', at, visible, size: 5, strokeWidth: 1, stroke: 'ink', fill: 'ink',
})
const line = (id, from, to, dash = 0) => ({
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3.5, dash,
})
const arrow = (id, from, to) => ({
  id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 4,
})
const text = (id, at, value, fontSize = 36) => ({
  id, type: 'text', at, text: value, fontSize, fontWeight: 600,
  labelColor: 'ink', labelPlacement: { position: 'CENTER', gap: 0 },
})
const connects = (id, object, from, to) => ({
  id, type: 'connects', arrow: object, from, to,
})
const displacement = (id, from, to, dx, dy) => ({
  id, type: 'displacement', from, to, dx, dy,
})

function base(id, context) {
  return {
    schema: 'ld-s10y-image/figure-spec@2',
    id,
    mode: 'deterministic',
    source: {
      image: context.sourceImages.find(item => item.id === id).binding,
      authoritativeText: [
        { lesson: lessonId, text: context.edition.data.printed_title },
        ...context.edition.data.prose.filter(block => block.text?.trim())
          .map(block => ({ lesson: lessonId, text: block.text })),
      ],
      inventory: [],
    },
    canvas: {
      width: 640, height: id === 'fig-113' ? 440 : 470,
      boundingBox: [0, id === 'fig-113' ? 440 : 470, 640, 0],
      background: 'paper', keepAspectRatio: true,
    },
    display: { purpose: 'instructional', layout: 'inline', widths: [640, 331, 342], minTextPx: 16 },
    objects: [],
    assertions: [],
  }
}

function figure113(context) {
  const spec = base('fig-113', context)
  spec.description = 'Two panels retain the original positive/negative point-charge signs and outward/inward radial electric-field vectors. Distances are schematic, not measured source data.'
  spec.objects = [
    point('positive-charge', [105, 100]),
    point('positive-field-point', [185, 270]),
    point('positive-arrow-tip', [225, 355], false),
    point('negative-charge', [405, 100]),
    point('negative-field-point', [485, 270]),
    point('negative-arrow-tip', [455, 206.25], false),
    line('positive-radius', 'positive-charge', 'positive-field-point'),
    line('negative-radius', 'negative-charge', 'negative-field-point'),
    arrow('positive-field-vector', 'positive-field-point', 'positive-arrow-tip'),
    arrow('negative-field-vector', 'negative-field-point', 'negative-arrow-tip'),
    text('positive-charge-sign', [184, 104], 'q > 0'),
    text('negative-charge-sign', [484, 104], 'q < 0'),
    text('positive-vector-symbol', [252, 306], 'E\u20d7'),
    text('negative-vector-symbol', [513, 218], 'E\u20d7'),
    text('positive-panel-label', [105, 35], '(a)'),
    text('negative-panel-label', [405, 35], '(b)'),
  ]
  spec.assertions = [
    connects('positive-radius-connects', 'positive-radius', 'positive-charge', 'positive-field-point'),
    connects('negative-radius-connects', 'negative-radius', 'negative-charge', 'negative-field-point'),
    connects('positive-arrow-connects', 'positive-field-vector', 'positive-field-point', 'positive-arrow-tip'),
    connects('negative-arrow-connects', 'negative-field-vector', 'negative-field-point', 'negative-arrow-tip'),
    { id: 'positive-radial-collinearity', type: 'collinear', a: 'positive-charge', b: 'positive-field-point', c: 'positive-arrow-tip' },
    { id: 'negative-radial-collinearity', type: 'collinear', a: 'negative-charge', b: 'negative-field-point', c: 'negative-arrow-tip' },
    displacement('positive-source-point-order', 'positive-charge', 'positive-field-point', 80, 170),
    displacement('negative-source-point-order', 'negative-charge', 'negative-field-point', 80, 170),
    displacement('positive-vector-away', 'positive-field-point', 'positive-arrow-tip', 40, 85),
    displacement('negative-vector-toward', 'negative-field-point', 'negative-arrow-tip', -30, -63.75),
  ]
  spec.source.inventory = [
    {
      id: 'positive-panel-source',
      description: 'Left original panel: lower filled source charge q>0, higher filled observation point, solid radial line, and E-vector arrow directed up-right away from the source charge; vector overhead mark present. Original first panel glyph has a/а homoglyph shape: its alphabet is unresolved, not asserted Latin or Cyrillic. Modern ordinal label (a) preserves first-panel identity.',
      objects: ['positive-charge', 'positive-field-point', 'positive-radius', 'positive-field-vector', 'positive-charge-sign', 'positive-vector-symbol', 'positive-panel-label'],
      assertions: ['positive-radius-connects', 'positive-arrow-connects', 'positive-radial-collinearity', 'positive-source-point-order', 'positive-vector-away'],
      requires: ['pointRelationships'],
    },
    {
      id: 'negative-panel-source',
      description: 'Right original panel: lower filled source charge q<0, higher filled observation point, solid radial line, and E-vector arrow directed down-left toward the source charge; vector overhead mark present. Original second panel glyph is visibly б-shaped. Modern ordinal label (b) maps this second panel without guessing the first glyph alphabet.',
      objects: ['negative-charge', 'negative-field-point', 'negative-radius', 'negative-field-vector', 'negative-charge-sign', 'negative-vector-symbol', 'negative-panel-label'],
      assertions: ['negative-radius-connects', 'negative-arrow-connects', 'negative-radial-collinearity', 'negative-source-point-order', 'negative-vector-toward'],
      requires: ['pointRelationships'],
    },
  ]
  return spec
}

function figure114(context) {
  const spec = base('fig-114', context)
  spec.description = 'Electric-field vector superposition at one common point: the positive charge contributes E1 away from it, the negative charge contributes E2 toward it, and the resultant is the parallelogram diagonal. The source horizontal resultant and solid/dashed distinctions are preserved; the uncalibrated geometry is schematic.'
  spec.objects = [
    point('source-q1', [65, 100]),
    point('source-q2', [425, 100]),
    point('common-field-point', [315, 265]),
    point('component1-tip', [455, 357.4], false),
    point('component2-tip', [376.6, 172.6], false),
    point('resultant-tip', [516.6, 265], false),
    line('charge-baseline', 'source-q1', 'source-q2', 2),
    line('positive-radial-line', 'source-q1', 'common-field-point'),
    line('negative-radial-line', 'common-field-point', 'source-q2'),
    line('parallelogram-side1', 'component1-tip', 'resultant-tip'),
    line('parallelogram-side2', 'component2-tip', 'resultant-tip'),
    arrow('component1-vector', 'common-field-point', 'component1-tip'),
    arrow('component2-vector', 'common-field-point', 'component2-tip'),
    arrow('resultant-vector', 'common-field-point', 'resultant-tip'),
    text('charge1-sign', [99, 43], 'q\u2081 > 0'),
    text('charge2-sign', [425, 43], 'q\u2082 < 0'),
    text('component1-symbol', [436, 405], 'E\u20d7\u2081'),
    text('component2-symbol', [313, 178], 'E\u20d7\u2082'),
    text('resultant-symbol', [564, 246], 'E\u20d7'),
  ]
  spec.assertions = [
    connects('baseline-connects-charges', 'charge-baseline', 'source-q1', 'source-q2'),
    connects('positive-radius-connects-common', 'positive-radial-line', 'source-q1', 'common-field-point'),
    connects('negative-radius-connects-common', 'negative-radial-line', 'common-field-point', 'source-q2'),
    connects('component1-common-origin', 'component1-vector', 'common-field-point', 'component1-tip'),
    connects('component2-common-origin', 'component2-vector', 'common-field-point', 'component2-tip'),
    connects('resultant-common-origin', 'resultant-vector', 'common-field-point', 'resultant-tip'),
    connects('side1-connects', 'parallelogram-side1', 'component1-tip', 'resultant-tip'),
    connects('side2-connects', 'parallelogram-side2', 'component2-tip', 'resultant-tip'),
    { id: 'positive-radial-collinearity', type: 'collinear', a: 'source-q1', b: 'common-field-point', c: 'component1-tip' },
    { id: 'negative-radial-collinearity', type: 'collinear', a: 'common-field-point', b: 'component2-tip', c: 'source-q2' },
    { id: 'first-opposite-sides-parallel', type: 'parallel', a: 'common-field-point', b: 'component1-tip', c: 'component2-tip', d: 'resultant-tip' },
    { id: 'second-opposite-sides-parallel', type: 'parallel', a: 'common-field-point', b: 'component2-tip', c: 'component1-tip', d: 'resultant-tip' },
    { id: 'first-opposite-sides-equal', type: 'equalDistance', a: 'common-field-point', b: 'component1-tip', c: 'component2-tip', d: 'resultant-tip' },
    { id: 'second-opposite-sides-equal', type: 'equalDistance', a: 'common-field-point', b: 'component2-tip', c: 'component1-tip', d: 'resultant-tip' },
    displacement('component1-displacement', 'common-field-point', 'component1-tip', 140, 92.4),
    displacement('component2-displacement', 'common-field-point', 'component2-tip', 61.6, -92.4),
    displacement('translated-component1', 'component2-tip', 'resultant-tip', 140, 92.4),
    displacement('translated-component2', 'component1-tip', 'resultant-tip', 61.6, -92.4),
    displacement('horizontal-vector-sum', 'common-field-point', 'resultant-tip', 201.6, 0),
  ]
  spec.source.inventory = [{
    id: 'two-charge-superposition-source',
    description: 'Original lower-left filled q1>0 and lower-right filled q2<0 points have a dashed connecting baseline. Their two solid radial lines meet at the single upper filled field point. E1 points up-right, E2 down-right toward q2, and E points horizontally right from that same field point. The two remaining parallelogram sides are solid. All charge signs, indices, vector labels and arrowheads are retained. Vector endpoints are construction anchors, not new visible dots; no coordinates, values or solution labels are added.',
    objects: ['source-q1', 'source-q2', 'common-field-point', 'charge-baseline', 'positive-radial-line', 'negative-radial-line', 'parallelogram-side1', 'parallelogram-side2', 'component1-vector', 'component2-vector', 'resultant-vector', 'charge1-sign', 'charge2-sign', 'component1-symbol', 'component2-symbol', 'resultant-symbol'],
    assertions: spec.assertions.map(item => item.id),
    requires: ['pointRelationships'],
  }]
  return spec
}

function author() {
  assert(!fs.existsSync(`${work}/context.json`), 'Author only once; keep original context')
  const edition = load(templatePath)
  const raw = load(rawPath)
  const prior = load(oldReviewPath)
  assert.equal(prior.status, 'pass')
  assert.equal(edition.id, lessonId)
  assert.equal(raw.exercise_count, 0)
  const context = {
    schema: 'ld-s10y-image/context@1',
    book: '9p', edition: 'modern-us-neutral', lesson: lessonId,
    authoritativeRule: 'Complete captured modern lesson template is authoritative; original PNGs supply visual structure. No answer material, invented calibrated values or full source-page rereview.',
    edition: {
      binding: bind(templatePath),
      snapshot: snapshot(templatePath, `${work}/lesson.template.snapshot.json`),
      data: edition,
      authorStatusAtDispatch: 'Zeno editing; this is a bound candidate context, not a prose SCI approval',
    },
    canonicalSource: {
      binding: bind(rawPath),
      snapshot: snapshot(rawPath, `${work}/canonical.lesson.snapshot.json`),
      data: raw,
    },
    sourceReview: bind(oldReviewPath),
    sourceImages: ids.map(id => {
      const original = `ssot-resources/soviet10year-textbooks/artifacts/9p/figures/${id}.png`
      const reviewed = prior.figures.find(figure => figure.id === id)
      assert.equal(sha(original), reviewed.binding.sha256, `${id}: original must match passed source crop`)
      return { id, binding: bind(original), priorObservation: reviewed.inventory, actualOriginalOpened: true, detail: 'original' }
    }),
  }
  writeNew(`${work}/context.json`, context)
  writeNew(`${work}/source-inventory-trace.json`, {
    scope: ids,
    priorSourceReview: bind(oldReviewPath),
    currentOriginalPNGsOpenedSeparately: true,
    fullSourcePagesReopened: false,
    labelMap: [
      { figure: 'fig-113', panel: 1, originalSurface: 'a/а homoglyph shape', originalAlphabet: 'unresolved', modern: '(a)', basis: 'first source panel and positive q>0 case; ordinal modern labeling, not alphabet restoration' },
      { figure: 'fig-113', panel: 2, originalSurface: 'б-shaped glyph', modern: '(b)', basis: 'second source panel and negative q<0 case' },
    ],
    additionsAndRegularization: [
      'Uncalibrated source geometry is redrawn at convenient exact coordinates; those coordinates and vector lengths are not shown and are not represented as source measurements.',
      'Vector-overhead mark and subscript indices use readable typeset Unicode math symbols with the existing KaTeX_Main-first renderer font strategy. Resultant E receives explicit vector notation consistent with the lesson; the source resultant is already an arrow.',
      'Hidden deterministic vector-tip anchors introduce no visible markers.',
    ],
    sourceFacts: {
      'fig-113': ['Two panels; two filled source points per panel; solid radial lines; q>0/q<0; outward/inward arrows; E labels and vector marks.'],
      'fig-114': ['Two signed source charges and one shared field point; dashed charge baseline; solid radial lines and parallelogram edges; E1/E2/E share their exact origin; horizontal resultant.'],
    },
  })
  for (const spec of [figure113(context), figure114(context)]) {
    writeNew(`${work}/${spec.id}/initial/spec.json`, spec)
  }
  console.log(JSON.stringify({ context: bind(`${work}/context.json`), specs: ids.map(id => bind(`${work}/${id}/initial/spec.json`)) }, null, 2))
}

function freeze() {
  const context = load(`${work}/context.json`)
  const observed = load(`${work}/author-observations.json`)
  const templateCurrent = bind(templatePath)
  assert.equal(sha(rawPath), context.canonicalSource.binding.sha256)
  const figures = ids.map(id => {
    const dir = `${work}/${id}/initial`
    const report = load(`${dir}/render.json`)
    const previews = load(`${dir}/width-previews.json`)
    const spec = load(`${dir}/spec.json`)
    assert.equal(report.spec.sha256, sha(`${dir}/spec.json`))
    assert.equal(report.output.svg.sha256, sha(`${dir}/${id}.svg`))
    assert(previews.previews.every(item => sha(item.path) === item.sha256))
    assert.equal(sha(spec.source.image.path), spec.source.image.sha256)
    const observation = observed.figures.find(item => item.id === id)
    const inspectedPreviews = previews.previews.map(preview => {
      const image = observation.images.find(item => path.resolve(item.path) === path.resolve(preview.path))
      assert(image?.actualOpened && image.detail === 'original')
      assert.equal(image.sha256, preview.sha256)
      return { ...preview, actualOpened: true, detail: image.detail, authorObservation: image.observation }
    })
    return {
      id, mode: 'deterministic', contextKind: 'lesson',
      status: report.status === 'pass' && observed.figures.find(item => item.id === id).defects.length === 0 ? 'frozen-author-candidate' : 'blocked-author-candidate',
      repairsUsed: 0, maximumTargetedRepairs: 1,
      bindings: {
        source: spec.source.image,
        context: bind(`${work}/context.json`),
        lesson: context.edition.binding,
        lessonSnapshot: context.edition.snapshot,
        spec: bind(`${dir}/spec.json`),
        render: bind(`${dir}/render.json`),
        svg: bind(`${dir}/${id}.svg`),
        fullPNG: bind(`${dir}/${id}.png`),
        previews: bind(`${dir}/width-previews.json`),
      },
      previewImages: inspectedPreviews,
      native: { status: report.status, collisions: report.collisions, displayChecks: report.displayChecks, assertions: spec.assertions.map(item => item.id) },
      authorObservations: observed.figures.find(item => item.id === id),
    }
  })
  const contextCurrent = templateCurrent.sha256 === context.edition.binding.sha256
  writeNew(freezePath, {
    ticket: 'STEMROBIN-181', batch: 'D019', lesson: lessonId,
    role: 'deterministic-figure-author-only',
    status: figures.some(item => item.status.startsWith('blocked')) ? 'blocked-author-candidates' : 'frozen-pending-main-unique-independent-figure-gate',
    contextCurrentAtFreeze: contextCurrent,
    capturedLessonBinding: context.edition.binding,
    currentLessonBindingAtFreeze: templateCurrent,
    contextLimit: contextCurrent ? 'Current captured template; prose SCI is not performed by this figure author.' : 'Prose author changed the template during figure construction. Context-only rebind to the authoritative freeze is required before independent gate; no geometry approval or rerender implied.',
    canonicalSource: context.canonicalSource.binding,
    sourceReview: context.sourceReview,
    inventoryTrace: bind(`${work}/source-inventory-trace.json`),
    authorHelper: bind(`${work}/author.mjs`),
    rendererRuntimeOverride: bind(`${work}/native-font-previews.mjs`),
    preservedRuntimeFailure: bind(`${work}/initial-render-runtime-failure.json`),
    preservedRuntimeBridgeBeforeFix: bind(`${work}/native-font-previews.before-evaluate-fix.mjs`),
    executionScope: {
      rendererInvocationsPerFigure: 2,
      firstInvocation: 'Scratch callback serialization failed before any SVG/PNG/report output.',
      completedNativeRendersPerFigure: 1,
      completedAuthorPixelChecksPerFigure: 1,
      figureGeometryRepairsUsedPerFigure: 0,
      nativeToolsChanged: false,
    },
    nativeRenderer: bind('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
    nativeValidator: bind('.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
    nativeSchema: bind('.agents/skills/ld-s10y-image/assets/figure-spec.schema.json'),
    authorObservations: bind(`${work}/author-observations.json`),
    figures,
    reviewFilesAuthored: false,
    independentApproval: false,
    durableOrTemplateEdits: false,
    fullSourcePagesOrPassedGatesRepeated: false,
    browserPolicy: 'Only the existing native renderer internal isolated headless session, including width captures; no browser interaction tools, extra preview browser, user profiles, CDP, foreground or network.',
    inFlightProcesses: [],
  })
  console.log(JSON.stringify({ freeze: bind(freezePath), figures: figures.map(({ id, status }) => ({ id, status })), contextCurrent }, null, 2))
}

if (process.argv[2] === 'author') author()
else if (process.argv[2] === 'freeze') freeze()
else throw new Error('Expected author or freeze; no promotion/finalization path')
