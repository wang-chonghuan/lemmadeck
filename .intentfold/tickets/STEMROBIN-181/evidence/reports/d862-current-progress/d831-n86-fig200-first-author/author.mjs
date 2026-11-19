import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d831-n86-fig200-first-author')
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp')
const card = 'phy10-c2-s3-n86'
assert.equal(process.cwd(), R)
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const binding = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const write = (p, value) => {
  assert.ok(p.startsWith(`${D}/`), `Write outside authorization: ${p}`)
  assert.ok(!fs.existsSync(p), `Preserve existing output: ${p}`)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
}
const source = path.join(T, 'd758-source227228-consume-prepare84-85/root/10p/figures/fig-200.png')
const raw = path.join(T, `d793-reviews-consume-source230/root/10p/lessons/${card}/lesson.json`)
const requirements = path.join(T, 'd793-reviews-consume-source230/n86-preauthor-source-requirements.json')
const clearancePath = path.join(T, 'd818-n86-center-contact-title-affected-review/report.json')
const clearance = read(clearancePath)
const skills = path.join(R, '.agents/skills/ld-s10y-image')
const python = path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const runtimeTmp = path.join(D, 'runtime-tmp')
fs.mkdirSync(runtimeTmp, { recursive: true })

function nativeCall(name, command, args) {
  const result = spawnSync(command, args, {
    cwd: R,
    encoding: 'utf8',
    env: { ...process.env, TMPDIR: runtimeTmp, PYTHONDONTWRITEBYTECODE: '1', PYTHON: python },
    maxBuffer: 16 * 1024 * 1024,
  })
  const receipt = {
    schema: 'd831/native-call@1', name, cwd: R, command, args,
    script: binding(args[0]), exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message || null,
    environmentOverrides: { TMPDIR: runtimeTmp, PYTHONDONTWRITEBYTECODE: '1', PYTHON: python },
    paidCalls: 0,
  }
  write(path.join(D, `calls/${name}.json`), receipt)
  if (result.status !== 0) {
    const first = path.join(D, 'FIRST-native-failure.json')
    if (!fs.existsSync(first)) write(first, receipt)
    throw new Error(`Native call ${name} failed; exact first receipt preserved.`)
  }
  return receipt
}

