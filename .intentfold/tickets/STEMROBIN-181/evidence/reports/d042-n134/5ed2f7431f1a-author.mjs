import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const A = path.dirname(fileURLToPath(import.meta.url))
const ticketTmp = path.dirname(A)
const currentText = path.join(ticketTmp, 'd042-9p-n134-text-repair')
const originalText = path.join(ticketTmp, 'd040-9p-n134-author')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const binding = file => ({ path: file, sha256: sha(file) })
const write = (file, value) => {
  assert(file.startsWith(`${A}/`))
  assert(!fs.existsSync(file), `Immutable artifact already exists: ${file}`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const copy = (source, target) => {
  assert(target.startsWith(`${A}/`))
  assert(!fs.existsSync(target))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(source), sha(target))
  return { input: binding(source), frozen: binding(target) }
}

assert.equal(sha(`${originalText}/author-freeze.json`),
  'ab08cd85ebc7fffe66cfc16be0c9a6b5b7bd25c92c4ef0dece5af711d8b82753')
assert.equal(sha(`${currentText}/repair-freeze.json`),
  '9da166b8de42e7c673f219fae54a6a77ee4546536932838b7580bf31e07b3aef')
const inputBindings = [
  copy(`${originalText}/author-freeze.json`, `${A}/inputs/original-author-freeze.json`),
  copy(`${currentText}/repair-freeze.json`, `${A}/inputs/current-repair-freeze.json`),
  copy(`${currentText}/display-title.json`, `${A}/inputs/display-title.json`),
]
const repaired = read(`${currentText}/repair-freeze.json`)
const authoritativeText = []
for (const language of ['zh', 'en']) {
  for (const name of ['lesson.template.json', 'prose.json', 'prose.md']) {
    const source = `${currentText}/${language}/${name}`
    const expected = repaired.artifacts.find(item => item.path === source)
    assert(expected, `Unbound current authority: ${source}`)
    assert.equal(sha(source), expected.sha256)
    inputBindings.push(copy(source, `${A}/inputs/${language}/${name}`))
  }
  const prose = read(`${A}/inputs/${language}/prose.json`)
  for (const item of prose.prose) {
    authoritativeText.push({
      lesson: 'phy9-c2-s7-n134', language, text: item.text,
      sourceRefs: item.source_refs,
    })
  }
}
write(`${A}/input-bindings.json`, {
  schema: 'ld-s10y-image/author-input-bindings@1',
  currentAuthority: binding(`${currentText}/repair-freeze.json`),
  originalAuthority: binding(`${originalText}/author-freeze.json`),
  status: 'CURRENT-REPAIRED-BILINGUAL-TEXT-BOUND-INDEPENDENT-REVIEW-PENDING',
  provisionalOriginalSupersededBeforeFirstRender: true,
  displayTitleIsSeparateFromRawIdentity: true,
  inputs: inputBindings,
})

const source = read(`${A}/source-observations.json`).sourceOpens[0]
assert.equal(sha(source.path), source.sha256)
const objects = []
const assertions = []
const addEdge = (id, type, from, to, strokeWidth) => {
  objects.push({ id, type, from, to, stroke: 'ink', strokeWidth })
  assertions.push({ id: `${id}-connects`, type: 'connects', arrow: id, from, to })
}
const origin = [90, 78]
objects.push(
  { id: '301-horizontal-axis', type: 'axis', from: [30, 78], to: [604, 78],
    ticks: [], stroke: 'ink', strokeWidth: 2.6 },
  { id: '301-vertical-axis', type: 'axis', from: [90, 40], to: [90, 465],
    ticks: [], stroke: 'ink', strokeWidth: 2.6 },
)
addEdge('301-horizontal-positive-arrow', 'arrow', [576, 78], [604, 78], 2.6)
addEdge('301-vertical-positive-arrow', 'arrow', [90, 437], [90, 465], 2.6)
assertions.push(
  { id: '301-perpendicular-axes', type: 'perpendicular',
    a: [30, 78], b: [604, 78], c: [90, 40], d: [90, 465] },
  { id: '301-origin-on-horizontal-axis', type: 'pointOnLine',
    point: origin, a: [30, 78], b: [604, 78] },
  { id: '301-origin-on-vertical-axis', type: 'pointOnLine',
    point: origin, a: [90, 40], b: [90, 465] },
)

// These controls regularize an uncalibrated source shape; they are not magnetic data.
const controls = [
  [origin, [145, 220], [200, 316], [255, 338]],
  [[255, 338], [315, 360], [388, 368], [450, 370]],
]
const cubic = (points, t) => [0, 1].map(axis => {
  const s = 1 - t
  return Number((s ** 3 * points[0][axis] + 3 * s ** 2 * t * points[1][axis]
    + 3 * s * t ** 2 * points[2][axis] + t ** 3 * points[3][axis]).toFixed(8))
})
const curve = [origin]
for (const control of controls) {
  for (let step = 1; step <= 48; step += 1) curve.push(cubic(control, step / 48))
}
const curveIds = []
for (let i = 1; i < curve.length; i += 1) {
  const id = `301-initial-curve-${String(i).padStart(3, '0')}`
  curveIds.push(id)
  addEdge(id, 'segment', curve[i - 1], curve[i], 4.2)
  assertions.push({
    id: `${id}-unmeasured-schematic-step`, type: 'displacement',
    from: curve[i - 1], to: curve[i],
    dx: curve[i][0] - curve[i - 1][0], dy: curve[i][1] - curve[i - 1][1],
  })
}
for (const [id, at, text] of [
  ['301-magnetization-label', [58, 465], 'I'],
  ['301-applied-field-label', [578, 39], 'B\u2080'],
  ['301-origin-label', [58, 48], '0'],
]) {
  objects.push({ id, type: 'text', at, text, fontSize: 34, fontWeight: 400,
    labelPlacement: { position: 'CENTER' } })
}
assertions.push(
  { id: '301-two-axes', type: 'objectCount', objectType: 'axis', count: 2 },
  { id: '301-two-positive-axis-arrows', type: 'objectCount', objectType: 'arrow', count: 2 },
  { id: '301-three-source-labels', type: 'objectCount', objectType: 'text', count: 3 },
  { id: '301-single-open-curve-chain', type: 'objectCount', objectType: 'segment', count: 96 },
)
const inventory = [
  {
    id: '301-source-shared-axes',
    description: source.pixelInventory.axes,
    objects: ['301-horizontal-axis', '301-vertical-axis',
      '301-horizontal-positive-arrow', '301-vertical-positive-arrow'],
    assertions: ['301-perpendicular-axes', '301-origin-on-horizontal-axis',
      '301-origin-on-vertical-axis', '301-horizontal-positive-arrow-connects',
      '301-vertical-positive-arrow-connects', '301-two-axes',
      '301-two-positive-axis-arrows'],
  },
  {
    id: '301-source-single-initial-curve',
    description: `${source.pixelInventory.curves} ${source.pixelInventory.relations} `
      + 'The dense native segment chain is modern smooth-line regularization, not sampled experimental data.',
    objects: curveIds,
    assertions: ['301-single-open-curve-chain',
      ...curveIds.flatMap(id => [`${id}-connects`, `${id}-unmeasured-schematic-step`])],
  },
  {
    id: '301-source-symbols-and-no-scale',
    description: `${source.pixelInventory.labels.join(' ')} ${source.pixelInventory.ticksAndGrid}`,
    objects: ['301-magnetization-label', '301-applied-field-label', '301-origin-label'],
    assertions: ['301-three-source-labels'],
  },
]
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-301', mode: 'deterministic',
  description: 'Inspect the single initial magnetization curve I against B_0 from '
    + 'a demagnetized state: a rising material contribution approaches saturation. '
    + 'Not a total-field plateau, hysteresis return path, calibrated experiment or material dataset. '
    + 'Canvas positions and smooth-line controls are unmeasured modern regularization.',
  source: { image: { path: source.path, sha256: source.sha256 },
    authoritativeText, inventory },
  canvas: { width: 640, height: 520, boundingBox: [0, 520, 640, 0],
    background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640,
    widths: [316, 640], minTextPx: 16 },
  objects, assertions, layout: { minLabelGap: 3 },
}
const initial = `${A}/fig-301/initial`
write(`${initial}/fig-301.spec.json`, spec)
write(`${initial}/source-inventory.json`, inventory)
const slopes = curve.slice(1).map((point, index) =>
  (point[1] - curve[index][1]) / (point[0] - curve[index][0]))
