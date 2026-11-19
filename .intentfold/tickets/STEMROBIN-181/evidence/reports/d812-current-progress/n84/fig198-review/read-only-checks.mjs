import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const author = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d795-n84-fig198-first-author`
const own = `${R}/.intentfold/tickets/STEMROBIN-181/tmp/d806-n84-fig198-first-independent-review`
assert.equal(process.cwd(), R)
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const absolute = p => p.startsWith('/') ? p : `${R}/${p}`
const checkedBindings = new Map()
function bound(record) {
  const path = absolute(record.path)
  assert.equal(hash(path), record.sha256, `Hash binding: ${path}`)
  checkedBindings.set(path, { path, sha256: record.sha256 })
}
const returned = read(`${author}/RETURN.json`)
for (const record of Object.values(returned.outputs)) bound(record)
bound(returned.sourceImage)
for (const key of ['failure', 'retainedSpec', 'retainedSvg', 'retainedRender']) {
  bound(returned.native.first[key])
}
bound(returned.repairs.repair)
const inputs = read(returned.outputs.inputBindings.path)
for (const [key, record] of Object.entries(inputs.files)) {
  if (!key.startsWith('prior')) bound(record)
}
const spec = read(returned.outputs.spec.path)
const render = read(returned.outputs.nativeRender.path)
const native = read(returned.outputs.nativeResults.path)
const display = read(returned.outputs.displayResults.path)
const context = read(returned.outputs.bilingualContext.path)
bound(spec.source.image)
bound(render.spec)
for (const record of Object.values(render.output)) bound(record)
for (const key of ['productCss', 'spec', 'svg', 'screenshot']) bound(display[key])
assert.equal(render.status, 'pass')
assert.equal(native.status, 'pass')
assert.equal(render.collisions.length, 0)
assert.ok(native.results.every(r => r.exitCode === 0 && !r.error))
assert.deepEqual(spec.source.authoritativeText, context.authoritativeText)
for (const [locale, entry] of Object.entries(context.contexts)) {
  bound(entry.native)
  const current = read(inputs.files[locale].path)
  const prose = current.prose.filter(b => ['p', 'cap'].includes(b.kind))
    .map(({ source_refs, kind, text }) => ({ source_refs, kind, text }))
  assert.deepEqual(entry.completeProse, prose, `Complete current ${locale} prose`)
}
const first = read(returned.native.first.retainedSpec.path)
const firstRender = read(returned.native.first.retainedRender.path)
const repair = read(returned.repairs.repair.path)
assert.equal(firstRender.status, 'fail')
assert.equal(firstRender.collisions.length, 1)
assert.equal(firstRender.collisions[0].text, 'Inner surface')
assert.equal(returned.repairs.cumulativeAuthorRepairs, 1)
assert.equal(repair.authorRepairsCumulative, 1)
const expectedRepair = structuredClone(first)
const oldWater = expectedRepair.objects.find(o => o.id === 'water-label')
assert.deepEqual(oldWater.at, [490, 78])
oldWater.at = [490, 62]
assert.deepEqual(expectedRepair, spec, 'Only Water label position changed')

const objects = new Map(spec.objects.map(o => [o.id, o]))
const assertions = new Map(spec.assertions.map(a => [a.id, a]))
assert.equal(objects.size, spec.objects.length)
assert.equal(assertions.size, spec.assertions.length)
const point = value => typeof value === 'string' ? objects.get(value)?.at : value
const close = (a, b, message) => assert.ok(Math.abs(a - b) <= 1e-7, message)
const same = (a, b, message) => {
  assert.ok(Array.isArray(a) && Array.isArray(b), message)
  close(a[0], b[0], message)
  close(a[1], b[1], message)
}
const vector = (a, b) => [b[0] - a[0], b[1] - a[1]]
const length = (a, b) => Math.hypot(...vector(a, b))
const cross = (a, b) => a[0] * b[1] - a[1] * b[0]
for (const a of spec.assertions) {
  if (a.type === 'connects') {
    const edge = objects.get(a.arrow)
    assert.ok(edge && ['arrow', 'segment', 'line'].includes(edge.type), a.id)
    same(point(edge.from), point(a.from), a.id)
    same(point(edge.to), point(a.to), a.id)
  } else if (a.type === 'displacement') {
    same(vector(point(a.from), point(a.to)), [a.dx, a.dy], a.id)
  } else if (a.type === 'pointOnLine') {
    close(cross(vector(point(a.a), point(a.b)),
      vector(point(a.a), point(a.point))), 0, a.id)
  } else if (a.type === 'parallel') {
    close(cross(vector(point(a.a), point(a.b)),
      vector(point(a.c), point(a.d))), 0, a.id)
  } else if (a.type === 'equalDistance') {
    close(length(point(a.a), point(a.b)), length(point(a.c), point(a.d)), a.id)
  } else {
    assert.fail(`Unexamined assertion type: ${a.type}`)
  }
}
const pointRefs = a => Object.entries(a)
  .filter(([key, value]) => !['id', 'type', 'arrow'].includes(key)
    && typeof value === 'string' && objects.get(value)?.type === 'point')
  .map(([, value]) => value)
const groupCoverage = spec.source.inventory.map(group => {
  for (const id of group.objects) assert.ok(objects.has(id), `${group.id}: ${id}`)
  for (const id of group.assertions) assert.ok(assertions.has(id), `${group.id}: ${id}`)
  const points = group.objects.filter(id => objects.get(id).type === 'point')
  if (group.requires?.includes('pointRelationships')) {
    for (const id of points) {
      assert.ok(group.assertions.some(aid => {
        const refs = pointRefs(assertions.get(aid))
        return new Set(refs).size >= 2 && refs.includes(id)
          && refs.every(ref => group.objects.includes(ref))
      }), `Uncovered point ${group.id}/${id}`)
    }
  }
  return { id: group.id, status: 'pass', mappedPoints: points,
    objects: group.objects.length, assertions: group.assertions.length }
})
const edges = spec.objects.filter(o => ['segment', 'arrow', 'line'].includes(o.type))
for (const edge of edges) {
  assert.ok(spec.assertions.some(a => a.type === 'connects' && a.arrow === edge.id),
    `Unasserted edge: ${edge.id}`)
}
for (const [prefix, start, end] of [
  ['incident-wave', 'incident-start', 'outer-entry'],
  ['wave-1', 'outer-entry', 'eye-entry-1'],
  ['wave-2', 'outer-exit', 'eye-entry-2'],
]) {
  const pieces = spec.objects.filter(o => o.id.startsWith(`${prefix}-piece-`))
    .sort((a, b) => Number(a.id.split('-').at(-1)) - Number(b.id.split('-').at(-1)))
  assert.equal(pieces.length, 48)
  same(point(pieces[0].from), point(start), prefix)
  const direction = objects.get(`${prefix}-direction`)
  same(point(pieces.at(-1).to), point(direction.from), `${prefix} arrow continuity`)
  same(point(direction.to), point(end), `${prefix} overall endpoint`)
  for (let i = 1; i < pieces.length; i++) {
    same(point(pieces[i - 1].to), point(pieces[i].from), `${prefix} continuity`)
  }
}
assert.deepEqual(objects.get('wave-2-down').from, 'outer-entry')
assert.deepEqual(objects.get('wave-2-down').to, 'inner-reflection')
assert.deepEqual(objects.get('wave-2-return').from, 'inner-reflection')
assert.deepEqual(objects.get('wave-2-return').to, 'outer-exit')
const entry = point('outer-entry')
const bottom = point('inner-reflection')
const exit = point('outer-exit')
assert.ok(entry[0] < bottom[0] && bottom[0] < exit[0] && bottom[1] < entry[1])
same(vector(point('incident-start'), entry), [128, -192], 'Outer incidence')
same(vector(entry, point('eye-entry-1')), [128, 192], 'Outer reflection')
same(vector(entry, bottom), [32, -80], 'Inner incidence')
same(vector(bottom, exit), [32, 80], 'Inner reflection')
const labels = spec.objects.filter(o => o.type === 'text')
assert.equal(labels.length, 10)
assert.ok(labels.every(o => /^[\x20-\x7e]+$/.test(o.text) && o.fontSize >= 16))
assert.deepEqual(spec.display, {
  purpose: 'instructional', layout: 'scroll', minTextPx: 16, widths: [640],
})
assert.equal(display.status, 'pass')
const [desktop, mobile] = display.observations
for (const o of display.observations) {
  assert.equal(o.mediaWidth, 640)
  assert.equal(o.svgWidth, 640)
  assert.equal(o.mediaHeight, 560)
  assert.equal(o.labels.length, 10)
  assert.ok(o.labels.every(l => l.px >= 16))
  assert.deepEqual(o.labels.map(l => l.text), labels.map(l => l.text))
  close(o.scrollEnd, o.scrollWidth - o.clientWidth, 'Reachable saved scroll end')
}
assert.equal(desktop.clientWidth, 700)
assert.equal(desktop.scrollEnd, 0)
assert.deepEqual(mobile.viewport, { width: 390, height: 844 })
assert.equal(mobile.clientWidth, 331)
assert.equal(mobile.scrollWidth, 640)
assert.equal(mobile.scrollEnd, 309)
const results = {
  schema: 'd806/independent-read-only-checks@1',
  status: 'pass',
  cwd: R,
  checkedBindings: [...checkedBindings.values()],
  reusedNativeValidation: true,
  reusedNativeRender: true,
  reusedSavedActualDisplay: true,
  assertionsIndependentlyEvaluated: spec.assertions.length,
  edgeAssertionsCovered: edges.length,
  sourceInventoryGroupCoverage: groupCoverage,
  fullCurrentProseBound: ['zh', 'en'],
  repair: { authorCumulative: 1, reviewer: 0, onlyWaterPositionChanged: true,
    firstFailurePreserved: true },
  reviewerTechnicalCheckCorrections: 1,
  retainedOwnCheckFailure: `${own}/FIRST-own-check-failure.json`,
  actualDisplay: { mediaWidth: 640, minTextPx: 18,
    mobileContainerWidth: 331, mobileScrollEnd: 309 },
  nativeRerenders: 0,
  browserInvocations: 0,
  note: 'Visual judgment is separately recorded after two image opens. Saved display is an offline headless FigureMedia fixture, not whole-card DISPLAY acceptance.',
}
fs.writeFileSync(`${own}/read-only-checks.json`, `${JSON.stringify(results, null, 2)}\n`,
  { flag: 'wx' })
console.log(JSON.stringify({
  status: results.status, hashBindings: checkedBindings.size,
  assertions: results.assertionsIndependentlyEvaluated,
  edgeAssertions: results.edgeAssertionsCovered,
  inventoryGroups: groupCoverage.length,
  minTextPx: 18, mobileContainerWidth: 331, mobileScrollEnd: 309,
  authorRepairs: 1, reviewerRepairs: 0, nativeRerenders: 0,
}))