if (process.argv[2] === 'prepare') {
  assert.equal(clearance.status, 'PASS')
  assert.equal(clearance.scopedClearance.status, 'PASS')
  assert.equal(hash(raw), 'cb86aaab8db34ab8b7217220499639f39f952279bd4e74881a00db24d80bc64a')
  const inputs = {
    originalPng: binding(source),
    retainedMatchingPng: binding(path.join(T, 'd793-reviews-consume-source230/root/10p/figures/fig-200.png')),
    rawLesson: binding(raw), frozenRequirements: binding(requirements),
    affectedTextClearance: binding(clearancePath), templates: {},
    instructions: Object.fromEntries([
      'SKILL.md', 'references/figure-spec.md', 'references/routing.md', 'references/quality-gate.md',
    ].map(p => [p, binding(path.join(skills, p))])),
    productionResume: binding(path.join(R, '.claude/skills/ld-s10y-lesson/references/production-resume.md')),
    tools: Object.fromEntries(['build_context.py', 'validate_spec.py', 'render_spec.mjs'].map(p => [p, binding(path.join(skills, 'scripts', p))])),
  }
  assert.equal(inputs.originalPng.sha256, inputs.retainedMatchingPng.sha256)
  const contexts = {}
  const allText = []
  for (const locale of ['zh', 'en']) {
    const approved = path.join(T, `d815-n86-center-contact-title-repair/frozen/${locale}`)
    const lesson = path.join(approved, 'lesson.template.json')
    const exercises = path.join(approved, 'exercises.template.json')
    assert.equal(hash(lesson), clearance.bindings[`${locale}Candidate`].sha256)
    const l = read(lesson)
    const e = read(exercises)
    assert.equal(l.source.sha256, hash(raw))
    assert.deepEqual(l.source.data, read(raw))
    assert.equal(l.status, 'draft')
    assert.equal(e.count, 0)
    assert.deepEqual(e.exercises, [])
    const projectionRoot = path.join(D, `projection/${locale}`)
    const projectedLesson = path.join(projectionRoot, `10p/editions/modern-us-neutral/lessons/${card}`)
    const projectedImage = path.join(projectionRoot, '10p/figures/fig-200.png')
    fs.mkdirSync(projectedLesson, { recursive: true })
    fs.mkdirSync(path.dirname(projectedImage), { recursive: true })
    fs.symlinkSync(source, projectedImage)
    const projected = {}
    for (const [from, name] of [[lesson, 'lesson.json'], [exercises, 'exercises.json']]) {
      const to = path.join(projectedLesson, name)
      assert.ok(!fs.existsSync(to))
      fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(to, 0o600)
      assert.equal(hash(from), hash(to))
      projected[name] = binding(to)
    }
    inputs.templates[locale] = { lesson: binding(lesson), exercises: binding(exercises), projection: projected }
    const output = path.join(D, `contexts/${locale}.context.json`)
    nativeCall(`build-context-${locale}`, python, [
      path.join(skills, 'scripts/build_context.py'),
      '--book', '10p', '--edition', 'modern-us-neutral', '--figure', 'fig-200',
      '--root', projectionRoot, '--output', output,
    ])
    const context = read(output)
    assert.equal(context.sourceImage.sha256, inputs.originalPng.sha256)
    assert.equal(context.lessons.length, 1)
    assert.equal(context.lessons[0].lesson, card)
    contexts[locale] = binding(output)
    allText.push(...l.prose.filter(b => ['p', 'cap'].includes(b.kind) && b.text.trim()).map(b => ({ lesson: card, text: b.text })))
  }
  write(path.join(D, 'inputs.json'), inputs)
  write(path.join(D, 'context-bindings.json'), {
    schema: 'd831/hash-bound-context@1', figure: 'fig-200', card, contexts,
    inputs, sourceInventory: binding(path.join(D, 'source-inventory.json')),
    projection: 'Writable byte-identical approved draft lesson/exercise copies; native build_context only. Original PNG is a read-only input via symlink. No finalization, manifest, index or canonical edits.',
    completeApprovedBilingualText: allText,
    externalDependencies: [{
      id: 'plateV', literal: '\u5f69\u56fe V', sourceRef: 'p0229#3',
      status: 'HOLD-UNINSPECTED-SEPARATE-DEPENDENCY', pixelsOpened: false,
      sourcePixels: 'PENDING-EXTERNAL', romanPlateOwnership: 'PENDING-EXTERNAL',
      spectralColorApproval: 'PENDING-EXTERNAL', FIG: 'NOT-CLEARED',
      native: 'NOT-CLEARED', DISPLAY: 'NOT-CLEARED', omittedOrRenamed: false,
    }],
    independentReviewGranted: false, wholeN86Complete: false,
  })
  console.log(JSON.stringify({ status: 'CONTEXT-BUILT-DRAFT-ONLY', source: inputs.originalPng, contexts }))
} else if (process.argv[2] === 'author') {
  const context = read(path.join(D, 'context-bindings.json'))
  assert.equal(context.inputs.originalPng.sha256, hash(source))
  const radius = 10
  const ring = 3.6
  const gap = radius - Math.sqrt(radius ** 2 - ring ** 2)
  const halfLens = 6.8
  const upperFace = radius - Math.sqrt(radius ** 2 - halfLens ** 2)
  const objects = []
  const assertions = []
  const point = (id, at) => objects.push({ id, type: 'point', at, size: 1.5, strokeWidth: 1, fill: 'ink', stroke: 'ink' })
  const edge = (id, from, to, style = {}) => {
    objects.push({ id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, ...style })
    assertions.push({ id: `${id}-endpoints`, type: 'connects', arrow: id, from, to })
  }
  const label = (id, at, text, fontSize = 32) => objects.push({
    id, type: 'text', at, text, fontSize, fontWeight: 400,
    labelPlacement: { position: 'CENTER' }, labelColor: 'ink',
  })
  const C = 'raw200-curvature-center'
  const P = 'raw200-ring-surface-point'
  const Q = 'raw200-axis-at-gap-height'
  const O = 'raw200-center-contact'
  const F = 'raw200-gap-foot'
  const L = 'raw200-lens-left'
  const E = 'raw200-lens-right'
  const PL = 'raw200-plate-left'
  const PR = 'raw200-plate-right'

  const lensFill = [[-halfLens, upperFace]]
  for (let n = 0; n <= 80; n++) {
    const x = -halfLens + n * 2 * halfLens / 80
    lensFill.push([x, radius - Math.sqrt(radius ** 2 - x ** 2)])
  }
  objects.push({
    id: 'modern-lens-material-tint', type: 'polygon', points: lensFill,
    stroke: 'accentSoft', strokeWidth: 0.5, fill: 'accentSoft', fillOpacity: 0.16,
  })
  for (let n = 0; n < 32; n++) {
    const x = -7.7 + n * 0.48
    objects.push({ id: `modern-plate-hatch-${n}`, type: 'segment', from: [x - 0.18, -0.55], to: [x + 0.18, -0.08], stroke: 'muted', strokeWidth: 1.7 })
  }
  point(C, [0, radius])
  point(P, [-ring, gap])
  point(Q, [0, gap])
  point(O, [0, 0])
  point(F, [-ring, 0])
  point(L, [-halfLens, upperFace])
  point(E, [halfLens, upperFace])
  point(PL, [-7.9, 0])
  point(PR, [7.9, 0])
  objects.push({ id: 'raw200-curved-lens-surface', type: 'arc', center: C, start: L, end: E, stroke: 'ink', strokeWidth: 3.2 })
  edge('raw200-lens-flat-face', L, E)
  edge('raw200-plate-surface', PL, PR, { strokeWidth: 4 })
  edge('raw200-oblique-radius', C, P)
  edge('raw200-full-vertical-radius', C, O)
  edge('raw200-ring-radius', P, Q)
  edge('raw200-gap-at-surface', F, P, { strokeWidth: 2 })
  objects.push({ id: 'modern-gap-guide', type: 'segment', from: P, to: [-5.2, gap], stroke: 'muted', strokeWidth: 1.5, dash: 2 })
  objects.push({ id: 'modern-gap-dimension', type: 'measure', from: [-5.2, 0], to: [-5.2, gap], capSize: 0.18, stroke: 'ink', strokeWidth: 2 })
  objects.push({ id: 'modern-right-angle-v', type: 'segment', from: [-0.42, gap], to: [-0.42, gap + 0.42], stroke: 'ink', strokeWidth: 1.8 })
  objects.push({ id: 'modern-right-angle-h', type: 'segment', from: [-0.42, gap + 0.42], to: [0, gap + 0.42], stroke: 'ink', strokeWidth: 1.8 })
  label('raw200-oblique-R', [-2.25, 5.3], 'R', 34)
  label('raw200-vertical-R', [0.85, 5.2], 'R', 34)
  label('raw200-ring-r', [-2.0, 1.63], 'r', 42)
  label('raw200-ring-k-subscript', [-1.42, 1.39], 'k', 32)
  label('raw200-gap-h', [-6.95, 0.78], 'h', 42)
  label('raw200-gap-k-subscript', [-6.3, 0.54], 'k', 32)
  label('modern-lens-label', [3.45, 3.5], 'Lens', 32)
  label('modern-plate-label', [2.85, -1.25], 'Glass plate', 32)

  assertions.push(
    { id: 'raw200-offcenter-on-sphere', type: 'pointOnCircle', point: P, center: C, radius, tolerance: 1e-9 },
    { id: 'raw200-contact-on-sphere', type: 'pointOnCircle', point: O, center: C, radius, tolerance: 1e-9 },
    { id: 'raw200-left-edge-on-sphere', type: 'pointOnCircle', point: L, center: C, radius, tolerance: 1e-9 },
    { id: 'raw200-right-edge-on-sphere', type: 'pointOnCircle', point: E, center: C, radius, tolerance: 1e-9 },
    { id: 'raw200-two-equal-R', type: 'equalDistance', a: C, b: P, c: C, d: O, tolerance: 1e-9 },
    { id: 'raw200-axis-collinear', type: 'collinear', a: C, b: Q, c: O, tolerance: 1e-9 },
    { id: 'raw200-right-triangle', type: 'perpendicular', a: P, b: Q, c: Q, d: C, tolerance: 1e-9 },
    { id: 'raw200-gap-vertical', type: 'perpendicular', a: F, b: P, c: PL, d: PR, tolerance: 1e-9 },
    { id: 'raw200-contact-tangent', type: 'perpendicular', a: C, b: O, c: PL, d: PR, tolerance: 1e-9 },
    { id: 'raw200-ring-parallel-plate', type: 'parallel', a: P, b: Q, c: PL, d: PR, tolerance: 1e-9 },
    { id: 'raw200-flat-face-parallel-plate', type: 'parallel', a: L, b: E, c: PL, d: PR, tolerance: 1e-9 },
    { id: 'raw200-contact-on-plate', type: 'collinear', a: PL, b: O, c: PR, tolerance: 1e-9 },
    { id: 'raw200-gap-foot-on-plate', type: 'collinear', a: PL, b: F, c: PR, tolerance: 1e-9 },
    { id: 'raw200-gap-equals-axis-remainder', type: 'equalDistance', a: F, b: P, c: O, d: Q, tolerance: 1e-9 },
    { id: 'raw200-vertical-leg-R-minus-h', type: 'distance', a: C, b: Q, value: radius - gap, tolerance: 1e-9 },
    { id: 'raw200-radius-r-length', type: 'distance', a: P, b: Q, value: ring, tolerance: 1e-9 },
    { id: 'raw200-gap-h-length', type: 'distance', a: F, b: P, value: gap, tolerance: 1e-9 },
  )
  const inventory = [
    {
      id: 'raw200-lens', description: 'Source shallow lens, flat upper face and lower curved surface. Exact circle is modern regularization from approved radius text; tint replaces material marks, not a source grid.',
      objects: [C, P, O, L, E, 'raw200-curved-lens-surface', 'raw200-lens-flat-face'],
      assertions: ['raw200-offcenter-on-sphere', 'raw200-contact-on-sphere', 'raw200-left-edge-on-sphere', 'raw200-right-edge-on-sphere', 'raw200-lens-flat-face-endpoints'],
      requires: ['pointRelationships'],
    },
    {
      id: 'raw200-radii-triangle-gap', description: 'Source two R radii, horizontal r_k, local vertical h_k, and their shared frame. Upper vertical triangle leg is R-h_k, not full R. No numeric values were present.',
      objects: [C, P, Q, O, F, 'raw200-oblique-radius', 'raw200-full-vertical-radius', 'raw200-ring-radius', 'raw200-gap-at-surface'],
      assertions: ['raw200-oblique-radius-endpoints', 'raw200-full-vertical-radius-endpoints', 'raw200-ring-radius-endpoints', 'raw200-gap-at-surface-endpoints', 'raw200-two-equal-R', 'raw200-axis-collinear', 'raw200-right-triangle', 'raw200-gap-equals-axis-remainder', 'raw200-vertical-leg-R-minus-h', 'raw200-radius-r-length', 'raw200-gap-h-length'],
      requires: ['pointRelationships'],
    },
    {
      id: 'raw200-plate-contact', description: 'Source horizontal plate below lens, true center contact and off-center gap foot; hatching denotes glass, not measured grid cells.',
      objects: [PL, PR, O, F, C, P, Q, L, E, 'raw200-plate-surface'],
      assertions: ['raw200-plate-surface-endpoints', 'raw200-contact-on-plate', 'raw200-gap-foot-on-plate', 'raw200-contact-tangent', 'raw200-gap-vertical', 'raw200-ring-parallel-plate', 'raw200-flat-face-parallel-plate'],
      requires: ['pointRelationships'],
    },
    {
      id: 'raw200-labels-values', description: 'Exactly four source mathematical label groups: R, R, r_k, h_k. The two k characters are separately rendered at the minimum readable font size. No source numbers or numeric answer annotations.',
      objects: ['raw200-oblique-R', 'raw200-vertical-R', 'raw200-ring-r', 'raw200-ring-k-subscript', 'raw200-gap-h', 'raw200-gap-k-subscript'],
      assertions: ['raw200-two-equal-R', 'raw200-radius-r-length', 'raw200-gap-h-length'],
    },
  ]
  write(path.join(D, 'frozen/fig-200.spec.json'), {
    schema: 'ld-s10y-image/figure-spec@2', id: 'fig-200', mode: 'deterministic',
    description: 'Newton-ring lens and plate cross-section preserving R, r_k, h_k, the exact right-triangle relationship and true center contact. Illustration coordinates are not supplied measurements or numerical answers. Modern additions: material tint and plate hatching regularization, right-angle marker, thickness guide, and English material labels.',
    source: { image: { path: source, sha256: hash(source) }, authoritativeText: context.completeApprovedBilingualText, inventory },
    canvas: { width: 640, height: 560, boundingBox: [-8.6, 12.8, 8.6, -2.25], background: 'paper', keepAspectRatio: true },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths: [342, 640] },
    objects, assertions, layout: { minLabelGap: 3 },
  })
  write(path.join(D, 'geometry-basis.json'), {
    schema: 'd831/geometry-basis@1', authorRevision: 0,
    sourceNumericValues: [], visibleNumericValues: [],
    constructionOnly: { R: radius, r_k: ring, h_k: gap, lensHalfWidth: halfLens, upperFace },
    exactRelations: {
      pythagoreanResidual: radius ** 2 - (ring ** 2 + (radius - gap) ** 2),
      expandedResidual: 2 * radius * gap - ring ** 2 - gap ** 2,
      thinGapRatio: gap / ring, trueContact: [0, 0],
      fullVerticalR: [C, O], verticalTriangleLeg: [C, Q],
    },
    symbolicLabels: [
      { notation: 'R', objects: ['raw200-oblique-R'], denotes: [C, P] },
      { notation: 'R', objects: ['raw200-vertical-R'], denotes: [C, O] },
      { notation: 'r_k', objects: ['raw200-ring-r', 'raw200-ring-k-subscript'], denotes: [P, Q] },
      { notation: 'h_k', objects: ['raw200-gap-h', 'raw200-gap-k-subscript'], denotes: [F, P] },
    ],
    sourceInventory: binding(path.join(D, 'source-inventory.json')),
    contexts: binding(path.join(D, 'context-bindings.json')),
    noAnswerKeyUsed: true, independentReviewGranted: false,
  })
  console.log(JSON.stringify({ status: 'FIRST-FIGURESPEC-AUTHORED-DRAFT', spec: binding(path.join(D, 'frozen/fig-200.spec.json')), objects: objects.length, assertions: assertions.length }))
} else if (process.argv[2] === 'validate') {
  nativeCall(`validate-spec-${process.argv[3] || 'first'}`, python, [
    path.join(skills, 'scripts/validate_spec.py'),
    path.join(D, 'frozen/fig-200.spec.json'), '--stage', 'draft', '--json',
  ])
  console.log('AUTHOR-NATIVE-VALIDATION-PASS')
} else if (process.argv[2] === 'render') {
  nativeCall(`render-${process.argv[3] || 'first'}`, process.execPath, [
    path.join(skills, 'scripts/render_spec.mjs'),
    '--spec', path.join(D, 'frozen/fig-200.spec.json'),
    '--svg', path.join(D, 'frozen/fig-200.svg'),
    '--png', path.join(D, 'previews/fig-200-native-640.png'),
    '--report', path.join(D, 'frozen/fig-200.render.json'),
  ])
  console.log('AUTHOR-NATIVE-RENDER-PASS')
} else {
  throw new Error('Expected prepare, author, validate or render. No automatic promotion or review path exists.')
}
