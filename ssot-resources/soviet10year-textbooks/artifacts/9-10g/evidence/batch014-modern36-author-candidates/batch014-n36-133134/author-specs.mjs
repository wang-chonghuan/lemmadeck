import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
assert.equal(process.cwd(), repo)
const batch = path.join(repo, '.tmp/s10y-image/batch014-n36-133134')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const write = (p, value) => fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const template = path.join(repo, '.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s3-n36/lesson.template.json')
const lesson = read(template)
const point = (id, at, visible, position, offset = [0, 0]) => ({
  id, type: 'point', at, label: id, visible, size: 3.5,
  stroke: 'ink', fill: 'ink', strokeWidth: 1,
  fontSize: 32, fontWeight: 500,
  labelPlacement: { position, offset },
})
const segment = (id, from, to) => ({
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth: 3, dash: 0,
})
const connect = edge => ({
  id: `connect-${edge.id}`, type: 'connects',
  arrow: edge.id, from: edge.from, to: edge.to,
})

const definitions = {
  133: {
    description: 'Source-faithful affine spatial projection of rectangle ABCD and the plane normal MA for exercise 335. Preserve the unmarked projected MC/AD crossing; do not add a proof or length-order answer.',
    points: [
      point('M', [164, 465], true, 'N', [0, -14]),
      point('A', [170, 230], true, 'SE', [14, 14]),
      point('B', [70, 75], false, 'SW', [-12, 16]),
      point('C', [410, 90], false, 'S', [0, 18]),
      point('D', [510, 245], false, 'E', [18, 0]),
    ],
    edges: [['AB', 'A', 'B'], ['BC', 'B', 'C'], ['CD', 'C', 'D'], ['DA', 'D', 'A'],
      ['MA', 'M', 'A'], ['MB', 'M', 'B'], ['MC', 'M', 'C'], ['MD', 'M', 'D']],
    assertions: [
      { id: 'parallel-AB-CD', type: 'parallel', a: 'A', b: 'B', c: 'C', d: 'D' },
      { id: 'parallel-BC-AD', type: 'parallel', a: 'B', b: 'C', c: 'A', d: 'D' },
      { id: 'source-MA-direction', type: 'displacement', from: 'M', to: 'A', dx: 6, dy: -235 },
    ],
    world: {
      A: [0, 0, 0], B: [3, 0, 0], C: [3, 4, 0], D: [0, 4, 0], M: [0, 0, 3],
    },
    projection: {
      offset: [170, 230],
      columns: [[-100 / 3, -155 / 3], [85, 15 / 4], [-2, 235 / 3]],
    },
  },
  134: {
    description: 'Source-faithful affine projection of equilateral spatial triangle ABC and perpendicular MN for exercise 336. N stays at the upper endpoint, M at the lower endpoint inside the projected triangle, with an unmarked MN/AC crossing and no solution constructions.',
    points: [
      point('A', [70, 70], false, 'SW', [-12, 16]),
      point('B', [550, 70], false, 'SE', [14, 16]),
      point('C', [400, 300], false, 'N', [0, -16]),
      point('N', [240, 480], true, 'N', [0, -14]),
      point('M', [240, 135], true, 'E', [18, 4]),
    ],
    edges: [['AB', 'A', 'B'], ['BC', 'B', 'C'], ['CA', 'C', 'A'], ['MN', 'M', 'N']],
    assertions: [
      { id: 'source-MN-downward', type: 'displacement', from: 'N', to: 'M', dx: 0, dy: -345 },
      { id: 'source-base-horizontal', type: 'displacement', from: 'A', to: 'B', dx: 480, dy: 0 },
    ],
    world: {
      A: [0, 0, 0], B: [1, 0, 0], C: [0.5, Math.sqrt(3) / 2, 0],
      N: [(170 - 90 * 410 / 230) / 480, 410 / (230 / (Math.sqrt(3) / 2)), 0],
      M: [(170 - 90 * 410 / 230) / 480, 410 / (230 / (Math.sqrt(3) / 2)), 1],
    },
    projection: {
      offset: [70, 70],
      columns: [[480, 0], [90 / (Math.sqrt(3) / 2), 230 / (Math.sqrt(3) / 2)], [0, -345]],
    },
  },
}

for (const id of [133, 134]) {
  const dir = path.join(batch, `fig-${id}`)
  const context = read(path.join(dir, 'context.json'))
  const observation = read(path.join(dir, 'source-inventory.json'))
  const def = definitions[id]
  assert.equal(observation.source.sha256, context.sourceImage.sha256)
  const edges = def.edges.map(args => segment(...args))
  const assertions = [...edges.map(connect), ...def.assertions]
  const spec = {
    schema: 'ld-s10y-image/figure-spec@2', id: `fig-${id}`, mode: 'deterministic',
    description: def.description,
    source: {
      image: { path: context.sourceImage.path, sha256: context.sourceImage.sha256 },
      authoritativeText: [
        ...lesson.prose.filter(p => p.kind === 'p' && p.text).map(p => ({ lesson: lesson.id, text: p.text })),
        ...context.lessons.flatMap(l => l.exercises.map(e => ({ lesson: l.lesson, exercise: e.exercise, text: e.text }))),
      ],
      inventory: [{
        id: observation.mappedRequirements[0].id,
        description: observation.sourceFacts.join(' ') + ' Modern regularization: ' +
          observation.justifiedModernRegularization.join(' ') +
          ' Spatial metric claims are checked by sibling spatial-model.json and spatial-check.mjs; 2D assertions check affine incidence, endpoint attachment and directions only.',
        objects: [...def.points, ...edges].map(o => o.id),
        assertions: assertions.map(a => a.id),
        requires: ['pointRelationships'],
      }],
    },
    canvas: {
      width: 640, height: 560, boundingBox: [0, 560, 640, 0],
      background: 'paper', keepAspectRatio: true,
    },
    display: {
      layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640],
    },
    objects: [...def.points, ...edges],
    assertions,
    layout: { minLabelGap: 6 },
  }
  write(path.join(dir, 'spec.json'), spec)
  write(path.join(dir, 'spatial-model.json'), {
    schema: 'ld-s10y-image/affine-spatial-model@1',
    figure: spec.id,
    provenance: {
      inventory: { path: path.join(dir, 'source-inventory.json'), sha256: hash(path.join(dir, 'source-inventory.json')) },
      context: { path: path.join(dir, 'context.json'), sha256: hash(path.join(dir, 'context.json')) },
      spec: { path: path.join(dir, 'spec.json'), sha256: hash(path.join(dir, 'spec.json')) },
    },
    metricAuthority: 'Written spatial givens. Source pixel lengths and angles are not metric authority.',
    coordinateStatus: 'Private illustrative coordinates proving a spatial realization; not supplied textbook dimensions, numerical answers or visible annotations.',
    plane: { origin: 'A', basis: ['B', id === 133 ? 'D' : 'C'] },
    normal: id === 133 ? { foot: 'A', tip: 'M' } : { foot: 'N', tip: 'M' },
    points: def.world, projection: def.projection,
    projectedCrossing: id === 133 ? { first: ['M', 'C'], second: ['A', 'D'] } : { first: ['M', 'N'], second: ['A', 'C'] },
  })
  console.log(`AUTHORED: fig-${id} ${def.points.length} points, ${edges.length} solid segments, ${assertions.length} affine assertions`)
}
