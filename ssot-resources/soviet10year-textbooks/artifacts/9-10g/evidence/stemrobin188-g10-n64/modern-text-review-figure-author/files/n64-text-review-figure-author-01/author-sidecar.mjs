import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const output = path.dirname(fileURLToPath(import.meta.url))
assert.equal(output, path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n64-text-review-figure-author-01'))
const input = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/g10-n64')
const lessonDir = '9-10g/lessons/geo910-c2-s3-n64'
const candidateDir = 'work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n64'
const files = [
  ['source-lesson', `artifacts/${lessonDir}/lesson.json`, 'a3e2185a3040997916c68d37450d9c566bcba9388a50195360e3a342842ea2d3'],
  ['source-exercises', `artifacts/${lessonDir}/exercises.json`, '53130f969fc02d4cbb412b2e22b49f47a5a9bf2b6ce4311e0b69e21e02e27709'],
  ['modern-lesson', `${candidateDir}/lesson.template.json`, '29a592a2d1c36424f45c36d24a100a88b1ef19902cfc44b0818995ee2bb1379d'],
  ['modern-exercises', `${candidateDir}/exercises.template.json`, 'ab3f0bbdbaf86b41c8d556c3bd9656b6512f6391820d77ccfd60567ab2f47b12'],
  ['lesson-FIRST', `${candidateDir}/lesson.FIRST.json`, '9ef8c71e5a3de7796f6d81c5d6f710f54e194171da633bff8a81b5eb53761d2c'],
  ['exercises-FIRST', `${candidateDir}/exercises.FIRST.json`, 'f44a6813df01914b99e3a5927d1c898a839355472a864005a5864c12343b06cc'],
  ['source-PNG', 'artifacts/9-10g/figures/fig-g10-96.png', 'b52716065833d05150fbbc9b9cb36d3f46c639b5d91645cb96c17c11bbfe6473'],
  ['source-SVG', 'artifacts/9-10g/figures/fig-g10-96.svg', '131f1d5a3f9e44f47ef05a4e90a6e447dc3eb3890fd24f2a4099bfe5e2856164'],
]
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const mode = file => (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0')
const binding = (role, relative, before) => {
  const file = path.join(input, relative)
  const after = hash(file)
  assert.equal(after, before, `Input changed: ${role}`)
  if (role.endsWith('FIRST')) assert.equal(mode(file), '0444')
  return { role, path: file, sha256Before: before, sha256After: after, modeBefore: role.endsWith('FIRST') ? '0444' : '0644', modeAfter: mode(file) }
}
const bindings = () => files.map(parts => binding(...parts))
const load = relative => JSON.parse(fs.readFileSync(path.join(input, relative), 'utf8'))
const write = (name, value) => {
  assert.equal(path.basename(name), name)
  const file = path.join(output, name)
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o644 })
  return file
}
const metadata = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size, mode: mode(file) })
const normalized = text => text.replace(/\s+/gu, '')
const math = text => [...text.matchAll(/\$([^$]*)\$/gu)].map(match => normalized(match[1]))
const numbers = text => text.match(/\d+/gu) || []

