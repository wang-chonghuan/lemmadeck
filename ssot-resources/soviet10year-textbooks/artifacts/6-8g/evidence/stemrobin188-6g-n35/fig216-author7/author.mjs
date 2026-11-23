import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), repo)
const work = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n35-fig216-author7')
const finalRoot = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral'
const textRoot = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n35/text-author7'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-216.png'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const writeNew = (name, value) => fs.writeFileSync(path.join(work, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
const inputInventory = JSON.parse(fs.readFileSync(path.join(work, 'source-inventory.json'), 'utf8'))
const context = {}
const authoritativeText = []
for (const file of ['lesson.template.json', 'exercises.template.json']) {
  const relative = `${textRoot}/${file}`
  const raw = fs.readFileSync(path.join(repo, relative), 'utf8')
  const data = JSON.parse(raw)
  assert.equal(data.edition, 'modern-us-neutral')
  // A reversible JSON string literal preserves the full raw template, including whitespace.
  // The native symmetry heuristic must not treat unrelated later prose as fig-216 geometry.
  const fullJSONText = JSON.stringify(raw).replace(/[^\x00-\x7f]/g, char =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
  assert.equal(JSON.parse(fullJSONText), raw)
  context[file] = { path: relative, sha256: hash(path.join(repo, relative)), fullJSONText,
    encoding: 'JSON string literal; JSON.parse(fullJSONText) restores exact complete UTF-8 file text' }
  authoritativeText.push({ lesson: 'geo68-c3-s2-n35', text: JSON.stringify(context[file]) })
}
authoritativeText.push({
  lesson: 'geo68-c3-s2-n35',
  text: 'Figure-specific scope: panel a shows the three rays [A_1B_1), [A_2B_2), [A_3B_3) with the same direction, illustrating reflexivity, symmetry of that relation, and transitivity. Panel b shows representatives of the collection of all rays with the same direction as a given ray. The approved panel labels are a and b. No metric equality or later theorem is claimed by fig-216.'
})

const width = 640
const height = 1060
const screenA = ([x, y]) => [44 + 0.95 * x, 70 + 0.95 * y]
const screenB = ([x, y]) => [60 + x - 560, 580 + y - 20]
const user = ([x, y]) => [x, height - y]
const coordA = point => user(screenA(point))
const coordB = point => user(screenB(point))
const lerp = (a, b, t) => a.map((v, i) => v + t * (b[i] - v))
const rawA = [[252, 143], [86, 341], [346, 333]]
const rawB = [[454, 42], [512, 128], [557, 227.5]]
const objects = []
const assertions = []
const addAssertion = (id, type, values) => assertions.push({ id, type, ...values })
const point = (id, at, label, visible = true, placement) => objects.push({
  id, type: 'point', at, ...(label ? { label } : {}), visible,
  size: 3, strokeWidth: 1, stroke: 'ink', fill: 'ink', fontSize: 32,
  ...(placement ? { labelPlacement: placement } : {})
})
for (let i = 0; i < 3; i++) {
  point(`a-A${i + 1}`, coordA(rawA[i]), `A${String.fromCharCode(0x2081 + i)}`, true,
    { position: i === 0 ? 'W' : 'NW', gap: 20 })
  point(`a-B${i + 1}`, coordA(rawB[i]), `B${String.fromCharCode(0x2081 + i)}`, false,
    { position: 'N', gap: 25 })
}
const supportChecks = []
for (const [suffix, a, b, lo, hi] of [
  ['21', 1, 0, -0.38, 1.63],
  ['13', 0, 2, -0.55, 1.48],
  ['23', 1, 2, -0.27, 1.71]
]) {
  const id = `a-support-${suffix}`
  const from = coordA(lerp(rawA[a], rawA[b], lo))
  const to = coordA(lerp(rawA[a], rawA[b], hi))
  objects.push({ id, type: 'segment', from, to, stroke: 'muted', strokeWidth: 2, dash: 0 })
  addAssertion(`${id}-connection`, 'connects', { arrow: id, from, to })
  for (const i of [a, b]) addAssertion(`${id}-A${i + 1}-incident`, 'collinear',
    { a: `a-A${i + 1}`, b: from, c: to, tolerance: 0.00001 })
  supportChecks.push({ id, from, first: `a-A${a + 1}`, second: `a-A${b + 1}`, to })
}
const rayChecks = []
for (let i = 1; i <= 3; i++) {
  const id = `a-ray-${i}`
  const from = `a-A${i}`
  const to = `a-B${i}`
  objects.push({ id, type: 'arrow', from, to, stroke: 'ink', strokeWidth: 3.5 })
  addAssertion(`${id}-connection`, 'connects', { arrow: id, from, to })
  rayChecks.push({ id, panel: 'a', from, through: to, screenDirection: [1, -0.5] })
}
for (let i = 1; i <= 3; i++) for (let j = i + 1; j <= 3; j++)
  addAssertion(`a-parallel-${i}-${j}`, 'parallel',
    { a: `a-A${i}`, b: `a-B${i}`, c: `a-A${j}`, d: `a-B${j}`, tolerance: 0.00000001 })

const rawStartsB = [
  ['top', [762, 25], 1041],
  ['AB', [653, 91], 1002],
  ['upper', [790, 118], 1065],
  ['left', [562, 105], 948],
  ['bottom', [641, 230], 966]
]
for (const [name, rawStart, endX] of rawStartsB) {
  const startId = name === 'AB' ? 'b-A' : `b-${name}-start`
  const end = [endX, rawStart[1] + 0.62 * (endX - rawStart[0])]
  point(startId, coordB(rawStart), name === 'AB' ? 'A' : undefined, true,
    name === 'AB' ? { position: 'NW', gap: 24 } : undefined)
  if (name === 'AB') point('b-B', coordB(end), 'B', false, { position: 'NE', gap: 25 })
  const to = name === 'AB' ? 'b-B' : coordB(end)
  const id = `b-ray-${name}`
  objects.push({ id, type: 'arrow', from: startId, to, stroke: 'ink', strokeWidth: 3.5 })
  addAssertion(`${id}-connection`, 'connects', { arrow: id, from: startId, to })
  rayChecks.push({ id, panel: 'b', from: startId, through: to, screenDirection: [1, 0.62] })
}
const raysB = rayChecks.filter(ray => ray.panel === 'b')
for (let i = 0; i < raysB.length; i++) for (let j = i + 1; j < raysB.length; j++)
  addAssertion(`b-parallel-${i + 1}-${j + 1}`, 'parallel', {
    a: raysB[i].from, b: raysB[i].through, c: raysB[j].from, d: raysB[j].through, tolerance: 0.00000001
  })
objects.push(
  { id: 'panel-a-label', type: 'text', at: user([36, 36]), text: 'a)', fontSize: 32, labelPlacement: { position: 'CENTER' } },
  { id: 'panel-b-label', type: 'text', at: user([36, 552]), text: 'b)', fontSize: 32, labelPlacement: { position: 'CENTER' } }
)

const A1 = objects.find(o => o.id === 'a-A1').at
const A3 = objects.find(o => o.id === 'a-A3').at
const A2 = objects.find(o => o.id === 'a-A2').at
const B2 = objects.find(o => o.id === 'a-B2').at
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const sub = (a, b) => a.map((v, i) => v - b[i])
const t = cross(sub(A2, A1), sub(B2, A2)) / cross(sub(A3, A1), sub(B2, A2))
const crossing = lerp(A1, A3, t)
addAssertion('a-crossing-on-support-13', 'collinear', { a: 'a-A1', b: 'a-A3', c: crossing, tolerance: 0.00001 })
addAssertion('a-crossing-on-ray-2', 'collinear', { a: 'a-A2', b: 'a-B2', c: crossing, tolerance: 0.00001 })
addAssertion('source-ray-count', 'objectCount', { objectType: 'arrow', value: 8 })
addAssertion('source-extra-support-count', 'objectCount', { objectType: 'segment', value: 3 })

const inventory = ['a', 'b'].map(panel => ({
  id: `source-panel-${panel}`,
  description: panel === 'a'
    ? 'Independent source inventory: all six source label positions map to modern A_1/B_1, A_2/B_2, A_3/B_3; all three up-right rays and the three complete extended origin-joining supports are retained. A_1/A_2/A_3 keep printed junction markers; B labels have no invented dot. Extended-support order and the unmarked interior crossing are retained. Original glyph/script/printing/dash identities UNKNOWN. Panel stacking and explicit arrowheads are modern additions, not source facts. No metric equality.'
    : 'Independent source inventory: all five down-right rays on distinct parallel supports, all five marked origins and the named A/B label positions, with A at the second-highest origin. Four other rays stay unlabelled. Original glyph/script/printing/dash identities UNKNOWN. No invented origin, coincidence, nesting or metric equality among the five displayed representatives.',
  objects: objects.filter(object => object.id.startsWith(`${panel}-`) || object.id === `panel-${panel}-label`).map(object => object.id),
  assertions: assertions.filter(a => a.id.startsWith(`${panel}-`) || a.id === (panel === 'a' ? 'source-extra-support-count' : 'source-ray-count')).map(a => a.id),
  requires: ['pointRelationships']
}))
const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: 'fig-216', mode: 'deterministic',
  description: 'Same-direction equivalence and a direction as a collection of rays. Retain three labelled rays, three full extended origin-joining supports, and five collection representatives; no lengths or angles are given.',
  source: { image: { path: source, sha256: hash(path.join(repo, source)) }, authoritativeText, inventory },
  canvas: { width, height, boundingBox: [0, height, width, 0], background: 'paper', keepAspectRatio: true },
  display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 640, minTextPx: 16, widths: [331, 358, 480] },
  objects, assertions, layout: { minLabelGap: 4 }
}
writeNew('fig-216.spec.json', spec)
writeNew('authoritative-context.json', { schema: 'ld-s10y-image/authoritative-context@1',
  lesson: 'geo68-c3-s2-n35', ...context, original: spec.source.image,
  inventory: { path: 'source-inventory.json', sha256: hash(path.join(work, 'source-inventory.json')) } })
writeNew('relationship-contract.json', {
  schema: 'ld-s10y-image/executable-relationship-contract@1',
  rayChecks, supportChecks, crossing,
  originOrderB: ['b-top-start', 'b-A', 'b-left-start', 'b-upper-start', 'b-bottom-start'],
  originalMetricEqualities: [],
  meaning: 'Finite arrow tips are display truncations of rays. Coincident/nested tests quantify the rays defined by points on each existing extended support, without adding source objects or labels.'
})

const result = spawnSync('node', ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', path.relative(repo, path.join(work, 'fig-216.spec.json')),
  '--svg', path.relative(repo, path.join(work, 'fig-216.svg')),
  '--report', path.relative(repo, path.join(work, 'fig-216.render.json'))], { cwd: repo, encoding: 'utf8' })
