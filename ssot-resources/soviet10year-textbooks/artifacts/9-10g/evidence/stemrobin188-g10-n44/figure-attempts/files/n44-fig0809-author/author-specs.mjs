import fs from 'node:fs'
import path from 'node:path'
import { owned, write } from './audit.mjs'

const lesson = JSON.parse(fs.readFileSync(path.join(owned,
  'context-root/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/lesson.json')))
const at = ([x, y]) => [x, 560 - y]
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)

function author(id, screen) {
  const provenance = JSON.parse(fs.readFileSync(path.join(owned, id, 'source-inventory.json')))
  const objects = []
  const assertions = []
  const point = (name, value, label, position, gap, visible = true) => {
    objects.push({ id: name, type: 'point', at: at(value), visible,
      ...(label ? { label, fontSize: 28, fontWeight: 400, labelPlacement: { position, gap } } : {}),
      size: 3.5, strokeWidth: 1.5, stroke: 'ink', fill: 'ink' })
  }
  const connect = (name, type, from, to, width = 3, dash = 0, assertionId = `${name}-connects`) => {
    const resolve = value => typeof value === 'string' ? value : at(value)
    objects.push({ id: name, type, from: resolve(from), to: resolve(to),
      stroke: 'ink', strokeWidth: width, dash })
    assertions.push({ id: assertionId, type: 'connects', arrow: name, from: resolve(from), to: resolve(to) })
  }
  const parallel = (name, a, b, c, d) => {
    const resolve = value => typeof value === 'string' ? value : at(value)
    assertions.push({ id: name, type: 'parallel', a: resolve(a), b: resolve(b), c: resolve(c), d: resolve(d) })
  }
  const onLine = (name, p, a, b) => {
    const resolve = value => typeof value === 'string' ? value : at(value)
    assertions.push({ id: name, type: 'pointOnLine', point: p, a: resolve(a), b: resolve(b) })
  }
  point('O', screen.O, 'O', id.endsWith('08') ? 'NW' : 'SE', id.endsWith('08') ? 18 : 23)
  point('A', screen.A, 'A', id.endsWith('08') ? 'S' : 'E', id.endsWith('08') ? 30 : 18)
  point('B', screen.B, 'B', 'NE', 18)
  if (screen.M) point('M', screen.M, 'M', 'NE', 18)

  for (const axis of ['x', 'y', 'z']) {
    connect(`axis-${axis}-positive`, 'segment', 'O', screen[axis], 3)
  }
  onLine('O-on-x', 'O', screen.O, screen.x)
  for (const [basis, axis] of [['i', 'x'], ['j', 'y'], ['k', 'z']]) {
    connect(`basis-${basis}`, 'arrow', 'O', screen[basis], 4.5)
    parallel(`basis-${basis}-aligned`, 'O', screen[basis], 'O', screen[axis])
    point(`label-${basis}`, mix(screen.O, screen[basis], basis === 'k' ? 0.85 : 0.8),
      `${basis}\u20d7`, basis === 'j' ? 'S' : 'W', basis === 'j' ? 31 : 26, false)
    onLine(`label-${basis}-on-basis`, `label-${basis}`, 'O', screen[basis])
  }
  if (id.endsWith('08')) {
    onLine('A-on-x', 'A', 'O', screen.x)
    connect('construction-AB', 'segment', 'A', 'B', 3, 2)
    parallel('AB-along-y', 'A', 'B', 'O', screen.y)
    parallel('BM-along-z', 'B', 'M', 'O', screen.z)
    const portions = [
      [screen.B, [screen.B[0], 432]], [[screen.B[0], 420], [screen.B[0], 306]],
      [[screen.B[0], 299], [screen.B[0], 196]], [[screen.B[0], 185], screen.M]
    ]
    portions.forEach(([from, to], index) => {
      connect(`construction-BM-${index + 1}`, 'segment', from, to, 3)
      parallel(`construction-BM-${index + 1}-aligned`, from, to, 'B', 'M')
    })
    const lowerEnd = mix(screen.O, screen.M, 0.57)
    const upperStart = mix(screen.O, screen.M, 0.60)
    connect('resultant-OM-lower', 'segment', 'O', lowerEnd, 4)
    connect('resultant-OM-upper', 'arrow', upperStart, 'M', 4, 0, 'OM-upper-connects')
    parallel('OM-lower-aligned', 'O', lowerEnd, 'O', 'M')
    parallel('OM-upper-aligned', upperStart, 'M', 'O', 'M')
    point('label-x', mix(screen.O, screen.A, 0.76), 'x', 'W', 25, false)
    point('label-y', mix(screen.A, screen.B, 0.5), 'y', 'S', 31, false)
    point('label-z', mix(screen.B, screen.M, 0.61), 'z', 'E', 23, false)
    onLine('label-x-on-carrier', 'label-x', 'O', 'A')
    onLine('label-y-on-carrier', 'label-y', 'A', 'B')
    onLine('label-z-on-carrier', 'label-z', 'B', 'M')
    assertions.push({ id: 'named-source-points', type: 'objectCount', objectType: 'point', count: 10 })
  } else {
    for (const axis of ['x', 'y', 'z']) {
      connect(`axis-${axis}-negative`, 'segment', 'O', screen[`negative-${axis}`], 3, 2)
      parallel(`axis-${axis}-negative-aligned`, 'O', screen[`negative-${axis}`], 'O', screen[axis])
    }
    for (const [vector, from, to] of [['OA', 'O', 'A'], ['OB', 'O', 'B'], ['AB', 'A', 'B']]) {
      connect(`vector-${vector}`, 'arrow', from, to, 4.5, 0, `${vector}-connects`)
    }
    connect('projection-detached', 'segment', [381, 271], [404, 248], 3, 2)
    parallel('projection-detached-aligned', [381, 271], [404, 248], 'O', screen.x)
    point('label-x', mix(screen.O, screen.x, 0.83), 'x', 'SE', 18, false)
    point('label-y', mix(screen.O, screen.y, 0.94), 'y', 'S', 30, false)
    point('label-z', mix(screen.O, screen.z, 0.97), 'z', 'W', 24, false)
    for (const axis of ['x', 'y', 'z']) onLine(`label-${axis}-on-carrier`, `label-${axis}`, 'O', screen[axis])
  }
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id, mode: 'deterministic',
    description: id.endsWith('08')
      ? 'Schematic O-A-B-M polygonal vector construction with resultant OM; preserve visible source rays, dashed AB and interrupted BM/OM. No numeric or metric 3D claim.'
      : 'Schematic directed OA, OB and AB in a shared coordinate frame with only the printed dashed negative continuations and detached projection fragment. No numeric or metric 3D claim.',
    source: {
      image: provenance.source,
      authoritativeText: lesson.prose.filter(block => block.kind === 'p').map(block => ({ lesson: lesson.id, text: block.text })),
      inventory: provenance.inventory
    },
    canvas: { width: 480, height: 560, boundingBox: [0, 560, 480, 0], background: 'paper', keepAspectRatio: true },
    display: { layout: 'inline', purpose: 'instructional', maxWidthPx: 480, minTextPx: 16, widths: [480, 300] },
    layout: { minLabelGap: 4 }, objects, assertions
  }
  write(path.join(owned, id, 'first/spec.json'), spec)
}
author('fig-g10-08', {
  O: [173, 363], A: [65, 475], B: [313, 475], M: [313, 94],
  x: [26, 363 + 147 * 112 / 108], y: [453, 363], z: [173, 26],
  i: [113, 363 + 60 * 112 / 108], j: [366, 363], k: [173, 177]
})
author('fig-g10-09', {
  O: [182, 374], A: [398, 206], B: [277, 70],
  x: [43, 513], y: [455, 374], z: [182, 26],
  i: [138, 418], j: [356, 374], k: [182, 229],
  'negative-x': [307, 249], 'negative-y': [20, 374], 'negative-z': [182, 536]
})