const proseNotes = [
  'Definition preserves the unique common-point condition; repaired bold delimiters and punctuation only.',
  'Identifies A as that unique common point; the circle-line analogy is unchanged; sentence newline is outside math.',
  'Theorem 37 retains both necessary and sufficient conditions; adding "one" before diameter clarifies the existing existential meaning.',
  'Sufficiency retains diameter AB, A in alpha, AB perpendicular to alpha, radius distance, Theorem 36 and unique contact A; line breaks do not split formulas.',
  'Necessity retains OA perpendicular to alpha as the goal, strict distance less than |OA| under the contrary assumption, contradiction using Theorem 36, and final AB perpendicular to alpha; the blank line separates the contradiction paragraph.',
  'Figure placeholder fig-g10-96, empty text, page and source reference remain unchanged; no figure acceptance is implied.',
  'Tangent-line definition still requires a line in the tangent plane through the contact point and exactly one common point with the sphere.',
  'Caption identity Figure 96 is unchanged.',
]
const exerciseNotes = [
  '229 retains the count-of-tangent-planes task and both on-sphere/outside-sphere cases; only subpart line breaks.',
  '230 retains the count-of-tangent-lines task and both on-sphere/outside-sphere cases; only subpart line breaks.',
  '231 retains both center-locus tasks: specified contact O, and specified radius with tangency to the given plane; only subpart line breaks.',
  '232 retains R, phi, the distance to the dihedral edge, the starred second subpart, three coordinate planes and positive center coordinates. A newline now separates 1) and $2^*$).',
  '233 retains radius R, a section through the contact point and angle phi with the tangent plane; text is byte-identical.',
  '234 retains x^2+y^2+z^2=9 and all three signed coordinate triples; only subpart line breaks. Layout lines remove source wrapping artifacts without changing canonical text.',
  '235 retains the sphere equation, A(m,p,q), and the target tangent-plane equation mx+py+qz=R^2; canonical text is byte-identical.',
]

