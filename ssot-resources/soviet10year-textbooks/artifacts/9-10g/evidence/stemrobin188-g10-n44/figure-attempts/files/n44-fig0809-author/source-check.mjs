import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { owned, sha, write } from './audit.mjs'

const stage = process.argv[2]
const results = []
for (const number of ['08', '09']) {
  const id = `fig-g10-${number}`
  const spec = JSON.parse(fs.readFileSync(path.join(owned, id, stage, 'spec.json')))
  const checks = []
  const check = (name, fn) => {
    try { fn(); checks.push({ id: name, status: 'pass' }) }
    catch (error) { checks.push({ id: name, status: 'fail', message: error.message }) }
  }
  const objects = new Map(spec.objects.map(object => [object.id, object]))
  const assertions = new Map(spec.assertions.map(a => [a.id, a]))
  const p = name => objects.get(name).at
  const vector = (a, b) => b.map((v, i) => v - a[i])
  const sameDirection = (a, b) => a[0] * b[0] + a[1] * b[1] > 0
  check('durable-original-hash', () => assert.equal(sha(spec.source.image.path), spec.source.image.sha256))
  check('all-inventory-maps', () => {
    for (const group of spec.source.inventory) {
      for (const name of group.objects) assert.ok(objects.has(name), `${group.id}: ${name}`)
      for (const name of group.assertions) assert.ok(assertions.has(name), `${group.id}: ${name}`)
    }
  })
  check('every-source-point-and-label', () => {
    const expected = number === '08' ? ['O', 'A', 'B', 'M'] : ['O', 'A', 'B']
    assert.deepEqual(spec.objects.filter(o => o.type === 'point' && o.visible !== false).map(o => o.id), expected)
    for (const name of expected) {
      assert.equal(objects.get(name).label, name)
      assert.ok(spec.source.inventory.some(group => group.objects.includes(name) &&
        (group.description.includes(`label ${name}`) || group.description.includes(`${name} label`))))
      assert.ok(spec.assertions.some(a => [a.point, a.from, a.to, a.a, a.b, a.c, a.d].includes(name)))
    }
    const expectedLabels = expected.concat(['i\u20d7', 'j\u20d7', 'k\u20d7', 'x', 'y', 'z']).sort()
    const labelled = spec.objects.filter(o => o.label)
    assert.deepEqual(labelled.map(o => o.label).sort(), expectedLabels)
    for (const o of labelled) {
      assert.equal(o.fontSize, 28)
      assert.ok(o.fontSize * 300 / 480 >= 16)
      assert.doesNotMatch(o.label, /[0-9\u0400-\u04ff\u4e00-\u9fff]/)
    }
  })
  check('all-directed-edges-have-executable-connects', () => {
    for (const edge of spec.objects.filter(o => ['segment', 'arrow'].includes(o.type))) {
      const connects = spec.assertions.find(a => a.type === 'connects' && a.arrow === edge.id)
      assert.ok(connects, edge.id)
      assert.deepEqual(connects.from, edge.from)
      assert.deepEqual(connects.to, edge.to)
    }
  })
  check('source-axis-basis-directions', () => {
    for (const [basis, axis] of [['i', 'x'], ['j', 'y'], ['k', 'z']]) {
      const arrow = objects.get(`basis-${basis}`)
      const ray = objects.get(`axis-${axis}-positive`)
      assert.equal(arrow.type, 'arrow')
      assert.equal(arrow.from, 'O')
      assert.ok(sameDirection(vector(p('O'), arrow.to), vector(p('O'), ray.to)))
    }
  })
  check('only-source-dashed-objects-long-dash', () => {
    const expected = number === '08' ? ['construction-AB'] :
      ['axis-x-negative', 'axis-y-negative', 'axis-z-negative', 'projection-detached']
    assert.deepEqual(spec.objects.filter(o => o.dash > 0).map(o => o.id).sort(), expected.sort())
    for (const name of expected) assert.equal(objects.get(name).dash, 3, `${name}: needs visible source-like dashes at 300px`)
  })
  check('no-3d-metric-or-answer-claims', () => {
    assert.ok(spec.assertions.every(a => !['distance', 'equalDistance', 'perpendicular', 'displacement'].includes(a.type)))
    assert.ok(spec.objects.every(o => ['point', 'segment', 'arrow'].includes(o.type)))
    assert.equal(spec.display.layout, 'inline')
    assert.equal(spec.display.maxWidthPx, 480)
    assert.deepEqual(spec.display.widths, [480, 300])
  })
  if (number === '08') {
    check('polygonal-legs-and-resultant-direction', () => {
      assert.ok(p('A')[0] < p('O')[0] && p('A')[1] < p('O')[1])
      assert.ok(p('B')[0] > p('A')[0] && p('B')[1] === p('A')[1])
      assert.ok(p('M')[0] === p('B')[0] && p('M')[1] > p('B')[1])
      for (const [from, to, basis] of [['O', 'A', 'i'], ['A', 'B', 'j'], ['B', 'M', 'k']])
        assert.ok(sameDirection(vector(p(from), p(to)), vector(p('O'), objects.get(`basis-${basis}`).to)))
      const sum = ['O', 'A', 'B'].map((from, index) => vector(p(from), p(['A', 'B', 'M'][index])))
        .reduce((a, b) => a.map((v, index) => v + b[index]), [0, 0])
      assert.deepEqual(sum, vector(p('O'), p('M')))
      assert.equal(objects.get('resultant-OM-upper').type, 'arrow')
      assert.equal(objects.get('resultant-OM-upper').to, 'M')
      assert.ok(spec.objects.filter(o => o.type === 'arrow').length === 4)
    })
    check('BM-and-OM-interruptions-retained', () => {
      const pieces = [1, 2, 3, 4].map(n => objects.get(`construction-BM-${n}`))
      assert.equal(pieces[0].from[1], p('B')[1])
      assert.deepEqual(pieces[3].to, p('M'))
      for (let i = 0; i < 3; i++) assert.ok(pieces[i].to[1] < pieces[i + 1].from[1])
      const lower = objects.get('resultant-OM-lower')
      const upper = objects.get('resultant-OM-upper')
      assert.ok(lower.to[1] < upper.from[1])
      assert.equal(lower.from, 'O')
    })
  } else {
    check('OA-OB-AB-source-directions', () => {
      for (const name of ['OA', 'OB', 'AB']) {
        const o = objects.get(`vector-${name}`)
        assert.equal(o.type, 'arrow')
        assert.equal(o.from, name[0])
        assert.equal(o.to, name[1])
      }
      assert.ok(p('B')[0] < p('A')[0] && p('B')[1] > p('A')[1])
      assert.ok(p('A')[0] > p('O')[0] && p('A')[1] > p('O')[1])
      assert.equal(spec.objects.filter(o => o.type === 'arrow').length, 6)
    })
    check('negative-continuations-opposite-positive-rays', () => {
      for (const axis of ['x', 'y', 'z']) {
        const negative = objects.get(`axis-${axis}-negative`)
        const positive = objects.get(`axis-${axis}-positive`)
        assert.ok(!sameDirection(vector(p('O'), negative.to), vector(p('O'), positive.to)))
      }
    })
    check('detached-projection-not-completed', () => {
      const fragment = objects.get('projection-detached')
      assert.deepEqual(fragment.from, [381, 289])
      assert.deepEqual(fragment.to, [404, 312])
      assert.notDeepEqual(fragment.from, p('A'))
      assert.notDeepEqual(fragment.to, p('A'))
      assert.equal(spec.objects.filter(o => o.id.includes('projection')).length, 1)
    })
  }
  results.push({ figure: id, specSha256: sha(path.join(owned, id, stage, 'spec.json')), checks,
    status: checks.some(c => c.status === 'fail') ? 'fail' : 'pass' })
}
write(path.join(owned, `${stage}-source-checks.json`), { stage, authorOnly: true, results })
console.log(JSON.stringify(results, null, 2))
process.exitCode = results.some(r => r.status === 'fail') ? 2 : 0
