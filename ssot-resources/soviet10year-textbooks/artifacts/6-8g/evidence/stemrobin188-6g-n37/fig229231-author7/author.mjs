import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), W)
const ROOT = '.intentfold/tickets/STEMROBIN-188/tmp/n37-fig229231-author7'
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g'
const E = `${B}/editions/modern-us-neutral/figures`
const SKILL = '.agents/skills/ld-s10y-image'
const TEXT = '.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n37'
const lesson = JSON.parse(fs.readFileSync(`${TEXT}/lesson.template.json`, 'utf8'))
const exercises = JSON.parse(fs.readFileSync(`${TEXT}/exercises.template.json`, 'utf8'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const asciiJson = (value) => `${JSON.stringify(value, null, 2).replace(
  /[\u007f-\uffff]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
)}\n`
const save = (name, value) => {
  assert(!name.includes('..'))
  fs.writeFileSync(`${ROOT}/${name}`, asciiJson(value))
}
const read = (name) => JSON.parse(fs.readFileSync(`${ROOT}/${name}`, 'utf8'))
const point = (id, at, label, position, offset = [0, 0], visible = false) => ({
  id, type: 'point', at, label, visible, size: 3, stroke: 'ink', fill: 'ink',
  fontSize: 34, fontWeight: 500, labelPlacement: { position, offset },
})
const edge = (id, from, to, type = 'segment') => ({
  id, type, from, to, stroke: 'ink', strokeWidth: 3,
})
const connects = (id, arrow, from, to) => ({ id, type: 'connects', arrow, from, to })
const collinear = (id, a, b, c) => ({ id, type: 'collinear', a, b, c })
const parallel = (id, a, b, c, d) => ({ id, type: 'parallel', a, b, c, d })
const displacement = (id, from, to, dx, dy) => ({
  id, type: 'displacement', from, to, dx, dy, tolerance: 1e-8,
})
const unitOffset = (center, vector, radius = 0.75) => {
  const length = Math.hypot(...vector)
  return center.map((value, index) => value + radius * vector[index] / length)
}
const base = (id, description, authoritativeText, height = 400) => ({
  schema: 'ld-s10y-image/figure-spec@2',
  id, mode: 'deterministic', description,
  source: {
    image: { path: `${B}/figures/${id}.png`, sha256: hash(`${B}/figures/${id}.png`) },
    authoritativeText, inventory: [],
  },
  canvas: {
    width: 480, height, boundingBox: [0, height / 48, 10, 0],
    background: 'paper', keepAspectRatio: true,
  },
  display: {
    layout: 'inline', purpose: 'instructional', maxWidthPx: 480,
    minTextPx: 16, widths: [280, 300, 320, 331, 352, 480],
  },
  objects: [], assertions: [], layout: { minLabelGap: 3 },
})

function spec229() {
  const spec = base('fig-229',
    'Two convex angles with corresponding ray directions and directed translation O to O1. Finite displayed ray lengths are not asserted equal.',
    lesson.prose.filter((block) => block.kind === 'p').map((block) => ({
      lesson: 'geo68-c3-s2-n37', text: block.text,
    })), 480)
  const lowerStart = unitOffset([4, 2.1], [1, -0.2])
  const lowerEnd = unitOffset([4, 2.1], [1, 0.5])
  const upperStart = unitOffset([1.4, 6.4], [1, -0.2])
  const upperEnd = unitOffset([1.4, 6.4], [1, 0.5])
  spec.objects = [
    point('upper-O1', [1.4, 6.4], 'O\u2081', 'W'),
    point('upper-A1', [6, 8.7], 'A\u2081', 'N', [0, -20]),
    point('upper-B1', [5.9, 5.5], 'B\u2081', 'NE', [4, -10]),
    point('lower-O', [4, 2.1], 'O', 'W', [-10, 0]),
    point('lower-A', [8.4, 4.3], 'A', 'N', [0, -8]),
    point('lower-B', [8.2, 1.26], 'B', 'NE', [4, -10]),
    edge('upper-ray-A1', 'upper-O1', 'upper-A1'),
    edge('upper-ray-B1', 'upper-O1', 'upper-B1'),
    edge('lower-ray-A', 'lower-O', 'lower-A'),
    edge('lower-ray-B', 'lower-O', 'lower-B'),
    edge('translation-O-to-O1', 'lower-O', 'upper-O1', 'arrow'),
    { id: 'upper-angle-arc', type: 'arc', center: 'upper-O1',
      start: upperStart, end: upperEnd, stroke: 'ink', strokeWidth: 2 },
    { id: 'lower-angle-arc', type: 'arc', center: 'lower-O',
      start: lowerStart, end: lowerEnd, stroke: 'ink', strokeWidth: 2 },
  ]
  spec.assertions = [
    connects('upper-A1-incidence', 'upper-ray-A1', 'upper-O1', 'upper-A1'),
    connects('upper-B1-incidence', 'upper-ray-B1', 'upper-O1', 'upper-B1'),
    connects('lower-A-incidence', 'lower-ray-A', 'lower-O', 'lower-A'),
    connects('lower-B-incidence', 'lower-ray-B', 'lower-O', 'lower-B'),
    connects('translation-arrow-endpoints', 'translation-O-to-O1', 'lower-O', 'upper-O1'),
    displacement('translation-direction', 'lower-O', 'upper-O1', -2.6, 4.3),
    parallel('corresponding-A-directions', 'lower-O', 'lower-A', 'upper-O1', 'upper-A1'),
    parallel('corresponding-B-directions', 'lower-O', 'lower-B', 'upper-O1', 'upper-B1'),
    displacement('upper-A1-forward', 'upper-O1', 'upper-A1', 4.6, 2.3),
    displacement('upper-B1-forward', 'upper-O1', 'upper-B1', 4.5, -0.9),
    displacement('lower-A-forward', 'lower-O', 'lower-A', 4.4, 2.2),
    displacement('lower-B-forward', 'lower-O', 'lower-B', 4.2, -0.84),
    collinear('upper-arc-on-B1', 'upper-O1', 'upper-B1', upperStart),
    collinear('upper-arc-on-A1', 'upper-O1', 'upper-A1', upperEnd),
    collinear('lower-arc-on-B', 'lower-O', 'lower-B', lowerStart),
    collinear('lower-arc-on-A', 'lower-O', 'lower-A', lowerEnd),
    { id: 'upper-arc-radius-start', type: 'pointOnCircle',
      point: upperStart, center: 'upper-O1', radius: 0.75 },
    { id: 'upper-arc-radius-end', type: 'pointOnCircle',
      point: upperEnd, center: 'upper-O1', radius: 0.75 },
    { id: 'lower-arc-radius-start', type: 'pointOnCircle',
      point: lowerStart, center: 'lower-O', radius: 0.75 },
    { id: 'lower-arc-radius-end', type: 'pointOnCircle',
      point: lowerEnd, center: 'lower-O', radius: 0.75 },
  ]
  spec.source.inventory = [{
    id: 'source-two-angles-and-directed-connection',
    description: 'Source-only inventory sealed in SOURCE-FIRST.md: upper-left O1/A1/B1, lower-right O/A/B, both unnumbered interior arcs, and the O -> O1 arrow. UNKNOWN original Latin/Cyrillic glyph alphabet retained; modern labels follow approved mathematical names. Similar source ray directions are exact same-direction pairs in the approved prose. Modern regularization uses clean finite ray strokes and readable labels; displayed endpoint distances intentionally differ. Signed displacements are layout constraints, not source numeric givens.',
    objects: spec.objects.map((object) => object.id),
    assertions: spec.assertions.map((assertion) => assertion.id),
    requires: ['pointRelationships'],
  }]
  return spec
}

function spec230() {
  const task = exercises.exercises.find((item) => item.number === '479')
  const spec = base('fig-230',
    'Unsolved exercise 479: two parallel lines crossed by transversal MN, preserving A-P-B, C-Q-D and M-Q-P-N. No corresponding angles are highlighted or numbered.',
    [{ lesson: 'geo68-c3-s2-n37', exercise: '479', text: task.text }])
  spec.objects = [
    point('top-A', [0.9, 5.8], 'A', 'NW', [0, -14]),
    point('top-P', [5.15, 5.8], 'P', 'NW', [0, -14]),
    point('top-B', [9.1, 5.8], 'B', 'NW', [0, -14]),
    point('bottom-C', [0.9, 2.9], 'C', 'NW', [0, -14]),
    point('bottom-Q', [3.7, 2.9], 'Q', 'NW', [0, -14]),
    point('bottom-D', [9.3, 2.9], 'D', 'NW', [0, -14]),
    point('transversal-M', [2.85, 1.2], 'M', 'W'),
    point('transversal-N', [6, 7.5], 'N', 'W'),
    edge('top-line-AB', 'top-A', 'top-B'),
    edge('bottom-line-CD', 'bottom-C', 'bottom-D'),
    edge('transversal-MN', 'transversal-M', 'transversal-N'),
  ]
  spec.assertions = [
    collinear('top-A-P-B', 'top-A', 'top-P', 'top-B'),
    collinear('bottom-C-Q-D', 'bottom-C', 'bottom-Q', 'bottom-D'),
    { id: 'P-on-MN', type: 'pointOnLine', point: 'top-P', a: 'transversal-M', b: 'transversal-N' },
    { id: 'Q-on-MN', type: 'pointOnLine', point: 'bottom-Q', a: 'transversal-M', b: 'transversal-N' },
    parallel('given-AB-parallel-CD', 'top-A', 'top-B', 'bottom-C', 'bottom-D'),
    connects('top-line-endpoints', 'top-line-AB', 'top-A', 'top-B'),
    connects('bottom-line-endpoints', 'bottom-line-CD', 'bottom-C', 'bottom-D'),
    connects('transversal-endpoints', 'transversal-MN', 'transversal-M', 'transversal-N'),
    displacement('top-A-before-P', 'top-A', 'top-P', 4.25, 0),
    displacement('top-P-before-B', 'top-P', 'top-B', 3.95, 0),
    displacement('bottom-C-before-Q', 'bottom-C', 'bottom-Q', 2.8, 0),
    displacement('bottom-Q-before-D', 'bottom-Q', 'bottom-D', 5.6, 0),
    displacement('transversal-M-before-Q', 'transversal-M', 'bottom-Q', 0.85, 1.7),
    displacement('transversal-Q-before-P', 'bottom-Q', 'top-P', 1.45, 2.9),
    displacement('transversal-P-before-N', 'top-P', 'transversal-N', 0.85, 1.7),
  ]
  spec.source.inventory = [{
    id: 'source-parallel-rows-and-transversal',
    description: 'Source-only inventory sealed in SOURCE-FIRST.md: top A-P-B, bottom C-Q-D, diagonal M-Q-P-N, all eight labels, both crossings, and three unmarked strokes. UNKNOWN original glyph alphabet retained; modern Latin names preserve source shapes and approved task names. The approved task explicitly gives parallel lines. Horizontal regularization and signed displacement values are layout choices, not source measurements. No perpendicularity, equal finite lengths, angle numbers, or solution markings are added.',
    objects: spec.objects.map((object) => object.id),
    assertions: spec.assertions.map((assertion) => assertion.id),
    requires: ['pointRelationships'],
  }]
  return spec
}

function spec231() {
  const task = exercises.exercises.find((item) => item.number === '486')
  const spec = base('fig-231',
    'Unsolved exercise 486: parallel lines AC and FE intersect RP at B and D. Only the given alpha angle CBD is marked; no equal angles or ray-direction results are displayed.',
    [{ lesson: 'geo68-c3-s2-n37', exercise: '486', text: task.text }])
  const start = unitOffset([3.4, 6], [2.42, -3.3])
  const end = [4.15, 6]
  spec.objects = [
    point('top-A', [0.9, 6], 'A', 'NW', [0, -14]),
    point('top-B', [3.4, 6], 'B', 'NE', [0, -14]),
    point('top-C', [9.1, 6], 'C', 'NW', [0, -14]),
    point('bottom-F', [0.9, 2.7], 'F', 'SW', [0, 10]),
    point('bottom-D', [5.82, 2.7], 'D', 'NE', [0, -14], true),
    point('bottom-E', [9.3, 2.7], 'E', 'SW', [0, 10]),
    point('transversal-R', [2.4, 6 + 3.3 / 2.42], 'R', 'W'),
    point('transversal-P', [7.1, 2.7 - 1.28 * 3.3 / 2.42], 'P', 'SW'),
    edge('top-line-AC', 'top-A', 'top-C'),
    edge('bottom-line-FE', 'bottom-F', 'bottom-E'),
    edge('transversal-RP', 'transversal-R', 'transversal-P'),
    { id: 'given-angle-CBD-arc', type: 'arc', center: 'top-B',
      start, end, stroke: 'ink', strokeWidth: 2 },
    { id: 'given-angle-alpha', type: 'text', at: [4.65, 5.43], text: '\u03b1',
      fontSize: 34, fontWeight: 500, labelColor: 'ink', labelPlacement: { position: 'CENTER' } },
  ]
  spec.assertions = [
    collinear('top-A-B-C', 'top-A', 'top-B', 'top-C'),
    collinear('bottom-F-D-E', 'bottom-F', 'bottom-D', 'bottom-E'),
    { id: 'B-on-RP', type: 'pointOnLine', point: 'top-B', a: 'transversal-R', b: 'transversal-P' },
    { id: 'D-on-RP', type: 'pointOnLine', point: 'bottom-D', a: 'transversal-R', b: 'transversal-P' },
    parallel('given-AC-parallel-FE', 'top-A', 'top-C', 'bottom-F', 'bottom-E'),
    connects('top-line-endpoints', 'top-line-AC', 'top-A', 'top-C'),
    connects('bottom-line-endpoints', 'bottom-line-FE', 'bottom-F', 'bottom-E'),
    connects('transversal-endpoints', 'transversal-RP', 'transversal-R', 'transversal-P'),
    displacement('top-A-before-B', 'top-A', 'top-B', 2.5, 0),
    displacement('top-B-before-C', 'top-B', 'top-C', 5.7, 0),
    displacement('bottom-F-before-D', 'bottom-F', 'bottom-D', 4.92, 0),
    displacement('bottom-D-before-E', 'bottom-D', 'bottom-E', 3.48, 0),
    displacement('transversal-R-before-B', 'transversal-R', 'top-B', 1, -3.3 / 2.42),
    displacement('transversal-B-before-D', 'top-B', 'bottom-D', 2.42, -3.3),
    displacement('transversal-D-before-P', 'bottom-D', 'transversal-P', 1.28, -1.28 * 3.3 / 2.42),
    collinear('alpha-arc-start-on-BD', 'top-B', 'bottom-D', start),
    collinear('alpha-arc-end-on-BC', 'top-B', 'top-C', end),
    { id: 'alpha-arc-start-radius', type: 'pointOnCircle', point: start, center: 'top-B', radius: 0.75 },
    { id: 'alpha-arc-end-radius', type: 'pointOnCircle', point: end, center: 'top-B', radius: 0.75 },
  ]
  spec.source.inventory = [{
    id: 'source-two-rows-crossings-and-only-given-angle',
    description: 'Source-only inventory sealed in SOURCE-FIRST.md: top A-B-C, bottom F-D-E, diagonal R-B-D-P, all eight labels, dark lower junction D, and the sole angle arc right/below B between BC and BD. UNKNOWN pixel a/alpha glyph is not retroactively resolved as a source fact; the approved exercise explicitly authorizes modern Greek alpha. UNKNOWN original Latin/Cyrillic alphabet remains recorded. UNKNOWN C-speck role remains unresolved: C stays C, and no prime, point, label, incidence, or extra speck geometry is invented. Approved text gives AC parallel FE. Horizontal rows, clean text, arc radius and signed displacements are modern regularization, not measurements. No perpendicularity, equality of finite row lengths, extra angle marks, or solution labels.',
    objects: spec.objects.map((object) => object.id),
    assertions: spec.assertions.map((assertion) => assertion.id),
    requires: ['pointRelationships'],
  }]
  return spec
}

const receiptPath = `${ROOT}/author-receipt.json`
const receipt = fs.existsSync(receiptPath) ? read('author-receipt.json') : {
  status: 'AUTHOR_ONLY',
  cwd: W, outputRoot: path.resolve(ROOT),
  sourceFirst: { path: path.resolve(`${ROOT}/SOURCE-FIRST.md`), sha256: hash(`${ROOT}/SOURCE-FIRST.md`), mode: '0444' },
  authoritativeText: ['lesson', 'exercises'].map((name) => ({
    path: `${TEXT}/${name}.template.json`, sha256: hash(`${TEXT}/${name}.template.json`),
    use: 'approved top-level prose/exercise text only; no answer/choice fields',
  })),
  imageCounters: { originalOpens: 3, candidatePreviewOpens: 0, crops: 0, reopens: 0, batchTotal: 3, batchLimit: 8, contextTotal: 3, contextLimit: 24 },
  usage: { paidCalls: 0, modelCalls: 0, semanticApprovals: 0, dbWrites: 0, canonicalWrites: 0, gitWrites: 0, dependencyWrites: 0 },
  renderer: { path: `${SKILL}/scripts/render_spec.mjs`, sha256: hash(`${SKILL}/scripts/render_spec.mjs`) },
  validator: { path: `${SKILL}/scripts/validate_spec.py`, sha256: hash(`${SKILL}/scripts/validate_spec.py`) },
  executions: [], pathRelocations: [],
  displayScope: 'isolated headless figure preview; conservative inline widths 280/300/320/331/352/480; not full product or lesson display approval',
  approvalBoundary: 'Parent promotion requires independent image reviewer. Retained content-independent7 text approval is not image approval; no reviewer output was read.',
}
assert.equal(receipt.cwd, W)
assert.equal(receipt.status, 'AUTHOR_ONLY')
assert.equal(receipt.sourceFirst.sha256, hash(`${ROOT}/SOURCE-FIRST.md`))
const persist = () => save('author-receipt.json', receipt)
persist()

function execute(stage, figure, argv) {
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  receipt.executions.push({
    stage, figure, cwd: W, argv, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message,
    stdout: result.stdout, stderr: result.stderr,
  })
  persist()
  process.stdout.write(`${stage} ${figure}: exit=${result.status}\n${result.stdout || ''}${result.stderr || ''}`)
  if (result.status !== 0) {
    const snapshot = `${ROOT}/failures/${figure}-${stage}-${receipt.executions.length}`
    fs.mkdirSync(snapshot, { recursive: true })
    for (const suffix of ['spec.json', 'svg', 'render.producer.json', 'preview.png']) {
      const source = `${ROOT}/${figure}.${suffix}`
      if (fs.existsSync(source)) fs.copyFileSync(source, `${snapshot}/${figure}.${suffix}`)
    }
    throw new Error(`Preserved first failure at ${snapshot}; repair only its cause`)
  }
}

for (const spec of [spec229(), spec230(), spec231()]) {
  const specPath = `${ROOT}/${spec.id}.spec.json`
  if (fs.existsSync(`${ROOT}/${spec.id}.render.json`)) {
    const previous = read(`${spec.id}.render.json`)
    assert.equal(previous.status, 'pass')
    assert.equal(previous.spec.sha256, hash(specPath))
    assert.equal(previous.output.svg.sha256, hash(`${ROOT}/${spec.id}.svg`))
    continue
  }
  if (!fs.existsSync(specPath)) save(`${spec.id}.spec.json`, spec)
  execute('validate-draft', spec.id, [
    'python3', `${SKILL}/scripts/validate_spec.py`, specPath, '--stage', 'draft', '--json',
  ])
  execute('render-native', spec.id, [
    'node', `${SKILL}/scripts/render_spec.mjs`,
    '--spec', specPath, '--svg', `${ROOT}/${spec.id}.svg`,
    '--png', `${ROOT}/${spec.id}.preview.png`,
    '--report', `${ROOT}/${spec.id}.render.producer.json`,
  ])
  execute('validate-rendered', spec.id, [
    'python3', `${SKILL}/scripts/validate_spec.py`, specPath, '--stage', 'rendered', '--json',
  ])
  const native = read(`${spec.id}.render.producer.json`)
  assert.equal(native.status, 'pass')
  assert.equal(native.spec.sha256, hash(specPath))
  assert.equal(native.output.svg.sha256, hash(`${ROOT}/${spec.id}.svg`))
  const relocated = structuredClone(native)
  relocated.spec.path = `${E}/${spec.id}.spec.json`
  relocated.output.svg.path = `${E}/${spec.id}.svg`
  save(`${spec.id}.render.json`, relocated)
  receipt.pathRelocations.push({
    figure: spec.id, operation: 'metadata path-only relocation; no rerender',
    originalProducer: { path: path.resolve(`${ROOT}/${spec.id}.render.producer.json`), sha256: hash(`${ROOT}/${spec.id}.render.producer.json`) },
    relocatedProducer: { path: path.resolve(`${ROOT}/${spec.id}.render.json`), sha256: hash(`${ROOT}/${spec.id}.render.json`) },
    edits: {
      'spec.path': { from: native.spec.path, to: relocated.spec.path },
      'output.svg.path': { from: native.output.svg.path, to: relocated.output.svg.path },
    },
    specBytesUnchanged: true, svgBytesUnchanged: true,
  })
  persist()
}
