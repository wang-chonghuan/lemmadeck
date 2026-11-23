import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const T = path.join(W, '.intentfold/tickets/STEMROBIN-188/tmp')
const O = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), W)
assert.equal(O, path.join(T, 'n30-fig190191-author-first-18'))
const contextPath = path.join(T, 'n30-proposed-math-preview-18/context.json')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(path.resolve(file).startsWith(`${O}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert.equal(hash(contextPath), 'a51ae14d6bcf5ec8d24c9907bc04e663469671a9cdf1e9b7efd8aaf13fcd7236')
const context = json(contextPath)
assert.equal(context.proposedText.sha256, '9bbe0676e864f8daaff03cfd9caa3f3ef22260d8e57180004663ec0653a6bfd7')
for (const input of [context.proposedText, context.source, ...context.originalFigures.map(f => f.source)]) {
  assert.equal(hash(input.path), input.sha256, input.path)
}
const proposed = json(context.proposedText.path)
const raw = json(context.source.path)
const stop = proposed.prose.findIndex(b => b.text.startsWith('习题 2.'))
assert.ok(stop > 0)
const relevant = proposed.prose.slice(0, stop)
const rawRelevant = raw.prose.slice(0, raw.prose.findIndex(b => b.text.startsWith('习题 2.')))
const statePath = path.join(O, 'state.json')
const state = fs.existsSync(statePath) ? json(statePath) : {
  schema: 'same188-6/offline-image-author-state@1',
  status: 'AUTHORING_PROPOSED_PREVIEW_ONLY',
  attempts: [],
  counters: {
    contentRevisions: { 'fig-190': 0, 'fig-191': 0 },
    validatorCalls: 0,
    rendererCalls: 0,
    draftLessonRenderCalls: 0,
    displayCalls: 0,
    technicalStageFailures: 0,
    contentGateFailures: 0,
    preparationToolFailures: 1,
    paidCalls: 0,
    modelCalls: 0,
    networkCalls: 0,
    dbCalls: 0,
    chargedImageAttempts: 2,
    imageContextLoads: 2,
    chargedImageBudget: 8,
    imageContextBudget: 24,
  },
  preparationFailure: {
    command: "rg --files ... .claude/skills/ld-s10y-lesson/scripts | rg ...",
    observed: 'Nonexistent scripts directory; broad discovery was stopped and corrected to tools/. No image was opened and no source/content verdict resulted.',
  },
  imageAttempts: context.originalFigures.map((f, i) => ({
    attempt: i + 1, figure: f.id, path: f.source.path, sha256: f.source.sha256,
    action: 'functions.view_image original PNG', outcome: 'opened',
    charged: true, contextLoaded: true,
  })),
  independentReview: 'NOT_PERFORMED_AUTHOR_ONLY',
  registeredErrata: 0,
  sourceCorrectionApprovalClaim: false,
  promotionAllowed: false,
}
function saveState() {
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`)
}
function execute(name, argv, counter, snapshotFiles = []) {
  const dir = path.join(O, 'receipts', name)
  fs.mkdirSync(dir, { recursive: true })
  assert.ok(!fs.existsSync(path.join(dir, 'execution.json')), name)
  state.counters[counter] += 1
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  })
  const stdout = path.join(dir, 'stdout.txt')
  const stderr = path.join(dir, 'stderr.txt')
  fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' })
  const receipt = {
    name, cwd: W, argv, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message || null,
    streams: { stdout: { path: stdout, sha256: hash(stdout) }, stderr: { path: stderr, sha256: hash(stderr) } },
  }
  write(path.join(dir, 'execution.json'), receipt)
  state.attempts.push(receipt)
  if (result.status !== 0) {
    let validationFailure = false
    try { validationFailure = JSON.parse(result.stdout).status === 'fail' } catch {}
    const contentFailure = validationFailure || Boolean(snapshotFiles.find(f =>
      f.endsWith('.render.json') && fs.existsSync(f) && json(f).status === 'fail'))
    state.counters[contentFailure ? 'contentGateFailures' : 'technicalStageFailures'] += 1
    const failed = path.join(O, 'failures', name)
    fs.mkdirSync(failed, { recursive: true })
    const files = [...snapshotFiles, path.join(dir, 'execution.json'), stdout, stderr, statePath]
      .filter(f => fs.existsSync(f))
    const copies = files.map((file, i) => {
      const target = path.join(failed, `${i}-${path.basename(file)}`)
      fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(target, 0o444)
      return { original: file, path: target, sha256: hash(target) }
    })
    write(path.join(failed, 'failure.json'), { ...receipt, contentFailure, snapshots: copies, counters: state.counters })
    fs.chmodSync(path.join(failed, 'failure.json'), 0o444)
  }
  for (const file of [stdout, stderr, path.join(dir, 'execution.json')]) fs.chmodSync(file, 0o444)
  saveState()
  console.log(JSON.stringify({ name, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2))
  return result.status === 0
}