function prepare() {
  const inputBindings = bindings()
  const sourceLesson = load(`artifacts/${lessonDir}/lesson.json`)
  const sourceExercises = load(`artifacts/${lessonDir}/exercises.json`)
  const modernLesson = load(`${candidateDir}/lesson.template.json`)
  const modernExercises = load(`${candidateDir}/exercises.template.json`)
  assert.equal(sourceLesson.prose.length, 8)
  assert.equal(modernLesson.prose.length, 8)
  assert.equal(sourceExercises.exercises.length, 7)
  assert.equal(modernExercises.exercises.length, 7)
  assert.deepEqual(modernLesson.source.data, sourceLesson)
  assert.deepEqual(modernExercises.source.data, sourceExercises)
  assert.equal(modernLesson.source.sha256, files[0][2])
  assert.equal(modernExercises.source.sha256, files[1][2])
  const findings = []
  const inspect = (source, candidate, index, type, note) => {
    assert.equal(candidate.source_text, source.text)
    for (const key of Object.keys(source).filter(key => !['text', 'lines'].includes(key))) {
      assert.deepEqual(candidate[key], source[key], `${type}[${index}].${key}`)
    }
    assert.deepEqual(math(candidate.text), math(source.text))
    assert.deepEqual(numbers(candidate.text), numbers(source.text))
    assert.deepEqual(candidate.numeric_changes, [])
    assert.deepEqual(candidate.historical_entities, [])
    assert(candidate.changes.every(change => ['layout', 'wording'].includes(change)))
    if (type === 'exercise') {
      assert.equal(normalized(candidate.text), normalized(source.text))
      assert.equal(normalized(candidate.lines.join('\n')), normalized(candidate.text))
    }
    return {
      target: type === 'prose' ? `prose[${index}]` : `exercise:${source.number}`,
      sourceRefs: source.source_refs || source.pages,
      status: 'pass',
      formulaSequenceExactIgnoringWhitespace: true,
      numberSequenceExact: true,
      sourceTextExact: true,
      sourceMetadataExact: true,
      changes: candidate.changes,
      semanticReview: note,
      cultureReview: 'No historical or cultural entity to replace; no invented scenario or identity.',
    }
  }
  const prose = sourceLesson.prose.map((item, index) => inspect(item, modernLesson.prose[index], index, 'prose', proseNotes[index]))
  const exercises = sourceExercises.exercises.map((item, index) => inspect(item, modernExercises.exercises[index], index, 'exercise', exerciseNotes[index]))
  assert(modernExercises.exercises[3].text.includes('.\n$2^*$)'))
  assert.equal(modernLesson.errata.length, 0)
  write('text-review.json', {
    schema: 'ld-s10y-lesson/modern-text-review@1',
    ticket: 'STEMROBIN-188',
    lesson: sourceLesson.id,
    edition: modernLesson.edition,
    status: 'pass',
    result: 'PASS for modern text only: 8 prose/display objects and 7 exercises (229-235). This is not whole-lesson acceptance or figure review.',
    reviewRole: 'independent-modern-text-reviewer; not the modern-text author',
    sourceAuthority: 'Supplied faithful lesson/exercise objects, not new source-page review.',
    inputBindings,
    firstModes: inputBindings.filter(item => item.role.endsWith('FIRST')).map(item => ({ path: item.path, modeBefore: item.modeBefore, modeAfter: item.modeAfter })),
    prose,
    exercises,
    findings,
    exclusions: ['No source-page rereview', 'No N63 inputs', 'No answers', 'No template edits', 'No figure self-review', 'No whole-lesson PASS'],
    headedProductRenderPerformed: false,
  })

  const O = [0, 0, 0]
  const A = [1.5, 1.5, Math.sqrt(4.5)]
  const B = A.map(value => -value)
  const radius = 3
  const lift = ([x, y]) => [x, y, -(A[0] * x + A[1] * y) / A[2]]
  const u = lift([-0.65, 1.9])
  const v = lift([2, -1.1])
  const sum = (point, ...terms) => point.map((value, index) => value + terms.reduce((total, [scale, vector]) => total + scale * vector[index], 0))
  const plane = [[-0.75, -0.9], [0.75, -0.9], [0.75, 0.9], [-0.75, 0.9]].map(([s, t]) => sum(A, [s, u], [t, v]))
  const aEnds = [sum(A, [-0.75, u]), sum(A, [0.75, u])]
  const project = point => point.slice(0, 2)
  const edgeIntersection = (first, second) => {
    const d = second.map((value, index) => value - first[index])
    const aa = d[0] ** 2 + d[1] ** 2
    const bb = 2 * (first[0] * d[0] + first[1] * d[1])
    const cc = first[0] ** 2 + first[1] ** 2 - radius ** 2
    const roots = [1, -1].map(sign => (-bb + sign * Math.sqrt(bb * bb - 4 * aa * cc)) / (2 * aa)).filter(t => t >= 0 && t <= 1)
    assert.equal(roots.length, 1)
    return first.slice(0, 2).map((value, index) => value + roots[0] * d[index])
  }
  const upper = edgeIntersection(plane[0], plane[1])
  const lower = edgeIntersection(plane[0], plane[3])
  const label = { fontSize: 26, fontWeight: 500 }
  const point = (id, at, visibleLabel, position, offset) => ({
    id, type: 'point', at: project(at), spatialAt: at, label: visibleLabel,
    visible: true, size: 4, stroke: 'ink', fill: 'ink',
    ...label, labelPlacement: { position, offset },
  })
  const objects = [
    { id: 'source-plane-alpha', type: 'polygon', points: plane.map(project), spatialPoints: plane, stroke: 'muted', strokeWidth: 2.4, fill: 'paper', fillOpacity: 0 },
    { id: 'source-sphere-solid', type: 'arc', center: project(O), start: upper, end: lower, stroke: 'ink', strokeWidth: 3.2 },
    { id: 'source-sphere-dashed', type: 'arc', center: project(O), start: lower, end: upper, stroke: 'muted', strokeWidth: 3.2, dash: 2 },
    point('source-contact-A', A, 'A', 'NE', [9, -10]),
    point('source-center-O', O, 'O', 'SE', [9, 10]),
    point('source-endpoint-B', B, 'B', 'SE', [9, 10]),
    { id: 'source-diameter-AB', type: 'segment', from: 'source-endpoint-B', to: 'source-contact-A', stroke: 'ink', strokeWidth: 2.6, dash: 2 },
    { id: 'source-tangent-line-a', type: 'segment', from: project(aEnds[0]), to: project(aEnds[1]), spatialEndpoints: aEnds, stroke: 'ink', strokeWidth: 2.6 },
    { id: 'source-line-a-label', type: 'text', at: [1.92, 0.87], text: 'a', ...label, labelPlacement: { position: 'E', offset: [7, 0] } },
    { id: 'source-plane-alpha-label', type: 'text', at: [3.06, 1.16], text: '\u03b1', ...label, labelPlacement: { position: 'CENTER', offset: [0, 0] } },
  ]
  const assertions = [
    { id: 'projected-AB-through-O', type: 'collinear', a: 'source-contact-A', b: 'source-center-O', c: 'source-endpoint-B' },
    { id: 'projected-OA-equals-OB', type: 'equalDistance', a: 'source-center-O', b: 'source-contact-A', c: 'source-center-O', d: 'source-endpoint-B' },
    { id: 'projected-AB-antipodes', type: 'centralSymmetry', center: 'source-center-O', pairs: [{ a: 'source-contact-A', b: 'source-endpoint-B' }] },
    { id: 'diameter-connects-A-B', type: 'connects', arrow: 'source-diameter-AB', from: 'source-endpoint-B', to: 'source-contact-A' },
    { id: 'projected-A-on-line-a', type: 'pointOnLine', point: 'source-contact-A', a: project(aEnds[0]), b: project(aEnds[1]) },
    { id: 'projected-A-in-plane-patch', type: 'inside', point: 'source-contact-A', container: 'source-plane-alpha', margin: 0.2 },
    { id: 'line-a-connects-plane-edges', type: 'connects', arrow: 'source-tangent-line-a', from: project(aEnds[0]), to: project(aEnds[1]) },
    { id: 'plane-opposite-long-edges', type: 'parallel', a: project(plane[0]), b: project(plane[3]), c: project(plane[1]), d: project(plane[2]) },
    { id: 'plane-opposite-short-edges', type: 'parallel', a: project(plane[0]), b: project(plane[1]), c: project(plane[3]), d: project(plane[2]) },
    { id: 'sphere-solid-start-on-silhouette', type: 'pointOnCircle', point: upper, center: 'source-center-O', radius },
    { id: 'sphere-solid-end-on-silhouette', type: 'pointOnCircle', point: lower, center: 'source-center-O', radius },
    { id: 'line-a-label-in-plane', type: 'inside', point: 'source-line-a-label', container: 'source-plane-alpha', margin: 0.15 },
    { id: 'plane-label-in-plane', type: 'inside', point: 'source-plane-alpha-label', container: 'source-plane-alpha', margin: 0.2 },
    { id: 'source-three-visible-points', type: 'objectCount', objectType: 'point', count: 3 },
    { id: 'source-two-silhouette-arcs', type: 'objectCount', objectType: 'arc', count: 2 },
    { id: 'meridian-OA-radius', type: 'distance', a: [0, 0], b: [0, radius], value: radius, coordinateFrame: 'unprojected-normal-section; independently linked to spatial model by geometry-check.json' },
    { id: 'meridian-OB-radius', type: 'distance', a: [0, 0], b: [0, -radius], value: radius, coordinateFrame: 'unprojected-normal-section' },
    { id: 'meridian-AB-diameter', type: 'distance', a: [0, -radius], b: [0, radius], value: 2 * radius, coordinateFrame: 'unprojected-normal-section' },
    { id: 'meridian-AB-perpendicular-plane', type: 'perpendicular', a: [0, -radius], b: [0, radius], c: [-1, radius], d: [1, radius], coordinateFrame: 'unprojected-normal-section; not a claim about screen angles' },
    { id: 'meridian-A-on-tangent-plane', type: 'pointOnLine', point: [0, radius], a: [-1, radius], b: [1, radius], coordinateFrame: 'unprojected-normal-section' },
  ]
  const inventory = [
    {
      id: 'source-sphere-outline',
      description: 'Independent first PNG pixel observation, before reading modern text: one sphere outline, solid on the left and lower portion, dashed on the upper/right portion behind the plane. No grid, scale, numerical values or subfigures. The two exact arcs form one silhouette. Their joins are regularized at the projected plane boundary; join coordinates are not source measurements.',
      objects: ['source-sphere-solid', 'source-sphere-dashed'],
      assertions: ['source-two-silhouette-arcs', 'sphere-solid-start-on-silhouette', 'sphere-solid-end-on-silhouette'],
    },
    {
      id: 'source-three-points-and-diameter',
      description: 'First PNG pixels show visible points A upper right, O central and B lower left, labels A/O/B, and a dashed straight AB through O. A and B are inside the projected silhouette, not points on its 2D outline. Modern text confirms A is contact, O center and AB diameter. Spatial coordinates are authored regularization, not scanned coordinates; physical radius facts use the unprojected meridian assertions and the executable spatial check.',
      objects: ['source-contact-A', 'source-center-O', 'source-endpoint-B', 'source-diameter-AB'],
      assertions: ['source-three-visible-points', 'projected-AB-through-O', 'projected-OA-equals-OB', 'projected-AB-antipodes', 'diameter-connects-A-B', 'meridian-OA-radius', 'meridian-OB-radius', 'meridian-AB-diameter'],
      requires: ['pointRelationships'],
    },
    {
      id: 'source-tangent-plane-and-line',
      description: 'First PNG pixels show an oblique four-edge plane patch, plane label alpha, solid line through A between opposite patch edges with label a, and no printed right-angle mark. Modern text binds alpha tangent at A, AB perpendicular to alpha and line a lying in alpha through A. Orthographic spatial construction retains these relationships without falsely asserting a right angle in the projected picture. No extra source points or answer annotations are introduced.',
      objects: ['source-plane-alpha', 'source-plane-alpha-label', 'source-contact-A', 'source-tangent-line-a', 'source-line-a-label'],
      assertions: ['projected-A-on-line-a', 'projected-A-in-plane-patch', 'line-a-connects-plane-edges', 'plane-opposite-long-edges', 'plane-opposite-short-edges', 'line-a-label-in-plane', 'plane-label-in-plane', 'meridian-AB-perpendicular-plane', 'meridian-A-on-tangent-plane'],
    },
  ]
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2',
    id: 'fig-g10-96',
    mode: 'deterministic',
    description: 'Instructional sphere and tangent-plane diagram for modern-us-neutral geo910-c2-s3-n64, Theorem 37 and tangent-line definition. Preserve A/O/B, dashed diameter AB, plane alpha, tangent line a and solid/dashed sphere silhouette. Orthographic projection (x,y,z)->(x,y) of an exact sphere of radius 3, A=(1.5,1.5,sqrt(4.5)), B=-A, O=0 and tangent plane A dot X=9. Radius 3 and coordinates are invisible authored model parameters, not source givens. Unprojected normal-section assertions and the supplemental spatial checker prove tangency; projected screen angles are not space angles. No answers, extra visible points, or extra marks.',
    source: {
      image: { path: path.join(input, files[6][1]), sha256: files[6][2] },
      authoritativeText: [
        ...modernLesson.prose.filter(item => item.text).map(item => ({ lesson: modernLesson.id, text: item.text })),
        ...modernExercises.exercises.map(item => ({ lesson: modernLesson.id, exercise: item.number, text: item.text })),
      ],
      inventory,
    },
    canvas: { width: 640, height: 640, boundingBox: [-3.7, 4.4, 4.5, -3.8], background: 'paper', keepAspectRatio: true },
    display: { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] },
    objects,
    assertions,
    layout: { minLabelGap: 4 },
  }
  write('source-inventory.json', {
    schema: 'ld-s10y-image/source-inventory-sidecar@1',
    source: inputBindings.find(item => item.role === 'source-PNG'),
    observationOrder: ['Opened supplied original PNG once', 'Recorded pixel inventory without modern-figure history or answers', 'Read current modern lesson and exercises', 'Authored exact projection and assertions'],
    imagesLoaded: 1,
    historyImagesLoaded: 0,
    unresolvedSourceLabels: [],
    inventory,
    modernAdditions: ['Invisible spatial coordinates and radius used only for exact construction', 'Regularized plane parallelogram and silhouette join coordinates', 'English Latin point/line labels and mathematical alpha; role colors; 640px scroll layout'],
  })
  const first = write('spec.FIRST.json', spec)
  fs.chmodSync(first, 0o444)
  write('spec.json', spec)
  write('geometry-model.json', {
    schema: 'ld-s10y-image/spatial-model-sidecar@1',
    projection: 'orthographic (x,y,z) -> (x,y)',
    radius, O, A, B, planeNormal: A, planeConstant: radius ** 2, u, v, plane, aEnds, silhouetteJoins: [upper, lower],
    sourceFactsVsAdditions: 'Names and relationships are source/text facts. Spatial coordinates, radius 3 and finite patch extents are invisible authored construction parameters, not printed givens.',
  })
  console.log(JSON.stringify({ stage: 'prepared', textStatus: 'pass', findings, specFIRST: metadata(first), imageLoads: 1 }, null, 2))
}

