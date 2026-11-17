import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const base = path.join(root, '.tmp/s10y-image/9-10g')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const specs = [62,63,64,65].map(number => JSON.parse(fs.readFileSync(path.join(base,`fig-${number}/fig-${number}.spec.json`))))
const coord = (spec, ref) => Array.isArray(ref) ? ref : spec.objects.find(object => object.id === ref).at
const object = (spec, id) => spec.objects.find(item => item.id === id)
const sub = (a,b) => [a[0]-b[0],a[1]-b[1]]
const cross = (a,b) => a[0]*b[1]-a[1]*b[0]
const dot = (a,b) => a[0]*b[0]+a[1]*b[1]
const vector = (spec,id) => {
  const ray = object(spec,id)
  return sub(coord(spec,ray.to),coord(spec,ray.from))
}
const results = []
function check(name, fn) {
  fn()
  results.push({ name, result: 'verified' })
}
for (const spec of specs) {
  check(`${spec.id}: source hash / no opaque geometry / all solid traces`, () => {
    assert.equal(hash(spec.source.image.path),spec.source.image.sha256)
    assert(spec.objects.every(item => item.type !== 'svgPath'))
    assert(spec.objects.every(item => !('dash' in item) || item.dash === 0))
  })
  check(`${spec.id}: approved template binding unchanged`, () => {
    const binding = JSON.parse(fs.readFileSync(path.join(base,spec.id,'context-binding.json')))
    for (const item of binding.templates) assert.equal(hash(item.path),item.sha256)
  })
  for (const symmetry of spec.assertions.filter(item => item.type === 'centralSymmetry')) {
    check(`${spec.id}: ${symmetry.id} / every declared opposite-pair midpoint`, () => {
      const center = coord(spec,symmetry.center)
      assert(symmetry.pairs.length >= 2)
      for (const pair of symmetry.pairs) {
        const a = coord(spec,pair.a), b = coord(spec,pair.b)
        assert(Math.hypot((a[0]+b[0])/2-center[0],(a[1]+b[1])/2-center[1]) < 1e-7)
      }
    })
  }
}
const f62 = specs[0], f63 = specs[1], f64 = specs[2], f65 = specs[3]
for (const row of ['a','b']) {
  check(`fig62 ${row}: oriented ray and signed half-plane membership`, () => {
    const origin1 = coord(f62,`${row}-O1`), origin2 = coord(f62,`${row}-O2`)
    const boundary = sub(origin2,origin1)
    const first = cross(boundary,sub(coord(f62,`${row}-A1`),origin1))
    const second = cross(boundary,sub(coord(f62,`${row}-A2`),origin1))
    assert(Math.abs(first) > 1 && Math.abs(second) > 1)
    assert.equal(Math.sign(first*second),row === 'a' ? 1 : -1)
    const v1 = vector(f62,`${row}-h1`), v2 = vector(f62,`${row}-h2`)
    assert(Math.abs(cross(v1,v2)) < 1e-7)
    assert.equal(Math.sign(dot(v1,v2)),row === 'a' ? 1 : -1)
  })
}
for (const [row,expected] of [['a','unbounded'],['b','empty'],['c','positive finite'],['d','singleton']]) {
  check(`fig63 ${row}: source intersection branch ${expected}`, () => {
    const r1 = object(f63,`${row}-h1`), r2 = object(f63,`${row}-h2`)
    const a = coord(f63,r1.from)[0], b = coord(f63,r2.from)[0]
    const d1 = Math.sign(vector(f63,r1.id)[0]), d2 = Math.sign(vector(f63,r2.id)[0])
    const lower = Math.max(d1 > 0 ? a : -Infinity,d2 > 0 ? b : -Infinity)
    const upper = Math.min(d1 < 0 ? a : Infinity,d2 < 0 ? b : Infinity)
    const actual = lower > upper ? 'empty' : lower === upper ? 'singleton' :
      Number.isFinite(lower) && Number.isFinite(upper) ? 'positive finite' : 'unbounded'
    assert.equal(actual,expected)
    assert.equal(Math.sign(dot(vector(f63,r1.id),vector(f63,r2.id))),row === 'a' ? 1 : -1)
    if (row !== 'a') {
      const symmetry = f63.assertions.find(item => item.id === `${row}-opposite-midpoints`)
      assert.deepEqual(coord(f63,symmetry.pairs[0].a),coord(f63,r1.from))
      assert.deepEqual(coord(f63,symmetry.pairs[0].b),coord(f63,r2.from))
      assert.deepEqual(coord(f63,symmetry.pairs[1].a),coord(f63,r1.to))
      assert.deepEqual(coord(f63,symmetry.pairs[1].b),coord(f63,r2.to))
    }
  })
}
check('fig64: AB/m1 same direction; AB/m2 opposite; complete reflected ray tips', () => {
  assert(dot(vector(f64,'AB'),vector(f64,'m1')) > 0)
  assert(dot(vector(f64,'AB'),vector(f64,'m2')) < 0)
  const symmetry = f64.assertions.find(item => item.id === 'm-opposite-midpoints')
  const m = coord(f64,'M')
  const end1 = coord(f64,object(f64,'m1').to), end2 = coord(f64,object(f64,'m2').to)
  assert(symmetry.pairs.some(pair =>
    coord(f64,pair.a).every((value,i) => value === end1[i]) &&
    coord(f64,pair.b).every((value,i) => value === end2[i])))
  assert(Math.hypot((end1[0]+end2[0])/2-m[0],(end1[1]+end2[1])/2-m[1]) < 1e-7)
})
check('fig65: every pair co-directed; distinct source origins; no invented spatial metric assertions', () => {
  for (const [a,b] of [['h1','h2'],['h2','h3'],['h1','h3']]) {
    assert.equal(cross(vector(f65,a),vector(f65,b)),0)
    assert(dot(vector(f65,a),vector(f65,b)) > 0)
    assert.notDeepEqual(coord(f65,`${a}-origin`),coord(f65,`${b}-origin`))
  }
  assert(f65.assertions.every(item => !['perpendicular','distance','equalDistance','centralSymmetry'].includes(item.type)))
})
check('task167: figure-neutral provenance; existing source case set covers position branches without adding a solution', () => {
  const binding = JSON.parse(fs.readFileSync(path.join(base,'fig-65/context-binding.json')))
  const exercisesPath = binding.templates.find(item => item.path.endsWith('exercises.template.json')).path
  const task = JSON.parse(fs.readFileSync(exercisesPath)).exercises.find(item => item.number === '167')
  assert.deepEqual(task.figure_refs,[])
  assert.deepEqual(task.figures,[])
  assert(f62.source.inventory.some(item => item.id === 'source-b'))
  assert(['b','c','d'].every(row => f63.source.inventory.some(item => item.id === `source-${row}`)))
  assert(!f65.objects.some(item => typeof item.label === 'string' && ['A','B','C','D','M','N'].includes(item.label)))
})
const output = path.join(base,'fig-62/n16-relations.json')
fs.writeFileSync(output,`${JSON.stringify({
  purpose: 'Author-side executable source and construction checks, not independent review or task answers.',
  specs: specs.map(spec => ({ path: path.join(base,spec.id,`${spec.id}.spec.json`), sha256: hash(path.join(base,spec.id,`${spec.id}.spec.json`)) })),
  checks: results, independentReview: 'pending',
},null,2)}\n`)
console.log(`Verified ${results.length} author-side checks; wrote ${output}. No independent approval.`)