const point = (id, at, label, position, gap = 18) => ({
  id, type: 'point', at, label, visible: false, fontSize: 34, fontWeight: 500,
  labelPlacement: { position, gap },
})
const segment = (id, from, to, extra = {}) => ({
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 2.5, dash: 0, ...extra,
})
const text = (id, at, value, position = 'CENTER', gap = 0) => ({
  id, type: 'text', at, text: value, fontSize: 34, fontWeight: 500,
  labelPlacement: { position, gap },
})
const relation = (id, type, fields) => ({ id, type, ...fields })
const base = (id, description, canvas, inventory, objects, assertions) => ({
  schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic', description,
  source: {
    image: context.originalFigures.find(f => f.id === id).source,
    authoritativeText: relevant.slice(2).filter(b => b.kind === 'p').map(b => ({
      lesson: proposed.id, text: b.text,
    })),
    inventory,
  },
  canvas: { ...canvas, background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'inline', minTextPx: 16, widths: [331, 358, 640], maxWidthPx: 640 },
  layout: { minLabelGap: 4 },
  objects, assertions,
})

const fig190Objects = [
  point('triangle-A', [0, 3], 'A', 'W'),
  point('triangle-C', [0, 0], 'C', 'W'),
  point('triangle-B', [4, 0], 'B', 'E'),
  segment('triangle-AC', 'triangle-A', 'triangle-C'),
  segment('triangle-CB', 'triangle-C', 'triangle-B', { label: 'a', fontSize: 34, fontWeight: 500, labelPlacement: { position: 'N', gap: 22 } }),
  segment('triangle-AB', 'triangle-A', 'triangle-B', { label: 'c', fontSize: 34, fontWeight: 500, labelPlacement: { position: 'NE', gap: 22 } }),
  segment('right-angle-upright', [0.24, 0], [0.24, 0.24], { strokeWidth: 2 }),
  segment('right-angle-top', [0.24, 0.24], [0, 0.24], { strokeWidth: 2 }),
  segment('given-c-bar', [-0.5, 4.35], [4.5, 4.35], { label: 'c', fontSize: 34, fontWeight: 500, labelPlacement: { position: 'N', gap: 24 } }),
  segment('given-c-left-cap', [-0.5, 4.27], [-0.5, 4.43], { strokeWidth: 2 }),
  segment('given-c-right-cap', [4.5, 4.27], [4.5, 4.43], { strokeWidth: 2 }),
  segment('given-a-bar', [-0.5, 3.65], [3.5, 3.65], { label: 'a', fontSize: 34, fontWeight: 500, labelPlacement: { position: 'N', gap: 24 } }),
  segment('given-a-left-cap', [-0.5, 3.57], [-0.5, 3.73], { strokeWidth: 2 }),
  segment('given-a-right-cap', [3.5, 3.57], [3.5, 3.73], { strokeWidth: 2 }),
]
const fig190Assertions = [
  relation('triangle-leg-a', 'distance', { a: 'triangle-C', b: 'triangle-B', value: 4 }),
  relation('triangle-hypotenuse-c', 'distance', { a: 'triangle-A', b: 'triangle-B', value: 5 }),
  relation('triangle-right-at-C', 'perpendicular', { a: 'triangle-A', b: 'triangle-C', c: 'triangle-C', d: 'triangle-B' }),
  relation('given-c-matches-AB', 'equalDistance', { a: [-0.5, 4.35], b: [4.5, 4.35], c: 'triangle-A', d: 'triangle-B' }),
  relation('given-a-matches-CB', 'equalDistance', { a: [-0.5, 3.65], b: [3.5, 3.65], c: 'triangle-C', d: 'triangle-B' }),
  relation('given-bars-parallel-base', 'parallel', { a: [-0.5, 4.35], b: [4.5, 4.35], c: 'triangle-C', d: 'triangle-B' }),
  relation('given-bars-mutually-parallel', 'parallel', { a: [-0.5, 4.35], b: [4.5, 4.35], c: [-0.5, 3.65], d: [3.5, 3.65] }),
  relation('right-mark-upright-parallel-AC', 'parallel', { a: [0.24, 0], b: [0.24, 0.24], c: 'triangle-C', d: 'triangle-A' }),
  relation('right-mark-top-parallel-CB', 'parallel', { a: [0.24, 0.24], b: [0, 0.24], c: 'triangle-C', d: 'triangle-B' }),
]
const fig190 = base('fig-190',
  'PROPOSED math preview, not approved source correction: the original worked analysis of a right triangle from given hypotenuse c and leg a. Preserve both separate given-length bars and the same letters on ABC. Numerical coordinates are illustrative regularization, not printed givens.',
  { width: 640, height: 600, boundingBox: [-0.8, 5.025, 5, -0.4125] },
  [
    {
      id: 'triangle-and-known-lengths',
      description: 'Original PNG: A upper-left, C lower-left, B lower-right; AC vertical, CB horizontal, AB diagonal, right-angle box inside at C; a above CB and c beside AB. Top c and a bars have upright end caps, c is longer. A/B/C are labelled junctions, not separate printed dot markers. All named points and bar/triangle relationships remain in this group.',
      requires: ['pointRelationships'], objects: fig190Objects.map(o => o.id),
      assertions: fig190Assertions.map(a => a.id),
    },
  ], fig190Objects, fig190Assertions)