writeNew('native-render-execution.json', { cwd: repo, argv: result.args ?? ['node',
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', path.relative(repo, path.join(work, 'fig-216.spec.json')),
  '--svg', path.relative(repo, path.join(work, 'fig-216.svg')), '--report', path.relative(repo, path.join(work, 'fig-216.render.json'))],
  exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr,
  nativeRenderCalls: 1, revision: 0, paidCalls: 0, networkCalls: 0 })
console.log(result.stdout)
console.error(result.stderr)
if (result.status !== 0) process.exit(result.status ?? 1)
const report = JSON.parse(fs.readFileSync(path.join(work, 'fig-216.render.json'), 'utf8'))
assert.equal(report.status, 'pass')
fs.copyFileSync(path.join(work, 'fig-216.render.json'), path.join(work, 'fig-216.render.pre-portability.json'), fs.constants.COPYFILE_EXCL)
report.spec.path = `${finalRoot}/figures/fig-216.spec.json`
report.output.svg.path = `${finalRoot}/figures/fig-216.svg`
assert.equal(report.spec.sha256, hash(path.join(work, 'fig-216.spec.json')))
assert.equal(report.output.svg.sha256, hash(path.join(work, 'fig-216.svg')))
fs.writeFileSync(path.join(work, 'fig-216.render.json'), `${JSON.stringify(report, null, 2)}\n`)