assert.deepEqual(curve[0], origin)
assert.deepEqual(curve.at(-1), [450, 370])
assert(curve.every(point => point[0] >= origin[0] && point[1] >= origin[1]))
assert(curve.slice(1).every((point, index) =>
  point[0] > curve[index][0] && point[1] > curve[index][1]))
assert(slopes.every((slope, index) => index === 0 || slope <= slopes[index - 1]))
write(`${initial}/author-geometry.json`, {
  status: 'PASS', curveVertices: curve, unmeasuredControls: controls,
  sourceMeasuredCoordinates: [], originShared: true, monotonicallyIncreasing: true,
  decreasingSlope: true, terminalSlopePositiveAndNearHorizontal: slopes.at(-1),
  noReturnBranch: true, noAddedTicks: true, noAddedUnitsOrValues: true,
  geometrySha256: crypto.createHash('sha256')
    .update(JSON.stringify({ canvas: spec.canvas, display: spec.display,
      objects: spec.objects, assertions: spec.assertions, layout: spec.layout })).digest('hex'),
})
const run = (name, command, args) => {
  const result = spawnSync(command, args, {
    cwd: W, encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: `${A}/browser-tmp/` },
  })
  const receipt = { command, args, cwd: W, exitCode: result.status,
    status: result.status === 0 ? 'PASS' : 'FAIL',
    stdout: result.stdout, stderr: result.stderr,
    spec: binding(`${initial}/fig-301.spec.json`) }
  write(`${initial}/${name}.json`, receipt)
  return result.status === 0
}
fs.mkdirSync(`${A}/browser-tmp`, { recursive: true })
const validator = `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`
const draftPass = run('draft-validation', 'python3',
  [validator, `${initial}/fig-301.spec.json`, '--stage', 'draft', '--json'])
let renderPass = false
if (draftPass) {
  renderPass = run('render-command', 'node', [
    `${W}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
    '--spec', `${initial}/fig-301.spec.json`, '--svg', `${initial}/fig-301.svg`,
    '--png', `${initial}/fig-301.native.png`, '--report', `${initial}/fig-301.render.json`,
  ])
}
if (renderPass) run('rendered-validation', 'python3',
  [validator, `${initial}/fig-301.spec.json`, '--stage', 'rendered', '--json'])
console.log(JSON.stringify({
  authoredFigures: ['fig-301'], spec: binding(`${initial}/fig-301.spec.json`),
  draft: draftPass ? 'PASS' : 'FAIL', render: renderPass ? 'PASS' : 'FAIL',
  rendererInvocations: draftPass ? 1 : 0, specRepairsUsed: 0,
  sourceImagesOpened: 2, figure303: 'OBSERVATION-ONLY',
}))