function run() {
  bindings()
  const firstValidation = path.join(output, 'validate-draft.receipt.json')
  const repair = fs.existsSync(firstValidation)
  if (repair) {
    const failure = JSON.parse(fs.readFileSync(firstValidation, 'utf8'))
    assert.equal(failure.exitCode, 2)
    assert(!fs.existsSync(path.join(output, 'render-first.receipt.json')))
    const first = JSON.parse(fs.readFileSync(path.join(output, 'spec.FIRST.json'), 'utf8'))
    const current = JSON.parse(fs.readFileSync(path.join(output, 'spec.json'), 'utf8'))
    const firstLabel = first.objects.find(item => item.id === 'source-plane-alpha-label')
    const currentLabel = current.objects.find(item => item.id === 'source-plane-alpha-label')
    assert.deepEqual(firstLabel.at, [3.06, 1.16])
    assert.deepEqual(currentLabel.at, [3.18, 0.05])
    firstLabel.at = currentLabel.at
    assert.deepEqual(first, current)
    write('repair-01.json', { type: 'single-targeted-spec-label-repair', substantiveRepairNumber: 1, initialFailure: metadata(firstValidation), immutableFIRST: metadata(path.join(output, 'spec.FIRST.json')), target: 'source-plane-alpha-label.at', before: [3.06, 1.16], after: [3.18, 0.05], reason: 'Move alpha into the plane patch with the declared minimum boundary clearance; no source relationship or formula changes.', specAfter: metadata(path.join(output, 'spec.json')), additionalRepairsAllowed: 0 })
  }
  const invocations = [
    [repair ? 'validate-draft-repair-01' : 'validate-draft', 'python3', [path.join(cwd, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'), path.join(output, 'spec.json'), '--stage', 'draft', '--json']],
    ['render-first', 'node', [path.join(cwd, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'), '--spec', path.join(output, 'spec.json'), '--svg', path.join(output, 'fig-g10-96.svg'), '--report', path.join(output, 'fig-g10-96.render.json')]],
    ['validate-rendered', 'python3', [path.join(cwd, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'), path.join(output, 'spec.json'), '--stage', 'rendered', '--json']],
  ]
  for (const [id, command, args] of invocations) {
    const start = new Date().toISOString()
    const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: output, TMP: output, TEMP: output } })
    write(`${id}.receipt.json`, { id, command, args, cwd, start, end: new Date().toISOString(), exitCode: result.status, signal: result.signal, error: result.error?.message || null, stdout: result.stdout, stderr: result.stderr })
    console.log(`${id}: exit ${result.status}\n${result.stdout}${result.stderr}`)
    if (id === 'render-first') {
      for (const name of ['fig-g10-96.svg', 'fig-g10-96.render.json']) {
        const current = path.join(output, name)
        if (fs.existsSync(current)) {
          const snapshot = path.join(output, name.replace(/(\.[^.]+)$/, '.FIRST$1'))
          fs.copyFileSync(current, snapshot, fs.constants.COPYFILE_EXCL)
          fs.chmodSync(snapshot, 0o444)
        }
      }
    }
    if (result.status !== 0) process.exit(result.status || 1)
  }
}

function finish() {
  const inputBindings = bindings()
  const specFile = path.join(output, 'spec.json')
  const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'))
  const modelFile = path.join(output, 'geometry-model.json')
  const model = JSON.parse(fs.readFileSync(modelFile, 'utf8'))
  const sub = (a, b) => a.map((value, index) => value - b[index])
  const dot = (a, b) => a.reduce((total, value, index) => total + value * b[index], 0)
  const norm = a => Math.sqrt(dot(a, a))
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const checks = []
  const check = (id, residual, detail) => {
    assert(Number.isFinite(residual) && Math.abs(residual) < 1e-8, id)
    checks.push({ id, residual, tolerance: 1e-8, status: 'pass', detail })
  }
  const pointIds = { 'source-center-O': 'O', 'source-contact-A': 'A', 'source-endpoint-B': 'B' }
  for (const [id, key] of Object.entries(pointIds)) {
    const obj = spec.objects.find(item => item.id === id)
    assert.deepEqual(obj.spatialAt, model[key])
    assert.deepEqual(obj.at, model[key].slice(0, 2))
  }
  assert.deepEqual(spec.objects.find(item => item.id === 'source-plane-alpha').spatialPoints, model.plane)
  assert.deepEqual(spec.objects.find(item => item.id === 'source-plane-alpha').points, model.plane.map(point => point.slice(0, 2)))
  assert.deepEqual(spec.objects.find(item => item.id === 'source-tangent-line-a').spatialEndpoints, model.aEnds)
  check('physical-A-on-sphere', norm(sub(model.A, model.O)) - model.radius, 'A lies on the spatial sphere, not on its projected silhouette.')
  check('physical-B-on-sphere', norm(sub(model.B, model.O)) - model.radius, 'B lies on the spatial sphere.')
  check('physical-O-midpoint-AB', norm(model.A.map((value, index) => (value + model.B[index]) / 2 - model.O[index])), 'O is the midpoint of AB.')
  check('physical-AB-diameter', norm(sub(model.A, model.B)) - 2 * model.radius, 'AB is a diameter.')
  check('physical-A-on-alpha', dot(model.planeNormal, model.A) - model.planeConstant, 'Contact A belongs to alpha.')
  check('physical-AB-normal-to-alpha', norm(cross(sub(model.A, model.B), model.planeNormal)), 'AB is normal to alpha.')
  check('physical-OA-normal-to-alpha', norm(cross(sub(model.A, model.O), model.planeNormal)), 'OA is normal to alpha.')
  check('physical-O-to-plane-distance-radius', Math.abs(model.planeConstant - dot(model.planeNormal, model.O)) / norm(model.planeNormal) - model.radius, 'Distance from O to alpha equals the radius; the plane is tangent with the unique point A.')
  check('physical-plane-u-tangent', dot(model.planeNormal, model.u), 'First plane direction is perpendicular to its normal.')
  check('physical-plane-v-tangent', dot(model.planeNormal, model.v), 'Second plane direction is perpendicular to its normal.')
  assert(norm(cross(model.u, model.v)) > 0)
  for (let index = 0; index < model.plane.length; index++) {
    check(`physical-plane-vertex-${index}`, dot(model.planeNormal, model.plane[index]) - model.planeConstant, 'Every patch corner lies on alpha.')
  }
  for (let index = 0; index < model.aEnds.length; index++) {
    check(`physical-line-a-endpoint-${index}-on-alpha`, dot(model.planeNormal, model.aEnds[index]) - model.planeConstant, 'Line a is within alpha.')
  }
  check('physical-A-on-line-a', norm(cross(sub(model.A, model.aEnds[0]), sub(model.aEnds[1], model.aEnds[0]))), 'Line a passes through A.')
  check('physical-line-a-normal-dot', dot(sub(model.aEnds[1], model.aEnds[0]), sub(model.A, model.O)), 'Line a is perpendicular to OA in space. Squared distance to O along a is R^2+t^2|direction|^2, so A is its sole sphere intersection.')
  write('geometry-check.json', { schema: 'ld-s10y-image/spatial-check-sidecar@1', status: 'pass', spec: metadata(specFile), model: metadata(modelFile), checks, limitation: 'Supplemental source-space mathematics only, not independent visual review. Standard validate_spec.py separately checks the projected and explicit meridian-frame assertions.' })
  const renderFile = path.join(output, 'fig-g10-96.render.json')
  const render = JSON.parse(fs.readFileSync(renderFile, 'utf8'))
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(specFile))
  assert.equal(render.output.svg.sha256, hash(path.join(output, 'fig-g10-96.svg')))
  const firstSpec = path.join(output, 'spec.FIRST.json')
  assert.equal(mode(firstSpec), '0444')
  assert.notEqual(hash(firstSpec), hash(specFile))
  const textReview = JSON.parse(fs.readFileSync(path.join(output, 'text-review.json'), 'utf8'))
  assert.deepEqual(textReview.inputBindings, inputBindings)
  write('author-report.json', {
    schema: 'ld-s10y-image/author-sidecar-report@1',
    ticket: 'STEMROBIN-188',
    lesson: 'geo910-c2-s3-n64',
    edition: 'modern-us-neutral',
    figure: 'fig-g10-96',
    status: 'authored-awaiting-independent-figure-review',
    textReviewStatus: 'pass-modern-text-only',
    standardValidation: { draft: 'pass', rendered: 'pass' },
    rendererStatus: render.status,
    spatialCheckStatus: 'pass',
    inputBindings,
    outputs: ['text-review.json', 'spec.FIRST.json', 'spec.json', 'fig-g10-96.svg', 'fig-g10-96.render.json', 'geometry-check.json'].map(name => metadata(path.join(output, name))),
    counts: { sourcePNGsOpened: 1, sourcePNGReopens: 0, sourcePageImagesOpened: 0, cropsOpened: 0, modernFigureImagesOpened: 0, historyImagesOpened: 0, totalImagesLoadedIntoContext: 1, batchImageLimit: 8, cumulativeImageLimit: 24, figuresAuthored: 1, specDraftValidationInvocations: 2, failedDraftValidations: 1, specRenderedValidationInvocations: 1, renderInvocations: 1, successfulRenders: 1, failedRenders: 0, substantiveRepairs: 1, additionalRepairsAllowed: 0, paidModelCalls: 0, generatedRasterArtwork: 0 },
    firstEvidence: { spec: metadata(firstSpec), svg: metadata(path.join(output, 'fig-g10-96.FIRST.svg')), render: metadata(path.join(output, 'fig-g10-96.render.FIRST.json')) },
    display: { layout: 'scroll', purpose: 'instructional', fixedMediaWidthPx: 640, checkedWidthsPx: [640], mobileHorizontalScrollRequired: true, widthBasis: 'Existing FigureSpec standard compatibility contract; not measured in the headed product.', headedProductMeasurementPerformed: false, headedProductTestPerformed: false, mobileScrollEndTestPerformed: false },
    independentFigureReview: { status: 'not-performed', selfReview: false, expectedOwner: 'Fresh reviewer assigned by parent', reviewFileCreated: false },
    promotion: { eligibleNow: false, wholeLessonPassClaimed: false, durableSourceOrEditionWrites: false, requiredNext: ['Fresh hash-bound independent mathematical/visual/cultural figure review', 'Parent-owned lesson integration and offline render', 'Parent-owned actual mobile scroll/end and headed media-width evidence when applicable'] },
    scopeCompliance: { onlyWriteDirectory: output, sourceOrTemplateEdits: 0, envFilesRead: 0, installations: 0, gitOperations: 0, dbCalls: 0, appWrites: 0, messagesToOtherChats: 0, sourceSVGContentInspected: false },
  })
  const outputs = fs.readdirSync(output).filter(name => name !== 'output-index.json').sort().map(name => metadata(path.join(output, name)))
  write('output-index.json', { schema: 'ld-s10y-image/output-index@1', ticket: 'STEMROBIN-188', directory: output, status: 'sidecar-complete-awaiting-independent-figure-review', outputs })
  console.log(JSON.stringify({ status: 'sidecar-complete', text: 'pass-modern-text-only', figure: 'awaiting-independent-review', outputs, index: metadata(path.join(output, 'output-index.json')) }, null, 2))
}

const action = process.argv[2]
if (action === 'prepare') prepare()
else if (action === 'run') run()
else if (action === 'finish') finish()
else throw new Error('Expected prepare, run or finish')
