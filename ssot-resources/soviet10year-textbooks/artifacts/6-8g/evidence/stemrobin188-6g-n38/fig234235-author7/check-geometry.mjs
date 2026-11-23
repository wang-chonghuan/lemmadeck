import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188')
const ids = process.argv.slice(2)
assert.ok(ids.length && ids.every((id) => ['fig-234', 'fig-235'].includes(id)))
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const sub = (a, b) => a.map((v, i) => v - b[i])
const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
const length = (v) => Math.hypot(...v)
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} differs from ${b}`)
const results = []
for (const id of ids) {
  const spec = JSON.parse(fs.readFileSync(path.join(owned, `${id}.spec.json`)))
  const byId = new Map(spec.objects.map((item) => [item.id, item]))
  const at = (value) => typeof value === 'string' ? byId.get(value).at : value
  const texts = spec.objects.flatMap((item) => [item.label, item.text].filter(Boolean))
  assert.equal(spec.display.minTextPx, 16)
  assert.deepEqual(spec.display.widths, [294, 310, 346, 358, 640])
  assert.equal(spec.display.layout, 'inline')
  assert.equal(spec.display.purpose, 'instructional')
  assert.ok(spec.source.inventory.every((group) => group.description))
  assert.ok(spec.source.inventory.some((group) => group.description.includes('UNKNOWN')))
  assert.ok(!spec.objects.some((item) => ['measure', 'text', 'svgPath', 'arrow'].includes(item.type)))
  const checks = []
  if (id === 'fig-234') {
    assert.deepEqual(texts, ['A', 'B', 'C', 'D'])
    const a = at('s234-left'), b = at('s234-upper'), c = at('s234-junction'), d = at('s234-end')
    assert.ok(c[0] > a[0] && d[0] > c[0] && b[0] > c[0] && b[1] > c[1])
    near(a[1], c[1]); near(c[1], d[1])
    assert.ok(Math.abs(cross(sub(b, a), sub(c, a))) > 1)
    assert.ok(dot(sub(a, c), sub(d, c)) < 0)
    assert.ok(cross(sub(d, c), sub(b, c)) > 0)
    assert.ok(cross(sub(b, c), sub(a, c)) > 0)
    checks.push('nondegenerate triangle; upper corner right of junction; actual rightward continuation; opposite baseline rays; adjacent disjoint interior/exterior sectors')
    const groups = [
      { prefix: 's234-left-arc-', center: 's234-left', from: 's234-junction', to: 's234-upper', count: 2 },
      { prefix: 's234-upper-arc-', center: 's234-upper', from: 's234-left', to: 's234-junction', count: 3 },
      { prefix: 's234-exterior-arc-', center: 's234-junction', from: 's234-end', to: 's234-upper', count: 1 },
    ]
    assert.equal(spec.objects.filter((item) => item.type === 'arc').length, 6)
    for (const group of groups) {
      const arcs = spec.objects.filter((item) => item.id.startsWith(group.prefix))
      assert.equal(arcs.length, group.count)
      let previousRadius = 0
      for (const arc of arcs) {
        assert.equal(arc.center, group.center)
        const start = sub(arc.start, at(group.center)), end = sub(arc.end, at(group.center))
        const from = sub(at(group.from), at(group.center)), to = sub(at(group.to), at(group.center))
        near(cross(start, from), 0); near(cross(end, to), 0)
        assert.ok(dot(start, from) > 0 && dot(end, to) > 0 && cross(start, end) > 0)
        near(length(start), length(end))
        assert.ok(length(start) > previousRadius)
        previousRadius = length(start)
      }
    }
    checks.push('arc multiplicities 2/3/1; exact centers, endpoint rays, equal endpoint radii, nested radii; no invented interior-C arc or answer text')
  } else {
    assert.deepEqual(texts, ['O'])
    const polygon = byId.get('s235-boundary')
    assert.equal(polygon.points.length, 7)
    assert.equal(new Set(polygon.points).size, 7)
    assert.deepEqual(polygon.points, Array.from({ length: 7 }, (_, i) => `s235-v${i + 1}`))
    const vertices = polygon.points.map(at), hub = at('s235-hub')
    const turns = [], signedClearances = []
    const spokes = spec.objects.filter((item) => item.id.startsWith('s235-spoke-'))
    assert.equal(spokes.length, 7)
    for (let i = 0; i < 7; i += 1) {
      const a = vertices[i], b = vertices[(i + 1) % 7], c = vertices[(i + 2) % 7]
      turns.push(cross(sub(b, a), sub(c, b)))
      signedClearances.push(cross(sub(b, a), sub(hub, a)) / length(sub(b, a)))
      assert.equal(spokes[i].from, 's235-hub')
      assert.equal(spokes[i].to, polygon.points[i])
      assert.ok(Math.abs(cross(sub(a, hub), sub(b, hub))) > 0.01)
    }
    assert.ok(turns.every((value) => value < -0.01))
    assert.ok(signedClearances.every((value) => value < -1.2))
    assert.equal(new Set(spokes.map((item) => item.to)).size, 7)
    const sideLengths = vertices.map((v, i) => length(sub(vertices[(i + 1) % 7], v)))
    assert.ok(Math.max(...sideLengths) - Math.min(...sideLengths) > 1)
    assert.equal(spec.objects.filter((item) => item.type === 'segment').length, 11)
    assert.equal(spec.objects.filter((item) => item.type === 'arc').length, 0)
    checks.push('seven unique ordered vertices; all strict clockwise convex turns; O strictly interior with >1.2 user-unit clearance; one distinct spoke per vertex; seven nondegenerate triangular sectors; irregular not regular; no extra diagonals/arcs/answers')
  }
  const bars = spec.objects.filter((item) => item.id.includes('-unknown-bar-'))
  assert.equal(bars.length, id === 'fig-234' ? 2 : 4)
  for (const bar of bars) {
    assert.equal(bar.type, 'segment')
    assert.ok(length(sub(at(bar.to), at(bar.from))) > 0)
    assert.ok(spec.assertions.some((item) => item.type === 'connects' && item.arrow === bar.id))
  }
  checks.push('unknown bar-role provenance retained; only neutral short segments, no inferred equality claims')
  results.push({ figure: id, status: 'pass', checks })
}
console.log(JSON.stringify({ schema: 'author-geometry-check@1', results }, null, 2))
