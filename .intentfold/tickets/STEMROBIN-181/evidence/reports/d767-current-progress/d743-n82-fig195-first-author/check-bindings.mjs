import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const owner = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d743-n82-fig195-first-author`
const read = name => JSON.parse(fs.readFileSync(`${owner}/${name}`, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const spec = read('fig-195.spec.json')
const render = read('fig-195.render.json')
const byId = new Map(spec.objects.map(item => [item.id, item]))
const byAssertion = new Map(spec.assertions.map(item => [item.id, item]))
const p = value => typeof value === 'string' ? byId.get(value).at : value
const vec = (a, b) => [b[0] - a[0], b[1] - a[1]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const length = a => Math.hypot(...a)
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const unit = a => a.map(value => value / length(a))
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`)
const samePoint = (a, b) => { near(a[0], b[0]); near(a[1], b[1]) }
const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1, dot(a, b) / length(a) / length(b))))
const checks = []
const check = (id, fn) => { fn(); checks.push({ id, status: 'pass' }) }
try {
  check('current-native-render-binding', () => {
    assert.equal(render.status, 'pass')
    assert.equal(render.spec.sha256, sha(`${owner}/fig-195.spec.json`))
    assert.equal(render.output.svg.sha256, sha(`${owner}/fig-195.svg`))
    assert.equal(render.collisions.length, 0)
  })
  check('complete-modern-not-raw-authoritative-text', () => {
    const inputs = read('inputs.json')
    const expected = ['en', 'zh'].flatMap(locale => {
      assert.equal(sha(inputs[locale].path), inputs[locale].sha256)
      const lesson = JSON.parse(fs.readFileSync(inputs[locale].path, 'utf8'))
      return lesson.prose.filter(item => typeof item.text === 'string' && item.text.trim())
        .map(item => ({ lesson: `phy10-c2-s3-n82:${locale}`, text: item.text }))
    })
    assert.deepEqual(spec.source.authoritativeText, expected)
    assert.equal(expected.length, 32)
    assert.equal(sha(inputs.requirements.path), inputs.requirements.sha256)
  })
  check('one-exact-independent-source-observation-and-mapping', () => {
    const mapping = read('inventory-mapping.json')
    assert.equal(sha(mapping.independentObservation.path), mapping.independentObservation.sha256)
    assert.equal(sha(mapping.independentObservation.path), sha(`${repo}/tmp/d743-n82-fig195-first-author/source-inventory.json`))
    assert.deepEqual(mapping.mappedGroups, spec.source.inventory)
    assert.equal(sha(spec.source.image.path), spec.source.image.sha256)
  })
  check('every-drawn-semantic-edge-bound-to-native-connects', () => {
    for (const object of spec.objects.filter(item => ['segment', 'arrow'].includes(item.type))) {
      const binding = byAssertion.get(`${object.id}-connects`)
      assert.equal(binding.type, 'connects')
      assert.equal(binding.arrow, object.id)
      assert.deepEqual(binding.from, object.from)
      assert.deepEqual(binding.to, object.to)
    }
  })
  check('shared-source-point-positions-and-normal', () => {
    assert.ok(p('M')[0] < p('A')[0] && p('A')[0] < p('B')[0] && p('B')[0] < p('N')[0])
    for (const id of ['M', 'A', 'B', 'N']) near(p(id)[1], 0)
    for (const id of ['A1', 'B1', 'C']) assert.ok(p(id)[1] > 0)
    for (const id of ['A2', 'B2', 'D']) assert.ok(p(id)[1] < 0)
    const normal = byId.get('normal-A')
    near(p(normal.from)[0], p('A')[0])
    near(p(normal.to)[0], p('A')[0])
    assert.ok(p(normal.from)[1] > 0 && p(normal.to)[1] < 0)
    near(dot(vec(p(normal.from), p(normal.to)), vec(p('M'), p('N'))), 0)
  })
  for (const [id, a, middle, b] of [['B1-C-B-order', 'B1', 'C', 'B'], ['A-D-A2-order', 'A', 'D', 'A2']]) {
    check(id, () => {
      const direction = vec(p(a), p(b))
      near(cross(direction, vec(p(a), p(middle))), 0)
      const t = dot(vec(p(a), p(middle)), direction) / dot(direction, direction)
      assert.ok(t > 0 && t < 1)
    })
  }
  const rayPairs = [['A1', 'A'], ['B1', 'B'], ['A', 'A2'], ['B', 'B2']]
  check('four-arrowheads-collinear-contained-and-forward', () => {
    const arrows = spec.objects.filter(item => item.type === 'arrow')
    assert.equal(arrows.length, 4)
    for (const [index, arrow] of arrows.entries()) {
      const [start, end] = rayPairs[index]
      const ray = vec(p(start), p(end))
      for (const endpoint of [arrow.from, arrow.to]) {
        const offset = vec(p(start), p(endpoint))
        near(cross(ray, offset), 0)
        const t = dot(offset, ray) / dot(ray, ray)
        assert.ok(t >= -1e-8 && t <= 1 + 1e-8)
      }
      assert.ok(dot(ray, vec(p(arrow.from), p(arrow.to))) > 0)
    }
  })
  check('actual-wavefront-right-triangles', () => {
    assert.deepEqual([byId.get('wavefront-AC').from, byId.get('wavefront-AC').to], ['A', 'C'])
    assert.deepEqual([byId.get('wavefront-DB').from, byId.get('wavefront-DB').to], ['D', 'B'])
    near(dot(vec(p('A'), p('C')), vec(p('C'), p('B'))), 0)
    near(dot(vec(p('A'), p('D')), vec(p('D'), p('B'))), 0)
  })
  const outgoing = unit(vec(p('A'), p('A2')))
  const wavelets = ['wavelet-A', 'wavelet-secondary-1', 'wavelet-secondary-2']
  let previousRadius = Infinity
  for (const id of wavelets) {
    check(`${id}-actual-arc-incidence-tangency-and-same-instant`, () => {
      const arc = byId.get(id)
      const center = p(arc.center)
      const start = p(arc.start)
      const end = p(arc.end)
      const radius = length(vec(center, start))
      assert.ok(radius > 0 && radius < previousRadius)
      previousRadius = radius
      near(center[1], 0)
      assert.ok(center[0] >= p('A')[0] && center[0] < p('B')[0])
      near(start[1], 0)
      near(end[1], 0)
      assert.ok(start[0] < center[0] && end[0] > center[0])
      near(length(vec(center, end)), radius)
      // These are the endpoints of the native CCW lower semicircle.
      const binding = byAssertion.get(`${id}-contact-incidence`)
      samePoint(p(binding.center), center)
      near(binding.radius, radius)
      const contact = p(binding.point)
      assert.ok(contact[1] < 0)
      near(length(vec(center, contact)), radius)
      near(cross(vec(p('D'), p('B')), vec(p('D'), contact)), 0)
      near(dot(vec(center, contact), vec(p('D'), p('B'))), 0)
      near(radius, -dot(vec(p('B'), center), outgoing))
      samePoint(contact, [center[0] + outgoing[0] * radius, center[1] + outgoing[1] * radius])
      for (const [suffix, actualEndpoint] of [['start', start], ['end', end]]) {
        const endpointBinding = byAssertion.get(`${id}-${suffix}-incidence`)
        samePoint(p(endpointBinding.point), actualEndpoint)
        samePoint(p(endpointBinding.center), center)
        near(endpointBinding.radius, radius)
      }
    })
  }
  check('normal-angle-arcs-and-triangle-angle-identities', () => {
    const alpha = byId.get('angle-alpha')
    const beta = byId.get('angle-beta')
    for (const arc of [alpha, beta]) samePoint(p(arc.center), p('A'))
    near(p(alpha.start)[0], 0)
    assert.ok(p(alpha.start)[1] > 0)
    near(p(beta.start)[0], 0)
    assert.ok(p(beta.start)[1] < 0)
    near(cross(p(alpha.end), vec(p('A'), p('A1'))), 0)
    near(cross(p(beta.end), vec(p('A'), p('A2'))), 0)
    assert.ok(dot(p(alpha.end), vec(p('A'), p('A1'))) > 0)
    assert.ok(dot(p(beta.end), vec(p('A'), p('A2'))) > 0)
    const incidenceAngle = angle(p(alpha.start), p(alpha.end))
    const refractionAngle = angle(p(beta.start), p(beta.end))
    assert.ok(refractionAngle > 0 && refractionAngle < incidenceAngle && incidenceAngle < Math.PI / 2)
    near(incidenceAngle, angle(vec(p('A'), p('C')), vec(p('A'), p('B'))))
    near(refractionAngle, angle(vec(p('B'), p('A')), vec(p('B'), p('D'))))
    near(length(vec(p('C'), p('B'))) / length(vec(p('A'), p('B'))), Math.sin(incidenceAngle))
    near(length(vec(p('A'), p('D'))) / length(vec(p('A'), p('B'))), Math.sin(refractionAngle))
    assert.ok(length(vec(p('A'), p('D'))) < length(vec(p('C'), p('B'))))
  })
  check('all-source-labels-no-invented-numerical-annotations', () => {
    const labels = spec.objects.flatMap(item => [item.label, item.text].filter(Boolean))
    assert.deepEqual([...labels].sort(), ['M', 'N', 'A', 'B', 'C', 'D', 'A1', 'A2', 'B1', 'B2', '\u03b1', '\u03b2'].sort())
    for (const item of labels) assert.ok(!/[\u0400-\u04ff\u3400-\u9fff]/.test(item))
  })
  fs.writeFileSync(`${owner}/bindings.json`, `${JSON.stringify({
    schema: 'd743/executable-object-bindings@1', status: 'pass',
    specSha256: sha(`${owner}/fig-195.spec.json`), checks, approval: 'none',
  }, null, 2)}\n`)
  console.log(`PASS: ${checks.length} source/object binding checks`)
} catch (error) {
  const failure = { schema: 'd743/executable-object-bindings@1', status: 'fail', checks, error: error.message, approval: 'none' }
  fs.writeFileSync(`${owner}/bindings.first-fail.json`, `${JSON.stringify(failure, null, 2)}\n`, { flag: 'wx' })
  console.error(error)
  process.exitCode = 1
}