const fig191Objects = [
  point('construction-A', [-4, 3], 'A', 'W', 25),
  point('construction-C', [-4, 0], 'C', 'NW', 20),
  point('construction-B', [0, 0], 'B', 'NE', 15),
  { id: 'construction-circle', type: 'circle', center: 'construction-B', radius: 5, stroke: 'ink', strokeWidth: 2.5, dash: 0 },
  segment('construction-horizontal', [-5.35, 0], [5, 0]),
  segment('construction-p', [-4, -5], [-4, 5.4]),
  segment('construction-AB', 'construction-A', 'construction-B', { strokeWidth: 1.8, label: 'c', fontSize: 34, fontWeight: 500, labelPlacement: { position: 'NE', gap: 22 } }),
  text('construction-a', [-2, 0.38], 'a'),
  text('construction-p-name', [-4, 5.1], 'p', 'E', 12),
]
const fig191Assertions = [
  relation('construction-leg-a', 'distance', { a: 'construction-C', b: 'construction-B', value: 4 }),
  relation('construction-radius-c', 'distance', { a: 'construction-A', b: 'construction-B', value: 5 }),
  relation('construction-right-at-C', 'perpendicular', { a: 'construction-A', b: 'construction-C', c: 'construction-C', d: 'construction-B' }),
  relation('A-on-circle', 'pointOnCircle', { point: 'construction-A', center: 'construction-B', radius: 5 }),
  relation('A-on-p', 'pointOnLine', { point: 'construction-A', a: 'construction-C', b: [-4, 5.4] }),
  relation('C-on-horizontal', 'pointOnLine', { point: 'construction-C', a: [-5.35, 0], b: 'construction-B' }),
  relation('p-through-C', 'pointOnLine', { point: 'construction-C', a: [-4, -5], b: 'construction-A' }),
  relation('lower-crossing-on-circle', 'pointOnCircle', { point: [-4, -3], center: 'construction-B', radius: 5 }),
  relation('lower-crossing-on-p', 'pointOnLine', { point: [-4, -3], a: 'construction-C', b: 'construction-A' }),
  relation('left-crossing-on-circle', 'pointOnCircle', { point: [-5, 0], center: 'construction-B', radius: 5 }),
  relation('left-crossing-on-horizontal', 'pointOnLine', { point: [-5, 0], a: 'construction-C', b: 'construction-B' }),
  relation('right-crossing-on-circle', 'pointOnCircle', { point: [5, 0], center: 'construction-B', radius: 5 }),
  relation('right-crossing-on-horizontal', 'pointOnLine', { point: [5, 0], a: 'construction-C', b: 'construction-B' }),
  relation('upper-p-stroke-collinear', 'collinear', { a: [-4, 5.4], b: 'construction-A', c: 'construction-C' }),
  relation('lower-p-stroke-collinear', 'collinear', { a: [-4, -5], b: 'construction-A', c: 'construction-C' }),
]
const fig191 = base('fig-191',
  'PROPOSED math preview, not registered or approved source correction: original instructional construction with BC=a, perpendicular p through C, circle centered at B of mathematical radius c=AB>a>0 and upper intersection A. Literal source C in the two radius prose spans is retained separately in provenance; C remains the vertex, never the mathematical radius. No extra solution branch is drawn.',
  { width: 640, height: 680, boundingBox: [-5.6, 5.95, 5.6, -5.95] },
  [
    {
      id: 'single-construction-frame',
      description: 'Original PNG: one solid circle; B is its centre on the horizontal line; C lies left of B where vertical p meets that line; A labels the upper circle/p crossing. Thin solid AB is marked c; a is above CB; p is above the upper end of the vertical stroke. The circle/p lower crossing and circle/horizontal left and right crossings are unlabelled, undotted intersections, kept as coordinate-literal incidence assertions on the same visible traces. The vertical stroke continues above A and below the lower crossing; the horizontal stroke extends left of the circle and reaches the right circle boundary. No lower AB, added right-angle box, ticks, numbers, arrows or dashes.',
      requires: ['pointRelationships'], objects: fig191Objects.map(o => o.id),
      assertions: fig191Assertions.map(a => a.id),
    },
  ], fig191Objects, fig191Assertions)

