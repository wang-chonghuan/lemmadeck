import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const dir = '.tmp/s10y-image/9-10g/fig-11'
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = (name) => JSON.parse(fs.readFileSync(`${dir}/${name}`))
const spec = load('fig-11.spec.json')
const model = load('projection-model.json')
const get = (id) => {
  const object = spec.objects.find((item) => item.id === id)
  assert(object, id)
  return object
}
const close = (a, b) => assert(Math.abs(a - b) < 1e-7, `${a} != ${b}`)
const closePoint = (a, b) => a.forEach((v, i) => close(v, b[i]))
const subtract = (a, b) => a.map((v, i) => v - b[i])
const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0)
const cross2 = (a, b) => a[0] * b[1] - a[1] * b[0]
const project = (panel, p) => panel.projection.origin.map((v, axis) =>
  v + p.reduce((sum, component, i) => sum + component * panel.projection.basis[i][axis], 0))
const checks = []
const checked = (name, fn, detail) => {
  fn()
  checks.push({ name, status: 'pass', detail })
}
checked('source-topology-and-label-inventory-exact', () => {
  assert.deepEqual(spec.objects.filter((item) => item.type === 'point').map((item) => item.id), ['left-M', 'right-M'])
  assert.deepEqual(spec.objects.filter((item) => item.type === 'segment').map((item) => item.id), ['left-line-a', 'left-line-b', 'right-line-a'])
  assert.deepEqual(spec.objects.filter((item) => item.type === 'text').map((item) => item.text), ['\u03b1', 'a', 'b', 'M', 'a)', '\u03b1', 'a', 'M', 'b)'])
  assert(spec.objects.every((item) => item.visible !== false))
}, 'Two source M dots, three solid line depictions, nine labels; no extra endpoints/dots, right b stroke or right b line label.')
for (const panel of model.panels) {
  checked(`${panel.id}-all-model-geometry-matches-current-spec`, () => {
    const window = get(panel.planeWindow.object)
    panel.planeWindow.vertices.forEach((p, i) => {
      close(dot(panel.plane.normal, p), panel.plane.constant)
      closePoint(project(panel, p), window.points[i])
    })
    for (const [id, p] of Object.entries(panel.points)) closePoint(project(panel, p), get(id).at)
    for (const [id, line] of Object.entries(panel.lines)) {
      closePoint(project(panel, line.from), get(id).from)
      closePoint(project(panel, line.to), get(id).to)
    }
  }, 'Every model window vertex, source point and line extent projects exactly to the current spec.')
  checked(`${panel.id}-source-point-and-whole-lines-in-plane`, () => {
    const n = panel.plane.normal, c = panel.plane.constant
    for (const p of Object.values(panel.points)) close(dot(n, p), c)
    for (const line of Object.values(panel.lines)) {
      const d = subtract(line.to, line.from)
      assert(dot(d, d) > 0)
      close(dot(n, line.from), c)
      close(dot(n, d), 0)
    }
  }, 'n.p0=c and n.d=0, hence every infinite displayed line p0+t*d is in the same local z=0 plane, not just its finite extent.')
  checked(`${panel.id}-M-on-source-containing-line`, () => {
    const p = panel.points[panel.sourcePoint]
    const line = panel.lines[panel.sourceContainingLine]
    close(cross2(subtract(p, line.from), subtract(line.to, line.from)), 0)
  }, `${panel.sourcePoint} belongs to ${panel.sourceContainingLine}.`)
}
const left = model.panels.find((panel) => panel.id === 'left')
const right = model.panels.find((panel) => panel.id === 'right')
checked('left-a-and-b-parallel-distinct-M-not-on-a', () => {
  const a = left.lines['left-line-a'], b = left.lines['left-line-b']
  const da = subtract(a.to, a.from), db = subtract(b.to, b.from)
  close(cross2(da, db), 0)
  assert(Math.abs(cross2(subtract(b.from, a.from), da)) > 1e-7)
  assert(Math.abs(cross2(subtract(left.points['left-M'], a.from), da)) > 1e-7)
  // Display separation is a deliberate projection choice, not a source length.
  assert.equal(get('left-line-b').from[0] - get('left-line-a').from[0], 115)
}, 'Direction determinant=0; offset/M determinants nonzero. Distinct coplanar parallel lines with M on b, not a. No objectCount substitutes for nonincidence.')
checked('right-b-equals-a-is-exact-semantic-alias', () => {
  assert.deepEqual(right.aliases, { b: 'right-line-a' })
  assert.strictEqual(right.lines[right.aliases.b], right.lines['right-line-a'])
  assert(!spec.objects.some((item) => item.id === 'right-line-b' || item.id === 'right-b-label'))
  assert.equal(spec.objects.filter((item) => item.type === 'segment' && item.id.startsWith('right-')).length, 1)
  assert.deepEqual(spec.objects.filter((item) => item.type === 'text' && item.id.startsWith('right-')).map((item) => item.text), ['\u03b1', 'a', 'M', 'b)'])
}, 'b resolves to the same complete infinite line a; only a is rendered/labelled. b) is a panel marker, not a line b label.')
checked('every-source-object-and-native-assertion-mapped-to-own-panel', () => {
  for (const panel of ['left', 'right']) {
    const group = spec.source.inventory.find((item) => item.id === `${panel}-source-panel`)
    assert.deepEqual(group.objects, spec.objects.filter((item) => item.id.startsWith(`${panel}-`)).map((item) => item.id))
    assert.deepEqual(group.assertions, spec.assertions.filter((item) => item.id.startsWith(`${panel}-`)).map((item) => item.id))
    const marker = get(`${panel}-panel-label`)
    const window = get(`${panel}-alpha-outline`)
    assert(marker.at[1] < Math.min(...window.points.map((p) => p[1])))
    const lines = spec.objects.filter((item) => item.type === 'segment' && item.id.startsWith(`${panel}-`))
    for (const line of lines) {
      assert.equal(line.dash, 0)
      for (const suffix of ['extent-connected', 'lower-inside', 'upper-inside']) {
        assert(group.assertions.includes(`${line.id}-${suffix}`))
      }
    }
    for (const label of spec.objects.filter((item) => item.type === 'text' && item.id.startsWith(`${panel}-`) && item.id !== marker.id)) {
      assert(group.assertions.some((id) => spec.assertions.some((item) =>
        item.id === id && item.type === 'inside' && item.point === label.id && item.margin >= 28)))
    }
  }
}, 'Own-panel inventory covers every label, point, line and window plus all native relations. Each interior label has inside clearance; markers are below their own windows.')
const output = `${dir}/source-relations-check.json`
assert(!fs.existsSync(output), 'Preserve existing supplemental check')
fs.writeFileSync(output, JSON.stringify({
  schema: 'ticket-scratch/figure-source-relations@1',
  figure: 'fig-11', status: 'pass',
  specSha256: hash(`${dir}/fig-11.spec.json`),
  modelSha256: hash(`${dir}/projection-model.json`),
  contextBindingSha256: hash(`${dir}/context-binding.json`),
  checks,
  limitation: 'Author-only executable supplemental evidence, not native FigureSpec assertions, independent approval or a new renderer. Independent reviewer must assess source/context fit.',
}, null, 2) + '\n')
console.log(`fig-11 supplemental source relations: ${checks.length} checks PASS`)