const inventory = {
  schema: 'same188-6/source-pixel-inventory@1',
  status: 'AUTHOR_OBSERVATIONS_NOT_INDEPENDENT_REVIEW',
  basis: 'Both exact original PNGs actually opened with functions.view_image before authoring. Approximate pixel positions describe observed footprint only, never measured numerical givens.',
  rawsource: { path: context.source.path, sha256: context.source.sha256, relevantProse: rawRelevant },
  proposedPreview: { context: { path: contextPath, sha256: hash(contextPath) }, lesson: context.proposedText, relevantProse: relevant },
  literalSourceC: [
    { refs: ['p0138#10', 'p0139#1'], literal: '$(B,C)$', proposed: '$(B,c)$', approval: false, registration: false },
    { refs: ['p0139#5'], literal: '以$C$为半径', proposed: '以$c$为半径', approval: false, registration: false },
  ],
  mathematicalRadiusc: { symbol: 'c', meaning: 'AB', previewCondition: 'c>a>0', numericalCoordinatesArePrintedGivens: false },
  figures: [
    {
      id: 'fig-190', source: context.originalFigures[0].source, pixelSize: [421, 426],
      subfigures: 'Two separate given bars above one analysis triangle; no lettered subparts.',
      footprint: [
        { feature: 'top c bar', pixelsApprox: [[16, 38], [384, 39]], labelApprox: [184, 19], objects: ['given-c-bar', 'given-c-left-cap', 'given-c-right-cap'], assertions: ['given-c-matches-AB'] },
        { feature: 'lower a bar', pixelsApprox: [[13, 91], [309, 91]], labelApprox: [175, 69], objects: ['given-a-bar', 'given-a-left-cap', 'given-a-right-cap'], assertions: ['given-a-matches-CB'] },
        { feature: 'A', pixelsApprox: [76, 176], labelPosition: 'left', objects: ['triangle-A', 'triangle-AC', 'triangle-AB'], assertions: ['triangle-right-at-C', 'triangle-hypotenuse-c'] },
        { feature: 'C', pixelsApprox: [76, 403], labelPosition: 'left', objects: ['triangle-C', 'triangle-AC', 'triangle-CB'], assertions: ['triangle-right-at-C', 'triangle-leg-a'] },
        { feature: 'B', pixelsApprox: [374, 404], labelPosition: 'right', objects: ['triangle-B', 'triangle-CB', 'triangle-AB'], assertions: ['triangle-leg-a', 'triangle-hypotenuse-c'] },
        { feature: 'small right-angle mark at C', pixelsApprox: [[76, 382], [95, 382], [95, 402]], objects: ['right-angle-upright', 'right-angle-top'], assertions: ['triangle-right-at-C', 'right-mark-upright-parallel-AC', 'right-mark-top-parallel-CB'] },
        { feature: 'known a over CB and known c alongside AB', labelsApprox: [[198, 385], [241, 271]], objects: ['triangle-CB', 'triangle-AB'], assertions: ['triangle-leg-a', 'triangle-hypotenuse-c'] },
      ],
      strokes: 'Bars, three sides and right-angle mark are solid black; all four bar end caps are upright. No dot markers, intentional dash pattern, arrows, grid, axis, numeric values or caption inside these pixels.',
      uncertainty: 'Diagonal c has scan dropout around the glyph and adjacent line. This is not evidence of a deliberate dashed side. Exact scan proportions and stroke noise are not asserted as given data.',
      regularization: 'Common a=4,c=5 illustration units with AC=3; lengths are not displayed numerically. Bars have exact matching lengths. Compressed gap above A and uniform strokes preserve the source groups without excess whitespace.',
    },
    {
      id: 'fig-191', source: context.originalFigures[1].source, pixelSize: [401, 410],
      subfigures: 'One construction frame, no lettered subparts.',
      footprint: [
        { feature: 'full circle', pixelsApprox: { centre: [209, 219], extremes: [[30, 219], [209, 41], [387, 219], [209, 398]] }, objects: ['construction-circle'], assertions: ['A-on-circle', 'lower-crossing-on-circle', 'left-crossing-on-circle', 'right-crossing-on-circle'] },
        { feature: 'A upper crossing', pixelsApprox: [74, 103], labelPosition: 'left', objects: ['construction-A', 'construction-circle', 'construction-p', 'construction-AB'], assertions: ['A-on-circle', 'A-on-p', 'construction-radius-c', 'construction-right-at-C'] },
        { feature: 'C horizontal/p crossing', pixelsApprox: [74, 219], labelPosition: 'upper-left', objects: ['construction-C', 'construction-horizontal', 'construction-p'], assertions: ['C-on-horizontal', 'p-through-C', 'construction-leg-a', 'construction-right-at-C'] },
        { feature: 'B centre and end of AB', pixelsApprox: [209, 219], labelPosition: 'upper-right', objects: ['construction-B', 'construction-circle', 'construction-horizontal', 'construction-AB'], assertions: ['construction-leg-a', 'construction-radius-c', 'A-on-circle'] },
        { feature: 'unlabelled lower circle/p crossing', pixelsApprox: [74, 336], previewCoordinate: [-4, -3], objects: ['construction-circle', 'construction-p'], assertions: ['lower-crossing-on-circle', 'lower-crossing-on-p'] },
        { feature: 'unlabelled left circle/horizontal crossing', pixelsApprox: [30, 219], previewCoordinate: [-5, 0], objects: ['construction-circle', 'construction-horizontal'], assertions: ['left-crossing-on-circle', 'left-crossing-on-horizontal'] },
        { feature: 'unlabelled right circle/horizontal crossing', pixelsApprox: [387, 219], previewCoordinate: [5, 0], objects: ['construction-circle', 'construction-horizontal'], assertions: ['right-crossing-on-circle', 'right-crossing-on-horizontal'] },
        { feature: 'p stroke and p label', pixelsApprox: [[74, 28], [74, 391]], labelApprox: [94, 21], objects: ['construction-p', 'construction-p-name'], assertions: ['upper-p-stroke-collinear', 'lower-p-stroke-collinear', 'p-through-C'] },
        { feature: 'horizontal line through C and B', pixelsApprox: [[13, 220], [387, 218]], objects: ['construction-horizontal'], assertions: ['C-on-horizontal', 'left-crossing-on-horizontal', 'right-crossing-on-horizontal'] },
        { feature: 'thin AB with c above; a above CB', labelsApprox: [[161, 151], [139, 200]], objects: ['construction-AB', 'construction-a'], assertions: ['construction-radius-c', 'construction-leg-a'] },
      ],
      strokes: 'Circle, p and horizontal line are solid; AB is thinner solid. No distinct dots at A/B/C or the three other crossings; no tick, numeric value, right-angle square, lower diagonal, arrow, grid, caption or intentional dashes.',
      uncertainty: 'The horizontal trace slopes slightly in scan pixels and B lacks a distinct centre dot. The textual centre relation supplies B at the centre; do not invent a dot. Endpoints of the p stroke are stroke terminations, not separately named mathematical points.',
      regularization: 'Same a=4,c=5 illustration units as fig-190; circle is exactly circular, B is its centre, C lies on the interior horizontal line, A=(-4,3). All unlabelled crossings are retained by visible traces and wholly within-group literal incidence assertions, without invented marker/label objects. No second triangle is added.',
    },
  ],
  reviewRestrictions: 'Source pixel inventory is the author comparison only; sole independent reviewer comes later. Proposal comparison/registration remains pending. No source-correction approval, native finalization, lesson approval or promotion.',
}

const command = process.argv[2]
if (command === 'build') {
  write(path.join(O, 'inputs-before.json'), {
    context: { path: contextPath, sha256: hash(contextPath) },
    lesson: context.proposedText, raw: context.source, figures: context.originalFigures,
  })
  write(path.join(O, 'source-inventory.json'), inventory)
  for (const spec of [fig190, fig191]) {
    write(path.join(O, 'figures', `${spec.id}.spec.json`), spec)
    state.counters.contentRevisions[spec.id] = 1
  }
  saveState()
} else if (command === 'repair-text-scope') {
  assert.equal(state.counters.validatorCalls, 1)
  assert.equal(state.counters.rendererCalls, 0)
  state.counters.technicalStageFailures -= 1
  state.counters.contentGateFailures += 1
  state.failureClassificationCorrection = {
    original: 'technicalStageFailures',
    corrected: 'contentGateFailures',
    reason: 'Validator executed successfully and rejected overly broad authoritative-text scope. Original receipt/snapshot remains immutable.',
  }
  for (const spec of [fig190, fig191]) {
    const file = path.join(O, 'figures', `${spec.id}.spec.json`)
    const previous = json(file)
    assert.deepEqual(previous.objects, spec.objects)
    assert.deepEqual(previous.assertions, spec.assertions)
    const snapshot = path.join(O, 'snapshots', `${spec.id}.pre-text-scope-repair.spec.json`)
    fs.mkdirSync(path.dirname(snapshot), { recursive: true })
    fs.copyFileSync(file, snapshot, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(snapshot, 0o444)
    fs.writeFileSync(file, `${JSON.stringify(spec, null, 2)}\n`)
    state.counters.contentRevisions[spec.id] += 1
  }
  saveState()
} else if (command === 'repair-p-label') {
  const file = path.join(O, 'figures/fig-191.spec.json')
  const previous = json(file)
  assert.equal(previous.objects.find(o => o.id === 'construction-p-name').at[1], 5.5)
  assert.deepEqual(previous.assertions, fig191.assertions)
  fs.writeFileSync(file, `${JSON.stringify(fig191, null, 2)}\n`)
  state.counters.contentRevisions['fig-191'] += 1
  saveState()
} else if (command === 'render') {
  const id = process.argv[3]
  assert.ok(['fig-190', 'fig-191'].includes(id))
  const attempt = process.argv[4] || 'first'
  const spec = path.join(O, 'figures', `${id}.spec.json`)
  const svg = path.join(O, 'figures', `${id}.svg`)
  const report = path.join(O, 'figures', `${id}.render.json`)
  if (!execute(`${id}-${attempt}-validate`, ['python3', path.join(W, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'), spec, '--stage', 'draft', '--json'], 'validatorCalls', [spec])) process.exit(1)
  if (!execute(`${id}-${attempt}-render`, ['node', path.join(W, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'), '--spec', spec, '--svg', svg, '--report', report], 'rendererCalls', [spec, svg, report])) process.exit(1)
} else if (command === 'draft') {
  for (const id of ['fig-190', 'fig-191']) assert.equal(json(path.join(O, 'figures', `${id}.render.json`)).status, 'pass')
  const book = path.join(O, 'draft-book')
  const edition = path.join(book, 'editions', 'modern-us-neutral')
  const lessonDir = path.join(edition, 'lessons', proposed.id)
  write(path.join(lessonDir, 'lesson.json'), {
    id: proposed.id, card_id: proposed.card_id, title: proposed.title,
    printed_title: proposed.printed_title, chapter: proposed.chapter, section: proposed.section,
    start_printed: proposed.start_printed, status: 'draft',
    prose: relevant, figures: proposed.figures.filter(f => ['fig-190', 'fig-191'].includes(f.id)),
  })
  write(path.join(lessonDir, 'exercises.json'), { count: 0, exercises: [] })
  for (const id of ['fig-190', 'fig-191']) {
    for (const ext of ['spec.json', 'svg']) {
      const target = path.join(edition, 'figures', `${id}.${ext}`)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.copyFileSync(path.join(O, 'figures', `${id}.${ext}`), target, fs.constants.COPYFILE_EXCL)
    }
  }
  write(path.join(O, 'draft-scope.json'), {
    status: 'PROPOSED_PREVIEW_ONLY_NOT_COMPLETE_LESSON',
    originalCandidate: context.proposedText,
    projection: 'Only original instructional first worked construction through its following congruence theorem; no later figures or exercises included. Empty exercises container is an offline renderer input, not an authored exercise set.',
    registeredErrata: 0, independentReview: false, approval: false, finalization: false, promotion: false,
  })
  if (!execute('draft-display-first-render', ['node', path.join(W, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js'), book, '--edition', 'modern-us-neutral', '--lesson', proposed.id, '--out', path.join(O, 'draft-display')], 'draftLessonRenderCalls')) process.exit(1)
} else if (command === 'preserve-display-import-failure') {
  const failure = path.join(O, 'failures/display-first-import')
  fs.mkdirSync(failure, { recursive: true })
  const script = path.join(O, 'display.mjs')
  const snapshot = path.join(failure, 'display.mjs')
  fs.copyFileSync(script, snapshot, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(snapshot, 0o444)
  state.counters.displayCalls += 1
  state.counters.technicalStageFailures += 1
  const receipt = {
    cwd: W, argv: ['node', script], exitCode: 1,
    observedToolCall: 'functions.exec_command',
    stdout: '',
    stderr: "Error: Cannot find module 'pngjs'\nRequire stack:\n- /Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.agents/skills/package.json\ncode: 'MODULE_NOT_FOUND'\nNode.js v24.16.0",
    diagnosis: 'Static module import failed before state counter increment, browser launch, screenshot generation or image context load. Preserve first failure, use browser canvas for PNG decoding; no dependency changes.',
    snapshot: { path: snapshot, sha256: hash(snapshot) },
    imageAttemptsAdded: 0, screenshotOutputsCreated: 0,
  }
  write(path.join(failure, 'execution.json'), receipt)
  fs.chmodSync(path.join(failure, 'execution.json'), 0o444)
  state.attempts.push(receipt)
  saveState()
} else if (command === 'charge') {
  const file = path.resolve(process.argv[3])
  const figure = process.argv[4]
  assert.ok(file.startsWith(`${O}/`))
  assert.ok(state.counters.chargedImageAttempts < 8)
  assert.ok(state.counters.imageContextLoads < 24)
  state.counters.chargedImageAttempts += 1
  state.counters.imageContextLoads += 1
  state.imageAttempts.push({
    attempt: state.counters.chargedImageAttempts, figure, path: file, sha256: hash(file),
    action: 'functions.view_image draft display output',
    outcome: 'charged-before-tool-call', charged: true, contextLoaded: true,
  })
  saveState()
} else {
  throw new Error('Expected build, render <id> [attempt], draft, or charge <file> <figure>')
}
